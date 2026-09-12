from fastapi import APIRouter
from app.schemas import SearchRequest, SearchResponse, ExpandRequest, Graph, GraphEdge
from app.services.address_detector import detect_input, ChainType
from app.services.blockchain import tron_client, evm_client, btc_client
from app.services.blockchain.resilient_fetch import BlockchainFetchError
from app.services.graph_node_builder import build_graph_node
from app.services.sweep_attribution import detect_and_persist_sweep_attribution
from app.services.heuristics.common_input_ownership import detect_common_input_ownership
from app.services.price_service import get_usd_price

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


def _edges_from_transfers(transfers: list) -> list:
    edges = []
    for t in transfers:
        price = get_usd_price(t["token_symbol"])
        edges.append(GraphEdge(
            source=t["from"], target=t["to"], token_symbol=t["token_symbol"], amount=t["amount"],
            usd_value=round(t["amount"] * price, 2) if price else None,
            timestamp_utc=t["timestamp_utc"], tx_hash=t["tx_hash"],
            is_likely_change=t.get("is_likely_change", False),
        ))
    return edges


@router.post("/search", response_model=SearchResponse)
def search(req: SearchRequest):
    detected_chain, detected_type = detect_input(req.query)
    chain = ChainType(req.chain_hint) if req.chain_hint else detected_chain

    transfers = _fetch_transfers(chain.value, req.query, req.network, req.case_id)
    raw_edges = [{"from": t["from"], "to": t["to"], "amount": t["amount"], "ts": t["timestamp_utc"], "tx": t["tx_hash"]} for t in transfers]
    detect_and_persist_sweep_attribution(raw_edges, chain=chain.value)
    _enrich_btc_clustering(chain.value, transfers, req.query, req.case_id)

    nodes = {req.query: build_graph_node(req.query, chain.value, req.query)}
    for t in transfers:
        for addr in (t["from"], t["to"]):
            if addr and addr not in nodes:
                nodes[addr] = build_graph_node(addr, chain.value, req.query)

    return SearchResponse(
        detected_chain=detected_chain.value, detected_type=detected_type.value, resolved_query=req.query,
        graph=Graph(nodes=list(nodes.values()), edges=_edges_from_transfers(transfers)),
    )


@router.post("/graph/expand", response_model=Graph)
def expand(req: ExpandRequest):
    transfers = _fetch_transfers(req.chain, req.address, req.network, req.case_id)
    if req.direction == "in":
        transfers = [t for t in transfers if t["to"] == req.address]
    elif req.direction == "out":
        transfers = [t for t in transfers if t["from"] == req.address]
    transfers = transfers[: req.limit]

    raw_edges = [{"from": t["from"], "to": t["to"], "amount": t["amount"], "ts": t["timestamp_utc"], "tx": t["tx_hash"]} for t in transfers]
    detect_and_persist_sweep_attribution(raw_edges, chain=req.chain)
    _enrich_btc_clustering(req.chain, transfers, req.address, req.case_id)

    nodes = {}
    for t in transfers:
        for addr in (t["from"], t["to"]):
            if addr and addr not in nodes:
                nodes[addr] = build_graph_node(addr, req.chain, req.address)

    return Graph(nodes=list(nodes.values()), edges=_edges_from_transfers(transfers))
