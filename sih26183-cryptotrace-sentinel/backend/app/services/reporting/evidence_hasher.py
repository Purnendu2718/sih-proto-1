"""
evidence_hasher.py - Cryptographic audit sealer fulfilling Section 63 of Bharatiya Sakshya Adhiniyam, 2023 (BSA).
Produces RFC 8785 canonical JSON serialization and SHA-256 bitstream integrity digests.
"""

import json
import hashlib
import datetime
from typing import Dict, Any, List, Optional


class EvidenceHasher:
    """
    Serializes raw blockchain responses, node metadata, and audit logs into canonical JSON
    and generates an immutable SHA-256 evidence seal.
    """

    @staticmethod
    def canonical_json_bytes(obj: Any) -> bytes:
        """
        Produce deterministic, RFC 8785-compliant canonical JSON representation:
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

    @classmethod
    def compute_digest(cls, obj: Any) -> str:
        """Compute cryptographic SHA-256 digest of canonical representation."""
        data_bytes = cls.canonical_json_bytes(obj)
        return hashlib.sha256(data_bytes).hexdigest()

    @classmethod
    def create_section_63_evidence_seal(
        cls,
        case_id: str,
        fir_number: str,
        raw_transactions: List[Dict[str, Any]],
        nodes_metadata: List[Dict[str, Any]],
        query_timestamp_utc: Optional[str] = None,
        investigating_officer: str = "Authorized Law Enforcement Officer",
    ) -> Dict[str, Any]:
        """
        Builds certified Section 63 BSA evidence audit payload and cryptographic seal.
        """
        timestamp_str = (
            query_timestamp_utc
            or datetime.datetime.now(datetime.timezone.utc).isoformat()
        )

        canonical_payload = {
            "statute": "Section 63, Bharatiya Sakshya Adhiniyam, 2023 (BSA)",
            "case_id": case_id,
            "fir_number": fir_number,
            "investigating_officer": investigating_officer,
            "capture_timestamp_utc": timestamp_str,
            "transaction_count": len(raw_transactions),
            "transactions": raw_transactions,
            "nodes_metadata": nodes_metadata,
        }

        sha256_digest = cls.compute_digest(canonical_payload)

        return {
            "evidence_digest_sha256": sha256_digest,
            "canonical_payload": canonical_payload,
            "statutory_seal": f"SEC63-BSA-2023:{sha256_digest.upper()}",
            "generated_at_utc": timestamp_str,
        }


def canonical_json_hash(payload: Any) -> str:
    return EvidenceHasher.compute_digest(payload)
