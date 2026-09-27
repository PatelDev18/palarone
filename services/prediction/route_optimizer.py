from typing import Dict, Any, List
import random
from datetime import datetime

class RouteOptimizer:
    """
    Simulates Google OR-Tools Vehicle Routing Problem (VRP) (Phase 38).
    Optimizes ship routes based on weather, ice, and station demand shortages.
    """
    def __init__(self):
        self.engine = "OR-Tools-VRP-v7.2"
        
    def optimize_route(self, ship_id: str, current_route: List[str], weather_blocked_nodes: List[str], urgent_demands: List[str]) -> Dict[str, Any]:
        """
        Run the optimization.
        If a station has urgent demands (Phase 37), OR-Tools prioritizes it.
        If a node is blocked by weather (Phase 33), it routes around it.
        """
        
        # Original metrics
        original_distance_nm = 1200 + random.randint(-100, 200)
        original_time_hours = original_distance_nm / 10.0 # avg 10 knots
        
        # New optimized route logic
        optimized_route = []
        # Add urgent demands first if they are in the route pool
        for demand in urgent_demands:
            optimized_route.append(demand)
            
        for stop in current_route:
            if stop not in optimized_route and stop not in weather_blocked_nodes:
                optimized_route.append(stop)
                
        # Simulate savings or costs
        # Rerouting for urgent demands usually increases total distance but prevents critical failure
        if urgent_demands:
            optimized_distance_nm = original_distance_nm + random.randint(50, 150)
            reason = "Rerouted to prioritize critical station shortage."
        elif weather_blocked_nodes:
            optimized_distance_nm = original_distance_nm + random.randint(100, 300)
            reason = "Rerouted to avoid severe weather / heavy sea ice."
        else:
            optimized_distance_nm = original_distance_nm - random.randint(10, 50)
            reason = "Standard TSP distance optimization."
            
        optimized_time_hours = optimized_distance_nm / 10.5 # slightly faster via clear waters
        
        return {
            "optimization_engine": self.engine,
            "ship_id": ship_id,
            "timestamp": datetime.utcnow().isoformat(),
            "original_plan": {
                "route": current_route,
                "distance_nm": round(original_distance_nm, 1),
                "estimated_hours": round(original_time_hours, 1)
            },
            "optimized_plan": {
                "route": optimized_route,
                "distance_nm": round(optimized_distance_nm, 1),
                "estimated_hours": round(optimized_time_hours, 1)
            },
            "metrics": {
                "distance_delta_nm": round(optimized_distance_nm - original_distance_nm, 1),
                "time_delta_hours": round(optimized_time_hours - original_time_hours, 1)
            },
            "primary_reason": reason
        }
