"""
cases.py - Case Management and Dashboard Stats API Routes.
Conforms to Section 2 (Case Management) and Section 37 (Investigator Dashboard).
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

from app.services.case_service import (
    create_case, get_case, list_cases, update_case_status, get_dashboard_metrics
)
from app.services.audit_service import log_audit_event

router = APIRouter()


class CaseCreateRequest(BaseModel):
    case_id: Optional[str] = None
    fir_number: Optional[str] = None
    ncrp_ack_number: Optional[str] = None
    police_unit: Optional[str] = "Cyber Crime Police Station, State Headquarters"
    investigating_officer: Optional[str] = "Insp. Rajesh Kumar (Belt No: CCPS-4091)"
    supervisor: Optional[str] = "ACP Cyber Crime Division"
    incident_date: Optional[str] = None
    fraud_type: Optional[str] = "Task Scam"
    victim_identifier: Optional[str] = "Complainant-Ref-9921"
    reported_wallet: str
    blockchain: Optional[str] = "EVM"
    asset: Optional[str] = "USDT"
    estimated_fraud_inr: Optional[float] = 480000.0
    estimated_fraud_usd: Optional[float] = 5750.0
    incident_description: Optional[str] = "Automated cyber task fraud proceeding through multi-hop mule trail."
    priority: Optional[str] = "CRITICAL"
    retention_period_years: Optional[int] = 7


@router.post("", response_model=Dict[str, Any])
def create_new_case_endpoint(req: CaseCreateRequest):
    record = create_case(req.model_dump())
    log_audit_event(
        action="CASE_CREATED",
        case_id=record["case_id"],
        target_entity=record["reported_wallet"],
        details=f"Case {record['case_id']} created under FIR {record['fir_number']}",
        new_state=record
    )
    return record


@router.get("", response_model=List[Dict[str, Any]])
def list_cases_endpoint(limit: int = 50, offset: int = 0):
    return list_cases(limit=limit, offset=offset)


@router.get("/dashboard/stats", response_model=Dict[str, Any])
def get_dashboard_stats_endpoint():
    return get_dashboard_metrics()


@router.get("/{case_id}", response_model=Dict[str, Any])
def get_case_endpoint(case_id: str):
    res = get_case(case_id)
    if not res:
        raise HTTPException(status_code=404, detail=f"Case '{case_id}' not found")
    return res
