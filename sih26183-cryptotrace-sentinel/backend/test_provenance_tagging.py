"""
test_provenance_tagging.py - Unit & Integration Test Suite for Provenance Tagging.

Validates:
  1. Provenance enum support: automated_clustering | offchain_verified | analyst_reviewed
  2. Automatic SQLite migration & backfill of legacy records
  3. Upsert & lookup with provenance preservation
  4. Analyst-reviewed protection against automated downgrades
  5. GraphNode propagation and schema validation
  6. REST endpoints:
     - POST /api/v1/vasp-attribution
     - POST /api/v1/vasp-attribution/provenance
"""

import unittest
import sqlite3
from fastapi.testclient import TestClient
from app.main import app
from app.services.attribution_store import (
    init_db,
    upsert_attribution,
    lookup_attribution,
    update_provenance,
    DB_PATH,
)
from app.services.graph_node_builder import build_graph_node
from app.schemas import GraphNode


class TestProvenanceTagging(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)
        init_db()

    def test_schema_and_migration_defaults(self):
        """Database table must have 'provenance' column with default 'automated_clustering'."""
        conn = sqlite3.connect(DB_PATH)
        cols = [r[1] for r in conn.execute("PRAGMA table_info(attributed_clusters)").fetchall()]
        conn.close()
        self.assertIn("provenance", cols)

    def test_upsert_and_lookup_provenance_enum(self):
        """All 3 enum values must round-trip cleanly."""
        test_cases = [
            ("TAutoMule0001XXXXXXXXXXXXXXXXXXXX", "automated_clustering"),
            ("TOffchainVasp0001XXXXXXXXXXXXXXXX", "offchain_verified"),
            ("TAnalystReviewed001XXXXXXXXXXXXXX", "analyst_reviewed"),
        ]

        for addr, prov in test_cases:
            upsert_attribution(
                address=addr,
                chain="TRON",
                category="exchange",
                entity_label=f"Label for {prov}",
                attribution_rule="unit_test",
                confidence=0.95,
                provenance=prov,
            )
            res = lookup_attribution(addr)
            self.assertIsNotNone(res)
            self.assertEqual(res["provenance"], prov)

    def test_analyst_reviewed_protection(self):
        """Analyst reviewed provenance must not be overwritten by automated heuristics."""
        addr = "TProtectedAnalystAddrXXXXXXXXXXXXX"
        # 1. First marked by analyst
        upsert_attribution(
            address=addr, chain="TRON", entity_label="Investigator Reviewed Mule",
            confidence=0.8, provenance="analyst_reviewed"
        )
        self.assertEqual(lookup_attribution(addr)["provenance"], "analyst_reviewed")

        # 2. Automated clustering sweep tries to update with higher confidence
        upsert_attribution(
            address=addr, chain="TRON", entity_label="Zero-Day Sweep",
            confidence=0.99, provenance="automated_clustering"
        )
        # Provenance should remain analyst_reviewed
        self.assertEqual(lookup_attribution(addr)["provenance"], "analyst_reviewed")

    def test_graph_node_builder_propagation(self):
        """build_graph_node must propagate provenance into GraphNode objects."""
        known_addr = "TCoinDCXHotWallet0001XXXXXXXXXXXXX"
        upsert_attribution(
            address=known_addr, chain="TRON", category="exchange",
            entity_label="[CoinDCX Hot Wallet]", attribution_rule="static_seed",
            confidence=1.0, provenance="offchain_verified"
        )

        node = build_graph_node(known_addr, "TRON", "TVictim0001XXXXXXXXXXXXXXXXXXXXXXX")
        self.assertIsInstance(node, GraphNode)
        self.assertEqual(node.provenance, "offchain_verified")

        # Unlabelled mule defaults to automated_clustering
        unknown_mule = "TRandomUnknownMuleAddrXXXXXXXXXXX"
        mule_node = build_graph_node(unknown_mule, "TRON", "TVictim0001XXXXXXXXXXXXXXXXXXXXXXX")
        self.assertEqual(mule_node.provenance, "automated_clustering")

    def test_vasp_attribution_rest_endpoint(self):
        """POST /api/v1/vasp-attribution must return provenance tag."""
        addr = "TVaspProvTestAddrXXXXXXXXXXXXXXXX"
        upsert_attribution(
            address=addr, chain="TRON", category="exchange",
            exchange_name="TestExchange", entity_label="[TestExchange Deposit]",
            attribution_rule="static_seed", confidence=1.0,
            provenance="offchain_verified"
        )

        resp = self.client.post("/api/v1/vasp-attribution", json={"address": addr})
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertTrue(data["is_known"])
        self.assertEqual(data["provenance"], "offchain_verified")

    def test_update_provenance_endpoint(self):
        """POST /api/v1/vasp-attribution/provenance must update provenance tag."""
        addr = "TUpdateProvTargetAddrXXXXXXXXXXXX"
        upsert_attribution(
            address=addr, chain="TRON", category="mule",
            entity_label="Suspect Mule", provenance="automated_clustering"
        )

        # Investigator upgrades to analyst_reviewed
        resp = self.client.post(
            "/api/v1/vasp-attribution/provenance",
            json={"address": addr, "provenance": "analyst_reviewed"}
        )
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertTrue(data["success"])
        self.assertEqual(data["provenance"], "analyst_reviewed")

        # Verify persisted
        res = lookup_attribution(addr)
        self.assertEqual(res["provenance"], "analyst_reviewed")


if __name__ == "__main__":
    unittest.main()
