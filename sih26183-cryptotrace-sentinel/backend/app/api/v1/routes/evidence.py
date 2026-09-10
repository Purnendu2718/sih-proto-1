from fastapi import APIRouter
from app.services.evidence_ledger import build_merkle_root

router = APIRouter()


@router.get("/{case_id}/merkle-root")
def get_case_merkle_root(case_id: str):
    return build_merkle_root(case_id)
