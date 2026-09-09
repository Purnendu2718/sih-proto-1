"""
btc_client.py - Bitcoin UTXO client and simplification logic for CryptoTrace-Sentinel.

Fetches raw multi-input/output transactions from Esplora / Mempool APIs and provides
a heuristic simplification helper to convert UTXO structures into directed graph edges.

NOTE ON FORENSIC ACCURACY:
The simplify_to_transfers() helper is explicitly an approximation designed for
graph-edge visualization and preliminary reachability in cytoscape.
It is NOT intended for definitive legal/evidentiary attribution on its own.
Definitive Bitcoin tracing requires preserving the raw multi-input/multi-output UTXO structure
and applying Common-Input-Ownership-Heuristic (CIOH) and Peeling Chain Analysis
via peeling_chain_analyzer.py.
"""

from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any
import requests
import logging

logger = logging.getLogger(__name__)

# Custom exception hierarchy
class BlockchainClientError(Exception):
    """Base exception for blockchain explorer RPC clients."""
    pass

class BtcClientError(BlockchainClientError):
    """Raised when Bitcoin Esplora or Mempool API query fails."""
    pass

class TronGridError(BlockchainClientError):
    """Raised when TronGrid API query fails."""
    pass

class EvmClientError(BlockchainClientError):
    """Raised when Etherscan/EVM API query fails."""
    pass


@dataclass
class RawBtcVin:
    txid: str
    vout_index: int
    address: Optional[str]
    value_sats: int = 0


@dataclass
class RawBtcVout:
    n: int
    address: Optional[str]
    value_sats: int = 0


@dataclass
class RawBtcTransaction:
    txid: str
    block_time: int
    block_height: Optional[int]
    fee_sats: int
    vin: List[RawBtcVin] = field(default_factory=list)
    vout: List[RawBtcVout] = field(default_factory=list)


@dataclass
class NormalizedTransfer:
    chain: str                     # "BTC"
    chain_id: int                  # 2
    tx_hash: str
    from_address: str
    to_address: str
    amount: float                  # Scaled BTC value (sats / 1e8)
    token_symbol: str = "BTC"
    timestamp_utc: int = 0
    is_primary: bool = False


ESPLORA_API_ENDPOINTS = [
    "https://blockstream.info/api",
    "https://mempool.space/api",
]


def fetch_btc_transactions(address: str, limit: int = 50) -> List[RawBtcTransaction]:
    """
    Fetches raw Bitcoin multi-input/multi-output transactions for the queried address.
    Raises BtcClientError upon timeout or network failure.
    """
    last_error = None
    for base_url in ESPLORA_API_ENDPOINTS:
        url = f"{base_url}/address/{address}/txs"
        try:
            resp = requests.get(url, timeout=12)
            if resp.status_code == 200:
                raw_txs_json = resp.json()[:limit]
                parsed_list: List[RawBtcTransaction] = []

                for item in raw_txs_json:
                    txid = item.get("txid", "")
                    status = item.get("status", {})
                    block_time = status.get("block_time", 0)
                    block_height = status.get("block_height")
                    fee = item.get("fee", 0)

                    vins = []
                    for vin_item in item.get("vin", []):
                        prevout = vin_item.get("prevout") or {}
                        vins.append(RawBtcVin(
                            txid=vin_item.get("txid", ""),
                            vout_index=vin_item.get("vout", 0),
                            address=prevout.get("scriptpubkey_address"),
                            value_sats=prevout.get("value", 0),
                        ))

                    vouts = []
                    for vout_item in item.get("vout", []):
                        vouts.append(RawBtcVout(
                            n=vout_item.get("n", 0),
                            address=vout_item.get("scriptpubkey_address"),
                            value_sats=vout_item.get("value", 0),
                        ))

                    parsed_list.append(RawBtcTransaction(
                        txid=txid,
                        block_time=block_time,
                        block_height=block_height,
                        fee_sats=fee,
                        vin=vins,
                        vout=vouts,
                    ))
                return parsed_list
            else:
                last_error = f"HTTP {resp.status_code} from {base_url}: {resp.text[:120]}"
        except Exception as exc:
            last_error = f"Exception connecting to {base_url}: {str(exc)}"

    raise BtcClientError(f"Failed to fetch Bitcoin transactions for {address}. Root cause: {last_error}")


def fetch_btc_transactions_with_seal(address: str, limit: int = 50):
    """
    Fetches raw Bitcoin multi-input/multi-output transactions and returns a tuple
    of (parsed_list, sealed_evidence) with Section 63 BSA SHA-256 evidence sealing
    captured directly at ingestion time.
    """
    try:
        from app.services.evidence.hash_seal import seal_evidence
    except ImportError:
        from backend.app.services.evidence.hash_seal import seal_evidence

    last_error = None
    for base_url in ESPLORA_API_ENDPOINTS:
        url = f"{base_url}/address/{address}/txs"
        try:
            resp = requests.get(url, timeout=12)
            if resp.status_code == 200:
                raw_txs_json = resp.json()[:limit]
                sealed = seal_evidence(
                    chain="BTC",
                    queried_address=address,
                    raw_payload=raw_txs_json,
                    metadata={"endpoint": url, "limit": limit},
                )
                parsed_list: List[RawBtcTransaction] = []
                for item in raw_txs_json:
                    txid = item.get("txid", "")
                    status = item.get("status", {})
                    block_time = status.get("block_time", 0)
                    block_height = status.get("block_height")
                    fee = item.get("fee", 0)

                    vins = []
                    for vin_item in item.get("vin", []):
                        prevout = vin_item.get("prevout") or {}
                        vins.append(RawBtcVin(
                            txid=vin_item.get("txid", ""),
                            vout_index=vin_item.get("vout", 0),
                            address=prevout.get("scriptpubkey_address"),
                            value_sats=prevout.get("value", 0),
                        ))

                    vouts = []
                    for vout_item in item.get("vout", []):
                        vouts.append(RawBtcVout(
                            n=vout_item.get("n", 0),
                            address=vout_item.get("scriptpubkey_address"),
                            value_sats=vout_item.get("value", 0),
                        ))

                    parsed_list.append(RawBtcTransaction(
                        txid=txid,
                        block_time=block_time,
                        block_height=block_height,
                        fee_sats=fee,
                        vin=vins,
                        vout=vouts,
                    ))
                return parsed_list, sealed
            else:
                last_error = f"HTTP {resp.status_code} from {base_url}: {resp.text[:120]}"
        except Exception as exc:
            last_error = f"Exception connecting to {base_url}: {str(exc)}"

    raise BtcClientError(f"Failed to fetch Bitcoin transactions for {address}. Root cause: {last_error}")


def simplify_to_transfers(raw_tx: RawBtcTransaction, queried_address: str) -> List[NormalizedTransfer]:
    """
    Converts a multi-input/output RawBtcTransaction into NormalizedTransfer objects
    for graph visualization purposes.

    APPROXIMATION DISCLAIMER:
    This simplifies UTXO multi-party flows into pairwise directional edges.
    In Bitcoin, all inputs are aggregated into a single fund pool and distributed
    to outputs. We approximate flows by attributing value based on whether
    the queried address was an input (outbound) or an output (inbound).
    Evidentiary analysis must preserve the complete UTXO object.
    """
    transfers: List[NormalizedTransfer] = []
    
    input_addrs = [vin.address for vin in raw_tx.vin if vin.address]
    output_recipients = [(vout.address, vout.value_sats / 1e8) for vout in raw_tx.vout if vout.address]

    is_sender = queried_address in input_addrs
    is_recipient = any(vout.address == queried_address for vout in raw_tx.vout)

    if is_sender:
        # Fund flow is outbound from queried_address to external outputs (peel / change filtering)
        for dest_addr, btc_amt in output_recipients:
            if dest_addr != queried_address and btc_amt > 0:
                transfers.append(NormalizedTransfer(
                    chain="BTC",
                    chain_id=2,
                    tx_hash=raw_tx.txid,
                    from_address=queried_address,
                    to_address=dest_addr,
                    amount=btc_amt,
                    token_symbol="BTC",
                    timestamp_utc=raw_tx.block_time,
                    is_primary=False,
                ))
    elif is_recipient:
        # Fund flow isInbound to queried_address from inputs
        my_outputs = [vout.value_sats / 1e8 for vout in raw_tx.vout if vout.address == queried_address]
        total_received = sum(my_outputs)
        primary_sender = input_addrs[0] if input_addrs else "Unknown_Sender"
        if total_received > 0:
            transfers.append(NormalizedTransfer(
                chain="BTC",
                chain_id=2,
                tx_hash=raw_tx.txid,
                from_address=primary_sender,
                to_address=queried_address,
                amount=total_received,
                token_symbol="BTC",
                timestamp_utc=raw_tx.block_time,
                is_primary=False,
            ))
    else:
        # General fallback: connect first input to each external output
        src = input_addrs[0] if input_addrs else "Unknown_UTXO_Input"
        for dest_addr, btc_amt in output_recipients:
            if dest_addr != src and btc_amt > 0:
                transfers.append(NormalizedTransfer(
                    chain="BTC",
                    chain_id=2,
                    tx_hash=raw_tx.txid,
                    from_address=src,
                    to_address=dest_addr,
                    amount=btc_amt,
                    token_symbol="BTC",
                    timestamp_utc=raw_tx.block_time,
                    is_primary=False,
                ))

    return transfers
