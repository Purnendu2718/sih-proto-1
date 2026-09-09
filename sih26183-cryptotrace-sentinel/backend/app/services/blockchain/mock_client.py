"""
mock_client.py - Deterministic offline multi-branch simulation generator.
Provides calibrated, institutional fraud scenarios for TRON (Task Scam), EVM (Pig Butchering),
and Polygon/EVM (Loan App Extortion Syndicate).
"""

from typing import Dict, Any, List, Optional
import time
import copy
import json
import logging
from pathlib import Path
from .base_client import BaseBlockchainClient

logger = logging.getLogger(__name__)

BASE_TIMESTAMP = 1788887400  # Reference epoch (UTC)

SAMPLE_CASES_DIR = Path(__file__).resolve().parents[4] / "sample_cases"
if not SAMPLE_CASES_DIR.exists():
    alt_dir = Path(__file__).resolve().parents[3] / "sample_cases"
    if alt_dir.exists():
        SAMPLE_CASES_DIR = alt_dir


def _load_scenario_from_disk(scenario_name: str) -> Optional[Dict[str, Any]]:
    """Attempt to load scenario JSON directly from sample_cases/ directory."""
    if not SAMPLE_CASES_DIR.exists():
        return None
    target_file = SAMPLE_CASES_DIR / f"{scenario_name}.json"
    if target_file.exists():
        try:
            with open(target_file, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            logger.warning(f"Failed to read disk scenario {target_file}: {e}")
    return None


# =====================================================================
# 1. DATASET A: TRON Task Scam
# =====================================================================
TASK_SCAM_TRON: Dict[str, Any] = {
    "scenario_id": "task_scam_tron_usdt",
    "case_name": "task_scam_tron_usdt",
    "title": "TRON Telegram Cyber Task Scam",
    "chain": "TRON",
    "network": "TRON (TRC-20 USDT)",
    "loss_usd": 4850.0,
    "loss_inr": "₹4,05,000",
    "typology": "Telegram Task Fraud / High-Velocity Mule Chain",
    "victim_address": "TVictim0001TRONTaskScamXXXXXXXXX",
    "stolen_amount": 4850.0,
    "token": "USDT",
    "token_symbol": "USDT",
    "destination_vasp": "CoinDCX",
    "destination_sla_hours": 2,
    "destination_compliance_email": "compliance@coindcx.com",
    "target_deposit_wallet": "TCoinDCXDeposit0001XXXXXXXXXXXXXXXX",
    "terminal_hot_wallet": "TCoinDCXHotWallet01XXXXXXXXXXXXXXXX",
    "known_exchange_deposit_addresses": ["TCoinDCXDeposit0001XXXXXXXXXXXXXXXX"],
    "known_exchange_hot_wallets": ["TCoinDCXHotWallet01XXXXXXXXXXXXXXXX"],
    "edges": [
        # Core Path (Most Predictive Web)
        {
            "from": "TVictim0001TRONTaskScamXXXXXXXXX",
            "to": "TMule0001TaskChainLayerXXXXXXXXXX",
            "amount": 4850.0,
            "ts": BASE_TIMESTAMP,
            "tx": "0xec4eee61b996f2cc8828558177bc2b6966f294cc",
            "token": "USDT",
            "token_symbol": "USDT",
            "chain": "TRON",
            "is_primary": True,
            "isCorePath": True,
            "parentBoxId": "core-path",
        },
        {
            "from": "TMule0001TaskChainLayerXXXXXXXXXX",
            "to": "TMule0002TaskChainLayerXXXXXXXXXX",
            "amount": 4600.0,
            "ts": BASE_TIMESTAMP + 420,
            "tx": "0x9376e40ceb18aca348897a243ccf1574ddde974a",
            "token": "USDT",
            "token_symbol": "USDT",
            "chain": "TRON",
            "is_primary": True,
            "isCorePath": True,
            "parentBoxId": "core-path",
        },
        {
            "from": "TMule0002TaskChainLayerXXXXXXXXXX",
            "to": "TCoinDCXDeposit0001XXXXXXXXXXXXXXXX",
            "amount": 4500.0,
            "ts": BASE_TIMESTAMP + 1020,
            "tx": "0x365b62f7d04b01987baca72daf1600fc47154547",
            "token": "USDT",
            "token_symbol": "USDT",
            "chain": "TRON",
            "is_primary": True,
            "isCorePath": True,
            "parentBoxId": "core-path",
        },
        {
            "from": "TCoinDCXDeposit0001XXXXXXXXXXXXXXXX",
            "to": "TCoinDCXHotWallet01XXXXXXXXXXXXXXXX",
            "amount": 4500.0,
            "ts": BASE_TIMESTAMP + 1620,
            "tx": "0x454b14b55b85838c7d6ad5676b2682ca6ab595d1",
            "token": "USDT",
            "token_symbol": "USDT",
            "chain": "TRON",
            "is_primary": True,
            "isCorePath": True,
            "parentBoxId": "core-path",
        },
        # Background Decoy Peeling & Energy Gas Funding
        {
            "from": "TEnergyRental01XXXXXXXXXXXXXXX",
            "to": "TMule0001TaskChainLayerXXXXXXXXXX",
            "amount": 15.0,
            "ts": BASE_TIMESTAMP - 50,
            "tx": "0xfee01_tron_energy_refuel_0001",
            "token": "TRX",
            "token_symbol": "TRX",
            "chain": "TRON",
            "is_primary": False,
            "isCorePath": False,
            "parentBoxId": "gas-refill",
        },
        {
            "from": "TMule0001TaskChainLayerXXXXXXXXXX",
            "to": "TPeelDust01XXXXXXXXXXXXXXXXXXX",
            "amount": 125.0,
            "ts": BASE_TIMESTAMP + 440,
            "tx": "0xpeel01_mule1_split95_5a",
            "token": "USDT",
            "token_symbol": "USDT",
            "chain": "TRON",
            "is_primary": False,
            "isCorePath": False,
            "parentBoxId": "peel-structuring",
        },
        {
            "from": "TMule0001TaskChainLayerXXXXXXXXXX",
            "to": "TPeelDust02XXXXXXXXXXXXXXXXXXX",
            "amount": 125.0,
            "ts": BASE_TIMESTAMP + 450,
            "tx": "0xpeel02_mule1_split95_5b",
            "token": "USDT",
            "token_symbol": "USDT",
            "chain": "TRON",
            "is_primary": False,
            "isCorePath": False,
            "parentBoxId": "peel-structuring",
        },
        {
            "from": "TMule0002TaskChainLayerXXXXXXXXXX",
            "to": "TPeelDust03XXXXXXXXXXXXXXXXXXX",
            "amount": 50.0,
            "ts": BASE_TIMESTAMP + 1030,
            "tx": "0xpeel03_mule2_split98_2a",
            "token": "USDT",
            "token_symbol": "USDT",
            "chain": "TRON",
            "is_primary": False,
            "isCorePath": False,
            "parentBoxId": "peel-structuring",
        },
        {
            "from": "TMule0002TaskChainLayerXXXXXXXXXX",
            "to": "TPeelDust04XXXXXXXXXXXXXXXXXXX",
            "amount": 50.0,
            "ts": BASE_TIMESTAMP + 1040,
            "tx": "0xpeel04_mule2_split98_2b",
            "token": "USDT",
            "token_symbol": "USDT",
            "chain": "TRON",
            "is_primary": False,
            "isCorePath": False,
            "parentBoxId": "peel-structuring",
        },
    ],
}

# =====================================================================
# 2. DATASET B: EVM Pig-Butchering
# =====================================================================
INVESTMENT_SCAM_EVM: Dict[str, Any] = {
    "scenario_id": "investment_scam_eth",
    "case_name": "investment_scam_eth",
    "title": "EVM Pig-Butchering Investment Fraud",
    "chain": "EVM",
    "network": "Ethereum / EVM",
    "loss_usd": 12500.0,
    "loss_inr": "₹10,45,000",
    "typology": "Romance / Fake Liquidity Mining Scam with Mixer Evasion",
    "victim_address": "0xVictim0002PigButcherDeFiXXXXXXX",
    "stolen_amount": 12500.0,
    "token": "USDT",
    "token_symbol": "USDT",
    "destination_vasp": "Binance",
    "destination_sla_hours": 4,
    "destination_compliance_email": "case@binance.com",
    "target_deposit_wallet": "0xBinanceDeposit000000000000000000000001",
    "terminal_hot_wallet": "0xBinanceHotWallet000000000000000000001",
    "known_exchange_deposit_addresses": ["0xBinanceDeposit000000000000000000000001"],
    "known_exchange_hot_wallets": ["0xBinanceHotWallet000000000000000000001"],
    "edges": [
        # Core Path (Most Predictive Web)
        {
            "from": "0xVictim0002PigButcherDeFiXXXXXXX",
            "to": "0xMuleLayerA0000000000000000000000001",
            "amount": 12500.0,
            "ts": BASE_TIMESTAMP,
            "tx": "0xb111111111111111111111111111111111111111111111111111111111111111",
            "token": "USDT",
            "token_symbol": "USDT",
            "chain": "EVM",
            "is_primary": True,
            "isCorePath": True,
            "parentBoxId": "core-path",
        },
        {
            "from": "0xMuleLayerA0000000000000000000000001",
            "to": "0xMuleLayerB0000000000000000000000002",
            "amount": 11500.0,
            "ts": BASE_TIMESTAMP + 480,
            "tx": "0xb222222222222222222222222222222222222222222222222222222222222222",
            "token": "USDT",
            "token_symbol": "USDT",
            "chain": "EVM",
            "is_primary": True,
            "isCorePath": True,
            "parentBoxId": "core-path",
        },
        {
            "from": "0xMuleLayerB0000000000000000000000002",
            "to": "0xBinanceDeposit000000000000000000000001",
            "amount": 11500.0,
            "ts": BASE_TIMESTAMP + 1200,
            "tx": "0xb333333333333333333333333333333333333333333333333333333333333333",
            "token": "USDT",
            "token_symbol": "USDT",
            "chain": "EVM",
            "is_primary": True,
            "isCorePath": True,
            "parentBoxId": "core-path",
        },
        {
            "from": "0xBinanceDeposit000000000000000000000001",
            "to": "0xBinanceHotWallet000000000000000000001",
            "amount": 11500.0,
            "ts": BASE_TIMESTAMP + 1800,
            "tx": "0xb444444444444444444444444444444444444444444444444444444444444444",
            "token": "USDT",
            "token_symbol": "USDT",
            "chain": "EVM",
            "is_primary": True,
            "isCorePath": True,
            "parentBoxId": "core-path",
        },
        # Background: Tornado Cash & DEX Routing
        {
            "from": "0xMuleLayerA0000000000000000000000001",
            "to": "0xd90e2f925da726b50c4ed8d0fb90ad053324f31b",
            "amount": 1000.0,
            "ts": BASE_TIMESTAMP + 500,
            "tx": "0xmixer01_tornado_cash_deposit_1000u",
            "token": "USDT",
            "token_symbol": "USDT",
            "chain": "EVM",
            "is_primary": False,
            "isCorePath": False,
            "parentBoxId": "mixer-evasion",
        },
    ],
}

# =====================================================================
# 3. DATASET C: Loan App Extortion Syndicate
# =====================================================================
LOAN_SYNDICATE_MULTICEX: Dict[str, Any] = {
    "scenario_id": "loan_syndicate_multicex",
    "case_name": "loan_syndicate_multicex",
    "title": "Predatory Loan App Extortion Syndicate",
    "chain": "EVM",
    "network": "Polygon / EVM",
    "loss_usd": 8200.0,
    "loss_inr": "₹6,85,000",
    "typology": "Predatory Loan App / Multi-CEX Splitting Syndicate",
    "victim_address": "0xVictim0003LoanAppExtortionXXXXX",
    "stolen_amount": 8200.0,
    "token": "USDT",
    "token_symbol": "USDT",
    "destination_vasp": "Dual Off-Ramp (WazirX & ZebPay)",
    "destination_sla_hours": 2,
    "destination_compliance_email": "nodal@wazirx.com, compliance@zebpay.com",
    "target_deposit_wallet": "0xWazirXDeposit000000000000000000000001",
    "terminal_hot_wallet": "0xWazirXHotWallet000000000000000000001",
    "known_exchange_deposit_addresses": [
        "0xWazirXDeposit000000000000000000000001",
        "0xZebPayDeposit0000000000000000000000001",
    ],
    "known_exchange_hot_wallets": [
        "0xWazirXHotWallet000000000000000000001",
        "0xZebPayHotWallet00000000000000000000001",
    ],
    "edges": [
        # Core Path 1 & 2
        {
            "from": "0xVictim0003LoanAppExtortionXXXXX",
            "to": "0xSyndicateDistributor00000000000001",
            "amount": 8200.0,
            "ts": BASE_TIMESTAMP,
            "tx": "0xext01_victim_extortion_usdt_primary",
            "token": "USDT",
            "token_symbol": "USDT",
            "chain": "EVM",
            "is_primary": True,
            "isCorePath": True,
            "parentBoxId": "core-path",
        },
        {
            "from": "0xSyndicateDistributor00000000000001",
            "to": "0xMuleWazirX00000000000000000000000001",
            "amount": 5000.0,
            "ts": BASE_TIMESTAMP + 300,
            "tx": "0xext02_split_wazirx_conduit_5000",
            "token": "USDT",
            "token_symbol": "USDT",
            "chain": "EVM",
            "is_primary": True,
            "isCorePath": True,
            "parentBoxId": "core-path",
        },
        {
            "from": "0xMuleWazirX00000000000000000000000001",
            "to": "0xWazirXDeposit000000000000000000000001",
            "amount": 5000.0,
            "ts": BASE_TIMESTAMP + 900,
            "tx": "0xext03_wazirx_deposit_5000",
            "token": "USDT",
            "token_symbol": "USDT",
            "chain": "EVM",
            "is_primary": True,
            "isCorePath": True,
            "parentBoxId": "core-path",
        },
        {
            "from": "0xWazirXDeposit000000000000000000000001",
            "to": "0xWazirXHotWallet000000000000000000001",
            "amount": 5000.0,
            "ts": BASE_TIMESTAMP + 1500,
            "tx": "0xext04_wazirx_sweep_to_hotwallet",
            "token": "USDT",
            "token_symbol": "USDT",
            "chain": "EVM",
            "is_primary": True,
            "isCorePath": True,
            "parentBoxId": "core-path",
        },
        {
            "from": "0xSyndicateDistributor00000000000001",
            "to": "0xMuleZebPay00000000000000000000000001",
            "amount": 3200.0,
            "ts": BASE_TIMESTAMP + 310,
            "tx": "0xext05_split_zebpay_conduit_3200",
            "token": "USDT",
            "token_symbol": "USDT",
            "chain": "EVM",
            "is_primary": True,
            "isCorePath": True,
            "parentBoxId": "core-path",
        },
        {
            "from": "0xMuleZebPay00000000000000000000000001",
            "to": "0xZebPayDeposit0000000000000000000000001",
            "amount": 3200.0,
            "ts": BASE_TIMESTAMP + 920,
            "tx": "0xext06_zebpay_deposit_3200",
            "token": "USDT",
            "token_symbol": "USDT",
            "chain": "EVM",
            "is_primary": True,
            "isCorePath": True,
            "parentBoxId": "core-path",
        },
        {
            "from": "0xZebPayDeposit0000000000000000000000001",
            "to": "0xZebPayHotWallet00000000000000000000001",
            "amount": 3200.0,
            "ts": BASE_TIMESTAMP + 1520,
            "tx": "0xext07_zebpay_sweep_to_hotwallet",
            "token": "USDT",
            "token_symbol": "USDT",
            "chain": "EVM",
            "is_primary": True,
            "isCorePath": True,
            "parentBoxId": "core-path",
        },
    ],
}

BTC_RANSOMWARE: Dict[str, Any] = {
    "scenario_id": "btc_ransomware",
    "title": "Critical Infrastructure Ransomware Extortion & WazirX Deposit",
    "chain": "BTC",
    "victim_address": "1Victim000000000000000000000000001",
    "stolen_amount": 0.45,
    "token": "BTC",
    "token_symbol": "BTC",
    "destination_vasp": "WazirX",
    "target_deposit_wallet": "1WazirXDeposit111111111111111111111",
    "terminal_hot_wallet": "1WazirXHotWallet11111111111111111",
    "known_exchange_deposit_addresses": ["1WazirXDeposit111111111111111111111"],
    "known_exchange_hot_wallets": ["1WazirXHotWallet11111111111111111"],
    "edges": [
        {
            "from": "1Victim000000000000000000000000001",
            "to": "1Mule000000000000000000000000000001",
            "amount": 0.45,
            "ts": BASE_TIMESTAMP,
            "tx": "0xc111111111111111111111111111111111111111111111111111111111111111",
            "token": "BTC",
            "token_symbol": "BTC",
            "chain": "BTC",
            "is_primary": True,
            "isCorePath": True,
            "parentBoxId": "core-path",
        },
        {
            "from": "1Mule000000000000000000000000000001",
            "to": "1Mule000000000000000000000000000002",
            "amount": 0.42,
            "ts": BASE_TIMESTAMP + 600,
            "tx": "0xc222222222222222222222222222222222222222222222222222222222222222",
            "token": "BTC",
            "token_symbol": "BTC",
            "chain": "BTC",
            "is_primary": True,
            "isCorePath": True,
            "parentBoxId": "core-path",
        },
        {
            "from": "1Mule000000000000000000000000000001",
            "to": "1Peel000000000000000000000000000001",
            "amount": 0.03,
            "ts": BASE_TIMESTAMP + 600,
            "tx": "0xc222peel00000000000000000000000000000000000000000000000000000001",
            "token": "BTC",
            "token_symbol": "BTC",
            "chain": "BTC",
            "is_primary": False,
            "isCorePath": False,
            "parentBoxId": "peel-structuring",
        },
        {
            "from": "1Mule000000000000000000000000000002",
            "to": "1WazirXDeposit111111111111111111111",
            "amount": 0.42,
            "ts": BASE_TIMESTAMP + 1400,
            "tx": "0xc333333333333333333333333333333333333333333333333333333333333333",
            "token": "BTC",
            "token_symbol": "BTC",
            "chain": "BTC",
            "is_primary": True,
            "isCorePath": True,
            "parentBoxId": "core-path",
        },
        {
            "from": "1WazirXDeposit111111111111111111111",
            "to": "1WazirXHotWallet11111111111111111",
            "amount": 0.42,
            "ts": BASE_TIMESTAMP + 2200,
            "tx": "0xc444444444444444444444444444444444444444444444444444444444444444",
            "token": "BTC",
            "token_symbol": "BTC",
            "chain": "BTC",
            "is_primary": True,
            "isCorePath": True,
            "parentBoxId": "core-path",
        },
    ],
}

SCENARIOS: Dict[str, Dict[str, Any]] = {
    "task_scam_tron": TASK_SCAM_TRON,
    "task_scam_tron_usdt": TASK_SCAM_TRON,
    "investment_scam_eth": INVESTMENT_SCAM_EVM,
    "loan_syndicate_multicex": LOAN_SYNDICATE_MULTICEX,
    "btc_ransomware": BTC_RANSOMWARE,
    "btc_ransomware_scenario": BTC_RANSOMWARE,
}


def get_available_scenarios() -> List[Dict[str, Any]]:
    """Return list of pre-calibrated institutional fraud presets for demo evaluation."""
    return [
        {
            "id": "inr_480k_coindcx_scam",
            "title": "₹4.8L CoinDCX Fraud",
            "network": "Ethereum / EVM",
            "chain": "EVM",
            "target_address": "0xVICTIM_480K_FRAUD_7b93a2c4e1",
            "loss_usd": 5750.0,
            "loss_inr": "₹4,80,000",
            "typology": "Flagship Cyber-Fraud Mule Trail / Dynamic CoinDCX Hot-Wallet Sweep",
            "destination_vasp": "CoinDCX",
            "button_label": "⚡ Case 4: ₹4.8L CoinDCX ($5.7K)",
            "badge_color": "purple",
        },
        {
            "id": "synthetic_master_case",
            "title": "Master Omnichain Fraud",
            "network": "Ethereum / Stargate / Polygon",
            "chain": "EVM",
            "target_address": "0xVictimMasterCyberFraud_01124a",
            "loss_usd": 24500.0,
            "loss_inr": "₹20,50,000",
            "typology": "Omnichain Laundering / Bridge / Privacy Pool / Dynamic Sweep",
            "destination_vasp": "Binance",
            "button_label": "⚡ Case 1: Omnichain Master ($24.5K)",
            "badge_color": "rose",
        },
        {
            "id": "coinjoin_forensics_case",
            "title": "Bitcoin CoinJoin Extortion",
            "network": "Bitcoin Mainnet (UTXO)",
            "chain": "BTC",
            "target_address": "1VictimBtcExtortionWallet_9941a",
            "loss_usd": 18200.0,
            "loss_inr": "₹15,20,000",
            "typology": "Ransomware Extortion / Whirlpool CoinJoin / Post-Mix Consolidation",
            "destination_vasp": "WazirX",
            "button_label": "⚡ Case 2: CoinJoin Forensics (0.28 BTC)",
            "badge_color": "amber",
        },
        {
            "id": "cross_chain_dex_case",
            "title": "Cross-Chain DEX Swap",
            "network": "Ethereum / Wormhole / BSC",
            "chain": "EVM",
            "target_address": "0xVictimCrossChainBridge_1944a",
            "loss_usd": 15000.0,
            "loss_inr": "₹12,50,000",
            "typology": "Cross-Chain Interop / Wormhole Portal Bridge / PancakeSwap DEX Swap",
            "destination_vasp": "Binance",
            "button_label": "⚡ Case 3: Cross-Chain DEX ($15.0K)",
            "badge_color": "cyan",
        },
        {
            "id": "task_scam_tron_usdt",
            "title": "TRON Task Scam",
            "network": "TRON (TRC-20 USDT)",
            "chain": "TRON",
            "target_address": "TVictim0001TRONTaskScamXXXXXXXXX",
            "loss_usd": 4850.0,
            "loss_inr": "₹4,05,000",
            "typology": "Telegram Task Fraud / High-Velocity Mule Chain",
            "destination_vasp": "CoinDCX",
            "button_label": "⚡ TRON Task Scam ($4.8K)",
            "badge_color": "cyan",
        },
        {
            "id": "investment_scam_eth",
            "title": "EVM Pig-Butchering",
            "network": "Ethereum / EVM",
            "chain": "EVM",
            "target_address": "0xVictim0002PigButcherDeFiXXXXXXX",
            "loss_usd": 12500.0,
            "loss_inr": "₹10,45,000",
            "typology": "Romance / Fake Liquidity Mining Scam with Mixer Evasion",
            "destination_vasp": "Binance",
            "button_label": "⚡ EVM Pig-Butchering ($12.5K)",
            "badge_color": "rose",
        },
        {
            "id": "loan_syndicate_multicex",
            "title": "Syndicate Multi-CEX",
            "network": "Polygon / EVM",
            "chain": "EVM",
            "target_address": "0xVictim0003LoanAppExtortionXXXXX",
            "loss_usd": 8200.0,
            "loss_inr": "₹6,85,000",
            "typology": "Predatory Loan App / Multi-CEX Splitting Syndicate",
            "destination_vasp": "Dual Off-Ramp (WazirX & ZebPay)",
            "button_label": "⚡ Syndicate Multi-CEX ($8.2K)",
            "badge_color": "amber",
        },
    ]


def get_mock_scenario(scenario_key: str) -> Dict[str, Any]:
    """
    Retrieve calibrated multi-branch simulation scenario.
    Prioritizes disk sample_cases/ JSON, falling back to static fixtures.
    Guarantees parentBoxId and isCorePath are populated on all nodes/edges.
    """
    clean_key = (scenario_key or "").strip().lower().replace(".json", "")
    
    # 1. Attempt loading rich disk file
    disk_sc = _load_scenario_from_disk(clean_key)
    if disk_sc:
        sc = copy.deepcopy(disk_sc)
    elif clean_key in SCENARIOS:
        sc = copy.deepcopy(SCENARIOS[clean_key])
    else:
        # Check alias
        for s_id, s_data in SCENARIOS.items():
            if clean_key in s_id:
                sc = copy.deepcopy(s_data)
                break
        else:
            sc = copy.deepcopy(TASK_SCAM_TRON)

    # Ensure every edge has isCorePath and parentBoxId
    for e in sc.get("edges", []):
        if "isCorePath" not in e:
            e["isCorePath"] = bool(e.get("is_primary", False))
        if "parentBoxId" not in e:
            e["parentBoxId"] = "core-path" if e["isCorePath"] else "background-web"

    return sc


class MockBlockchainClient(BaseBlockchainClient):
    """Mock client providing realistic offline fraud simulation data."""

    def __init__(self, scenario_name: str = "task_scam_tron_usdt"):
        sc_data = get_mock_scenario(scenario_name)
        super().__init__(chain_name=sc_data.get("chain", "TRON"))
        self.scenario_name = scenario_name
        self.scenario_data = sc_data

    @classmethod
    def get_scenario_for_address(cls, address: str) -> Dict[str, Any]:
        """Match scenario by victim address, preset key, or fallback by chain prefix."""
        addr = (address or "").strip()

        # Check sample_cases/ directory for exact victim_address match
        if SAMPLE_CASES_DIR.exists():
            for p in SAMPLE_CASES_DIR.glob("*.json"):
                try:
                    with open(p, "r", encoding="utf-8") as f:
                        data = json.load(f)
                        if data.get("victim_address") == addr:
                            return get_mock_scenario(p.stem)
                except Exception:
                    continue

        # Check in-memory fixtures
        for sc in SCENARIOS.values():
            if sc.get("victim_address") == addr:
                return copy.deepcopy(sc)

        # Fallback by address pattern
        if addr.startswith("T"):
            sc = get_mock_scenario("task_scam_tron_usdt")
        elif addr.startswith("0x"):
            sc = get_mock_scenario("investment_scam_eth")
        else:
            sc = get_mock_scenario("btc_ransomware")

        sc["victim_address"] = addr
        if sc.get("edges"):
            sc["edges"][0]["from"] = addr
        return sc

    def get_address_transactions(self, address: str, limit: int = 50) -> List[Dict[str, Any]]:
        addr = (address or "").strip()
        matched = [
            e for e in self.scenario_data["edges"]
            if e["from"] == addr or e["to"] == addr
        ]
        return matched[:limit]

    def get_transaction_details(self, tx_hash: str) -> Dict[str, Any]:
        for e in self.scenario_data["edges"]:
            if e.get("tx") == tx_hash:
                return e
        return {"tx": tx_hash, "found": False}
