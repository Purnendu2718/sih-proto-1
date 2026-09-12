from collections import defaultdict
from app.services.attribution_store import upsert_attribution


def detect_common_input_ownership(btc_transactions: list) -> dict:
    """
    Multi-Input Co-Spending Heuristic (common-input-ownership): if two or
    more addresses are used together as INPUTS to the SAME transaction,
    whoever signed it controlled all their keys, so they're treated as
    one cluster. Standard, published Bitcoin forensics (Meiklejohn et al.,
    "A Fistful of Bitcoins," 2013) — a known method, not a novel one.
    Expects raw Esplora-style tx objects with vin[].prevout populated.
    """
    adjacency = defaultdict(set)
    for tx in btc_transactions:
        input_addrs = {
            vin.get("prevout", {}).get("scriptpubkey_address")
            for vin in tx.get("vin", [])
            if vin.get("prevout", {}).get("scriptpubkey_address")
        }
        if len(input_addrs) < 2:
            continue
        for addr in input_addrs:
            adjacency[addr] |= input_addrs

    merged, seen = [], set()
    for addr, group in adjacency.items():
        if addr in seen:
            continue
        combined = set(group)
        changed = True
        while changed:
            changed = False
            for other_group in adjacency.values():
                if other_group & combined and not other_group <= combined:
                    combined |= other_group
                    changed = True
        merged.append(combined)
        seen |= combined

    attributions = {}
    for cluster in merged:
        if len(cluster) < 2:
            continue
        confidence = min(0.6 + 0.05 * len(cluster), 0.95)
        for addr in cluster:
            attributions[addr] = {
                "attribution_rule": "multi_input_co_spending_heuristic",
                "confidence": confidence, "cluster_size": len(cluster),
                "cluster_members": sorted(cluster),
            }
            upsert_attribution(
                address=addr, chain="BTC", category="unknown",
                entity_label=f"Co-Spend Cluster ({len(cluster)} addresses)",
                attribution_rule="multi_input_co_spending_heuristic", confidence=confidence,
                provenance="automated_clustering",
            )
    return attributions
