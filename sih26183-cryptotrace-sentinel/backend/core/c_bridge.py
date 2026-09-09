"""
backend/core/c_bridge.py - Re-export high-performance c_core bridge for compatibility.
"""

from app.c_core.c_bridge import (
    BlockchainTracerCore,
    TxEdgeInput,
    NativeTracerBridge,
    PathResultStruct,
)

__all__ = [
    "BlockchainTracerCore",
    "TxEdgeInput",
    "NativeTracerBridge",
    "PathResultStruct",
]
