from datetime import datetime
from typing import Dict, Any

class AntarcticRealityEngine:
    """
    Phase 51-82: Operational Reality, Freshness, and HITL Safety Gate.
    Enforces the physical constraints of Antarctic operations.
    """
    
    @staticmethod
    def assess_freshness(timestamp_iso: str, data_type: str) -> Dict[str, Any]:
        """Phase 54: Satellite & Data Freshness Engine"""
        if not timestamp_iso:
            return {"state": "UNAVAILABLE", "age_minutes": -1, "label": "NO DATA"}
            
        try:
            obs_time = datetime.fromisoformat(timestamp_iso.replace("Z", "+00:00"))
            now = datetime.utcnow().replace(tzinfo=obs_time.tzinfo)
            age = (now - obs_time).total_seconds() / 60.0
        except:
            return {"state": "INVALID", "age_minutes": -1, "label": "DATA CORRUPTED"}
        
        # Thresholds depend on telemetry type (minutes)
        if data_type == "AIS":
            thresholds = (15, 60) # 15m fresh, 1h recent
        elif data_type == "SATELLITE":
            thresholds = (360, 1440) # 6h fresh, 24h recent
        elif data_type == "TELEMETRY":
            thresholds = (5, 30) # Sensor telemetry degrades fast
        else:
            thresholds = (30, 120)
            
        state = "FRESH"
        if age > thresholds[1]:
            state = "STALE"
        elif age > thresholds[0]:
            state = "RECENT"
            
        return {
            "state": state, 
            "age_minutes": round(age, 1),
            "label": f"{state} ({round(age)}m old)" if age < 120 else f"{state} ({round(age/60.0, 1)}h old)"
        }

    @staticmethod
    def safety_gate(recommendation: Dict[str, Any], context: str) -> Dict[str, Any]:
        """Phase 69: AI Safety Gate & Phase 66 HITL Control System"""
        # AI CANNOT execute autonomously. It must be explicitly downgraded to a draft.
        return {
            "autonomous_execution_allowed": False,
            "human_approval_required": True,
            "safety_gate_status": "AWAITING_COMMANDER_APPROVAL",
            "audit_trail": [{
                "timestamp": datetime.utcnow().isoformat(),
                "action": "DRAFT_GENERATED",
                "actor": "POLARONE_AI",
                "note": "Awaiting human-in-the-loop validation"
            }],
            "recommendation_payload": recommendation,
            "required_role": "COMMANDER"
        }
