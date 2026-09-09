import os
import sys
import time
from pathlib import Path

backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from app.main import app
from app.services.attribution_store import init_db as init_attr_db, upsert_attribution, lookup_attribution, DB_PATH as ATTR_DB_PATH
from app.services.evidence_ledger import init_db as init_ev_db, record_raw_evidence, build_merkle_root, DB_PATH as EV_DB_PATH
from app.services.sweep_attribution import detect_and_persist_sweep_attribution
from app.services.heuristics.common_input_ownership import detect_common_input_ownership
from app.services.air_gapped_guard import require_online

client = TestClient(app)


def test_1_and_2_attribution_persistence_and_propagation():
    print("\n--- 1 & 2. Testing Attribution Store Persistence & Cross-Case Propagation ---")
    init_attr_db()
    init_ev_db()
    assert ATTR_DB_PATH.exists()
    assert EV_DB_PATH.exists()
    print("[PASS] attribution_store.db and evidence_ledger.db exist on disk.")

    # Case 1: Deposit wallet A swept into CoinDCX
    case1_edges = [
        {"from": "0xDeposit_Mule_101", "to": "0xCoinDCX_MasterHotWallet", "amount": 1000.0, "ts": 1000, "tx": "0xtx_case1_sweep1"},
        {"from": "0xDeposit_Mule_102", "to": "0xCoinDCX_MasterHotWallet", "amount": 1200.0, "ts": 1050, "tx": "0xtx_case1_sweep2"},
        {"from": "0xDeposit_Mule_103", "to": "0xCoinDCX_MasterHotWallet", "amount": 1500.0, "ts": 1100, "tx": "0xtx_case1_sweep3"},
    ]
    # Manually seed destination as CoinDCX in attribution store or static seed
    upsert_attribution("0xCoinDCX_MasterHotWallet", "EVM", "CoinDCX", "CoinDCX Master Hot Wallet", "static_seed", 0.99)
    res1 = detect_and_persist_sweep_attribution(case1_edges, chain="EVM")
    assert "0xCoinDCX_MasterHotWallet" in res1
    assert res1["0xCoinDCX_MasterHotWallet"]["exchange_name"] == "CoinDCX"
    print("Case 1 sweep cluster attributed to:", res1["0xCoinDCX_MasterHotWallet"]["exchange_name"])

    # Verify 0xDeposit_Mule_101 is now persisted as CoinDCX User Deposit
    attr101 = lookup_attribution("0xDeposit_Mule_101")
    assert attr101 is not None
    assert attr101["exchange_name"] == "CoinDCX"
    print("Verified 0xDeposit_Mule_101 persisted with exchange:", attr101["exchange_name"])

    # Case 2: Brand new unlabelled master wallet 0xNewAggregator receives sweeps from 0xDeposit_Mule_101
    # along with two other new addresses. It should INHERIT CoinDCX automatically without re-tagging!
    case2_edges = [
        {"from": "0xDeposit_Mule_101", "to": "0xNewAggregator_Unknown", "amount": 800.0, "ts": 5000, "tx": "0xtx_case2_sweep1"},
        {"from": "0xUnknown_Deposit_202", "to": "0xNewAggregator_Unknown", "amount": 900.0, "ts": 5050, "tx": "0xtx_case2_sweep2"},
        {"from": "0xUnknown_Deposit_203", "to": "0xNewAggregator_Unknown", "amount": 950.0, "ts": 5100, "tx": "0xtx_case2_sweep3"},
    ]
    res2 = detect_and_persist_sweep_attribution(case2_edges, chain="EVM")
    assert "0xNewAggregator_Unknown" in res2
    assert res2["0xNewAggregator_Unknown"]["exchange_name"] == "CoinDCX"
    print("Case 2 cluster inherited CoinDCX automatically:", res2["0xNewAggregator_Unknown"]["message"])
    print("[PASS] Cross-case persistence & propagation verified.")


def test_3_evidence_merkle_tree():
    print("\n--- 3. Testing Evidence Ledger Merkle Tree ---")
    case_id = f"CASE-TEST-{int(time.time())}"
    h1 = record_raw_evidence(case_id, "mock_rpc.get_block", {"block_number": 21948150, "hash": "0xblock1"})
    h2 = record_raw_evidence(case_id, "mock_rpc.get_tx", {"tx_hash": "0x1111", "amount": 5750.0})
    h3 = record_raw_evidence(case_id, "mock_rpc.get_logs", {"log_index": 1, "topic": "Transfer"})

    merkle = build_merkle_root(case_id)
    print(f"Recorded 3 evidence leaves. Merkle Root: {merkle['root']}, Leaf Count: {merkle['leaf_count']}")
    assert merkle["leaf_count"] == 3
    assert merkle["root"] is not None
    assert len(merkle["root"]) == 64
    print("[PASS] Evidence ledger Merkle tree verified.")


def test_4_freeze_notice_v2():
    print("\n--- 4. Testing POST /api/v1/reports/freeze-notice-v2 ---")
    payload = {
        "case_id": "NCRP-2026-480912",
        "fir_number": "FIR/CYBER/2026/0480",
        "ncrp_ack_number": "NCRP-ACK-99214-IN",
        "investigating_officer": "Insp. Rajesh Kumar",
        "police_station": "State Cyber Crime Police Station, Jaipur",
        "exchange_name": "CoinDCX",
        "compliance_email": "compliance@coindcx.com",
        "frozen_addresses": ["0xUnknownDeposit_3e4f5a6b7c8d"],
        "transaction_hashes": ["0xabc480dcx9923eef108745671239847120398417230498172039481230498123"],
        "victim_amount_inr": 480000.0,
        "narrative": "Automated multi-hop fraud proceeds traced and consolidated into CoinDCX deposit wallet.",
        "fraud_date_ddmmyyyy": "09-09-2026",
        "primary_token_symbol": "USDT",
    }
    resp = client.post("/api/v1/reports/freeze-notice-v2", json=payload)
    assert resp.status_code == 200, f"Error: {resp.text}"
    assert resp.headers.get("content-type") == "application/pdf"
    assert "X-Evidence-Merkle-Root" in resp.headers
    pdf_bytes = resp.content
    assert len(pdf_bytes) > 2000
    print(f"[PASS] freeze-notice-v2 generated PDF ({len(pdf_bytes)} bytes) with Merkle header: {resp.headers.get('X-Evidence-Merkle-Root')}")


def test_5_auto_investigate():
    print("\n--- 5. Testing POST /api/v1/investigate/auto ---")
    payload = {
        "victim_address": "TVictim0001TRONTaskScamXXXXXXXXX",
        "chain_hint": "TRON",
        "max_hops": 5,
        "case_id": "CASE-AUTO-001"
    }
    resp = client.post("/api/v1/investigate/auto", json=payload)
    assert resp.status_code == 200, f"Error: {resp.text}"
    data = resp.json()
    print("Auto-investigate response:", data)
    assert data["reached_exchange"] is True
    assert data["exchange_attribution_message"] is not None
    assert "Attributed to: CoinDCX" in data["exchange_attribution_message"]
    assert "Master Hot Wallet Sweep Tx:" in data["exchange_attribution_message"]
    print("[PASS] auto_investigate returned reached_exchange=True and CoinDCX attribution message.")


def test_6_air_gapped_mode():
    print("\n--- 6. Testing AIR_GAPPED_MODE=true guard ---")
    os.environ["AIR_GAPPED_MODE"] = "true"
    try:
        require_online("test_live_call")
        assert False, "Should have raised RuntimeError in air-gapped mode"
    except RuntimeError as e:
        assert "requires outbound network access" in str(e)
        print("[PASS] AIR_GAPPED_MODE=true raised RuntimeError as expected:", e)
    finally:
        os.environ["AIR_GAPPED_MODE"] = "false"


def test_7_common_input_ownership_heuristic():
    print("\n--- 7. Testing Common-Input-Ownership Heuristic (Bitcoin Multi-Input Co-Spending) ---")
    # Synthetic Bitcoin transactions with shared inputs
    mock_btc_txs = [
        {
            "txid": "tx01",
            "vin": [
                {"prevout": {"scriptpubkey_address": "1AddrA_BtcInput"}},
                {"prevout": {"scriptpubkey_address": "1AddrB_BtcInput"}},
            ],
            "vout": [{"scriptpubkey_address": "1PaymentOut", "value": 100000}]
        },
        {
            "txid": "tx02",
            "vin": [
                {"prevout": {"scriptpubkey_address": "1AddrB_BtcInput"}},
                {"prevout": {"scriptpubkey_address": "1AddrC_BtcInput"}},
            ],
            "vout": [{"scriptpubkey_address": "1PaymentOut2", "value": 80000}]
        }
    ]
    clusters = detect_common_input_ownership(mock_btc_txs)
    print("Clustered addresses:", list(clusters.keys()))
    assert len(clusters) == 3
    for addr in ["1AddrA_BtcInput", "1AddrB_BtcInput", "1AddrC_BtcInput"]:
        assert addr in clusters
        assert clusters[addr]["attribution_rule"] == "multi_input_co_spending_heuristic"
        assert clusters[addr]["confidence"] >= 0.6
        assert clusters[addr]["cluster_size"] == 3
    print("[PASS] Common-input ownership clustered all 3 addresses with confidence >= 0.6.")


def test_8_flagship_480k_dataset():
    print("\n--- 8. Testing Flagship INR 480,000 CoinDCX Scenario ---")
    payload = {
        "address": "0xVICTIM_480K_FRAUD_7b93a2c4e1",
        "scenario": "inr_480k_coindcx_scam",
        "chain": "EVM",
        "use_mock_fallback": True,
        "fir_number": "FIR/CYBER/2026/0480"
    }
    resp = client.post("/api/v1/trace/start", json=payload)
    assert resp.status_code == 200, f"Trace failed: {resp.text}"
    data = resp.json()
    print("INR 480K Trace response:", data)
    assert data["reached_exchange"] is True
    assert data["destination_vasp"] == "CoinDCX"
    assert data["hop_count"] >= 4
    print("[PASS] Flagship INR 480K CoinDCX scam trace verified.")


if __name__ == "__main__":
    test_1_and_2_attribution_persistence_and_propagation()
    test_3_evidence_merkle_tree()
    test_4_freeze_notice_v2()
    test_5_auto_investigate()
    test_6_air_gapped_mode()
    test_7_common_input_ownership_heuristic()
    test_8_flagship_480k_dataset()
    print("\n=======================================================")
    print("ALL 8 UPGRADE ACCEPTANCE CRITERIA PASSED FLAWLESSLY!")
    print("=======================================================")
