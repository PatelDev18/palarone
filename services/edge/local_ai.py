import numpy as np
from datetime import datetime
from typing import Dict, List, Any
from loguru import logger

class EdgeAnomalyDetector:
    """
    Phase 71: Offline AI / ML at the Edge
    Runs directly on the local station/ship hardware.
    Instead of sending raw 100Hz telemetry to the cloud (which is impossible over Iridium),
    it runs local inference. If it catches a micro-anomaly, it triggers a Priority 1 sync event.
    """
    
    def __init__(self, model_version: str = "v1.2.0-edge"):
        self.model_version = model_version
        self.telemetry_buffer = []
        self.rolling_window_size = 60 # Store last 60 readings locally
        
        # In a real scenario, this would load a lightweight TFLite or ONNX model
        logger.info(f"Initialized Edge AI Anomaly Detector (Model: {self.model_version})")

    def process_sensor_reading(self, reading: Dict[str, Any]) -> Dict[str, Any]:
        """
        Receives high-frequency local telemetry, adds it to the rolling window,
        and evaluates it for anomalies.
        """
        self.telemetry_buffer.append(reading)
        if len(self.telemetry_buffer) > self.rolling_window_size:
            self.telemetry_buffer.pop(0)
            
        is_anomalous, confidence, reason = self._local_inference(reading)
        
        if is_anomalous:
            logger.warning(f"Edge AI Detected Anomaly: {reason} (Confidence: {confidence})")
            return self._generate_priority_event(reading, confidence, reason)
            
        return None

    def _local_inference(self, current_reading: Dict[str, Any]) -> tuple:
        """
        Simulates an Isolation Forest or lightweight statistical model running at the edge.
        Looks for micro-spikes that would normally be lost in downsampled 5-minute cloud batches.
        """
        if len(self.telemetry_buffer) < 10:
            return False, 0.0, "Insufficient baseline data"
            
        value = current_reading.get("value", 0)
        sensor_type = current_reading.get("sensor_type", "unknown")
        
        # Calculate local mean and std dev dynamically
        recent_values = [r.get("value", 0) for r in self.telemetry_buffer[:-1]]
        mean = np.mean(recent_values)
        std = np.std(recent_values)
        
        # If std is 0 (all values identical), avoid division by zero
        if std == 0:
            std = 0.01
            
        z_score = abs(value - mean) / std
        
        # Catch micro-spikes (e.g. Generator temp shoots up suddenly for 2 seconds)
        if z_score > 3.5:
            confidence = min(0.99, 0.50 + (z_score * 0.1))
            return True, round(confidence, 2), f"{sensor_type} deviation (Z={round(z_score, 1)})"
            
        return False, 0.0, ""

    def _generate_priority_event(self, reading: Dict[str, Any], confidence: float, reason: str) -> Dict[str, Any]:
        """
        Phase 64: Communication-Aware Prioritization.
        This wraps the anomaly in a high-priority envelope that forces the EdgeSyncEngine
        to push it over the satellite link immediately, bypassing the normal batch schedule.
        """
        return {
            "event_type": "AI_CRITICAL_ANOMALY",
            "priority": 1,
            "timestamp": datetime.utcnow().isoformat(),
            "source_hardware": reading.get("device_id", "unknown_edge_device"),
            "model_version": self.model_version,
            "details": {
                "reading": reading,
                "reason": reason,
                "confidence": confidence
            },
            "sync_status": "PENDING_URGENT_TRANSMISSION"
        }
