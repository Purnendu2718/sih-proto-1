from collections import defaultdict
from app.services.attribution_store import upsert_attribution, lookup_attribution


def detect_and_persist_sweep_attribution(edges: list, chain: str,
                                          sweep_window_seconds: int = 1800,
                                          min_source_count: int = 3) -> dict:
    """
    Zero-day CEX sweep heuristic, persistent version.

    If N-or-more distinct addresses transfer into the SAME destination
    within a short window, that destination is very likely an exchange
    master hot wallet performing a batched sweep. The novelty here vs. a
    static tagged-address directory: the attribution is written to a
    local, append-only store the moment the pattern fires, and if any
    input to a NEW sweep cluster already carries a prior exchange
    attribution, that exchange name is inherited and PROPAGATED to the
    newly observed cluster automatically — no analyst re-tagging needed,
    and it works even if the deposit address was created minutes ago.
    """
    inbound_by_dest = defaultdict(list)
    for e in edges:
        inbound_by_dest[e["to"]].append(e)

    results = {}
    for dest, txs in inbound_by_dest.items():
        txs_sorted = sorted(txs, key=lambda t: t.get("ts", 0))
        window_start = txs_sorted[0].get("ts", 0)
        clustered = [t for t in txs_sorted if t.get("ts", 0) - window_start <= sweep_window_seconds]
        distinct_sources = {t["from"] for t in clustered}
        if len(distinct_sources) < min_source_count:
            # Also check if destination is an existing known exchange hot wallet receiving a single large sweep
            prior_dest = lookup_attribution(dest)
            if not prior_dest:
                from app.services.vasp_service import attribute_address
                static_dest = attribute_address(dest)
                if static_dest.get("is_known_vasp") and "Hot Wallet" in static_dest.get("entity_label", ""):
                    prior_dest = {"exchange_name": static_dest["exchange_name"]}

            if prior_dest and prior_dest.get("exchange_name"):
                # Single or dual deposit sweep directly into known exchange hot wallet
                for t in txs:
                    src = t["from"]
                    sweep_tx = t.get("tx") or t.get("tx_hash", "")
                    ex_name = prior_dest["exchange_name"]
                    upsert_attribution(
                        address=src, chain=chain, exchange_name=ex_name,
                        entity_label=f"{ex_name} User Deposit",
                        attribution_rule="zero_day_sweep_heuristic", confidence=0.94,
                        evidence_tx_hash=sweep_tx,
                    )
            continue

        inherited_exchange = None
        for src in distinct_sources:
            prior = lookup_attribution(src)
            if prior and prior.get("exchange_name"):
                inherited_exchange = prior["exchange_name"]
                break

        if not inherited_exchange:
            prior_dest = lookup_attribution(dest)
            if prior_dest and prior_dest.get("exchange_name"):
                inherited_exchange = prior_dest["exchange_name"]

        if not inherited_exchange:
            try:
                from app.services.vasp_service import attribute_address
                static_dest = attribute_address(dest)
                if static_dest.get("is_known_vasp") and static_dest.get("exchange_name"):
                    inherited_exchange = static_dest["exchange_name"]
            except Exception:
                pass

        confidence = min(0.55 + 0.05 * len(distinct_sources), 0.94)
        sweep_tx = clustered[-1].get("tx") or clustered[-1].get("tx_hash", "")

        message = (
            f"Attributed to: {inherited_exchange} via Master Hot Wallet Sweep Tx: {sweep_tx}"
            if inherited_exchange else
            f"Novel exchange-like sweep cluster detected ({len(distinct_sources)} distinct "
            f"sources aggregated within {sweep_window_seconds}s) — pending manual exchange "
            f"confirmation, Sweep Tx: {sweep_tx}"
        )

        upsert_attribution(
            address=dest, chain=chain, exchange_name=inherited_exchange,
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
                address=src, chain=chain, exchange_name=inherited_exchange,
                entity_label=(f"{inherited_exchange} User Deposit" if inherited_exchange
                              else "Suspected Exchange User Deposit"),
                attribution_rule="zero_day_sweep_heuristic", confidence=max(confidence - 0.05, 0.0),
                evidence_tx_hash=sweep_tx,
            )
    return results
