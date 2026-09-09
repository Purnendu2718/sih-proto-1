import json
import hashlib
import time
from pathlib import Path

OUTPUT_DIR = Path(__file__).resolve().parent.parent.parent / "sample_cases"


def _tx_hash(seed: str) -> str:
    return "0x" + hashlib.sha256(seed.encode()).hexdigest()[:40]


def generate_task_scam_tron_usdt():
    base_ts = int(time.time()) - 3600 * 3
    victim = "TVictim0001XXXXXXXXXXXXXXXXXXXXXXX"
    mule1 = "TMule000001XXXXXXXXXXXXXXXXXXXXXXX"
    peel1 = "TPeelDustMule01XXXXXXXXXXXXXXXXXXX"
    mule2 = "TMule000002XXXXXXXXXXXXXXXXXXXXXXX"
    peel2 = "TP2POfframpMule02XXXXXXXXXXXXXXXXX"
    recon = "TReconsolidation03XXXXXXXXXXXXXXXX"
    deposit = "TCoinDCXDeposit0001XXXXXXXXXXXXXXXX"
    hotwallet = "TCoinDCXHotWallet01XXXXXXXXXXXXXXXX"

    # Multi-branch laundering graph:
    # 1. Primary path: Victim -> Mule 1 -> Mule 2 -> Reconsolidation -> CoinDCX Deposit -> Hot Wallet
    # 2. Decoy peel 1: Mule 1 peels $150 dust to unlabelled dead-end wallet (structuring)
    # 3. Decoy peel 2: Mule 2 peels $200 dust to P2P offramp mule
    edges = [
        # Primary Conduit
        {"from": victim, "to": mule1, "amount": 5000.0, "ts": base_ts, "tx": _tx_hash("e1_prim"), "chain": "TRON", "token": "USDT", "is_primary": True},
        {"from": mule1, "to": mule2, "amount": 4850.0, "ts": base_ts + 420, "tx": _tx_hash("e2_prim"), "chain": "TRON", "token": "USDT", "is_primary": True},
        {"from": mule2, "to": recon, "amount": 4650.0, "ts": base_ts + 1020, "tx": _tx_hash("e3_prim"), "chain": "TRON", "token": "USDT", "is_primary": True},
        {"from": recon, "to": deposit, "amount": 4650.0, "ts": base_ts + 1680, "tx": _tx_hash("e4_prim"), "chain": "TRON", "token": "USDT", "is_primary": True},
        {"from": deposit, "to": hotwallet, "amount": 4650.0, "ts": base_ts + 2240, "tx": _tx_hash("e5_sweep"), "chain": "TRON", "token": "USDT", "is_primary": True},
        # Decoy Peel Branches (Structuring / Dusting)
        {"from": mule1, "to": peel1, "amount": 150.0, "ts": base_ts + 480, "tx": _tx_hash("e1_peel"), "chain": "TRON", "token": "USDT", "is_primary": False},
        {"from": mule2, "to": peel2, "amount": 200.0, "ts": base_ts + 1100, "tx": _tx_hash("e2_peel"), "chain": "TRON", "token": "USDT", "is_primary": False},
    ]

    scenario = {
        "case_name": "task_scam_tron_usdt",
        "chain": "TRON",
        "description": "Telegram task fraud with layered multi-branch peeling chain into CoinDCX deposit.",
        "victim_address": victim,
        "known_exchange_hot_wallets": [hotwallet],
        "known_exchange_deposit_addresses": [deposit],
        "edges": edges,
    }
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_DIR / "task_scam_tron_usdt.json", "w") as f:
        json.dump(scenario, f, indent=2)
    return scenario


def generate_investment_scam_eth():
    base_ts = int(time.time()) - 3600 * 2
    victim = "0xVictim0000000000000000000000000000001"
    mule1 = "0xMule00000000000000000000000000000001"
    peel1 = "0xMixerPoolCandidate000000000000000001"
    mule2 = "0xMule00000000000000000000000000000002"
    recon = "0xAggregatorMule0000000000000000000001"
    deposit = "0xBinanceDeposit0000000000000000000001"
    hotwallet = "0xBinanceHotWallet000000000000000000001"

    edges = [
        {"from": victim, "to": mule1, "amount": 12000.0, "ts": base_ts, "tx": _tx_hash("eth_e1"), "chain": "EVM", "token": "USDT", "is_primary": True},
        {"from": mule1, "to": mule2, "amount": 11500.0, "ts": base_ts + 600, "tx": _tx_hash("eth_e2"), "chain": "EVM", "token": "USDT", "is_primary": True},
        {"from": mule1, "to": peel1, "amount": 500.0, "ts": base_ts + 640, "tx": _tx_hash("eth_peel1"), "chain": "EVM", "token": "USDT", "is_primary": False},
        {"from": mule2, "to": recon, "amount": 11500.0, "ts": base_ts + 1300, "tx": _tx_hash("eth_e3"), "chain": "EVM", "token": "USDT", "is_primary": True},
        {"from": recon, "to": deposit, "amount": 11500.0, "ts": base_ts + 1900, "tx": _tx_hash("eth_e4"), "chain": "EVM", "token": "USDT", "is_primary": True},
        {"from": deposit, "to": hotwallet, "amount": 11500.0, "ts": base_ts + 2500, "tx": _tx_hash("eth_sweep"), "chain": "EVM", "token": "USDT", "is_primary": True},
    ]

    scenario = {
        "case_name": "investment_scam_eth",
        "chain": "EVM",
        "description": "Pig-butchering romance scam laundering through EVM mules into Binance deposit.",
        "victim_address": victim,
        "known_exchange_hot_wallets": [hotwallet],
        "known_exchange_deposit_addresses": [deposit],
        "edges": edges,
    }
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_DIR / "investment_scam_eth.json", "w") as f:
        json.dump(scenario, f, indent=2)
    return scenario


if __name__ == "__main__":
    generate_task_scam_tron_usdt()
    generate_investment_scam_eth()
    print("Multi-branch fraud topologies written to sample_cases/")
