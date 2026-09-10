import json
from pathlib import Path
from app.services.attribution_store import upsert_attribution

VASP_SEED_PATH = (
    Path(__file__).resolve().parents[3]
    / ".agents" / "skills" / "crypto-investigator" / "references" / "known_vasp_clusters.json"
)
if not VASP_SEED_PATH.exists():
    _alt = (
        Path(__file__).resolve().parents[4]
        / ".agents" / "skills" / "crypto-investigator" / "references" / "known_vasp_clusters.json"
    )
    if _alt.exists():
        VASP_SEED_PATH = _alt

ENTITY_SEED_PATH = Path(__file__).resolve().parents[2] / "data" / "entity_labels.json"


def _infer_chain(address: str) -> str:
    if address.startswith("T"):
        return "TRON"
    if address.startswith("0x"):
        return "EVM"
    return "BTC"


def seed_static_entities():
    """Run once at startup. Loads both static seed files into the single
    attribution_store, so every lookup — trace, search, expand, freeze
    notice — reads one source of truth instead of two label systems."""
    if VASP_SEED_PATH.exists():
        with open(VASP_SEED_PATH) as f:
            vasp_data = json.load(f)
        for vasp in vasp_data.get("vasps", []):
            for addr in vasp.get("hot_wallets", []):
                upsert_attribution(
                    address=addr, chain=_infer_chain(addr), category="exchange", cex_role="hotwallet",
                    exchange_name=vasp["name"], entity_label=f"[{vasp['name']} Hot Wallet]",
                    attribution_rule="static_seed", confidence=1.0,
                )
            for addr in vasp.get("known_deposit_addresses", []):
                upsert_attribution(
                    address=addr, chain=_infer_chain(addr), category="exchange", cex_role="deposit",
                    exchange_name=vasp["name"], entity_label=f"[{vasp['name']} User Deposit]",
                    attribution_rule="static_seed", confidence=1.0,
                )

    if ENTITY_SEED_PATH.exists():
        with open(ENTITY_SEED_PATH) as f:
            entities = json.load(f).get("entities", [])
        for e in entities:
            upsert_attribution(
                address=e["address"], chain=e.get("chain", _infer_chain(e["address"])),
                category=e["category"],
                exchange_name=e["label"] if e["category"] == "exchange" else None,
                entity_label=e["label"], attribution_rule="static_seed", confidence=1.0,
            )


def truncate_address(address: str, head: int = 6, tail: int = 4) -> str:
    if len(address) <= head + tail + 3:
        return address
    return f"{address[:head]}...{address[-tail:]}"
