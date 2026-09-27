from fastapi import APIRouter, Query, HTTPException
from typing import List, Dict, Any, Optional
from app.models.analytics import (
    ExecutiveKpi,
    VesselPerformanceRecord,
    FuelAnalyticsPoint,
    ETAPredictionRecord,
    EnvironmentalPoint,
    StationMetricRecord,
    InventoryForecastItem,
    AssetHealthRecord,
    SensorAnomalyRecord,
    MLModelPerformanceRecord,
    OperationalRiskCategory,
    CorrelationPair,
    ForecastPoint,
    ScenarioSimulationRequest,
    ScenarioSimulationResult,
    DataQualityRecord,
    NetworkResilienceMetric,
    AIInsight,
)
from app.services.analytics_service import analytics_service

router = APIRouter()

@router.get("/overview", response_model=List[ExecutiveKpi])
def get_executive_kpis(timeframe: str = Query("7D", pattern="^(24H|7D|30D|90D|YTD)$")):
    """
    Get 8 executive KPI metrics with sparklines and delta percentages.
    """
    return analytics_service.get_executive_kpis(timeframe=timeframe)

@router.get("/fleet", response_model=List[VesselPerformanceRecord])
def get_fleet_performance():
    """
    Get fleet operational telemetry and vessel comparison data.
    """
    return analytics_service.get_fleet_performance()

@router.get("/fuel", response_model=List[FuelAnalyticsPoint])
def get_fuel_analytics():
    """
    Get 14-day fuel consumption actuals, predictions, and confidence bounds.
    """
    return analytics_service.get_fuel_analytics()

@router.get("/eta", response_model=List[ETAPredictionRecord])
def get_eta_predictions():
    """
    Get voyage ETA intelligence comparing Planned, Provider, and AI Predicted ETA.
    """
    return analytics_service.get_eta_predictions()

@router.get("/environmental", response_model=List[EnvironmentalPoint])
def get_environmental_telemetry():
    """
    Get environmental, atmospheric, and sea ice condition trends.
    """
    return analytics_service.get_environmental_telemetry()

@router.get("/stations", response_model=List[StationMetricRecord])
def get_station_metrics():
    """
    Get performance, energy, and reserve metrics for Bharati, Maitri, Himadri, and Davis.
    """
    return analytics_service.get_station_metrics()

@router.get("/inventory", response_model=List[InventoryForecastItem])
def get_inventory_forecast():
    """
    Get inventory trajectories and shortage alerts where depletion < resupply.
    """
    return analytics_service.get_inventory_forecast()

@router.get("/assets", response_model=List[AssetHealthRecord])
def get_asset_health():
    """
    Get critical machinery health, Remaining Useful Life (RUL), and degradation status.
    """
    return analytics_service.get_asset_health()

@router.get("/anomalies", response_model=List[SensorAnomalyRecord])
def get_sensor_anomalies():
    """
    Get multivariate sensor anomalies detected by Isolation Forest and Autoencoder.
    """
    return analytics_service.get_sensor_anomalies()

@router.get("/models", response_model=List[MLModelPerformanceRecord])
def get_ml_models_performance():
    """
    Get ML registry and performance metrics (strictly XGBoost, LightGBM, Isolation Forest, Autoencoder, Survival Analysis).
    """
    return analytics_service.get_ml_models_performance()

@router.get("/risks", response_model=List[OperationalRiskCategory])
def get_operational_risks():
    """
    Get 10 operational polar risks mapped onto a 5x5 Probability x Impact matrix.
    """
    return analytics_service.get_operational_risks()

@router.get("/correlations", response_model=List[CorrelationPair])
def get_correlations():
    """
    Get operational correlations with explicit causation distinction.
    """
    return analytics_service.get_correlations()

@router.get("/forecast", response_model=List[ForecastPoint])
def get_forecast_center():
    """
    Get multi-horizon projections (7d, 14d, 30d, 90d) with confidence intervals.
    """
    return analytics_service.get_forecast_center()

@router.post("/scenarios", response_model=ScenarioSimulationResult)
def simulate_scenario(payload: ScenarioSimulationRequest):
    """
    Simulate what-if operational operational scenarios without real execution.
    """
    return analytics_service.simulate_what_if_scenario(payload)

@router.get("/data-quality", response_model=List[DataQualityRecord])
def get_data_quality():
    """
    Get data pipeline completeness and telemetry freshness scores.
    """
    return analytics_service.get_data_quality()

@router.get("/network", response_model=List[NetworkResilienceMetric])
def get_network_resilience():
    """
    Get communications channel uptime, latency, and offline backlog.
    """
    return analytics_service.get_network_resilience()

@router.get("/insights", response_model=List[AIInsight])
def get_ai_insights():
    """
    Get grounded AI operational insights with causal explanations.
    """
    return analytics_service.get_ai_insights()

@router.get("/all")
def get_all_analytics(timeframe: str = Query("7D")):
    """
    Returns an aggregated bundle of all analytics subsystems for instantaneous client hydration.
    """
    return {
        "kpis": analytics_service.get_executive_kpis(timeframe),
        "fleet": analytics_service.get_fleet_performance(),
        "fuel": analytics_service.get_fuel_analytics(),
        "eta": analytics_service.get_eta_predictions(),
        "environmental": analytics_service.get_environmental_telemetry(),
        "stations": analytics_service.get_station_metrics(),
        "inventory": analytics_service.get_inventory_forecast(),
        "assets": analytics_service.get_asset_health(),
        "anomalies": analytics_service.get_sensor_anomalies(),
        "models": analytics_service.get_ml_models_performance(),
        "risks": analytics_service.get_operational_risks(),
        "correlations": analytics_service.get_correlations(),
        "forecast": analytics_service.get_forecast_center(),
        "data_quality": analytics_service.get_data_quality(),
        "network": analytics_service.get_network_resilience(),
        "insights": analytics_service.get_ai_insights(),
    }
