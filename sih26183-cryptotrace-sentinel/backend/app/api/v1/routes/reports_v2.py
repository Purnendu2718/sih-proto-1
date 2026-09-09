from fastapi import APIRouter
from fastapi.responses import Response
from app.services.schemas_v2 import FreezeNoticeRequestV2
from app.services.report_service_v2 import generate_freeze_notice_pdf_v2

router = APIRouter()


@router.post("/freeze-notice-v2")
def freeze_notice_v2(req: FreezeNoticeRequestV2):
    pdf_bytes, merkle_root = generate_freeze_notice_pdf_v2(req)
    return Response(
        content=pdf_bytes, media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="freeze_notice_v2_{req.case_id}.pdf"',
            "X-Evidence-Merkle-Root": merkle_root or "NO_RAW_EVIDENCE_RECORDED",
        },
    )
