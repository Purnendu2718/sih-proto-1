"""
test_case_canvas.py - Tests for Task 1 (Tracing Canvas Persistence & Paginated Expansion)
"""

import sys
import unittest
from pathlib import Path

backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from app.main import app
from app.services.case_service import save_case_canvas, get_case_canvas, list_cases

client = TestClient(app)


class TestCaseCanvasPersistence(unittest.TestCase):
    def test_save_and_load_canvas(self):
        case_id = "CASE-TEST-CANVAS-001"
        case_meta = {
            "fir_number": "FIR/2026/TEST/001",
            "case_name": "Operation Neon Hawk",
            "description": "Multi-hop suspect mule trail trace",
            "reported_wallet": "TVictimTest001",
            "blockchain": "TRON",
            "priority": "CRITICAL"
        }
        nodes = [
            {
                "id": "node-1",
                "address": "TVictimTest001",
                "display_label": "[Victim]\nTVictim...",
                "custom_label": "Complainant Victim",
                "node_type": "origin",
                "chain": "TRON",
                "balance": "15,000 USDT",
                "is_pinned": True,
                "pos_x": 120.5,
                "pos_y": 250.0,
                "metadata": {"taint": "100%", "isCorePath": True}
            },
            {
                "id": "node-2",
                "address": "TMuleTest002",
                "display_label": "[Mule A]\nTMule...",
                "custom_label": "Suspect Layering Mule",
                "node_type": "mule",
                "chain": "TRON",
                "balance": "14,800 USDT",
                "is_pinned": False,
                "pos_x": 300.0,
                "pos_y": 250.0,
                "metadata": {"taint": "98.5%", "isCorePath": True}
            }
        ]
        edges = [
            {
                "id": "e-1-2",
                "source": "node-1",
                "target": "node-2",
                "token_symbol": "USDT",
                "amount": 15000.0,
                "usd_value": 15000.0,
                "tx_hash": "0xabc123test",
                "timestamp_utc": "2026-09-12 10:00:00 UTC",
                "is_core_path": True,
                "edge_type": "transfer"
            }
        ]

        save_res = save_case_canvas(case_id, case_meta, nodes, edges)
        self.assertEqual(save_res["status"], "SAVED")
        self.assertEqual(save_res["node_count"], 2)
        self.assertEqual(save_res["edge_count"], 1)

        loaded = get_case_canvas(case_id)
        self.assertIsNotNone(loaded)
        self.assertEqual(loaded["case"]["case_id"], case_id)
        self.assertEqual(loaded["case"]["fir_number"], "FIR/2026/TEST/001")
        self.assertEqual(len(loaded["nodes"]), 2)
        self.assertEqual(len(loaded["edges"]), 1)

        # Check coordinates and pin state
        node1 = next(n for n in loaded["nodes"] if n["id"] == "node-1")
        self.assertTrue(node1["is_pinned"])
        self.assertEqual(node1["pos_x"], 120.5)
        self.assertEqual(node1["pos_y"], 250.0)
        self.assertEqual(node1["custom_label"], "Complainant Victim")

        # Check list cases includes node_count and edge_count
        cases_list = list_cases(limit=10)
        matching = next((c for c in cases_list if c["case_id"] == case_id), None)
        self.assertIsNotNone(matching)
        self.assertEqual(matching["node_count"], 2)
        self.assertEqual(matching["edge_count"], 1)

    def test_api_endpoints_canvas(self):
        case_id = "CASE-API-CANVAS-002"
        payload = {
            "case_name": "API Case Trace",
            "fir_number": "FIR/2026/API/002",
            "description": "Testing canvas REST endpoints",
            "reported_wallet": "0xVictimApi",
            "blockchain": "EVM",
            "nodes": [
                {
                    "id": "0xVictimApi",
                    "address": "0xVictimApi",
                    "display_label": "[Victim]\n0xVic...",
                    "node_type": "origin",
                    "chain": "EVM",
                    "is_pinned": True,
                    "pos_x": 50.0,
                    "pos_y": 100.0,
                }
            ],
            "edges": []
        }

        # Save via API
        resp = client.post(f"/api/v1/cases/{case_id}/canvas", json=payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["case_id"], case_id)
        self.assertEqual(data["node_count"], 1)

        # Get via API
        get_resp = client.get(f"/api/v1/cases/{case_id}/canvas")
        self.assertEqual(get_resp.status_code, 200)
        loaded = get_resp.json()
        self.assertEqual(len(loaded["nodes"]), 1)
        self.assertTrue(loaded["nodes"][0]["is_pinned"])
        self.assertEqual(loaded["nodes"][0]["pos_x"], 50.0)

    def test_paginated_expansion_api(self):
        # Test expand endpoint with offset and limit
        payload = {
            "address": "TVictim0001XXXXXXXXXXXXXXXXXXXXXXX",
            "chain": "TRON",
            "direction": "both",
            "limit": 1,
            "offset": 0,
            "case_id": "TEST-EXPAND"
        }
        resp = client.post("/api/v1/graph/expand", json=payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("nodes", data)
        self.assertIn("edges", data)
        self.assertIn("total_count", data)
        self.assertIn("has_more", data)
        self.assertEqual(data["offset"], 0)
        self.assertEqual(data["limit"], 1)


if __name__ == "__main__":
    unittest.main()
