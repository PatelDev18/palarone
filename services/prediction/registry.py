from typing import Dict, Any, List
from datetime import datetime
import uuid

class MLModelRegistry:
    """
    Phase 34: Production AI/ML Model Registry.
    Tracks deployed models, their versions, and handles prediction metadata formatting.
    """
    
    def __init__(self):
        self._models = [
            {
                "model_id": "XGB_ETA_01",
                "name": "ETA Predictor (XGBoost)",
                "version": "1.3.0",
                "training_timestamp": "2026-09-15T10:00:00Z",
                "dataset_version": "v2.1 (Historical Route + Weather)",
                "features": ["speed", "heading", "wind_knots", "sea_ice_concentration"],
                "evaluation_metrics": {"rmse": 1.2, "mae": 0.8},
                "deployment_status": "ACTIVE"
            },
            {
                "model_id": "IF_ANOMALY_01",
                "name": "Generator Anomaly Detector (Isolation Forest)",
                "version": "2.0.1",
                "training_timestamp": "2026-09-20T08:30:00Z",
                "dataset_version": "v4.0 (Asset Telemetry)",
                "features": ["vibration", "temperature", "rpm", "pressure"],
                "evaluation_metrics": {"f1_score": 0.94, "precision": 0.96},
                "deployment_status": "ACTIVE"
            },
            {
                "model_id": "LGBM_DEMAND_01",
                "name": "Inventory Forecaster (LightGBM)",
                "version": "1.0.5",
                "training_timestamp": "2026-09-22T14:15:00Z",
                "dataset_version": "v1.5 (Station Logistics)",
                "features": ["current_stock", "historical_burn_rate", "station_population", "season"],
                "evaluation_metrics": {"mape": 4.5},
                "deployment_status": "ACTIVE"
            }
        ]

    def list_models(self) -> List[Dict[str, Any]]:
        return self._models
        
    def get_model(self, model_id: str) -> Dict[str, Any]:
        for model in self._models:
            if model["model_id"] == model_id:
                return model
        return None

    def format_prediction(self, model_id: str, entity_id: str, prediction_value: Any, confidence: float, contributing_features: Dict[str, float]) -> Dict[str, Any]:
        """
        Standardizes all ML outputs across the platform.
        """
        model = self.get_model(model_id)
        return {
            "prediction_id": str(uuid.uuid4()),
            "entity_id": entity_id,
            "prediction": prediction_value,
            "confidence": confidence,
            "timestamp": datetime.utcnow().isoformat(),
            "model_id": model_id,
            "model_version": model["version"] if model else "unknown",
            "important_features": contributing_features
        }

# Global registry instance
ml_registry = MLModelRegistry()
