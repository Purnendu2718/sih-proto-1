"""
screening.py - High-Throughput Bulk Address Screening API Router.
Provides non-blocking endpoints for uploading lists (CSV/TXT), polling background job status,
filtering results, and exporting court-ready RFC-4180 CSV reports.
"""

from fastapi import APIRouter, HTTPException, UploadFile, File, Query, Response
from typing import Optional, List, Dict, Any

from app.schemas import BatchScreeningRequest, BatchScreeningJobResponse
from app.services.batch_screener import (
    BatchScreener,
    parse_addresses_from_text,
    ScreeningJob,
)

router = APIRouter()


@router.post("/batch", status_code=202)
def start_batch_screening(payload: BatchScreeningRequest):
    """
    Submits a batch of addresses to the asynchronous screening queue.
    Returns immediately with job_id so the UI never blocks.
    """
    if not payload.addresses:
        raise HTTPException(status_code=400, detail="Addresses list cannot be empty.")

    # Deduplicate while preserving order
    seen = set()
    cleaned_addrs = []
    for a in payload.addresses:
        c = (a or "").strip()
        k = c.lower() if c.startswith("0x") else c
        if c and k not in seen:
            seen.add(k)
            cleaned_addrs.append(c)

    if not cleaned_addrs:
        raise HTTPException(status_code=400, detail="No valid addresses found in request.")

    job = BatchScreener.create_job(cleaned_addrs, file_name=payload.file_name or "batch_input.json")
    return {
        "job_id": job.job_id,
        "status": job.status,
        "total": job.total,
        "message": f"Screening job {job.job_id} queued with {job.total} addresses.",
    }


@router.post("/upload", status_code=202)
async def upload_address_file(file: UploadFile = File(...)):
    """
    Uploads a CSV or TXT file containing cryptocurrency addresses.
    Parses addresses across columns/lines, deduplicates, and queues non-blocking job.
    """
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    # Decode with fallback
    try:
        text = contents.decode("utf-8")
    except UnicodeDecodeError:
        try:
            text = contents.decode("latin-1")
        except Exception as exc:
            raise HTTPException(status_code=400, detail=f"Failed to decode uploaded file: {str(exc)}")

    addresses = parse_addresses_from_text(text)
    if not addresses:
        raise HTTPException(
            status_code=400,
            detail="No valid EVM, TRON, or Bitcoin addresses could be identified in the uploaded file.",
        )

    job = BatchScreener.create_job(addresses, file_name=file.filename)
    return {
        "job_id": job.job_id,
        "status": job.status,
        "total": job.total,
        "file_name": file.filename,
        "message": f"Successfully parsed {len(addresses)} addresses from {file.filename}. Job queued.",
    }


@router.get("/batch/{job_id}")
def get_batch_job_status(
    job_id: str,
    offset: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
):
    """
    Polls the progress status of a screening job.
    Returns summary statistics and paginated results to optimize frontend payload size.
    """
    job = BatchScreener.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail=f"Screening job '{job_id}' not found.")

    paginated_results = job.results[offset : offset + limit]
    has_more = (offset + limit) < len(job.results)

    return {
        "job_id": job.job_id,
        "status": job.status,
        "total": job.total,
        "processed": job.processed,
        "progress_pct": job.progress_pct,
        "created_utc": job.created_utc,
        "completed_utc": job.completed_utc,
        "duration_ms": job.duration_ms,
        "file_name": job.file_name,
        "summary": job.summary,
        "offset": offset,
        "limit": limit,
        "total_results": len(job.results),
        "has_more": has_more,
        "results": paginated_results,
        "error": job.error,
    }


@router.get("/batch/{job_id}/results")
def get_batch_job_results(
    job_id: str,
    sanctions_only: bool = Query(False),
    min_risk: int = Query(0, ge=0, le=100),
):
    """
    Retrieves filtered results for a completed batch job.
    """
    job = BatchScreener.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail=f"Screening job '{job_id}' not found.")

    filtered = job.results
    if sanctions_only:
        filtered = [r for r in filtered if r.get("sanctions_match")]
    if min_risk > 0:
        filtered = [r for r in filtered if r.get("risk_score", 0) >= min_risk]

    return {
        "job_id": job.job_id,
        "status": job.status,
        "total": len(job.results),
        "filtered_count": len(filtered),
        "results": filtered,
    }


@router.get("/batch/{job_id}/export/csv")
def export_batch_csv(job_id: str):
    """
    Streams a downloadable RFC-4180 CSV report of the screening results.
    """
    job = BatchScreener.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail=f"Screening job '{job_id}' not found.")

    csv_content = BatchScreener.generate_csv(job)
    filename = f"CryptoTrace_Batch_Screening_{job_id}.csv"

    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "X-Screened-Total": str(job.total),
            "X-Sanctions-Hits": str(job.summary.get("sanctions_hits", 0)),
        },
    )


@router.get("/sample")
def get_sample_addresses(count: int = Query(1000, ge=10, le=5000)):
    """
    Generates a realistic test dataset of multi-chain addresses for demonstration.
    Includes known sanctioned entities (Lazarus, Tornado Cash, Garantex, Hydra),
    CEX deposit terminals, and clean wallets.
    """
    samples = [
        # Sanctioned Entities (Critical Risk)
        "0xlazarus0000000000000000000000000000000001",
        "0xd90e2f925da726b50c4ed8d0fb90ad053324f31b",
        "0x12d66f87a04a9e220743712ce6d9bb1b5616b8fc",
        "0x47ce0c6ed5b0ce3d3a51fdb1c52dc66a7c3c2936",
        "0xgarantex000000000000000000000000000000001",
        "0xblender0000000000000000000000000000000001",
        "0xsinbad00000000000000000000000000000000001",
        "0xhydramarket00000000000000000000000000001",
        "tlazarustronhotwallet00000000000000",
        "1silkroad00000000000000000000000000001",
        "bc1qlazarus0000000000000000000000000000001",
        # CEX Terminals & Hot Wallets
        "TCoinDCXDeposit0001XXXXXXXXXXXXXXXX",
        "TCoinDCXHotWallet0001XXXXXXXXXXXXX",
        "0xBinanceHotWallet000000000000000000001",
        "0xBinanceDeposit0000000000000000000001",
        "TVictim0001TRONTaskScamXXXXXXXXX",
    ]

    # Generate additional synthetic addresses to meet requested count
    for i in range(len(samples), count):
        mod = i % 3
        if mod == 0:
            addr = f"0x{i:08x}{'a1b2c3d4e5f67890' * 2}"[:42]
        elif mod == 1:
            addr = f"T{i:06d}{'9876543210zyxwvutsrqponmlkjihg' * 2}"[:34]
        else:
            addr = f"bc1q{i:06d}{'abcdef0123456789' * 3}"[:42]
        samples.append(addr)

    return {
        "count": len(samples),
        "addresses": samples,
        "csv_text": "address\n" + "\n".join(samples),
    }
