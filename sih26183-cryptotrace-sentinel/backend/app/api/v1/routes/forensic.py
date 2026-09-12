from fastapi import APIRouter
from app.schemas import (
    SearchRequest, SearchResponse, ExpandRequest, Graph, GraphEdge,
    ClusterDetectRequest, ClusterDetectResponse,
    RiskEvaluateRequest, RiskEvaluateResponse,
    TimelineSnapshotsRequest, TimelineSnapshotsResponse,
    CaseChatRequest, CaseChatResponse
)
from app.services.address_detector import detect_input, ChainType
from app.services.blockchain import tron_client, evm_client, btc_client
from app.services.blockchain.resilient_fetch import BlockchainFetchError
from app.services.graph_node_builder import build_graph_node
from app.services.sweep_attribution import detect_and_persist_sweep_attribution
from app.services.heuristics.common_input_ownership import detect_common_input_ownership
from app.services.price_service import get_usd_price
from app.services.analytics.cluster_detector import ClusterDetector
from app.services.analytics.risk_scorer import RiskScorer
from app.services.snapshot_service import ClusterSnapshotEngine
from app.services.case_assistant import CaseAssistantService


router = APIRouter()


def _fetch_transfers(chain: str, address: str, network: str, case_id: str) -> list:
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


def _enrich_btc_clustering(chain: str, transfers: list, primary_address: str, case_id: str):
    if chain != "BTC":
        return
    try:
        addrs = {primary_address} | {t["from"] for t in transfers} | {t["to"] for t in transfers}
        raw_txs = btc_client.get_raw_transactions_for_addresses(list(addrs), case_id=case_id)
        detect_common_input_ownership(raw_txs)
    except BlockchainFetchError:
        pass


from app.services.cross_chain_engine import CrossChainResolver

def _edges_from_transfers(transfers: list) -> list:
    edges = []
    for t in transfers:
        price = get_usd_price(t.get("token_symbol", "USDT"))
        edges.append(GraphEdge(
            source=t["from"],
            target=t["to"],
            token_symbol=t.get("token_symbol", "USDT"),
            amount=t.get("amount", 0.0),
            usd_value=round(t.get("amount", 0.0) * price, 2) if price else None,
            timestamp_utc=t.get("timestamp_utc", 0),
            tx_hash=t.get("tx_hash", ""),
            is_likely_change=t.get("is_likely_change", False),
            edge_type=t.get("edge_type", "transfer"),
            chain=t.get("chain"),
            description=t.get("description"),
            bridge_protocol=t.get("bridge_protocol"),
            chain_transition=t.get("chain_transition"),
        ))
    return edges


@router.post("/search", response_model=SearchResponse)
def search(req: SearchRequest):
    detected_chain, detected_type = detect_input(req.query)
    chain = ChainType(req.chain_hint) if req.chain_hint else detected_chain

    transfers = _fetch_transfers(chain.value, req.query, req.network, req.case_id)

    # Cross-Chain Bridge continuation check
    stitched_transfers = list(transfers)
    for t in transfers:
        if CrossChainResolver.is_bridge_contract(t.get("to")):
            b_res = CrossChainResolver.resolve_bridge_destination(t, candidate_edges=transfers)
            if b_res:
                dst_edge = {
                    "from": t["to"],
                    "to": b_res["destination_address"],
                    "token_symbol": b_res["destination_token"],
                    "amount": b_res["destination_amount"],
                    "timestamp_utc": t["timestamp_utc"] + b_res["time_delta_seconds"],
                    "tx_hash": b_res["destination_tx_hash"],
                    "chain": b_res["destination_chain"],
                    "edge_type": "bridge",
                    "bridge_protocol": b_res["bridge_protocol"],
                    "chain_transition": f"{b_res['source_chain']} → {b_res['destination_chain']}",
                    "description": f"Cross-chain bridge transfer: {b_res['source_chain']} → {b_res['destination_chain']} via {b_res['bridge_name']}",
                }
                stitched_transfers.append(dst_edge)
    transfers = stitched_transfers

    raw_edges = [{"from": t["from"], "to": t["to"], "amount": t["amount"], "ts": t["timestamp_utc"], "tx": t["tx_hash"], "chain": t.get("chain", chain.value)} for t in transfers]
    detect_and_persist_sweep_attribution(raw_edges, chain=chain.value)
    _enrich_btc_clustering(chain.value, transfers, req.query, req.case_id)

    nodes = {req.query: build_graph_node(req.query, chain.value, req.query)}
    for t in transfers:
        for addr in (t.get("from"), t.get("to")):
            if addr and addr not in nodes:
                node_chain = CrossChainResolver.infer_node_chain(addr, transfers, fallback_chain=chain.value)
                nodes[addr] = build_graph_node(addr, node_chain, req.query)

    return SearchResponse(
        detected_chain=detected_chain.value, detected_type=detected_type.value, resolved_query=req.query,
        graph=Graph(nodes=list(nodes.values()), edges=_edges_from_transfers(transfers)),
    )


@router.post("/graph/expand", response_model=Graph)
def expand(req: ExpandRequest):
    all_transfers = _fetch_transfers(req.chain, req.address, req.network, req.case_id)
    if req.direction == "in":
        filtered = [t for t in all_transfers if t["to"] == req.address]
    elif req.direction == "out":
        filtered = [t for t in all_transfers if t["from"] == req.address]
    else:
        filtered = all_transfers

    total_count = len(filtered)
    offset = max(0, req.offset)
    limit = max(1, req.limit)
    transfers = filtered[offset : offset + limit]
    has_more = (offset + limit) < total_count

    # Cross-Chain Bridge continuation
    is_bridge = CrossChainResolver.is_bridge_contract(req.address)
    stitched_transfers = list(transfers)

    if is_bridge:
        for t in transfers:
            b_res = CrossChainResolver.resolve_bridge_destination(t, candidate_edges=all_transfers)
            if b_res:
                dst_edge = {
                    "from": req.address,
                    "to": b_res["destination_address"],
                    "token_symbol": b_res["destination_token"],
                    "amount": b_res["destination_amount"],
                    "timestamp_utc": t.get("timestamp_utc", 0) + b_res["time_delta_seconds"],
                    "tx_hash": b_res["destination_tx_hash"],
                    "chain": b_res["destination_chain"],
                    "edge_type": "bridge",
                    "bridge_protocol": b_res["bridge_protocol"],
                    "chain_transition": f"{b_res['source_chain']} → {b_res['destination_chain']}",
                    "description": f"Cross-chain bridge transfer: {b_res['source_chain']} → {b_res['destination_chain']} via {b_res['bridge_name']}",
                }
                stitched_transfers.append(dst_edge)
                dst_transfers = _fetch_transfers(b_res["destination_chain"], b_res["destination_address"], req.network, req.case_id)
                stitched_transfers.extend(dst_transfers[:5])
    else:
        for t in transfers:
            if CrossChainResolver.is_bridge_contract(t.get("to")):
                b_res = CrossChainResolver.resolve_bridge_destination(t, candidate_edges=all_transfers)
                if b_res:
                    dst_edge = {
                        "from": t["to"],
                        "to": b_res["destination_address"],
                        "token_symbol": b_res["destination_token"],
                        "amount": b_res["destination_amount"],
                        "timestamp_utc": t.get("timestamp_utc", 0) + b_res["time_delta_seconds"],
                        "tx_hash": b_res["destination_tx_hash"],
                        "chain": b_res["destination_chain"],
                        "edge_type": "bridge",
                        "bridge_protocol": b_res["bridge_protocol"],
                        "chain_transition": f"{b_res['source_chain']} → {b_res['destination_chain']}",
                        "description": f"Cross-chain bridge transfer: {b_res['source_chain']} → {b_res['destination_chain']} via {b_res['bridge_name']}",
                    }
                    stitched_transfers.append(dst_edge)

    transfers = stitched_transfers

    raw_edges = [{"from": t["from"], "to": t["to"], "amount": t["amount"], "ts": t["timestamp_utc"], "tx": t["tx_hash"], "chain": t.get("chain", req.chain)} for t in transfers]
    detect_and_persist_sweep_attribution(raw_edges, chain=req.chain)
    _enrich_btc_clustering(req.chain, transfers, req.address, req.case_id)

    nodes = {}
    for t in transfers:
        for addr in (t.get("from"), t.get("to")):
            if addr and addr not in nodes:
                node_chain = CrossChainResolver.infer_node_chain(addr, transfers, fallback_chain=req.chain)
                nodes[addr] = build_graph_node(addr, node_chain, req.address)

    return Graph(
        nodes=list(nodes.values()),
        edges=_edges_from_transfers(transfers),
        total_count=total_count,
        offset=offset,
        limit=limit,
        has_more=has_more,
    )


@router.post("/graph/detect-clusters", response_model=ClusterDetectResponse)
@router.post("/detect-clusters", response_model=ClusterDetectResponse)
def detect_clusters_endpoint(req: ClusterDetectRequest):
    """
    Magic Nodes clustering pass:
    Flags wallets as 'indirectly linked' based on:
      (a) Common gas-funding source address (energy sponsor)
      (b) Common first-funding intermediary (genesis activation parent)
      (c) Near-identical transaction timing patterns (sub-180s coordinated bursts)
    Surfaces distinct 'indirect_link' edges for graph view rendering.
    """
    result = ClusterDetector.detect_indirect_links(
        nodes=req.nodes,
        edges=req.edges,
        timing_threshold_seconds=req.timing_threshold_seconds or 180,
    )
    return ClusterDetectResponse(**result)


@router.post("/risk/evaluate", response_model=RiskEvaluateResponse)
@router.post("/risk/score", response_model=RiskEvaluateResponse)
def evaluate_risk_endpoint(req: RiskEvaluateRequest):
    """
    Dual-Mode Risk Engine:
    - Known/attributed entities (exchanges, mixers, darknet markets): static base risk score.
    - Unattributed wallets: dynamic behavioral score from signals (mixer interaction,
      rapid fan-out, sanctioned proximity, age of first activity).
    - Always reports and stores scoring mode (never blends them).
    """
    result = RiskScorer.evaluate(
        address=req.address,
        entity_name=req.entity_name,
        entity_category=req.entity_category,
        historical_hops=req.historical_hops,
        incoming_txs=req.incoming_txs,
        outgoing_txs=req.outgoing_txs,
        sanctioned_proximity_hops=req.sanctioned_proximity_hops,
        mixer_interaction=req.mixer_interaction,
        rapid_fan_out=req.rapid_fan_out,
        age_hours=req.age_hours,
    )
    return RiskEvaluateResponse(**result)


@router.post("/timeline/snapshots", response_model=TimelineSnapshotsResponse)
@router.post("/forensic/timeline/snapshots", response_model=TimelineSnapshotsResponse)
@router.post("/snapshots", response_model=TimelineSnapshotsResponse)
def compute_timeline_snapshots(req: TimelineSnapshotsRequest):
    """
    TASK 8: Time Travel Playback Endpoint.
    Computes sequential forensic state snapshots from historical transaction data,
    tracking dynamic node holdings, active links, volume in motion, and off-ramp exposure.
    """
    nodes = req.nodes
    edges = req.edges
    if not nodes and req.case_id:
        from app.services.case_service import get_case_canvas
        canvas = get_case_canvas(req.case_id)
        if canvas:
            nodes = canvas.get("nodes", [])
            edges = canvas.get("edges", [])

    snapshots = ClusterSnapshotEngine.generate_snapshots(nodes, edges)
    return TimelineSnapshotsResponse(
        total_snapshots=len(snapshots),
        snapshots=snapshots,
    )


@router.post("/assistant/chat", response_model=CaseChatResponse)
def forensic_assistant_chat_endpoint(req: CaseChatRequest):
    """
    TASK 9: Assistant chat endpoint under /api/v1/assistant/chat.
    """
    res = CaseAssistantService.query_case(
        case_id=req.case_id or "",
        query=req.query,
        graph=req.graph,
        case_meta=req.case_meta,
        history=req.history
    )
    return CaseChatResponse(**res)


