import sys
import os
import time
from loguru import logger
from datetime import datetime

# Adjust path to find the API modules for DB and the local services
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../apps/api")))
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from app.db.database import SessionLocal
from app.db.models import ShipPosition, TelemetryEvent

# Import providers
from services.ingestion.weather.real_provider import RealWeatherProvider
from services.ingestion.satellite.real_provider import RealSentinelProvider
from services.ingestion.ais.provider import AISProvider

class IngestionOrchestrator:
    """
    Phase 3: Data Ingestion Pipeline Orchestrator.
    Responsible for periodically polling external intelligence sources
    (Satellite, Weather, AIS) and sinking the normalized data into PostgreSQL.
    """
    
    def __init__(self):
        self.weather = RealWeatherProvider()
        self.satellite = RealSentinelProvider()
        self.ais = AISProvider(mode="synthetic") # No free live AIS for Antarctica, using advanced synthetic
        
    def run_pipeline(self):
        logger.info("Starting Phase 3 Ingestion Pipeline...")
        db = SessionLocal()
        try:
            # 1. Ingest Weather
            logger.info("Ingesting Weather Data...")
            weather_data = self.weather.ingest(lat=-68.57, lon=77.96)
            if weather_data:
                # Log as a telemetry event for now
                event = TelemetryEvent(
                    source_hardware_id="EXTERNAL_OPEN_METEO",
                    event_type="WEATHER_UPDATE",
                    priority=2,
                    details=weather_data[0]
                )
                db.add(event)
                logger.info(f"Weather successfully synced to PostGIS: {weather_data[0]['temperature_c']}°C")

            # 2. Ingest Satellite STAC
            logger.info("Ingesting Satellite STAC Data...")
            sat_data = self.satellite.ingest()
            if sat_data:
                event = TelemetryEvent(
                    source_hardware_id="EXTERNAL_SENTINEL_2",
                    event_type="SATELLITE_PASS",
                    priority=3,
                    details={"images": len(sat_data), "latest": sat_data[0]}
                )
                db.add(event)
                logger.info(f"Satellite data successfully synced to PostGIS: {len(sat_data)} passes found.")

            # 3. Ingest AIS (Ship Tracking)
            logger.info("Ingesting AIS Data...")
            ais_data = self.ais.ingest()
            if ais_data:
                for ship in ais_data:
                    # In a real app we'd convert lat/lon to PostGIS WKT Geometry
                    # For prototype we'll save the raw telemetry
                    event = TelemetryEvent(
                        source_hardware_id=ship.get("mmsi", "UNKNOWN_SHIP"),
                        event_type="AIS_POSITION_REPORT",
                        priority=1,
                        details=ship
                    )
                    db.add(event)
                logger.info(f"AIS successfully synced to PostGIS: {len(ais_data)} ships updated.")
                
            # Commit all ingestion transactions safely
            db.commit()
            logger.info("Ingestion Pipeline completed successfully.")
            
        except Exception as e:
            db.rollback()
            logger.error(f"Ingestion Pipeline failed: {e}")
        finally:
            db.close()

if __name__ == "__main__":
    orchestrator = IngestionOrchestrator()
    orchestrator.run_pipeline()
