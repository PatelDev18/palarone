from fastapi import APIRouter
from typing import Dict, Any
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../../services")))
from prediction.eta.predictor import ETAPredictor
from prediction.risk.engine import RiskEngine
from anomaly.isolation_forest.detector import IsolationForestDetector

router = APIRouter()

@router.get("/eta/{ship_id}")
def get_eta_prediction(ship_id: str):
    """
    Get ETA prediction for a specific ship (Phase 35).
    """
    predictor = ETAPredictor()
    # Mock current data
    weather = {"wind_speed_knots": 35.0}
    prediction = predictor.predict(
        ship_id=ship_id,
        current_speed=8.1,
        distance_remaining=800.0,
        weather_conditions=weather,
        ice_concentration=45.0,
        provider_eta=None
    )
    
    risk_engine = RiskEngine()
    risk = risk_engine.evaluate_ship_risk(prediction, weather)
    
    return {
        "prediction": prediction,
        "risk_assessment": risk
    }

@router.get("/anomaly/{asset_id}")
def get_asset_anomaly(asset_id: str):
    """
    Run IoT anomaly detection on an asset.
    """
    detector = IsolationForestDetector()
    telemetry = {"vibration": 15.2, "temperature": 85.0}
    result = detector.detect(asset_id, telemetry)
    return result
