"""
test_new_modules.py - Comprehensive verification of newly implemented modules:
- Multi-chain clients (base, tron, evm, btc, mock)
- Dynamic CEX sweep detector (>= 95% confidence rule)
- Risk scoring engine
- Section 63 BSA evidence hasher (canonical JSON RFC 8785)
- Section 94 BNSS notice generator
- Dynamic node expansion endpoint (POST /api/v1/trace/expand)
"""

import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from app.main import app
from app.services.blockchain import (
    BaseBlockchainClient, TronClient, EvmClient, BtcClient, MockBlockchainClient
)
from app.services.analytics import SweepDetector, RiskScorer, compute_risk_score
from app.services.reporting import (
    EvidenceHasher, canonical_json_hash,
    generate_statutory_notice_text, generate_statutory_notice_pdf
)
from app.schemas import FreezeNoticeRequest

client = TestClient(app)


def test_mock_client():
    print("\n--- 1. Testing Mock Multi-Chain Scenarios ---")
    tron_sc = MockBlockchainClient.get_scenario_for_address("TVictim0001XXXXXXXXXXXXXXXXXXXXXXX")
    assert tron_sc["chain"] == "TRON"
    assert len(tron_sc["edges"]) >= 5
    assert tron_sc["destination_vasp"] == "CoinDCX"
    print(f"[PASS] TRON mock scenario loaded with {len(tron_sc['edges'])} edges.")

    evm_sc = MockBlockchainClient.get_scenario_for_address("0xVictim0000000000000000000000000000001")
    assert evm_sc["chain"] == "EVM"
    assert evm_sc["destination_vasp"] == "Binance"
    print(f"[PASS] EVM mock scenario loaded with {len(evm_sc['edges'])} edges.")

    btc_sc = MockBlockchainClient.get_scenario_for_address("1Victim000000000000000000000000001")
    assert btc_sc["chain"] == "BTC"
    assert btc_sc["destination_vasp"] == "WazirX"
    print(f"[PASS] BTC mock scenario loaded with {len(btc_sc['edges'])} edges.")


def test_sweep_detector_95pct_rule():
    print("\n--- 2. Testing Dynamic CEX Sweep Detection 90%+ 24-hr Rule ---")
    detector = SweepDetector()
    # Construct a deposit wallet receiving 10,000 USDT and sweeping 9,500 USDT (95%) into Binance hot wallet in 2 hours
    edges = [
        {
            "from": "0xMuleVictimConduit11111111111111111111111",
            "to": "0xUnlabelledSuspectDeposit2222222222222222",
            "amount": 10000.0,
            "ts": 1713000000,
            "tx": "0xinbound1",
        },
        {
            "from": "0xUnlabelledSuspectDeposit2222222222222222",
            "to": "0x28c6c06298d514db089934071355e5743bf21d60",  # Binance Hot Wallet
            "amount": 9500.0,
            "ts": 1713000000 + 7200,  # 2 hours later (< 24 hrs)
            "tx": "0xsweep1",
        },
    ]
    sweeps = detector.detect_sweeps(edges)
    assert "0xUnlabelledSuspectDeposit2222222222222222" in sweeps
    attr = sweeps["0xUnlabelledSuspectDeposit2222222222222222"]
    print("Sweep attribution result:", attr)
    assert attr["is_known_vasp"] is True
    assert attr["exchange_name"] == "Binance"
    assert attr["confidence"] >= 0.95
    assert attr["role_tag"] == "VERIFIED CEX DEPOSIT"
    print(f"[PASS] Sweep detector verified: confidence={attr['confidence']} >= 0.95.")


def test_risk_scorer():
    print("\n--- 3. Testing Fraud Typology Risk Scoring ---")
    # Score a mule with peeling and high velocity
    risk = compute_risk_score(
        address="TMuleTest0000000000000000000000001",
        fan_in=1,
        fan_out=2,
        is_peeling=True,
        velocity_mins=15,
        hop_distance=1,
    )
    print("Risk score breakdown:", risk)
    assert risk["score"] >= 80
    assert risk["severity"] in ("HIGH", "CRITICAL")
    assert "peeling_structuring" in risk["breakdown"]
    assert "rapid_velocity_sub_30min" in risk["breakdown"]
    print(f"[PASS] Risk scorer verified: score={risk['score']} ({risk['severity']}).")


def test_evidence_hasher_and_notice():
    print("\n--- 4. Testing Section 63 BSA Evidence Hasher & Section 94 BNSS Notice ---")
    data = {"case_id": "TEST-CASE-101", "fir": "FIR/2026/01", "amount": 50000.0}
    h1 = canonical_json_hash(data)
    # Ensure deterministic hash
    h2 = canonical_json_hash({"amount": 50000.0, "case_id": "TEST-CASE-101", "fir": "FIR/2026/01"})
    assert h1 == h2
    assert len(h1) == 64
    print(f"[PASS] RFC 8785 Canonical JSON hashing verified: {h1}")

    req = FreezeNoticeRequest(
        case_id="CASE-SIH-2026",
        fir_number="FIR/CYBER/2026/900",
        investigating_officer="Insp. Aditi Rao",
        police_station="Cyber Crime Cell Bengaluru",
        exchange_name="CoinDCX",
        compliance_email="compliance@coindcx.com",
        frozen_addresses=["TCoinDCXDeposit0001XXXXXXXXXXXXXXXX"],
        transaction_hashes=["0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"],
        victim_amount_inr=437500.0,
        narrative="Multi-hop task scam laundering.",
    )
    notice_text = generate_statutory_notice_text(req, h1)
    assert "Section 94, Bharatiya Nagarik Suraksha Sanhita, 2023" in notice_text
    assert "Section 63 BSA, 2023" in notice_text
    assert "Insp. Aditi Rao" in notice_text
    assert "compliance@coindcx.com" in notice_text
    print("[PASS] Section 94 BNSS formatted notice text verified.")


def test_dynamic_node_expansion_endpoint():
    print("\n--- 5. Testing Dynamic Node Expansion API (POST /api/v1/trace/expand) ---")
    # Start a trace first
    resp = client.post("/api/v1/trace", json={
        "address": "TVictim0001XXXXXXXXXXXXXXXXXXXXXXX",
        "chain": "TRON",
        "data_mode": "mock",
    })
    assert resp.status_code == 200
    case_id = resp.json()["case_id"]

    # Now expand Mule 1
    expand_resp = client.post("/api/v1/trace/expand", json={
        "case_id": case_id,
        "address": "TMule000001XXXXXXXXXXXXXXXXXXXXXXX",
        "direction": "both",
    })
    assert expand_resp.status_code == 200
    expand_data = expand_resp.json()
    print("Expand response:", expand_data)
    assert len(expand_data["new_nodes"]) >= 1
    assert len(expand_data["new_edges"]) >= 1
    assert expand_data["total_nodes"] > 8
    print(f"[PASS] Node expansion returned {len(expand_data['new_nodes'])} new nodes and {len(expand_data['new_edges'])} edges.")


if __name__ == "__main__":
    test_mock_client()
    test_sweep_detector_95pct_rule()
    test_risk_scorer()
    test_evidence_hasher_and_notice()
    test_dynamic_node_expansion_endpoint()
    print("\n=======================================================")
    print("ALL NEW BACKEND MODULES VERIFIED SUCCESSFULLY!")
    print("=======================================================\n")
