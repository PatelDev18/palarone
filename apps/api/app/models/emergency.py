"""
POLARONE Emergency Response Center Database Models.
Implements the 18 required entities for Antarctic Maritime Emergency Operations.
"""

import enum
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Enum as SQLEnum, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..db.models import Base

class IncidentSeverity(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class IncidentStatus(str, enum.Enum):
    DETECTED = "DETECTED"
    TRIAGE = "TRIAGE"
    ASSESSING = "ASSESSING"
    INCIDENT_DECLARED = "INCIDENT_DECLARED"
    RESPONSE_PLAN_GENERATED = "RESPONSE_PLAN_GENERATED"
    HUMAN_REVIEW = "HUMAN_REVIEW"
    AWAITING_APPROVAL = "AWAITING_APPROVAL"
    APPROVED = "APPROVED"
    RESPONSE_ACTIVE = "RESPONSE_ACTIVE"
    MITIGATING = "MITIGATING"
    RESOLVED = "RESOLVED"
    CLOSED = "CLOSED"

class ApprovalStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    MORE_INFO_REQUESTED = "MORE_INFO_REQUESTED"

class Incident(Base):
    __tablename__ = "emergency_incidents"

    id = Column(String, primary_key=True, index=True) # e.g. INC-001
    title = Column(String, nullable=False)
    incident_type = Column(String, nullable=False) # Sea Ice Obstruction, Engine Failure, etc.
    severity = Column(SQLEnum(IncidentSeverity), default=IncidentSeverity.HIGH, nullable=False)
    status = Column(SQLEnum(IncidentStatus), default=IncidentStatus.DETECTED, nullable=False)
    risk_score = Column(Integer, default=75) # 0-100
    ai_confidence = Column(Integer, default=85) # 0-100
    response_lead = Column(String, default="Cmdr. Hayes")
    description = Column(Text, nullable=False)
    location_name = Column(String, nullable=False)
    coordinates = Column(JSON, nullable=False) # {"lat": -67.84, "lon": 76.92}
    
    # Flags & Timestamps
    is_simulation = Column(Boolean, default=False)
    detected_at = Column(DateTime(timezone=True), default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    resolved_at = Column(DateTime(timezone=True), nullable=True)
    closed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Detailed payloads
    primary_cause = Column(String)
    secondary_risks = Column(JSON) # ["Increased fuel consumption", "ETA delay"]
    potential_impact = Column(String)
    closure_summary = Column(JSON) # Metrics and outcome notes

class IncidentEvent(Base):
    __tablename__ = "emergency_incident_events"

    id = Column(String, primary_key=True)
    incident_id = Column(String, ForeignKey("emergency_incidents.id"), index=True, nullable=False)
    timestamp = Column(DateTime(timezone=True), default=func.now())
    source = Column(String, nullable=False) # Satellite, AIS, ML Model, IoT, Human, Commander
    actor = Column(String, nullable=False) # e.g. Sentinel-1A, AI Risk Engine, Cmdr. Hayes
    action = Column(String, nullable=False)
    detail = Column(Text)
    status = Column(String)
    is_simulation = Column(Boolean, default=False)

class IncidentLocation(Base):
    __tablename__ = "emergency_incident_locations"

    id = Column(String, primary_key=True)
    incident_id = Column(String, ForeignKey("emergency_incidents.id"), index=True)
    sector_name = Column(String, nullable=False)
    lat = Column(Float, nullable=False)
    lon = Column(Float, nullable=False)
    bounding_box = Column(JSON) # [min_lon, min_lat, max_lon, max_lat]
    high_risk_radius_nm = Column(Float, default=15.0)
    blocked_area_polygon = Column(JSON) # GeoJSON polygon

class AffectedAsset(Base):
    __tablename__ = "emergency_affected_assets"

    id = Column(String, primary_key=True)
    incident_id = Column(String, ForeignKey("emergency_incidents.id"), index=True)
    name = Column(String, nullable=False)
    asset_type = Column(String, nullable=False) # Vessel, Station, Crew
    imo_or_id = Column(String)
    current_lat = Column(Float)
    current_lon = Column(Float)
    speed_knots = Column(Float)
    heading_deg = Column(Float)
    destination = Column(String)
    original_eta = Column(String)
    predicted_eta = Column(String)
    expected_delay_hours = Column(Float)
    status = Column(String)
    fuel_remaining_pct = Column(Float)
    personnel_count = Column(Integer)

class ResponseAsset(Base):
    __tablename__ = "emergency_response_assets"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    asset_type = Column(String, nullable=False) # Icebreaker, Helicopter, Rescue Team, Station
    location_name = Column(String)
    lat = Column(Float, nullable=False)
    lon = Column(Float, nullable=False)
    distance_km = Column(Float)
    eta_hours = Column(Float)
    status = Column(String, default="AVAILABLE") # AVAILABLE, DISPATCHED, ON_SCENE, STANDBY
    suitability_pct = Column(Integer, default=85)
    capabilities = Column(JSON) # ["Ice Navigation", "Cargo", "Rescue", "Medical"]
    fuel_pct = Column(Float, default=90.0)
    comm_status = Column(String, default="CONNECTED") # CONNECTED, DEGRADED, OFFLINE
    current_mission = Column(String, default="Station Patrol")

class ResponsePlan(Base):
    __tablename__ = "emergency_response_plans"

    id = Column(String, primary_key=True)
    incident_id = Column(String, ForeignKey("emergency_incidents.id"), index=True)
    title = Column(String, nullable=False)
    recommended_action = Column(Text, nullable=False)
    route_comparison = Column(JSON) # { "original_route": [...], "current_route": [...], "recommended_route": [...] }
    expected_eta_improvement_hours = Column(Float)
    risk_reduction_pct = Column(Float)
    fuel_impact_pct = Column(Float)
    ai_confidence = Column(Integer)
    created_at = Column(DateTime(timezone=True), default=func.now())
    status = Column(String, default="DRAFTED")

class ResponseAction(Base):
    __tablename__ = "emergency_response_actions"

    id = Column(String, primary_key=True)
    incident_id = Column(String, ForeignKey("emergency_incidents.id"), index=True)
    plan_id = Column(String, ForeignKey("emergency_response_plans.id"), nullable=True)
    action_type = Column(String, nullable=False) # DIVERSION, DISPATCH, EVACUATION, RESOURCE_ALLOCATION
    description = Column(Text, nullable=False)
    target_asset = Column(String, nullable=False)
    status = Column(String, default="PENDING_APPROVAL")
    executed_at = Column(DateTime(timezone=True), nullable=True)
    execution_result = Column(JSON, nullable=True)

class ApprovalRequest(Base):
    __tablename__ = "emergency_approval_requests"

    id = Column(String, primary_key=True)
    incident_id = Column(String, ForeignKey("emergency_incidents.id"), index=True)
    action_type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    reason = Column(Text, nullable=False)
    ai_confidence = Column(Integer, default=85)
    expected_impact = Column(JSON) # {"delay_reduction_hours": 11, "risk_reduction_pct": 24, "fuel_delta_pct": 4}
    requested_by = Column(String, default="AI Risk Engine (XGB_ROUTE_RISK_01)")
    status = Column(SQLEnum(ApprovalStatus), default=ApprovalStatus.PENDING)
    requires_role = Column(String, default="Commander")
    
    # Human Review info
    reviewer_name = Column(String, nullable=True)
    reviewer_role = Column(String, nullable=True)
    reviewer_notes = Column(Text, nullable=True)
    decision_timestamp = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=func.now())

class CommunicationEvent(Base):
    __tablename__ = "emergency_communication_events"

    id = Column(String, primary_key=True)
    incident_id = Column(String, ForeignKey("emergency_incidents.id"), index=True)
    timestamp = Column(DateTime(timezone=True), default=func.now())
    sender = Column(String, nullable=False) # Polar Star, Davis Station, Cmdr. Hayes, AI Assistant
    sender_role = Column(String)
    channel = Column(String, default="Iridium Polar SAT-3") # Iridium, VHF Marine Ch 16, Inmarsat-C, Optical Mesh
    signal_quality = Column(String, default="DEGRADED") # STRONG, GOOD, DEGRADED, LOST
    message = Column(Text, nullable=False)
    acknowledged = Column(Boolean, default=True)

class SatelliteObservation(Base):
    __tablename__ = "emergency_satellite_observations"

    id = Column(String, primary_key=True)
    incident_id = Column(String, ForeignKey("emergency_incidents.id"), index=True)
    satellite = Column(String, nullable=False) # Sentinel-1A SAR, Sentinel-2B, Landsat-9
    product_type = Column(String, nullable=False) # SAR / GRD, MSI L2A
    acquisition_time = Column(DateTime(timezone=True))
    freshness = Column(String) # "38 min ago"
    freshness_status = Column(String) # FRESH, RECENT, STALE, OFFLINE
    resolution = Column(String, default="10 m")
    cloud_coverage_pct = Column(Float, default=0.0)
    finding = Column(Text)
    feature_detected = Column(String) # Dense Sea Ice Pack, Compressive Ridge Keels
    preview_url = Column(String)

class WeatherObservation(Base):
    __tablename__ = "emergency_weather_observations"

    id = Column(String, primary_key=True)
    incident_id = Column(String, ForeignKey("emergency_incidents.id"), index=True)
    temperature_c = Column(Float, default=-16.0)
    wind_speed_knots = Column(Float, default=32.0)
    wind_direction = Column(String, default="SSW")
    visibility_km = Column(Float, default=8.0)
    sea_ice_concentration_pct = Column(Float, default=78.0)
    sea_ice_thickness_m = Column(Float, default=2.1)
    iceberg_proximity_nm = Column(Float, default=4.2)
    wave_height_m = Column(Float, default=3.8)
    storm_probability_pct = Column(Integer, default=65)
    risk_level = Column(String, default="HIGH")
    data_freshness = Column(String, default="FRESH")
    last_updated = Column(DateTime(timezone=True), default=func.now())

class AISObservation(Base):
    __tablename__ = "emergency_ais_observations"

    id = Column(String, primary_key=True)
    incident_id = Column(String, ForeignKey("emergency_incidents.id"), index=True)
    vessel_name = Column(String, nullable=False)
    mmsi = Column(String)
    last_known_lat = Column(Float)
    last_known_lon = Column(Float)
    speed_knots = Column(Float)
    speed_drop_pct = Column(Float)
    heading_deg = Column(Float)
    nav_status = Column(String)
    last_updated = Column(DateTime(timezone=True))
    freshness_status = Column(String, default="FRESH") # FRESH, RECENT, STALE, OFFLINE

class RiskAssessment(Base):
    __tablename__ = "emergency_risk_assessments"

    id = Column(String, primary_key=True)
    incident_id = Column(String, ForeignKey("emergency_incidents.id"), index=True)
    risk_score = Column(Integer, default=87)
    confidence_pct = Column(Integer, default=91)
    model_name = Column(String, default="XGB_ROUTE_RISK_01")
    model_version = Column(String, default="1.3.0")
    prediction_summary = Column(Text)
    
    # SHAP Feature Drivers
    factor_drivers = Column(JSON) # [{"factor": "Sea Ice Concentration", "impact_pct": 42}, ...]
    why_flagged_narrative = Column(Text)
    created_at = Column(DateTime(timezone=True), default=func.now())

class AIRecommendation(Base):
    __tablename__ = "emergency_ai_recommendations"

    id = Column(String, primary_key=True)
    incident_id = Column(String, ForeignKey("emergency_incidents.id"), index=True)
    title = Column(String, nullable=False)
    recommended_action = Column(Text, nullable=False)
    eta_improvement_hours = Column(Float, default=11.0)
    risk_reduction_pct = Column(Float, default=24.0)
    fuel_impact_pct = Column(Float, default=4.0)
    confidence_pct = Column(Integer, default=84)
    model_name = Column(String, default="XGB_ROUTE_RISK_01 + OR_TOOLS_VRP")
    status = Column(String, default="AWAITING_HUMAN_APPROVAL")
    created_at = Column(DateTime(timezone=True), default=func.now())

class IncidentAudit(Base):
    __tablename__ = "emergency_incident_audits"

    id = Column(String, primary_key=True)
    incident_id = Column(String, ForeignKey("emergency_incidents.id"), index=True)
    timestamp = Column(DateTime(timezone=True), default=func.now())
    user_name = Column(String, nullable=False)
    user_role = Column(String, nullable=False)
    action = Column(String, nullable=False) # APPROVED_DIVERSION, ESCALATED, CLOSED, etc.
    old_state = Column(String)
    new_state = Column(String)
    reason = Column(Text)
    ai_recommendation_summary = Column(String)
    data_sources_consulted = Column(JSON) # ["Sentinel-1 SAR", "AIS", "ECMWF Weather"]
    is_simulation = Column(Boolean, default=False)

class IncidentReport(Base):
    __tablename__ = "emergency_incident_reports"

    id = Column(String, primary_key=True)
    incident_id = Column(String, ForeignKey("emergency_incidents.id"), index=True)
    title = Column(String, nullable=False)
    generated_at = Column(DateTime(timezone=True), default=func.now())
    resolution_time_utc = Column(String)
    response_duration_hours = Column(Float)
    assets_involved = Column(JSON)
    actions_performed = Column(JSON)
    final_outcome = Column(Text)
    delay_caused_hours = Column(Float)
    cargo_impact = Column(String)
    personnel_impact = Column(String)
    operational_impact = Column(String)
    root_cause = Column(Text)
    ai_prediction_accuracy = Column(JSON) # {"predicted_delay": 26, "actual_delay": 24, "error_hours": 2, "confidence": 84}
    commander_notes = Column(Text)
    lessons_learned = Column(JSON) # list of strings
    recommended_improvements = Column(JSON) # list of strings
