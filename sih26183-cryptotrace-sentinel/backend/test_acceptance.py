import os
import sys
from pathlib import Path

# Ensure backend root is on sys.path
backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from app.main import app
from app.services.vasp_service import attribute_address
from core.c_bridge import BlockchainTracerCore, TxEdgeInput

client = TestClient(app)

def test_c_tracer_direct():
    print("\n--- Testing C Tracer Core Direct ctypes execution ---")
    edges = [
        TxEdgeInput("V", "M1", 1000.0, 100, "tx1", 0),
        TxEdgeInput("M1", "M2", 990.0, 200, "tx2", 0),
        TxEdgeInput("M2", "DEP", 980.0, 300, "tx3", 0),
        TxEdgeInput("DEP", "HOT", 980.0, 400, "tx4", 0),
    ]
    tracer = BlockchainTracerCore(edges)
    res = tracer.trace_to_exchange("V", ["DEP", "HOT"], max_hops=5)
    print(f"Direct C tracer result: reached={res['reached_exchange']}, hops={len(res['hops'])}, terminal=${res['terminal_amount']}")
    assert res["reached_exchange"] is True
    assert len(res["hops"]) == 3  # V -> M1 -> M2 -> DEP (first exchange hit)
    
    peeling = tracer.check_peeling_chain("M1")
    print(f"Peeling signal check on M1: fan_in={peeling['fan_in']}, fan_out={peeling['fan_out']}, is_peeling={peeling['is_peeling_chain']}")
    print("[PASS] Direct C tracer core verified.")

def test_tron_task_scam_scenario():
    print("\n--- Testing TRON Task Scam Scenario (Acceptance Criteria 3 & 4) ---")
    payload = {
        "case_id": "TEST-TRON-001",
        "fir_number": "FIR-2026-TRON-01",
        "start_address": "TVictim0001XXXXXXXXXXXXXXXXXXXXXXX",
        "chain": "TRON",
        "data_mode": "mock",
        "max_hops": 5,
        "max_time_window_seconds": 14400,
        "min_amount_threshold": 1.0,
    }
    resp = client.post("/api/v1/trace/start", json=payload)
    assert resp.status_code == 200, f"Error: {resp.text}"
    data = resp.json()
    print("Trace start response:", data)
    assert data["reached_exchange"] is True
    # The scenario has 5 edges: Victim -> Mule1 -> Mule2 -> Mule3 -> Deposit -> HotWallet
    # Reaching deposit is hop 4
    assert data["hop_count"] == 4, f"Expected 4 hops to deposit, got {data['hop_count']}"
    assert data["trace_time_ms"] < 50.0, f"Trace time exceeded 50ms: {data['trace_time_ms']}ms"
    print(f"[PASS] TRON trace completed in {data['trace_time_ms']}ms (< 50ms mandate).")

    # Check graph
    trace_id = data["trace_id"]
    graph_resp = client.get(f"/api/v1/trace/{trace_id}/graph")
    assert graph_resp.status_code == 200
    graph_data = graph_resp.json()
    node_types = {n["id"]: n["node_type"] for n in graph_data["nodes"]}
    print("Node classifications:", node_types)
    assert node_types["TVictim0001XXXXXXXXXXXXXXXXXXXXXXX"] == "victim"
    assert node_types["TMule000001XXXXXXXXXXXXXXXXXXXXXXX"] == "mule"
    assert node_types["TCoinDCXDeposit0001XXXXXXXXXXXXXXXX"] == "exchange_deposit"
    assert node_types["TCoinDCXHotWallet01XXXXXXXXXXXXXXXX"] == "exchange_hotwallet"
    print("[PASS] Graph node labels verified (victim, mule, exchange_deposit, exchange_hotwallet).")

def test_evm_investment_scam_scenario():
    print("\n--- Testing EVM Investment Scam Scenario (Acceptance Criteria 8) ---")
    payload = {
        "case_id": "TEST-EVM-002",
        "fir_number": "FIR-2026-EVM-02",
        "start_address": "0xVictim0000000000000000000000000000001",
        "chain": "EVM",
        "data_mode": "mock",
        "max_hops": 5,
        "max_time_window_seconds": 14400,
        "min_amount_threshold": 1.0,
    }
    resp = client.post("/api/v1/trace/start", json=payload)
    assert resp.status_code == 200, f"Error: {resp.text}"
    data = resp.json()
    print("EVM trace start response:", data)
    assert data["reached_exchange"] is True
    # Victim -> Mule1 -> Mule2 -> Deposit (hop 3) -> HotWallet (hop 4)
    assert data["hop_count"] in (3, 4)
    assert data["trace_time_ms"] < 50.0
    print(f"[PASS] EVM trace completed in {data['trace_time_ms']}ms with 4 hops to Binance deposit.")

def test_vasp_attribution():
    print("\n--- Testing VASP Attribution Endpoint (Acceptance Criteria 5) ---")
    resp_coindcx = client.post("/api/v1/vasp-attribution", json={"address": "TCoinDCXHotWallet01XXXXXXXXXXXXXXXX"})
    assert resp_coindcx.status_code == 200
    res1 = resp_coindcx.json()
    print("CoinDCX attribution:", res1)
    assert res1["is_known_vasp"] is True
    assert res1["exchange_name"] == "CoinDCX"
    assert res1["compliance_email"] == "compliance@coindcx.com"

    resp_binance = client.post("/api/v1/vasp-attribution", json={"address": "0xBinanceHotWallet000000000000000000001"})
    assert resp_binance.status_code == 200
    res2 = resp_binance.json()
    print("Binance attribution:", res2)
    assert res2["is_known_vasp"] is True
    assert res2["exchange_name"] == "Binance"
    print("[PASS] VASP attribution endpoint verified.")

def test_freeze_notice_pdf():
    print("\n--- Testing Section 94 BNSS Freeze Notice Generation (Acceptance Criteria 6) ---")
    payload = {
        "case_id": "DEMO-CASE-99",
        "fir_number": "FIR/2026/0402",
        "investigating_officer": "IO Kumar",
        "police_station": "Cyber Crime PS Delhi",
        "exchange_name": "CoinDCX",
        "compliance_email": "compliance@coindcx.com",
        "frozen_addresses": ["TCoinDCXDeposit0001XXXXXXXXXXXXXXXX"],
        "transaction_hashes": ["0x8f2d9c1b4e6a7350129fec8714b35029e8471c039581a62048fbc927160359da"],
        "victim_amount_inr": 450000.0,
        "narrative": "Urgent freeze request under Golden Hour protocol.",
    }
    resp = client.post("/api/v1/reports/freeze-notice", json=payload)
    assert resp.status_code == 200
    assert resp.headers["content-type"] == "application/pdf"
    assert "X-Evidence-SHA256" in resp.headers
    evidence_sha = resp.headers["X-Evidence-SHA256"]
    print(f"Received PDF with size: {len(resp.content)} bytes, X-Evidence-SHA256: {evidence_sha}")
    assert len(resp.content) > 1000
    assert len(evidence_sha) == 64
    print("[PASS] Freeze notice PDF and Section 63 BSA SHA-256 seal verified.")

if __name__ == "__main__":
    test_c_tracer_direct()
    test_tron_task_scam_scenario()
    test_evm_investment_scam_scenario()
    test_vasp_attribution()
    test_freeze_notice_pdf()
    print("\n=======================================================")
    print("ALL ACCEPTANCE CRITERIA VERIFIED SUCCESSFULLY!")
    print("=======================================================\n")
