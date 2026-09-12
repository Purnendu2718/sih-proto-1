from app.schemas import GraphNode
from app.services.attribution_store import lookup_attribution
from app.services.entity_resolver import truncate_address
from app.services.cross_chain_engine import CrossChainResolver

_CATEGORY_TO_NODE_TYPE = {
    "exchange": "cex",
    "mixer": "mixer_bridge",
    "bridge": "bridge",
    "dex": "dex",
    "sanctioned": "mixer_bridge",
}

_NODE_TYPE_COLOR = {
    "origin": "#10b981",
    "mule": "#f59e0b",
    "mixer_bridge": "#dc2626",
    "bridge": "#8b5cf6",
    "dex": "#a855f7",
    "cex": "#2563eb",
    "unknown": "#6b7280",
}


def build_graph_node(address: str, chain: str, origin_address: str) -> GraphNode:
    # 0. Check if this is a known cross-chain bridge contract or DEX router
    if CrossChainResolver.is_bridge_contract(address):
        b_info = CrossChainResolver.get_bridge_info(address)
        b_name = b_info["name"] if b_info else "Cross-Chain Bridge"
        return GraphNode(
            id=address,
            display_label=f"[{b_name}]",
            truncated_address=truncate_address(address),
            node_type="bridge",
            chain=chain,
            color=_NODE_TYPE_COLOR["bridge"],
            provenance="offchain_verified",
            risk_score=35,
            risk_mode="static_entity",
        )

    if CrossChainResolver.is_dex_router(address):
        d_info = CrossChainResolver.get_dex_info(address)
        d_name = d_info["name"] if d_info else "DEX Router"
        return GraphNode(
            id=address,
            display_label=f"[{d_name}]",
            truncated_address=truncate_address(address),
            node_type="dex",
            chain=chain,
            color=_NODE_TYPE_COLOR["dex"],
            provenance="offchain_verified",
            risk_score=30,
            risk_mode="static_entity",
        )

    # 1. Check existing pre-computed attribution and sanctions record
    attrib = lookup_attribution(address)

    # 2. If not yet precomputed, run ingestion-time screening & scoring immediately
    if not attrib or attrib.get("risk_score") is None:
        from app.services.sanctions_etl import SanctionsETLService
        SanctionsETLService.screen_and_precompute_at_ingestion(address, chain)
        attrib = lookup_attribution(address)

    if address == origin_address:
        risk_score = 10
        risk_mode = "static_entity"
        if attrib and attrib.get("risk_score") is not None:
            risk_score = attrib["risk_score"]
            risk_mode = attrib.get("risk_mode", "static_entity")
        return GraphNode(
            id=address,
            display_label="[Victim / Origin Wallet]",
            truncated_address=truncate_address(address),
            node_type="origin",
            chain=chain,
            color=_NODE_TYPE_COLOR["origin"],
            provenance="offchain_verified",
            risk_score=risk_score,
            risk_mode=risk_mode,
        )

    if attrib:
        category = attrib.get("category", "unknown")
        node_type = _CATEGORY_TO_NODE_TYPE.get(category, "unknown")
        if attrib.get("is_sanctioned"):
            node_type = "mixer_bridge"

        label = attrib.get("entity_label") or truncate_address(address)
        risk_score = attrib.get("risk_score", 0)
        risk_mode = attrib.get("risk_mode", "dynamic_behavioral")

        return GraphNode(
            id=address,
            display_label=label,
            truncated_address=truncate_address(address),
            node_type=node_type,
            cex_role=attrib.get("cex_role"),
            exchange_name=attrib.get("exchange_name"),
            attribution_rule=attrib.get("attribution_rule", "ingestion_precompute"),
            confidence=attrib.get("confidence", 1.0),
            chain=chain,
            color=_NODE_TYPE_COLOR.get(node_type, "#6b7280"),
            provenance=attrib.get("provenance", "automated_clustering"),
            risk_score=risk_score,
            risk_mode=risk_mode,
        )

    return GraphNode(
        id=address,
        display_label=truncate_address(address),
        truncated_address=truncate_address(address),
        node_type="mule",
        chain=chain,
        color=_NODE_TYPE_COLOR["mule"],
        provenance="automated_clustering",
        risk_score=75,
        risk_mode="dynamic_behavioral",
    )

