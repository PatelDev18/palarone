from fastapi import APIRouter, HTTPException, Query, Body
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

from app.services.digital_twin_service import digital_twin_service

router = APIRouter()

class SimulateRequest(BaseModel):
    scenario_key: str = Field(..., description="Scenario key: generator_failure, ship_delay_36h, station_comms_loss, severe_blizzard, fuel_shortage")
    custom_params: Optional[Dict[str, Any]] = Field(default=None, description="Optional scenario custom parameters")

class QueryRequest(BaseModel):
    question: str = Field(..., description="Grounded operational question e.g. 'What happens if Generator #2 fails?'")

@router.get("/")
def get_digital_twin_root() -> Dict[str, Any]:
    """
    Returns full operational digital twin state: overview, graph nodes, relationships,
    and active cascading impact chains.
    """
    overview = digital_twin_service.get_overview()
    graph = digital_twin_service.get_graph()
    return {
        **overview,
        **graph,
        "cascades": digital_twin_service.active_cascades,
        "recent_events": digital_twin_service.recent_events,
        "satellite_observations": digital_twin_service.satellite_observations
    }

@router.get("/overview")
def get_overview() -> Dict[str, Any]:
    """
    Returns high-level digital twin KPIs, operational status, and data source freshness matrix.
    """
    return digital_twin_service.get_overview()

@router.get("/graph")
def get_graph() -> Dict[str, Any]:
    """
    Returns formatted React Flow nodes and typed directional edges.
    """
    return digital_twin_service.get_graph()

@router.get("/nodes")
def get_nodes(category: Optional[str] = Query(None, description="Filter by category: SHIP, STATION, EQUIPMENT, CARGO, PERSONNEL, INFRASTRUCTURE, ENVIRONMENT")) -> Dict[str, Any]:
    """
    Returns all entities in the Antarctic operational knowledge graph, optionally filtered by category.
    """
    nodes = digital_twin_service.nodes
    if category:
        nodes = [n for n in nodes if n["category"].upper() == category.upper()]
    return {
        "nodes": nodes,
        "count": len(nodes)
    }

@router.get("/nodes/{node_id}")
def get_node(node_id: str) -> Dict[str, Any]:
    """
    Get detailed telemetry, physical properties, risk analysis, and data sources for a specific node.
    """
    node = digital_twin_service.get_node(node_id)
    if not node:
        raise HTTPException(status_code=404, detail=f"Digital Twin Node '{node_id}' not found")
    return node

@router.get("/dependencies/{node_id}")
def get_dependencies(node_id: str) -> Dict[str, Any]:
    """
    Returns upstream (dependencies this node relies on) and downstream (nodes that depend on this node) entities.
    """
    node = digital_twin_service.get_node(node_id)
    if not node:
        raise HTTPException(status_code=404, detail=f"Digital Twin Node '{node_id}' not found")
    return digital_twin_service.get_dependencies(node_id)

@router.get("/impact/{node_id}")
def get_impact_analysis(node_id: str) -> Dict[str, Any]:
    """
    Runs cascading impact analysis starting from a trigger node across multiple time horizons.
    """
    node = digital_twin_service.get_node(node_id)
    if not node:
        raise HTTPException(status_code=404, detail=f"Digital Twin Node '{node_id}' not found")
    return digital_twin_service.get_impact_analysis(node_id)

@router.get("/cascades")
def get_cascades() -> Dict[str, Any]:
    """
    Returns all currently active compounding multi-node cascading failure chains.
    """
    return {
        "cascades": digital_twin_service.active_cascades,
        "count": len(digital_twin_service.active_cascades)
    }

@router.get("/events")
def get_events() -> Dict[str, Any]:
    """
    Returns real-time event telemetry stream and chronological twin state transitions.
    """
    return {
        "events": digital_twin_service.recent_events,
        "count": len(digital_twin_service.recent_events)
    }

@router.get("/environment")
def get_satellite_observations() -> Dict[str, Any]:
    """
    Returns realistic satellite radar and optical observation metadata with age and freshness.
    """
    return {
        "observations": digital_twin_service.satellite_observations,
        "count": len(digital_twin_service.satellite_observations)
    }

@router.post("/simulate")
def simulate_what_if(req: SimulateRequest) -> Dict[str, Any]:
    """
    Executes a non-destructive What-If Simulation Sandbox run.
    """
    return digital_twin_service.simulate_what_if(req.scenario_key, req.custom_params)

@router.post("/query")
def query_twin_assistant(req: QueryRequest) -> Dict[str, Any]:
    """
    Grounded Natural Language Assistant: Answers operational queries strictly using
    the knowledge graph and telemetry dependencies.
    """
    return digital_twin_service.query_assistant(req.question)
