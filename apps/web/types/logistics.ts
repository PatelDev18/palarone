export interface SyncStatus {
  ais: string;
  weather: string;
  satellite: string;
  inventory: string;
  data_mode?: string;
  last_sync_timestamp?: string;
}

export interface KPIs {
  active_vessels: number;
  in_transit: number;
  at_port?: number;
  delayed_vessels?: number;
  cargo_in_transit_tons: number;
  total_cargo_weight_tons?: number;
  delayed_shipments: number;
  critical_inventory_alerts: number;
  active_routes: number;
  eta_next_7_days: number;
  average_fleet_speed_knots?: number;
}

export interface Vessel {
  id: string;
  name: string;
  imo: string;
  status: 'In Transit' | 'At Port' | 'Delayed' | 'Awaiting Departure' | 'Offline / No Signal';
  ship_type: string;
  lat: number;
  lon: number;
  speed_knots: number;
  heading_deg: number;
  destination: string;
  origin: string;
  original_eta: string;
  predicted_eta: string;
  delay_hours: number;
  cargo_load_tons: number;
  fuel_status_pct: number;
  route_risk: 'NORMAL' | 'WATCH' | 'WARNING' | 'CRITICAL';
  last_ais_update: string;
  ais_freshness_seconds: number;
  ice_class: string;
  call_sign: string;
  crew_count: number;
}

export interface CargoItem {
  id: string;
  type: string;
  category: 'Fuel' | 'Food' | 'Medical' | 'Spare Parts' | 'Scientific Equipment' | 'Construction Materials' | 'Emergency Supplies';
  description: string;
  weight_tons: number;
  origin: string;
  destination: string;
  vessel: string;
  departure: string;
  eta: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'PLANNED' | 'LOADING' | 'IN TRANSIT' | 'DELAYED' | 'ARRIVED' | 'DELIVERED';
  flow_stage: string;
  temperature_controlled: boolean;
  hazard_class?: string;
}

export interface StationCoverage {
  fuel_days: number;
  food_days: number;
  medical_days: number;
  spare_parts_days: number;
}

export interface StationSupply {
  id: string;
  name: string;
  lat: number;
  lon: number;
  country: string;
  status: 'NORMAL' | 'WARNING' | 'CRITICAL';
  critical_inventory_stations: boolean;
  next_resupply_deadline: string;
  distance_km: number;
  population: number;
  coverage: StationCoverage;
  status_reason: string;
}

export interface RouteItem {
  route_id: string;
  name: string;
  origin: string;
  destination: string;
  vessel: string;
  distance_km: number;
  original_eta: string;
  predicted_eta: string;
  delay_str: string;
  weather_risk: string;
  ice_risk: string;
  fuel_impact_pct: string;
  overall_operational_risk: 'NORMAL' | 'WATCH' | 'WARNING' | 'CRITICAL';
  status: string;
  recommendation: string;
  prediction_model: string;
  confidence: number;
  factors: string[];
  coordinates: [number, number][];
}

export interface WeatherMetrics {
  temperature_c: number;
  wind_speed_knots: number;
  wind_direction: string;
  visibility_km: number;
  precipitation: string;
  wave_height_m: number;
  sea_surface_temp_c: number;
  storm_status: 'NORMAL' | 'WATCH' | 'WARNING' | 'CRITICAL';
}

export interface WeatherIntelligence {
  source: string;
  observation_timestamp: string;
  region: string;
  metrics: WeatherMetrics;
  status_level: 'NORMAL' | 'WATCH' | 'WARNING' | 'CRITICAL';
  storm_advisory: string;
  operational_impact: string;
}

export interface SeaIceMetrics {
  ice_concentration_pct: number;
  ice_thickness_m: number;
  ice_edge_latitude: number;
  ice_movement_vector: string;
  pressure_ridges: string;
  route_obstruction: string;
  ice_risk: 'NORMAL' | 'WATCH' | 'WARNING' | 'CRITICAL';
}

export interface SeaIceIntelligence {
  source: string;
  observation_timestamp: string;
  metrics: SeaIceMetrics;
  status_level: 'NORMAL' | 'WATCH' | 'WARNING' | 'CRITICAL';
  navigational_recommendation: string;
}

export interface SatelliteObservation {
  id: string;
  satellite: string;
  sensor: string;
  observation_time: string;
  coverage: string;
  data_type: string;
  resolution: string;
  processing_status: 'PROCESSED' | 'PENDING' | 'RAW';
  confidence: number;
  sea_ice_concentration_pct: number;
  iceberg_count?: number;
  cloud_cover_pct?: number;
  notable_features: string;
  thumbnail_url?: string;
}

export interface LogisticsAlert {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  source: string;
  related_object: string;
  description: string;
  recommended_action: string;
  timestamp: string;
  status: 'OPEN' | 'ACKNOWLEDGED' | 'ASSIGNED' | 'RESOLVED';
  assigned_to?: string;
}

export interface LogisticsException {
  id: string;
  type: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  subject: string;
  detail: string;
  status: string;
}

export interface ExceptionsSummary {
  summary: {
    open_exceptions: number;
    critical_exceptions: number;
    resolved_today: number;
  };
  exceptions: LogisticsException[];
}

export interface CargoFlowStep {
  flow_id: string;
  cargo_id: string;
  name: string;
  supplier: string;
  port: string;
  vessel: string;
  transit_status: string;
  destination_station: string;
  inventory_target: string;
  progress_pct: number;
  status: string;
  priority: string;
}

export interface MissionLogistics {
  id: string;
  name: string;
  status: string;
  target_station: string;
  assigned_vessel: string;
  primary_cargo: string;
  route: string;
  deadline: string;
  days_to_deadline: number;
  logistics_dependency: string;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface ApprovalImpact {
  distance_delta?: string;
  fuel_impact?: string;
  eta_gain_hours?: string;
  safety_score?: string;
  stock_buffer_extended?: string;
  operational_risk?: string;
}

export interface ApprovalItem {
  id: string;
  title: string;
  category: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  urgency: string;
  requester: string;
  description: string;
  impact: ApprovalImpact;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'MODIFIED';
  created_at: string;
  resolved_at?: string;
  resolved_by?: string;
  decision_notes?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  object: string;
  previous_value: string;
  new_value: string;
  status: string;
}

export interface MLModelItem {
  id: string;
  name: string;
  purpose: string;
  algorithm: string;
  inputs: string[];
  outputs: string[];
  confidence_avg: number;
  status: string;
}
