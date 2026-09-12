import sqlite3
import time
from pathlib import Path
from contextlib import contextmanager
from typing import Optional

DB_PATH = Path(__file__).resolve().parents[2] / "data" / "attribution_store.db"


@contextmanager
def _conn():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db():
    with _conn() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS attributed_clusters (
                address TEXT PRIMARY KEY,
                chain TEXT NOT NULL,
                category TEXT NOT NULL DEFAULT 'unknown',
                cex_role TEXT,
                exchange_name TEXT,
                entity_label TEXT,
                attribution_rule TEXT NOT NULL,
                confidence REAL NOT NULL,
                evidence_tx_hash TEXT,
                first_seen_utc INTEGER NOT NULL,
                last_confirmed_utc INTEGER NOT NULL
            )
        """)


def upsert_attribution(address: str, chain: str, category: str = "unknown", cex_role: Optional[str] = None,
                        exchange_name: Optional[str] = None, entity_label: Optional[str] = None,
                        attribution_rule: str = "unknown", confidence: float = 0.0,
                        evidence_tx_hash: Optional[str] = None):
    now = int(time.time())
    with _conn() as conn:
        existing = conn.execute(
            "SELECT confidence FROM attributed_clusters WHERE address = ?", (address,)
        ).fetchone()
        if existing is None:
            conn.execute("""
                INSERT INTO attributed_clusters
                (address, chain, category, cex_role, exchange_name, entity_label, attribution_rule,
                 confidence, evidence_tx_hash, first_seen_utc, last_confirmed_utc)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (address, chain, category, cex_role, exchange_name, entity_label, attribution_rule,
                  confidence, evidence_tx_hash, now, now))
        elif confidence >= existing[0]:
            conn.execute("""
                UPDATE attributed_clusters
                SET category = ?, cex_role = ?, exchange_name = ?, entity_label = ?, attribution_rule = ?,
                    confidence = ?, evidence_tx_hash = ?, last_confirmed_utc = ?
                WHERE address = ?
            """, (category, cex_role, exchange_name, entity_label, attribution_rule, confidence,
                  evidence_tx_hash, now, address))
        else:
            conn.execute("UPDATE attributed_clusters SET last_confirmed_utc = ? WHERE address = ?", (now, address))


def lookup_attribution(address: str) -> Optional[dict]:
    with _conn() as conn:
        row = conn.execute("""
            SELECT chain, category, cex_role, exchange_name, entity_label,
                   attribution_rule, confidence, evidence_tx_hash
            FROM attributed_clusters WHERE address = ?
        """, (address,)).fetchone()
    if not row:
        return None
    keys = ["chain", "category", "cex_role", "exchange_name", "entity_label",
            "attribution_rule", "confidence", "evidence_tx_hash"]
    return dict(zip(keys, row))
