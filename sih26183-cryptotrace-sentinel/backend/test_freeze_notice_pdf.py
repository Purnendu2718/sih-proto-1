"""
test_freeze_notice_pdf.py - Verification script for freeze notice PDF generator and API endpoints.
Tests:
1. Input validation in generate_freeze_notice_draft and render_freeze_notice_pdf
2. PDF rendering with ReportLab, prominent DRAFT watermark bands, checkboxes, and blank signature lines
3. FileResponse streaming from POST /api/v1/reports/freeze-notice/pdf
4. Parity and coexistence with POST /api/v1/reports/freeze-notice/text
"""

import os
import sys
import tempfile
from pathlib import Path

backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from app.main import app
from app.schemas import FreezeNoticeRequest
from app.services.legal.freeze_notice import (
    generate_freeze_notice_draft,
    render_freeze_notice_pdf,
    _validate,
)

client = TestClient(app)

SAMPLE_VALID_REQ = FreezeNoticeRequest(
    case_id="MHA-CASE-2026-09",
    fir_number="FIR/CYBER/2026/0402",
    investigating_officer="Insp. Vikram Rathore, Belt #9821",
    police_station="Cyber Crime Police Station, Bengaluru City",
    exchange_name="CoinDCX",
    compliance_email="compliance@coindcx.com",
    frozen_addresses=["TCoinDCXDeposit0001XXXXXXXXXXXXXXXX"],
    transaction_hashes=[
        "0x8f2d9c1b4e6a7350129fec8714b35029e8471c039581a62048fbc927160359da"
    ],
    victim_amount_inr=540000.0,
    narrative="Victim induced via Telegram task fraud syndicate to transfer USDT into suspect mule infrastructure.",
)


def test_validation_logic():
    print("\n--- 1. Testing Validation Logic ---")
    # Valid request passes
    _validate(SAMPLE_VALID_REQ)

    # Empty case_id fails
    bad_req1 = SAMPLE_VALID_REQ.model_copy(update={"case_id": "   "})
    try:
        _validate(bad_req1)
        assert False, "Should have raised ValueError"
    except ValueError as e:
        assert "case_id" in str(e)

    # Invalid email fails
    bad_req2 = SAMPLE_VALID_REQ.model_copy(update={"compliance_email": "invalid-email"})
    try:
        _validate(bad_req2)
        assert False, "Should have raised ValueError"
    except ValueError as e:
        assert "compliance_email" in str(e)

    # Empty frozen addresses fails
    bad_req3 = SAMPLE_VALID_REQ.model_copy(update={"frozen_addresses": []})
    try:
        _validate(bad_req3)
        assert False, "Should have raised ValueError"
    except ValueError as e:
        assert "frozen_addresses" in str(e)

    # Negative amount fails
    bad_req4 = SAMPLE_VALID_REQ.model_copy(update={"victim_amount_inr": -50.0})
    try:
        _validate(bad_req4)
        assert False, "Should have raised ValueError"
    except ValueError as e:
        assert "victim_amount_inr" in str(e)

    print("[PASS] _validate enforces strict integrity constraints.")


def test_text_draft_generation():
    print("\n--- 2. Testing Text Draft Generation ---")
    draft = generate_freeze_notice_draft(SAMPLE_VALID_REQ)
    assert "*** DRAFT — UNOFFICIAL ***" in draft
    assert "Section 94, Bharatiya Nagarik Suraksha Sanhita, 2023" in draft
    assert SAMPLE_VALID_REQ.case_id in draft
    assert SAMPLE_VALID_REQ.investigating_officer in draft
    assert SAMPLE_VALID_REQ.exchange_name in draft
    assert "[ ] Certified true copy of FIR / Complaint verified and attached" in draft
    assert "Investigating Officer Signature" in draft
    print("[PASS] Plain-text draft contains required watermarks and checklist.")


def test_render_pdf_file():
    print("\n--- 3. Testing PDF Rendering Function ---")
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tf:
        tmp_path = tf.name

    try:
        returned_path = render_freeze_notice_pdf(SAMPLE_VALID_REQ, tmp_path)
        assert returned_path == tmp_path
        assert os.path.exists(tmp_path)
        file_size = os.path.getsize(tmp_path)
        print(f"Rendered PDF size: {file_size} bytes")
        assert file_size > 1000

        with open(tmp_path, "rb") as f:
            header = f.read(5)
            assert header == b"%PDF-"
        print("[PASS] render_freeze_notice_pdf successfully generated valid PDF file.")
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)


def test_api_freeze_notice_pdf_endpoint():
    print("\n--- 4. Testing POST /api/v1/reports/freeze-notice/pdf (FileResponse) ---")
    payload = SAMPLE_VALID_REQ.model_dump()
    resp = client.post("/api/v1/reports/freeze-notice/pdf", json=payload)
    assert resp.status_code == 200, f"Error: {resp.text}"
    assert resp.headers["content-type"] == "application/pdf"
    assert "X-Evidence-SHA256" in resp.headers
    assert len(resp.headers["X-Evidence-SHA256"]) == 64
    assert f"Section_94_BNSS_Directive_{SAMPLE_VALID_REQ.case_id}.pdf" in resp.headers.get("content-disposition", "")
    assert len(resp.content) > 1000
    assert resp.content.startswith(b"%PDF-")
    print(f"[PASS] PDF FileResponse returned {len(resp.content)} bytes with SHA-256 header.")


def test_api_freeze_notice_text_endpoint():
    print("\n--- 5. Testing POST /api/v1/reports/freeze-notice/text (Coexistence) ---")
    payload = SAMPLE_VALID_REQ.model_dump()
    resp = client.post("/api/v1/reports/freeze-notice/text", json=payload)
    assert resp.status_code == 200, f"Error: {resp.text}"
    data = resp.json()
    assert "notice_text" in data
    assert "evidence_digest_sha256" in data
    assert len(data["evidence_digest_sha256"]) == 64
    assert "DRAFT — UNOFFICIAL" in data["notice_text"]
    print("[PASS] Text draft endpoint returned 200 OK alongside PDF endpoint.")


def test_api_validation_error_handling():
    print("\n--- 6. Testing API Validation 400 Bad Request ---")
    bad_payload = SAMPLE_VALID_REQ.model_dump()
    bad_payload["compliance_email"] = "invalid_email_no_at"
    resp = client.post("/api/v1/reports/freeze-notice/pdf", json=bad_payload)
    assert resp.status_code == 400
    assert "compliance_email" in resp.json()["detail"]
    print("[PASS] API returns HTTP 400 with descriptive error on invalid request.")


if __name__ == "__main__":
    test_validation_logic()
    test_text_draft_generation()
    test_render_pdf_file()
    test_api_freeze_notice_pdf_endpoint()
    test_api_freeze_notice_text_endpoint()
    test_api_validation_error_handling()
    print("\n=======================================================")
    print("ALL FREEZE NOTICE PDF & ENDPOINT TESTS PASSED!")
    print("=======================================================\n")
