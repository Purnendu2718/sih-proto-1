import time
import uuid
import json
from pathlib import Path

from app.schemas import TraceStartRequest, TraceStartResponse, Graph, GraphEdge
from core.c_bridge import BlockchainTracerCore, TxEdgeInput
from app.services.graph_node_builder import build_graph_node
from app.services.sweep_attribution import detect_and_persist_sweep_attribution
from app.services.blockchain import tron_client, evm_client, btc_client
from app.services.blockchain.resilient_fetch import BlockchainFetchError
from app.services.price_service import get_usd_price

SAMPLE_CASES_DIR = Path(__file__).resolve().parents[3] / "sample_cases"
TRACE_STORE = {}
from app.services.cross_chain_engine import CrossChainResolver

SAMPLE_CASES_DIR = Path(__file__).resolve().parents[3] / "sample_cases"
TRACE_STORE = {}
CHAIN_MAP = {"TRON": 0, "EVM": 1, "BTC": 2, "ETH": 1, "BSC": 3, "POLYGON": 4, "ARBITRUM": 5}


def _load_mock_edges(start_address: str) -> dict:
    for path in SAMPLE_CASES_DIR.glob("*.json"):
        with open(path) as f:
            scenario = json.load(f)
        if scenario.get("victim_address") == start_address:
            return scenario
    raise FileNotFoundError(f"No mock scenario found for {start_address}")


def _fetch_live_edges(chain: str, address: str, network: str, case_id: str) -> list:
    try:
        if chain == "TRON":
            return tron_client.get_trc20_transfers(address, case_id=case_id) + \
                   tron_client.get_native_transactions(address, case_id=case_id)
        if chain == "EVM":
            return evm_client.get_erc20_transfers(address, network, case_id=case_id) + \
                   evm_client.get_native_transactions(address, network, case_id=case_id)
        if chain == "BTC":
            return btc_client.get_address_transfers(address, case_id=case_id)
    except BlockchainFetchError:
        return []
    return []


def run_trace(req: TraceStartRequest) -> TraceStartResponse:
    scenario = None
    if req.data_mode == "mock":
        scenario = _load_mock_edges(req.start_address)
        raw_edges = [
            {"from": e["from"], "to": e["to"], "amount": e["amount"], "ts": e["ts"],
             "tx": e["tx"], "token_symbol": e.get("token_symbol", e.get("token", "USDT")),
             "chain": e.get("chain", req.chain)}
            for e in scenario.get("edges", [])
        ]
        known_exchange_addrs = list(scenario.get("known_exchange_hot_wallets", [])) + \
                               list(scenario.get("known_exchange_deposit_addresses", []))
        if scenario.get("target_deposit_wallet"):
            known_exchange_addrs.append(scenario["target_deposit_wallet"])
        if scenario.get("terminal_hot_wallet"):
            known_exchange_addrs.append(scenario["terminal_hot_wallet"])
    else:
        live_edges = _fetch_live_edges(req.chain, req.start_address, req.network, req.case_id)
        raw_edges = [
            {"from": e["from"], "to": e["to"], "amount": e["amount"], "ts": e["timestamp_utc"],
             "tx": e["tx_hash"], "token_symbol": e.get("token_symbol", "TOKEN"),
             "chain": e.get("chain", req.chain)}
            for e in live_edges
        ]
        known_exchange_addrs = []

    # 1. Seamlessly stitch cross-chain bridge and DEX hops into the edge list
    raw_edges = CrossChainResolver.stitch_cross_chain_trace(raw_edges)

    sweep_attrs = detect_and_persist_sweep_attribution(raw_edges, chain=req.chain)
    exchange_addrs = list(set(known_exchange_addrs) | set(sweep_attrs.keys())) or ["__NO_EXCHANGE_CANDIDATE__"]

    tx_edges = [
        TxEdgeInput(
            from_addr=e["from"],
            to_addr=e["to"],
            amount=e["amount"],
            timestamp_utc=e["ts"],
            tx_hash=e["tx"],
            chain_id=CHAIN_MAP.get((e.get("chain") or req.chain).upper(), 1)
        )
        for e in raw_edges
    ]

    t0 = time.perf_counter()
    trace_result = {"reached_exchange": False, "hops": [], "terminal_amount": 0.0}
    if tx_edges:
        core = BlockchainTracerCore(tx_edges)
        trace_result = core.trace_to_exchange(
            start_addr=req.start_address, exchange_addrs=exchange_addrs,
            max_hops=req.max_hops, max_time_window_seconds=req.max_time_window_seconds,
            min_amount_threshold=req.min_amount_threshold,
        )
    elapsed_ms = (time.perf_counter() - t0) * 1000

    hop_addrs = {h["address"] for h in trace_result["hops"]}
    bridge_hops = [h for h in trace_result["hops"] if CrossChainResolver.is_bridge_contract(h["address"])]

    message = None
    for addr, info in sweep_attrs.items():
        if addr in hop_addrs or addr == req.start_address:
            message = info["message"]
            break

    if message is None and trace_result["reached_exchange"]:
        from app.services.attribution_store import lookup_attribution
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

    all_addrs = {req.start_address} | {e["from"] for e in raw_edges} | {e["to"] for e in raw_edges}
    nodes = [
        build_graph_node(
            address=addr,
            chain=CrossChainResolver.infer_node_chain(addr, raw_edges, fallback_chain=req.chain),
            origin_address=req.start_address
        )
        for addr in all_addrs
    ]

    edges = [
        GraphEdge(
            source=e["from"],
            target=e["to"],
            token_symbol=e.get("token_symbol", "USDT"),
            amount=e["amount"],
            usd_value=(round(e["amount"] * get_usd_price(e.get("token_symbol", "USDT")), 2) or None),
            timestamp_utc=e["ts"],
            tx_hash=e["tx"],
            edge_type=e.get("edge_type", "transfer"),
            chain=e.get("chain"),
            description=e.get("description"),
        )
        for e in raw_edges
    ]

    trace_id = str(uuid.uuid4())
    TRACE_STORE[trace_id] = {"graph": Graph(nodes=nodes, edges=edges), "request": req}

    return TraceStartResponse(
        trace_id=trace_id, reached_exchange=trace_result["reached_exchange"],
        exchange_attribution_message=message,
        terminal_amount=trace_result.get("terminal_amount", 0.0),
        hop_count=len(trace_result["hops"]), trace_time_ms=round(elapsed_ms, 3),
    )
