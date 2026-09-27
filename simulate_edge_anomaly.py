import time
import random
from services.edge.local_ai import EdgeAnomalyDetector
from apps.api.app.core.edge_sync import EdgeSyncEngine

def run_simulation():
    print("--- POLARONE EDGE AI SIMULATION (PHASE 71 & 64) ---")
    print("Simulating a remote generator sensor over a constrained satellite link...\n")
    
    ai_detector = EdgeAnomalyDetector()
    sync_engine = EdgeSyncEngine()
    
    # Simulate normal generator temperature readings (~40 C)
    for i in range(15):
        reading = {
            "device_id": "STATION-DAVIS-GEN1",
            "sensor_type": "exhaust_temp",
            "value": 40.0 + random.uniform(-1.0, 1.0)
        }
        ai_detector.process_sensor_reading(reading)
    
    print("[EDGE] Baseline temperature established (40C). Normal readings buffered locally.")
    
    # Introduce a 2-second micro-spike (e.g. 85C)
    print("\n[EDGE] WARNING: Micro-spike occurs in hardware...")
    spike_reading = {
        "device_id": "STATION-DAVIS-GEN1",
        "sensor_type": "exhaust_temp",
        "value": 85.0
    }
    
    anomaly_event = ai_detector.process_sensor_reading(spike_reading)
    
    if anomaly_event:
        print(f"\n[EDGE AI] Detected Anomaly: {anomaly_event['details']['reason']}")
        print(f"[EDGE AI] Model Version: {anomaly_event['model_version']}")
        print(f"[EDGE AI] Wrapping as Priority {anomaly_event['priority']} Event.")
        
        # Add to the outbound sync queue alongside routine data
        outbound_queue = [
            {"event_type": "ROUTINE_INVENTORY", "timestamp": "2026-09-27T00:00:00Z"},
            anomaly_event,
            {"event_type": "SHIP_POSITION", "timestamp": "2026-09-27T00:05:00Z"}
        ]
        
        print("\n[SYNC ENGINE] Prioritizing constrained bandwidth queue:")
        prioritized = sync_engine.prioritize_telemetry(outbound_queue)
        for idx, event in enumerate(prioritized):
            print(f"  Tx Order {idx+1}: {event['event_type']}")
            
        print("\n[RESULT] The micro-anomaly was successfully caught locally and prioritized for immediate satellite transmission!")

if __name__ == "__main__":
    run_simulation()
