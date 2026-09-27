from typing import Dict, Any
from datetime import datetime, timedelta
import random
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../")))
from prediction.registry import ml_registry

class DemandForecaster:
    """
    LightGBM-based Inventory & Shortage Prediction (Phase 37).
    """
    def __init__(self, model_id="LGBM_DEMAND_01"):
        self.model_id = model_id
        
    def predict_shortage(self, station_id: str, item_category: str, current_stock: float, 
                         historical_burn_rate: float, population: int, incoming_eta_days: float) -> Dict[str, Any]:
        
        # Simulated LightGBM inference
        # Base burn rate scaling with population
        predicted_burn_rate = historical_burn_rate * (1.0 + (population * 0.01))
        
        # Add seasonal noise
        seasonal_factor = random.uniform(0.9, 1.2)
        predicted_burn_rate *= seasonal_factor
        
        predicted_days_remaining = current_stock / (predicted_burn_rate if predicted_burn_rate > 0 else 1)
        
        # Calculate risk
        is_shortage = predicted_days_remaining < incoming_eta_days
        shortage_gap_days = incoming_eta_days - predicted_days_remaining if is_shortage else 0
        
        confidence = round(random.uniform(0.85, 0.96), 2)
        
        # Register prediction
        registry_pred = ml_registry.format_prediction(
            model_id=self.model_id,
            entity_id=f"{station_id}_{item_category}",
            prediction_value=predicted_days_remaining,
            confidence=confidence,
            contributing_features={
                "population": round(population * 0.01, 2),
                "seasonality": round(seasonal_factor, 2)
            }
        )
        
        return {
            "prediction_metadata": registry_pred,
            "station_id": station_id,
            "item_category": item_category,
            "current_stock": round(current_stock, 1),
            "predicted_burn_rate": round(predicted_burn_rate, 1),
            "predicted_days_remaining": round(predicted_days_remaining, 1),
            "incoming_eta_days": incoming_eta_days,
            "shortage_risk": "CRITICAL" if is_shortage else "LOW",
            "shortage_gap_days": round(shortage_gap_days, 1),
            "recommended_restock_amount": round(predicted_burn_rate * 30, 0) # Recommend 30-day buffer
        }
