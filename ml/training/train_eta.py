import os
import pandas as pd
import numpy as np
import xgboost as xgb
import joblib
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error
from loguru import logger

# Phase 8: AI/ML Data Pipeline & Predictive ML (XGBoost)
# The ETA model is the core predictive engine for Logistics

def train_eta_model():
    logger.info("Starting Phase 8: XGBoost ETA Model Training Pipeline")
    
    # Simulate loading historical voyage data (Feature Store)
    # Features: distance_nm, historical_speed_knots, wind_speed_knots, ice_concentration_pct, wave_height_m
    # Target: actual_voyage_hours
    
    np.random.seed(42)
    n_samples = 5000
    
    logger.info("Generating synthetic historical polar voyage dataset...")
    distance_nm = np.random.uniform(500, 3000, n_samples)
    historical_speed = np.random.uniform(8, 15, n_samples)
    wind_speed = np.random.uniform(0, 60, n_samples)
    ice_pct = np.random.uniform(0, 100, n_samples)
    wave_height = np.random.uniform(0, 8, n_samples)
    
    # Calculate base time
    base_hours = distance_nm / historical_speed
    
    # Apply environmental penalties (Real-world physics abstraction)
    wind_penalty = np.where(wind_speed > 30, (wind_speed - 30) * 0.5, 0)
    ice_penalty = np.where(ice_pct > 20, (ice_pct - 20) * 0.8, 0)
    wave_penalty = wave_height * 1.2
    
    # Final target variable
    actual_hours = base_hours + wind_penalty + ice_penalty + wave_penalty + np.random.normal(0, 2, n_samples)
    
    df = pd.DataFrame({
        'distance_nm': distance_nm,
        'historical_speed': historical_speed,
        'wind_speed': wind_speed,
        'ice_pct': ice_pct,
        'wave_height': wave_height,
        'actual_hours': actual_hours
    })
    
    X = df.drop('actual_hours', axis=1)
    y = df['actual_hours']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    logger.info("Training XGBoost Regressor (v1.3)...")
    # Using specific hyperparameters tailored for this problem
    model = xgb.XGBRegressor(
        objective='reg:squarederror',
        n_estimators=200,
        learning_rate=0.05,
        max_depth=5,
        subsample=0.8,
        colsample_bytree=0.8
    )
    
    model.fit(X_train, y_train)
    
    logger.info("Evaluating model metrics...")
    predictions = model.predict(X_test)
    mae = mean_absolute_error(y_test, predictions)
    rmse = np.sqrt(mean_squared_error(y_test, predictions))
    
    logger.info(f"Model Evaluation -> MAE: {mae:.2f} hours, RMSE: {rmse:.2f} hours")
    
    # Save the model
    os.makedirs("ml/models_bin", exist_ok=True)
    model_path = "ml/models_bin/xgboost_eta_v1_3.joblib"
    joblib.dump(model, model_path)
    logger.info(f"Model successfully saved to {model_path}")
    
    return model

if __name__ == "__main__":
    train_eta_model()
