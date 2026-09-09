"""
investigate_omnichain.py - Omnichain Strategy-Switching, Peeling, CoinJoin, and Explainability API Routes.
Conforms to Sections 8, 14, 16, 26, 31, 41, and 73 specifications.
"""

from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

from app.services.omnichain_pathfinder import OmnichainPathfinder
from app.services.peeling_chain_detector import detect_peeling_chains
from app.services.coinjoin_analyzer import is_probable_coinjoin, map_coinjoin_candidates_bounded, analyze_post_mix_consolidation
from app.services.privacy_pool_analyzer import analyze_tornado_pool_events
from app.services.confidence_engine import ExplainabilityEngine, TaintEngine
from app.services.dossier_service import generate_forensic_dossier
from app.services.blockchain.mock_client import get_mock_scenario
from app.services.audit_service import log_audit_event

router = APIRouter()


class TraceRequest(BaseModel):
    victim_address: str
    scenario: Optional[str] = "inr_480k_coindcx_scam"
    chain: Optional[str] = "EVM"
    max_hops: Optional[int] = 6
    dust_threshold: Optional[float] = 50.0
    case_id: Optional[str] = "NCRP-2026-480912"


class ExplainRequest(BaseModel):
    id: str
    role: Optional[str] = "exchange_deposit"
    label: Optional[str] = None
    node_type: Optional[str] = None


class CoinJoinRequest(BaseModel):
    inputs: List[Dict[str, Any]]
    outputs: List[Dict[str, Any]]


@router.post("/trace", response_model=Dict[str, Any])
def trace_omnichain_endpoint(req: TraceRequest):
    sc_data = get_mock_scenario(req.scenario)
    edges = sc_data.get("edges", [])

    pathfinder = OmnichainPathfinder(edges, chain=req.chain)
    res = pathfinder.find_ranked_off_ramps(
        start_address=req.victim_address,
        max_hops=req.max_hops,
        dust_threshold=req.dust_threshold
    )

    log_audit_event(
        action="TRACE_EXECUTED",
        case_id=req.case_id,
        target_entity=req.victim_address,
        details=f"Omnichain strategy-switching pathfinder executed for {req.victim_address}. Found: {res.get('primary_off_ramp', {}).get('off_ramp_entity')}"
    )

    return {
        "case_id": req.case_id,
        "victim_address": req.victim_address,
        "chain": req.chain,
        **res,
    }


@router.post("/peeling-chain", response_model=List[Dict[str, Any]])
def detect_peeling_chain_endpoint(req: TraceRequest):
    sc_data = get_mock_scenario(req.scenario)
    edges = sc_data.get("edges", [])
    return detect_peeling_chains(edges)


@router.post("/analyze-coinjoin", response_model=Dict[str, Any])
def analyze_coinjoin_endpoint(req: CoinJoinRequest):
    detect_res = is_probable_coinjoin(req.inputs, req.outputs)
    candidates = map_coinjoin_candidates_bounded(req.inputs, req.outputs)
    return {
        "detection": detect_res,
        "candidate_mappings": candidates,
    }


@router.post("/explain-node", response_model=Dict[str, Any])
def explain_node_endpoint(req: ExplainRequest):
    return ExplainabilityEngine.explain_node(req.model_dump())


@router.get("/dossier/{case_id}", response_model=Dict[str, Any])
def get_forensic_dossier_endpoint(case_id: str):
    log_audit_event(action="DOSSIER_GENERATED", case_id=case_id, details=f"15-Section Forensic Dossier compiled for {case_id}")
    return generate_forensic_dossier(case_id)
