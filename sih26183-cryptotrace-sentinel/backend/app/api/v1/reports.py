"""
reports.py - Statutory freeze notice generation and VASP cluster endpoints.
"""

import os
import tempfile
from fastapi import APIRouter, BackgroundTasks, HTTPException, Request, Response
from fastapi.responses import FileResponse
from app.schemas import FreezeNoticeRequest, NoticeTextResponse
from app.services.reporting.notice_generator import (
    generate_statutory_notice_pdf, generate_statutory_notice_text
)
from app.services.reporting.evidence_hasher import EvidenceHasher
from app.services.analytics.sweep_detector import get_sweep_detector
from app.services.legal.freeze_notice import (
    render_freeze_notice_pdf, generate_freeze_notice_draft, _validate
)

router = APIRouter()


@router.post("/freeze-notice")
async def freeze_notice_endpoint(req: FreezeNoticeRequest, request: Request):
    """
    Generate Section 94 BNSS statutory requisition directive.
    Returns binary PDF with X-Evidence-SHA256 header (or JSON text if Accept: application/json).
    """
    try:
        _validate(req)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    accept_header = request.headers.get("accept", "")
    if "application/json" in accept_header:
        evidence_hash = EvidenceHasher.compute_digest(req.model_dump())
        notice_text = generate_statutory_notice_text(req, evidence_hash)
        return NoticeTextResponse(
            case_id=req.case_id,
            fir_number=req.fir_number,
            exchange_name=req.exchange_name,
            compliance_email=req.compliance_email,
            evidence_digest_sha256=evidence_hash,
            statutory_seal=f"SEC63-BSA-2023:{evidence_hash[:32].upper()}",
            notice_text=notice_text,
        )

    # Default to certified PDF generation (for legal download & test_acceptance compatibility)
    pdf_bytes, evidence_hash = generate_statutory_notice_pdf(req)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="Section_94_BNSS_Directive_{req.case_id}.pdf"',
            "X-Evidence-SHA256": evidence_hash,
        },
    )


@router.post("/freeze-notice/text", response_model=NoticeTextResponse)
def freeze_notice_text_endpoint(req: FreezeNoticeRequest):
    """Generate structured plain-text notice for immediate 1-click clipboard copy."""
    try:
        _validate(req)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    evidence_hash = EvidenceHasher.compute_digest(req.model_dump())
    notice_text = generate_freeze_notice_draft(req)
    return NoticeTextResponse(
        case_id=req.case_id,
        fir_number=req.fir_number,
        exchange_name=req.exchange_name,
        compliance_email=req.compliance_email,
        evidence_digest_sha256=evidence_hash,
        statutory_seal=f"SEC63-BSA-2023:{evidence_hash[:32].upper()}",
        notice_text=notice_text,
    )


@router.post("/freeze-notice/pdf")
def freeze_notice_pdf_endpoint(req: FreezeNoticeRequest, background_tasks: BackgroundTasks):
    """
    Renders Section 94 BNSS statutory freeze notice draft as a PDF
    using ReportLab and returns it as a FileResponse alongside the text endpoint.
    """
    try:
        _validate(req)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    evidence_hash = EvidenceHasher.compute_digest(req.model_dump())

    # Create a temporary file to store the generated PDF
    tmp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    tmp_path = tmp_file.name
    tmp_file.close()

    try:
        render_freeze_notice_pdf(req, tmp_path)
    except Exception as e:
        if os.path.exists(tmp_path):
            try:
                os.unlink(tmp_path)
            except OSError:
                pass
        raise HTTPException(status_code=500, detail=f"Failed to render PDF: {str(e)}")

    # Schedule cleanup of the temporary file after the response is sent
    background_tasks.add_task(lambda p: os.path.exists(p) and os.unlink(p), tmp_path)

    filename = f"Section_94_BNSS_Directive_{req.case_id}.pdf"
    return FileResponse(
        path=tmp_path,
        media_type="application/pdf",
        filename=filename,
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "X-Evidence-SHA256": evidence_hash,
        },
    )


@router.get("/vasp-clusters")
def get_vasp_clusters_endpoint():
    """Retrieve known VASP compliance clusters (CoinDCX, WazirX, ZebPay, Binance)."""
    return get_sweep_detector().clusters
