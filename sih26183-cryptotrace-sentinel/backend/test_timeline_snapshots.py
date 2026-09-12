"""
test_timeline_snapshots.py - Test Suite for Task 8: Time Travel Playback Engine.
Tests:
  1. Chronological ordering and Genesis (T0) state conservation.
  2. Sequential state progression and dynamic balance calculations.
  3. Off-ramp exposure metrics calculation.
  4. Fired edge highlighting and event descriptions.
  5. FastAPI REST endpoints POST /api/v1/forensic/timeline/snapshots.
"""

import sys
import os
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services.snapshot_service import ClusterSnapshotEngine
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


class TestTimelineSnapshots(unittest.TestCase):
    def setUp(self):
        self.sample_nodes = [
            {"id": "victim", "roleHeader": "Victim Wallet", "node_type": "origin", "is_victim": True},
            {"id": "mule1", "roleHeader": "Mule Splitter 1", "node_type": "mule"},
            {"id": "mule2", "roleHeader": "Mule Consolidation 2", "node_type": "mule"},
            {"id": "cex_dep", "roleHeader": "CoinDCX User Deposit", "node_type": "cex_deposit"},
            {"id": "cex_hot", "roleHeader": "CoinDCX Hot Wallet", "node_type": "cex_hotwallet"},
        ]
        self.sample_edges = [
            {"id": "e1", "source": "victim", "target": "mule1", "amount": 15000, "token_symbol": "USDT", "timestamp_utc": 1773000100},
            {"id": "e2", "source": "mule1", "target": "mule2", "amount": 14880, "token_symbol": "USDT", "timestamp_utc": 1773000300},
            {"id": "e3", "source": "mule2", "target": "cex_dep", "amount": 14800, "token_symbol": "USDT", "timestamp_utc": 1773001000},
            {"id": "e4", "source": "cex_dep", "target": "cex_hot", "amount": 14800, "token_symbol": "USDT", "timestamp_utc": 1773001500},
        ]

    def test_genesis_t0_snapshot(self):
        snapshots = ClusterSnapshotEngine.generate_snapshots(self.sample_nodes, self.sample_edges)
        self.assertEqual(len(snapshots), 5)  # T0 + 4 transaction steps
        t0 = snapshots[0]
        self.assertEqual(t0["step_index"], 0)
        self.assertEqual(len(t0["active_edge_ids"]), 0)
        self.assertIsNone(t0["just_fired_edge_id"])
        
        # Victim should hold initial funds
        victim_h = t0["node_holdings"]["victim"]
        self.assertEqual(victim_h["balance_num"], 15000.0)
        self.assertTrue(victim_h["is_active"])

        # Downstream nodes should have 0 balance at T0
        self.assertEqual(t0["node_holdings"]["mule1"]["balance_num"], 0.0)
        self.assertFalse(t0["node_holdings"]["mule1"]["is_active"])
        self.assertEqual(t0["metrics"]["offramp_exposure_pct"], 0.0)
        print("  [PASS] Genesis (T0) baseline snapshot and balance conservation")

    def test_intermediate_holdings_progression(self):
        snapshots = ClusterSnapshotEngine.generate_snapshots(self.sample_nodes, self.sample_edges)
        
        # Step 1: victim -> mule1 (15,000 USDT)
        t1 = snapshots[1]
        self.assertEqual(t1["step_index"], 1)
        self.assertEqual(t1["just_fired_edge_id"], "e1")
        self.assertIn("e1", t1["active_edge_ids"])
        self.assertEqual(t1["node_holdings"]["victim"]["balance_num"], 0.0)
        self.assertEqual(t1["node_holdings"]["mule1"]["balance_num"], 15000.0)

        # Step 2: mule1 -> mule2 (14,880 USDT)
        t2 = snapshots[2]
        self.assertEqual(t2["step_index"], 2)
        self.assertEqual(t2["just_fired_edge_id"], "e2")
        self.assertEqual(t2["node_holdings"]["mule1"]["balance_num"], 120.0)  # 15000 - 14880 = 120
        self.assertEqual(t2["node_holdings"]["mule2"]["balance_num"], 14880.0)
        print("  [PASS] Sequential intermediate holdings progression")

    def test_terminal_offramp_exposure(self):
        snapshots = ClusterSnapshotEngine.generate_snapshots(self.sample_nodes, self.sample_edges)
        
        # Step 3: mule2 -> cex_dep
        t3 = snapshots[3]
        self.assertGreater(t3["metrics"]["offramp_exposure_pct"], 90.0)
        self.assertTrue(t3["metrics"]["reached_exchange"])

        # Step 4: sweep into hotwallet
        t4 = snapshots[4]
        self.assertEqual(t4["step_index"], 4)
        self.assertEqual(len(t4["active_edge_ids"]), 4)
        self.assertEqual(t4["node_holdings"]["cex_hot"]["balance_num"], 14800.0)
        print("  [PASS] Terminal off-ramp exposure metrics calculation")

    def test_out_of_order_edges_are_sorted(self):
        shuffled_edges = [
            self.sample_edges[3],  # 1773001500
            self.sample_edges[1],  # 1773000300
            self.sample_edges[0],  # 1773000100
            self.sample_edges[2],  # 1773001000
        ]
        snapshots = ClusterSnapshotEngine.generate_snapshots(self.sample_nodes, shuffled_edges)
        # Should still execute in chronological order e1 -> e2 -> e3 -> e4
        fired_order = [s["just_fired_edge_id"] for s in snapshots if s["just_fired_edge_id"]]
        self.assertEqual(fired_order, ["e1", "e2", "e3", "e4"])
        print("  [PASS] Unsorted transaction timestamps properly sorted chronologically")

    def test_rest_api_endpoint(self):
        payload = {
            "nodes": self.sample_nodes,
            "edges": self.sample_edges,
        }
        res = client.post("/api/v1/forensic/timeline/snapshots", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["total_snapshots"], 5)
        self.assertEqual(len(data["snapshots"]), 5)
        self.assertIn("relative_time", data["snapshots"][1])
        print("  [PASS] POST /api/v1/forensic/timeline/snapshots endpoint verified")


if __name__ == "__main__":
    print("Running TASK 8 Time Travel Snapshots test suite...")
    unittest.main()
