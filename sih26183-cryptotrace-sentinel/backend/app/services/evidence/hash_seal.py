"""
hash_seal.py - Cryptographic audit sealer and verification engine.
Fulfills Section 63 of Bharatiya Sakshya Adhiniyam, 2023 (BSA).

Captures raw RPC responses, block heights, and network timestamps at ingestion time
into an RFC 8785 canonical JSON bitstream with SHA-256 integrity verification.
"""

import json
import hashlib
import datetime
from dataclasses import dataclass, field, asdict
from typing import Dict, Any, List, Optional, Union


def canonical_json_bytes(obj: Any) -> bytes:
    """
    Produces deterministic RFC 8785 canonical JSON bytes:
    - Sorted dictionary keys
    - Compact separators without whitespace (',', ':')
    - Consistent UTF-8 encoding
    """
    canonical_str = json.dumps(
        obj,
        sort_keys=True,
        ensure_ascii=False,
        separators=(",", ":"),
        default=str,
    )
    return canonical_str.encode("utf-8")


def canonical_hash(obj: Any) -> str:
    """Computes SHA-256 hex digest of RFC 8785 canonical JSON representation."""
    return hashlib.sha256(canonical_json_bytes(obj)).hexdigest()


@dataclass
class SealedEvidence:
    """
    Immutable cryptographic evidence container sealed at blockchain ingestion time.
    """
    evidence_digest_sha256: str
    canonical_payload: Dict[str, Any]
    statutory_seal: str
    capture_timestamp_utc: str
    chain: str
    queried_address: str
    raw_transaction_count: int
    metadata: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "evidence_digest_sha256": self.evidence_digest_sha256,
            "canonical_payload": self.canonical_payload,
            "statutory_seal": self.statutory_seal,
            "capture_timestamp_utc": self.capture_timestamp_utc,
            "chain": self.chain,
            "queried_address": self.queried_address,
            "raw_transaction_count": self.raw_transaction_count,
            "metadata": self.metadata,
        }


def seal_evidence(
    chain: str,
    queried_address: str,
    raw_payload: Any,
    metadata: Optional[Dict[str, Any]] = None,
    capture_timestamp_utc: Optional[str] = None,
) -> SealedEvidence:
    """
    Captures and seals raw RPC responses at ingestion time with a SHA-256 digest.
    This fulfills Section 63 of Bharatiya Sakshya Adhiniyam, 2023 (BSA) requirements
    by preserving the original unaltered bitstream from the node/explorer.
    """
    ts = (
        capture_timestamp_utc
        or datetime.datetime.now(datetime.timezone.utc).isoformat()
    )

    count = len(raw_payload) if isinstance(raw_payload, list) else (1 if raw_payload else 0)

    canonical_payload = {
        "statute": "Section 63, Bharatiya Sakshya Adhiniyam, 2023 (BSA)",
        "chain": chain.upper(),
        "queried_address": (queried_address or "").strip(),
        "capture_timestamp_utc": ts,
        "raw_transaction_count": count,
        "metadata": metadata or {},
        "raw_payload": raw_payload,
    }

    digest = canonical_hash(canonical_payload)
    statutory_seal = f"SEC63-BSA-2023:{digest.upper()}"

    return SealedEvidence(
        evidence_digest_sha256=digest,
        canonical_payload=canonical_payload,
        statutory_seal=statutory_seal,
        capture_timestamp_utc=ts,
        chain=chain.upper(),
        queried_address=queried_address,
        raw_transaction_count=count,
        metadata=metadata or {},
    )


def verify_seal(sealed: Union[SealedEvidence, Dict[str, Any]]) -> bool:
    """
    Verifies that the canonical payload has not been modified since ingestion.
    Re-computes the SHA-256 digest over the canonical payload and verifies equality.
    Returns True if valid, False if tampered or corrupt.
    """
    if isinstance(sealed, SealedEvidence):
        expected_digest = sealed.evidence_digest_sha256
        payload = sealed.canonical_payload
    elif isinstance(sealed, dict):
        expected_digest = sealed.get("evidence_digest_sha256", "")
        payload = sealed.get("canonical_payload")
    else:
        return False

    if not expected_digest or payload is None:
        return False

    computed = canonical_hash(payload)
    return computed.lower() == expected_digest.lower()
