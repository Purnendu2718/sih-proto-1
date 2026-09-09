import logging
from typing import List, Dict, Any, Tuple
from .schemas import TxEdgeInput
from .tron_ingest import fetch_trc20_transfers
from .evm_ingest import fetch_erc20_transfers
from .btc_ingest import fetch_btc_transfers

logger = logging.getLogger(__name__)


def ingest_address_activity(address: str, chain: str, limit: int = 50) -> Tuple[List[TxEdgeInput], str]:
    """
    Attempts live query against public blockchain explorers (TronGrid, Etherscan, Blockstream Esplora).
    Returns (edges, mode_used: 'LIVE_RPC' or 'OFFLINE_FALLBACK').
    """
    chain_upper = chain.upper()
    try:
        if chain_upper == "TRON":
            edges = fetch_trc20_transfers(address, limit=limit)
            if edges:
                return edges, "LIVE_RPC"
        elif chain_upper == "EVM":
            edges = fetch_erc20_transfers(address, limit=limit)
            if edges:
                return edges, "LIVE_RPC"
        elif chain_upper == "BTC":
            edges = fetch_btc_transfers(address, limit=limit)
            if edges:
                return edges, "LIVE_RPC"
    except Exception as exc:
        logger.warning(f"Live query failed for {chain} address {address}: {exc}. Resorting to offline scenario.")

    return [], "OFFLINE_FALLBACK"
