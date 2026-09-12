import sqlite3
import time
import json
from pathlib import Path
from contextlib import contextmanager
from typing import Optional, Literal, List


DB_PATH = Path(__file__).resolve().parents[2] / "data" / "attribution_store.db"

VALID_PROVENANCE = {"automated_clustering", "offchain_verified", "analyst_reviewed"}


_db_initialized = False


def _run_migrations(conn: sqlite3.Connection):
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
            last_confirmed_utc INTEGER NOT NULL,
            provenance TEXT NOT NULL DEFAULT 'automated_clustering',
            risk_score INTEGER DEFAULT NULL,
            risk_mode TEXT DEFAULT NULL,
            is_sanctioned INTEGER DEFAULT 0,
            sanctions_details TEXT DEFAULT NULL,
            precomputed_utc INTEGER DEFAULT NULL
        )
    """)

    # Migration: ensure provenance and precomputed risk columns exist on legacy databases
    cols = [r[1] for r in conn.execute("PRAGMA table_info(attributed_clusters)").fetchall()]
    if "provenance" not in cols:
        conn.execute("ALTER TABLE attributed_clusters ADD COLUMN provenance TEXT NOT NULL DEFAULT 'automated_clustering'")
    if "risk_score" not in cols:
        conn.execute("ALTER TABLE attributed_clusters ADD COLUMN risk_score INTEGER DEFAULT NULL")
    if "risk_mode" not in cols:
        conn.execute("ALTER TABLE attributed_clusters ADD COLUMN risk_mode TEXT DEFAULT NULL")
    if "is_sanctioned" not in cols:
        conn.execute("ALTER TABLE attributed_clusters ADD COLUMN is_sanctioned INTEGER DEFAULT 0")
    if "sanctions_details" not in cols:
        conn.execute("ALTER TABLE attributed_clusters ADD COLUMN sanctions_details TEXT DEFAULT NULL")
    if "precomputed_utc" not in cols:
        conn.execute("ALTER TABLE attributed_clusters ADD COLUMN precomputed_utc INTEGER DEFAULT NULL")

    # Backfill existing records lacking provenance
    conn.execute("UPDATE attributed_clusters SET provenance = 'automated_clustering' WHERE provenance IS NULL OR provenance = ''")


@contextmanager
def _conn():
    global _db_initialized
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    try:
        if not _db_initialized:
            _run_migrations(conn)
            _db_initialized = True
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db():
    with _conn() as conn:
        _run_migrations(conn)


def upsert_attribution(
    address: str,
    chain: str,
    category: str = "unknown",
    cex_role: Optional[str] = None,
    exchange_name: Optional[str] = None,
    entity_label: Optional[str] = None,
    attribution_rule: str = "unknown",
    confidence: float = 0.0,
    evidence_tx_hash: Optional[str] = None,
    provenance: str = "automated_clustering",
    risk_score: Optional[int] = None,
    risk_mode: Optional[str] = None,
    is_sanctioned: int = 0,
    sanctions_details: Optional[str] = None,
):
    if provenance not in VALID_PROVENANCE:
        provenance = "automated_clustering"

    now = int(time.time())
    with _conn() as conn:
        existing = conn.execute(
            "SELECT confidence, provenance, risk_score FROM attributed_clusters WHERE address = ?", (address,)
        ).fetchone()

        if existing is None:
            conn.execute("""
                INSERT INTO attributed_clusters
                (address, chain, category, cex_role, exchange_name, entity_label, attribution_rule,
                 confidence, evidence_tx_hash, first_seen_utc, last_confirmed_utc, provenance,
                 risk_score, risk_mode, is_sanctioned, sanctions_details, precomputed_utc)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (address, chain, category, cex_role, exchange_name, entity_label, attribution_rule,
                  confidence, evidence_tx_hash, now, now, provenance,
                  risk_score, risk_mode, is_sanctioned, sanctions_details, now if risk_score is not None else None))
        elif confidence >= existing[0]:
            # Retain analyst_reviewed provenance unless explicitly overridden
            effective_provenance = provenance
            if existing[1] == "analyst_reviewed" and provenance == "automated_clustering":
                effective_provenance = "analyst_reviewed"

            conn.execute("""
                UPDATE attributed_clusters
                SET category = ?, cex_role = ?, exchange_name = ?, entity_label = ?, attribution_rule = ?,
                    confidence = ?, evidence_tx_hash = ?, last_confirmed_utc = ?, provenance = ?,
                    risk_score = COALESCE(?, risk_score), risk_mode = COALESCE(?, risk_mode),
                    is_sanctioned = MAX(?, is_sanctioned), sanctions_details = COALESCE(?, sanctions_details),
                    precomputed_utc = COALESCE(precomputed_utc, ?)
                WHERE address = ?
            """, (category, cex_role, exchange_name, entity_label, attribution_rule, confidence,
                  evidence_tx_hash, now, effective_provenance,
                  risk_score, risk_mode, is_sanctioned, sanctions_details, now if risk_score is not None else None,
                  address))
        else:
            conn.execute("UPDATE attributed_clusters SET last_confirmed_utc = ? WHERE address = ?", (now, address))


def precompute_and_store_risk(
    address: str,
    chain: str,
    risk_score: int,
    risk_mode: str,
    is_sanctioned: bool = False,
    sanctions_details: Optional[str] = None,
    category: str = "unknown",
    entity_label: Optional[str] = None,
) -> bool:
    """Stores precomputed risk score at ingestion time so it is never calculated lazily."""
    now = int(time.time())
    with _conn() as conn:
        existing = conn.execute("SELECT address FROM attributed_clusters WHERE address = ?", (address,)).fetchone()
        if existing:
            conn.execute("""
                UPDATE attributed_clusters
                SET risk_score = ?, risk_mode = ?, is_sanctioned = ?, sanctions_details = ?,
                    precomputed_utc = ?, category = CASE WHEN ? != 'unknown' THEN ? ELSE category END,
                    entity_label = COALESCE(?, entity_label)
                WHERE address = ?
            """, (risk_score, risk_mode, 1 if is_sanctioned else 0, sanctions_details, now, category, category, entity_label, address))
        else:
            provenance_val = 'offchain_verified' if is_sanctioned else 'automated_clustering'
            conn.execute("""
                INSERT INTO attributed_clusters
                (address, chain, category, entity_label, attribution_rule, confidence,
                 first_seen_utc, last_confirmed_utc, provenance, risk_score, risk_mode,
                 is_sanctioned, sanctions_details, precomputed_utc)
                VALUES (?, ?, ?, ?, 'ingestion_precompute', 1.0, ?, ?, ?,
                        ?, ?, ?, ?, ?)
            """, (address, chain, category, entity_label, now, now, provenance_val,
                  risk_score, risk_mode, 1 if is_sanctioned else 0, sanctions_details, now))
    return True


def flag_sanctioned_at_ingestion(
    address: str,
    chain: str,
    entity_name: str,
    authority: str,
    program: str,
    category: str = "sanctioned",
    details: Optional[str] = None,
) -> bool:
    """Pre-computes and flags a sanctioned match at ingestion time with critical 100/100 score."""
    sanctions_json = json.dumps({
        "entity_name": entity_name,
        "authority": authority,
        "program": program,
        "category": category,
        "details": details or ""
    })
    return precompute_and_store_risk(
        address=address,
        chain=chain,
        risk_score=100,
        risk_mode="static_entity",
        is_sanctioned=True,
        sanctions_details=sanctions_json,
        category=category,
        entity_label=f"[{entity_name}]",
    )


def lookup_attribution(address: str) -> Optional[dict]:
    with _conn() as conn:
        row = conn.execute("""
            SELECT chain, category, cex_role, exchange_name, entity_label,
                   attribution_rule, confidence, evidence_tx_hash, provenance,
                   risk_score, risk_mode, is_sanctioned, sanctions_details, precomputed_utc
            FROM attributed_clusters WHERE address = ?
        """, (address,)).fetchone()
    if not row:
        return None
    keys = [
        "chain", "category", "cex_role", "exchange_name", "entity_label",
        "attribution_rule", "confidence", "evidence_tx_hash", "provenance",
        "risk_score", "risk_mode", "is_sanctioned", "sanctions_details", "precomputed_utc"
    ]
    res = dict(zip(keys, row))
    if not res.get("provenance"):
        res["provenance"] = "automated_clustering"
    return res


def get_all_ingested_addresses() -> List[str]:
    """Returns all addresses currently tracked in the attribution store."""
    with _conn() as conn:
        rows = conn.execute("SELECT address FROM attributed_clusters").fetchall()
    return [r[0] for r in rows]


def update_provenance(address: str, provenance: str) -> bool:
    """Updates the provenance classification tag for an address, creating record if absent."""
    if provenance not in VALID_PROVENANCE:
        raise ValueError(f"Invalid provenance '{provenance}'. Must be one of {VALID_PROVENANCE}")

    now = int(time.time())
    with _conn() as conn:
        cursor = conn.execute("""
            UPDATE attributed_clusters
            SET provenance = ?, last_confirmed_utc = ?
            WHERE address = ?
        """, (provenance, now, address))
        if cursor.rowcount == 0:
            chain = "TRON" if address.startswith("T") else ("BTC" if address.startswith(("bc1", "1", "3")) else "EVM")
            conn.execute("""
                INSERT INTO attributed_clusters
                (address, chain, category, attribution_rule, confidence, first_seen_utc, last_confirmed_utc, provenance)
                VALUES (?, ?, 'unknown', 'manual_analyst_review', 1.0, ?, ?, ?)
            """, (address, chain, now, now, provenance))
        return True

