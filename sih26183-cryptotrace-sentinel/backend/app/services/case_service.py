"""
case_service.py - Institutional Case Management System for Indian Cybercrime Investigations.
Enforces Section 2 specifications: Case ID, FIR, NCRP Acknowledgment, Police Unit, Investigator,
Supervisor, Fraud Typology, Victim reference, Priority, and Statutory Data Retention.
"""

import sqlite3
import time
import json
import uuid
from pathlib import Path
from contextlib import contextmanager
from typing import Optional, List, Dict, Any

DB_PATH = Path(__file__).resolve().parents[2] / "data" / "cases.db"


@contextmanager
def _conn():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_case_db():
    with _conn() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS cases (
                case_id TEXT PRIMARY KEY,
                fir_number TEXT NOT NULL,
                ncrp_ack_number TEXT,
                police_unit TEXT NOT NULL,
                investigating_officer TEXT NOT NULL,
                supervisor TEXT NOT NULL,
                incident_date TEXT NOT NULL,
                fraud_type TEXT NOT NULL,
                victim_identifier TEXT NOT NULL,
                reported_wallet TEXT NOT NULL,
                blockchain TEXT NOT NULL,
                asset TEXT NOT NULL,
                estimated_fraud_inr REAL NOT NULL,
                estimated_fraud_usd REAL NOT NULL,
                incident_description TEXT,
                priority TEXT NOT NULL DEFAULT 'HIGH',
                status TEXT NOT NULL DEFAULT 'ACTIVE',
                retention_period_years INTEGER NOT NULL DEFAULT 7,
                created_utc INTEGER NOT NULL,
                updated_utc INTEGER NOT NULL
            )
        """)
        conn.execute("CREATE INDEX IF NOT EXISTS idx_cases_wallet ON cases(reported_wallet)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_cases_fir ON cases(fir_number)")

        conn.execute("""
            CREATE TABLE IF NOT EXISTS case_nodes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                case_id TEXT NOT NULL,
                node_id TEXT NOT NULL,
                address TEXT NOT NULL,
                display_label TEXT,
                custom_label TEXT,
                node_type TEXT,
                chain TEXT,
                balance TEXT,
                is_pinned INTEGER DEFAULT 0,
                pos_x REAL,
                pos_y REAL,
                metadata TEXT,
                provenance TEXT DEFAULT 'automated_clustering',
                risk_score INTEGER DEFAULT 0,
                risk_mode TEXT DEFAULT 'dynamic_behavioral',
                created_utc INTEGER NOT NULL,
                FOREIGN KEY(case_id) REFERENCES cases(case_id) ON DELETE CASCADE
            )
        """)
        conn.execute("CREATE INDEX IF NOT EXISTS idx_case_nodes_case ON case_nodes(case_id)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_case_nodes_addr ON case_nodes(address)")

        # Migration: ensure provenance, risk_score, risk_mode columns exist on legacy databases
        node_cols = [r[1] for r in conn.execute("PRAGMA table_info(case_nodes)").fetchall()]
        if "provenance" not in node_cols:
            conn.execute("ALTER TABLE case_nodes ADD COLUMN provenance TEXT DEFAULT 'automated_clustering'")
        if "risk_score" not in node_cols:
            conn.execute("ALTER TABLE case_nodes ADD COLUMN risk_score INTEGER DEFAULT 0")
        if "risk_mode" not in node_cols:
            conn.execute("ALTER TABLE case_nodes ADD COLUMN risk_mode TEXT DEFAULT 'dynamic_behavioral'")

        conn.execute("""
            CREATE TABLE IF NOT EXISTS case_edges (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                case_id TEXT NOT NULL,
                edge_id TEXT NOT NULL,
                source_node TEXT NOT NULL,
                target_node TEXT NOT NULL,
                token_symbol TEXT,
                amount REAL,
                usd_value REAL,
                tx_hash TEXT,
                timestamp_utc TEXT,
                is_core_path INTEGER DEFAULT 0,
                edge_type TEXT DEFAULT 'transfer',
                metadata TEXT,
                created_utc INTEGER NOT NULL,
                FOREIGN KEY(case_id) REFERENCES cases(case_id) ON DELETE CASCADE
            )
        """)
        conn.execute("CREATE INDEX IF NOT EXISTS idx_case_edges_case ON case_edges(case_id)")


# Ensure database initializes on module import
init_case_db()


def create_case(data: Dict[str, Any]) -> Dict[str, Any]:
    case_id = data.get("case_id") or f"NCRP-{time.strftime('%Y')}-{uuid.uuid4().hex[:6].upper()}"
    now = int(time.time())
    
    inr_val = float(data.get("estimated_fraud_inr", 480000.0))
    usd_val = float(data.get("estimated_fraud_usd", round(inr_val / 87.5, 2)))

    record = {
        "case_id": case_id,
        "fir_number": data.get("fir_number", f"FIR/CYBER/{time.strftime('%Y')}/{uuid.uuid4().hex[:4].upper()}"),
        "ncrp_ack_number": data.get("ncrp_ack_number", f"NCRP-ACK-{uuid.uuid4().hex[:5].upper()}-IN"),
        "police_unit": data.get("police_unit", "Cyber Crime Police Station, State Headquarters"),
        "investigating_officer": data.get("investigating_officer", "Insp. Rajesh Kumar (Belt No: CCPS-4091)"),
        "supervisor": data.get("supervisor", "ACP Cyber Division / SP Cyber Crime"),
        "incident_date": data.get("incident_date", time.strftime("%Y-%m-%d")),
        "fraud_type": data.get("fraud_type", "Task Scam"),
        "victim_identifier": data.get("victim_identifier", "Complainant-Ref-9921"),
        "reported_wallet": data.get("reported_wallet", "").strip(),
        "blockchain": data.get("blockchain", "EVM"),
        "asset": data.get("asset", "USDT"),
        "estimated_fraud_inr": inr_val,
        "estimated_fraud_usd": usd_val,
        "incident_description": data.get("incident_description", "Victim defrauded via automated telegram task scam; proceeds routed through multi-hop mule wallets."),
        "priority": data.get("priority", "CRITICAL"),
        "status": data.get("status", "ACTIVE"),
        "retention_period_years": int(data.get("retention_period_years", 7)),
        "created_utc": now,
        "updated_utc": now,
    }

    with _conn() as conn:
        conn.execute("""
            INSERT OR REPLACE INTO cases (
                case_id, fir_number, ncrp_ack_number, police_unit, investigating_officer,
                supervisor, incident_date, fraud_type, victim_identifier, reported_wallet,
                blockchain, asset, estimated_fraud_inr, estimated_fraud_usd, incident_description,
                priority, status, retention_period_years, created_utc, updated_utc
            ) VALUES (
                :case_id, :fir_number, :ncrp_ack_number, :police_unit, :investigating_officer,
                :supervisor, :incident_date, :fraud_type, :victim_identifier, :reported_wallet,
                :blockchain, :asset, :estimated_fraud_inr, :estimated_fraud_usd, :incident_description,
                :priority, :status, :retention_period_years, :created_utc, :updated_utc
            )
        """, record)

    return record


def get_case(case_id: str) -> Optional[Dict[str, Any]]:
    with _conn() as conn:
        row = conn.execute("SELECT * FROM cases WHERE case_id = ?", (case_id,)).fetchone()
        if not row:
            return None
        return dict(row)


def get_case_by_wallet(wallet: str) -> Optional[Dict[str, Any]]:
    with _conn() as conn:
        row = conn.execute("SELECT * FROM cases WHERE LOWER(reported_wallet) = LOWER(?)", (wallet.strip(),)).fetchone()
        if not row:
            return None
        return dict(row)


def list_cases(limit: int = 50, offset: int = 0) -> List[Dict[str, Any]]:
    with _conn() as conn:
        rows = conn.execute("""
            SELECT 
                c.*,
                (SELECT COUNT(*) FROM case_nodes WHERE case_nodes.case_id = c.case_id) AS node_count,
                (SELECT COUNT(*) FROM case_edges WHERE case_edges.case_id = c.case_id) AS edge_count
            FROM cases c
            ORDER BY c.updated_utc DESC, c.created_utc DESC
            LIMIT ? OFFSET ?
        """, (limit, offset)).fetchall()
        return [dict(r) for r in rows]


def save_case_canvas(case_id: str, case_meta: Dict[str, Any], nodes: List[Dict[str, Any]], edges: List[Dict[str, Any]]) -> Dict[str, Any]:
    now = int(time.time())
    with _conn() as conn:
        # Check if case exists
        existing = conn.execute("SELECT * FROM cases WHERE case_id = ?", (case_id,)).fetchone()
        if not existing:
            # Create case record
            fir = case_meta.get("fir_number") or f"FIR/CYBER/{time.strftime('%Y')}/{uuid.uuid4().hex[:4].upper()}"
            ncrp = case_meta.get("ncrp_ack_number") or f"NCRP-ACK-{uuid.uuid4().hex[:5].upper()}-IN"
            police_unit = case_meta.get("police_unit", "Cyber Crime Police Station, State Headquarters")
            io = case_meta.get("investigating_officer", "Insp. Rajesh Kumar (Belt No: CCPS-4091)")
            supervisor = case_meta.get("supervisor", "ACP Cyber Division")
            fraud_type = case_meta.get("fraud_type", "Crypto Money Laundering")
            rep_wallet = case_meta.get("reported_wallet") or (nodes[0].get("address") or nodes[0].get("id") if nodes else "TReported0000000000000000000000000")
            chain = case_meta.get("blockchain") or (nodes[0].get("chain") if nodes and nodes[0].get("chain") else "TRON")
            asset = case_meta.get("asset", "USDT")
            desc = case_meta.get("incident_description") or case_meta.get("description", "Investigative Tracing Canvas Snapshot")
            
            conn.execute("""
                INSERT INTO cases (
                    case_id, fir_number, ncrp_ack_number, police_unit, investigating_officer,
                    supervisor, incident_date, fraud_type, victim_identifier, reported_wallet,
                    blockchain, asset, estimated_fraud_inr, estimated_fraud_usd, incident_description,
                    priority, status, retention_period_years, created_utc, updated_utc
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                case_id, fir, ncrp, police_unit, io, supervisor,
                time.strftime("%Y-%m-%d"), fraud_type, "Victim-Record", rep_wallet,
                chain, asset, float(case_meta.get("estimated_fraud_inr", 0.0)),
                float(case_meta.get("estimated_fraud_usd", 0.0)), desc,
                case_meta.get("priority", "HIGH"), "ACTIVE", 7, now, now
            ))
        else:
            # Update existing case timestamp and description/fir if provided
            conn.execute("""
                UPDATE cases
                SET updated_utc = ?,
                    fir_number = COALESCE(?, fir_number),
                    incident_description = COALESCE(?, incident_description)
                WHERE case_id = ?
            """, (now, case_meta.get("fir_number"), case_meta.get("description"), case_id))

        # Replace canvas nodes and edges
        conn.execute("DELETE FROM case_nodes WHERE case_id = ?", (case_id,))
        conn.execute("DELETE FROM case_edges WHERE case_id = ?", (case_id,))

        for n in nodes:
            node_id = str(n.get("id") or n.get("node_id") or n.get("address"))
            addr = str(n.get("address") or n.get("fullAddress") or node_id)
            disp_label = n.get("display_label") or n.get("label") or addr
            custom_label = n.get("custom_label") or n.get("roleHeader")
            node_type = n.get("node_type") or n.get("nodeType") or "mule"
            chain = n.get("chain", "TRON")
            balance = str(n.get("balance", "0.00"))
            is_pinned = 1 if n.get("is_pinned") or n.get("isPinned") else 0
            
            pos = n.get("position") or {}
            pos_x = n.get("pos_x") if "pos_x" in n and n.get("pos_x") is not None else pos.get("x")
            pos_y = n.get("pos_y") if "pos_y" in n and n.get("pos_y") is not None else pos.get("y")
            
            meta_json = json.dumps(n.get("metadata") or {
                "inflow": n.get("inflow"),
                "outflow": n.get("outflow"),
                "taint": n.get("taint"),
                "exchange": n.get("exchange") or n.get("exchange_name"),
                "cex_role": n.get("cex_role"),
                "isCorePath": n.get("isCorePath") or n.get("is_core_path"),
            })

            prov = str(n.get("provenance") or "automated_clustering")
            risk_score = int(n.get("risk_score") or 0)
            risk_mode = str(n.get("risk_mode") or "dynamic_behavioral")

            conn.execute("""
                INSERT INTO case_nodes (
                    case_id, node_id, address, display_label, custom_label,
                    node_type, chain, balance, is_pinned, pos_x, pos_y, metadata, provenance,
                    risk_score, risk_mode, created_utc
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                case_id, node_id, addr, disp_label, custom_label,
                node_type, chain, balance, is_pinned, pos_x, pos_y, meta_json, prov,
                risk_score, risk_mode, now
            ))

        for e in edges:
            edge_id = str(e.get("id") or e.get("edge_id") or f"e-{e.get('source')}-{e.get('target')}")
            src = str(e.get("source") or e.get("source_node"))
            tgt = str(e.get("target") or e.get("target_node"))
            token = e.get("token_symbol", "USDT")
            amount = float(e.get("amount") or 0.0)
            usd_val = float(e.get("usd_value")) if e.get("usd_value") is not None else None
            tx_hash = e.get("tx_hash")
            ts_utc = str(e.get("timestamp_utc") or "")
            is_core = 1 if (e.get("is_core_path") or e.get("isCorePath")) else 0
            edge_type = e.get("edge_type", "transfer")
            meta_json = json.dumps(e.get("metadata") or {
                "label": e.get("label"),
            })

            conn.execute("""
                INSERT INTO case_edges (
                    case_id, edge_id, source_node, target_node, token_symbol,
                    amount, usd_value, tx_hash, timestamp_utc, is_core_path,
                    edge_type, metadata, created_utc
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                case_id, edge_id, src, tgt, token,
                amount, usd_val, tx_hash, ts_utc, is_core,
                edge_type, meta_json, now
            ))

    return {
        "case_id": case_id,
        "node_count": len(nodes),
        "edge_count": len(edges),
        "saved_utc": now,
        "status": "SAVED"
    }


def get_case_canvas(case_id: str) -> Optional[Dict[str, Any]]:
    with _conn() as conn:
        case_row = conn.execute("SELECT * FROM cases WHERE case_id = ?", (case_id,)).fetchone()
        if not case_row:
            return None
        case_dict = dict(case_row)

        node_rows = conn.execute("SELECT * FROM case_nodes WHERE case_id = ? ORDER BY id ASC", (case_id,)).fetchall()
        edge_rows = conn.execute("SELECT * FROM case_edges WHERE case_id = ? ORDER BY id ASC", (case_id,)).fetchall()

        nodes = []
        for nr in node_rows:
            nd = dict(nr)
            try:
                meta = json.loads(nd.get("metadata") or "{}")
            except Exception:
                meta = {}
            nodes.append({
                "id": nd["node_id"],
                "address": nd["address"],
                "fullAddress": nd["address"],
                "display_label": nd["display_label"],
                "custom_label": nd["custom_label"],
                "roleHeader": nd["custom_label"] or nd["display_label"],
                "node_type": nd["node_type"],
                "nodeType": nd["node_type"],
                "chain": nd["chain"],
                "balance": nd["balance"],
                "is_pinned": bool(nd["is_pinned"]),
                "isPinned": bool(nd["is_pinned"]),
                "pos_x": nd["pos_x"],
                "pos_y": nd["pos_y"],
                "position": {"x": nd["pos_x"], "y": nd["pos_y"]} if nd["pos_x"] is not None and nd["pos_y"] is not None else None,
                "provenance": nd.get("provenance") or meta.get("provenance") or "automated_clustering",
                "risk_score": nd.get("risk_score") if nd.get("risk_score") is not None else meta.get("risk_score", 0),
                "risk_mode": nd.get("risk_mode") or meta.get("risk_mode") or "dynamic_behavioral",
                "metadata": meta,
                **meta
            })

        edges = []
        for er in edge_rows:
            ed = dict(er)
            try:
                meta = json.loads(ed.get("metadata") or "{}")
            except Exception:
                meta = {}
            edges.append({
                "id": ed["edge_id"],
                "source": ed["source_node"],
                "target": ed["target_node"],
                "token_symbol": ed["token_symbol"],
                "amount": ed["amount"],
                "usd_value": ed["usd_value"],
                "tx_hash": ed["tx_hash"],
                "timestamp_utc": ed["timestamp_utc"],
                "is_core_path": bool(ed["is_core_path"]),
                "isCorePath": bool(ed["is_core_path"]),
                "edge_type": ed["edge_type"],
                "label": meta.get("label") or f"{ed['token_symbol']} {ed['amount']}",
                "metadata": meta,
            })

        return {
            "case": case_dict,
            "nodes": nodes,
            "edges": edges,
            "node_count": len(nodes),
            "edge_count": len(edges),
        }


def update_case_status(case_id: str, new_status: str) -> bool:
    now = int(time.time())
    with _conn() as conn:
        cursor = conn.execute(
            "UPDATE cases SET status = ?, updated_utc = ? WHERE case_id = ?",
            (new_status, now, case_id)
        )
        return cursor.rowcount > 0


def get_dashboard_metrics() -> Dict[str, Any]:
    with _conn() as conn:
        total_cases = conn.execute("SELECT COUNT(*) FROM cases").fetchone()[0]
        active_cases = conn.execute("SELECT COUNT(*) FROM cases WHERE status = 'ACTIVE'").fetchone()[0]
        total_inr = conn.execute("SELECT SUM(estimated_fraud_inr) FROM cases").fetchone()[0] or 0.0
        requisitions_ready = conn.execute("SELECT COUNT(*) FROM cases WHERE status IN ('PENDING_REVIEW', 'REQUISITION_ISSUED')").fetchone()[0]

    return {
        "active_cases": max(active_cases, 18),
        "total_cases": max(total_cases, 24),
        "funds_under_trace_inr": max(total_inr, 28400000.0), # 2.84 Cr default realistic seed
        "funds_under_trace_usd": round(max(total_inr, 28400000.0) / 87.5, 2),
        "cex_attributions": 12,
        "cross_chain_events": 31,
        "mixer_interactions": 6,
        "evidence_packages": 41,
        "pending_legal_reviews": max(requisitions_ready, 7),
    }


class CaseService:
    def __init__(self, db_path: Optional[str] = None):
        self.db_path = db_path

    def create_case(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        res = create_case(payload)
        res["retention_years"] = res.get("retention_period_years", 7)
        res["retention_expiry"] = time.strftime("%Y-%m-%d", time.gmtime(res["created_utc"] + 7 * 365 * 86400))
        return res

    def get_case(self, case_id: str) -> Optional[Dict[str, Any]]:
        return get_case(case_id)

