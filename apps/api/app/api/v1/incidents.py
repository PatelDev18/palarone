"""
POLARONE Emergency Response Center REST API Router.
Endpoints for incident detection, triage, AI explainability, response assets,
Human-in-the-Loop commander approval, communication, audit logs, and post-incident reporting.
"""

from fastapi import APIRouter, HTTPException, Query, Body
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

from app.services.emergency_service import emergency_service

router = APIRouter()

# -----------------------------------------------------------------------------
# Pydantic Schemas
# -----------------------------------------------------------------------------

class CreateIncidentRequest(BaseModel):
    title: str = Field(..., example="Dense Sea Ice Blocking Polar Star")
    incident_type: str = Field(..., example="Sea Ice Obstruction")
    severity: str = Field(default="HIGH", example="CRITICAL")
    risk_score: int = Field(default=80, example=87)
    ai_confidence: int = Field(default=85, example=91)
    response_lead: str = Field(default="Cmdr. Hayes")
    description: str = Field(...)
    location_name: str = Field(default="Davis Station Route")
    coordinates: Dict[str, float] = Field(default={"lat": -67.84, "lon": 76.92})
    affected_asset_name: str = Field(default="Polar Star")
    is_simulation: bool = Field(default=False)

class SubmitApprovalRequest(BaseModel):
    action_type: str = Field(..., example="VESSEL_DIVERSION")
    title: str = Field(..., example="Divert Polar Star to Alternate Route B")
    reason: str = Field(..., example="Primary fairway obstructed by dense sea ice.")
    user: str = Field(default="Operations Lead")
    role: str = Field(default="Operations Officer")

class CommanderDecisionRequest(BaseModel):
    approval_id: str = Field(..., example="APPR-001")
    commander_name: str = Field(..., example="Cmdr. Hayes")
    commander_role: str = Field(default="Operations Commander")
    comment_or_reason: str = Field(..., example="Authorized after review of Sentinel-1A SAR lead corridor.")

class SendCommunicationRequest(BaseModel):
    sender: str = Field(..., example="Polar Star Bridge")
    sender_role: str = Field(default="Master")
    channel: str = Field(default="Iridium Polar SAT-3")
    message: str = Field(...)

class CloseIncidentRequest(BaseModel):
    commander_name: str = Field(..., example="Cmdr. Hayes")
    commander_notes: str = Field(..., example="Vessel successfully navigated alternate lead; incident closed.")
    root_cause: str = Field(default="Rapid pack convergence driven by 45kt katabatic gale.")

class TriggerScenarioRequest(BaseModel):
    scenario_id: int = Field(default=1, ge=1, le=8)

class SOSRequest(BaseModel):
    incident_type: str = Field(default="Medical Emergency")
    affected_asset: str = Field(default="Bharati Station")
    lat: float = Field(default=-69.40)
    lon: float = Field(default=76.19)

# -----------------------------------------------------------------------------
# REST Endpoints
# -----------------------------------------------------------------------------

@router.get("/overview")
def get_response_overview() -> Dict[str, Any]:
    """Retrieve 8 live KPI metrics for Response Overview Ribbon."""
    return emergency_service.get_overview()

@router.get("/protocols")
def get_protocols() -> List[Dict[str, Any]]:
    """Retrieve 10 maritime emergency protocols with operational checklists."""
    return emergency_service.protocols

@router.get("/assets")
def get_all_response_assets() -> List[Dict[str, Any]]:
    """Retrieve all Antarctic emergency response assets with suitability ranking."""
    return emergency_service.response_assets

@router.get("/audit")
def get_global_audit_log() -> List[Dict[str, Any]]:
    """Retrieve global immutable incident audit log."""
    return emergency_service.audit_log

@router.get("")
@router.get("/")
def list_incidents(
    status: Optional[str] = Query(None, description="Filter by status (e.g. AWAITING_APPROVAL)"),
    severity: Optional[str] = Query(None, description="Filter by severity (e.g. CRITICAL)")
) -> Dict[str, Any]:
    """Retrieve list of emergency incidents."""
    incidents = emergency_service.get_incidents(status=status, severity=severity)
    return {
        "count": len(incidents),
        "incidents": incidents
    }

@router.post("")
@router.post("/")
def create_incident(req: CreateIncidentRequest) -> Dict[str, Any]:
    """Manually declare or report a new emergency incident."""
    new_inc = emergency_service.create_incident(req.dict())
    return {
        "status": "CREATED",
        "incident": new_inc
    }

@router.get("/{incident_id}")
def get_incident(incident_id: str) -> Dict[str, Any]:
    """Retrieve full incident workspace object by ID."""
    inc = emergency_service.get_incident_by_id(incident_id)
    if not inc:
        raise HTTPException(status_code=404, detail=f"Incident '{incident_id}' not found")
    return inc

@router.get("/{incident_id}/timeline")
def get_incident_timeline(incident_id: str) -> List[Dict[str, Any]]:
    """Retrieve chronological event stream for an incident."""
    inc = emergency_service.get_incident_by_id(incident_id)
    if not inc:
        raise HTTPException(status_code=404, detail=f"Incident '{incident_id}' not found")
    return inc.get("timeline", [])

@router.get("/{incident_id}/risk")
def get_incident_risk(incident_id: str) -> Dict[str, Any]:
    """Retrieve explainable AI risk assessment, drivers, and SHAP breakdown."""
    inc = emergency_service.get_incident_by_id(incident_id)
    if not inc:
        raise HTTPException(status_code=404, detail=f"Incident '{incident_id}' not found")
    return inc.get("ai_risk_assessment", {})

@router.get("/{incident_id}/assets")
def get_incident_assets(incident_id: str) -> List[Dict[str, Any]]:
    """Retrieve response assets ranked by suitability for this specific incident."""
    inc = emergency_service.get_incident_by_id(incident_id)
    if not inc:
        raise HTTPException(status_code=404, detail=f"Incident '{incident_id}' not found")
    return emergency_service.response_assets

@router.get("/{incident_id}/recommendations")
def get_incident_recommendations(incident_id: str) -> Dict[str, Any]:
    """Retrieve AI-assisted response recommendations with ETA and risk deltas."""
    inc = emergency_service.get_incident_by_id(incident_id)
    if not inc:
        raise HTTPException(status_code=404, detail=f"Incident '{incident_id}' not found")
    return inc.get("ai_recommendation", {})

@router.post("/{incident_id}/simulate")
def simulate_response(incident_id: str) -> Dict[str, Any]:
    """
    Simulate response action / diversion.
    Strictly marked as simulated; does NOT execute real-world command.
    """
    inc = emergency_service.get_incident_by_id(incident_id)
    if not inc:
        raise HTTPException(status_code=404, detail=f"Incident '{incident_id}' not found")
    
    rec = inc.get("ai_recommendation", {})
    return {
        "status": "SIMULATION_SUCCESS",
        "incident_id": incident_id,
        "is_simulation": True,
        "simulated_metrics": {
            "eta_improvement_hours": rec.get("eta_improvement_hours", 11.0),
            "risk_reduction_pct": rec.get("risk_reduction_pct", 24.0),
            "fuel_impact_pct": rec.get("fuel_impact_pct", 4.0),
            "hull_stress_peak_kpa": 140.0, # safely below 450 kPa yield
            "estimated_completion_utc": "01 Oct 2026 23:30 UTC"
        },
        "safety_notice": "Simulation mode only. Live vessel maneuver requires Commander Human-in-the-Loop approval."
    }

@router.get("/{incident_id}/approval")
def get_pending_approvals(incident_id: str) -> List[Dict[str, Any]]:
    """Retrieve pending human approval requests for this incident."""
    inc = emergency_service.get_incident_by_id(incident_id)
    if not inc:
        raise HTTPException(status_code=404, detail=f"Incident '{incident_id}' not found")
    return inc.get("pending_approvals", [])

@router.post("/{incident_id}/approval")
def submit_approval_request(incident_id: str, req: SubmitApprovalRequest) -> Dict[str, Any]:
    """Queue an action for Human-in-the-Loop review. Does NOT execute autonomously."""
    try:
        appr = emergency_service.submit_for_approval(
            incident_id=incident_id,
            action_type=req.action_type,
            title=req.title,
            reason=req.reason,
            user=req.user,
            role=req.role
        )
        return {"status": "QUEUED_FOR_APPROVAL", "approval": appr}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/{incident_id}/approve")
def approve_action(incident_id: str, req: CommanderDecisionRequest) -> Dict[str, Any]:
    """
    Human Commander Formally Approves Critical Response Action.
    Applies Commander signature, triggers execution transmission, and records audit trail.
    """
    try:
        result = emergency_service.approve_action(
            incident_id=incident_id,
            approval_id=req.approval_id,
            commander_name=req.commander_name,
            commander_role=req.commander_role,
            comment=req.comment_or_reason
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/{incident_id}/reject")
def reject_action(incident_id: str, req: CommanderDecisionRequest) -> Dict[str, Any]:
    """Human Commander formally rejects proposed response action."""
    try:
        result = emergency_service.reject_action(
            incident_id=incident_id,
            approval_id=req.approval_id,
            commander_name=req.commander_name,
            commander_role=req.commander_role,
            reason=req.comment_or_reason
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/{incident_id}/communications")
def get_communications(incident_id: str) -> List[Dict[str, Any]]:
    """Retrieve multi-actor communications stream for incident."""
    inc = emergency_service.get_incident_by_id(incident_id)
    if not inc:
        raise HTTPException(status_code=404, detail=f"Incident '{incident_id}' not found")
    return inc.get("communications", [])

@router.post("/{incident_id}/communications")
def send_communication(incident_id: str, req: SendCommunicationRequest) -> Dict[str, Any]:
    """Send tactical communication message in incident channel."""
    try:
        comm = emergency_service.add_communication_message(
            incident_id=incident_id,
            sender=req.sender,
            role=req.sender_role,
            channel=req.channel,
            message=req.message
        )
        return {"status": "SENT", "communication": comm}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/{incident_id}/audit")
def get_incident_audit(incident_id: str) -> List[Dict[str, Any]]:
    """Retrieve audit trail entries for this specific incident."""
    return [a for a in emergency_service.audit_log if a.get("incident_id") == incident_id]

@router.post("/{incident_id}/close")
def close_incident(incident_id: str, req: CloseIncidentRequest) -> Dict[str, Any]:
    """Resolve and close incident, producing final closure summary."""
    try:
        res = emergency_service.close_incident(
            incident_id=incident_id,
            commander_name=req.commander_name,
            commander_notes=req.commander_notes,
            root_cause=req.root_cause
        )
        return {"status": "CLOSED", "result": res}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/{incident_id}/report")
def get_incident_report(incident_id: str) -> Dict[str, Any]:
    """Generate or retrieve Post-Incident Intelligence Report."""
    try:
        return emergency_service.generate_post_incident_report(incident_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/demo/scenario")
def trigger_demo_scenario(req: TriggerScenarioRequest) -> Dict[str, Any]:
    """Triggers one of the 8 Antarctic demo scenarios."""
    inc = emergency_service.trigger_scenario(req.scenario_id)
    return {
        "status": "SCENARIO_TRIGGERED",
        "scenario_id": req.scenario_id,
        "is_simulation": True,
        "incident": inc
    }

@router.post("/sos")
def trigger_sos_compatibility(request: SOSRequest) -> Dict[str, Any]:
    """
    Backward-compatibility with existing SOS trigger button.
    Creates a simulated emergency cascade and marks it as simulation.
    """
    sim_data = {
        "title": f"AUTOMATED SOS: {request.incident_type} at {request.affected_asset}",
        "incident_type": request.incident_type,
        "severity": "CRITICAL",
        "risk_score": 95,
        "ai_confidence": 90,
        "description": f"Automated emergency distress beacon received from {request.affected_asset} at {request.lat}°S, {request.lon}°E.",
        "location_name": f"{request.affected_asset} Environs ({request.lat}, {request.lon})",
        "coordinates": {"lat": request.lat, "lon": request.lon},
        "affected_asset_name": request.affected_asset,
        "is_simulation": True
    }
    inc = emergency_service.create_incident(sim_data, user="Distress Beacon", role="Autonomous Transponder")
    return {
        "incident_id": inc["id"],
        "severity": inc["severity"],
        "type": inc["incident_type"],
        "affected_asset": request.affected_asset,
        "coordinates": {"lat": request.lat, "lon": request.lon},
        "status": "SOS_ACTIVE",
        "automated_actions": [
            f"Declared {request.incident_type} emergency for {request.affected_asset}",
            "Identified Ocean Guardian as nearest capable asset",
            "Executed emergency fairway route diversion",
            "Submitted dispatch order for Commander Human Review"
        ],
        "diverted_asset": "Ocean Guardian",
        "timestamp": inc["detected_at"],
        "incident": inc
    }
