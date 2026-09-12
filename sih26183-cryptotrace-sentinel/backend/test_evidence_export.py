import unittest
from fastapi.testclient import TestClient
from app.main import app
from app.schemas import EvidenceExportRequest
from app.services.report_service import generate_evidence_dossier_pdf, generate_evidence_dossier_json


class TestEvidenceExport(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_generate_evidence_dossier_pdf_direct(self):
        req = EvidenceExportRequest(
            case_id="TEST-EXPORT-CASE-001",
            fir_number="FIR/CYBER/2026/0402",
            ncrp_ack_number="NCRP-2026-991823",
            investigating_officer="Insp. Vikram Rathore",
            police_station="Cyber Crime Police Station",
            target_address="TVictim0001XXXXXXXXXXXXXXXXXXXXXXX",
            chain="TRON",
            victim_amount_inr=500000.0,
            token_symbol="USDT",
            nodes=[
                {"id": "TVictim0001XXXXXXXXXXXXXXXXXXXXXXX", "address": "TVictim0001XXXXXXXXXXXXXXXXXXXXXXX", "custom_label": "Complainant Victim", "node_type": "origin"},
                {"id": "TMuleStructuring01XXXXXXXXXXXXXXX", "address": "TMuleStructuring01XXXXXXXXXXXXXXX", "custom_label": "Layering Mule", "node_type": "mule"},
                {"id": "TCoinDCXDeposit0001XXXXXXXXXXXXXXXX", "address": "TCoinDCXDeposit0001XXXXXXXXXXXXXXXX", "custom_label": "CoinDCX User Deposit", "node_type": "cex"},
            ],
            edges=[
                {"id": "tx1", "source": "TVictim0001XXXXXXXXXXXXXXXXXXXXXXX", "target": "TMuleStructuring01XXXXXXXXXXXXXXX", "amount": 5000.0, "token_symbol": "USDT", "tx_hash": "0xaaa111", "timestamp_utc": 1773000000, "is_core_path": True},
                {"id": "tx2", "source": "TMuleStructuring01XXXXXXXXXXXXXXX", "target": "TCoinDCXDeposit0001XXXXXXXXXXXXXXXX", "amount": 4850.0, "token_symbol": "USDT", "tx_hash": "0xbbb222", "timestamp_utc": 1773001800, "is_core_path": True},
            ],
            risk_score=85,
            risk_severity="CRITICAL",
            risk_provenance=[
                {
                    "rule_id": "PEELING_CHAIN_STRUCTURING",
                    "rule_name": "Peeling Chain Structuring",
                    "source": "automated_clustering",
                    "confidence": 0.94,
                    "points": 25,
                    "evidence_tx_hash": "0xaaa111",
                    "description": "Rapid splitting into micro-dust hops",
                },
                {
                    "rule_id": "VASP_DEPOSIT_IDENTIFIED",
                    "rule_name": "CoinDCX VASP Customer Deposit",
                    "source": "offchain_verified",
                    "confidence": 0.99,
                    "points": 45,
                    "evidence_tx_hash": "0xbbb222",
                    "description": "Off-ramp identified at registered VASP",
                }
            ]
        )
        pdf_bytes, meta = generate_evidence_dossier_pdf(req)
        self.assertIsNotNone(pdf_bytes)
        self.assertTrue(len(pdf_bytes) > 1000)
        self.assertTrue(pdf_bytes.startswith(b"%PDF"))
        self.assertIn("sha256", meta)
        self.assertEqual(len(meta["sha256"]), 64)
        self.assertIn("merkle_root", meta)
        self.assertIn("section_94_bnss", meta["statutory_mapping"])
        self.assertIn("section_63_4_bsa", meta["statutory_mapping"])

    def test_generate_evidence_dossier_json_direct(self):
        req = EvidenceExportRequest(
            case_id="TEST-EXPORT-CASE-002",
            fir_number="FIR/CYBER/2026/0402",
            target_address="TCoinDCXDeposit0001XXXXXXXXXXXXXXXX",
            chain="TRON",
        )
        data = generate_evidence_dossier_json(req)
        self.assertEqual(data["case_id"], "TEST-EXPORT-CASE-002")
        self.assertIn("cryptographic_seal", data)
        self.assertEqual(len(data["cryptographic_seal"]["sha256"]), 64)
        self.assertEqual(data["cryptographic_seal"]["status"], "VALID_AND_TAMPER_EVIDENT")
        self.assertIn("legal_admissibility", data)
        self.assertIn("section_94_bnss_2023", data["legal_admissibility"])
        self.assertIn("section_63_bsa_2023", data["legal_admissibility"])

    def test_api_export_evidence_dossier_pdf(self):
        payload = {
            "case_id": "TEST-API-EXPORT-001",
            "fir_number": "FIR/2026/7788",
            "target_address": "TVictim0001XXXXXXXXXXXXXXXXXXXXXXX",
            "chain": "TRON",
            "victim_amount_inr": 485000.0,
            "token_symbol": "USDT",
        }
        res = self.client.post("/api/v1/reports/evidence-dossier", json=payload)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.headers["content-type"], "application/pdf")
        self.assertTrue(len(res.content) > 1000)
        self.assertIn("X-Evidence-SHA256", res.headers)
        self.assertEqual(len(res.headers["X-Evidence-SHA256"]), 64)
        self.assertIn("X-Evidence-Merkle-Root", res.headers)

    def test_api_export_evidence_dossier_json(self):
        payload = {
            "case_id": "TEST-API-EXPORT-002",
            "fir_number": "FIR/2026/7788",
            "target_address": "TVictim0001XXXXXXXXXXXXXXXXXXXXXXX",
            "chain": "TRON",
        }
        res = self.client.post("/api/v1/reports/evidence-dossier/json", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("cryptographic_seal", data)
        self.assertEqual(len(data["cryptographic_seal"]["sha256"]), 64)


if __name__ == "__main__":
    unittest.main()
