import json
from pathlib import Path
from collections import defaultdict

VASP_SEED_PATH = (
    Path(__file__).resolve().parents[3]
    / ".agents" / "skills" / "crypto-investigator" / "references" / "known_vasp_clusters.json"
)
if not VASP_SEED_PATH.exists():
    alt_path = (
        Path(__file__).resolve().parents[4]
        / ".agents" / "skills" / "crypto-investigator" / "references" / "known_vasp_clusters.json"
    )
    if alt_path.exists():
        VASP_SEED_PATH = alt_path


def load_vasp_clusters():
    with open(VASP_SEED_PATH) as f:
        return json.load(f)


def attribute_address(address: str) -> dict:
    clusters = load_vasp_clusters()
    for vasp in clusters["vasps"]:
        if address in vasp.get("hot_wallets", []):
            return {
                "is_known_vasp": True,
                "exchange_name": vasp["name"],
                "entity_label": f"[{vasp['name']} Hot Wallet]",
                "compliance_email": vasp["compliance_email"],
                "confidence": 0.99,
                "attribution_method": "static_seed",
                "attribution_explanation": f"Verified match from {vasp['name']} hot-wallet seed database.",
                "is_heuristic": False,
            }
        if address in vasp.get("known_deposit_addresses", []):
            return {
                "is_known_vasp": True,
                "exchange_name": vasp["name"],
                "entity_label": f"[{vasp['name']} User Deposit]",
                "compliance_email": vasp["compliance_email"],
                "confidence": 0.95,
                "attribution_method": "static_seed",
                "attribution_explanation": f"Verified customer deposit cluster match for {vasp['name']}.",
                "is_heuristic": False,
            }
    for mixer in clusters.get("mixers", []):
        if address.lower() == mixer.get("contract", "").lower():
            return {
                "is_known_vasp": True,
                "is_mixer": True,
                "exchange_name": mixer["name"],
                "entity_label": f"[{mixer['name']}]",
                "compliance_email": "sanctions@treasury.gov",
                "confidence": 0.99,
                "attribution_method": "sanctioned_mixer",
                "attribution_explanation": f"OFAC-sanctioned smart contract mixer ({mixer['name']}).",
                "risk_penalty": mixer.get("risk_score_penalty", 45),
                "is_heuristic": False,
            }
    return {
        "is_known_vasp": False,
        "attribution_method": "none",
        "attribution_explanation": "Unlabelled wallet address.",
        "confidence": 0.0,
        "is_heuristic": False,
    }


def detect_sweep_attribution(edges: list, sweep_window_seconds: int = 1800, min_source_count: int = 3) -> dict:
    """
    Zero-day CEX sweep heuristic: if N-or-more distinct, previously-unlabelled
    'deposit-like' addresses all transfer funds into the SAME destination
    within a short time window, that destination is very likely an exchange
    master hot wallet performing a batched sweep, and each source is very
    likely an unlabelled per-user deposit address of that exchange.
    """
    inbound_by_dest = defaultdict(list)
    for e in edges:
        inbound_by_dest[e["to"]].append(e)

    attributions = {}
    for dest, txs in inbound_by_dest.items():
        txs_sorted = sorted(txs, key=lambda t: t["ts"])
        window_start = txs_sorted[0]["ts"]
        clustered = [t for t in txs_sorted if t["ts"] - window_start <= sweep_window_seconds]
        distinct_sources = {t["from"] for t in clustered}
        if len(distinct_sources) >= min_source_count:
            conf_dest = min(0.60 + 0.05 * len(distinct_sources), 0.88)
            conf_src = min(0.55 + 0.05 * len(distinct_sources), 0.82)
            attributions[dest] = {
                "entity_label": "[Suspected Exchange Master Hot Wallet]",
                "confidence": round(conf_dest, 2),
                "attribution_method": "sweep_heuristic",
                "attribution_explanation": f"Heuristic pattern: {len(distinct_sources)} distinct deposit wallets swept into this destination within {sweep_window_seconds // 60} mins.",
                "evidence_source_count": len(distinct_sources),
                "is_heuristic": True,
            }
            for src in distinct_sources:
                attributions[src] = {
                    "entity_label": "[Suspected Exchange User Deposit]",
                    "confidence": round(conf_src, 2),
                    "attribution_method": "sweep_heuristic",
                    "attribution_explanation": f"Heuristic pattern: Swept into suspected master hot wallet along with {len(distinct_sources) - 1} other accounts.",
                    "is_heuristic": True,
                }
    return attributions
