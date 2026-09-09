"""
trace.py route re-export for backward compatibility.
"""
from app.api.v1.trace import router

__all__ = ["router"]
