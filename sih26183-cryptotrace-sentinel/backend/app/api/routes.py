"""
routes.py - API routes for CryptoTrace-Sentinel.
Exposes freeze notice reporting endpoints:
- POST /api/v1/reports/freeze-notice/pdf (FileResponse using render_freeze_notice_pdf)
- POST /api/v1/reports/freeze-notice/text (plain-text formatted draft)
"""

import os
import tempfile
from fastapi import APIRouter, BackgroundTasks, HTTPException
from fastapi.responses import FileResponse

from app.schemas import FreezeNoticeRequest, NoticeTextResponse, TraceStartRequest, TraceStartResponse
from app.services.legal.freeze_notice import (
    render_freeze_notice_pdf,
    generate_freeze_notice_draft,
    _validate,
)
from app.services.reporting.evidence_hasher import EvidenceHasher
from app.services.tracer_service import run_trace

router = APIRouter()


@router.post("/trace/start", response_model=TraceStartResponse, tags=["trace"])
@router.post("/api/v1/trace/start", response_model=TraceStartResponse, tags=["trace"])
def start_trace(req: TraceStartRequest):
    """
    Execute multi-hop graph trace with multi-chain ingestion (TRON, EVM, BTC),
    cryptographic Section 63 BSA evidence sealing, and mock fallback.
    """
    try:
        return run_trace(req)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Trace execution failed: {str(exc)}")


@router.post("/api/v1/reports/freeze-notice/text", response_model=NoticeTextResponse, tags=["reports"])
@router.post("/freeze-notice/text", response_model=NoticeTextResponse, tags=["reports"])
def freeze_notice_text(req: FreezeNoticeRequest):
    """
    Returns the plain-text draft of a statutory requisition notice,
    clearly watermarked 'DRAFT — UNOFFICIAL' at the top and bottom
    with an officer sign-off checklist near the end.
    """
    try:
        _validate(req)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    evidence_hash = EvidenceHasher.compute_digest(req.model_dump())
    draft_text = generate_freeze_notice_draft(req)
    return NoticeTextResponse(
        case_id=req.case_id,
        fir_number=req.fir_number,
        exchange_name=req.exchange_name,
        compliance_email=req.compliance_email,
        evidence_digest_sha256=evidence_hash,
        statutory_seal=f"SEC63-BSA-2023:{evidence_hash[:32].upper()}",
        notice_text=draft_text,
    )


@router.post("/api/v1/reports/freeze-notice/pdf", tags=["reports"])
@router.post("/freeze-notice/pdf", tags=["reports"])
def freeze_notice_pdf(req: FreezeNoticeRequest, background_tasks: BackgroundTasks):
    """
    Renders the statutory requisition notice as a PDF using ReportLab
    and returns it as a FileResponse from FastAPI, alongside the existing
    text endpoint.
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

    # Clean up temporary file after response streaming completes
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
