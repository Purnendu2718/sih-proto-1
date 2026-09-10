import os
import requests
from typing import Optional
from .resilient_fetch import resilient
from app.services.air_gapped_guard import require_online
from app.services.evidence_ledger import record_raw_evidence

ETHERSCAN_BASE = "https://api.etherscan.io/v2/api"
CHAIN_IDS = {"ETH": 1, "BSC": 56, "POLYGON": 137}
NATIVE_SYMBOLS = {"ETH": "ETH", "BSC": "BNB", "POLYGON": "MATIC"}


def _api_key():
    return os.environ.get("ETHERSCAN_API_KEY", "")


@resilient
def get_erc20_transfers(address: str, network: str = "ETH", limit: int = 50, case_id: Optional[str] = None) -> list:
    require_online("evm_client.get_erc20_transfers")
    chain_id = CHAIN_IDS.get(network.upper(), 1)
    params = {
        "chainid": chain_id, "module": "account", "action": "tokentx",
        "address": address, "sort": "asc", "offset": limit, "page": 1, "apikey": _api_key(),
    }
    resp = requests.get(ETHERSCAN_BASE, params=params, timeout=15)
    resp.raise_for_status()
    payload = resp.json()
    if case_id:
        record_raw_evidence(case_id, "evm_client.get_erc20_transfers", payload)

    out = []
    for tx in payload.get("result", []):
        decimals = int(tx.get("tokenDecimal", 18))
        out.append({
            "from": tx["from"], "to": tx["to"], "token_symbol": tx.get("tokenSymbol", "TOKEN"),
            "amount": float(tx["value"]) / (10 ** decimals),
            "timestamp_utc": int(tx["timeStamp"]), "tx_hash": tx["hash"], "chain": network.upper(),
        })
    return out


@resilient
def get_native_transactions(address: str, network: str = "ETH", limit: int = 50, case_id: Optional[str] = None) -> list:
    require_online("evm_client.get_native_transactions")
    chain_id = CHAIN_IDS.get(network.upper(), 1)
    params = {
        "chainid": chain_id, "module": "account", "action": "txlist",
        "address": address, "sort": "asc", "offset": limit, "page": 1, "apikey": _api_key(),
    }
    resp = requests.get(ETHERSCAN_BASE, params=params, timeout=15)
    resp.raise_for_status()
    payload = resp.json()
    if case_id:
        record_raw_evidence(case_id, "evm_client.get_native_transactions", payload)

    out = []
    symbol = NATIVE_SYMBOLS.get(network.upper(), "ETH")
    for tx in payload.get("result", []):
        out.append({
            "from": tx["from"], "to": tx["to"], "token_symbol": symbol,
            "amount": float(tx["value"]) / (10 ** 18),
            "timestamp_utc": int(tx["timeStamp"]), "tx_hash": tx["hash"], "chain": network.upper(),
        })
    return out
