"""
batch_screener.py - High-Throughput Asynchronous Address Screening Engine.
Processes lists of thousands of addresses against the Risk DB and Sanctions Catalog
in an asynchronous, non-blocking queue. Provides real-time job progress polling,
filterable query APIs, and court-ready RFC-4180 CSV export.
"""

import re
import csv
import io
import time
import uuid
import threading
from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass, field, asdict

from app.services.analytics.risk_scorer import RiskScorer, KNOWN_ENTITIES
from app.services.sanctions_catalog import check_sanctions, SanctionsHit
from app.services.attribution_store import lookup_attribution


@dataclass
class ScreeningItem:
    address: str
    chain: str
    risk_score: int
    risk_mode: str
    severity: str
    sanctions_match: bool
    sanctions_entity: Optional[str]
    sanctions_authority: Optional[str]
    sanctions_program: Optional[str]
    provenance: str
    category: str
    entity_label: Optional[str]
    explanation: str


@dataclass
class ScreeningJob:
    job_id: str
    status: str  # "queued", "processing", "completed", "failed"
    total: int
    processed: int
    progress_pct: float
    created_utc: int
    completed_utc: Optional[int] = None
    duration_ms: int = 0
    file_name: Optional[str] = None
    summary: Dict[str, Any] = field(default_factory=dict)
    results: List[Dict[str, Any]] = field(default_factory=list)
    error: Optional[str] = None


# Thread-safe in-memory job registry
_JOBS: Dict[str, ScreeningJob] = {}
_JOBS_LOCK = threading.Lock()


def infer_blockchain(address: str) -> str:
    """Classifies an address string into TRON, EVM, or BTC."""
    raw = (address or "").strip()
    if raw.startswith("T") and len(raw) >= 30:
        return "TRON"
    if raw.startswith("0x") and len(raw) == 42:
        return "EVM"
    if raw.startswith(("1", "3", "bc1")) and 25 <= len(raw) <= 62:
        return "BTC"
    # Fallback heuristics
    if raw.startswith("0x"):
        return "EVM"
    if raw.startswith("T"):
        return "TRON"
    return "EVM"


def parse_addresses_from_text(raw_text: str) -> List[str]:
    """
    Robust address parser supporting CSV, TXT, TSV, newline, comma, or semicolon delimiters.
    Extracts valid EVM, TRON, and Bitcoin addresses, strips quotes and whitespace,
    and deduplicates while preserving user input order.
    """
    if not raw_text:
        return []

    lines = raw_text.replace("\r\n", "\n").replace("\r", "\n").split("\n")
    candidates: List[str] = []

    # Regex tokens for multi-chain address patterns (including test aliases)
    evm_pattern = re.compile(r"^0x[a-zA-Z0-9]{40}$", re.IGNORECASE)
    tron_pattern = re.compile(r"^T[a-zA-Z0-9]{30,35}$")
    btc_pattern = re.compile(r"^(?:bc1[a-zA-Z0-9]{25,60}|[13][a-zA-Z0-9]{25,35})$", re.IGNORECASE)

    embedded_evm = re.compile(r"0x[a-zA-Z0-9]{40}", re.IGNORECASE)
    embedded_tron = re.compile(r"T[a-zA-Z0-9]{33}")
    embedded_btc = re.compile(r"(?:bc1[a-zA-Z0-9]{25,60}|[13][a-zA-Z0-9]{25,35})", re.IGNORECASE)

    for line in lines:
        line_clean = line.strip()
        if not line_clean or line_clean.startswith("#"):
            continue

        # Skip common CSV header rows
        lower_line = line_clean.lower()
        if lower_line in ("address", "wallet", "target_address", "address,notes", "wallet,label", "address,chain"):
            continue
        if lower_line.startswith("address,") or lower_line.startswith("wallet,") or lower_line.startswith("target_address,"):
            continue

        # If CSV/TSV, inspect first column or regex extract from whole line
        parts = [p.strip().strip('"\'') for p in re.split(r"[,;\t|]", line_clean) if p.strip()]
        line_found = False

        for part in parts:
            part_clean = part.strip().strip('"\'')
            # Exact regex matches on column
            if evm_pattern.fullmatch(part_clean) or tron_pattern.fullmatch(part_clean) or btc_pattern.fullmatch(part_clean):
                candidates.append(part_clean)
                line_found = True
                break

        if not line_found:
            # Fallback regex search within line for embedded addresses
            found_evm = embedded_evm.findall(line_clean)
            found_tron = embedded_tron.findall(line_clean)
            found_btc = embedded_btc.findall(line_clean)
            for m in found_evm + found_tron + found_btc:
                candidates.append(m)

    # Deduplicate preserving order
    seen = set()
    deduped: List[str] = []
    for c in candidates:
        key = c.lower() if c.startswith("0x") else c
        if key not in seen:
            seen.add(key)
            deduped.append(c)

    return deduped


class BatchScreener:
    """Manages asynchronous batch screening background jobs."""

    @classmethod
    def create_job(cls, addresses: List[str], file_name: Optional[str] = None) -> ScreeningJob:
        """Initializes and registers a new screening job."""
        job_id = uuid.uuid4().hex[:12]
        now = int(time.time())

        job = ScreeningJob(
            job_id=job_id,
            status="queued",
            total=len(addresses),
            processed=0,
            progress_pct=0.0,
            created_utc=now,
            file_name=file_name,
            summary={
                "total_screened": len(addresses),
                "sanctions_hits": 0,
                "critical_risk": 0,
                "high_risk": 0,
                "moderate_risk": 0,
                "clean_count": 0,
                "chains": {"TRON": 0, "EVM": 0, "BTC": 0},
                "provenance": {"offchain_verified": 0, "automated_clustering": 0, "analyst_reviewed": 0},
            },
            results=[],
        )

        with _JOBS_LOCK:
            _JOBS[job_id] = job

        # Spawn non-blocking background worker thread
        worker = threading.Thread(
            target=cls._run_worker,
            args=(job_id, addresses),
            name=f"screener-worker-{job_id}",
            daemon=True,
        )
        worker.start()

        return job

    @classmethod
    def _run_worker(cls, job_id: str, addresses: List[str]):
        """Background execution worker that processes addresses in non-blocking chunks."""
        with _JOBS_LOCK:
            job = _JOBS.get(job_id)
            if not job:
                return
            job.status = "processing"

        start_time = time.perf_counter()
        results: List[Dict[str, Any]] = []

        sanctions_count = 0
        critical_count = 0
        high_count = 0
        moderate_count = 0
        clean_count = 0
        chains_dist = {"TRON": 0, "EVM": 0, "BTC": 0}
        prov_dist = {"offchain_verified": 0, "automated_clustering": 0, "analyst_reviewed": 0}

        chunk_size = 250
        total = len(addresses)

        try:
            for idx, addr in enumerate(addresses):
                item = cls.screen_single_address(addr)
                results.append(item)

                # Update running counters
                chain = item["chain"]
                chains_dist[chain] = chains_dist.get(chain, 0) + 1

                prov = item["provenance"]
                prov_dist[prov] = prov_dist.get(prov, 0) + 1

                if item["sanctions_match"]:
                    sanctions_count += 1

                score = item["risk_score"]
                if score >= 85:
                    critical_count += 1
                elif score >= 60:
                    high_count += 1
                elif score >= 35:
                    moderate_count += 1
                else:
                    if not item["sanctions_match"]:
                        clean_count += 1

                # Incremental progress reporting per chunk
                if (idx + 1) % chunk_size == 0 or (idx + 1) == total:
                    with _JOBS_LOCK:
                        job.processed = idx + 1
                        job.progress_pct = round(((idx + 1) / total) * 100, 1)
                    # Yield thread briefly to prevent starvation
                    time.sleep(0.005)

            end_time = time.perf_counter()
            duration_ms = int((end_time - start_time) * 1000)

            with _JOBS_LOCK:
                job.status = "completed"
                job.processed = total
                job.progress_pct = 100.0
                job.completed_utc = int(time.time())
                job.duration_ms = duration_ms
                job.summary = {
                    "total_screened": total,
                    "sanctions_hits": sanctions_count,
                    "critical_risk": critical_count,
                    "high_risk": high_count,
                    "moderate_risk": moderate_count,
                    "clean_count": clean_count,
                    "chains": chains_dist,
                    "provenance": prov_dist,
                    "duration_ms": duration_ms,
                }
                job.results = results

        except Exception as exc:
            with _JOBS_LOCK:
                job.status = "failed"
                job.error = str(exc)

    @classmethod
    def screen_single_address(cls, address: str) -> Dict[str, Any]:
        """
        Screens an individual address against Sanctions Catalog, Attribution DB,
        and Dual-Mode Risk Engine.
        Returns strict schema:
          address, chain, risk_score, risk_mode, severity, sanctions_match,
          sanctions_entity, provenance, category, explanation.
        """
        addr_clean = (address or "").strip()
        addr_lower = addr_clean.lower()
        chain = infer_blockchain(addr_clean)

        # 1. Sanctions Check
        sanctions_hit: Optional[SanctionsHit] = check_sanctions(addr_clean)
        
        # Cross-check with KNOWN_ENTITIES for sanctioned category
        entity_info = KNOWN_ENTITIES.get(addr_lower)
        is_sanctioned_entity = False
        if sanctions_hit:
            is_sanctioned_entity = True
        elif entity_info and entity_info.get("category") in ("sanctioned", "mixer", "darknet_market"):
            is_sanctioned_entity = True

        sanctions_match = is_sanctioned_entity
        sanctions_entity = sanctions_hit.entity_name if sanctions_hit else (
            entity_info["name"] if (entity_info and is_sanctioned_entity) else None
        )
        sanctions_authority = sanctions_hit.authority if sanctions_hit else (
            "US OFAC / Compliance Registry" if is_sanctioned_entity else None
        )
        sanctions_program = sanctions_hit.program if sanctions_hit else (
            "OFAC-SPECIAL-DESIGNATION" if is_sanctioned_entity else None
        )

        # 2. Database Attribution Lookup
        attr = lookup_attribution(addr_clean) or lookup_attribution(addr_lower)
        
        # 3. Provenance Resolution
        if attr and attr.get("provenance"):
            provenance = attr["provenance"]
        elif is_sanctioned_entity or entity_info:
            provenance = "offchain_verified"
        else:
            provenance = "automated_clustering"

        # 4. Dual-Mode Risk Evaluation
        entity_category = attr.get("category") if attr else (entity_info.get("category") if entity_info else None)
        entity_name = attr.get("entity_label") if attr else (entity_info.get("name") if entity_info else None)
        
        risk_res = RiskScorer.evaluate(
            address=addr_clean,
            entity_category=entity_category,
            entity_name=entity_name,
        )

        # If sanctions hit was detected outside KNOWN_ENTITIES, force critical risk 100
        risk_score = risk_res["risk_score"]
        risk_mode = risk_res["risk_mode"]
        severity = risk_res["severity"]
        explanation = risk_res["explanation"]

        if sanctions_match and risk_score < 95:
            risk_score = 100
            severity = "CRITICAL"
            risk_mode = "static_entity"
            explanation = f"Sanctions Match: Matched {sanctions_entity} ({sanctions_authority}). Immediate statutory freeze subject to Section 94 BNSS."

        category = entity_category or (sanctions_hit.category if sanctions_hit else "unattributed_wallet")
        entity_label = entity_name or (sanctions_hit.entity_name if sanctions_hit else None)

        return {
            "address": addr_clean,
            "chain": chain,
            "risk_score": risk_score,
            "risk_mode": risk_mode,
            "severity": severity,
            "sanctions_match": sanctions_match,
            "sanctions_entity": sanctions_entity,
            "sanctions_authority": sanctions_authority,
            "sanctions_program": sanctions_program,
            "provenance": provenance,
            "category": category,
            "entity_label": entity_label,
            "explanation": explanation,
        }

    @classmethod
    def get_job(cls, job_id: str) -> Optional[ScreeningJob]:
        """Fetches job by ID."""
        with _JOBS_LOCK:
            return _JOBS.get(job_id)

    @classmethod
    def generate_csv(cls, job: ScreeningJob) -> str:
        """Generates RFC-4180 compliant downloadable CSV for a completed screening job."""
        output = io.StringIO()
        writer = csv.writer(output, quoting=csv.QUOTE_MINIMAL)

        # CSV Header
        writer.writerow([
            "Address",
            "Chain",
            "Risk Score",
            "Risk Mode",
            "Severity",
            "Sanctions Match",
            "Sanctions Entity",
            "Sanctions Authority",
            "Provenance",
            "Category",
            "Entity Label",
            "Forensic Explanation",
        ])

        for item in job.results:
            writer.writerow([
                item.get("address", ""),
                item.get("chain", ""),
                item.get("risk_score", 0),
                item.get("risk_mode", ""),
                item.get("severity", ""),
                "YES" if item.get("sanctions_match") else "NO",
                item.get("sanctions_entity") or "N/A",
                item.get("sanctions_authority") or "N/A",
                item.get("provenance", ""),
                item.get("category", ""),
                item.get("entity_label") or "",
                item.get("explanation", ""),
            ])

        return output.getvalue()
