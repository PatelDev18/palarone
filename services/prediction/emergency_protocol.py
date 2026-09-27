from typing import Dict, Any, List
from datetime import datetime
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../")))
from prediction.route_optimizer import RouteOptimizer

class EmergencyProtocolEngine:
    """
    Advanced Emergency Intelligence (Phase 41).
    Automates SOS handling, reallocation of assets, and incident response tracking.
    """
    def __init__(self):
        self.route_optimizer = RouteOptimizer()
        
    def trigger_sos(self, incident_type: str, affected_asset_id: str, coordinates: Dict[str, float]) -> Dict[str, Any]:
        """
        Simulates an automated SOS cascade.
        """
        now = datetime.utcnow().isoformat()
        
        # 1. Identify nearest available rescue asset (Simulated)
        nearest_asset = "Aurora Explorer"
        
        # 2. Run Route Optimizer to divert the nearest asset to the emergency
        divert_route = ["Current Position", f"Emergency Location ({coordinates['lat']}, {coordinates['lon']})", "Nearest Port"]
        opt_plan = self.route_optimizer.optimize_route(
            ship_id="SHIP_002",
            current_route=divert_route,
            weather_blocked_nodes=[],
            urgent_demands=[f"SOS: {affected_asset_id}"]
        )
        
        return {
            "incident_id": f"SOS_{int(datetime.utcnow().timestamp())}",
            "severity": "CRITICAL",
            "type": incident_type,
            "affected_asset": affected_asset_id,
            "coordinates": coordinates,
            "status": "SOS_ACTIVE",
            "automated_actions": [
                f"Declared {incident_type} emergency for {affected_asset_id}",
                f"Identified {nearest_asset} as nearest capable asset",
                "Executed emergency VRP route diversion",
                f"Generated new waypoint plan: +{opt_plan['metrics']['distance_delta_nm']} nm deviation"
            ],
            "diverted_asset": nearest_asset,
            "diversion_plan": opt_plan,
            "timestamp": now
        }
