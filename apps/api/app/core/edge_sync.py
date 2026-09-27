from typing import Dict, Any, List
from datetime import datetime
from loguru import logger

class ConflictPolicy:
    EDGE_WINS = "EDGE_WINS"
    CLOUD_WINS = "CLOUD_WINS"
    MANUAL_MERGE = "MANUAL_MERGE"
    LATEST_TIMESTAMP = "LATEST_TIMESTAMP"

class EdgeSyncEngine:
    """
    Phase 58, 59, 60: Store-and-Forward, Data Synchronization, and Conflict Resolution Engine.
    Handles the complexities of merging offline edge data with global cloud data.
    """
    
    def __init__(self):
        # In a real scenario, these would map to DB tables
        self.conflict_log = []
        self.sync_queue = []
        
    def resolve_conflict(self, entity_type: str, edge_data: Dict, cloud_data: Dict) -> Dict:
        """
        Phase 60: Determines who wins when data changes in both places during a blackout.
        """
        policy = self._determine_policy(entity_type)
        logger.info(f"Conflict detected for {entity_type}. Applying policy: {policy}")
        
        resolution = {}
        if policy == ConflictPolicy.EDGE_WINS:
            resolution = edge_data
            winner = "EDGE"
        elif policy == ConflictPolicy.CLOUD_WINS:
            resolution = cloud_data
            winner = "CLOUD"
        elif policy == ConflictPolicy.LATEST_TIMESTAMP:
            edge_ts = datetime.fromisoformat(edge_data.get("updated_at", "2000-01-01T00:00:00"))
            cloud_ts = datetime.fromisoformat(cloud_data.get("updated_at", "2000-01-01T00:00:00"))
            resolution = edge_data if edge_ts > cloud_ts else cloud_data
            winner = "EDGE" if edge_ts > cloud_ts else "CLOUD"
        else:
            # MANUAL_MERGE requires human intervention
            resolution = cloud_data # Default to cloud while awaiting manual review
            winner = "PENDING_HUMAN_REVIEW"
            
        # Audit log the conflict
        self.conflict_log.append({
            "timestamp": datetime.utcnow().isoformat(),
            "entity": entity_type,
            "policy_applied": policy,
            "winner": winner,
            "edge_value": edge_data,
            "cloud_value": cloud_data
        })
        
        return resolution

    def _determine_policy(self, entity_type: str) -> str:
        """Assigns the correct policy based on operational reality"""
        policies = {
            "PHYSICAL_INVENTORY": ConflictPolicy.EDGE_WINS, # The people physically holding the gear know best
            "STATION_POWER_STATUS": ConflictPolicy.EDGE_WINS,
            "GLOBAL_MISSION_DIRECTIVE": ConflictPolicy.CLOUD_WINS, # Command Center controls overarching missions
            "SATELLITE_WEATHER": ConflictPolicy.CLOUD_WINS,
            "CREW_MANIFEST": ConflictPolicy.LATEST_TIMESTAMP,
            "EMERGENCY_DECLARATION": ConflictPolicy.MANUAL_MERGE # Never auto-resolve emergencies
        }
        return policies.get(entity_type, ConflictPolicy.LATEST_TIMESTAMP)

    def prioritize_telemetry(self, buffered_events: List[Dict]) -> List[Dict]:
        """
        Phase 64: Communication-Aware Data Prioritization.
        Sorts the outbound sync queue so life-critical data uses the limited bandwidth first.
        """
        priority_map = {
            "DISTRESS_SOS": 1,
            "AI_CRITICAL_ANOMALY": 1,
            "MISSION_ABORT": 2,
            "ASSET_FAILURE": 2,
            "SHIP_POSITION": 3,
            "ROUTINE_INVENTORY": 4,
            "HISTORICAL_LOGS": 5
        }
        
        # Sort by priority (1 is highest), then by timestamp
        sorted_queue = sorted(
            buffered_events, 
            key=lambda x: (priority_map.get(x.get("event_type", "HISTORICAL_LOGS"), 5), x.get("timestamp", ""))
        )
        return sorted_queue
