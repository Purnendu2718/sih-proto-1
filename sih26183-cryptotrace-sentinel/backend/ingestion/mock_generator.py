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
    mule2 = "TMule000002XXXXXXXXXXXXXXXXXXXXXXX"
    mule3 = "TMule000003XXXXXXXXXXXXXXXXXXXXXXX"
    deposit = "TCoinDCXDeposit0001XXXXXXXXXXXXXXXX"
    hotwallet = "TCoinDCXHotWallet01XXXXXXXXXXXXXXXX"

    edges = [
        {"from": victim, "to": mule1, "amount": 5000.0, "ts": base_ts, "tx": _tx_hash("e1"), "token_symbol": "USDT"},
        {"from": mule1, "to": mule2, "amount": 4950.0, "ts": base_ts + 600, "tx": _tx_hash("e2"), "token_symbol": "USDT"},
        {"from": mule2, "to": mule3, "amount": 4900.0, "ts": base_ts + 1500, "tx": _tx_hash("e3"), "token_symbol": "USDT"},
        {"from": mule3, "to": deposit, "amount": 4850.0, "ts": base_ts + 2400, "tx": _tx_hash("e4"), "token_symbol": "USDT"},
        {"from": deposit, "to": hotwallet, "amount": 4850.0, "ts": base_ts + 3300, "tx": _tx_hash("e5"), "token_symbol": "USDT"},
    ]
    scenario = {
        "case_name": "task_scam_tron_usdt",
        "description": "Telegram task-scam victim funds routed via 3 TRON mule wallets into a CoinDCX-style USDT deposit address, swept into the exchange hot wallet.",
        "victim_address": victim, "chain": "TRON",
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
    mule2 = "0xMule00000000000000000000000000000002"
    deposit = "0xBinanceDeposit0000000000000000000001"
    hotwallet = "0xBinanceHotWallet000000000000000000001"

    edges = [
        {"from": victim, "to": mule1, "amount": 12000.0, "ts": base_ts, "tx": _tx_hash("f1"), "token_symbol": "USDT"},
        {"from": mule1, "to": mule2, "amount": 11700.0, "ts": base_ts + 900, "tx": _tx_hash("f2"), "token_symbol": "USDT"},
        {"from": mule2, "to": deposit, "amount": 11500.0, "ts": base_ts + 2100, "tx": _tx_hash("f3"), "token_symbol": "USDT"},
        {"from": deposit, "to": hotwallet, "amount": 11500.0, "ts": base_ts + 3000, "tx": _tx_hash("f4"), "token_symbol": "USDT"},
    ]
    scenario = {
        "case_name": "investment_scam_eth",
        "description": "Pig-butchering investment-scam victim funds routed via 2 EVM mule wallets into a Binance-style USDT deposit address, swept into the exchange hot wallet.",
        "victim_address": victim, "chain": "EVM",
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
    print("Mock fraud scenarios written to sample_cases/")
