import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from app.main import app
from ingestion.btc_client import (
    RawBtcTransaction, RawBtcVin, RawBtcVout,
    simplify_to_transfers, fetch_btc_transactions, BtcClientError
)

client = TestClient(app)


def test_prompt3_flow():
    print("\n--- Testing Prompt 3 API Endpoints ---")
    
    # 1. POST /trace/start with Prompt 3 payload format
    payload = {
        "address": "TVictim0001XXXXXXXXXXXXXXXXXXXXXXX",
        "fir_number": "FIR-PROMPT3-TEST",
        "use_mock_fallback": True,
    }
    resp = client.post("/api/v1/trace/start", json=payload)
    assert resp.status_code == 200, f"Start failed: {resp.text}"
    start_data = resp.json()
    print("[1] POST /trace/start response keys:", list(start_data.keys()))
    assert "case_id" in start_data
    assert "detected_chain" in start_data
    assert "transfer_count" in start_data
    assert "data_source" in start_data
    assert start_data["data_source"].startswith("mock_fallback:")
    print(f"    detected_chain: {start_data['detected_chain']}, data_source: {start_data['data_source']}")

    case_id = start_data["case_id"]

    # 2. GET /trace/{case_id}/graph
    graph_resp = client.get(f"/api/v1/trace/{case_id}/graph")
    assert graph_resp.status_code == 200, f"Graph failed: {graph_resp.text}"
    graph_data = graph_resp.json()
    print("[2] GET /trace/{case_id}/graph nodes count:", len(graph_data["nodes"]), "edges:", len(graph_data["edges"]))
    assert "data_source" in graph_data
    assert len(graph_data["nodes"]) > 0
    assert len(graph_data["edges"]) > 0

    # 3. GET /trace/{case_id}/off-ramp?dust_threshold_usd=50
    offramp_resp = client.get(f"/api/v1/trace/{case_id}/off-ramp?dust_threshold_usd=50")
    assert offramp_resp.status_code == 200, f"Off-ramp failed: {offramp_resp.text}"
    offramp_data = offramp_resp.json()
    print("[3] GET /trace/{case_id}/off-ramp:", offramp_data)
    assert "found" in offramp_data
    assert "hops_searched" in offramp_data
    assert "path" in offramp_data
    assert "terminal_label" in offramp_data
    assert "disclaimer" in offramp_data
    assert offramp_data["found"] is True
    assert len(offramp_data["path"]) > 0

    # 4. GET /vasp-attribution?case_id=...&address=...
    vasp_resp = client.get(f"/api/v1/vasp-attribution?case_id={case_id}&address=TCoinDCXHotWallet01XXXXXXXXXXXXXXXX")
    assert vasp_resp.status_code == 200, f"VASP attribution failed: {vasp_resp.text}"
    vasp_data = vasp_resp.json()
    print("[4] GET /vasp-attribution:", vasp_data)
    assert "attributed" in vasp_data
    assert "attributed_to" in vasp_data
    assert "confidence" in vasp_data
    assert "rule" in vasp_data
    assert "disclaimer" in vasp_data
    assert vasp_data["attributed"] is True
    assert vasp_data["attributed_to"] == "CoinDCX"
    print("[PASS] Prompt 3 API endpoints verified successfully.")


def test_prompt4_btc_gap():
    print("\n--- Testing Prompt 4 BTC Gap & UTXO Simplification ---")

    # 1. Test RawBtcTransaction simplification
    raw_tx = RawBtcTransaction(
        txid="0xdeadbeef1234567890abcdef1234567890abcdef1234567890abcdef12345678",
        block_time=1700000000,
        block_height=800000,
        fee_sats=1500,
        vin=[
            RawBtcVin(txid="prev_tx1", vout_index=0, address="1VictimBtcWalletAddress11111111111", value_sats=500000000),
        ],
        vout=[
            RawBtcVout(n=0, address="1MuleBtcAddressDeposit22222222222", value_sats=450000000),
            RawBtcVout(n=1, address="1VictimBtcWalletAddress11111111111", value_sats=49998500), # Change
        ]
    )

    transfers = simplify_to_transfers(raw_tx, queried_address="1VictimBtcWalletAddress11111111111")
    print(f"[1] Simplified transfers count from RawBtcTransaction: {len(transfers)}")
    assert len(transfers) == 1
    assert transfers[0].from_address == "1VictimBtcWalletAddress11111111111"
    assert transfers[0].to_address == "1MuleBtcAddressDeposit22222222222"
    assert transfers[0].amount == 4.5  # 450,000,000 sats / 1e8 = 4.5 BTC
    print(f"    Transfer: {transfers[0].from_address} -> {transfers[0].to_address} : {transfers[0].amount} BTC")

    # 2. Test missing BTC fallback scenario honesty check
    print("[2] Checking missing BTC mock scenario raises FileNotFoundError honestly without inventing fake data")
    btc_payload = {
        "address": "1VictimBtcWalletAddress11111111111",
        "data_mode": "mock",
        "chain": "BTC",
        "use_mock_fallback": True,
    }
    btc_resp = client.post("/api/v1/trace/start", json=btc_payload)
    print("    BTC mock request response code:", btc_resp.status_code)
    # Since sample_cases/ does not have btc_ransomware_scenario.json, it should be 404 (Missing scenario)
    assert btc_resp.status_code == 404
    assert "missing in sample_cases/" in btc_resp.text
    print("[PASS] Prompt 4 BTC wiring and missing scenario honesty verified.")


if __name__ == "__main__":
    test_prompt3_flow()
    test_prompt4_btc_gap()
    print("\nALL PROMPT 3 & 4 TEST SUITES PASSED!")

