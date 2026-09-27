export type UserRole = 'Commander' | 'Operations Officer' | 'Logistics Officer' | 'Safety Officer' | 'Administrator';

export type OperationalStatusColor = 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED' | 'GRAY';

export type TelemetryFreshness = 'FRESH' | 'STALE' | 'OFFLINE' | 'UNKNOWN';

export interface ContributingFactor {
  factor?: string;
  name?: string;
  impact_hours?: number;
  impact?: string;
  percentage?: number;
  shap_weight?: number;
}

export interface WeatherAtPos {
  temperature_c: number;
  wind_speed_knots: number;
  wind_direction: string;
  visibility_km: number;
  wave_height_m: number;
  sea_state: string;
  barometric_pressure_hpa: number;
}

export interface CoordinatesTrail {
  previous: [number, number][];
  current: [number, number];
  planned_route: [number, number][];
  predicted_alternate_route: [number, number][];
}

export interface Vessel {
  id: string;
  name: string;
  imo: string;
  mmsi: string;
  callsign: string;
  vessel_type: string;
  ice_class: string;
  flag: string;
  length_m: number;
  beam_m: number;
  displacement_tons: number;
  current_lat: number;
  current_lon: number;
  speed_knots: number;
  design_speed_knots: number;
  heading_degrees: number;
  destination: string;
  origin: string;
  status: 'NORMAL' | 'ATTENTION' | 'DELAYED' | 'CRITICAL' | 'AT_PORT' | 'STALE';
  status_color: OperationalStatusColor;
  operational_state: string;
  original_eta: string;
  provider_eta: string;
  ai_predicted_eta: string;
  expected_delay_hours: number;
  delay_reason: string;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  risk_trend: 'Improving' | 'Stable' | 'Worsening';
  risk_confidence: number;
  prediction_timestamp: string;
  model_version: string;
  telemetry_freshness: TelemetryFreshness;
  last_position_update: string;
  fuel_remaining_pct: number;
  crew_complement: number;
  cargo_summary: string;
  factors: ContributingFactor[];
  weather_at_pos: WeatherAtPos;
  coordinates_trail: CoordinatesTrail;
}

export interface StationWeather {
  temperature_c: number;
  wind_speed_knots: number;
  wind_direction: string;
  visibility_km: number;
  pressure_hpa: number;
  blizzard_active: boolean;
}

export interface Station {
  id: string;
  name: string;
  country: string;
  operator: string;
  lat: number;
  lon: number;
  elevation_m: number;
  population: number;
  max_capacity: number;
  connectivity: 'ONLINE' | 'DEGRADED' | 'STALE' | 'OFFLINE';
  connectivity_color: OperationalStatusColor;
  comms_method: string;
  last_contact: string;
  telemetry_age: string;
  power_status: string;
  fuel_days_remaining: number;
  critical_inventory_pct: number;
  life_support_pct: number;
  emergency_state: string;
  current_weather: StationWeather;
}

export interface BlizzardZone {
  zone_id: string;
  region: string;
  severity: 'MEDIUM' | 'HIGH' | 'CRITICAL';
  winds_knots: number;
  visibility_km: number;
  temperature_c: number;
  polygon: [number, number][];
}

export interface ObservationPoint {
  lat: number;
  lon: number;
  temp: number;
  wind_kt: number;
  wind_deg: number;
  wave_m: number;
  desc: string;
}

export interface WeatherIntelligence {
  forecast_horizon: string;
  horizons_supported: string[];
  model_source: string;
  last_ingested: string;
  data_freshness: TelemetryFreshness;
  active_blizzard_zones: BlizzardZone[];
  observation_points: ObservationPoint[];
}

export interface IceHazardZone {
  zone_id: string;
  name: string;
  severity: 'MEDIUM' | 'HIGH' | 'CRITICAL';
  concentration_pct: number;
  ice_thickness_m: number;
  drift_vector: string;
  risk_to_vessels: string;
  coordinates: [number, number][];
}

export interface IcebergItem {
  id: string;
  type: string;
  area_sqkm: number;
  lat: number;
  lon: number;
  drift: string;
}

export interface SeaIceIntelligence {
  source: string;
  last_observation: string;
  data_freshness: TelemetryFreshness;
  ice_edge_latitude_range: string;
  hazard_zones: IceHazardZone[];
  iceberg_tracking: IcebergItem[];
}

export interface SatelliteObservation {
  observation_id: string;
  satellite_name: string;
  sensor_type: string;
  capture_timestamp: string;
  coverage_area: string;
  resolution: string;
  data_freshness: string;
  lead_features_detected: string;
  swath_polygon: [number, number][];
}

export interface RouteItem {
  route_id: string;
  name: string;
  assigned_vessel: string;
  status: string;
  planned_distance_nm: number;
  remaining_distance_nm: number;
  current_eta: string;
  recommended_alternate: string | null;
  risk_rating: string;
}

export interface MissionItem {
  mission_id: string;
  title: string;
  destination: string;
  commander: string;
  status: string;
  progress_pct: number;
  risk: string;
  eta: string;
  assigned_ships: string[];
  critical_supplies: string;
}

export interface FleetETAPrediction {
  entity_id: string;
  entity_name: string;
  target: string;
  predicted_eta: string;
  confidence: number;
  expected_delay_hours: number;
  model: string;
  model_framework: string;
  top_contributing_factors: {
    factor: string;
    impact: string;
    shap_weight: number;
  }[];
}

export interface RiskPredictionItem {
  prediction_type: string;
  horizon: string;
  model: string;
  overall_level: string;
  key_risk_zone?: string;
  confidence: number;
}

export interface PredictionsData {
  ml_stack_frameworks: string[];
  fleet_eta_predictions: FleetETAPrediction[];
  risk_predictions: RiskPredictionItem[];
}

export interface AlertItem {
  alert_id: string;
  timestamp: string;
  location: string;
  entity_id: string;
  entity_name: string;
  entity_type: 'VESSEL' | 'STATION' | 'WEATHER' | 'CARGO';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL';
  title: string;
  description: string;
  source: string;
  recommended_action: string;
  status: 'NEW' | 'ACKNOWLEDGED' | 'INVESTIGATING' | 'RESOLVED';
  human_decision_required: boolean;
  freshness: TelemetryFreshness;
  acknowledged_by?: string;
  acknowledged_at?: string;
}

export interface EventTimelineItem {
  event_id: string;
  timestamp: string;
  time_display: string;
  category: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  description: string;
  entity: string;
  source: string;
}

export interface DataFeedHealth {
  feed_name: string;
  source: string;
  status: TelemetryFreshness;
  last_updated: string;
  data_age: string;
  latency_ms: number;
  quality: string;
  warning: string | null;
}

export interface DataHealthSummary {
  summary: {
    overall_health: string;
    healthy_feeds: number;
    stale_feeds: number;
    offline_feeds: number;
    total_feeds: number;
    data_integrity_score: string;
  };
  feeds: DataFeedHealth[];
}

export interface RecommendationItem {
  recommendation_id: string;
  vessel_id?: string;
  vessel_name?: string;
  station_id?: string;
  station_name?: string;
  severity: 'HIGH' | 'MEDIUM' | 'CRITICAL';
  title: string;
  reason: string;
  confidence: number;
  model_id: string;
  model_name: string;
  contributing_factors: ContributingFactor[];
  evidence: Record<string, any>;
  suggested_action: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  created_at: string;
  approved_by: string | null;
  approved_at: string | null;
  approval_notes: string | null;
}

export interface AuditLogItem {
  audit_id: string;
  timestamp: string;
  actor: string;
  actor_role: string;
  action: string;
  target_entity: string;
  details: string;
  status: string;
}

export interface CommandKPIs {
  active_ships: {
    total: number;
    in_transit: number;
    at_port: number;
    stale_offline: number;
    label: string;
    freshness: TelemetryFreshness;
  };
  cargo_in_transit: {
    tonnage: string;
    containers_teu: number;
    percentage_change: string;
    data_freshness: TelemetryFreshness;
    critical_manifests: number;
  };
  active_delays: {
    delayed_count: number;
    highest_delay: string;
    affected_vessel: string;
    label: string;
  };
  critical_incidents: {
    count: number;
    emergency_state: string;
    label: string;
  };
  operational_risk: {
    overall_risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    confidence: string;
    high_risk_areas: string;
    risk_trend: 'Improving' | 'Stable' | 'Worsening';
  };
  data_health: {
    healthy_feeds: number;
    stale_feeds: number;
    offline_feeds: number;
    status: string;
    label: string;
  };
}

export interface CommandCenterOverview {
  system_time: string;
  operational_mode: string;
  active_scenario: string;
  scenario_name: string;
  kpis: CommandKPIs;
  vessels: Vessel[];
  stations: Station[];
  weather: WeatherIntelligence;
  sea_ice: SeaIceIntelligence;
  satellites: {
    disclaimer: string;
    active_footprints: SatelliteObservation[];
  };
  routes: RouteItem[];
  missions: MissionItem[];
  alerts: AlertItem[];
  recommendations: RecommendationItem[];
  events: EventTimelineItem[];
  predictions: PredictionsData;
  data_health: DataHealthSummary;
  audit_log: AuditLogItem[];
}

export type TimeHorizon = 'Live' | '1 hour' | '6 hours' | '24 hours' | '7 days';

export type RegionFilter = 'All Antarctica' | 'Weddell Sea' | 'Ross Sea' | 'Antarctic Peninsula' | 'Indian Ocean Sector' | 'Custom';

export interface LayerConfig {
  vessels: boolean;
  stations: boolean;
  routes: boolean;
  seaIce: boolean;
  weather: boolean;
  satellite: boolean;
  sar: boolean;
  riskZones: boolean;
}
