import re
from enum import Enum


class ChainType(str, Enum):
    TRON = "TRON"
    EVM = "EVM"
    BTC = "BTC"
    UNKNOWN = "UNKNOWN"


class InputType(str, Enum):
    ADDRESS = "ADDRESS"
    TX_HASH = "TX_HASH"
    UNKNOWN = "UNKNOWN"


_TRON_ADDR_RE = re.compile(r"^T[a-zA-Z0-9]{25,35}$")
_EVM_ADDR_RE = re.compile(r"^0x[a-fA-F0-9]{40}$")

_EVM_TX_RE = re.compile(r"^0x[a-fA-F0-9]{64}$")
_HEX64_RE = re.compile(r"^[a-fA-F0-9]{64}$")
_BTC_LEGACY_RE = re.compile(r"^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$")
_BTC_BECH32_RE = re.compile(r"^(bc1)[a-z0-9]{25,59}$")


def detect_input(raw: str):
    """Returns (ChainType, InputType). A bare 64-char hex string is
    ambiguous between a TRON and a BTC tx hash — defaults to TRON; let
    the caller accept chain_hint to disambiguate rather than guess."""
    value = raw.strip()

    if _TRON_ADDR_RE.match(value):
        return ChainType.TRON, InputType.ADDRESS
    if _EVM_ADDR_RE.match(value):
        return ChainType.EVM, InputType.ADDRESS
    if _BTC_LEGACY_RE.match(value) or _BTC_BECH32_RE.match(value):
        return ChainType.BTC, InputType.ADDRESS
    if _EVM_TX_RE.match(value):
        return ChainType.EVM, InputType.TX_HASH
    if _HEX64_RE.match(value):
        return ChainType.TRON, InputType.TX_HASH
    return ChainType.UNKNOWN, InputType.UNKNOWN
