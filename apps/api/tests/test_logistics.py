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

def test_logistics_overview():
    res = client.get("/api/v1/logistics/overview")
    assert res.status_code == 200
    data = res.json()
    assert "kpis" in data
    assert "vessels" in data
    assert "cargo" in data
    assert "routes" in data
    assert "stations" in data
    assert len(data["vessels"]) == 5

def test_logistics_kpis():
    res = client.get("/api/v1/logistics/kpis")
    assert res.status_code == 200
    data = res.json()
    assert data["kpis"]["active_vessels"] == 5
    assert data["kpis"]["cargo_in_transit_tons"] == 1240
    assert "sync_status" in data

def test_logistics_vessels():
    res = client.get("/api/v1/logistics/vessels")
    assert res.status_code == 200
    assert len(res.json()["vessels"]) >= 5

    res_detail = client.get("/api/v1/logistics/vessels/SHIP-01")
    assert res_detail.status_code == 200
    assert res_detail.json()["vessel"]["name"] == "Polar Star"
    assert "telemetry_anomaly_assessment" in res_detail.json()
    assert "survival_rul_assessment" in res_detail.json()

def test_logistics_cargo():
    res = client.get("/api/v1/logistics/cargo")
    assert res.status_code == 200
    assert len(res.json()["cargo"]) >= 7

def test_logistics_routes():
    res = client.get("/api/v1/logistics/routes")
    assert res.status_code == 200
    assert len(res.json()["routes"]) >= 3

def test_logistics_route_optimize():
    payload = {
        "ship_id": "SHIP-01",
        "current_route": ["Fremantle", "Waypoint-Alpha", "Waypoint-Bravo", "Davis Station"],
        "weather_blocked_nodes": ["Waypoint-Bravo"],
        "urgent_demands": ["Davis Station"]
    }
    res = client.post("/api/v1/logistics/routes/optimize", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "optimized_plan" in data
    assert "OR-Tools" in data["optimization_engine"]

def test_logistics_satellite_observations():
    res = client.get("/api/v1/logistics/satellite/observations")
    assert res.status_code == 200
    assert len(res.json()["observations"]) >= 3

def test_logistics_weather_and_ice():
    w_res = client.get("/api/v1/logistics/weather")
    assert w_res.status_code == 200
    assert "temperature_c" in w_res.json()["metrics"]

    i_res = client.get("/api/v1/logistics/sea-ice")
    assert i_res.status_code == 200
    assert "ice_concentration_pct" in i_res.json()["metrics"]

def test_logistics_alerts_and_exceptions():
    a_res = client.get("/api/v1/logistics/alerts")
    assert a_res.status_code == 200
    assert len(a_res.json()["alerts"]) >= 3

    e_res = client.get("/api/v1/logistics/exceptions")
    assert e_res.status_code == 200
    assert e_res.json()["summary"]["open_exceptions"] >= 1

def test_logistics_ml_models():
    res = client.get("/api/v1/logistics/ml-models")
    assert res.status_code == 200
    models = res.json()["registered_models"]
    model_names = [m["name"] for m in models]
    assert any("XGBoost" in name for name in model_names)
    assert any("LightGBM" in name for name in model_names)
    assert any("Autoencoder" in name for name in model_names)
    assert any("Survival Analysis" in name for name in model_names)
    assert any("Knowledge Graph" in name for name in model_names)
    assert any("OR-Tools" in name for name in model_names)

def test_logistics_approval_workflow():
    payload = {
        "approval_id": "APP-TEST-999",
        "decision": "APPROVE",
        "user": "Commander Test",
        "notes": "Authorization granted for ice lead bypass."
    }
    res = client.post("/api/v1/logistics/approvals", json=payload)
    assert res.status_code == 200
    assert res.json()["success"] is True

    audit_res = client.get("/api/v1/logistics/audit-log")
    assert audit_res.status_code == 200
    entries = audit_res.json()["audit_log"]
    assert any("Commander Test" in e["user"] for e in entries)

def test_logistics_copilot():
    res = client.post("/api/v1/logistics/copilot/query", json={"query": "Which vessel is delayed?"})
    assert res.status_code == 200
    data = res.json()
    assert "delayed" in data["answer"].lower()
    assert len(data["sources"]) >= 1
