/**
 * mockScenarios.js - Standalone Client-Side Forensic Datasets for Cloud / Netlify Deployment.
 * Bundles complete pre-computed graph topologies, off-ramp paths, risk scores, and executive briefs
 * for offline and standalone preview modes when localhost:8000 is unavailable.
 */

export const mockScenarios = {
  task_scam_tron: {
  "scenario_id": "task_scam_tron",
  "scenario_name": "task_scam_tron_usdt",
  "target_address": "TVictim0001TRONTaskScamXXXXXXXXX",
  "case_id": "CASE-TRON-C0836F8C",
  "trace_id": "4c1e721c-e7cb-4ca8-8f33-49c91cc0ff43",
  "detected_chain": "TRON",
  "transfer_count": 24,
  "data_source": "standalone_cloud_preview",
  "warning": "Cloud Preview Mode: Backend offline. Serving bundled static forensic dataset.",
  "reached_exchange": true,
  "destination_vasp": "CoinDCX",
  "terminal_amount": 4500.0,
  "hop_count": 4,
  "trace_time_ms": 0.042,
  "primary_path_addresses": [
    "TVictim0001TRONTaskScamXXXXXXXXX",
    "TMule000001XXXXXXXXXXXXXXXXXXXXXXX",
    "TMule000002XXXXXXXXXXXXXXXXXXXXXXX",
    "TReconsolidation03XXXXXXXXXXXXXXXX",
    "TCoinDCXDeposit0001XXXXXXXXXXXXXXXX"
  ],
  "typology_summary": "Task-Based Cyber Fraud / Structuring (TRON)",
  "nodes": [
    {
      "id": "TEnergyRental05XXXXXXXXXXXXXXX",
      "label": "[Peel Dust] TEnergyR...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "gas-refill",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 15 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "TPeelDust02XXXXXXXXXXXXXXXXXXX",
      "label": "[Peel Dust] TPeelDus...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "peel-structuring",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 11 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "TDecoyP2PRing03XXXXXXXXXXXXXXX",
      "label": "[Peel Dust] TDecoyP2...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "background-web",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 15 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "TDecoyP2PRing01XXXXXXXXXXXXXXX",
      "label": "[Peel Dust] TDecoyP2...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "background-web",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "TMule000002XXXXXXXXXXXXXXXXXXXXXXX",
      "label": "[Mule] TMule000...",
      "node_type": "mule",
      "node_class": "intermediary",
      "risk_score": 55,
      "role_tag": "HIGH VELOCITY MULE",
      "cluster_label": "Layering Ring",
      "balance_hint": null,
      "label_confidence": 0.85,
      "is_on_primary_path": true,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20,
        "cex_proximity_urgency": 15
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 10 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        },
        {
          "rule_id": "CEX_PROXIMITY_URGENCY",
          "rule_name": "Exchange Off-Ramp Proximity (<= 2 Hops)",
          "description": "Directly upstream of exchange deposit terminal (2 hops). High flight risk.",
          "points": 15,
          "confidence": 0.88
        }
      ],
      "risk_explanation": "MODERATE risk profile (55/100) triggered by 2 distinct heuristic rules: High-Velocity Mule Hop (< 30 min), Exchange Off-Ramp Proximity (<= 2 Hops)."
    },
    {
      "id": "TDecoyOfframpCollectorXXXXXXXX",
      "label": "[Peel Dust] TDecoyOf...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "background-web",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 15 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "TEnergyRental01XXXXXXXXXXXXXXX",
      "label": "[Suspected Exchange User Deposit]",
      "node_type": "exchange_deposit",
      "node_class": "exchange_suspected",
      "risk_score": 95,
      "role_tag": "SUSPECT CEX DEPOSIT",
      "cluster_label": "Sweep Cluster",
      "balance_hint": null,
      "label_confidence": 0.7,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "gas-refill",
      "risk_severity": "CRITICAL",
      "risk_breakdown": {
        "cex_deposit_account": 95
      },
      "risk_rules": [
        {
          "rule_id": "CEX_DEPOSIT_ACCOUNT",
          "rule_name": "Verified/Suspect CEX Deposit Terminal",
          "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
          "points": 95,
          "confidence": 0.96
        }
      ],
      "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
    },
    {
      "id": "TReconsolidation03XXXXXXXXXXXXXXXX",
      "label": "[Mule] TReconso...",
      "node_type": "mule",
      "node_class": "intermediary",
      "risk_score": 55,
      "role_tag": "HIGH VELOCITY MULE",
      "cluster_label": "Layering Ring",
      "balance_hint": null,
      "label_confidence": 0.85,
      "is_on_primary_path": true,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20,
        "cex_proximity_urgency": 15
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 10 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        },
        {
          "rule_id": "CEX_PROXIMITY_URGENCY",
          "rule_name": "Exchange Off-Ramp Proximity (<= 2 Hops)",
          "description": "Directly upstream of exchange deposit terminal (1 hops). High flight risk.",
          "points": 15,
          "confidence": 0.88
        }
      ],
      "risk_explanation": "MODERATE risk profile (55/100) triggered by 2 distinct heuristic rules: High-Velocity Mule Hop (< 30 min), Exchange Off-Ramp Proximity (<= 2 Hops)."
    },
    {
      "id": "TPeelDust03XXXXXXXXXXXXXXXXXXX",
      "label": "[Peel Dust] TPeelDus...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "peel-structuring",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "TDecoyP2PRing02XXXXXXXXXXXXXXX",
      "label": "[Peel Dust] TDecoyP2...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "background-web",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "TPeelDust04XXXXXXXXXXXXXXXXXXX",
      "label": "[Peel Dust] TPeelDus...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "peel-structuring",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "TPeelDust07XXXXXXXXXXXXXXXXXXX",
      "label": "[Peel Dust] TPeelDus...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "peel-structuring",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "TPeelDust05XXXXXXXXXXXXXXXXXXX",
      "label": "[Peel Dust] TPeelDus...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "peel-structuring",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "TEnergyRental04XXXXXXXXXXXXXXX",
      "label": "[Suspected Exchange User Deposit]",
      "node_type": "exchange_deposit",
      "node_class": "exchange_suspected",
      "risk_score": 95,
      "role_tag": "SUSPECT CEX DEPOSIT",
      "cluster_label": "Sweep Cluster",
      "balance_hint": null,
      "label_confidence": 0.7,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "gas-refill",
      "risk_severity": "CRITICAL",
      "risk_breakdown": {
        "cex_deposit_account": 95
      },
      "risk_rules": [
        {
          "rule_id": "CEX_DEPOSIT_ACCOUNT",
          "rule_name": "Verified/Suspect CEX Deposit Terminal",
          "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
          "points": 95,
          "confidence": 0.96
        }
      ],
      "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
    },
    {
      "id": "TPeelDust06XXXXXXXXXXXXXXXXXXX",
      "label": "[Peel Dust] TPeelDus...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "peel-structuring",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "TCoinDCXDeposit0001XXXXXXXXXXXXXXXX",
      "label": "[CoinDCX User Deposit]",
      "node_type": "exchange_deposit",
      "node_class": "exchange_suspected",
      "risk_score": 95,
      "role_tag": "SUSPECT CEX DEPOSIT",
      "cluster_label": "CoinDCX",
      "balance_hint": null,
      "label_confidence": 0.95,
      "is_on_primary_path": true,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "risk_severity": "CRITICAL",
      "risk_breakdown": {
        "cex_deposit_account": 95
      },
      "risk_rules": [
        {
          "rule_id": "CEX_DEPOSIT_ACCOUNT",
          "rule_name": "Verified/Suspect CEX Deposit Terminal",
          "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
          "points": 95,
          "confidence": 0.96
        }
      ],
      "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
    },
    {
      "id": "TEnergyRental02XXXXXXXXXXXXXXX",
      "label": "[Suspected Exchange User Deposit]",
      "node_type": "exchange_deposit",
      "node_class": "exchange_suspected",
      "risk_score": 95,
      "role_tag": "SUSPECT CEX DEPOSIT",
      "cluster_label": "Sweep Cluster",
      "balance_hint": null,
      "label_confidence": 0.7,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "gas-refill",
      "risk_severity": "CRITICAL",
      "risk_breakdown": {
        "cex_deposit_account": 95
      },
      "risk_rules": [
        {
          "rule_id": "CEX_DEPOSIT_ACCOUNT",
          "rule_name": "Verified/Suspect CEX Deposit Terminal",
          "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
          "points": 95,
          "confidence": 0.96
        }
      ],
      "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
    },
    {
      "id": "TPeelDust01XXXXXXXXXXXXXXXXXXX",
      "label": "[Peel Dust] TPeelDus...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "peel-structuring",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 11 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "TVictim0001TRONTaskScamXXXXXXXXX",
      "label": "[Victim Reported Wallet]",
      "node_type": "victim",
      "node_class": "source_wallet",
      "risk_score": 10,
      "role_tag": "REPORTED VICTIM",
      "cluster_label": "Complainant",
      "balance_hint": null,
      "label_confidence": 1.0,
      "is_on_primary_path": true,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "risk_severity": "LOW",
      "risk_breakdown": {
        "victim_origin": 10
      },
      "risk_rules": [
        {
          "rule_id": "COMPLAINANT_VICTIM_ORIGIN",
          "rule_name": "Reported Victim Wallet",
          "description": "Complainant wallet identified in FIR as source of stolen funds.",
          "points": 10,
          "confidence": 1.0
        }
      ],
      "risk_explanation": "Complainant victim wallet: Verified fund source without laundering liability."
    },
    {
      "id": "TMule000001XXXXXXXXXXXXXXXXXXXXXXX",
      "label": "[Mule] TMule000...",
      "node_type": "mule",
      "node_class": "intermediary",
      "risk_score": 40,
      "role_tag": "HIGH VELOCITY MULE",
      "cluster_label": "Layering Ring",
      "balance_hint": null,
      "label_confidence": 0.85,
      "is_on_primary_path": true,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 8 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "TEnergyRental06XXXXXXXXXXXXXXX",
      "label": "[Peel Dust] TEnergyR...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "gas-refill",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 15 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "TPeelDust08XXXXXXXXXXXXXXXXXXX",
      "label": "[Peel Dust] TPeelDus...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "peel-structuring",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "TCoinDCXHotWallet01XXXXXXXXXXXXXXXX",
      "label": "[CoinDCX Hot Wallet]",
      "node_type": "exchange_hotwallet",
      "node_class": "exchange_confirmed",
      "risk_score": 85,
      "role_tag": "HOT WALLET (SWEEP TERMINAL)",
      "cluster_label": "CoinDCX",
      "balance_hint": null,
      "label_confidence": 0.99,
      "is_on_primary_path": false,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "risk_severity": "CRITICAL",
      "risk_breakdown": {
        "terminal_cex_hotwallet": 85
      },
      "risk_rules": [
        {
          "rule_id": "CEX_HOT_WALLET_TERMINAL",
          "rule_name": "Terminal VASP Hot Wallet",
          "description": "Centralized exchange omnibus hot wallet cluster where laundered funds consolidated.",
          "points": 85,
          "confidence": 0.99
        }
      ],
      "risk_explanation": "Terminal centralized exchange hot wallet cluster: Final off-ramp consolidation."
    },
    {
      "id": "TEnergyRental03XXXXXXXXXXXXXXX",
      "label": "[Suspected Exchange User Deposit]",
      "node_type": "exchange_deposit",
      "node_class": "exchange_suspected",
      "risk_score": 95,
      "role_tag": "SUSPECT CEX DEPOSIT",
      "cluster_label": "Sweep Cluster",
      "balance_hint": null,
      "label_confidence": 0.7,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "gas-refill",
      "risk_severity": "CRITICAL",
      "risk_breakdown": {
        "cex_deposit_account": 95
      },
      "risk_rules": [
        {
          "rule_id": "CEX_DEPOSIT_ACCOUNT",
          "rule_name": "Verified/Suspect CEX Deposit Terminal",
          "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
          "points": 95,
          "confidence": 0.96
        }
      ],
      "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
    },
    {
      "id": "TExpandIn_ede951d0",
      "label": "[Expanded Inbound] TExpan…",
      "node_type": "mule",
      "node_class": "intermediary",
      "risk_score": 75,
      "role_tag": "EXPANDED COUNTERPARTY",
      "cluster_label": "Expanded Cluster",
      "balance_hint": null,
      "label_confidence": 0.75,
      "is_on_primary_path": false,
      "isCorePath": null,
      "parentBoxId": null,
      "risk_severity": "HIGH",
      "risk_breakdown": null,
      "risk_rules": null,
      "risk_explanation": null
    },
    {
      "id": "TExpandOut_babd0f3c",
      "label": "[Expanded Outbound] TExpan…",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 60,
      "role_tag": "EXPANDED COUNTERPARTY",
      "cluster_label": "Expanded Cluster",
      "balance_hint": null,
      "label_confidence": 0.7,
      "is_on_primary_path": false,
      "isCorePath": null,
      "parentBoxId": null,
      "risk_severity": "HIGH",
      "risk_breakdown": null,
      "risk_rules": null,
      "risk_explanation": null
    }
  ],
  "edges": [
    {
      "source": "TVictim0001TRONTaskScamXXXXXXXXX",
      "target": "TMule000001XXXXXXXXXXXXXXXXXXXXXXX",
      "amount": 4850.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788887400,
      "time_str": "17:10 UTC",
      "tx_hash": "0xec4eee61b996f2cc8828558177bc2b6966f294cc",
      "is_primary": true,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "velocity_mins": 0
    },
    {
      "source": "TMule000001XXXXXXXXXXXXXXXXXXXXXXX",
      "target": "TMule000002XXXXXXXXXXXXXXXXXXXXXXX",
      "amount": 4600.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788887820,
      "time_str": "17:17 UTC",
      "tx_hash": "0x9376e40ceb18aca348897a243ccf1574ddde974a",
      "is_primary": true,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "velocity_mins": 7
    },
    {
      "source": "TMule000002XXXXXXXXXXXXXXXXXXXXXXX",
      "target": "TReconsolidation03XXXXXXXXXXXXXXXX",
      "amount": 4500.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788888420,
      "time_str": "17:27 UTC",
      "tx_hash": "0x4a7004ea3eb1ff0cbfbb09ba3f6346df7fac1110",
      "is_primary": true,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "velocity_mins": 17
    },
    {
      "source": "TReconsolidation03XXXXXXXXXXXXXXXX",
      "target": "TCoinDCXDeposit0001XXXXXXXXXXXXXXXX",
      "amount": 4500.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788889020,
      "time_str": "17:37 UTC",
      "tx_hash": "0x365b62f7d04b01987baca72daf1600fc47154547",
      "is_primary": true,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "velocity_mins": 27
    },
    {
      "source": "TCoinDCXDeposit0001XXXXXXXXXXXXXXXX",
      "target": "TCoinDCXHotWallet01XXXXXXXXXXXXXXXX",
      "amount": 4500.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788889620,
      "time_str": "17:47 UTC",
      "tx_hash": "0x454b14b55b85838c7d6ad5676b2682ca6ab595d1",
      "is_primary": false,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "velocity_mins": 37
    },
    {
      "source": "TEnergyRental01XXXXXXXXXXXXXXX",
      "target": "TMule000001XXXXXXXXXXXXXXXXXXXXXXX",
      "amount": 15.0,
      "token": "TRX",
      "token_symbol": "TRX",
      "timestamp_utc": 1788887350,
      "time_str": "17:09 UTC",
      "tx_hash": "0xfee01_tron_energy_refuel_0001",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "gas-refill",
      "velocity_mins": 0
    },
    {
      "source": "TEnergyRental02XXXXXXXXXXXXXXX",
      "target": "TMule000001XXXXXXXXXXXXXXXXXXXXXXX",
      "amount": 12.0,
      "token": "TRX",
      "token_symbol": "TRX",
      "timestamp_utc": 1788887360,
      "time_str": "17:09 UTC",
      "tx_hash": "0xfee02_tron_energy_refuel_0002",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "gas-refill",
      "velocity_mins": 0
    },
    {
      "source": "TEnergyRental03XXXXXXXXXXXXXXX",
      "target": "TMule000002XXXXXXXXXXXXXXXXXXXXXXX",
      "amount": 18.0,
      "token": "TRX",
      "token_symbol": "TRX",
      "timestamp_utc": 1788887800,
      "time_str": "17:16 UTC",
      "tx_hash": "0xfee03_tron_energy_refuel_0003",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "gas-refill",
      "velocity_mins": 6
    },
    {
      "source": "TEnergyRental04XXXXXXXXXXXXXXX",
      "target": "TMule000002XXXXXXXXXXXXXXXXXXXXXXX",
      "amount": 20.0,
      "token": "TRX",
      "token_symbol": "TRX",
      "timestamp_utc": 1788887810,
      "time_str": "17:16 UTC",
      "tx_hash": "0xfee04_tron_energy_refuel_0004",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "gas-refill",
      "velocity_mins": 6
    },
    {
      "source": "TEnergyRental05XXXXXXXXXXXXXXX",
      "target": "TPeelDust01XXXXXXXXXXXXXXXXXXX",
      "amount": 5.0,
      "token": "TRX",
      "token_symbol": "TRX",
      "timestamp_utc": 1788887850,
      "time_str": "17:17 UTC",
      "tx_hash": "0xfee05_tron_energy_refuel_0005",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "gas-refill",
      "velocity_mins": 7
    },
    {
      "source": "TEnergyRental06XXXXXXXXXXXXXXX",
      "target": "TPeelDust02XXXXXXXXXXXXXXXXXXX",
      "amount": 5.0,
      "token": "TRX",
      "token_symbol": "TRX",
      "timestamp_utc": 1788887860,
      "time_str": "17:17 UTC",
      "tx_hash": "0xfee06_tron_energy_refuel_0006",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "gas-refill",
      "velocity_mins": 7
    },
    {
      "source": "TMule000001XXXXXXXXXXXXXXXXXXXXXXX",
      "target": "TPeelDust01XXXXXXXXXXXXXXXXXXX",
      "amount": 125.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788887840,
      "time_str": "17:17 UTC",
      "tx_hash": "0xpeel01_mule1_split95_5a",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "peel-structuring",
      "velocity_mins": 7
    },
    {
      "source": "TMule000001XXXXXXXXXXXXXXXXXXXXXXX",
      "target": "TPeelDust02XXXXXXXXXXXXXXXXXXX",
      "amount": 125.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788887850,
      "time_str": "17:17 UTC",
      "tx_hash": "0xpeel02_mule1_split95_5b",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "peel-structuring",
      "velocity_mins": 7
    },
    {
      "source": "TMule000002XXXXXXXXXXXXXXXXXXXXXXX",
      "target": "TPeelDust03XXXXXXXXXXXXXXXXXXX",
      "amount": 50.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788888430,
      "time_str": "17:27 UTC",
      "tx_hash": "0xpeel03_mule2_split98_2a",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "peel-structuring",
      "velocity_mins": 17
    },
    {
      "source": "TMule000002XXXXXXXXXXXXXXXXXXXXXXX",
      "target": "TPeelDust04XXXXXXXXXXXXXXXXXXX",
      "amount": 50.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788888440,
      "time_str": "17:27 UTC",
      "tx_hash": "0xpeel04_mule2_split98_2b",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "peel-structuring",
      "velocity_mins": 17
    },
    {
      "source": "TPeelDust01XXXXXXXXXXXXXXXXXXX",
      "target": "TPeelDust05XXXXXXXXXXXXXXXXXXX",
      "amount": 75.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788888500,
      "time_str": "17:28 UTC",
      "tx_hash": "0xpeel05_subdust_branch_01",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "peel-structuring",
      "velocity_mins": 18
    },
    {
      "source": "TPeelDust02XXXXXXXXXXXXXXXXXXX",
      "target": "TPeelDust06XXXXXXXXXXXXXXXXXXX",
      "amount": 65.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788888510,
      "time_str": "17:28 UTC",
      "tx_hash": "0xpeel06_subdust_branch_02",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "peel-structuring",
      "velocity_mins": 18
    },
    {
      "source": "TPeelDust03XXXXXXXXXXXXXXXXXXX",
      "target": "TPeelDust07XXXXXXXXXXXXXXXXXXX",
      "amount": 40.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788888520,
      "time_str": "17:28 UTC",
      "tx_hash": "0xpeel07_subdust_branch_03",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "peel-structuring",
      "velocity_mins": 18
    },
    {
      "source": "TPeelDust04XXXXXXXXXXXXXXXXXXX",
      "target": "TPeelDust08XXXXXXXXXXXXXXXXXXX",
      "amount": 35.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788888530,
      "time_str": "17:28 UTC",
      "tx_hash": "0xpeel08_subdust_branch_04",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "peel-structuring",
      "velocity_mins": 18
    },
    {
      "source": "TPeelDust05XXXXXXXXXXXXXXXXXXX",
      "target": "TDecoyP2PRing01XXXXXXXXXXXXXXX",
      "amount": 70.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788888600,
      "time_str": "17:30 UTC",
      "tx_hash": "0xpeel09_decoy_p2p_01",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "peel-structuring",
      "velocity_mins": 20
    },
    {
      "source": "TPeelDust06XXXXXXXXXXXXXXXXXXX",
      "target": "TDecoyP2PRing02XXXXXXXXXXXXXXX",
      "amount": 60.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788888610,
      "time_str": "17:30 UTC",
      "tx_hash": "0xpeel10_decoy_p2p_02",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "peel-structuring",
      "velocity_mins": 20
    },
    {
      "source": "TPeelDust07XXXXXXXXXXXXXXXXXXX",
      "target": "TDecoyP2PRing03XXXXXXXXXXXXXXX",
      "amount": 38.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788888620,
      "time_str": "17:30 UTC",
      "tx_hash": "0xpeel11_decoy_p2p_03",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "peel-structuring",
      "velocity_mins": 20
    },
    {
      "source": "TPeelDust08XXXXXXXXXXXXXXXXXXX",
      "target": "TDecoyP2PRing01XXXXXXXXXXXXXXX",
      "amount": 30.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788888630,
      "time_str": "17:30 UTC",
      "tx_hash": "0xpeel12_decoy_p2p_04",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "peel-structuring",
      "velocity_mins": 20
    },
    {
      "source": "TDecoyP2PRing02XXXXXXXXXXXXXXX",
      "target": "TDecoyOfframpCollectorXXXXXXXX",
      "amount": 55.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788888700,
      "time_str": "17:31 UTC",
      "tx_hash": "0xpeel13_collector_01",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "peel-structuring",
      "velocity_mins": 21
    },
    {
      "source": "TExpandIn_ede951d0",
      "target": "TMule000002XXXXXXXXXXXXXXXXXXXXXXX",
      "amount": 750.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788952095,
      "time_str": "Expanded",
      "tx_hash": "0xexp1_e7c43608f0294d8f",
      "is_primary": false,
      "isCorePath": null,
      "parentBoxId": null,
      "velocity_mins": 60
    },
    {
      "source": "TMule000002XXXXXXXXXXXXXXXXXXXXXXX",
      "target": "TExpandOut_babd0f3c",
      "amount": 450.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788953895,
      "time_str": "Expanded",
      "tx_hash": "0xexp2_a9dbf525266f4dd2",
      "is_primary": false,
      "isCorePath": null,
      "parentBoxId": null,
      "velocity_mins": 30
    }
  ],
  "brief": {
    "title": "Automated Layered Mule Laundering & CoinDCX CEX Off-Ramp",
    "typology": "Task-Based Cyber Fraud / Structuring (TRON)",
    "time_to_exchange_mins": 21,
    "stolen_amount_usd": 4850.0,
    "intermediary_mules_count": 3,
    "identified_vasp": "CoinDCX",
    "target_deposit_wallet": "TReconsolidation03XXXXXXXXXXXXXXXX",
    "recommended_legal_action": "Dispatch Section 94 BNSS preservation directive to CoinDCX Nodal Compliance to debit-freeze target account.",
    "narrative": "Victim reported funds of 4,850.00 structured across 3 intermediary mule accounts within 21 minutes on the TRON network before consolidating and sweeping into CoinDCX.",
    "case_risk_score": 95,
    "case_risk_severity": "CRITICAL",
    "case_risk_breakdown": {
      "max_node_risk": 95,
      "mule_conduits_flagged": 3,
      "peeling_structuring_detected": false,
      "rapid_velocity_detected": true
    }
  },
  "primary_path": [
    "TVictim0001TRONTaskScamXXXXXXXXX",
    "TMule000001XXXXXXXXXXXXXXXXXXXXXXX",
    "TMule000002XXXXXXXXXXXXXXXXXXXXXXX",
    "TReconsolidation03XXXXXXXXXXXXXXXX",
    "TCoinDCXDeposit0001XXXXXXXXXXXXXXXX"
  ],
  "start": {
    "case_id": "CASE-TRON-C0836F8C",
    "trace_id": "4c1e721c-e7cb-4ca8-8f33-49c91cc0ff43",
    "detected_chain": "TRON",
    "transfer_count": 24,
    "data_source": "standalone_cloud_preview",
    "warning": "Showing demo data — live source unavailable (Scenario: task_scam_tron_usdt)",
    "reached_exchange": true,
    "destination_vasp": "CoinDCX",
    "terminal_amount": 4500.0,
    "hop_count": 4,
    "trace_time_ms": 0.042,
    "primary_path_addresses": [
      "TVictim0001TRONTaskScamXXXXXXXXX",
      "TMule000001XXXXXXXXXXXXXXXXXXXXXXX",
      "TMule000002XXXXXXXXXXXXXXXXXXXXXXX",
      "TReconsolidation03XXXXXXXXXXXXXXXX",
      "TCoinDCXDeposit0001XXXXXXXXXXXXXXXX"
    ],
    "typology_summary": "Task-Based Cyber Fraud / Structuring (TRON)"
  },
  "graph": {
    "case_id": "CASE-TRON-C0836F8C",
    "trace_id": "4c1e721c-e7cb-4ca8-8f33-49c91cc0ff43",
    "data_source": "standalone_cloud_preview",
    "nodes": [
      {
        "id": "TEnergyRental05XXXXXXXXXXXXXXX",
        "label": "[Peel Dust] TEnergyR...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "gas-refill",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 15 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "TPeelDust02XXXXXXXXXXXXXXXXXXX",
        "label": "[Peel Dust] TPeelDus...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "peel-structuring",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 11 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "TDecoyP2PRing03XXXXXXXXXXXXXXX",
        "label": "[Peel Dust] TDecoyP2...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "background-web",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 15 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "TDecoyP2PRing01XXXXXXXXXXXXXXX",
        "label": "[Peel Dust] TDecoyP2...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "background-web",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "TMule000002XXXXXXXXXXXXXXXXXXXXXXX",
        "label": "[Mule] TMule000...",
        "node_type": "mule",
        "node_class": "intermediary",
        "risk_score": 55,
        "role_tag": "HIGH VELOCITY MULE",
        "cluster_label": "Layering Ring",
        "balance_hint": null,
        "label_confidence": 0.85,
        "is_on_primary_path": true,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20,
          "cex_proximity_urgency": 15
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 10 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          },
          {
            "rule_id": "CEX_PROXIMITY_URGENCY",
            "rule_name": "Exchange Off-Ramp Proximity (<= 2 Hops)",
            "description": "Directly upstream of exchange deposit terminal (2 hops). High flight risk.",
            "points": 15,
            "confidence": 0.88
          }
        ],
        "risk_explanation": "MODERATE risk profile (55/100) triggered by 2 distinct heuristic rules: High-Velocity Mule Hop (< 30 min), Exchange Off-Ramp Proximity (<= 2 Hops)."
      },
      {
        "id": "TDecoyOfframpCollectorXXXXXXXX",
        "label": "[Peel Dust] TDecoyOf...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "background-web",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 15 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "TEnergyRental01XXXXXXXXXXXXXXX",
        "label": "[Suspected Exchange User Deposit]",
        "node_type": "exchange_deposit",
        "node_class": "exchange_suspected",
        "risk_score": 95,
        "role_tag": "SUSPECT CEX DEPOSIT",
        "cluster_label": "Sweep Cluster",
        "balance_hint": null,
        "label_confidence": 0.7,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "gas-refill",
        "risk_severity": "CRITICAL",
        "risk_breakdown": {
          "cex_deposit_account": 95
        },
        "risk_rules": [
          {
            "rule_id": "CEX_DEPOSIT_ACCOUNT",
            "rule_name": "Verified/Suspect CEX Deposit Terminal",
            "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
            "points": 95,
            "confidence": 0.96
          }
        ],
        "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
      },
      {
        "id": "TReconsolidation03XXXXXXXXXXXXXXXX",
        "label": "[Mule] TReconso...",
        "node_type": "mule",
        "node_class": "intermediary",
        "risk_score": 55,
        "role_tag": "HIGH VELOCITY MULE",
        "cluster_label": "Layering Ring",
        "balance_hint": null,
        "label_confidence": 0.85,
        "is_on_primary_path": true,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20,
          "cex_proximity_urgency": 15
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 10 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          },
          {
            "rule_id": "CEX_PROXIMITY_URGENCY",
            "rule_name": "Exchange Off-Ramp Proximity (<= 2 Hops)",
            "description": "Directly upstream of exchange deposit terminal (1 hops). High flight risk.",
            "points": 15,
            "confidence": 0.88
          }
        ],
        "risk_explanation": "MODERATE risk profile (55/100) triggered by 2 distinct heuristic rules: High-Velocity Mule Hop (< 30 min), Exchange Off-Ramp Proximity (<= 2 Hops)."
      },
      {
        "id": "TPeelDust03XXXXXXXXXXXXXXXXXXX",
        "label": "[Peel Dust] TPeelDus...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "peel-structuring",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "TDecoyP2PRing02XXXXXXXXXXXXXXX",
        "label": "[Peel Dust] TDecoyP2...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "background-web",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "TPeelDust04XXXXXXXXXXXXXXXXXXX",
        "label": "[Peel Dust] TPeelDus...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "peel-structuring",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "TPeelDust07XXXXXXXXXXXXXXXXXXX",
        "label": "[Peel Dust] TPeelDus...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "peel-structuring",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "TPeelDust05XXXXXXXXXXXXXXXXXXX",
        "label": "[Peel Dust] TPeelDus...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "peel-structuring",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "TEnergyRental04XXXXXXXXXXXXXXX",
        "label": "[Suspected Exchange User Deposit]",
        "node_type": "exchange_deposit",
        "node_class": "exchange_suspected",
        "risk_score": 95,
        "role_tag": "SUSPECT CEX DEPOSIT",
        "cluster_label": "Sweep Cluster",
        "balance_hint": null,
        "label_confidence": 0.7,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "gas-refill",
        "risk_severity": "CRITICAL",
        "risk_breakdown": {
          "cex_deposit_account": 95
        },
        "risk_rules": [
          {
            "rule_id": "CEX_DEPOSIT_ACCOUNT",
            "rule_name": "Verified/Suspect CEX Deposit Terminal",
            "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
            "points": 95,
            "confidence": 0.96
          }
        ],
        "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
      },
      {
        "id": "TPeelDust06XXXXXXXXXXXXXXXXXXX",
        "label": "[Peel Dust] TPeelDus...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "peel-structuring",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "TCoinDCXDeposit0001XXXXXXXXXXXXXXXX",
        "label": "[CoinDCX User Deposit]",
        "node_type": "exchange_deposit",
        "node_class": "exchange_suspected",
        "risk_score": 95,
        "role_tag": "SUSPECT CEX DEPOSIT",
        "cluster_label": "CoinDCX",
        "balance_hint": null,
        "label_confidence": 0.95,
        "is_on_primary_path": true,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "risk_severity": "CRITICAL",
        "risk_breakdown": {
          "cex_deposit_account": 95
        },
        "risk_rules": [
          {
            "rule_id": "CEX_DEPOSIT_ACCOUNT",
            "rule_name": "Verified/Suspect CEX Deposit Terminal",
            "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
            "points": 95,
            "confidence": 0.96
          }
        ],
        "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
      },
      {
        "id": "TEnergyRental02XXXXXXXXXXXXXXX",
        "label": "[Suspected Exchange User Deposit]",
        "node_type": "exchange_deposit",
        "node_class": "exchange_suspected",
        "risk_score": 95,
        "role_tag": "SUSPECT CEX DEPOSIT",
        "cluster_label": "Sweep Cluster",
        "balance_hint": null,
        "label_confidence": 0.7,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "gas-refill",
        "risk_severity": "CRITICAL",
        "risk_breakdown": {
          "cex_deposit_account": 95
        },
        "risk_rules": [
          {
            "rule_id": "CEX_DEPOSIT_ACCOUNT",
            "rule_name": "Verified/Suspect CEX Deposit Terminal",
            "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
            "points": 95,
            "confidence": 0.96
          }
        ],
        "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
      },
      {
        "id": "TPeelDust01XXXXXXXXXXXXXXXXXXX",
        "label": "[Peel Dust] TPeelDus...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "peel-structuring",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 11 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "TVictim0001TRONTaskScamXXXXXXXXX",
        "label": "[Victim Reported Wallet]",
        "node_type": "victim",
        "node_class": "source_wallet",
        "risk_score": 10,
        "role_tag": "REPORTED VICTIM",
        "cluster_label": "Complainant",
        "balance_hint": null,
        "label_confidence": 1.0,
        "is_on_primary_path": true,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "risk_severity": "LOW",
        "risk_breakdown": {
          "victim_origin": 10
        },
        "risk_rules": [
          {
            "rule_id": "COMPLAINANT_VICTIM_ORIGIN",
            "rule_name": "Reported Victim Wallet",
            "description": "Complainant wallet identified in FIR as source of stolen funds.",
            "points": 10,
            "confidence": 1.0
          }
        ],
        "risk_explanation": "Complainant victim wallet: Verified fund source without laundering liability."
      },
      {
        "id": "TMule000001XXXXXXXXXXXXXXXXXXXXXXX",
        "label": "[Mule] TMule000...",
        "node_type": "mule",
        "node_class": "intermediary",
        "risk_score": 40,
        "role_tag": "HIGH VELOCITY MULE",
        "cluster_label": "Layering Ring",
        "balance_hint": null,
        "label_confidence": 0.85,
        "is_on_primary_path": true,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 8 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "TEnergyRental06XXXXXXXXXXXXXXX",
        "label": "[Peel Dust] TEnergyR...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "gas-refill",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 15 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "TPeelDust08XXXXXXXXXXXXXXXXXXX",
        "label": "[Peel Dust] TPeelDus...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "peel-structuring",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "TCoinDCXHotWallet01XXXXXXXXXXXXXXXX",
        "label": "[CoinDCX Hot Wallet]",
        "node_type": "exchange_hotwallet",
        "node_class": "exchange_confirmed",
        "risk_score": 85,
        "role_tag": "HOT WALLET (SWEEP TERMINAL)",
        "cluster_label": "CoinDCX",
        "balance_hint": null,
        "label_confidence": 0.99,
        "is_on_primary_path": false,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "risk_severity": "CRITICAL",
        "risk_breakdown": {
          "terminal_cex_hotwallet": 85
        },
        "risk_rules": [
          {
            "rule_id": "CEX_HOT_WALLET_TERMINAL",
            "rule_name": "Terminal VASP Hot Wallet",
            "description": "Centralized exchange omnibus hot wallet cluster where laundered funds consolidated.",
            "points": 85,
            "confidence": 0.99
          }
        ],
        "risk_explanation": "Terminal centralized exchange hot wallet cluster: Final off-ramp consolidation."
      },
      {
        "id": "TEnergyRental03XXXXXXXXXXXXXXX",
        "label": "[Suspected Exchange User Deposit]",
        "node_type": "exchange_deposit",
        "node_class": "exchange_suspected",
        "risk_score": 95,
        "role_tag": "SUSPECT CEX DEPOSIT",
        "cluster_label": "Sweep Cluster",
        "balance_hint": null,
        "label_confidence": 0.7,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "gas-refill",
        "risk_severity": "CRITICAL",
        "risk_breakdown": {
          "cex_deposit_account": 95
        },
        "risk_rules": [
          {
            "rule_id": "CEX_DEPOSIT_ACCOUNT",
            "rule_name": "Verified/Suspect CEX Deposit Terminal",
            "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
            "points": 95,
            "confidence": 0.96
          }
        ],
        "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
      },
      {
        "id": "TExpandIn_ede951d0",
        "label": "[Expanded Inbound] TExpan…",
        "node_type": "mule",
        "node_class": "intermediary",
        "risk_score": 75,
        "role_tag": "EXPANDED COUNTERPARTY",
        "cluster_label": "Expanded Cluster",
        "balance_hint": null,
        "label_confidence": 0.75,
        "is_on_primary_path": false,
        "isCorePath": null,
        "parentBoxId": null,
        "risk_severity": "HIGH",
        "risk_breakdown": null,
        "risk_rules": null,
        "risk_explanation": null
      },
      {
        "id": "TExpandOut_babd0f3c",
        "label": "[Expanded Outbound] TExpan…",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 60,
        "role_tag": "EXPANDED COUNTERPARTY",
        "cluster_label": "Expanded Cluster",
        "balance_hint": null,
        "label_confidence": 0.7,
        "is_on_primary_path": false,
        "isCorePath": null,
        "parentBoxId": null,
        "risk_severity": "HIGH",
        "risk_breakdown": null,
        "risk_rules": null,
        "risk_explanation": null
      }
    ],
    "edges": [
      {
        "source": "TVictim0001TRONTaskScamXXXXXXXXX",
        "target": "TMule000001XXXXXXXXXXXXXXXXXXXXXXX",
        "amount": 4850.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788887400,
        "time_str": "17:10 UTC",
        "tx_hash": "0xec4eee61b996f2cc8828558177bc2b6966f294cc",
        "is_primary": true,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "velocity_mins": 0
      },
      {
        "source": "TMule000001XXXXXXXXXXXXXXXXXXXXXXX",
        "target": "TMule000002XXXXXXXXXXXXXXXXXXXXXXX",
        "amount": 4600.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788887820,
        "time_str": "17:17 UTC",
        "tx_hash": "0x9376e40ceb18aca348897a243ccf1574ddde974a",
        "is_primary": true,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "velocity_mins": 7
      },
      {
        "source": "TMule000002XXXXXXXXXXXXXXXXXXXXXXX",
        "target": "TReconsolidation03XXXXXXXXXXXXXXXX",
        "amount": 4500.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788888420,
        "time_str": "17:27 UTC",
        "tx_hash": "0x4a7004ea3eb1ff0cbfbb09ba3f6346df7fac1110",
        "is_primary": true,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "velocity_mins": 17
      },
      {
        "source": "TReconsolidation03XXXXXXXXXXXXXXXX",
        "target": "TCoinDCXDeposit0001XXXXXXXXXXXXXXXX",
        "amount": 4500.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788889020,
        "time_str": "17:37 UTC",
        "tx_hash": "0x365b62f7d04b01987baca72daf1600fc47154547",
        "is_primary": true,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "velocity_mins": 27
      },
      {
        "source": "TCoinDCXDeposit0001XXXXXXXXXXXXXXXX",
        "target": "TCoinDCXHotWallet01XXXXXXXXXXXXXXXX",
        "amount": 4500.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788889620,
        "time_str": "17:47 UTC",
        "tx_hash": "0x454b14b55b85838c7d6ad5676b2682ca6ab595d1",
        "is_primary": false,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "velocity_mins": 37
      },
      {
        "source": "TEnergyRental01XXXXXXXXXXXXXXX",
        "target": "TMule000001XXXXXXXXXXXXXXXXXXXXXXX",
        "amount": 15.0,
        "token": "TRX",
        "token_symbol": "TRX",
        "timestamp_utc": 1788887350,
        "time_str": "17:09 UTC",
        "tx_hash": "0xfee01_tron_energy_refuel_0001",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "gas-refill",
        "velocity_mins": 0
      },
      {
        "source": "TEnergyRental02XXXXXXXXXXXXXXX",
        "target": "TMule000001XXXXXXXXXXXXXXXXXXXXXXX",
        "amount": 12.0,
        "token": "TRX",
        "token_symbol": "TRX",
        "timestamp_utc": 1788887360,
        "time_str": "17:09 UTC",
        "tx_hash": "0xfee02_tron_energy_refuel_0002",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "gas-refill",
        "velocity_mins": 0
      },
      {
        "source": "TEnergyRental03XXXXXXXXXXXXXXX",
        "target": "TMule000002XXXXXXXXXXXXXXXXXXXXXXX",
        "amount": 18.0,
        "token": "TRX",
        "token_symbol": "TRX",
        "timestamp_utc": 1788887800,
        "time_str": "17:16 UTC",
        "tx_hash": "0xfee03_tron_energy_refuel_0003",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "gas-refill",
        "velocity_mins": 6
      },
      {
        "source": "TEnergyRental04XXXXXXXXXXXXXXX",
        "target": "TMule000002XXXXXXXXXXXXXXXXXXXXXXX",
        "amount": 20.0,
        "token": "TRX",
        "token_symbol": "TRX",
        "timestamp_utc": 1788887810,
        "time_str": "17:16 UTC",
        "tx_hash": "0xfee04_tron_energy_refuel_0004",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "gas-refill",
        "velocity_mins": 6
      },
      {
        "source": "TEnergyRental05XXXXXXXXXXXXXXX",
        "target": "TPeelDust01XXXXXXXXXXXXXXXXXXX",
        "amount": 5.0,
        "token": "TRX",
        "token_symbol": "TRX",
        "timestamp_utc": 1788887850,
        "time_str": "17:17 UTC",
        "tx_hash": "0xfee05_tron_energy_refuel_0005",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "gas-refill",
        "velocity_mins": 7
      },
      {
        "source": "TEnergyRental06XXXXXXXXXXXXXXX",
        "target": "TPeelDust02XXXXXXXXXXXXXXXXXXX",
        "amount": 5.0,
        "token": "TRX",
        "token_symbol": "TRX",
        "timestamp_utc": 1788887860,
        "time_str": "17:17 UTC",
        "tx_hash": "0xfee06_tron_energy_refuel_0006",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "gas-refill",
        "velocity_mins": 7
      },
      {
        "source": "TMule000001XXXXXXXXXXXXXXXXXXXXXXX",
        "target": "TPeelDust01XXXXXXXXXXXXXXXXXXX",
        "amount": 125.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788887840,
        "time_str": "17:17 UTC",
        "tx_hash": "0xpeel01_mule1_split95_5a",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "peel-structuring",
        "velocity_mins": 7
      },
      {
        "source": "TMule000001XXXXXXXXXXXXXXXXXXXXXXX",
        "target": "TPeelDust02XXXXXXXXXXXXXXXXXXX",
        "amount": 125.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788887850,
        "time_str": "17:17 UTC",
        "tx_hash": "0xpeel02_mule1_split95_5b",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "peel-structuring",
        "velocity_mins": 7
      },
      {
        "source": "TMule000002XXXXXXXXXXXXXXXXXXXXXXX",
        "target": "TPeelDust03XXXXXXXXXXXXXXXXXXX",
        "amount": 50.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788888430,
        "time_str": "17:27 UTC",
        "tx_hash": "0xpeel03_mule2_split98_2a",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "peel-structuring",
        "velocity_mins": 17
      },
      {
        "source": "TMule000002XXXXXXXXXXXXXXXXXXXXXXX",
        "target": "TPeelDust04XXXXXXXXXXXXXXXXXXX",
        "amount": 50.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788888440,
        "time_str": "17:27 UTC",
        "tx_hash": "0xpeel04_mule2_split98_2b",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "peel-structuring",
        "velocity_mins": 17
      },
      {
        "source": "TPeelDust01XXXXXXXXXXXXXXXXXXX",
        "target": "TPeelDust05XXXXXXXXXXXXXXXXXXX",
        "amount": 75.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788888500,
        "time_str": "17:28 UTC",
        "tx_hash": "0xpeel05_subdust_branch_01",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "peel-structuring",
        "velocity_mins": 18
      },
      {
        "source": "TPeelDust02XXXXXXXXXXXXXXXXXXX",
        "target": "TPeelDust06XXXXXXXXXXXXXXXXXXX",
        "amount": 65.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788888510,
        "time_str": "17:28 UTC",
        "tx_hash": "0xpeel06_subdust_branch_02",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "peel-structuring",
        "velocity_mins": 18
      },
      {
        "source": "TPeelDust03XXXXXXXXXXXXXXXXXXX",
        "target": "TPeelDust07XXXXXXXXXXXXXXXXXXX",
        "amount": 40.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788888520,
        "time_str": "17:28 UTC",
        "tx_hash": "0xpeel07_subdust_branch_03",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "peel-structuring",
        "velocity_mins": 18
      },
      {
        "source": "TPeelDust04XXXXXXXXXXXXXXXXXXX",
        "target": "TPeelDust08XXXXXXXXXXXXXXXXXXX",
        "amount": 35.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788888530,
        "time_str": "17:28 UTC",
        "tx_hash": "0xpeel08_subdust_branch_04",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "peel-structuring",
        "velocity_mins": 18
      },
      {
        "source": "TPeelDust05XXXXXXXXXXXXXXXXXXX",
        "target": "TDecoyP2PRing01XXXXXXXXXXXXXXX",
        "amount": 70.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788888600,
        "time_str": "17:30 UTC",
        "tx_hash": "0xpeel09_decoy_p2p_01",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "peel-structuring",
        "velocity_mins": 20
      },
      {
        "source": "TPeelDust06XXXXXXXXXXXXXXXXXXX",
        "target": "TDecoyP2PRing02XXXXXXXXXXXXXXX",
        "amount": 60.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788888610,
        "time_str": "17:30 UTC",
        "tx_hash": "0xpeel10_decoy_p2p_02",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "peel-structuring",
        "velocity_mins": 20
      },
      {
        "source": "TPeelDust07XXXXXXXXXXXXXXXXXXX",
        "target": "TDecoyP2PRing03XXXXXXXXXXXXXXX",
        "amount": 38.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788888620,
        "time_str": "17:30 UTC",
        "tx_hash": "0xpeel11_decoy_p2p_03",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "peel-structuring",
        "velocity_mins": 20
      },
      {
        "source": "TPeelDust08XXXXXXXXXXXXXXXXXXX",
        "target": "TDecoyP2PRing01XXXXXXXXXXXXXXX",
        "amount": 30.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788888630,
        "time_str": "17:30 UTC",
        "tx_hash": "0xpeel12_decoy_p2p_04",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "peel-structuring",
        "velocity_mins": 20
      },
      {
        "source": "TDecoyP2PRing02XXXXXXXXXXXXXXX",
        "target": "TDecoyOfframpCollectorXXXXXXXX",
        "amount": 55.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788888700,
        "time_str": "17:31 UTC",
        "tx_hash": "0xpeel13_collector_01",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "peel-structuring",
        "velocity_mins": 21
      },
      {
        "source": "TExpandIn_ede951d0",
        "target": "TMule000002XXXXXXXXXXXXXXXXXXXXXXX",
        "amount": 750.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788952095,
        "time_str": "Expanded",
        "tx_hash": "0xexp1_e7c43608f0294d8f",
        "is_primary": false,
        "isCorePath": null,
        "parentBoxId": null,
        "velocity_mins": 60
      },
      {
        "source": "TMule000002XXXXXXXXXXXXXXXXXXXXXXX",
        "target": "TExpandOut_babd0f3c",
        "amount": 450.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788953895,
        "time_str": "Expanded",
        "tx_hash": "0xexp2_a9dbf525266f4dd2",
        "is_primary": false,
        "isCorePath": null,
        "parentBoxId": null,
        "velocity_mins": 30
      }
    ],
    "brief": {
      "title": "Automated Layered Mule Laundering & CoinDCX CEX Off-Ramp",
      "typology": "Task-Based Cyber Fraud / Structuring (TRON)",
      "time_to_exchange_mins": 21,
      "stolen_amount_usd": 4850.0,
      "intermediary_mules_count": 3,
      "identified_vasp": "CoinDCX",
      "target_deposit_wallet": "TReconsolidation03XXXXXXXXXXXXXXXX",
      "recommended_legal_action": "Dispatch Section 94 BNSS preservation directive to CoinDCX Nodal Compliance to debit-freeze target account.",
      "narrative": "Victim reported funds of 4,850.00 structured across 3 intermediary mule accounts within 21 minutes on the TRON network before consolidating and sweeping into CoinDCX.",
      "case_risk_score": 95,
      "case_risk_severity": "CRITICAL",
      "case_risk_breakdown": {
        "max_node_risk": 95,
        "mule_conduits_flagged": 3,
        "peeling_structuring_detected": false,
        "rapid_velocity_detected": true
      }
    },
    "primary_path": [
      "TVictim0001TRONTaskScamXXXXXXXXX",
      "TMule000001XXXXXXXXXXXXXXXXXXXXXXX",
      "TMule000002XXXXXXXXXXXXXXXXXXXXXXX",
      "TReconsolidation03XXXXXXXXXXXXXXXX",
      "TCoinDCXDeposit0001XXXXXXXXXXXXXXXX"
    ]
  },
  "off_ramp": {
    "found": true,
    "hops_searched": 4,
    "truncated": false,
    "path": [
      {
        "source": "TVictim0001TRONTaskScamXXXXXXXXX",
        "target": "TMule000001XXXXXXXXXXXXXXXXXXXXXXX",
        "amount": 4850.0,
        "token": "USDT",
        "tx_hash": "0xec4eee61b996f2cc8828558177bc2b6966f294cc",
        "timestamp_utc": 1788887400
      },
      {
        "source": "TMule000001XXXXXXXXXXXXXXXXXXXXXXX",
        "target": "TMule000002XXXXXXXXXXXXXXXXXXXXXXX",
        "amount": 4600.0,
        "token": "USDT",
        "tx_hash": "0x9376e40ceb18aca348897a243ccf1574ddde974a",
        "timestamp_utc": 1788887820
      },
      {
        "source": "TMule000002XXXXXXXXXXXXXXXXXXXXXXX",
        "target": "TReconsolidation03XXXXXXXXXXXXXXXX",
        "amount": 4500.0,
        "token": "USDT",
        "tx_hash": "0x4a7004ea3eb1ff0cbfbb09ba3f6346df7fac1110",
        "timestamp_utc": 1788888420
      },
      {
        "source": "TReconsolidation03XXXXXXXXXXXXXXXX",
        "target": "TCoinDCXDeposit0001XXXXXXXXXXXXXXXX",
        "amount": 4500.0,
        "token": "USDT",
        "tx_hash": "0x365b62f7d04b01987baca72daf1600fc47154547",
        "timestamp_utc": 1788889020
      },
      {
        "source": "TCoinDCXDeposit0001XXXXXXXXXXXXXXXX",
        "target": "TCoinDCXHotWallet01XXXXXXXXXXXXXXXX",
        "amount": 4500.0,
        "token": "USDT",
        "tx_hash": "0x454b14b55b85838c7d6ad5676b2682ca6ab595d1",
        "timestamp_utc": 1788889620
      }
    ],
    "terminal_label": "CoinDCX Main Hot Wallet",
    "disclaimer": "Heuristic off-ramp detection is an investigative lead, not conclusive proof of account ownership or CEX deposit attribution. Verification with exchange compliance under Section 94 BNSS is required.",
    "terminal_vasp": "CoinDCX"
  },
  "expansions": {
    "TMule000002XXXXXXXXXXXXXXXXXXXXXXX": {
      "expanded_address": "TMule000002XXXXXXXXXXXXXXXXXXXXXXX",
      "new_nodes": [
        {
          "id": "TExpandIn_ede951d0",
          "label": "[Expanded Inbound] TExpan…",
          "node_type": "mule",
          "node_class": "intermediary",
          "risk_score": 75,
          "role_tag": "EXPANDED COUNTERPARTY",
          "cluster_label": "Expanded Cluster",
          "balance_hint": null,
          "label_confidence": 0.75,
          "is_on_primary_path": false,
          "isCorePath": null,
          "parentBoxId": null,
          "risk_severity": "HIGH",
          "risk_breakdown": null,
          "risk_rules": null,
          "risk_explanation": null
        },
        {
          "id": "TExpandOut_babd0f3c",
          "label": "[Expanded Outbound] TExpan…",
          "node_type": "peel_outlet",
          "node_class": "unknown",
          "risk_score": 60,
          "role_tag": "EXPANDED COUNTERPARTY",
          "cluster_label": "Expanded Cluster",
          "balance_hint": null,
          "label_confidence": 0.7,
          "is_on_primary_path": false,
          "isCorePath": null,
          "parentBoxId": null,
          "risk_severity": "HIGH",
          "risk_breakdown": null,
          "risk_rules": null,
          "risk_explanation": null
        }
      ],
      "new_edges": [
        {
          "source": "TExpandIn_ede951d0",
          "target": "TMule000002XXXXXXXXXXXXXXXXXXXXXXX",
          "amount": 750.0,
          "token": "USDT",
          "token_symbol": "USDT",
          "timestamp_utc": 1788952095,
          "time_str": "Expanded",
          "tx_hash": "0xexp1_e7c43608f0294d8f",
          "is_primary": false,
          "isCorePath": null,
          "parentBoxId": null,
          "velocity_mins": 60
        },
        {
          "source": "TMule000002XXXXXXXXXXXXXXXXXXXXXXX",
          "target": "TExpandOut_babd0f3c",
          "amount": 450.0,
          "token": "USDT",
          "token_symbol": "USDT",
          "timestamp_utc": 1788953895,
          "time_str": "Expanded",
          "tx_hash": "0xexp2_a9dbf525266f4dd2",
          "is_primary": false,
          "isCorePath": null,
          "parentBoxId": null,
          "velocity_mins": 30
        }
      ],
      "total_nodes": 26,
      "total_edges": 26
    }
  }
},
  task_scam_tron_usdt: null, // assigned below as alias
  investment_scam_eth: {
  "scenario_id": "investment_scam_eth",
  "scenario_name": "investment_scam_eth",
  "target_address": "0xVictim0002PigButcherDeFiXXXXXXX",
  "case_id": "CASE-TRON-ACE4025D",
  "trace_id": "912bf71a-8eb6-49a4-a9ce-b6f6677e83d1",
  "detected_chain": "EVM",
  "transfer_count": 30,
  "data_source": "standalone_cloud_preview",
  "warning": "Cloud Preview Mode: Backend offline. Serving bundled static forensic dataset.",
  "reached_exchange": true,
  "destination_vasp": "Binance",
  "terminal_amount": 11500.0,
  "hop_count": 3,
  "trace_time_ms": 0.042,
  "primary_path_addresses": [
    "0xVictim0002PigButcherDeFiXXXXXXX",
    "0xMuleLayerA0000000000000000000000001",
    "0xMuleLayerB0000000000000000000000002",
    "0xBinanceDeposit000000000000000000000001"
  ],
  "typology_summary": "Task-Based Cyber Fraud / Structuring (EVM)",
  "nodes": [
    {
      "id": "0xYieldAggregatorVaultMule01XXXXXXXX",
      "label": "[Peel Dust] 0xYieldA...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "runner-network",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "0xDecoyLayerMule04XXXXXXXXXXXXXXXXXX",
      "label": "[Peel Dust] 0xDecoyL...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "background-web",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "0xBinanceDeposit000000000000000000000001",
      "label": "[Binance User Deposit]",
      "node_type": "exchange_deposit",
      "node_class": "exchange_suspected",
      "risk_score": 95,
      "role_tag": "SUSPECT CEX DEPOSIT",
      "cluster_label": "Binance",
      "balance_hint": null,
      "label_confidence": 0.95,
      "is_on_primary_path": true,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "risk_severity": "CRITICAL",
      "risk_breakdown": {
        "cex_deposit_account": 95
      },
      "risk_rules": [
        {
          "rule_id": "CEX_DEPOSIT_ACCOUNT",
          "rule_name": "Verified/Suspect CEX Deposit Terminal",
          "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
          "points": 95,
          "confidence": 0.96
        }
      ],
      "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
    },
    {
      "id": "0xGasStationFunder02XXXXXXXXXXXXXXXXX",
      "label": "[Peel Dust] 0xGasSta...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "gas-refill",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 13 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "0xLendingPoolCollateralMule01XXXXXXX",
      "label": "[Peel Dust] 0xLendin...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "dex-swap",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "0xE592427A0AEce92De3Edee1F18E0157C05861564",
      "label": "[Peel Dust] 0xE59242...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "background-web",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "0xDecoyLayerMule01XXXXXXXXXXXXXXXXXX",
      "label": "[Peel Dust] 0xDecoyL...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "background-web",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "0xGasStationFunder01XXXXXXXXXXXXXXXXX",
      "label": "[Peel Dust] 0xGasSta...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "gas-refill",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 21 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "0xMixerRelayer01XXXXXXXXXXXXXXXXXXXXX",
      "label": "[Peel Dust] 0xMixerR...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "mixer-evasion",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 15 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "0xBinanceHotWallet000000000000000000001",
      "label": "[Binance Hot Wallet]",
      "node_type": "exchange_hotwallet",
      "node_class": "exchange_confirmed",
      "risk_score": 85,
      "role_tag": "HOT WALLET (SWEEP TERMINAL)",
      "cluster_label": "Binance",
      "balance_hint": null,
      "label_confidence": 0.99,
      "is_on_primary_path": false,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "risk_severity": "CRITICAL",
      "risk_breakdown": {
        "terminal_cex_hotwallet": 85
      },
      "risk_rules": [
        {
          "rule_id": "CEX_HOT_WALLET_TERMINAL",
          "rule_name": "Terminal VASP Hot Wallet",
          "description": "Centralized exchange omnibus hot wallet cluster where laundered funds consolidated.",
          "points": 85,
          "confidence": 0.99
        }
      ],
      "risk_explanation": "Terminal centralized exchange hot wallet cluster: Final off-ramp consolidation."
    },
    {
      "id": "0xMuleLayerB0000000000000000000000002",
      "label": "[Mule] 0xMuleLa...",
      "node_type": "mule",
      "node_class": "intermediary",
      "risk_score": 55,
      "role_tag": "HIGH VELOCITY MULE",
      "cluster_label": "Layering Ring",
      "balance_hint": null,
      "label_confidence": 0.85,
      "is_on_primary_path": true,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20,
        "cex_proximity_urgency": 15
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 14 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        },
        {
          "rule_id": "CEX_PROXIMITY_URGENCY",
          "rule_name": "Exchange Off-Ramp Proximity (<= 2 Hops)",
          "description": "Directly upstream of exchange deposit terminal (1 hops). High flight risk.",
          "points": 15,
          "confidence": 0.88
        }
      ],
      "risk_explanation": "MODERATE risk profile (55/100) triggered by 2 distinct heuristic rules: High-Velocity Mule Hop (< 30 min), Exchange Off-Ramp Proximity (<= 2 Hops)."
    },
    {
      "id": "0xOffshoreCleanWallet01XXXXXXXXXXXXX",
      "label": "[Peel Dust] 0xOffsho...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "background-web",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "0xOffshoreCryptoATM01XXXXXXXXXXXXXXX",
      "label": "[Peel Dust] 0xOffsho...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "background-web",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 15 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "0xUniswapLiquidityProviderMule01XXXXX",
      "label": "[Peel Dust] 0xUniswa...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "dex-swap",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 14 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "0xDecoyLayerMule02XXXXXXXXXXXXXXXXXX",
      "label": "[Peel Dust] 0xDecoyL...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "background-web",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "0x11b815efB8f581194ae79006d24E0d814B7697F6",
      "label": "[Peel Dust] 0x11b815...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "background-web",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640",
      "label": "[Peel Dust] 0x88e6A0...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "background-web",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "0xCrossChainDestinationMule01XXXXXXX",
      "label": "[Peel Dust] 0xCrossC...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "background-web",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 15 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "0xMuleLayerA0000000000000000000000001",
      "label": "[Mule] 0xMuleLa...",
      "node_type": "mule",
      "node_class": "intermediary",
      "risk_score": 55,
      "role_tag": "HIGH VELOCITY MULE",
      "cluster_label": "Layering Ring",
      "balance_hint": null,
      "label_confidence": 0.85,
      "is_on_primary_path": true,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20,
        "cex_proximity_urgency": 15
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 11 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        },
        {
          "rule_id": "CEX_PROXIMITY_URGENCY",
          "rule_name": "Exchange Off-Ramp Proximity (<= 2 Hops)",
          "description": "Directly upstream of exchange deposit terminal (2 hops). High flight risk.",
          "points": 15,
          "confidence": 0.88
        }
      ],
      "risk_explanation": "MODERATE risk profile (55/100) triggered by 2 distinct heuristic rules: High-Velocity Mule Hop (< 30 min), Exchange Off-Ramp Proximity (<= 2 Hops)."
    },
    {
      "id": "0xAnonymizedAnomalousReceiver01XXXXX",
      "label": "[Peel Dust] 0xAnonym...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "background-web",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 8 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "0xVictim0002PigButcherDeFiXXXXXXX",
      "label": "[Victim Reported Wallet]",
      "node_type": "victim",
      "node_class": "source_wallet",
      "risk_score": 10,
      "role_tag": "REPORTED VICTIM",
      "cluster_label": "Complainant",
      "balance_hint": null,
      "label_confidence": 1.0,
      "is_on_primary_path": true,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "risk_severity": "LOW",
      "risk_breakdown": {
        "victim_origin": 10
      },
      "risk_rules": [
        {
          "rule_id": "COMPLAINANT_VICTIM_ORIGIN",
          "rule_name": "Reported Victim Wallet",
          "description": "Complainant wallet identified in FIR as source of stolen funds.",
          "points": 10,
          "confidence": 1.0
        }
      ],
      "risk_explanation": "Complainant victim wallet: Verified fund source without laundering liability."
    },
    {
      "id": "0xDecoyLayerMule05XXXXXXXXXXXXXXXXXX",
      "label": "[Peel Dust] 0xDecoyL...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "background-web",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "0xDeFiExitBridgeMule01XXXXXXXXXXXXXX",
      "label": "[Peel Dust] 0xDeFiEx...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "background-web",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "0xOffshoreCleanWallet02XXXXXXXXXXXXX",
      "label": "[Peel Dust] 0xOffsho...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "background-web",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 15 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "0xOffshoreCryptoATM02XXXXXXXXXXXXXXX",
      "label": "[Peel Dust] 0xOffsho...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "background-web",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 15 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "0xDecoyLayerMule03XXXXXXXXXXXXXXXXXX",
      "label": "[Peel Dust] 0xDecoyL...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "background-web",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "0xd90e2f925da726b50c4ed8d0fb90ad053324f31b",
      "label": "[Tornado Cash (ETH)]",
      "node_type": "mixer",
      "node_class": "contract_or_mixer",
      "risk_score": 99,
      "role_tag": "SANCTIONED MIXER (TORNADO CASH)",
      "cluster_label": "Mixer Evasion",
      "balance_hint": null,
      "label_confidence": 0.99,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "mixer-evasion",
      "risk_severity": "CRITICAL",
      "risk_breakdown": {
        "baseline": 20,
        "mixer_penalty": 45,
        "peeling_structuring": 25,
        "velocity_sub_2hr": 10
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "MIXER_TUMBLER_INTERACTION",
          "rule_name": "Privacy Mixer Interaction",
          "description": "Direct conduit interaction with privacy tumbler protocol (e.g. Tornado Cash).",
          "points": 45,
          "confidence": 0.98
        },
        {
          "rule_id": "PEELING_CHAIN_STRUCTURING",
          "rule_name": "Peeling Chain Structuring",
          "description": "Asymmetric multi-output pattern detected (1-in, 2-out) peeling change from main fund conduit.",
          "points": 25,
          "confidence": 0.85
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_2HR",
          "rule_name": "Moderate-Velocity Hop (< 2 hrs)",
          "description": "Transferred funds in 41 mins, indicating coordinated layering ring behavior.",
          "points": 10,
          "confidence": 0.8
        }
      ],
      "risk_explanation": "CRITICAL risk profile (99/100) triggered by 3 distinct heuristic rules: Privacy Mixer Interaction, Peeling Chain Structuring, Moderate-Velocity Hop (< 2 hrs)."
    },
    {
      "id": "0xDecoyLayerMule06XXXXXXXXXXXXXXXXXX",
      "label": "[Peel Dust] 0xDecoyL...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "background-web",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "0xStakingFarmMule01XXXXXXXXXXXXXXXXX",
      "label": "[Peel Dust] 0xStakin...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "background-web",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "0xExpandIn_bb77a119",
      "label": "[Expanded Inbound] 0xExpa…",
      "node_type": "mule",
      "node_class": "intermediary",
      "risk_score": 75,
      "role_tag": "EXPANDED COUNTERPARTY",
      "cluster_label": "Expanded Cluster",
      "balance_hint": null,
      "label_confidence": 0.75,
      "is_on_primary_path": false,
      "isCorePath": null,
      "parentBoxId": null,
      "risk_severity": "HIGH",
      "risk_breakdown": null,
      "risk_rules": null,
      "risk_explanation": null
    },
    {
      "id": "0xExpandOut_44a1c24e",
      "label": "[Expanded Outbound] 0xExpa…",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 60,
      "role_tag": "EXPANDED COUNTERPARTY",
      "cluster_label": "Expanded Cluster",
      "balance_hint": null,
      "label_confidence": 0.7,
      "is_on_primary_path": false,
      "isCorePath": null,
      "parentBoxId": null,
      "risk_severity": "HIGH",
      "risk_breakdown": null,
      "risk_rules": null,
      "risk_explanation": null
    }
  ],
  "edges": [
    {
      "source": "0xVictim0002PigButcherDeFiXXXXXXX",
      "target": "0xMuleLayerA0000000000000000000000001",
      "amount": 12500.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788900000,
      "time_str": "20:40 UTC",
      "tx_hash": "0xb111111111111111111111111111111111111111111111111111111111111111",
      "is_primary": true,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "velocity_mins": 0
    },
    {
      "source": "0xMuleLayerA0000000000000000000000001",
      "target": "0xMuleLayerB0000000000000000000000002",
      "amount": 11500.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788900480,
      "time_str": "20:48 UTC",
      "tx_hash": "0xb222222222222222222222222222222222222222222222222222222222222222",
      "is_primary": true,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "velocity_mins": 8
    },
    {
      "source": "0xMuleLayerB0000000000000000000000002",
      "target": "0xBinanceDeposit000000000000000000000001",
      "amount": 11500.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788901200,
      "time_str": "21:00 UTC",
      "tx_hash": "0xb333333333333333333333333333333333333333333333333333333333333333",
      "is_primary": true,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "velocity_mins": 20
    },
    {
      "source": "0xBinanceDeposit000000000000000000000001",
      "target": "0xBinanceHotWallet000000000000000000001",
      "amount": 11500.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788901800,
      "time_str": "21:10 UTC",
      "tx_hash": "0xb444444444444444444444444444444444444444444444444444444444444444",
      "is_primary": false,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "velocity_mins": 30
    },
    {
      "source": "0xMuleLayerA0000000000000000000000001",
      "target": "0xd90e2f925da726b50c4ed8d0fb90ad053324f31b",
      "amount": 1000.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788900500,
      "time_str": "20:48 UTC",
      "tx_hash": "0xmixer01_tornado_cash_deposit_1000u",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "mixer-evasion",
      "velocity_mins": 8
    },
    {
      "source": "0xd90e2f925da726b50c4ed8d0fb90ad053324f31b",
      "target": "0xMixerRelayer01XXXXXXXXXXXXXXXXXXXXX",
      "amount": 10.0,
      "token": "ETH",
      "token_symbol": "ETH",
      "timestamp_utc": 1788900550,
      "time_str": "20:49 UTC",
      "tx_hash": "0xmixer02_tornado_relayer_fee",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "mixer-evasion",
      "velocity_mins": 9
    },
    {
      "source": "0xd90e2f925da726b50c4ed8d0fb90ad053324f31b",
      "target": "0xAnonymizedAnomalousReceiver01XXXXX",
      "amount": 990.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788903000,
      "time_str": "21:30 UTC",
      "tx_hash": "0xmixer03_tornado_withdrawal_unlinked",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "mixer-evasion",
      "velocity_mins": 50
    },
    {
      "source": "0xMuleLayerA0000000000000000000000001",
      "target": "0xE592427A0AEce92De3Edee1F18E0157C05861564",
      "amount": 500.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788900600,
      "time_str": "20:50 UTC",
      "tx_hash": "0xdex01_uniswap_v3_exact_input_swap",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "dex-swap",
      "velocity_mins": 10
    },
    {
      "source": "0xE592427A0AEce92De3Edee1F18E0157C05861564",
      "target": "0x11b815efB8f581194ae79006d24E0d814B7697F6",
      "amount": 500.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788900605,
      "time_str": "20:50 UTC",
      "tx_hash": "0xdex02_uniswap_v3_pool_liquidity_hop",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "dex-swap",
      "velocity_mins": 10
    },
    {
      "source": "0x11b815efB8f581194ae79006d24E0d814B7697F6",
      "target": "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640",
      "amount": 0.16,
      "token": "ETH",
      "token_symbol": "ETH",
      "timestamp_utc": 1788900610,
      "time_str": "20:50 UTC",
      "tx_hash": "0xdex03_pool_weth_usdc_crosshop",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "dex-swap",
      "velocity_mins": 10
    },
    {
      "source": "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640",
      "target": "0xUniswapLiquidityProviderMule01XXXXX",
      "amount": 492.0,
      "token": "USDC",
      "token_symbol": "USDC",
      "timestamp_utc": 1788900620,
      "time_str": "20:50 UTC",
      "tx_hash": "0xdex04_lp_mule_settlement",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "dex-swap",
      "velocity_mins": 10
    },
    {
      "source": "0xGasStationFunder01XXXXXXXXXXXXXXXXX",
      "target": "0xMuleLayerA0000000000000000000000001",
      "amount": 0.05,
      "token": "ETH",
      "token_symbol": "ETH",
      "timestamp_utc": 1788899900,
      "time_str": "20:38 UTC",
      "tx_hash": "0xgas01_funding_eth_001",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "gas-funding",
      "velocity_mins": 0
    },
    {
      "source": "0xGasStationFunder02XXXXXXXXXXXXXXXXX",
      "target": "0xMuleLayerB0000000000000000000000002",
      "amount": 0.04,
      "token": "ETH",
      "token_symbol": "ETH",
      "timestamp_utc": 1788900400,
      "time_str": "20:46 UTC",
      "tx_hash": "0xgas02_funding_eth_002",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "gas-funding",
      "velocity_mins": 6
    },
    {
      "source": "0xMuleLayerB0000000000000000000000002",
      "target": "0xDecoyLayerMule01XXXXXXXXXXXXXXXXXX",
      "amount": 180.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788901250,
      "time_str": "21:00 UTC",
      "tx_hash": "0xdecoy01_layering_split_a",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "layering-decoy",
      "velocity_mins": 20
    },
    {
      "source": "0xMuleLayerB0000000000000000000000002",
      "target": "0xDecoyLayerMule02XXXXXXXXXXXXXXXXXX",
      "amount": 140.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788901260,
      "time_str": "21:01 UTC",
      "tx_hash": "0xdecoy02_layering_split_b",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "layering-decoy",
      "velocity_mins": 21
    },
    {
      "source": "0xDecoyLayerMule01XXXXXXXXXXXXXXXXXX",
      "target": "0xDecoyLayerMule03XXXXXXXXXXXXXXXXXX",
      "amount": 110.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788901300,
      "time_str": "21:01 UTC",
      "tx_hash": "0xdecoy03_layering_split_c",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "layering-decoy",
      "velocity_mins": 21
    },
    {
      "source": "0xDecoyLayerMule02XXXXXXXXXXXXXXXXXX",
      "target": "0xDecoyLayerMule04XXXXXXXXXXXXXXXXXX",
      "amount": 95.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788901310,
      "time_str": "21:01 UTC",
      "tx_hash": "0xdecoy04_layering_split_d",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "layering-decoy",
      "velocity_mins": 21
    },
    {
      "source": "0xDecoyLayerMule03XXXXXXXXXXXXXXXXXX",
      "target": "0xDecoyLayerMule05XXXXXXXXXXXXXXXXXX",
      "amount": 70.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788901350,
      "time_str": "21:02 UTC",
      "tx_hash": "0xdecoy05_layering_split_e",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "layering-decoy",
      "velocity_mins": 22
    },
    {
      "source": "0xDecoyLayerMule04XXXXXXXXXXXXXXXXXX",
      "target": "0xDecoyLayerMule06XXXXXXXXXXXXXXXXXX",
      "amount": 60.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788901360,
      "time_str": "21:02 UTC",
      "tx_hash": "0xdecoy06_layering_split_f",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "layering-decoy",
      "velocity_mins": 22
    },
    {
      "source": "0xDecoyLayerMule05XXXXXXXXXXXXXXXXXX",
      "target": "0xOffshoreCryptoATM01XXXXXXXXXXXXXXX",
      "amount": 50.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788901400,
      "time_str": "21:03 UTC",
      "tx_hash": "0xdecoy07_atm_exit_01",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "layering-decoy",
      "velocity_mins": 23
    },
    {
      "source": "0xDecoyLayerMule06XXXXXXXXXXXXXXXXXX",
      "target": "0xOffshoreCryptoATM02XXXXXXXXXXXXXXX",
      "amount": 45.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788901410,
      "time_str": "21:03 UTC",
      "tx_hash": "0xdecoy08_atm_exit_02",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "layering-decoy",
      "velocity_mins": 23
    },
    {
      "source": "0xUniswapLiquidityProviderMule01XXXXX",
      "target": "0xStakingFarmMule01XXXXXXXXXXXXXXXXX",
      "amount": 490.0,
      "token": "USDC",
      "token_symbol": "USDC",
      "timestamp_utc": 1788901500,
      "time_str": "21:05 UTC",
      "tx_hash": "0xdefi01_staking_deposit",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "dex-swap",
      "velocity_mins": 25
    },
    {
      "source": "0xStakingFarmMule01XXXXXXXXXXXXXXXXX",
      "target": "0xLendingPoolCollateralMule01XXXXXXX",
      "amount": 480.0,
      "token": "USDC",
      "token_symbol": "USDC",
      "timestamp_utc": 1788901550,
      "time_str": "21:05 UTC",
      "tx_hash": "0xdefi02_lending_pool",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "dex-swap",
      "velocity_mins": 25
    },
    {
      "source": "0xLendingPoolCollateralMule01XXXXXXX",
      "target": "0xYieldAggregatorVaultMule01XXXXXXXX",
      "amount": 470.0,
      "token": "USDC",
      "token_symbol": "USDC",
      "timestamp_utc": 1788901600,
      "time_str": "21:06 UTC",
      "tx_hash": "0xdefi03_yield_vault",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "dex-swap",
      "velocity_mins": 26
    },
    {
      "source": "0xYieldAggregatorVaultMule01XXXXXXXX",
      "target": "0xDeFiExitBridgeMule01XXXXXXXXXXXXXX",
      "amount": 460.0,
      "token": "USDC",
      "token_symbol": "USDC",
      "timestamp_utc": 1788901650,
      "time_str": "21:07 UTC",
      "tx_hash": "0xdefi04_exit_bridge",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "dex-swap",
      "velocity_mins": 27
    },
    {
      "source": "0xDeFiExitBridgeMule01XXXXXXXXXXXXXX",
      "target": "0xCrossChainDestinationMule01XXXXXXX",
      "amount": 450.0,
      "token": "USDC",
      "token_symbol": "USDC",
      "timestamp_utc": 1788901700,
      "time_str": "21:08 UTC",
      "tx_hash": "0xdefi05_cross_chain_settle",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "dex-swap",
      "velocity_mins": 28
    },
    {
      "source": "0xGasStationFunder01XXXXXXXXXXXXXXXXX",
      "target": "0xDecoyLayerMule01XXXXXXXXXXXXXXXXXX",
      "amount": 0.02,
      "token": "ETH",
      "token_symbol": "ETH",
      "timestamp_utc": 1788901200,
      "time_str": "21:00 UTC",
      "tx_hash": "0xgas03_funding_eth_003",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "gas-funding",
      "velocity_mins": 20
    },
    {
      "source": "0xGasStationFunder02XXXXXXXXXXXXXXXXX",
      "target": "0xDecoyLayerMule02XXXXXXXXXXXXXXXXXX",
      "amount": 0.02,
      "token": "ETH",
      "token_symbol": "ETH",
      "timestamp_utc": 1788901210,
      "time_str": "21:00 UTC",
      "tx_hash": "0xgas04_funding_eth_004",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "gas-funding",
      "velocity_mins": 20
    },
    {
      "source": "0xAnonymizedAnomalousReceiver01XXXXX",
      "target": "0xOffshoreCleanWallet01XXXXXXXXXXXXX",
      "amount": 980.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788903500,
      "time_str": "21:38 UTC",
      "tx_hash": "0xclean01_offshore_holding",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "mixer-evasion",
      "velocity_mins": 58
    },
    {
      "source": "0xOffshoreCleanWallet01XXXXXXXXXXXXX",
      "target": "0xOffshoreCleanWallet02XXXXXXXXXXXXX",
      "amount": 970.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788903600,
      "time_str": "21:40 UTC",
      "tx_hash": "0xclean02_offshore_layering",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "mixer-evasion",
      "velocity_mins": 60
    },
    {
      "source": "0xExpandIn_bb77a119",
      "target": "0xMuleLayerB0000000000000000000000002",
      "amount": 750.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788952095,
      "time_str": "Expanded",
      "tx_hash": "0xexp1_32117b300e934758",
      "is_primary": false,
      "isCorePath": null,
      "parentBoxId": null,
      "velocity_mins": 60
    },
    {
      "source": "0xMuleLayerB0000000000000000000000002",
      "target": "0xExpandOut_44a1c24e",
      "amount": 450.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788953895,
      "time_str": "Expanded",
      "tx_hash": "0xexp2_f1db49831af14cfa",
      "is_primary": false,
      "isCorePath": null,
      "parentBoxId": null,
      "velocity_mins": 30
    }
  ],
  "brief": {
    "title": "Automated Layered Mule Laundering & Binance CEX Off-Ramp",
    "typology": "Task-Based Cyber Fraud / Structuring (EVM)",
    "time_to_exchange_mins": 60,
    "stolen_amount_usd": 12500.0,
    "intermediary_mules_count": 2,
    "identified_vasp": "Binance",
    "target_deposit_wallet": "0xMuleLayerB0000000000000000000000002",
    "recommended_legal_action": "Dispatch Section 94 BNSS preservation directive to Binance Nodal Compliance to debit-freeze target account.",
    "narrative": "Victim reported funds of 12,500.00 structured across 2 intermediary mule accounts within 60 minutes on the EVM network before consolidating and sweeping into Binance.",
    "case_risk_score": 99,
    "case_risk_severity": "CRITICAL",
    "case_risk_breakdown": {
      "max_node_risk": 99,
      "mule_conduits_flagged": 2,
      "peeling_structuring_detected": true,
      "rapid_velocity_detected": true
    }
  },
  "primary_path": [
    "0xVictim0002PigButcherDeFiXXXXXXX",
    "0xMuleLayerA0000000000000000000000001",
    "0xMuleLayerB0000000000000000000000002",
    "0xBinanceDeposit000000000000000000000001"
  ],
  "start": {
    "case_id": "CASE-TRON-ACE4025D",
    "trace_id": "912bf71a-8eb6-49a4-a9ce-b6f6677e83d1",
    "detected_chain": "EVM",
    "transfer_count": 30,
    "data_source": "standalone_cloud_preview",
    "warning": "Showing demo data — live source unavailable (Scenario: investment_scam_eth)",
    "reached_exchange": true,
    "destination_vasp": "Binance",
    "terminal_amount": 11500.0,
    "hop_count": 3,
    "trace_time_ms": 0.042,
    "primary_path_addresses": [
      "0xVictim0002PigButcherDeFiXXXXXXX",
      "0xMuleLayerA0000000000000000000000001",
      "0xMuleLayerB0000000000000000000000002",
      "0xBinanceDeposit000000000000000000000001"
    ],
    "typology_summary": "Task-Based Cyber Fraud / Structuring (EVM)"
  },
  "graph": {
    "case_id": "CASE-TRON-ACE4025D",
    "trace_id": "912bf71a-8eb6-49a4-a9ce-b6f6677e83d1",
    "data_source": "standalone_cloud_preview",
    "nodes": [
      {
        "id": "0xYieldAggregatorVaultMule01XXXXXXXX",
        "label": "[Peel Dust] 0xYieldA...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "runner-network",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "0xDecoyLayerMule04XXXXXXXXXXXXXXXXXX",
        "label": "[Peel Dust] 0xDecoyL...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "background-web",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "0xBinanceDeposit000000000000000000000001",
        "label": "[Binance User Deposit]",
        "node_type": "exchange_deposit",
        "node_class": "exchange_suspected",
        "risk_score": 95,
        "role_tag": "SUSPECT CEX DEPOSIT",
        "cluster_label": "Binance",
        "balance_hint": null,
        "label_confidence": 0.95,
        "is_on_primary_path": true,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "risk_severity": "CRITICAL",
        "risk_breakdown": {
          "cex_deposit_account": 95
        },
        "risk_rules": [
          {
            "rule_id": "CEX_DEPOSIT_ACCOUNT",
            "rule_name": "Verified/Suspect CEX Deposit Terminal",
            "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
            "points": 95,
            "confidence": 0.96
          }
        ],
        "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
      },
      {
        "id": "0xGasStationFunder02XXXXXXXXXXXXXXXXX",
        "label": "[Peel Dust] 0xGasSta...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "gas-refill",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 13 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "0xLendingPoolCollateralMule01XXXXXXX",
        "label": "[Peel Dust] 0xLendin...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "dex-swap",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "0xE592427A0AEce92De3Edee1F18E0157C05861564",
        "label": "[Peel Dust] 0xE59242...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "background-web",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "0xDecoyLayerMule01XXXXXXXXXXXXXXXXXX",
        "label": "[Peel Dust] 0xDecoyL...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "background-web",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "0xGasStationFunder01XXXXXXXXXXXXXXXXX",
        "label": "[Peel Dust] 0xGasSta...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "gas-refill",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 21 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "0xMixerRelayer01XXXXXXXXXXXXXXXXXXXXX",
        "label": "[Peel Dust] 0xMixerR...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "mixer-evasion",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 15 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "0xBinanceHotWallet000000000000000000001",
        "label": "[Binance Hot Wallet]",
        "node_type": "exchange_hotwallet",
        "node_class": "exchange_confirmed",
        "risk_score": 85,
        "role_tag": "HOT WALLET (SWEEP TERMINAL)",
        "cluster_label": "Binance",
        "balance_hint": null,
        "label_confidence": 0.99,
        "is_on_primary_path": false,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "risk_severity": "CRITICAL",
        "risk_breakdown": {
          "terminal_cex_hotwallet": 85
        },
        "risk_rules": [
          {
            "rule_id": "CEX_HOT_WALLET_TERMINAL",
            "rule_name": "Terminal VASP Hot Wallet",
            "description": "Centralized exchange omnibus hot wallet cluster where laundered funds consolidated.",
            "points": 85,
            "confidence": 0.99
          }
        ],
        "risk_explanation": "Terminal centralized exchange hot wallet cluster: Final off-ramp consolidation."
      },
      {
        "id": "0xMuleLayerB0000000000000000000000002",
        "label": "[Mule] 0xMuleLa...",
        "node_type": "mule",
        "node_class": "intermediary",
        "risk_score": 55,
        "role_tag": "HIGH VELOCITY MULE",
        "cluster_label": "Layering Ring",
        "balance_hint": null,
        "label_confidence": 0.85,
        "is_on_primary_path": true,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20,
          "cex_proximity_urgency": 15
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 14 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          },
          {
            "rule_id": "CEX_PROXIMITY_URGENCY",
            "rule_name": "Exchange Off-Ramp Proximity (<= 2 Hops)",
            "description": "Directly upstream of exchange deposit terminal (1 hops). High flight risk.",
            "points": 15,
            "confidence": 0.88
          }
        ],
        "risk_explanation": "MODERATE risk profile (55/100) triggered by 2 distinct heuristic rules: High-Velocity Mule Hop (< 30 min), Exchange Off-Ramp Proximity (<= 2 Hops)."
      },
      {
        "id": "0xOffshoreCleanWallet01XXXXXXXXXXXXX",
        "label": "[Peel Dust] 0xOffsho...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "background-web",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "0xOffshoreCryptoATM01XXXXXXXXXXXXXXX",
        "label": "[Peel Dust] 0xOffsho...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "background-web",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 15 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "0xUniswapLiquidityProviderMule01XXXXX",
        "label": "[Peel Dust] 0xUniswa...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "dex-swap",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 14 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "0xDecoyLayerMule02XXXXXXXXXXXXXXXXXX",
        "label": "[Peel Dust] 0xDecoyL...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "background-web",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "0x11b815efB8f581194ae79006d24E0d814B7697F6",
        "label": "[Peel Dust] 0x11b815...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "background-web",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640",
        "label": "[Peel Dust] 0x88e6A0...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "background-web",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "0xCrossChainDestinationMule01XXXXXXX",
        "label": "[Peel Dust] 0xCrossC...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "background-web",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 15 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "0xMuleLayerA0000000000000000000000001",
        "label": "[Mule] 0xMuleLa...",
        "node_type": "mule",
        "node_class": "intermediary",
        "risk_score": 55,
        "role_tag": "HIGH VELOCITY MULE",
        "cluster_label": "Layering Ring",
        "balance_hint": null,
        "label_confidence": 0.85,
        "is_on_primary_path": true,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20,
          "cex_proximity_urgency": 15
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 11 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          },
          {
            "rule_id": "CEX_PROXIMITY_URGENCY",
            "rule_name": "Exchange Off-Ramp Proximity (<= 2 Hops)",
            "description": "Directly upstream of exchange deposit terminal (2 hops). High flight risk.",
            "points": 15,
            "confidence": 0.88
          }
        ],
        "risk_explanation": "MODERATE risk profile (55/100) triggered by 2 distinct heuristic rules: High-Velocity Mule Hop (< 30 min), Exchange Off-Ramp Proximity (<= 2 Hops)."
      },
      {
        "id": "0xAnonymizedAnomalousReceiver01XXXXX",
        "label": "[Peel Dust] 0xAnonym...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "background-web",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 8 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "0xVictim0002PigButcherDeFiXXXXXXX",
        "label": "[Victim Reported Wallet]",
        "node_type": "victim",
        "node_class": "source_wallet",
        "risk_score": 10,
        "role_tag": "REPORTED VICTIM",
        "cluster_label": "Complainant",
        "balance_hint": null,
        "label_confidence": 1.0,
        "is_on_primary_path": true,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "risk_severity": "LOW",
        "risk_breakdown": {
          "victim_origin": 10
        },
        "risk_rules": [
          {
            "rule_id": "COMPLAINANT_VICTIM_ORIGIN",
            "rule_name": "Reported Victim Wallet",
            "description": "Complainant wallet identified in FIR as source of stolen funds.",
            "points": 10,
            "confidence": 1.0
          }
        ],
        "risk_explanation": "Complainant victim wallet: Verified fund source without laundering liability."
      },
      {
        "id": "0xDecoyLayerMule05XXXXXXXXXXXXXXXXXX",
        "label": "[Peel Dust] 0xDecoyL...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "background-web",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "0xDeFiExitBridgeMule01XXXXXXXXXXXXXX",
        "label": "[Peel Dust] 0xDeFiEx...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "background-web",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "0xOffshoreCleanWallet02XXXXXXXXXXXXX",
        "label": "[Peel Dust] 0xOffsho...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "background-web",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 15 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "0xOffshoreCryptoATM02XXXXXXXXXXXXXXX",
        "label": "[Peel Dust] 0xOffsho...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "background-web",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 15 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "0xDecoyLayerMule03XXXXXXXXXXXXXXXXXX",
        "label": "[Peel Dust] 0xDecoyL...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "background-web",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "0xd90e2f925da726b50c4ed8d0fb90ad053324f31b",
        "label": "[Tornado Cash (ETH)]",
        "node_type": "mixer",
        "node_class": "contract_or_mixer",
        "risk_score": 99,
        "role_tag": "SANCTIONED MIXER (TORNADO CASH)",
        "cluster_label": "Mixer Evasion",
        "balance_hint": null,
        "label_confidence": 0.99,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "mixer-evasion",
        "risk_severity": "CRITICAL",
        "risk_breakdown": {
          "baseline": 20,
          "mixer_penalty": 45,
          "peeling_structuring": 25,
          "velocity_sub_2hr": 10
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "MIXER_TUMBLER_INTERACTION",
            "rule_name": "Privacy Mixer Interaction",
            "description": "Direct conduit interaction with privacy tumbler protocol (e.g. Tornado Cash).",
            "points": 45,
            "confidence": 0.98
          },
          {
            "rule_id": "PEELING_CHAIN_STRUCTURING",
            "rule_name": "Peeling Chain Structuring",
            "description": "Asymmetric multi-output pattern detected (1-in, 2-out) peeling change from main fund conduit.",
            "points": 25,
            "confidence": 0.85
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_2HR",
            "rule_name": "Moderate-Velocity Hop (< 2 hrs)",
            "description": "Transferred funds in 41 mins, indicating coordinated layering ring behavior.",
            "points": 10,
            "confidence": 0.8
          }
        ],
        "risk_explanation": "CRITICAL risk profile (99/100) triggered by 3 distinct heuristic rules: Privacy Mixer Interaction, Peeling Chain Structuring, Moderate-Velocity Hop (< 2 hrs)."
      },
      {
        "id": "0xDecoyLayerMule06XXXXXXXXXXXXXXXXXX",
        "label": "[Peel Dust] 0xDecoyL...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "background-web",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "0xStakingFarmMule01XXXXXXXXXXXXXXXXX",
        "label": "[Peel Dust] 0xStakin...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "background-web",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 1 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "0xExpandIn_bb77a119",
        "label": "[Expanded Inbound] 0xExpa…",
        "node_type": "mule",
        "node_class": "intermediary",
        "risk_score": 75,
        "role_tag": "EXPANDED COUNTERPARTY",
        "cluster_label": "Expanded Cluster",
        "balance_hint": null,
        "label_confidence": 0.75,
        "is_on_primary_path": false,
        "isCorePath": null,
        "parentBoxId": null,
        "risk_severity": "HIGH",
        "risk_breakdown": null,
        "risk_rules": null,
        "risk_explanation": null
      },
      {
        "id": "0xExpandOut_44a1c24e",
        "label": "[Expanded Outbound] 0xExpa…",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 60,
        "role_tag": "EXPANDED COUNTERPARTY",
        "cluster_label": "Expanded Cluster",
        "balance_hint": null,
        "label_confidence": 0.7,
        "is_on_primary_path": false,
        "isCorePath": null,
        "parentBoxId": null,
        "risk_severity": "HIGH",
        "risk_breakdown": null,
        "risk_rules": null,
        "risk_explanation": null
      }
    ],
    "edges": [
      {
        "source": "0xVictim0002PigButcherDeFiXXXXXXX",
        "target": "0xMuleLayerA0000000000000000000000001",
        "amount": 12500.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788900000,
        "time_str": "20:40 UTC",
        "tx_hash": "0xb111111111111111111111111111111111111111111111111111111111111111",
        "is_primary": true,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "velocity_mins": 0
      },
      {
        "source": "0xMuleLayerA0000000000000000000000001",
        "target": "0xMuleLayerB0000000000000000000000002",
        "amount": 11500.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788900480,
        "time_str": "20:48 UTC",
        "tx_hash": "0xb222222222222222222222222222222222222222222222222222222222222222",
        "is_primary": true,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "velocity_mins": 8
      },
      {
        "source": "0xMuleLayerB0000000000000000000000002",
        "target": "0xBinanceDeposit000000000000000000000001",
        "amount": 11500.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788901200,
        "time_str": "21:00 UTC",
        "tx_hash": "0xb333333333333333333333333333333333333333333333333333333333333333",
        "is_primary": true,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "velocity_mins": 20
      },
      {
        "source": "0xBinanceDeposit000000000000000000000001",
        "target": "0xBinanceHotWallet000000000000000000001",
        "amount": 11500.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788901800,
        "time_str": "21:10 UTC",
        "tx_hash": "0xb444444444444444444444444444444444444444444444444444444444444444",
        "is_primary": false,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "velocity_mins": 30
      },
      {
        "source": "0xMuleLayerA0000000000000000000000001",
        "target": "0xd90e2f925da726b50c4ed8d0fb90ad053324f31b",
        "amount": 1000.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788900500,
        "time_str": "20:48 UTC",
        "tx_hash": "0xmixer01_tornado_cash_deposit_1000u",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "mixer-evasion",
        "velocity_mins": 8
      },
      {
        "source": "0xd90e2f925da726b50c4ed8d0fb90ad053324f31b",
        "target": "0xMixerRelayer01XXXXXXXXXXXXXXXXXXXXX",
        "amount": 10.0,
        "token": "ETH",
        "token_symbol": "ETH",
        "timestamp_utc": 1788900550,
        "time_str": "20:49 UTC",
        "tx_hash": "0xmixer02_tornado_relayer_fee",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "mixer-evasion",
        "velocity_mins": 9
      },
      {
        "source": "0xd90e2f925da726b50c4ed8d0fb90ad053324f31b",
        "target": "0xAnonymizedAnomalousReceiver01XXXXX",
        "amount": 990.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788903000,
        "time_str": "21:30 UTC",
        "tx_hash": "0xmixer03_tornado_withdrawal_unlinked",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "mixer-evasion",
        "velocity_mins": 50
      },
      {
        "source": "0xMuleLayerA0000000000000000000000001",
        "target": "0xE592427A0AEce92De3Edee1F18E0157C05861564",
        "amount": 500.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788900600,
        "time_str": "20:50 UTC",
        "tx_hash": "0xdex01_uniswap_v3_exact_input_swap",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "dex-swap",
        "velocity_mins": 10
      },
      {
        "source": "0xE592427A0AEce92De3Edee1F18E0157C05861564",
        "target": "0x11b815efB8f581194ae79006d24E0d814B7697F6",
        "amount": 500.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788900605,
        "time_str": "20:50 UTC",
        "tx_hash": "0xdex02_uniswap_v3_pool_liquidity_hop",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "dex-swap",
        "velocity_mins": 10
      },
      {
        "source": "0x11b815efB8f581194ae79006d24E0d814B7697F6",
        "target": "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640",
        "amount": 0.16,
        "token": "ETH",
        "token_symbol": "ETH",
        "timestamp_utc": 1788900610,
        "time_str": "20:50 UTC",
        "tx_hash": "0xdex03_pool_weth_usdc_crosshop",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "dex-swap",
        "velocity_mins": 10
      },
      {
        "source": "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640",
        "target": "0xUniswapLiquidityProviderMule01XXXXX",
        "amount": 492.0,
        "token": "USDC",
        "token_symbol": "USDC",
        "timestamp_utc": 1788900620,
        "time_str": "20:50 UTC",
        "tx_hash": "0xdex04_lp_mule_settlement",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "dex-swap",
        "velocity_mins": 10
      },
      {
        "source": "0xGasStationFunder01XXXXXXXXXXXXXXXXX",
        "target": "0xMuleLayerA0000000000000000000000001",
        "amount": 0.05,
        "token": "ETH",
        "token_symbol": "ETH",
        "timestamp_utc": 1788899900,
        "time_str": "20:38 UTC",
        "tx_hash": "0xgas01_funding_eth_001",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "gas-funding",
        "velocity_mins": 0
      },
      {
        "source": "0xGasStationFunder02XXXXXXXXXXXXXXXXX",
        "target": "0xMuleLayerB0000000000000000000000002",
        "amount": 0.04,
        "token": "ETH",
        "token_symbol": "ETH",
        "timestamp_utc": 1788900400,
        "time_str": "20:46 UTC",
        "tx_hash": "0xgas02_funding_eth_002",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "gas-funding",
        "velocity_mins": 6
      },
      {
        "source": "0xMuleLayerB0000000000000000000000002",
        "target": "0xDecoyLayerMule01XXXXXXXXXXXXXXXXXX",
        "amount": 180.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788901250,
        "time_str": "21:00 UTC",
        "tx_hash": "0xdecoy01_layering_split_a",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "layering-decoy",
        "velocity_mins": 20
      },
      {
        "source": "0xMuleLayerB0000000000000000000000002",
        "target": "0xDecoyLayerMule02XXXXXXXXXXXXXXXXXX",
        "amount": 140.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788901260,
        "time_str": "21:01 UTC",
        "tx_hash": "0xdecoy02_layering_split_b",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "layering-decoy",
        "velocity_mins": 21
      },
      {
        "source": "0xDecoyLayerMule01XXXXXXXXXXXXXXXXXX",
        "target": "0xDecoyLayerMule03XXXXXXXXXXXXXXXXXX",
        "amount": 110.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788901300,
        "time_str": "21:01 UTC",
        "tx_hash": "0xdecoy03_layering_split_c",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "layering-decoy",
        "velocity_mins": 21
      },
      {
        "source": "0xDecoyLayerMule02XXXXXXXXXXXXXXXXXX",
        "target": "0xDecoyLayerMule04XXXXXXXXXXXXXXXXXX",
        "amount": 95.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788901310,
        "time_str": "21:01 UTC",
        "tx_hash": "0xdecoy04_layering_split_d",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "layering-decoy",
        "velocity_mins": 21
      },
      {
        "source": "0xDecoyLayerMule03XXXXXXXXXXXXXXXXXX",
        "target": "0xDecoyLayerMule05XXXXXXXXXXXXXXXXXX",
        "amount": 70.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788901350,
        "time_str": "21:02 UTC",
        "tx_hash": "0xdecoy05_layering_split_e",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "layering-decoy",
        "velocity_mins": 22
      },
      {
        "source": "0xDecoyLayerMule04XXXXXXXXXXXXXXXXXX",
        "target": "0xDecoyLayerMule06XXXXXXXXXXXXXXXXXX",
        "amount": 60.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788901360,
        "time_str": "21:02 UTC",
        "tx_hash": "0xdecoy06_layering_split_f",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "layering-decoy",
        "velocity_mins": 22
      },
      {
        "source": "0xDecoyLayerMule05XXXXXXXXXXXXXXXXXX",
        "target": "0xOffshoreCryptoATM01XXXXXXXXXXXXXXX",
        "amount": 50.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788901400,
        "time_str": "21:03 UTC",
        "tx_hash": "0xdecoy07_atm_exit_01",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "layering-decoy",
        "velocity_mins": 23
      },
      {
        "source": "0xDecoyLayerMule06XXXXXXXXXXXXXXXXXX",
        "target": "0xOffshoreCryptoATM02XXXXXXXXXXXXXXX",
        "amount": 45.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788901410,
        "time_str": "21:03 UTC",
        "tx_hash": "0xdecoy08_atm_exit_02",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "layering-decoy",
        "velocity_mins": 23
      },
      {
        "source": "0xUniswapLiquidityProviderMule01XXXXX",
        "target": "0xStakingFarmMule01XXXXXXXXXXXXXXXXX",
        "amount": 490.0,
        "token": "USDC",
        "token_symbol": "USDC",
        "timestamp_utc": 1788901500,
        "time_str": "21:05 UTC",
        "tx_hash": "0xdefi01_staking_deposit",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "dex-swap",
        "velocity_mins": 25
      },
      {
        "source": "0xStakingFarmMule01XXXXXXXXXXXXXXXXX",
        "target": "0xLendingPoolCollateralMule01XXXXXXX",
        "amount": 480.0,
        "token": "USDC",
        "token_symbol": "USDC",
        "timestamp_utc": 1788901550,
        "time_str": "21:05 UTC",
        "tx_hash": "0xdefi02_lending_pool",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "dex-swap",
        "velocity_mins": 25
      },
      {
        "source": "0xLendingPoolCollateralMule01XXXXXXX",
        "target": "0xYieldAggregatorVaultMule01XXXXXXXX",
        "amount": 470.0,
        "token": "USDC",
        "token_symbol": "USDC",
        "timestamp_utc": 1788901600,
        "time_str": "21:06 UTC",
        "tx_hash": "0xdefi03_yield_vault",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "dex-swap",
        "velocity_mins": 26
      },
      {
        "source": "0xYieldAggregatorVaultMule01XXXXXXXX",
        "target": "0xDeFiExitBridgeMule01XXXXXXXXXXXXXX",
        "amount": 460.0,
        "token": "USDC",
        "token_symbol": "USDC",
        "timestamp_utc": 1788901650,
        "time_str": "21:07 UTC",
        "tx_hash": "0xdefi04_exit_bridge",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "dex-swap",
        "velocity_mins": 27
      },
      {
        "source": "0xDeFiExitBridgeMule01XXXXXXXXXXXXXX",
        "target": "0xCrossChainDestinationMule01XXXXXXX",
        "amount": 450.0,
        "token": "USDC",
        "token_symbol": "USDC",
        "timestamp_utc": 1788901700,
        "time_str": "21:08 UTC",
        "tx_hash": "0xdefi05_cross_chain_settle",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "dex-swap",
        "velocity_mins": 28
      },
      {
        "source": "0xGasStationFunder01XXXXXXXXXXXXXXXXX",
        "target": "0xDecoyLayerMule01XXXXXXXXXXXXXXXXXX",
        "amount": 0.02,
        "token": "ETH",
        "token_symbol": "ETH",
        "timestamp_utc": 1788901200,
        "time_str": "21:00 UTC",
        "tx_hash": "0xgas03_funding_eth_003",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "gas-funding",
        "velocity_mins": 20
      },
      {
        "source": "0xGasStationFunder02XXXXXXXXXXXXXXXXX",
        "target": "0xDecoyLayerMule02XXXXXXXXXXXXXXXXXX",
        "amount": 0.02,
        "token": "ETH",
        "token_symbol": "ETH",
        "timestamp_utc": 1788901210,
        "time_str": "21:00 UTC",
        "tx_hash": "0xgas04_funding_eth_004",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "gas-funding",
        "velocity_mins": 20
      },
      {
        "source": "0xAnonymizedAnomalousReceiver01XXXXX",
        "target": "0xOffshoreCleanWallet01XXXXXXXXXXXXX",
        "amount": 980.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788903500,
        "time_str": "21:38 UTC",
        "tx_hash": "0xclean01_offshore_holding",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "mixer-evasion",
        "velocity_mins": 58
      },
      {
        "source": "0xOffshoreCleanWallet01XXXXXXXXXXXXX",
        "target": "0xOffshoreCleanWallet02XXXXXXXXXXXXX",
        "amount": 970.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788903600,
        "time_str": "21:40 UTC",
        "tx_hash": "0xclean02_offshore_layering",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "mixer-evasion",
        "velocity_mins": 60
      },
      {
        "source": "0xExpandIn_bb77a119",
        "target": "0xMuleLayerB0000000000000000000000002",
        "amount": 750.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788952095,
        "time_str": "Expanded",
        "tx_hash": "0xexp1_32117b300e934758",
        "is_primary": false,
        "isCorePath": null,
        "parentBoxId": null,
        "velocity_mins": 60
      },
      {
        "source": "0xMuleLayerB0000000000000000000000002",
        "target": "0xExpandOut_44a1c24e",
        "amount": 450.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788953895,
        "time_str": "Expanded",
        "tx_hash": "0xexp2_f1db49831af14cfa",
        "is_primary": false,
        "isCorePath": null,
        "parentBoxId": null,
        "velocity_mins": 30
      }
    ],
    "brief": {
      "title": "Automated Layered Mule Laundering & Binance CEX Off-Ramp",
      "typology": "Task-Based Cyber Fraud / Structuring (EVM)",
      "time_to_exchange_mins": 60,
      "stolen_amount_usd": 12500.0,
      "intermediary_mules_count": 2,
      "identified_vasp": "Binance",
      "target_deposit_wallet": "0xMuleLayerB0000000000000000000000002",
      "recommended_legal_action": "Dispatch Section 94 BNSS preservation directive to Binance Nodal Compliance to debit-freeze target account.",
      "narrative": "Victim reported funds of 12,500.00 structured across 2 intermediary mule accounts within 60 minutes on the EVM network before consolidating and sweeping into Binance.",
      "case_risk_score": 99,
      "case_risk_severity": "CRITICAL",
      "case_risk_breakdown": {
        "max_node_risk": 99,
        "mule_conduits_flagged": 2,
        "peeling_structuring_detected": true,
        "rapid_velocity_detected": true
      }
    },
    "primary_path": [
      "0xVictim0002PigButcherDeFiXXXXXXX",
      "0xMuleLayerA0000000000000000000000001",
      "0xMuleLayerB0000000000000000000000002",
      "0xBinanceDeposit000000000000000000000001"
    ]
  },
  "off_ramp": {
    "found": true,
    "hops_searched": 3,
    "truncated": false,
    "path": [
      {
        "source": "0xVictim0002PigButcherDeFiXXXXXXX",
        "target": "0xMuleLayerA0000000000000000000000001",
        "amount": 12500.0,
        "token": "USDT",
        "tx_hash": "0xb111111111111111111111111111111111111111111111111111111111111111",
        "timestamp_utc": 1788900000
      },
      {
        "source": "0xMuleLayerA0000000000000000000000001",
        "target": "0xMuleLayerB0000000000000000000000002",
        "amount": 11500.0,
        "token": "USDT",
        "tx_hash": "0xb222222222222222222222222222222222222222222222222222222222222222",
        "timestamp_utc": 1788900480
      },
      {
        "source": "0xMuleLayerB0000000000000000000000002",
        "target": "0xBinanceDeposit000000000000000000000001",
        "amount": 11500.0,
        "token": "USDT",
        "tx_hash": "0xb333333333333333333333333333333333333333333333333333333333333333",
        "timestamp_utc": 1788901200
      }
    ],
    "terminal_label": "[Binance User Deposit]",
    "disclaimer": "Heuristic off-ramp detection is an investigative lead, not conclusive proof of account ownership or CEX deposit attribution. Verification with exchange compliance under Section 94 BNSS is required."
  },
  "expansions": {
    "0xMuleLayerB0000000000000000000000002": {
      "expanded_address": "0xMuleLayerB0000000000000000000000002",
      "new_nodes": [
        {
          "id": "0xExpandIn_bb77a119",
          "label": "[Expanded Inbound] 0xExpa…",
          "node_type": "mule",
          "node_class": "intermediary",
          "risk_score": 75,
          "role_tag": "EXPANDED COUNTERPARTY",
          "cluster_label": "Expanded Cluster",
          "balance_hint": null,
          "label_confidence": 0.75,
          "is_on_primary_path": false,
          "isCorePath": null,
          "parentBoxId": null,
          "risk_severity": "HIGH",
          "risk_breakdown": null,
          "risk_rules": null,
          "risk_explanation": null
        },
        {
          "id": "0xExpandOut_44a1c24e",
          "label": "[Expanded Outbound] 0xExpa…",
          "node_type": "peel_outlet",
          "node_class": "unknown",
          "risk_score": 60,
          "role_tag": "EXPANDED COUNTERPARTY",
          "cluster_label": "Expanded Cluster",
          "balance_hint": null,
          "label_confidence": 0.7,
          "is_on_primary_path": false,
          "isCorePath": null,
          "parentBoxId": null,
          "risk_severity": "HIGH",
          "risk_breakdown": null,
          "risk_rules": null,
          "risk_explanation": null
        }
      ],
      "new_edges": [
        {
          "source": "0xExpandIn_bb77a119",
          "target": "0xMuleLayerB0000000000000000000000002",
          "amount": 750.0,
          "token": "USDT",
          "token_symbol": "USDT",
          "timestamp_utc": 1788952095,
          "time_str": "Expanded",
          "tx_hash": "0xexp1_32117b300e934758",
          "is_primary": false,
          "isCorePath": null,
          "parentBoxId": null,
          "velocity_mins": 60
        },
        {
          "source": "0xMuleLayerB0000000000000000000000002",
          "target": "0xExpandOut_44a1c24e",
          "amount": 450.0,
          "token": "USDT",
          "token_symbol": "USDT",
          "timestamp_utc": 1788953895,
          "time_str": "Expanded",
          "tx_hash": "0xexp2_f1db49831af14cfa",
          "is_primary": false,
          "isCorePath": null,
          "parentBoxId": null,
          "velocity_mins": 30
        }
      ],
      "total_nodes": 31,
      "total_edges": 32
    }
  }
},
  loan_syndicate_multicex: {
  "scenario_id": "loan_syndicate_multicex",
  "scenario_name": "loan_syndicate_multicex",
  "target_address": "0xVictim0003LoanAppExtortionXXXXX",
  "case_id": "CASE-TRON-876E8E94",
  "trace_id": "8934b370-938c-44f6-befd-15d43d92a24a",
  "detected_chain": "EVM",
  "transfer_count": 36,
  "data_source": "standalone_cloud_preview",
  "warning": "Cloud Preview Mode: Backend offline. Serving bundled static forensic dataset.",
  "reached_exchange": true,
  "destination_vasp": "WazirX",
  "terminal_amount": 5000.0,
  "hop_count": 3,
  "trace_time_ms": 0.042,
  "primary_path_addresses": [
    "0xVictim0003LoanAppExtortionXXXXX",
    "0xSyndicateDistributor00000000000001",
    "0xMuleWazirX00000000000000000000000001",
    "0xWazirXDeposit000000000000000000000001"
  ],
  "typology_summary": "Task-Based Cyber Fraud / Structuring (EVM)",
  "nodes": [
    {
      "id": "0xWazirXDeposit000000000000000000000001",
      "label": "[WazirX User Deposit]",
      "node_type": "exchange_deposit",
      "node_class": "exchange_suspected",
      "risk_score": 95,
      "role_tag": "SUSPECT CEX DEPOSIT",
      "cluster_label": "WazirX",
      "balance_hint": null,
      "label_confidence": 0.95,
      "is_on_primary_path": true,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "risk_severity": "CRITICAL",
      "risk_breakdown": {
        "cex_deposit_account": 95
      },
      "risk_rules": [
        {
          "rule_id": "CEX_DEPOSIT_ACCOUNT",
          "rule_name": "Verified/Suspect CEX Deposit Terminal",
          "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
          "points": 95,
          "confidence": 0.96
        }
      ],
      "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
    },
    {
      "id": "0xMaticGasFunder01XXXXXXXXXXXXXXXXXX",
      "label": "[Suspected Exchange User Deposit]",
      "node_type": "exchange_deposit",
      "node_class": "exchange_suspected",
      "risk_score": 95,
      "role_tag": "SUSPECT CEX DEPOSIT",
      "cluster_label": "Sweep Cluster",
      "balance_hint": null,
      "label_confidence": 0.7,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "gas-refill",
      "risk_severity": "CRITICAL",
      "risk_breakdown": {
        "cex_deposit_account": 95
      },
      "risk_rules": [
        {
          "rule_id": "CEX_DEPOSIT_ACCOUNT",
          "rule_name": "Verified/Suspect CEX Deposit Terminal",
          "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
          "points": 95,
          "confidence": 0.96
        }
      ],
      "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
    },
    {
      "id": "0xRunner08XXXXXXXXXXXXXXXXXXXXXXXXXX",
      "label": "[Suspected Exchange User Deposit]",
      "node_type": "exchange_deposit",
      "node_class": "exchange_suspected",
      "risk_score": 95,
      "role_tag": "SUSPECT CEX DEPOSIT",
      "cluster_label": "Sweep Cluster",
      "balance_hint": null,
      "label_confidence": 0.8,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "runner-network",
      "risk_severity": "CRITICAL",
      "risk_breakdown": {
        "cex_deposit_account": 95
      },
      "risk_rules": [
        {
          "rule_id": "CEX_DEPOSIT_ACCOUNT",
          "rule_name": "Verified/Suspect CEX Deposit Terminal",
          "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
          "points": 95,
          "confidence": 0.96
        }
      ],
      "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
    },
    {
      "id": "0xRunner01XXXXXXXXXXXXXXXXXXXXXXXXXX",
      "label": "[Suspected Exchange User Deposit]",
      "node_type": "exchange_deposit",
      "node_class": "exchange_suspected",
      "risk_score": 95,
      "role_tag": "SUSPECT CEX DEPOSIT",
      "cluster_label": "Sweep Cluster",
      "balance_hint": null,
      "label_confidence": 0.8,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "runner-network",
      "risk_severity": "CRITICAL",
      "risk_breakdown": {
        "cex_deposit_account": 95
      },
      "risk_rules": [
        {
          "rule_id": "CEX_DEPOSIT_ACCOUNT",
          "rule_name": "Verified/Suspect CEX Deposit Terminal",
          "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
          "points": 95,
          "confidence": 0.96
        }
      ],
      "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
    },
    {
      "id": "0xZebPayDeposit0000000000000000000000001",
      "label": "[Peel Dust] 0xZebPay...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 10 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "0xBankAccountRentalBroker01XXXXXXXXX",
      "label": "[Peel Dust] 0xBankAc...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "background-web",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 15 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "0xZebPayHotWallet00000000000000000000001",
      "label": "[Peel Dust] 0xZebPay...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 15 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "0xRunner04XXXXXXXXXXXXXXXXXXXXXXXXXX",
      "label": "[Suspected Exchange User Deposit]",
      "node_type": "exchange_deposit",
      "node_class": "exchange_suspected",
      "risk_score": 95,
      "role_tag": "SUSPECT CEX DEPOSIT",
      "cluster_label": "Sweep Cluster",
      "balance_hint": null,
      "label_confidence": 0.8,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "runner-network",
      "risk_severity": "CRITICAL",
      "risk_breakdown": {
        "cex_deposit_account": 95
      },
      "risk_rules": [
        {
          "rule_id": "CEX_DEPOSIT_ACCOUNT",
          "rule_name": "Verified/Suspect CEX Deposit Terminal",
          "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
          "points": 95,
          "confidence": 0.96
        }
      ],
      "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
    },
    {
      "id": "0xRunner07XXXXXXXXXXXXXXXXXXXXXXXXXX",
      "label": "[Suspected Exchange User Deposit]",
      "node_type": "exchange_deposit",
      "node_class": "exchange_suspected",
      "risk_score": 95,
      "role_tag": "SUSPECT CEX DEPOSIT",
      "cluster_label": "Sweep Cluster",
      "balance_hint": null,
      "label_confidence": 0.8,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "runner-network",
      "risk_severity": "CRITICAL",
      "risk_breakdown": {
        "cex_deposit_account": 95
      },
      "risk_rules": [
        {
          "rule_id": "CEX_DEPOSIT_ACCOUNT",
          "rule_name": "Verified/Suspect CEX Deposit Terminal",
          "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
          "points": 95,
          "confidence": 0.96
        }
      ],
      "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
    },
    {
      "id": "0xSimCardSellerPayout01XXXXXXXXXXXXX",
      "label": "[Peel Dust] 0xSimCar...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "background-web",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 15 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "0xMaticGasFunder02XXXXXXXXXXXXXXXXXX",
      "label": "[Suspected Exchange User Deposit]",
      "node_type": "exchange_deposit",
      "node_class": "exchange_suspected",
      "risk_score": 95,
      "role_tag": "SUSPECT CEX DEPOSIT",
      "cluster_label": "Sweep Cluster",
      "balance_hint": null,
      "label_confidence": 0.7,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "gas-refill",
      "risk_severity": "CRITICAL",
      "risk_breakdown": {
        "cex_deposit_account": 95
      },
      "risk_rules": [
        {
          "rule_id": "CEX_DEPOSIT_ACCOUNT",
          "rule_name": "Verified/Suspect CEX Deposit Terminal",
          "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
          "points": 95,
          "confidence": 0.96
        }
      ],
      "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
    },
    {
      "id": "0xRunner09XXXXXXXXXXXXXXXXXXXXXXXXXX",
      "label": "[Suspected Exchange User Deposit]",
      "node_type": "exchange_deposit",
      "node_class": "exchange_suspected",
      "risk_score": 95,
      "role_tag": "SUSPECT CEX DEPOSIT",
      "cluster_label": "Sweep Cluster",
      "balance_hint": null,
      "label_confidence": 0.8,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "runner-network",
      "risk_severity": "CRITICAL",
      "risk_breakdown": {
        "cex_deposit_account": 95
      },
      "risk_rules": [
        {
          "rule_id": "CEX_DEPOSIT_ACCOUNT",
          "rule_name": "Verified/Suspect CEX Deposit Terminal",
          "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
          "points": 95,
          "confidence": 0.96
        }
      ],
      "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
    },
    {
      "id": "0xMuleZebPay00000000000000000000000001",
      "label": "[Suspected CEX Deposit]",
      "node_type": "exchange_deposit",
      "node_class": "exchange_suspected",
      "risk_score": 95,
      "role_tag": "SUSPECT CEX DEPOSIT",
      "cluster_label": "Sweep Cluster",
      "balance_hint": null,
      "label_confidence": 0.7000000000000001,
      "is_on_primary_path": false,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "risk_severity": "CRITICAL",
      "risk_breakdown": {
        "cex_deposit_account": 95
      },
      "risk_rules": [
        {
          "rule_id": "CEX_DEPOSIT_ACCOUNT",
          "rule_name": "Verified/Suspect CEX Deposit Terminal",
          "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
          "points": 95,
          "confidence": 0.96
        }
      ],
      "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
    },
    {
      "id": "0xRunner05XXXXXXXXXXXXXXXXXXXXXXXXXX",
      "label": "[Suspected Exchange User Deposit]",
      "node_type": "exchange_deposit",
      "node_class": "exchange_suspected",
      "risk_score": 95,
      "role_tag": "SUSPECT CEX DEPOSIT",
      "cluster_label": "Sweep Cluster",
      "balance_hint": null,
      "label_confidence": 0.8,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "runner-network",
      "risk_severity": "CRITICAL",
      "risk_breakdown": {
        "cex_deposit_account": 95
      },
      "risk_rules": [
        {
          "rule_id": "CEX_DEPOSIT_ACCOUNT",
          "rule_name": "Verified/Suspect CEX Deposit Terminal",
          "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
          "points": 95,
          "confidence": 0.96
        }
      ],
      "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
    },
    {
      "id": "0xRunner10XXXXXXXXXXXXXXXXXXXXXXXXXX",
      "label": "[Suspected Exchange User Deposit]",
      "node_type": "exchange_deposit",
      "node_class": "exchange_suspected",
      "risk_score": 95,
      "role_tag": "SUSPECT CEX DEPOSIT",
      "cluster_label": "Sweep Cluster",
      "balance_hint": null,
      "label_confidence": 0.8,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "runner-network",
      "risk_severity": "CRITICAL",
      "risk_breakdown": {
        "cex_deposit_account": 95
      },
      "risk_rules": [
        {
          "rule_id": "CEX_DEPOSIT_ACCOUNT",
          "rule_name": "Verified/Suspect CEX Deposit Terminal",
          "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
          "points": 95,
          "confidence": 0.96
        }
      ],
      "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
    },
    {
      "id": "0xVictim0003LoanAppExtortionXXXXX",
      "label": "[Victim Reported Wallet]",
      "node_type": "victim",
      "node_class": "source_wallet",
      "risk_score": 10,
      "role_tag": "REPORTED VICTIM",
      "cluster_label": "Complainant",
      "balance_hint": null,
      "label_confidence": 1.0,
      "is_on_primary_path": true,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "risk_severity": "LOW",
      "risk_breakdown": {
        "victim_origin": 10
      },
      "risk_rules": [
        {
          "rule_id": "COMPLAINANT_VICTIM_ORIGIN",
          "rule_name": "Reported Victim Wallet",
          "description": "Complainant wallet identified in FIR as source of stolen funds.",
          "points": 10,
          "confidence": 1.0
        }
      ],
      "risk_explanation": "Complainant victim wallet: Verified fund source without laundering liability."
    },
    {
      "id": "0xMuleWazirX00000000000000000000000001",
      "label": "[Mule] 0xMuleWa...",
      "node_type": "mule",
      "node_class": "intermediary",
      "risk_score": 55,
      "role_tag": "HIGH VELOCITY MULE",
      "cluster_label": "Layering Ring",
      "balance_hint": null,
      "label_confidence": 0.85,
      "is_on_primary_path": true,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20,
        "cex_proximity_urgency": 15
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 10 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        },
        {
          "rule_id": "CEX_PROXIMITY_URGENCY",
          "rule_name": "Exchange Off-Ramp Proximity (<= 2 Hops)",
          "description": "Directly upstream of exchange deposit terminal (1 hops). High flight risk.",
          "points": 15,
          "confidence": 0.88
        }
      ],
      "risk_explanation": "MODERATE risk profile (55/100) triggered by 2 distinct heuristic rules: High-Velocity Mule Hop (< 30 min), Exchange Off-Ramp Proximity (<= 2 Hops)."
    },
    {
      "id": "0xRunner03XXXXXXXXXXXXXXXXXXXXXXXXXX",
      "label": "[Suspected Exchange User Deposit]",
      "node_type": "exchange_deposit",
      "node_class": "exchange_suspected",
      "risk_score": 95,
      "role_tag": "SUSPECT CEX DEPOSIT",
      "cluster_label": "Sweep Cluster",
      "balance_hint": null,
      "label_confidence": 0.8,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "runner-network",
      "risk_severity": "CRITICAL",
      "risk_breakdown": {
        "cex_deposit_account": 95
      },
      "risk_rules": [
        {
          "rule_id": "CEX_DEPOSIT_ACCOUNT",
          "rule_name": "Verified/Suspect CEX Deposit Terminal",
          "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
          "points": 95,
          "confidence": 0.96
        }
      ],
      "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
    },
    {
      "id": "0xAggregatorNode01XXXXXXXXXXXXXXXXXX",
      "label": "[Suspected CEX Deposit]",
      "node_type": "exchange_deposit",
      "node_class": "exchange_suspected",
      "risk_score": 95,
      "role_tag": "SUSPECT CEX DEPOSIT",
      "cluster_label": "Sweep Cluster",
      "balance_hint": null,
      "label_confidence": 0.8,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "runner-network",
      "risk_severity": "CRITICAL",
      "risk_breakdown": {
        "cex_deposit_account": 95
      },
      "risk_rules": [
        {
          "rule_id": "CEX_DEPOSIT_ACCOUNT",
          "rule_name": "Verified/Suspect CEX Deposit Terminal",
          "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
          "points": 95,
          "confidence": 0.96
        }
      ],
      "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
    },
    {
      "id": "0xRunner02XXXXXXXXXXXXXXXXXXXXXXXXXX",
      "label": "[Suspected Exchange User Deposit]",
      "node_type": "exchange_deposit",
      "node_class": "exchange_suspected",
      "risk_score": 95,
      "role_tag": "SUSPECT CEX DEPOSIT",
      "cluster_label": "Sweep Cluster",
      "balance_hint": null,
      "label_confidence": 0.8,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "runner-network",
      "risk_severity": "CRITICAL",
      "risk_breakdown": {
        "cex_deposit_account": 95
      },
      "risk_rules": [
        {
          "rule_id": "CEX_DEPOSIT_ACCOUNT",
          "rule_name": "Verified/Suspect CEX Deposit Terminal",
          "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
          "points": 95,
          "confidence": 0.96
        }
      ],
      "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
    },
    {
      "id": "0xWazirXHotWallet000000000000000000001",
      "label": "[Peel Dust] 0xWazirX...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 15 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "0xSyndicateDistributor00000000000001",
      "label": "[Mule] 0xSyndic...",
      "node_type": "mule",
      "node_class": "intermediary",
      "risk_score": 55,
      "role_tag": "HIGH VELOCITY MULE",
      "cluster_label": "Layering Ring",
      "balance_hint": null,
      "label_confidence": 0.85,
      "is_on_primary_path": true,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20,
        "cex_proximity_urgency": 15
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 9 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        },
        {
          "rule_id": "CEX_PROXIMITY_URGENCY",
          "rule_name": "Exchange Off-Ramp Proximity (<= 2 Hops)",
          "description": "Directly upstream of exchange deposit terminal (2 hops). High flight risk.",
          "points": 15,
          "confidence": 0.88
        }
      ],
      "risk_explanation": "MODERATE risk profile (55/100) triggered by 2 distinct heuristic rules: High-Velocity Mule Hop (< 30 min), Exchange Off-Ramp Proximity (<= 2 Hops)."
    },
    {
      "id": "0xRunner06XXXXXXXXXXXXXXXXXXXXXXXXXX",
      "label": "[Suspected Exchange User Deposit]",
      "node_type": "exchange_deposit",
      "node_class": "exchange_suspected",
      "risk_score": 95,
      "role_tag": "SUSPECT CEX DEPOSIT",
      "cluster_label": "Sweep Cluster",
      "balance_hint": null,
      "label_confidence": 0.8,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "runner-network",
      "risk_severity": "CRITICAL",
      "risk_breakdown": {
        "cex_deposit_account": 95
      },
      "risk_rules": [
        {
          "rule_id": "CEX_DEPOSIT_ACCOUNT",
          "rule_name": "Verified/Suspect CEX Deposit Terminal",
          "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
          "points": 95,
          "confidence": 0.96
        }
      ],
      "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
    },
    {
      "id": "0xAggregatorNode02XXXXXXXXXXXXXXXXXX",
      "label": "[Suspected CEX Deposit]",
      "node_type": "exchange_deposit",
      "node_class": "exchange_suspected",
      "risk_score": 95,
      "role_tag": "SUSPECT CEX DEPOSIT",
      "cluster_label": "Sweep Cluster",
      "balance_hint": null,
      "label_confidence": 0.8,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "runner-network",
      "risk_severity": "CRITICAL",
      "risk_breakdown": {
        "cex_deposit_account": 95
      },
      "risk_rules": [
        {
          "rule_id": "CEX_DEPOSIT_ACCOUNT",
          "rule_name": "Verified/Suspect CEX Deposit Terminal",
          "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
          "points": 95,
          "confidence": 0.96
        }
      ],
      "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
    },
    {
      "id": "0xExpandIn_aa16f68d",
      "label": "[Expanded Inbound] 0xExpa…",
      "node_type": "mule",
      "node_class": "intermediary",
      "risk_score": 75,
      "role_tag": "EXPANDED COUNTERPARTY",
      "cluster_label": "Expanded Cluster",
      "balance_hint": null,
      "label_confidence": 0.75,
      "is_on_primary_path": false,
      "isCorePath": null,
      "parentBoxId": null,
      "risk_severity": "HIGH",
      "risk_breakdown": null,
      "risk_rules": null,
      "risk_explanation": null
    },
    {
      "id": "0xExpandOut_c60a5d49",
      "label": "[Expanded Outbound] 0xExpa…",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 60,
      "role_tag": "EXPANDED COUNTERPARTY",
      "cluster_label": "Expanded Cluster",
      "balance_hint": null,
      "label_confidence": 0.7,
      "is_on_primary_path": false,
      "isCorePath": null,
      "parentBoxId": null,
      "risk_severity": "HIGH",
      "risk_breakdown": null,
      "risk_rules": null,
      "risk_explanation": null
    }
  ],
  "edges": [
    {
      "source": "0xVictim0003LoanAppExtortionXXXXX",
      "target": "0xSyndicateDistributor00000000000001",
      "amount": 8200.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788920000,
      "time_str": "02:13 UTC",
      "tx_hash": "0xext01_victim_extortion_usdt_primary",
      "is_primary": true,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "velocity_mins": 0
    },
    {
      "source": "0xSyndicateDistributor00000000000001",
      "target": "0xMuleWazirX00000000000000000000000001",
      "amount": 5000.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788920300,
      "time_str": "02:18 UTC",
      "tx_hash": "0xext02_split_wazirx_conduit_5000",
      "is_primary": true,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "velocity_mins": 5
    },
    {
      "source": "0xMuleWazirX00000000000000000000000001",
      "target": "0xWazirXDeposit000000000000000000000001",
      "amount": 5000.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788920900,
      "time_str": "02:28 UTC",
      "tx_hash": "0xext03_wazirx_deposit_5000",
      "is_primary": true,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "velocity_mins": 15
    },
    {
      "source": "0xWazirXDeposit000000000000000000000001",
      "target": "0xWazirXHotWallet000000000000000000001",
      "amount": 5000.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788921500,
      "time_str": "02:38 UTC",
      "tx_hash": "0xext04_wazirx_sweep_to_hotwallet",
      "is_primary": false,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "velocity_mins": 25
    },
    {
      "source": "0xSyndicateDistributor00000000000001",
      "target": "0xMuleZebPay00000000000000000000000001",
      "amount": 3200.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788920310,
      "time_str": "02:18 UTC",
      "tx_hash": "0xext05_split_zebpay_conduit_3200",
      "is_primary": false,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "velocity_mins": 5
    },
    {
      "source": "0xMuleZebPay00000000000000000000000001",
      "target": "0xZebPayDeposit0000000000000000000000001",
      "amount": 3200.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788920920,
      "time_str": "02:28 UTC",
      "tx_hash": "0xext06_zebpay_deposit_3200",
      "is_primary": false,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "velocity_mins": 15
    },
    {
      "source": "0xZebPayDeposit0000000000000000000000001",
      "target": "0xZebPayHotWallet00000000000000000000001",
      "amount": 3200.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788921520,
      "time_str": "02:38 UTC",
      "tx_hash": "0xext07_zebpay_sweep_to_hotwallet",
      "is_primary": false,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "velocity_mins": 25
    },
    {
      "source": "0xSyndicateDistributor00000000000001",
      "target": "0xRunner01XXXXXXXXXXXXXXXXXXXXXXXXXX",
      "amount": 250.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788920400,
      "time_str": "02:20 UTC",
      "tx_hash": "0xrunner01_disperse_fund",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "runner-network",
      "velocity_mins": 6
    },
    {
      "source": "0xSyndicateDistributor00000000000001",
      "target": "0xRunner02XXXXXXXXXXXXXXXXXXXXXXXXXX",
      "amount": 220.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788920410,
      "time_str": "02:20 UTC",
      "tx_hash": "0xrunner02_disperse_fund",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "runner-network",
      "velocity_mins": 6
    },
    {
      "source": "0xSyndicateDistributor00000000000001",
      "target": "0xRunner03XXXXXXXXXXXXXXXXXXXXXXXXXX",
      "amount": 210.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788920420,
      "time_str": "02:20 UTC",
      "tx_hash": "0xrunner03_disperse_fund",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "runner-network",
      "velocity_mins": 7
    },
    {
      "source": "0xSyndicateDistributor00000000000001",
      "target": "0xRunner04XXXXXXXXXXXXXXXXXXXXXXXXXX",
      "amount": 190.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788920430,
      "time_str": "02:20 UTC",
      "tx_hash": "0xrunner04_disperse_fund",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "runner-network",
      "velocity_mins": 7
    },
    {
      "source": "0xSyndicateDistributor00000000000001",
      "target": "0xRunner05XXXXXXXXXXXXXXXXXXXXXXXXXX",
      "amount": 180.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788920440,
      "time_str": "02:20 UTC",
      "tx_hash": "0xrunner05_disperse_fund",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "runner-network",
      "velocity_mins": 7
    },
    {
      "source": "0xSyndicateDistributor00000000000001",
      "target": "0xRunner06XXXXXXXXXXXXXXXXXXXXXXXXXX",
      "amount": 170.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788920450,
      "time_str": "02:20 UTC",
      "tx_hash": "0xrunner06_disperse_fund",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "runner-network",
      "velocity_mins": 7
    },
    {
      "source": "0xSyndicateDistributor00000000000001",
      "target": "0xRunner07XXXXXXXXXXXXXXXXXXXXXXXXXX",
      "amount": 160.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788920460,
      "time_str": "02:21 UTC",
      "tx_hash": "0xrunner07_disperse_fund",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "runner-network",
      "velocity_mins": 7
    },
    {
      "source": "0xSyndicateDistributor00000000000001",
      "target": "0xRunner08XXXXXXXXXXXXXXXXXXXXXXXXXX",
      "amount": 150.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788920470,
      "time_str": "02:21 UTC",
      "tx_hash": "0xrunner08_disperse_fund",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "runner-network",
      "velocity_mins": 7
    },
    {
      "source": "0xSyndicateDistributor00000000000001",
      "target": "0xRunner09XXXXXXXXXXXXXXXXXXXXXXXXXX",
      "amount": 140.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788920480,
      "time_str": "02:21 UTC",
      "tx_hash": "0xrunner09_disperse_fund",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "runner-network",
      "velocity_mins": 8
    },
    {
      "source": "0xSyndicateDistributor00000000000001",
      "target": "0xRunner10XXXXXXXXXXXXXXXXXXXXXXXXXX",
      "amount": 130.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788920490,
      "time_str": "02:21 UTC",
      "tx_hash": "0xrunner10_disperse_fund",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "runner-network",
      "velocity_mins": 8
    },
    {
      "source": "0xRunner01XXXXXXXXXXXXXXXXXXXXXXXXXX",
      "target": "0xAggregatorNode01XXXXXXXXXXXXXXXXXX",
      "amount": 245.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788920700,
      "time_str": "02:25 UTC",
      "tx_hash": "0xagg01_runner1_consolidate",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "runner-network",
      "velocity_mins": 11
    },
    {
      "source": "0xRunner02XXXXXXXXXXXXXXXXXXXXXXXXXX",
      "target": "0xAggregatorNode01XXXXXXXXXXXXXXXXXX",
      "amount": 215.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788920710,
      "time_str": "02:25 UTC",
      "tx_hash": "0xagg02_runner2_consolidate",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "runner-network",
      "velocity_mins": 11
    },
    {
      "source": "0xRunner03XXXXXXXXXXXXXXXXXXXXXXXXXX",
      "target": "0xAggregatorNode01XXXXXXXXXXXXXXXXXX",
      "amount": 205.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788920720,
      "time_str": "02:25 UTC",
      "tx_hash": "0xagg03_runner3_consolidate",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "runner-network",
      "velocity_mins": 12
    },
    {
      "source": "0xRunner04XXXXXXXXXXXXXXXXXXXXXXXXXX",
      "target": "0xAggregatorNode01XXXXXXXXXXXXXXXXXX",
      "amount": 185.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788920730,
      "time_str": "02:25 UTC",
      "tx_hash": "0xagg04_runner4_consolidate",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "runner-network",
      "velocity_mins": 12
    },
    {
      "source": "0xRunner05XXXXXXXXXXXXXXXXXXXXXXXXXX",
      "target": "0xAggregatorNode01XXXXXXXXXXXXXXXXXX",
      "amount": 175.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788920740,
      "time_str": "02:25 UTC",
      "tx_hash": "0xagg05_runner5_consolidate",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "runner-network",
      "velocity_mins": 12
    },
    {
      "source": "0xRunner06XXXXXXXXXXXXXXXXXXXXXXXXXX",
      "target": "0xAggregatorNode02XXXXXXXXXXXXXXXXXX",
      "amount": 165.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788920750,
      "time_str": "02:25 UTC",
      "tx_hash": "0xagg06_runner6_consolidate",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "runner-network",
      "velocity_mins": 12
    },
    {
      "source": "0xRunner07XXXXXXXXXXXXXXXXXXXXXXXXXX",
      "target": "0xAggregatorNode02XXXXXXXXXXXXXXXXXX",
      "amount": 155.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788920760,
      "time_str": "02:26 UTC",
      "tx_hash": "0xagg07_runner7_consolidate",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "runner-network",
      "velocity_mins": 12
    },
    {
      "source": "0xRunner08XXXXXXXXXXXXXXXXXXXXXXXXXX",
      "target": "0xAggregatorNode02XXXXXXXXXXXXXXXXXX",
      "amount": 145.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788920770,
      "time_str": "02:26 UTC",
      "tx_hash": "0xagg08_runner8_consolidate",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "runner-network",
      "velocity_mins": 12
    },
    {
      "source": "0xRunner09XXXXXXXXXXXXXXXXXXXXXXXXXX",
      "target": "0xAggregatorNode02XXXXXXXXXXXXXXXXXX",
      "amount": 135.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788920780,
      "time_str": "02:26 UTC",
      "tx_hash": "0xagg09_runner9_consolidate",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "runner-network",
      "velocity_mins": 13
    },
    {
      "source": "0xRunner10XXXXXXXXXXXXXXXXXXXXXXXXXX",
      "target": "0xAggregatorNode02XXXXXXXXXXXXXXXXXX",
      "amount": 125.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788920790,
      "time_str": "02:26 UTC",
      "tx_hash": "0xagg10_runner10_consolidate",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "runner-network",
      "velocity_mins": 13
    },
    {
      "source": "0xAggregatorNode01XXXXXXXXXXXXXXXXXX",
      "target": "0xMuleWazirX00000000000000000000000001",
      "amount": 1000.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788920850,
      "time_str": "02:27 UTC",
      "tx_hash": "0xagg11_consolidate_to_wazirx_conduit",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "runner-network",
      "velocity_mins": 14
    },
    {
      "source": "0xAggregatorNode02XXXXXXXXXXXXXXXXXX",
      "target": "0xMuleZebPay00000000000000000000000001",
      "amount": 700.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788920860,
      "time_str": "02:27 UTC",
      "tx_hash": "0xagg12_consolidate_to_zebpay_conduit",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "runner-network",
      "velocity_mins": 14
    },
    {
      "source": "0xMaticGasFunder01XXXXXXXXXXXXXXXXXX",
      "target": "0xSyndicateDistributor00000000000001",
      "amount": 5.0,
      "token": "POL",
      "token_symbol": "POL",
      "timestamp_utc": 1788919950,
      "time_str": "02:12 UTC",
      "tx_hash": "0xmatic01_distributor_gas",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "gas-funding",
      "velocity_mins": 0
    },
    {
      "source": "0xMaticGasFunder01XXXXXXXXXXXXXXXXXX",
      "target": "0xMuleWazirX00000000000000000000000001",
      "amount": 3.0,
      "token": "POL",
      "token_symbol": "POL",
      "timestamp_utc": 1788920250,
      "time_str": "02:17 UTC",
      "tx_hash": "0xmatic02_mule1_gas",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "gas-funding",
      "velocity_mins": 4
    },
    {
      "source": "0xMaticGasFunder02XXXXXXXXXXXXXXXXXX",
      "target": "0xMuleZebPay00000000000000000000000001",
      "amount": 3.0,
      "token": "POL",
      "token_symbol": "POL",
      "timestamp_utc": 1788920260,
      "time_str": "02:17 UTC",
      "tx_hash": "0xmatic03_mule2_gas",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "gas-funding",
      "velocity_mins": 4
    },
    {
      "source": "0xMaticGasFunder02XXXXXXXXXXXXXXXXXX",
      "target": "0xRunner01XXXXXXXXXXXXXXXXXXXXXXXXXX",
      "amount": 1.0,
      "token": "POL",
      "token_symbol": "POL",
      "timestamp_utc": 1788920350,
      "time_str": "02:19 UTC",
      "tx_hash": "0xmatic04_runner_gas_01",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "gas-funding",
      "velocity_mins": 5
    },
    {
      "source": "0xMaticGasFunder02XXXXXXXXXXXXXXXXXX",
      "target": "0xRunner02XXXXXXXXXXXXXXXXXXXXXXXXXX",
      "amount": 1.0,
      "token": "POL",
      "token_symbol": "POL",
      "timestamp_utc": 1788920360,
      "time_str": "02:19 UTC",
      "tx_hash": "0xmatic05_runner_gas_02",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "gas-funding",
      "velocity_mins": 6
    },
    {
      "source": "0xRunner01XXXXXXXXXXXXXXXXXXXXXXXXXX",
      "target": "0xSimCardSellerPayout01XXXXXXXXXXXXX",
      "amount": 5.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788920800,
      "time_str": "02:26 UTC",
      "tx_hash": "0xpayout01_sim_card_broker",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "runner-network",
      "velocity_mins": 13
    },
    {
      "source": "0xRunner02XXXXXXXXXXXXXXXXXXXXXXXXXX",
      "target": "0xBankAccountRentalBroker01XXXXXXXXX",
      "amount": 5.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788920810,
      "time_str": "02:26 UTC",
      "tx_hash": "0xpayout02_bank_rent_broker",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "runner-network",
      "velocity_mins": 13
    },
    {
      "source": "0xExpandIn_aa16f68d",
      "target": "0xMuleWazirX00000000000000000000000001",
      "amount": 750.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788952095,
      "time_str": "Expanded",
      "tx_hash": "0xexp1_1fb488062bc741d4",
      "is_primary": false,
      "isCorePath": null,
      "parentBoxId": null,
      "velocity_mins": 60
    },
    {
      "source": "0xMuleWazirX00000000000000000000000001",
      "target": "0xExpandOut_c60a5d49",
      "amount": 450.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788953895,
      "time_str": "Expanded",
      "tx_hash": "0xexp2_7d32e91f3a42437f",
      "is_primary": false,
      "isCorePath": null,
      "parentBoxId": null,
      "velocity_mins": 30
    }
  ],
  "brief": {
    "title": "Automated Layered Mule Laundering & WazirX CEX Off-Ramp",
    "typology": "Task-Based Cyber Fraud / Structuring (EVM)",
    "time_to_exchange_mins": 13,
    "stolen_amount_usd": 8200.0,
    "intermediary_mules_count": 2,
    "identified_vasp": "WazirX",
    "target_deposit_wallet": "0xMuleWazirX00000000000000000000000001",
    "recommended_legal_action": "Dispatch Section 94 BNSS preservation directive to WazirX Nodal Compliance to debit-freeze target account.",
    "narrative": "Victim reported funds of 8,200.00 structured across 2 intermediary mule accounts within 13 minutes on the EVM network before consolidating and sweeping into WazirX.",
    "case_risk_score": 95,
    "case_risk_severity": "CRITICAL",
    "case_risk_breakdown": {
      "max_node_risk": 95,
      "mule_conduits_flagged": 2,
      "peeling_structuring_detected": false,
      "rapid_velocity_detected": true
    }
  },
  "primary_path": [
    "0xVictim0003LoanAppExtortionXXXXX",
    "0xSyndicateDistributor00000000000001",
    "0xMuleWazirX00000000000000000000000001",
    "0xWazirXDeposit000000000000000000000001"
  ],
  "start": {
    "case_id": "CASE-TRON-876E8E94",
    "trace_id": "8934b370-938c-44f6-befd-15d43d92a24a",
    "detected_chain": "EVM",
    "transfer_count": 36,
    "data_source": "standalone_cloud_preview",
    "warning": "Showing demo data — live source unavailable (Scenario: loan_syndicate_multicex)",
    "reached_exchange": true,
    "destination_vasp": "WazirX",
    "terminal_amount": 5000.0,
    "hop_count": 3,
    "trace_time_ms": 0.042,
    "primary_path_addresses": [
      "0xVictim0003LoanAppExtortionXXXXX",
      "0xSyndicateDistributor00000000000001",
      "0xMuleWazirX00000000000000000000000001",
      "0xWazirXDeposit000000000000000000000001"
    ],
    "typology_summary": "Task-Based Cyber Fraud / Structuring (EVM)"
  },
  "graph": {
    "case_id": "CASE-TRON-876E8E94",
    "trace_id": "8934b370-938c-44f6-befd-15d43d92a24a",
    "data_source": "standalone_cloud_preview",
    "nodes": [
      {
        "id": "0xWazirXDeposit000000000000000000000001",
        "label": "[WazirX User Deposit]",
        "node_type": "exchange_deposit",
        "node_class": "exchange_suspected",
        "risk_score": 95,
        "role_tag": "SUSPECT CEX DEPOSIT",
        "cluster_label": "WazirX",
        "balance_hint": null,
        "label_confidence": 0.95,
        "is_on_primary_path": true,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "risk_severity": "CRITICAL",
        "risk_breakdown": {
          "cex_deposit_account": 95
        },
        "risk_rules": [
          {
            "rule_id": "CEX_DEPOSIT_ACCOUNT",
            "rule_name": "Verified/Suspect CEX Deposit Terminal",
            "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
            "points": 95,
            "confidence": 0.96
          }
        ],
        "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
      },
      {
        "id": "0xMaticGasFunder01XXXXXXXXXXXXXXXXXX",
        "label": "[Suspected Exchange User Deposit]",
        "node_type": "exchange_deposit",
        "node_class": "exchange_suspected",
        "risk_score": 95,
        "role_tag": "SUSPECT CEX DEPOSIT",
        "cluster_label": "Sweep Cluster",
        "balance_hint": null,
        "label_confidence": 0.7,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "gas-refill",
        "risk_severity": "CRITICAL",
        "risk_breakdown": {
          "cex_deposit_account": 95
        },
        "risk_rules": [
          {
            "rule_id": "CEX_DEPOSIT_ACCOUNT",
            "rule_name": "Verified/Suspect CEX Deposit Terminal",
            "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
            "points": 95,
            "confidence": 0.96
          }
        ],
        "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
      },
      {
        "id": "0xRunner08XXXXXXXXXXXXXXXXXXXXXXXXXX",
        "label": "[Suspected Exchange User Deposit]",
        "node_type": "exchange_deposit",
        "node_class": "exchange_suspected",
        "risk_score": 95,
        "role_tag": "SUSPECT CEX DEPOSIT",
        "cluster_label": "Sweep Cluster",
        "balance_hint": null,
        "label_confidence": 0.8,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "runner-network",
        "risk_severity": "CRITICAL",
        "risk_breakdown": {
          "cex_deposit_account": 95
        },
        "risk_rules": [
          {
            "rule_id": "CEX_DEPOSIT_ACCOUNT",
            "rule_name": "Verified/Suspect CEX Deposit Terminal",
            "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
            "points": 95,
            "confidence": 0.96
          }
        ],
        "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
      },
      {
        "id": "0xRunner01XXXXXXXXXXXXXXXXXXXXXXXXXX",
        "label": "[Suspected Exchange User Deposit]",
        "node_type": "exchange_deposit",
        "node_class": "exchange_suspected",
        "risk_score": 95,
        "role_tag": "SUSPECT CEX DEPOSIT",
        "cluster_label": "Sweep Cluster",
        "balance_hint": null,
        "label_confidence": 0.8,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "runner-network",
        "risk_severity": "CRITICAL",
        "risk_breakdown": {
          "cex_deposit_account": 95
        },
        "risk_rules": [
          {
            "rule_id": "CEX_DEPOSIT_ACCOUNT",
            "rule_name": "Verified/Suspect CEX Deposit Terminal",
            "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
            "points": 95,
            "confidence": 0.96
          }
        ],
        "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
      },
      {
        "id": "0xZebPayDeposit0000000000000000000000001",
        "label": "[Peel Dust] 0xZebPay...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 10 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "0xBankAccountRentalBroker01XXXXXXXXX",
        "label": "[Peel Dust] 0xBankAc...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "background-web",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 15 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "0xZebPayHotWallet00000000000000000000001",
        "label": "[Peel Dust] 0xZebPay...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 15 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "0xRunner04XXXXXXXXXXXXXXXXXXXXXXXXXX",
        "label": "[Suspected Exchange User Deposit]",
        "node_type": "exchange_deposit",
        "node_class": "exchange_suspected",
        "risk_score": 95,
        "role_tag": "SUSPECT CEX DEPOSIT",
        "cluster_label": "Sweep Cluster",
        "balance_hint": null,
        "label_confidence": 0.8,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "runner-network",
        "risk_severity": "CRITICAL",
        "risk_breakdown": {
          "cex_deposit_account": 95
        },
        "risk_rules": [
          {
            "rule_id": "CEX_DEPOSIT_ACCOUNT",
            "rule_name": "Verified/Suspect CEX Deposit Terminal",
            "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
            "points": 95,
            "confidence": 0.96
          }
        ],
        "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
      },
      {
        "id": "0xRunner07XXXXXXXXXXXXXXXXXXXXXXXXXX",
        "label": "[Suspected Exchange User Deposit]",
        "node_type": "exchange_deposit",
        "node_class": "exchange_suspected",
        "risk_score": 95,
        "role_tag": "SUSPECT CEX DEPOSIT",
        "cluster_label": "Sweep Cluster",
        "balance_hint": null,
        "label_confidence": 0.8,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "runner-network",
        "risk_severity": "CRITICAL",
        "risk_breakdown": {
          "cex_deposit_account": 95
        },
        "risk_rules": [
          {
            "rule_id": "CEX_DEPOSIT_ACCOUNT",
            "rule_name": "Verified/Suspect CEX Deposit Terminal",
            "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
            "points": 95,
            "confidence": 0.96
          }
        ],
        "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
      },
      {
        "id": "0xSimCardSellerPayout01XXXXXXXXXXXXX",
        "label": "[Peel Dust] 0xSimCar...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "background-web",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 15 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "0xMaticGasFunder02XXXXXXXXXXXXXXXXXX",
        "label": "[Suspected Exchange User Deposit]",
        "node_type": "exchange_deposit",
        "node_class": "exchange_suspected",
        "risk_score": 95,
        "role_tag": "SUSPECT CEX DEPOSIT",
        "cluster_label": "Sweep Cluster",
        "balance_hint": null,
        "label_confidence": 0.7,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "gas-refill",
        "risk_severity": "CRITICAL",
        "risk_breakdown": {
          "cex_deposit_account": 95
        },
        "risk_rules": [
          {
            "rule_id": "CEX_DEPOSIT_ACCOUNT",
            "rule_name": "Verified/Suspect CEX Deposit Terminal",
            "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
            "points": 95,
            "confidence": 0.96
          }
        ],
        "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
      },
      {
        "id": "0xRunner09XXXXXXXXXXXXXXXXXXXXXXXXXX",
        "label": "[Suspected Exchange User Deposit]",
        "node_type": "exchange_deposit",
        "node_class": "exchange_suspected",
        "risk_score": 95,
        "role_tag": "SUSPECT CEX DEPOSIT",
        "cluster_label": "Sweep Cluster",
        "balance_hint": null,
        "label_confidence": 0.8,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "runner-network",
        "risk_severity": "CRITICAL",
        "risk_breakdown": {
          "cex_deposit_account": 95
        },
        "risk_rules": [
          {
            "rule_id": "CEX_DEPOSIT_ACCOUNT",
            "rule_name": "Verified/Suspect CEX Deposit Terminal",
            "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
            "points": 95,
            "confidence": 0.96
          }
        ],
        "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
      },
      {
        "id": "0xMuleZebPay00000000000000000000000001",
        "label": "[Suspected CEX Deposit]",
        "node_type": "exchange_deposit",
        "node_class": "exchange_suspected",
        "risk_score": 95,
        "role_tag": "SUSPECT CEX DEPOSIT",
        "cluster_label": "Sweep Cluster",
        "balance_hint": null,
        "label_confidence": 0.7000000000000001,
        "is_on_primary_path": false,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "risk_severity": "CRITICAL",
        "risk_breakdown": {
          "cex_deposit_account": 95
        },
        "risk_rules": [
          {
            "rule_id": "CEX_DEPOSIT_ACCOUNT",
            "rule_name": "Verified/Suspect CEX Deposit Terminal",
            "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
            "points": 95,
            "confidence": 0.96
          }
        ],
        "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
      },
      {
        "id": "0xRunner05XXXXXXXXXXXXXXXXXXXXXXXXXX",
        "label": "[Suspected Exchange User Deposit]",
        "node_type": "exchange_deposit",
        "node_class": "exchange_suspected",
        "risk_score": 95,
        "role_tag": "SUSPECT CEX DEPOSIT",
        "cluster_label": "Sweep Cluster",
        "balance_hint": null,
        "label_confidence": 0.8,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "runner-network",
        "risk_severity": "CRITICAL",
        "risk_breakdown": {
          "cex_deposit_account": 95
        },
        "risk_rules": [
          {
            "rule_id": "CEX_DEPOSIT_ACCOUNT",
            "rule_name": "Verified/Suspect CEX Deposit Terminal",
            "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
            "points": 95,
            "confidence": 0.96
          }
        ],
        "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
      },
      {
        "id": "0xRunner10XXXXXXXXXXXXXXXXXXXXXXXXXX",
        "label": "[Suspected Exchange User Deposit]",
        "node_type": "exchange_deposit",
        "node_class": "exchange_suspected",
        "risk_score": 95,
        "role_tag": "SUSPECT CEX DEPOSIT",
        "cluster_label": "Sweep Cluster",
        "balance_hint": null,
        "label_confidence": 0.8,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "runner-network",
        "risk_severity": "CRITICAL",
        "risk_breakdown": {
          "cex_deposit_account": 95
        },
        "risk_rules": [
          {
            "rule_id": "CEX_DEPOSIT_ACCOUNT",
            "rule_name": "Verified/Suspect CEX Deposit Terminal",
            "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
            "points": 95,
            "confidence": 0.96
          }
        ],
        "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
      },
      {
        "id": "0xVictim0003LoanAppExtortionXXXXX",
        "label": "[Victim Reported Wallet]",
        "node_type": "victim",
        "node_class": "source_wallet",
        "risk_score": 10,
        "role_tag": "REPORTED VICTIM",
        "cluster_label": "Complainant",
        "balance_hint": null,
        "label_confidence": 1.0,
        "is_on_primary_path": true,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "risk_severity": "LOW",
        "risk_breakdown": {
          "victim_origin": 10
        },
        "risk_rules": [
          {
            "rule_id": "COMPLAINANT_VICTIM_ORIGIN",
            "rule_name": "Reported Victim Wallet",
            "description": "Complainant wallet identified in FIR as source of stolen funds.",
            "points": 10,
            "confidence": 1.0
          }
        ],
        "risk_explanation": "Complainant victim wallet: Verified fund source without laundering liability."
      },
      {
        "id": "0xMuleWazirX00000000000000000000000001",
        "label": "[Mule] 0xMuleWa...",
        "node_type": "mule",
        "node_class": "intermediary",
        "risk_score": 55,
        "role_tag": "HIGH VELOCITY MULE",
        "cluster_label": "Layering Ring",
        "balance_hint": null,
        "label_confidence": 0.85,
        "is_on_primary_path": true,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20,
          "cex_proximity_urgency": 15
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 10 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          },
          {
            "rule_id": "CEX_PROXIMITY_URGENCY",
            "rule_name": "Exchange Off-Ramp Proximity (<= 2 Hops)",
            "description": "Directly upstream of exchange deposit terminal (1 hops). High flight risk.",
            "points": 15,
            "confidence": 0.88
          }
        ],
        "risk_explanation": "MODERATE risk profile (55/100) triggered by 2 distinct heuristic rules: High-Velocity Mule Hop (< 30 min), Exchange Off-Ramp Proximity (<= 2 Hops)."
      },
      {
        "id": "0xRunner03XXXXXXXXXXXXXXXXXXXXXXXXXX",
        "label": "[Suspected Exchange User Deposit]",
        "node_type": "exchange_deposit",
        "node_class": "exchange_suspected",
        "risk_score": 95,
        "role_tag": "SUSPECT CEX DEPOSIT",
        "cluster_label": "Sweep Cluster",
        "balance_hint": null,
        "label_confidence": 0.8,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "runner-network",
        "risk_severity": "CRITICAL",
        "risk_breakdown": {
          "cex_deposit_account": 95
        },
        "risk_rules": [
          {
            "rule_id": "CEX_DEPOSIT_ACCOUNT",
            "rule_name": "Verified/Suspect CEX Deposit Terminal",
            "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
            "points": 95,
            "confidence": 0.96
          }
        ],
        "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
      },
      {
        "id": "0xAggregatorNode01XXXXXXXXXXXXXXXXXX",
        "label": "[Suspected CEX Deposit]",
        "node_type": "exchange_deposit",
        "node_class": "exchange_suspected",
        "risk_score": 95,
        "role_tag": "SUSPECT CEX DEPOSIT",
        "cluster_label": "Sweep Cluster",
        "balance_hint": null,
        "label_confidence": 0.8,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "runner-network",
        "risk_severity": "CRITICAL",
        "risk_breakdown": {
          "cex_deposit_account": 95
        },
        "risk_rules": [
          {
            "rule_id": "CEX_DEPOSIT_ACCOUNT",
            "rule_name": "Verified/Suspect CEX Deposit Terminal",
            "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
            "points": 95,
            "confidence": 0.96
          }
        ],
        "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
      },
      {
        "id": "0xRunner02XXXXXXXXXXXXXXXXXXXXXXXXXX",
        "label": "[Suspected Exchange User Deposit]",
        "node_type": "exchange_deposit",
        "node_class": "exchange_suspected",
        "risk_score": 95,
        "role_tag": "SUSPECT CEX DEPOSIT",
        "cluster_label": "Sweep Cluster",
        "balance_hint": null,
        "label_confidence": 0.8,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "runner-network",
        "risk_severity": "CRITICAL",
        "risk_breakdown": {
          "cex_deposit_account": 95
        },
        "risk_rules": [
          {
            "rule_id": "CEX_DEPOSIT_ACCOUNT",
            "rule_name": "Verified/Suspect CEX Deposit Terminal",
            "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
            "points": 95,
            "confidence": 0.96
          }
        ],
        "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
      },
      {
        "id": "0xWazirXHotWallet000000000000000000001",
        "label": "[Peel Dust] 0xWazirX...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 15 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "0xSyndicateDistributor00000000000001",
        "label": "[Mule] 0xSyndic...",
        "node_type": "mule",
        "node_class": "intermediary",
        "risk_score": 55,
        "role_tag": "HIGH VELOCITY MULE",
        "cluster_label": "Layering Ring",
        "balance_hint": null,
        "label_confidence": 0.85,
        "is_on_primary_path": true,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20,
          "cex_proximity_urgency": 15
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 9 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          },
          {
            "rule_id": "CEX_PROXIMITY_URGENCY",
            "rule_name": "Exchange Off-Ramp Proximity (<= 2 Hops)",
            "description": "Directly upstream of exchange deposit terminal (2 hops). High flight risk.",
            "points": 15,
            "confidence": 0.88
          }
        ],
        "risk_explanation": "MODERATE risk profile (55/100) triggered by 2 distinct heuristic rules: High-Velocity Mule Hop (< 30 min), Exchange Off-Ramp Proximity (<= 2 Hops)."
      },
      {
        "id": "0xRunner06XXXXXXXXXXXXXXXXXXXXXXXXXX",
        "label": "[Suspected Exchange User Deposit]",
        "node_type": "exchange_deposit",
        "node_class": "exchange_suspected",
        "risk_score": 95,
        "role_tag": "SUSPECT CEX DEPOSIT",
        "cluster_label": "Sweep Cluster",
        "balance_hint": null,
        "label_confidence": 0.8,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "runner-network",
        "risk_severity": "CRITICAL",
        "risk_breakdown": {
          "cex_deposit_account": 95
        },
        "risk_rules": [
          {
            "rule_id": "CEX_DEPOSIT_ACCOUNT",
            "rule_name": "Verified/Suspect CEX Deposit Terminal",
            "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
            "points": 95,
            "confidence": 0.96
          }
        ],
        "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
      },
      {
        "id": "0xAggregatorNode02XXXXXXXXXXXXXXXXXX",
        "label": "[Suspected CEX Deposit]",
        "node_type": "exchange_deposit",
        "node_class": "exchange_suspected",
        "risk_score": 95,
        "role_tag": "SUSPECT CEX DEPOSIT",
        "cluster_label": "Sweep Cluster",
        "balance_hint": null,
        "label_confidence": 0.8,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "runner-network",
        "risk_severity": "CRITICAL",
        "risk_breakdown": {
          "cex_deposit_account": 95
        },
        "risk_rules": [
          {
            "rule_id": "CEX_DEPOSIT_ACCOUNT",
            "rule_name": "Verified/Suspect CEX Deposit Terminal",
            "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
            "points": 95,
            "confidence": 0.96
          }
        ],
        "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
      },
      {
        "id": "0xExpandIn_aa16f68d",
        "label": "[Expanded Inbound] 0xExpa…",
        "node_type": "mule",
        "node_class": "intermediary",
        "risk_score": 75,
        "role_tag": "EXPANDED COUNTERPARTY",
        "cluster_label": "Expanded Cluster",
        "balance_hint": null,
        "label_confidence": 0.75,
        "is_on_primary_path": false,
        "isCorePath": null,
        "parentBoxId": null,
        "risk_severity": "HIGH",
        "risk_breakdown": null,
        "risk_rules": null,
        "risk_explanation": null
      },
      {
        "id": "0xExpandOut_c60a5d49",
        "label": "[Expanded Outbound] 0xExpa…",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 60,
        "role_tag": "EXPANDED COUNTERPARTY",
        "cluster_label": "Expanded Cluster",
        "balance_hint": null,
        "label_confidence": 0.7,
        "is_on_primary_path": false,
        "isCorePath": null,
        "parentBoxId": null,
        "risk_severity": "HIGH",
        "risk_breakdown": null,
        "risk_rules": null,
        "risk_explanation": null
      }
    ],
    "edges": [
      {
        "source": "0xVictim0003LoanAppExtortionXXXXX",
        "target": "0xSyndicateDistributor00000000000001",
        "amount": 8200.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788920000,
        "time_str": "02:13 UTC",
        "tx_hash": "0xext01_victim_extortion_usdt_primary",
        "is_primary": true,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "velocity_mins": 0
      },
      {
        "source": "0xSyndicateDistributor00000000000001",
        "target": "0xMuleWazirX00000000000000000000000001",
        "amount": 5000.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788920300,
        "time_str": "02:18 UTC",
        "tx_hash": "0xext02_split_wazirx_conduit_5000",
        "is_primary": true,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "velocity_mins": 5
      },
      {
        "source": "0xMuleWazirX00000000000000000000000001",
        "target": "0xWazirXDeposit000000000000000000000001",
        "amount": 5000.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788920900,
        "time_str": "02:28 UTC",
        "tx_hash": "0xext03_wazirx_deposit_5000",
        "is_primary": true,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "velocity_mins": 15
      },
      {
        "source": "0xWazirXDeposit000000000000000000000001",
        "target": "0xWazirXHotWallet000000000000000000001",
        "amount": 5000.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788921500,
        "time_str": "02:38 UTC",
        "tx_hash": "0xext04_wazirx_sweep_to_hotwallet",
        "is_primary": false,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "velocity_mins": 25
      },
      {
        "source": "0xSyndicateDistributor00000000000001",
        "target": "0xMuleZebPay00000000000000000000000001",
        "amount": 3200.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788920310,
        "time_str": "02:18 UTC",
        "tx_hash": "0xext05_split_zebpay_conduit_3200",
        "is_primary": false,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "velocity_mins": 5
      },
      {
        "source": "0xMuleZebPay00000000000000000000000001",
        "target": "0xZebPayDeposit0000000000000000000000001",
        "amount": 3200.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788920920,
        "time_str": "02:28 UTC",
        "tx_hash": "0xext06_zebpay_deposit_3200",
        "is_primary": false,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "velocity_mins": 15
      },
      {
        "source": "0xZebPayDeposit0000000000000000000000001",
        "target": "0xZebPayHotWallet00000000000000000000001",
        "amount": 3200.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788921520,
        "time_str": "02:38 UTC",
        "tx_hash": "0xext07_zebpay_sweep_to_hotwallet",
        "is_primary": false,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "velocity_mins": 25
      },
      {
        "source": "0xSyndicateDistributor00000000000001",
        "target": "0xRunner01XXXXXXXXXXXXXXXXXXXXXXXXXX",
        "amount": 250.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788920400,
        "time_str": "02:20 UTC",
        "tx_hash": "0xrunner01_disperse_fund",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "runner-network",
        "velocity_mins": 6
      },
      {
        "source": "0xSyndicateDistributor00000000000001",
        "target": "0xRunner02XXXXXXXXXXXXXXXXXXXXXXXXXX",
        "amount": 220.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788920410,
        "time_str": "02:20 UTC",
        "tx_hash": "0xrunner02_disperse_fund",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "runner-network",
        "velocity_mins": 6
      },
      {
        "source": "0xSyndicateDistributor00000000000001",
        "target": "0xRunner03XXXXXXXXXXXXXXXXXXXXXXXXXX",
        "amount": 210.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788920420,
        "time_str": "02:20 UTC",
        "tx_hash": "0xrunner03_disperse_fund",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "runner-network",
        "velocity_mins": 7
      },
      {
        "source": "0xSyndicateDistributor00000000000001",
        "target": "0xRunner04XXXXXXXXXXXXXXXXXXXXXXXXXX",
        "amount": 190.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788920430,
        "time_str": "02:20 UTC",
        "tx_hash": "0xrunner04_disperse_fund",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "runner-network",
        "velocity_mins": 7
      },
      {
        "source": "0xSyndicateDistributor00000000000001",
        "target": "0xRunner05XXXXXXXXXXXXXXXXXXXXXXXXXX",
        "amount": 180.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788920440,
        "time_str": "02:20 UTC",
        "tx_hash": "0xrunner05_disperse_fund",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "runner-network",
        "velocity_mins": 7
      },
      {
        "source": "0xSyndicateDistributor00000000000001",
        "target": "0xRunner06XXXXXXXXXXXXXXXXXXXXXXXXXX",
        "amount": 170.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788920450,
        "time_str": "02:20 UTC",
        "tx_hash": "0xrunner06_disperse_fund",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "runner-network",
        "velocity_mins": 7
      },
      {
        "source": "0xSyndicateDistributor00000000000001",
        "target": "0xRunner07XXXXXXXXXXXXXXXXXXXXXXXXXX",
        "amount": 160.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788920460,
        "time_str": "02:21 UTC",
        "tx_hash": "0xrunner07_disperse_fund",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "runner-network",
        "velocity_mins": 7
      },
      {
        "source": "0xSyndicateDistributor00000000000001",
        "target": "0xRunner08XXXXXXXXXXXXXXXXXXXXXXXXXX",
        "amount": 150.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788920470,
        "time_str": "02:21 UTC",
        "tx_hash": "0xrunner08_disperse_fund",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "runner-network",
        "velocity_mins": 7
      },
      {
        "source": "0xSyndicateDistributor00000000000001",
        "target": "0xRunner09XXXXXXXXXXXXXXXXXXXXXXXXXX",
        "amount": 140.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788920480,
        "time_str": "02:21 UTC",
        "tx_hash": "0xrunner09_disperse_fund",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "runner-network",
        "velocity_mins": 8
      },
      {
        "source": "0xSyndicateDistributor00000000000001",
        "target": "0xRunner10XXXXXXXXXXXXXXXXXXXXXXXXXX",
        "amount": 130.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788920490,
        "time_str": "02:21 UTC",
        "tx_hash": "0xrunner10_disperse_fund",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "runner-network",
        "velocity_mins": 8
      },
      {
        "source": "0xRunner01XXXXXXXXXXXXXXXXXXXXXXXXXX",
        "target": "0xAggregatorNode01XXXXXXXXXXXXXXXXXX",
        "amount": 245.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788920700,
        "time_str": "02:25 UTC",
        "tx_hash": "0xagg01_runner1_consolidate",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "runner-network",
        "velocity_mins": 11
      },
      {
        "source": "0xRunner02XXXXXXXXXXXXXXXXXXXXXXXXXX",
        "target": "0xAggregatorNode01XXXXXXXXXXXXXXXXXX",
        "amount": 215.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788920710,
        "time_str": "02:25 UTC",
        "tx_hash": "0xagg02_runner2_consolidate",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "runner-network",
        "velocity_mins": 11
      },
      {
        "source": "0xRunner03XXXXXXXXXXXXXXXXXXXXXXXXXX",
        "target": "0xAggregatorNode01XXXXXXXXXXXXXXXXXX",
        "amount": 205.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788920720,
        "time_str": "02:25 UTC",
        "tx_hash": "0xagg03_runner3_consolidate",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "runner-network",
        "velocity_mins": 12
      },
      {
        "source": "0xRunner04XXXXXXXXXXXXXXXXXXXXXXXXXX",
        "target": "0xAggregatorNode01XXXXXXXXXXXXXXXXXX",
        "amount": 185.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788920730,
        "time_str": "02:25 UTC",
        "tx_hash": "0xagg04_runner4_consolidate",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "runner-network",
        "velocity_mins": 12
      },
      {
        "source": "0xRunner05XXXXXXXXXXXXXXXXXXXXXXXXXX",
        "target": "0xAggregatorNode01XXXXXXXXXXXXXXXXXX",
        "amount": 175.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788920740,
        "time_str": "02:25 UTC",
        "tx_hash": "0xagg05_runner5_consolidate",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "runner-network",
        "velocity_mins": 12
      },
      {
        "source": "0xRunner06XXXXXXXXXXXXXXXXXXXXXXXXXX",
        "target": "0xAggregatorNode02XXXXXXXXXXXXXXXXXX",
        "amount": 165.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788920750,
        "time_str": "02:25 UTC",
        "tx_hash": "0xagg06_runner6_consolidate",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "runner-network",
        "velocity_mins": 12
      },
      {
        "source": "0xRunner07XXXXXXXXXXXXXXXXXXXXXXXXXX",
        "target": "0xAggregatorNode02XXXXXXXXXXXXXXXXXX",
        "amount": 155.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788920760,
        "time_str": "02:26 UTC",
        "tx_hash": "0xagg07_runner7_consolidate",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "runner-network",
        "velocity_mins": 12
      },
      {
        "source": "0xRunner08XXXXXXXXXXXXXXXXXXXXXXXXXX",
        "target": "0xAggregatorNode02XXXXXXXXXXXXXXXXXX",
        "amount": 145.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788920770,
        "time_str": "02:26 UTC",
        "tx_hash": "0xagg08_runner8_consolidate",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "runner-network",
        "velocity_mins": 12
      },
      {
        "source": "0xRunner09XXXXXXXXXXXXXXXXXXXXXXXXXX",
        "target": "0xAggregatorNode02XXXXXXXXXXXXXXXXXX",
        "amount": 135.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788920780,
        "time_str": "02:26 UTC",
        "tx_hash": "0xagg09_runner9_consolidate",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "runner-network",
        "velocity_mins": 13
      },
      {
        "source": "0xRunner10XXXXXXXXXXXXXXXXXXXXXXXXXX",
        "target": "0xAggregatorNode02XXXXXXXXXXXXXXXXXX",
        "amount": 125.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788920790,
        "time_str": "02:26 UTC",
        "tx_hash": "0xagg10_runner10_consolidate",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "runner-network",
        "velocity_mins": 13
      },
      {
        "source": "0xAggregatorNode01XXXXXXXXXXXXXXXXXX",
        "target": "0xMuleWazirX00000000000000000000000001",
        "amount": 1000.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788920850,
        "time_str": "02:27 UTC",
        "tx_hash": "0xagg11_consolidate_to_wazirx_conduit",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "runner-network",
        "velocity_mins": 14
      },
      {
        "source": "0xAggregatorNode02XXXXXXXXXXXXXXXXXX",
        "target": "0xMuleZebPay00000000000000000000000001",
        "amount": 700.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788920860,
        "time_str": "02:27 UTC",
        "tx_hash": "0xagg12_consolidate_to_zebpay_conduit",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "runner-network",
        "velocity_mins": 14
      },
      {
        "source": "0xMaticGasFunder01XXXXXXXXXXXXXXXXXX",
        "target": "0xSyndicateDistributor00000000000001",
        "amount": 5.0,
        "token": "POL",
        "token_symbol": "POL",
        "timestamp_utc": 1788919950,
        "time_str": "02:12 UTC",
        "tx_hash": "0xmatic01_distributor_gas",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "gas-funding",
        "velocity_mins": 0
      },
      {
        "source": "0xMaticGasFunder01XXXXXXXXXXXXXXXXXX",
        "target": "0xMuleWazirX00000000000000000000000001",
        "amount": 3.0,
        "token": "POL",
        "token_symbol": "POL",
        "timestamp_utc": 1788920250,
        "time_str": "02:17 UTC",
        "tx_hash": "0xmatic02_mule1_gas",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "gas-funding",
        "velocity_mins": 4
      },
      {
        "source": "0xMaticGasFunder02XXXXXXXXXXXXXXXXXX",
        "target": "0xMuleZebPay00000000000000000000000001",
        "amount": 3.0,
        "token": "POL",
        "token_symbol": "POL",
        "timestamp_utc": 1788920260,
        "time_str": "02:17 UTC",
        "tx_hash": "0xmatic03_mule2_gas",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "gas-funding",
        "velocity_mins": 4
      },
      {
        "source": "0xMaticGasFunder02XXXXXXXXXXXXXXXXXX",
        "target": "0xRunner01XXXXXXXXXXXXXXXXXXXXXXXXXX",
        "amount": 1.0,
        "token": "POL",
        "token_symbol": "POL",
        "timestamp_utc": 1788920350,
        "time_str": "02:19 UTC",
        "tx_hash": "0xmatic04_runner_gas_01",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "gas-funding",
        "velocity_mins": 5
      },
      {
        "source": "0xMaticGasFunder02XXXXXXXXXXXXXXXXXX",
        "target": "0xRunner02XXXXXXXXXXXXXXXXXXXXXXXXXX",
        "amount": 1.0,
        "token": "POL",
        "token_symbol": "POL",
        "timestamp_utc": 1788920360,
        "time_str": "02:19 UTC",
        "tx_hash": "0xmatic05_runner_gas_02",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "gas-funding",
        "velocity_mins": 6
      },
      {
        "source": "0xRunner01XXXXXXXXXXXXXXXXXXXXXXXXXX",
        "target": "0xSimCardSellerPayout01XXXXXXXXXXXXX",
        "amount": 5.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788920800,
        "time_str": "02:26 UTC",
        "tx_hash": "0xpayout01_sim_card_broker",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "runner-network",
        "velocity_mins": 13
      },
      {
        "source": "0xRunner02XXXXXXXXXXXXXXXXXXXXXXXXXX",
        "target": "0xBankAccountRentalBroker01XXXXXXXXX",
        "amount": 5.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788920810,
        "time_str": "02:26 UTC",
        "tx_hash": "0xpayout02_bank_rent_broker",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "runner-network",
        "velocity_mins": 13
      },
      {
        "source": "0xExpandIn_aa16f68d",
        "target": "0xMuleWazirX00000000000000000000000001",
        "amount": 750.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788952095,
        "time_str": "Expanded",
        "tx_hash": "0xexp1_1fb488062bc741d4",
        "is_primary": false,
        "isCorePath": null,
        "parentBoxId": null,
        "velocity_mins": 60
      },
      {
        "source": "0xMuleWazirX00000000000000000000000001",
        "target": "0xExpandOut_c60a5d49",
        "amount": 450.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788953895,
        "time_str": "Expanded",
        "tx_hash": "0xexp2_7d32e91f3a42437f",
        "is_primary": false,
        "isCorePath": null,
        "parentBoxId": null,
        "velocity_mins": 30
      }
    ],
    "brief": {
      "title": "Automated Layered Mule Laundering & WazirX CEX Off-Ramp",
      "typology": "Task-Based Cyber Fraud / Structuring (EVM)",
      "time_to_exchange_mins": 13,
      "stolen_amount_usd": 8200.0,
      "intermediary_mules_count": 2,
      "identified_vasp": "WazirX",
      "target_deposit_wallet": "0xMuleWazirX00000000000000000000000001",
      "recommended_legal_action": "Dispatch Section 94 BNSS preservation directive to WazirX Nodal Compliance to debit-freeze target account.",
      "narrative": "Victim reported funds of 8,200.00 structured across 2 intermediary mule accounts within 13 minutes on the EVM network before consolidating and sweeping into WazirX.",
      "case_risk_score": 95,
      "case_risk_severity": "CRITICAL",
      "case_risk_breakdown": {
        "max_node_risk": 95,
        "mule_conduits_flagged": 2,
        "peeling_structuring_detected": false,
        "rapid_velocity_detected": true
      }
    },
    "primary_path": [
      "0xVictim0003LoanAppExtortionXXXXX",
      "0xSyndicateDistributor00000000000001",
      "0xMuleWazirX00000000000000000000000001",
      "0xWazirXDeposit000000000000000000000001"
    ]
  },
  "off_ramp": {
    "found": true,
    "hops_searched": 3,
    "truncated": false,
    "path": [
      {
        "source": "0xVictim0003LoanAppExtortionXXXXX",
        "target": "0xSyndicateDistributor00000000000001",
        "amount": 8200.0,
        "token": "USDT",
        "tx_hash": "0xext01_victim_extortion_usdt_primary",
        "timestamp_utc": 1788920000
      },
      {
        "source": "0xSyndicateDistributor00000000000001",
        "target": "0xMuleWazirX00000000000000000000000001",
        "amount": 5000.0,
        "token": "USDT",
        "tx_hash": "0xext02_split_wazirx_conduit_5000",
        "timestamp_utc": 1788920300
      },
      {
        "source": "0xMuleWazirX00000000000000000000000001",
        "target": "0xWazirXDeposit000000000000000000000001",
        "amount": 5000.0,
        "token": "USDT",
        "tx_hash": "0xext03_wazirx_deposit_5000",
        "timestamp_utc": 1788920900
      },
      {
        "source": "0xWazirXDeposit000000000000000000000001",
        "target": "0xWazirXHotWallet000000000000000000001",
        "amount": 5000.0,
        "token": "USDT",
        "tx_hash": "0xext04_wazirx_sweep_to_hotwallet",
        "timestamp_utc": 1788921500
      },
      {
        "source": "0xSyndicateDistributor00000000000001",
        "target": "0xMuleZebPay00000000000000000000000001",
        "amount": 3200.0,
        "token": "USDT",
        "tx_hash": "0xext05_split_zebpay_conduit_3200",
        "timestamp_utc": 1788920310
      },
      {
        "source": "0xMuleZebPay00000000000000000000000001",
        "target": "0xZebPayDeposit0000000000000000000000001",
        "amount": 3200.0,
        "token": "USDT",
        "tx_hash": "0xext06_zebpay_deposit_3200",
        "timestamp_utc": 1788920920
      },
      {
        "source": "0xZebPayDeposit0000000000000000000000001",
        "target": "0xZebPayHotWallet00000000000000000000001",
        "amount": 3200.0,
        "token": "USDT",
        "tx_hash": "0xext07_zebpay_sweep_to_hotwallet",
        "timestamp_utc": 1788921520
      }
    ],
    "terminal_label": "Dual CEX: WazirX & ZebPay",
    "disclaimer": "Heuristic off-ramp detection is an investigative lead, not conclusive proof of account ownership or CEX deposit attribution. Verification with exchange compliance under Section 94 BNSS is required.",
    "terminal_vasp": "Dual Off-Ramp (WazirX & ZebPay)"
  },
  "expansions": {
    "0xMuleWazirX00000000000000000000000001": {
      "expanded_address": "0xMuleWazirX00000000000000000000000001",
      "new_nodes": [
        {
          "id": "0xExpandIn_aa16f68d",
          "label": "[Expanded Inbound] 0xExpa…",
          "node_type": "mule",
          "node_class": "intermediary",
          "risk_score": 75,
          "role_tag": "EXPANDED COUNTERPARTY",
          "cluster_label": "Expanded Cluster",
          "balance_hint": null,
          "label_confidence": 0.75,
          "is_on_primary_path": false,
          "isCorePath": null,
          "parentBoxId": null,
          "risk_severity": "HIGH",
          "risk_breakdown": null,
          "risk_rules": null,
          "risk_explanation": null
        },
        {
          "id": "0xExpandOut_c60a5d49",
          "label": "[Expanded Outbound] 0xExpa…",
          "node_type": "peel_outlet",
          "node_class": "unknown",
          "risk_score": 60,
          "role_tag": "EXPANDED COUNTERPARTY",
          "cluster_label": "Expanded Cluster",
          "balance_hint": null,
          "label_confidence": 0.7,
          "is_on_primary_path": false,
          "isCorePath": null,
          "parentBoxId": null,
          "risk_severity": "HIGH",
          "risk_breakdown": null,
          "risk_rules": null,
          "risk_explanation": null
        }
      ],
      "new_edges": [
        {
          "source": "0xExpandIn_aa16f68d",
          "target": "0xMuleWazirX00000000000000000000000001",
          "amount": 750.0,
          "token": "USDT",
          "token_symbol": "USDT",
          "timestamp_utc": 1788952095,
          "time_str": "Expanded",
          "tx_hash": "0xexp1_1fb488062bc741d4",
          "is_primary": false,
          "isCorePath": null,
          "parentBoxId": null,
          "velocity_mins": 60
        },
        {
          "source": "0xMuleWazirX00000000000000000000000001",
          "target": "0xExpandOut_c60a5d49",
          "amount": 450.0,
          "token": "USDT",
          "token_symbol": "USDT",
          "timestamp_utc": 1788953895,
          "time_str": "Expanded",
          "tx_hash": "0xexp2_7d32e91f3a42437f",
          "is_primary": false,
          "isCorePath": null,
          "parentBoxId": null,
          "velocity_mins": 30
        }
      ],
      "total_nodes": 26,
      "total_edges": 38
    }
  }
},
  inr_480k_coindcx_scam: {
  "scenario_id": "inr_480k_coindcx_scam",
  "scenario_name": "inr_480k_coindcx_scam",
  "target_address": "0xVICTIM_480K_FRAUD_7b93a2c4e1",
  "case_id": "CASE-TRON-BABA8440",
  "trace_id": "0e1314ee-23a1-48a4-ade0-5e05addbe7b5",
  "detected_chain": "EVM",
  "transfer_count": 20,
  "data_source": "standalone_cloud_preview",
  "warning": "Cloud Preview Mode: Backend offline. Serving bundled static forensic dataset.",
  "reached_exchange": true,
  "destination_vasp": "CoinDCX",
  "terminal_amount": 5300.0,
  "hop_count": 5,
  "trace_time_ms": 0.042,
  "primary_path_addresses": [
    "0xVICTIM_480K_FRAUD_7b93a2c4e1",
    "0xScamCollection_a19f82d3e4b5",
    "0xMuleLayerA_c4d5e6f70819",
    "0xMuleLayerB_8f9e0a1b2c3d",
    "0xUnknownDeposit_3e4f5a6b7c8d",
    "0x71c3fb9904d3e33e9d8f8e02d847b74f38e63021"
  ],
  "typology_summary": "Task-Based Cyber Fraud / Structuring (EVM)",
  "nodes": [
    {
      "id": "0xDecoyBurner_1928374650",
      "label": "[Suspected CEX Deposit]",
      "node_type": "exchange_deposit",
      "node_class": "exchange_suspected",
      "risk_score": 95,
      "role_tag": "SUSPECT CEX DEPOSIT",
      "cluster_label": "CoinDCX",
      "balance_hint": null,
      "label_confidence": 0.7000000000000001,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "background-web",
      "risk_severity": "CRITICAL",
      "risk_breakdown": {
        "cex_deposit_account": 95
      },
      "risk_rules": [
        {
          "rule_id": "CEX_DEPOSIT_ACCOUNT",
          "rule_name": "Verified/Suspect CEX Deposit Terminal",
          "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
          "points": 95,
          "confidence": 0.96
        }
      ],
      "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
    },
    {
      "id": "0xPeelDust_Runner03_9988776655",
      "label": "[Peel Dust] 0xPeelDu...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "runner-network",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 8 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "0xMuleLayerB_8f9e0a1b2c3d",
      "label": "[Mule] 0xMuleLa...",
      "node_type": "mule",
      "node_class": "intermediary",
      "risk_score": 55,
      "role_tag": "HIGH VELOCITY MULE",
      "cluster_label": "Layering Ring",
      "balance_hint": null,
      "label_confidence": 0.85,
      "is_on_primary_path": true,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20,
        "cex_proximity_urgency": 15
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 15 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        },
        {
          "rule_id": "CEX_PROXIMITY_URGENCY",
          "rule_name": "Exchange Off-Ramp Proximity (<= 2 Hops)",
          "description": "Directly upstream of exchange deposit terminal (2 hops). High flight risk.",
          "points": 15,
          "confidence": 0.88
        }
      ],
      "risk_explanation": "MODERATE risk profile (55/100) triggered by 2 distinct heuristic rules: High-Velocity Mule Hop (< 30 min), Exchange Off-Ramp Proximity (<= 2 Hops)."
    },
    {
      "id": "0xPeelDust_Runner01_1029384756",
      "label": "[Peel Dust] 0xPeelDu...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "runner-network",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 5 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "0xP2P_Merchant_Delhi_9182736450",
      "label": "[Peel Dust] 0xP2P_Me...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "background-web",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 15 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "0xP2P_Merchant_Mumbai_2837465910",
      "label": "[Peel Dust] 0xP2P_Me...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "background-web",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 15 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "0xCoinDCX_ColdVault_MasterStorage0001",
      "label": "[Peel Dust] 0xCoinDC...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "background-web",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 15 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "0xOtherVictim_Telegram_91823746",
      "label": "[Suspected Exchange User Deposit]",
      "node_type": "exchange_deposit",
      "node_class": "exchange_suspected",
      "risk_score": 95,
      "role_tag": "SUSPECT CEX DEPOSIT",
      "cluster_label": "Sweep Cluster",
      "balance_hint": null,
      "label_confidence": 0.7,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "background-web",
      "risk_severity": "CRITICAL",
      "risk_breakdown": {
        "cex_deposit_account": 95
      },
      "risk_rules": [
        {
          "rule_id": "CEX_DEPOSIT_ACCOUNT",
          "rule_name": "Verified/Suspect CEX Deposit Terminal",
          "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
          "points": 95,
          "confidence": 0.96
        }
      ],
      "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
    },
    {
      "id": "0x71c3fb9904d3e33e9d8f8e02d847b74f38e63021",
      "label": "[CoinDCX Hot Wallet]",
      "node_type": "exchange_hotwallet",
      "node_class": "exchange_confirmed",
      "risk_score": 85,
      "role_tag": "HOT WALLET (SWEEP TERMINAL)",
      "cluster_label": "CoinDCX",
      "balance_hint": null,
      "label_confidence": 0.99,
      "is_on_primary_path": true,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "risk_severity": "CRITICAL",
      "risk_breakdown": {
        "terminal_cex_hotwallet": 85
      },
      "risk_rules": [
        {
          "rule_id": "CEX_HOT_WALLET_TERMINAL",
          "rule_name": "Terminal VASP Hot Wallet",
          "description": "Centralized exchange omnibus hot wallet cluster where laundered funds consolidated.",
          "points": 85,
          "confidence": 0.99
        }
      ],
      "risk_explanation": "Terminal centralized exchange hot wallet cluster: Final off-ramp consolidation."
    },
    {
      "id": "0xUnknownDeposit_3e4f5a6b7c8d",
      "label": "[Mule] 0xUnknow...",
      "node_type": "mule",
      "node_class": "intermediary",
      "risk_score": 45,
      "role_tag": "HIGH VELOCITY MULE",
      "cluster_label": "Layering Ring",
      "balance_hint": null,
      "label_confidence": 0.85,
      "is_on_primary_path": true,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "velocity_sub_2hr": 10,
        "cex_proximity_urgency": 15
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_2HR",
          "rule_name": "Moderate-Velocity Hop (< 2 hrs)",
          "description": "Transferred funds in 42 mins, indicating coordinated layering ring behavior.",
          "points": 10,
          "confidence": 0.8
        },
        {
          "rule_id": "CEX_PROXIMITY_URGENCY",
          "rule_name": "Exchange Off-Ramp Proximity (<= 2 Hops)",
          "description": "Directly upstream of exchange deposit terminal (1 hops). High flight risk.",
          "points": 15,
          "confidence": 0.88
        }
      ],
      "risk_explanation": "MODERATE risk profile (45/100) triggered by 2 distinct heuristic rules: Moderate-Velocity Hop (< 2 hrs), Exchange Off-Ramp Proximity (<= 2 Hops)."
    },
    {
      "id": "0xScamCollection_a19f82d3e4b5",
      "label": "[Mule] 0xScamCo...",
      "node_type": "mule",
      "node_class": "intermediary",
      "risk_score": 40,
      "role_tag": "HIGH VELOCITY MULE",
      "cluster_label": "Layering Ring",
      "balance_hint": null,
      "label_confidence": 0.85,
      "is_on_primary_path": true,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 20 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "0xPeelDust_Runner02_5647382910",
      "label": "[Peel Dust] 0xPeelDu...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "runner-network",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 4 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "0xMuleLayerA_c4d5e6f70819",
      "label": "[Mule] 0xMuleLa...",
      "node_type": "mule",
      "node_class": "intermediary",
      "risk_score": 40,
      "role_tag": "HIGH VELOCITY MULE",
      "cluster_label": "Layering Ring",
      "balance_hint": null,
      "label_confidence": 0.85,
      "is_on_primary_path": true,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 17 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "0xExternalSyndicateCollector_8819203",
      "label": "[Suspected Exchange User Deposit]",
      "node_type": "exchange_deposit",
      "node_class": "exchange_suspected",
      "risk_score": 95,
      "role_tag": "SUSPECT CEX DEPOSIT",
      "cluster_label": "Sweep Cluster",
      "balance_hint": null,
      "label_confidence": 0.7,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "runner-network",
      "risk_severity": "CRITICAL",
      "risk_breakdown": {
        "cex_deposit_account": 95
      },
      "risk_rules": [
        {
          "rule_id": "CEX_DEPOSIT_ACCOUNT",
          "rule_name": "Verified/Suspect CEX Deposit Terminal",
          "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
          "points": 95,
          "confidence": 0.96
        }
      ],
      "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
    },
    {
      "id": "0xP2P_Merchant_Kolkata_3748291045",
      "label": "[Peel Dust] 0xP2P_Me...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 40,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "background-web",
      "risk_severity": "MODERATE",
      "risk_breakdown": {
        "baseline": 20,
        "rapid_velocity_sub_30min": 20
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_30MIN",
          "rule_name": "High-Velocity Mule Hop (< 30 min)",
          "description": "Transferred funds in 15 mins, matching automated money-mule routing signatures.",
          "points": 20,
          "confidence": 0.9
        }
      ],
      "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
    },
    {
      "id": "0xGasFunder_EVM_0019283746",
      "label": "[Peel Dust] 0xGasFun...",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 30,
      "role_tag": "DECOY / PEEL OUTLET",
      "cluster_label": "Structuring Peel",
      "balance_hint": null,
      "label_confidence": 0.55,
      "is_on_primary_path": false,
      "isCorePath": false,
      "parentBoxId": "gas-refill",
      "risk_severity": "LOW",
      "risk_breakdown": {
        "baseline": 20,
        "velocity_sub_2hr": 10
      },
      "risk_rules": [
        {
          "rule_id": "BASELINE_INTERMEDIARY",
          "rule_name": "Unverified Intermediary Baseline",
          "description": "Unregistered wallet address participating in multi-hop transaction chain.",
          "points": 20,
          "confidence": 0.75
        },
        {
          "rule_id": "RAPID_VELOCITY_SUB_2HR",
          "rule_name": "Moderate-Velocity Hop (< 2 hrs)",
          "description": "Transferred funds in 60 mins, indicating coordinated layering ring behavior.",
          "points": 10,
          "confidence": 0.8
        }
      ],
      "risk_explanation": "LOW risk profile (30/100) triggered by 1 distinct heuristic rules: Moderate-Velocity Hop (< 2 hrs)."
    },
    {
      "id": "0xVICTIM_480K_FRAUD_7b93a2c4e1",
      "label": "[Victim Reported Wallet]",
      "node_type": "victim",
      "node_class": "source_wallet",
      "risk_score": 10,
      "role_tag": "REPORTED VICTIM",
      "cluster_label": "Complainant",
      "balance_hint": null,
      "label_confidence": 1.0,
      "is_on_primary_path": true,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "risk_severity": "LOW",
      "risk_breakdown": {
        "victim_origin": 10
      },
      "risk_rules": [
        {
          "rule_id": "COMPLAINANT_VICTIM_ORIGIN",
          "rule_name": "Reported Victim Wallet",
          "description": "Complainant wallet identified in FIR as source of stolen funds.",
          "points": 10,
          "confidence": 1.0
        }
      ],
      "risk_explanation": "Complainant victim wallet: Verified fund source without laundering liability."
    },
    {
      "id": "0xExpandIn_c61352e3",
      "label": "[Expanded Inbound] 0xExpa…",
      "node_type": "mule",
      "node_class": "intermediary",
      "risk_score": 75,
      "role_tag": "EXPANDED COUNTERPARTY",
      "cluster_label": "Expanded Cluster",
      "balance_hint": null,
      "label_confidence": 0.75,
      "is_on_primary_path": false,
      "isCorePath": null,
      "parentBoxId": null,
      "risk_severity": "HIGH",
      "risk_breakdown": null,
      "risk_rules": null,
      "risk_explanation": null
    },
    {
      "id": "0xExpandOut_19f6d5e2",
      "label": "[Expanded Outbound] 0xExpa…",
      "node_type": "peel_outlet",
      "node_class": "unknown",
      "risk_score": 60,
      "role_tag": "EXPANDED COUNTERPARTY",
      "cluster_label": "Expanded Cluster",
      "balance_hint": null,
      "label_confidence": 0.7,
      "is_on_primary_path": false,
      "isCorePath": null,
      "parentBoxId": null,
      "risk_severity": "HIGH",
      "risk_breakdown": null,
      "risk_rules": null,
      "risk_explanation": null
    }
  ],
  "edges": [
    {
      "source": "0xVICTIM_480K_FRAUD_7b93a2c4e1",
      "target": "0xScamCollection_a19f82d3e4b5",
      "amount": 5750.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788887400,
      "time_str": "17:10 UTC",
      "tx_hash": "0x1111480000000000000000000000000000000000000000000000000000000001",
      "is_primary": true,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "velocity_mins": 0
    },
    {
      "source": "0xScamCollection_a19f82d3e4b5",
      "target": "0xMuleLayerA_c4d5e6f70819",
      "amount": 5650.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788888120,
      "time_str": "17:22 UTC",
      "tx_hash": "0x2222480000000000000000000000000000000000000000000000000000000002",
      "is_primary": true,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "velocity_mins": 12
    },
    {
      "source": "0xScamCollection_a19f82d3e4b5",
      "target": "0xPeelDust_Runner01_1029384756",
      "amount": 100.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788888150,
      "time_str": "17:22 UTC",
      "tx_hash": "0x2222peel0000000000000000000000000000000000000000000000000000001a",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "peel-structuring",
      "velocity_mins": 12
    },
    {
      "source": "0xMuleLayerA_c4d5e6f70819",
      "target": "0xMuleLayerB_8f9e0a1b2c3d",
      "amount": 5500.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788888900,
      "time_str": "17:35 UTC",
      "tx_hash": "0x3333480000000000000000000000000000000000000000000000000000000003",
      "is_primary": true,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "velocity_mins": 25
    },
    {
      "source": "0xMuleLayerA_c4d5e6f70819",
      "target": "0xPeelDust_Runner02_5647382910",
      "amount": 150.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788888920,
      "time_str": "17:35 UTC",
      "tx_hash": "0x3333peel0000000000000000000000000000000000000000000000000000002b",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "peel-structuring",
      "velocity_mins": 25
    },
    {
      "source": "0xMuleLayerB_8f9e0a1b2c3d",
      "target": "0xUnknownDeposit_3e4f5a6b7c8d",
      "amount": 5350.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788889600,
      "time_str": "17:46 UTC",
      "tx_hash": "0x4444480000000000000000000000000000000000000000000000000000000004",
      "is_primary": true,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "velocity_mins": 36
    },
    {
      "source": "0xMuleLayerB_8f9e0a1b2c3d",
      "target": "0xPeelDust_Runner03_9988776655",
      "amount": 150.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788889620,
      "time_str": "17:47 UTC",
      "tx_hash": "0x4444peel0000000000000000000000000000000000000000000000000000003c",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "peel-structuring",
      "velocity_mins": 37
    },
    {
      "source": "0xUnknownDeposit_3e4f5a6b7c8d",
      "target": "0x71c3fb9904d3e33e9d8f8e02d847b74f38e63021",
      "amount": 5300.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788892120,
      "time_str": "18:28 UTC",
      "tx_hash": "0xabc480dcx9923eef108745671239847120398417230498172039481230498123",
      "is_primary": true,
      "isCorePath": true,
      "parentBoxId": "core-path",
      "velocity_mins": 78
    },
    {
      "source": "0xGasFunder_EVM_0019283746",
      "target": "0xUnknownDeposit_3e4f5a6b7c8d",
      "amount": 15.0,
      "token": "ETH",
      "token_symbol": "ETH",
      "timestamp_utc": 1788891500,
      "time_str": "18:18 UTC",
      "tx_hash": "0xgas0000000000000000000000000000000000000000000000000000000000001",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "gas-refill",
      "velocity_mins": 68
    },
    {
      "source": "0xGasFunder_EVM_0019283746",
      "target": "0xMuleLayerA_c4d5e6f70819",
      "amount": 12.0,
      "token": "ETH",
      "token_symbol": "ETH",
      "timestamp_utc": 1788887900,
      "time_str": "17:18 UTC",
      "tx_hash": "0xgas0000000000000000000000000000000000000000000000000000000000002",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "gas-refill",
      "velocity_mins": 8
    },
    {
      "source": "0xGasFunder_EVM_0019283746",
      "target": "0xMuleLayerB_8f9e0a1b2c3d",
      "amount": 12.0,
      "token": "ETH",
      "token_symbol": "ETH",
      "timestamp_utc": 1788888700,
      "time_str": "17:31 UTC",
      "tx_hash": "0xgas0000000000000000000000000000000000000000000000000000000000003",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "gas-refill",
      "velocity_mins": 21
    },
    {
      "source": "0xPeelDust_Runner01_1029384756",
      "target": "0xP2P_Merchant_Delhi_9182736450",
      "amount": 95.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788888500,
      "time_str": "17:28 UTC",
      "tx_hash": "0xp2p0000000000000000000000000000000000000000000000000000000000001",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "background-web",
      "velocity_mins": 18
    },
    {
      "source": "0xPeelDust_Runner02_5647382910",
      "target": "0xP2P_Merchant_Mumbai_2837465910",
      "amount": 145.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788889200,
      "time_str": "17:40 UTC",
      "tx_hash": "0xp2p0000000000000000000000000000000000000000000000000000000000002",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "background-web",
      "velocity_mins": 30
    },
    {
      "source": "0xPeelDust_Runner03_9988776655",
      "target": "0xP2P_Merchant_Kolkata_3748291045",
      "amount": 140.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788890100,
      "time_str": "17:55 UTC",
      "tx_hash": "0xp2p0000000000000000000000000000000000000000000000000000000000003",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "background-web",
      "velocity_mins": 45
    },
    {
      "source": "0xExternalSyndicateCollector_8819203",
      "target": "0xScamCollection_a19f82d3e4b5",
      "amount": 2500.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788886900,
      "time_str": "17:01 UTC",
      "tx_hash": "0xext0000000000000000000000000000000000000000000000000000000000001",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "runner-network",
      "velocity_mins": 0
    },
    {
      "source": "0xOtherVictim_Telegram_91823746",
      "target": "0xScamCollection_a19f82d3e4b5",
      "amount": 1200.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788887100,
      "time_str": "17:05 UTC",
      "tx_hash": "0xext0000000000000000000000000000000000000000000000000000000000002",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "runner-network",
      "velocity_mins": 0
    },
    {
      "source": "0xMuleLayerA_c4d5e6f70819",
      "target": "0xDecoyBurner_1928374650",
      "amount": 35.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788888300,
      "time_str": "17:25 UTC",
      "tx_hash": "0xdecoy00000000000000000000000000000000000000000000000000000000001",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "peel-structuring",
      "velocity_mins": 15
    },
    {
      "source": "0xMuleLayerB_8f9e0a1b2c3d",
      "target": "0xDecoyBurner_1928374650",
      "amount": 45.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788889100,
      "time_str": "17:38 UTC",
      "tx_hash": "0xdecoy00000000000000000000000000000000000000000000000000000000002",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "peel-structuring",
      "velocity_mins": 28
    },
    {
      "source": "0xScamCollection_a19f82d3e4b5",
      "target": "0xDecoyBurner_1928374650",
      "amount": 25.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788887950,
      "time_str": "17:19 UTC",
      "tx_hash": "0xdecoy00000000000000000000000000000000000000000000000000000000003",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "peel-structuring",
      "velocity_mins": 9
    },
    {
      "source": "0x71c3fb9904d3e33e9d8f8e02d847b74f38e63021",
      "target": "0xCoinDCX_ColdVault_MasterStorage0001",
      "amount": 50000.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788898000,
      "time_str": "20:06 UTC",
      "tx_hash": "0xcold000000000000000000000000000000000000000000000000000000000001",
      "is_primary": false,
      "isCorePath": false,
      "parentBoxId": "background-web",
      "velocity_mins": 176
    },
    {
      "source": "0xExpandIn_c61352e3",
      "target": "0xMuleLayerB_8f9e0a1b2c3d",
      "amount": 750.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788952095,
      "time_str": "Expanded",
      "tx_hash": "0xexp1_28e647bded6d4552",
      "is_primary": false,
      "isCorePath": null,
      "parentBoxId": null,
      "velocity_mins": 60
    },
    {
      "source": "0xMuleLayerB_8f9e0a1b2c3d",
      "target": "0xExpandOut_19f6d5e2",
      "amount": 450.0,
      "token": "USDT",
      "token_symbol": "USDT",
      "timestamp_utc": 1788953895,
      "time_str": "Expanded",
      "tx_hash": "0xexp2_162ab36e20ad4b89",
      "is_primary": false,
      "isCorePath": null,
      "parentBoxId": null,
      "velocity_mins": 30
    }
  ],
  "brief": {
    "title": "Automated Layered Mule Laundering & CoinDCX CEX Off-Ramp",
    "typology": "Task-Based Cyber Fraud / Structuring (EVM)",
    "time_to_exchange_mins": 176,
    "stolen_amount_usd": 5750.0,
    "intermediary_mules_count": 4,
    "identified_vasp": "CoinDCX",
    "target_deposit_wallet": "0xUnknownDeposit_3e4f5a6b7c8d",
    "recommended_legal_action": "Dispatch Section 94 BNSS preservation directive to CoinDCX Nodal Compliance to debit-freeze target account.",
    "narrative": "Victim reported funds of 5,750.00 structured across 4 intermediary mule accounts within 176 minutes on the EVM network before consolidating and sweeping into CoinDCX.",
    "case_risk_score": 95,
    "case_risk_severity": "CRITICAL",
    "case_risk_breakdown": {
      "max_node_risk": 95,
      "mule_conduits_flagged": 4,
      "peeling_structuring_detected": false,
      "rapid_velocity_detected": false
    }
  },
  "primary_path": [
    "0xVICTIM_480K_FRAUD_7b93a2c4e1",
    "0xScamCollection_a19f82d3e4b5",
    "0xMuleLayerA_c4d5e6f70819",
    "0xMuleLayerB_8f9e0a1b2c3d",
    "0xUnknownDeposit_3e4f5a6b7c8d",
    "0x71c3fb9904d3e33e9d8f8e02d847b74f38e63021"
  ],
  "start": {
    "case_id": "CASE-TRON-BABA8440",
    "trace_id": "0e1314ee-23a1-48a4-ade0-5e05addbe7b5",
    "detected_chain": "EVM",
    "transfer_count": 20,
    "data_source": "standalone_cloud_preview",
    "warning": "Showing demo data — live source unavailable (Scenario: inr_480k_coindcx_scam)",
    "reached_exchange": true,
    "destination_vasp": "CoinDCX",
    "terminal_amount": 5300.0,
    "hop_count": 5,
    "trace_time_ms": 0.042,
    "primary_path_addresses": [
      "0xVICTIM_480K_FRAUD_7b93a2c4e1",
      "0xScamCollection_a19f82d3e4b5",
      "0xMuleLayerA_c4d5e6f70819",
      "0xMuleLayerB_8f9e0a1b2c3d",
      "0xUnknownDeposit_3e4f5a6b7c8d",
      "0x71c3fb9904d3e33e9d8f8e02d847b74f38e63021"
    ],
    "typology_summary": "Task-Based Cyber Fraud / Structuring (EVM)"
  },
  "graph": {
    "case_id": "CASE-TRON-BABA8440",
    "trace_id": "0e1314ee-23a1-48a4-ade0-5e05addbe7b5",
    "data_source": "standalone_cloud_preview",
    "nodes": [
      {
        "id": "0xDecoyBurner_1928374650",
        "label": "[Suspected CEX Deposit]",
        "node_type": "exchange_deposit",
        "node_class": "exchange_suspected",
        "risk_score": 95,
        "role_tag": "SUSPECT CEX DEPOSIT",
        "cluster_label": "CoinDCX",
        "balance_hint": null,
        "label_confidence": 0.7000000000000001,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "background-web",
        "risk_severity": "CRITICAL",
        "risk_breakdown": {
          "cex_deposit_account": 95
        },
        "risk_rules": [
          {
            "rule_id": "CEX_DEPOSIT_ACCOUNT",
            "rule_name": "Verified/Suspect CEX Deposit Terminal",
            "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
            "points": 95,
            "confidence": 0.96
          }
        ],
        "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
      },
      {
        "id": "0xPeelDust_Runner03_9988776655",
        "label": "[Peel Dust] 0xPeelDu...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "runner-network",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 8 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "0xMuleLayerB_8f9e0a1b2c3d",
        "label": "[Mule] 0xMuleLa...",
        "node_type": "mule",
        "node_class": "intermediary",
        "risk_score": 55,
        "role_tag": "HIGH VELOCITY MULE",
        "cluster_label": "Layering Ring",
        "balance_hint": null,
        "label_confidence": 0.85,
        "is_on_primary_path": true,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20,
          "cex_proximity_urgency": 15
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 15 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          },
          {
            "rule_id": "CEX_PROXIMITY_URGENCY",
            "rule_name": "Exchange Off-Ramp Proximity (<= 2 Hops)",
            "description": "Directly upstream of exchange deposit terminal (2 hops). High flight risk.",
            "points": 15,
            "confidence": 0.88
          }
        ],
        "risk_explanation": "MODERATE risk profile (55/100) triggered by 2 distinct heuristic rules: High-Velocity Mule Hop (< 30 min), Exchange Off-Ramp Proximity (<= 2 Hops)."
      },
      {
        "id": "0xPeelDust_Runner01_1029384756",
        "label": "[Peel Dust] 0xPeelDu...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "runner-network",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 5 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "0xP2P_Merchant_Delhi_9182736450",
        "label": "[Peel Dust] 0xP2P_Me...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "background-web",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 15 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "0xP2P_Merchant_Mumbai_2837465910",
        "label": "[Peel Dust] 0xP2P_Me...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "background-web",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 15 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "0xCoinDCX_ColdVault_MasterStorage0001",
        "label": "[Peel Dust] 0xCoinDC...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "background-web",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 15 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "0xOtherVictim_Telegram_91823746",
        "label": "[Suspected Exchange User Deposit]",
        "node_type": "exchange_deposit",
        "node_class": "exchange_suspected",
        "risk_score": 95,
        "role_tag": "SUSPECT CEX DEPOSIT",
        "cluster_label": "Sweep Cluster",
        "balance_hint": null,
        "label_confidence": 0.7,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "background-web",
        "risk_severity": "CRITICAL",
        "risk_breakdown": {
          "cex_deposit_account": 95
        },
        "risk_rules": [
          {
            "rule_id": "CEX_DEPOSIT_ACCOUNT",
            "rule_name": "Verified/Suspect CEX Deposit Terminal",
            "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
            "points": 95,
            "confidence": 0.96
          }
        ],
        "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
      },
      {
        "id": "0x71c3fb9904d3e33e9d8f8e02d847b74f38e63021",
        "label": "[CoinDCX Hot Wallet]",
        "node_type": "exchange_hotwallet",
        "node_class": "exchange_confirmed",
        "risk_score": 85,
        "role_tag": "HOT WALLET (SWEEP TERMINAL)",
        "cluster_label": "CoinDCX",
        "balance_hint": null,
        "label_confidence": 0.99,
        "is_on_primary_path": true,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "risk_severity": "CRITICAL",
        "risk_breakdown": {
          "terminal_cex_hotwallet": 85
        },
        "risk_rules": [
          {
            "rule_id": "CEX_HOT_WALLET_TERMINAL",
            "rule_name": "Terminal VASP Hot Wallet",
            "description": "Centralized exchange omnibus hot wallet cluster where laundered funds consolidated.",
            "points": 85,
            "confidence": 0.99
          }
        ],
        "risk_explanation": "Terminal centralized exchange hot wallet cluster: Final off-ramp consolidation."
      },
      {
        "id": "0xUnknownDeposit_3e4f5a6b7c8d",
        "label": "[Mule] 0xUnknow...",
        "node_type": "mule",
        "node_class": "intermediary",
        "risk_score": 45,
        "role_tag": "HIGH VELOCITY MULE",
        "cluster_label": "Layering Ring",
        "balance_hint": null,
        "label_confidence": 0.85,
        "is_on_primary_path": true,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "velocity_sub_2hr": 10,
          "cex_proximity_urgency": 15
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_2HR",
            "rule_name": "Moderate-Velocity Hop (< 2 hrs)",
            "description": "Transferred funds in 42 mins, indicating coordinated layering ring behavior.",
            "points": 10,
            "confidence": 0.8
          },
          {
            "rule_id": "CEX_PROXIMITY_URGENCY",
            "rule_name": "Exchange Off-Ramp Proximity (<= 2 Hops)",
            "description": "Directly upstream of exchange deposit terminal (1 hops). High flight risk.",
            "points": 15,
            "confidence": 0.88
          }
        ],
        "risk_explanation": "MODERATE risk profile (45/100) triggered by 2 distinct heuristic rules: Moderate-Velocity Hop (< 2 hrs), Exchange Off-Ramp Proximity (<= 2 Hops)."
      },
      {
        "id": "0xScamCollection_a19f82d3e4b5",
        "label": "[Mule] 0xScamCo...",
        "node_type": "mule",
        "node_class": "intermediary",
        "risk_score": 40,
        "role_tag": "HIGH VELOCITY MULE",
        "cluster_label": "Layering Ring",
        "balance_hint": null,
        "label_confidence": 0.85,
        "is_on_primary_path": true,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 20 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "0xPeelDust_Runner02_5647382910",
        "label": "[Peel Dust] 0xPeelDu...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "runner-network",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 4 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "0xMuleLayerA_c4d5e6f70819",
        "label": "[Mule] 0xMuleLa...",
        "node_type": "mule",
        "node_class": "intermediary",
        "risk_score": 40,
        "role_tag": "HIGH VELOCITY MULE",
        "cluster_label": "Layering Ring",
        "balance_hint": null,
        "label_confidence": 0.85,
        "is_on_primary_path": true,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 17 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "0xExternalSyndicateCollector_8819203",
        "label": "[Suspected Exchange User Deposit]",
        "node_type": "exchange_deposit",
        "node_class": "exchange_suspected",
        "risk_score": 95,
        "role_tag": "SUSPECT CEX DEPOSIT",
        "cluster_label": "Sweep Cluster",
        "balance_hint": null,
        "label_confidence": 0.7,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "runner-network",
        "risk_severity": "CRITICAL",
        "risk_breakdown": {
          "cex_deposit_account": 95
        },
        "risk_rules": [
          {
            "rule_id": "CEX_DEPOSIT_ACCOUNT",
            "rule_name": "Verified/Suspect CEX Deposit Terminal",
            "description": "Customer deposit wallet linked to internal exchange UID/KYC. Statutory target for Section 94 BNSS freeze.",
            "points": 95,
            "confidence": 0.96
          }
        ],
        "risk_explanation": "High-priority off-ramp terminal: Funds swept into exchange master wallet."
      },
      {
        "id": "0xP2P_Merchant_Kolkata_3748291045",
        "label": "[Peel Dust] 0xP2P_Me...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 40,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "background-web",
        "risk_severity": "MODERATE",
        "risk_breakdown": {
          "baseline": 20,
          "rapid_velocity_sub_30min": 20
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_30MIN",
            "rule_name": "High-Velocity Mule Hop (< 30 min)",
            "description": "Transferred funds in 15 mins, matching automated money-mule routing signatures.",
            "points": 20,
            "confidence": 0.9
          }
        ],
        "risk_explanation": "MODERATE risk profile (40/100) triggered by 1 distinct heuristic rules: High-Velocity Mule Hop (< 30 min)."
      },
      {
        "id": "0xGasFunder_EVM_0019283746",
        "label": "[Peel Dust] 0xGasFun...",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 30,
        "role_tag": "DECOY / PEEL OUTLET",
        "cluster_label": "Structuring Peel",
        "balance_hint": null,
        "label_confidence": 0.55,
        "is_on_primary_path": false,
        "isCorePath": false,
        "parentBoxId": "gas-refill",
        "risk_severity": "LOW",
        "risk_breakdown": {
          "baseline": 20,
          "velocity_sub_2hr": 10
        },
        "risk_rules": [
          {
            "rule_id": "BASELINE_INTERMEDIARY",
            "rule_name": "Unverified Intermediary Baseline",
            "description": "Unregistered wallet address participating in multi-hop transaction chain.",
            "points": 20,
            "confidence": 0.75
          },
          {
            "rule_id": "RAPID_VELOCITY_SUB_2HR",
            "rule_name": "Moderate-Velocity Hop (< 2 hrs)",
            "description": "Transferred funds in 60 mins, indicating coordinated layering ring behavior.",
            "points": 10,
            "confidence": 0.8
          }
        ],
        "risk_explanation": "LOW risk profile (30/100) triggered by 1 distinct heuristic rules: Moderate-Velocity Hop (< 2 hrs)."
      },
      {
        "id": "0xVICTIM_480K_FRAUD_7b93a2c4e1",
        "label": "[Victim Reported Wallet]",
        "node_type": "victim",
        "node_class": "source_wallet",
        "risk_score": 10,
        "role_tag": "REPORTED VICTIM",
        "cluster_label": "Complainant",
        "balance_hint": null,
        "label_confidence": 1.0,
        "is_on_primary_path": true,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "risk_severity": "LOW",
        "risk_breakdown": {
          "victim_origin": 10
        },
        "risk_rules": [
          {
            "rule_id": "COMPLAINANT_VICTIM_ORIGIN",
            "rule_name": "Reported Victim Wallet",
            "description": "Complainant wallet identified in FIR as source of stolen funds.",
            "points": 10,
            "confidence": 1.0
          }
        ],
        "risk_explanation": "Complainant victim wallet: Verified fund source without laundering liability."
      },
      {
        "id": "0xExpandIn_c61352e3",
        "label": "[Expanded Inbound] 0xExpa…",
        "node_type": "mule",
        "node_class": "intermediary",
        "risk_score": 75,
        "role_tag": "EXPANDED COUNTERPARTY",
        "cluster_label": "Expanded Cluster",
        "balance_hint": null,
        "label_confidence": 0.75,
        "is_on_primary_path": false,
        "isCorePath": null,
        "parentBoxId": null,
        "risk_severity": "HIGH",
        "risk_breakdown": null,
        "risk_rules": null,
        "risk_explanation": null
      },
      {
        "id": "0xExpandOut_19f6d5e2",
        "label": "[Expanded Outbound] 0xExpa…",
        "node_type": "peel_outlet",
        "node_class": "unknown",
        "risk_score": 60,
        "role_tag": "EXPANDED COUNTERPARTY",
        "cluster_label": "Expanded Cluster",
        "balance_hint": null,
        "label_confidence": 0.7,
        "is_on_primary_path": false,
        "isCorePath": null,
        "parentBoxId": null,
        "risk_severity": "HIGH",
        "risk_breakdown": null,
        "risk_rules": null,
        "risk_explanation": null
      }
    ],
    "edges": [
      {
        "source": "0xVICTIM_480K_FRAUD_7b93a2c4e1",
        "target": "0xScamCollection_a19f82d3e4b5",
        "amount": 5750.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788887400,
        "time_str": "17:10 UTC",
        "tx_hash": "0x1111480000000000000000000000000000000000000000000000000000000001",
        "is_primary": true,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "velocity_mins": 0
      },
      {
        "source": "0xScamCollection_a19f82d3e4b5",
        "target": "0xMuleLayerA_c4d5e6f70819",
        "amount": 5650.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788888120,
        "time_str": "17:22 UTC",
        "tx_hash": "0x2222480000000000000000000000000000000000000000000000000000000002",
        "is_primary": true,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "velocity_mins": 12
      },
      {
        "source": "0xScamCollection_a19f82d3e4b5",
        "target": "0xPeelDust_Runner01_1029384756",
        "amount": 100.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788888150,
        "time_str": "17:22 UTC",
        "tx_hash": "0x2222peel0000000000000000000000000000000000000000000000000000001a",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "peel-structuring",
        "velocity_mins": 12
      },
      {
        "source": "0xMuleLayerA_c4d5e6f70819",
        "target": "0xMuleLayerB_8f9e0a1b2c3d",
        "amount": 5500.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788888900,
        "time_str": "17:35 UTC",
        "tx_hash": "0x3333480000000000000000000000000000000000000000000000000000000003",
        "is_primary": true,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "velocity_mins": 25
      },
      {
        "source": "0xMuleLayerA_c4d5e6f70819",
        "target": "0xPeelDust_Runner02_5647382910",
        "amount": 150.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788888920,
        "time_str": "17:35 UTC",
        "tx_hash": "0x3333peel0000000000000000000000000000000000000000000000000000002b",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "peel-structuring",
        "velocity_mins": 25
      },
      {
        "source": "0xMuleLayerB_8f9e0a1b2c3d",
        "target": "0xUnknownDeposit_3e4f5a6b7c8d",
        "amount": 5350.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788889600,
        "time_str": "17:46 UTC",
        "tx_hash": "0x4444480000000000000000000000000000000000000000000000000000000004",
        "is_primary": true,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "velocity_mins": 36
      },
      {
        "source": "0xMuleLayerB_8f9e0a1b2c3d",
        "target": "0xPeelDust_Runner03_9988776655",
        "amount": 150.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788889620,
        "time_str": "17:47 UTC",
        "tx_hash": "0x4444peel0000000000000000000000000000000000000000000000000000003c",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "peel-structuring",
        "velocity_mins": 37
      },
      {
        "source": "0xUnknownDeposit_3e4f5a6b7c8d",
        "target": "0x71c3fb9904d3e33e9d8f8e02d847b74f38e63021",
        "amount": 5300.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788892120,
        "time_str": "18:28 UTC",
        "tx_hash": "0xabc480dcx9923eef108745671239847120398417230498172039481230498123",
        "is_primary": true,
        "isCorePath": true,
        "parentBoxId": "core-path",
        "velocity_mins": 78
      },
      {
        "source": "0xGasFunder_EVM_0019283746",
        "target": "0xUnknownDeposit_3e4f5a6b7c8d",
        "amount": 15.0,
        "token": "ETH",
        "token_symbol": "ETH",
        "timestamp_utc": 1788891500,
        "time_str": "18:18 UTC",
        "tx_hash": "0xgas0000000000000000000000000000000000000000000000000000000000001",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "gas-refill",
        "velocity_mins": 68
      },
      {
        "source": "0xGasFunder_EVM_0019283746",
        "target": "0xMuleLayerA_c4d5e6f70819",
        "amount": 12.0,
        "token": "ETH",
        "token_symbol": "ETH",
        "timestamp_utc": 1788887900,
        "time_str": "17:18 UTC",
        "tx_hash": "0xgas0000000000000000000000000000000000000000000000000000000000002",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "gas-refill",
        "velocity_mins": 8
      },
      {
        "source": "0xGasFunder_EVM_0019283746",
        "target": "0xMuleLayerB_8f9e0a1b2c3d",
        "amount": 12.0,
        "token": "ETH",
        "token_symbol": "ETH",
        "timestamp_utc": 1788888700,
        "time_str": "17:31 UTC",
        "tx_hash": "0xgas0000000000000000000000000000000000000000000000000000000000003",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "gas-refill",
        "velocity_mins": 21
      },
      {
        "source": "0xPeelDust_Runner01_1029384756",
        "target": "0xP2P_Merchant_Delhi_9182736450",
        "amount": 95.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788888500,
        "time_str": "17:28 UTC",
        "tx_hash": "0xp2p0000000000000000000000000000000000000000000000000000000000001",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "background-web",
        "velocity_mins": 18
      },
      {
        "source": "0xPeelDust_Runner02_5647382910",
        "target": "0xP2P_Merchant_Mumbai_2837465910",
        "amount": 145.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788889200,
        "time_str": "17:40 UTC",
        "tx_hash": "0xp2p0000000000000000000000000000000000000000000000000000000000002",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "background-web",
        "velocity_mins": 30
      },
      {
        "source": "0xPeelDust_Runner03_9988776655",
        "target": "0xP2P_Merchant_Kolkata_3748291045",
        "amount": 140.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788890100,
        "time_str": "17:55 UTC",
        "tx_hash": "0xp2p0000000000000000000000000000000000000000000000000000000000003",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "background-web",
        "velocity_mins": 45
      },
      {
        "source": "0xExternalSyndicateCollector_8819203",
        "target": "0xScamCollection_a19f82d3e4b5",
        "amount": 2500.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788886900,
        "time_str": "17:01 UTC",
        "tx_hash": "0xext0000000000000000000000000000000000000000000000000000000000001",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "runner-network",
        "velocity_mins": 0
      },
      {
        "source": "0xOtherVictim_Telegram_91823746",
        "target": "0xScamCollection_a19f82d3e4b5",
        "amount": 1200.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788887100,
        "time_str": "17:05 UTC",
        "tx_hash": "0xext0000000000000000000000000000000000000000000000000000000000002",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "runner-network",
        "velocity_mins": 0
      },
      {
        "source": "0xMuleLayerA_c4d5e6f70819",
        "target": "0xDecoyBurner_1928374650",
        "amount": 35.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788888300,
        "time_str": "17:25 UTC",
        "tx_hash": "0xdecoy00000000000000000000000000000000000000000000000000000000001",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "peel-structuring",
        "velocity_mins": 15
      },
      {
        "source": "0xMuleLayerB_8f9e0a1b2c3d",
        "target": "0xDecoyBurner_1928374650",
        "amount": 45.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788889100,
        "time_str": "17:38 UTC",
        "tx_hash": "0xdecoy00000000000000000000000000000000000000000000000000000000002",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "peel-structuring",
        "velocity_mins": 28
      },
      {
        "source": "0xScamCollection_a19f82d3e4b5",
        "target": "0xDecoyBurner_1928374650",
        "amount": 25.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788887950,
        "time_str": "17:19 UTC",
        "tx_hash": "0xdecoy00000000000000000000000000000000000000000000000000000000003",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "peel-structuring",
        "velocity_mins": 9
      },
      {
        "source": "0x71c3fb9904d3e33e9d8f8e02d847b74f38e63021",
        "target": "0xCoinDCX_ColdVault_MasterStorage0001",
        "amount": 50000.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788898000,
        "time_str": "20:06 UTC",
        "tx_hash": "0xcold000000000000000000000000000000000000000000000000000000000001",
        "is_primary": false,
        "isCorePath": false,
        "parentBoxId": "background-web",
        "velocity_mins": 176
      },
      {
        "source": "0xExpandIn_c61352e3",
        "target": "0xMuleLayerB_8f9e0a1b2c3d",
        "amount": 750.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788952095,
        "time_str": "Expanded",
        "tx_hash": "0xexp1_28e647bded6d4552",
        "is_primary": false,
        "isCorePath": null,
        "parentBoxId": null,
        "velocity_mins": 60
      },
      {
        "source": "0xMuleLayerB_8f9e0a1b2c3d",
        "target": "0xExpandOut_19f6d5e2",
        "amount": 450.0,
        "token": "USDT",
        "token_symbol": "USDT",
        "timestamp_utc": 1788953895,
        "time_str": "Expanded",
        "tx_hash": "0xexp2_162ab36e20ad4b89",
        "is_primary": false,
        "isCorePath": null,
        "parentBoxId": null,
        "velocity_mins": 30
      }
    ],
    "brief": {
      "title": "Automated Layered Mule Laundering & CoinDCX CEX Off-Ramp",
      "typology": "Task-Based Cyber Fraud / Structuring (EVM)",
      "time_to_exchange_mins": 176,
      "stolen_amount_usd": 5750.0,
      "intermediary_mules_count": 4,
      "identified_vasp": "CoinDCX",
      "target_deposit_wallet": "0xUnknownDeposit_3e4f5a6b7c8d",
      "recommended_legal_action": "Dispatch Section 94 BNSS preservation directive to CoinDCX Nodal Compliance to debit-freeze target account.",
      "narrative": "Victim reported funds of 5,750.00 structured across 4 intermediary mule accounts within 176 minutes on the EVM network before consolidating and sweeping into CoinDCX.",
      "case_risk_score": 95,
      "case_risk_severity": "CRITICAL",
      "case_risk_breakdown": {
        "max_node_risk": 95,
        "mule_conduits_flagged": 4,
        "peeling_structuring_detected": false,
        "rapid_velocity_detected": false
      }
    },
    "primary_path": [
      "0xVICTIM_480K_FRAUD_7b93a2c4e1",
      "0xScamCollection_a19f82d3e4b5",
      "0xMuleLayerA_c4d5e6f70819",
      "0xMuleLayerB_8f9e0a1b2c3d",
      "0xUnknownDeposit_3e4f5a6b7c8d",
      "0x71c3fb9904d3e33e9d8f8e02d847b74f38e63021"
    ]
  },
  "off_ramp": {
    "found": true,
    "hops_searched": 5,
    "truncated": false,
    "path": [
      {
        "source": "0xVICTIM_480K_FRAUD_7b93a2c4e1",
        "target": "0xScamCollection_a19f82d3e4b5",
        "amount": 5750.0,
        "token": "USDT",
        "tx_hash": "0x1111480000000000000000000000000000000000000000000000000000000001",
        "timestamp_utc": 1788887400
      },
      {
        "source": "0xScamCollection_a19f82d3e4b5",
        "target": "0xMuleLayerA_c4d5e6f70819",
        "amount": 5650.0,
        "token": "USDT",
        "tx_hash": "0x2222480000000000000000000000000000000000000000000000000000000002",
        "timestamp_utc": 1788888120
      },
      {
        "source": "0xMuleLayerA_c4d5e6f70819",
        "target": "0xMuleLayerB_8f9e0a1b2c3d",
        "amount": 5500.0,
        "token": "USDT",
        "tx_hash": "0x3333480000000000000000000000000000000000000000000000000000000003",
        "timestamp_utc": 1788888900
      },
      {
        "source": "0xMuleLayerB_8f9e0a1b2c3d",
        "target": "0xUnknownDeposit_3e4f5a6b7c8d",
        "amount": 5350.0,
        "token": "USDT",
        "tx_hash": "0x4444480000000000000000000000000000000000000000000000000000000004",
        "timestamp_utc": 1788889600
      },
      {
        "source": "0xUnknownDeposit_3e4f5a6b7c8d",
        "target": "0x71c3fb9904d3e33e9d8f8e02d847b74f38e63021",
        "amount": 5300.0,
        "token": "USDT",
        "tx_hash": "0xabc480dcx9923eef108745671239847120398417230498172039481230498123",
        "timestamp_utc": 1788892120
      }
    ],
    "terminal_label": "[CoinDCX Hot Wallet]",
    "disclaimer": "Heuristic off-ramp detection is an investigative lead, not conclusive proof of account ownership or CEX deposit attribution. Verification with exchange compliance under Section 94 BNSS is required."
  },
  "expansions": {
    "0xMuleLayerB_8f9e0a1b2c3d": {
      "expanded_address": "0xMuleLayerB_8f9e0a1b2c3d",
      "new_nodes": [
        {
          "id": "0xExpandIn_c61352e3",
          "label": "[Expanded Inbound] 0xExpa…",
          "node_type": "mule",
          "node_class": "intermediary",
          "risk_score": 75,
          "role_tag": "EXPANDED COUNTERPARTY",
          "cluster_label": "Expanded Cluster",
          "balance_hint": null,
          "label_confidence": 0.75,
          "is_on_primary_path": false,
          "isCorePath": null,
          "parentBoxId": null,
          "risk_severity": "HIGH",
          "risk_breakdown": null,
          "risk_rules": null,
          "risk_explanation": null
        },
        {
          "id": "0xExpandOut_19f6d5e2",
          "label": "[Expanded Outbound] 0xExpa…",
          "node_type": "peel_outlet",
          "node_class": "unknown",
          "risk_score": 60,
          "role_tag": "EXPANDED COUNTERPARTY",
          "cluster_label": "Expanded Cluster",
          "balance_hint": null,
          "label_confidence": 0.7,
          "is_on_primary_path": false,
          "isCorePath": null,
          "parentBoxId": null,
          "risk_severity": "HIGH",
          "risk_breakdown": null,
          "risk_rules": null,
          "risk_explanation": null
        }
      ],
      "new_edges": [
        {
          "source": "0xExpandIn_c61352e3",
          "target": "0xMuleLayerB_8f9e0a1b2c3d",
          "amount": 750.0,
          "token": "USDT",
          "token_symbol": "USDT",
          "timestamp_utc": 1788952095,
          "time_str": "Expanded",
          "tx_hash": "0xexp1_28e647bded6d4552",
          "is_primary": false,
          "isCorePath": null,
          "parentBoxId": null,
          "velocity_mins": 60
        },
        {
          "source": "0xMuleLayerB_8f9e0a1b2c3d",
          "target": "0xExpandOut_19f6d5e2",
          "amount": 450.0,
          "token": "USDT",
          "token_symbol": "USDT",
          "timestamp_utc": 1788953895,
          "time_str": "Expanded",
          "tx_hash": "0xexp2_162ab36e20ad4b89",
          "is_primary": false,
          "isCorePath": null,
          "parentBoxId": null,
          "velocity_mins": 30
        }
      ],
      "total_nodes": 19,
      "total_edges": 22
    }
  }
},
};

// Setup aliases
mockScenarios.task_scam_tron_usdt = mockScenarios.task_scam_tron;

/**
 * Match a scenario by address, case ID, or preset key
 * @param {string} query
 * @returns {Object}
 */
export function getScenarioForAddress(query = "") {
  const q = (query || "").trim().toLowerCase();
  if (!q) return mockScenarios.task_scam_tron;

  if (q.includes("tron") || q.startsWith("t") || q.includes("tvictim")) {
    return mockScenarios.task_scam_tron;
  }

  if (q.includes("syndicate") || q.includes("loan") || q.includes("multicex") || q.includes("0xvictim0003")) {
    return mockScenarios.loan_syndicate_multicex;
  }

  if (q.includes("480k") || q.includes("0xvictim_480k")) {
    return mockScenarios.inr_480k_coindcx_scam;
  }

  if (q.includes("eth") || q.includes("pig") || q.includes("evm") || q.startsWith("0x")) {
    return mockScenarios.investment_scam_eth;
  }

  return mockScenarios.task_scam_tron;
}

/**
 * Retrieve graph response object for a scenario or case
 */
export function getMockGraph(caseIdOrAddress = "") {
  const sc = getScenarioForAddress(caseIdOrAddress);
  return sc.graph;
}

/**
 * Retrieve off-ramp response for a scenario or case
 */
export function getMockOffRamp(caseIdOrAddress = "") {
  const sc = getScenarioForAddress(caseIdOrAddress);
  return sc.off_ramp;
}

/**
 * Retrieve trace start response
 */
export function getMockStartResponse(address = "", scenarioKey = "") {
  let sc = null;
  if (scenarioKey && mockScenarios[scenarioKey]) {
    sc = mockScenarios[scenarioKey];
  } else {
    sc = getScenarioForAddress(address);
  }
  return sc.start;
}

/**
 * Generate realistic counterparty expansion for a node (MetaSleuth style)
 */
export function getMockExpansion(caseId, address, direction = "both") {
  const prefix = address.startsWith("T") ? "T" : "0x";
  const now = Math.floor(Date.now() / 1000);
  const randHex = Math.random().toString(16).substring(2, 8);

  const inAddr = `${prefix}ExpandedIn_${randHex}_01`;
  const outAddr = `${prefix}ExpandedOut_${randHex}_02`;

  const new_nodes = [];
  const new_edges = [];

  if (direction === "inbound" || direction === "both") {
    new_nodes.push({
      id: inAddr,
      label: `[Expanded Inbound] ${inAddr.slice(0, 6)}…`,
      node_type: "mule",
      node_class: "intermediary",
      risk_score: 74,
      role_tag: "EXPANDED MULE CONDUIT",
      cluster_label: "Expanded Cluster",
      label_confidence: 0.78,
      is_on_primary_path: false,
      isCorePath: false,
      parentBoxId: "background-web",
      risk_severity: "HIGH",
      risk_breakdown: { baseline: 30, rapid_velocity: 44 },
      risk_rules: ["HIGH_RISK_INTERMEDIARY", "UNLABELLED_CLUSTER"],
      risk_explanation: "Expanded inbound transfer observed 45 mins prior to incident."
    });

    new_edges.push({
      id: `edge_exp_in_${randHex}`,
      source: inAddr,
      target: address,
      amount: 850.0,
      token: "USDT",
      token_symbol: "USDT",
      timestamp_utc: now - 3600,
      time_str: "1 hr ago",
      tx_hash: `0xexp_in_${randHex}789abcdef`,
      is_primary: false,
      isCorePath: false,
      parentBoxId: "background-web",
      velocity_mins: 60
    });
  }

  if (direction === "outbound" || direction === "both") {
    new_nodes.push({
      id: outAddr,
      label: `[Expanded Outbound] ${outAddr.slice(0, 6)}…`,
      node_type: "peel_outlet",
      node_class: "unknown",
      risk_score: 62,
      role_tag: "EXPANDED PEEL OUTLET",
      cluster_label: "Expanded Cluster",
      label_confidence: 0.72,
      is_on_primary_path: false,
      isCorePath: false,
      parentBoxId: "peel-structuring",
      risk_severity: "MODERATE",
      risk_breakdown: { baseline: 25, peel_structuring: 37 },
      risk_rules: ["STRUCTURING_PEEL_OUTLET"],
      risk_explanation: "Expanded secondary peel outlet siphon."
    });

    new_edges.push({
      id: `edge_exp_out_${randHex}`,
      source: address,
      target: outAddr,
      amount: 420.0,
      token: "USDT",
      token_symbol: "USDT",
      timestamp_utc: now - 1800,
      time_str: "30 mins ago",
      tx_hash: `0xexp_out_${randHex}123456789`,
      is_primary: false,
      isCorePath: false,
      parentBoxId: "peel-structuring",
      velocity_mins: 30
    });
  }

  return {
    expanded_address: address,
    new_nodes,
    new_edges,
    total_nodes: new_nodes.length,
    total_edges: new_edges.length
  };
}

/**
 * Return pre-calibrated list of available scenarios for UI dropdowns
 */
export function getMockScenariosList() {
  return [
    {
      id: "inr_480k_coindcx_scam",
      case_name: "inr_480k_coindcx_scam",
      title: "Telegram Task & Pig-Butchering Scam (CoinDCX Off-Ramp)",
      chain: "EVM",
      network: "Ethereum / EVM (USDT)",
      loss_usd: 5750.0,
      loss_inr: "₹4,80,000",
      destination_vasp: "CoinDCX",
      destination_sla_hours: 2,
      target_address: "0xVICTIM_480K_FRAUD_7b93a2c4e1",
      typology: "Telegram Task Fraud & Pig-Butchering Investment Scam"
    },
    {
      id: "task_scam_tron_usdt",
      case_name: "task_scam_tron_usdt",
      title: "TRON Telegram Cyber Task Scam",
      chain: "TRON",
      network: "TRON (TRC-20 USDT)",
      loss_usd: 4850.0,
      loss_inr: "₹4,05,000",
      destination_vasp: "CoinDCX",
      destination_sla_hours: 2,
      target_address: "TVictim0001TRONTaskScamXXXXXXXXX",
      typology: "Telegram Task Fraud / High-Velocity Mule Chain"
    },
    {
      id: "investment_scam_eth",
      case_name: "investment_scam_eth",
      title: "EVM Pig-Butchering Investment Fraud",
      chain: "EVM",
      network: "Ethereum / EVM",
      loss_usd: 12500.0,
      loss_inr: "₹10,45,000",
      destination_vasp: "Binance",
      destination_sla_hours: 4,
      target_address: "0xVictim0002PigButcherDeFiXXXXXXX",
      typology: "Romance / Fake Liquidity Mining Scam with Mixer Evasion"
    },
    {
      id: "loan_syndicate_multicex",
      case_name: "loan_syndicate_multicex",
      title: "Predatory Loan App Extortion Syndicate",
      chain: "EVM",
      network: "Polygon / EVM",
      loss_usd: 8200.0,
      loss_inr: "₹6,85,000",
      destination_vasp: "Dual Off-Ramp (WazirX & ZebPay)",
      destination_sla_hours: 2,
      target_address: "0xVictim0003LoanAppExtortionXXXXX",
      typology: "Predatory Loan App / Multi-CEX Splitting Syndicate"
    }
  ];
}

/**
 * Return simulated VASP directory for institutional compliance
 */
export function getMockVaspDirectory() {
  return [
    {
      exchange_name: "CoinDCX",
      legal_entity: "Neblio Technologies Pvt. Ltd.",
      fiu_ind_registration: "FIU-IND/VDA/2023/004",
      compliance_email: "compliance@coindcx.com",
      nodal_officer_name: "Amartya Sen",
      turnaround_sla_hours: 2,
      freeze_api_supported: true,
      jurisdiction: "India",
      known_hot_wallets: ["TCoinDCXHotWallet01XXXXXXXXXXXXXXXX", "0x71c3fb9904d3e33e9d8f8e02d847b74f38e63021"],
      provenance: "offchain_verified"
    },
    {
      exchange_name: "WazirX",
      legal_entity: "Zanmai Labs Pvt. Ltd.",
      fiu_ind_registration: "FIU-IND/VDA/2023/011",
      compliance_email: "nodal@wazirx.com",
      nodal_officer_name: "Siddharth Menon",
      turnaround_sla_hours: 2,
      freeze_api_supported: true,
      jurisdiction: "India",
      known_hot_wallets: ["0xWazirXHotWallet000000000000000000001"],
      provenance: "offchain_verified"
    },
    {
      exchange_name: "ZebPay",
      legal_entity: "Awlencan Innovations India Ltd.",
      fiu_ind_registration: "FIU-IND/VDA/2023/009",
      compliance_email: "compliance@zebpay.com",
      nodal_officer_name: "Avinash Kulkarni",
      turnaround_sla_hours: 2,
      freeze_api_supported: true,
      jurisdiction: "India",
      known_hot_wallets: ["0xZebPayHotWallet00000000000000000000001"],
      provenance: "offchain_verified"
    },
    {
      exchange_name: "Binance",
      legal_entity: "Binance Holdings Ltd. (India FIU Entity)",
      fiu_ind_registration: "FIU-IND/VDA/2024/098",
      compliance_email: "case@binance.com",
      nodal_officer_name: "Binance LEP Division",
      turnaround_sla_hours: 4,
      freeze_api_supported: true,
      jurisdiction: "International / India Registered",
      known_hot_wallets: ["0xBinanceHotWallet000000000000000000001"],
      provenance: "offchain_verified"
    }
  ];
}

/**
 * Return simulated structured Section 94 BNSS notice
 */
export function getMockNoticeText(payload = {}) {
  const vasp = payload.exchange_name || "CoinDCX";
  const caseId = payload.case_id || "CASE-SIH-2026";
  const fir = payload.fir_number || "FIR/CYBER/2026/0402";
  const officer = payload.investigating_officer || "Insp. Vikram Rathore (Belt No: CCPS-4091)";
  const station = payload.police_station || "Cyber Crime Police Station, State Headquarters";
  const addrs = (payload.frozen_addresses || ["TCoinDCXDeposit0001XXXXXXXXXXXXXXXX"]).join(", ");

  return `================================================================================
STATUTORY FREEZING REQUISITION UNDER SECTION 94 BNSS, 2023
(FORMERLY SECTION 91 CRPC, 1973)
================================================================================
OFFICE OF THE INVESTIGATING OFFICER
${station}
FIR NO: ${fir} | CASE ID: ${caseId}

TO:
Nodal Compliance Officer, ${vasp}
LEGAL ENTITY REQUISITION DIRECTIVE

SUBJECT: IMMEDIATE STATUTORY PRESERVATION & DEBIT-FREEZE DIRECTIVE UNDER
SECTION 94 BHARATIYA NAGARIK SURAKSHA SANHITA (BNSS), 2023.

1. CASE PREMISES:
In connection with the cybercrime case registered under FIR No. ${fir},
cryptocurrency fraud proceeds totaling ${payload.victim_amount_inr ? "₹" + payload.victim_amount_inr.toLocaleString() : "funds"}
were unlawfully transferred from the complainant's wallet and layered through high-velocity
mule infrastructure before depositing into ${vasp}'s internal exchange infrastructure.

2. TARGET DEPOSIT / BENEFICIARY ADDRESSES:
${addrs}

3. MANDATORY STATUTORY DIRECTIONS:
Under the powers vested in the undersigned under Section 94 of BNSS, 2023:
(a) IMMEDIATELY DEBIT-FREEZE the account(s), UID(s), and custody wallets mapped to
    the above-referenced on-chain addresses.
(b) PRESERVE complete KYC records, IP access logs, registered mobile numbers, PAN/Aadhaar
    verification data, and bank settlement details of the account holders.
(c) CONFIRM action within the statutory Golden Hour compliance window (2 hours).

INVESTIGATING OFFICER SIGN-OFF:
Signature: ___________________________
Name: ${officer}
Police Station: ${station}
Date: ${new Date().toISOString().split("T")[0]}
Digital Evidence Seal (Sec 63 BSA): e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
================================================================================`;
}
