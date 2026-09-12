"""
snapshot_service.py - Time Travel Cluster Snapshot Engine.
Computes periodic and event-driven forensic snapshots of a cluster's state
from historical transaction timestamps, calculating dynamic holdings,
active links, volume in motion, and off-ramp exposure over time.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, timezone


def parse_numeric_amount(val: Any) -> float:
    if val is None:
        return 0.0
    if isinstance(val, (int, float)):
        return float(val)
    cleaned = "".join(c for c in str(val) if c.isdigit() or c == ".")
    try:
        return float(cleaned) if cleaned else 0.0
    except ValueError:
        return 0.0


def format_utc_timestamp(epoch: int) -> str:
    try:
        dt = datetime.fromtimestamp(epoch, tz=timezone.utc)
        return dt.strftime("%Y-%m-%d %H:%M:%S UTC")
    except Exception:
        return f"Epoch {epoch}"


def format_relative_time(delta_seconds: int) -> str:
    if delta_seconds <= 0:
        return "T + 00:00:00"
    hours = delta_seconds // 3600
    minutes = (delta_seconds % 3600) // 60
    seconds = delta_seconds % 60
    if hours > 0:
        return f"T + {hours:02d}h {minutes:02d}m {seconds:02d}s"
    return f"T + {minutes:02d}m {seconds:02d}s"


class ClusterSnapshotEngine:
    @staticmethod
    def generate_snapshots(nodes: List[Dict[str, Any]], edges: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Computes discrete, sequential state snapshots of a cluster as transactions occur chronologically.
        """
        if not nodes:
            return []

        # 1. Normalize and sort edges chronologically
        normalized_edges = []
        for idx, e in enumerate(edges):
            ts = e.get("timestamp_utc") or e.get("timestamp")
            try:
                ts_int = int(ts) if ts is not None else 1773000000 + (idx * 120)
            except (ValueError, TypeError):
                ts_int = 1773000000 + (idx * 120)

            amt = parse_numeric_amount(e.get("amount", 0))
            sym = e.get("token_symbol") or "USDT"
            edge_id = e.get("id") or f"e-{e.get('source')}-{e.get('target')}-{idx}"

            normalized_edges.append({
                "id": edge_id,
                "source": str(e.get("source", "")),
                "target": str(e.get("target", "")),
                "amount": amt,
                "token_symbol": sym,
                "tx_hash": e.get("tx_hash") or f"0x{idx:06x}",
                "timestamp_utc": ts_int,
                "is_core_path": bool(e.get("is_core_path", False)),
                "label": e.get("label") or f"{sym} {amt:,.2f}",
                "raw": e
            })

        # Sort chronologically by timestamp
        normalized_edges.sort(key=lambda x: x["timestamp_utc"])

        # Node index and initial balances
        nodes_map = {str(n.get("id", "")): n for n in nodes if n.get("id")}
        
        # Calculate initial baseline balance at Genesis (T0)
        total_stolen = 0.0
        for e in normalized_edges:
            src_node = nodes_map.get(e["source"])
            if src_node and (src_node.get("node_type") == "origin" or src_node.get("is_victim")):
                total_stolen += e["amount"]

        if total_stolen <= 0:
            total_stolen = 15000.0  # Reference volume

        # Track mutable balances per node
        current_balances: Dict[str, float] = {}
        current_inflows: Dict[str, float] = {}
        current_outflows: Dict[str, float] = {}

        for nid, n in nodes_map.items():
            ntype = n.get("node_type") or n.get("nodeType") or "mule"
            if ntype == "origin" or n.get("is_victim"):
                current_balances[nid] = total_stolen
            else:
                current_balances[nid] = 0.0
            current_inflows[nid] = 0.0
            current_outflows[nid] = 0.0

        snapshots: List[Dict[str, Any]] = []

        # T0: Genesis Snapshot (Pre-theft state)
        t0_epoch = (normalized_edges[0]["timestamp_utc"] - 60) if normalized_edges else 1773000000
        genesis_holdings = {}
        for nid, n in nodes_map.items():
            ntype = n.get("node_type") or n.get("nodeType") or "mule"
            bal = current_balances[nid]
            is_active = (ntype == "origin" or n.get("is_victim"))
            genesis_holdings[nid] = {
                "balance": f"{bal:,.2f} USDT" if ntype == "origin" else "0.00 USDT",
                "balance_num": bal,
                "inflow": "0.00 USDT",
                "outflow": "0.00 USDT",
                "total_vol": bal if is_active else 10.0,
                "is_active": is_active,
                "state_label": "Complainant Stolen Funds Pool" if is_active else "Inactive",
            }

        snapshots.append({
            "step_index": 0,
            "timestamp_utc": t0_epoch,
            "formatted_date": format_utc_timestamp(t0_epoch),
            "relative_time": "T + 00:00:00",
            "active_edge_ids": [],
            "just_fired_edge_id": None,
            "fired_edges": [],
            "event_description": "Initial state: Stolen victim assets held in complainant reported wallet",
            "node_holdings": genesis_holdings,
            "metrics": {
                "active_nodes_count": sum(1 for h in genesis_holdings.values() if h["is_active"]),
                "active_links_count": 0,
                "total_stolen_disbursed": 0.0,
                "funds_at_rest": total_stolen,
                "funds_in_motion": 0.0,
                "offramp_exposure_pct": 0.0,
                "reached_exchange": False,
            }
        })

        # Progressive State Snapshots (T1 ... Tn)
        active_edge_ids: List[str] = []
        cumulative_offramp = 0.0
        cumulative_disbursed = 0.0

        for step_idx, edge in enumerate(normalized_edges, start=1):
            src = edge["source"]
            tgt = edge["target"]
            amt = edge["amount"]
            sym = edge["token_symbol"]
            ts = edge["timestamp_utc"]

            active_edge_ids.append(edge["id"])

            # Update balances
            if src in current_balances:
                current_balances[src] = max(0.0, current_balances[src] - amt)
                current_outflows[src] += amt
            if tgt in current_balances:
                current_balances[tgt] += amt
                current_inflows[tgt] += amt

            # Check if source is origin
            src_node = nodes_map.get(src, {})
            if src_node.get("node_type") == "origin" or src_node.get("is_victim"):
                cumulative_disbursed += amt

            # Check if target is CEX off-ramp
            tgt_node = nodes_map.get(tgt, {})
            tgt_type = tgt_node.get("node_type") or tgt_node.get("nodeType") or ""
            if "cex" in tgt_type:
                cumulative_offramp += amt

            # Build node holdings for this step
            step_holdings = {}
            for nid, n in nodes_map.items():
                bal = current_balances.get(nid, 0.0)
                inflow = current_inflows.get(nid, 0.0)
                outflow = current_outflows.get(nid, 0.0)
                tot_vol = max(bal, inflow, outflow, 10.0)
                is_active = (inflow > 0 or outflow > 0 or bal > 0 or n.get("node_type") == "origin")

                step_holdings[nid] = {
                    "balance": f"{bal:,.2f} {sym}",
                    "balance_num": bal,
                    "inflow": f"{inflow:,.2f} {sym}",
                    "outflow": f"{outflow:,.2f} {sym}",
                    "total_vol": tot_vol,
                    "is_active": is_active,
                }

            src_label = src_node.get("roleHeader") or src_node.get("custom_label") or src[:8]
            tgt_label = tgt_node.get("roleHeader") or tgt_node.get("custom_label") or tgt[:8]

            offramp_pct = min(100.0, round((cumulative_offramp / max(total_stolen, 1.0)) * 100.0, 1))

            snapshots.append({
                "step_index": step_idx,
                "timestamp_utc": ts,
                "formatted_date": format_utc_timestamp(ts),
                "relative_time": format_relative_time(ts - t0_epoch),
                "active_edge_ids": list(active_edge_ids),
                "just_fired_edge_id": edge["id"],
                "fired_edges": [edge],
                "event_description": f"Transfer: {amt:,.2f} {sym} from [{src_label}] to [{tgt_label}] (Tx: {edge['tx_hash'][:10]}...)",
                "node_holdings": step_holdings,
                "metrics": {
                    "active_nodes_count": sum(1 for h in step_holdings.values() if h["is_active"]),
                    "active_links_count": len(active_edge_ids),
                    "total_stolen_disbursed": cumulative_disbursed,
                    "funds_at_rest": current_balances.get("cex_hot", 0.0) + current_balances.get("cex_dep", 0.0),
                    "funds_in_motion": max(0.0, total_stolen - current_balances.get("cex_hot", 0.0)),
                    "offramp_exposure_pct": offramp_pct,
                    "reached_exchange": offramp_pct > 0,
                }
            })

        return snapshots
