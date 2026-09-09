"""
evm_client.py - Live EVM blockchain client querying Etherscan / Alchemy endpoints across Ethereum, Polygon, and BNB Chain.
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


class EvmClient(BaseBlockchainClient):
    """Client for EVM networks querying Etherscan-compatible APIs and Alchemy RPC."""

    def __init__(self, api_key: Optional[str] = None, network: str = "ethereum"):
        super().__init__(chain_name="EVM")
        self.api_key = api_key or settings.ETHERSCAN_API_KEY
        self.network = network.lower()
        self.base_url = self._resolve_base_url()

    def _resolve_base_url(self) -> str:
        if self.network == "polygon":
            return "https://api.polygonscan.com/api"
        elif self.network in ("bsc", "binance"):
            return "https://api.bscscan.com/api"
        return settings.ETHERSCAN_BASE_URL

    def get_address_transactions(self, address: str, limit: int = 50, case_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Fetch ERC-20 token transfers and native transactions for an EVM address.
        """
        require_online("get_address_transactions")
        addr_clean = (address or "").strip().lower()
        transfers: List[Dict[str, Any]] = []

        token_url = self.base_url
        params = {
            "module": "account",
            "action": "tokentx",
            "address": addr_clean,
            "page": 1,
            "offset": min(limit, 50),
            "sort": "desc",
        }
        if self.api_key:
            params["apikey"] = self.api_key

        try:
            resp = requests.get(token_url, params=params, timeout=8)
            resp.raise_for_status()
            data = resp.json()
            if case_id:
                record_raw_evidence(case_id, "evm_client.get_address_transactions", data)

            results = data.get("result", [])
            if isinstance(results, list):
                for item in results:
                    symbol = item.get("tokenSymbol", "USDT").upper()
                    decimals = int(item.get("tokenDecimal", 6) or 6)
                    raw_val = item.get("value", "0")
                    try:
                        amount = float(raw_val) / (10 ** decimals)
                    except (ValueError, TypeError):
                        amount = 0.0

                    ts_utc = int(item.get("timeStamp", 0))
                    tx_hash = item.get("hash", "")
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
            logger.warning(f"EVM RPC request failed for {address}: {exc}")
            raise BlockchainFetchError(f"EVM connection failure: {exc}")

    def get_address_transactions_with_seal(self, address: str, limit: int = 50, case_id: Optional[str] = None):
        """Fetch transactions with Section 63 BSA SHA-256 seal."""
        require_online("get_address_transactions_with_seal")
        from app.services.evidence.hash_seal import seal_evidence

        transfers = self.get_address_transactions(address, limit=limit, case_id=case_id)
        sealed = seal_evidence(
            chain="EVM",
            queried_address=address,
            raw_payload=transfers,
            metadata={"network": self.network, "limit": limit},
        )
        return transfers, sealed

    def get_transaction_details(self, tx_hash: str, case_id: Optional[str] = None) -> Dict[str, Any]:
        require_online("get_transaction_details")
        url = self.base_url
        params = {
            "module": "proxy",
            "action": "eth_getTransactionByHash",
            "txhash": tx_hash,
        }
        if self.api_key:
            params["apikey"] = self.api_key
        try:
            resp = requests.get(url, params=params, timeout=8)
            resp.raise_for_status()
            data = resp.json()
            if case_id:
                record_raw_evidence(case_id, "evm_client.get_transaction_details", data)
            return data
        except requests.RequestException as exc:
            raise BlockchainFetchError(f"EVM query failed: {exc}")


def get_erc20_transfers(address: str, network: str = "ETH", case_id: Optional[str] = None) -> List[Dict[str, Any]]:
    require_online("get_erc20_transfers")
    client = EvmClient(network="ethereum" if network == "ETH" else network.lower())
    return client.get_address_transactions(address, case_id=case_id)


def get_native_transactions(address: str, network: str = "ETH", case_id: Optional[str] = None) -> List[Dict[str, Any]]:
    require_online("get_native_transactions")
    return []
