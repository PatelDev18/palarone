from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Enum, JSON
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.sql import func
from geoalchemy2 import Geometry
import enum

Base = declarative_base()

class UserRole(enum.Enum):
    ADMINISTRATOR = "ADMINISTRATOR"
    COMMANDER = "COMMANDER"
    LOGISTICS = "LOGISTICS"
    VIEWER = "VIEWER"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    role = Column(Enum(UserRole), default=UserRole.VIEWER)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Ship(Base):
    __tablename__ = "ships"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    imo_number = Column(String, unique=True)
    ship_type = Column(String)
    ice_class = Column(String)
    capacity_tons = Column(Float)
    
    # Relationships
    positions = relationship("ShipPosition", back_populates="ship")
    cargo = relationship("Cargo", back_populates="ship")

class ShipPosition(Base):
    __tablename__ = "ship_positions"
    id = Column(Integer, primary_key=True, index=True)
    ship_id = Column(String, ForeignKey("ships.id"), nullable=False)
    timestamp = Column(DateTime(timezone=True), default=func.now(), index=True)
    
    # PostGIS Geography type for precise spatial calculations
    location = Column(Geometry(geometry_type='POINT', srid=4326), nullable=False)
    
    speed_knots = Column(Float)
    heading_degrees = Column(Float)
    navigational_status = Column(String)

    ship = relationship("Ship", back_populates="positions")

class Station(Base):
    __tablename__ = "stations"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    country = Column(String)
    location = Column(Geometry(geometry_type='POINT', srid=4326), nullable=False)
    max_occupancy = Column(Integer)
    current_occupancy = Column(Integer)
    status = Column(String, default="ONLINE")

class Cargo(Base):
    __tablename__ = "cargo"
    id = Column(String, primary_key=True, index=True)
    description = Column(String, nullable=False)
    weight_kg = Column(Float)
    hazard_class = Column(String)
    status = Column(String, default="PLANNED") # PLANNED, LOADED, IN_TRANSIT, DELIVERED
    
    ship_id = Column(String, ForeignKey("ships.id"), nullable=True)
    destination_station_id = Column(String, ForeignKey("stations.id"), nullable=True)

    ship = relationship("Ship", back_populates="cargo")

class TelemetryEvent(Base):
    __tablename__ = "telemetry_events"
    id = Column(Integer, primary_key=True, index=True)
    source_hardware_id = Column(String, index=True, nullable=False)
    event_type = Column(String, index=True, nullable=False) # e.g., AI_CRITICAL_ANOMALY, ROUTINE_INVENTORY
    priority = Column(Integer, default=5)
    details = Column(JSON) # Store raw JSON payload
    created_at = Column(DateTime(timezone=True), server_default=func.now())
