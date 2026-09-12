"""
public.py - Public Unauthenticated Lookup Route.
TASK 10: Provides a public no-login lookup tool where anyone can paste an address or transaction hash
to receive instant risk score, chain identification, top labels, and sanctions check without case creation.
Rate-limited strictly by client IP address.
"""

from fastapi import APIRouter, Request, Response, HTTPException, Query
from typing import Optional, Dict, Any

from app.schemas import PublicLookupRequest, PublicLookupResponse
from app.services.public_lookup import PublicLookupService
from app.services.rate_limiter import public_rate_limiter

router = APIRouter()


def get_client_ip(request: Request) -> str:
    """Extracts client IP address respecting reverse proxies and X-Forwarded-For headers."""
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        # First entry in comma-separated list is client IP
        return forwarded_for.split(",")[0].strip()
    if request.client and request.client.host:
        return request.client.host
    return "127.0.0.1"


def apply_rate_limit_and_respond(
    request: Request,
    response: Response,
    query: str,
    chain_hint: Optional[str] = None
) -> PublicLookupResponse:
    client_ip = get_client_ip(request)
    allowed, remaining, reset_seconds = public_rate_limiter.check_rate_limit(client_ip)

    if not allowed:
        raise HTTPException(
            status_code=429,
            detail="Rate limit exceeded. Public lookup is restricted to 30 requests per minute per IP address.",
            headers={
                "Retry-After": str(reset_seconds),
                "X-RateLimit-Limit": "30",
                "X-RateLimit-Remaining": "0",
                "X-RateLimit-Reset": str(reset_seconds)
            }
        )

    # Set RFC rate-limit telemetry headers on response
    response.headers["X-RateLimit-Limit"] = "30"
    response.headers["X-RateLimit-Remaining"] = str(remaining)
    response.headers["X-RateLimit-Reset"] = str(reset_seconds)

    # Perform read-only public intelligence lookup (no case creation)
    result = PublicLookupService.lookup(query=query, chain_hint=chain_hint)
    result["rate_limit"] = {
        "limit": 30,
        "remaining": remaining,
        "reset_seconds": reset_seconds,
        "client_ip": client_ip if client_ip != "127.0.0.1" else "localhost"
    }

    return PublicLookupResponse(**result)


@router.get("/lookup", response_model=PublicLookupResponse)
def public_lookup_get(
    request: Request,
    response: Response,
    query: str = Query(..., description="Blockchain address (TRON, EVM, BTC) or transaction hash"),
    chain: Optional[str] = Query(None, description="Optional chain hint: TRON, EVM, BTC")
):
    """
    Public unauthenticated lookup via HTTP GET.
    Rate-limited by IP address (30 queries/min).
    """
    return apply_rate_limit_and_respond(request, response, query=query, chain_hint=chain)


@router.post("/lookup", response_model=PublicLookupResponse)
def public_lookup_post(
    request: Request,
    response: Response,
    req: PublicLookupRequest
):
    """
    Public unauthenticated lookup via HTTP POST.
    Rate-limited by IP address (30 queries/min).
    """
    return apply_rate_limit_and_respond(request, response, query=req.query, chain_hint=req.chain_hint)
