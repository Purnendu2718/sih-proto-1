from collections import defaultdict
from app.services.attribution_store import upsert_attribution, lookup_attribution


def detect_and_persist_sweep_attribution(edges: list, chain: str,
                                          sweep_window_seconds: int = 1800,
                                          min_source_count: int = 3) -> dict:
    """
    Zero-day CEX sweep heuristic, persistent version. If N-or-more distinct
    addresses transfer into the SAME destination within a short window,
    that destination is very likely an exchange master hot wallet
    sweeping deposits. Attribution is written to attribution_store the
    moment the pattern fires, and if any input already carries a prior
    exchange attribution, that name is inherited by the new cluster
    automatically — this is the direct answer to a static, pre-tagged
    address directory that treats new deposit wallets as "Unknown."
    """
    inbound_by_dest = defaultdict(list)
    for e in edges:
        inbound_by_dest[e["to"]].append(e)

    results = {}
    for dest, txs in inbound_by_dest.items():
        txs_sorted = sorted(txs, key=lambda t: t["ts"])
        window_start = txs_sorted[0]["ts"]
        clustered = [t for t in txs_sorted if t["ts"] - window_start <= sweep_window_seconds]
        distinct_sources = {t["from"] for t in clustered}
        inherited_exchange = None
        for src in distinct_sources:
            prior = lookup_attribution(src)
            if prior and prior.get("exchange_name"):
                inherited_exchange = prior["exchange_name"]
                break

        if len(distinct_sources) < min_source_count and not (inherited_exchange and len(distinct_sources) >= 1):
            continue

        confidence = min(0.55 + 0.05 * len(distinct_sources), 0.9)
        sweep_tx = clustered[-1]["tx"]

        message = (
            f"Attributed to: {inherited_exchange} via Master Hot Wallet Sweep Tx: {sweep_tx}"
            if inherited_exchange else
            f"Novel exchange-like sweep cluster detected ({len(distinct_sources)} distinct sources "
            f"aggregated within {sweep_window_seconds}s) — pending manual exchange confirmation, "
            f"Sweep Tx: {sweep_tx}"
        )

        upsert_attribution(
            address=dest, chain=chain, category="exchange", cex_role="hotwallet",
            exchange_name=inherited_exchange,
            entity_label="Exchange Master Hot Wallet" if inherited_exchange else "Suspected Exchange Hot Wallet",
            attribution_rule="zero_day_sweep_heuristic", confidence=confidence, evidence_tx_hash=sweep_tx,
        )
        results[dest] = {
            "exchange_name": inherited_exchange, "confidence": confidence,
            "attribution_rule": "zero_day_sweep_heuristic", "message": message,
            "evidence_tx_hash": sweep_tx, "source_count": len(distinct_sources),
        }

        for src in distinct_sources:
            upsert_attribution(
                address=src, chain=chain, category="exchange", cex_role="deposit",
                exchange_name=inherited_exchange,
                entity_label=(f"{inherited_exchange} User Deposit" if inherited_exchange
                              else "Suspected Exchange User Deposit"),
                attribution_rule="zero_day_sweep_heuristic", confidence=max(confidence - 0.05, 0.0),
                evidence_tx_hash=sweep_tx,
            )
    return results
