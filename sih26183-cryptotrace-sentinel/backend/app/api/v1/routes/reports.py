"""
reports.py route re-export for backward compatibility.
"""
from app.api.v1.reports import router

__all__ = ["router"]
