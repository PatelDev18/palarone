from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List, Dict, Any
import asyncio
import json
import random
from datetime import datetime

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception:
                # Handle disconnected clients
                pass

manager = ConnectionManager()

# Background task to simulate live AIS data streaming
async def stream_ais_data():
    """
    Simulates a live AIS stream pushing updates to connected clients.
    In production, this would consume from Kafka/Redis streams.
    """
    ships = [
        {"id": "1", "name": "Polar Star", "lon": 70.0, "lat": -65.0, "status": "In Transit", "speed": 8.1, "heading": 112},
        {"id": "2", "name": "Aurora Explorer", "lon": 60.0, "lat": -62.0, "status": "In Transit", "speed": 12.4, "heading": 180},
    ]
    
    while True:
        await asyncio.sleep(5) # Broadcast every 5 seconds
        if not manager.active_connections:
            continue
            
        events = []
        for ship in ships:
            # Simulate slight movement
            ship["lon"] += random.uniform(-0.05, 0.05)
            ship["lat"] += random.uniform(-0.02, 0.02)
            
            events.append({
                "type": "AIS_UPDATE",
                "data": {
                    "mmsi": f"MMSI_{ship['id']}",
                    "imo": f"IMO_{ship['id']}",
                    "ship_id": ship["id"],
                    "name": ship["name"],
                    "longitude": round(ship["lon"], 4),
                    "latitude": round(ship["lat"], 4),
                    "speed": round(ship["speed"] + random.uniform(-0.2, 0.2), 1),
                    "heading": ship["heading"],
                    "status": ship["status"],
                    "timestamp": datetime.utcnow().isoformat()
                }
            })
            
        await manager.broadcast(json.dumps({"events": events}))

@router.websocket("/ws/operations")
async def websocket_operations(websocket: WebSocket):
    """
    Unified WebSocket endpoint for operational intelligence (AIS, Alerts, etc.)
    """
    await manager.connect(websocket)
    try:
        while True:
            # In a real scenario, clients might send filter criteria
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
