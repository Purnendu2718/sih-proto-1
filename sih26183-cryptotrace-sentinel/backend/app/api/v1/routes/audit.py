"""
audit.py - Tamper-Evident Audit Trail API Routes.
Conforms to Section 46 specifications.
"""

from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List, Optional

from app.services.audit_service import get_audit_trail, verify_audit_integrity

router = APIRouter()


@router.get("", response_model=List[Dict[str, Any]])
def get_global_audit_trail_endpoint(limit: int = 100):
    return get_audit_trail(limit=limit)


@router.get("/verify/integrity", response_model=Dict[str, Any])
def verify_audit_integrity_endpoint():
    return verify_audit_integrity()


@router.get("/{case_id}", response_model=List[Dict[str, Any]])
def get_case_audit_trail_endpoint(case_id: str, limit: int = 50):
    return get_audit_trail(case_id=case_id, limit=limit)
