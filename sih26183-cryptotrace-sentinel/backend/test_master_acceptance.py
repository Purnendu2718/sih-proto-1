import os
import sqlite3
from fastapi.testclient import TestClient

from app.main import app, on_startup
from app.services.attribution_store import lookup_attribution, upsert_attribution
from app.services.sweep_attribution import detect_and_persist_sweep_attribution

on_startup()
client = TestClient(app)

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok"}
    print("[PASS] /health passed")

def test_seeds():
    conn = sqlite3.connect("data/attribution_store.db")
    rows = conn.execute("SELECT address, exchange_name FROM attributed_clusters WHERE attribution_rule = 'static_seed'").fetchall()
    conn.close()
    assert len(rows) == 4, f"Expected 4 static seeds, got {len(rows)}"
    exchanges = {r[1] for r in rows}
    assert "CoinDCX" in exchanges and "Binance" in exchanges
    print(f"[PASS] Seeds verified in attribution_store.db ({len(rows)} static VASP rows)")

def test_tron_mock_trace():
    payload = {
        "case_id": "DEMO-TRON",
        "fir_number": "FIR/2026/00123",
        "start_address": "TVictim0001XXXXXXXXXXXXXXXXXXXXXXX",
        "chain": "TRON",
        "data_mode": "mock",
    }
    res = client.post("/api/v1/trace/start", json=payload)
    assert res.status_code == 200, res.text
    data = res.json()
    assert data["reached_exchange"] is True
    assert data["hop_count"] >= 1
    assert data["trace_id"]
    assert data["exchange_attribution_message"] is not None
    print(f"[PASS] TRON mock trace passed: {data['exchange_attribution_message']}")

    # Graph retrieval test
    graph_res = client.get(f"/api/v1/trace/{data['trace_id']}/graph")
    assert graph_res.status_code == 200
    g = graph_res.json()
    assert len(g["nodes"]) == 6
    assert len(g["edges"]) == 5

    # Check colors: origin=green (#10b981), mule=amber (#f59e0b), cex=blue (#2563eb)
    node_types = {n["id"]: n["node_type"] for n in g["nodes"]}
    colors = {n["id"]: n["color"] for n in g["nodes"]}
    assert node_types["TVictim0001XXXXXXXXXXXXXXXXXXXXXXX"] == "origin"
    assert colors["TVictim0001XXXXXXXXXXXXXXXXXXXXXXX"] == "#10b981"
    assert node_types["TCoinDCXDeposit0001XXXXXXXXXXXXXXXX"] == "cex"
    assert colors["TCoinDCXDeposit0001XXXXXXXXXXXXXXXX"] == "#2563eb"
    assert node_types["TCoinDCXHotWallet01XXXXXXXXXXXXXXXX"] == "cex"
    assert colors["TCoinDCXHotWallet01XXXXXXXXXXXXXXXX"] == "#2563eb"
    assert node_types["TMule000001XXXXXXXXXXXXXXXXXXXXXXX"] == "mule"
    assert colors["TMule000001XXXXXXXXXXXXXXXXXXXXXXX"] == "#f59e0b"
    print("[PASS] Node taxonomy & colors verified (origin=#10b981, mule=#f59e0b, cex=#2563eb)")

def test_evm_mock_trace():
    payload = {
        "case_id": "DEMO-EVM",
        "fir_number": "FIR/2026/00123",
        "start_address": "0xVictim0000000000000000000000000000001",
        "chain": "EVM",
        "data_mode": "mock",
    }
    res = client.post("/api/v1/trace/start", json=payload)
    assert res.status_code == 200, res.text
    data = res.json()
    assert data["reached_exchange"] is True
    print(f"[PASS] EVM mock trace passed: {data['trace_id']}")

def test_auto_investigate():
    payload = {
        "victim_address": "TVictim0001XXXXXXXXXXXXXXXXXXXXXXX",
        "case_id": "AUTO-CASE-1",
    }
    res = client.post("/api/v1/investigate/auto", json=payload)
    assert res.status_code == 200, res.text
    data = res.json()
    assert data["detected_chain"] == "TRON"
    print(f"[PASS] /investigate/auto passed (detected {data['detected_chain']})")

def test_freeze_notice():
    payload = {
        "case_id": "CASE-FREEZE-001",
        "fir_number": "FIR/CYBER/2026/0402",
        "ncrp_ack_number": "NCRP-2026-991823",
        "investigating_officer": "Insp. R. Sharma",
        "police_station": "Cyber Crime PS Cyberabad",
        "exchange_name": "CoinDCX",
        "compliance_email": "compliance@coindcx.com",
        "frozen_addresses": ["TCoinDCXHotWallet01XXXXXXXXXXXXXXXX", "TCoinDCXDeposit0001XXXXXXXXXXXXXXXX"],
        "transaction_hashes": ["0xe5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5"],
        "victim_amount_inr": 405460.0,
        "narrative": "Victim defrauded via Telegram investment deception task scam.",
        "fraud_date_ddmmyyyy": "10-09-2026",
        "primary_token_symbol": "USDT",
    }
    res = client.post("/api/v1/reports/freeze-notice", json=payload)
    assert res.status_code == 200
    assert res.headers["content-type"] == "application/pdf"
    assert "attachment; filename=\"freeze_notice_CASE-FREEZE-001.pdf\"" in res.headers["content-disposition"]
    assert len(res.content) > 1000
    print(f"[PASS] Freeze notice PDF generated ({len(res.content)} bytes)")

def test_cross_case_persistence():
    # Simulate Case 1 attributing a sweep to an exchange
    edges_case1 = [
        {"from": "TNovelDeposit01XXXXXXXXXXXXXXXXXXXX", "to": "TNovelHotReserveXXXXXXXXXXXXXXXXXXXX", "amount": 1000.0, "ts": 1700000000, "tx": "0xtx1"},
        {"from": "TNovelDeposit02XXXXXXXXXXXXXXXXXXXX", "to": "TNovelHotReserveXXXXXXXXXXXXXXXXXXXX", "amount": 1000.0, "ts": 1700000050, "tx": "0xtx2"},
        {"from": "TCoinDCXDeposit0001XXXXXXXXXXXXXXXX", "to": "TNovelHotReserveXXXXXXXXXXXXXXXXXXXX", "amount": 1000.0, "ts": 1700000100, "tx": "0xtx3"},
    ]
    res1 = detect_and_persist_sweep_attribution(edges_case1, chain="TRON")
    assert "TNovelHotReserveXXXXXXXXXXXXXXXXXXXX" in res1
    assert res1["TNovelHotReserveXXXXXXXXXXXXXXXXXXXX"]["exchange_name"] == "CoinDCX"

    # Case 2: unrelated transaction only seeing TNovelHotReserveXXXXXXXXXXXXXXXXXXXX
    lookup = lookup_attribution("TNovelHotReserveXXXXXXXXXXXXXXXXXXXX")
    assert lookup is not None
    assert lookup["exchange_name"] == "CoinDCX"
    print("[PASS] Cross-case persistence verified (inherited CoinDCX attribution)")

def test_air_gapped_mode():
    os.environ["AIR_GAPPED_MODE"] = "true"
    res = client.post("/api/v1/search", json={"query": "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"})
    assert res.status_code == 200
    data = res.json()
    # Should return empty transfers without crashing
    assert len(data["graph"]["edges"]) == 0
    os.environ["AIR_GAPPED_MODE"] = "false"
    print("[PASS] Air-gapped fail-closed behavior verified")

if __name__ == "__main__":
    test_health()
    test_seeds()
    test_tron_mock_trace()
    test_evm_mock_trace()
    test_auto_investigate()
    test_freeze_notice()
    test_cross_case_persistence()
    test_air_gapped_mode()
    print("\nALL BACKEND ACCEPTANCE TESTS PASSED SUCCESSFULLY!")
