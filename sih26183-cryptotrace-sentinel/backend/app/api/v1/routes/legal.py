"""
legal.py - Statutory Requisition Directives, VASP Directory, and Government Adapters API Routes.
Conforms to Sections 32-35 specifications.
"""

from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

from app.services.legal_service import (
    get_all_vasps,
    get_vasp_info,
    generate_section_63_bsa_certificate,
    NCRPAdapter,
    SAHYOGAdapter,
)
from app.services.audit_service import log_audit_event

router = APIRouter()


class BsaCertRequest(BaseModel):
    case_id: str
    investigating_officer: Optional[str] = "Insp. Rajesh Kumar (Belt No: CCPS-4091)"
    police_station: Optional[str] = "Cyber Crime Police Station, State Headquarters"
    merkle_root: Optional[str] = "771c97e7e61c99aeab28d93bd589164540fa9a4a92438f2c55f2c998c8e9db88"
    total_artifacts: Optional[int] = 27


class SahyogRequest(BaseModel):
    case_id: str
    target_address: str
    exchange: str


@router.get("/vasps", response_model=List[Dict[str, Any]])
def get_vasp_directory_endpoint():
    return get_all_vasps()


@router.post("/bsa-certificate", response_model=Dict[str, Any])
def generate_bsa_cert_endpoint(req: BsaCertRequest):
    cert_text = generate_section_63_bsa_certificate(
        case_id=req.case_id,
        investigating_officer=req.investigating_officer,
        police_station=req.police_station,
        merkle_root=req.merkle_root,
        total_artifacts=req.total_artifacts,
    )
    log_audit_event(
        action="LEGAL_REQUISITION_DRAFTED",
        case_id=req.case_id,
        details=f"Section 63 BSA Digital Evidence Certificate generated for {req.case_id}"
    )
    return {
        "case_id": req.case_id,
        "statute": "Section 63, Bharatiya Sakshya Adhiniyam, 2023",
        "certificate_text": cert_text,
    }


@router.post("/sahyog-alert", response_model=Dict[str, Any])
def broadcast_sahyog_alert_endpoint(req: SahyogRequest):
    return SAHYOGAdapter.broadcast_alert(req.case_id, req.target_address, req.exchange)


@router.get("/ncrp-sync/{ack_number}", response_model=Dict[str, Any])
def sync_ncrp_complaint_endpoint(ack_number: str):
    return NCRPAdapter.sync_complaint(ack_number)
