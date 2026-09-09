"""
sweep_detector.py - Dynamic CEX Sweep Detection & Deposit Wallet Attribution Engine.
Evaluates downstream transactions from suspect deposit wallets into known VASP hot wallets.
"""

import json
from pathlib import Path
from typing import Dict, Any, List, Optional
from collections import defaultdict
import logging

logger = logging.getLogger(__name__)


def _find_vasp_clusters_path() -> Path:
    """Resolve known_vasp_clusters.json across data/ and agent skill references."""
    candidates = [
        Path(__file__).resolve().parents[2] / "data" / "known_vasp_clusters.json",
        Path(__file__).resolve().parents[4] / ".agents" / "skills" / "crypto-investigator" / "references" / "known_vasp_clusters.json",
        Path(__file__).resolve().parents[3] / ".agents" / "skills" / "crypto-investigator" / "references" / "known_vasp_clusters.json",
    ]
    for p in candidates:
        if p.exists():
            return p
    return candidates[0]


class SweepDetector:
    """
    Forensic engine to detect CEX sweeps and attribute unlabelled deposit wallets.
    """

    def __init__(self, seed_path: Optional[Path] = None):
        self.seed_path = seed_path or _find_vasp_clusters_path()
        self.clusters = self._load_clusters()

        # Build index of known hot wallets: address -> VASP dict
        self.hot_wallet_map: Dict[str, Dict[str, Any]] = {}
        self.known_deposit_map: Dict[str, Dict[str, Any]] = {}

        for vasp in self.clusters.get("vasps", []):
            for hw in vasp.get("hot_wallets", []):
                self.hot_wallet_map[hw] = vasp
            for dep in vasp.get("known_deposit_addresses", []):
                self.known_deposit_map[dep] = vasp

    def _load_clusters(self) -> Dict[str, Any]:
        if self.seed_path.exists():
            try:
                with open(self.seed_path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as exc:
                logger.warning(f"Error reading VASP cluster file at {self.seed_path}: {exc}")
        return {"vasps": [], "mixers": []}

    def attribute_address_static(self, address: str) -> Dict[str, Any]:
        """Check static seed clusters."""
        addr = (address or "").strip()
        if addr in self.hot_wallet_map:
            vasp = self.hot_wallet_map[addr]
            return {
                "is_known_vasp": True,
                "exchange_name": vasp["name"],
                "entity_label": f"[{vasp['name']} Hot Wallet]",
                "compliance_email": vasp.get("compliance_email") or vasp.get("nodal_officer_email", ""),
                "confidence": 0.99,
                "attribution_method": "static_seed",
                "attribution_explanation": f"Verified match from {vasp['name']} hot-wallet seed database.",
                "is_heuristic": False,
            }

        if addr in self.known_deposit_map:
            vasp = self.known_deposit_map[addr]
            return {
                "is_known_vasp": True,
                "exchange_name": vasp["name"],
                "entity_label": f"[{vasp['name']} User Deposit]",
                "compliance_email": vasp.get("compliance_email") or vasp.get("nodal_officer_email", ""),
                "confidence": 0.95,
                "attribution_method": "static_seed",
                "attribution_explanation": f"Verified customer deposit cluster match for {vasp['name']}.",
                "is_heuristic": False,
            }

        return {
            "is_known_vasp": False,
            "attribution_method": "none",
            "attribution_explanation": "Unlabelled wallet address.",
            "confidence": 0.0,
            "is_heuristic": False,
        }

    def detect_sweeps(
        self,
        edges: List[Dict[str, Any]],
        sweep_window_seconds: int = 86400,  # 24-hour window
    ) -> Dict[str, Dict[str, Any]]:
        """
        Evaluate downstream transactions from suspect deposit wallets.
        Rule: If an unlabelled wallet transfers 90%+ of its received balance
        into a known hot wallet within a 24-hour window, classify it as a
        Verified Exchange Deposit Wallet with confidence score >= 95%.
        """
        attributions: Dict[str, Dict[str, Any]] = {}

        # 1. Map inbound and outbound edges per address
        inbound_by_addr: Dict[str, List[Dict[str, Any]]] = defaultdict(list)
        outbound_by_addr: Dict[str, List[Dict[str, Any]]] = defaultdict(list)

        for e in edges:
            inbound_by_addr[e["to"]].append(e)
            outbound_by_addr[e["from"]].append(e)

        # 2. Evaluate each suspect wallet
        all_candidates = set(inbound_by_addr.keys())

        for cand in all_candidates:
            # Skip if already a known hot wallet
            if cand in self.hot_wallet_map:
                continue

            in_txs = inbound_by_addr[cand]
            total_received = sum(float(t["amount"]) for t in in_txs)
            if total_received <= 0:
                continue

            earliest_in_ts = min(int(t.get("ts", 0)) for t in in_txs)
            out_txs = outbound_by_addr[cand]

            # Check if any outbound transfer goes to a known VASP hot wallet
            for out_t in out_txs:
                dest = out_t["to"]
                out_amt = float(out_t["amount"])
                out_ts = int(out_t.get("ts", 0))

                if dest in self.hot_wallet_map:
                    vasp = self.hot_wallet_map[dest]
                    time_diff = out_ts - earliest_in_ts

                    # Check 24-hour window and 90%+ balance sweep threshold
                    if 0 <= time_diff <= sweep_window_seconds and (out_amt / total_received) >= 0.90:
                        conf = 0.96  # Meets requirement: >= 95%
                        attributions[cand] = {
                            "is_known_vasp": True,
                            "exchange_name": vasp["name"],
                            "entity_label": f"[{vasp['name']} Verified Deposit]",
                            "role_tag": "VERIFIED CEX DEPOSIT",
                            "compliance_email": vasp.get("compliance_email") or vasp.get("nodal_officer_email", ""),
                            "confidence": conf,
                            "attribution_method": "sweep_heuristic_90pct",
                            "attribution_explanation": (
                                f"Heuristic Rule: Transferred {round((out_amt/total_received)*100, 1)}% "
                                f"of received funds into {vasp['name']} hot wallet within {time_diff // 60} minutes."
                            ),
                            "target_hot_wallet": dest,
                            "sweep_tx_hash": out_t.get("tx", ""),
                            "is_heuristic": True,
                        }
                        break

        # 3. Batched multi-deposit sweep heuristic (Zero-day Exchange Hot Wallet attribution)
        dest_inbound = defaultdict(list)
        for e in edges:
            dest_inbound[e["to"]].append(e)

        for dest, txs in dest_inbound.items():
            if dest in self.hot_wallet_map or dest in attributions:
                continue
            if len(txs) >= 3:
                txs_sorted = sorted(txs, key=lambda t: t.get("ts", 0))
                window = txs_sorted[-1].get("ts", 0) - txs_sorted[0].get("ts", 0)
                if window <= 1800:  # 30-minute batched sweep
                    distinct_sources = {t["from"] for t in txs}
                    if len(distinct_sources) >= 3:
                        attributions[dest] = {
                            "is_known_vasp": True,
                            "exchange_name": "Suspected VASP",
                            "entity_label": "[Suspected CEX Master Hot Wallet]",
                            "role_tag": "HEURISTIC HOT WALLET",
                            "compliance_email": "compliance@exchange.internal",
                            "confidence": 0.88,
                            "attribution_method": "batched_sweep_heuristic",
                            "attribution_explanation": f"{len(distinct_sources)} distinct deposit wallets swept into this destination within {window // 60} mins.",
                            "is_heuristic": True,
                        }

        return attributions


_GLOBAL_DETECTOR: Optional[SweepDetector] = None


def get_sweep_detector() -> SweepDetector:
    global _GLOBAL_DETECTOR
    if _GLOBAL_DETECTOR is None:
        _GLOBAL_DETECTOR = SweepDetector()
    return _GLOBAL_DETECTOR


def detect_cex_sweeps(edges: List[Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
    return get_sweep_detector().detect_sweeps(edges)
