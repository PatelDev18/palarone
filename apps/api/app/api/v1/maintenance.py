from fastapi import APIRouter
from typing import Dict, Any
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../../services")))
from anomaly.isolation_forest.detector import IsolationForestDetector

router = APIRouter()

@router.get("/assets")
def get_assets() -> Dict[str, Any]:
    """
    Get asset health and RUL prediction (Phase 36).
    Driven by real Isolation Forest and Survival Analysis implementations.
    """
    detector = IsolationForestDetector()
    
    # Simulate telemetry for two generators
    gen1_telemetry = {"vibration": 16.5, "temperature": 85.0, "operating_hours": 9800} # Failing
    gen2_telemetry = {"vibration": 2.1, "temperature": 60.0, "operating_hours": 1200}  # Healthy
    
    gen1_pred = detector.detect("GEN_01", gen1_telemetry)
    gen2_pred = detector.detect("GEN_02", gen2_telemetry)
    
    return {
        "assets": [
            {
                "id": gen1_pred["asset_id"],
                "name": "Generator #1",
                "station": "Davis Station",
                "health_pct": gen1_pred["health_score"],
                "failure_probability_14d": gen1_pred["failure_probability_14d"] * 100,
                "rul_days": gen1_pred["estimated_rul_days"],
                "anomalies": gen1_pred["flags"],
                "recommended_action": gen1_pred["recommended_maintenance"],
                "metadata": gen1_pred["prediction_metadata"]
            },
            {
                "id": gen2_pred["asset_id"],
                "name": "Generator #2",
                "station": "Maitri Station",
                "health_pct": gen2_pred["health_score"],
                "failure_probability_14d": gen2_pred["failure_probability_14d"] * 100,
                "rul_days": gen2_pred["estimated_rul_days"],
                "anomalies": gen2_pred["flags"],
                "recommended_action": gen2_pred["recommended_maintenance"],
                "metadata": gen2_pred["prediction_metadata"]
            }
        ]
    }
