"""
trace.py - Trace and dynamic counterparty expansion endpoints.
"""

from fastapi import APIRouter, HTTPException, Query
from app.schemas import (
    TraceStartRequest, TraceStartResponse, TraceGraphResponse,
    OffRampResponse, NodeExpandRequest, NodeExpandResponse
)
from app.services.tracer_service import (
    run_trace, find_nearest_off_ramp, expand_node_service, TRACE_STORE
)
from app.services.blockchain.mock_client import get_available_scenarios

router = APIRouter()


@router.get("/scenarios")
def get_scenarios_endpoint():
    """List available pre-calibrated institutional fraud presets for evaluation."""
    return get_available_scenarios()


@router.post("", response_model=TraceStartResponse)
@router.post("/start", response_model=TraceStartResponse)
def start_trace_endpoint(req: TraceStartRequest):
    """
    Execute institutional multi-hop graph trace with C-core BFS pathfinding
    and dynamic CEX sweep attribution.
    """
    try:
        return run_trace(req)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Trace execution failed: {str(exc)}")


@router.post("/expand", response_model=NodeExpandResponse)
def expand_node_endpoint(req: NodeExpandRequest):
    """
    Interactive manual node expansion (MetaSleuth style).
    Dynamically fetches and renders counterparties for a specific wallet on the Cytoscape canvas.
    """
    try:
        res = expand_node_service(req.case_id, req.address, req.direction or "both")
        return NodeExpandResponse(**res)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Node expansion failed: {str(exc)}")


@router.get("/{trace_id}", response_model=TraceGraphResponse)
@router.get("/{trace_id}/graph", response_model=TraceGraphResponse)
def get_trace_graph_endpoint(trace_id: str):
    """Retrieve full serialized Cytoscape network graph for a case or trace."""
    if trace_id not in TRACE_STORE:
        raise HTTPException(
            status_code=404,
            detail=f"Case / Trace ID '{trace_id}' not found in active session."
        )
    return TRACE_STORE[trace_id]["graph"]


@router.get("/{trace_id}/off-ramp", response_model=OffRampResponse)
def get_trace_off_ramp_endpoint(
    trace_id: str,
    dust_threshold_usd: float = Query(50.0, description="Dust filter USD minimum threshold"),
):
    """Identify nearest centralized exchange off-ramp terminal in the graph."""
    if trace_id not in TRACE_STORE:
        raise HTTPException(
            status_code=404,
            detail=f"Case / Trace ID '{trace_id}' not found in active session."
        )
    try:
        return find_nearest_off_ramp(trace_id, dust_threshold_usd)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Off-ramp analysis error: {str(exc)}")
