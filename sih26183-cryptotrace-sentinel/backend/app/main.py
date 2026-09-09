"""
main.py - FastAPI application entry point, CORS middleware, and API v1 router registration.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.router import api_router
from app.api.routes import router as routes_router
from app.api.v1.routes import reports_v2, auto_investigate, cases, evidence, investigate_omnichain, legal, audit
from app.services.attribution_store import init_db as init_attribution_db
from app.services.evidence_ledger import init_db as init_evidence_db
from app.services.case_service import init_case_db
from app.services.audit_service import init_audit_db

app = FastAPI(
    title="CryptoTrace-Sentinel",
    version="2.0.0",
    description="SIH26183 - Institutional-Grade Multi-Chain Forensic Investigation Workstation (Ministry of Home Affairs / I4C)",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Evidence-SHA256", "X-Evidence-Merkle-Root", "Content-Disposition"],
)

app.include_router(api_router, prefix="/api/v1")
app.include_router(routes_router)
app.include_router(reports_v2.router, prefix="/api/v1/reports", tags=["reports-v2"])
app.include_router(auto_investigate.router, prefix="/api/v1/investigate", tags=["golden-hour"])
app.include_router(cases.router, prefix="/api/v1/cases", tags=["cases"])
app.include_router(evidence.router, prefix="/api/v1/evidence", tags=["evidence"])
app.include_router(investigate_omnichain.router, prefix="/api/v1/omnichain", tags=["omnichain"])
app.include_router(legal.router, prefix="/api/v1/legal", tags=["legal"])
app.include_router(audit.router, prefix="/api/v1/audit", tags=["audit"])


@app.on_event("startup")
def on_startup():
    init_attribution_db()
    init_evidence_db()
    init_case_db()
    init_audit_db()


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "CryptoTrace-Sentinel",
        "version": "2.0.0",
        "problem_statement": "SIH26183",
        "agency": "Ministry of Home Affairs / I4C",
    }
