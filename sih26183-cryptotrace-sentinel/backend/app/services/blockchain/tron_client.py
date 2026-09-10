import os
import requests
from typing import Optional
from .resilient_fetch import resilient
from app.services.air_gapped_guard import require_online
from app.services.evidence_ledger import record_raw_evidence

TRONGRID_BASE = "https://api.trongrid.io"


def _headers():
    api_key = os.environ.get("TRONGRID_API_KEY", "")
    return {"TRON-PRO-API-KEY": api_key} if api_key else {}


@resilient
def get_trc20_transfers(address: str, limit: int = 50, case_id: Optional[str] = None) -> list:
    require_online("tron_client.get_trc20_transfers")
    url = f"{TRONGRID_BASE}/v1/accounts/{address}/transactions/trc20"
    resp = requests.get(url, headers=_headers(), params={"limit": limit, "only_confirmed": "true"}, timeout=15)
    resp.raise_for_status()
    payload = resp.json()
    if case_id:
        record_raw_evidence(case_id, "tron_client.get_trc20_transfers", payload)

    out = []
    for tx in payload.get("data", []):
        decimals = int(tx["token_info"]["decimals"])
        out.append({
            "from": tx["from"], "to": tx["to"], "token_symbol": tx["token_info"]["symbol"],
            "amount": float(tx["value"]) / (10 ** decimals),
            "timestamp_utc": int(tx["block_timestamp"]) // 1000,
            "tx_hash": tx["transaction_id"], "chain": "TRON",
        })
    return out


@resilient
def get_native_transactions(address: str, limit: int = 50, case_id: Optional[str] = None) -> list:
    require_online("tron_client.get_native_transactions")
    url = f"{TRONGRID_BASE}/v1/accounts/{address}/transactions"
    resp = requests.get(url, headers=_headers(), params={"limit": limit, "only_confirmed": "true"}, timeout=15)
    resp.raise_for_status()
    payload = resp.json()
    if case_id:
        record_raw_evidence(case_id, "tron_client.get_native_transactions", payload)

    out = []
    for tx in payload.get("data", []):
        contract = (tx.get("raw_data", {}).get("contract") or [{}])[0]
        value = contract.get("parameter", {}).get("value", {})
        out.append({
            "from": value.get("owner_address"), "to": value.get("to_address"), "token_symbol": "TRX",
            "amount": (value.get("amount", 0) or 0) / 1_000_000,
            "timestamp_utc": int(tx.get("block_timestamp", 0)) // 1000,
            "tx_hash": tx.get("txID"), "chain": "TRON",
        })
    return out
