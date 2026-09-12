"""
test_case_assistant.py - Verification suite for Task 9 Natural-Language Case Assistant.
Tests context assembly, grounding enforcement, query routing, citations, and FastAPI endpoints.
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from fastapi.testclient import TestClient
from app.main import app
from app.services.case_assistant import CaseAssistantService

client = TestClient(app)

MOCK_GRAPH = {
    "nodes": [
        {
            "id": "TOriginVictimReportedWallet9999",
            "fullAddress": "TOriginVictimReportedWallet9999",
            "custom_label": "Victim Source Wallet",
            "node_type": "origin",
            "risk_score": 10,
            "risk_mode": "static_entity",
            "provenance": "analyst_reviewed",
            "balance": "100.00 USDT",
            "chain": "TRON"
        },
        {
            "id": "TMuleLayer1WashWallet8888",
            "fullAddress": "TMuleLayer1WashWallet8888",
            "custom_label": "Mule Layer 1 (Rapid Fan-Out)",
            "node_type": "mule",
            "risk_score": 75,
            "risk_mode": "dynamic_behavioral",
            "provenance": "automated_clustering",
            "balance": "4200.00 USDT",
            "chain": "TRON"
        },
        {
            "id": "tlazarustronhotwallet00000000000000",  # Sanctioned entity in catalog
            "fullAddress": "tlazarustronhotwallet00000000000000",
            "custom_label": "OFAC Sanctions Designated Node (Lazarus)",
            "node_type": "mule",
            "risk_score": 100,
            "risk_mode": "static_entity",
            "provenance": "offchain_verified",
            "balance": "125000.00 USDT",
            "chain": "TRON"
        },
        {
            "id": "TCoinDCXDepositVault7777",
            "fullAddress": "TCoinDCXDepositVault7777",
            "custom_label": "CoinDCX VASP Deposit",
            "node_type": "cex_deposit",
            "exchange_name": "CoinDCX",
            "risk_score": 85,
            "risk_mode": "static_entity",
            "provenance": "offchain_verified",
            "balance": "45000.00 USDT",
            "chain": "TRON"
        }
    ],
    "edges": [
        {
            "id": "e1",
            "source": "TOriginVictimReportedWallet9999",
            "target": "TMuleLayer1WashWallet8888",
            "token_symbol": "USDT",
            "amount": 50000.0,
            "usd_value": 50000.0,
            "tx_hash": "0xhash99998888originmule",
            "timestamp_utc": 1718000000
        },
        {
            "id": "e2",
            "source": "TMuleLayer1WashWallet8888",
            "target": "tlazarustronhotwallet00000000000000",
            "token_symbol": "USDT",
            "amount": 10000.0,
            "usd_value": 10000.0,
            "tx_hash": "0xhash8888sanctionednode",
            "timestamp_utc": 1718001200
        },

        {
            "id": "e3",
            "source": "TMuleLayer1WashWallet8888",
            "target": "TCoinDCXDepositVault7777",
            "token_symbol": "USDT",
            "amount": 35000.0,
            "usd_value": 35000.0,
            "tx_hash": "0xhash8888coindcxterminal",
            "timestamp_utc": 1718002400
        }
    ]
}

CASE_META = {
    "case_id": "CASE-TEST-NLCA-001",
    "fir_number": "FIR-2026-DELHI-00441",
    "case_name": "Telegram Task Scam Investigation",
    "reported_wallet": "TOriginVictimReportedWallet9999",
    "investigating_officer": "Insp. Rajesh Kumar",
    "police_unit": "Cyber Crime PS, Delhi"
}


def test_build_case_context():
    print("[TEST 1] Testing CaseAssistantService.build_case_context...")
    ctx = CaseAssistantService.build_case_context(
        case_id="CASE-TEST-NLCA-001",
        graph=MOCK_GRAPH,
        case_meta=CASE_META
    )
    assert ctx["case_id"] == "CASE-TEST-NLCA-001"
    assert ctx["fir_number"] == "FIR-2026-DELHI-00441"
    assert len(ctx["entities"]) == 4
    assert len(ctx["transfers"]) == 3
    assert len(ctx["sanctions_hits"]) >= 1
    assert len(ctx["offramp_terminals"]) >= 1
    print("  -> Context assembled correctly with 4 entities and sanctions detection.")


def test_query_case_summary():
    print("[TEST 2] Testing 'summarize this case' query...")
    res = CaseAssistantService.query_case(
        case_id="CASE-TEST-NLCA-001",
        query="Please summarize this case for the ACP briefing",
        graph=MOCK_GRAPH,
        case_meta=CASE_META
    )
    assert res["is_grounded"] is True
    assert len(res["grounded_data_points"]) > 0
    assert "FIR-2026-DELHI-00441" in res["answer"]
    assert "CoinDCX" in res["answer"]
    assert len(res["recommended_police_actions"]) > 0
    print(f"  -> Case summarized with {len(res['grounded_data_points'])} grounded points.")


def test_query_sanctions_check():
    print("[TEST 3] Testing 'which addresses touched a sanctioned entity' query...")
    res = CaseAssistantService.query_case(
        case_id="CASE-TEST-NLCA-001",
        query="which addresses touched a sanctioned entity or OFAC watchlists?",
        graph=MOCK_GRAPH,
        case_meta=CASE_META
    )
    assert res["is_grounded"] is True
    assert len(res["grounded_data_points"]) > 0
    
    # Must explicitly flag the sanctioned node
    sanction_pt = next((p for p in res["grounded_data_points"] if p["type"] == "sanctions"), None)
    assert sanction_pt is not None
    assert "tlazarustronhotwallet00000000000000" in sanction_pt["value"]
    print("  -> Sanctioned address identified and verified grounded in response.")



def test_query_offramp_detection():
    print("[TEST 4] Testing 'identify exchange off-ramps and statutory actions'...")
    res = CaseAssistantService.query_case(
        case_id="CASE-TEST-NLCA-001",
        query="which exchanges or VASPs were used to off-ramp the stolen funds?",
        graph=MOCK_GRAPH,
        case_meta=CASE_META
    )
    assert res["is_grounded"] is True
    assert "CoinDCX" in res["answer"]
    assert any("Section 94 BNSS" in act or "Section 63 BSA" in act for act in res["recommended_police_actions"])
    print("  -> Off-ramp identified with statutory BNSS/BSA police actions.")


def test_fastapi_case_chat_endpoint():
    print("[TEST 5] Testing POST /api/v1/cases/{case_id}/chat...")
    payload = {
        "query": "What is the total stolen amount and how many hops to off-ramp?",
        "case_id": "CASE-TEST-NLCA-001",
        "graph": MOCK_GRAPH,
        "case_meta": CASE_META
    }
    response = client.post("/api/v1/cases/CASE-TEST-NLCA-001/chat", json=payload)
    assert response.status_code == 200, f"HTTP {response.status_code}: {response.text}"
    data = response.json()
    assert data["is_grounded"] is True
    assert len(data["grounded_data_points"]) > 0
    assert "answer" in data
    print("  -> Endpoint /api/v1/cases/{case_id}/chat responded 200 OK.")


def test_fastapi_forensic_chat_endpoint():
    print("[TEST 6] Testing POST /api/v1/assistant/chat...")
    payload = {
        "query": "Which addresses touched a sanctioned entity",
        "case_id": "CASE-TEST-NLCA-001",
        "graph": MOCK_GRAPH,
        "case_meta": CASE_META
    }
    response = client.post("/api/v1/assistant/chat", json=payload)
    assert response.status_code == 200, f"HTTP {response.status_code}: {response.text}"
    data = response.json()
    assert data["is_grounded"] is True
    print("  -> Endpoint /api/v1/assistant/chat responded 200 OK.")


if __name__ == "__main__":
    print("=== RUNNING TASK 9 NATURAL-LANGUAGE CASE ASSISTANT TESTS ===")
    test_build_case_context()
    test_query_case_summary()
    test_query_sanctions_check()
    test_query_offramp_detection()
    test_fastapi_case_chat_endpoint()
    test_fastapi_forensic_chat_endpoint()
    print("=== ALL TASK 9 TESTS PASSED ACCREDITED! ===")
