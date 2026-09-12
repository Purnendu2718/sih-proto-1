from fastapi import APIRouter
from fastapi.responses import Response, JSONResponse
from app.schemas import FreezeNoticeRequest, EvidenceExportRequest
from app.services.report_service import (
    generate_freeze_notice_pdf,
    generate_evidence_dossier_pdf,
    generate_evidence_dossier_json,
)

router = APIRouter()


@router.post("/freeze-notice")
def freeze_notice(req: FreezeNoticeRequest):
    pdf_bytes, merkle_root = generate_freeze_notice_pdf(req)
    return Response(
        content=pdf_bytes, media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="freeze_notice_{req.case_id}.pdf"',
            "X-Evidence-Merkle-Root": merkle_root or "NO_RAW_EVIDENCE_RECORDED",
        },
    )


@router.post("/evidence-dossier")
def export_evidence_dossier_pdf(req: EvidenceExportRequest):
    pdf_bytes, meta = generate_evidence_dossier_pdf(req)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="Evidence_Dossier_{req.case_id}.pdf"',
            "X-Evidence-SHA256": meta["sha256"],
            "X-Evidence-Merkle-Root": meta["merkle_root"],
            "X-Evidence-Timestamp-UTC": meta["timestamp_utc"],
            "Access-Control-Expose-Headers": "X-Evidence-SHA256, X-Evidence-Merkle-Root, X-Evidence-Timestamp-UTC",
        },
    )


@router.post("/evidence-dossier/json")
def export_evidence_dossier_json(req: EvidenceExportRequest):
    sealed_json = generate_evidence_dossier_json(req)
    return JSONResponse(
        content=sealed_json,
        headers={
            "X-Evidence-SHA256": sealed_json.get("cryptographic_seal", {}).get("sha256", ""),
            "X-Evidence-Merkle-Root": sealed_json.get("cryptographic_seal", {}).get("merkle_root", ""),
            "Access-Control-Expose-Headers": "X-Evidence-SHA256, X-Evidence-Merkle-Root",
        },
    )
