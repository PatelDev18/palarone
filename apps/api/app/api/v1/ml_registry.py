from fastapi import APIRouter
from typing import Dict, Any
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../../services")))
from prediction.registry import ml_registry

router = APIRouter()

@router.get("/models")
def get_ml_models() -> Dict[str, Any]:
    """
    Get all registered ML models in production (Phase 34).
    """
    return {"models": ml_registry.list_models()}

@router.post("/predict/eta")
def predict_eta(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Simulates XGBoost ETA prediction hitting the registry standard.
    """
    ship_id = payload.get("ship_id", "Unknown")
    # In a real pipeline, we would load the XGBoost booster and call .predict(features)
    # Here we format a synthetic prediction using the strict Phase 34 standard.
    prediction = ml_registry.format_prediction(
        model_id="XGB_ETA_01",
        entity_id=ship_id,
        prediction_value="+14.5 hours",
        confidence=0.88,
        contributing_features={"sea_ice_concentration": 0.45, "wind_knots": 0.35, "speed": 0.20}
    )
    return prediction
