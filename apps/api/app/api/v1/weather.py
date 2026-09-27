from fastapi import APIRouter
from typing import Dict, Any
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../../services")))
from ingestion.weather.real_provider import RealWeatherProvider

router = APIRouter()

@router.get("/current")
def get_current_weather(lat: float = -68.57, lon: float = 77.96) -> Dict[str, Any]:
    """
    Get current weather intelligence metadata (Phase 33).
    Uses RealWeatherProvider pointing to Open-Meteo API.
    """
    provider = RealWeatherProvider()
    
    # We override ingest to pass kwargs directly to fetch_data
    raw = provider.fetch_data(lat=lat, lon=lon)
    data = provider.normalize(raw)
    
    if not data:
        return {"status": "error", "message": "Failed to fetch weather from provider"}
        
    return {"weather": data[0]}
