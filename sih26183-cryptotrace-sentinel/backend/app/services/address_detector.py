from enum import Enum
from typing import Tuple


class ChainType(str, Enum):
    TRON = "TRON"
    EVM = "EVM"
    BTC = "BTC"


def detect_input(address: str) -> Tuple[ChainType, str]:
    addr = (address or "").strip()
    if addr.startswith("T") and len(addr) == 34:
        return ChainType.TRON, "address"
    if addr.startswith("0x") and len(addr) == 42:
        return ChainType.EVM, "address"
    if addr.startswith(("1", "3", "bc1")):
        return ChainType.BTC, "address"
    if addr.startswith("0x"):
        return ChainType.EVM, "address"
    return ChainType.TRON, "address"
