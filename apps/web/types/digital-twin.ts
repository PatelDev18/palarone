export type NodeCategory =
  | 'SHIP'
  | 'STATION'
  | 'EQUIPMENT'
  | 'CARGO'
  | 'PERSONNEL'
  | 'INFRASTRUCTURE'
  | 'ENVIRONMENT';

export type NodeStatus = 'NORMAL' | 'WARNING' | 'CRITICAL';
export type FreshnessState = 'FRESH' | 'RECENT' | 'STALE' | 'OFFLINE';

export interface NodeRisk {
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  score: number; // 0.0 to 1.0
  confidence: number; // 0.0 to 1.0
  horizon?: string;
  model?: string;
  contributing_factors?: Array<{
    factor: string;
    weight: number;
    impact: string;
  }>;
  [key: string]: any;
}

export interface DigitalTwinNode {
  id: string;
  label: string;
  category: NodeCategory;
  status: NodeStatus;
  health_score: number; // 0 to 100
  freshness: FreshnessState;
  last_update: string;
  data_source: string;
  properties: Record<string, any>;
  risk?: NodeRisk;
}

export interface DigitalTwinEdge {
  id: string;
  source: string;
  target: string;
  relation?: string;
  status?: 'NORMAL' | 'WARNING' | 'CRITICAL' | 'DELAYED' | 'THREATENED' | string;
  weight?: number;
  label?: string;
  animated?: boolean;
  style?: {
    stroke?: string;
    strokeWidth?: number;
    strokeDasharray?: string;
  };
  data?: {
    relation: string;
    status: string;
    weight: number;
    full_label?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export type ImpactSeverity = 'NORMAL' | 'WARNING' | 'CRITICAL' | 'LOW' | 'MEDIUM' | 'HIGH' | string;

export interface CascadeStage {
  step: number;
  node_id: string;
  node_name: string;
  impact_type: string;
  severity: ImpactSeverity;
  time_horizon: string; // e.g. NOW, 5 MIN, 30 MIN, 6 HOURS, 24 HOURS, 72 HOURS
  estimated_elapsed_minutes: number;
  description: string;
  confidence: number;
  [key: string]: any;
}

export interface CascadingImpact {
  cascade_id: string;
  trigger_node: string;
  trigger_name: string;
  root_cause: string;
  overall_severity: ImpactSeverity;
  confidence_score: number;
  stages: CascadeStage[];
  recommended_human_actions: string[];
  [key: string]: any;
}

export interface DigitalTwinEvent {
  event_id: string;
  timestamp: string;
  time_display: string;
  node_id: string;
  node_name: string;
  severity: ImpactSeverity;
  source: string;
  title: string;
  description: string;
  data_freshness: FreshnessState;
  [key: string]: any;
}

export interface SatelliteObservation {
  observation_id: string;
  satellite_name: string;
  sensor_type: string;
  captured_timestamp: string;
  age_display: string;
  freshness: FreshnessState;
  area: string;
  resolution: string;
  type: string;
  lead_features_detected: string;
  confidence: number;
  coverage_polygon: [number, number][];
}

export interface DataFreshnessItem {
  age: string;
  state: FreshnessState;
  health_pct: number;
}

export interface DigitalTwinOverview {
  title: string;
  subtitle: string;
  timestamp: string;
  time_display: string;
  status: 'ONLINE' | 'DEGRADED' | 'SIMULATION';
  data_completeness_pct: number;
  kpis: {
    system_nodes: number;
    active_relationships: number;
    critical_nodes: number;
    active_cascades: number;
    high_risk_assets: number;
    data_quality_pct: number;
    last_sync_seconds_ago: number;
  };
  data_freshness: Record<string, DataFreshnessItem>;
}

export interface WhatIfSimulationResult {
  is_simulation: boolean;
  simulation_disclaimer: string;
  scenario_key: string;
  title: string;
  description: string;
  direct_impact: string;
  secondary_impact: string;
  third_order_impact: string;
  operational_impact: string;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence_pct: number;
  impact_chain: string[];
  recommended_actions: string[];
  executed_at: string;
}

export interface AssistantQueryResponse {
  query: string;
  answer: string;
  sources: Array<{
    type: string;
    detail: string;
  }>;
  confidence: number;
  related_nodes: string[];
}

export interface GraphPayload {
  nodes: Array<{
    id: string;
    type: string;
    position: { x: number; y: number };
    data: DigitalTwinNode & {
      isCritical: boolean;
      isWarning: boolean;
      healthScore: number;
    };
  }>;
  edges: DigitalTwinEdge[];
  total_nodes: number;
  total_edges: number;
}
