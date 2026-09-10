from app.schemas import GraphNode
from app.services.attribution_store import lookup_attribution
from app.services.entity_resolver import truncate_address

_CATEGORY_TO_NODE_TYPE = {
    "exchange": "cex",
    "mixer": "mixer_bridge",
    "bridge": "mixer_bridge",
    "dex": "mixer_bridge",  # grouped with "smart contracts" per the color spec
}

_NODE_TYPE_COLOR = {
    "origin": "#10b981",
    "mule": "#f59e0b",
    "mixer_bridge": "#dc2626",
    "cex": "#2563eb",
    "unknown": "#6b7280",
}


def build_graph_node(address: str, chain: str, origin_address: str) -> GraphNode:
    attrib = lookup_attribution(address)

    if attrib:
        node_type = _CATEGORY_TO_NODE_TYPE.get(attrib["category"], "unknown")
        label = attrib["entity_label"] or truncate_address(address)
        return GraphNode(
            id=address, display_label=label, truncated_address=truncate_address(address),
            node_type=node_type, cex_role=attrib.get("cex_role"), exchange_name=attrib.get("exchange_name"),
            attribution_rule=attrib["attribution_rule"], confidence=attrib["confidence"],
            chain=chain, color=_NODE_TYPE_COLOR[node_type],
        )

    if address == origin_address:
        return GraphNode(
            id=address, display_label="[Victim / Origin Wallet]", truncated_address=truncate_address(address),
            node_type="origin", chain=chain, color=_NODE_TYPE_COLOR["origin"],
        )

    return GraphNode(
        id=address, display_label=truncate_address(address), truncated_address=truncate_address(address),
        node_type="mule", chain=chain, color=_NODE_TYPE_COLOR["mule"],
    )
