from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any

router = APIRouter()

class TelemetryData(BaseModel):
    asset_id: str
    temperature: float
    vibration: float
    rpm: float
    pressure: float

@router.post("/")
def ingest_telemetry(data: TelemetryData) -> Dict[str, Any]:
    """
    IoT & Sensor Telemetry Gateway (Phase 49).
    Ingests raw sensor data and triggers Anomaly Detection.
    """
    # Simple simulated risk calculation based on thresholds
    is_anomaly = data.vibration > 15.0 or data.temperature > 90.0 or data.rpm < 1000.0
    risk_score = min(1.0, (data.vibration / 20.0 + data.temperature / 100.0) / 2)
    
    return {
        "status": "ingested",
        "asset_id": data.asset_id,
        "anomaly_detected": is_anomaly,
        "risk_score": round(risk_score, 2),
        "action": "trigger_maintenance_task" if is_anomaly else "log_metrics",
        "message": "Telemetry processed successfully via Message Layer."
    }
