"""
test_public_lookup.py - Verification suite for Task 10 Public No-Login Lookup Tool.
Tests unauthenticated public lookup, multi-chain address and tx_hash identification,
sliding-window IP rate limiting (429 handling), and strictly zero case creation.
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from fastapi.testclient import TestClient
from app.main import app
from app.services.rate_limiter import public_rate_limiter, SlidingWindowRateLimiter
from app.services.public_lookup import PublicLookupService
from app.services.case_service import list_cases

client = TestClient(app)


def test_rate_limiter_isolated():
    print("[TEST 1] Testing SlidingWindowRateLimiter logic in isolation...")
    limiter = SlidingWindowRateLimiter(default_limit=5, default_window_seconds=10)
    test_ip = "192.168.1.100"

    # First 5 requests must pass
    for i in range(5):
        allowed, remaining, reset_sec = limiter.check_rate_limit(test_ip)
        assert allowed is True, f"Request {i+1} should be permitted"
        assert remaining == 5 - (i + 1)
        assert reset_sec > 0

    # 6th request within window must be denied
    allowed, remaining, reset_sec = limiter.check_rate_limit(test_ip)
    assert allowed is False
    assert remaining == 0
    assert reset_sec > 0
    print("  -> Rate limiter permitted exactly 5 requests and rejected the 6th with remaining=0.")


def test_public_address_lookup_clean():
    print("[TEST 2] Testing public lookup of clean unattributed address...")
    res = PublicLookupService.lookup("TVictim0001TRONTaskScamXXXXXXXXX")
    assert res["query_type"] == "address"
    assert res["chain"] == "TRON"
    assert res["sanctions_match"] is False
    assert res["risk_score"] < 50
    assert len(res["top_labels"]) > 0
    assert "summary" in res
    print(f"  -> Clean address evaluated: Score {res['risk_score']}, Chain {res['chain']}, Labels: {res['top_labels']}")


def test_public_address_lookup_sanctioned():
    print("[TEST 3] Testing public lookup of OFAC sanctioned address...")
    # Blender.io / Lazarus sanctioned address
    sanctioned_addr = "0xd90e2f925da726b50c4ed8d0fb90ad053324f31b"
    res = PublicLookupService.lookup(sanctioned_addr)
    assert res["query_type"] == "address"
    assert res["chain"] == "EVM"
    assert res["sanctions_match"] is True
    assert res["risk_score"] == 100
    assert res["severity"] == "CRITICAL"
    assert res["sanctions_details"] is not None
    assert "Tornado Cash" in res["sanctions_details"]["entity_name"]
    print("  -> Sanctioned address correctly flagged with score 100/100 and OFAC details.")


def test_public_address_lookup_vasp():
    print("[TEST 4] Testing public lookup of CoinDCX VASP deposit address...")
    res = PublicLookupService.lookup("TCoinDCXDeposit0001XXXXXXXXXXXXXXXX")
    assert res["query_type"] == "address"
    assert res["chain"] == "TRON"
    assert res["risk_mode"] == "static_entity"
    assert res["risk_score"] >= 70
    assert any("CoinDCX" in lbl or "VASP" in lbl for lbl in res["top_labels"])
    print(f"  -> VASP deposit identified: Labels {res['top_labels']}, Risk Mode {res['risk_mode']}")


def test_public_tx_hash_lookup():
    print("[TEST 5] Testing public lookup of 64-char transaction hash...")
    tx_hash = "0x8f4c010000000000000000000000000000000000000000000000000000000001"
    res = PublicLookupService.lookup(tx_hash)
    assert res["query_type"] == "tx_hash"
    assert res["chain"] == "EVM"
    assert len(res["top_labels"]) > 0
    assert "summary" in res
    print(f"  -> Tx hash evaluated: Type {res['query_type']}, Chain {res['chain']}, Score {res['risk_score']}")


def test_zero_case_creation_guarantee():
    print("[TEST 6] Testing STRICT NO-CASE-CREATION guarantee...")
    initial_cases = list_cases()
    initial_count = len(initial_cases)

    # Perform multiple lookups
    PublicLookupService.lookup("TVictim0001TRONTaskScamXXXXXXXXX")
    PublicLookupService.lookup("0xd90e2f925da726b50c4ed8d0fb90ad053324f31b")
    PublicLookupService.lookup("0x8f4c010000000000000000000000000000000000000000000000000000000001")

    after_cases = list_cases()
    after_count = len(after_cases)

    assert initial_count == after_count, f"Case count changed from {initial_count} to {after_count}! Public lookups MUST NOT create cases."
    print(f"  -> Zero-case-creation verified: case count remained unchanged at {after_count}.")


def test_fastapi_public_lookup_endpoints():
    print("[TEST 7] Testing FastAPI endpoints GET & POST /api/v1/public/lookup...")
    public_rate_limiter.reset()

    # GET endpoint
    resp_get = client.get(
        "/api/v1/public/lookup?query=TVictim0001TRONTaskScamXXXXXXXXX",
        headers={"X-Forwarded-For": "10.0.0.1"}
    )
    assert resp_get.status_code == 200, f"GET failed: {resp_get.text}"
    data_get = resp_get.json()
    assert data_get["chain"] == "TRON"
    assert "rate_limit" in data_get
    assert resp_get.headers.get("X-RateLimit-Limit") == "30"

    # POST endpoint
    resp_post = client.post(
        "/api/v1/public/lookup",
        json={"query": "0xd90e2f925da726b50c4ed8d0fb90ad053324f31b"},
        headers={"X-Forwarded-For": "10.0.0.1"}
    )
    assert resp_post.status_code == 200, f"POST failed: {resp_post.text}"
    data_post = resp_post.json()
    assert data_post["sanctions_match"] is True
    print("  -> GET and POST endpoints responded HTTP 200 with X-RateLimit headers.")


def test_ip_rate_limiting_http_429():
    print("[TEST 8] Testing IP rate limiting enforcement (HTTP 429 Too Many Requests)...")
    public_rate_limiter.reset()
    spam_ip = "198.51.100.42"

    # Send 30 requests (the limit)
    for i in range(30):
        resp = client.get(
            "/api/v1/public/lookup?query=TVictim0001TRONTaskScamXXXXXXXXX",
            headers={"X-Forwarded-For": spam_ip}
        )
        assert resp.status_code == 200, f"Request {i+1} failed unexpectedly with status {resp.status_code}"

    # 31st request must trigger HTTP 429
    resp_blocked = client.get(
        "/api/v1/public/lookup?query=TVictim0001TRONTaskScamXXXXXXXXX",
        headers={"X-Forwarded-For": spam_ip}
    )
    assert resp_blocked.status_code == 429, f"Expected 429 Too Many Requests, got {resp_blocked.status_code}"
    assert "Retry-After" in resp_blocked.headers
    assert resp_blocked.headers.get("X-RateLimit-Remaining") == "0"
    print("  -> 31st request from IP successfully blocked with HTTP 429 and Retry-After header.")

    # Another IP should still be unblocked
    resp_other = client.get(
        "/api/v1/public/lookup?query=TVictim0001TRONTaskScamXXXXXXXXX",
        headers={"X-Forwarded-For": "203.0.113.88"}
    )
    assert resp_other.status_code == 200
    print("  -> Distinct IP was correctly unaffected by other IP's exhaustion.")


if __name__ == "__main__":
    print("=== RUNNING TASK 10 PUBLIC NO-LOGIN LOOKUP TOOL TESTS ===")
    test_rate_limiter_isolated()
    test_public_address_lookup_clean()
    test_public_address_lookup_sanctioned()
    test_public_address_lookup_vasp()
    test_public_tx_hash_lookup()
    test_zero_case_creation_guarantee()
    test_fastapi_public_lookup_endpoints()
    test_ip_rate_limiting_http_429()
    print("=== ALL TASK 10 TESTS PASSED ACCREDITED! ===")
