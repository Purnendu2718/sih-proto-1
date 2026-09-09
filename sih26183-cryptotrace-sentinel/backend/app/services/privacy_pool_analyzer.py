"""
privacy_pool_analyzer.py - Mixer Protocol Registry and Tornado-Cash-Style Forensic Analyzer.
Conforms to Section 13 (Mixer Detection) and Section 16 (Tornado-Cash-Style Analysis).
Parses deposits, withdrawals, relayers, and computes statistical candidate linkage without naive FIFO assumptions.
"""

from typing import List, Dict, Any, Optional
import time

# Known Institutional Privacy Protocol Registry
PRIVACY_PROTOCOL_REGISTRY = {
    "0x12d66f87a04a9e220743712ce6d9bb1b5616b8fc": {
        "protocol": "Tornado Cash",
        "chain": "ETH",
        "denomination": "0.1 ETH",
        "pool_type": "Fixed-Denomination ZK-SNARK Privacy Pool",
    },
    "0x47ce0c6ed5b0ce3d3a51fdb1c52dc66a7c3c2936": {
        "protocol": "Tornado Cash",
        "chain": "ETH",
        "denomination": "1 ETH",
        "pool_type": "Fixed-Denomination ZK-SNARK Privacy Pool",
    },
    "0x910cbd523d972eb0a6f4cae4618ad62622b39dbf": {
        "protocol": "Tornado Cash",
        "chain": "ETH",
        "denomination": "10 ETH",
        "pool_type": "Fixed-Denomination ZK-SNARK Privacy Pool",
    },
    "0x38dd66579b986cf16a041f92e591b92015091c6e": {
        "protocol": "Tornado Cash (USDT)",
        "chain": "ETH",
        "denomination": "1,000 USDT",
        "pool_type": "Fixed-Denomination ZK-SNARK Privacy Pool",
    },
    "0x0000000000000000000000000000000000000000": {
        "protocol": "Railgun",
        "chain": "ETH",
        "denomination": "Arbitrary",
        "pool_type": "Smart-Contract Privacy Pool",
    },
}


def check_privacy_protocol_interaction(address: str) -> Optional[Dict[str, Any]]:
    """Check if address is a known privacy pool or mixer contract."""
    addr = (address or "").lower()
    return PRIVACY_PROTOCOL_REGISTRY.get(addr)


def analyze_tornado_pool_events(
    deposit_events: List[Dict[str, Any]],
    withdrawal_events: List[Dict[str, Any]],
    suspect_deposit_address: Optional[str] = None
) -> Dict[str, Any]:
    """
    Statistical Candidate Ranking for Tornado Cash-style pools.
    Evaluates temporal proximity, relayer usage, and operational address linkages.
    Does NOT assert deterministic deanonymization; returns candidate likelihood distribution.
    """
    candidate_links = []

    for dep in deposit_events:
        dep_ts = dep.get("timestamp_utc") or dep.get("ts") or dep.get("timestamp") or 0
        dep_sender = dep.get("from") or dep.get("sender") or ""
        commitment = dep.get("commitment", "0x" + "0" * 64)

        if suspect_deposit_address and dep_sender.lower() != suspect_deposit_address.lower():
            continue

        for wdr in withdrawal_events:
            wdr_ts = wdr.get("timestamp_utc") or wdr.get("ts") or wdr.get("timestamp") or 0
            if wdr_ts < dep_ts:
                continue  # Withdrawal cannot precede deposit

            delta_seconds = wdr_ts - dep_ts
            recipient = wdr.get("to", wdr.get("recipient", ""))
            relayer = wdr.get("relayer", None)

            # Heuristic scoring components
            score = 0.35
            evidence_points = [f"Deposit-to-withdrawal delta: {round(delta_seconds / 3600, 1)} hours."]

            # Temporal heuristic: most laundering withdrawals occur within 1 to 48 hours of deposit
            if 3600 <= delta_seconds <= 172800:
                score += 0.25
                evidence_points.append("Withdrawal timing falls within high-probability 48-hour velocity window.")
            elif delta_seconds < 3600:
                score += 0.15
                evidence_points.append("Immediate sub-1hr withdrawal.")

            # Operational linkage check: gas funder or relayer overlap
            if relayer and wdr.get("gas_funder") == dep_sender:
                score += 0.30
                evidence_points.append("Direct operational gas-funding link detected between depositor and relayer.")

            confidence = min(round(score, 2), 0.88)

            candidate_links.append({
                "deposit_address": dep_sender,
                "deposit_tx": dep.get("tx_hash", dep.get("tx", "")),
                "deposit_timestamp_utc": dep_ts,
                "withdrawal_recipient": recipient,
                "withdrawal_tx": wdr.get("tx_hash", wdr.get("tx", "")),
                "withdrawal_timestamp_utc": wdr_ts,
                "relayer": relayer,
                "time_delta_hours": round(delta_seconds / 3600, 2),
                "confidence": confidence,
                "evidence": evidence_points,
            })

    # Sort candidates by confidence
    candidate_links.sort(key=lambda x: x["confidence"], reverse=True)

    top_candidate = candidate_links[0] if candidate_links else None

    return {
        "protocol": "Tornado Cash (ZK-SNARK Pool)",
        "analyzed_deposits": len(deposit_events),
        "analyzed_withdrawals": len(withdrawal_events),
        "candidate_matches_count": len(candidate_links),
        "top_candidate": top_candidate,
        "alternative_candidates": candidate_links[1:6] if len(candidate_links) > 1 else [],
        "deanonymization_status": "PROBABILISTIC_CANDIDATE_LINKAGE",
        "warning": (
            "Cryptographic Zero-Knowledge proof prevents deterministic on-chain linkage. "
            "Linkages are statistical heuristics based on timing and operational metadata."
        ),
    }


class PrivacyPoolAnalyzer:
    def rank_withdrawal_candidates(self, deposit: Dict[str, Any], withdrawals: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        res = analyze_tornado_pool_events([deposit], withdrawals)
        candidates = []
        if res.get("top_candidate"):
            candidates.append(res["top_candidate"])
        candidates.extend(res.get("alternative_candidates", []))
        
        output = []
        for c in candidates:
            output.append({
                "recipient": c["withdrawal_recipient"],
                "temporal_similarity": 1.0 / (1.0 + c["time_delta_hours"]),
                "confidence": c["confidence"],
                "evidence": c["evidence"],
                "limitations": [
                    "ZK-SNARK commitments prevent deterministic identification.",
                    "Candidate linkage is statistical heuristic."
                ]
            })
        return output

