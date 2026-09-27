import pytest
from fastapi.testclient import TestClient
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from main import app

client = TestClient(app)

def test_analytics_overview_kpis():
    response = client.get("/api/v1/analytics/overview?timeframe=7D")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 8
    titles = [k["title"] for k in data]
    assert "Fleet Fuel Efficiency" in titles
    assert "Route Execution Fidelity" in titles
    assert "Station Thermal Demand" in titles
    assert "ML Model Drift Index (PSI)" in titles

def test_analytics_fleet_performance():
    response = client.get("/api/v1/analytics/fleet")
    assert response.status_code == 200
    fleet = response.json()
    assert len(fleet) >= 5
    vessel_names = [v["vessel_name"] for v in fleet]
    assert "Polar Star" in vessel_names
    assert "Aurora Explorer" in vessel_names
    assert "Southern Cross" in vessel_names
    assert "Arctic Voyager" in vessel_names
    assert "Ocean Guardian" in vessel_names

def test_analytics_fuel_predictions():
    response = client.get("/api/v1/analytics/fuel")
    assert response.status_code == 200
    fuel_data = response.json()
    assert len(fuel_data) == 14
    for point in fuel_data:
        assert "actual_burn_litres" in point
        assert "predicted_burn_litres" in point
        assert "upper_bound" in point
        assert "lower_bound" in point

def test_analytics_eta_intelligence():
    response = client.get("/api/v1/analytics/eta")
    assert response.status_code == 200
    eta_data = response.json()
    assert len(eta_data) >= 3
    for rec in eta_data:
        assert "original_planned_eta" in rec
        assert "ai_predicted_eta" in rec
        assert "p50_eta" in rec
        assert "confidence_score" in rec

def test_analytics_stations():
    response = client.get("/api/v1/analytics/stations")
    assert response.status_code == 200
    stations = response.json()
    stn_names = [s["station_name"] for s in stations]
    assert "Bharati" in stn_names
    assert "Maitri" in stn_names
    assert "Himadri" in stn_names
    assert "Davis" in stn_names

def test_analytics_inventory_shortage():
    response = client.get("/api/v1/analytics/inventory")
    assert response.status_code == 200
    items = response.json()
    # At least one item has shortage_risk == True (Maitri Polar Diesel)
    at_risk = [item for item in items if item["shortage_risk"]]
    assert len(at_risk) >= 1
    assert "Maitri" in at_risk[0]["location"]

def test_analytics_anomalies_and_assets():
    response_anom = client.get("/api/v1/analytics/anomalies")
    assert response_anom.status_code == 200
    anomalies = response_anom.json()
    assert len(anomalies) >= 3

    response_assets = client.get("/api/v1/analytics/assets")
    assert response_assets.status_code == 200
    assets = response_assets.json()
    assert len(assets) >= 5

def test_analytics_ml_models_strictly_no_random_forest():
    response = client.get("/api/v1/analytics/models")
    assert response.status_code == 200
    models = response.json()
    assert len(models) >= 5
    for m in models:
        # Strictly verify no Random Forest anywhere
        assert "Random Forest" not in m["algorithm"]
        assert "RANDOM_FOREST" not in m["model_id"].upper()

def test_analytics_scenarios_simulation():
    payload = {
        "speed_delta_pct": -15.0,
        "severe_weather_event": True,
        "supply_delay_days": 5,
        "generator_derate": False
    }
    response = client.post("/api/v1/analytics/scenarios", json=payload)
    assert response.status_code == 200
    sim = response.json()
    assert "Simulation" in sim["scenario_name"]
    assert sim["eta_delay_average_hours"] > 0
    assert len(sim["recommendations"]) > 0

def test_analytics_all_bundle():
    response = client.get("/api/v1/analytics/all")
    assert response.status_code == 200
    bundle = response.json()
    assert "kpis" in bundle
    assert "fleet" in bundle
    assert "fuel" in bundle
    assert "stations" in bundle
    assert "risks" in bundle
    assert "insights" in bundle
