from fastapi import APIRouter, HTTPException
from app.schemas import TraceStartRequest, TraceStartResponse, Graph
from app.services.tracer_service import run_trace, TRACE_STORE

router = APIRouter()


@router.post("/start", response_model=TraceStartResponse)
def start_trace(req: TraceStartRequest):
    try:
        return run_trace(req)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Mock scenario not found for this address")


@router.get("/{trace_id}/graph", response_model=Graph)
def get_trace_graph(trace_id: str):
    if trace_id not in TRACE_STORE:
        raise HTTPException(status_code=404, detail="trace_id not found")
    return TRACE_STORE[trace_id]["graph"]
