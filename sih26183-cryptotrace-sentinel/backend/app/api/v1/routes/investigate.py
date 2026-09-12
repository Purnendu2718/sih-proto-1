import time
from fastapi import APIRouter
from app.schemas import AutoInvestigateRequest, AutoInvestigateResponse
from app.services.address_detector import detect_input, ChainType
from app.services.blockchain import tron_client, evm_client, btc_client
from app.services.blockchain.resilient_fetch import BlockchainFetchError
from app.services.sweep_attribution import detect_and_persist_sweep_attribution
from app.services.attribution_store import lookup_attribution
from core.c_bridge import BlockchainTracerCore, TxEdgeInput

router = APIRouter()
CHAIN_MAP = {"TRON": 0, "EVM": 1, "BTC": 2}


@router.post("/auto", response_model=AutoInvestigateResponse)
def auto_investigate(req: AutoInvestigateRequest):
    """The Golden-Hour hero flow: one call, victim address in, exchange
    attribution message out — no manual node-by-node graph building
    required before an answer exists."""
    t_start = time.perf_counter()

    detected_chain, _ = detect_input(req.victim_address)
    chain = ChainType(req.chain_hint) if req.chain_hint else detected_chain

    try:
        if chain == ChainType.TRON:
            transfers = tron_client.get_trc20_transfers(req.victim_address, case_id=req.case_id) + \
                        tron_client.get_native_transactions(req.victim_address, case_id=req.case_id)
        elif chain == ChainType.EVM:
            transfers = evm_client.get_erc20_transfers(req.victim_address, req.network, case_id=req.case_id) + \
                        evm_client.get_native_transactions(req.victim_address, req.network, case_id=req.case_id)
        elif chain == ChainType.BTC:
            transfers = btc_client.get_address_transfers(req.victim_address, case_id=req.case_id)
        else:
            transfers = []
    except BlockchainFetchError:
        transfers = []

    # If live fetch yielded no transfers, check sample cases (offline/mock support)
    scenario = None
    if not transfers:
        try:
            from app.services.tracer_service import _load_mock_edges
            scenario = _load_mock_edges(req.victim_address)
            transfers = [
                {"from": e["from"], "to": e["to"], "amount": e["amount"], "timestamp_utc": e["ts"],
                 "tx_hash": e["tx"], "token_symbol": e.get("token_symbol", e.get("token", "USDT")),
                 "chain": e.get("chain", chain.value)}
                for e in scenario.get("edges", [])
            ]
        except Exception:
            pass

    from app.services.cross_chain_engine import CrossChainResolver
    transfers = CrossChainResolver.stitch_cross_chain_trace(transfers)

    raw_edges = [{"from": t["from"], "to": t["to"], "amount": t["amount"], "ts": t["timestamp_utc"], "tx": t["tx_hash"], "chain": t.get("chain", chain.value)} for t in transfers]
    sweep_attrs = detect_and_persist_sweep_attribution(raw_edges, chain=chain.value)

    extra_exchange_candidates = []
    if scenario:
        if scenario.get("target_deposit_wallet"):
            extra_exchange_candidates.append(scenario["target_deposit_wallet"])
        if scenario.get("terminal_hot_wallet"):
            extra_exchange_candidates.append(scenario["terminal_hot_wallet"])

    exchange_addrs = list({addr for addr in sweep_attrs} | {
        addr for addr in {t["to"] for t in transfers}
        if (a := lookup_attribution(addr)) and a.get("exchange_name")
    } | set(extra_exchange_candidates)) or ["__NO_EXCHANGE_CANDIDATE__"]

    chain_map_local = {"TRON": 0, "EVM": 1, "BTC": 2, "ETH": 1, "BSC": 3, "POLYGON": 4, "ARBITRUM": 5}
    tx_edges = [
        TxEdgeInput(from_addr=t["from"], to_addr=t["to"], amount=t["amount"],
                    timestamp_utc=t["timestamp_utc"], tx_hash=t["tx_hash"],
                    chain_id=chain_map_local.get((t.get("chain") or chain.value).upper(), 0))
        for t in transfers
    ]

    trace_result = {"reached_exchange": False, "hops": []}
    if tx_edges:
        core = BlockchainTracerCore(tx_edges)
        trace_result = core.trace_to_exchange(
            start_addr=req.victim_address, exchange_addrs=exchange_addrs,
            max_hops=req.max_hops, max_time_window_seconds=req.max_time_window_seconds,
        )

    hop_addrs = {h["address"] for h in trace_result["hops"]}
    bridge_hops = [h for h in trace_result["hops"] if CrossChainResolver.is_bridge_contract(h["address"])]

    message = None
    for addr, info in sweep_attrs.items():
        if addr in hop_addrs or addr == req.victim_address:
            message = info["message"]
            break
    if message is None and sweep_attrs:
        message = next(iter(sweep_attrs.values()))["message"]
    if message is None and trace_result["reached_exchange"]:
        for h in reversed(trace_result["hops"]):
            attrib = lookup_attribution(h["address"])
            if attrib and attrib.get("exchange_name"):
                b_note = ""
                if bridge_hops:
                    b_info = CrossChainResolver.get_bridge_info(bridge_hops[0]["address"])
                    b_name = b_info["name"] if b_info else "Bridge"
                    b_note = f" via Cross-Chain {b_name}"
                message = f"Attributed to: {attrib['exchange_name']}{b_note} via {attrib.get('entity_label', 'Exchange Cluster')} (Tx: {h['tx_hash']})"
                break
    if message is None and trace_result["reached_exchange"] and scenario and scenario.get("destination_vasp"):
        b_note = ""
        if bridge_hops:
            b_info = CrossChainResolver.get_bridge_info(bridge_hops[0]["address"])
            b_name = b_info["name"] if b_info else "Bridge"
            b_note = f" via Cross-Chain {b_name}"
        message = f"Attributed to: {scenario['destination_vasp']}{b_note} (Terminal Off-Ramp)"

    elapsed_ms = (time.perf_counter() - t_start) * 1000
    return AutoInvestigateResponse(
        detected_chain=chain.value, reached_exchange=trace_result["reached_exchange"],
        exchange_attribution_message=message, hop_count=len(trace_result["hops"]),
        trace_time_ms=round(elapsed_ms, 3), golden_hour_seconds_elapsed=round(elapsed_ms / 1000, 3),
    )
