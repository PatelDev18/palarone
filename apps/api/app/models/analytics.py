from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class SparklinePoint(BaseModel):
    timestamp: str
    value: float

class ExecutiveKpi(BaseModel):
    id: str
    title: str
    value: str
    numeric_value: float
    unit: str
    delta_percent: float
    trend: str  # "up", "down", "stable"
    status: str  # "optimal", "warning", "critical", "neutral"
    sparkline: List[float]
    description: str

class VesselPerformanceRecord(BaseModel):
    vessel_id: str
    vessel_name: str
    ice_class: str
    current_speed_knots: float
    optimal_speed_knots: float
    fuel_burn_rate_l_per_nm: float
    voyage_progress_pct: float
    route_efficiency_pct: float
    ice_resistance_factor: float
    active_mission: str
    eta_variance_hours: float
    maintenance_risk: str
    anomaly_count: int
    health_score: float

class FuelAnalyticsPoint(BaseModel):
    timestamp: str
    actual_burn_litres: float
    predicted_burn_litres: float
    upper_bound: float
    lower_bound: float
    ambient_temp_c: float
    generator_load_pct: float

class ETAPredictionRecord(BaseModel):
    voyage_id: str
    vessel_name: str
    destination: str
    departure_date: str
    original_planned_eta: str
    provider_eta: str
    ai_predicted_eta: str
    p10_eta: str
    p50_eta: str
    p90_eta: str
    confidence_score: float
    delay_hours: float
    primary_delay_cause: str
    delay_breakdown: Dict[str, float]  # e.g. {"ice_pack": 4.2, "blizzard_wind": 2.1, "mechanical_derate": 0.0}

class EnvironmentalPoint(BaseModel):
    timestamp: str
    location: str
    temperature_c: float
    wind_speed_knots: float
    ice_thickness_m: float
    sea_ice_concentration_pct: float
    visibility_km: float
    barometric_hpa: float

class StationMetricRecord(BaseModel):
    station_id: str
    station_name: str
    location: str
    occupancy_current: int
    occupancy_capacity: int
    power_generation_kw: float
    power_demand_kw: float
    thermal_burn_rate_l_day: float
    ambient_temp_c: float
    generator_1_load_pct: float
    generator_2_load_pct: float
    fuel_reserve_days: float
    water_reserve_days: float
    status: str

class InventoryForecastItem(BaseModel):
    item_id: str
    item_name: str
    category: str
    location: str
    current_stock: float
    unit: str
    daily_burn_rate: float
    days_remaining: float
    predicted_depletion_date: str
    next_resupply_date: str
    shortage_risk: bool  # True if depletion < resupply
    confidence_lower_days: float
    confidence_upper_days: float

class AssetHealthRecord(BaseModel):
    asset_id: str
    asset_name: str
    location: str
    asset_type: str
    health_score: float
    rul_days: float  # Remaining Useful Life
    failure_probability_30d: float
    survival_probability_60d: float
    active_anomalies: int
    recommended_action: str
    model_used: str  # e.g. "Weibull Survival Analysis"

class SensorAnomalyRecord(BaseModel):
    anomaly_id: str
    timestamp: str
    equipment_id: str
    equipment_name: str
    location: str
    sensor_id: str
    anomaly_type: str
    detection_model: str  # "Isolation Forest" or "Autoencoder"
    reconstruction_error: float
    z_score: float
    severity: str  # "LOW", "MEDIUM", "HIGH", "CRITICAL"
    status: str  # "OPEN", "INVESTIGATING", "RESOLVED"
    actionable_remediation: str

class MLModelPerformanceRecord(BaseModel):
    model_id: str
    name: str
    algorithm: str  # "XGBoost", "LightGBM", "Isolation Forest", "Autoencoder", "Survival Analysis"
    version: str
    task_type: str  # "REGRESSION", "CLASSIFICATION", "ANOMALY_DETECTION", "TIME_SERIES"
    deployment_status: str
    last_trained: str
    dataset_version: str
    metrics: Dict[str, float]  # mae, rmse, r2, f1, precision, recall, auc
    drift_score_psi: float
    drift_status: str  # "STABLE", "MONITOR", "DRIFT_DETECTED"
    recommendation: str

class OperationalRiskCategory(BaseModel):
    id: str
    category: str
    description: str
    probability: int  # 1 to 5
    impact: int  # 1 to 5
    risk_score: int  # probability * impact
    risk_level: str  # "LOW", "MEDIUM", "HIGH", "CRITICAL"
    mitigation_strategy: str
    trend: str

class CorrelationPair(BaseModel):
    variable_a: str
    variable_b: str
    pearson_r: float
    causality_type: str  # "DIRECT_CAUSATION", "STRONG_CORRELATION", "INDIRECT_EFFECT", "SPURIOUS"
    explanation: str

class ForecastPoint(BaseModel):
    horizon_days: int
    date: str
    metric: str
    value_mean: float
    value_p10: float
    value_p90: float

class ScenarioSimulationRequest(BaseModel):
    speed_delta_pct: float = Field(default=0.0, description="Speed delta percentage, e.g. -15.0")
    severe_weather_event: bool = Field(default=False, description="Simulate blizzard / severe ice pack")
    supply_delay_days: int = Field(default=0, description="Delay in next scheduled resupply voyage")
    generator_derate: bool = Field(default=False, description="Simulate primary generator derate")

class ScenarioSimulationResult(BaseModel):
    scenario_name: str
    simulated_at: str
    fuel_burn_delta_pct: float
    projected_additional_fuel_litres: float
    eta_delay_average_hours: float
    high_risk_stations_count: int
    overall_operational_risk_score: float
    impact_summary: str
    recommendations: List[str]

class DataQualityRecord(BaseModel):
    data_source: str
    completeness_pct: float
    latency_seconds: float
    freshness_status: str
    anomalous_records_count: int
    last_ingestion_timestamp: str

class NetworkResilienceMetric(BaseModel):
    channel: str  # "Iridium-Certus", "Starlink-Maritime", "HF-Radio", "Inmarsat-C"
    uptime_pct: float
    current_latency_ms: float
    packet_loss_pct: float
    offline_backlog_kb: int
    status: str

class AIInsight(BaseModel):
    id: str
    timestamp: str
    category: str  # "EFFICIENCY", "ANOMALY", "SAFETY", "LOGISTICS", "WEATHER"
    severity: str  # "INFO", "WARNING", "CRITICAL"
    title: str
    finding: str
    root_cause: str
    recommended_action: str
    confidence: float
    model_source: str
