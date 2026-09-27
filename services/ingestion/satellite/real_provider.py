import requests
from typing import List, Dict, Any
from datetime import datetime
from ..base import DataProvider
import logging

logger = logging.getLogger(__name__)

class RealSentinelProvider(DataProvider):
    """
    Real Satellite Data Provider fetching STAC metadata from Earth Search (Element 84) AWS.
    Collection: Sentinel-2 L2A.
    """
    
    def __init__(self):
        super().__init__(name="RealSentinelProvider")
        self.stac_url = "https://earth-search.aws.element84.com/v1/search"
        
    def connect(self) -> bool:
        # Check if STAC API is reachable
        try:
            res = requests.get("https://earth-search.aws.element84.com/v1")
            return res.status_code == 200
        except Exception:
            return False
            
    def fetch_data(self, bbox: List[float] = None, **kwargs) -> List[Dict[str, Any]]:
        """
        Fetch recent Sentinel-2 acquisitions over the given bbox.
        Default bbox is near Davis Station Antarctica.
        """
        search_bbox = bbox or [76.0, -70.0, 79.0, -67.0] 
        
        payload = {
            "collections": ["sentinel-2-l2a"],
            "bbox": search_bbox,
            "limit": 5
        }
        
        try:
            response = requests.post(self.stac_url, json=payload, timeout=10)
            if response.status_code == 200:
                data = response.json()
                return data.get("features", [])
            else:
                logger.error(f"STAC API Error: {response.text}")
                return []
        except Exception as e:
            logger.error(f"Failed to fetch satellite data: {e}")
            return []
            
    def normalize(self, raw_data: List[Any]) -> List[Dict[str, Any]]:
        normalized = []
        for feature in raw_data:
            props = feature.get("properties", {})
            normalized.append({
                "id": feature.get("id"),
                "satellite": props.get("platform", "Sentinel-2"),
                "acquisition_time": props.get("datetime"),
                "cloud_cover": props.get("eo:cloud_cover", 0.0),
                "resolution_m": 10.0,
                "product_type": "L2A (Optical)",
                "bbox": feature.get("bbox"),
                "data_url": feature.get("assets", {}).get("visual", {}).get("href", ""),
                "processing_status": "PROCESSED",
                "derived_features": [] # Placeholder for future ML extraction
            })
        return normalized
