import time
import requests
from app.services.air_gapped_guard import require_online

_CACHE = {}
_CACHE_TTL_SECONDS = 60
_COINGECKO_IDS = {
    "USDT": "tether", "USDC": "usd-coin", "ETH": "ethereum",
    "BTC": "bitcoin", "BNB": "binancecoin", "MATIC": "matic-network", "TRX": "tron",
}


def get_usd_price(symbol: str) -> float:
    """Live spot price for quick visual triage on the canvas. Freeze
    notices use historical_price_service instead — legal valuation needs
    the price at the fraud date, not today's price."""
    symbol = symbol.upper()
    now = time.time()
    cached = _CACHE.get(symbol)
    if cached and now - cached[1] < _CACHE_TTL_SECONDS:
        return cached[0]

    coin_id = _COINGECKO_IDS.get(symbol)
    if not coin_id:
        return 0.0

    try:
        require_online("price_service.get_usd_price")
    except RuntimeError:
        return cached[0] if cached else 0.0

    try:
        resp = requests.get(
            "https://api.coingecko.com/api/v3/simple/price",
            params={"ids": coin_id, "vs_currencies": "usd"}, timeout=8,
        )
        resp.raise_for_status()
        price = resp.json().get(coin_id, {}).get("usd", 0.0)
        _CACHE[symbol] = (price, now)
        return price
    except Exception:
        return cached[0] if cached else 0.0
