from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ...db.session import get_db
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../../services")))
from ingestion.satellite.provider import SatelliteProvider
from ingestion.satellite.real_provider import RealSentinelProvider

router = APIRouter()

@router.get("/observations")
def get_satellite_observations(db: Session = Depends(get_db)):
    """
    Get satellite intelligence metadata (Phase 32).
    Now uses RealSentinelProvider pointing to Element 84 Earth Search STAC API.
    """
    provider = RealSentinelProvider()
    data = provider.ingest()
    
    # Fallback to synthetic if live fetch fails
    if not data:
        fallback = SatelliteProvider(source="Sentinel-1", mode="synthetic")
        data = fallback.ingest()
        for item in data:
            item["processing_status"] = "SYNTHETIC_FALLBACK"
            
    return {"observations": data}
