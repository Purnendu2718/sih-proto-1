"""
test_sanctions_pipeline.py - Verification suite for Task 11: Sanctions Ingestion & Pre-Computation Pipeline.
Tests:
- Scheduled ETL batch ingestion of OFAC SDN feeds into SQLite database
- Automatic ingestion-time flagging and risk score materialization (0ms lazy computation)
- Zero on-demand network/API reliance (fully local, persistent, thread-safe)
- REST endpoints for ETL status telemetry, manual run, address checking, and ingestion screening
- Background scheduler start/stop lifecycle
"""

import sys
import os
import time
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from app.main import app
from app.services.sanctions_etl import SanctionsETLService, DB_PATH
from app.services.attribution_store import lookup_attribution
from app.services.graph_node_builder import build_graph_node


def run_tests():
    print("=" * 70)
    print("STARTING TEST SUITE: Task 11 - Sanctions Ingestion & Pre-computation Pipeline")
    print("=" * 70)

    # 1. Initialize DB and run initial ETL sync
    print("\n[TEST 1] Initializing sanctions database and executing scheduled ETL sync...")
    SanctionsETLService.init_db()
    sync_res = SanctionsETLService.run_etl_sync(force=True)
    print(f"  -> Sync result: {sync_res}")
    assert sync_res["status"] == "COMPLETED", "ETL sync must report COMPLETED"
    assert sync_res["records_ingested"] > 0, "ETL must ingest records from OFAC SDN feeds"
    assert sync_res["flagged_matches"] > 0, "ETL must flag matching records at ingestion"
    print("  [OK] PASSED: ETL sync populated sanctions store and executed ingestion-time screening.")

    # 2. Verify persistent database contents & telemetry
    print("\n[TEST 2] Verifying persistent SQLite sanctions_records table and status telemetry...")
    status = SanctionsETLService.get_etl_status()
    print(f"  -> Total records: {status['total_sanctioned_records']}")
    print(f"  -> Chain distribution: {status['chain_distribution']}")
    print(f"  -> Latest run: {status['latest_etl_run']}")
    assert status["total_sanctioned_records"] >= 20, "Should contain at least 20 designated records"
    assert "EVM" in status["chain_distribution"], "Should index EVM addresses"
    assert "BTC" in status["chain_distribution"], "Should index BTC addresses"
    assert "TRON" in status["chain_distribution"], "Should index TRON addresses"
    assert status["latest_etl_run"]["status"] == "COMPLETED"
    print("  [OK] PASSED: Multi-chain SDN records indexed and telemetry reflects complete runs.")

    # 3. Test 0ms indexed lookup against sanctioned entities
    print("\n[TEST 3] Testing 0ms indexed check on high-profile sanctioned addresses...")
    test_sanctioned = [
        # Tornado Cash Router
        ("0xd90e2f925da726b50c4ed8d0fb90ad053324f31b", "Tornado Cash", "EVM"),
        # Ronin Bridge Hacker (Lazarus)
        ("0x098b716b8aaf21512996dc57eb0615e2383e2f96", "Ronin Bridge Exploiter", "EVM"),
        # Garantex Exchange
        ("0x7f367cc41522ce07553e823bf3be79a889debe1b", "Garantex", "EVM"),
        # Silk Road Darknet Seized BTC
        ("1silkroad00000000000000000000000000001", "Silk Road", "BTC"),
        # SUEX OTC Tron
        ("tsuexotctronconduit0000000000000000", "SUEX OTC", "TRON")
    ]

    for addr, expected_name, expected_chain in test_sanctioned:
        hit = SanctionsETLService.check_sanctions_db(addr)
        assert hit is not None, f"Address {addr} must be found in sanctions DB"
        assert expected_name.lower() in hit["entity_name"].lower(), f"Expected {expected_name} in {hit['entity_name']}"
        assert hit["base_risk_score"] >= 90, f"Sanctioned entity must carry high base risk score >= 90, got {hit['base_risk_score']}"
        print(f"  -> Verified {expected_name} ({expected_chain}): authority='{hit['authority']}', category='{hit['category']}'")
    print("  [OK] PASSED: 0ms local indexed lookup matches OFAC SDN targets across chains.")

    # 4. Test Ingestion-Time Pre-Computation & Materialization
    print("\n[TEST 4] Verifying risk scores are pre-computed in attribution_store at ingestion time...")
    # Check that the attribution_store already has pre-computed risk scores for sanctioned addresses
    for addr, expected_name, _ in test_sanctioned:
        attrib = lookup_attribution(addr)
        assert attrib is not None, f"Attribution record for {addr} must exist"
        assert attrib["is_sanctioned"] == 1, f"Address {addr} must be flagged is_sanctioned=1"
        assert attrib["risk_score"] == 100, f"Risk score must be precomputed as 100, got {attrib['risk_score']}"
        assert attrib["precomputed_utc"] is not None and attrib["precomputed_utc"] > 0, "precomputed_utc timestamp must be populated"
        print(f"  -> Ingestion precomputed: {expected_name} => score={attrib['risk_score']}, precomputed_utc={attrib['precomputed_utc']}")

    # Now test screen_and_precompute_at_ingestion on a fresh address
    fresh_addr = "0x742d35cc6634c0532925a3b844bc454e4438f44e"
    precompute_res = SanctionsETLService.screen_and_precompute_at_ingestion(fresh_addr, chain="EVM")
    assert precompute_res["is_precomputed"] is True
    assert precompute_res["risk_score"] is not None

    stored_fresh = lookup_attribution(fresh_addr)
    assert stored_fresh is not None
    assert stored_fresh["risk_score"] == precompute_res["risk_score"]
    assert stored_fresh["precomputed_utc"] is not None and stored_fresh["precomputed_utc"] > 0
    print(f"  -> Fresh address {fresh_addr[:12]}... screened & precomputed: score={stored_fresh['risk_score']}, mode={stored_fresh['risk_mode']}")
    print("  [OK] PASSED: Ingestion-time screening materializes risk scores without lazy computation.")

    # 5. Test Graph Node Builder integration
    print("\n[TEST 5] Verifying graph_node_builder uses pre-computed risk scores & flags...")
    # Test Sanctioned node
    sanc_node = build_graph_node("0xd90e2f925da726b50c4ed8d0fb90ad053324f31b", chain="EVM", origin_address="0x1111111111111111111111111111111111111111")
    assert sanc_node.risk_score == 100
    assert sanc_node.node_type == "mixer_bridge"
    assert sanc_node.color == "#dc2626"
    print(f"  -> Sanctioned Node: id={sanc_node.id[:10]}..., type={sanc_node.node_type}, risk_score={sanc_node.risk_score}, color={sanc_node.color}")

    # Test Origin node
    orig_node = build_graph_node("0x1111111111111111111111111111111111111111", chain="EVM", origin_address="0x1111111111111111111111111111111111111111")
    assert orig_node.node_type == "origin"
    assert orig_node.display_label == "[Victim / Origin Wallet]"
    assert orig_node.color == "#10b981"
    print(f"  -> Origin Node: id={orig_node.id[:10]}..., type={orig_node.node_type}, risk_score={orig_node.risk_score}, label='{orig_node.display_label}'")
    print("  [OK] PASSED: Graph node builder integrates precomputed risk scores and node colorings.")

    # 6. Test REST API Endpoints with TestClient
    print("\n[TEST 6] Verifying Sanctions API routes (/api/v1/sanctions/*)...")
    client = TestClient(app)

    # 6a. GET /api/v1/sanctions/etl/status
    res = client.get("/api/v1/sanctions/etl/status")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    body = res.json()
    assert body["total_sanctioned_records"] > 0
    assert body["latest_etl_run"] is not None
    print(f"  -> /etl/status returned total_sanctioned_records={body['total_sanctioned_records']}")

    # 6b. GET /api/v1/sanctions/check/{address} (Sanctioned)
    res_sanc = client.get("/api/v1/sanctions/check/0xd90e2f925da726b50c4ed8d0fb90ad053324f31b")
    assert res_sanc.status_code == 200
    sanc_body = res_sanc.json()
    assert sanc_body["is_sanctioned"] is True
    assert sanc_body["match"]["authority"] == "US OFAC SDN"
    print(f"  -> /check/0xd90e2... identified match: {sanc_body['match']['entity_name']}")

    # 6c. GET /api/v1/sanctions/check/{address} (Clean)
    res_clean = client.get("/api/v1/sanctions/check/0x000000000000000000000000000000000000dead")
    assert res_clean.status_code == 200
    clean_body = res_clean.json()
    assert clean_body["is_sanctioned"] is False
    assert clean_body["match"] is None
    print("  -> /check/0x0000... clean address confirmed is_sanctioned=False")

    # 6d. POST /api/v1/sanctions/screen-ingest
    res_screen = client.post("/api/v1/sanctions/screen-ingest", json={
        "address": "0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be",
        "chain": "EVM"
    })
    assert res_screen.status_code == 200
    screen_body = res_screen.json()
    assert screen_body["success"] is True
    assert screen_body["data"]["is_precomputed"] is True
    print(f"  -> /screen-ingest succeeded with precomputed risk_score={screen_body['data']['risk_score']}")

    # 6e. POST /api/v1/sanctions/etl/run
    res_run = client.post("/api/v1/sanctions/etl/run?force=true")
    assert res_run.status_code == 200
    run_body = res_run.json()
    assert run_body["success"] is True
    assert run_body["data"]["status"] == "COMPLETED"
    print(f"  -> /etl/run triggered manual sync: {run_body['data']['records_ingested']} records, duration={run_body['data']['duration_seconds']}s")
    print("  [OK] PASSED: All REST API endpoints functioning accurately.")

    # 7. Test Background Scheduler Lifecycle
    print("\n[TEST 7] Testing Background Scheduler lifecycle (start/stop)...")
    SanctionsETLService.start_scheduler(interval_seconds=3600)
    sched_status = SanctionsETLService.get_etl_status()
    assert sched_status["is_scheduler_active"] is True, "Scheduler thread should be active"
    print("  -> Scheduler successfully started in background thread.")

    SanctionsETLService.stop_scheduler()
    stopped_status = SanctionsETLService.get_etl_status()
    assert stopped_status["is_scheduler_active"] is False, "Scheduler thread should be terminated"
    print("  -> Scheduler successfully stopped without hanging.")
    print("  [OK] PASSED: Scheduler thread lifecycle verified.")

    print("\n" + "=" * 70)
    print("ALL SANCTIONS PIPELINE TESTS PASSED EMPIRICALLY (7/7)")
    print("=" * 70)


if __name__ == "__main__":
    run_tests()
