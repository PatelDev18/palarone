export type Timeframe = '24H' | '7D' | '30D' | '90D' | 'YTD'

export interface ExecutiveKpi {
  id: string
  title: string
  value: string
  numeric_value: number
  unit: string
  delta_percent: number
  trend: 'up' | 'down' | 'stable'
  status: 'optimal' | 'warning' | 'critical' | 'neutral'
  sparkline: number[]
  description: string
}

export interface VesselPerformanceRecord {
  vessel_id: string
  vessel_name: string
  ice_class: string
  current_speed_knots: number
  optimal_speed_knots: number
  fuel_burn_rate_l_per_nm: number
  voyage_progress_pct: number
  route_efficiency_pct: number
  ice_resistance_factor: number
  active_mission: string
  eta_variance_hours: number
  maintenance_risk: string
  anomaly_count: number
  health_score: number
}

export interface FuelAnalyticsPoint {
  timestamp: string
  actual_burn_litres: number
  predicted_burn_litres: number
  upper_bound: number
  lower_bound: number
  ambient_temp_c: number
  generator_load_pct: number
}

export interface ETAPredictionRecord {
  voyage_id: string
  vessel_name: string
  destination: string
  departure_date: string
  original_planned_eta: string
  provider_eta: string
  ai_predicted_eta: string
  p10_eta: string
  p50_eta: string
  p90_eta: string
  confidence_score: number
  delay_hours: number
  primary_delay_cause: string
  delay_breakdown: Record<string, number>
}

export interface EnvironmentalPoint {
  timestamp: string
  location: string
  temperature_c: number
  wind_speed_knots: number
  ice_thickness_m: number
  sea_ice_concentration_pct: number
  visibility_km: number
  barometric_hpa: number
}

export interface StationMetricRecord {
  station_id: string
  station_name: string
  location: string
  occupancy_current: number
  occupancy_capacity: number
  power_generation_kw: number
  power_demand_kw: number
  thermal_burn_rate_l_day: number
  ambient_temp_c: number
  generator_1_load_pct: number
  generator_2_load_pct: number
  fuel_reserve_days: number
  water_reserve_days: number
  status: string
}

export interface InventoryForecastItem {
  item_id: string
  item_name: string
  category: string
  location: string
  current_stock: number
  unit: string
  daily_burn_rate: number
  days_remaining: number
  predicted_depletion_date: string
  next_resupply_date: string
  shortage_risk: boolean
  confidence_lower_days: number
  confidence_upper_days: number
}

export interface AssetHealthRecord {
  asset_id: string
  asset_name: string
  location: string
  asset_type: string
  health_score: number
  rul_days: number
  failure_probability_30d: number
  survival_probability_60d: number
  active_anomalies: number
  recommended_action: string
  model_used: string
}

export interface SensorAnomalyRecord {
  anomaly_id: string
  timestamp: string
  equipment_id: string
  equipment_name: string
  location: string
  sensor_id: string
  anomaly_type: string
  detection_model: string
  reconstruction_error: number
  z_score: number
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED'
  actionable_remediation: string
}

export interface MLModelPerformanceRecord {
  model_id: string
  name: string
  algorithm: string
  version: string
  task_type: string
  deployment_status: string
  last_trained: string
  dataset_version: string
  metrics: Record<string, number>
  drift_score_psi: number
  drift_status: 'STABLE' | 'MONITOR' | 'DRIFT_DETECTED'
  recommendation: string
}

export interface OperationalRiskCategory {
  id: string
  category: string
  description: string
  probability: number
  impact: number
  risk_score: number
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  mitigation_strategy: string
  trend: string
}

export interface CorrelationPair {
  variable_a: string
  variable_b: string
  pearson_r: number
  causality_type: 'DIRECT_CAUSATION' | 'STRONG_CORRELATION' | 'INDIRECT_EFFECT' | 'SPURIOUS'
  explanation: string
}

export interface ForecastPoint {
  horizon_days: number
  date: string
  metric: string
  value_mean: number
  value_p10: number
  value_p90: number
}

export interface ScenarioSimulationRequest {
  speed_delta_pct: number
  severe_weather_event: boolean
  supply_delay_days: number
  generator_derate: boolean
}

export interface ScenarioSimulationResult {
  scenario_name: string
  simulated_at: string
  fuel_burn_delta_pct: number
  projected_additional_fuel_litres: number
  eta_delay_average_hours: number
  high_risk_stations_count: number
  overall_operational_risk_score: number
  impact_summary: string
  recommendations: string[]
}

export interface DataQualityRecord {
  data_source: string
  completeness_pct: number
  latency_seconds: number
  freshness_status: string
  anomalous_records_count: number
  last_ingestion_timestamp: string
}

export interface NetworkResilienceMetric {
  channel: string
  uptime_pct: number
  current_latency_ms: number
  packet_loss_pct: number
  offline_backlog_kb: number
  status: string
}

export interface AIInsight {
  id: string
  timestamp: string
  category: 'EFFICIENCY' | 'ANOMALY' | 'SAFETY' | 'LOGISTICS' | 'WEATHER'
  severity: 'INFO' | 'WARNING' | 'CRITICAL'
  title: string
  finding: string
  root_cause: string
  recommended_action: string
  confidence: number
  model_source: string
}

export interface AnalyticsBundle {
  kpis: ExecutiveKpi[]
  fleet: VesselPerformanceRecord[]
  fuel: FuelAnalyticsPoint[]
  eta: ETAPredictionRecord[]
  environmental: EnvironmentalPoint[]
  stations: StationMetricRecord[]
  inventory: InventoryForecastItem[]
  assets: AssetHealthRecord[]
  anomalies: SensorAnomalyRecord[]
  models: MLModelPerformanceRecord[]
  risks: OperationalRiskCategory[]
  correlations: CorrelationPair[]
  forecast: ForecastPoint[]
  data_quality: DataQualityRecord[]
  network: NetworkResilienceMetric[]
  insights: AIInsight[]
}
