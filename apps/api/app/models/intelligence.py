"""
POLARONE Intelligence Center Database Models.
Implements the 19 required database entities for the operational Satellite + AI Intelligence Center:
1. SatelliteProvider
2. Satellite
3. Sensor
4. SatelliteScene
5. SceneMetadata
6. AOI
7. ProcessingJob
8. SatelliteFeature
9. IceObservation
10. WeatherObservation
11. VesselObservation
12. RiskAssessment
13. AIInference
14. ModelRegistry
15. ModelMetric
16. IntelligenceAlert
17. DataQualityEvent
18. ScenarioSimulation
19. IntelligenceEvent
"""

import uuid
from datetime import datetime, timezone
from typing import Dict, Any, Optional
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..db.models import Base

def utc_now_dt():
    return datetime.now(timezone.utc)

class SatelliteProvider(Base):
    __tablename__ = "satellite_providers"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    code = Column(String, unique=True, nullable=False, index=True) # e.g. ESA_COPERNICUS, NASA_USGS, PLANET, ICEYE, CAPELLA
    name = Column(String, nullable=False)
    provider_type = Column(String, default="PUBLIC") # PUBLIC, COMMERCIAL, INTERGOVERNMENTAL
    api_endpoint = Column(String, nullable=True)
    auth_type = Column(String, default="API_KEY") # API_KEY, OAUTH2, PUBLIC_STAC
    status = Column(String, default="HEALTHY") # HEALTHY, DEGRADED, STALE, OFFLINE
    latency_ms = Column(Integer, default=140)
    created_at = Column(DateTime(timezone=True), default=utc_now_dt)
    
    satellites = relationship("Satellite", back_populates="provider")

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "code": self.code,
            "name": self.name,
            "provider_type": self.provider_type,
            "api_endpoint": self.api_endpoint,
            "auth_type": self.auth_type,
            "status": self.status,
            "latency_ms": self.latency_ms,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class Satellite(Base):
    __tablename__ = "satellites"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    provider_id = Column(String, ForeignKey("satellite_providers.id"), nullable=False)
    name = Column(String, nullable=False) # Sentinel-1A, Sentinel-2B, Landsat-9, Terra, ICEYE-X4
    family = Column(String, nullable=False) # SAR, Optical, Meteorological, Oceanographic, Derived
    norad_id = Column(Integer, nullable=True)
    orbit_type = Column(String, default="SSO") # Sun-synchronous, Polar
    altitude_km = Column(Float, default=693.0)
    inclination_deg = Column(Float, default=98.18)
    revisit_days = Column(Float, default=6.0)
    status = Column(String, default="OPERATIONAL") # OPERATIONAL, STANDBY, DECOMMISSIONED
    
    provider = relationship("SatelliteProvider", back_populates="satellites")
    sensors = relationship("Sensor", back_populates="satellite")
    scenes = relationship("SatelliteScene", back_populates="satellite")

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "provider_id": self.provider_id,
            "name": self.name,
            "family": self.family,
            "norad_id": self.norad_id,
            "orbit_type": self.orbit_type,
            "altitude_km": self.altitude_km,
            "inclination_deg": self.inclination_deg,
            "revisit_days": self.revisit_days,
            "status": self.status
        }

class Sensor(Base):
    __tablename__ = "sensors"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    satellite_id = Column(String, ForeignKey("satellites.id"), nullable=False)
    name = Column(String, nullable=False) # C-SAR, MSI, OLI-2, MODIS, X-band SAR
    sensor_type = Column(String, nullable=False) # SAR, MULTISPECTRAL, HYPERSPECTRAL, THERMAL, ALTIMETER
    swath_width_km = Column(Float, default=250.0)
    best_resolution_m = Column(Float, default=10.0)
    polarizations = Column(JSON, nullable=True) # ["VV", "VH"] or bands
    modes = Column(JSON, nullable=True) # ["IW", "EW", "SM"]
    
    satellite = relationship("Satellite", back_populates="sensors")

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "satellite_id": self.satellite_id,
            "name": self.name,
            "sensor_type": self.sensor_type,
            "swath_width_km": self.swath_width_km,
            "best_resolution_m": self.best_resolution_m,
            "polarizations": self.polarizations,
            "modes": self.modes
        }

class AOI(Base):
    """Area of Interest polygon for Antarctic operations"""
    __tablename__ = "areas_of_interest"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False) # Davis Sea Approach, Prydz Bay, Ross Ice Shelf, Weddell Sea
    code = Column(String, unique=True, index=True)
    priority = Column(String, default="HIGH") # CRITICAL, HIGH, MEDIUM, LOW
    target_type = Column(String, default="SHIPPING_CORRIDOR") # SHIPPING_CORRIDOR, STATION_SURROUND, EXPEDITION_ROUTE
    bbox = Column(JSON, nullable=False) # [min_lon, min_lat, max_lon, max_lat]
    polygon_geojson = Column(JSON, nullable=True)
    center_lat = Column(Float, nullable=False)
    center_lon = Column(Float, nullable=False)
    active = Column(Boolean, default=True)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "code": self.code,
            "priority": self.priority,
            "target_type": self.target_type,
            "bbox": self.bbox,
            "polygon_geojson": self.polygon_geojson,
            "center_lat": self.center_lat,
            "center_lon": self.center_lon,
            "active": self.active
        }

class SatelliteScene(Base):
    __tablename__ = "satellite_scenes"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    scene_id = Column(String, unique=True, index=True, nullable=False) # e.g. S1A_IW_GRDH_1SDV_20260927T0415
    satellite_id = Column(String, ForeignKey("satellites.id"), nullable=False)
    aoi_id = Column(String, ForeignKey("areas_of_interest.id"), nullable=True)
    product_type = Column(String, nullable=False) # L2A Optical, GRD SAR, Surface Reflectance
    sensor_name = Column(String, nullable=False)
    acquisition_time = Column(DateTime(timezone=True), nullable=False, index=True)
    processing_time = Column(DateTime(timezone=True), nullable=True)
    resolution_m = Column(Float, default=10.0)
    cloud_cover_pct = Column(Float, default=0.0)
    coverage_pct = Column(Float, default=98.5)
    processing_status = Column(String, default="COMPLETED") # QUEUED, DOWNLOADING, PROCESSING, COMPLETED, FAILED, PARTIAL, STALE
    download_status = Column(String, default="SYNCED") # SYNCED, PENDING SYNC, STALE, LOCAL ONLY, CONFLICT
    ai_analysis_status = Column(String, default="READY") # READY, IN_PROGRESS, PENDING_REVIEW, FAILED
    preview_url = Column(String, nullable=True)
    raw_storage_uri = Column(String, nullable=True)
    processed_storage_uri = Column(String, nullable=True)
    bbox = Column(JSON, nullable=False) # [min_lon, min_lat, max_lon, max_lat]
    footprint_geojson = Column(JSON, nullable=True)
    
    satellite = relationship("Satellite", back_populates="scenes")
    scene_metadata = relationship("SceneMetadata", uselist=False, back_populates="scene")
    jobs = relationship("ProcessingJob", back_populates="scene")
    features = relationship("SatelliteFeature", back_populates="scene")

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "scene_id": self.scene_id,
            "satellite_id": self.satellite_id,
            "satellite_name": self.satellite.name if self.satellite else "Unknown",
            "aoi_id": self.aoi_id,
            "product_type": self.product_type,
            "sensor_name": self.sensor_name,
            "acquisition_time": self.acquisition_time.isoformat() if self.acquisition_time else None,
            "processing_time": self.processing_time.isoformat() if self.processing_time else None,
            "resolution_m": self.resolution_m,
            "cloud_cover_pct": self.cloud_cover_pct,
            "coverage_pct": self.coverage_pct,
            "processing_status": self.processing_status,
            "download_status": self.download_status,
            "ai_analysis_status": self.ai_analysis_status,
            "preview_url": self.preview_url,
            "bbox": self.bbox,
            "footprint_geojson": self.footprint_geojson
        }

class SceneMetadata(Base):
    __tablename__ = "scene_metadata"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    scene_id = Column(String, ForeignKey("satellite_scenes.id"), unique=True, nullable=False)
    solar_zenith_angle = Column(Float, nullable=True)
    solar_azimuth_angle = Column(Float, nullable=True)
    incidence_angle_near = Column(Float, nullable=True)
    incidence_angle_far = Column(Float, nullable=True)
    relative_orbit = Column(Integer, nullable=True)
    pass_direction = Column(String, default="DESCENDING") # ASCENDING, DESCENDING
    epsg_crs = Column(String, default="EPSG:3031") # Antarctic Polar Stereographic
    stac_properties = Column(JSON, nullable=True)
    band_wavelengths = Column(JSON, nullable=True)
    
    scene = relationship("SatelliteScene", back_populates="scene_metadata")

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "scene_id": self.scene_id,
            "solar_zenith_angle": self.solar_zenith_angle,
            "solar_azimuth_angle": self.solar_azimuth_angle,
            "incidence_angle_near": self.incidence_angle_near,
            "incidence_angle_far": self.incidence_angle_far,
            "relative_orbit": self.relative_orbit,
            "pass_direction": self.pass_direction,
            "epsg_crs": self.epsg_crs,
            "stac_properties": self.stac_properties,
            "band_wavelengths": self.band_wavelengths
        }

class ProcessingJob(Base):
    """Geospatial processing pipeline execution job"""
    __tablename__ = "processing_jobs"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    scene_id = Column(String, ForeignKey("satellite_scenes.id"), nullable=False)
    pipeline_stage = Column(String, nullable=False) # AOI_REQUEST, SCENE_DISCOVERY, DOWNLOAD, RAW_STORAGE, QUALITY_CHECK, PREPROCESSING, GEOREFERENCING, CLOUD_MASK, FEATURE_EXTRACTION, AI_ANALYSIS, RISK_ENGINE, INTELLIGENCE_PRODUCT
    status = Column(String, default="COMPLETED") # QUEUED, DOWNLOADING, PROCESSING, COMPLETED, FAILED, PARTIAL, STALE
    started_at = Column(DateTime(timezone=True), default=utc_now_dt)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    duration_ms = Column(Integer, default=1240)
    cpu_cores_used = Column(Integer, default=4)
    memory_mb_used = Column(Integer, default=2048)
    error_message = Column(Text, nullable=True)
    log_summary = Column(Text, nullable=True)
    
    scene = relationship("SatelliteScene", back_populates="jobs")

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "scene_id": self.scene_id,
            "pipeline_stage": self.pipeline_stage,
            "status": self.status,
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "duration_ms": self.duration_ms,
            "cpu_cores_used": self.cpu_cores_used,
            "memory_mb_used": self.memory_mb_used,
            "error_message": self.error_message,
            "log_summary": self.log_summary
        }

class SatelliteFeature(Base):
    """Extracted geospatial feature (sea-ice boundary, lead, ridge, floe)"""
    __tablename__ = "satellite_features"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    scene_id = Column(String, ForeignKey("satellite_scenes.id"), nullable=False)
    feature_type = Column(String, nullable=False) # ICE_EDGE, ICE_RIDGE, OPEN_LEAD, ICEBERG_FRAGMENT, FAST_ICE_ZONE
    confidence = Column(Float, default=0.88)
    geometry_geojson = Column(JSON, nullable=False)
    area_sq_km = Column(Float, default=120.5)
    mean_backscatter_db = Column(Float, nullable=True)
    ice_concentration_pct = Column(Float, default=78.0)
    roughness_metric = Column(Float, default=0.45)
    detected_at = Column(DateTime(timezone=True), default=utc_now_dt)
    
    scene = relationship("SatelliteScene", back_populates="features")

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "scene_id": self.scene_id,
            "feature_type": self.feature_type,
            "confidence": self.confidence,
            "geometry_geojson": self.geometry_geojson,
            "area_sq_km": self.area_sq_km,
            "mean_backscatter_db": self.mean_backscatter_db,
            "ice_concentration_pct": self.ice_concentration_pct,
            "roughness_metric": self.roughness_metric,
            "detected_at": self.detected_at.isoformat() if self.detected_at else None
        }

class IceObservation(Base):
    __tablename__ = "ice_observations"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    region_name = Column(String, nullable=False) # Davis Sea, Prydz Bay, Weddell Sea, Ross Sea
    sea_ice_concentration_pct = Column(Float, nullable=False) # 0-100
    previous_concentration_pct = Column(Float, nullable=False)
    change_pct = Column(Float, nullable=False)
    ice_extent_sq_km = Column(Float, default=1840000.0)
    ice_thickness_m = Column(Float, default=1.85)
    ice_drift_speed_knots = Column(Float, default=1.2)
    ice_drift_direction_deg = Column(Float, default=285.0)
    ice_class = Column(String, default="First-Year Heavy Pack") # Nilas, Grey, First-Year Medium, Multi-Year Ridge, Fast Ice
    ice_density = Column(String, default="0.91 g/cm³")
    ice_anomaly_sigma = Column(Float, default=+2.1) # standard deviations from 30y mean
    route_intersection_hazard = Column(String, default="HIGH") # NONE, LOW, MEDIUM, HIGH, IMPASSABLE
    ice_risk_score = Column(Integer, default=78) # 0-100
    ice_risk_level = Column(String, default="HIGH") # LOW, MEDIUM, HIGH, CRITICAL
    source_satellite = Column(String, default="Sentinel-1 SAR")
    last_satellite_observation = Column(DateTime(timezone=True), default=utc_now_dt)
    next_expected_observation = Column(DateTime(timezone=True), nullable=True)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "region_name": self.region_name,
            "sea_ice_concentration_pct": self.sea_ice_concentration_pct,
            "previous_concentration_pct": self.previous_concentration_pct,
            "change_pct": self.change_pct,
            "ice_extent_sq_km": self.ice_extent_sq_km,
            "ice_thickness_m": self.ice_thickness_m,
            "ice_drift_speed_knots": self.ice_drift_speed_knots,
            "ice_drift_direction_deg": self.ice_drift_direction_deg,
            "ice_class": self.ice_class,
            "ice_density": self.ice_density,
            "ice_anomaly_sigma": self.ice_anomaly_sigma,
            "route_intersection_hazard": self.route_intersection_hazard,
            "ice_risk_score": self.ice_risk_score,
            "ice_risk_level": self.ice_risk_level,
            "source_satellite": self.source_satellite,
            "last_satellite_observation": self.last_satellite_observation.isoformat() if self.last_satellite_observation else None,
            "next_expected_observation": self.next_expected_observation.isoformat() if self.next_expected_observation else None
        }

class WeatherObservation(Base):
    __tablename__ = "weather_observations"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    location_name = Column(String, nullable=False)
    lat = Column(Float, nullable=False)
    lon = Column(Float, nullable=False)
    temperature_c = Column(Float, nullable=False)
    wind_speed_knots = Column(Float, nullable=False)
    wind_direction_deg = Column(Float, default=180.0)
    wind_direction_cardinal = Column(String, default="S")
    visibility_km = Column(Float, default=1.5)
    precipitation_rate_mm_h = Column(Float, default=2.4)
    barometric_pressure_hpa = Column(Float, default=968.0)
    sea_state_douglas = Column(String, default="Rough (Code 5)")
    storm_conditions = Column(String, default="Katabatic Gale Warning")
    weather_risk_score = Column(Integer, default=74)
    route_weather_impact = Column(String, default="HEADWIND_SHEAR_DELAY")
    observed_at = Column(DateTime(timezone=True), default=utc_now_dt)
    forecast_horizon = Column(String, default="now") # now, +6h, +12h, +24h, +48h, +7d

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "location_name": self.location_name,
            "lat": self.lat,
            "lon": self.lon,
            "temperature_c": self.temperature_c,
            "wind_speed_knots": self.wind_speed_knots,
            "wind_direction_deg": self.wind_direction_deg,
            "wind_direction_cardinal": self.wind_direction_cardinal,
            "visibility_km": self.visibility_km,
            "precipitation_rate_mm_h": self.precipitation_rate_mm_h,
            "barometric_pressure_hpa": self.barometric_pressure_hpa,
            "sea_state_douglas": self.sea_state_douglas,
            "storm_conditions": self.storm_conditions,
            "weather_risk_score": self.weather_risk_score,
            "route_weather_impact": self.route_weather_impact,
            "observed_at": self.observed_at.isoformat() if self.observed_at else None,
            "forecast_horizon": self.forecast_horizon
        }

class VesselObservation(Base):
    """AIS + Satellite fused observation record"""
    __tablename__ = "vessel_observations"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    vessel_name = Column(String, nullable=False) # Polar Star, Aurora Explorer, Southern Cross, Arctic Voyager, Ocean Guardian
    imo_number = Column(String, nullable=False, index=True)
    ais_lat = Column(Float, nullable=False)
    ais_lon = Column(Float, nullable=False)
    heading_deg = Column(Float, default=145.0)
    speed_knots = Column(Float, default=6.2)
    design_speed_knots = Column(Float, default=14.0)
    route_name = Column(String, default="Cape Town -> Davis Station")
    destination = Column(String, default="Davis Station")
    ais_status = Column(String, default="ONLINE") # ONLINE, DEGRADED, STALE, OFFLINE
    satellite_obs_time = Column(DateTime(timezone=True), default=utc_now_dt)
    nearby_ice_level = Column(String, default="HIGH") # LOW, MEDIUM, HIGH, CRITICAL
    nearby_weather_summary = Column(String, default="45kt Headwind, Blinding Snow")
    route_risk_level = Column(String, default="HIGH") # LOW, MEDIUM, HIGH, CRITICAL
    predicted_delay_hours = Column(Float, default=14.5)
    ai_confidence_pct = Column(Float, default=84.0)
    anomaly_detected = Column(Boolean, default=True)
    anomaly_detail = Column(String, default="Hull resistance +38% above open water profile")
    telemetry_freshness = Column(String, default="18 min ago")
    sync_state = Column(String, default="SYNCED") # SYNCED, PENDING SYNC, STALE, LOCAL ONLY, CONFLICT

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "vessel_name": self.vessel_name,
            "imo_number": self.imo_number,
            "ais_lat": self.ais_lat,
            "ais_lon": self.ais_lon,
            "heading_deg": self.heading_deg,
            "speed_knots": self.speed_knots,
            "design_speed_knots": self.design_speed_knots,
            "route_name": self.route_name,
            "destination": self.destination,
            "ais_status": self.ais_status,
            "satellite_obs_time": self.satellite_obs_time.isoformat() if self.satellite_obs_time else None,
            "nearby_ice_level": self.nearby_ice_level,
            "nearby_weather_summary": self.nearby_weather_summary,
            "route_risk_level": self.route_risk_level,
            "predicted_delay_hours": self.predicted_delay_hours,
            "ai_confidence_pct": self.ai_confidence_pct,
            "anomaly_detected": self.anomaly_detected,
            "anomaly_detail": self.anomaly_detail,
            "telemetry_freshness": self.telemetry_freshness,
            "sync_state": self.sync_state
        }

class RiskAssessment(Base):
    __tablename__ = "risk_assessments"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    risk_category = Column(String, nullable=False) # Vessel Risk, Ice Risk, Weather Risk, Asset Risk, Station Risk, Cargo Risk, Mission Risk, Communication Risk
    risk_level = Column(String, default="HIGH") # LOW, MEDIUM, HIGH, CRITICAL
    risk_score = Column(Integer, default=82) # 0-100
    confidence = Column(Float, default=0.88)
    affected_asset = Column(String, nullable=False) # Polar Star, Davis Station Generator, Mawson Link
    affected_location = Column(String, nullable=False) # 68.5°S, 77.9°E (Prydz Bay)
    cause = Column(Text, nullable=False)
    potential_impact = Column(Text, nullable=False)
    recommended_investigation = Column(Text, nullable=False)
    evaluated_at = Column(DateTime(timezone=True), default=utc_now_dt)
    review_status = Column(String, default="PENDING_REVIEW") # PENDING_REVIEW, ACKNOWLEDGED, ESCALATED, DISMISSED

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "risk_category": self.risk_category,
            "risk_level": self.risk_level,
            "risk_score": self.risk_score,
            "confidence": self.confidence,
            "affected_asset": self.affected_asset,
            "affected_location": self.affected_location,
            "cause": self.cause,
            "potential_impact": self.potential_impact,
            "recommended_investigation": self.recommended_investigation,
            "evaluated_at": self.evaluated_at.isoformat() if self.evaluated_at else None,
            "review_status": self.review_status
        }

class AIInference(Base):
    __tablename__ = "ai_inferences"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    model_id = Column(String, nullable=False) # XGB_POLAR_ETA_v2.4, LGBM_DEMAND_FORECAST_v1.5, IF_TELEMETRY_ANOMALY_v2.0, AE_MULTIVARIATE_SENSOR_v1.1, SURVIVAL_RUL_WEIBULL_v1.0, KG_CASCADE_IMPACT_v1.2, ORTOOLS_ICE_NAV_v2.1
    prediction_title = Column(String, nullable=False)
    prediction_value = Column(String, nullable=False) # e.g. "+14.5 hours delay", "Remaining Useful Life: 410 hours"
    confidence = Column(Float, default=0.84)
    data_freshness = Column(String, default="18 min ago")
    risk_level = Column(String, default="HIGH")
    main_drivers = Column(JSON, nullable=False) # [{"factor": "Sea Ice Concentration", "impact": "+5.1 hrs", "percentage": 35}]
    input_data_summary = Column(JSON, nullable=True)
    explanation = Column(Text, nullable=False) # User facing explainability
    recommended_investigation = Column(Text, nullable=False)
    human_review_status = Column(String, default="REQUIRES_REVIEW") # REQUIRES_REVIEW, ACKNOWLEDGED, DISMISSED, ESCALATED
    advisory_notice = Column(String, default="AI ADVISORY - Human Review Required. AI outputs are advisory only and cannot execute vessel controls.")
    inferred_at = Column(DateTime(timezone=True), default=utc_now_dt)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "model_id": self.model_id,
            "prediction_title": self.prediction_title,
            "prediction_value": self.prediction_value,
            "confidence": self.confidence,
            "data_freshness": self.data_freshness,
            "risk_level": self.risk_level,
            "main_drivers": self.main_drivers,
            "input_data_summary": self.input_data_summary,
            "explanation": self.explanation,
            "recommended_investigation": self.recommended_investigation,
            "human_review_status": self.human_review_status,
            "advisory_notice": self.advisory_notice,
            "inferred_at": self.inferred_at.isoformat() if self.inferred_at else None
        }

class ModelRegistry(Base):
    __tablename__ = "model_registries"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    model_name = Column(String, nullable=False)
    model_id = Column(String, unique=True, index=True, nullable=False)
    model_family = Column(String, nullable=False) # XGBoost, LightGBM, Isolation Forest, Autoencoder, Survival Analysis, Graph Model, OR-Tools (NO Random Forest)
    version = Column(String, nullable=False)
    purpose = Column(String, nullable=False)
    training_dataset = Column(String, nullable=False)
    training_date = Column(DateTime(timezone=True), nullable=False)
    input_features = Column(JSON, nullable=False)
    output_schema = Column(String, nullable=False)
    evaluation_metrics = Column(JSON, nullable=False) # e.g. {"MAE": "1.2h", "RMSE": "2.1h", "R2": 0.89}
    current_status = Column(String, default="PRODUCTION") # PRODUCTION, SHADOW, RETRAINING, DEPRECATED
    last_inference = Column(DateTime(timezone=True), default=utc_now_dt)
    drift_status = Column(String, default="HEALTHY") # HEALTHY, WARNING, DEGRADED, RETRAIN REQUIRED

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "model_name": self.model_name,
            "model_id": self.model_id,
            "model_family": self.model_family,
            "version": self.version,
            "purpose": self.purpose,
            "training_dataset": self.training_dataset,
            "training_date": self.training_date.isoformat() if self.training_date else None,
            "input_features": self.input_features,
            "output_schema": self.output_schema,
            "evaluation_metrics": self.evaluation_metrics,
            "current_status": self.current_status,
            "last_inference": self.last_inference.isoformat() if self.last_inference else None,
            "drift_status": self.drift_status
        }

class ModelMetric(Base):
    __tablename__ = "model_metrics"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    model_id = Column(String, ForeignKey("model_registries.model_id"), nullable=False)
    prediction_drift_psi = Column(Float, default=0.03) # Population Stability Index
    feature_drift_ks = Column(Float, default=0.04) # Kolmogorov-Smirnov p-value / stat
    data_drift_score = Column(Float, default=0.02)
    model_accuracy = Column(Float, default=94.2)
    inference_latency_ms = Column(Float, default=32.4)
    failed_predictions_pct = Column(Float, default=0.01)
    confidence_distribution = Column(JSON, nullable=True) # e.g. {"high": 78, "medium": 18, "low": 4}
    recorded_at = Column(DateTime(timezone=True), default=utc_now_dt)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "model_id": self.model_id,
            "prediction_drift_psi": self.prediction_drift_psi,
            "feature_drift_ks": self.feature_drift_ks,
            "data_drift_score": self.data_drift_score,
            "model_accuracy": self.model_accuracy,
            "inference_latency_ms": self.inference_latency_ms,
            "failed_predictions_pct": self.failed_predictions_pct,
            "confidence_distribution": self.confidence_distribution,
            "recorded_at": self.recorded_at.isoformat() if self.recorded_at else None
        }

class IntelligenceAlert(Base):
    __tablename__ = "intelligence_alerts"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    alert_type = Column(String, nullable=False) # HIGH_ICE_RISK, SATELLITE_ANOMALY, VESSEL_ANOMALY, WEATHER_DETERIORATION, ICE_EXPANSION, TELEMETRY_ANOMALY, ROUTE_RISK_INCREASE, COMMUNICATION_DEGRADATION, STATION_OPERATIONAL_ANOMALY
    severity = Column(String, default="HIGH") # LOW, MEDIUM, HIGH, CRITICAL
    affected_entity = Column(String, nullable=False) # Polar Star, Davis Station, Cape Town-Davis Corridor
    source_satellite = Column(String, nullable=True) # Sentinel-1 SAR, Sentinel-2B
    observation_freshness = Column(String, default="18 min ago")
    risk_level = Column(String, default="HIGH")
    cause = Column(Text, nullable=False)
    recommended_action = Column(Text, nullable=False)
    status = Column(String, default="ACTIVE") # ACTIVE, ACKNOWLEDGED, RESOLVED, DISMISSED, ESCALATED
    human_reviewer = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now_dt)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "alert_type": self.alert_type,
            "severity": self.severity,
            "affected_entity": self.affected_entity,
            "source_satellite": self.source_satellite,
            "observation_freshness": self.observation_freshness,
            "risk_level": self.risk_level,
            "cause": self.cause,
            "recommended_action": self.recommended_action,
            "status": self.status,
            "human_reviewer": self.human_reviewer,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class DataQualityEvent(Base):
    __tablename__ = "data_quality_events"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    source_feed = Column(String, nullable=False) # Sentinel-1, Sentinel-2, AIS Stream, ECMWF Weather, Davis Station Telemetry
    issue_type = Column(String, nullable=False) # MISSING_DATA, STALE_DATA, INVALID_COORDINATES, CLOUD_CONTAMINATION, FAILED_DOWNLOAD, PROCESSING_FAILURE, SENSOR_ANOMALY, DUPLICATE_SCENE, INCONSISTENT_TIMESTAMPS
    status = Column(String, default="HEALTHY") # HEALTHY, DEGRADED, STALE, OFFLINE
    severity = Column(String, default="LOW")
    affected_records = Column(Integer, default=0)
    details = Column(Text, nullable=True)
    last_freshness = Column(String, default="12 sec ago")
    created_at = Column(DateTime(timezone=True), default=utc_now_dt)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "source_feed": self.source_feed,
            "issue_type": self.issue_type,
            "status": self.status,
            "severity": self.severity,
            "affected_records": self.affected_records,
            "details": self.details,
            "last_freshness": self.last_freshness,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class ScenarioSimulation(Base):
    """What-If Simulation object (Section 30)"""
    __tablename__ = "scenario_simulations"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    simulation_name = Column(String, nullable=False) # e.g. "Pack Ice Expansion +20% & 50kt Katabatic Gale"
    ice_delta_pct = Column(Float, default=20.0)
    wind_delta_knots = Column(Float, default=15.0)
    engine_derate_pct = Column(Float, default=0.0)
    affected_vessel = Column(String, default="Polar Star")
    affected_station = Column(String, default="Davis Station")
    simulated_eta_impact_hours = Column(Float, default=26.4)
    simulated_fuel_impact_tons = Column(Float, default=42.8)
    cargo_impact_summary = Column(Text, nullable=True)
    mission_risk_rating = Column(String, default="HIGH")
    disclaimer = Column(String, default="SIMULATION / ADVISORY - Not an automatic operational command.")
    created_at = Column(DateTime(timezone=True), default=utc_now_dt)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "simulation_name": self.simulation_name,
            "ice_delta_pct": self.ice_delta_pct,
            "wind_delta_knots": self.wind_delta_knots,
            "engine_derate_pct": self.engine_derate_pct,
            "affected_vessel": self.affected_vessel,
            "affected_station": self.affected_station,
            "simulated_eta_impact_hours": self.simulated_eta_impact_hours,
            "simulated_fuel_impact_tons": self.simulated_fuel_impact_tons,
            "cargo_impact_summary": self.cargo_impact_summary,
            "mission_risk_rating": self.mission_risk_rating,
            "disclaimer": self.disclaimer,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class IntelligenceEvent(Base):
    """Immutable audit log event for all intelligence actions and HITL steps"""
    __tablename__ = "intelligence_events"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    event_type = Column(String, nullable=False) # PREDICTION_GENERATED, ALERT_ACKNOWLEDGED, RECOMMENDATION_APPROVED, DATA_QUALITY_DEGRADED, SCENARIO_SIMULATED
    actor = Column(String, default="System (AI Pipeline)")
    actor_role = Column(String, default="AI Engine") # Commander, Operations, Analyst, Data Scientist, Engineer, Administrator, Viewer
    model_id = Column(String, nullable=True)
    model_version = Column(String, nullable=True)
    source_satellite = Column(String, nullable=True)
    confidence = Column(Float, nullable=True)
    input_timestamp = Column(DateTime(timezone=True), nullable=True)
    action_taken = Column(String, nullable=False)
    review_status = Column(String, default="RECORDED")
    details_json = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now_dt)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "event_type": self.event_type,
            "actor": self.actor,
            "actor_role": self.actor_role,
            "model_id": self.model_id,
            "model_version": self.model_version,
            "source_satellite": self.source_satellite,
            "confidence": self.confidence,
            "input_timestamp": self.input_timestamp.isoformat() if self.input_timestamp else None,
            "action_taken": self.action_taken,
            "review_status": self.review_status,
            "details": self.details_json,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
