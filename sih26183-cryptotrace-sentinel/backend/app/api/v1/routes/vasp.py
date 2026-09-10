from fastapi import APIRouter
from app.schemas import VaspAttributionRequest, VaspAttributionResponse
from app.services.attribution_store import lookup_attribution

router = APIRouter()


@router.post("", response_model=VaspAttributionResponse)
def vasp_attribution(req: VaspAttributionRequest):
    attrib = lookup_attribution(req.address)
    if not attrib:
        return VaspAttributionResponse(address=req.address, is_known=False)
    return VaspAttributionResponse(
        address=req.address, is_known=True, category=attrib["category"],
        exchange_name=attrib.get("exchange_name"), entity_label=attrib.get("entity_label"),
        attribution_rule=attrib["attribution_rule"], confidence=attrib["confidence"],
    )
