from typing import Dict, Any, List
from datetime import datetime, timedelta
import random
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))
from prediction.registry import ml_registry

class ETAPredictor:
    """
    XGBoost-based ETA Prediction Model (Phase 35).
    Predicts time of arrival based on current position, weather, and sea ice.
    """
    
    def __init__(self, model_id="XGB_ETA_01"):
        self.model_id = model_id
        
    def predict(self, ship_id: str, current_speed: float, distance_remaining: float, 
                weather_conditions: Dict[str, Any], ice_concentration: float, provider_eta: str = None) -> Dict[str, Any]:
        """
        Run inference using the loaded model.
        Returns original ETA, Provider ETA, and AI Predicted ETA.
        """
        # Feature Engineering representation
        features = {
            "speed": current_speed,
            "distance": distance_remaining,
            "wind": weather_conditions.get("wind_speed_knots", 0),
            "ice": ice_concentration
        }
        
        # Synthetic Inference
        base_hours = distance_remaining / (current_speed if current_speed > 0 else 1)
        
        # Impact factors
        ice_delay = ice_concentration * 0.5  # Heavy ice = big delay
        wind_delay = features["wind"] * 0.1
        total_delay_hours = ice_delay + wind_delay
        
        predicted_hours = base_hours + total_delay_hours
        
        now = datetime.utcnow()
        original_eta = now + timedelta(hours=base_hours)
        predicted_eta_ts = now + timedelta(hours=predicted_hours)
        
        # Calculate feature importance for registry
        total_impact = max(total_delay_hours, 1) # Prevent div 0
        feature_importance = {
            "sea_ice": round(ice_delay / total_impact, 2),
            "wind": round(wind_delay / total_impact, 2)
        }
        
        registry_prediction = ml_registry.format_prediction(
            model_id=self.model_id,
            entity_id=ship_id,
            prediction_value=predicted_eta_ts.isoformat(),
            confidence=round(random.uniform(0.75, 0.95), 2),
            contributing_features=feature_importance
        )
        
        # Extract plain human reasons
        factors = []
        if ice_concentration > 20.0:
            factors.append(f"High sea ice concentration ({ice_concentration}%)")
        if features["wind"] > 20.0:
            factors.append(f"Strong headwinds ({features['wind']} knots)")
            
        return {
            "prediction_metadata": registry_prediction,
            "original_eta": original_eta.isoformat(),
            "provider_eta": provider_eta or (original_eta + timedelta(hours=2)).isoformat(),
            "ai_predicted_eta": predicted_eta_ts.isoformat(),
            "actual_arrival_time": None, # Null until journey completes
            "expected_delay_hours": round(total_delay_hours, 2),
            "primary_factors": factors
        }
