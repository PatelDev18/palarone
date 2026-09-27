"""
POLARONE Intelligence Service Layer.
Comprehensive operational satellite, geospatial, and AI intelligence engine for Antarctic operations.
Follows all POLARONE guidelines:
- Multi-source data fusion (Satellite, AIS, Weather, Telemetry, Cargo, Historical)
- Strict SatelliteProvider abstraction (SAR, Optical, Meteorological, Commercial)
- Geospatial processing pipeline with 14 visible stages
- Machine learning models: XGBoost, LightGBM, Isolation Forest, Autoencoder, Survival Analysis, Graph Model, OR-Tools (STRICTLY NO RANDOM FOREST)
- Every prediction includes explainability ('WHY?'), confidence, drivers, advisory status, and HITL workflow
- Human-in-the-loop review, acknowledge, escalate, dismiss
- Seamless integration with Command Center, Digital Twin, and Analytics
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, timezone, timedelta
import uuid
import math

def utc_now() -> datetime:
    return datetime.now(timezone.utc)

def format_freshness(dt: datetime) -> str:
    now = utc_now()
    diff = now - dt
    total_seconds = int(diff.total_seconds())
    if total_seconds < 60:
        return f"{total_seconds} sec ago"
    elif total_seconds < 3600:
        return f"{total_seconds // 60} min ago"
    elif total_seconds < 86400:
        return f"{total_seconds // 3600} hrs ago"
    else:
        return f"{total_seconds // 86400} days ago"

class IntelligenceService:
    def __init__(self):
        self._init_providers()
        self._init_aois()
        self._init_scenes()
        self._init_pipeline()
        self._init_ice()
        self._init_weather()
        self._init_vessels()
        self._init_models()
        self._init_predictions()
        self._init_risks()
        self._init_alerts()
        self._init_data_quality()
        self._init_coverage_planner()
        self._init_time_machine()
        self._init_audit_log()

    def _init_providers(self):
        self.providers = [
            {
                "id": "PROV_ESA",
                "code": "ESA_COPERNICUS",
                "name": "ESA Copernicus Programme",
                "provider_type": "PUBLIC",
                "satellite_families": ["SAR (Sentinel-1)", "Optical Multispectral (Sentinel-2)", "Oceanographic (Sentinel-3)"],
                "api_endpoint": "https://earth-search.aws.element84.com/v1",
                "auth_type": "PUBLIC_STAC",
                "status": "HEALTHY",
                "latency_ms": 115,
                "data_policy": "Full, free, and open access (EU Copernicus)",
                "active_missions": ["Sentinel-1A", "Sentinel-1C", "Sentinel-2A", "Sentinel-2B", "Sentinel-3A"]
            },
            {
                "id": "PROV_USGS",
                "code": "NASA_USGS",
                "name": "USGS / NASA Earth Observation",
                "provider_type": "PUBLIC",
                "satellite_families": ["Optical / Thermal (Landsat-8/9)", "Environmental (MODIS Terra/Aqua)"],
                "api_endpoint": "https://landsatlook.usgs.gov/stac-server",
                "auth_type": "API_KEY",
                "status": "HEALTHY",
                "latency_ms": 142,
                "data_policy": "USGS Open Archive",
                "active_missions": ["Landsat-9 OLI-2", "Landsat-8 OLI", "Terra MODIS", "Aqua MODIS"]
            },
            {
                "id": "PROV_NOAA",
                "code": "NOAA_EUMETSAT",
                "name": "NOAA & EUMETSAT Polar Constellation",
                "provider_type": "INTERGOVERNMENTAL",
                "satellite_families": ["Meteorological & Sea Ice (VIIRS, AMSR2, MetOp)"],
                "api_endpoint": "https://data.noaa.gov/stac",
                "auth_type": "API_KEY",
                "status": "HEALTHY",
                "latency_ms": 160,
                "data_policy": "WMO / NOAA Open Exchange",
                "active_missions": ["NOAA-20 VIIRS", "NOAA-21 VIIRS", "MetOp-C ASCAT"]
            },
            {
                "id": "PROV_ICEYE",
                "code": "COMMERCIAL_ICEYE",
                "name": "ICEYE Commercial SAR Constellation",
                "provider_type": "COMMERCIAL",
                "satellite_families": ["High-Resolution X-band SAR (Sub-meter Dwell & Stripmap)"],
                "api_endpoint": "https://api.iceye.fi/v2/catalog",
                "auth_type": "API_KEY",
                "status": "HEALTHY",
                "latency_ms": 95,
                "data_policy": "Commercial On-Demand Tasking & Archive",
                "active_missions": ["ICEYE-X4", "ICEYE-X7", "ICEYE-X11"]
            },
            {
                "id": "PROV_PLANET",
                "code": "COMMERCIAL_PLANET",
                "name": "Planet Labs SkySat / PlanetScope",
                "provider_type": "COMMERCIAL",
                "satellite_families": ["Daily 3m Optical PlanetScope & 50cm SkySat Tasking"],
                "api_endpoint": "https://api.planet.com/data/v1",
                "auth_type": "OAUTH2",
                "status": "HEALTHY",
                "latency_ms": 108,
                "data_policy": "Commercial Subscription Tier",
                "active_missions": ["PlanetScope SuperDove Constellation", "SkySat High-Res Fleet"]
            }
        ]

    def _init_aois(self):
        self.aois = [
            {
                "id": "AOI_DAVIS_SEA",
                "code": "AOI_DAVIS",
                "name": "Davis Sea & Prydz Bay Corridor",
                "priority": "CRITICAL",
                "target_type": "SHIPPING_CORRIDOR",
                "center_lat": -68.57,
                "center_lon": 77.96,
                "bbox": [72.0, -70.0, 82.0, -65.0],
                "active_vessels": ["Polar Star"],
                "associated_stations": ["Davis Station", "Bharati Station"],
                "current_ice_risk": "HIGH"
            },
            {
                "id": "AOI_MAITRI_COAST",
                "code": "AOI_MAITRI",
                "name": "Princess Astrid Coast & Maitri Environs",
                "priority": "HIGH",
                "target_type": "STATION_APPROACH",
                "center_lat": -70.76,
                "center_lon": 11.73,
                "bbox": [8.0, -72.0, 16.0, -68.0],
                "active_vessels": ["Southern Cross"],
                "associated_stations": ["Maitri Station"],
                "current_ice_risk": "MEDIUM"
            },
            {
                "id": "AOI_CASEY_SEA",
                "code": "AOI_CASEY",
                "name": "Vincennes Bay & Casey Approach",
                "priority": "MEDIUM",
                "target_type": "SHIPPING_CORRIDOR",
                "center_lat": -66.28,
                "center_lon": 110.52,
                "bbox": [106.0, -68.0, 114.0, -64.0],
                "active_vessels": ["Aurora Explorer"],
                "associated_stations": ["Casey Station"],
                "current_ice_risk": "LOW"
            },
            {
                "id": "AOI_ROSS_SEA",
                "code": "AOI_MCMURDO",
                "name": "Ross Sea & McMurdo Sound Entrance",
                "priority": "HIGH",
                "target_type": "SHIPPING_CORRIDOR",
                "center_lat": -77.85,
                "center_lon": 166.66,
                "bbox": [162.0, -79.0, 172.0, -75.0],
                "active_vessels": ["Arctic Voyager"],
                "associated_stations": ["McMurdo Station"],
                "current_ice_risk": "MEDIUM"
            }
        ]

    def _init_scenes(self):
        now = utc_now()
        self.scenes = [
            {
                "id": "SCENE_S1A_001",
                "scene_id": "S1A_IW_GRDH_1SDV_20260927T1310_DAVIS_78F4",
                "satellite": "Sentinel-1A",
                "mission": "Copernicus Sentinel-1",
                "family": "SAR",
                "sensor": "C-SAR (C-band Radar)",
                "product_type": "GRD (Ground Range Detected)",
                "polarization": "VV + VH",
                "acquisition_time": (now - timedelta(minutes=18)).isoformat(),
                "processing_time": (now - timedelta(minutes=12)).isoformat(),
                "display_time": now.isoformat(),
                "aoi": "Davis Sea & Prydz Bay Corridor",
                "resolution": "10 m",
                "cloud_cover": 0, # SAR penetrates clouds
                "coverage_percentage": 99.2,
                "processing_status": "COMPLETED",
                "data_freshness": "18 min ago",
                "download_status": "SYNCED",
                "ai_analysis_status": "READY",
                "provider": "ESA Copernicus",
                "bbox": [74.5, -69.2, 79.8, -66.8],
                "footprint_geojson": {
                    "type": "Polygon",
                    "coordinates": [[[74.5, -69.2], [79.8, -69.2], [79.8, -66.8], [74.5, -66.8], [74.5, -69.2]]]
                },
                "preview_url": "/api/static/imagery/s1a_davis_sar_preview.png",
                "features_extracted": ["Heavy Pack Ridge (78% SIC)", "Sheared Fast-Ice Boundary", "Open Lead (Sector 4)", "Compressive Strain Zone"],
                "ai_risk_score": 82,
                "affected_vessel": "Polar Star",
                "recommendation_summary": "Divert 14nm northeast to exploit open lead in Sector 4."
            },
            {
                "id": "SCENE_S2B_002",
                "scene_id": "S2B_MSIL2A_20260927T0928_MAITRI_31L",
                "satellite": "Sentinel-2B",
                "mission": "Copernicus Sentinel-2",
                "family": "Optical",
                "sensor": "MSI (Multi-Spectral Instrument)",
                "product_type": "L2A (Bottom-of-Atmosphere Reflectance)",
                "polarization": "N/A (Bands B02-B12)",
                "acquisition_time": (now - timedelta(hours=3, minutes=15)).isoformat(),
                "processing_time": (now - timedelta(hours=2, minutes=58)).isoformat(),
                "display_time": now.isoformat(),
                "aoi": "Princess Astrid Coast & Maitri Environs",
                "resolution": "10 m",
                "cloud_cover": 18,
                "coverage_percentage": 94.6,
                "processing_status": "COMPLETED",
                "data_freshness": "3 hrs ago",
                "download_status": "SYNCED",
                "ai_analysis_status": "READY",
                "provider": "ESA Copernicus",
                "bbox": [10.2, -71.4, 13.8, -69.8],
                "footprint_geojson": {
                    "type": "Polygon",
                    "coordinates": [[[10.2, -71.4], [13.8, -71.4], [13.8, -69.8], [10.2, -69.8], [10.2, -71.4]]]
                },
                "preview_url": "/api/static/imagery/s2b_maitri_optical_preview.png",
                "features_extracted": ["Marginal Ice Zone", "Nilas Formation", "Snow Cover Reflectance: 0.88"],
                "ai_risk_score": 45,
                "affected_vessel": "Southern Cross",
                "recommendation_summary": "Clear visibility through open marginal leads."
            },
            {
                "id": "SCENE_LANDSAT9_003",
                "scene_id": "LC09_L2SP_098112_20260926_ROSS_02_T1",
                "satellite": "Landsat-9",
                "mission": "USGS / NASA Landsat Next",
                "family": "Optical / Thermal",
                "sensor": "OLI-2 / TIRS-2",
                "product_type": "L2SP (Surface Reflectance & Temperature)",
                "polarization": "N/A",
                "acquisition_time": (now - timedelta(hours=14, minutes=20)).isoformat(),
                "processing_time": (now - timedelta(hours=13, minutes=50)).isoformat(),
                "display_time": now.isoformat(),
                "aoi": "Ross Sea & McMurdo Sound Entrance",
                "resolution": "15 m Pan / 30 m Multi",
                "cloud_cover": 8,
                "coverage_percentage": 97.8,
                "processing_status": "COMPLETED",
                "data_freshness": "14 hrs ago",
                "download_status": "SYNCED",
                "ai_analysis_status": "READY",
                "provider": "USGS / NASA",
                "bbox": [164.0, -78.5, 169.5, -76.2],
                "footprint_geojson": {
                    "type": "Polygon",
                    "coordinates": [[[164.0, -78.5], [169.5, -78.5], [169.5, -76.2], [164.0, -76.2], [164.0, -78.5]]]
                },
                "preview_url": "/api/static/imagery/l9_ross_preview.png",
                "features_extracted": ["Shore Fast Ice", "Calving Iceberg Boundary B-22A", "Thermal Lead Opening"],
                "ai_risk_score": 52,
                "affected_vessel": "Arctic Voyager",
                "recommendation_summary": "Iceberg B-22A drift rate normal at 0.4 knots."
            },
            {
                "id": "SCENE_MODIS_004",
                "scene_id": "MODIS_TERRA_POLAR_COMPOSITE_20260927",
                "satellite": "Terra / MODIS",
                "mission": "NASA Earth Observing System",
                "family": "Meteorological & Broad-Area",
                "sensor": "MODIS 36-Band Spectroradiometer",
                "product_type": "MOD29 Sea Ice & Surface Temp",
                "polarization": "N/A",
                "acquisition_time": (now - timedelta(hours=6, minutes=45)).isoformat(),
                "processing_time": (now - timedelta(hours=6, minutes=10)).isoformat(),
                "display_time": now.isoformat(),
                "aoi": "Antarctic Continental Mosaic (Circumpolar)",
                "resolution": "250 m",
                "cloud_cover": 42,
                "coverage_percentage": 100.0,
                "processing_status": "COMPLETED",
                "data_freshness": "6 hrs ago",
                "download_status": "SYNCED",
                "ai_analysis_status": "READY",
                "provider": "NASA EOSDIS",
                "bbox": [-180.0, -90.0, 180.0, -60.0],
                "footprint_geojson": None,
                "preview_url": "/api/static/imagery/modis_circumpolar.png",
                "features_extracted": ["Continental Ice Sheet Margin", "Polar Vortex Cloud Band", "Southern Ocean Swell"],
                "ai_risk_score": 38,
                "affected_vessel": "All Fleet",
                "recommendation_summary": "Katabatic gale front tracking eastward along Queen Maud Land."
            },
            {
                "id": "SCENE_ICEYE_005",
                "scene_id": "ICEYE_X4_SLC_SM_20260927T1240_DAVIS_PINPOINT",
                "satellite": "ICEYE-X4 (Commercial)",
                "mission": "ICEYE Commercial SAR",
                "family": "SAR",
                "sensor": "X-band High-Res SAR",
                "product_type": "Stripmap 3m High-Fidelity",
                "polarization": "VV",
                "acquisition_time": (now - timedelta(minutes=48)).isoformat(),
                "processing_time": (now - timedelta(minutes=35)).isoformat(),
                "display_time": now.isoformat(),
                "aoi": "Davis Sea Tactical Fairway (Polar Star Bow Sector)",
                "resolution": "3 m",
                "cloud_cover": 0,
                "coverage_percentage": 100.0,
                "processing_status": "COMPLETED",
                "data_freshness": "48 min ago",
                "download_status": "SYNCED",
                "ai_analysis_status": "READY",
                "provider": "ICEYE Commercial",
                "bbox": [76.8, -68.8, 78.4, -67.9],
                "footprint_geojson": {
                    "type": "Polygon",
                    "coordinates": [[[76.8, -68.8], [78.4, -68.8], [78.4, -67.9], [76.8, -67.9], [76.8, -68.8]]]
                },
                "preview_url": "/api/static/imagery/iceye_pinpoint.png",
                "features_extracted": ["Pressure Ridge Keel Depth > 3.2m", "Micro-crack Network", "Navigable Polyna Corridor"],
                "ai_risk_score": 85,
                "affected_vessel": "Polar Star",
                "recommendation_summary": "Keel thickness ahead exceeds 3m; tactical maneuver required."
            }
        ]

    def _init_pipeline(self):
        now = utc_now()
        self.pipeline_stages = [
            {"step": 1, "name": "SATELLITE_PROVIDER", "label": "Satellite Provider API Connection", "status": "COMPLETED", "duration_ms": 115, "healthy": True, "details": "Connected to ESA Copernicus STAC & ICEYE Commercial Gateway"},
            {"step": 2, "name": "AOI_REQUEST", "label": "Antarctic AOI Polygons Validation", "status": "COMPLETED", "duration_ms": 45, "healthy": True, "details": "4 operational corridors active (Davis, Maitri, Casey, McMurdo)"},
            {"step": 3, "name": "SCENE_DISCOVERY", "label": "STAC Catalog Scene Discovery", "status": "COMPLETED", "duration_ms": 320, "healthy": True, "details": "5 candidate scenes matched temporal window (< 24h)"},
            {"step": 4, "name": "SCENE_METADATA", "label": "Metadata & Orbital Parameter Ingest", "status": "COMPLETED", "duration_ms": 180, "healthy": True, "details": "Incidence angle, orbit direction, sensor geometry parsed"},
            {"step": 5, "name": "DOWNLOAD_INGEST", "label": "Parallel Chunked Product Download", "status": "COMPLETED", "duration_ms": 2840, "healthy": True, "details": "Transferred 1.4 GB raw SAR & multispectral assets"},
            {"step": 6, "name": "RAW_STORAGE", "label": "GeoTIFF & Cloud-Optimized GeoTIFF Storage", "status": "COMPLETED", "duration_ms": 420, "healthy": True, "details": "Archived into immutable S3/Ceph object store"},
            {"step": 7, "name": "QUALITY_CHECK", "label": "Integrity Check & Band Completeness", "status": "COMPLETED", "duration_ms": 210, "healthy": True, "details": "Verified CRC32 checksums and band histogram distributions"},
            {"step": 8, "name": "PREPROCESSING", "label": "Radiometric Calibration & Filtering", "status": "COMPLETED", "duration_ms": 1950, "healthy": True, "details": "Lee-filter speckle suppression & sigma0 backscatter calibration"},
            {"step": 9, "name": "GEOREFERENCING", "label": "Terrain Correction & EPSG:3031 Projection", "status": "COMPLETED", "duration_ms": 1420, "healthy": True, "details": "Reprojected to Antarctic Polar Stereographic with REMA DEM"},
            {"step": 10, "name": "CLOUD_QUALITY_MASK", "label": "Fmask / SCL Cloud Masking (Optical)", "status": "COMPLETED", "duration_ms": 680, "healthy": True, "details": "Cloud contamination isolated for Sentinel-2 (18% cloud flag)"},
            {"step": 11, "name": "FEATURE_EXTRACTION", "label": "Sea-Ice Feature & Lead Extraction", "status": "COMPLETED", "duration_ms": 1150, "healthy": True, "details": "Extracted SIC contours, ice ridges, and open lead polygons"},
            {"step": 12, "name": "AI_ML_ANALYSIS", "label": "XGBoost & Isolation Forest Inference", "status": "COMPLETED", "duration_ms": 280, "healthy": True, "details": "ETA delay inference (+14.5h) & anomaly score calculation"},
            {"step": 13, "name": "RISK_ENGINE", "label": "Operational Risk Assessment Engine", "status": "COMPLETED", "duration_ms": 120, "healthy": True, "details": "Evaluated vessel vulnerability, route intersection & ice compression"},
            {"step": 14, "name": "INTELLIGENCE_PRODUCT", "label": "Command Center & Digital Twin Dispatch", "status": "COMPLETED", "duration_ms": 90, "healthy": True, "details": "Synchronized with Command Center, Fleet AIS & 3D Twin"}
        ]

    def _init_ice(self):
        now = utc_now()
        self.ice_regions = [
            {
                "region_name": "Prydz Bay / Davis Sea",
                "current_concentration_pct": 78.4,
                "previous_observation_pct": 60.2,
                "change_pct": +18.2,
                "ice_extent_sq_km": 1420000.0,
                "ice_thickness_m": 2.1,
                "ice_drift_speed_knots": 1.4,
                "ice_drift_direction_deg": 285.0,
                "ice_class": "First-Year Heavy Pack with Ridge Keels",
                "ice_density": "0.915 g/cm³",
                "ice_anomaly_sigma": +2.4, # severe positive anomaly
                "route_intersection_hazard": "HIGH",
                "ice_risk_score": 82,
                "ice_risk_level": "HIGH",
                "last_satellite_observation": (now - timedelta(minutes=18)).isoformat(),
                "last_satellite_source": "Sentinel-1A SAR (C-band)",
                "next_expected_observation": (now + timedelta(hours=9, minutes=45)).isoformat(),
                "high_risk_zone_coordinates": [
                    [75.0, -68.8], [78.8, -68.8], [78.8, -67.2], [75.0, -67.2], [75.0, -68.8]
                ],
                "affected_vessel": "Polar Star",
                "notes": "Rapid pack convergence driven by 45kt southerly katabatic gale."
            },
            {
                "region_name": "Princess Astrid Coast (Maitri)",
                "current_concentration_pct": 48.0,
                "previous_observation_pct": 52.0,
                "change_pct": -4.0,
                "ice_extent_sq_km": 890000.0,
                "ice_thickness_m": 1.2,
                "ice_drift_speed_knots": 0.8,
                "ice_drift_direction_deg": 310.0,
                "ice_class": "First-Year Medium Pack",
                "ice_density": "0.890 g/cm³",
                "ice_anomaly_sigma": -0.3,
                "route_intersection_hazard": "MEDIUM",
                "ice_risk_score": 46,
                "ice_risk_level": "MEDIUM",
                "last_satellite_observation": (now - timedelta(hours=3, minutes=15)).isoformat(),
                "last_satellite_source": "Sentinel-2B Optical",
                "next_expected_observation": (now + timedelta(hours=14)).isoformat(),
                "high_risk_zone_coordinates": [
                    [10.5, -71.2], [13.2, -71.2], [13.2, -70.0], [10.5, -70.0], [10.5, -71.2]
                ],
                "affected_vessel": "Southern Cross",
                "notes": "Stable leads open along fast ice margin."
            },
            {
                "region_name": "Vincennes Bay (Casey)",
                "current_concentration_pct": 14.5,
                "previous_observation_pct": 16.0,
                "change_pct": -1.5,
                "ice_extent_sq_km": 420000.0,
                "ice_thickness_m": 0.6,
                "ice_drift_speed_knots": 0.5,
                "ice_drift_direction_deg": 270.0,
                "ice_class": "Marginal Ice Zone / Open Water",
                "ice_density": "0.880 g/cm³",
                "ice_anomaly_sigma": -0.8,
                "route_intersection_hazard": "LOW",
                "ice_risk_score": 18,
                "ice_risk_level": "LOW",
                "last_satellite_observation": (now - timedelta(hours=8)).isoformat(),
                "last_satellite_source": "Landsat-9 OLI-2",
                "next_expected_observation": (now + timedelta(hours=16)).isoformat(),
                "high_risk_zone_coordinates": [],
                "affected_vessel": "Aurora Explorer",
                "notes": "Navigable corridor fully open."
            },
            {
                "region_name": "Ross Sea / McMurdo Sound",
                "current_concentration_pct": 54.0,
                "previous_observation_pct": 51.5,
                "change_pct": +2.5,
                "ice_extent_sq_km": 1150000.0,
                "ice_thickness_m": 1.6,
                "ice_drift_speed_knots": 0.9,
                "ice_drift_direction_deg": 330.0,
                "ice_class": "First-Year Medium Pack & Tabular Icebergs",
                "ice_density": "0.910 g/cm³",
                "ice_anomaly_sigma": +0.6,
                "route_intersection_hazard": "MEDIUM",
                "ice_risk_score": 58,
                "ice_risk_level": "MEDIUM",
                "last_satellite_observation": (now - timedelta(hours=14, minutes=20)).isoformat(),
                "last_satellite_source": "Landsat-9 / MODIS",
                "next_expected_observation": (now + timedelta(hours=10)).isoformat(),
                "high_risk_zone_coordinates": [
                    [165.0, -78.2], [168.8, -78.2], [168.8, -76.8], [165.0, -76.8], [165.0, -78.2]
                ],
                "affected_vessel": "Arctic Voyager",
                "notes": "Iceberg B-22A fragments drifting in fairway."
            }
        ]

    def _init_weather(self):
        now = utc_now()
        self.weather_reports = [
            {
                "location_name": "Davis Station & Prydz Bay",
                "lat": -68.57,
                "lon": 77.96,
                "temperature_c": -21.4,
                "wind_speed_knots": 48.0,
                "wind_direction": "S (185°)",
                "visibility_km": 1.2,
                "precipitation": "Heavy Blowing Snow / Blizzard",
                "pressure_hpa": 964.2,
                "sea_state": "Very Rough (Code 6)",
                "storm_conditions": "Active Katabatic Blizzard Warning",
                "weather_risk_score": 84,
                "route_weather_impact": "SEVERE_HEADWIND_DECELERATION",
                "observed_at": (now - timedelta(minutes=14)).isoformat(),
                "forecast_horizons": {
                    "now": {"wind_knots": 48.0, "temp_c": -21.4, "risk": "HIGH"},
                    "+6h": {"wind_knots": 52.0, "temp_c": -22.8, "risk": "CRITICAL"},
                    "+12h": {"wind_knots": 44.0, "temp_c": -20.5, "risk": "HIGH"},
                    "+24h": {"wind_knots": 28.0, "temp_c": -17.2, "risk": "MEDIUM"},
                    "+48h": {"wind_knots": 18.0, "temp_c": -14.0, "risk": "LOW"},
                    "+7d": {"wind_knots": 22.0, "temp_c": -16.0, "risk": "LOW"}
                }
            },
            {
                "location_name": "Maitri Station / Queen Maud Land",
                "lat": -70.76,
                "lon": 11.73,
                "temperature_c": -18.2,
                "wind_speed_knots": 22.0,
                "wind_direction": "SE (135°)",
                "visibility_km": 8.0,
                "precipitation": "Light Snow Flurries",
                "pressure_hpa": 988.5,
                "sea_state": "Moderate (Code 4)",
                "storm_conditions": "Nominal Polar Winter Conditions",
                "weather_risk_score": 42,
                "route_weather_impact": "MODERATE_WIND_RESISTANCE",
                "observed_at": (now - timedelta(minutes=25)).isoformat(),
                "forecast_horizons": {
                    "now": {"wind_knots": 22.0, "temp_c": -18.2, "risk": "MEDIUM"},
                    "+6h": {"wind_knots": 24.0, "temp_c": -19.0, "risk": "MEDIUM"},
                    "+12h": {"wind_knots": 26.0, "temp_c": -19.5, "risk": "MEDIUM"},
                    "+24h": {"wind_knots": 20.0, "temp_c": -18.0, "risk": "LOW"},
                    "+48h": {"wind_knots": 16.0, "temp_c": -16.5, "risk": "LOW"},
                    "+7d": {"wind_knots": 18.0, "temp_c": -17.0, "risk": "LOW"}
                }
            },
            {
                "location_name": "Casey Station / Wilkes Land",
                "lat": -66.28,
                "lon": 110.52,
                "temperature_c": -9.8,
                "wind_speed_knots": 14.0,
                "wind_direction": "E (090°)",
                "visibility_km": 15.0,
                "precipitation": "Clear Skies",
                "pressure_hpa": 1002.1,
                "sea_state": "Slight (Code 3)",
                "storm_conditions": "Favorable Transit Window",
                "weather_risk_score": 15,
                "route_weather_impact": "MINIMAL_IMPACT",
                "observed_at": (now - timedelta(minutes=10)).isoformat(),
                "forecast_horizons": {
                    "now": {"wind_knots": 14.0, "temp_c": -9.8, "risk": "LOW"},
                    "+6h": {"wind_knots": 15.0, "temp_c": -10.2, "risk": "LOW"},
                    "+12h": {"wind_knots": 18.0, "temp_c": -11.0, "risk": "LOW"},
                    "+24h": {"wind_knots": 16.0, "temp_c": -10.5, "risk": "LOW"},
                    "+48h": {"wind_knots": 14.0, "temp_c": -9.5, "risk": "LOW"},
                    "+7d": {"wind_knots": 16.0, "temp_c": -10.0, "risk": "LOW"}
                }
            },
            {
                "location_name": "McMurdo Sound / Ross Island",
                "lat": -77.85,
                "lon": 166.66,
                "temperature_c": -26.5,
                "wind_speed_knots": 34.0,
                "wind_direction": "SW (220°)",
                "visibility_km": 3.5,
                "precipitation": "Blowing Snow",
                "pressure_hpa": 978.4,
                "sea_state": "Rough (Code 5)",
                "storm_conditions": "Moderate Storm Advisory",
                "weather_risk_score": 62,
                "route_weather_impact": "CHOPPY_SEA_CROSSWIND",
                "observed_at": (now - timedelta(minutes=30)).isoformat(),
                "forecast_horizons": {
                    "now": {"wind_knots": 34.0, "temp_c": -26.5, "risk": "MEDIUM"},
                    "+6h": {"wind_knots": 38.0, "temp_c": -27.5, "risk": "HIGH"},
                    "+12h": {"wind_knots": 32.0, "temp_c": -26.0, "risk": "MEDIUM"},
                    "+24h": {"wind_knots": 22.0, "temp_c": -24.0, "risk": "LOW"},
                    "+48h": {"wind_knots": 18.0, "temp_c": -22.5, "risk": "LOW"},
                    "+7d": {"wind_knots": 20.0, "temp_c": -23.0, "risk": "LOW"}
                }
            }
        ]

    def _init_vessels(self):
        now = utc_now()
        self.vessels = [
            {
                "id": "VESSEL_POLAR_STAR",
                "name": "Polar Star",
                "callsign": "WAGB-10",
                "imo": "9123456",
                "mmsi": "369970000",
                "vessel_type": "Heavy Polar Icebreaker (PC-1)",
                "ice_class": "IACS Polar Class 1 (Continuous 1.8m ice)",
                "ais_status": "ONLINE",
                "current_lat": -67.84,
                "current_lon": 76.92,
                "heading_deg": 142.0,
                "speed_knots": 6.2,
                "design_speed_knots": 14.0,
                "origin": "Cape Town",
                "destination": "Davis Station",
                "route": "Cape Town -> Davis Station Transpolar Fairway",
                "original_eta": (now + timedelta(days=2, hours=4)).isoformat(),
                "predicted_eta": (now + timedelta(days=2, hours=18, minutes=30)).isoformat(),
                "predicted_delay_hours": 14.5,
                "route_risk_level": "HIGH",
                "route_risk_score": 84,
                "ai_confidence_pct": 84.0,
                "nearby_ice": {
                    "concentration_pct": 78.4,
                    "ice_class": "Heavy Pack Ridge",
                    "source": "Sentinel-1A SAR (18 min ago)",
                    "thickness_m": 2.1
                },
                "nearby_weather": {
                    "wind_speed_knots": 48.0,
                    "wind_direction": "S",
                    "temp_c": -21.4,
                    "sea_state": "Very Rough"
                },
                "satellite_observations": {
                    "last_obs_id": "S1A_IW_GRDH_1SDV_20260927T1310_DAVIS_78F4",
                    "satellite": "Sentinel-1A SAR",
                    "freshness": "18 min ago",
                    "detected_feature": "Compressive Ridge ahead in 12nm"
                },
                "anomaly_indicators": [
                    {"system": "Propulsion", "detail": "Engine load 92% at 6.2kt indicates extreme ice resistance", "severity": "HIGH"},
                    {"system": "AIS Track", "detail": "Speed reduced 4.8kt below historical corridor profile", "severity": "MEDIUM"}
                ],
                "telemetry_freshness": "18 min ago",
                "sync_state": "SYNCED",
                "hitl_status": "REQUIRES_REVIEW"
            },
            {
                "id": "VESSEL_AURORA_EXPLORER",
                "name": "Aurora Explorer",
                "callsign": "VNAE-2",
                "imo": "9812456",
                "mmsi": "503000123",
                "vessel_type": "Polar Research & Supply Vessel (PC-3)",
                "ice_class": "IACS Polar Class 3 (Year-round second-year ice)",
                "ais_status": "ONLINE",
                "current_lat": -65.42,
                "current_lon": 108.65,
                "heading_deg": 128.0,
                "speed_knots": 11.4,
                "design_speed_knots": 13.0,
                "origin": "Hobart",
                "destination": "Casey Station",
                "route": "Hobart -> Casey Station Southern Fairway",
                "original_eta": (now + timedelta(days=3, hours=12)).isoformat(),
                "predicted_eta": (now + timedelta(days=3, hours=13, minutes=12)).isoformat(),
                "predicted_delay_hours": 1.2,
                "route_risk_level": "LOW",
                "route_risk_score": 22,
                "ai_confidence_pct": 92.0,
                "nearby_ice": {
                    "concentration_pct": 14.5,
                    "ice_class": "Marginal Open Water",
                    "source": "Landsat-9 (8 hrs ago)",
                    "thickness_m": 0.6
                },
                "nearby_weather": {
                    "wind_speed_knots": 14.0,
                    "wind_direction": "E",
                    "temp_c": -9.8,
                    "sea_state": "Slight"
                },
                "satellite_observations": {
                    "last_obs_id": "LC09_L2SP_098112_20260926_ROSS_02_T1",
                    "satellite": "Landsat-9 OLI-2",
                    "freshness": "8 hrs ago",
                    "detected_feature": "Clear corridor to Vincennes Bay"
                },
                "anomaly_indicators": [],
                "telemetry_freshness": "4 min ago",
                "sync_state": "SYNCED",
                "hitl_status": "NOMINAL"
            },
            {
                "id": "VESSEL_SOUTHERN_CROSS",
                "name": "Southern Cross",
                "callsign": "VNSC-5",
                "imo": "9345678",
                "mmsi": "503000456",
                "vessel_type": "Ice-Strengthened Heavy Cargo (PC-4)",
                "ice_class": "IACS Polar Class 4",
                "ais_status": "ONLINE",
                "current_lat": -69.85,
                "current_lon": 12.40,
                "heading_deg": 195.0,
                "speed_knots": 8.5,
                "design_speed_knots": 12.5,
                "origin": "Fremantle",
                "destination": "Maitri Station",
                "route": "Fremantle -> Maitri Outer Anchorage",
                "original_eta": (now + timedelta(days=5, hours=6)).isoformat(),
                "predicted_eta": (now + timedelta(days=5, hours=11, minutes=50)).isoformat(),
                "predicted_delay_hours": 5.8,
                "route_risk_level": "MEDIUM",
                "route_risk_score": 54,
                "ai_confidence_pct": 88.0,
                "nearby_ice": {
                    "concentration_pct": 48.0,
                    "ice_class": "First-Year Medium Pack",
                    "source": "Sentinel-2B Optical (3 hrs ago)",
                    "thickness_m": 1.2
                },
                "nearby_weather": {
                    "wind_speed_knots": 22.0,
                    "wind_direction": "SE",
                    "temp_c": -18.2,
                    "sea_state": "Moderate"
                },
                "satellite_observations": {
                    "last_obs_id": "S2B_MSIL2A_20260927T0928_MAITRI_31L",
                    "satellite": "Sentinel-2B",
                    "freshness": "3 hrs ago",
                    "detected_feature": "Marginal lead system navigable at reduced speed"
                },
                "anomaly_indicators": [
                    {"system": "Vibration", "detail": "Shaft vibration slight peak (0.04g) during ice ramming", "severity": "LOW"}
                ],
                "telemetry_freshness": "12 min ago",
                "sync_state": "SYNCED",
                "hitl_status": "ACKNOWLEDGED"
            },
            {
                "id": "VESSEL_ARCTIC_VOYAGER",
                "name": "Arctic Voyager",
                "callsign": "VNAV-8",
                "imo": "9456789",
                "mmsi": "503000789",
                "vessel_type": "Polar Tanker / Fuel Carrier (PC-2)",
                "ice_class": "IACS Polar Class 2",
                "ais_status": "ONLINE",
                "current_lat": -76.80,
                "current_lon": 167.20,
                "heading_deg": 182.0,
                "speed_knots": 7.8,
                "design_speed_knots": 13.0,
                "origin": "Punta Arenas",
                "destination": "McMurdo Station",
                "route": "Ross Sea Channel to Hut Point",
                "original_eta": (now + timedelta(days=4, hours=2)).isoformat(),
                "predicted_eta": (now + timedelta(days=4, hours=8, minutes=25)).isoformat(),
                "predicted_delay_hours": 6.4,
                "route_risk_level": "MEDIUM",
                "route_risk_score": 58,
                "ai_confidence_pct": 86.0,
                "nearby_ice": {
                    "concentration_pct": 54.0,
                    "ice_class": "First-Year Medium Pack & Tabular Icebergs",
                    "source": "Landsat-9 / MODIS (14 hrs ago)",
                    "thickness_m": 1.6
                },
                "nearby_weather": {
                    "wind_speed_knots": 34.0,
                    "wind_direction": "SW",
                    "temp_c": -26.5,
                    "sea_state": "Rough"
                },
                "satellite_observations": {
                    "last_obs_id": "LC09_L2SP_098112_20260926_ROSS_02_T1",
                    "satellite": "Landsat-9",
                    "freshness": "14 hrs ago",
                    "detected_feature": "Tabular Iceberg B-22A fragment 6nm west"
                },
                "anomaly_indicators": [],
                "telemetry_freshness": "20 min ago",
                "sync_state": "SYNCED",
                "hitl_status": "NOMINAL"
            },
            {
                "id": "VESSEL_OCEAN_GUARDIAN",
                "name": "Ocean Guardian",
                "callsign": "VNOG-9",
                "imo": "9567890",
                "mmsi": "503000999",
                "vessel_type": "Antarctic Patrol & Hydrographic Survey (PC-5)",
                "ice_class": "IACS Polar Class 5",
                "ais_status": "ONLINE",
                "current_lat": -68.95,
                "current_lon": 75.80,
                "heading_deg": 045.0,
                "speed_knots": 12.0,
                "design_speed_knots": 15.0,
                "origin": "Christchurch",
                "destination": "Bharati Station",
                "route": "Prydz Bay Hydrographic Escort Corridor",
                "original_eta": (now + timedelta(days=1, hours=18)).isoformat(),
                "predicted_eta": (now + timedelta(days=1, hours=18, minutes=45)).isoformat(),
                "predicted_delay_hours": 0.8,
                "route_risk_level": "LOW",
                "route_risk_score": 19,
                "ai_confidence_pct": 95.0,
                "nearby_ice": {
                    "concentration_pct": 18.0,
                    "ice_class": "Open Pack",
                    "source": "Sentinel-1A SAR (18 min ago)",
                    "thickness_m": 0.8
                },
                "nearby_weather": {
                    "wind_speed_knots": 24.0,
                    "wind_direction": "S",
                    "temp_c": -16.4,
                    "sea_state": "Moderate"
                },
                "satellite_observations": {
                    "last_obs_id": "S1A_IW_GRDH_1SDV_20260927T1310_DAVIS_78F4",
                    "satellite": "Sentinel-1A SAR",
                    "freshness": "18 min ago",
                    "detected_feature": "Escort track clear along 75.8°E meridian"
                },
                "anomaly_indicators": [],
                "telemetry_freshness": "6 min ago",
                "sync_state": "SYNCED",
                "hitl_status": "NOMINAL"
            }
        ]

    def _init_models(self):
        now = utc_now()
        # Strictly NO Random Forest as mandated by Section 13
        self.models = [
            {
                "model_name": "XGBoost Polar Voyage & Route Risk Engine",
                "model_id": "XGB_POLAR_ETA_v2.4",
                "model_family": "XGBoost",
                "version": "2.4.1",
                "purpose": "Vessel transit delay, ETA estimation, and sea-ice route risk scoring",
                "training_dataset": "POLARONE Antarctic 2018-2025 Voyage & Satellite Archive (N=48,200)",
                "training_date": "2026-08-15T00:00:00Z",
                "input_features": ["speed_knots", "heading_deg", "wind_knots", "wind_angle", "sea_ice_concentration", "ice_thickness_m", "ice_drift_speed", "displacement_tons", "polar_class_index"],
                "output_schema": "float (predicted_delay_hours), float (route_risk_score 0-100)",
                "evaluation_metrics": {"MAE": "1.24 hrs", "RMSE": "2.08 hrs", "R2": 0.912, "Max_Error": "4.8 hrs"},
                "current_status": "PRODUCTION",
                "last_inference": (now - timedelta(minutes=3)).isoformat(),
                "drift_status": "HEALTHY",
                "metrics": {
                    "prediction_drift_psi": 0.024,
                    "feature_drift_ks": 0.031,
                    "data_drift_score": 0.019,
                    "model_accuracy": 94.8,
                    "inference_latency_ms": 28.5,
                    "failed_predictions_pct": 0.0,
                    "confidence_distribution": {"high": 84, "medium": 14, "low": 2}
                }
            },
            {
                "model_name": "LightGBM Station Demand & Inventory Forecaster",
                "model_id": "LGBM_DEMAND_FORECAST_v1.5",
                "model_family": "LightGBM",
                "version": "1.5.0",
                "purpose": "Antarctic station fuel, provisions, and critical spares burn rate forecasting",
                "training_dataset": "COMNAP Station Logistics 2015-2026 Multi-Station Registry (N=124,000)",
                "training_date": "2026-07-28T00:00:00Z",
                "input_features": ["current_stock_litres", "daily_burn_rate", "outside_temp_c", "wind_chill_index", "station_population", "winterover_phase_days", "heating_demand_kw"],
                "output_schema": "float (days_of_supply_remaining), array (monthly_consumption_projection)",
                "evaluation_metrics": {"MAPE": "3.8%", "RMSE": "420 Litres", "R2": 0.941},
                "current_status": "PRODUCTION",
                "last_inference": (now - timedelta(minutes=15)).isoformat(),
                "drift_status": "HEALTHY",
                "metrics": {
                    "prediction_drift_psi": 0.018,
                    "feature_drift_ks": 0.022,
                    "data_drift_score": 0.015,
                    "model_accuracy": 96.2,
                    "inference_latency_ms": 19.4,
                    "failed_predictions_pct": 0.0,
                    "confidence_distribution": {"high": 91, "medium": 8, "low": 1}
                }
            },
            {
                "model_name": "Isolation Forest Edge Telemetry Anomaly Detector",
                "model_id": "IF_TELEMETRY_ANOMALY_v2.0",
                "model_family": "Isolation Forest",
                "version": "2.0.2-edge",
                "purpose": "Unsupervised real-time sensor anomaly detection on generator and propulsion telemetry",
                "training_dataset": "Continuous Unsupervised Streaming Baseline (100,000 sliding window)",
                "training_date": "2026-09-20T00:00:00Z",
                "input_features": ["vibration_rms", "exhaust_temp_c", "rpm", "oil_pressure_bar", "coolant_flow_lpm", "bearing_temp_c"],
                "output_schema": "int (is_anomaly -1 or 1), float (anomaly_score 0.0-1.0)",
                "evaluation_metrics": {"FPR": "0.02%", "Precision": "96.4%", "F1_Score": 0.951},
                "current_status": "PRODUCTION",
                "last_inference": (now - timedelta(seconds=45)).isoformat(),
                "drift_status": "HEALTHY",
                "metrics": {
                    "prediction_drift_psi": 0.035,
                    "feature_drift_ks": 0.028,
                    "data_drift_score": 0.021,
                    "model_accuracy": 97.4,
                    "inference_latency_ms": 14.2,
                    "failed_predictions_pct": 0.0,
                    "confidence_distribution": {"high": 88, "medium": 10, "low": 2}
                }
            },
            {
                "model_name": "Deep Autoencoder Multivariate Reconstructor",
                "model_id": "AE_MULTIVARIATE_SENSOR_v1.1",
                "model_family": "Autoencoder",
                "version": "1.1.4",
                "purpose": "Multivariate non-linear sensor correlation failure and degraded equipment warning",
                "training_dataset": "Station Microgrid & Hull Stress Historical High-Frequency Logs",
                "training_date": "2026-06-12T00:00:00Z",
                "input_features": ["strain_gauge_1", "strain_gauge_2", "pitch_deg", "roll_deg", "slamming_pressure_kpa", "hull_deflection_mm"],
                "output_schema": "float (reconstruction_mse_loss), array (residual_contributions)",
                "evaluation_metrics": {"Loss_MSE": 0.0018, "AUC_ROC": 0.978},
                "current_status": "PRODUCTION",
                "last_inference": (now - timedelta(minutes=5)).isoformat(),
                "drift_status": "HEALTHY",
                "metrics": {
                    "prediction_drift_psi": 0.029,
                    "feature_drift_ks": 0.034,
                    "data_drift_score": 0.025,
                    "model_accuracy": 95.8,
                    "inference_latency_ms": 42.0,
                    "failed_predictions_pct": 0.0,
                    "confidence_distribution": {"high": 82, "medium": 15, "low": 3}
                }
            },
            {
                "model_name": "Survival Analysis Remaining Useful Life (RUL) Engine",
                "model_id": "SURVIVAL_RUL_WEIBULL_v1.0",
                "model_family": "Survival Analysis",
                "version": "1.0.3",
                "purpose": "Asset failure hazard rate and remaining operational lifetime under extreme polar cold",
                "training_dataset": "Caterpillar 3516B Polar Station Generator 15-Year Failure Logs",
                "training_date": "2026-05-18T00:00:00Z",
                "input_features": ["cumulative_operating_hours", "cold_starts_count", "thermal_cycles", "mean_load_pct", "lube_oil_iron_ppm"],
                "output_schema": "float (expected_rul_hours), array (survival_probability_curve)",
                "evaluation_metrics": {"Concordance_Index": 0.884, "Brier_Score": 0.082},
                "current_status": "PRODUCTION",
                "last_inference": (now - timedelta(hours=1)).isoformat(),
                "drift_status": "HEALTHY",
                "metrics": {
                    "prediction_drift_psi": 0.019,
                    "feature_drift_ks": 0.025,
                    "data_drift_score": 0.018,
                    "model_accuracy": 93.6,
                    "inference_latency_ms": 35.8,
                    "failed_predictions_pct": 0.0,
                    "confidence_distribution": {"high": 85, "medium": 12, "low": 3}
                }
            },
            {
                "model_name": "Knowledge Graph Cascading Impact Engine",
                "model_id": "KG_CASCADE_IMPACT_v1.2",
                "model_family": "Graph Model",
                "version": "1.2.0",
                "purpose": "Cross-domain operational dependency propagation (vessel delay -> station stockout -> mission compromise)",
                "training_dataset": "POLARONE Operational Dependency Topology Graph (1,240 nodes, 4,890 edges)",
                "training_date": "2026-08-30T00:00:00Z",
                "input_features": ["root_entity_id", "disruption_magnitude", "temporal_horizon_days", "dependency_graph"],
                "output_schema": "list (cascading_impact_chain), float (total_mission_vulnerability_index)",
                "evaluation_metrics": {"Topology_Coverage": "100%", "Path_Accuracy": "98.9%"},
                "current_status": "PRODUCTION",
                "last_inference": (now - timedelta(minutes=18)).isoformat(),
                "drift_status": "HEALTHY",
                "metrics": {
                    "prediction_drift_psi": 0.012,
                    "feature_drift_ks": 0.015,
                    "data_drift_score": 0.009,
                    "model_accuracy": 98.2,
                    "inference_latency_ms": 58.0,
                    "failed_predictions_pct": 0.0,
                    "confidence_distribution": {"high": 94, "medium": 5, "low": 1}
                }
            },
            {
                "model_name": "OR-Tools Ice-Aware Route & Constraint Optimizer",
                "model_id": "ORTOOLS_ICE_NAV_v2.1",
                "model_family": "OR-Tools",
                "version": "2.1.2",
                "purpose": "Mixed-Integer Linear Programming (MILP) solver for ice lead waypoints minimizing fuel & risk",
                "training_dataset": "Algorithmic Solver (Google OR-Tools MILP / CP-SAT v9.8)",
                "training_date": "2026-09-01T00:00:00Z",
                "input_features": ["origin_coords", "destination_coords", "ice_cost_grid", "weather_cost_grid", "fuel_penalty_factor", "safe_corridors"],
                "output_schema": "geojson_linestring (optimized_waypoints), float (fuel_savings_tons), float (eta_delta_hours)",
                "evaluation_metrics": {"Optimality_Gap": "< 0.01%", "Feasible_Solutions": "100%"},
                "current_status": "PRODUCTION",
                "last_inference": (now - timedelta(minutes=18)).isoformat(),
                "drift_status": "HEALTHY",
                "metrics": {
                    "prediction_drift_psi": 0.005,
                    "feature_drift_ks": 0.008,
                    "data_drift_score": 0.004,
                    "model_accuracy": 99.1,
                    "inference_latency_ms": 64.0,
                    "failed_predictions_pct": 0.0,
                    "confidence_distribution": {"high": 96, "medium": 4, "low": 0}
                }
            }
        ]

    def _init_predictions(self):
        now = utc_now()
        self.predictions = [
            {
                "prediction_id": "PRED_ETA_POLAR_STAR",
                "prediction_title": "Polar Star Route Delay Prediction",
                "prediction_value": "+14.5 hours delay",
                "model": "XGBoost Polar Voyage Predictor v2.4",
                "model_id": "XGB_POLAR_ETA_v2.4",
                "confidence": 84,
                "timestamp": (now - timedelta(minutes=18)).isoformat(),
                "data_freshness": "18 min ago",
                "risk_level": "HIGH",
                "main_drivers": [
                    {"factor": "Sea Ice Concentration (+18%)", "impact": "+5.1 hrs", "percentage": 35},
                    {"factor": "Headwind Gale (48 kt)", "impact": "+3.8 hrs", "percentage": 26},
                    {"factor": "Current Reduced Speed (6.2 kt)", "impact": "+3.4 hrs", "percentage": 23},
                    {"factor": "Satellite SAR Lead Diversion", "impact": "+2.2 hrs", "percentage": 16}
                ],
                "input_data_summary": {
                    "vessel": "Polar Star (IMO 9123456)",
                    "corridor": "Cape Town -> Davis Station",
                    "satellite_source": "Sentinel-1A SAR (18 min ago)",
                    "ice_concentration": "78.4%",
                    "wind_vector": "48 kt from 185°",
                    "current_speed": "6.2 kt vs 14.0 kt design"
                },
                "explanation": "WHY IS THIS ROUTE HIGH RISK?\n1. Sentinel-1 SAR acquisition (18m ago) confirms sea-ice concentration increased from 60.2% to 78.4% across Prydz Bay fairway.\n2. Vessel hull speed decelerated by 3.8 knots to 6.2 knots to prevent ice keel hull impact.\n3. ECMWF weather confirms severe 48kt southerly katabatic headwind pushing pack ice against the continental shelf.\n4. Route directly intersects an emerging compressive ridge zone.",
                "recommended_investigation": "Evaluate Alternate Waypoint Corridor B (divert 14 nm northeast into open lead Sector 4 to avoid 2.1m ridge keels and regain approximately 8.2 hours).",
                "human_review_status": "REQUIRES_REVIEW",
                "advisory_notice": "AI ADVISORY - Human Review Required. AI recommendations cannot execute ship helm or autonomous operational changes."
            },
            {
                "prediction_id": "PRED_RUL_DAVIS_GEN",
                "prediction_title": "Davis Station Generator #2 Remaining Useful Life",
                "prediction_value": "Remaining Useful Life: 410 hours (Warning: Inspect bearing within 72h)",
                "model": "Survival Analysis Weibull Engine v1.0",
                "model_id": "SURVIVAL_RUL_WEIBULL_v1.0",
                "confidence": 89,
                "timestamp": (now - timedelta(hours=1)).isoformat(),
                "data_freshness": "1 hr ago",
                "risk_level": "MEDIUM",
                "main_drivers": [
                    {"factor": "Cumulative Cold Starts", "impact": "38% hazard", "percentage": 42},
                    {"factor": "Vibration RMS Trend (+0.08g)", "impact": "31% hazard", "percentage": 34},
                    {"factor": "Continuous Extreme Load (88%)", "impact": "22% hazard", "percentage": 24}
                ],
                "input_data_summary": {
                    "asset": "Davis Station Main Generator #2 (CAT 3516B)",
                    "total_hours": 18450,
                    "vibration_rms": "0.14g (baseline 0.05g)",
                    "lube_iron_ppm": "42 ppm (caution threshold 40)"
                },
                "explanation": "WHY IS RUL DEGRADING?\n1. Isolation Forest detected 3 micro-vibration transients during recent blizzard peak load.\n2. Weibull cumulative hazard function crossed the 80th percentile threshold due to 14 unheated cold starts.\n3. Iron particulate in lube oil analysis shows early bearing cage wear.",
                "recommended_investigation": "Dispatch station mechanical team to inspect rear main bearing and switch base load to Generator #1 during the 12:00 UTC maintenance window.",
                "human_review_status": "ACKNOWLEDGED",
                "advisory_notice": "AI ADVISORY - Advisory engineering guidance only."
            },
            {
                "prediction_id": "PRED_DEMAND_DAVIS_FUEL",
                "prediction_title": "Davis Station Winterover Fuel Supply Burn Forecast",
                "prediction_value": "184 Days of Reserve Remaining (Nominal: 220 Days buffer)",
                "model": "LightGBM Demand Forecaster v1.5",
                "model_id": "LGBM_DEMAND_FORECAST_v1.5",
                "confidence": 94,
                "timestamp": (now - timedelta(minutes=45)).isoformat(),
                "data_freshness": "45 min ago",
                "risk_level": "LOW",
                "main_drivers": [
                    {"factor": "Extreme Chill Factor (-38°C)", "impact": "+140 L/day burn", "percentage": 48},
                    {"factor": "Station Population (42 personnel)", "impact": "+80 L/day baseline", "percentage": 28},
                    {"factor": "Hangar Space Heating", "impact": "+65 L/day", "percentage": 24}
                ],
                "input_data_summary": {
                    "current_stock": "485,000 Litres SAB (Special Antarctic Blend)",
                    "burn_rate": "2,420 L/day",
                    "next_resupply": "Polar Star voyage ETA +2 days"
                },
                "explanation": "WHY IS DEMAND HIGHER THAN AVERAGE?\n1. Ambient temperatures dropped to -21.4°C with 48kt windchill requiring continuous auxiliary heating in biology laboratory annex.\n2. Total fuel reserve remains healthy with 184 days margin before mandatory resupply.",
                "recommended_investigation": "Confirm fuel manifold transfer readiness for Polar Star bulk bunker discharge upon arrival.",
                "human_review_status": "NOMINAL",
                "advisory_notice": "AI ADVISORY - Operational logistics advisory."
            }
        ]

    def _init_risks(self):
        now = utc_now()
        self.risk_summary = {
            "overall_status": "ELEVATED",
            "overall_score": 76,
            "critical_risks_count": 2,
            "high_risks_count": 4,
            "medium_risks_count": 2,
            "categories": [
                {
                    "category": "Vessel Risk",
                    "level": "HIGH",
                    "score": 84,
                    "confidence": 0.86,
                    "affected_asset": "Polar Star",
                    "affected_location": "Prydz Bay Approach (67.8°S, 76.9°E)",
                    "cause": "Sea-ice concentration increased to 78.4% under 48kt katabatic gale, causing speed reduction to 6.2kt and +14.5h delay.",
                    "potential_impact": "Delayed arrival at Davis Station impacting station resupply timeline and cargo offload window.",
                    "recommended_investigation": "Review alternate lead route Sector 4; coordinate hydrographic radar scan with Ocean Guardian.",
                    "timestamp": (now - timedelta(minutes=18)).isoformat(),
                    "review_status": "REQUIRES_REVIEW"
                },
                {
                    "category": "Ice Risk",
                    "level": "CRITICAL",
                    "score": 88,
                    "confidence": 0.90,
                    "affected_asset": "Davis Sea Shipping Channel",
                    "affected_location": "Davis Sea Fairway (68.5°S, 77.9°E)",
                    "cause": "Sentinel-1 SAR confirms rapid convergence of multi-year pack ridge with keel depth exceeding 2.1 meters.",
                    "potential_impact": "Impasse hazard for vessels with Ice Class lower than PC-1; pressure ridge entrapment hazard.",
                    "recommended_investigation": "Task ICEYE commercial SAR for 3m pinpoint dwell over ridge coordinates.",
                    "timestamp": (now - timedelta(minutes=18)).isoformat(),
                    "review_status": "REQUIRES_REVIEW"
                },
                {
                    "category": "Weather Risk",
                    "level": "HIGH",
                    "score": 82,
                    "confidence": 0.88,
                    "affected_asset": "Davis & Prydz Bay Environs",
                    "affected_location": "Princess Elizabeth Land Coast",
                    "cause": "Active Katabatic Blizzard Warning: Sustained 48kt southerly winds gusting to 62kt, visibility below 1.2km.",
                    "potential_impact": "Severe headwind shear, deck icing, helicopter flight suspension, zero-visibility navigation.",
                    "recommended_investigation": "Issue mandatory station tie-down order and restrict deck operations on all vessels in sector.",
                    "timestamp": (now - timedelta(minutes=14)).isoformat(),
                    "review_status": "ACKNOWLEDGED"
                },
                {
                    "category": "Asset Risk",
                    "level": "MEDIUM",
                    "score": 58,
                    "confidence": 0.85,
                    "affected_asset": "Davis Station Main Generator #2",
                    "affected_location": "Davis Station Powerhouse B",
                    "cause": "Vibration harmonic peak detected during blizzard peak electrical load cycle.",
                    "potential_impact": "Unscheduled microgrid trip if bearing failure occurs during ongoing blizzard.",
                    "recommended_investigation": "Physical vibration check at rear bearing housing; verify Generator #1 standby sync.",
                    "timestamp": (now - timedelta(hours=1)).isoformat(),
                    "review_status": "ACKNOWLEDGED"
                },
                {
                    "category": "Station Risk",
                    "level": "MEDIUM",
                    "score": 52,
                    "confidence": 0.89,
                    "affected_asset": "Halley VI Station",
                    "affected_location": "Brunt Ice Shelf (75.5°S, 25.5°W)",
                    "cause": "GPS ice chasm monitoring station Chasm-1 indicates 4mm/week rift expansion.",
                    "potential_impact": "Requires seasonal monitoring; no immediate evacuation threshold reached.",
                    "recommended_investigation": "Verify satellite radar altimetry comparison with Sentinel-3 SRAL dataset.",
                    "timestamp": (now - timedelta(hours=5)).isoformat(),
                    "review_status": "MONITORING"
                },
                {
                    "category": "Cargo Risk",
                    "level": "HIGH",
                    "score": 75,
                    "confidence": 0.84,
                    "affected_asset": "Temperature-Sensitive Medical & Biological Cargo (Polar Star Hold #3)",
                    "affected_location": "Polar Star Hold #3",
                    "cause": "Transit delay (+14.5 hours) extends cold-chain battery autonomy buffer threshold to 88% capacity.",
                    "potential_impact": "Risk of sample degradation if vessel transit is delayed beyond 36 additional hours.",
                    "recommended_investigation": "Confirm reefer container auxiliary power umbilical is tied to ship main bus.",
                    "timestamp": (now - timedelta(minutes=18)).isoformat(),
                    "review_status": "REQUIRES_REVIEW"
                },
                {
                    "category": "Mission Risk",
                    "level": "MEDIUM",
                    "score": 60,
                    "confidence": 0.82,
                    "affected_asset": "Prydz Bay Benthic Science Survey Exp-26",
                    "affected_location": "Southern Ocean Station 14",
                    "cause": "Heavy ice floe cover over planned oceanographic CTD rosette deployment coordinates.",
                    "potential_impact": "Survey stations 14-18 may require rescheduling to return leg.",
                    "recommended_investigation": "Chief Scientist to review alternate CTD coordinates in open lead 8nm east.",
                    "timestamp": (now - timedelta(hours=2)).isoformat(),
                    "review_status": "ACKNOWLEDGED"
                },
                {
                    "category": "Communication Risk",
                    "level": "HIGH",
                    "score": 78,
                    "confidence": 0.91,
                    "affected_asset": "Halley VI & Davis Backup Satcom",
                    "affected_location": "Circumpolar High Latitudes (>70°S)",
                    "cause": "Solar CME Class M2.4 induced geomagnetic aurora storm causing high packet loss on LEO Starlink polar links.",
                    "potential_impact": "High telemetry packet loss (>38%); degraded video downlink.",
                    "recommended_investigation": "Ensure primary operational telemetry failover to Iridium Certus Polar Channel B is active.",
                    "timestamp": (now - timedelta(minutes=45)).isoformat(),
                    "review_status": "ACKNOWLEDGED"
                }
            ]
        }

    def _init_alerts(self):
        now = utc_now()
        self.alerts = [
            {
                "id": "ALT_ICE_001",
                "alert_type": "HIGH_ICE_RISK_DETECTED",
                "severity": "CRITICAL",
                "title": "High Ice Concentration & Compressive Ridge Ahead",
                "affected_entity": "Polar Star (IMO 9123456)",
                "source_satellite": "Sentinel-1A SAR",
                "observation_freshness": "18 min ago",
                "risk_level": "CRITICAL",
                "cause": "Sea-ice concentration increased from 60% to 78.4% with compressive ridge keels exceeding 2.1m.",
                "recommended_action": "Review Alternate Lead Route Sector 4. Do not proceed at high speed into compressive pack.",
                "status": "ACTIVE",
                "human_reviewer": None,
                "created_at": (now - timedelta(minutes=18)).isoformat(),
                "audit_recorded": True
            },
            {
                "id": "ALT_WX_002",
                "alert_type": "WEATHER_DETERIORATION",
                "severity": "HIGH",
                "title": "Severe Katabatic Blizzard Warning - Prydz Bay",
                "affected_entity": "Davis Station & Marine Sector",
                "source_satellite": "Terra / MODIS & ECMWF Weather",
                "observation_freshness": "14 min ago",
                "risk_level": "HIGH",
                "cause": "48 knot sustained headwind gale with gusts to 62 knots; horizontal visibility reduced to 1.2km.",
                "recommended_action": "Enforce station tie-down protocol; suspend outdoor expedition movements and helicopter sorties.",
                "status": "ACTIVE",
                "human_reviewer": "Lt. Dr. R. Vance (Safety Officer)",
                "created_at": (now - timedelta(minutes=14)).isoformat(),
                "audit_recorded": True
            },
            {
                "id": "ALT_AIS_003",
                "alert_type": "VESSEL_ANOMALY",
                "severity": "HIGH",
                "title": "Vessel Speed Abrupt Deceleration",
                "affected_entity": "Polar Star",
                "source_satellite": "AIS Stream + Sentinel-1 Fusion",
                "observation_freshness": "18 min ago",
                "risk_level": "HIGH",
                "cause": "Speed reduced by 4.8 knots to 6.2 knots while engine load increased to 92%.",
                "recommended_action": "Confirm propulsion temperatures; assess hull ice resistance.",
                "status": "ACTIVE",
                "human_reviewer": None,
                "created_at": (now - timedelta(minutes=18)).isoformat(),
                "audit_recorded": True
            },
            {
                "id": "ALT_TEL_004",
                "alert_type": "TELEMETRY_ANOMALY",
                "severity": "MEDIUM",
                "title": "Davis Station Generator #2 Vibration Transient",
                "affected_entity": "Davis Station Generator #2",
                "source_satellite": "Isolation Forest Edge Telemetry",
                "observation_freshness": "1 hr ago",
                "risk_level": "MEDIUM",
                "cause": "Isolation Forest detected harmonic vibration anomaly (Score: 0.88) during peak load.",
                "recommended_action": "Inspect rear bearing during next scheduled sync window.",
                "status": "ACKNOWLEDGED",
                "human_reviewer": "Commander E. Hayes",
                "created_at": (now - timedelta(hours=1)).isoformat(),
                "audit_recorded": True
            },
            {
                "id": "ALT_COM_005",
                "alert_type": "COMMUNICATION_DEGRADATION",
                "severity": "MEDIUM",
                "title": "LEO Polar Satellite Link Packet Loss",
                "affected_entity": "Halley VI Communications Uplink",
                "source_satellite": "Network Monitor Telemetry",
                "observation_freshness": "45 min ago",
                "risk_level": "MEDIUM",
                "cause": "Geomagnetic storm causing >38% packet drop on Starlink polar shell.",
                "recommended_action": "Routing operational traffic through Iridium Certus backup transceivers.",
                "status": "ACKNOWLEDGED",
                "human_reviewer": "SysAdmin K. Patel",
                "created_at": (now - timedelta(minutes=45)).isoformat(),
                "audit_recorded": True
            }
        ]

    def _init_data_quality(self):
        now = utc_now()
        self.data_quality = {
            "overall_health": "DEGRADED",
            "health_score": 91.5,
            "sources": [
                {
                    "source": "Sentinel-1 SAR",
                    "status": "HEALTHY",
                    "latency_ms": 115,
                    "freshness": "18 min ago",
                    "missing_data_pct": 0.0,
                    "cloud_contamination": "0% (Radar Penetrating)",
                    "processing_failures": 0,
                    "quality_notes": "Nominal dual-pol GRD feed via ESA STAC"
                },
                {
                    "source": "Sentinel-2 Optical",
                    "status": "HEALTHY",
                    "latency_ms": 135,
                    "freshness": "3 hrs ago",
                    "missing_data_pct": 0.0,
                    "cloud_contamination": "18.0% (Masked via SCL)",
                    "processing_failures": 0,
                    "quality_notes": "Cloud mask successfully isolating surface reflectance"
                },
                {
                    "source": "Landsat-9 Optical/Thermal",
                    "status": "HEALTHY",
                    "latency_ms": 142,
                    "freshness": "14 hrs ago",
                    "missing_data_pct": 0.0,
                    "cloud_contamination": "8.0%",
                    "processing_failures": 0,
                    "quality_notes": "High thermal resolution confirms open polyna thermal signature"
                },
                {
                    "source": "MODIS / VIIRS Environmental",
                    "status": "HEALTHY",
                    "latency_ms": 160,
                    "freshness": "6 hrs ago",
                    "missing_data_pct": 0.0,
                    "cloud_contamination": "42.0%",
                    "processing_failures": 0,
                    "quality_notes": "Circumpolar composite updated every 12 hours"
                },
                {
                    "source": "Commercial ICEYE SAR",
                    "status": "HEALTHY",
                    "latency_ms": 95,
                    "freshness": "48 min ago",
                    "missing_data_pct": 0.0,
                    "cloud_contamination": "0% (X-band Radar)",
                    "processing_failures": 0,
                    "quality_notes": "Tactical 3m stripmap acquired on tasking order"
                },
                {
                    "source": "Fleet AIS Telemetry",
                    "status": "DEGRADED",
                    "latency_ms": 840,
                    "freshness": "4 min ago",
                    "missing_data_pct": 3.8,
                    "cloud_contamination": "N/A",
                    "processing_failures": 0,
                    "quality_notes": "Sporadic terrestrial AIS packet loss in heavy pack ice; satellite AIS active"
                },
                {
                    "source": "ECMWF & Polar WRF Weather",
                    "status": "HEALTHY",
                    "latency_ms": 190,
                    "freshness": "14 min ago",
                    "missing_data_pct": 0.0,
                    "cloud_contamination": "N/A",
                    "processing_failures": 0,
                    "quality_notes": "High-resolution 0.1° Antarctic mesh operational"
                },
                {
                    "source": "Station Microgrid Telemetry",
                    "status": "STALE",
                    "latency_ms": 4200,
                    "freshness": "3 hrs ago",
                    "missing_data_pct": 12.4,
                    "cloud_contamination": "N/A",
                    "processing_failures": 1,
                    "quality_notes": "Davis backup line transmitting intermittently due to blizzard static"
                }
            ],
            "tracked_anomalies": [
                {"feed": "Station Telemetry", "type": "STALE_DATA", "severity": "WARNING", "records_affected": 42, "detail": "Davis line transmission delayed 3h", "reported_at": (now - timedelta(hours=3)).isoformat()},
                {"feed": "AIS Stream", "type": "MISSING_PACKETS", "severity": "LOW", "records_affected": 12, "detail": "Brief 8-minute gap during satellite constellation handover", "reported_at": (now - timedelta(hours=1)).isoformat()}
            ]
        }

    def _init_coverage_planner(self):
        now = utc_now()
        self.coverage_passes = [
            {
                "satellite": "Sentinel-1A SAR",
                "sensor": "C-SAR",
                "aoi": "Davis Sea & Prydz Bay",
                "next_window": (now + timedelta(hours=9, minutes=45)).isoformat(),
                "window_duration_min": 14,
                "priority": "CRITICAL",
                "cloud_risk": "ZERO (Radar)",
                "coverage_status": "SCHEDULED",
                "pass_type": "Descending Orbit #142",
                "estimated_resolution": "10 m"
            },
            {
                "satellite": "Sentinel-2B Optical",
                "sensor": "MSI",
                "aoi": "Princess Astrid Coast (Maitri)",
                "next_window": (now + timedelta(hours=14, minutes=10)).isoformat(),
                "window_duration_min": 8,
                "priority": "HIGH",
                "cloud_risk": "MEDIUM (Forecast 25% cloud)",
                "coverage_status": "SCHEDULED",
                "pass_type": "Ascending Orbit #088",
                "estimated_resolution": "10 m"
            },
            {
                "satellite": "Landsat-9",
                "sensor": "OLI-2",
                "aoi": "Ross Sea Entrance",
                "next_window": (now + timedelta(hours=16, minutes=30)).isoformat(),
                "window_duration_min": 12,
                "priority": "MEDIUM",
                "cloud_risk": "LOW (Forecast 10% cloud)",
                "coverage_status": "CONFIRMED",
                "pass_type": "Descending Path 098",
                "estimated_resolution": "15 m"
            },
            {
                "satellite": "ICEYE-X7 (Commercial)",
                "sensor": "X-SAR",
                "aoi": "Polar Star Tactical Waypoint",
                "next_window": (now + timedelta(hours=4, minutes=20)).isoformat(),
                "window_duration_min": 4,
                "priority": "CRITICAL",
                "cloud_risk": "ZERO (Radar)",
                "coverage_status": "TASKING_CONFIRMED",
                "pass_type": "Targeted Spotlight Dwell",
                "estimated_resolution": "1 m"
            },
            {
                "satellite": "Terra / MODIS",
                "sensor": "MODIS",
                "aoi": "All Antarctic Sectors",
                "next_window": (now + timedelta(hours=5, minutes=50)).isoformat(),
                "window_duration_min": 45,
                "priority": "ROUTINE",
                "cloud_risk": "HIGH (Regional Cloud Tracking)",
                "coverage_status": "CONTINUOUS",
                "pass_type": "Polar Composite Sweep",
                "estimated_resolution": "250 m"
            }
        ]

    def _init_time_machine(self):
        # 5 Historical time steps: 01 Sep, 08 Sep, 15 Sep, 22 Sep, 29 Sep 2026
        self.timeline_steps = [
            {
                "date": "2026-09-01",
                "label": "01 Sep 2026 (Voyage Departure)",
                "ice_concentration_davis": 42.0,
                "weather_severity": "MODERATE",
                "polar_star_speed": 13.2,
                "polar_star_lat": -44.20,
                "polar_star_lon": 32.50,
                "route_risk_score": 18,
                "satellite_scenes_count": 82,
                "critical_alerts": 0,
                "summary": "Polar Star departed Cape Town in open water. Nominal Southern Ocean crossing."
            },
            {
                "date": "2026-09-08",
                "label": "08 Sep 2026 (Roaring Forties Transit)",
                "ice_concentration_davis": 50.4,
                "weather_severity": "ROUGH",
                "polar_star_speed": 11.8,
                "polar_star_lat": -52.80,
                "polar_star_lon": 48.20,
                "route_risk_score": 32,
                "satellite_scenes_count": 94,
                "critical_alerts": 0,
                "summary": "Crossing Antarctic Convergence. Marginal ice edge observed at 62°S."
            },
            {
                "date": "2026-09-15",
                "label": "15 Sep 2026 (Marginal Ice Zone Entry)",
                "ice_concentration_davis": 58.2,
                "weather_severity": "MODERATE",
                "polar_star_speed": 9.5,
                "polar_star_lat": -62.10,
                "polar_star_lon": 64.80,
                "route_risk_score": 48,
                "satellite_scenes_count": 108,
                "critical_alerts": 1,
                "summary": "First-year pack ice encountered. Sentinel-1 acquired baseline fairway imagery."
            },
            {
                "date": "2026-09-22",
                "label": "22 Sep 2026 (Approaching Prydz Bay)",
                "ice_concentration_davis": 65.0,
                "weather_severity": "HEAVY",
                "polar_star_speed": 8.0,
                "polar_star_lat": -66.15,
                "polar_star_lon": 72.40,
                "route_risk_score": 64,
                "satellite_scenes_count": 118,
                "critical_alerts": 1,
                "summary": "Pack ice thickening. Icebreaker initiated continuous lead navigation."
            },
            {
                "date": "2026-09-27",
                "label": "27 Sep 2026 (Current Operational State)",
                "ice_concentration_davis": 78.4,
                "weather_severity": "CRITICAL_GALE",
                "polar_star_speed": 6.2,
                "polar_star_lat": -67.84,
                "polar_star_lon": 76.92,
                "route_risk_score": 84,
                "satellite_scenes_count": 128,
                "critical_alerts": 2,
                "summary": "Katabatic gale front converged pack ice to 78.4%. Compressive ridge detected ahead."
            }
        ]

    def _init_audit_log(self):
        now = utc_now()
        self.audit_log = [
            {
                "id": "AUD-2026-0927-01",
                "timestamp": (now - timedelta(hours=2, minutes=10)).isoformat(),
                "actor": "Commander E. Hayes (Duty Commander)",
                "actor_role": "Commander",
                "action": "Acknowledge Alert",
                "target_entity": "Polar Star",
                "model_id": "XGB_POLAR_ETA_v2.4",
                "confidence": 0.84,
                "review_status": "ACKNOWLEDGED",
                "details": "Acknowledged initial delay prediction notice due to high pack ice."
            },
            {
                "id": "AUD-2026-0927-02",
                "timestamp": (now - timedelta(hours=1, minutes=45)).isoformat(),
                "actor": "Lt. Dr. R. Vance (Safety Officer)",
                "actor_role": "Safety Officer",
                "action": "Dispatch Weather Warning",
                "target_entity": "Davis Station",
                "model_id": None,
                "confidence": 0.95,
                "review_status": "APPROVED",
                "details": "Dispatched formal katabatic gale tie-down notice to station chief."
            }
        ]

    # ========================================================
    # API EXPOSURE METHODS
    # ========================================================

    def get_overview(self) -> Dict[str, Any]:
        """Consolidated KPI cards and intelligence overview"""
        now = utc_now()
        scenes_available = len(self.scenes)
        new_scenes_today = 14
        processing_queue = 3
        ice_alerts_count = sum(1 for a in self.alerts if "ICE" in a["alert_type"])
        ice_alerts_critical = sum(1 for a in self.alerts if "ICE" in a["alert_type"] and a["severity"] == "CRITICAL")
        weather_alerts_count = sum(1 for a in self.alerts if "WEATHER" in a["alert_type"])
        vessel_alerts_count = sum(1 for a in self.alerts if "VESSEL" in a["alert_type"])
        predictions_generated = 52
        data_sources_online = "7 / 8"

        kpis = [
            {
                "id": "kpi_satellite_scenes",
                "title": "Satellite Scenes Available",
                "current_value": scenes_available,
                "change": "+14 today",
                "status": "FRESH",
                "freshness": "18 min ago",
                "trend": "UP",
                "accent": "blue"
            },
            {
                "id": "kpi_new_scenes",
                "title": "New Scenes Today",
                "current_value": new_scenes_today,
                "change": "+6 vs yesterday",
                "status": "FRESH",
                "freshness": "Just now",
                "trend": "UP",
                "accent": "cyan"
            },
            {
                "id": "kpi_processing_queue",
                "title": "Processing Queue",
                "current_value": processing_queue,
                "change": "-2 completed",
                "status": "ACTIVE",
                "freshness": "Real-time",
                "trend": "DOWN",
                "accent": "amber"
            },
            {
                "id": "kpi_ice_risk_alerts",
                "title": "Ice Risk Alerts",
                "current_value": ice_alerts_count,
                "change": f"{ice_alerts_critical} CRITICAL",
                "status": "REQUIRES REVIEW",
                "freshness": "18 min ago",
                "trend": "UP",
                "accent": "red"
            },
            {
                "id": "kpi_weather_risk_alerts",
                "title": "Weather Risk Alerts",
                "current_value": weather_alerts_count,
                "change": "Katabatic Gale Active",
                "status": "WARNING",
                "freshness": "14 min ago",
                "trend": "STABLE",
                "accent": "amber"
            },
            {
                "id": "kpi_vessel_risk_alerts",
                "title": "Vessel Risk Alerts",
                "current_value": vessel_alerts_count,
                "change": "1 Vessel High Delay",
                "status": "REQUIRES REVIEW",
                "freshness": "18 min ago",
                "trend": "UP",
                "accent": "red"
            },
            {
                "id": "kpi_ai_predictions",
                "title": "AI Predictions Generated",
                "current_value": predictions_generated,
                "change": "+18 this watch",
                "status": "ACTIVE ADVISORY",
                "freshness": "3 min ago",
                "trend": "UP",
                "accent": "purple"
            },
            {
                "id": "kpi_data_sources",
                "title": "Data Sources Online",
                "current_value": data_sources_online,
                "change": "1 Stale (Davis Backup)",
                "status": "DEGRADED",
                "freshness": "12 sec ago",
                "trend": "STABLE",
                "accent": "emerald"
            }
        ]

        return {
            "kpis": kpis,
            "pipeline": self.pipeline_stages,
            "recent_acquisitions": self.scenes[:4],
            "vessels_at_risk": [v for v in self.vessels if v["route_risk_level"] in ["HIGH", "CRITICAL"]],
            "ice_summary": self.ice_regions[0],
            "top_alerts": self.alerts[:4],
            "timestamp": now.isoformat()
        }

    def get_acquisitions(self) -> Dict[str, Any]:
        """Returns all satellite scenes with metadata and pipeline states"""
        return {
            "scenes": self.scenes,
            "total_count": len(self.scenes),
            "pipeline_stages": self.pipeline_stages,
            "coverage_passes": self.coverage_passes
        }

    def get_scene_details(self, scene_id: str) -> Optional[Dict[str, Any]]:
        for scene in self.scenes:
            if scene["scene_id"] == scene_id or scene["id"] == scene_id:
                # Add deep metadata
                return {
                    **scene,
                    "metadata": {
                        "solar_zenith_angle": 74.2,
                        "solar_azimuth_angle": 18.5,
                        "incidence_angle_near": 30.8,
                        "incidence_angle_far": 45.2,
                        "relative_orbit": 142,
                        "pass_direction": "DESCENDING",
                        "epsg_crs": "EPSG:3031 (Antarctic Polar Stereographic)",
                        "instrument_mode": "Interferometric Wide (IW)",
                        "swath_width_km": 250.0,
                        "radiometric_calibration": "Sigma0 Terrain-Corrected"
                    },
                    "detected_features_detail": [
                        {"type": "Compressive Ridge", "confidence": 0.88, "keel_depth_m": 2.1, "coords": [76.92, -67.84]},
                        {"type": "Open Water Lead", "confidence": 0.94, "width_m": 420, "coords": [77.40, -67.60]},
                        {"type": "Fast Ice Boundary", "confidence": 0.96, "shear_zone": True, "coords": [78.20, -68.40]}
                    ],
                    "risk_assessment": {
                        "risk_level": scene.get("ai_risk_score", 75),
                        "affected_asset": scene.get("affected_vessel", "Polar Star"),
                        "advisory": scene.get("recommendation_summary", "")
                    }
                }
        return None

    def get_providers(self) -> Dict[str, Any]:
        return {"providers": self.providers, "count": len(self.providers)}

    def get_coverage(self) -> Dict[str, Any]:
        return {
            "coverage_passes": self.coverage_passes,
            "aois": self.aois,
            "count": len(self.coverage_passes)
        }

    def get_ice_status(self) -> Dict[str, Any]:
        return {
            "regions": self.ice_regions,
            "overall_ice_risk": "HIGH",
            "highest_risk_region": "Prydz Bay / Davis Sea",
            "count": len(self.ice_regions)
        }

    def get_weather_intelligence(self) -> Dict[str, Any]:
        return {
            "stations_weather": self.weather_reports,
            "active_warnings": [
                {"warning": "Katabatic Blizzard Warning", "sector": "Prydz Bay / Davis Sea", "gusts_knots": 62, "severity": "CRITICAL"}
            ],
            "count": len(self.weather_reports)
        }

    def get_vessels_intelligence(self) -> Dict[str, Any]:
        return {
            "vessels": self.vessels,
            "count": len(self.vessels),
            "high_risk_vessels": [v["name"] for v in self.vessels if v["route_risk_level"] in ["HIGH", "CRITICAL"]]
        }

    def get_risk_summary(self) -> Dict[str, Any]:
        return self.risk_summary

    def get_models(self) -> Dict[str, Any]:
        return {
            "models": self.models,
            "count": len(self.models),
            "production_count": sum(1 for m in self.models if m["current_status"] == "PRODUCTION")
        }

    def get_model_details(self, model_id: str) -> Optional[Dict[str, Any]]:
        for m in self.models:
            if m["model_id"] == model_id:
                return m
        return None

    def get_model_metrics(self, model_id: str) -> Optional[Dict[str, Any]]:
        m = self.get_model_details(model_id)
        if m:
            return {
                "model_id": model_id,
                "model_name": m["model_name"],
                "version": m["version"],
                "metrics": m.get("metrics", {}),
                "evaluation_metrics": m["evaluation_metrics"],
                "drift_status": m["drift_status"]
            }
        return None

    def get_alerts(self) -> Dict[str, Any]:
        return {
            "alerts": self.alerts,
            "count": len(self.alerts),
            "unresolved_critical": sum(1 for a in self.alerts if a["severity"] == "CRITICAL" and a["status"] == "ACTIVE")
        }

    def get_data_quality(self) -> Dict[str, Any]:
        return self.data_quality

    def get_timeline(self) -> Dict[str, Any]:
        return {
            "timeline": self.timeline_steps,
            "count": len(self.timeline_steps)
        }

    def run_scenario_simulation(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Scenario Simulation ('What If?') Engine (Section 30).
        Calculates simulated route impact, ETA delta, and fuel impact when operators test parameters.
        Explicitly marked SIMULATION / ADVISORY.
        """
        ice_delta = float(payload.get("ice_delta_pct", 20.0))
        wind_delta = float(payload.get("wind_delta_knots", 15.0))
        engine_derate = float(payload.get("engine_derate_pct", 0.0))
        vessel_name = payload.get("affected_vessel", "Polar Star")

        # Physics-based synthetic estimation
        base_delay = 14.5
        ice_impact = (ice_delta / 10.0) * 4.2
        wind_impact = (wind_delta / 10.0) * 2.8
        engine_impact = (engine_derate / 10.0) * 3.5

        simulated_delay = base_delay + ice_impact + wind_impact + engine_impact
        simulated_fuel_tons = (simulated_delay / 24.0) * 38.0

        risk_rating = "CRITICAL" if simulated_delay > 25.0 else ("HIGH" if simulated_delay > 12.0 else "MEDIUM")

        simulation_result = {
            "simulation_id": f"SIM-{uuid.uuid4().hex[:6].upper()}",
            "simulation_name": f"Simulation: {vessel_name} (Ice +{ice_delta}%, Wind +{wind_delta}kt)",
            "affected_vessel": vessel_name,
            "affected_station": "Davis Station",
            "parameters_tested": {
                "ice_concentration_delta_pct": ice_delta,
                "wind_speed_delta_knots": wind_delta,
                "engine_derate_pct": engine_derate
            },
            "simulated_outcomes": {
                "total_delay_hours": round(simulated_delay, 1),
                "delay_increase_hours": round(simulated_delay - base_delay, 1),
                "additional_fuel_consumption_tons": round(simulated_fuel_tons, 1),
                "simulated_risk_level": risk_rating,
                "recommended_mitigation": "Divert Polar Star via Sector 4 Open Lead to avoid 2.1m ridge keels; reduces simulated delay by 9.4 hours."
            },
            "cascading_impacts": [
                {"entity": "Davis Station", "impact": "Fuel resupply delayed; station may need to enforce Tier 2 energy conservation."},
                {"entity": "Biological Cargo", "impact": "Hold #3 reefer battery autonomy reaches 92% capacity."},
                {"entity": "Expedition 26", "impact": "Departure delayed by 18 hours."}
            ],
            "disclaimer": "SIMULATION / ADVISORY - Not an automatic operational command. Requires authorized Commander approval.",
            "timestamp": utc_now().isoformat()
        }

        # Log simulation event
        self.audit_log.append({
            "id": f"AUD-{uuid.uuid4().hex[:8]}",
            "timestamp": utc_now().isoformat(),
            "actor": payload.get("actor", "Operational Analyst"),
            "actor_role": payload.get("actor_role", "Analyst"),
            "action": "Ran Scenario Simulation",
            "target_entity": vessel_name,
            "model_id": "XGB_POLAR_ETA_v2.4",
            "confidence": 0.84,
            "review_status": "SIMULATED",
            "details": f"Simulated Ice +{ice_delta}%, Wind +{wind_delta}kt -> Delay: +{round(simulated_delay, 1)}h"
        })

        return simulation_result

    def perform_hitl_action(self, action: str, alert_id: str, actor: str = "Duty Commander", role: str = "Commander", notes: str = "") -> Dict[str, Any]:
        """
        Human-in-the-Loop Workflow (Section 23).
        Supports: REVIEW, ACKNOWLEDGE, DISMISS, ESCALATE.
        """
        valid_actions = ["ACKNOWLEDGE", "REVIEW", "DISMISS", "ESCALATE"]
        if action.upper() not in valid_actions:
            return {"success": False, "error": f"Invalid action '{action}'. Must be one of {valid_actions}."}

        found_alert = None
        for a in self.alerts:
            if a["id"] == alert_id:
                found_alert = a
                break

        if not found_alert:
            return {"success": False, "error": f"Alert '{alert_id}' not found."}

        action_upper = action.upper()
        if action_upper == "ACKNOWLEDGE":
            found_alert["status"] = "ACKNOWLEDGED"
        elif action_upper == "DISMISS":
            found_alert["status"] = "DISMISSED"
        elif action_upper == "ESCALATE":
            found_alert["status"] = "ESCALATED"
        elif action_upper == "REVIEW":
            found_alert["status"] = "UNDER_REVIEW"

        found_alert["human_reviewer"] = f"{actor} ({role})"

        # Create immutable audit record
        audit_entry = {
            "id": f"AUD-{uuid.uuid4().hex[:8]}",
            "timestamp": utc_now().isoformat(),
            "actor": f"{actor} ({role})",
            "actor_role": role,
            "action": f"{action_upper} ALERT",
            "target_entity": found_alert["affected_entity"],
            "model_id": found_alert.get("source_satellite", "Satellite Radar Engine"),
            "confidence": 0.88,
            "review_status": found_alert["status"],
            "details": notes or f"Operator executed {action_upper} on alert {alert_id} ({found_alert['title']})."
        }
        self.audit_log.append(audit_entry)

        return {
            "success": True,
            "alert_id": alert_id,
            "new_status": found_alert["status"],
            "audit_record": audit_entry
        }

    def trigger_demo_event(self) -> Dict[str, Any]:
        """
        End-to-End Demo Trigger (Section 38 & 39).
        Simulates:
        1. Satellite acquisition (Sentinel-1 SAR) detects increasing sea-ice ridge near Polar Star (+18%).
        2. Geospatial processing pipeline extracts ice feature & ridge keels.
        3. Ice risk set to HIGH (score 88).
        4. Vessel risk for Polar Star elevated to HIGH (delay +14.5 hours).
        5. XGBoost ETA predictor updates voyage projection.
        6. Intelligence Alert dispatched.
        7. Command Center notification emitted.
        8. Digital Twin impact calculated (+14.5h delay, Cape Town -> Davis).
        """
        now = utc_now()

        # Update Polar Star state
        for v in self.vessels:
            if v["name"] == "Polar Star":
                v["route_risk_level"] = "HIGH"
                v["route_risk_score"] = 88
                v["predicted_delay_hours"] = 18.2
                v["nearby_ice"]["concentration_pct"] = 82.0
                v["hitl_status"] = "REQUIRES_REVIEW"
                break

        # Generate new alert
        new_alert = {
            "id": f"ALT_DEMO_{uuid.uuid4().hex[:6].upper()}",
            "alert_type": "HIGH_ICE_RISK_DETECTED",
            "severity": "CRITICAL",
            "title": "DEMO: Critical Sea-Ice Compression Ridge Ahead of Polar Star",
            "affected_entity": "Polar Star (IMO 9123456)",
            "source_satellite": "Sentinel-1A SAR",
            "observation_freshness": "Just now",
            "risk_level": "CRITICAL",
            "cause": "Sentinel-1 SAR C-band pass detects sea-ice concentration spike to 82.0% and 2.4m keel thickness.",
            "recommended_action": "Divert Polar Star immediately via Sector 4 Open Lead. Avoid straight pack penetration.",
            "status": "ACTIVE",
            "human_reviewer": None,
            "created_at": now.isoformat(),
            "audit_recorded": True
        }
        self.alerts.insert(0, new_alert)

        # Record in audit log
        self.audit_log.append({
            "id": f"AUD-{uuid.uuid4().hex[:8]}",
            "timestamp": now.isoformat(),
            "actor": "POLARONE Satellite Processing Daemon",
            "actor_role": "AI Engine",
            "action": "DEMO SCENARIO TRIGGERED: Ice Compression Near Polar Star",
            "target_entity": "Polar Star",
            "model_id": "XGB_POLAR_ETA_v2.4",
            "confidence": 0.88,
            "review_status": "DISPATCHED",
            "details": "Triggered complete end-to-end intelligence cascade: SAR -> Ice -> Vessel Risk -> Alert -> Command Center."
        })

        return {
            "status": "success",
            "message": "END-TO-END SATELLITE + AI INTELLIGENCE CASCADE ACTIVATED",
            "cascade_steps": [
                {"step": 1, "system": "Sentinel-1A SAR", "event": "Acquired high-res C-band swath over Prydz Bay. Backscatter indicates 82% sea-ice concentration."},
                {"step": 2, "system": "Geospatial Pipeline", "event": "Extracted compressive ridge polygon (Area: 142 sq km, Keel: 2.4m)."},
                {"step": 3, "system": "Ice Intelligence", "event": "Prydz Bay Ice Risk Score updated to 88 (CRITICAL)."},
                {"step": 4, "system": "XGBoost ETA Predictor v2.4", "event": "Polar Star delay recalculated: +18.2 hours (Confidence: 88%)."},
                {"step": 5, "system": "Intelligence Alerts", "event": f"Critical Alert {new_alert['id']} dispatched to Operator Queue."},
                {"step": 6, "system": "Command Center Integration", "event": "Dispatched priority banner to Command Center header."},
                {"step": 7, "system": "Digital Twin Integration", "event": "Updated 3D vessel coordinate trail and projected route diversion in Digital Twin."}
            ],
            "affected_vessel": "Polar Star",
            "projected_delay": "+18.2 hours",
            "timestamp": now.isoformat()
        }

# Global singleton service
intelligence_service = IntelligenceService()
