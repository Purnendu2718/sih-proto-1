"""
tron_client.py - Live TRON blockchain ingestion client querying TronGrid API for TRC-20 USDT/USDC transfers.
"""

from typing import List, Dict, Any, Optional
import requests
import logging
from .base_client import BaseBlockchainClient, BlockchainClientError
from .resilient_fetch import BlockchainFetchError
from app.core.config import settings
from app.services.air_gapped_guard import require_online
from app.services.evidence_ledger import record_raw_evidence

logger = logging.getLogger(__name__)


class TronClient(BaseBlockchainClient):
    """Client for TRON network querying TronGrid public API."""

    USDT_CONTRACT = "TR7NHqjekqxGxSTvBgDx5quEz2ZnNu74nx"

    def __init__(self, api_key: Optional[str] = None):
        super().__init__(chain_name="TRON")
        self.api_key = api_key or settings.TRONGRID_API_KEY
        self.base_url = settings.TRONGRID_BASE_URL

    def _get_headers(self) -> Dict[str, str]:
        headers = {"Accept": "application/json"}
        if self.api_key:
            headers["TRON-PRO-API-KEY"] = self.api_key
        return headers

    def get_address_transactions(self, address: str, limit: int = 50, case_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Fetch TRC-20 transfers (USDT, USDC, etc.) for a TRON account.
        Normalizes 6 decimals for USDT/USDC and converts block_timestamp to UTC seconds.
        """
        require_online("get_address_transactions")
        url = f"{self.base_url}/v1/accounts/{address}/transactions/trc20"
        params = {"limit": min(limit, 100)}

        try:
            resp = requests.get(url, headers=self._get_headers(), params=params, timeout=8)
            resp.raise_for_status()

            payload = resp.json()
            if case_id:
                record_raw_evidence(case_id, "tron_client.get_address_transactions", payload)

            data = payload.get("data", [])
            transfers: List[Dict[str, Any]] = []

            for item in data:
                token_info = item.get("token_info", {})
                symbol = token_info.get("symbol", "USDT").upper()
                decimals = int(token_info.get("decimals", 6))

                raw_val = item.get("value", "0")
                try:
                    amount = float(raw_val) / (10 ** decimals)
                except (ValueError, TypeError):
                    amount = 0.0

                raw_ts = item.get("block_timestamp", 0)
                ts_utc = int(raw_ts // 1000) if raw_ts > 10**11 else int(raw_ts)

                tx_hash = item.get("transaction_id", "")
                from_addr = item.get("from", "")
                to_addr = item.get("to", "")

                transfers.append(
                    self.normalize_transfer(
                        from_addr=from_addr,
                        to_addr=to_addr,
                        amount=amount,
                        token=symbol,
                        timestamp_utc=ts_utc,
                        tx_hash=tx_hash,
                    )
                )

            return transfers
        except requests.RequestException as exc:
            logger.warning(f"TronGrid network request failed for {address}: {exc}")
            raise BlockchainFetchError(f"TronGrid connection failure: {exc}")

    def get_address_transactions_with_seal(self, address: str, limit: int = 50, case_id: Optional[str] = None):
        """
        Fetch TRC-20 transfers and return (transfers, sealed_evidence) tuple
        with Section 63 BSA SHA-256 evidence sealing captured at ingestion.
        """
        require_online("get_address_transactions_with_seal")
        from app.services.evidence.hash_seal import seal_evidence

        url = f"{self.base_url}/v1/accounts/{address}/transactions/trc20"
        params = {"limit": min(limit, 100)}

        try:
            resp = requests.get(url, headers=self._get_headers(), params=params, timeout=8)
            resp.raise_for_status()

            payload = resp.json()
            if case_id:
                record_raw_evidence(case_id, "tron_client.get_address_transactions_with_seal", payload)

            data = payload.get("data", [])
            sealed = seal_evidence(
                chain="TRON",
                queried_address=address,
                raw_payload=data,
                metadata={"endpoint": url, "limit": limit},
            )

            transfers: List[Dict[str, Any]] = []
            for item in data:
                token_info = item.get("token_info", {})
                symbol = token_info.get("symbol", "USDT").upper()
                decimals = int(token_info.get("decimals", 6))

                raw_val = item.get("value", "0")
                try:
                    amount = float(raw_val) / (10 ** decimals)
                except (ValueError, TypeError):
                    amount = 0.0

                raw_ts = item.get("block_timestamp", 0)
                ts_utc = int(raw_ts // 1000) if raw_ts > 10**11 else int(raw_ts)

                tx_hash = item.get("transaction_id", "")
                from_addr = item.get("from", "")
                to_addr = item.get("to", "")

                transfers.append(
                    self.normalize_transfer(
                        from_addr=from_addr,
                        to_addr=to_addr,
                        amount=amount,
                        token=symbol,
                        timestamp_utc=ts_utc,
                        tx_hash=tx_hash,
                    )
                )

            return transfers, sealed
        except requests.RequestException as exc:
            logger.warning(f"TronGrid network request failed for {address}: {exc}")
            raise BlockchainFetchError(f"TronGrid connection failure: {exc}")

    def get_transaction_details(self, tx_hash: str, case_id: Optional[str] = None) -> Dict[str, Any]:
        """Fetch transaction info from TronGrid."""
        require_online("get_transaction_details")
        url = f"{self.base_url}/wallet/gettransactionbyid"
        try:
            resp = requests.post(url, json={"value": tx_hash}, headers=self._get_headers(), timeout=8)
            resp.raise_for_status()
            data = resp.json()
            if case_id:
                record_raw_evidence(case_id, "tron_client.get_transaction_details", data)
            return data
        except requests.RequestException as exc:
            raise BlockchainFetchError(f"TronGrid connection failure: {exc}")


_DEFAULT_CLIENT = TronClient()


def get_trc20_transfers(address: str, case_id: Optional[str] = None) -> List[Dict[str, Any]]:
    require_online("get_trc20_transfers")
    return _DEFAULT_CLIENT.get_address_transactions(address, case_id=case_id)


def get_native_transactions(address: str, case_id: Optional[str] = None) -> List[Dict[str, Any]]:
    require_online("get_native_transactions")
    # Native TRX transfers placeholder
    return []
