import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))
from ingestion.base import DataProvider
from typing import Any, Dict, List
from datetime import datetime

class AISProvider(DataProvider):
    """
    AIS Ship Position Provider.
    """
    
    def __init__(self, mode="synthetic"):
        super().__init__(name="AISProvider")
        self.mode = mode
        
    def connect(self) -> bool:
        return True
        
    def fetch_data(self, **kwargs) -> List[Dict[str, Any]]:
        if self.mode == "synthetic":
            # In a real scenario, this reads from an API or the synthetic CSV
            import uuid
            return [
                {
                    "mmsi": "123456789",
                    "imo": "IMO9123456",
                    "timestamp": datetime.utcnow().isoformat(),
                    "lat": -65.0,
                    "lon": 70.0,
                    "speed": 8.1,
                    "heading": 112.0,
                    "status": "In Transit"
                }
            ]
        return []
        
    def normalize(self, raw_data: List[Any]) -> List[Dict[str, Any]]:
        # Normalize into the standard ship position schema
        normalized = []
        for record in raw_data:
            normalized.append({
                "imo": record.get("imo"),
                "timestamp": record.get("timestamp"),
                "latitude": record.get("lat"),
                "longitude": record.get("lon"),
                "speed": record.get("speed"),
                "heading": record.get("heading"),
                "status": record.get("status")
            })
        return normalized
