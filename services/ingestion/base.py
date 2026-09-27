from abc import ABC, abstractmethod
from typing import Any, Dict, List
import logging

logger = logging.getLogger(__name__)

class DataProvider(ABC):
    """
    Base class for all data ingestion providers.
    """
    
    def __init__(self, name: str):
        self.name = name
        
    @abstractmethod
    def connect(self) -> bool:
        """Initialize connection to the data source."""
        pass
        
    @abstractmethod
    def fetch_data(self, **kwargs) -> List[Dict[str, Any]]:
        """Fetch data from the source."""
        pass

    def ingest(self, **kwargs) -> List[Dict[str, Any]]:
        """
        Standard ingestion pipeline: connect, fetch, normalize.
        """
        if not self.connect():
            logger.error(f"[{self.name}] Failed to connect.")
            return []
            
        raw_data = self.fetch_data(**kwargs)
        normalized_data = self.normalize(raw_data)
        logger.info(f"[{self.name}] Ingested {len(normalized_data)} records.")
        return normalized_data
        
    @abstractmethod
    def normalize(self, raw_data: List[Any]) -> List[Dict[str, Any]]:
        """Normalize raw data into the standard operational model."""
        pass
