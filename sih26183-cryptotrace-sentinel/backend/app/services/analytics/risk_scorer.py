"""
risk_scorer.py - Explainable fraud typology risk scoring engine (0 to 100).
Evaluates transfer velocity, mixer interactions, peeling patterns, and hop distance to CEX.
Every score includes an itemized breakdown of triggered heuristic rules and confidence percentages.
Strictly adheres to forensic transparency: zero black-box scoring models.
"""

from typing import Dict, Any, List, Optional
from app.core.constants import KNOWN_MIXERS, RISK_WEIGHTS


class RiskScorer:
    """Computes fraud risk scores based on explainable behavioural heuristics and on-chain topology."""

    @classmethod
    def score_address(
        cls,
        address: str,
        fan_in: int = 1,
        fan_out: int = 1,
        is_peeling: bool = False,
        velocity_mins: int = 60,
        hop_distance_to_exchange: Optional[int] = None,
        is_victim: bool = False,
        is_hot_wallet: bool = False,
        is_deposit_wallet: bool = False,
        touched_mixer: bool = False,
    ) -> Dict[str, Any]:
        """
        Compute explainable risk score (0 to 100), rule itemization, and confidence percentages.
        """
        rules: List[Dict[str, Any]] = []
        breakdown: Dict[str, int] = {}

        # 1. Complainant Victim Origin
        if is_victim:
            rules.append({
                "rule_id": "COMPLAINANT_VICTIM_ORIGIN",
                "rule_name": "Reported Victim Wallet",
                "description": "Complainant wallet identified in FIR as source of stolen funds.",
                "points": 10,
                "confidence": 1.0,
            })
            return {
                "score": 10,
                "severity": "LOW",
                "breakdown": {"victim_origin": 10},
                "rules": rules,
                "explanation": "Complainant victim wallet: Verified fund source without laundering liability.",
            }

        # 2. Terminal CEX Omnibus Hot Wallet
        if is_hot_wallet:
            rules.append({
                "rule_id": "CEX_HOT_WALLET_TERMINAL",
                "rule_name": "Terminal VASP Hot Wallet",
                "description": "Centralized exchange omnibus hot wallet cluster where laundered funds consolidated.",
                "points": 85,
                "confidence": 0.99,
            })
            return {
                "score": 85,
                "severity": "CRITICAL",
                "breakdown": {"terminal_cex_hotwallet": 85},
                "rules": rules,
                "explanation": "Terminal centralized exchange hot wallet cluster: Final off-ramp consolidation.",
            }

        # 3. Suspect / Verified CEX User Deposit Wallet
        if is_deposit_wallet:
            score = 95
            breakdown["cex_deposit_account"] = 95
            rules.append({
                "rule_id": "CEX_DEPOSIT_ACCOUNT",
                "rule_name": "Verified/Suspect CEX Deposit Terminal",
                "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
                "points": 95,
                "confidence": 0.96,
            })
            return {
                "score": score,
                "severity": "CRITICAL",
                "breakdown": breakdown,
                "rules": rules,
                "explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet.",
            }

        # Intermediary Mule / Layering Conduits
        score = 20
        breakdown["baseline"] = 20
        rules.append({
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75,
        })

        # Heuristic A: Mixer / Tumbler Interaction
        addr_clean = (address or "").lower()
        if touched_mixer or addr_clean in KNOWN_MIXERS:
            penalty = RISK_WEIGHTS.get("MIXER_INTERACTION", 45)
            score += penalty
            breakdown["mixer_penalty"] = penalty
            rules.append({
                "rule_id": "MIXER_TUMBLER_INTERACTION",
                "rule_name": "Privacy Mixer Interaction",
                "description": "Direct conduit interaction with privacy tumbler protocol (e.g. Tornado Cash).",
                "points": penalty,
                "confidence": 0.98,
            })

        # Heuristic B: Peeling Chain Structuring
        if is_peeling or (fan_out >= 2 and fan_in == 1):
            penalty = RISK_WEIGHTS.get("PEELING_CHAIN", 25)
            score += penalty
            breakdown["peeling_structuring"] = penalty
            rules.append({
                "rule_id": "PEELING_CHAIN_STRUCTURING",
                "rule_name": "Peeling Chain Structuring",
                "description": "Asymmetric multi-output pattern detected (1-in, 2-out) peeling change from main fund conduit.",
                "points": penalty,
                "confidence": 0.85,
            })

        # Heuristic C: Rapid Transfer Velocity
        if velocity_mins <= 30:
            penalty = RISK_WEIGHTS.get("HIGH_VELOCITY", 20)
            score += penalty
            breakdown["rapid_velocity_sub_30min"] = penalty
            rules.append({
                "rule_id": "RAPID_VELOCITY_SUB_30MIN",
                "rule_name": "High-Velocity Mule Hop (< 30 min)",
                "description": f"Transferred funds in {velocity_mins} mins, matching automated money-mule routing signatures.",
                "points": penalty,
                "confidence": 0.90,
            })
        elif velocity_mins <= 120:
            penalty = RISK_WEIGHTS.get("HIGH_VELOCITY", 20) // 2
            score += penalty
            breakdown["velocity_sub_2hr"] = penalty
            rules.append({
                "rule_id": "RAPID_VELOCITY_SUB_2HR",
                "rule_name": "Moderate-Velocity Hop (< 2 hrs)",
                "description": f"Transferred funds in {velocity_mins} mins, indicating coordinated layering ring behavior.",
                "points": penalty,
                "confidence": 0.80,
            })

        # Heuristic D: Proximity to Centralized Exchange Off-Ramp
        if hop_distance_to_exchange is not None and hop_distance_to_exchange <= 2:
            penalty = RISK_WEIGHTS.get("OFF_RAMP_PROXIMITY", 15)
            score += penalty
            breakdown["cex_proximity_urgency"] = penalty
            rules.append({
                "rule_id": "CEX_PROXIMITY_URGENCY",
                "rule_name": "Exchange Off-Ramp Proximity (<= 2 Hops)",
                "description": f"Directly upstream of exchange deposit terminal ({hop_distance_to_exchange} hops). High flight risk.",
                "points": penalty,
                "confidence": 0.88,
            })

        final_score = min(max(score, 0), 99)

        if final_score >= 85:
            severity = "CRITICAL"
        elif final_score >= 60:
            severity = "HIGH"
        elif final_score >= 35:
            severity = "MODERATE"
        else:
            severity = "LOW"

        rule_names = [r["rule_name"] for r in rules if r["rule_id"] != "BASELINE_INTERMEDIARY"]
        explanation = (
            f"{severity} risk profile ({final_score}/100) triggered by {len(rule_names)} distinct heuristic rules: "
            f"{', '.join(rule_names) if rule_names else 'Baseline intermediary forwarding'}."
        )

        return {
            "score": final_score,
            "severity": severity,
            "breakdown": breakdown,
            "rules": rules,
            "explanation": explanation,
        }


def compute_risk_score(
    address: str,
    fan_in: int = 1,
    fan_out: int = 1,
    is_peeling: bool = False,
    velocity_mins: int = 60,
    hop_distance: Optional[int] = None,
    is_victim: bool = False,
    is_hot_wallet: bool = False,
    is_deposit_wallet: bool = False,
    touched_mixer: bool = False,
) -> Dict[str, Any]:
    return RiskScorer.score_address(
        address=address,
        fan_in=fan_in,
        fan_out=fan_out,
        is_peeling=is_peeling,
        velocity_mins=velocity_mins,
        hop_distance_to_exchange=hop_distance,
        is_victim=is_victim,
        is_hot_wallet=is_hot_wallet,
        is_deposit_wallet=is_deposit_wallet,
        touched_mixer=touched_mixer,
    )
