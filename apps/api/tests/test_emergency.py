"""
Tests for POLARONE Emergency Response Center Service and API Endpoints.
"""

import pytest
from fastapi.testclient import TestClient
from main import app
from app.services.emergency_service import emergency_service

client = TestClient(app)

def test_response_overview():
    res = client.get("/api/v1/incidents/overview")
    assert res.status_code == 200
    data = res.json()
    assert "active_incidents" in data
    assert "critical_incidents" in data
    assert "pending_approvals" in data
    assert "response_assets_available" in data
    assert "incidents_last_24h" in data
    assert "average_response_time_minutes" in data
    assert "satellite_alerts" in data
    assert "ai_risk_alerts" in data
    assert data["system_status"] == "ONLINE"

def test_list_incidents():
    res = client.get("/api/v1/incidents")
    assert res.status_code == 200
    data = res.json()
    assert "incidents" in data
    assert data["count"] >= 2
    assert any(inc["id"] == "INC-001" for inc in data["incidents"])

def test_get_incident_by_id():
    res = client.get("/api/v1/incidents/INC-001")
    assert res.status_code == 200
    inc = res.json()
    assert inc["id"] == "INC-001"
    assert inc["severity"] == "CRITICAL"
    assert "weather_sea_ice" in inc
    assert inc["weather_sea_ice"]["sea_ice_concentration_pct"] == 78.4
    assert "satellite_evidence" in inc
    assert "Sentinel-1A SAR" in inc["satellite_evidence"]["satellite"]
    assert "ai_risk_assessment" in inc
    assert inc["ai_risk_assessment"]["risk_score"] == 87
    assert len(inc["ai_risk_assessment"]["factor_drivers"]) > 0
    assert "why_flagged_narrative" in inc["ai_risk_assessment"]

def test_emergency_protocols():
    res = client.get("/api/v1/incidents/protocols")
    assert res.status_code == 200
    protocols = res.json()
    assert len(protocols) >= 10
    codes = [p["code"] for p in protocols]
    assert "SEA_ICE_BLOCKAGE" in codes
    assert "VESSEL_BREAKDOWN" in codes
    assert "MEDICAL_EMERGENCY" in codes
    assert "PERSONNEL_DISTRESS" in codes
    assert "SEVERE_WEATHER" in codes
    assert "COMMUNICATION_LOSS" in codes
    assert "FIRE" in codes
    assert "STATION_POWER_FAILURE" in codes
    assert "CARGO_EMERGENCY" in codes
    assert "SEARCH_AND_RESCUE" in codes

def test_response_assets():
    res = client.get("/api/v1/incidents/assets")
    assert res.status_code == 200
    assets = res.json()
    assert len(assets) >= 5
    names = [a["name"] for a in assets]
    assert "Ocean Guardian" in names
    assert "Aurora Explorer" in names
    assert any(a["suitability_pct"] >= 90 for a in assets)

def test_create_manual_incident():
    payload = {
        "title": "Uncharted Iceberg Calving in Mawson Fairway",
        "incident_type": "Navigation Hazard",
        "severity": "HIGH",
        "risk_score": 83,
        "ai_confidence": 89,
        "response_lead": "Cmdr. Hayes",
        "description": "Tabular iceberg fragment detected near fairways.",
        "location_name": "Mawson Sector",
        "coordinates": {"lat": -67.2, "lon": 63.1},
        "affected_asset_name": "Aurora Explorer",
        "is_simulation": False
    }
    res = client.post("/api/v1/incidents", json=payload)
    assert res.status_code == 200
    created = res.json()["incident"]
    assert created["incident_type"] == "Navigation Hazard"
    assert created["risk_score"] == 83

def test_human_in_the_loop_approval_flow():
    # 1. Submit approval request
    req_payload = {
        "action_type": "VESSEL_DIVERSION",
        "title": "Test Diversion Action",
        "reason": "Clear passage through open lead.",
        "user": "Operations Lead",
        "role": "Operations Officer"
    }
    sub_res = client.post("/api/v1/incidents/INC-001/approval", json=req_payload)
    assert sub_res.status_code == 200
    appr_id = sub_res.json()["approval"]["id"]

    # 2. Approve with Commander notes
    appr_payload = {
        "approval_id": appr_id,
        "commander_name": "Cmdr. Hayes",
        "commander_role": "Operations Commander",
        "comment_or_reason": "Approved after reviewing SAR ice leads."
    }
    dec_res = client.post("/api/v1/incidents/INC-001/approve", json=appr_payload)
    assert dec_res.status_code == 200
    assert dec_res.json()["status"] == "APPROVED"
    assert dec_res.json()["approval"]["reviewer_name"] == "Cmdr. Hayes"

def test_communications_flow():
    comm_payload = {
        "sender": "Cmdr. Hayes",
        "sender_role": "Commander",
        "channel": "Iridium Polar SAT-3",
        "message": "Testing emergency communication transmission."
    }
    res = client.post("/api/v1/incidents/INC-001/communications", json=comm_payload)
    assert res.status_code == 200
    comm = res.json()["communication"]
    assert comm["sender"] == "Cmdr. Hayes"
    assert "Testing emergency" in comm["message"]

def test_simulation_scenario_trigger():
    res = client.post("/api/v1/incidents/demo/scenario", json={"scenario_id": 2})
    assert res.status_code == 200
    data = res.json()
    assert data["is_simulation"] is True
    assert "Engine Failure" in data["incident"]["incident_type"] or "SIMULATION" in data["incident"]["title"]

def test_post_incident_report():
    res = client.get("/api/v1/incidents/INC-001/report")
    assert res.status_code == 200
    report = res.json()
    assert "report_id" in report
    assert "executive_summary" in report
    assert "ai_performance" in report
    assert "lessons_learned" in report

def test_sos_backward_compatibility():
    payload = {
        "incident_type": "Medical Emergency",
        "affected_asset": "Bharati Station",
        "lat": -69.40,
        "lon": 76.19
    }
    res = client.post("/api/v1/incidents/sos", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "incident_id" in data
    assert data["status"] == "SOS_ACTIVE"
    assert data["diverted_asset"] == "Ocean Guardian"
