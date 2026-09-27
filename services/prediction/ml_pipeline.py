import os
import joblib
import numpy as np
from sklearn.ensemble import IsolationForest
import xgboost as xgb
import lightgbm as lgb

class ProductionMLPipeline:
    """
    Production ML Training & Inference Pipeline (Phase 48).
    Supports XGBoost, LightGBM, and Isolation Forest.
    NOTE: Random Forest is strictly prohibited per requirements.
    """
    def __init__(self, model_dir="model_artifacts"):
        self.model_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), model_dir))
        os.makedirs(self.model_dir, exist_ok=True)
        
    def train_isolation_forest(self, telemetry_data: np.ndarray, version: str = "v1") -> str:
        clf = IsolationForest(contamination=0.05, random_state=42)
        clf.fit(telemetry_data)
        path = os.path.join(self.model_dir, f"iso_forest_{version}.joblib")
        joblib.dump(clf, path)
        return path
        
    def train_xgboost_eta(self, features: np.ndarray, labels: np.ndarray, version: str = "v1") -> str:
        model = xgb.XGBRegressor(n_estimators=100, max_depth=5, learning_rate=0.1)
        model.fit(features, labels)
        path = os.path.join(self.model_dir, f"xgb_eta_{version}.json")
        model.save_model(path)
        return path
        
    def load_and_predict_iso(self, features: np.ndarray, version: str = "v1") -> np.ndarray:
        path = os.path.join(self.model_dir, f"iso_forest_{version}.joblib")
        if os.path.exists(path):
            clf = joblib.load(path)
            return clf.predict(features)
        return np.array([-1] * len(features)) # Fallback if model not trained
