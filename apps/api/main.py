from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator
from loguru import logger
import time

from app.core.config import settings

app = FastAPI(
    title="POLARONE API",
    description="Polar Operations Intelligence Platform API (Production V2)",
    version="1.0.0",
)

# Phase 50: Security & CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Phase 50: Observability (Structured Logging)
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    logger.info(f"{request.method} {request.url.path} - Status: {response.status_code} - Latency: {process_time:.4f}s")
    return response

# Phase 50: Observability (Metrics)
Instrumentator().instrument(app).expose(app)

from app.api.v1 import auth, ships, satellite, digital_twin, predictions, logistics, operations, maintenance, incidents, reporting, copilot, demo, websockets, weather, ml_registry, optimization, telemetry, command_center, expeditions, analytics, intelligence
from app.db.database import init_db
import asyncio

app.include_router(intelligence.router, prefix="/api/v1/intelligence", tags=["intelligence"])
app.include_router(intelligence.router, prefix="/api/intelligence", tags=["intelligence"])
app.include_router(intelligence.router, prefix="/intelligence", tags=["intelligence"])
app.include_router(intelligence.router, prefix="/api", tags=["intelligence-direct"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["analytics"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])
app.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
app.include_router(expeditions.router, prefix="/api/v1/expeditions", tags=["expeditions"])
app.include_router(expeditions.router, prefix="/api/expeditions", tags=["expeditions"])
app.include_router(expeditions.router, prefix="/expeditions", tags=["expeditions"])
app.include_router(command_center.router, prefix="/api/v1/command-center", tags=["command-center"])
app.include_router(command_center.router, prefix="/api/command-center", tags=["command-center"])
app.include_router(command_center.router, prefix="/command-center", tags=["command-center"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["authentication"])
app.include_router(ships.router, prefix="/api/v1/ships", tags=["ships"])
app.include_router(satellite.router, prefix="/api/v1/satellite", tags=["satellite"])
app.include_router(digital_twin.router, prefix="/api/v1/digital-twin", tags=["digital-twin"])
app.include_router(digital_twin.router, prefix="/api/digital-twin", tags=["digital-twin"])
app.include_router(digital_twin.router, prefix="/digital-twin", tags=["digital-twin"])
app.include_router(predictions.router, prefix="/api/v1/predictions", tags=["predictions"])
app.include_router(logistics.router, prefix="/api/v1/logistics", tags=["logistics"])
app.include_router(logistics.router, prefix="/api/logistics", tags=["logistics"])
app.include_router(logistics.router, prefix="/logistics", tags=["logistics"])
app.include_router(operations.router, prefix="/api/v1/operations", tags=["operations"])
app.include_router(maintenance.router, prefix="/api/v1/maintenance", tags=["maintenance"])
app.include_router(incidents.router, prefix="/api/v1/incidents", tags=["incidents"])
app.include_router(incidents.router, prefix="/api/incidents", tags=["incidents-direct"])
app.include_router(incidents.router, prefix="/incidents", tags=["incidents"])
app.include_router(reporting.router, prefix="/api/v1/reporting", tags=["reporting"])
app.include_router(copilot.router, prefix="/api/v1/copilot", tags=["copilot"])
app.include_router(demo.router, prefix="/api/v1/demo", tags=["demo"])
app.include_router(websockets.router, tags=["websockets"])
app.include_router(weather.router, prefix="/api/v1/weather", tags=["weather"])
app.include_router(ml_registry.router, prefix="/api/v1/ml", tags=["ml_registry"])
app.include_router(optimization.router, prefix="/api/v1/optimization", tags=["optimization"])

# Phase 49: IoT & Sensor Telemetry Gateway
app.include_router(telemetry.router, prefix="/api/v1/telemetry", tags=["telemetry"])

@app.on_event("startup")
async def startup_event():
    logger.info("Initializing POLARONE API Services...")
    init_db()  # Phase 1: Create DB tables on startup
    # Start the background AIS stream
    asyncio.create_task(websockets.stream_ais_data())

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "version": app.version, "db_connected": True}

@app.get("/")
async def root():
    return {"message": "Welcome to POLARONE API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
