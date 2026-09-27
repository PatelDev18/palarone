import requests
from typing import List, Dict, Any
from datetime import datetime
from ..base import DataProvider
import logging

logger = logging.getLogger(__name__)

class RealWeatherProvider(DataProvider):
    """
    Real Weather Data Provider fetching from Open-Meteo API.
    """
    
    def __init__(self):
        super().__init__(name="RealWeatherProvider")
        self.api_url = "https://api.open-meteo.com/v1/forecast"
        
    def connect(self) -> bool:
        try:
            res = requests.get(f"{self.api_url}?latitude=-65.0&longitude=70.0&current_weather=true")
            return res.status_code == 200
        except Exception:
            return False
            
    def fetch_data(self, **kwargs) -> List[Dict[str, Any]]:
        """
        Fetch current weather and forecast for Davis Station vicinity.
        """
        lat = kwargs.get("lat", -68.57) # Davis Station Lat
        lon = kwargs.get("lon", 77.96)  # Davis Station Lon
        
        params = {
            "latitude": lat,
            "longitude": lon,
            "current_weather": "true",
            "hourly": "temperature_2m,windspeed_10m,precipitation",
            "timezone": "UTC",
            "forecast_days": 3
        }
        
        try:
            response = requests.get(self.api_url, params=params, timeout=10)
            if response.status_code == 200:
                return [response.json()]
            else:
                logger.error(f"Open-Meteo API Error: {response.text}")
                return []
        except Exception as e:
            logger.error(f"Failed to fetch weather data: {e}")
            return []
            
    def normalize(self, raw_data: List[Any]) -> List[Dict[str, Any]]:
        normalized = []
        for feature in raw_data:
            current = feature.get("current_weather", {})
            hourly = feature.get("hourly", {})
            
            # Extract simple forecast (e.g. 12 hours from now)
            forecast = []
            if hourly and "time" in hourly:
                for i in [12, 24, 48]:
                    if i < len(hourly["time"]):
                        forecast.append({
                            "time": hourly["time"][i],
                            "temperature_c": hourly["temperature_2m"][i],
                            "wind_speed_knots": round(hourly["windspeed_10m"][i] * 0.539957, 1), # km/h to knots
                            "precipitation_mm": hourly["precipitation"][i]
                        })

            normalized.append({
                "source": "Open-Meteo",
                "latitude": feature.get("latitude"),
                "longitude": feature.get("longitude"),
                "temperature_c": current.get("temperature"),
                "wind_speed_knots": round(current.get("windspeed", 0) * 0.539957, 1),
                "wind_direction": current.get("winddirection"),
                "timestamp": current.get("time"),
                "forecast": forecast
            })
        return normalized
