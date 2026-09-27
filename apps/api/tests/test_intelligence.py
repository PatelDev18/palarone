"""
Tests for POLARONE Intelligence Center API & Service Layer.
Validates:
- All 8 KPI overview cards
- Satellite acquisitions, metadata, and 14-stage geospatial processing pipeline
- Provider abstraction (Sentinel-1, Sentinel-2, Landsat, MODIS, ICEYE, Planet)
- Ice intelligence & weather intelligence
- Vessel AIS + Satellite fusion
- AI/ML models (XGBoost, LightGBM, Isolation Forest, Autoencoder, Survival Analysis, Graph Model, OR-Tools)
- Verification that Random Forest is NOT used anywhere
- AI explainability ('WHY?') and feature drivers
- Human-in-the-Loop workflows (Acknowledge, Review, Escalate, Dismiss)
- Scenario simulation ('What If?')
- Historical time machine (01 Sep - 27 Sep 2026)
- End-to-end Demo trigger
"""

import pytest
from fastapi.testclient import TestClient
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from main import app

client = TestClient(app)

def test_intelligence_overview():
    response = client.get("/api/v1/intelligence/overview")
    assert response.status_code == 200
    data = response.json()
    assert "kpis" in data
    assert len(data["kpis"]) == 8
    
    # Verify KPI keys
    kpi_titles = [k["title"] for k in data["kpis"]]
    assert "Satellite Scenes Available" in kpi_titles
    assert "New Scenes Today" in kpi_titles
    assert "Processing Queue" in kpi_titles
    assert "Ice Risk Alerts" in kpi_titles
    assert "Weather Risk Alerts" in kpi_titles
    assert "Vessel Risk Alerts" in kpi_titles
    assert "AI Predictions Generated" in kpi_titles
    assert "Data Sources Online" in kpi_titles

    for kpi in data["kpis"]:
        assert "current_value" in kpi
        assert "change" in kpi
        assert "status" in kpi
        assert "freshness" in kpi

    assert "pipeline" in data
    assert len(data["pipeline"]) == 14

def test_satellite_acquisitions_and_pipeline():
    response = client.get("/api/v1/intelligence/satellite/acquisitions")
    assert response.status_code == 200
    data = response.json()
    assert "scenes" in data
    assert len(data["scenes"]) >= 4
    
    # Check scene structure
    first_scene = data["scenes"][0]
    assert "scene_id" in first_scene
    assert "satellite" in first_scene
    assert "family" in first_scene
    assert "product_type" in first_scene
    assert "processing_status" in first_scene
    assert "data_freshness" in first_scene
    assert "download_status" in first_scene
    assert "ai_analysis_status" in first_scene

def test_satellite_scene_details():
    response = client.get("/api/v1/intelligence/satellite/scenes/SCENE_S1A_001")
    assert response.status_code == 200
    scene = response.json()
    assert scene["satellite"] == "Sentinel-1A"
    assert "metadata" in scene
    assert "epsg_crs" in scene["metadata"]
    assert "detected_features_detail" in scene
    assert len(scene["detected_features_detail"]) >= 2

def test_satellite_providers_multi_family():
    response = client.get("/api/v1/intelligence/satellite/providers")
    assert response.status_code == 200
    data = response.json()
    providers = data["providers"]
    provider_codes = [p["code"] for p in providers]
    assert "ESA_COPERNICUS" in provider_codes
    assert "NASA_USGS" in provider_codes
    assert "COMMERCIAL_ICEYE" in provider_codes
    assert "COMMERCIAL_PLANET" in provider_codes

def test_ice_intelligence():
    response = client.get("/api/v1/intelligence/ice/status")
    assert response.status_code == 200
    data = response.json()
    assert "regions" in data
    assert len(data["regions"]) >= 3
    prydz_bay = next(r for r in data["regions"] if "Prydz" in r["region_name"])
    assert prydz_bay["current_concentration_pct"] > 70.0
    assert "ice_thickness_m" in prydz_bay
    assert "ice_drift_speed_knots" in prydz_bay
    assert prydz_bay["ice_risk_level"] in ["HIGH", "CRITICAL"]

def test_weather_intelligence():
    response = client.get("/api/v1/intelligence/weather/intelligence")
    assert response.status_code == 200
    data = response.json()
    assert "stations_weather" in data
    assert len(data["stations_weather"]) >= 3
    davis_wx = next(w for w in data["stations_weather"] if "Davis" in w["location_name"])
    assert davis_wx["wind_speed_knots"] >= 40.0
    assert "forecast_horizons" in davis_wx

def test_vessel_satellite_fusion():
    response = client.get("/api/v1/intelligence/vessels/intelligence")
    assert response.status_code == 200
    data = response.json()
    vessels = data["vessels"]
    vessel_names = [v["name"] for v in vessels]
    assert "Polar Star" in vessel_names
    assert "Aurora Explorer" in vessel_names
    assert "Southern Cross" in vessel_names
    
    polar_star = next(v for v in vessels if v["name"] == "Polar Star")
    assert polar_star["route_risk_level"] in ["HIGH", "CRITICAL"]
    assert "nearby_ice" in polar_star
    assert "nearby_weather" in polar_star
    assert "satellite_observations" in polar_star
    assert polar_star["predicted_delay_hours"] > 10.0

def test_ai_ml_models_registry_and_no_random_forest():
    response = client.get("/api/v1/intelligence/models")
    assert response.status_code == 200
    data = response.json()
    models = data["models"]
    
    families = [m["model_family"] for m in models]
    # Verify required models exist
    assert "XGBoost" in families
    assert "LightGBM" in families
    assert "Isolation Forest" in families
    assert "Autoencoder" in families
    assert "Survival Analysis" in families
    assert "Graph Model" in families
    assert "OR-Tools" in families
    
    # STRICT COMPLIANCE: Verify Random Forest is NEVER used
    for m in models:
        assert "random forest" not in m["model_name"].lower()
        assert "random forest" not in m["model_family"].lower()

def test_ai_predictions_and_explainability():
    response = client.get("/api/v1/intelligence/predictions")
    assert response.status_code == 200
    data = response.json()
    predictions = data["predictions"]
    assert len(predictions) >= 2
    
    eta_pred = predictions[0]
    assert "prediction_title" in eta_pred
    assert "confidence" in eta_pred
    assert "main_drivers" in eta_pred
    assert len(eta_pred["main_drivers"]) >= 3
    assert "explanation" in eta_pred
    assert "WHY" in eta_pred["explanation"]
    assert "advisory_notice" in eta_pred
    assert "AI ADVISORY" in eta_pred["advisory_notice"]

def test_risk_summary_eight_categories():
    response = client.get("/api/v1/intelligence/risk/summary")
    assert response.status_code == 200
    data = response.json()
    assert "categories" in data
    categories = [c["category"] for c in data["categories"]]
    assert "Vessel Risk" in categories
    assert "Ice Risk" in categories
    assert "Weather Risk" in categories
    assert "Asset Risk" in categories
    assert "Station Risk" in categories
    assert "Cargo Risk" in categories
    assert "Mission Risk" in categories
    assert "Communication Risk" in categories

def test_intelligence_alerts_and_hitl_action():
    # Fetch alerts
    response = client.get("/api/v1/intelligence/alerts")
    assert response.status_code == 200
    alerts = response.json()["alerts"]
    assert len(alerts) >= 3
    target_alert = alerts[0]
    
    # Perform HITL action
    hitl_payload = {
        "action": "ACKNOWLEDGE",
        "alert_id": target_alert["id"],
        "actor": "Commander E. Hayes",
        "role": "Commander",
        "notes": "Verified SAR imagery; routing advisory confirmed."
    }
    action_res = client.post("/api/v1/intelligence/hitl/action", json=hitl_payload)
    assert action_res.status_code == 200
    action_data = action_res.json()
    assert action_data["success"] is True
    assert action_data["new_status"] == "ACKNOWLEDGED"

def test_scenario_simulation():
    req_body = {
        "simulation_name": "Test Simulation Pack Ice +25%",
        "ice_delta_pct": 25.0,
        "wind_delta_knots": 20.0,
        "engine_derate_pct": 10.0,
        "affected_vessel": "Polar Star"
    }
    res = client.post("/api/v1/intelligence/scenario", json=req_body)
    assert res.status_code == 200
    sim_data = res.json()
    assert "simulated_outcomes" in sim_data
    assert sim_data["simulated_outcomes"]["total_delay_hours"] > 20.0
    assert "disclaimer" in sim_data
    assert "SIMULATION / ADVISORY" in sim_data["disclaimer"]

def test_timeline_time_machine():
    response = client.get("/api/v1/intelligence/timeline")
    assert response.status_code == 200
    data = response.json()
    assert "timeline" in data
    steps = data["timeline"]
    assert len(steps) == 5
    dates = [s["date"] for s in steps]
    assert "2026-09-01" in dates
    assert "2026-09-27" in dates

def test_demo_trigger():
    res = client.post("/api/v1/intelligence/demo/trigger")
    assert res.status_code == 200
    demo_data = res.json()
    assert demo_data["status"] == "success"
    assert "cascade_steps" in demo_data
    assert len(demo_data["cascade_steps"]) == 7
