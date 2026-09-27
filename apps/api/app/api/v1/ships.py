from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Ship, ShipPosition
import sys
import os

# Add services to path for imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../../services")))
from ingestion.ais.provider import AISProvider
from ingestion.weather.provider import WeatherProvider

router = APIRouter()

@router.get("/")
def get_ships(db: Session = Depends(get_db)):
    """
    Phase 1: Database Architecture
    Get all ships directly from the PostgreSQL / PostGIS database.
    """
    ships = None
    if db is not None:
        try:
            ships = db.query(Ship).all()
        except Exception:
            ships = None

    if not ships:
        # Graceful fallback to synthetic data if DB is completely empty or offline
        import csv
        csv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../../data/synthetic/ships.csv"))
        if os.path.exists(csv_path):
            with open(csv_path, "r") as f:
                reader = csv.DictReader(f)
                return {"ships": list(reader), "source": "synthetic_csv"}
        return {
            "ships": [
                {"id": "SHIP-01", "name": "Polar Star", "imo_number": "9123456", "ship_type": "Heavy Icebreaker", "ice_class": "PC1", "capacity_tons": 3500.0, "status": "In Transit", "speed_knots": 12.4, "destination": "Davis Station", "lat": -65.2, "lon": 72.4},
                {"id": "SHIP-02", "name": "Aurora Australis II", "imo_number": "9234567", "ship_type": "Research Icebreaker", "ice_class": "PC2", "capacity_tons": 2200.0, "status": "In Transit", "speed_knots": 11.2, "destination": "Maitri Station", "lat": -68.1, "lon": 14.8},
                {"id": "SHIP-03", "name": "Southern Endurance", "imo_number": "9345678", "ship_type": "Cargo / Supply", "ice_class": "PC3", "capacity_tons": 5000.0, "status": "At Port", "speed_knots": 0.0, "destination": "Cape Town", "lat": -33.9, "lon": 18.4},
                {"id": "SHIP-04", "name": "Kronprins Haakon", "imo_number": "9456789", "ship_type": "Polar Research Vessel", "ice_class": "PC3", "capacity_tons": 1800.0, "status": "Delayed", "speed_knots": 4.5, "destination": "Bharati Station", "lat": -67.5, "lon": 68.2},
                {"id": "SHIP-05", "name": "NATHANIEL B. PALMER", "imo_number": "9567890", "ship_type": "Ice-strengthened Tanker", "ice_class": "PC2", "capacity_tons": 6200.0, "status": "Awaiting Departure", "speed_knots": 0.0, "destination": "Hobart", "lat": -42.8, "lon": 147.3}
            ],
            "source": "synthetic_provider"
        }
        
    return {"ships": ships, "source": "postgis"}

@router.get("/{imo}/track")
def get_ship_track(imo: str, db: Session = Depends(get_db)):
    """
    Get live AIS track for a ship.
    """
    provider = AISProvider(mode="synthetic")
    data = provider.ingest()
    # Filter by IMO if needed
    return {"track": data}

@router.get("/{imo}/weather")
def get_ship_weather(imo: str, lat: float = -65.0, lon: float = 70.0, db: Session = Depends(get_db)):
    """
    Get weather around the ship's current location.
    """
    provider = WeatherProvider(mode="synthetic")
    data = provider.ingest(lat=lat, lon=lon)
    return {"weather": data[0] if data else None}
