"""
test_batch_screening.py - Comprehensive Unit & Integration Test Suite for TASK 6.
Validates:
  1. Address parsing from raw CSV/TXT text with headers and deduplication.
  2. Sanctions catalog matching (Lazarus Group, Tornado Cash, Garantex, Sinbad, Blender).
  3. Single address screening schema parity (address, risk_score, sanctions_match, provenance, risk_mode).
  4. Asynchronous queue performance with 1,000+ addresses without blocking.
  5. RFC-4180 CSV export formatting.
  6. FastAPI REST endpoints (POST /batch, POST /upload, GET /batch/{id}, GET /export/csv).
"""

import os
import sys
import io
import time
import csv
import unittest
from pathlib import Path

# Add backend directory to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from app.services.sanctions_catalog import check_sanctions, is_sanctioned_address
from app.services.batch_screener import (
    BatchScreener,
    parse_addresses_from_text,
    infer_blockchain,
)
from app.main import app
from starlette.testclient import TestClient


class TestBatchScreening(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_01_address_parsing_csv_txt(self):
        """Validates robust parsing of multi-chain addresses from CSV/TXT text with headers."""
        sample_csv = """# Investigative Screening List
address,notes,case_reference
0xd90e2f925da726b50c4ed8d0fb90ad053324f31b,Tornado Cash Router,FIR-101
TCoinDCXDeposit0001XXXXXXXXXXXXXXXX,Suspect CoinDCX off-ramp,FIR-102
bc1qlazarus0000000000000000000000000000001,Bitcoin cash-out wallet,FIR-103
0xd90e2f925da726b50c4ed8d0fb90ad053324f31b,Duplicate entry test,FIR-104
0x71c3fb9904d3e33e9d8f8e02d847b74f38e63021,CoinDCX Hot Wallet,REGULATED
TVictim0001TRONTaskScamXXXXXXXXX,Complainant wallet,FIR-105
"""
        parsed = parse_addresses_from_text(sample_csv)
        # Deduplication must remove duplicate Tornado Cash entry
        self.assertEqual(len(parsed), 5)
        self.assertIn("0xd90e2f925da726b50c4ed8d0fb90ad053324f31b", parsed)
        self.assertIn("TCoinDCXDeposit0001XXXXXXXXXXXXXXXX", parsed)
        self.assertIn("bc1qlazarus0000000000000000000000000000001", parsed)
        self.assertIn("0x71c3fb9904d3e33e9d8f8e02d847b74f38e63021", parsed)
        self.assertIn("TVictim0001TRONTaskScamXXXXXXXXX", parsed)
        print("  [PASS] Address parsing from CSV/TXT with header skip & deduplication")

    def test_02_sanctions_catalog_matching(self):
        """Validates detection of OFAC SDN, UN, and international sanctions hits."""
        # Lazarus Group (Ronin Bridge exploiter)
        lazarus_hit = check_sanctions("0x098b716b8aaf21512996dc57eb0615e2383e2f96")
        self.assertIsNotNone(lazarus_hit)
        self.assertIn("Lazarus", lazarus_hit.entity_name)
        self.assertEqual(lazarus_hit.authority, "US OFAC SDN")
        self.assertEqual(lazarus_hit.program, "OFAC-DPRK")
        self.assertEqual(lazarus_hit.base_risk_score, 100)

        # Tornado Cash
        tornado_hit = check_sanctions("0xd90e2f925da726b50c4ed8d0fb90ad053324f31b")
        self.assertIsNotNone(tornado_hit)
        self.assertIn("Tornado Cash", tornado_hit.entity_name)
        self.assertEqual(tornado_hit.category, "mixer")

        # Garantex Russia OTC
        garantex_hit = check_sanctions("0xgarantex000000000000000000000000000000001")
        self.assertIsNotNone(garantex_hit)
        self.assertIn("Garantex", garantex_hit.entity_name)

        # Clean address must not hit sanctions
        clean_hit = check_sanctions("0x1111111111111111111111111111111111111111")
        self.assertIsNone(clean_hit)
        self.assertFalse(is_sanctioned_address("0x1111111111111111111111111111111111111111"))
        print("  [PASS] Sanctions catalog matching (Lazarus, Tornado, Garantex, Clean)")

    def test_03_single_address_screening_schema(self):
        """Validates exact fields required by prompt: address, risk_score, sanctions_match y/n, provenance."""
        # Sanctioned entity screening
        res_sanc = BatchScreener.screen_single_address("0xlazarus0000000000000000000000000000000001")
        self.assertEqual(res_sanc["address"], "0xlazarus0000000000000000000000000000000001")
        self.assertEqual(res_sanc["chain"], "EVM")
        self.assertEqual(res_sanc["risk_score"], 100)
        self.assertEqual(res_sanc["risk_mode"], "static_entity")
        self.assertEqual(res_sanc["severity"], "CRITICAL")
        self.assertTrue(res_sanc["sanctions_match"])
        self.assertEqual(res_sanc["provenance"], "offchain_verified")
        self.assertIn("Lazarus", res_sanc["sanctions_entity"])

        # Regulated exchange hot wallet screening
        res_cex = BatchScreener.screen_single_address("0x71c3fb9904d3e33e9d8f8e02d847b74f38e63021")
        self.assertEqual(res_cex["chain"], "EVM")
        self.assertEqual(res_cex["risk_score"], 25)
        self.assertEqual(res_cex["risk_mode"], "static_entity")
        self.assertEqual(res_cex["severity"], "LOW")
        self.assertFalse(res_cex["sanctions_match"])
        self.assertEqual(res_cex["provenance"], "offchain_verified")

        # Unattributed wallet dynamic screening
        res_dyn = BatchScreener.screen_single_address("0x9999999999999999999999999999999999999999")
        self.assertEqual(res_dyn["chain"], "EVM")
        self.assertEqual(res_dyn["risk_mode"], "dynamic_behavioral")
        self.assertFalse(res_dyn["sanctions_match"])
        self.assertEqual(res_dyn["provenance"], "automated_clustering")
        print("  [PASS] Single address screening schema and provenance tagging")

    def test_04_async_queue_at_scale_1000_addresses(self):
        """Validates high-throughput async queue handles 1,000+ addresses non-blockingly."""
        # Generate 1,050 mixed addresses
        addrs = [
            "0xlazarus0000000000000000000000000000000001",
            "0xd90e2f925da726b50c4ed8d0fb90ad053324f31b",
            "0xgarantex000000000000000000000000000000001",
            "TCoinDCXDeposit0001XXXXXXXXXXXXXXXX",
            "0x71c3fb9904d3e33e9d8f8e02d847b74f38e63021",
        ]
        for i in range(len(addrs), 1050):
            if i % 2 == 0:
                addrs.append(f"0x{i:08x}abcdef0123456789abcdef0123456789")
            else:
                addrs.append(f"T{i:08d}TronAddressForTestingSyntheticXXXX")

        # Create job — returns immediately
        start_t = time.perf_counter()
        job = BatchScreener.create_job(addrs, file_name="scale_test.csv")
        queue_latency_ms = (time.perf_counter() - start_t) * 1000

        # Queue creation must be instantaneous (< 50ms) to prove non-blocking execution
        self.assertLess(queue_latency_ms, 50.0)
        self.assertEqual(job.total, 1050)
        self.assertIn(job.status, ("queued", "processing"))

        # Poll job until completed (timeout 10s)
        max_wait = 10.0
        elapsed = 0.0
        while job.status != "completed" and elapsed < max_wait:
            time.sleep(0.05)
            elapsed += 0.05
            job = BatchScreener.get_job(job.job_id)

        self.assertEqual(job.status, "completed")
        self.assertEqual(job.processed, 1050)
        self.assertEqual(job.progress_pct, 100.0)
        self.assertEqual(len(job.results), 1050)
        self.assertGreaterEqual(job.summary["sanctions_hits"], 3)
        self.assertGreaterEqual(job.summary["critical_risk"], 4)
        self.assertGreater(job.duration_ms, 0)
        print(f"  [PASS] Async queue screened 1,050 addresses in {job.duration_ms}ms (queue latency: {queue_latency_ms:.2f}ms)")

    def test_05_rfc4180_csv_export(self):
        """Validates CSV generation adheres strictly to RFC 4180 standard."""
        test_addrs = [
            "0xlazarus0000000000000000000000000000000001",
            "0x71c3fb9904d3e33e9d8f8e02d847b74f38e63021",
        ]
        job = BatchScreener.create_job(test_addrs, file_name="export_test.csv")
        while job.status != "completed":
            time.sleep(0.02)
            job = BatchScreener.get_job(job.job_id)

        csv_text = BatchScreener.generate_csv(job)
        reader = csv.reader(io.StringIO(csv_text))
        rows = list(reader)

        # Verify header
        header = rows[0]
        self.assertEqual(header[0], "Address")
        self.assertEqual(header[1], "Chain")
        self.assertEqual(header[2], "Risk Score")
        self.assertEqual(header[3], "Risk Mode")
        self.assertEqual(header[5], "Sanctions Match")
        self.assertEqual(header[8], "Provenance")

        # Verify rows
        self.assertEqual(len(rows), 3) # Header + 2 data rows
        row1 = rows[1]
        self.assertEqual(row1[0], "0xlazarus0000000000000000000000000000000001")
        self.assertEqual(row1[2], "100")
        self.assertEqual(row1[5], "YES")
        self.assertEqual(row1[8], "offchain_verified")
        print("  [PASS] RFC-4180 CSV export generation and header compliance")

    def test_06_fastapi_rest_endpoints(self):
        """Validates FastAPI REST endpoints for batch screening, upload, and export."""
        # 1. POST /api/v1/screening/batch
        payload = {
            "addresses": [
                "0xd90e2f925da726b50c4ed8d0fb90ad053324f31b",
                "TCoinDCXDeposit0001XXXXXXXXXXXXXXXX",
                "TVictim0001TRONTaskScamXXXXXXXXX",
            ],
            "file_name": "api_test.json"
        }
        res_post = self.client.post("/api/v1/screening/batch", json=payload)
        self.assertEqual(res_post.status_code, 202)
        job_data = res_post.json()
        self.assertIn("job_id", job_data)
        self.assertEqual(job_data["total"], 3)
        job_id = job_data["job_id"]

        # 2. GET /api/v1/screening/batch/{job_id}
        # Poll until complete
        completed = False
        for _ in range(50):
            res_get = self.client.get(f"/api/v1/screening/batch/{job_id}?offset=0&limit=10")
            self.assertEqual(res_get.status_code, 200)
            status_data = res_get.json()
            if status_data["status"] == "completed":
                completed = True
                break
            time.sleep(0.05)

        self.assertTrue(completed)
        self.assertEqual(len(status_data["results"]), 3)
        self.assertEqual(status_data["progress_pct"], 100.0)

        # 3. GET /api/v1/screening/batch/{job_id}/results?sanctions_only=true
        res_filt = self.client.get(f"/api/v1/screening/batch/{job_id}/results?sanctions_only=true")
        self.assertEqual(res_filt.status_code, 200)
        filt_data = res_filt.json()
        self.assertEqual(filt_data["filtered_count"], 1)
        self.assertEqual(filt_data["results"][0]["address"], "0xd90e2f925da726b50c4ed8d0fb90ad053324f31b")

        # 4. GET /api/v1/screening/batch/{job_id}/export/csv
        res_csv = self.client.get(f"/api/v1/screening/batch/{job_id}/export/csv")
        self.assertEqual(res_csv.status_code, 200)
        self.assertEqual(res_csv.headers["content-type"], "text/csv; charset=utf-8")
        self.assertIn("attachment; filename=", res_csv.headers["content-disposition"])
        self.assertIn("Tornado Cash", res_csv.text)

        # 5. POST /api/v1/screening/upload (Multipart CSV)
        csv_file_bytes = b"address,notes\n0xlazarus0000000000000000000000000000000001,Sanctioned\n0x71c3fb9904d3e33e9d8f8e02d847b74f38e63021,Clean\n"
        res_upload = self.client.post(
            "/api/v1/screening/upload",
            files={"file": ("test_investigation.csv", csv_file_bytes, "text/csv")},
        )
        self.assertEqual(res_upload.status_code, 202)
        upload_data = res_upload.json()
        self.assertIn("job_id", upload_data)
        self.assertEqual(upload_data["total"], 2)

        # 6. GET /api/v1/screening/sample
        res_sample = self.client.get("/api/v1/screening/sample?count=50")
        self.assertEqual(res_sample.status_code, 200)
        self.assertEqual(res_sample.json()["count"], 50)

        print("  [PASS] FastAPI REST endpoints (batch queue, upload CSV, poll, filter, export, sample)")


def run_tests():
    print("\nRunning TASK 6 Bulk/Batch Address Screening test suite...")
    suite = unittest.TestLoader().loadTestsFromTestCase(TestBatchScreening)
    runner = unittest.TextTestRunner(verbosity=1)
    result = runner.run(suite)
    if not result.wasSuccessful():
        print(f"FAILED: {len(result.failures)} failures, {len(result.errors)} errors")
        sys.exit(1)
    print("\nALL TASK 6 TESTS PASSED SUCCESSFULLY!\n")


if __name__ == "__main__":
    run_tests()
