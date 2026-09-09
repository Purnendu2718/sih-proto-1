import os
import requests
from typing import List
from .schemas import TxEdgeInput

TRONGRID_BASE = "https://api.trongrid.io"


def fetch_trc20_transfers(address: str, limit: int = 50) -> List[TxEdgeInput]:
    api_key = os.environ.get("TRONGRID_API_KEY", "")
    headers = {"TRON-PRO-API-KEY": api_key} if api_key else {}
    url = f"{TRONGRID_BASE}/v1/accounts/{address}/transactions/trc20"
    params = {"limit": limit, "only_confirmed": "true"}
    resp = requests.get(url, headers=headers, params=params, timeout=15)
    resp.raise_for_status()
    data = resp.json()

    edges = []
    for tx in data.get("data", []):
        decimals = int(tx["token_info"]["decimals"])
        edges.append(TxEdgeInput(
            from_addr=tx["from"], to_addr=tx["to"],
            amount=float(tx["value"]) / (10 ** decimals),
            timestamp_utc=int(tx["block_timestamp"]) // 1000,
            tx_hash=tx["transaction_id"], chain_id=0,
        ))
    return edges
