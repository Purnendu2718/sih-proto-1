from dataclasses import dataclass
from typing import Optional


@dataclass
class TxEdgeInput:
    from_addr: str
    to_addr: str
    amount: float
    timestamp_utc: int
    tx_hash: str
    chain_id: int  # 0=TRON, 1=EVM, 2=BTC


@dataclass
class NormalizedTx:
    chain: str                     # "TRON", "EVM", "BTC"
    chain_id: int                  # 0, 1, 2
    tx_hash: str                   # 0x... or hex txid
    from_address: str              # Normalized base58 (TRON) or 0x (EVM) or bech32/base58 (BTC)
    to_address: str
    amount: float                  # Decimal scaled amount
    raw_value: str                 # Exact integer unit string from RPC
    token_symbol: str              # "USDT", "USDC", "ETH", "TRX", "BTC"
    timestamp_utc: int             # Unix epoch in seconds
    block_height: Optional[int] = None
    is_confirmed: bool = True
