"""
PolarOne Expedition Management System - API Router (v1)
Endpoints for expedition planning, tracking, asset allocation, satellite/ice/weather
intelligence, explainable risk calculation, human-in-the-loop decisions, and scenario simulation.
"""

from fastapi import APIRouter, HTTPException, Query, Body, status
from typing import Dict, Any, List, Optional
from ...services.expedition_service import expedition_service

router = APIRouter()

@router.get("", response_model=List[Dict[str, Any]])
def list_expeditions(
    status: Optional[str] = Query(None, description="Filter by status (e.g. OPERATIONAL, PLANNING, BLOCKED)"),
    risk: Optional[str] = Query(None, description="Filter by risk level (LOW, MEDIUM, HIGH, CRITICAL)"),
    region: Optional[str] = Query(None, description="Filter by geographic region"),
    vessel: Optional[str] = Query(None, description="Filter by assigned vessel name"),
    lead: Optional[str] = Query(None, description="Filter by expedition leader"),
    search: Optional[str] = Query(None, description="Free-text search across mission names, leads, vessels, regions")
):
    """
    Get all registered expeditions with multi-criteria filtering.
    """
    return expedition_service.get_expeditions(
        status=status,
        risk=risk,
        region=region,
        vessel=vessel,
        lead=lead,
        search=search
    )

@router.get("/kpis", response_model=Dict[str, Any])
def get_expedition_kpis():
    """
    Get compact summary KPIs for the top header row of the Expeditions module.
    """
    return expedition_service.get_kpis()

@router.post("", status_code=status.HTTP_201_CREATED, response_model=Dict[str, Any])
def create_expedition(payload: Dict[str, Any] = Body(...)):
    """
    Register a newly planned expedition via the multi-step wizard.
    """
    created = expedition_service.create_expedition(payload)
    return created

@router.get("/{exp_id}", response_model=Dict[str, Any])
def get_expedition(exp_id: str):
    """
    Get complete details of a single expedition.
    """
    exp = expedition_service.get_expedition(exp_id)
    if not exp:
        raise HTTPException(status_code=404, detail=f"Expedition '{exp_id}' not found.")
    return exp

@router.put("/{exp_id}", response_model=Dict[str, Any])
def update_expedition(exp_id: str, payload: Dict[str, Any] = Body(...)):
    """
    Update expedition parameters, route, assets, or objectives.
    """
    updated = expedition_service.update_expedition(exp_id, payload)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Expedition '{exp_id}' not found.")
    return updated

@router.delete("/{exp_id}", status_code=status.HTTP_200_OK)
def delete_expedition(exp_id: str):
    """
    Archive/delete an expedition.
    """
    success = expedition_service.delete_expedition(exp_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Expedition '{exp_id}' not found.")
    return {"message": f"Expedition '{exp_id}' archived successfully."}

@router.get("/{exp_id}/map", response_model=Dict[str, Any])
def get_expedition_map(exp_id: str):
    """
    Get dedicated map data: route coordinates, waypoints, asset telemetry,
    satellite footprint, weather overlay, and sea-ice concentration zones.
    """
    exp = expedition_service.get_expedition(exp_id)
    if not exp:
        raise HTTPException(status_code=404, detail=f"Expedition '{exp_id}' not found.")
    return {
        "expedition_id": exp["id"],
        "name": exp["name"],
        "current_lat": exp.get("current_lat"),
        "current_lon": exp.get("current_lon"),
        "waypoints": exp.get("waypoints", []),
        "vessel_name": exp.get("vessel_name"),
        "aircraft": exp.get("aircraft", []),
        "satellite": exp.get("satellite", {}),
        "sea_ice": exp.get("sea_ice", {}),
        "weather": exp.get("weather", {})
    }

@router.get("/{exp_id}/personnel", response_model=Dict[str, Any])
def get_expedition_personnel(exp_id: str):
    """
    Get crew manifest, shift assignments, medical certifications, and workload.
    """
    exp = expedition_service.get_expedition(exp_id)
    if not exp:
        raise HTTPException(status_code=404, detail=f"Expedition '{exp_id}' not found.")
    return exp.get("personnel", {})

@router.get("/{exp_id}/assets", response_model=List[Dict[str, Any]])
def get_expedition_assets(exp_id: str):
    """
    Get list of all assigned ships, aircraft, tracked vehicles, and major equipment.
    """
    exp = expedition_service.get_expedition(exp_id)
    if not exp:
        raise HTTPException(status_code=404, detail=f"Expedition '{exp_id}' not found.")
    
    assets = []
    # Build unified asset records
    for ship in exp.get("ships", []):
        assets.append({
            "id": f"AST-SHP-{ship.replace(' ', '_')}",
            "name": ship,
            "type": "Ship / Icebreaker",
            "status": "ACTIVE" if exp.get("status") in ["IN TRANSIT", "OPERATIONAL"] else "READY",
            "location": exp.get("current_region", "Antarctica"),
            "health_pct": 98 if exp.get("id") != "EXP-2026-C" else 88,
            "fuel_pct": exp.get("logistics", {}).get("fuel_projected_remaining_pct", 80),
            "data_freshness": "2 min ago"
        })
    for ac in exp.get("aircraft", []):
        assets.append({
            "id": f"AST-AIR-{ac[:8].replace(' ', '_')}",
            "name": ac,
            "type": "Aircraft / Helicopter",
            "status": "OFFLINE" if "Grounded" in ac or exp.get("status") == "BLOCKED" else "READY",
            "location": exp.get("current_region", "Antarctica"),
            "health_pct": 95,
            "fuel_pct": 75,
            "data_freshness": "15 min ago"
        })
    for v in exp.get("vehicles", []):
        assets.append({
            "id": f"AST-VEH-{v[:8].replace(' ', '_')}",
            "name": v,
            "type": "Snow Vehicle / Overland",
            "status": "ACTIVE",
            "location": exp.get("destination_name", "Base Camp"),
            "health_pct": 92,
            "fuel_pct": 65,
            "data_freshness": "45 min ago"
        })
    for eq in exp.get("major_equipment", []):
        assets.append({
            "id": f"AST-EQP-{eq[:8].replace(' ', '_')}",
            "name": eq,
            "type": "Scientific Equipment",
            "status": "ACTIVE" if exp.get("status") != "BLOCKED" else "WARNING",
            "location": exp.get("destination_name", "Base Camp"),
            "health_pct": 96,
            "fuel_pct": 100,
            "data_freshness": "1 hour ago"
        })
    return assets

@router.get("/{exp_id}/cargo", response_model=Dict[str, Any])
def get_expedition_cargo(exp_id: str):
    """
    Get cargo manifest and resource readiness (food, fuel, medicine, parts).
    """
    exp = expedition_service.get_expedition(exp_id)
    if not exp:
        raise HTTPException(status_code=404, detail=f"Expedition '{exp_id}' not found.")
    return exp.get("logistics", {})

@router.get("/{exp_id}/tasks", response_model=List[Dict[str, Any]])
def get_expedition_tasks(exp_id: str):
    """
    Get operational task list with dependency tree and status.
    """
    exp = expedition_service.get_expedition(exp_id)
    if not exp:
        raise HTTPException(status_code=404, detail=f"Expedition '{exp_id}' not found.")
    return exp.get("tasks", [])

@router.post("/{exp_id}/tasks", status_code=status.HTTP_201_CREATED, response_model=Dict[str, Any])
def add_expedition_task(exp_id: str, task: Dict[str, Any] = Body(...)):
    """
    Add a task to the expedition.
    """
    created = expedition_service.add_task(exp_id, task)
    if not created:
        raise HTTPException(status_code=404, detail=f"Expedition '{exp_id}' not found.")
    return created

@router.put("/{exp_id}/tasks/{task_id}", response_model=Dict[str, Any])
def update_expedition_task(exp_id: str, task_id: str, updates: Dict[str, Any] = Body(...)):
    """
    Update a task's status, assignee, or priority.
    """
    updated = expedition_service.update_task(exp_id, task_id, updates)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Task '{task_id}' or expedition '{exp_id}' not found.")
    return updated

@router.get("/{exp_id}/risks", response_model=Dict[str, Any])
def get_expedition_risks(exp_id: str):
    """
    Get explainable risk model breakdown across 12 operational categories.
    """
    exp = expedition_service.get_expedition(exp_id)
    if not exp:
        raise HTTPException(status_code=404, detail=f"Expedition '{exp_id}' not found.")
    return exp.get("risk_engine", {})

@router.get("/{exp_id}/weather", response_model=Dict[str, Any])
def get_expedition_weather(exp_id: str):
    """
    Get current weather, 6h/24h/3d/7d forecasts, and operational warnings.
    """
    exp = expedition_service.get_expedition(exp_id)
    if not exp:
        raise HTTPException(status_code=404, detail=f"Expedition '{exp_id}' not found.")
    return exp.get("weather", {})

@router.get("/{exp_id}/ice", response_model=Dict[str, Any])
def get_expedition_ice(exp_id: str):
    """
    Get sea-ice intelligence (concentration, thickness, drift, compression risk).
    """
    exp = expedition_service.get_expedition(exp_id)
    if not exp:
        raise HTTPException(status_code=404, detail=f"Expedition '{exp_id}' not found.")
    return exp.get("sea_ice", {})

@router.get("/{exp_id}/satellite", response_model=Dict[str, Any])
def get_expedition_satellite(exp_id: str):
    """
    Get satellite observation metadata (Sentinel-1 SAR, Landsat, ICESat-2).
    """
    exp = expedition_service.get_expedition(exp_id)
    if not exp:
        raise HTTPException(status_code=404, detail=f"Expedition '{exp_id}' not found.")
    return exp.get("satellite", {})

@router.get("/{exp_id}/timeline", response_model=List[Dict[str, Any]])
def get_expedition_timeline(exp_id: str):
    """
    Get Gantt-style mission phases and milestones.
    """
    exp = expedition_service.get_expedition(exp_id)
    if not exp:
        raise HTTPException(status_code=404, detail=f"Expedition '{exp_id}' not found.")
    return exp.get("timeline", [])

@router.get("/{exp_id}/incidents", response_model=List[Dict[str, Any]])
def get_expedition_incidents(exp_id: str):
    """
    Get active and mitigated safety, equipment, or weather incidents.
    """
    exp = expedition_service.get_expedition(exp_id)
    if not exp:
        raise HTTPException(status_code=404, detail=f"Expedition '{exp_id}' not found.")
    return exp.get("incidents", [])

@router.post("/{exp_id}/incidents", status_code=status.HTTP_201_CREATED, response_model=Dict[str, Any])
def add_expedition_incident(exp_id: str, incident: Dict[str, Any] = Body(...)):
    """
    Log an incident occurring during the mission.
    """
    created = expedition_service.add_incident(exp_id, incident)
    if not created:
        raise HTTPException(status_code=404, detail=f"Expedition '{exp_id}' not found.")
    return created

@router.post("/{exp_id}/approve", response_model=Dict[str, Any])
def approve_expedition(exp_id: str, payload: Dict[str, Any] = Body(default={})):
    """
    Commander approval to transition an expedition from READY FOR APPROVAL to APPROVED.
    """
    approver = payload.get("approver", "Commander E. Hayes")
    comments = payload.get("comments", "Mission approved for polar deployment.")
    updated = expedition_service.approve_expedition(exp_id, actor=approver, comments=comments)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Expedition '{exp_id}' not found.")
    return {"message": "Expedition approved", "expedition": updated}

@router.post("/{exp_id}/pause", response_model=Dict[str, Any])
def pause_expedition(exp_id: str, payload: Dict[str, Any] = Body(default={})):
    """
    Suspend operations due to Commander order or field hazards.
    """
    reason = payload.get("reason", "Operational pause ordered by Commander.")
    actor = payload.get("actor", "Commander E. Hayes")
    updated = expedition_service.pause_expedition(exp_id, reason=reason, actor=actor)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Expedition '{exp_id}' not found.")
    return {"message": "Expedition paused", "expedition": updated}

@router.post("/{exp_id}/resume", response_model=Dict[str, Any])
def resume_expedition(exp_id: str, payload: Dict[str, Any] = Body(default={})):
    """
    Resume an expedition from BLOCKED or SUSPENDED to OPERATIONAL.
    """
    actor = payload.get("actor", "Commander E. Hayes")
    updated = expedition_service.resume_expedition(exp_id, actor=actor)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Expedition '{exp_id}' not found.")
    return {"message": "Expedition resumed", "expedition": updated}

@router.post("/{exp_id}/status", response_model=Dict[str, Any])
def transition_status(exp_id: str, payload: Dict[str, Any] = Body(...)):
    """
    Perform a formal lifecycle status transition with mandatory reason and actor.
    """
    new_status = payload.get("status")
    reason = payload.get("reason", "Status updated.")
    actor = payload.get("actor", "Commander E. Hayes")
    if not new_status:
        raise HTTPException(status_code=400, detail="Missing 'status' in payload.")
    updated = expedition_service.update_status(exp_id, new_status, reason, actor)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Expedition '{exp_id}' not found.")
    return {"message": f"Status updated to {new_status}", "expedition": updated}

@router.post("/{exp_id}/scenario", response_model=Dict[str, Any])
def run_scenario_simulation(exp_id: str, payload: Dict[str, Any] = Body(...)):
    """
    Run what-if scenario simulations (vessel delay, blizzard, fuel surge, aircraft grounded).
    """
    scenario_type = payload.get("scenario_type", "VESSEL_DELAY")
    params = payload.get("params", {})
    return expedition_service.simulate_scenario(exp_id, scenario_type, params)

@router.post("/{exp_id}/recommendations/{rec_id}/decide", response_model=Dict[str, Any])
def decide_recommendation(
    exp_id: str,
    rec_id: str,
    payload: Dict[str, Any] = Body(...)
):
    """
    Human-in-the-Loop decision gate: Commander approves or rejects an AI recommendation.
    """
    decision = payload.get("decision", "APPROVE") # APPROVE or REJECT
    actor = payload.get("actor", "Commander E. Hayes")
    comments = payload.get("comments", "")
    decided = expedition_service.decide_recommendation(exp_id, rec_id, decision, actor, comments)
    if not decided:
        raise HTTPException(status_code=404, detail=f"Recommendation '{rec_id}' not found.")
    return {"message": f"Recommendation {decision}D", "recommendation": decided}

@router.post("/copilot", response_model=Dict[str, Any])
def query_expeditions_copilot(payload: Dict[str, Any] = Body(...)):
    """
    Ground-truth natural language expedition querying.
    """
    query = payload.get("query", "")
    exp_id = payload.get("expedition_id")
    return expedition_service.query_copilot(query, exp_id)

@router.get("/{exp_id}/audit", response_model=List[Dict[str, Any]])
def get_audit_trail(exp_id: str):
    """
    Get complete immutable audit log for this expedition.
    """
    return expedition_service.get_audit_logs(exp_id)
