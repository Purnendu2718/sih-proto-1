import requests
from typing import List
from .schemas import TxEdgeInput

ESPLORA_BASE = "https://blockstream.info/api"


def fetch_btc_transfers(address: str, limit: int = 50) -> List[TxEdgeInput]:
    url = f"{ESPLORA_BASE}/address/{address}/txs"
    resp = requests.get(url, timeout=15)
    resp.raise_for_status()
    txs = resp.json()[:limit]

    edges = []
    for tx in txs:
        txid = tx["txid"]
        ts = tx.get("status", {}).get("block_time", 0)
        for vin in tx.get("vin", []):
            prevout = vin.get("prevout", {}) or {}
            src = prevout.get("scriptpubkey_address")
            if not src:
                continue
            for vout in tx.get("vout", []):
                dest = vout.get("scriptpubkey_address")
                out_value = (vout.get("value", 0) or 0) / 1e8
                if dest and src != dest and out_value > 0:
                    edges.append(TxEdgeInput(
                        from_addr=src, to_addr=dest, amount=out_value,
                        timestamp_utc=ts, tx_hash=txid, chain_id=2,
                    ))
    return edges
