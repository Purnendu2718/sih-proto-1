"""
base_client.py - Abstract base class for multi-chain RPC and explorer ingestion clients.
"""

from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)


class BlockchainClientError(Exception):
    """Base exception for blockchain API errors."""
    pass


class BaseBlockchainClient(ABC):
    """
    Standard interface for all blockchain transaction ingestion clients.
    Ensures normalized output schema across TRON, EVM, and Bitcoin networks.
    """

    def __init__(self, chain_name: str):
        self.chain_name = chain_name

    @abstractmethod
    def get_address_transactions(self, address: str, limit: int = 50) -> List[Dict[str, Any]]:
        """
        Fetch normalized transfer edges involving the specified address.
        Must return list of dicts with keys:
          'from', 'to', 'amount', 'token', 'token_symbol', 'ts', 'tx', 'chain'
        """
        pass

    @abstractmethod
    def get_transaction_details(self, tx_hash: str) -> Dict[str, Any]:
        """
        Fetch on-chain metadata for an individual transaction hash.
        """
        pass

    def normalize_transfer(
        self,
        from_addr: str,
        to_addr: str,
        amount: float,
        token: str,
        timestamp_utc: int,
        tx_hash: str,
        is_primary: bool = False,
    ) -> Dict[str, Any]:
        """Utility method to enforce standard edge representation."""
        return {
            "from": (from_addr or "").strip(),
            "to": (to_addr or "").strip(),
            "amount": round(float(amount), 6),
            "token": token.upper(),
            "token_symbol": token.upper(),
            "ts": int(timestamp_utc),
            "tx": (tx_hash or "").strip(),
            "chain": self.chain_name,
            "is_primary": is_primary,
        }
