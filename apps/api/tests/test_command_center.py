import pytest
from fastapi.testclient import TestClient
import sys
import os

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../"))
API_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
for p in [ROOT_DIR, API_DIR, os.path.join(ROOT_DIR, "services")]:
    if p not in sys.path:
        sys.path.insert(0, p)

from main import app

client = TestClient(app)

def test_command_center_overview():
    response = client.get("/api/v1/command-center/overview")
    assert response.status_code == 200
    data = response.json()
    assert "kpis" in data
    assert "vessels" in data
    assert "stations" in data
    assert "weather" in data
    assert "sea_ice" in data
    assert "satellites" in data
    assert "alerts" in data
    assert "recommendations" in data
    assert "predictions" in data
    assert "data_health" in data

def test_command_center_kpis():
    response = client.get("/api/v1/command-center/kpis")
    assert response.status_code == 200
    data = response.json()
    assert "active_ships" in data
    assert "cargo_in_transit" in data
    assert "active_delays" in data
    assert "critical_incidents" in data
    assert "operational_risk" in data
    assert "data_health" in data

def test_command_center_vessels():
    response = client.get("/api/v1/command-center/vessels")
    assert response.status_code == 200
    data = response.json()
    assert data["count"] >= 4
    vessel = data["vessels"][0]
    assert "imo" in vessel
    assert "speed_knots" in vessel
    assert "destination" in vessel
    assert "risk_level" in vessel
    assert "ai_predicted_eta" in vessel

def test_command_center_vessel_details():
    response = client.get("/api/v1/command-center/vessels/VESSEL_POLAR_STAR")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Polar Star"
    assert data["expected_delay_hours"] == 26.0
    assert len(data["factors"]) > 0

def test_command_center_stations():
    response = client.get("/api/v1/command-center/stations")
    assert response.status_code == 200
    data = response.json()
    assert data["count"] >= 5
    station_names = [s["name"] for s in data["stations"]]
    assert "Davis Station" in station_names
    assert "Maitri Station" in station_names

def test_command_center_predictions_no_random_forest():
    response = client.get("/api/v1/command-center/predictions")
    assert response.status_code == 200
    data = response.json()
    # Verify requirement: Random Forest must NOT be included in the predictive ML stack
    text_content = str(data).lower()
    assert "random forest" not in text_content
    assert "xgboost" in text_content

def test_command_center_alert_acknowledgement():
    payload = {
        "user_role": "Commander",
        "user_name": "Commander Hayes",
        "note": "Noted by bridge watch."
    }
    response = client.post("/api/v1/command-center/alerts/ALT-2026-401/acknowledge", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["alert"]["status"] == "ACKNOWLEDGED"

def test_command_center_hitl_approval():
    payload = {
        "user_role": "Commander",
        "user_name": "Commander Hayes",
        "comments": "Approved diversion via Sector 4 open lead."
    }
    response = client.post("/api/v1/command-center/recommendations/REC-2026-088/approve", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["recommendation"]["status"] == "APPROVED"

def test_command_center_hitl_unauthorized_rejection():
    # Unauthorized role (e.g. Viewer)
    payload = {
        "user_role": "Viewer",
        "user_name": "Junior Guest",
        "comments": "Should be rejected"
    }
    response = client.post("/api/v1/command-center/recommendations/REC-2026-088/approve", json=payload)
    assert response.status_code == 403

def test_command_center_demo_scenario():
    payload = {"scenario_id": "SCENARIO_3_SEA_ICE_THREAT"}
    response = client.post("/api/v1/command-center/demo/scenario", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "Sea Ice Threat" in data["scenario_name"]

def test_command_center_copilot_grounded_answer():
    payload = {"question": "Which ship is delayed?"}
    response = client.post("/api/v1/command-center/copilot/query", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "Polar Star" in data["answer"]
    assert len(data["sources"]) > 0

def test_command_center_search():
    response = client.get("/api/v1/command-center/search?q=Polar")
    assert response.status_code == 200
    data = response.json()
    assert data["count"] >= 1
    assert any("Polar Star" in r["title"] for r in data["results"])
