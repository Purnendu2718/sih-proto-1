import hashlib
import json
import time
import sqlite3
from pathlib import Path
from contextlib import contextmanager
from typing import Dict, Any, List

DB_PATH = Path(__file__).resolve().parents[2] / "data" / "evidence_ledger.db"


@contextmanager
def _conn():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    try:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS evidence_entries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                case_id TEXT NOT NULL,
                source_endpoint TEXT NOT NULL,
                raw_payload TEXT NOT NULL,
                payload_sha256 TEXT NOT NULL,
                captured_utc INTEGER NOT NULL
            )
        """)
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db():
    with _conn() as conn:
        pass


def _sha256(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def record_raw_evidence(case_id: str, source_endpoint: str, raw_payload: dict) -> str:
    """Call immediately after every live RPC/API call whose response feeds
    a trace, an attribution, or a freeze notice. Returns the SHA-256 of
    the exact bytes stored, which can then be cited on the notice."""
    payload_str = json.dumps(raw_payload, sort_keys=True, separators=(",", ":"))
    digest = _sha256(payload_str)
    with _conn() as conn:
        conn.execute("""
            INSERT INTO evidence_entries (case_id, source_endpoint, raw_payload, payload_sha256, captured_utc)
            VALUES (?, ?, ?, ?, ?)
        """, (case_id, source_endpoint, payload_str, digest, int(time.time())))
    return digest


def build_merkle_root(case_id: str) -> dict:
    """Builds a binary Merkle tree over every raw-evidence digest recorded
    for this case, in insertion order, and returns the root plus the
    ordered leaves so a third party can independently rebuild and verify
    the same root against the stored raw payloads."""
    with _conn() as conn:
        rows = conn.execute(
            "SELECT payload_sha256 FROM evidence_entries WHERE case_id = ? ORDER BY id ASC", (case_id,)
        ).fetchall()
    leaves = [r[0] for r in rows]
    if not leaves:
        return {"root": None, "leaf_count": 0, "leaves": []}

    level = leaves[:]
    while len(level) > 1:
        next_level = []
        for i in range(0, len(level), 2):
            left = level[i]
            right = level[i + 1] if i + 1 < len(level) else level[i]
            next_level.append(_sha256(left + right))
        level = next_level
    return {"root": level[0], "leaf_count": len(leaves), "leaves": leaves}


def get_case_evidence(case_id: str) -> List[Dict[str, Any]]:
    """Retrieve all evidence records for a case."""
    with _conn() as conn:
        rows = conn.execute(
            "SELECT id, case_id, source_endpoint, raw_payload, payload_sha256, captured_utc "
            "FROM evidence_entries WHERE case_id = ? ORDER BY id ASC", (case_id,)
        ).fetchall()
    results = []
    for r in rows:
        results.append({
            "id": r[0],
            "case_id": r[1],
            "source_endpoint": r[2],
            "raw_payload": json.loads(r[3]) if r[3] else {},
            "payload_sha256": r[4],
            "captured_utc": r[5],
        })
    return results
