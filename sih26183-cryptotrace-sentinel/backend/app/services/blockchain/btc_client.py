import requests
from typing import Optional
from .resilient_fetch import resilient
from app.services.air_gapped_guard import require_online
from app.services.evidence_ledger import record_raw_evidence

MEMPOOL_BASE = "https://mempool.space/api"


@resilient
def get_address_transfers(address: str, limit: int = 50, case_id: Optional[str] = None) -> list:
    require_online("btc_client.get_address_transfers")
    url = f"{MEMPOOL_BASE}/address/{address}/txs"
    resp = requests.get(url, timeout=15)
    resp.raise_for_status()
    payload = resp.json()
    if case_id:
        record_raw_evidence(case_id, "btc_client.get_address_transfers", {"txs": payload})

    out = []
    for tx in payload[:limit]:
        txid = tx["txid"]
        ts = tx.get("status", {}).get("block_time", 0)
        vouts = tx.get("vout", [])
        looks_like_change_branch = len(vouts) > 2
        for vin in tx.get("vin", []):
            prevout = vin.get("prevout") or {}
            src = prevout.get("scriptpubkey_address")
            if not src:
                continue
            for idx, vout in enumerate(vouts):
                dest = vout.get("scriptpubkey_address")
                value = (vout.get("value", 0) or 0) / 1e8
                if not dest or src == dest or value <= 0:
                    continue
                out.append({
                    "from": src, "to": dest, "token_symbol": "BTC", "amount": value,
                    "timestamp_utc": ts, "tx_hash": txid, "chain": "BTC",
                    "is_likely_change": looks_like_change_branch and idx == len(vouts) - 1,
                })
    return out


@resilient
def get_raw_transactions_for_addresses(addresses: list, case_id: Optional[str] = None) -> list:
    """Raw tx objects (not flattened edges) for the common-input-ownership
    heuristic, which needs the full vin[].prevout structure."""
    require_online("btc_client.get_raw_transactions_for_addresses")
    raw_txs, seen_txids = [], set()
    for address in addresses:
        url = f"{MEMPOOL_BASE}/address/{address}/txs"
        resp = requests.get(url, timeout=15)
        resp.raise_for_status()
        payload = resp.json()
        if case_id:
            record_raw_evidence(case_id, f"btc_client.get_raw_transactions_for_addresses:{address}", {"txs": payload})
        for tx in payload:
            if tx["txid"] not in seen_txids:
                raw_txs.append(tx)
                seen_txids.add(tx["txid"])
    return raw_txs
