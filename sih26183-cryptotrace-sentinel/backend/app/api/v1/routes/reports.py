from fastapi import APIRouter
from fastapi.responses import Response
from app.schemas import FreezeNoticeRequest
from app.services.report_service import generate_freeze_notice_pdf

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
