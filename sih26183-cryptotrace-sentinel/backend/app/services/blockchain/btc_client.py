"""
btc_client.py - Live Bitcoin blockchain client querying Mempool.space API.
Parses UTXO inputs and outputs, distinguishing payment outputs from change outputs.
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


class BtcClient(BaseBlockchainClient):
    """Bitcoin UTXO ingestion client using public Mempool.space API."""

    def __init__(self, base_url: Optional[str] = None):
        super().__init__(chain_name="BTC")
        self.base_url = base_url or settings.MEMPOOL_BASE_URL

    def get_address_transactions(self, address: str, limit: int = 50, case_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Fetch UTXO transactions for a Bitcoin address and parse inputs/outputs.
        Distinguishes payment outputs from change outputs.
        """
        require_online("get_address_transactions")
        addr_clean = (address or "").strip()
        url = f"{self.base_url}/address/{addr_clean}/txs"

        try:
            resp = requests.get(url, timeout=10)
            resp.raise_for_status()

            raw_txs = resp.json()
            if case_id:
                record_raw_evidence(case_id, "btc_client.get_address_transactions", raw_txs)

            if not isinstance(raw_txs, list):
                return []

            transfers: List[Dict[str, Any]] = []

            for tx in raw_txs[:limit]:
                tx_hash = tx.get("txid", "")
                status = tx.get("status", {})
                block_time = status.get("block_time", 0)

                vins = tx.get("vin", [])
                vouts = tx.get("vout", [])

                input_addrs = set()
                for vin in vins:
                    prevout = vin.get("prevout") or {}
                    in_addr = prevout.get("scriptpubkey_address")
                    if in_addr:
                        input_addrs.add(in_addr)

                # Case A: Outbound from target address
                if addr_clean in input_addrs:
                    external_outputs = [
                        vo for vo in vouts
                        if vo.get("scriptpubkey_address") and vo.get("scriptpubkey_address") not in input_addrs
                    ]
                    for out in (external_outputs or vouts):
                        out_addr = out.get("scriptpubkey_address")
                        if out_addr and out_addr not in input_addrs:
                            val_btc = float(out.get("value", 0)) / 1e8
                            transfers.append(
                                self.normalize_transfer(
                                    from_addr=addr_clean,
                                    to_addr=out_addr,
                                    amount=val_btc,
                                    token="BTC",
                                    timestamp_utc=block_time,
                                    tx_hash=tx_hash,
                                    is_primary=True,
                                )
                            )
                else:
                    # Case B: Inbound to target address
                    for out in vouts:
                        if out.get("scriptpubkey_address") == addr_clean:
                            val_btc = float(out.get("value", 0)) / 1e8
                            from_addr = list(input_addrs)[0] if input_addrs else "Unknown_Sender"
                            transfers.append(
                                self.normalize_transfer(
                                    from_addr=from_addr,
                                    to_addr=addr_clean,
                                    amount=val_btc,
                                    token="BTC",
                                    timestamp_utc=block_time,
                                    tx_hash=tx_hash,
                                    is_primary=True,
                                )
                            )

            return transfers
        except requests.RequestException as exc:
            logger.warning(f"Mempool.space API request failed for {address}: {exc}")
            raise BlockchainFetchError(f"Bitcoin mempool connection failure: {exc}")

    def get_transaction_details(self, tx_hash: str, case_id: Optional[str] = None) -> Dict[str, Any]:
        require_online("get_transaction_details")
        url = f"{self.base_url}/tx/{tx_hash}"
        try:
            resp = requests.get(url, timeout=10)
            resp.raise_for_status()
            data = resp.json()
            if case_id:
                record_raw_evidence(case_id, "btc_client.get_transaction_details", data)
            return data
        except requests.RequestException as exc:
            raise BlockchainFetchError(f"Bitcoin tx fetch failed: {exc}")


_DEFAULT_BTC_CLIENT = BtcClient()


def get_address_transfers(address: str, case_id: Optional[str] = None) -> List[Dict[str, Any]]:
    require_online("get_address_transfers")
    return _DEFAULT_BTC_CLIENT.get_address_transactions(address, case_id=case_id)
