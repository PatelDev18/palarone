export type ExpeditionStatus =
  | 'DRAFT'
  | 'PLANNING'
  | 'READY FOR APPROVAL'
  | 'APPROVED'
  | 'PRE-DEPARTURE'
  | 'IN TRANSIT'
  | 'OPERATIONAL'
  | 'PARTIALLY BLOCKED'
  | 'BLOCKED'
  | 'SUSPENDED'
  | 'RETURNING'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'ARCHIVED';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface PersonnelRosterMember {
  name: string;
  role: string;
  team: string;
  cert: string;
  location: string;
  medical: 'FIT_FOR_DUTY' | 'CONDITIONAL' | 'RESTRICTED';
  shift: string;
  deployed: boolean;
  emergency_contact?: string;
}

export interface PersonnelRoleBreakdown {
  role: string;
  assigned: number;
  required: number;
}

export interface ExpeditionPersonnelData {
  planned: number;
  assigned: number;
  deployed: number;
  available: number;
  missing: number;
  breakdown: PersonnelRoleBreakdown[];
  roster: PersonnelRosterMember[];
}

export interface WeatherHorizonForecast {
  temp: number;
  wind: number;
  vis: number;
  status: 'Optimal' | 'Normal' | 'Caution' | 'Warning' | 'Severe' | 'Critical';
}

export interface ExpeditionWeatherData {
  station_id?: string;
  condition: string;
  temperature_c: number;
  wind_speed_kt: number;
  wind_direction: string;
  wind_gust_kt?: number;
  visibility_km: number;
  pressure_hpa: number;
  snowfall_rate?: string;
  storm_warning: boolean;
  warning_title?: string;
  warning_impact?: string;
  forecast_confidence: number;
  provider: string;
  data_age_min: number;
  forecast_horizons: {
    current?: WeatherHorizonForecast;
    '6_hour'?: WeatherHorizonForecast;
    '24_hour'?: WeatherHorizonForecast;
    '3_day'?: WeatherHorizonForecast;
    '7_day'?: WeatherHorizonForecast;
  };
}

export interface ExpeditionSeaIceData {
  source: string;
  observation_time: string;
  data_age_hours: number;
  confidence: number;
  concentration_pct: number;
  ice_class: string;
  ice_thickness_m: number;
  drift_speed_kt?: number;
  drift_direction?: string;
  operational_impact: string;
  compression_risk?: 'LOW' | 'MEDIUM' | 'HIGH';
  ice_edge_distance_km?: number;
}

export interface ExpeditionSatelliteData {
  source: string;
  scene_id?: string;
  observation_time: string;
  footprint?: string;
  resolution_m?: number;
  data_freshness: string;
  satellite_type: 'SAR_IMAGERY' | 'OPTICAL_IMAGERY' | 'LASER_ALTIMETRY' | 'MULTI_SPECTRAL_SAR';
  cloud_cover_pct?: number;
  interpretation?: string;
}

export interface CargoItem {
  category: string;
  name: string;
  required: number;
  loaded: number;
  consumed: number;
  remaining: number;
  unit: string;
  reserve_pct: number;
}

export interface ExpeditionLogisticsData {
  cargo_readiness: number;
  fuel_readiness: number;
  supply_readiness: number;
  fuel_consumption_pct?: number;
  fuel_projected_remaining_pct: number;
  fuel_reserve_warning: boolean;
  items: CargoItem[];
}

export interface RiskCategory {
  category: string;
  score: number;
  level: RiskLevel;
  weight: number;
  why: string;
}

export interface ExpeditionRiskEngineData {
  overall_score: number;
  overall_level: RiskLevel;
  model_id: string;
  confidence: number;
  timestamp?: string;
  main_contributor: string;
  categories: RiskCategory[];
}

export interface ExpeditionObjective {
  id: string;
  title: string;
  is_primary: boolean;
  priority: 'HIGH' | 'MEDIUM' | 'LOW' | 'CRITICAL';
  owner: string;
  deadline: string;
  status: 'PLANNED' | 'IN PROGRESS' | 'COMPLETED' | 'BLOCKED';
  success_criteria: string;
}

export interface ExpeditionWaypoint {
  order: number;
  name: string;
  lat: number;
  lon: number;
  passed: boolean;
  eta: string;
  ice_risk: string;
  weather_risk?: string;
}

export interface ExpeditionTask {
  id: string;
  title: string;
  team: string;
  owner: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'TODO' | 'IN PROGRESS' | 'BLOCKED' | 'COMPLETED' | 'CANCELLED';
  due_date: string;
  dependency?: string | null;
  location?: string;
  description?: string;
}

export interface ExpeditionTimelinePhase {
  phase: string;
  start: string;
  end: string;
  status: 'COMPLETED' | 'IN PROGRESS' | 'PLANNED' | 'BLOCKED';
  progress: number;
}

export interface ExpeditionContingencyPlan {
  plan: string;
  title: string;
  trigger: string;
  action: string;
  responsible: string;
  resources: string;
  expected_impact: string;
  approval_required: string;
}

export interface ExpeditionIncident {
  id: string;
  time: string;
  title: string;
  type: string;
  severity: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  affected_people: string;
  affected_assets: string;
  mission_impact: string;
  response: string;
  status: 'ACTIVE' | 'MITIGATED' | 'RESOLVED';
}

export interface ExpeditionCommunicationData {
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE' | 'SYNCING';
  mode: string;
  latency_ms: number;
  packet_loss_pct: number;
  bandwidth_kbps: number;
  last_successful_sync: string;
  last_telemetry_received: string;
  pending_sync_records: number;
}

export interface ExpeditionRecommendation {
  id: string;
  title: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  reason: string;
  model: string;
  confidence: number;
  fuel_delta?: string;
  eta_delta?: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  action_required: string;
  decision_time?: string;
  decided_by?: string;
  comments?: string;
}

export interface Expedition {
  id: string;
  name: string;
  mission_type: string;
  description: string;
  lead: string;
  organization: string;
  operational_season: string;
  status: ExpeditionStatus;
  status_display: string;
  risk_level: RiskLevel;
  risk_score: number;
  progress: number;
  current_phase: string;
  planned_start: string;
  planned_end: string;
  expected_completion: string;
  delay_hours: number;
  delay_reason?: string;
  origin_name: string;
  destination_name: string;
  current_region: string;
  current_lat?: number;
  current_lon?: number;
  vessel_name?: string;
  ships: string[];
  aircraft: string[];
  vehicles: string[];
  major_equipment: string[];
  crew_count: number;
  personnel: ExpeditionPersonnelData;
  weather: ExpeditionWeatherData;
  sea_ice: ExpeditionSeaIceData;
  satellite: ExpeditionSatelliteData;
  logistics: ExpeditionLogisticsData;
  risk_engine: ExpeditionRiskEngineData;
  objectives: ExpeditionObjective[];
  waypoints: ExpeditionWaypoint[];
  tasks: ExpeditionTask[];
  timeline: ExpeditionTimelinePhase[];
  contingencies: ExpeditionContingencyPlan[];
  incidents: ExpeditionIncident[];
  communication: ExpeditionCommunicationData;
  recommendations: ExpeditionRecommendation[];
  created_at?: string;
}

export interface ExpeditionKPIs {
  active_expeditions: number;
  planning: number;
  high_risk_missions: number;
  blocked_missions: number;
  personnel_deployed: number;
  active_assets: number;
  missions_this_season: number;
  upcoming_departures: number;
}

export interface ScenarioSimulationResult {
  scenario_type: string;
  title: string;
  current_eta: string;
  simulated_eta: string;
  resource_impact: string;
  projected_fuel_remaining: number;
  risk_score_delta: string;
  affected_tasks: string[];
  recommendation: string;
  human_approval_required: boolean;
}

export interface AuditLogEntry {
  audit_id: string;
  expedition_id: string;
  timestamp: string;
  actor: string;
  actor_role: string;
  action: string;
  old_value?: string | null;
  new_value?: string | null;
  reason?: string | null;
}
