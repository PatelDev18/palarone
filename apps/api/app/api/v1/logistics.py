from fastapi import APIRouter, HTTPException, Query, Body
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
import sys
import os

router = APIRouter()

# Add services and local paths to sys.path
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../../"))
SERVICES_DIR = os.path.join(BASE_DIR, "services")
if SERVICES_DIR not in sys.path:
    sys.path.append(SERVICES_DIR)

from app.services.logistics_service import logistics_service
from prediction.demand_forecaster import DemandForecaster
from prediction.registry import ml_registry
from prediction.eta.predictor import ETAPredictor
from prediction.route_optimizer import RouteOptimizer
from prediction.survival_analysis import SurvivalAnalysisService
from prediction.graph_model import LogisticsKnowledgeGraph
from anomaly.autoencoder.detector import AutoencoderTelemetryAnomalyDetector
from anomaly.isolation_forest.detector import IsolationForestDetector

@router.get("/overview")
def get_logistics_overview() -> Dict[str, Any]:
    """
    Consolidated overview for the Logistics Command Center.
    Returns synchronized KPIs, vessels, cargo summary, routes, stations, weather, and sea ice.
    """
    return {
        "kpis": logistics_service.get_kpis(),
        "vessels": logistics_service.get_vessels(),
        "cargo": logistics_service.get_cargo(),
        "routes": logistics_service.get_routes(),
        "stations": logistics_service.get_stations(),
        "weather": logistics_service.get_weather(),
        "sea_ice": logistics_service.get_sea_ice(),
        "satellite": logistics_service.get_satellite_observations(),
        "alerts": logistics_service.get_alerts(),
        "exceptions": logistics_service.get_exceptions(),
        "timestamp": datetime.utcnow().isoformat()
    }

@router.get("/kpis")
def get_kpis() -> Dict[str, Any]:
    """
    Logistics KPI strip metrics.
    """
    return logistics_service.get_kpis()

@router.get("/vessels")
def get_vessels() -> Dict[str, Any]:
    """
    List of active polar fleet vessels with AIS telemetry and operational status.
    """
    vessels = logistics_service.get_vessels()
    return {"vessels": vessels, "count": len(vessels)}

@router.get("/vessels/{vessel_id}")
def get_vessel_detail(vessel_id: str) -> Dict[str, Any]:
    """
    Detailed inspection of a specific vessel including telemetry and ML predictions.
    """
    vessels = logistics_service.get_vessels()
    for v in vessels:
        if v["id"].lower() == vessel_id.lower() or v["name"].lower() == vessel_id.lower():
            # Enrich with Autoencoder and Survival Analysis predictions
            ae_detector = AutoencoderTelemetryAnomalyDetector()
            ae_result = ae_detector.detect_multivariate_anomaly(
                vessel_id=v["id"],
                telemetry={"shaft_rpm": 88.0, "torque_kntm": 220.0, "fuel_flow_kg_h": 460.0, "coolant_temp_c": 84.0}
            )
            survival = SurvivalAnalysisService()
            rul_result = survival.predict_asset_survival(
                asset_id=v["id"],
                asset_type="Propulsion Azipod Bearings",
                operating_hours=4800,
                cumulative_ice_impacts=120,
                ambient_temp_c=-18.4
            )
            return {
                "vessel": v,
                "telemetry_anomaly_assessment": ae_result,
                "survival_rul_assessment": rul_result
            }
    raise HTTPException(status_code=404, detail="Vessel not found")

@router.get("/cargo")
def get_cargo() -> Dict[str, Any]:
    """
    Cargo manifests and active shipments.
    """
    cargo = logistics_service.get_cargo()
    return {"cargo": cargo, "count": len(cargo)}

@router.get("/cargo/{cargo_id}")
def get_cargo_item(cargo_id: str) -> Dict[str, Any]:
    cargo_list = logistics_service.get_cargo()
    for c in cargo_list:
        if c["id"].lower() == cargo_id.lower():
            return {"cargo": c}
    raise HTTPException(status_code=404, detail="Cargo item not found")

@router.get("/inventory")
def get_inventory() -> Dict[str, Any]:
    """
    Overall station inventory summaries and critical levels.
    """
    stations = logistics_service.get_stations()
    return {"stations": stations}

@router.get("/inventory/{station_id}")
def get_station_inventory(station_id: str) -> Dict[str, Any]:
    stations = logistics_service.get_stations()
    for s in stations:
        if s["id"].lower() == station_id.lower() or s["name"].lower() == station_id.lower():
            return {"station": s}
    raise HTTPException(status_code=404, detail="Station not found")

@router.get("/inventory/{station_id}/forecast")
def get_inventory_forecast(station_id: str) -> Dict[str, Any]:
    """
    LightGBM-based demand and inventory forecast for station.
    """
    forecaster = DemandForecaster()
    fuel_pred = forecaster.predict_shortage(
        station_id=station_id, item_category="Diesel Fuel", current_stock=42000.0,
        historical_burn_rate=3800.0, population=94, incoming_eta_days=8.5
    )
    food_pred = forecaster.predict_shortage(
        station_id=station_id, item_category="Freeze-Dried Rations", current_stock=18000.0,
        historical_burn_rate=450.0, population=94, incoming_eta_days=8.5
    )
    med_pred = forecaster.predict_shortage(
        station_id=station_id, item_category="Medical Cryo-Supplies", current_stock=320.0,
        historical_burn_rate=12.0, population=94, incoming_eta_days=18.0
    )
    parts_pred = forecaster.predict_shortage(
        station_id=station_id, item_category="Generator Spare Parts", current_stock=14.0,
        historical_burn_rate=0.4, population=94, incoming_eta_days=14.0
    )
    return {
        "station_id": station_id,
        "forecasts": [fuel_pred, food_pred, med_pred, parts_pred]
    }

@router.get("/routes")
def get_routes() -> Dict[str, Any]:
    """
    All active, recommended, and delayed routes.
    """
    routes = logistics_service.get_routes()
    return {"routes": routes, "count": len(routes)}

@router.get("/routes/{route_id}")
def get_route_detail(route_id: str) -> Dict[str, Any]:
    routes = logistics_service.get_routes()
    for r in routes:
        if r["route_id"].lower() == route_id.lower():
            return {"route": r}
    raise HTTPException(status_code=404, detail="Route not found")

@router.post("/routes/optimize")
def optimize_route(payload: Dict[str, Any] = Body(...)) -> Dict[str, Any]:
    """
    Google OR-Tools multi-constraint routing optimization.
    Considers weather blocked zones, ice concentration, fuel, and station priority.
    """
    ship_id = payload.get("ship_id", "SHIP-01")
    current_route = payload.get("current_route", ["Fremantle", "Waypoint-Alpha", "Waypoint-Bravo", "Davis Station"])
    weather_blocked = payload.get("weather_blocked_nodes", ["Waypoint-Bravo"])
    urgent_demands = payload.get("urgent_demands", ["Davis Station"])

    optimizer = RouteOptimizer()
    result = optimizer.optimize_route(
        ship_id=ship_id,
        current_route=current_route,
        weather_blocked_nodes=weather_blocked,
        urgent_demands=urgent_demands
    )
    return result

@router.get("/routes/risk")
def get_routes_risk() -> Dict[str, Any]:
    """
    Route risk analysis endpoint (preserves compatibility).
    """
    routes = logistics_service.get_routes()
    return {"routes": routes}

@router.get("/weather")
def get_weather() -> Dict[str, Any]:
    """
    Logistics environment weather observations.
    """
    return logistics_service.get_weather()

@router.get("/sea-ice")
def get_sea_ice() -> Dict[str, Any]:
    """
    Logistics environment sea ice observations.
    """
    return logistics_service.get_sea_ice()

@router.get("/satellite/observations")
def get_satellite_observations() -> Dict[str, Any]:
    """
    Periodic satellite intelligence acquisitions (Sentinel-1, Sentinel-2, Landsat).
    """
    observations = logistics_service.get_satellite_observations()
    return {"observations": observations, "count": len(observations)}

@router.get("/alerts")
def get_alerts() -> Dict[str, Any]:
    """
    Logistics alerts (CRITICAL, WARNING, INFO).
    """
    alerts = logistics_service.get_alerts()
    return {"alerts": alerts, "count": len(alerts)}

@router.post("/alerts/{alert_id}/action")
def update_alert_action(alert_id: str, payload: Dict[str, Any] = Body(...)) -> Dict[str, Any]:
    action = payload.get("action", "ACKNOWLEDGE")
    user = payload.get("user", "Commander Hansen")
    # Record action
    audit_entry = {
        "id": f"AUD-ALT-{alert_id}",
        "timestamp": datetime.utcnow().isoformat(),
        "user": user,
        "action": f"Alert {action}: {alert_id}",
        "object": "LOGISTICS_ALERT",
        "previous_value": "OPEN",
        "new_value": action,
        "status": "PROCESSED"
    }
    logistics_service.audit_log.insert(0, audit_entry)
    return {"success": True, "alert_id": alert_id, "action": action, "timestamp": datetime.utcnow().isoformat()}

@router.get("/exceptions")
def get_exceptions() -> Dict[str, Any]:
    """
    Logistics exceptions tracking.
    """
    return logistics_service.get_exceptions()

@router.get("/cargo-flow")
def get_cargo_flow() -> Dict[str, Any]:
    """
    Cargo pipeline stages: SUPPLIER -> PORT -> VESSEL -> TRANSIT -> STATION -> INVENTORY
    """
    flows = logistics_service.get_cargo_flow()
    return {"flows": flows}

@router.get("/stations/network")
def get_stations_network() -> Dict[str, Any]:
    """
    Station supply network status.
    """
    stations = logistics_service.get_stations()
    return {"stations": stations}

@router.get("/missions")
def get_missions() -> Dict[str, Any]:
    """
    Mission and expedition logistics dependencies.
    """
    missions = logistics_service.get_missions()
    return {"missions": missions}

@router.get("/digital-twin-links")
def get_digital_twin_links() -> Dict[str, Any]:
    """
    Contextual links to Digital Twin subsystem operational states.
    """
    return {
        "links": [
            {"entity": "Polar Star", "twin_url": "/digital-twin?entity=PolarStar", "current_state": "Operational", "power_draw_kw": 840, "maintenance_health_pct": 91},
            {"entity": "Aurora Australis II", "twin_url": "/digital-twin?entity=AuroraAustralis", "current_state": "Operational", "power_draw_kw": 620, "maintenance_health_pct": 96},
            {"entity": "Davis Station Microgrid", "twin_url": "/digital-twin?entity=DavisStation", "current_state": "High Load", "power_draw_kw": 410, "maintenance_health_pct": 84},
            {"entity": "Bharati Diesel Array", "twin_url": "/digital-twin?entity=BharatiStation", "current_state": "Maintenance Needed", "power_draw_kw": 280, "maintenance_health_pct": 72}
        ]
    }

@router.get("/ml-models")
def get_ml_models() -> Dict[str, Any]:
    """
    Comprehensive ML model registry and evaluation statistics for Logistics Hub.
    Models: XGBoost, LightGBM, Isolation Forest, Autoencoder, Survival Analysis, Knowledge Graph, OR-Tools.
    """
    ae = AutoencoderTelemetryAnomalyDetector()
    survival = SurvivalAnalysisService()
    kg = LogisticsKnowledgeGraph()
    forecaster = DemandForecaster()
    eta = ETAPredictor()

    return {
        "registered_models": [
            {
                "id": "XGB_ETA_01",
                "name": "XGBoost ETA & Delay Predictor",
                "purpose": "Predicts voyage arrival times and delay risks using speed, distance, wind, and sea-ice features.",
                "algorithm": "XGBoost Gradient Boosting Regressor",
                "inputs": ["Vessel Speed", "Distance Remaining", "Wind Speed", "Sea Ice Concentration", "Historical Voyages"],
                "outputs": ["Predicted ETA", "Expected Delay Hours", "Primary Factor Weights"],
                "confidence_avg": 0.88,
                "status": "PRODUCTION_ACTIVE"
            },
            {
                "id": "LGBM_DEMAND_01",
                "name": "LightGBM Station Demand Forecaster",
                "purpose": "Forecasts daily inventory consumption rates and flags stockout risks based on population and season.",
                "algorithm": "LightGBM Gradient Boosting Decision Tree",
                "inputs": ["Current Stock", "Historical Burn Rate", "Population", "Seasonality Index", "Incoming ETA"],
                "outputs": ["Predicted Burn Rate / Day", "Days Remaining", "Shortage Risk (CRITICAL/LOW)"],
                "confidence_avg": 0.92,
                "status": "PRODUCTION_ACTIVE"
            },
            {
                "id": "IF_ANOMALY_01",
                "name": "Isolation Forest Sensor Anomaly Detector",
                "purpose": "Flags univariate and bivariate telemetry deviations in IoT sensors, fuel flow rates, and vibration.",
                "algorithm": "Isolation Forest (Ensemble Tree-based)",
                "inputs": ["Engine Vibration", "Coolant Temperature", "Operating Hours"],
                "outputs": ["Anomaly Score", "Outlier Flag", "Health Score"],
                "confidence_avg": 0.85,
                "status": "PRODUCTION_ACTIVE"
            },
            {
                "id": ae.model_id,
                "name": "Autoencoder Multivariate Telemetry Detector",
                "purpose": "Detects high-dimensional non-linear correlations across powertrain, thermal loops, and hull resistance.",
                "algorithm": "Deep Symmetrical Autoencoder (PyTorch/ONNX runtime)",
                "inputs": ["Shaft RPM", "Torque", "Fuel Flow Rate", "Coolant Temperature", "Hull Vibration"],
                "outputs": ["Reconstruction Loss", "Subsystem Anomaly Flags", "Root-Cause Hypothesis"],
                "confidence_avg": 0.93,
                "status": "PRODUCTION_ACTIVE"
            },
            {
                "id": survival.model_id,
                "name": "Survival Analysis Weibull Degradation Estimator",
                "purpose": "Estimates Remaining Useful Life (RUL) and 30-day failure probabilities for critical maritime propulsion systems.",
                "algorithm": "Weibull Proportional Hazard Survival Model",
                "inputs": ["Operating Hours", "Cumulative Ice Impacts", "Sub-zero Ambient Temperature Exposure"],
                "outputs": ["Survival Probability S(t)", "Estimated RUL Days", "30-Day Failure Risk"],
                "confidence_avg": 0.90,
                "status": "PRODUCTION_ACTIVE"
            },
            {
                "id": kg.version,
                "name": "Logistics Knowledge Graph Dependency Engine",
                "purpose": "Resolves cascading failure propagation across Vessel -> Route -> Station -> Cargo -> Inventory -> Mission.",
                "algorithm": "Directed Acyclic Graph (DAG) Traversal & Critical Path Resolver",
                "inputs": ["Vessel Delays", "Station Minimum Reserves", "Mission Milestones", "Supply Edges"],
                "outputs": ["Cascading Impact Depth", "Bottlenecks", "Alternative Mitigation Paths"],
                "confidence_avg": 0.95,
                "status": "PRODUCTION_ACTIVE"
            },
            {
                "id": "OR-Tools-VRP-v7.2",
                "name": "Google OR-Tools Constraint Optimizer",
                "purpose": "Optimizes multi-stop Antarctic vessel routes subject to pack ice boundaries, fuel limits, and urgent station shortages.",
                "algorithm": "Vehicle Routing Problem (VRP) & Traveling Salesperson Solver",
                "inputs": ["Waypoints", "Ice Edge Geo-Polygons", "Station Shortage Deadlines", "Vessel Ice Class"],
                "outputs": ["Optimized Waypoint Sequence", "Distance Delta", "Time Saved", "Feasible Reroutes"],
                "confidence_avg": 0.96,
                "status": "PRODUCTION_ACTIVE"
            }
        ]
    }

@router.get("/approvals")
def get_pending_approvals() -> Dict[str, Any]:
    """
    Human-in-the-Loop pending decision recommendations.
    """
    return {"approvals": logistics_service.pending_approvals}

@router.post("/approvals")
def process_approval(payload: Dict[str, Any] = Body(...)) -> Dict[str, Any]:
    """
    Human-in-the-Loop approval submission (Review / Approve / Reject / Modify).
    """
    approval_id = payload.get("approval_id")
    decision = payload.get("decision", "APPROVE")
    user = payload.get("user", "Commander Hansen")
    notes = payload.get("notes")

    if not approval_id:
        raise HTTPException(status_code=400, detail="Missing approval_id")

    result = logistics_service.process_approval(
        approval_id=approval_id,
        decision=decision,
        user=user,
        notes=notes
    )
    return result

@router.get("/audit-log")
def get_audit_log() -> Dict[str, Any]:
    """
    Immutable audit log of consequential operational decisions.
    """
    return {"audit_log": logistics_service.audit_log}

@router.post("/copilot/query")
def copilot_logistics_query(payload: Dict[str, Any] = Body(...)) -> Dict[str, Any]:
    """
    AI Copilot grounded question answering for logistics queries.
    """
    query = payload.get("query", "")
    return logistics_service.answer_copilot_query(query)
