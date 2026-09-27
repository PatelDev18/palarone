from typing import Dict, Any, List
import random
from datetime import datetime, timedelta
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))
from prediction.registry import ml_registry

class SurvivalAnalysisRUL:
    """
    Simulates a Survival Analysis model predicting Remaining Useful Life (RUL).
    """
    def predict_rul(self, anomaly_score: float, current_hours: int) -> Dict[str, Any]:
        # High anomaly reduces RUL exponentially
        base_lifespan_hours = 10000
        remaining = base_lifespan_hours - current_hours
        
        if anomaly_score > 0.8:
            remaining_days = random.randint(1, 14) # Imminent failure
        elif anomaly_score > 0.5:
            remaining_days = random.randint(15, 60)
        else:
            remaining_days = remaining / 24.0
            
        return {
            "estimated_rul_days": int(remaining_days),
            "failure_probability_14d": round(anomaly_score * 0.9, 2)
        }

class IsolationForestDetector:
    """
    Isolation Forest for IoT sensor anomaly detection (Phase 36).
    """
    
    def __init__(self, model_id="IF_ANOMALY_01"):
        self.model_id = model_id
        self.rul_model = SurvivalAnalysisRUL()
        
    def detect(self, asset_id: str, telemetry: Dict[str, float]) -> Dict[str, Any]:
        """
        Detect anomalies in telemetry and predict Asset Health & RUL.
        """
        # Feature processing
        vibration = telemetry.get("vibration", 0.0)
        temperature = telemetry.get("temperature", 0.0)
        
        # Synthetic evaluation
        anomaly_score = 0.92 if vibration > 15.0 else random.uniform(0.1, 0.4)
        is_anomaly = anomaly_score > 0.85
        
        # Determine RUL
        operating_hours = telemetry.get("operating_hours", 4500)
        rul_prediction = self.rul_model.predict_rul(anomaly_score, operating_hours)
        
        health_score = max(0, int(100 - (anomaly_score * 100)))
        
        registry_prediction = ml_registry.format_prediction(
            model_id=self.model_id,
            entity_id=asset_id,
            prediction_value=is_anomaly,
            confidence=round(random.uniform(0.88, 0.99), 2),
            contributing_features={"vibration": vibration, "temperature": temperature}
        )
        
        now = datetime.utcnow()
        return {
            "prediction_metadata": registry_prediction,
            "asset_id": asset_id,
            "is_anomaly": is_anomaly,
            "anomaly_score": round(anomaly_score, 3),
            "health_score": health_score,
            "condition": "CRITICAL" if health_score < 40 else "WARNING" if health_score < 75 else "GOOD",
            "estimated_rul_days": rul_prediction["estimated_rul_days"],
            "failure_probability_14d": rul_prediction["failure_probability_14d"],
            "flags": ["High vibration detected", "Bearing wear predicted"] if is_anomaly else [],
            "recommended_maintenance": "Replace Main Bearings immediately" if is_anomaly else "Standard Q4 Inspection",
            "last_maintenance": (now - timedelta(days=120)).isoformat(),
            "next_planned_maintenance": (now + timedelta(days=rul_prediction["estimated_rul_days"])).isoformat()
        }
