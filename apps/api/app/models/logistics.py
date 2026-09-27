import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Float, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..db.base import Base

class Cargo(Base):
    __tablename__ = "cargo"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    container_id = Column(String)
    cargo_type = Column(String)
    weight_kg = Column(Float)
    origin_id = Column(UUID(as_uuid=True), ForeignKey("stations.id"))
    destination_id = Column(UUID(as_uuid=True), ForeignKey("stations.id"))
    ship_id = Column(UUID(as_uuid=True), ForeignKey("ships.id"), nullable=True)
    status = Column(String) # Planned, Loaded, In Transit, Delivered
    priority = Column(String)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Inventory(Base):
    __tablename__ = "inventory"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    station_id = Column(UUID(as_uuid=True), ForeignKey("stations.id"))
    item_name = Column(String)
    category = Column(String) # Fuel, Food, Medical, Parts
    quantity = Column(Float)
    unit = Column(String)
    safety_stock = Column(Float)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
