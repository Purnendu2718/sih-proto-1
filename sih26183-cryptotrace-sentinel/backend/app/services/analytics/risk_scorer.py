"""
risk_scorer.py - Dual-Mode Fraud Typology Risk Scoring Engine.
Strictly segregates risk scoring into two non-blended evaluation modes:
  1. 'static_entity': For known/attributed entities (regulated exchanges, mixers,
     darknet markets, sanctioned entities, deposit terminals, victim wallets),
     assigns a static base score from a maintained entity catalog.
  2. 'dynamic_behavioral': For unattributed wallets, dynamically computes a score
     from verified behavioral signals (mixer interaction, rapid fan-out,
     sanctioned-address proximity, age of first activity, and transfer velocity).

Statutory Guarantee: Stored and returned scores ALWAYS state which mode produced
them. The engine NEVER silently blends or averages static and dynamic models.
"""

from typing import Dict, Any, List, Optional, Literal
from app.core.constants import KNOWN_MIXERS, RISK_WEIGHTS

RiskScoringMode = Literal["static_entity", "dynamic_behavioral"]

# Maintained Static Entity Catalog with Official Base Risk Scores (0 - 100)
# Regulated exchange omnibus hot wallets carry low base risk (20-25)
# Off-ramp customer deposit terminals carry 85 (statutory Section 94 BNSS freeze targets)
# Mixers, darknet markets, and OFAC-sanctioned clusters carry critical base risk (95-100)
KNOWN_ENTITIES: Dict[str, Dict[str, Any]] = {
    # 1. Mixers & Tumbler Protocols
    "0xd90e2f925da726b50c4ed8d0fb90ad053324f31b": {
        "name": "Tornado Cash: ETH Router",
        "category": "mixer",
        "base_score": 100,
        "severity": "CRITICAL",
        "jurisdiction": "Decentralized / OFAC Sanctioned",
        "description": "Smart-contract privacy pool router sanctioned by US OFAC.",
    },
    "0x12d66f87a04a9e220743712ce6d9bb1b5616b8fc": {
        "name": "Tornado Cash: 0.1 ETH Pool",
        "category": "mixer",
        "base_score": 100,
        "severity": "CRITICAL",
        "jurisdiction": "Decentralized / OFAC Sanctioned",
        "description": "Tornado Cash fixed-denomination anonymity pool contract.",
    },
    "0x47ce0c6ed5b0ce3d3a51fdb1c52dc66a7c3c2936": {
        "name": "Tornado Cash: 1 ETH Pool",
        "category": "mixer",
        "base_score": 100,
        "severity": "CRITICAL",
        "jurisdiction": "Decentralized / OFAC Sanctioned",
        "description": "Tornado Cash fixed-denomination anonymity pool contract.",
    },
    "0x910cbd523d972eb0a6f4cae4618ad62622b39dbf": {
        "name": "Tornado Cash: 10 ETH Pool",
        "category": "mixer",
        "base_score": 100,
        "severity": "CRITICAL",
        "jurisdiction": "Decentralized / OFAC Sanctioned",
        "description": "Tornado Cash fixed-denomination anonymity pool contract.",
    },
    "0xa160cdab22496093275589bc33907d35615d19fe": {
        "name": "Tornado Cash: 100 ETH Pool",
        "category": "mixer",
        "base_score": 100,
        "severity": "CRITICAL",
        "jurisdiction": "Decentralized / OFAC Sanctioned",
        "description": "Tornado Cash large-denomination anonymity pool contract.",
    },
    "0xblender0000000000000000000000000000000001": {
        "name": "Blender.io Mixer Core",
        "category": "mixer",
        "base_score": 100,
        "severity": "CRITICAL",
        "jurisdiction": "Sanctioned Mixer",
        "description": "Lazarus-linked custodial cryptocurrency mixer.",
    },
    "0xsinbad00000000000000000000000000000000001": {
        "name": "Sinbad.io Mixer Core",
        "category": "mixer",
        "base_score": 100,
        "severity": "CRITICAL",
        "jurisdiction": "Sanctioned Mixer",
        "description": "Successor custodial mixer for Blender.io sanctioned by OFAC.",
    },

    # 2. Darknet Markets & Illicit Services
    "0xhydramarket00000000000000000000000000001": {
        "name": "Hydra Market Settlement Cluster",
        "category": "darknet_market",
        "base_score": 98,
        "severity": "CRITICAL",
        "jurisdiction": "Darknet / Russian Federation",
        "description": "Seized Russian darknet marketplace payment aggregation wallet.",
    },
    "1silkroad00000000000000000000000000001": {
        "name": "Silk Road Seized Entity",
        "category": "darknet_market",
        "base_score": 98,
        "severity": "CRITICAL",
        "jurisdiction": "Darknet / Seized",
        "description": "Historical darknet market escrow wallet.",
    },
    "0xgenesis0000000000000000000000000000000001": {
        "name": "Genesis Market Credentials Bazaar",
        "category": "darknet_market",
        "base_score": 98,
        "severity": "CRITICAL",
        "jurisdiction": "Darknet / Seized by FBI",
        "description": "Account credential trafficking darknet service cluster.",
    },

    # 3. OFAC Sanctioned Entities & Threat Actor Clusters
    "0xlazarus0000000000000000000000000000000001": {
        "name": "Lazarus Group (DPRK Reconnaissance General Bureau)",
        "category": "sanctioned",
        "base_score": 100,
        "severity": "CRITICAL",
        "jurisdiction": "OFAC SDN Listed / North Korea",
        "description": "State-sponsored cyber-espionage and cyber-theft syndicate.",
    },
    "0xgarantex000000000000000000000000000000001": {
        "name": "Garantex Europe / Moscow",
        "category": "sanctioned",
        "base_score": 95,
        "severity": "CRITICAL",
        "jurisdiction": "OFAC Sanctioned / Russia",
        "description": "Sanctioned OTC exchange facilitating illicit ransomware flows.",
    },

    # 4. Regulated Exchanges - Omnibus Hot Wallets (Verified Infrastructure)
    "0x71c3fb9904d3e33e9d8f8e02d847b74f38e63021": {
        "name": "CoinDCX: Main Hot Wallet",
        "category": "exchange_hotwallet",
        "base_score": 25,
        "severity": "LOW",
        "jurisdiction": "India (FIU-IND Registered)",
        "description": "Neblio Technologies omnibus hot wallet infrastructure.",
    },
    "tydzsyuepvnymqk4zgp9swwcted2miatw6": {
        "name": "CoinDCX: TRON Hot Wallet",
        "category": "exchange_hotwallet",
        "base_score": 25,
        "severity": "LOW",
        "jurisdiction": "India (FIU-IND Registered)",
        "description": "CoinDCX registered TRON omnibus disbursement address.",
    },
    "tcoindcxhotwallet01xxxxxxxxxxxxxxxx": {
        "name": "CoinDCX: Settlement Hot Wallet",
        "category": "exchange_hotwallet",
        "base_score": 25,
        "severity": "LOW",
        "jurisdiction": "India (FIU-IND Registered)",
        "description": "CoinDCX sovereign custodial master hot wallet.",
    },
    "0x5bf49e917d52f6c9c6bb1115383a15bb7c40d6d5": {
        "name": "WazirX: Multi-Sig Hot Wallet",
        "category": "exchange_hotwallet",
        "base_score": 25,
        "severity": "LOW",
        "jurisdiction": "India (FIU-IND Registered)",
        "description": "Zanmai Labs omnibus liquidity hot wallet.",
    },
    "0xwazirxhotwallet000000000000000000001": {
        "name": "WazirX: Hot Wallet Cluster",
        "category": "exchange_hotwallet",
        "base_score": 25,
        "severity": "LOW",
        "jurisdiction": "India (FIU-IND Registered)",
        "description": "WazirX reporting entity hot wallet.",
    },
    "0x98c3d3183c4b8a650614ad179a1a98be0a8d6b8e": {
        "name": "ZebPay: Primary Hot Wallet",
        "category": "exchange_hotwallet",
        "base_score": 25,
        "severity": "LOW",
        "jurisdiction": "India (FIU-IND Registered)",
        "description": "Awlencan Innovations omnibus operational wallet.",
    },
    "0xzebpayhotwallet00000000000000000000001": {
        "name": "ZebPay: Hot Wallet Cluster",
        "category": "exchange_hotwallet",
        "base_score": 25,
        "severity": "LOW",
        "jurisdiction": "India (FIU-IND Registered)",
        "description": "ZepBay India operational wallet cluster.",
    },
    "0x28c6c06298d514db089934071355e5743bf21d60": {
        "name": "Binance: Hot Wallet 6",
        "category": "exchange_hotwallet",
        "base_score": 25,
        "severity": "LOW",
        "jurisdiction": "Global / FIU-IND Registered",
        "description": "Binance Holdings omnibus disbursement hot wallet.",
    },
    "0xbinancehotwallet000000000000000000001": {
        "name": "Binance: Operational Hot Wallet",
        "category": "exchange_hotwallet",
        "base_score": 25,
        "severity": "LOW",
        "jurisdiction": "Global / FIU-IND Registered",
        "description": "Binance exchange operational multi-chain cluster.",
    },

    # 5. Verified/Suspect CEX Deposit Terminals (Off-Ramp Liquidation)
    "tcoindcxdeposit0001xxxxxxxxxxxxxxxx": {
        "name": "CoinDCX: Customer Deposit Terminal",
        "category": "cex_deposit",
        "base_score": 85,
        "severity": "CRITICAL",
        "jurisdiction": "India",
        "description": "User deposit account swept into master hot wallet. Target for Sec 94 BNSS freeze.",
    },
    "0xbinancedeposit0000000000000000000001": {
        "name": "Binance: User Deposit Terminal",
        "category": "cex_deposit",
        "base_score": 85,
        "severity": "CRITICAL",
        "jurisdiction": "International",
        "description": "Custodial deposit account for suspect user off-ramp.",
    },

    # 6. Complainant Victim Origin
    "tvictim0001xxxxxxxxxxxxxxxxxxxxxxx": {
        "name": "Complainant Victim Reported Wallet",
        "category": "victim",
        "base_score": 10,
        "severity": "LOW",
        "jurisdiction": "FIR Stated",
        "description": "Victim origin address reporting cryptocurrency theft.",
    },
}

# Generic Category Base Scores for dynamically classified entities
CATEGORY_BASE_SCORES = {
    "sanctioned": 100,
    "mixer": 100,
    "darknet_market": 98,
    "scam_phishing": 90,
    "cex_deposit": 85,
    "unregulated_exchange": 70,
    "p2p_high_risk": 75,
    "exchange_hotwallet": 25,
    "exchange": 25,
    "victim": 10,
}


class RiskScorer:
    """Dual-Mode Explainable Risk Scoring Engine for Blockchain Forensics.
    Strictly segregates static entity evaluation from dynamic behavioral signals.
    """

    @classmethod
    def evaluate(
        cls,
        address: str,
        # Static entity hints
        entity_category: Optional[str] = None,
        entity_name: Optional[str] = None,
        is_victim: bool = False,
        is_hot_wallet: bool = False,
        is_deposit_wallet: bool = False,
        # Dynamic behavioral signals
        mixer_interaction: bool = False,
        rapid_fan_out: bool = False,
        fan_in: int = 1,
        fan_out: int = 1,
        is_peeling: bool = False,
        sanctioned_address_proximity: Optional[int] = None,
        sanctioned_proximity_hops: Optional[int] = None,
        age_of_first_activity_hours: Optional[float] = None,
        age_hours: Optional[float] = None,
        velocity_mins: Optional[int] = None,
        hop_distance_to_exchange: Optional[int] = None,
        historical_hops: Optional[List[Dict[str, Any]]] = None,
        incoming_txs: Optional[List[Dict[str, Any]]] = None,
        outgoing_txs: Optional[List[Dict[str, Any]]] = None,
        **kwargs,
    ) -> Dict[str, Any]:
        """
        Evaluate address risk with strict mode segregation:
        - Mode 1 ('static_entity'): Matched against cataloged or declared entities.
        - Mode 2 ('dynamic_behavioral'): Evaluated from 4 core behavioral signals:
          (a) mixer interaction, (b) rapid fan-out, (c) sanctioned proximity, (d) age of first activity.
        """
        addr_clean = (address or "").strip().lower()
        effective_sanc = sanctioned_address_proximity if sanctioned_address_proximity is not None else sanctioned_proximity_hops
        effective_age = age_of_first_activity_hours if age_of_first_activity_hours is not None else age_hours

        # =========================================================================
        # 1. MODE DETERMINATION & STATIC ENTITY EVALUATION
        # =========================================================================
        entity_info = KNOWN_ENTITIES.get(addr_clean)
        
        # Check explicit entity category overrides
        category = None
        if entity_info:
            category = entity_info["category"]
        elif is_victim or entity_category == "victim":
            category = "victim"
        elif is_hot_wallet or entity_category in ("exchange_hotwallet", "cex_hotwallet"):
            category = "exchange_hotwallet"
        elif is_deposit_wallet or entity_category in ("cex_deposit", "exchange_deposit"):
            category = "cex_deposit"
        elif entity_category and entity_category.lower() in CATEGORY_BASE_SCORES:
            category = entity_category.lower()
        elif mixer_interaction and addr_clean in KNOWN_MIXERS:
            category = "mixer"

        if category is not None:
            # ---> STATIC ENTITY MODE <---
            base_score = entity_info["base_score"] if entity_info else CATEGORY_BASE_SCORES.get(category, 50)
            ent_name = entity_name or (entity_info["name"] if entity_info else f"Declared {category.upper()}")
            ent_desc = entity_info["description"] if entity_info else f"Entity assigned static risk base score for category '{category}'."

            if base_score >= 85:
                severity = "CRITICAL"
            elif base_score >= 60:
                severity = "HIGH"
            elif base_score >= 35:
                severity = "MODERATE"
            else:
                severity = "LOW"

            rule = {
                "rule_id": f"STATIC_{category.upper()}",
                "rule_name": f"Static Entity Base: {ent_name}",
                "source": "static_entity_catalog",
                "category": category,
                "base_score": base_score,
                "confidence": 1.0,
                "description": ent_desc,
            }

            entity_match = {
                "name": ent_name,
                "category": category,
                "base_score": base_score,
                "jurisdiction": entity_info.get("jurisdiction") if entity_info else "Attributed Registry",
            }

            return {
                "address": address,
                "score": base_score,
                "risk_score": base_score,
                "scoring_mode": "static_entity",
                "risk_mode": "static_entity",
                "severity": severity,
                "breakdown": {f"static_{category}_base": base_score},
                "rules": [rule],
                "rules_applied": [rule["rule_name"]],
                "entity_info": entity_match,
                "entity_match": entity_match,
                "is_blended": False,
                "explanation": f"Static Entity Base: {ent_name} carries an established baseline risk of {base_score}/100 ({severity}) based on compliance registry status.",
            }

        # =========================================================================
        # 2. DYNAMIC BEHAVIORAL MODE (For Unattributed Wallets)
        # =========================================================================
        rules: List[Dict[str, Any]] = []
        breakdown: Dict[str, int] = {}
        score = 0
        if fan_in > 1 or fan_out > 1 or is_peeling or rapid_fan_out:
            score += 15
            breakdown["unverified_mule_baseline"] = 15
            rules.append({
                "rule_id": "BASELINE_UNVERIFIED_INTERMEDIARY",
                "rule_name": "Unverified Conduit Baseline",
                "points": 15,
                "confidence": 0.80,
                "description": "Unattributed wallet acting as intermediary conduit in the transaction web.",
            })

        # Behavioral Signal 1: Mixer Interaction
        has_mixer = bool(mixer_interaction or addr_clean in KNOWN_MIXERS)
        if has_mixer:
            penalty = 40
            score += penalty
            breakdown["mixer_interaction"] = penalty
            breakdown["mixer_interaction_penalty"] = penalty
            rules.append({
                "rule_id": "SIGNAL_MIXER_INTERACTION",
                "rule_name": "Privacy Mixer Interaction",
                "points": penalty,
                "confidence": 0.98,
                "description": "Direct or 1-hop conduit interaction with obfuscation tumbler protocol.",
            })

        # Behavioral Signal 2: Rapid Fan-Out & Peeling Structuring
        is_rapid_fan = bool(rapid_fan_out or is_peeling or (fan_out >= 2 and fan_in <= 2))
        if is_rapid_fan:
            penalty = 25
            score += penalty
            breakdown["rapid_fan_out"] = penalty
            breakdown["rapid_fan_out_penalty"] = penalty
            rules.append({
                "rule_id": "SIGNAL_RAPID_FAN_OUT",
                "rule_name": "Rapid Fan-Out / Peeling Structuring",
                "points": penalty,
                "confidence": 0.88,
                "description": "Asymmetric multi-output pattern detected distributing funds into child conduits.",
            })

        # Behavioral Signal 3: Sanctioned-Address Proximity
        if effective_sanc is not None and effective_sanc > 0:
            if effective_sanc == 1:
                penalty = 40
                breakdown["sanctioned_address_proximity"] = penalty
                breakdown["sanctioned_direct_1hop"] = penalty
                rules.append({
                    "rule_id": "SIGNAL_SANCTIONED_DIRECT_HOP",
                    "rule_name": "Direct Sanctioned Entity Proximity (1 Hop)",
                    "points": penalty,
                    "confidence": 0.95,
                    "description": "Direct transaction adjacency to OFAC-sanctioned wallet or threat actor cluster.",
                })
                score += penalty
            elif effective_sanc == 2:
                penalty = 25
                breakdown["sanctioned_address_proximity"] = penalty
                breakdown["sanctioned_adjacent_2hop"] = penalty
                rules.append({
                    "rule_id": "SIGNAL_SANCTIONED_2HOP",
                    "rule_name": "Near Sanctioned Entity Proximity (2 Hops)",
                    "points": penalty,
                    "confidence": 0.85,
                    "description": "Two-hop proximity to sanctioned address within laundering pipeline.",
                })
                score += penalty
            elif effective_sanc <= 4:
                penalty = 10
                breakdown["sanctioned_address_proximity"] = penalty
                breakdown["sanctioned_near_hops"] = penalty
                rules.append({
                    "rule_id": "SIGNAL_SANCTIONED_PERIPHERAL",
                    "rule_name": f"Peripheral Sanctioned Proximity ({effective_sanc} Hops)",
                    "points": penalty,
                    "confidence": 0.75,
                    "description": f"Transferred funds within {effective_sanc} hops of a blacklisted cluster.",
                })
                score += penalty

        # Behavioral Signal 4: Age of First On-Chain Activity (Zero-Day Detection)
        if effective_age is not None:
            if effective_age <= 24:
                penalty = 20
                breakdown["age_of_first_activity"] = penalty
                breakdown["zero_day_wallet_sub_24h"] = penalty
                rules.append({
                    "rule_id": "SIGNAL_ZERO_DAY_WALLET",
                    "rule_name": "Zero-Day Burner Wallet (< 24h old)",
                    "points": penalty,
                    "confidence": 0.92,
                    "description": f"Wallet first active {effective_age:.1f} hours ago, matching disposable burner syndicate patterns.",
                })
                score += penalty
            elif effective_age <= 168:  # 7 days
                penalty = 10
                breakdown["age_of_first_activity"] = penalty
                breakdown["fresh_wallet_sub_7d"] = penalty
                rules.append({
                    "rule_id": "SIGNAL_FRESH_WALLET_SUB_7D",
                    "rule_name": "Recently Created Wallet (< 7 days old)",
                    "points": penalty,
                    "confidence": 0.82,
                    "description": f"Wallet first active {effective_age/24:.1f} days ago, showing low historical maturity.",
                })
                score += penalty

        # Additional Velocity Signal
        if velocity_mins is not None:
            if velocity_mins <= 30:
                penalty = 20
                score += penalty
                breakdown["high_velocity_sub_30m"] = penalty
                rules.append({
                    "rule_id": "SIGNAL_HIGH_VELOCITY",
                    "rule_name": "High-Velocity Mule Routing (<= 30 mins)",
                    "points": penalty,
                    "confidence": 0.90,
                    "description": f"Relayed funds in {velocity_mins} mins, characteristic of automated layering syndicates.",
                })
            elif velocity_mins <= 120:
                penalty = 10
                score += penalty
                breakdown["velocity_sub_2hr"] = penalty
                rules.append({
                    "rule_id": "SIGNAL_MODERATE_VELOCITY",
                    "rule_name": "Elevated Velocity (<= 2 hrs)",
                    "points": penalty,
                    "confidence": 0.80,
                    "description": f"Relayed funds in {velocity_mins} mins.",
                })

        # Hop distance to CEX urgency
        if hop_distance_to_exchange is not None and hop_distance_to_exchange <= 2:
            penalty = 15
            score += penalty
            breakdown["cex_offramp_proximity"] = penalty
            rules.append({
                "rule_id": "SIGNAL_CEX_OFFRAMP_PROXIMITY",
                "rule_name": "CEX Off-Ramp Proximity (<= 2 Hops)",
                "points": penalty,
                "confidence": 0.88,
                "description": f"{hop_distance_to_exchange} hops from centralized liquidation terminal.",
            })

        final_score = min(max(score, 0), 100)

        if final_score >= 85:
            severity = "CRITICAL"
        elif final_score >= 60:
            severity = "HIGH"
        elif final_score >= 35:
            severity = "MODERATE"
        else:
            severity = "LOW"

        sig_names = [r["rule_name"] for r in rules if r["rule_id"] != "BASELINE_UNVERIFIED_INTERMEDIARY"]
        explanation = (
            f"Dynamic Behavioral Score: {final_score}/100 ({severity}) derived from {len(sig_names)} active on-chain behavioral signals: "
            f"{', '.join(sig_names) if sig_names else 'Baseline clean or unverified forwarding'}."
        )

        return {
            "address": address,
            "score": final_score,
            "risk_score": final_score,
            "scoring_mode": "dynamic_behavioral",
            "risk_mode": "dynamic_behavioral",
            "severity": severity,
            "breakdown": breakdown,
            "rules": rules,
            "rules_applied": [r.get("rule_name", r.get("rule_id", "")) for r in rules],
            "entity_match": None,
            "entity_info": None,
            "behavioral_signals": {
                "mixer_interaction": has_mixer,
                "rapid_fan_out": is_rapid_fan,
                "sanctioned_address_proximity": effective_sanc,
                "age_of_first_activity_hours": effective_age,
                "velocity_mins": velocity_mins,
                "hop_distance_to_exchange": hop_distance_to_exchange,
            },
            "is_blended": False,
            "explanation": explanation,
        }

    # Backward-compatible classmethod matching legacy signature with extended dual-mode params
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
        sanctioned_proximity: Optional[int] = None,
        age_hours: Optional[float] = None,
        entity_category: Optional[str] = None,
        rapid_fan_out: Optional[bool] = None,
        mixer_interaction: Optional[bool] = None,
        sanctioned_address_proximity: Optional[int] = None,
        age_of_first_activity_hours: Optional[float] = None,
        entity_name: Optional[str] = None,
        **kwargs,
    ) -> Dict[str, Any]:
        final_rapid = rapid_fan_out if rapid_fan_out is not None else ((fan_out >= 2 and fan_in <= 2) or is_peeling)
        final_mixer = mixer_interaction if mixer_interaction is not None else touched_mixer
        final_sanc = sanctioned_address_proximity if sanctioned_address_proximity is not None else sanctioned_proximity
        final_age = age_of_first_activity_hours if age_of_first_activity_hours is not None else age_hours

        return cls.evaluate(
            address=address,
            fan_in=fan_in,
            fan_out=fan_out,
            is_peeling=is_peeling,
            rapid_fan_out=final_rapid,
            velocity_mins=velocity_mins,
            hop_distance_to_exchange=hop_distance_to_exchange,
            is_victim=is_victim,
            is_hot_wallet=is_hot_wallet,
            is_deposit_wallet=is_deposit_wallet,
            mixer_interaction=final_mixer,
            sanctioned_address_proximity=final_sanc,
            age_of_first_activity_hours=final_age,
            entity_category=entity_category,
            entity_name=entity_name,
        )


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
    sanctioned_proximity: Optional[int] = None,
    age_hours: Optional[float] = None,
    entity_category: Optional[str] = None,
    rapid_fan_out: Optional[bool] = None,
    mixer_interaction: Optional[bool] = None,
    sanctioned_address_proximity: Optional[int] = None,
    age_of_first_activity_hours: Optional[float] = None,
    entity_name: Optional[str] = None,
    **kwargs,
) -> Dict[str, Any]:
    """Helper functional wrapper for RiskScorer.evaluate."""
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
        sanctioned_proximity=sanctioned_proximity,
        age_hours=age_hours,
        entity_category=entity_category,
        rapid_fan_out=rapid_fan_out,
        mixer_interaction=mixer_interaction,
        sanctioned_address_proximity=sanctioned_address_proximity,
        age_of_first_activity_hours=age_of_first_activity_hours,
        entity_name=entity_name,
        **kwargs,
    )
