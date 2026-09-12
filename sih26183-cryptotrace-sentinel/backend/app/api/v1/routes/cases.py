"""
cases.py - Case Management and Dashboard Stats API Routes.
Conforms to Section 2 (Case Management) and Section 37 (Investigator Dashboard).
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

from app.services.case_service import (
    create_case, get_case, list_cases, update_case_status, get_dashboard_metrics,
    save_case_canvas, get_case_canvas
)
from app.services.audit_service import log_audit_event
from app.schemas import CaseChatRequest, CaseChatResponse
from app.services.case_assistant import CaseAssistantService

router = APIRouter()



class CaseCreateRequest(BaseModel):
    case_id: Optional[str] = None
    fir_number: Optional[str] = None
    ncrp_ack_number: Optional[str] = None
    police_unit: Optional[str] = "Cyber Crime Police Station, State Headquarters"
    investigating_officer: Optional[str] = "Insp. Rajesh Kumar (Belt No: CCPS-4091)"
    supervisor: Optional[str] = "ACP Cyber Crime Division"
    incident_date: Optional[str] = None
    fraud_type: Optional[str] = "Task Scam"
    victim_identifier: Optional[str] = "Complainant-Ref-9921"
    reported_wallet: str
    blockchain: Optional[str] = "EVM"
    asset: Optional[str] = "USDT"
    estimated_fraud_inr: Optional[float] = 480000.0
    estimated_fraud_usd: Optional[float] = 5750.0
    incident_description: Optional[str] = "Automated cyber task fraud proceeding through multi-hop mule trail."
    priority: Optional[str] = "CRITICAL"
    retention_period_years: Optional[int] = 7


class CanvasNodeItem(BaseModel):
    id: str
    address: Optional[str] = None
    display_label: Optional[str] = None
    custom_label: Optional[str] = None
    roleHeader: Optional[str] = None
    node_type: Optional[str] = "mule"
    nodeType: Optional[str] = None
    chain: Optional[str] = "TRON"
    balance: Optional[str] = "0.00 USDT"
    is_pinned: Optional[bool] = False
    isPinned: Optional[bool] = None
    pos_x: Optional[float] = None
    pos_y: Optional[float] = None
    position: Optional[Dict[str, Any]] = None
    metadata: Optional[Dict[str, Any]] = None


class CanvasEdgeItem(BaseModel):
    id: Optional[str] = None
    source: str
    target: str
    token_symbol: Optional[str] = "USDT"
    amount: Optional[float] = 0.0
    usd_value: Optional[float] = None
    tx_hash: Optional[str] = None
    timestamp_utc: Optional[str] = None
    is_core_path: Optional[bool] = False
    isCorePath: Optional[bool] = None
    edge_type: Optional[str] = "transfer"
    label: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class SaveCanvasRequest(BaseModel):
    case_name: Optional[str] = None
    fir_number: Optional[str] = None
    ncrp_ack_number: Optional[str] = None
    description: Optional[str] = None
    reported_wallet: Optional[str] = None
    blockchain: Optional[str] = "TRON"
    priority: Optional[str] = "HIGH"
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]


@router.post("", response_model=Dict[str, Any])
def create_new_case_endpoint(req: CaseCreateRequest):
    record = create_case(req.model_dump())
    log_audit_event(
        action="CASE_CREATED",
        case_id=record["case_id"],
        target_entity=record["reported_wallet"],
        details=f"Case {record['case_id']} created under FIR {record['fir_number']}",
        new_state=record
    )
    return record


@router.get("", response_model=List[Dict[str, Any]])
def list_cases_endpoint(limit: int = 50, offset: int = 0):
    return list_cases(limit=limit, offset=offset)


@router.get("/dashboard/stats", response_model=Dict[str, Any])
def get_dashboard_stats_endpoint():
    return get_dashboard_metrics()


@router.get("/{case_id}/canvas", response_model=Dict[str, Any])
def get_canvas_endpoint(case_id: str):
    res = get_case_canvas(case_id)
    if not res:
        raise HTTPException(status_code=404, detail=f"Case canvas '{case_id}' not found")
    return res


@router.post("/{case_id}/canvas", response_model=Dict[str, Any])
def save_canvas_endpoint(case_id: str, req: SaveCanvasRequest):
    meta = {
        "fir_number": req.fir_number,
        "ncrp_ack_number": req.ncrp_ack_number,
        "description": req.description or req.case_name,
        "reported_wallet": req.reported_wallet,
        "blockchain": req.blockchain,
        "priority": req.priority,
    }
    res = save_case_canvas(case_id, meta, req.nodes, req.edges)
    log_audit_event(
        action="CASE_CANVAS_SAVED",
        case_id=case_id,
        details=f"Canvas state saved for {case_id} with {res['node_count']} nodes and {res['edge_count']} edges",
        new_state={"node_count": res["node_count"], "edge_count": res["edge_count"]}
    )
    return res


@router.get("/{case_id}", response_model=Dict[str, Any])
def get_case_endpoint(case_id: str):
    res = get_case(case_id)
    if not res:
        raise HTTPException(status_code=404, detail=f"Case '{case_id}' not found")
    return res


@router.post("/{case_id}/chat", response_model=CaseChatResponse)
def case_scoped_chat_endpoint(case_id: str, req: CaseChatRequest):
    """
    TASK 9: Natural-Language Case Assistant Endpoint (Scoped to Case).
    Answers investigator questions in plain language with strict underlying data point citations.
    """
    effective_case_id = case_id or req.case_id or ""
    res = CaseAssistantService.query_case(
        case_id=effective_case_id,
        query=req.query,
        graph=req.graph,
        case_meta=req.case_meta,
        history=req.history
    )
    return CaseChatResponse(**res)


@router.post("/assistant/chat", response_model=CaseChatResponse)
def general_case_assistant_chat_endpoint(req: CaseChatRequest):
    """
    TASK 9: Case Assistant Endpoint.
    Accepts query, graph data, risk scores, provenance, and metadata.
    """
    res = CaseAssistantService.query_case(
        case_id=req.case_id or "",
        query=req.query,
        graph=req.graph,
        case_meta=req.case_meta,
        history=req.history
    )
    return CaseChatResponse(**res)

