from fastapi import APIRouter, Query
from typing import Optional
from app.schemas import VaspAttributionRequest, VaspAttributionResponse
from app.services.vasp_service import attribute_address

router = APIRouter()


@router.get("", response_model=VaspAttributionResponse)
def get_vasp_attribution(
    address: str = Query(..., description="Target wallet address"),
    case_id: Optional[str] = Query(None, description="Optional case identifier")
):
    result = attribute_address(address)
    return VaspAttributionResponse(
        address=address,
        attributed=result.get("is_known_vasp", False),
        attributed_to=result.get("exchange_name"),
        confidence=result.get("confidence", 0.0),
        rule=result.get("attribution_method", "NONE").upper(),
        evidence_tx_hash=None,
        disclaimer=(
            "Attribution based on known VASP cluster heuristics. Exchange records must be "
            "subpoenaed under Section 94 BNSS to establish legal beneficial ownership."
        ),
        is_known_vasp=result.get("is_known_vasp", False),
        exchange_name=result.get("exchange_name"),
        entity_label=result.get("entity_label"),
        compliance_email=result.get("compliance_email"),
        attribution_method=result.get("attribution_method", "none"),
    )


@router.post("", response_model=VaspAttributionResponse)
def post_vasp_attribution(req: VaspAttributionRequest):
    result = attribute_address(req.address)
    return VaspAttributionResponse(
        address=req.address,
        attributed=result.get("is_known_vasp", False),
        attributed_to=result.get("exchange_name"),
        confidence=result.get("confidence", 0.0),
        rule=result.get("attribution_method", "NONE").upper(),
        evidence_tx_hash=None,
        disclaimer=(
            "Attribution based on known VASP cluster heuristics. Exchange records must be "
            "subpoenaed under Section 94 BNSS to establish legal beneficial ownership."
        ),
        is_known_vasp=result.get("is_known_vasp", False),
        exchange_name=result.get("exchange_name"),
        entity_label=result.get("entity_label"),
        compliance_email=result.get("compliance_email"),
        attribution_method=result.get("attribution_method", "none"),
    )
