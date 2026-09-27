from fastapi import APIRouter
from typing import Dict, Any
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../../services")))
from prediction.route_optimizer import RouteOptimizer

router = APIRouter()

@router.get("/route/optimize/{ship_id}")
def optimize_ship_route(ship_id: str) -> Dict[str, Any]:
    """
    Run OR-Tools Vehicle Routing Optimization (Phase 38).
    """
    optimizer = RouteOptimizer()
    
    # Mock inputs derived from other modules
    current_route = ["Port Hobart", "Casey Station", "Davis Station", "Mawson Station"]
    weather_blocked = ["Casey Station"] # Simulate storm at Casey
    urgent_demands = ["Davis Station"]  # Simulate shortage at Davis from Phase 37
    
    result = optimizer.optimize_route(ship_id, current_route, weather_blocked, urgent_demands)
    
    return result
