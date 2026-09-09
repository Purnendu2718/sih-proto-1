"""
router.py - Master API v1 Router.
"""

from fastapi import APIRouter
from app.api.v1 import trace, reports
from app.api.v1.routes import vasp

api_router = APIRouter()

api_router.include_router(trace.router, prefix="/trace", tags=["trace"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
api_router.include_router(vasp.router, prefix="/vasp-attribution", tags=["vasp"])
api_router.add_api_route("/scenarios", trace.get_scenarios_endpoint, methods=["GET"], tags=["scenarios"])
