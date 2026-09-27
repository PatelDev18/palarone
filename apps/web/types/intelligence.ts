export type IntelligenceSection = 
  | 'overview'
  | 'satellite'
  | 'earth-observation'
  | 'ice'
  | 'weather'
  | 'vessel'
  | 'risk'
  | 'models'
  | 'model-registry'
  | 'data-quality'
  | 'alerts'
  | 'history';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ProcessingStatus = 'QUEUED' | 'DOWNLOADING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'PARTIAL' | 'STALE';
export type SyncStatus = 'SYNCED' | 'PENDING SYNC' | 'STALE' | 'LOCAL ONLY' | 'CONFLICT';
export type HealthStatus = 'HEALTHY' | 'WARNING' | 'DEGRADED' | 'STALE' | 'OFFLINE' | 'RETRAIN REQUIRED';

export interface KPICard {
  id: string;
  title: string;
  current_value: number | string;
  change: string;
  status: string;
  freshness: string;
  trend: 'UP' | 'DOWN' | 'STABLE';
  accent: 'blue' | 'cyan' | 'amber' | 'red' | 'purple' | 'emerald';
}

export interface PipelineStage {
  step: number;
  name: string;
  label: string;
  status: ProcessingStatus;
  duration_ms: number;
  healthy: boolean;
  details: string;
}

export interface SatelliteScene {
  id: string;
  scene_id: string;
  satellite: string;
  mission: string;
  family: 'SAR' | 'Optical' | 'Meteorological' | 'Oceanographic' | 'Derived';
  sensor: string;
  product_type: string;
  polarization?: string;
  acquisition_time: string;
  processing_time?: string;
  display_time?: string;
  aoi: string;
  resolution: string;
  cloud_cover: number;
  coverage_percentage: number;
  processing_status: ProcessingStatus;
  data_freshness: string;
  download_status: SyncStatus;
  ai_analysis_status: string;
  provider: string;
  bbox: [number, number, number, number];
  footprint_geojson?: any;
  preview_url?: string;
  features_extracted?: string[];
  ai_risk_score?: number;
  affected_vessel?: string;
  recommendation_summary?: string;
  metadata?: {
    solar_zenith_angle?: number;
    solar_azimuth_angle?: number;
    incidence_angle_near?: number;
    incidence_angle_far?: number;
    relative_orbit?: number;
    pass_direction?: string;
    epsg_crs?: string;
    instrument_mode?: string;
    swath_width_km?: number;
    radiometric_calibration?: string;
  };
  detected_features_detail?: Array<{
    type: string;
    confidence: number;
    coords: [number, number];
    keel_depth_m?: number;
    width_m?: number;
    shear_zone?: boolean;
  }>;
}

export interface SatelliteProvider {
  id: string;
  code: string;
  name: string;
  provider_type: 'PUBLIC' | 'COMMERCIAL' | 'INTERGOVERNMENTAL';
  satellite_families: string[];
  api_endpoint: string;
  auth_type: string;
  status: HealthStatus;
  latency_ms: number;
  data_policy: string;
  active_missions: string[];
}

export interface IceRegion {
  region_name: string;
  current_concentration_pct: number;
  previous_observation_pct: number;
  change_pct: number;
  ice_extent_sq_km: number;
  ice_thickness_m: number;
  ice_drift_speed_knots: number;
  ice_drift_direction_deg: number;
  ice_class: string;
  ice_density: string;
  ice_anomaly_sigma: number;
  route_intersection_hazard: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'IMPASSABLE';
  ice_risk_score: number;
  ice_risk_level: RiskLevel;
  last_satellite_observation: string;
  last_satellite_source: string;
  next_expected_observation?: string;
  high_risk_zone_coordinates?: [number, number][];
  affected_vessel?: string;
  notes?: string;
}

export interface WeatherReport {
  location_name: string;
  lat: number;
  lon: number;
  temperature_c: number;
  wind_speed_knots: number;
  wind_direction: string;
  visibility_km: number;
  precipitation: string;
  pressure_hpa: number;
  sea_state: string;
  storm_conditions: string;
  weather_risk_score: number;
  route_weather_impact: string;
  observed_at: string;
  forecast_horizons: Record<string, { wind_knots: number; temp_c: number; risk: string }>;
}

export interface VesselIntelligence {
  id: string;
  name: string;
  callsign: string;
  imo: string;
  mmsi: string;
  vessel_type: string;
  ice_class: string;
  ais_status: HealthStatus;
  current_lat: number;
  current_lon: number;
  heading_deg: number;
  speed_knots: number;
  design_speed_knots: number;
  origin: string;
  destination: string;
  route: string;
  original_eta: string;
  predicted_eta: string;
  predicted_delay_hours: number;
  route_risk_level: RiskLevel;
  route_risk_score: number;
  ai_confidence_pct: number;
  nearby_ice: {
    concentration_pct: number;
    ice_class: string;
    source: string;
    thickness_m: number;
  };
  nearby_weather: {
    wind_speed_knots: number;
    wind_direction: string;
    temp_c: number;
    sea_state: string;
  };
  satellite_observations: {
    last_obs_id: string;
    satellite: string;
    freshness: string;
    detected_feature: string;
  };
  anomaly_indicators: Array<{
    system: string;
    detail: string;
    severity: string;
  }>;
  telemetry_freshness: string;
  sync_state: SyncStatus;
  hitl_status: string;
}

export interface AIModel {
  model_name: string;
  model_id: string;
  model_family: string;
  version: string;
  purpose: string;
  training_dataset: string;
  training_date: string;
  input_features: string[];
  output_schema: string;
  evaluation_metrics: Record<string, any>;
  current_status: 'PRODUCTION' | 'SHADOW' | 'RETRAINING' | 'DEPRECATED';
  last_inference: string;
  drift_status: HealthStatus;
  metrics?: {
    prediction_drift_psi: number;
    feature_drift_ks: number;
    data_drift_score: number;
    model_accuracy: number;
    inference_latency_ms: number;
    failed_predictions_pct: number;
    confidence_distribution: Record<string, number>;
  };
}

export interface AIPrediction {
  prediction_id: string;
  prediction_title: string;
  prediction_value: string;
  model: string;
  model_id: string;
  confidence: number;
  timestamp: string;
  data_freshness: string;
  risk_level: RiskLevel;
  main_drivers: Array<{
    factor: string;
    impact: string;
    percentage: number;
  }>;
  input_data_summary: Record<string, any>;
  explanation: string;
  recommended_investigation: string;
  human_review_status: string;
  advisory_notice: string;
}

export interface RiskCategory {
  category: string;
  level: RiskLevel;
  score: number;
  confidence: number;
  affected_asset: string;
  affected_location: string;
  cause: string;
  potential_impact: string;
  recommended_investigation: string;
  timestamp: string;
  review_status: string;
}

export interface IntelligenceAlert {
  id: string;
  alert_type: string;
  severity: RiskLevel;
  title: string;
  affected_entity: string;
  source_satellite?: string;
  observation_freshness: string;
  risk_level: RiskLevel;
  cause: string;
  recommended_action: string;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED' | 'DISMISSED' | 'ESCALATED' | 'UNDER_REVIEW';
  human_reviewer?: string;
  created_at: string;
}

export interface DataQualitySource {
  source: string;
  status: HealthStatus;
  latency_ms: number;
  freshness: string;
  missing_data_pct: number;
  cloud_contamination: string;
  processing_failures: number;
  quality_notes: string;
}

export interface CoveragePass {
  satellite: string;
  sensor: string;
  aoi: string;
  next_window: string;
  window_duration_min: number;
  priority: string;
  cloud_risk: string;
  coverage_status: string;
  pass_type: string;
  estimated_resolution: string;
}

export interface TimelineStep {
  date: string;
  label: string;
  ice_concentration_davis: number;
  weather_severity: string;
  polar_star_speed: number;
  polar_star_lat: number;
  polar_star_lon: number;
  route_risk_score: number;
  satellite_scenes_count: number;
  critical_alerts: number;
  summary: string;
}

export interface SimulationResult {
  simulation_id: string;
  simulation_name: string;
  affected_vessel: string;
  affected_station: string;
  parameters_tested: {
    ice_concentration_delta_pct: number;
    wind_speed_delta_knots: number;
    engine_derate_pct: number;
  };
  simulated_outcomes: {
    total_delay_hours: number;
    delay_increase_hours: number;
    additional_fuel_consumption_tons: number;
    simulated_risk_level: RiskLevel;
    recommended_mitigation: string;
  };
  cascading_impacts: Array<{
    entity: string;
    impact: string;
  }>;
  disclaimer: string;
  timestamp: string;
}
