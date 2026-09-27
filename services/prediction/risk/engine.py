from typing import Dict, Any
from datetime import datetime

class RiskEngine:
    """
    Central Risk Engine (Phase 10).
    Aggregates ML predictions and environmental data to determine operational risk.
    """
    
    def __init__(self):
        pass
        
    def evaluate_ship_risk(self, eta_prediction: Dict[str, Any], weather: Dict[str, Any]) -> Dict[str, Any]:
        """
        Evaluates risk for a ship currently in transit.
        """
        delay = eta_prediction.get("expected_delay_hours", 0)
        confidence = eta_prediction.get("confidence_score", 100)
        
        risk_level = "Low"
        recommended_action = "Continue monitoring."
        
        if delay > 24:
            risk_level = "High"
            recommended_action = "Review alternative route or adjust station inventory planning."
        elif delay > 12:
            risk_level = "Medium"
            recommended_action = "Monitor ice edge progression."
            
        return {
            "risk_type": "Route & Schedule Risk",
            "severity": risk_level,
            "probability": confidence,
            "impact": "Station supply delay",
            "evidence": eta_prediction.get("contributing_factors", []),
            "recommended_action": recommended_action,
            "timestamp": datetime.utcnow().isoformat()
        }
