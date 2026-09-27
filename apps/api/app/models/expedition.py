import uuid
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Integer, Float, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..db.base import Base

class Expedition(Base):
    __tablename__ = "expeditions"

    id = Column(String, primary_key=True) # e.g. "EXP-2026-A"
    name = Column(String, nullable=False)
    mission_type = Column(String, nullable=False) # Scientific Research, Resupply, Survey, etc.
    description = Column(Text)
    lead = Column(String, nullable=False) # e.g. "Cmdr. Sarah Jenkins"
    organization = Column(String, default="Antarctic Operations Command")
    operational_season = Column(String, default="2026-2027")
    status = Column(String, nullable=False, default="PLANNING") # DRAFT, PLANNING, READY FOR APPROVAL, APPROVED, PRE-DEPARTURE, IN TRANSIT, OPERATIONAL, PARTIALLY BLOCKED, BLOCKED, SUSPENDED, RETURNING, COMPLETED, CANCELLED, ARCHIVED
    risk_level = Column(String, default="LOW") # LOW, MEDIUM, HIGH, CRITICAL
    risk_score = Column(Float, default=25.0)
    progress = Column(Integer, default=0) # 0-100%

    planned_start = Column(DateTime(timezone=True))
    planned_end = Column(DateTime(timezone=True))
    expected_completion = Column(DateTime(timezone=True))
    current_phase = Column(String, default="Planning")

    origin_name = Column(String)
    destination_name = Column(String)
    current_region = Column(String)
    current_lat = Column(Float)
    current_lon = Column(Float)

    delay_hours = Column(Float, default=0.0)
    delay_reason = Column(Text)

    cargo_readiness = Column(Integer, default=100) # %
    fuel_readiness = Column(Integer, default=100) # %
    supply_readiness = Column(Integer, default=100) # %

    extra_data = Column(JSONB, default=dict)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class ExpeditionObjective(Base):
    __tablename__ = "expedition_objectives"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    expedition_id = Column(String, ForeignKey("expeditions.id"))
    title = Column(String, nullable=False)
    is_primary = Column(Boolean, default=False)
    priority = Column(String, default="MEDIUM") # HIGH, MEDIUM, LOW
    owner = Column(String)
    deadline = Column(DateTime(timezone=True))
    status = Column(String, default="PLANNED") # PLANNED, IN PROGRESS, COMPLETED, BLOCKED
    success_criteria = Column(Text)

class ExpeditionWaypoint(Base):
    __tablename__ = "expedition_waypoints"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    expedition_id = Column(String, ForeignKey("expeditions.id"))
    order = Column(Integer, nullable=False)
    name = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    passed = Column(Boolean, default=False)
    eta = Column(DateTime(timezone=True))
    ice_risk = Column(String, default="LOW")
    weather_risk = Column(String, default="LOW")

class ExpeditionPersonnel(Base):
    __tablename__ = "expedition_personnel"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    expedition_id = Column(String, ForeignKey("expeditions.id"))
    name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    team = Column(String) # Command, Science, Aviation, Engineering, Medical, Logistics
    certification = Column(String)
    current_location = Column(String)
    medical_readiness = Column(String, default="READY") # READY, CONDITIONAL, RESTRICTED
    shift = Column(String, default="Alpha (08:00 - 20:00)")
    deployed = Column(Boolean, default=False)
    emergency_contact = Column(String)

class ExpeditionAsset(Base):
    __tablename__ = "expedition_assets"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    expedition_id = Column(String, ForeignKey("expeditions.id"))
    name = Column(String, nullable=False)
    asset_type = Column(String, nullable=False) # Ship, Icebreaker, Aircraft, Helicopter, Snow vehicle, Drone, Generator, Scientific equipment, Communication equipment
    status = Column(String, default="READY") # READY, ACTIVE, WARNING, MAINTENANCE, OFFLINE, CRITICAL
    health_pct = Column(Integer, default=100)
    fuel_pct = Column(Integer, default=100)
    location = Column(String)
    last_telemetry = Column(DateTime(timezone=True), server_default=func.now())

class ExpeditionCargo(Base):
    __tablename__ = "expedition_cargo"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    expedition_id = Column(String, ForeignKey("expeditions.id"))
    item_category = Column(String, nullable=False) # Food, Fuel, Medical, Science, Spare Parts, Emergency, Water, Shelter
    item_name = Column(String, nullable=False)
    required_qty = Column(Float, nullable=False)
    available_qty = Column(Float, nullable=False)
    loaded_qty = Column(Float, default=0.0)
    consumed_qty = Column(Float, default=0.0)
    unit = Column(String, default="tons")
    reserve_margin_pct = Column(Float, default=20.0)

class ExpeditionTask(Base):
    __tablename__ = "expedition_tasks"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    expedition_id = Column(String, ForeignKey("expeditions.id"))
    title = Column(String, nullable=False)
    description = Column(Text)
    owner = Column(String)
    team = Column(String)
    priority = Column(String, default="MEDIUM") # CRITICAL, HIGH, MEDIUM, LOW
    status = Column(String, default="TODO") # TODO, IN PROGRESS, BLOCKED, COMPLETED, CANCELLED
    start_date = Column(DateTime(timezone=True))
    due_date = Column(DateTime(timezone=True))
    dependency = Column(String) # Task ID or description
    location = Column(String)

class ExpeditionIncident(Base):
    __tablename__ = "expedition_incidents"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    expedition_id = Column(String, ForeignKey("expeditions.id"))
    reported_time = Column(DateTime(timezone=True), server_default=func.now())
    title = Column(String, nullable=False)
    location = Column(String)
    incident_type = Column(String) # Weather, Equipment, Medical, Logistics, Ice, Comms
    severity = Column(String, default="MEDIUM") # INFO, LOW, MEDIUM, HIGH, CRITICAL
    description = Column(Text)
    affected_people = Column(String)
    affected_assets = Column(String)
    mission_impact = Column(Text)
    response_action = Column(Text)
    status = Column(String, default="ACTIVE") # ACTIVE, MITIGATED, RESOLVED

class ExpeditionAuditLog(Base):
    __tablename__ = "expedition_audit_logs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    expedition_id = Column(String, ForeignKey("expeditions.id"))
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    actor = Column(String, nullable=False)
    actor_role = Column(String, nullable=False)
    action = Column(String, nullable=False)
    old_value = Column(Text)
    new_value = Column(Text)
    reason = Column(Text)
