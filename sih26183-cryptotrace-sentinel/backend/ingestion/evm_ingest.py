import os
import requests
from typing import List
from .schemas import TxEdgeInput

ETHERSCAN_BASE = "https://api.etherscan.io/v2/api"


def fetch_erc20_transfers(address: str, chain_id: int = 1, limit: int = 50) -> List[TxEdgeInput]:
    api_key = os.environ.get("ETHERSCAN_API_KEY", "")
    params = {
        "chainid": chain_id, "module": "account", "action": "tokentx",
        "address": address, "sort": "asc", "offset": limit, "page": 1,
        "apikey": api_key,
    }
    resp = requests.get(ETHERSCAN_BASE, params=params, timeout=15)
    resp.raise_for_status()
    data = resp.json()

    edges = []
    for tx in data.get("result", []):
        decimals = int(tx.get("tokenDecimal", 18))
        edges.append(TxEdgeInput(
            from_addr=tx["from"], to_addr=tx["to"],
            amount=float(tx["value"]) / (10 ** decimals),
            timestamp_utc=int(tx["timeStamp"]),
            tx_hash=tx["hash"], chain_id=1,
        ))
    return edges
