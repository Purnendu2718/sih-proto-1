from collections import defaultdict
from app.services.attribution_store import upsert_attribution


def detect_common_input_ownership(btc_transactions: list) -> dict:
    """
    Multi-Input Co-Spending Heuristic (a.k.a. common-input-ownership).

    If two or more distinct addresses are used together as INPUTS to the
    SAME transaction, the private keys for all of them had to be
    available to whoever signed and broadcast it — so those input
    addresses are treated as co-owned by one wallet/entity cluster. This
    is a standard, published Bitcoin forensics technique (see Meiklejohn
    et al., "A Fistful of Bitcoins," 2013), used by essentially every
    commercial chain-analysis firm — we are implementing a known,
    peer-reviewed method, not inventing a new deanonymization technique.

    Expects each item in `btc_transactions` to be a raw Esplora-style tx
    object (as returned by btc_client.get_transaction / the /txs list),
    with `vin[].prevout.scriptpubkey_address` populated.
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

    merged = []
    seen = set()
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
                address=addr, chain="BTC", exchange_name=None,
                entity_label=f"Co-Spend Cluster ({len(cluster)} addresses)",
                attribution_rule="multi_input_co_spending_heuristic", confidence=confidence,
            )
    return attributions
