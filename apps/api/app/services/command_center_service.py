"""
Antarctic Operations Command Center Service Layer.
Single pane of glass backend providing synchronized fleet telemetry, station vitals,
environmental GIS data, ML predictions (XGBoost, LightGBM, Isolation Forest, Autoencoder, OR-Tools - NO Random Forest),
multi-source data freshness, prioritized alerts, and Human-in-the-Loop approval audit logs.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, timezone, timedelta
import uuid

def utc_now() -> datetime:
    return datetime.now(timezone.utc)

class CommandCenterService:
    def __init__(self):
        self.active_scenario: str = "SCENARIO_1_NORMAL"
        self.scenario_name: str = "Normal Operations"
        
        # Audit Log for Human-in-the-Loop actions
        self.audit_log: List[Dict[str, Any]] = [
            {
                "audit_id": "AUD-2026-0921",
                "timestamp": (utc_now() - timedelta(hours=2, minutes=15)).isoformat(),
                "actor": "Commander E. Hayes (Duty Commander)",
                "actor_role": "Commander",
                "action": "Acknowledge Alert",
                "target_entity": "Polar Star (IMO 9123456)",
                "details": "Acknowledged AIS speed reduction alert due to marginal pack ice entry.",
                "status": "RECORDED"
            },
            {
                "audit_id": "AUD-2026-0920",
                "timestamp": (utc_now() - timedelta(hours=4, minutes=40)).isoformat(),
                "actor": "Lt. Dr. R. Vance (Safety Officer)",
                "actor_role": "Safety Officer",
                "action": "Approved Weather Advisory Dispatch",
                "target_entity": "Halley VI Station",
                "details": "Pre-authorized station blizzard tie-down protocol following ECMWF 50kt warning.",
                "status": "APPROVED"
            }
        ]

        # Recommendations requiring Human-in-the-Loop approval
        self.recommendations: List[Dict[str, Any]] = [
            {
                "recommendation_id": "REC-2026-088",
                "vessel_id": "VESSEL_POLAR_STAR",
                "vessel_name": "Polar Star",
                "severity": "HIGH",
                "title": "Review Alternate Route B (Open Lead Bypass)",
                "reason": "High sea-ice concentration (42%) and reduced vessel speed (6.2 kt vs 12.0 kt design) causing projected +26h delay to Davis Station.",
                "confidence": 0.76,
                "model_id": "XGB_POLAR_ETA_v2.4",
                "model_name": "XGBoost Polar Voyage Predictor",
                "contributing_factors": [
                    {"factor": "Sea Ice Concentration", "impact_hours": 11.2, "percentage": 43},
                    {"factor": "Headwind Shear (45kt)", "impact_hours": 7.4, "percentage": 28},
                    {"factor": "Reduced Hull Speed", "impact_hours": 4.1, "percentage": 16},
                    {"factor": "Route Pack Convergence", "impact_hours": 3.8, "percentage": 13}
                ],
                "evidence": {
                    "satellite_obs_id": "SAR-S1A-20260927-0415",
                    "satellite_source": "Sentinel-1 SAR",
                    "wind_forecast_knots": 45.0,
                    "ice_compression_index": 0.78,
                    "route_delta_nm": "+34 nm",
                    "eta_gain_hours": 14.5
                },
                "suggested_action": "Divert Polar Star northeast through waypoint Sector 4 lead to bypass heavy pack ridge and regain 14.5 hours.",
                "status": "PENDING_APPROVAL",
                "created_at": (utc_now() - timedelta(minutes=28)).isoformat(),
                "approved_by": None,
                "approved_at": None,
                "approval_notes": None
            },
            {
                "recommendation_id": "REC-2026-089",
                "station_id": "STATION_HALLEY_VI",
                "station_name": "Halley VI",
                "severity": "MEDIUM",
                "title": "Switch to Secondary Iridium Certus Link",
                "reason": "Primary Starlink Polar array experiencing high packet loss (>38%) due to atmospheric aurora storm.",
                "confidence": 0.89,
                "model_id": "LGBM_TELEMETRY_FORECAST_v1.8",
                "model_name": "LightGBM Telemetry Resilience Predictor",
                "contributing_factors": [
                    {"factor": "Solar Flux Index", "impact_hours": 0.0, "percentage": 52},
                    {"factor": "Ground Antenna Snow Accumulation", "impact_hours": 0.0, "percentage": 48}
                ],
                "evidence": {
                    "packet_loss_rate": "38.4%",
                    "backup_link_health": "100% nominal",
                    "latency_impact": "+140ms"
                },
                "suggested_action": "Switch command telemetry uplink to Iridium Certus channel B until geomagnetic storm passes.",
                "status": "PENDING_APPROVAL",
                "created_at": (utc_now() - timedelta(minutes=45)).isoformat(),
                "approved_by": None,
                "approved_at": None,
                "approval_notes": None
            }
        ]

        # Prioritized Alerts
        self.alerts: List[Dict[str, Any]] = [
            {
                "alert_id": "ALT-2026-401",
                "timestamp": (utc_now() - timedelta(minutes=14)).isoformat(),
                "location": "Weddell Sea (68.4°S, 52.1°W)",
                "entity_id": "VESSEL_POLAR_STAR",
                "entity_name": "Polar Star",
                "entity_type": "VESSEL",
                "severity": "HIGH",
                "title": "Vessel Entering Severe Ice Compression Zone",
                "description": "AIS speed dropped to 6.2 knots. Sentinel-1 SAR confirms convergent pack ice ridge ahead of current planned route.",
                "source": "AIS + Sentinel-1 SAR Fusion",
                "recommended_action": "Review alternate lead route via Sector 4.",
                "status": "NEW",
                "human_decision_required": True,
                "freshness": "FRESH"
            },
            {
                "alert_id": "ALT-2026-402",
                "timestamp": (utc_now() - timedelta(minutes=38)).isoformat(),
                "location": "Halley VI Station (75.58°S, 26.66°W)",
                "entity_id": "STATION_HALLEY_VI",
                "entity_name": "Halley VI Station",
                "entity_type": "STATION",
                "severity": "CRITICAL",
                "title": "Primary Station Comms Link Degraded",
                "description": "Starlink Polar terminal offline; automatic failover to Iridium Certus 700 degraded. Last batch telemetry received 48m ago.",
                "source": "Comms Gateway Sentinel",
                "recommended_action": "Attempt backup Iridium voice handshake with Station Leader.",
                "status": "ACKNOWLEDGED",
                "human_decision_required": True,
                "freshness": "STALE"
            },
            {
                "alert_id": "ALT-2026-403",
                "timestamp": (utc_now() - timedelta(hours=1, minutes=12)).isoformat(),
                "location": "Prydz Bay / Davis Corridor (68.5°S, 77.9°E)",
                "entity_id": "VESSEL_POLAR_STAR",
                "entity_name": "Polar Star",
                "entity_type": "VESSEL",
                "severity": "MEDIUM",
                "title": "ETA Degradation Detected",
                "description": "AI predicts +26h delay for Davis Station critical medical & generator spares arrival.",
                "source": "XGBoost ETA Predictor",
                "recommended_action": "Notify Davis Station supply commander of delayed ETA window.",
                "status": "INVESTIGATING",
                "human_decision_required": False,
                "freshness": "FRESH"
            },
            {
                "alert_id": "ALT-2026-404",
                "timestamp": (utc_now() - timedelta(hours=2, minutes=5)).isoformat(),
                "location": "Ross Sea Sector (72.0°S, 175.0°E)",
                "entity_id": "REGION_ROSS_SEA",
                "entity_name": "Ross Sea Operational Sector",
                "entity_type": "WEATHER",
                "severity": "LOW",
                "title": "Gale Warning: 48-Hour Forecast Updated",
                "description": "ECMWF high-resolution run predicts Antarctic katabatic storm intensification up to 55 knots in coastal corridors.",
                "source": "ECMWF Polar Forecast Model",
                "recommended_action": "Logistics operations in McMurdo sound instructed to secure shore cranes.",
                "status": "RESOLVED",
                "human_decision_required": False,
                "freshness": "FRESH"
            },
            {
                "alert_id": "ALT-2026-405",
                "timestamp": (utc_now() - timedelta(hours=3, minutes=20)).isoformat(),
                "location": "Princess Astrid Coast (70.76°S, 11.73°E)",
                "entity_id": "STATION_MAITRI",
                "entity_name": "Maitri Station",
                "entity_type": "STATION",
                "severity": "INFORMATIONAL",
                "title": "Scheduled Solar Battery Bank Maintenance",
                "description": "Routine solar-inverter switch completed. Secondary diesel backup generators operating at 100% readiness.",
                "source": "Station SCADA Feed",
                "recommended_action": "No operational intervention required.",
                "status": "RESOLVED",
                "human_decision_required": False,
                "freshness": "FRESH"
            }
        ]

        # Operational Timeline Events
        self.events: List[Dict[str, Any]] = [
            {
                "event_id": "EVT-1001",
                "timestamp": (utc_now() - timedelta(minutes=14)).isoformat(),
                "time_display": "10:42 UTC",
                "category": "VESSEL_TELEMETRY",
                "severity": "WARNING",
                "title": "Polar Star Speed Reduced to 6.2 knots",
                "description": "Speed reduction registered as vessel entered 42% sea-ice pack in Weddell corridor.",
                "entity": "Polar Star",
                "source": "AIS Stream"
            },
            {
                "event_id": "EVT-1002",
                "timestamp": (utc_now() - timedelta(minutes=40)).isoformat(),
                "time_display": "10:16 UTC",
                "category": "ENVIRONMENTAL_ICE",
                "severity": "WARNING",
                "title": "Sea-Ice Compression Advisory Generated",
                "description": "Copernicus AMSR2 microwave radiometer detected ice convergence along Route R-01.",
                "entity": "Weddell Sector",
                "source": "Copernicus Sea-Ice Service"
            },
            {
                "event_id": "EVT-1003",
                "timestamp": (utc_now() - timedelta(hours=1, minutes=10)).isoformat(),
                "time_display": "09:46 UTC",
                "category": "SATELLITE",
                "severity": "INFO",
                "title": "Sentinel-1 SAR Swath Ingested & Processed",
                "description": "High-resolution 10m C-band SAR observation covering 250km swath in Weddell Sea ingested. Ice lead network mapped.",
                "entity": "Sentinel-1A",
                "source": "ESA Copernicus Hub"
            },
            {
                "event_id": "EVT-1004",
                "timestamp": (utc_now() - timedelta(hours=2, minutes=5)).isoformat(),
                "time_display": "08:51 UTC",
                "category": "PREDICTION_ML",
                "severity": "WARNING",
                "title": "Route Risk Elevated to HIGH for Polar Star",
                "description": "XGBoost multi-factor model recalculated risk index from 0.42 to 0.78 with 76% confidence.",
                "entity": "Polar Star",
                "source": "XGB_POLAR_ETA_v2.4"
            },
            {
                "event_id": "EVT-1005",
                "timestamp": (utc_now() - timedelta(hours=3, minutes=15)).isoformat(),
                "time_display": "07:41 UTC",
                "category": "WEATHER",
                "severity": "INFO",
                "title": "ECMWF Global Polar 06Z Cycle Integrated",
                "description": "Synoptic weather vectors and storm isobar grids updated. Wind direction shifting south-southwest.",
                "entity": "All Antarctica",
                "source": "ECMWF Numerical Weather"
            },
            {
                "event_id": "EVT-1006",
                "timestamp": (utc_now() - timedelta(hours=4, minutes=30)).isoformat(),
                "time_display": "06:26 UTC",
                "category": "STATION_TELEMETRY",
                "severity": "INFO",
                "title": "Davis Station Routine Daily Log Synchronized",
                "description": "Fuel reserves 142 days, generator load balanced, life support indices at 96% nominal.",
                "entity": "Davis Station",
                "source": "Davis Iridium Telemetry"
            }
        ]

    # ========================================================
    # Multi-Source Data Health
    # ========================================================
    def get_data_health(self) -> Dict[str, Any]:
        return {
            "summary": {
                "overall_health": "HEALTHY",
                "healthy_feeds": 6,
                "stale_feeds": 1,
                "offline_feeds": 0,
                "total_feeds": 7,
                "data_integrity_score": "94.2%"
            },
            "feeds": [
                {
                    "feed_name": "Satellite AIS Fleet Tracking",
                    "source": "Spire Global / ExactEarth AIS",
                    "status": "FRESH",
                    "last_updated": (utc_now() - timedelta(seconds=32)).isoformat(),
                    "data_age": "32 seconds",
                    "latency_ms": 280,
                    "quality": "99.8% packet validity",
                    "warning": None
                },
                {
                    "feed_name": "Numerical Weather Prediction (NWP)",
                    "source": "ECMWF / NOAA GFS Polar High-Res",
                    "status": "FRESH",
                    "last_updated": (utc_now() - timedelta(minutes=18)).isoformat(),
                    "data_age": "18 minutes",
                    "latency_ms": 1150,
                    "quality": "100% nominal grid sync",
                    "warning": None
                },
                {
                    "feed_name": "Sea Ice Concentration & Drift",
                    "source": "Copernicus Marine / AMSR2 Radiometer",
                    "status": "FRESH",
                    "last_updated": (utc_now() - timedelta(hours=1, minutes=45)).isoformat(),
                    "data_age": "1h 45m",
                    "latency_ms": 3400,
                    "quality": "85% cloud-penetrating microwave coverage",
                    "warning": None
                },
                {
                    "feed_name": "SAR Satellite Intelligence",
                    "source": "Sentinel-1 (ESA) & Radarsat RCM",
                    "status": "FRESH",
                    "last_updated": (utc_now() - timedelta(hours=4, minutes=12)).isoformat(),
                    "data_age": "4h 12m",
                    "latency_ms": 4200,
                    "quality": "Next scheduled pass in 1h 48m",
                    "warning": "Periodic orbit pass, not real-time video"
                },
                {
                    "feed_name": "Antarctic Station SCADA Telemetry",
                    "source": "Iridium Short Burst Data / Starlink Polar",
                    "status": "STALE",
                    "last_updated": (utc_now() - timedelta(hours=1, minutes=2)).isoformat(),
                    "data_age": "1h 02m",
                    "latency_ms": 8900,
                    "quality": "Halley VI degraded comms link",
                    "warning": "Halley VI telemetry delayed due to geomagnetic aurora disturbance"
                },
                {
                    "feed_name": "Cargo Manifests & Cold-Chain Stream",
                    "source": "Polar Logistics Inventory DB",
                    "status": "FRESH",
                    "last_updated": (utc_now() - timedelta(minutes=24)).isoformat(),
                    "data_age": "24 minutes",
                    "latency_ms": 410,
                    "quality": "All 128 active manifests reconciled",
                    "warning": None
                },
                {
                    "feed_name": "Emergency SAR & Dispatch Network",
                    "source": "MRCC Ushuaia / COSPAS-SARSAT",
                    "status": "FRESH",
                    "last_updated": (utc_now() - timedelta(minutes=5)).isoformat(),
                    "data_age": "5 minutes",
                    "latency_ms": 190,
                    "quality": "Active beacon standby",
                    "warning": None
                }
            ]
        }

    # ========================================================
    # Fleet Telemetry
    # ========================================================
    def get_vessels(self) -> List[Dict[str, Any]]:
        # Fleet of 6 polar vessels operating across Antarctica
        return [
            {
                "id": "VESSEL_POLAR_STAR",
                "name": "Polar Star",
                "imo": "9123456",
                "mmsi": "367123000",
                "callsign": "WAGB-10",
                "vessel_type": "Heavy Icebreaker",
                "ice_class": "Polar Class 1 (PC1)",
                "flag": "United States",
                "length_m": 121.6,
                "beam_m": 25.6,
                "displacement_tons": 13190,
                "current_lat": -68.42,
                "current_lon": -52.14,
                "speed_knots": 6.2,
                "design_speed_knots": 12.0,
                "heading_degrees": 112,
                "destination": "Davis Station",
                "origin": "Hobart, Australia",
                "status": "DELAYED",
                "status_color": "ORANGE",
                "operational_state": "Breaking Ice in Weddell Channel",
                "original_eta": "2026-10-01T10:33:00Z",
                "provider_eta": "2026-10-01T12:33:00Z",
                "ai_predicted_eta": "2026-10-02T12:33:00Z",
                "expected_delay_hours": 26.0,
                "delay_reason": "High sea-ice concentration (42%) and reduced vessel speed",
                "risk_level": "HIGH",
                "risk_trend": "Worsening",
                "risk_confidence": 0.76,
                "prediction_timestamp": (utc_now() - timedelta(minutes=14)).isoformat(),
                "model_version": "XGB_POLAR_ETA_v2.4",
                "telemetry_freshness": "FRESH",
                "last_position_update": (utc_now() - timedelta(seconds=32)).isoformat(),
                "fuel_remaining_pct": 68.4,
                "crew_complement": 72,
                "cargo_summary": "1,450t Fuel Oil, 40t Emergency Medical Kits, Generator Spares",
                "factors": [
                    {"name": "Sea Ice Concentration", "impact": "+11h", "percentage": 43},
                    {"name": "Headwind Shear (45kt)", "impact": "+7h", "percentage": 28},
                    {"name": "Reduced Vessel Speed", "impact": "+4h", "percentage": 16},
                    {"name": "Route Pack Conditions", "impact": "+4h", "percentage": 13}
                ],
                "weather_at_pos": {
                    "temperature_c": -18.4,
                    "wind_speed_knots": 34.0,
                    "wind_direction": "SSW (205°)",
                    "visibility_km": 3.2,
                    "wave_height_m": 3.8,
                    "sea_state": "Sea State 5 (Rough Ice Edge)",
                    "barometric_pressure_hpa": 978.2
                },
                "coordinates_trail": {
                    "previous": [
                        [-42.88, 147.32],
                        [-55.20, 110.40],
                        [-62.10, 75.20],
                        [-65.40, -10.50],
                        [-68.10, -48.20]
                    ],
                    "current": [-68.42, -52.14],
                    "planned_route": [
                        [-68.42, -52.14],
                        [-69.10, -56.00],
                        [-71.50, -30.00],
                        [-69.80, 20.00],
                        [-68.57, 77.96]
                    ],
                    "predicted_alternate_route": [
                        [-68.42, -52.14],
                        [-67.50, -48.00],
                        [-67.10, -25.00],
                        [-67.80, 25.00],
                        [-68.57, 77.96]
                    ]
                }
            },
            {
                "id": "VESSEL_AURORA_EXP",
                "name": "Aurora Explorer",
                "imo": "9834211",
                "mmsi": "503004500",
                "callsign": "VNA-44",
                "vessel_type": "Polar Research & Supply",
                "ice_class": "Polar Class 3 (PC3)",
                "flag": "Australia",
                "length_m": 160.3,
                "beam_m": 25.6,
                "displacement_tons": 25500,
                "current_lat": -64.80,
                "current_lon": 82.50,
                "speed_knots": 11.8,
                "design_speed_knots": 14.5,
                "heading_degrees": 235,
                "destination": "Bharati Station",
                "origin": "Fremantle, Australia",
                "status": "NORMAL",
                "status_color": "GREEN",
                "operational_state": "Transit in Open Water",
                "original_eta": "2026-10-04T08:00:00Z",
                "provider_eta": "2026-10-04T08:30:00Z",
                "ai_predicted_eta": "2026-10-04T09:15:00Z",
                "expected_delay_hours": 1.25,
                "delay_reason": "Nominal passage with slight swell slowdown",
                "risk_level": "LOW",
                "risk_trend": "Stable",
                "risk_confidence": 0.91,
                "prediction_timestamp": (utc_now() - timedelta(minutes=22)).isoformat(),
                "model_version": "XGB_POLAR_ETA_v2.4",
                "telemetry_freshness": "FRESH",
                "last_position_update": (utc_now() - timedelta(seconds=45)).isoformat(),
                "fuel_remaining_pct": 84.1,
                "crew_complement": 84,
                "cargo_summary": "820t Science Equipment, 120t Food Supplies, Lab Containers",
                "factors": [
                    {"name": "Swell Retardation", "impact": "+1h", "percentage": 70},
                    {"name": "Minor Crosswinds", "impact": "+0.25h", "percentage": 30}
                ],
                "weather_at_pos": {
                    "temperature_c": -6.2,
                    "wind_speed_knots": 18.0,
                    "wind_direction": "WNW (290°)",
                    "visibility_km": 14.0,
                    "wave_height_m": 2.4,
                    "sea_state": "Sea State 4 (Moderate Swell)",
                    "barometric_pressure_hpa": 992.1
                },
                "coordinates_trail": {
                    "previous": [
                        [-32.06, 115.74],
                        [-48.20, 105.10],
                        [-58.40, 95.00]
                    ],
                    "current": [-64.80, 82.50],
                    "planned_route": [
                        [-64.80, 82.50],
                        [-67.20, 78.00],
                        [-69.40, 76.19]
                    ],
                    "predicted_alternate_route": [
                        [-64.80, 82.50],
                        [-67.20, 78.00],
                        [-69.40, 76.19]
                    ]
                }
            },
            {
                "id": "VESSEL_AGULHAS_II",
                "name": "S.A. Agulhas II",
                "imo": "9540704",
                "mmsi": "601112000",
                "callsign": "ZSAG",
                "vessel_type": "Polar Research & Logistics",
                "ice_class": "PC5 / DNV-GL Ice-10",
                "flag": "South Africa",
                "length_m": 134.2,
                "beam_m": 21.7,
                "displacement_tons": 12897,
                "current_lat": -70.10,
                "current_lon": 8.50,
                "speed_knots": 9.4,
                "design_speed_knots": 14.0,
                "heading_degrees": 145,
                "destination": "Maitri Station",
                "origin": "Cape Town, South Africa",
                "status": "ATTENTION",
                "status_color": "YELLOW",
                "operational_state": "Approaching Fimbul Ice Shelf",
                "original_eta": "2026-10-02T16:00:00Z",
                "provider_eta": "2026-10-02T18:00:00Z",
                "ai_predicted_eta": "2026-10-03T01:30:00Z",
                "expected_delay_hours": 9.5,
                "delay_reason": "Early ice edge contact and reduced visibility in flurries",
                "risk_level": "MEDIUM",
                "risk_trend": "Worsening",
                "risk_confidence": 0.83,
                "prediction_timestamp": (utc_now() - timedelta(minutes=18)).isoformat(),
                "model_version": "XGB_POLAR_ETA_v2.4",
                "telemetry_freshness": "FRESH",
                "last_position_update": (utc_now() - timedelta(seconds=12)).isoformat(),
                "fuel_remaining_pct": 71.0,
                "crew_complement": 45,
                "cargo_summary": "650t Winter Diesel, Caterpillar Track Spares, 2x Twin Otter Engine",
                "factors": [
                    {"name": "First-Year Pack Ice (25%)", "impact": "+5.5h", "percentage": 58},
                    {"name": "Reduced Visibility Snow Flurries", "impact": "+2.5h", "percentage": 26},
                    {"name": "Bergy Bit Avoidance", "impact": "+1.5h", "percentage": 16}
                ],
                "weather_at_pos": {
                    "temperature_c": -14.1,
                    "wind_speed_knots": 26.0,
                    "wind_direction": "E (090°)",
                    "visibility_km": 4.5,
                    "wave_height_m": 1.9,
                    "sea_state": "Sea State 3 (Damped by Ice Floes)",
                    "barometric_pressure_hpa": 984.0
                },
                "coordinates_trail": {
                    "previous": [
                        [-33.92, 18.42],
                        [-50.10, 14.20],
                        [-62.40, 10.80]
                    ],
                    "current": [-70.10, 8.50],
                    "planned_route": [
                        [-70.10, 8.50],
                        [-70.50, 10.20],
                        [-70.76, 11.73]
                    ],
                    "predicted_alternate_route": [
                        [-70.10, 8.50],
                        [-70.40, 9.80],
                        [-70.76, 11.73]
                    ]
                }
            },
            {
                "id": "VESSEL_XUE_LONG_2",
                "name": "Xue Long 2",
                "imo": "9829289",
                "mmsi": "413346000",
                "callsign": "BNCK",
                "vessel_type": "Double-Acting Icebreaker",
                "ice_class": "Polar Class 3 (PC3)",
                "flag": "China",
                "length_m": 122.5,
                "beam_m": 22.3,
                "displacement_tons": 13996,
                "current_lat": -74.80,
                "current_lon": 164.20,
                "speed_knots": 0.0,
                "design_speed_knots": 15.0,
                "heading_degrees": 340,
                "destination": "McMurdo Station",
                "origin": "Lyttelton, New Zealand",
                "status": "AT_PORT",
                "status_color": "GREEN",
                "operational_state": "Moored / Unloading at McMurdo Ice Pier",
                "original_eta": "2026-09-26T14:00:00Z",
                "provider_eta": "2026-09-26T14:00:00Z",
                "ai_predicted_eta": "2026-09-26T13:45:00Z",
                "expected_delay_hours": 0.0,
                "delay_reason": "Arrived on schedule",
                "risk_level": "LOW",
                "risk_trend": "Stable",
                "risk_confidence": 0.98,
                "prediction_timestamp": (utc_now() - timedelta(hours=12)).isoformat(),
                "model_version": "XGB_POLAR_ETA_v2.4",
                "telemetry_freshness": "FRESH",
                "last_position_update": (utc_now() - timedelta(minutes=2)).isoformat(),
                "fuel_remaining_pct": 52.8,
                "crew_complement": 90,
                "cargo_summary": "Unloading 2,200t Heavy Machinery and Construction Modulars",
                "factors": [],
                "weather_at_pos": {
                    "temperature_c": -22.0,
                    "wind_speed_knots": 12.0,
                    "wind_direction": "SE (135°)",
                    "visibility_km": 25.0,
                    "wave_height_m": 0.0,
                    "sea_state": "Sea State 0 (Protected Ice Sound)",
                    "barometric_pressure_hpa": 996.5
                },
                "coordinates_trail": {
                    "previous": [
                        [-43.60, 172.72],
                        [-60.20, 170.10],
                        [-71.10, 168.40]
                    ],
                    "current": [-74.80, 164.20],
                    "planned_route": [
                        [-74.80, 164.20]
                    ],
                    "predicted_alternate_route": [
                        [-74.80, 164.20]
                    ]
                }
            },
            {
                "id": "VESSEL_KRONPRINS_HAAKON",
                "name": "Kronprins Haakon",
                "imo": "9739587",
                "mmsi": "257277000",
                "callsign": "LJIT",
                "vessel_type": "Icebreaking Research Vessel",
                "ice_class": "PC3",
                "flag": "Norway",
                "length_m": 100.0,
                "beam_m": 21.0,
                "displacement_tons": 9000,
                "current_lat": -71.20,
                "current_lon": -2.80,
                "speed_knots": 0.0,
                "design_speed_knots": 15.0,
                "heading_degrees": 0,
                "destination": "Troll Station (via Coast)",
                "origin": "Tromsø, Norway",
                "status": "STALE",
                "status_color": "GRAY",
                "operational_state": "Anchored off Queen Maud Land (Comms Drop)",
                "original_eta": "2026-09-27T04:00:00Z",
                "provider_eta": "2026-09-27T04:00:00Z",
                "ai_predicted_eta": "Unavailable (Insufficient Telemetry)",
                "expected_delay_hours": 0.0,
                "delay_reason": "AIS Beacon last heard 2h 14m ago; maintaining last-known fix",
                "risk_level": "MEDIUM",
                "risk_trend": "Stable",
                "risk_confidence": 0.65,
                "prediction_timestamp": (utc_now() - timedelta(hours=2)).isoformat(),
                "model_version": "XGB_POLAR_ETA_v2.4",
                "telemetry_freshness": "STALE",
                "last_position_update": (utc_now() - timedelta(hours=2, minutes=14)).isoformat(),
                "fuel_remaining_pct": 62.0,
                "crew_complement": 40,
                "cargo_summary": "Scientific Glaciology Sensors, 4x Snowmobiles, Rations",
                "factors": [],
                "weather_at_pos": {
                    "temperature_c": -20.5,
                    "wind_speed_knots": 22.0,
                    "wind_direction": "S (180°)",
                    "visibility_km": 8.0,
                    "wave_height_m": 1.2,
                    "sea_state": "Sea State 2",
                    "barometric_pressure_hpa": 988.0
                },
                "coordinates_trail": {
                    "previous": [
                        [-65.00, -5.00],
                        [-68.50, -4.10]
                    ],
                    "current": [-71.20, -2.80],
                    "planned_route": [
                        [-71.20, -2.80]
                    ],
                    "predicted_alternate_route": [
                        [-71.20, -2.80]
                    ]
                }
            },
            {
                "id": "VESSEL_ATTENBOROUGH",
                "name": "RRS Sir David Attenborough",
                "imo": "9798222",
                "mmsi": "232029580",
                "callsign": "ZDLP",
                "vessel_type": "Polar Research Vessel",
                "ice_class": "PC4 / Polar Class 4",
                "flag": "United Kingdom",
                "length_m": 129.0,
                "beam_m": 24.0,
                "displacement_tons": 15000,
                "current_lat": -67.55,
                "current_lon": -68.12,
                "speed_knots": 10.4,
                "design_speed_knots": 13.0,
                "heading_degrees": 182,
                "destination": "Rothera Research Station",
                "origin": "Punta Arenas, Chile",
                "status": "NORMAL",
                "status_color": "GREEN",
                "operational_state": "Passage along Antarctic Peninsula",
                "original_eta": "2026-09-29T18:00:00Z",
                "provider_eta": "2026-09-29T18:30:00Z",
                "ai_predicted_eta": "2026-09-29T19:00:00Z",
                "expected_delay_hours": 0.5,
                "delay_reason": "Minor coastal current opposition",
                "risk_level": "LOW",
                "risk_trend": "Stable",
                "risk_confidence": 0.94,
                "prediction_timestamp": (utc_now() - timedelta(minutes=10)).isoformat(),
                "model_version": "XGB_POLAR_ETA_v2.4",
                "telemetry_freshness": "FRESH",
                "last_position_update": (utc_now() - timedelta(seconds=19)).isoformat(),
                "fuel_remaining_pct": 79.5,
                "crew_complement": 60,
                "cargo_summary": "Aviation Kerosene Drums for BAS Twin Otters, Fresh Supplies",
                "factors": [],
                "weather_at_pos": {
                    "temperature_c": -4.8,
                    "wind_speed_knots": 16.0,
                    "wind_direction": "SW (225°)",
                    "visibility_km": 18.0,
                    "wave_height_m": 2.1,
                    "sea_state": "Sea State 3",
                    "barometric_pressure_hpa": 994.2
                },
                "coordinates_trail": {
                    "previous": [
                        [-53.16, -70.91],
                        [-60.50, -68.00],
                        [-64.20, -67.50]
                    ],
                    "current": [-67.55, -68.12],
                    "planned_route": [
                        [-67.55, -68.12],
                        [-67.57, -68.13]
                    ],
                    "predicted_alternate_route": [
                        [-67.55, -68.12],
                        [-67.57, -68.13]
                    ]
                }
            }
        ]

    def get_vessel(self, vessel_id: str) -> Optional[Dict[str, Any]]:
        vessels = self.get_vessels()
        for v in vessels:
            if v["id"] == vessel_id or v["imo"] == vessel_id or v["name"].lower() == vessel_id.lower():
                return v
        return None

    # ========================================================
    # Stations Monitoring
    # ========================================================
    def get_stations(self) -> List[Dict[str, Any]]:
        return [
            {
                "id": "STATION_DAVIS",
                "name": "Davis Station",
                "country": "Australia",
                "operator": "Australian Antarctic Division (AAD)",
                "lat": -68.576,
                "lon": 77.967,
                "elevation_m": 12,
                "population": 120,
                "max_capacity": 150,
                "connectivity": "ONLINE",
                "connectivity_color": "GREEN",
                "comms_method": "Inmarsat GX / Starlink Polar Gateway",
                "last_contact": (utc_now() - timedelta(minutes=4)).isoformat(),
                "telemetry_age": "4 min ago",
                "power_status": "98% (3x Cummins QSK60 Diesel)",
                "fuel_days_remaining": 142,
                "critical_inventory_pct": 74.0,
                "life_support_pct": 96.0,
                "emergency_state": "NORMAL",
                "current_weather": {
                    "temperature_c": -16.2,
                    "wind_speed_knots": 18.5,
                    "wind_direction": "ENE (070°)",
                    "visibility_km": 15.0,
                    "pressure_hpa": 986.2,
                    "blizzard_active": False
                }
            },
            {
                "id": "STATION_MAITRI",
                "name": "Maitri Station",
                "country": "India",
                "operator": "National Centre for Polar and Ocean Research (NCPOR)",
                "lat": -70.767,
                "lon": 11.733,
                "elevation_m": 117,
                "population": 38,
                "max_capacity": 50,
                "connectivity": "ONLINE",
                "connectivity_color": "GREEN",
                "comms_method": "Dedicated C-band VSAT & Iridium Certus Backup",
                "last_contact": (utc_now() - timedelta(minutes=9)).isoformat(),
                "telemetry_age": "9 min ago",
                "power_status": "94% (Combined Solar/Diesel Hybrid)",
                "fuel_days_remaining": 68,
                "critical_inventory_pct": 62.0,
                "life_support_pct": 92.0,
                "emergency_state": "NORMAL",
                "current_weather": {
                    "temperature_c": -18.0,
                    "wind_speed_knots": 14.0,
                    "wind_direction": "SE (135°)",
                    "visibility_km": 12.0,
                    "pressure_hpa": 982.5,
                    "blizzard_active": False
                }
            },
            {
                "id": "STATION_BHARATI",
                "name": "Bharati Station",
                "country": "India",
                "operator": "NCPOR (Larsemann Hills)",
                "lat": -69.407,
                "lon": 76.191,
                "elevation_m": 35,
                "population": 48,
                "max_capacity": 72,
                "connectivity": "ONLINE",
                "connectivity_color": "GREEN",
                "comms_method": "High-Throughput Starlink Polar & Iridium Voice",
                "last_contact": (utc_now() - timedelta(minutes=2)).isoformat(),
                "telemetry_age": "2 min ago",
                "power_status": "99% (Tri-redundant MAN Gensets)",
                "fuel_days_remaining": 160,
                "critical_inventory_pct": 86.0,
                "life_support_pct": 98.0,
                "emergency_state": "NORMAL",
                "current_weather": {
                    "temperature_c": -13.5,
                    "wind_speed_knots": 11.0,
                    "wind_direction": "E (090°)",
                    "visibility_km": 20.0,
                    "pressure_hpa": 989.1,
                    "blizzard_active": False
                }
            },
            {
                "id": "STATION_MCMURDO",
                "name": "McMurdo Station",
                "country": "United States",
                "operator": "National Science Foundation (USAP)",
                "lat": -77.848,
                "lon": 166.668,
                "elevation_m": 24,
                "population": 640,
                "max_capacity": 1250,
                "connectivity": "ONLINE",
                "connectivity_color": "GREEN",
                "comms_method": "Ross Island Fiber Backbone & Dual Starlink Terminals",
                "last_contact": (utc_now() - timedelta(seconds=40)).isoformat(),
                "telemetry_age": "40 sec ago",
                "power_status": "99% (Crater Hill Wind Farm + Cat Gensets)",
                "fuel_days_remaining": 210,
                "critical_inventory_pct": 91.0,
                "life_support_pct": 99.0,
                "emergency_state": "NORMAL",
                "current_weather": {
                    "temperature_c": -21.4,
                    "wind_speed_knots": 16.0,
                    "wind_direction": "S (180°)",
                    "visibility_km": 28.0,
                    "pressure_hpa": 997.4,
                    "blizzard_active": False
                }
            },
            {
                "id": "STATION_AMUNDSEN_SCOTT",
                "name": "Amundsen-Scott South Pole Station",
                "country": "United States",
                "operator": "National Science Foundation (USAP)",
                "lat": -90.0,
                "lon": 0.0,
                "elevation_m": 2835,
                "population": 85,
                "max_capacity": 150,
                "connectivity": "ONLINE",
                "connectivity_color": "GREEN",
                "comms_method": "DSCS-3 / TDRS Equatorial Horizon Satellite Window",
                "last_contact": (utc_now() - timedelta(minutes=15)).isoformat(),
                "telemetry_age": "15 min ago",
                "power_status": "96% (Extreme Cold Diesel Prime)",
                "fuel_days_remaining": 178,
                "critical_inventory_pct": 82.0,
                "life_support_pct": 97.0,
                "emergency_state": "NORMAL",
                "current_weather": {
                    "temperature_c": -52.6,
                    "wind_speed_knots": 9.0,
                    "wind_direction": "GRID-NORTH (000°)",
                    "visibility_km": 50.0,
                    "pressure_hpa": 678.0,
                    "blizzard_active": False
                }
            },
            {
                "id": "STATION_HALLEY_VI",
                "name": "Halley VI Research Station",
                "country": "United Kingdom",
                "operator": "British Antarctic Survey (BAS)",
                "lat": -75.583,
                "lon": -26.666,
                "elevation_m": 30,
                "population": 22,
                "max_capacity": 52,
                "connectivity": "DEGRADED",
                "connectivity_color": "ORANGE",
                "comms_method": "Iridium Certus 700 (Starlink array offline)",
                "last_contact": (utc_now() - timedelta(minutes=48)).isoformat(),
                "telemetry_age": "48 min ago (STALE)",
                "power_status": "91% (Automated Modular Pod Energy)",
                "fuel_days_remaining": 88,
                "critical_inventory_pct": 70.0,
                "life_support_pct": 91.0,
                "emergency_state": "ATTENTION_REQUIRED",
                "current_weather": {
                    "temperature_c": -28.5,
                    "wind_speed_knots": 36.0,
                    "wind_direction": "W (270°)",
                    "visibility_km": 1.8,
                    "pressure_hpa": 972.1,
                    "blizzard_active": True
                }
            },
            {
                "id": "STATION_ROTHERA",
                "name": "Rothera Research Station",
                "country": "United Kingdom",
                "operator": "British Antarctic Survey (BAS)",
                "lat": -67.570,
                "lon": -68.125,
                "elevation_m": 16,
                "population": 95,
                "max_capacity": 130,
                "connectivity": "ONLINE",
                "connectivity_color": "GREEN",
                "comms_method": "BGAN High Gain & Antarctic Starlink Link",
                "last_contact": (utc_now() - timedelta(minutes=5)).isoformat(),
                "telemetry_age": "5 min ago",
                "power_status": "97%",
                "fuel_days_remaining": 125,
                "critical_inventory_pct": 79.0,
                "life_support_pct": 95.0,
                "emergency_state": "NORMAL",
                "current_weather": {
                    "temperature_c": -5.1,
                    "wind_speed_knots": 19.0,
                    "wind_direction": "SW (220°)",
                    "visibility_km": 16.0,
                    "pressure_hpa": 993.8,
                    "blizzard_active": False
                }
            },
            {
                "id": "STATION_NEUMAYER_III",
                "name": "Neumayer Station III",
                "country": "Germany",
                "operator": "Alfred Wegener Institute (AWI)",
                "lat": -70.674,
                "lon": -8.274,
                "elevation_m": 40,
                "population": 36,
                "max_capacity": 60,
                "connectivity": "ONLINE",
                "connectivity_color": "GREEN",
                "comms_method": "Hydraulic Platform Optical & Eutelsat VSAT",
                "last_contact": (utc_now() - timedelta(minutes=7)).isoformat(),
                "telemetry_age": "7 min ago",
                "power_status": "98% (Wind Turbines + Scania Diesel)",
                "fuel_days_remaining": 110,
                "critical_inventory_pct": 81.0,
                "life_support_pct": 96.0,
                "emergency_state": "NORMAL",
                "current_weather": {
                    "temperature_c": -17.2,
                    "wind_speed_knots": 24.0,
                    "wind_direction": "E (095°)",
                    "visibility_km": 9.0,
                    "pressure_hpa": 981.0,
                    "blizzard_active": False
                }
            }
        ]

    def get_station(self, station_id: str) -> Optional[Dict[str, Any]]:
        stations = self.get_stations()
        for s in stations:
            if s["id"] == station_id or s["name"].lower() == station_id.lower():
                return s
        return None

    # ========================================================
    # Weather System & Overlays
    # ========================================================
    def get_weather(self, horizon: str = "now") -> Dict[str, Any]:
        return {
            "forecast_horizon": horizon,
            "horizons_supported": ["now", "+6h", "+12h", "+24h", "+48h", "+7d"],
            "model_source": "ECMWF High-Resolution (0.1°) + NOAA GFS Polar Blended",
            "last_ingested": (utc_now() - timedelta(minutes=18)).isoformat(),
            "data_freshness": "FRESH",
            "active_blizzard_zones": [
                {
                    "zone_id": "BLZ-WEDDELL-01",
                    "region": "Weddell Sea Eastern Fringe",
                    "severity": "HIGH",
                    "winds_knots": 48.0,
                    "visibility_km": 0.8,
                    "temperature_c": -24.0,
                    "polygon": [
                        [-67.0, -55.0],
                        [-67.0, -45.0],
                        [-71.0, -45.0],
                        [-71.0, -55.0]
                    ]
                },
                {
                    "zone_id": "BLZ-ROSS-02",
                    "region": "Ross Sea Katabatic Funnel",
                    "severity": "CRITICAL",
                    "winds_knots": 56.0,
                    "visibility_km": 0.4,
                    "temperature_c": -31.0,
                    "polygon": [
                        [-73.0, 168.0],
                        [-73.0, 178.0],
                        [-77.0, 178.0],
                        [-77.0, 168.0]
                    ]
                }
            ],
            "observation_points": [
                {"lat": -68.42, "lon": -52.14, "temp": -18.4, "wind_kt": 34.0, "wind_deg": 205, "wave_m": 3.8, "desc": "Gale / Ice Flurries"},
                {"lat": -64.80, "lon": 82.50, "temp": -6.2, "wind_kt": 18.0, "wind_deg": 290, "wave_m": 2.4, "desc": "Moderate Swell"},
                {"lat": -70.10, "lon": 8.50, "temp": -14.1, "wind_kt": 26.0, "wind_deg": 90, "wave_m": 1.9, "desc": "Ice Fringe Squall"},
                {"lat": -74.80, "lon": 164.20, "temp": -22.0, "wind_kt": 12.0, "wind_deg": 135, "wave_m": 0.0, "desc": "Cold Clear Sound"},
                {"lat": -75.58, "lon": -26.66, "temp": -28.5, "wind_kt": 36.0, "wind_deg": 270, "wave_m": 0.0, "desc": "Blowing Snow / Low Vis"},
                {"lat": -68.57, "lon": 77.96, "temp": -16.2, "wind_kt": 18.5, "wind_deg": 70, "wave_m": 1.4, "desc": "Overcast"}
            ]
        }

    # ========================================================
    # Sea-Ice Monitoring
    # ========================================================
    def get_sea_ice(self) -> Dict[str, Any]:
        return {
            "source": "Copernicus Marine AMSR2 Microwave Radiometer + CryoSat-2 Altimetry",
            "last_observation": (utc_now() - timedelta(hours=1, minutes=45)).isoformat(),
            "data_freshness": "FRESH",
            "ice_edge_latitude_range": "-60.5°S to -64.2°S",
            "hazard_zones": [
                {
                    "zone_id": "ICE-HAZARD-W01",
                    "name": "Weddell Sea Heavy Ridge Compression",
                    "severity": "HIGH",
                    "concentration_pct": 88,
                    "ice_thickness_m": 2.4,
                    "drift_vector": "0.8 kt @ 045° (NE Drift)",
                    "risk_to_vessels": "Vessels without PC1-PC3 ice class risk hull entrapment and severe kinetic slowing.",
                    "coordinates": [
                        [-67.5, -54.0],
                        [-68.0, -48.0],
                        [-70.5, -48.0],
                        [-70.0, -55.0]
                    ]
                },
                {
                    "zone_id": "ICE-HAZARD-R02",
                    "name": "Ross Ice Shelf Shear Margin",
                    "severity": "MEDIUM",
                    "concentration_pct": 65,
                    "ice_thickness_m": 1.6,
                    "drift_vector": "0.5 kt @ 315° (NW Drift)",
                    "risk_to_vessels": "Navigable with caution by ice-strengthened cargo vessels.",
                    "coordinates": [
                        [-74.0, 165.0],
                        [-74.0, 172.0],
                        [-76.5, 172.0],
                        [-76.5, 165.0]
                    ]
                }
            ],
            "iceberg_tracking": [
                {"id": "A-23A", "type": "Tabular Giant", "area_sqkm": 3800, "lat": -61.2, "lon": -48.5, "drift": "0.9 kt ENE"},
                {"id": "B-22A-FRAG", "type": "Calved Iceberg Cluster", "area_sqkm": 120, "lat": -68.8, "lon": -53.2, "drift": "0.4 kt N"}
            ]
        }

    # ========================================================
    # Satellite Intelligence (Periodic Passes - NOT Live Video)
    # ========================================================
    def get_satellites(self) -> Dict[str, Any]:
        return {
            "disclaimer": "Antarctic satellite observations are periodic orbital passes (SAR/Optical). Feeds reflect explicit acquisition timestamps and are never represented as continuous live video.",
            "active_footprints": [
                {
                    "observation_id": "SAR-S1A-20260927-0415",
                    "satellite_name": "Sentinel-1A (ESA)",
                    "sensor_type": "Synthetic Aperture Radar (C-Band SAR)",
                    "capture_timestamp": (utc_now() - timedelta(hours=4, minutes=15)).isoformat(),
                    "coverage_area": "Weddell Sea Sector 4",
                    "resolution": "10m Ground Sampling Distance (GSD)",
                    "data_freshness": "FRESH (Acquired 4h ago)",
                    "lead_features_detected": "Open navigable lead detected 18nm northeast of Polar Star's track.",
                    "swath_polygon": [
                        [-66.5, -55.0],
                        [-66.5, -48.0],
                        [-70.5, -48.0],
                        [-70.5, -55.0]
                    ]
                },
                {
                    "observation_id": "SAR-RCM-20260927-0630",
                    "satellite_name": "Radarsat Constellation Mission (RCM-2)",
                    "sensor_type": "SAR Stripmap Polarimetric",
                    "capture_timestamp": (utc_now() - timedelta(hours=2, minutes=0)).isoformat(),
                    "coverage_area": "Prydz Bay / Larsemann Hills",
                    "resolution": "5m High-Resolution SAR",
                    "data_freshness": "FRESH (Acquired 2h ago)",
                    "lead_features_detected": "Fast ice fringe stable along approach to Bharati Station.",
                    "swath_polygon": [
                        [-68.0, 74.0],
                        [-68.0, 78.5],
                        [-70.2, 78.5],
                        [-70.2, 74.0]
                    ]
                },
                {
                    "observation_id": "OPT-L9-20260926-2245",
                    "satellite_name": "Landsat-9 (USGS/NASA)",
                    "sensor_type": "Operational Land Imager 2 (Optical Multispectral)",
                    "capture_timestamp": (utc_now() - timedelta(hours=9, minutes=30)).isoformat(),
                    "coverage_area": "Ross Island & McMurdo Sound",
                    "resolution": "15m Panchromatic / 30m Thermal",
                    "data_freshness": "STALE (Acquired 9h ago - Next daylight pass 14h)",
                    "lead_features_detected": "Clear optical visibility; sea-ice breakup in southern sound.",
                    "swath_polygon": [
                        [-76.5, 163.0],
                        [-76.5, 170.0],
                        [-78.5, 170.0],
                        [-78.5, 163.0]
                    ]
                }
            ]
        }

    # ========================================================
    # Routes & Missions
    # ========================================================
    def get_routes(self) -> List[Dict[str, Any]]:
        return [
            {
                "route_id": "ROUTE-POLAR-01",
                "name": "Weddell Supply Corridor to Davis",
                "assigned_vessel": "Polar Star",
                "status": "IMPACTED_BY_ICE",
                "planned_distance_nm": 3480,
                "remaining_distance_nm": 1640,
                "current_eta": "2026-10-02T12:33:00Z",
                "recommended_alternate": "Bypass Lead Sector 4 (+34 nm, +14.5h saved)",
                "risk_rating": "HIGH"
            },
            {
                "route_id": "ROUTE-AURORA-02",
                "name": "Indian Ocean Traverse to Bharati",
                "assigned_vessel": "Aurora Explorer",
                "status": "ON_SCHEDULE",
                "planned_distance_nm": 2860,
                "remaining_distance_nm": 620,
                "current_eta": "2026-10-04T09:15:00Z",
                "recommended_alternate": None,
                "risk_rating": "LOW"
            }
        ]

    def get_missions(self) -> List[Dict[str, Any]]:
        return [
            {
                "mission_id": "EXP-2026-04",
                "title": "Summer Resupply & Station Overhaul",
                "destination": "Maitri → Davis",
                "commander": "Cmdr. E. Hayes",
                "status": "IN_PROGRESS",
                "progress_pct": 68,
                "risk": "MEDIUM",
                "eta": "13 Oct 2026",
                "assigned_ships": ["Polar Star", "Aurora Explorer"],
                "critical_supplies": "Arctic Diesel, Generator Rotor Spares, Fresh Food"
            },
            {
                "mission_id": "EXP-2026-07",
                "title": "Deep Ice Core Drilling Logistics Traverse",
                "destination": "Concordia Station Link",
                "commander": "Dr. S. Jenks",
                "status": "IN_PROGRESS",
                "progress_pct": 42,
                "risk": "LOW",
                "eta": "24 Oct 2026",
                "assigned_ships": ["Xue Long 2 (Port Staging)"],
                "critical_supplies": "Core Thermal Drills, Liquid Nitrogen Dewars"
            }
        ]

    # ========================================================
    # ML Prediction Center
    # (XGBoost, LightGBM, Isolation Forest, Autoencoder, OR-Tools - NO Random Forest)
    # ========================================================
    def get_predictions(self) -> Dict[str, Any]:
        return {
            "ml_stack_frameworks": ["XGBoost", "LightGBM", "Isolation Forest", "Autoencoder", "Google OR-Tools"],
            "fleet_eta_predictions": [
                {
                    "entity_id": "VESSEL_POLAR_STAR",
                    "entity_name": "Polar Star",
                    "target": "Davis Station",
                    "predicted_eta": "2026-10-02T12:33:00Z",
                    "confidence": 0.76,
                    "expected_delay_hours": 26.0,
                    "model": "XGBoost Polar Voyage Regressor v2.4",
                    "model_framework": "XGBoost",
                    "top_contributing_factors": [
                        {"factor": "Sea Ice Concentration (42%)", "impact": "+11.2h", "shap_weight": 0.43},
                        {"factor": "Headwind Shear (34-45kt)", "impact": "+7.4h", "shap_weight": 0.28},
                        {"factor": "Reduced Hull Speed (6.2kt)", "impact": "+4.1h", "shap_weight": 0.16},
                        {"factor": "Route Pack Compression", "impact": "+3.8h", "shap_weight": 0.13}
                    ]
                },
                {
                    "entity_id": "VESSEL_AGULHAS_II",
                    "entity_name": "S.A. Agulhas II",
                    "target": "Maitri Station",
                    "predicted_eta": "2026-10-03T01:30:00Z",
                    "confidence": 0.83,
                    "expected_delay_hours": 9.5,
                    "model": "XGBoost Polar Voyage Regressor v2.4",
                    "model_framework": "XGBoost",
                    "top_contributing_factors": [
                        {"factor": "First-Year Pack Ice Contact", "impact": "+5.5h", "shap_weight": 0.58},
                        {"factor": "Visibility Squalls", "impact": "+2.5h", "shap_weight": 0.26},
                        {"factor": "Swell Retardation", "impact": "+1.5h", "shap_weight": 0.16}
                    ]
                },
                {
                    "entity_id": "VESSEL_AURORA_EXP",
                    "entity_name": "Aurora Explorer",
                    "target": "Bharati Station",
                    "predicted_eta": "2026-10-04T09:15:00Z",
                    "confidence": 0.91,
                    "expected_delay_hours": 1.25,
                    "model": "XGBoost Polar Voyage Regressor v2.4",
                    "model_framework": "XGBoost",
                    "top_contributing_factors": [
                        {"factor": "Open Ocean Swell", "impact": "+1.0h", "shap_weight": 0.70},
                        {"factor": "Minor Crosswind", "impact": "+0.25h", "shap_weight": 0.30}
                    ]
                }
            ],
            "risk_predictions": [
                {
                    "prediction_type": "Fleet Route Risk",
                    "horizon": "+24h to +72h",
                    "model": "LightGBM Operational Classifier v1.8",
                    "overall_level": "ELEVATED",
                    "key_risk_zone": "Weddell Sea Sector 4",
                    "confidence": 0.88
                },
                {
                    "prediction_type": "Station Fuel Depletion Risk",
                    "horizon": "30 days",
                    "model": "LightGBM Demand Forecaster v2.1",
                    "overall_level": "LOW (Maitri has 68 days; Davis 142 days)",
                    "confidence": 0.94
                },
                {
                    "prediction_type": "Sensor Telemetry Anomaly",
                    "horizon": "Real-time",
                    "model": "PyTorch Autoencoder + Isolation Forest",
                    "overall_level": "NOMINAL (Zero critical mechanical anomalies)",
                    "confidence": 0.96
                },
                {
                    "prediction_type": "Route Waypoint Optimization",
                    "horizon": "Active Voyage",
                    "model": "Google OR-Tools Constraint Optimizer v9.8",
                    "overall_level": "Optimization Ready for Review",
                    "confidence": 0.92
                }
            ]
        }

    # ========================================================
    # Top KPI Strip Data
    # ========================================================
    def get_kpis(self) -> Dict[str, Any]:
        vessels = self.get_vessels()
        active_ships_count = len(vessels)
        in_transit = sum(1 for v in vessels if v["status"] in ["NORMAL", "ATTENTION", "DELAYED"])
        at_port = sum(1 for v in vessels if v["status"] == "AT_PORT")
        stale_vessels = sum(1 for v in vessels if v["status"] == "STALE")

        critical_incidents = sum(1 for a in self.alerts if a["severity"] == "CRITICAL" and a["status"] != "RESOLVED")

        return {
            "active_ships": {
                "total": active_ships_count,
                "in_transit": in_transit,
                "at_port": at_port,
                "stale_offline": stale_vessels,
                "label": f"{in_transit} In Transit | {at_port} At Port | {stale_vessels} Stale",
                "freshness": "FRESH"
            },
            "cargo_in_transit": {
                "tonnage": "2,450 t",
                "containers_teu": 128,
                "percentage_change": "+12.4% vs last cycle",
                "data_freshness": "FRESH",
                "critical_manifests": 4
            },
            "active_delays": {
                "delayed_count": 1,
                "highest_delay": "+26 hours",
                "affected_vessel": "Polar Star",
                "label": "Polar Star (+26h to Davis)"
            },
            "critical_incidents": {
                "count": critical_incidents,
                "emergency_state": "All Stations Life Support Stable",
                "label": "1 Comms Degraded (Halley VI)" if critical_incidents > 0 else "All systems normal"
            },
            "operational_risk": {
                "overall_risk": "HIGH",
                "confidence": "76%",
                "high_risk_areas": "Weddell Sea Sector 4",
                "risk_trend": "Worsening"
            },
            "data_health": {
                "healthy_feeds": 6,
                "stale_feeds": 1,
                "offline_feeds": 0,
                "status": "HEALTHY",
                "label": "6 Fresh | 1 Stale | 0 Offline"
            }
        }

    # ========================================================
    # Full Consolidated Overview
    # ========================================================
    def get_overview(self) -> Dict[str, Any]:
        return {
            "system_time": utc_now().isoformat(),
            "operational_mode": "DECISION_SUPPORT_MONITORING",
            "active_scenario": self.active_scenario,
            "scenario_name": self.scenario_name,
            "kpis": self.get_kpis(),
            "vessels": self.get_vessels(),
            "stations": self.get_stations(),
            "weather": self.get_weather(),
            "sea_ice": self.get_sea_ice(),
            "satellites": self.get_satellites(),
            "routes": self.get_routes(),
            "missions": self.get_missions(),
            "alerts": self.alerts,
            "recommendations": self.recommendations,
            "events": self.events,
            "predictions": self.get_predictions(),
            "data_health": self.get_data_health(),
            "audit_log": self.audit_log[-10:]
        }

    # ========================================================
    # Alert Acknowledgement
    # ========================================================
    def acknowledge_alert(self, alert_id: str, user_role: str, user_name: str = "Authorized Operator") -> Dict[str, Any]:
        for alert in self.alerts:
            if alert["alert_id"] == alert_id:
                alert["status"] = "ACKNOWLEDGED"
                alert["acknowledged_by"] = user_name
                alert["acknowledged_at"] = utc_now().isoformat()
                
                # Append to audit trail
                audit_entry = {
                    "audit_id": f"AUD-{uuid.uuid4().hex[:8].upper()}",
                    "timestamp": utc_now().isoformat(),
                    "actor": f"{user_name} ({user_role})",
                    "actor_role": user_role,
                    "action": "Acknowledge Alert",
                    "target_entity": alert["entity_name"],
                    "details": f"Alert {alert_id} '{alert['title']}' acknowledged.",
                    "status": "ACKNOWLEDGED"
                }
                self.audit_log.append(audit_entry)
                return {"success": True, "alert": alert, "audit_entry": audit_entry}
        
        return {"success": False, "error": f"Alert with ID {alert_id} not found."}

    # ========================================================
    # Human-in-the-Loop Recommendation Approval
    # ========================================================
    def approve_recommendation(self, recommendation_id: str, user_role: str, user_name: str, comments: Optional[str] = None) -> Dict[str, Any]:
        # Enforce authorization: only Commander, Operations Officer, or Safety Officer
        allowed_roles = ["Commander", "Operations Officer", "Safety Officer", "Administrator"]
        if user_role not in allowed_roles:
            return {
                "success": False,
                "error": f"Unauthorized: Role '{user_role}' cannot approve safety-critical operations. Requires one of {allowed_roles}."
            }

        for rec in self.recommendations:
            if rec["recommendation_id"] == recommendation_id:
                rec["status"] = "APPROVED"
                rec["approved_by"] = f"{user_name} ({user_role})"
                rec["approved_at"] = utc_now().isoformat()
                rec["approval_notes"] = comments or "Approved for transmission to operations team."

                # Append to audit trail
                audit_entry = {
                    "audit_id": f"AUD-{uuid.uuid4().hex[:8].upper()}",
                    "timestamp": utc_now().isoformat(),
                    "actor": f"{user_name} ({user_role})",
                    "actor_role": user_role,
                    "action": "Approved AI Recommendation",
                    "target_entity": rec.get("vessel_name") or rec.get("station_name"),
                    "details": f"Recommendation {recommendation_id} '{rec['title']}' approved. {rec['suggested_action']} Notes: {comments or 'None'}",
                    "status": "APPROVED"
                }
                self.audit_log.append(audit_entry)

                # Add operational timeline event
                self.events.insert(0, {
                    "event_id": f"EVT-{uuid.uuid4().hex[:6].upper()}",
                    "timestamp": utc_now().isoformat(),
                    "time_display": utc_now().strftime("%H:%M UTC"),
                    "category": "HUMAN_APPROVAL",
                    "severity": "INFO",
                    "title": f"Action Approved: {rec['title']}",
                    "description": f"Approved by {user_name} ({user_role}). Suggested action dispatched to fleet operations.",
                    "entity": rec.get("vessel_name") or rec.get("station_name"),
                    "source": "Command Center HITL Engine"
                })

                return {"success": True, "recommendation": rec, "audit_entry": audit_entry}

        return {"success": False, "error": f"Recommendation {recommendation_id} not found."}

    # ========================================================
    # Search Across Entities
    # ========================================================
    def search(self, query: str) -> List[Dict[str, Any]]:
        q = query.lower().strip()
        if not q:
            return []
        
        results = []
        # Check vessels
        for v in self.get_vessels():
            if q in v["name"].lower() or q in v["imo"].lower() or q in v["destination"].lower() or q in v["vessel_type"].lower():
                results.append({
                    "category": "VESSEL",
                    "id": v["id"],
                    "title": v["name"],
                    "subtitle": f"IMO: {v['imo']} • {v['vessel_type']} • Status: {v['status']}",
                    "location": f"{v['current_lat']}°, {v['current_lon']}°",
                    "risk": v["risk_level"]
                })
        
        # Check stations
        for s in self.get_stations():
            if q in s["name"].lower() or q in s["country"].lower() or q in s["operator"].lower():
                results.append({
                    "category": "STATION",
                    "id": s["id"],
                    "title": s["name"],
                    "subtitle": f"{s['country']} • Pop: {s['population']} • Comms: {s['connectivity']}",
                    "location": f"{s['lat']}°, {s['lon']}°",
                    "risk": s["emergency_state"]
                })

        # Check alerts
        for a in self.alerts:
            if q in a["title"].lower() or q in a["description"].lower() or q in a["entity_name"].lower():
                results.append({
                    "category": "ALERT",
                    "id": a["alert_id"],
                    "title": a["title"],
                    "subtitle": f"Severity: {a['severity']} • {a['entity_name']}",
                    "location": a["location"],
                    "risk": a["severity"]
                })

        # Check missions
        for m in self.get_missions():
            if q in m["title"].lower() or q in m["destination"].lower() or q in m["mission_id"].lower():
                results.append({
                    "category": "MISSION",
                    "id": m["mission_id"],
                    "title": m["title"],
                    "subtitle": f"Status: {m['status']} • Dest: {m['destination']}",
                    "location": m["destination"],
                    "risk": m["risk"]
                })

        return results

    # ========================================================
    # Grounded Copilot Q&A Context
    # ========================================================
    def answer_copilot_question(self, query: str) -> Dict[str, Any]:
        q = query.lower().strip()
        vessels = self.get_vessels()
        alerts = self.alerts

        if "ship is delayed" in q or "vessel is delayed" in q or "delayed ship" in q or "who is delayed" in q:
            delayed = [v for v in vessels if v["expected_delay_hours"] > 2]
            if delayed:
                v = delayed[0]
                return {
                    "answer": f"**{v['name']}** is delayed by **+{v['expected_delay_hours']} hours** on its voyage to {v['destination']}. Its AIS speed is currently reduced to {v['speed_knots']} knots due to {v['delay_reason']}.",
                    "sources": [
                        {"type": "AIS", "info": f"Position ({v['current_lat']}°, {v['current_lon']}°) updated 32s ago"},
                        {"type": "ML Predictor", "info": f"{v['model_version']} with {int(v['risk_confidence']*100)}% confidence"},
                        {"type": "Satellite SAR", "info": "Sentinel-1 pass confirms 42% sea-ice concentration"}
                    ],
                    "suggested_actions": ["Inspect Polar Star in Vessel Drawer", "Review Alternate Route B"]
                }
            return {
                "answer": "All fleet vessels are currently operating within nominal schedule tolerance (< 2 hours delay).",
                "sources": [{"type": "AIS Stream", "info": "Live fleet synchronization"}],
                "suggested_actions": []
            }

        elif "causing polar star" in q or "polar star delay" in q or "why polar star" in q or "what is causing" in q:
            return {
                "answer": "**Polar Star's +26h delay** is driven by four primary multi-source factors:\n1. **Sea Ice Pack Convergence (+11.2h)**: 42% concentration detected by Sentinel-1 SAR and AMSR2 microwave radiometer.\n2. **Headwind Shear (+7.4h)**: 34-45 knot south-southwest katabatic gale.\n3. **Reduced Hull Speed (+4.1h)**: Dropped from 12.0 kt design to 6.2 kt in heavy floes.\n4. **Pack Ridge Conditions (+3.8h)** along planned Route R-01.",
                "sources": [
                    {"type": "XGBoost Model", "info": "XGB_POLAR_ETA_v2.4 SHAP factor decomposition"},
                    {"type": "SAR Imagery", "info": "Sentinel-1A observation ID SAR-S1A-20260927-0415"},
                    {"type": "ECMWF", "info": "06Z High-Res Polar Numerical Run"}
                ],
                "suggested_actions": ["Open 'Why this prediction?' modal", "Review Recommendation REC-2026-088"]
            }

        elif "stale telemetry" in q or "stale station" in q or "offline" in q:
            return {
                "answer": "**Halley VI Station** currently has **STALE telemetry** (last received 48 minutes ago via Iridium Certus fallback) due to an aurora solar storm affecting Starlink Polar arrays. Furthermore, vessel **Kronprins Haakon** has an unrefreshed AIS position from 2h 14m ago.",
                "sources": [
                    {"type": "Station Gateway", "info": "Halley VI Iridium Certus buffer (8,900ms latency)"},
                    {"type": "AIS Network", "info": "Queen Maud Land Coastal Receiver"}
                ],
                "suggested_actions": ["Filter Map to Halley VI", "Review Comms Failover Protocol"]
            }

        elif "critical alert" in q or "alerts" in q:
            crit = [a for a in alerts if a["severity"] in ["CRITICAL", "HIGH"]]
            summary = "\n".join([f"- **[{a['severity']}]** {a['title']} ({a['entity_name']}): {a['description']}" for a in crit])
            return {
                "answer": f"There are **{len(crit)} high-priority alerts** active across Antarctic operations:\n\n{summary}",
                "sources": [{"type": "Command Center Alert Queue", "info": "Filtered by Severity >= HIGH"}],
                "suggested_actions": ["Acknowledge new alerts", "Review Human-in-the-Loop recommendations"]
            }

        elif "cargo" in q or "medical" in q or "supplies" in q:
            return {
                "answer": "There are **2,450 tons of cargo in transit** across 128 containers. **Critical Cargo Impact**: 40 tons of Emergency Medical Supplies and Generator Spares on board **Polar Star** are delayed by +26h for Davis Station. Station fuel at Davis remains safe for 142 days.",
                "sources": [
                    {"type": "Polar Logistics DB", "info": "Manifest ID MAN-2026-089"},
                    {"type": "Davis Station Telemetry", "info": "Bulk diesel reserves at 74%"}
                ],
                "suggested_actions": ["View Davis Station Drawer", "Notify Station Commander"]
            }

        else:
            return {
                "answer": f"Command Center operational context for '{query}': Fleet operations currently monitoring 6 vessels, 8 stations, and 2 active blizzard corridors in the Weddell and Ross sectors. No autonomous emergency actions have been dispatched; human approval is required for all route diversions.",
                "sources": [
                    {"type": "Command Center Unified State", "info": "Live database fusion"}
                ],
                "suggested_actions": ["Ask: 'Which ship is delayed?'", "Ask: 'Show critical alerts'"]
            }

    # ========================================================
    # Demo Engine - 8 Operational Scenarios
    # ========================================================
    def trigger_demo_scenario(self, scenario_id: str) -> Dict[str, Any]:
        scenarios = {
            "SCENARIO_1_NORMAL": {
                "name": "Scenario 1: Normal Operations",
                "desc": "All fleet vessels in transit on schedule, nominal telemetry across all stations, benign sea-ice conditions.",
                "vessel_override": {"Polar Star": {"status": "NORMAL", "delay": 0.5, "speed": 12.2, "risk": "LOW"}},
                "alert_count": 1
            },
            "SCENARIO_2_VESSEL_DELAY": {
                "name": "Scenario 2: Vessel Delay",
                "desc": "Polar Star slowed to 6.2 kt in heavy Weddell Sea pack ice; AI predicts +26h arrival delay to Davis Station.",
                "vessel_override": {"Polar Star": {"status": "DELAYED", "delay": 26.0, "speed": 6.2, "risk": "HIGH"}},
                "alert_count": 3
            },
            "SCENARIO_3_SEA_ICE_THREAT": {
                "name": "Scenario 3: Sea Ice Threat",
                "desc": "Rapid pack ice advance towards Maitri transit corridor. S.A. Agulhas II encounters 88% concentration ridge.",
                "vessel_override": {"S.A. Agulhas II": {"status": "ATTENTION", "delay": 14.0, "speed": 4.8, "risk": "HIGH"}},
                "alert_count": 4
            },
            "SCENARIO_4_WEATHER_ESCALATION": {
                "name": "Scenario 4: Weather Escalation",
                "desc": "Severe Antarctic blizzard with 56kt sustained winds erupts in the Ross Sea sector. Visibility drops below 400m.",
                "vessel_override": {"Xue Long 2": {"status": "ATTENTION", "delay": 0.0, "speed": 0.0, "risk": "MEDIUM"}},
                "alert_count": 4
            },
            "SCENARIO_5_STATION_CONNECTIVITY_LOSS": {
                "name": "Scenario 5: Station Connectivity Loss",
                "desc": "Halley VI primary Starlink terminal knocked offline by geomagnetic storm; telemetry stale for 48 minutes.",
                "station_override": {"Halley VI": {"status": "DEGRADED"}},
                "alert_count": 3
            },
            "SCENARIO_6_CRITICAL_INCIDENT": {
                "name": "Scenario 6: Critical Incident",
                "desc": "Generator #2 abnormal thermal gradient at Amundsen-Scott South Pole Station. Isolation Forest flags 94% anomaly.",
                "alert_count": 5
            },
            "SCENARIO_7_SATELLITE_OBSERVATION_UPDATE": {
                "name": "Scenario 7: Satellite Observation Update",
                "desc": "New Sentinel-1 SAR swath ingested at 10m GSD. Navigable lead mapped in Weddell Sector 4.",
                "alert_count": 2
            },
            "SCENARIO_8_MULTIPLE_SIMULTANEOUS_RISKS": {
                "name": "Scenario 8: Multiple Simultaneous Risks",
                "desc": "High sea ice delaying Polar Star + Katabatic gale in Ross Sea + Comms drop at Halley VI + Critical medical cargo pending.",
                "alert_count": 6
            }
        }

        chosen = scenarios.get(scenario_id, scenarios["SCENARIO_2_VESSEL_DELAY"])
        self.active_scenario = scenario_id
        self.scenario_name = chosen["name"]

        # Log to audit trail
        self.audit_log.append({
            "audit_id": f"AUD-{uuid.uuid4().hex[:8].upper()}",
            "timestamp": utc_now().isoformat(),
            "actor": "System Commander (Simulation Controller)",
            "actor_role": "Commander",
            "action": "Triggered Demo Scenario",
            "target_entity": "Command Center Simulator",
            "details": f"Switched operational simulation state to: {chosen['name']}. {chosen['desc']}",
            "status": "SIMULATION_ACTIVE"
        })

        return {
            "success": True,
            "active_scenario": self.active_scenario,
            "scenario_name": self.scenario_name,
            "description": chosen["desc"],
            "overview": self.get_overview()
        }

command_center_service = CommandCenterService()
