"""
cluster_detector.py - Magic-Nodes-style cluster detection engine.

Detects indirect linkages between wallets that do not have direct transfer edges:
  (a) Common gas-funding source address (shared energy/gas sponsor dispenser)
  (b) Common first-funding intermediary (shared genesis activation parent)
  (c) Near-identical transaction timing patterns to a known cluster (temporal coordination)

Emits distinct 'indirect_link' edges for graph view rendering.
"""

from typing import List, Dict, Any, Optional, Set, Tuple
from collections import defaultdict
import datetime


class ClusterDetector:
    """Heuristic clustering engine detecting indirect multi-wallet syndicates."""

    GAS_TOKENS = {"TRX", "ETH", "BNB", "MATIC", "SOL", "AVAX", "BTC"}

    @classmethod
    def detect_indirect_links(
        cls,
        nodes: List[Dict[str, Any]],
        edges: List[Dict[str, Any]],
        timing_threshold_seconds: int = 180,
    ) -> Dict[str, Any]:
        """
        Runs full clustering pass over active nodes and edges.
        Returns itemized indirect_link edges and cluster groups.
        """
        indirect_edges: List[Dict[str, Any]] = []
        seen_pairs: Set[Tuple[str, str]] = set()

        def add_pair(u: str, v: str) -> bool:
            if u == v:
                return False
            key = (min(u, v), max(u, v))
            if key in seen_pairs:
                return False
            seen_pairs.add(key)
            return True

        def _unwrap(item: Dict[str, Any]) -> Dict[str, Any]:
            if isinstance(item, dict) and "data" in item and isinstance(item["data"], dict):
                return {**item, **item["data"]}
            return item if isinstance(item, dict) else {}

        def _parse_ts(val: Any) -> int:
            if not val:
                return 0
            if isinstance(val, (int, float)):
                return int(val)
            if isinstance(val, str):
                if val.isdigit():
                    return int(val)
                try:
                    return int(datetime.datetime.fromisoformat(val.replace("Z", "+00:00")).timestamp())
                except Exception:
                    return 0
            return 0

        def _parse_amount(val: Any) -> float:
            try:
                return float(val or 0)
            except Exception:
                return 0.0

        unwrapped_nodes = [_unwrap(n) for n in nodes if isinstance(n, dict)]
        unwrapped_edges = [_unwrap(e) for e in edges if isinstance(e, dict)]

        # Helper lookups
        node_map = {n.get("id"): n for n in unwrapped_nodes if n.get("id")}
        
        # Collect incoming and outgoing edges per wallet
        in_edges: Dict[str, List[Dict[str, Any]]] = defaultdict(list)
        out_edges: Dict[str, List[Dict[str, Any]]] = defaultdict(list)
        all_transfers_by_wallet: Dict[str, List[Dict[str, Any]]] = defaultdict(list)

        for raw_e in unwrapped_edges:
            e = raw_e
            src = e.get("source") or e.get("from")
            tgt = e.get("target") or e.get("to")
            if not src or not tgt:
                continue
            e_norm = {
                "source": str(src),
                "target": str(tgt),
                "amount": _parse_amount(e.get("amount")),
                "token_symbol": str(e.get("token_symbol") or e.get("token") or "USDT").upper(),
                "timestamp_utc": _parse_ts(e.get("timestamp_utc") or e.get("ts")),
                "tx_hash": str(e.get("tx_hash") or e.get("tx") or ""),
                "parentBoxId": str(e.get("parentBoxId") or ""),
                "is_core_path": bool(e.get("is_core_path") or e.get("isCorePath")),
            }
            in_edges[e_norm["target"]].append(e_norm)
            out_edges[e_norm["source"]].append(e_norm)
            all_transfers_by_wallet[e_norm["source"]].append(e_norm)
            all_transfers_by_wallet[e_norm["target"]].append(e_norm)

        # ---------------------------------------------------------------------
        # HEURISTIC A: Common Gas-Funding Source Address
        # ---------------------------------------------------------------------
        # Group wallets receiving gas tokens or from gas-refill dispensers
        gas_funders: Dict[str, Set[str]] = defaultdict(set)
        for tgt, txs in in_edges.items():
            for t in txs:
                is_gas = (
                    t["token_symbol"] in cls.GAS_TOKENS or
                    t.get("parentBoxId") == "gas-refill" or
                    (node_map.get(t["source"]) and node_map[t["source"]].get("node_type") == "gas_fee")
                )
                if is_gas and t["source"] != tgt:
                    gas_funders[t["source"]].add(tgt)

        for funder, funded_wallets in gas_funders.items():
            wallets_list = sorted(list(funded_wallets))
            if len(wallets_list) >= 2:
                for i in range(len(wallets_list)):
                    for j in range(i + 1, len(wallets_list)):
                        w1 = wallets_list[i]
                        w2 = wallets_list[j]
                        if add_pair(w1, w2):
                            funder_label = funder[:8] + "..." if len(funder) > 10 else funder
                            edge_id = f"indirect-gas-{w1[:6]}-{w2[:6]}-{funder[:6]}"
                            indirect_edges.append({
                                "id": edge_id,
                                "source": w1,
                                "target": w2,
                                "edge_type": "indirect_link",
                                "link_reason": "common_gas_funder",
                                "intermediary": funder,
                                "confidence": 0.96,
                                "label": f"⚡ Shared Gas ({funder_label})",
                                "description": f"Wallets {w1[:8]}... and {w2[:8]}... share common energy/gas funding source: {funder}",
                                "timestamp_utc": int(datetime.datetime.now(datetime.timezone.utc).timestamp()),
                            })

        # ---------------------------------------------------------------------
        # HEURISTIC B: Common First-Funding Intermediary (Parent Genesis)
        # ---------------------------------------------------------------------
        first_funders: Dict[str, Set[str]] = defaultdict(set)
        for tgt, txs in in_edges.items():
            if not txs:
                continue
            # Sort by timestamp ascending to find genesis funding
            sorted_txs = sorted(txs, key=lambda x: x["timestamp_utc"])
            genesis_tx = sorted_txs[0]
            genesis_parent = genesis_tx["source"]
            if genesis_parent != tgt and len(genesis_parent) > 4:
                first_funders[genesis_parent].add(tgt)

        for parent, children in first_funders.items():
            child_list = sorted(list(children))
            if len(child_list) >= 2:
                for i in range(len(child_list)):
                    for j in range(i + 1, len(child_list)):
                        w1 = child_list[i]
                        w2 = child_list[j]
                        if add_pair(w1, w2):
                            parent_label = parent[:8] + "..." if len(parent) > 10 else parent
                            edge_id = f"indirect-genesis-{w1[:6]}-{w2[:6]}-{parent[:6]}"
                            indirect_edges.append({
                                "id": edge_id,
                                "source": w1,
                                "target": w2,
                                "edge_type": "indirect_link",
                                "link_reason": "common_first_funder",
                                "intermediary": parent,
                                "confidence": 0.91,
                                "label": f"🔗 Common Genesis ({parent_label})",
                                "description": f"Wallets {w1[:8]}... and {w2[:8]}... were both initially activated by parent {parent}",
                                "timestamp_utc": int(datetime.datetime.now(datetime.timezone.utc).timestamp()),
                            })

        # ---------------------------------------------------------------------
        # HEURISTIC C: Near-Identical Transaction Timing Patterns
        # ---------------------------------------------------------------------
        active_wallets = list(node_map.keys())
        for i in range(len(active_wallets)):
            for j in range(i + 1, len(active_wallets)):
                w1 = active_wallets[i]
                w2 = active_wallets[j]
                
                # Check timestamps of outgoing transfers from both wallets
                txs1 = out_edges.get(w1, [])
                txs2 = out_edges.get(w2, [])
                if not txs1 or not txs2:
                    continue

                min_delta = float("inf")
                matched_pair = None
                for t1 in txs1:
                    for t2 in txs2:
                        ts1 = t1["timestamp_utc"]
                        ts2 = t2["timestamp_utc"]
                        if ts1 > 0 and ts2 > 0:
                            delta = abs(ts1 - ts2)
                            if delta < min_delta:
                                min_delta = delta
                                matched_pair = (t1, t2)

                if min_delta <= timing_threshold_seconds and matched_pair:
                    if add_pair(w1, w2):
                        conf = max(0.65, min(0.93, 1.0 - (min_delta / max(1.0, timing_threshold_seconds * 1.5))))
                        edge_id = f"indirect-temporal-{w1[:6]}-{w2[:6]}-{int(min_delta)}"
                        indirect_edges.append({
                            "id": edge_id,
                            "source": w1,
                            "target": w2,
                            "edge_type": "indirect_link",
                            "link_reason": "temporal_synchronization",
                            "time_delta_seconds": int(min_delta),
                            "confidence": round(conf, 2),
                            "label": f"⏱️ Sync (Δ{int(min_delta)}s)",
                            "description": f"Near-identical transaction timing between {w1[:8]}... and {w2[:8]}... (delta = {int(min_delta)}s)",
                            "timestamp_utc": int(datetime.datetime.now(datetime.timezone.utc).timestamp()),
                        })

        # ---------------------------------------------------------------------
        # DSU Clustering: Group connected indirectly linked wallets
        # ---------------------------------------------------------------------
        parent_map: Dict[str, str] = {}

        def find(x: str) -> str:
            if x not in parent_map:
                parent_map[x] = x
            if parent_map[x] != x:
                parent_map[x] = find(parent_map[x])
            return parent_map[x]

        def union(x: str, y: str):
            rx, ry = find(x), find(y)
            if rx != ry:
                parent_map[rx] = ry

        for ie in indirect_edges:
            union(ie["source"], ie["target"])

        clusters_dict: Dict[str, List[str]] = defaultdict(list)
        for node_id in node_map.keys():
            if node_id in parent_map:
                root = find(node_id)
                clusters_dict[root].append(node_id)

        cluster_results = []
        c_idx = 1
        for root, members in clusters_dict.items():
            if len(members) >= 2:
                # Find associated traits
                reasons = set()
                intermediaries = set()
                for ie in indirect_edges:
                    if ie["source"] in members and ie["target"] in members:
                        reasons.add(ie["link_reason"])
                        if ie.get("intermediary"):
                            intermediaries.add(ie["intermediary"])

                cluster_results.append({
                    "cluster_id": f"MAGIC-CLUSTER-{c_idx:02d}",
                    "size": len(members),
                    "members": members,
                    "reasons": list(reasons),
                    "intermediaries": list(intermediaries),
                    "cluster_risk_penalty": min(45, 15 * len(reasons) + 5 * len(members)),
                })
                c_idx += 1

        summary = (
            f"Detected {len(indirect_edges)} indirect links across {len(cluster_results)} "
            f"syndicate clusters based on shared gas sources, common genesis activation, and sub-180s timing bursts."
        )

        return {
            "total_indirect_links": len(indirect_edges),
            "indirect_edges": indirect_edges,
            "clusters": cluster_results,
            "detection_summary": summary,
        }
