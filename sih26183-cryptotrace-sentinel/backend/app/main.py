from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.routes import trace, forensic, vasp, reports, investigate, evidence
from app.services.attribution_store import init_db as init_attribution_db
from app.services.evidence_ledger import init_db as init_evidence_db
from app.services.entity_resolver import seed_static_entities

app = FastAPI(
    title="CryptoTrace-Sentinel", version="3.0.0",
    description="SIH26183 - Real-Time Fraud-Linked Exchange Identification (consolidated master build)",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"], allow_headers=["*"],
)

app.include_router(trace.router, prefix="/api/v1/trace", tags=["trace"])
app.include_router(forensic.router, prefix="/api/v1", tags=["forensic"])
app.include_router(vasp.router, prefix="/api/v1/vasp-attribution", tags=["vasp"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["reports"])
app.include_router(investigate.router, prefix="/api/v1/investigate", tags=["golden-hour"])
app.include_router(evidence.router, prefix="/api/v1/evidence", tags=["evidence"])


@app.on_event("startup")
def on_startup():
    init_attribution_db()
    init_evidence_db()
    seed_static_entities()


from fastapi.responses import HTMLResponse, FileResponse
from pathlib import Path

TRACECHAIN_PATH = Path(__file__).resolve().parents[3] / "tracechain.html"

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/tracechain", response_class=HTMLResponse)
def tracechain_page():
    if TRACECHAIN_PATH.exists():
        return FileResponse(TRACECHAIN_PATH)
    return HTMLResponse("<h1>tracechain.html not found</h1>", status_code=404)
