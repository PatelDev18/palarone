from ..base import DataProvider
from typing import Any, Dict, List
from datetime import datetime
import requests
from loguru import logger

class WeatherProvider(DataProvider):
    """
    Weather data provider (e.g., NOAA, ECMWF, Open-Meteo).
    Phase 3: Data Ingestion integration with real Open-Meteo API.
    """
    
    def __init__(self, mode="synthetic"):
        super().__init__(name="WeatherProvider")
        self.mode = mode
        
    def connect(self) -> bool:
        return True
        
    def fetch_data(self, lat: float = -77.84, lon: float = 166.68, **kwargs) -> List[Dict[str, Any]]:
        if self.mode == "live":
            try:
                # Call free Open-Meteo API for real-time weather
                logger.info(f"Fetching live weather for lat:{lat} lon:{lon} via Open-Meteo...")
                url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true"
                response = requests.get(url, timeout=10)
                response.raise_for_status()
                data = response.json()
                cw = data.get("current_weather", {})
                
                return [{
                    "timestamp": datetime.utcnow().isoformat(),
                    "lat": lat,
                    "lon": lon,
                    "temperature_c": cw.get("temperature", -99.9),
                    "wind_speed_knots": round(cw.get("windspeed", 0) * 0.539957, 1), # km/h to knots
                    "wind_direction": cw.get("winddirection", 0),
                    "condition_code": cw.get("weathercode", 0),
                    "source": "open_meteo_live"
                }]
            except Exception as e:
                logger.error(f"Live Weather API failed, falling back to synthetic. Error: {e}")
                self.mode = "synthetic" # Fallback gracefully
                
        if self.mode == "synthetic":
            return [
                {
                    "timestamp": datetime.utcnow().isoformat(),
                    "lat": lat,
                    "lon": lon,
                    "temperature_c": -12.5,
                    "wind_speed_knots": 25.0,
                    "wind_direction": 180,
                    "visibility_km": 2.5,
                    "wave_height_m": 4.2,
                    "source": "synthetic"
                }
            ]
        return []
        
    def normalize(self, raw_data: List[Any]) -> List[Dict[str, Any]]:
        return raw_data
