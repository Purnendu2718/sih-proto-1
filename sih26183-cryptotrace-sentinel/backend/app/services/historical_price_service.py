import requests
from app.services.air_gapped_guard import require_online

_CACHE = {}
_COINGECKO_IDS = {
    "USDT": "tether", "USDC": "usd-coin", "ETH": "ethereum",
    "BTC": "bitcoin", "BNB": "binancecoin", "MATIC": "matic-network", "TRX": "tron",
}


def get_historical_inr_price(symbol: str, date_ddmmyyyy: str) -> float:
    """date_ddmmyyyy: 'DD-MM-YYYY'. Returns 0.0 on any failure — the
    caller MUST treat 0.0 as 'unavailable', not a real zero price, and
    prompt for a manually sourced valuation instead."""
    cache_key = (symbol.upper(), date_ddmmyyyy)
    if cache_key in _CACHE:
        return _CACHE[cache_key]

    coin_id = _COINGECKO_IDS.get(symbol.upper())
    if not coin_id:
        return 0.0

    try:
        require_online("historical_price_service.get_historical_inr_price")
    except RuntimeError:
        return 0.0

    try:
        resp = requests.get(
            f"https://api.coingecko.com/api/v3/coins/{coin_id}/history",
            params={"date": date_ddmmyyyy, "localization": "false"}, timeout=8,
        )
        resp.raise_for_status()
        price = resp.json().get("market_data", {}).get("current_price", {}).get("inr", 0.0)
        _CACHE[cache_key] = price
        return price
    except Exception:
        return 0.0
