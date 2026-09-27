/**
 * TypeScript Type Definitions for POLARONE Emergency Response Center.
 */

export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IncidentStatus = 
  | 'DETECTED'
  | 'TRIAGE'
  | 'ASSESSING'
  | 'INCIDENT_DECLARED'
  | 'RESPONSE_PLAN_GENERATED'
  | 'HUMAN_REVIEW'
  | 'AWAITING_APPROVAL'
  | 'APPROVED'
  | 'RESPONSE_ACTIVE'
  | 'MITIGATING'
  | 'RESOLVED'
  | 'CLOSED';

export type DataFreshnessStatus = 'FRESH' | 'RECENT' | 'STALE' | 'OFFLINE';

export type CommunicationQuality = 'STRONG' | 'GOOD' | 'DEGRADED' | 'LOST';

export interface AffectedAsset {
  id: string;
  name: string;
  asset_type: string;
  imo_or_id?: string;
  current_lat: number;
  current_lon: number;
  speed_knots: number;
  heading_deg: number;
  destination: string;
  original_eta: string;
  predicted_eta: string;
  expected_delay_hours: number;
  status: string;
  fuel_remaining_pct: number;
  personnel_count: number;
}

export interface ResponseAsset {
  id: string;
  name: string;
  asset_type: string;
  location_name: string;
  lat: number;
  lon: number;
  distance_km: number;
  eta_hours: number;
  status: 'AVAILABLE' | 'DISPATCHED' | 'ON_SCENE' | 'STANDBY';
  suitability_pct: number;
  capabilities: string[];
  fuel_pct: number;
  comm_status: 'CONNECTED' | 'DEGRADED' | 'OFFLINE';
  current_mission: string;
  personnel_capacity?: number;
  callsign?: string;
  imo?: string;
}

export interface DataSourceFreshness {
  source: string;
  updated_at: string;
  freshness: DataFreshnessStatus;
  confidence: number;
}

export interface WeatherSeaIceObservation {
  temperature_c: number;
  wind_speed_knots: number;
  wind_direction: string;
  visibility_km: number;
  sea_ice_concentration_pct: number;
  sea_ice_thickness_m: number;
  iceberg_proximity_nm: number;
  wave_height_m: number;
  storm_probability_pct: number;
  risk_level: string;
  data_freshness: DataFreshnessStatus;
  last_updated: string;
}

export interface SatelliteEvidence {
  satellite: string;
  product_type: string;
  acquisition_time: string;
  display_time: string;
  resolution: string;
  cloud_coverage_pct: number;
  processing_status: string;
  finding: string;
  feature_detected: string;
  preview_url: string;
}

export interface AIRiskAssessment {
  risk_score: number;
  confidence_pct: number;
  model_name: string;
  model_version: string;
  prediction_summary: string;
  factor_drivers: {
    factor: string;
    impact_pct: number;
  }[];
  why_flagged_narrative: string;
}

export interface RouteWaypoint {
  name: string;
  lat: number;
  lon: number;
}

export interface RouteComparison {
  original_route: RouteWaypoint[];
  current_route: RouteWaypoint[];
  recommended_route: RouteWaypoint[];
  blocked_area?: {
    lat: number;
    lon: number;
    radius_nm: number;
    description: string;
  };
  high_risk_area?: {
    lat: number;
    lon: number;
    radius_nm: number;
    description: string;
  };
}

export interface AIRecommendation {
  title: string;
  recommended_action: string;
  eta_improvement_hours: number;
  risk_reduction_pct: number;
  fuel_impact_pct: number;
  confidence_pct: number;
  model_name: string;
  status: string;
  created_at: string;
  route_comparison?: RouteComparison | null;
}

export interface ApprovalRequest {
  id: string;
  action_type: string;
  title: string;
  reason: string;
  ai_confidence: number;
  expected_impact: {
    delay_reduction_hours: number;
    risk_reduction_pct: number;
    fuel_delta_pct: number;
  };
  requested_by: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'MORE_INFO_REQUESTED';
  requires_role: string;
  reviewer_name?: string | null;
  reviewer_role?: string | null;
  reviewer_notes?: string | null;
  decision_timestamp?: string | null;
  created_at: string;
}

export interface CascadingImpact {
  primary_asset: string;
  downstream_impacts: {
    node: string;
    status: string;
    type: string;
    impact: string;
  }[];
  graph_nodes: {
    id: string;
    label: string;
    type: string;
    severity: string;
  }[];
  graph_edges: {
    source: string;
    target: string;
    label: string;
  }[];
}

export interface CommunicationEvent {
  id: string;
  timestamp: string;
  sender: string;
  sender_role: string;
  channel: string;
  signal_quality: CommunicationQuality;
  message: string;
  acknowledged: boolean;
}

export interface IncidentTimelineEvent {
  time: string;
  source: 'Satellite' | 'AIS' | 'ML Model' | 'IoT' | 'Human' | 'System' | 'Commander';
  actor: string;
  action: string;
  status: string;
}

export interface ProtocolChecklistStep {
  step: number;
  title: string;
  action: string;
  completed: boolean;
}

export interface EmergencyProtocol {
  id: string;
  name: string;
  code: string;
  severity: IncidentSeverity;
  required_approval: string;
  escalation_path: string;
  description: string;
  checklist: ProtocolChecklistStep[];
}

export interface IncidentClosureSummary {
  resolution_time: string;
  response_duration_hours: number;
  assets_involved: string[];
  final_outcome: string;
  delay_caused_hours: number;
  cargo_impact: string;
  personnel_impact: string;
  operational_impact: string;
  root_cause: string;
  commander_notes: string;
  ai_prediction_accuracy: {
    predicted_delay_hours: number;
    actual_delay_hours: number;
    prediction_error_hours: number;
    ai_confidence_pct: number;
    outcome_evaluation?: string;
  };
}

export interface Incident {
  id: string;
  title: string;
  incident_type: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  risk_score: number;
  ai_confidence: number;
  response_lead: string;
  description: string;
  location_name: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  is_simulation: boolean;
  detected_at: string;
  updated_at: string;
  resolved_at?: string | null;
  closed_at?: string | null;
  primary_cause?: string;
  secondary_risks?: string[];
  potential_impact?: string;
  affected_assets: AffectedAsset[];
  data_sources: DataSourceFreshness[];
  weather_sea_ice: WeatherSeaIceObservation;
  satellite_evidence: SatelliteEvidence;
  ai_risk_assessment: AIRiskAssessment;
  ai_recommendation: AIRecommendation;
  pending_approvals: ApprovalRequest[];
  cascading_impact: CascadingImpact;
  communications: CommunicationEvent[];
  timeline: IncidentTimelineEvent[];
  closure_summary?: IncidentClosureSummary | null;
}

export interface AuditLogEntry {
  id: string;
  incident_id: string;
  timestamp: string;
  user_name: string;
  user_role: string;
  action: string;
  old_state: string;
  new_state: string;
  reason: string;
  ai_recommendation_summary: string;
  data_sources_consulted: string[];
  is_simulation: boolean;
}

export interface PostIncidentReport {
  report_id: string;
  incident_id: string;
  title: string;
  generated_at: string;
  executive_summary: string;
  metrics: {
    detection_time_minutes: number;
    assessment_time_minutes: number;
    approval_time_minutes: number;
    response_time_minutes: number;
    resolution_time_hours: number;
  };
  timeline: IncidentTimelineEvent[];
  root_cause_analysis: string;
  ai_performance: {
    model: string;
    confidence: number;
    predicted_delay_hours: number;
    actual_delay_hours: number;
    prediction_error_hours: number;
    accuracy_grade: string;
  };
  response_asset_performance: {
    asset: string;
    role: string;
    rating: string;
  }[];
  data_quality_evaluation: {
    satellite_freshness: string;
    ais_telemetry: string;
    iot_vibration: string;
  };
  lessons_learned: string[];
  recommended_improvements: string[];
}

export interface ResponseOverviewKPIs {
  active_incidents: number;
  critical_incidents: number;
  pending_approvals: number;
  response_assets_available: number;
  incidents_last_24h: number;
  average_response_time_minutes: number;
  satellite_alerts: number;
  ai_risk_alerts: number;
  system_status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  timestamp: string;
}
