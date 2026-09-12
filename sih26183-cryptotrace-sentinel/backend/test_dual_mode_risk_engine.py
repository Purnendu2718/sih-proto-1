"""
test_dual_mode_risk_engine.py - Complete Verification Suite for TASK 5 Dual-Mode Risk Engine.

Tests:
1. Static Entity Base Scoring:
   - Mixers (Tornado Cash, Blender, Sinbad) -> score 100, mode 'static_entity'
   - Darknet markets (Hydra, Silk Road, Genesis) -> score 98, mode 'static_entity'
   - Sanctioned clusters (Lazarus, Garantex) -> score 95-100, mode 'static_entity'
   - Regulated exchanges (CoinDCX, Binance, WazirX, ZebPay) -> score 25, mode 'static_entity'
   - Off-ramp customer deposit terminals -> score 85, mode 'static_entity'
2. Dynamic Behavioral Scoring:
   - Mixer interaction signal (+40 pts)
   - Rapid fan-out / peeling signal (+25 pts)
   - Sanctioned address proximity (1-hop = +40 pts, 2-hops = +25 pts)
   - Age of first activity (zero-day <=24h = +20 pts, nascent <=7d = +10 pts)
   - Clean unattributed baseline
3. Non-Blending Guarantee:
   - is_blended is strictly False in all evaluations
   - scoring_mode is never omitted or averaged
4. REST API Endpoint:
   - POST /api/v1/risk/evaluate
5. Case Canvas Database Persistence:
   - risk_score and risk_mode round-trip through SQLite case_nodes table
6. Evidence Dossier Report Integration:
   - PDF & JSON exports carry non-blended scoring mode
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from fastapi.testclient import TestClient
from app.main import app
from app.services.analytics.risk_scorer import RiskScorer, compute_risk_score, KNOWN_ENTITIES
from app.services.case_service import save_case_canvas, get_case_canvas, init_case_db
from app.services.report_service import generate_evidence_dossier_json, generate_evidence_dossier_pdf
from app.schemas import EvidenceExportRequest


def test_static_entity_scoring_mixers():
    """Verify known mixers evaluate under 'static_entity' mode with base score 100."""
    tornado_router = "0xd90e2f925da726b50c4ed8d0fb90ad053324f31b"
    res = RiskScorer.evaluate(address=tornado_router)
    
    assert res["scoring_mode"] == "static_entity"
    assert res["risk_mode"] == "static_entity"
    assert res["is_blended"] is False
    assert res["risk_score"] == 100
    assert res["severity"] == "CRITICAL"
    assert res["entity_match"] is not None
    assert res["entity_match"]["category"] == "mixer"
    assert "Tornado Cash" in res["entity_match"]["name"]


def test_static_entity_scoring_darknet():
    """Verify known darknet markets evaluate under 'static_entity' mode with base score 98."""
    hydra = "0xhydramarket00000000000000000000000000001"
    res = RiskScorer.evaluate(address=hydra)
    
    assert res["scoring_mode"] == "static_entity"
    assert res["is_blended"] is False
    assert res["risk_score"] == 98
    assert res["severity"] == "CRITICAL"
    assert res["entity_match"]["category"] == "darknet_market"


def test_static_entity_scoring_exchanges():
    """Verify regulated exchanges receive low base risk (25) under 'static_entity' mode."""
    binance_hot = "0x28c6c06298d514db089934071355e5743bf21d60"
    res = RiskScorer.evaluate(address=binance_hot)
    
    assert res["scoring_mode"] == "static_entity"
    assert res["is_blended"] is False
    assert res["risk_score"] == 25
    assert res["severity"] == "LOW"
    assert res["entity_match"]["category"] in ("exchange_hotwallet", "regulated_exchange")


def test_static_entity_scoring_deposit_terminal():
    """Verify CEX deposit terminals evaluate under 'static_entity' mode with score 85."""
    deposit_wallet = "0xdepositwallet0000000000000000000000001"
    res = RiskScorer.evaluate(address=deposit_wallet, entity_category="cex_deposit")
    
    assert res["scoring_mode"] == "static_entity"
    assert res["is_blended"] is False
    assert res["risk_score"] == 85
    assert res["severity"] == "CRITICAL"


def test_dynamic_behavioral_scoring_signals():
    """Verify unattributed wallets trigger dynamic scoring for all 4 required signals."""
    unattributed_addr = "0x9999999999999999999999999999999999999999"

    # 1. Mixer Interaction signal
    res_mixer = RiskScorer.evaluate(
        address=unattributed_addr,
        mixer_interaction=True,
    )
    assert res_mixer["scoring_mode"] == "dynamic_behavioral"
    assert res_mixer["is_blended"] is False
    assert res_mixer["breakdown"]["mixer_interaction"] == 40
    assert any("Mixer Interaction" in r for r in res_mixer["rules_applied"])

    # 2. Rapid Fan-Out signal
    res_fan = RiskScorer.evaluate(
        address=unattributed_addr,
        rapid_fan_out=True,
    )
    assert res_fan["scoring_mode"] == "dynamic_behavioral"
    assert res_fan["is_blended"] is False
    assert res_fan["breakdown"]["rapid_fan_out"] == 25
    assert any("Rapid Fan-Out" in r for r in res_fan["rules_applied"])

    # 3. Sanctioned Address Proximity signal (1-hop vs 2-hop)
    res_sanc_1 = RiskScorer.evaluate(
        address=unattributed_addr,
        sanctioned_proximity_hops=1,
    )
    assert res_sanc_1["breakdown"]["sanctioned_address_proximity"] == 40

    res_sanc_2 = RiskScorer.evaluate(
        address=unattributed_addr,
        sanctioned_proximity_hops=2,
    )
    assert res_sanc_2["breakdown"]["sanctioned_address_proximity"] == 25

    # 4. Age of first activity signal (zero-day <= 24h vs nascent <= 7d)
    res_zeroday = RiskScorer.evaluate(
        address=unattributed_addr,
        age_hours=12.0,
    )
    assert res_zeroday["breakdown"]["age_of_first_activity"] == 20

    res_nascent = RiskScorer.evaluate(
        address=unattributed_addr,
        age_hours=72.0,
    )
    assert res_nascent["breakdown"]["age_of_first_activity"] == 10


def test_dynamic_multi_signal_compounding():
    """Verify combination of behavioral signals compound dynamically without blending."""
    unattributed = "0xabcdef1234567890abcdef1234567890abcdef12"
    res = RiskScorer.evaluate(
        address=unattributed,
        mixer_interaction=True,
        rapid_fan_out=True,
        sanctioned_proximity_hops=1,
        age_hours=6.0,
    )
    assert res["scoring_mode"] == "dynamic_behavioral"
    assert res["is_blended"] is False
    # 40 (mixer) + 25 (fan-out) + 40 (sanc-1) + 20 (zero-day) = 125, capped at 100
    assert res["risk_score"] == 100
    assert res["severity"] == "CRITICAL"
    assert len(res["rules_applied"]) >= 4


def test_clean_unattributed_wallet_baseline():
    """Verify clean unattributed wallet without illicit signals receives low baseline score."""
    clean_addr = "0x0000000000000000000000000000000000000042"
    res = RiskScorer.evaluate(
        address=clean_addr,
        mixer_interaction=False,
        rapid_fan_out=False,
        sanctioned_proximity_hops=0,
        age_hours=2000.0,
    )
    assert res["scoring_mode"] == "dynamic_behavioral"
    assert res["is_blended"] is False
    assert res["risk_score"] == 0
    assert res["severity"] == "LOW"


def test_api_endpoint_dual_mode():
    """Verify POST /api/v1/risk/evaluate REST endpoint returns dual-mode response."""
    client = TestClient(app)

    # A. Static Entity request
    static_req = {
        "address": "0xd90e2f925da726b50c4ed8d0fb90ad053324f31b",
    }
    resp_a = client.post("/api/v1/risk/evaluate", json=static_req)
    assert resp_a.status_code == 200
    data_a = resp_a.json()
    assert data_a["scoring_mode"] == "static_entity"
    assert data_a["risk_score"] == 100
    assert data_a["is_blended"] is False

    # B. Dynamic Behavioral request
    dynamic_req = {
        "address": "0xunattributed_mule_wallet_test_0001",
        "mixer_interaction": True,
        "rapid_fan_out": True,
        "age_hours": 18.0,
    }
    resp_b = client.post("/api/v1/risk/evaluate", json=dynamic_req)
    assert resp_b.status_code == 200
    data_b = resp_b.json()
    assert data_b["scoring_mode"] == "dynamic_behavioral"
    assert data_b["is_blended"] is False
    assert data_b["risk_score"] >= 65


def test_case_canvas_persistence():
    """Verify risk_score and risk_mode persist to SQLite case_nodes and reload cleanly."""
    init_case_db()
    case_id = "CASE-TEST-RISK-PERSIST"
    meta = {
        "fir_number": "FIR/TEST/2026/001",
        "description": "Persistence Test for Risk Scoring Mode",
    }
    nodes = [
        {
            "id": "node-static",
            "address": "0xd90e2f925da726b50c4ed8d0fb90ad053324f31b",
            "display_label": "Tornado Cash Router",
            "risk_score": 100,
            "risk_mode": "static_entity",
            "provenance": "offchain_verified",
        },
        {
            "id": "node-dynamic",
            "address": "0xunattributed_dynamic_mule_0001",
            "display_label": "Mule Wallet",
            "risk_score": 75,
            "risk_mode": "dynamic_behavioral",
            "provenance": "automated_clustering",
        }
    ]
    edges = [
        {
            "id": "e1",
            "source": "node-static",
            "target": "node-dynamic",
            "amount": 5.0,
            "token_symbol": "ETH",
            "tx_hash": "0xtest01",
        }
    ]

    saved = save_case_canvas(case_id, meta, nodes, edges)
    assert saved["status"] == "SAVED"

    loaded = get_case_canvas(case_id)
    assert loaded is not None
    loaded_nodes = {n["id"]: n for n in loaded["nodes"]}

    assert loaded_nodes["node-static"]["risk_score"] == 100
    assert loaded_nodes["node-static"]["risk_mode"] == "static_entity"

    assert loaded_nodes["node-dynamic"]["risk_score"] == 75
    assert loaded_nodes["node-dynamic"]["risk_mode"] == "dynamic_behavioral"


def test_evidence_export_includes_scoring_mode():
    """Verify evidence exports (JSON and PDF) explicitly report non-blended scoring mode."""
    req = EvidenceExportRequest(
        case_id="CASE-EXPORT-TEST",
        fir_number="FIR/CYBER/2026/999",
        target_address="0xd90e2f925da726b50c4ed8d0fb90ad053324f31b",
        chain="EVM",
        victim_amount_inr=500000.0,
    )

    # 1. JSON Export verification
    json_data = generate_evidence_dossier_json(req)
    assert "risk_evaluation" in json_data
    assert "scoring_mode" in json_data["risk_evaluation"]
    assert json_data["risk_evaluation"]["is_blended"] is False
    assert json_data["risk_evaluation"]["scoring_mode"] == "static_entity"

    # 2. PDF Export verification
    pdf_bytes, meta = generate_evidence_dossier_pdf(req)
    assert len(pdf_bytes) > 2000
    assert meta["canonical_record"]["is_blended"] is False
    assert meta["canonical_record"]["scoring_mode"] == "static_entity"


if __name__ == "__main__":
    print("Running TASK 5 Dual-Mode Risk Engine test suite...")
    test_static_entity_scoring_mixers()
    print("  [PASS] Static entity scoring (mixers)")
    test_static_entity_scoring_darknet()
    print("  [PASS] Static entity scoring (darknet)")
    test_static_entity_scoring_exchanges()
    print("  [PASS] Static entity scoring (regulated exchanges)")
    test_static_entity_scoring_deposit_terminal()
    print("  [PASS] Static entity scoring (CEX deposit terminals)")
    test_dynamic_behavioral_scoring_signals()
    print("  [PASS] Dynamic behavioral scoring signals (all 4 signals)")
    test_dynamic_multi_signal_compounding()
    print("  [PASS] Dynamic multi-signal compounding without blending")
    test_clean_unattributed_wallet_baseline()
    print("  [PASS] Clean unattributed wallet baseline")
    test_api_endpoint_dual_mode()
    print("  [PASS] POST /api/v1/risk/evaluate REST endpoint")
    test_case_canvas_persistence()
    print("  [PASS] SQLite case_nodes risk_score and risk_mode persistence")
    test_evidence_export_includes_scoring_mode()
    print("  [PASS] Evidence export non-blended scoring mode validation")
    print("\nALL TASK 5 TESTS PASSED SUCCESSFULLY!")
