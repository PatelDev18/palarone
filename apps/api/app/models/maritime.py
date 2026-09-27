import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Float
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from geoalchemy2 import Geometry
from ..db.base import Base

class Ship(Base):
    __tablename__ = "ships"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    imo = Column(String, unique=True, nullable=False)
    type = Column(String)
    status = Column(String) # In Transit, At Port, etc.
    destination_id = Column(UUID(as_uuid=True), ForeignKey("stations.id"))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
class ShipPosition(Base):
    __tablename__ = "ship_positions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ship_id = Column(UUID(as_uuid=True), ForeignKey("ships.id"))
    timestamp = Column(DateTime(timezone=True), nullable=False)
    location = Column(Geometry('POINT', srid=4326))
    speed = Column(Float)
    heading = Column(Float)
    course = Column(Float)
    
    ship = relationship("Ship")

class Route(Base):
    __tablename__ = "routes"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ship_id = Column(UUID(as_uuid=True), ForeignKey("ships.id"))
    origin_id = Column(UUID(as_uuid=True), ForeignKey("stations.id"))
    destination_id = Column(UUID(as_uuid=True), ForeignKey("stations.id"))
    path = Column(Geometry('LINESTRING', srid=4326))
    status = Column(String) # Planned, Active, Completed
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
