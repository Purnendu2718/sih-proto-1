from fastapi import APIRouter
from app.schemas import (
    VaspAttributionRequest,
    VaspAttributionResponse,
    ProvenanceUpdateRequest,
    ProvenanceUpdateResponse,
)
from app.services.attribution_store import lookup_attribution, update_provenance

router = APIRouter()


@router.post("", response_model=VaspAttributionResponse)
def vasp_attribution(req: VaspAttributionRequest):
    attrib = lookup_attribution(req.address)
    if not attrib:
        return VaspAttributionResponse(
            address=req.address,
            is_known=False,
            provenance="automated_clustering",
        )
    return VaspAttributionResponse(
        address=req.address,
        is_known=True,
        category=attrib["category"],
        exchange_name=attrib.get("exchange_name"),
        entity_label=attrib.get("entity_label"),
        attribution_rule=attrib["attribution_rule"],
        confidence=attrib["confidence"],
        provenance=attrib.get("provenance", "automated_clustering"),
    )


@router.post("/provenance", response_model=ProvenanceUpdateResponse)
def update_entity_provenance(req: ProvenanceUpdateRequest):
    success = update_provenance(req.address, req.provenance)
    return ProvenanceUpdateResponse(
        address=req.address,
        provenance=req.provenance,
        success=success,
        message=f"Entity provenance tag updated to '{req.provenance}'",
    )
