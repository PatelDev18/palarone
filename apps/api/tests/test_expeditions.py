import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_get_expeditions():
    response = client.get("/api/v1/expeditions")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 3
    ids = [e["id"] for e in data]
    assert "EXP-2026-A" in ids
    assert "EXP-2026-B" in ids
    assert "EXP-2026-C" in ids

def test_get_kpis():
    response = client.get("/api/v1/expeditions/kpis")
    assert response.status_code == 200
    kpis = response.json()
    assert "active_expeditions" in kpis
    assert "personnel_deployed" in kpis
    assert kpis["blocked_missions"] >= 1

def test_get_single_expedition():
    response = client.get("/api/v1/expeditions/EXP-2026-A")
    assert response.status_code == 200
    exp = response.json()
    assert exp["name"] == "Operation Deep Freeze 26"
    assert exp["crew_count"] == 142
    assert "weather" in exp
    assert "sea_ice" in exp
    assert "risk_engine" in exp

def test_scenario_simulation():
    payload = {
        "scenario_type": "VESSEL_DELAY",
        "params": {"delay_hours": 24}
    }
    response = client.post("/api/v1/expeditions/EXP-2026-A/scenario", json=payload)
    assert response.status_code == 200
    sim = response.json()
    assert "simulated_eta" in sim
    assert "resource_impact" in sim

def test_status_transition():
    payload = {
        "status": "SUSPENDED",
        "reason": "Test suspension by Commander",
        "actor": "Commander E. Hayes"
    }
    response = client.post("/api/v1/expeditions/EXP-2026-B/status", json=payload)
    assert response.status_code == 200
    assert response.json()["expedition"]["status"] == "SUSPENDED"

    # Resume back
    resume_resp = client.post("/api/v1/expeditions/EXP-2026-B/resume")
    assert resume_resp.status_code == 200

def test_recommendation_decision():
    payload = {
        "decision": "APPROVE",
        "actor": "Commander E. Hayes",
        "comments": "Approved after weather radar check."
    }
    response = client.post("/api/v1/expeditions/EXP-2026-A/recommendations/REC-A-2026-01/decide", json=payload)
    assert response.status_code == 200
    assert response.json()["recommendation"]["status"] == "APPROVED"

def test_copilot_grounded_query():
    payload = {"query": "Why is Expedition C delayed?"}
    response = client.post("/api/v1/expeditions/copilot", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert "Blizzard" in res["answer"] or "blizzard" in res["answer"]
