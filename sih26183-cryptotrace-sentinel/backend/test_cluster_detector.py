"""
test_cluster_detector.py - Unit and Integration Tests for Magic-Nodes-Style Cluster Detection.

Validates:
  1. Heuristic A: Shared Gas-Funding Source Address (Energy sponsor dispenser)
  2. Heuristic B: Common First-Funding Intermediary (Genesis activation parent)
  3. Heuristic C: Near-Identical Transaction Timing Patterns (Sub-180s coordinated bursts)
  4. DSU Syndicate Cluster Grouping & Penalties
  5. Robustness to Cytoscape { data: { ... } } wrapping and non-integer timestamps
  6. FastAPI REST endpoint POST /api/v1/graph/detect-clusters
"""

import unittest
from fastapi.testclient import TestClient
from app.main import app
from app.services.analytics.cluster_detector import ClusterDetector


class TestClusterDetector(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_heuristic_a_common_gas_funder(self):
        """Wallets receiving gas tokens from the same sponsor must be flagged as indirect_link."""
        nodes = [
            {"id": "TGas_Sponsor_01", "node_type": "gas_fee", "label": "Gas Dispenser"},
            {"id": "TSuspect_Mule_A", "node_type": "mule", "label": "Suspect Mule A"},
            {"id": "TSuspect_Mule_B", "node_type": "mule", "label": "Suspect Mule B"},
        ]
        edges = [
            {"source": "TGas_Sponsor_01", "target": "TSuspect_Mule_A", "amount": 25.0, "token_symbol": "TRX", "timestamp_utc": 1700000100},
            {"source": "TGas_Sponsor_01", "target": "TSuspect_Mule_B", "amount": 25.0, "token_symbol": "TRX", "timestamp_utc": 1700000200},
        ]

        result = ClusterDetector.detect_indirect_links(nodes, edges)

        self.assertGreaterEqual(result["total_indirect_links"], 1)
        indirect = [e for e in result["indirect_edges"] if e["link_reason"] == "common_gas_funder"]
        self.assertEqual(len(indirect), 1)
        edge = indirect[0]
        self.assertEqual(edge["edge_type"], "indirect_link")
        self.assertEqual(edge["intermediary"], "TGas_Sponsor_01")
        self.assertGreaterEqual(edge["confidence"], 0.9)
        self.assertEqual({edge["source"], edge["target"]}, {"TSuspect_Mule_A", "TSuspect_Mule_B"})
        self.assertIn("Shared Gas", edge["label"])

    def test_heuristic_b_common_first_funding_parent(self):
        """Wallets activated by the same first-funder parent must be indirectly linked."""
        nodes = [
            {"id": "TGenesis_Parent_99", "node_type": "unknown", "label": "Parent Wallet"},
            {"id": "TChild_Wallet_1", "node_type": "mule", "label": "Child 1"},
            {"id": "TChild_Wallet_2", "node_type": "mule", "label": "Child 2"},
        ]
        edges = [
            # TChild_Wallet_1 first funded at t=1000 by TGenesis_Parent_99, later funded at t=2000 by someone else
            {"source": "TGenesis_Parent_99", "target": "TChild_Wallet_1", "amount": 500.0, "token_symbol": "USDT", "timestamp_utc": 1000},
            {"source": "TOther_Addr_88", "target": "TChild_Wallet_1", "amount": 100.0, "token_symbol": "USDT", "timestamp_utc": 2000},
            # TChild_Wallet_2 first funded at t=1050 by TGenesis_Parent_99
            {"source": "TGenesis_Parent_99", "target": "TChild_Wallet_2", "amount": 600.0, "token_symbol": "USDT", "timestamp_utc": 1050},
        ]

        result = ClusterDetector.detect_indirect_links(nodes, edges)

        indirect = [e for e in result["indirect_edges"] if e["link_reason"] == "common_first_funder"]
        self.assertEqual(len(indirect), 1)
        edge = indirect[0]
        self.assertEqual(edge["edge_type"], "indirect_link")
        self.assertEqual(edge["intermediary"], "TGenesis_Parent_99")
        self.assertEqual({edge["source"], edge["target"]}, {"TChild_Wallet_1", "TChild_Wallet_2"})
        self.assertIn("Common Genesis", edge["label"])

    def test_heuristic_c_timing_synchronization(self):
        """Wallets with near-identical outgoing transfer timestamps (<180s) must be flagged."""
        nodes = [
            {"id": "TBot_Mule_01", "node_type": "mule", "label": "Bot 1"},
            {"id": "TBot_Mule_02", "node_type": "mule", "label": "Bot 2"},
            {"id": "TCex_Deposit_Target", "node_type": "cex", "label": "CEX"},
        ]
        edges = [
            # Both send money within 30 seconds of each other
            {"source": "TBot_Mule_01", "target": "TCex_Deposit_Target", "amount": 1000.0, "timestamp_utc": 1700000000},
            {"source": "TBot_Mule_02", "target": "TCex_Deposit_Target", "amount": 1000.0, "timestamp_utc": 1700000030},
        ]

        result = ClusterDetector.detect_indirect_links(nodes, edges, timing_threshold_seconds=180)

        indirect = [e for e in result["indirect_edges"] if e["link_reason"] == "temporal_synchronization"]
        self.assertEqual(len(indirect), 1)
        edge = indirect[0]
        self.assertEqual(edge["edge_type"], "indirect_link")
        self.assertEqual(edge["time_delta_seconds"], 30)
        self.assertGreater(edge["confidence"], 0.8)
        self.assertIn("Sync", edge["label"])

    def test_dsu_clustering_and_risk(self):
        """Connected indirect links must form consolidated clusters with risk penalties."""
        nodes = [
            {"id": "TWal_1", "node_type": "mule"},
            {"id": "TWal_2", "node_type": "mule"},
            {"id": "TWal_3", "node_type": "mule"},
            {"id": "TGas_Master", "node_type": "gas_fee"},
        ]
        edges = [
            {"source": "TGas_Master", "target": "TWal_1", "token_symbol": "ETH", "amount": 0.05, "timestamp_utc": 100},
            {"source": "TGas_Master", "target": "TWal_2", "token_symbol": "ETH", "amount": 0.05, "timestamp_utc": 105},
            {"source": "TGas_Master", "target": "TWal_3", "token_symbol": "ETH", "amount": 0.05, "timestamp_utc": 110},
        ]

        result = ClusterDetector.detect_indirect_links(nodes, edges)

        self.assertEqual(len(result["clusters"]), 1)
        cluster = result["clusters"][0]
        self.assertEqual(cluster["size"], 3)
        self.assertEqual(set(cluster["members"]), {"TWal_1", "TWal_2", "TWal_3"})
        self.assertIn("common_gas_funder", cluster["reasons"])
        self.assertGreater(cluster["cluster_risk_penalty"], 0)

    def test_cytoscape_wrapped_elements(self):
        """Engine must gracefully handle Cytoscape { data: { ... } } wrapped formats."""
        nodes = [
            {"data": {"id": "TG1", "node_type": "gas_fee"}},
            {"data": {"id": "TW1", "node_type": "mule"}},
            {"data": {"id": "TW2", "node_type": "mule"}},
        ]
        edges = [
            {"data": {"source": "TG1", "target": "TW1", "token_symbol": "TRX", "amount": 10, "timestamp_utc": "2026-09-12T10:00:00Z"}},
            {"data": {"source": "TG1", "target": "TW2", "token_symbol": "TRX", "amount": 10, "timestamp_utc": "2026-09-12T10:01:00Z"}},
        ]

        result = ClusterDetector.detect_indirect_links(nodes, edges)
        self.assertGreaterEqual(result["total_indirect_links"], 1)

    def test_fastapi_detect_clusters_endpoint(self):
        """POST /api/v1/graph/detect-clusters must return valid ClusterDetectResponse."""
        payload = {
            "nodes": [
                {"id": "TG_Sponsor", "node_type": "gas_fee"},
                {"id": "TW_A", "node_type": "mule"},
                {"id": "TW_B", "node_type": "mule"},
            ],
            "edges": [
                {"source": "TG_Sponsor", "target": "TW_A", "token_symbol": "TRX", "amount": 15, "timestamp_utc": 500},
                {"source": "TG_Sponsor", "target": "TW_B", "token_symbol": "TRX", "amount": 15, "timestamp_utc": 520},
            ],
            "timing_threshold_seconds": 180,
        }

        response = self.client.post("/api/v1/graph/detect-clusters", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("total_indirect_links", data)
        self.assertEqual(data["total_indirect_links"], 1)
        self.assertEqual(len(data["indirect_edges"]), 1)
        self.assertEqual(data["indirect_edges"][0]["edge_type"], "indirect_link")
        self.assertEqual(len(data["clusters"]), 1)
        self.assertIn("Shared Gas", data["indirect_edges"][0]["label"])


if __name__ == "__main__":
    unittest.main()
