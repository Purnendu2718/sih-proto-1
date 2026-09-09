"""
constants.py - Global domain constants for CryptoTrace-Sentinel.
Chain identifiers, address validation patterns, risk scoring weights, and role styling tokens.
"""

# Chain Identifiers
CHAIN_TRON = "TRON"
CHAIN_EVM = "EVM"
CHAIN_BTC = "BTC"

CHAIN_ID_MAP = {
    CHAIN_TRON: 0,
    CHAIN_EVM: 1,
    CHAIN_BTC: 2,
}

# Regex Patterns for Multi-Chain Address and Tx Identification
REGEX_PATTERNS = {
    "TRON_ADDRESS": r"^T[1-9A-HJ-NP-za-km-z]{33}$",
    "EVM_ADDRESS": r"^0x[a-fA-F0-9]{40}$",
    "BTC_ADDRESS": r"^(1|3|bc1)[a-zA-HJ-NP-Z0-9]{25,62}$",
    "TX_HASH": r"^(0x)?[a-fA-F0-9]{64}$",
}

# Standard Decimals per Token
TOKEN_DECIMALS = {
    "USDT": 6,
    "USDC": 6,
    "ETH": 18,
    "WETH": 18,
    "DAI": 18,
    "BTC": 8,
    "WBTC": 8,
    "TRX": 6,
    "BNB": 18,
    "MATIC": 18,
}

# Known Mixers & Privacy Protocols
KNOWN_MIXERS = {
    "0xd90e2f925da726b50c4ed8d0fb90ad053324f31b": {
        "name": "Tornado Cash (ETH Router)",
        "chain": CHAIN_EVM,
        "penalty": 45,
    },
    "0x12d66f87a04a9e220743712ce6d9bb1b5616b8fc": {
        "name": "Tornado Cash: 0.1 ETH",
        "chain": CHAIN_EVM,
        "penalty": 45,
    },
    "0x47ce0c6ed5b0ce3d3a51fdb1c52dc66a7c3c2936": {
        "name": "Tornado Cash: 1 ETH",
        "chain": CHAIN_EVM,
        "penalty": 45,
    },
    "0x910cbd523d972eb0a6f4cae4618ad62622b39dbf": {
        "name": "Tornado Cash: 10 ETH",
        "chain": CHAIN_EVM,
        "penalty": 45,
    },
    "0xa160cdab22496093275589bc33907d35615d19fe": {
        "name": "Tornado Cash: 100 ETH",
        "chain": CHAIN_EVM,
        "penalty": 45,
    },
}

# Risk Scoring Weight Configuration (Sum max = 100)
RISK_WEIGHTS = {
    "MIXER_INTERACTION": 45,    # Direct deposit or withdrawal touching tumbler
    "PEELING_CHAIN": 25,        # 1-in-2-out 80%+ structuring behavior
    "HIGH_VELOCITY": 20,        # Fund hops occurring in < 30 minutes
    "OFF_RAMP_PROXIMITY": 15,   # Shortest hop distance <= 2 to CEX
}

# Role Definitions & Color Tokens for Forensic Graph
ROLE_COLORS = {
    "victim": "#10B981",          # Emerald Green
    "mule": "#F59E0B",            # Amber
    "mixer": "#EF4444",           # Red
    "exchange_deposit": "#06B6D4", # Cyan
    "exchange_hotwallet": "#8B5CF6", # Purple
    "peel_outlet": "#64748B",     # Slate Gray
    "unknown": "#6B7280",         # Muted Gray
}

# Statutory Compliance Constants
GOLDEN_HOUR_SLA_HOURS = 2
DEFAULT_USD_TO_INR_RATE = 87.50
LEGAL_STATUTE_BNSS = "Section 94, Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS) [Formerly Section 91 CrPC]"
LEGAL_STATUTE_BSA = "Section 63, Bharatiya Sakshya Adhiniyam, 2023 (BSA) [Formerly Section 65B IEA]"
