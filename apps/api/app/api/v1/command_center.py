from fastapi import APIRouter, HTTPException, Query, Body, Header
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

from app.services.command_center_service import command_center_service

router = APIRouter()

class AlertAcknowledgeRequest(BaseModel):
    user_role: str = Field(default="Commander", description="Authorized role: Commander, Operations Officer, Safety Officer")
    user_name: str = Field(default="Duty Commander Hayes", description="Name of operator acknowledging alert")
    note: Optional[str] = Field(default=None, description="Operational notes or directives")

class RecommendationApproveRequest(BaseModel):
    user_role: str = Field(..., description="Role of the approving officer (Commander, Operations Officer, Safety Officer)")
    user_name: str = Field(default="Commander Hayes", description="Name of authorizing officer")
    comments: Optional[str] = Field(default=None, description="Human justification / dispatch notes")

class DemoScenarioRequest(BaseModel):
    scenario_id: str = Field(..., description="Scenario identifier e.g. SCENARIO_1_NORMAL to SCENARIO_8_MULTIPLE_SIMULTANEOUS_RISKS")

class CopilotQueryRequest(BaseModel):
    question: str = Field(..., description="Operational question e.g. 'Which ship is delayed?'")

@router.get("/overview")
def get_command_center_overview() -> Dict[str, Any]:
    """
    Get consolidated single-pane-of-glass overview for Antarctic Operations Command Center.
    Returns synchronized KPIs, vessels, stations, weather, sea-ice, satellites, alerts, and data health.
    """
    return command_center_service.get_overview()

@router.get("/kpis")
def get_kpis() -> Dict[str, Any]:
    """
    Get command-level KPI strip metrics.
    """
    return command_center_service.get_kpis()

@router.get("/vessels")
def get_vessels() -> Dict[str, Any]:
    """
    Get all tracked Antarctic fleet vessels with AIS telemetry, ETA predictions, and risk states.
    """
    vessels = command_center_service.get_vessels()
    return {"vessels": vessels, "count": len(vessels)}

@router.get("/vessels/{vessel_id}")
def get_vessel_details(vessel_id: str) -> Dict[str, Any]:
    """
    Get full operational telemetry and ML delay predictions for a selected vessel.
    """
    vessel = command_center_service.get_vessel(vessel_id)
    if not vessel:
        raise HTTPException(status_code=404, detail=f"Vessel with identifier '{vessel_id}' not found.")
    return vessel

@router.get("/stations")
def get_stations() -> Dict[str, Any]:
    """
    Get major Antarctic research and logistics stations with connectivity, fuel, and telemetry status.
    """
    stations = command_center_service.get_stations()
    return {"stations": stations, "count": len(stations)}

@router.get("/stations/{station_id}")
def get_station_details(station_id: str) -> Dict[str, Any]:
    """
    Get detail telemetry and connectivity vitals for a selected station.
    """
    station = command_center_service.get_station(station_id)
    if not station:
        raise HTTPException(status_code=404, detail=f"Station with identifier '{station_id}' not found.")
    return station

@router.get("/routes")
def get_routes() -> Dict[str, Any]:
    """
    Get planned, actual, and AI recommended routes across Antarctic shipping corridors.
    """
    routes = command_center_service.get_routes()
    return {"routes": routes, "count": len(routes)}

@router.get("/weather")
def get_weather(horizon: str = Query("now", description="Forecast horizon: now, +6h, +12h, +24h, +48h, +7d")) -> Dict[str, Any]:
    """
    Get Antarctic operational weather, wind vectors, and active blizzard zones.
    """
    return command_center_service.get_weather(horizon=horizon)

@router.get("/sea-ice")
def get_sea_ice() -> Dict[str, Any]:
    """
    Get sea-ice concentration, ice edge coordinates, ice compression hazard zones, and iceberg drift.
    """
    return command_center_service.get_sea_ice()

@router.get("/satellites")
def get_satellites() -> Dict[str, Any]:
    """
    Get periodic satellite SAR and optical observation swaths and timestamps.
    """
    return command_center_service.get_satellites()

@router.get("/alerts")
def get_alerts() -> Dict[str, Any]:
    """
    Get prioritized command-level alerts queue.
    """
    return {
        "alerts": command_center_service.alerts,
        "count": len(command_center_service.alerts),
        "unresolved_critical": sum(1 for a in command_center_service.alerts if a["severity"] == "CRITICAL" and a["status"] != "RESOLVED")
    }

@router.get("/events")
def get_events(limit: int = Query(20, ge=1, le=100)) -> Dict[str, Any]:
    """
    Get recent operational timeline events.
    """
    return {
        "events": command_center_service.events[:limit],
        "total": len(command_center_service.events)
    }

@router.get("/predictions")
def get_predictions() -> Dict[str, Any]:
    """
    Get ML predictions (XGBoost, LightGBM, Isolation Forest, Autoencoder, OR-Tools).
    """
    return command_center_service.get_predictions()

@router.get("/data-health")
def get_data_health() -> Dict[str, Any]:
    """
    Get multi-source data freshness, feed latency, and offline warnings.
    """
    return command_center_service.get_data_health()

@router.get("/risk")
def get_risk() -> Dict[str, Any]:
    """
    Get operational risk assessment across Antarctica.
    """
    kpis = command_center_service.get_kpis()
    predictions = command_center_service.get_predictions()
    return {
        "operational_risk": kpis["operational_risk"],
        "risk_breakdown": predictions["risk_predictions"]
    }

@router.get("/search")
def search(q: str = Query(..., min_length=1)) -> Dict[str, Any]:
    """
    Global search across vessels, stations, missions, cargo, alerts, and coordinates.
    """
    results = command_center_service.search(q)
    return {"query": q, "results": results, "count": len(results)}

@router.get("/copilot/context")
def get_copilot_context() -> Dict[str, Any]:
    """
    Get grounded operational context for the AI Copilot.
    """
    return {
        "overview": command_center_service.get_overview(),
        "disclaimer": "AI recommendations are strictly advisory. Operational decisions require authorized human review."
    }

@router.post("/copilot/query")
def query_copilot(req: CopilotQueryRequest) -> Dict[str, Any]:
    """
    Query the grounded Command Center AI Copilot.
    """
    return command_center_service.answer_copilot_question(req.question)

@router.post("/alerts/{alert_id}/acknowledge")
def acknowledge_alert(alert_id: str, req: AlertAcknowledgeRequest) -> Dict[str, Any]:
    """
    Acknowledge a command alert and log the action to the persistent audit trail.
    """
    result = command_center_service.acknowledge_alert(alert_id, user_role=req.user_role, user_name=req.user_name)
    if not result.get("success"):
        raise HTTPException(status_code=404, detail=result.get("error"))
    return result

@router.post("/recommendations/{recommendation_id}/approve")
def approve_recommendation(recommendation_id: str, req: RecommendationApproveRequest) -> Dict[str, Any]:
    """
    Human-in-the-Loop approval for safety-critical AI recommendations.
    Enforces authorized role check and creates an immutable audit trail entry.
    """
    result = command_center_service.approve_recommendation(
        recommendation_id=recommendation_id,
        user_role=req.user_role,
        user_name=req.user_name,
        comments=req.comments
    )
    if not result.get("success"):
        raise HTTPException(status_code=403 if "Unauthorized" in result.get("error", "") else 404, detail=result.get("error"))
    return result

@router.post("/demo/scenario")
def trigger_demo_scenario(req: DemoScenarioRequest) -> Dict[str, Any]:
    """
    Switch Command Center simulation scenario (1 through 8).
    """
    return command_center_service.trigger_demo_scenario(req.scenario_id)
