"""
sanctions.py - Scheduled Sanctions Ingestion & Verification Router.
Exposes endpoints for manual ETL trigger, ETL status telemetry,
instant indexed sanctions lookup, and ingestion-time screening.
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional, Dict, Any

from app.services.sanctions_etl import SanctionsETLService

router = APIRouter()


@router.post("/etl/run")
def trigger_sanctions_etl(force: bool = Query(default=True, description="Force re-ingestion and matching")):
    """
    Manually triggers the sanctions ETL ingestion pipeline.
    Ingests published OFAC SDN lists and cross-checks known addresses,
    pre-computing risk scores at ingestion time.
    """
    try:
        result = SanctionsETLService.run_etl_sync(force=force)
        return {
            "success": True,
            "message": "Sanctions ETL sync completed successfully.",
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ETL execution failed: {str(e)}")


@router.get("/etl/status")
def get_sanctions_etl_status():
    """
    Returns current telemetry, total ingested records, chain distribution,
    and latest scheduled ETL run status.
    """
    return SanctionsETLService.get_etl_status()


@router.get("/check/{address}")
def check_address_sanctions(address: str):
    """
    0ms indexed query against persistent sanctions_records database.
    Returns sanctions designation metadata if matched, or 404/clean response.
    """
    if not address or not address.strip():
        raise HTTPException(status_code=400, detail="Address parameter cannot be empty.")

    hit = SanctionsETLService.check_sanctions_db(address.strip())
    if not hit:
        return {
            "address": address.strip(),
            "is_sanctioned": False,
            "match": None
        }

    return {
        "address": address.strip(),
        "is_sanctioned": True,
        "match": hit
    }


@router.post("/screen-ingest")
def screen_and_precompute(payload: Dict[str, Any]):
    """
    Ingestion hook endpoint: screens an incoming address and pre-computes
    risk scores immediately in attribution_store before investigator retrieval.
    """
    address = payload.get("address")
    chain = payload.get("chain", "EVM")
    if not address or not str(address).strip():
        raise HTTPException(status_code=400, detail="address field is required.")

    result = SanctionsETLService.screen_and_precompute_at_ingestion(str(address).strip(), chain=chain)
    return {
        "success": True,
        "data": result
    }
