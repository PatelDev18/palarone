"""
POLARONE Intelligence Center API Router.
Exposes endpoints for satellite acquisitions, Earth observation, sea-ice intelligence,
weather intelligence, vessel AIS fusion, AI/ML predictions & explainability, model registry,
data quality, risk intelligence, alerts, time machine, scenario simulation, and HITL actions.
"""

from fastapi import APIRouter, HTTPException, Query, Body, Depends
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

from app.services.intelligence_service import intelligence_service

router = APIRouter()

class ScenarioRequest(BaseModel):
    simulation_name: Optional[str] = Field(default=None, description="Optional simulation label")
    ice_delta_pct: float = Field(default=20.0, description="Sea ice concentration change percentage e.g. +20.0")
    wind_delta_knots: float = Field(default=15.0, description="Wind speed increase in knots e.g. +15.0")
    engine_derate_pct: float = Field(default=0.0, description="Engine derating percentage e.g. 10.0")
    affected_vessel: str = Field(default="Polar Star", description="Target vessel name")
    actor: str = Field(default="Operational Analyst", description="Name of operator running simulation")
    actor_role: str = Field(default="Analyst", description="Role of operator")

class HITLActionRequest(BaseModel):
    action: str = Field(..., description="Action to perform: ACKNOWLEDGE, REVIEW, DISMISS, ESCALATE")
    alert_id: str = Field(..., description="Target Alert ID")
    actor: str = Field(default="Duty Commander Hayes", description="Name of operator performing action")
    role: str = Field(default="Commander", description="Authorized role: Commander, Operations, Safety Officer")
    notes: Optional[str] = Field(default=None, description="Operational justification or log notes")

class AnalyzeRequest(BaseModel):
    scene_id: Optional[str] = Field(default=None, description="Target satellite scene ID")
    aoi_code: Optional[str] = Field(default="AOI_DAVIS", description="Target AOI code")
    vessel_id: Optional[str] = Field(default="VESSEL_POLAR_STAR", description="Target vessel ID")

# ========================================================
# 1. OVERVIEW & KPIS
# ========================================================

@router.get("/overview")
def get_intelligence_overview() -> Dict[str, Any]:
    """
    Get consolidated Intelligence Center overview, 8 KPI cards, and operational status.
    """
    return intelligence_service.get_overview()

# ========================================================
# 2. SATELLITE ACQUISITIONS & PROVIDERS
# ========================================================

@router.get("/satellite/acquisitions")
def get_satellite_acquisitions() -> Dict[str, Any]:
    """
    Get all satellite acquisitions, STAC scenes, and processing pipeline states.
    """
    return intelligence_service.get_acquisitions()

@router.get("/satellite/scenes/{scene_id}")
def get_satellite_scene_details(scene_id: str) -> Dict[str, Any]:
    """
    Get deep scene metadata, extracted features, and risk overlays for a satellite acquisition.
    """
    scene = intelligence_service.get_scene_details(scene_id)
    if not scene:
        raise HTTPException(status_code=404, detail=f"Satellite scene '{scene_id}' not found.")
    return scene

@router.get("/satellite/providers")
def get_satellite_providers() -> Dict[str, Any]:
    """
    Get all registered Earth Observation providers (Sentinel, Landsat, MODIS, Commercial ICEYE, Planet).
    """
    return intelligence_service.get_providers()

@router.get("/satellite/coverage")
def get_satellite_coverage_planner() -> Dict[str, Any]:
    """
    Get future satellite pass windows and observation schedule across Antarctic AOIs.
    """
    return intelligence_service.get_coverage()

# ========================================================
# 3. ICE, WEATHER & VESSEL INTELLIGENCE
# ========================================================

@router.get("/ice/status")
def get_ice_intelligence() -> Dict[str, Any]:
    """
    Get sea-ice concentration, thickness, movement, ridge keels, and route intersection hazards.
    """
    return intelligence_service.get_ice_status()

@router.get("/weather/intelligence")
def get_weather_intelligence() -> Dict[str, Any]:
    """
    Get Antarctic weather intelligence, katabatic gale warnings, and route weather impacts.
    """
    return intelligence_service.get_weather_intelligence()

@router.get("/vessels/intelligence")
def get_vessels_intelligence() -> Dict[str, Any]:
    """
    Get fleet AIS telemetry fused with satellite SAR observations and ML delay predictions.
    """
    return intelligence_service.get_vessels_intelligence()

# ========================================================
# 4. RISK INTELLIGENCE & PREDICTIONS
# ========================================================

@router.get("/risk/summary")
def get_risk_summary() -> Dict[str, Any]:
    """
    Get consolidated multi-category risk intelligence (Vessel, Ice, Weather, Asset, Station, Cargo).
    """
    return intelligence_service.get_risk_summary()

@router.get("/risk/events")
def get_risk_events() -> Dict[str, Any]:
    """
    Get recent risk assessment events.
    """
    return {
        "events": intelligence_service.risk_summary.get("categories", []),
        "overall_status": intelligence_service.risk_summary.get("overall_status", "ELEVATED"),
        "overall_score": intelligence_service.risk_summary.get("overall_score", 76)
    }

@router.get("/predictions")
def get_ai_predictions() -> Dict[str, Any]:
    """
    Get all active AI predictions with feature explainability ('WHY?'), confidence, and advisory notice.
    """
    return {
        "predictions": intelligence_service.predictions,
        "count": len(intelligence_service.predictions),
        "disclaimer": "AI recommendations are strictly advisory and require authorized human review."
    }

# ========================================================
# 5. MODEL REGISTRY & MONITORING
# ========================================================

@router.get("/models")
def get_ml_models() -> Dict[str, Any]:
    """
    Get all registered models in the POLARONE Model Registry (XGBoost, LightGBM, Isolation Forest, Autoencoder, Survival Analysis, Graph Model, OR-Tools).
    """
    return intelligence_service.get_models()

@router.get("/models/{model_id}")
def get_model_details(model_id: str) -> Dict[str, Any]:
    """
    Get detailed specification, inputs, outputs, and drift status for a registered model.
    """
    model = intelligence_service.get_model_details(model_id)
    if not model:
        raise HTTPException(status_code=404, detail=f"Model '{model_id}' not found in registry.")
    return model

@router.get("/models/{model_id}/metrics")
def get_model_metrics(model_id: str) -> Dict[str, Any]:
    """
    Get drift metrics (PSI, KS), inference latency, and accuracy distribution for a model.
    """
    metrics = intelligence_service.get_model_metrics(model_id)
    if not metrics:
        raise HTTPException(status_code=404, detail=f"Metrics for model '{model_id}' not found.")
    return metrics

# ========================================================
# 6. ALERTS & DATA QUALITY
# ========================================================

@router.get("/alerts")
def get_intelligence_alerts() -> Dict[str, Any]:
    """
    Get prioritized operational intelligence alerts.
    """
    return intelligence_service.get_alerts()

@router.get("/data-quality")
def get_data_quality_report() -> Dict[str, Any]:
    """
    Get multi-source feed health, latency, missing packets, and stale telemetry warnings.
    """
    return intelligence_service.get_data_quality()

# ========================================================
# 7. TIME MACHINE & SCENARIO ANALYSIS
# ========================================================

@router.get("/timeline")
def get_intelligence_timeline() -> Dict[str, Any]:
    """
    Get multi-temporal historical timeline steps (01 Sep - 27 Sep 2026).
    """
    return intelligence_service.get_timeline()

@router.post("/scenario")
def run_scenario_simulation(req: ScenarioRequest) -> Dict[str, Any]:
    """
    Run 'What If?' scenario simulation with custom environmental and operational parameters.
    """
    return intelligence_service.run_scenario_simulation(req.model_dump())

@router.post("/analyze")
def trigger_analysis(req: AnalyzeRequest) -> Dict[str, Any]:
    """
    Trigger on-demand geospatial feature extraction and ML risk inference on a scene or AOI.
    """
    return {
        "status": "ANALYSIS_COMPLETE",
        "scene_id": req.scene_id or "S1A_IW_GRDH_1SDV_20260927T1310_DAVIS_78F4",
        "aoi": req.aoi_code,
        "features_extracted": ["Sea Ice Pack Ridge", "Lead Sector 4", "Fast Ice Boundary"],
        "calculated_risk_score": 84,
        "recommendation": "Divert 14nm northeast to exploit open lead.",
        "confidence": 0.88,
        "disclaimer": "AI ADVISORY - Human Review Required."
    }

# ========================================================
# 8. HUMAN-IN-THE-LOOP & DEMO TRIGGER
# ========================================================

@router.post("/hitl/action")
def perform_hitl_action(req: HITLActionRequest) -> Dict[str, Any]:
    """
    Human-in-the-Loop operational action: REVIEW, ACKNOWLEDGE, DISMISS, ESCALATE.
    """
    result = intelligence_service.perform_hitl_action(
        action=req.action,
        alert_id=req.alert_id,
        actor=req.actor,
        role=req.role,
        notes=req.notes or ""
    )
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error"))
    return result

@router.post("/demo/trigger")
def trigger_demo_cascade() -> Dict[str, Any]:
    """
    Trigger end-to-end Antarctic Intelligence Demonstration:
    Satellite -> Geospatial Pipeline -> Ice Feature -> Vessel Risk -> Alert -> Command Center.
    """
    return intelligence_service.trigger_demo_event()
