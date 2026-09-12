from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.routes import trace, forensic, vasp, reports, investigate, evidence, cases, screening, public, sanctions
from app.services.attribution_store import init_db as init_attribution_db
from app.services.evidence_ledger import init_db as init_evidence_db
from app.services.case_service import init_case_db
from app.services.entity_resolver import seed_static_entities
from app.services.sanctions_etl import SanctionsETLService

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
app.include_router(cases.router, prefix="/api/v1/cases", tags=["cases"])
app.include_router(screening.router, prefix="/api/v1/screening", tags=["screening"])
app.include_router(public.router, prefix="/api/v1/public", tags=["public"])
app.include_router(sanctions.router, prefix="/api/v1/sanctions", tags=["sanctions"])



@app.on_event("startup")
def on_startup():
    init_attribution_db()
    init_evidence_db()
    init_case_db()
    seed_static_entities()
    SanctionsETLService.init_db()
    try:
        SanctionsETLService.run_etl_sync()
    except Exception as e:
        print(f"[SanctionsETL] Initial sync warning: {e}")
    SanctionsETLService.start_scheduler(interval_seconds=86400)


@app.on_event("shutdown")
def on_shutdown():
    SanctionsETLService.stop_scheduler()


from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path

TRACECHAIN_PATH = Path(__file__).resolve().parents[3] / "tracechain.html"
FRONTEND_DIST = Path(__file__).resolve().parents[2] / "frontend" / "dist"

if (FRONTEND_DIST / "assets").exists():
    app.mount("/assets", StaticFiles(directory=str(FRONTEND_DIST / "assets")), name="assets")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/tracechain", response_class=HTMLResponse)
def tracechain_page():
    if TRACECHAIN_PATH.exists():
        return FileResponse(TRACECHAIN_PATH)
    return HTMLResponse("<h1>tracechain.html not found</h1>", status_code=404)

@app.get("/", response_class=FileResponse)
async def serve_root():
    index_file = FRONTEND_DIST / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    return HTMLResponse("<h1>CryptoTrace-Sentinel API Active. Run 'npm run build' in frontend for UI.</h1>")

@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    if full_path.startswith("api/") or full_path in ("docs", "redoc", "openapi.json"):
        return HTMLResponse("Not Found", status_code=404)
    file_path = FRONTEND_DIST / full_path
    if file_path.is_file():
        return FileResponse(file_path)
    index_file = FRONTEND_DIST / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    return HTMLResponse("<h1>Page Not Found</h1>", status_code=404)

