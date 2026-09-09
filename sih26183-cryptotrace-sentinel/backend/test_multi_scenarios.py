import requests
import json

def test_all():
    print("=== 1. Testing GET /api/v1/scenarios ===")
    sc_res = requests.get("http://127.0.0.1:8000/api/v1/scenarios")
    print("Status:", sc_res.status_code)
    assert sc_res.status_code == 200, f"Failed: {sc_res.text}"
    scenarios = sc_res.json()
    print("Available scenarios count:", len(scenarios))
    for sc in scenarios:
        print(" -", sc["id"], "|", sc["title"], "|", sc["network"], "|", sc["destination_vasp"], "|", sc["target_address"])

    print("\n=== 2. Testing Trace for all 3 scenarios ===")
    for sc in scenarios:
        print("----------------------------------------------------")
        print("Running trace for:", sc["title"])
        payload = {
            "address": sc["target_address"],
            "scenario": sc["id"],
            "chain": sc["chain"],
            "use_mock_fallback": True
        }
        t_res = requests.post("http://127.0.0.1:8000/api/v1/trace/start", json=payload)
        assert t_res.status_code == 200, f"Trace failed: {t_res.text}"
        t_data = t_res.json()
        trace_id = t_data["trace_id"]
        print(f"Trace OK: Case={t_data['case_id']}, Chain={t_data['detected_chain']}, VASP={t_data['destination_vasp']}, Hops={t_data['hop_count']}")
        
        # Fetch Graph
        g_res = requests.get(f"http://127.0.0.1:8000/api/v1/trace/{trace_id}/graph")
        assert g_res.status_code == 200, f"Graph failed: {g_res.text}"
        graph = g_res.json()
        all_nodes = graph["nodes"]
        all_edges = graph["edges"]
        core_nodes = [n for n in all_nodes if n.get("isCorePath")]
        core_edges = [e for e in all_edges if e.get("isCorePath")]
        
        print(f"All Webs: {len(all_nodes)} nodes, {len(all_edges)} edges")
        print(f"Most Predictive Web: {len(core_nodes)} nodes, {len(core_edges)} edges")
        
        assert len(all_nodes) >= 20, f"Expected rich graph with >= 20 nodes, got {len(all_nodes)}"
        assert len(core_nodes) < len(all_nodes), f"Predictive web should be filtered core subset"
        assert len(core_nodes) >= 4, f"Core path should have at least 4 nodes"
        
        # Check off-ramp
        o_res = requests.get(f"http://127.0.0.1:8000/api/v1/trace/{trace_id}/off-ramp")
        assert o_res.status_code == 200, f"Off-ramp failed: {o_res.text}"
        off_data = o_res.json()
        print(f"Off-Ramp Found: {off_data.get('found')}, Terminal: {off_data.get('terminal_label')}")
        assert off_data.get("found") is True

    print("\n=======================================================")
    print("ALL 3 MULTI-SCENARIO FRAUD DATASETS VERIFIED PERFECTLY!")
    print("=======================================================")

if __name__ == "__main__":
    test_all()
