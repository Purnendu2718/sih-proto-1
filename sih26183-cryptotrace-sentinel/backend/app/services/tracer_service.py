import time
import uuid
import json
import logging
import datetime
from pathlib import Path
from typing import Tuple, Dict, Any, List, Optional

from app.schemas import (
    TraceStartRequest, TraceStartResponse, GraphNode, GraphEdge, 
    TraceGraphResponse, ModusOperandiBrief, OffRampResponse, OffRampPathEdge
)
try:
    from backend.core.c_bridge import BlockchainTracerCore, TxEdgeInput
except ImportError:
    from core.c_bridge import BlockchainTracerCore, TxEdgeInput

from app.services.vasp_service import attribute_address, detect_sweep_attribution

try:
    from backend.ingestion.btc_client import (
        fetch_btc_transactions, fetch_btc_transactions_with_seal, simplify_to_transfers,
        BtcClientError, TronGridError, EvmClientError, NormalizedTransfer
    )
except ImportError:
    from ingestion.btc_client import (
        fetch_btc_transactions, fetch_btc_transactions_with_seal, simplify_to_transfers,
        BtcClientError, TronGridError, EvmClientError, NormalizedTransfer
    )

from app.services.evidence.hash_seal import seal_evidence, SealedEvidence


logger = logging.getLogger(__name__)

SAMPLE_CASES_DIR = Path(__file__).resolve().parents[3] / "sample_cases"
if not SAMPLE_CASES_DIR.exists():
    alt_cases = Path(__file__).resolve().parents[4] / "sample_cases"
    if alt_cases.exists():
        SAMPLE_CASES_DIR = alt_cases

TRACE_STORE: Dict[str, Dict[str, Any]] = {}
CHAIN_MAP = {"TRON": 0, "EVM": 1, "BTC": 2}

_FALLBACK_SCENARIO_BY_CHAIN = {
    "TRON": "task_scam_tron_usdt",
    "EVM": "investment_scam_eth",
    "BTC": "btc_ransomware_scenario",
}


def detect_chain(address: str) -> str:
    addr = (address or "").strip()
    if addr.startswith("T") and len(addr) == 34:
        return "TRON"
    if addr.startswith("0x") and len(addr) == 42:
        return "EVM"
    if addr.startswith(("1", "3", "bc1")):
        return "BTC"
    return "TRON"


def _load_scenario(start_address: str, chain: str = "TRON", scenario_name: Optional[str] = None) -> Tuple[Dict[str, Any], str]:
    # 0. Check if explicit scenario_name provided
    if scenario_name:
        clean_name = scenario_name.strip().lower().replace(".json", "")
        cand_path = SAMPLE_CASES_DIR / f"{clean_name}.json"
        if cand_path.exists():
            with open(cand_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                return data, clean_name
        from app.services.blockchain.mock_client import get_mock_scenario
        data = get_mock_scenario(clean_name)
        if data:
            return data, clean_name

    # 1. Search for directly matching victim_address
    for path in SAMPLE_CASES_DIR.glob("*.json"):
        try:
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)
            if data.get("victim_address") == start_address:
                return data, path.stem
        except Exception:
            continue

    # 2. Check fallback scenario by chain
    fallback_name = _FALLBACK_SCENARIO_BY_CHAIN.get(chain, "task_scam_tron_usdt")
    fallback_path = SAMPLE_CASES_DIR / f"{fallback_name}.json"
    
    if fallback_path.exists():
        with open(fallback_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            data["victim_address"] = start_address
            if data.get("edges"):
                data["edges"][0]["from"] = start_address
            return data, fallback_name

    # Prompt 4: you'll need a BTC mock scenario id added to _FALLBACK_SCENARIO_BY_CHAIN;
    # if one doesn't exist yet in sample_cases/, flag that as missing rather than inventing fake data inline
    logger.warning(
        f"Fallback scenario '{fallback_name}.json' for chain '{chain}' is missing in sample_cases/ directory. "
        "No fake data is invented inline per forensic honesty standards."
    )
    raise FileNotFoundError(
        f"Fallback scenario '{fallback_name}.json' for chain '{chain}' is missing in sample_cases/. "
        "Live RPC query was unavailable or returned no data, and no mock fixture is installed."
    )


def run_trace(req: TraceStartRequest) -> TraceStartResponse:
    target_address = req.get_target_address()
    if not target_address:
        target_address = "TVictim0001XXXXXXXXXXXXXXXXXXXXXXX"

    scenario_req = req.scenario
    detected_chain = req.chain or detect_chain(target_address)
    case_id_val = req.case_id or f"CASE-{detected_chain}-{str(uuid.uuid4())[:8].upper()}"

    data_source = "live"
    warning = None
    raw_edges = []
    exchange_addrs = []
    scenario = None
    sealed_evidence = None

    # Handle live RPC fetching vs mock fallback
    if req.data_mode == "live":
        try:
            if detected_chain == "BTC":
                # Fetch multi-input/multi-output raw BTC transactions with Section 63 BSA evidence seal
                raw_btc_txs, sealed_evidence = fetch_btc_transactions_with_seal(target_address)
                # NOTE: The full multi-input/output structure of RawBtcTransaction is simplified
                # for graph-edge visualization. Evidentiary analysis retains the sealed raw bitstream.
                simplified_transfers: List[NormalizedTransfer] = []
                for raw_tx in raw_btc_txs:
                    transfers = simplify_to_transfers(raw_tx, target_address)
                    simplified_transfers.extend(transfers)

                if not simplified_transfers:
                    raise BtcClientError(f"No on-chain activity found for Bitcoin address {target_address}")

                for st in simplified_transfers:
                    raw_edges.append({
                        "from": st.from_address,
                        "to": st.to_address,
                        "amount": st.amount,
                        "ts": st.timestamp_utc,
                        "tx": st.tx_hash,
                        "chain": "BTC",
                        "token": "BTC",
                        "is_primary": st.is_primary,
                    })
                data_source = "live"
            elif detected_chain == "TRON":
                try:
                    from app.services.blockchain.tron_client import TronClient
                    t_client = TronClient()
                    raw_edges, sealed_evidence = t_client.get_address_transactions_with_seal(target_address)
                    if not raw_edges:
                        raise TronGridError(f"No on-chain transfers found on TRON for {target_address}")
                    data_source = "live"
                except Exception as exc:
                    raise TronGridError(f"TronGrid RPC query failed: {exc}")
            elif detected_chain == "EVM":
                try:
                    from app.services.blockchain.evm_client import EvmClient
                    e_client = EvmClient()
                    raw_edges, sealed_evidence = e_client.get_address_transactions_with_seal(target_address)
                    if not raw_edges:
                        raise EvmClientError(f"No on-chain transfers found on EVM for {target_address}")
                    data_source = "live"
                except Exception as exc:
                    raise EvmClientError(f"EVM RPC query failed: {exc}")
        except (BtcClientError, TronGridError, EvmClientError, Exception) as exc:
            if req.use_mock_fallback:
                scenario, scenario_name = _load_scenario(target_address, detected_chain, scenario_req)
                detected_chain = scenario.get("chain", detected_chain)
                raw_edges = scenario["edges"]
                exchange_addrs = scenario.get("known_exchange_hot_wallets", []) + scenario.get("known_exchange_deposit_addresses", [])
                data_source = f"mock_fallback:{scenario_name}"
                warning = f"Live {detected_chain} query unavailable ({str(exc)}). Loaded simulation scenario '{scenario_name}'."
                sealed_evidence = seal_evidence(
                    chain=detected_chain,
                    queried_address=target_address,
                    raw_payload=scenario,
                    metadata={"source": "mock_fallback", "scenario": scenario_name, "case_id": case_id_val},
                )
            else:
                raise
    else:
        scenario, scenario_name = _load_scenario(target_address, detected_chain, scenario_req)
        detected_chain = scenario.get("chain", detected_chain)
        raw_edges = scenario["edges"]
        exchange_addrs = scenario.get("known_exchange_hot_wallets", []) + scenario.get("known_exchange_deposit_addresses", [])
        data_source = f"mock_fallback:{scenario_name}"
        warning = f"Showing demo data — live source unavailable (Scenario: {scenario_name})"
        sealed_evidence = seal_evidence(
            chain=detected_chain,
            queried_address=target_address,
            raw_payload=scenario,
            metadata={"source": "mock_scenario", "scenario": scenario_name, "case_id": case_id_val},
        )


    # Prepare C-Core BFS edges
    tx_edges = [
        TxEdgeInput(
            from_addr=e["from"], to_addr=e["to"], amount=float(e["amount"]),
            timestamp_utc=int(e["ts"]), tx_hash=e["tx"], chain_id=CHAIN_MAP.get(detected_chain, 0),
        )
        for e in raw_edges
    ]

    t0 = time.perf_counter()
    core = BlockchainTracerCore(tx_edges)
    trace_result = core.trace_to_exchange(
        start_addr=target_address, exchange_addrs=exchange_addrs,
        max_hops=req.max_hops, max_time_window_seconds=req.max_time_window_seconds,
        min_amount_threshold=req.min_amount_threshold,
    )
    elapsed_ms = (time.perf_counter() - t0) * 1000

    primary_path_addrs = [target_address] + [h["address"] for h in trace_result.get("hops", [])]
    primary_set = set(primary_path_addrs)

    # Detect explicit core path addresses from scenario if present
    core_edge_addrs = set()
    has_explicit_core = any("isCorePath" in e for e in raw_edges)
    for e in raw_edges:
        if e.get("isCorePath") or (not has_explicit_core and e.get("is_primary")):
            core_edge_addrs.add(e["from"])
            core_edge_addrs.add(e["to"])

    from app.services.sweep_attribution import detect_and_persist_sweep_attribution
    persistent_sweeps = detect_and_persist_sweep_attribution(raw_edges, chain=detected_chain)
    sweep_attrs = detect_sweep_attribution(raw_edges)
    sweep_attrs.update(persistent_sweeps)
    all_addrs = {target_address} | {e["from"] for e in raw_edges} | {e["to"] for e in raw_edges}

    from app.services.analytics.risk_scorer import RiskScorer

    nodes = {}
    dest_vasp = "Unknown VASP"
    base_ts = raw_edges[0]["ts"] if raw_edges else int(time.time())

    for addr in all_addrs:
        static_attr = attribute_address(addr)
        is_on_primary = addr in primary_set

        # Node in/out degree
        in_count = sum(1 for e in raw_edges if e["to"] == addr)
        out_count = sum(1 for e in raw_edges if e["from"] == addr)

        # Check peeling structuring via core or topology
        peel_check = core.check_peeling_chain(addr) if hasattr(core, "check_peeling_chain") else {"is_peeling_chain": False}
        is_peeling = peel_check.get("is_peeling_chain", False) or (out_count >= 2 and in_count == 1)

        # Hop distance to exchange along primary path
        hop_dist = None
        if addr in primary_path_addrs:
            idx = primary_path_addrs.index(addr)
            hop_dist = max(0, len(primary_path_addrs) - 1 - idx)

        # Velocity in minutes
        addr_tx_ts = [e["ts"] for e in raw_edges if e["from"] == addr or e["to"] == addr]
        v_mins = max(1, int((max(addr_tx_ts) - min(addr_tx_ts)) / 60)) if len(addr_tx_ts) > 1 else 15

        if addr == target_address:
            node_type = "victim"
            node_class = "source_wallet"
            role_tag = "REPORTED VICTIM"
            label = "[Victim Reported Wallet]"
            cluster = "Complainant"
            conf = 1.0
        elif static_attr.get("is_mixer"):
            node_type = "mixer"
            node_class = "contract_or_mixer"
            role_tag = "SANCTIONED MIXER (TORNADO CASH)"
            label = static_attr["entity_label"]
            cluster = "Mixer Evasion"
            conf = 0.99
        elif static_attr["is_known_vasp"]:
            is_hot = "Hot Wallet" in static_attr["entity_label"]
            node_type = "exchange_hotwallet" if is_hot else "exchange_deposit"
            node_class = "exchange_confirmed" if is_hot else "exchange_suspected"
            role_tag = "HOT WALLET (SWEEP TERMINAL)" if is_hot else "SUSPECT CEX DEPOSIT"
            label = static_attr["entity_label"]
            cluster = static_attr["exchange_name"]
            dest_vasp = static_attr["exchange_name"]
            conf = static_attr.get("confidence", 0.99)
        elif is_on_primary and addr != primary_path_addrs[-1]:
            node_type = "mule"
            node_class = "intermediary"
            role_tag = "HIGH VELOCITY MULE"
            label = "[Mule] " + addr[:8] + "..."
            cluster = "Layering Ring"
            conf = 0.85
        elif addr in sweep_attrs:
            sw = sweep_attrs[addr]
            is_hot = "Hot Wallet" in sw.get("entity_label", "")
            node_type = "exchange_hotwallet" if is_hot else "exchange_deposit"
            node_class = "exchange_suspected"
            role_tag = "HEURISTIC HOT WALLET" if is_hot else "SUSPECT CEX DEPOSIT"
            label = sw.get("entity_label") or ("[Suspected CEX Hot Wallet]" if is_hot else "[Suspected CEX Deposit]")
            ex_name = sw.get("exchange_name") or "Sweep Cluster"
            cluster = ex_name
            if sw.get("exchange_name"):
                dest_vasp = sw["exchange_name"]
            conf = sw.get("confidence", 0.94)
        elif not is_on_primary:
            node_type = "peel_outlet"
            node_class = "unknown"
            role_tag = "DECOY / PEEL OUTLET"
            label = "[Peel Dust] " + addr[:8] + "..."
            cluster = "Structuring Peel"
            conf = 0.55
        else:
            node_type = "mule"
            node_class = "intermediary"
            role_tag = "HIGH VELOCITY MULE"
            label = "[Mule] " + addr[:8] + "..."
            cluster = "Layering Ring"
            conf = 0.85

        if core_edge_addrs:
            is_node_core = bool(addr in core_edge_addrs)
        else:
            is_node_core = bool(
                is_on_primary or
                (addr in primary_set) or
                (node_type in ["victim", "exchange_deposit", "exchange_hotwallet"])
            )

        if is_node_core:
            parent_box = "core-path"
        elif static_attr.get("is_mixer") or "mixer" in addr.lower() or addr == "0xd90e2f925da726b50c4ed8d0fb90ad053324f31b":
            parent_box = "mixer-evasion"
        elif "dex" in addr.lower() or "uniswap" in addr.lower() or "pool" in addr.lower():
            parent_box = "dex-swap"
        elif "gas" in addr.lower() or "energy" in addr.lower() or "matic" in addr.lower() or "funder" in addr.lower():
            parent_box = "gas-refill"
        elif "runner" in addr.lower() or "aggregator" in addr.lower() or "syndicate" in addr.lower():
            parent_box = "runner-network"
        elif is_peeling or "peel" in addr.lower():
            parent_box = "peel-structuring"
        else:
            parent_box = "background-web"

        # Compute explainable risk evaluation
        risk_eval = RiskScorer.score_address(
            address=addr,
            fan_in=in_count,
            fan_out=out_count,
            is_peeling=is_peeling,
            velocity_mins=v_mins,
            hop_distance_to_exchange=hop_dist,
            is_victim=(addr == target_address),
            is_hot_wallet=(node_type == "exchange_hotwallet"),
            is_deposit_wallet=(node_type == "exchange_deposit"),
            touched_mixer=(node_type == "mixer" or addr == "0xd90e2f925da726b50c4ed8d0fb90ad053324f31b"),
        )

        nodes[addr] = GraphNode(
            id=addr,
            label=label,
            node_type=node_type,
            node_class=node_class,
            risk_score=risk_eval["score"],
            role_tag=role_tag,
            cluster_label=cluster,
            label_confidence=conf,
            is_on_primary_path=is_on_primary,
            isCorePath=is_node_core,
            parentBoxId=parent_box,
            risk_severity=risk_eval["severity"],
            risk_breakdown=risk_eval["breakdown"],
            risk_rules=risk_eval["rules"],
            risk_explanation=risk_eval["explanation"],
        )

    base_ts = raw_edges[0]["ts"] if raw_edges else int(time.time())
    edges = []
    for e in raw_edges:
        mins_elapsed = max(0, int((e["ts"] - base_ts) / 60))
        time_formatted = datetime.datetime.fromtimestamp(e["ts"], datetime.timezone.utc).strftime("%H:%M UTC")
        is_prim = (e["from"] in primary_set and e["to"] in primary_set)
        token_name = e.get("token") or e.get("token_symbol") or ("BTC" if detected_chain == "BTC" else "USDT")
        is_core_edge = bool(e.get("isCorePath", is_prim))
        parent_box_edge = e.get("parentBoxId") or ("core-path" if is_core_edge else "background-web")
        edges.append(GraphEdge(
            source=e["from"],
            target=e["to"],
            amount=float(e["amount"]),
            token=token_name,
            token_symbol=token_name,
            timestamp_utc=int(e["ts"]),
            time_str=time_formatted,
            tx_hash=e["tx"],
            is_primary=is_prim,
            isCorePath=is_core_edge,
            parentBoxId=parent_box_edge,
            velocity_mins=mins_elapsed,
        ))

    # Formulate Executive Brief
    time_delta_mins = max(1, int((raw_edges[-1]["ts"] - raw_edges[0]["ts"]) / 60)) if raw_edges else 10
    hops_list = trace_result.get("hops", [])
    target_deposit = (
        hops_list[-2]["address"] if len(hops_list) >= 2 
        else (hops_list[-1]["address"] if hops_list else "Unknown")
    )
    first_amount = raw_edges[0]["amount"] if raw_edges else 0.0

    case_risk_score = max((n.risk_score for n in nodes.values() if n.node_type != "exchange_hotwallet"), default=85)
    case_severity = "CRITICAL" if case_risk_score >= 85 else ("HIGH" if case_risk_score >= 60 else "MODERATE")
    case_breakdown = {
        "max_node_risk": case_risk_score,
        "mule_conduits_flagged": len([n for n in nodes.values() if n.node_type == "mule"]),
        "peeling_structuring_detected": any(n.risk_breakdown and "peeling_structuring" in n.risk_breakdown for n in nodes.values()),
        "rapid_velocity_detected": time_delta_mins <= 60,
    }

    brief = ModusOperandiBrief(
        title=f"Automated Layered Mule Laundering & {dest_vasp} CEX Off-Ramp",
        typology=f"Task-Based Cyber Fraud / Structuring ({detected_chain})",
        time_to_exchange_mins=time_delta_mins,
        stolen_amount_usd=first_amount,
        intermediary_mules_count=max(0, len(hops_list) - 1),
        identified_vasp=dest_vasp,
        target_deposit_wallet=target_deposit,
        recommended_legal_action=f"Dispatch Section 94 BNSS preservation directive to {dest_vasp} Nodal Compliance to debit-freeze target account.",
        narrative=(
            f"Victim reported funds of {first_amount:,.2f} structured across "
            f"{max(0, len(hops_list) - 1)} intermediary mule accounts within {time_delta_mins} minutes "
            f"on the {detected_chain} network before consolidating and sweeping into {dest_vasp}."
        ),
        case_risk_score=case_risk_score,
        case_risk_severity=case_severity,
        case_risk_breakdown=case_breakdown,
    )

    trace_id = str(uuid.uuid4())
    graph_response = TraceGraphResponse(
        case_id=case_id_val,
        trace_id=trace_id,
        data_source=data_source,
        nodes=list(nodes.values()),
        edges=edges,
        brief=brief,
        primary_path=primary_path_addrs,
    )

    stored_case = {
        "case_id": case_id_val,
        "trace_id": trace_id,
        "data_source": data_source,
        "graph": graph_response,
        "result": trace_result,
        "request": req,
        "warning": warning,
        "sealed_evidence": sealed_evidence.to_dict() if hasattr(sealed_evidence, "to_dict") else sealed_evidence,
    }

    # Store under both trace_id and case_id for robust URL lookup
    TRACE_STORE[trace_id] = stored_case
    TRACE_STORE[case_id_val] = stored_case

    return TraceStartResponse(
        case_id=case_id_val,
        trace_id=trace_id,
        detected_chain=detected_chain,
        transfer_count=len(edges),
        data_source=data_source,
        warning=warning,
        reached_exchange=trace_result["reached_exchange"],
        destination_vasp=dest_vasp,
        terminal_amount=trace_result["terminal_amount"],
        hop_count=len(hops_list),
        trace_time_ms=round(elapsed_ms, 3),
        primary_path_addresses=primary_path_addrs,
        typology_summary=brief.typology,
    )


def find_nearest_off_ramp(case_id: str, dust_threshold_usd: float = 50.0) -> OffRampResponse:
    if case_id not in TRACE_STORE:
        raise KeyError(f"Case ID '{case_id}' not found")

    stored = TRACE_STORE[case_id]
    graph: TraceGraphResponse = stored["graph"]
    nodes = {n.id: n for n in graph.nodes}
    edges = [e for e in graph.edges if e.amount >= dust_threshold_usd]

    # Identify destination exchange nodes
    exchange_node_ids = {
        nid for nid, node in nodes.items()
        if node.node_type in ("exchange_deposit", "exchange_hotwallet")
        or (node.node_class and "exchange" in node.node_class)
    }

    primary_addrs = graph.primary_path
    path_edges: List[OffRampPathEdge] = []
    terminal_label = "Unknown Exchange Terminal"
    found = False

    if exchange_node_ids:
        # Traverse primary path sequence
        for i in range(len(primary_addrs) - 1):
            src = primary_addrs[i]
            dst = primary_addrs[i + 1]
            matching = next((e for e in edges if e.source == src and e.target == dst), None)
            if matching:
                path_edges.append(OffRampPathEdge(
                    source=matching.source,
                    target=matching.target,
                    amount=matching.amount,
                    token=matching.token,
                    tx_hash=matching.tx_hash,
                    timestamp_utc=matching.timestamp_utc,
                ))
            if dst in exchange_node_ids:
                terminal_label = nodes[dst].label or "Exchange Terminal"
                found = True
                break

        if not found and path_edges:
            found = True

    return OffRampResponse(
        found=found,
        hops_searched=len(path_edges) if path_edges else max(0, len(primary_addrs) - 1),
        truncated=False,
        path=path_edges,
        terminal_label=terminal_label,
        disclaimer=(
            "Heuristic off-ramp detection is an investigative lead, not conclusive proof of account "
            "ownership or CEX deposit attribution. Verification with exchange compliance under Section 94 BNSS is required."
        ),
    )


def expand_node_service(case_id: str, address: str, direction: str = "both") -> Dict[str, Any]:
    from app.services.analytics.graph_engine import GraphEngine
    return GraphEngine.expand_node(TRACE_STORE, case_id, address, direction)

