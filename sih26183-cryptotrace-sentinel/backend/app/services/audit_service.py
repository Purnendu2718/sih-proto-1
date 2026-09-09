"""
audit_service.py - Tamper-Evident Audit Trail Subsystem.
Conforms to Section 46 specifications:
Records Who, What, When, Case, Evidence, Previous State, New State with SHA-256 hash chaining.
"""

import sqlite3
import time
import json
import hashlib
from pathlib import Path
from contextlib import contextmanager
from typing import Optional, List, Dict, Any

DB_PATH = Path(__file__).resolve().parents[2] / "data" / "audit_log.db"
GENESIS_HASH = "0" * 64


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


def init_audit_db():
    with _conn() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS audit_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp_utc INTEGER NOT NULL,
                user_id TEXT NOT NULL,
                role TEXT NOT NULL,
                case_id TEXT,
                action TEXT NOT NULL,
                target_entity TEXT,
                details TEXT,
                previous_state TEXT,
                new_state TEXT,
                previous_sha256 TEXT NOT NULL,
                entry_sha256 TEXT NOT NULL
            )
        """)
        conn.execute("CREATE INDEX IF NOT EXISTS idx_audit_case ON audit_logs(case_id)")


init_audit_db()


def log_audit_event(
    action: str,
    case_id: Optional[str] = None,
    user_id: str = "IO-RAJESH-4091",
    role: str = "Investigator (IO)",
    target_entity: Optional[str] = None,
    details: Optional[str] = None,
    previous_state: Optional[Dict[str, Any]] = None,
    new_state: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """Append a cryptographically linked event to the immutable audit ledger."""
    now = int(time.time())
    prev_str = json.dumps(previous_state or {}, sort_keys=True)
    new_str = json.dumps(new_state or {}, sort_keys=True)

    with _conn() as conn:
        last_row = conn.execute("SELECT entry_sha256 FROM audit_logs ORDER BY id DESC LIMIT 1").fetchone()
        prev_hash = last_row[0] if last_row else GENESIS_HASH

        payload = f"{now}|{user_id}|{role}|{case_id}|{action}|{target_entity}|{details}|{prev_str}|{new_str}|{prev_hash}"
        entry_hash = hashlib.sha256(payload.encode("utf-8")).hexdigest()

        cursor = conn.execute("""
            INSERT INTO audit_logs (
                timestamp_utc, user_id, role, case_id, action, target_entity,
                details, previous_state, new_state, previous_sha256, entry_sha256
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (now, user_id, role, case_id, action, target_entity, details, prev_str, new_str, prev_hash, entry_hash))

        return {
            "id": cursor.lastrowid,
            "timestamp_utc": now,
            "action": action,
            "user_id": user_id,
            "role": role,
            "case_id": case_id,
            "entry_sha256": entry_hash,
        }


def get_audit_trail(case_id: Optional[str] = None, limit: int = 100) -> List[Dict[str, Any]]:
    """Retrieve chronologically ordered audit logs."""
    with _conn() as conn:
        if case_id:
            rows = conn.execute(
                "SELECT * FROM audit_logs WHERE case_id = ? ORDER BY id DESC LIMIT ?", (case_id, limit)
            ).fetchall()
        else:
            rows = conn.execute(
                "SELECT * FROM audit_logs ORDER BY id DESC LIMIT ?", (limit,)
            ).fetchall()
        return [dict(r) for r in rows]


def verify_audit_integrity() -> Dict[str, Any]:
    """Verify cryptographic chain of custody across all audit entries."""
    with _conn() as conn:
        rows = conn.execute("SELECT * FROM audit_logs ORDER BY id ASC").fetchall()

    if not rows:
        return {"status": "EMPTY", "total_entries": 0, "tampering_detected": False}

    prev_hash = GENESIS_HASH
    for r in rows:
        payload = f"{r['timestamp_utc']}|{r['user_id']}|{r['role']}|{r['case_id']}|{r['action']}|{r['target_entity']}|{r['details']}|{r['previous_state']}|{r['new_state']}|{prev_hash}"
        expected_hash = hashlib.sha256(payload.encode("utf-8")).hexdigest()
        if expected_hash != r["entry_sha256"] or prev_hash != r["previous_sha256"]:
            return {
                "status": "TAMPERED",
                "failed_at_id": r["id"],
                "total_entries": len(rows),
                "tampering_detected": True,
            }
        prev_hash = r["entry_sha256"]

    return {
        "status": "VALID",
        "total_entries": len(rows),
        "tampering_detected": False,
        "latest_hash": prev_hash,
    }


class AuditService:
    def __init__(self, db_path: Optional[str] = None):
        self.db_path = db_path

    def record_event(self, action: str, case_id: Optional[str] = None, user_id: str = "SYSTEM", details: str = ""):
        return log_audit_event(action=action, case_id=case_id, user_id=user_id, details=details)

    def verify_chain_integrity(self) -> Dict[str, Any]:
        res = verify_audit_integrity()
        return {
            "status": res["status"],
            "chain_valid": not res.get("tampering_detected", False),
            "tampering_detected": res.get("tampering_detected", False),
            "total_records": res.get("total_entries", 0),
        }

