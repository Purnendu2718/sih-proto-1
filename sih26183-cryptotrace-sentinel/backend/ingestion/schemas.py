from dataclasses import dataclass


@dataclass
class TxEdgeInput:
    from_addr: str
    to_addr: str
    amount: float
    timestamp_utc: int
    tx_hash: str
    chain_id: int
