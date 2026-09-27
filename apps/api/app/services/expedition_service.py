"""
PolarOne Expedition Management System - Service Layer
Antarctic mission operations, lifecycle tracking, explainable AI risk scoring,
what-if scenario simulation, contingency management, human-in-the-loop approvals,
satellite/SAR/weather intelligence integration, and offline-first synchronization.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, timezone, timedelta
import uuid

def utc_now() -> datetime:
    return datetime.now(timezone.utc)

def format_iso(dt: datetime) -> str:
    return dt.isoformat()

# Lifecycle states
EXPEDITION_STATUSES = [
    "DRAFT",
    "PLANNING",
    "READY FOR APPROVAL",
    "APPROVED",
    "PRE-DEPARTURE",
    "IN TRANSIT",
    "OPERATIONAL",
    "PARTIALLY BLOCKED",
    "BLOCKED",
    "SUSPENDED",
    "RETURNING",
    "COMPLETED",
    "CANCELLED",
    "ARCHIVED",
]

class ExpeditionService:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ExpeditionService, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if getattr(self, "_initialized", False):
            return
        self._initialized = True
        self.expeditions: Dict[str, Dict[str, Any]] = {}
        self.audit_logs: List[Dict[str, Any]] = []
        self._seed_initial_data()

    def _seed_initial_data(self):
        now = utc_now()

        # Seed Expedition A
        self.expeditions["EXP-2026-A"] = {
            "id": "EXP-2026-A",
            "name": "Operation Deep Freeze 26",
            "mission_type": "Scientific Research & Resupply",
            "description": "Multi-asset joint icebreaker channel clearing and logistical resupply for McMurdo Station, combined with Ross Ice Shelf glaciological acoustic sounding.",
            "lead": "Cmdr. Sarah Jenkins",
            "organization": "National Science Foundation / USCG Polar Operations",
            "operational_season": "2026-2027",
            "status": "OPERATIONAL",
            "status_display": "IN PROGRESS",
            "risk_level": "MEDIUM",
            "risk_score": 48.5,
            "progress": 68,
            "current_phase": "Ice Channel Transit & Fuel Discharge",
            "planned_start": "2026-10-01T00:00:00Z",
            "planned_end": "2026-12-15T00:00:00Z",
            "expected_completion": "2026-12-17T14:00:00Z",
            "delay_hours": 4.5,
            "delay_reason": "Bypass around multi-year ice ridge near Cape Armitage channel lead.",
            "origin_name": "Lyttelton Port, New Zealand",
            "destination_name": "McMurdo Station, Ross Island",
            "current_region": "Ross Sea / McMurdo Sound",
            "current_lat": -77.848,
            "current_lon": 166.668,
            "vessel_name": "USCGC Polar Star",
            "ships": ["USCGC Polar Star"],
            "aircraft": ["LC-130 Hercules (Skibird 31)", "Bell 412EP (Helo-1)"],
            "vehicles": ["2x PistenBully 300 Polar", "Hägglunds BV206"],
            "major_equipment": ["Deep Ice Core Drill #2", "Teledyne Gavia AUV", "Seismic Array A"],
            "crew_count": 142,
            "personnel": {
                "planned": 150,
                "assigned": 142,
                "deployed": 142,
                "available": 142,
                "missing": 8,
                "breakdown": [
                    {"role": "Expedition Commander", "assigned": 1, "required": 1},
                    {"role": "Vessel Officers & Deck Crew", "assigned": 84, "required": 88},
                    {"role": "Glaciologists & Climate Scientists", "assigned": 26, "required": 28},
                    {"role": "Naval Aviators & Flight Techs", "assigned": 14, "required": 14},
                    {"role": "Medical Officers & Paramedics", "assigned": 4, "required": 4},
                    {"role": "Heavy Machinery Engineers", "assigned": 9, "required": 11},
                    {"role": "SATCOM & Cryptologic Specialists", "assigned": 4, "required": 4}
                ],
                "roster": [
                    {"name": "Cmdr. Sarah Jenkins", "role": "Expedition Commander", "team": "Command", "cert": "Polar Class Master", "location": "USCGC Polar Star (Bridge)", "medical": "FIT_FOR_DUTY", "shift": "Alpha (06:00-18:00)", "deployed": True},
                    {"name": "Dr. Marcus Vance", "role": "Chief Glaciologist", "team": "Science", "cert": "Crevasse Rescue Level 3", "location": "Ross Shelf Camp Alpha", "medical": "FIT_FOR_DUTY", "shift": "Scientific Flex", "deployed": True},
                    {"name": "Lt. Emily Thorne", "role": "Lead Ice Pilot (LC-130)", "team": "Aviation", "cert": "Skiway Instrument Rated", "location": "Williams Field Skiway", "medical": "FIT_FOR_DUTY", "shift": "Flight Alert 15", "deployed": True},
                    {"name": "Chief Eng. Mikhail Petrov", "role": "Chief Marine Engineer", "team": "Engineering", "cert": "Heavy Icebreaker Propulsion", "location": "USCGC Polar Star (Engine Room)", "medical": "FIT_FOR_DUTY", "shift": "Bravo (18:00-06:00)", "deployed": True},
                    {"name": "Dr. Lisa Wong, MD", "role": "Flight Surgeon / Medical Lead", "team": "Medical", "cert": "Polar Trauma Surgery", "location": "USCGC Polar Star (Sickbay)", "medical": "FIT_FOR_DUTY", "shift": "24h On-Call", "deployed": True}
                ]
            },
            "weather": {
                "station_id": "MCM_AWS_01",
                "condition": "Scattered Clouds / Gale Approaching",
                "temperature_c": -18.4,
                "wind_speed_kt": 34.2,
                "wind_direction": "SSW (210°)",
                "wind_gust_kt": 48.0,
                "visibility_km": 6.2,
                "pressure_hpa": 982.4,
                "snowfall_rate": "Light drift",
                "storm_warning": True,
                "warning_title": "GALE FORCE ADVISORY (Katabatic Front)",
                "warning_impact": "Helicopter sling operations suspended; vessel speed limited to 7 kt.",
                "forecast_confidence": 0.88,
                "provider": "Open-Meteo & ECMWF Integrated Polar Model",
                "data_age_min": 18,
                "forecast_horizons": {
                    "current": {"temp": -18.4, "wind": 34, "vis": 6.2, "status": "Caution"},
                    "6_hour": {"temp": -22.1, "wind": 44, "vis": 3.0, "status": "Warning"},
                    "24_hour": {"temp": -25.0, "wind": 52, "vis": 1.2, "status": "Severe"},
                    "3_day": {"temp": -16.0, "wind": 20, "vis": 10.0, "status": "Normal"},
                    "7_day": {"temp": -14.2, "wind": 15, "vis": 15.0, "status": "Optimal"}
                }
            },
            "sea_ice": {
                "source": "Copernicus Marine SAR Sentinel-1C / AMSR2",
                "observation_time": (now - timedelta(hours=3, minutes=12)).isoformat(),
                "data_age_hours": 3.2,
                "confidence": 0.94,
                "concentration_pct": 68,
                "ice_class": "Heavy First-Year with Multi-Year Ridges",
                "ice_thickness_m": 1.95,
                "drift_speed_kt": 0.8,
                "drift_direction": "NNW (340°)",
                "operational_impact": "Channel requires 3-pass clearing; escort recommended for cargo vessel.",
                "compression_risk": "MEDIUM",
                "ice_edge_distance_km": 14.5
            },
            "satellite": {
                "source": "Sentinel-1A C-SAR (Interferometric Wide Swath)",
                "scene_id": "S1A_EW_GRDM_1SDH_20261014T142018",
                "observation_time": (now - timedelta(hours=4, minutes=45)).isoformat(),
                "footprint": "POLYGON((165.2 -77.2, 168.4 -77.2, 168.4 -78.1, 165.2 -78.1, 165.2 -77.2))",
                "resolution_m": 20,
                "data_freshness": "Observed 4.7h ago",
                "satellite_type": "SAR_IMAGERY",
                "cloud_cover_pct": 0, # SAR penetrates clouds
                "interpretation": "Lead openings along Winter Quarters Bay confirmed navigable; shear zone active west of Cape Bird."
            },
            "logistics": {
                "cargo_readiness": 96,
                "fuel_readiness": 88,
                "supply_readiness": 94,
                "fuel_consumption_pct": 62,
                "fuel_projected_remaining_pct": 26,
                "fuel_reserve_warning": False,
                "items": [
                    {"category": "Fuel", "name": "JP-8 Aviation & Diesel Arctic Fuel", "required": 1800, "loaded": 1800, "consumed": 1116, "remaining": 684, "unit": "metric tons", "reserve_pct": 38},
                    {"category": "Food", "name": "Long-term Polar Rations & Fresh Food", "required": 45, "loaded": 45, "consumed": 28, "remaining": 17, "unit": "metric tons", "reserve_pct": 37},
                    {"category": "Medical", "name": "Trauma & Hypothermia Treatment Packs", "required": 4.5, "loaded": 4.5, "consumed": 0.8, "remaining": 3.7, "unit": "metric tons", "reserve_pct": 82},
                    {"category": "Science", "name": "Ice Core Specimen Cryo-Containers", "required": 32, "loaded": 32, "consumed": 0, "remaining": 32, "unit": "units", "reserve_pct": 100},
                    {"category": "Spare Parts", "name": "Turbine Injectors & Track Assembly Kits", "required": 18, "loaded": 18, "consumed": 4, "remaining": 14, "unit": "crates", "reserve_pct": 77}
                ]
            },
            "risk_engine": {
                "overall_score": 48.5,
                "overall_level": "MEDIUM",
                "model_id": "XGB_EXP_RISK_v3.2",
                "confidence": 0.86,
                "timestamp": (now - timedelta(minutes=15)).isoformat(),
                "main_contributor": "Approaching Katabatic gale front and multi-year ice ridge pressure.",
                "categories": [
                    {"category": "Weather", "score": 62, "level": "HIGH", "weight": 0.20, "why": "Wind shear forecast >48kt in 18h window."},
                    {"category": "Sea Ice", "score": 58, "level": "MEDIUM", "weight": 0.22, "why": "1.95m thickness with converging drift on channel mouth."},
                    {"category": "Vessel", "score": 24, "level": "LOW", "weight": 0.15, "why": "Hull stress sensor within nominal 42% yield."},
                    {"category": "Aircraft", "score": 68, "level": "HIGH", "weight": 0.10, "why": "Williams Field ground blizzard forecast restricts ski landing."},
                    {"category": "Personnel", "score": 18, "level": "LOW", "weight": 0.08, "why": "Crew rest cycle compliant; zero cold injuries."},
                    {"category": "Medical", "score": 12, "level": "LOW", "weight": 0.05, "why": "Full ICU surgeon coverage on flagship."},
                    {"category": "Cargo", "score": 15, "level": "LOW", "weight": 0.05, "why": "Breakaway cargo secured in lower hold #3."},
                    {"category": "Fuel", "score": 44, "level": "MEDIUM", "weight": 0.07, "why": "Reserve margin projected at 26% after station discharge."},
                    {"category": "Communication", "score": 28, "level": "LOW", "weight": 0.03, "why": "Iridium Certus + Starlink dual constellation live."},
                    {"category": "Route", "score": 42, "level": "MEDIUM", "weight": 0.02, "why": "Bypass waypoint Delta active."},
                    {"category": "Environmental", "score": 20, "level": "LOW", "weight": 0.01, "why": "Wildlife sanctuary buffers respected."},
                    {"category": "Schedule", "score": 38, "level": "MEDIUM", "weight": 0.02, "why": "Running +4.5h behind target arrival window."}
                ]
            },
            "objectives": [
                {"id": "OBJ-A1", "title": "Break open 18nm navigational ice channel into Winter Quarters Bay", "is_primary": True, "priority": "HIGH", "owner": "Cmdr. Jenkins", "deadline": "2026-10-20", "status": "IN PROGRESS", "success_criteria": "Maintain 40m clear channel for Maersk Peary tanker escort"},
                {"id": "OBJ-A2", "title": "Discharge 5.2M liters of Arctic Diesel to McMurdo bulk tank farm", "is_primary": True, "priority": "HIGH", "owner": "Chief Eng. Petrov", "deadline": "2026-10-28", "status": "PLANNED", "success_criteria": "Zero spill, verified density testing, transfer complete <72h"},
                {"id": "OBJ-A3", "title": "Deploy 3 glaciological sub-ice radar transponders on Ross Ice Shelf", "is_primary": False, "priority": "MEDIUM", "owner": "Dr. Vance", "deadline": "2026-11-15", "status": "IN PROGRESS", "success_criteria": "100% data telemetry uplink to McMurdo relay"},
                {"id": "OBJ-A4", "title": "Inspect Cape Royds automated weather and penguin sanctuary sensor array", "is_primary": False, "priority": "LOW", "owner": "Dr. Wong", "deadline": "2026-11-30", "status": "PLANNED", "success_criteria": "Replace solar battery bank and re-level mast"}
            ],
            "waypoints": [
                {"order": 1, "name": "Lyttelton Pilot Station", "lat": -43.60, "lon": 172.72, "passed": True, "eta": "2026-10-01T04:00:00Z", "ice_risk": "NONE"},
                {"order": 2, "name": "Southern Ocean Waypoint 55S", "lat": -55.00, "lon": 174.50, "passed": True, "eta": "2026-10-05T12:00:00Z", "ice_risk": "LOW"},
                {"order": 3, "name": "Ross Sea Marginal Ice Zone", "lat": -68.40, "lon": 175.20, "passed": True, "eta": "2026-10-09T18:00:00Z", "ice_risk": "MEDIUM"},
                {"order": 4, "name": "Cape Bird Approach", "lat": -77.20, "lon": 166.40, "passed": True, "eta": "2026-10-12T08:00:00Z", "ice_risk": "HIGH"},
                {"order": 5, "name": "Winter Quarters Bay Channel (Current)", "lat": -77.85, "lon": 166.67, "passed": False, "eta": "2026-10-14T20:00:00Z", "ice_risk": "HIGH"},
                {"order": 6, "name": "McMurdo Ice Pier", "lat": -77.85, "lon": 166.69, "passed": False, "eta": "2026-10-16T12:00:00Z", "ice_risk": "LOW"},
                {"order": 7, "name": "Ross Shelf Transect Alpha", "lat": -78.40, "lon": 168.50, "passed": False, "eta": "2026-11-02T00:00:00Z", "ice_risk": "MEDIUM"}
            ],
            "tasks": [
                {"id": "TSK-A101", "title": "Ice channel reconnaissance flight via Bell 412EP", "team": "Aviation", "owner": "Lt. Thorne", "priority": "HIGH", "status": "COMPLETED", "due_date": "2026-10-13", "dependency": None, "location": "McMurdo Sound"},
                {"id": "TSK-A102", "title": "Clear outer ice barrier at Cape Armitage bypass", "team": "Maritime", "owner": "Cmdr. Jenkins", "priority": "CRITICAL", "status": "IN PROGRESS", "due_date": "2026-10-15", "dependency": "TSK-A101", "location": "Cape Armitage Channel"},
                {"id": "TSK-A103", "title": "Position fuel hose manifold on McMurdo Ice Pier", "team": "Engineering", "owner": "Chief Eng. Petrov", "priority": "HIGH", "status": "TODO", "due_date": "2026-10-16", "dependency": "TSK-A102", "location": "McMurdo Ice Pier"},
                {"id": "TSK-A104", "title": "Acoustic sounding deployment on Shelf Transect Alpha", "team": "Science", "owner": "Dr. Vance", "priority": "MEDIUM", "status": "TODO", "due_date": "2026-10-22", "dependency": "TSK-A103", "location": "Ross Shelf"},
                {"id": "TSK-A105", "title": "LC-130 ski-wheel landing gear de-icing maintenance", "team": "Aviation", "owner": "Flight Tech Diaz", "priority": "MEDIUM", "status": "TODO", "due_date": "2026-10-18", "dependency": None, "location": "Williams Field"}
            ],
            "timeline": [
                {"phase": "Phase 1: Mobilization & Staging", "start": "2026-09-15", "end": "2026-09-30", "status": "COMPLETED", "progress": 100},
                {"phase": "Phase 2: Southern Ocean Open Transit", "start": "2026-10-01", "end": "2026-10-09", "status": "COMPLETED", "progress": 100},
                {"phase": "Phase 3: Icebreaking & Channel Clearing", "start": "2026-10-10", "end": "2026-10-20", "status": "IN PROGRESS", "progress": 72},
                {"phase": "Phase 4: Bulk Fuel & Cargo Discharge", "start": "2026-10-21", "end": "2026-11-05", "status": "PLANNED", "progress": 0},
                {"phase": "Phase 5: Glaciological Traverse & Acoustic Sounding", "start": "2026-11-06", "end": "2026-11-28", "status": "PLANNED", "progress": 0},
                {"phase": "Phase 6: Channel Re-clearing & Return Voyage", "start": "2026-11-29", "end": "2026-12-15", "status": "PLANNED", "progress": 0}
            ],
            "contingencies": [
                {
                    "plan": "Plan A (Baseline)",
                    "title": "Continuous 3-pass channel cutting via Western Lead",
                    "trigger": "Ice concentration <75%, wind <35kt",
                    "action": "Proceed with planned direct heading into Winter Quarters Bay.",
                    "responsible": "Cmdr. Jenkins",
                    "resources": "USCGC Polar Star primary power plant",
                    "expected_impact": "On schedule (ETA Oct 16)",
                    "approval_required": "Standard Watch Officer"
                },
                {
                    "plan": "Plan B (Adverse Weather / Ridge)",
                    "title": "Hold anchor off Cape Bird & await tidal lead opening",
                    "trigger": "Sustained Katabatic wind >45kt or pressure ridge >2.5m",
                    "action": "Divert 6nm northwest into lee of Ross Island; suspend aviation; conserve fuel.",
                    "responsible": "Cmdr. Jenkins & Duty Ice Navigator",
                    "resources": "Auxiliary thrusters, reserve generators",
                    "expected_impact": "+18h to +28h mission delay; preserves vessel hull integrity",
                    "approval_required": "Operations Commander Approval"
                },
                {
                    "plan": "Plan C (Emergency Severe Compression)",
                    "title": "Reverse escort and rendezvous with French R/V L'Astrolabe",
                    "trigger": "Fast ice convergence trapping cargo vessel or hull stress >85%",
                    "action": "Execute twin-cutter relief formation with partner vessel; abort tanker lead.",
                    "responsible": "Antarctic Operations Commander",
                    "resources": "Joint USCG / IPEV maritime taskforce, LC-130 SAR standby",
                    "expected_impact": "Mission delay +7d; redirect cargo to Marble Point cache",
                    "approval_required": "Commander-in-Chief / Joint Staff Approval"
                }
            ],
            "incidents": [
                {
                    "id": "INC-A-01",
                    "time": (now - timedelta(days=2, hours=4)).isoformat(),
                    "title": "Pressure ridge collision - Starboard bow sensor sheer",
                    "type": "Equipment",
                    "severity": "LOW",
                    "description": "While breaking through multi-year ridge near Cape Bird, external draft sensor housing was sheared by ice block. Internal transducers intact and sealed.",
                    "affected_people": "None",
                    "affected_assets": "USCGC Polar Star bow sensor block",
                    "mission_impact": "Manual sonic sounding required during berthing.",
                    "response": "Engineering team verified watertight integrity; logged in hull maintenance log.",
                    "status": "MITIGATED"
                }
            ],
            "communication": {
                "status": "ONLINE",
                "mode": "Starlink Polar Maritime + Iridium Certus Fallback",
                "latency_ms": 118,
                "packet_loss_pct": 0.4,
                "bandwidth_kbps": 22400,
                "last_successful_sync": (now - timedelta(minutes=2)).isoformat(),
                "last_telemetry_received": (now - timedelta(seconds=45)).isoformat(),
                "pending_sync_records": 0
            },
            "recommendations": [
                {
                    "id": "REC-A-2026-01",
                    "title": "Adopt Cape Armitage Ridge Bypass Route Delta-2",
                    "severity": "MEDIUM",
                    "reason": "Sentinel-1C SAR (3.2h old) shows 2.4m convergent ridge on current path. Bypass Delta-2 follows thermal lead with 1.1m thickness, saving 6 hours of high-power ice ramming.",
                    "model": "XGB_ROUTE_OPT_v4",
                    "confidence": 0.88,
                    "fuel_delta": "-14.2 metric tons",
                    "eta_delta": "-4.5 hours",
                    "status": "PENDING_REVIEW",
                    "action_required": "Commander Approval Required to change primary passage plan"
                }
            ]
        }

        # Seed Expedition B
        self.expeditions["EXP-2026-B"] = {
            "id": "EXP-2026-B",
            "name": "Maitri Resupply Mission",
            "mission_type": "Logistics & Resupply",
            "description": "Annual seasonal fuel and container resupply for Maitri Station and Bharati Station (Larsemann Hills), supporting Indian Antarctic Program winter-over teams.",
            "lead": "Capt. Anil Kumar",
            "organization": "National Centre for Polar and Ocean Research (NCPOR)",
            "operational_season": "2026-2027",
            "status": "PLANNING",
            "status_display": "PLANNING",
            "risk_level": "LOW",
            "risk_score": 18.2,
            "progress": 15,
            "current_phase": "Cargo Marshalling & Berth Scheduling",
            "planned_start": "2026-11-10T00:00:00Z",
            "planned_end": "2027-01-05T00:00:00Z",
            "expected_completion": "2027-01-05T00:00:00Z",
            "delay_hours": 0.0,
            "delay_reason": "None. On schedule for scheduled Cape Town departure.",
            "origin_name": "Cape Town Port, South Africa",
            "destination_name": "Princess Astrid Coast / Maitri Station",
            "current_region": "Queen Maud Land / Astrid Coast",
            "current_lat": -70.767,
            "current_lon": 11.733,
            "vessel_name": "Ocean Explorer",
            "ships": ["Ocean Explorer"],
            "aircraft": ["Kamov Ka-32 Helicopter"],
            "vehicles": ["4x Prinoth Everest Snow Groomers", "3x Kassbohrer PistenBully"],
            "major_equipment": ["Modular Habitat Units", "Combined Heat & Power Diesel Generator 250kVA"],
            "crew_count": 45,
            "personnel": {
                "planned": 48,
                "assigned": 45,
                "deployed": 0,
                "available": 45,
                "missing": 3,
                "breakdown": [
                    {"role": "Expedition Leader", "assigned": 1, "required": 1},
                    {"role": "Ship Crew & Logistics Handlers", "assigned": 26, "required": 28},
                    {"role": "Winter-over Replacement Scientists", "assigned": 12, "required": 12},
                    {"role": "Heavy Vehicle Operators", "assigned": 4, "required": 5},
                    {"role": "Medical Staff", "assigned": 2, "required": 2}
                ],
                "roster": [
                    {"name": "Capt. Anil Kumar", "role": "Expedition Leader", "team": "Command", "cert": "Polar Code Advanced", "location": "Cape Town Logistics Hub", "medical": "FIT_FOR_DUTY", "shift": "Day Operations", "deployed": False},
                    {"name": "Dr. Sunita Sharma", "role": "Atmospheric Scientist", "team": "Science", "cert": "Antarctic Survival Cert", "location": "Cape Town Briefing Center", "medical": "FIT_FOR_DUTY", "shift": "Day Operations", "deployed": False},
                    {"name": "Vikram Patel", "role": "Lead Heavy Vehicle Tech", "team": "Engineering", "cert": "Hydraulic Snow Systems", "location": "Cape Town Berth 2", "medical": "FIT_FOR_DUTY", "shift": "Day Operations", "deployed": False}
                ]
            },
            "weather": {
                "station_id": "MAI_AWS_03",
                "condition": "Clear Sky / Calm",
                "temperature_c": -11.2,
                "wind_speed_kt": 15.8,
                "wind_direction": "ENE (070°)",
                "wind_gust_kt": 21.0,
                "visibility_km": 12.0,
                "pressure_hpa": 996.1,
                "snowfall_rate": "None",
                "storm_warning": False,
                "warning_title": "FAVORABLE PRE-DEPARTURE WINDOW",
                "warning_impact": "Favorable sea states projected in South Atlantic transit corridor.",
                "forecast_confidence": 0.92,
                "provider": "Open-Meteo Antarctic High-Res Grid",
                "data_age_min": 24,
                "forecast_horizons": {
                    "current": {"temp": -11.2, "wind": 16, "vis": 12.0, "status": "Optimal"},
                    "6_hour": {"temp": -12.0, "wind": 18, "vis": 12.0, "status": "Optimal"},
                    "24_hour": {"temp": -10.5, "wind": 14, "vis": 15.0, "status": "Optimal"},
                    "3_day": {"temp": -9.0, "wind": 22, "vis": 10.0, "status": "Normal"},
                    "7_day": {"temp": -13.5, "wind": 19, "vis": 12.0, "status": "Optimal"}
                }
            },
            "sea_ice": {
                "source": "NOAA / NSIDC Daily Sea Ice Concentration",
                "observation_time": (now - timedelta(hours=6, minutes=20)).isoformat(),
                "data_age_hours": 6.3,
                "confidence": 0.91,
                "concentration_pct": 22,
                "ice_class": "Open Drift Ice & Brash",
                "ice_thickness_m": 0.65,
                "drift_speed_kt": 0.4,
                "drift_direction": "W (270°)",
                "operational_impact": "Minimal obstruction; standard reinforced hull permitted.",
                "compression_risk": "LOW",
                "ice_edge_distance_km": 82.0
            },
            "satellite": {
                "source": "Sentinel-2 MSI Optical",
                "scene_id": "S2B_MSIL1C_20261012T075029",
                "observation_time": (now - timedelta(hours=14, minutes=10)).isoformat(),
                "footprint": "POLYGON((10.5 -70.2, 13.0 -70.2, 13.0 -71.2, 10.5 -71.2, 10.5 -70.2))",
                "resolution_m": 10,
                "data_freshness": "Observed 14.1h ago",
                "satellite_type": "OPTICAL_IMAGERY",
                "cloud_cover_pct": 4.2,
                "interpretation": "Princess Astrid fast ice shelf edge stable; traditional unloading ramp intact."
            },
            "logistics": {
                "cargo_readiness": 78,
                "fuel_readiness": 92,
                "supply_readiness": 85,
                "fuel_consumption_pct": 0,
                "fuel_projected_remaining_pct": 45,
                "fuel_reserve_warning": False,
                "items": [
                    {"category": "Fuel", "name": "Special Low-Pour Diesel (LDO)", "required": 620, "loaded": 580, "consumed": 0, "remaining": 580, "unit": "metric tons", "reserve_pct": 45},
                    {"category": "Food", "name": "Standard Station Provisions (18-Month Supply)", "required": 38, "loaded": 32, "consumed": 0, "remaining": 32, "unit": "metric tons", "reserve_pct": 50},
                    {"category": "Spare Parts", "name": "Generator overhaul components & filters", "required": 12, "loaded": 10, "consumed": 0, "remaining": 10, "unit": "pallets", "reserve_pct": 80}
                ]
            },
            "risk_engine": {
                "overall_score": 18.2,
                "overall_level": "LOW",
                "model_id": "XGB_EXP_RISK_v3.2",
                "confidence": 0.91,
                "main_contributor": "Pre-departure logistics staging; cargo pallet manifest validation in progress.",
                "categories": [
                    {"category": "Weather", "score": 14, "level": "LOW", "weight": 0.20, "why": "Summer warming window approaching Astrid Coast."},
                    {"category": "Sea Ice", "score": 20, "level": "LOW", "weight": 0.22, "why": "Open drift ice within vessel design envelope."},
                    {"category": "Vessel", "score": 10, "level": "LOW", "weight": 0.15, "why": "Ocean Explorer completed Lloyd's Polar drydock inspection."},
                    {"category": "Aircraft", "score": 15, "level": "LOW", "weight": 0.10, "why": "Ka-32 cert valid; rotor head inspections passed."},
                    {"category": "Personnel", "score": 16, "level": "LOW", "weight": 0.08, "why": "3 vehicle operators completing cold-weather altitude medicals."},
                    {"category": "Medical", "score": 8, "level": "LOW", "weight": 0.05, "why": "Medical isolation checks completed."},
                    {"category": "Cargo", "score": 28, "level": "LOW", "weight": 0.05, "why": "6 pallets pending port customs stamp."},
                    {"category": "Fuel", "score": 12, "level": "LOW", "weight": 0.07, "why": "Bunkering scheduled for Nov 08 at Berth 2."},
                    {"category": "Communication", "score": 15, "level": "LOW", "weight": 0.03, "why": "Dual Inmarsat + Iridium terminals tested."},
                    {"category": "Route", "score": 10, "level": "LOW", "weight": 0.02, "why": "Direct Cape Town to Astrid fast track."},
                    {"category": "Environmental", "score": 12, "level": "LOW", "weight": 0.01, "why": "Zero-discharge ballast plan ratified."},
                    {"category": "Schedule", "score": 14, "level": "LOW", "weight": 0.02, "why": "Ample slack before hard ice closing in February."}
                ]
            },
            "objectives": [
                {"id": "OBJ-B1", "title": "Deliver 580 metric tons of arctic grade fuel to Maitri Station storage", "is_primary": True, "priority": "HIGH", "owner": "Capt. Kumar", "deadline": "2026-12-05", "status": "PLANNED", "success_criteria": "Direct hose line discharge from fast-ice edge to shore booster"},
                {"id": "OBJ-B2", "title": "Rotate 24 winter-over scientists and expedition engineers", "is_primary": True, "priority": "HIGH", "owner": "Capt. Kumar", "deadline": "2026-12-15", "status": "PLANNED", "success_criteria": "100% successful health sign-off and debrief transfer"},
                {"id": "OBJ-B3", "title": "Deliver and erect new Combined Heat & Power (CHP) auxiliary generator unit", "is_primary": False, "priority": "MEDIUM", "owner": "Vikram Patel", "deadline": "2026-12-24", "status": "PLANNED", "success_criteria": "Generator tied into station microgrid with load test"}
            ],
            "waypoints": [
                {"order": 1, "name": "Cape Town Berth 2", "lat": -33.91, "lon": 18.43, "passed": False, "eta": "2026-11-10T08:00:00Z", "ice_risk": "NONE"},
                {"order": 2, "name": "Bouvet Island Offshore Passage", "lat": -54.42, "lon": 3.35, "passed": False, "eta": "2026-11-18T16:00:00Z", "ice_risk": "LOW"},
                {"order": 3, "name": "Astrid Coast Outer Marginal Ice", "lat": -69.20, "lon": 11.50, "passed": False, "eta": "2026-11-26T12:00:00Z", "ice_risk": "MEDIUM"},
                {"order": 4, "name": "Princess Astrid Fast Ice Shelf Anchor", "lat": -70.77, "lon": 11.73, "passed": False, "eta": "2026-11-30T06:00:00Z", "ice_risk": "LOW"}
            ],
            "tasks": [
                {"id": "TSK-B201", "title": "Finalize fuel bunker quality certifications at Cape Town", "team": "Logistics", "owner": "Capt. Kumar", "priority": "HIGH", "status": "IN PROGRESS", "due_date": "2026-11-04", "dependency": None, "location": "Cape Town"},
                {"id": "TSK-B202", "title": "Pre-departure cold chamber test for Ka-32 avionics", "team": "Aviation", "owner": "Flight Eng. Ray", "priority": "MEDIUM", "status": "TODO", "due_date": "2026-11-07", "dependency": None, "location": "Cape Town Airport"},
                {"id": "TSK-B203", "title": "Load and lash snow groomers on deck hatch #2", "team": "Logistics", "owner": "Vikram Patel", "priority": "HIGH", "status": "TODO", "due_date": "2026-11-08", "dependency": "TSK-B201", "location": "Cape Town Berth 2"}
            ],
            "timeline": [
                {"phase": "Phase 1: Cargo Marshaling & Loading", "start": "2026-10-15", "end": "2026-11-09", "status": "IN PROGRESS", "progress": 45},
                {"phase": "Phase 2: South Atlantic Ocean Transit", "start": "2026-11-10", "end": "2026-11-28", "status": "PLANNED", "progress": 0},
                {"phase": "Phase 3: Ice Shelf Berthing & Fuel Discharge", "start": "2026-11-29", "end": "2026-12-14", "status": "PLANNED", "progress": 0},
                {"phase": "Phase 4: Station Turnover & Scientific Turnover", "start": "2026-12-15", "end": "2026-12-25", "status": "PLANNED", "progress": 0},
                {"phase": "Phase 5: Homeward Voyage to Cape Town", "start": "2026-12-26", "end": "2027-01-05", "status": "PLANNED", "progress": 0}
            ],
            "contingencies": [
                {
                    "plan": "Plan A (Baseline)",
                    "title": "Fast ice shelf mooring and overland tracked fuel convoy",
                    "trigger": "Ice shelf ramp stable, winds <30kt",
                    "action": "Offload groomers and run fuel hose line directly to booster pump.",
                    "responsible": "Capt. Kumar",
                    "resources": "PistenBully team, hose deployment reel",
                    "expected_impact": "Full discharge within 6 operational days",
                    "approval_required": "Standard Operational Sign-off"
                },
                {
                    "plan": "Plan B (Shelf Calving / Weak Fast Ice)",
                    "title": "Air-lift critical spares via Ka-32 and hold off 12nm offshore",
                    "trigger": "Ice shelf break off >200m or surface melt ponding",
                    "action": "Use helicopter sling loads for priority cargo; defer heavy bulk fuel to secondary landing site at India Bay.",
                    "responsible": "Capt. Kumar & Aviation Lead",
                    "resources": "Ka-32 heavy sling harness, India Bay emergency cache",
                    "expected_impact": "+6 days operational delay; zero personnel risk",
                    "approval_required": "Director NCPOR Approval"
                }
            ],
            "incidents": [],
            "communication": {
                "status": "ONLINE",
                "mode": "FleetBroadband & Cellular LTE Port Roaming",
                "latency_ms": 42,
                "packet_loss_pct": 0.0,
                "bandwidth_kbps": 102400,
                "last_successful_sync": (now - timedelta(minutes=1)).isoformat(),
                "last_telemetry_received": (now - timedelta(seconds=20)).isoformat(),
                "pending_sync_records": 0
            },
            "recommendations": []
        }

        # Seed Expedition C (BLOCKED - WEATHER)
        self.expeditions["EXP-2026-C"] = {
            "id": "EXP-2026-C",
            "name": "Glacier Core Extraction",
            "mission_type": "Scientific Research / Paleoclimatology",
            "description": "High-altitude deep ice core drilling on Law Dome and Totten Glacier grounding line to reconstruct 2,000-year atmospheric carbon records.",
            "lead": "Dr. Emily Chen",
            "organization": "Australian Antarctic Division (AAD) / International Glacier Consortium",
            "operational_season": "2026-2027",
            "status": "BLOCKED",
            "status_display": "BLOCKED - WEATHER",
            "risk_level": "HIGH",
            "risk_score": 78.4,
            "progress": 42,
            "current_phase": "Emergency Field Tie-Down / Blizzard Standby",
            "planned_start": "2026-09-20T00:00:00Z",
            "planned_end": "2026-11-30T00:00:00Z",
            "expected_completion": "2026-12-08T18:00:00Z",
            "delay_hours": 38.0,
            "delay_reason": "Severe Category 4 Antarctic Blizzard (sustained winds 58kt, gusting 76kt) forced complete halt of aviation support and tied down field camp.",
            "origin_name": "Hobart Port, Tasmania",
            "destination_name": "Law Dome / Casey Station",
            "current_region": "Wilkes Land / Casey Sector",
            "current_lat": -66.282,
            "current_lon": 110.528,
            "vessel_name": "Aurora Australis",
            "ships": ["Aurora Australis"],
            "aircraft": ["AS350 B3 Écureuil (Grounded)"],
            "vehicles": ["2x Hägglunds Bandvagn 206", "1x Caterpillar D6N LGP"],
            "major_equipment": ["Hans Tausen Electromechanical Deep Drill", "Sub-ice Hot Water Drill Rig"],
            "crew_count": 88,
            "personnel": {
                "planned": 90,
                "assigned": 88,
                "deployed": 88,
                "available": 88,
                "missing": 2,
                "breakdown": [
                    {"role": "Chief Scientist", "assigned": 1, "required": 1},
                    {"role": "Deep Drill Engineers", "assigned": 14, "required": 14},
                    {"role": "Field Glaciologists", "assigned": 18, "required": 18},
                    {"role": "Vessel Officers & Mariners", "assigned": 46, "required": 48},
                    {"role": "Medical Officers", "assigned": 3, "required": 3},
                    {"role": "Helicopter Pilots & Techs", "assigned": 6, "required": 6}
                ],
                "roster": [
                    {"name": "Dr. Emily Chen", "role": "Chief Paleoclimatologist", "team": "Science", "cert": "Polar Wilderness Medic", "location": "Law Dome High Camp (Sheltered)", "medical": "FIT_FOR_DUTY", "shift": "Storm Watch", "deployed": True},
                    {"name": "Capt. James Fletcher", "role": "Master, RSV Aurora Australis", "team": "Maritime", "cert": "Master Mariner Polar", "location": "Casey Roads Anchor", "medical": "FIT_FOR_DUTY", "shift": "Storm Watch", "deployed": True},
                    {"name": "Sean O'Connor", "role": "Lead Deep Ice Core Driller", "team": "Engineering", "cert": "Sub-surface Pressure Rig", "location": "Drill Dome Shelter", "medical": "FIT_FOR_DUTY", "shift": "Suspended", "deployed": True},
                    {"name": "Dr. Hannah Bailey", "role": "Field Physician", "team": "Medical", "cert": "Hypothermia Re-warming Specialist", "location": "Casey Station Hospital", "medical": "FIT_FOR_DUTY", "shift": "24h Storm Standby", "deployed": True}
                ]
            },
            "weather": {
                "station_id": "CSY_AWS_09",
                "condition": "Severe Blizzard / Whiteout",
                "temperature_c": -28.6,
                "wind_speed_kt": 58.4,
                "wind_direction": "ESE (115°)",
                "wind_gust_kt": 76.2,
                "visibility_km": 0.3,
                "pressure_hpa": 964.8,
                "snowfall_rate": "Extreme blowing snow",
                "storm_warning": True,
                "warning_title": "RED ALERT: CATEGORY 4 BLIZZARD (Gale 58kt+)",
                "warning_impact": "Total whiteout. Outdoor personnel movement strictly forbidden. Aviation zero clearance.",
                "forecast_confidence": 0.95,
                "provider": "Bureau of Meteorology (BoM) Polar Section & Open-Meteo",
                "data_age_min": 12,
                "forecast_horizons": {
                    "current": {"temp": -28.6, "wind": 58, "vis": 0.3, "status": "Critical"},
                    "6_hour": {"temp": -30.0, "wind": 62, "vis": 0.2, "status": "Critical"},
                    "24_hour": {"temp": -27.0, "wind": 45, "vis": 1.5, "status": "Warning"},
                    "3_day": {"temp": -22.0, "wind": 28, "vis": 5.0, "status": "Caution"},
                    "7_day": {"temp": -18.0, "wind": 16, "vis": 12.0, "status": "Optimal"}
                }
            },
            "sea_ice": {
                "source": "Sentinel-1B SAR Extra Wide Swath",
                "observation_time": (now - timedelta(hours=2, minutes=45)).isoformat(),
                "data_age_hours": 2.7,
                "confidence": 0.96,
                "concentration_pct": 86,
                "ice_class": "Heavy Fast Ice with Heavy Pressure Ridges",
                "ice_thickness_m": 2.30,
                "drift_speed_kt": 1.4,
                "drift_direction": "NW (315°)",
                "operational_impact": "Vessel anchored in lee of Bailey Peninsula; ice closing channel entrance.",
                "compression_risk": "HIGH",
                "ice_edge_distance_km": 4.2
            },
            "satellite": {
                "source": "Landsat-9 OLI-2 / Sentinel-1 SAR Composite",
                "scene_id": "L9_108112_20261011_POLAR",
                "observation_time": (now - timedelta(hours=5, minutes=10)).isoformat(),
                "footprint": "POLYGON((110.0 -66.0, 111.5 -66.0, 111.5 -67.0, 110.0 -67.0, 110.0 -66.0))",
                "resolution_m": 15,
                "data_freshness": "Observed 5.2h ago",
                "satellite_type": "MULTI_SPECTRAL_SAR",
                "cloud_cover_pct": 100, # Penetrated via radar
                "interpretation": "High cyclonic cloud cover over entire Casey sector; radar shows heavy snow drift accumulation on Law Dome ridge."
            },
            "logistics": {
                "cargo_readiness": 82,
                "fuel_readiness": 68,
                "supply_readiness": 75,
                "fuel_consumption_pct": 52,
                "fuel_projected_remaining_pct": 18,
                "fuel_reserve_warning": True,
                "items": [
                    {"category": "Fuel", "name": "Field Generator Polar Kerosene", "required": 42, "loaded": 42, "consumed": 28, "remaining": 14, "unit": "drums", "reserve_pct": 18},
                    {"category": "Food", "name": "High-Calorie Freeze Dried Storm Rations", "required": 1200, "loaded": 1200, "consumed": 420, "remaining": 780, "unit": "rations", "reserve_pct": 65},
                    {"category": "Medical", "name": "Oxygen Cylinders & Hyperbaric Chambers", "required": 8, "loaded": 8, "consumed": 1, "remaining": 7, "unit": "units", "reserve_pct": 87}
                ]
            },
            "risk_engine": {
                "overall_score": 78.4,
                "overall_level": "HIGH",
                "model_id": "XGB_EXP_RISK_v3.2",
                "confidence": 0.94,
                "main_contributor": "Category 4 Blizzard with 58kt winds causing zero-visibility whiteout, aviation suspension, and field camp isolation.",
                "categories": [
                    {"category": "Weather", "score": 96, "level": "CRITICAL", "weight": 0.20, "why": "Sustained storm 58kt with gusts to 76kt; whiteout conditions."},
                    {"category": "Sea Ice", "score": 74, "level": "HIGH", "weight": 0.22, "why": "Severe pressure ridges trapping Casey outer bay."},
                    {"category": "Vessel", "score": 45, "level": "MEDIUM", "weight": 0.15, "why": "Anchor holding at Bailey Roads; bow pitching 12 degrees."},
                    {"category": "Aircraft", "score": 98, "level": "CRITICAL", "weight": 0.10, "why": "Aviation completely grounded; AS350 tied down in hangar."},
                    {"category": "Personnel", "score": 62, "level": "HIGH", "weight": 0.08, "why": "Field science party confined to shelter for 48 consecutive hours."},
                    {"category": "Medical", "score": 35, "level": "MEDIUM", "weight": 0.05, "why": "Physician accessible via radio only; medical evacuation impossible until storm subsides."},
                    {"category": "Cargo", "score": 25, "level": "LOW", "weight": 0.05, "why": "Drill components battened down inside secure shelter."},
                    {"category": "Fuel", "score": 72, "level": "HIGH", "weight": 0.07, "why": "Generator fuel burn elevated due to heating demand; projected 18% remaining."},
                    {"category": "Communication", "score": 52, "level": "MEDIUM", "weight": 0.03, "why": "Satellite dishes icing up; HF radio backup operating with static."},
                    {"category": "Route", "score": 80, "level": "HIGH", "weight": 0.02, "why": "Tracked vehicle overland traverse blocked by 3m drift banks."},
                    {"category": "Environmental", "score": 30, "level": "LOW", "weight": 0.01, "why": "No fuel spillage; containment trays active."},
                    {"category": "Schedule", "score": 85, "level": "CRITICAL", "weight": 0.02, "why": "Mission delayed 38h; drilling window closing in 16 days."}
                ]
            },
            "objectives": [
                {"id": "OBJ-C1", "title": "Extract 300m continuous ice core from Law Dome Summit", "is_primary": True, "priority": "CRITICAL", "owner": "Dr. Chen", "deadline": "2026-11-10", "status": "BLOCKED", "success_criteria": "Pristine physical core sections preserved at -25C without melt"},
                {"id": "OBJ-C2", "title": "Maintain emergency survival protocols for 18 personnel at High Camp", "is_primary": True, "priority": "CRITICAL", "owner": "Dr. Chen", "deadline": "2026-10-18", "status": "IN PROGRESS", "success_criteria": "Zero casualties, 4-hour welfare radio roll call compliance"},
                {"id": "OBJ-C3", "title": "Transfer ice core boxes to Aurora Australis cold storage hold", "is_primary": False, "priority": "HIGH", "owner": "Capt. Fletcher", "deadline": "2026-11-20", "status": "BLOCKED", "success_criteria": "Aviation sling transfer once weather clears"}
            ],
            "waypoints": [
                {"order": 1, "name": "Hobart Port", "lat": -42.88, "lon": 147.33, "passed": True, "eta": "2026-09-20T00:00:00Z", "ice_risk": "NONE"},
                {"order": 2, "name": "Casey Offshore Approaches", "lat": -65.50, "lon": 110.20, "passed": True, "eta": "2026-10-01T14:00:00Z", "ice_risk": "MEDIUM"},
                {"order": 3, "name": "Casey Roads Anchor (Current)", "lat": -66.28, "lon": 110.53, "passed": False, "eta": "2026-10-04T12:00:00Z", "ice_risk": "HIGH"},
                {"order": 4, "name": "Law Dome Ice Core Drill Site", "lat": -66.73, "lon": 112.83, "passed": False, "eta": "2026-10-08T00:00:00Z", "ice_risk": "HIGH"}
            ],
            "tasks": [
                {"id": "TSK-C301", "title": "Secure drill mast tie-down guy wires against 75kt gusts", "team": "Engineering", "owner": "Sean O'Connor", "priority": "CRITICAL", "status": "COMPLETED", "due_date": "2026-10-12", "dependency": None, "location": "Law Dome Drill Site"},
                {"id": "TSK-C302", "title": "Maintain 4-hourly welfare radio check-in with Casey Station", "team": "Science", "owner": "Dr. Chen", "priority": "CRITICAL", "status": "IN PROGRESS", "due_date": "2026-10-15", "dependency": None, "location": "Law Dome High Camp"},
                {"id": "TSK-C303", "title": "Resume electromechanical drilling once wind drops below 25kt", "team": "Science", "owner": "Dr. Chen", "priority": "HIGH", "status": "BLOCKED", "due_date": "2026-10-17", "dependency": "TSK-C302", "location": "Law Dome Drill Site"},
                {"id": "TSK-C304", "title": "Fuel ration rebalancing for camp generator shelter", "team": "Engineering", "owner": "Sean O'Connor", "priority": "CRITICAL", "status": "IN PROGRESS", "due_date": "2026-10-15", "dependency": None, "location": "High Camp Shelter"}
            ],
            "timeline": [
                {"phase": "Phase 1: Transit from Hobart to Casey", "start": "2026-09-20", "end": "2026-10-01", "status": "COMPLETED", "progress": 100},
                {"phase": "Phase 2: Overland Traverse to Law Dome Summit", "start": "2026-10-02", "end": "2026-10-08", "status": "COMPLETED", "progress": 100},
                {"phase": "Phase 3: Deep Drilling & Ice Sampling", "start": "2026-10-09", "end": "2026-11-05", "status": "BLOCKED", "progress": 35},
                {"phase": "Phase 4: Sample Extraction & Hangar Staging", "start": "2026-11-06", "end": "2026-11-18", "status": "PLANNED", "progress": 0},
                {"phase": "Phase 5: Return Transit to Hobart", "start": "2026-11-19", "end": "2026-11-30", "status": "PLANNED", "progress": 0}
            ],
            "contingencies": [
                {
                    "plan": "Plan A (Baseline)",
                    "title": "Full 300m drill extraction with helicopter sample back-haul",
                    "trigger": "Weather clear, wind <20kt",
                    "action": "Standard operations with two 10-hour shifts.",
                    "responsible": "Dr. Chen",
                    "resources": "AS350 B3 helicopter, twin drilling shifts",
                    "expected_impact": "Original schedule",
                    "approval_required": "Field Lead"
                },
                {
                    "plan": "Plan B (Storm Extension - CURRENTLY ACTIVE)",
                    "title": "Shelter-in-Place & Conserve Fuel (Emergency Blizzard Mode)",
                    "trigger": "Blizzard winds >45kt or whiteout visibility <500m",
                    "action": "Suspend drilling immediately. Lock shelters. Throttle heating to 14°C to stretch kerosene reserves from 3 days to 7 days. Mandatory 4h radio roll call.",
                    "responsible": "Dr. Chen & Casey Station Leader",
                    "resources": "High Camp auxiliary heated shelter, emergency survival rations",
                    "expected_impact": "+48h to +72h mission delay; guarantees zero exposure casualties",
                    "approval_required": "Commander Approval (Pre-authorized by Dr. Chen)"
                },
                {
                    "plan": "Plan C (Overland Rescue & Mission Abort)",
                    "title": "Hägglunds heavy tracked convoy extraction to Casey main base",
                    "trigger": "Camp generator failure or un-repaired structure compromise",
                    "action": "Deploy Casey Station SAR tracked convoy with GPS breadcrumb trail navigation; evacuate all 18 personnel; leave drill rig tethered for next season.",
                    "responsible": "AAD Director of Polar Operations",
                    "resources": "2x Casey Station Hägglunds BV206, Medical Doctor, GPS beacons",
                    "expected_impact": "Mission aborted for season; complete personnel preservation",
                    "approval_required": "AAD Director & Expedition Commander Approval"
                }
            ],
            "incidents": [
                {
                    "id": "INC-C-01",
                    "time": (now - timedelta(hours=36)).isoformat(),
                    "title": "Severe Gale Storm Front Inundation (Gale 58kt+)",
                    "type": "Weather",
                    "severity": "CRITICAL",
                    "description": "Rapidly deepening polar depression caused wind speed to spike from 18kt to 58kt in 90 minutes. Outdoor scientific operations halted immediately. Whiteout forced emergency shelter protocol.",
                    "affected_people": "18 personnel at High Camp, 70 personnel on vessel",
                    "affected_assets": "Drill rig, AS350 Helicopter, Overland transit route",
                    "mission_impact": "Drilling suspended indefinitely; mission status changed to BLOCKED.",
                    "response": "Camp placed into Contingency Plan B mode. Kerosene heaters turned to conservation mode. Welfare comms active.",
                    "status": "ACTIVE"
                },
                {
                    "id": "INC-C-02",
                    "time": (now - timedelta(hours=14)).isoformat(),
                    "title": "Auxiliary SATCOM Dish Snow Caking & Signal Attenuation",
                    "type": "Communication",
                    "severity": "HIGH",
                    "description": "Blowing rime snow packed inside primary radome feed horn, reducing satellite link margin by 14 dB. Switched to heated emergency secondary Iridium antenna.",
                    "affected_people": "High Camp Field Party",
                    "affected_assets": "Primary Inmarsat Radome",
                    "mission_impact": "Bandwidth limited to 2.4 kbps; voice and vital telemetry operational.",
                    "response": "Heated antenna active; scheduled mechanical radome de-icing when wind drops below 35kt.",
                    "status": "ACTIVE"
                }
            ],
            "communication": {
                "status": "DEGRADED",
                "mode": "Emergency Iridium Pilot + HF Radio (Primary Starlink/Inmarsat Radome Caked)",
                "latency_ms": 780,
                "packet_loss_pct": 8.4,
                "bandwidth_kbps": 9.6,
                "last_successful_sync": (now - timedelta(minutes=14)).isoformat(),
                "last_telemetry_received": (now - timedelta(minutes=6)).isoformat(),
                "pending_sync_records": 12
            },
            "recommendations": [
                {
                    "id": "REC-C-2026-01",
                    "title": "Authorize Fuel Conservation Protocol B-4 & Defer Sample Flight",
                    "severity": "CRITICAL",
                    "reason": "AI Weather ensemble (BoM + ECMWF) predicts storm relaxation in 28 hours (approx. 2026-10-16 02:00Z). Authorizing generator duty cycle reduction now prevents emergency kerosene exhaustion.",
                    "model": "XGB_RESOURCE_DEMAND_v2.1",
                    "confidence": 0.94,
                    "fuel_delta": "+4.2 days endurance",
                    "eta_delta": "+38 hours",
                    "status": "PENDING_REVIEW",
                    "action_required": "Mission Commander Approval Required to ratify Plan B runtime limits"
                }
            ]
        }

        # Seed Expedition D (OPERATIONAL)
        self.expeditions["EXP-2026-D"] = {
            "id": "EXP-2026-D",
            "name": "Weddell Sea Ice Shelf Bathymetry",
            "mission_type": "Survey & Oceanography",
            "description": "Multi-beam sub-ice shelf mapping and physical oceanographic mooring recovery along the Larsen C and Ronne Ice Shelves.",
            "lead": "Capt. Alistair Finch",
            "organization": "British Antarctic Survey (BAS)",
            "operational_season": "2026-2027",
            "status": "OPERATIONAL",
            "status_display": "OPERATIONAL",
            "risk_level": "MEDIUM",
            "risk_score": 52.0,
            "progress": 55,
            "current_phase": "Autonomous Underwater Vehicle (AUV) Under-Ice Transects",
            "planned_start": "2026-10-05T00:00:00Z",
            "planned_end": "2026-12-28T00:00:00Z",
            "expected_completion": "2026-12-28T00:00:00Z",
            "delay_hours": 2.0,
            "delay_reason": "Tabular iceberg A-76A drift required a 12nm detour.",
            "origin_name": "Stanley, Falkland Islands",
            "destination_name": "Larsen C Ice Shelf / Weddell Sea",
            "current_region": "Weddell Sea / Larsen C",
            "current_lat": -67.502,
            "current_lon": -62.512,
            "vessel_name": "RRS Sir David Attenborough",
            "ships": ["RRS Sir David Attenborough"],
            "aircraft": ["Schiebel Camcopter S-100 Drone"],
            "vehicles": ["Autonomous Kongsberg Hugin 6000 AUV"],
            "major_equipment": ["Kongsberg EM122 Deep Water Multibeam", "CTD Rosette Carousel"],
            "crew_count": 62,
            "personnel": {
                "planned": 65,
                "assigned": 62,
                "deployed": 62,
                "available": 62,
                "missing": 3,
                "breakdown": [
                    {"role": "Expedition Lead / Master", "assigned": 1, "required": 1},
                    {"role": "Ship Officers & Marine Crew", "assigned": 32, "required": 32},
                    {"role": "Physical Oceanographers", "assigned": 18, "required": 20},
                    {"role": "AUV Robotics Engineers", "assigned": 8, "required": 9},
                    {"role": "Medical Staff", "assigned": 3, "required": 3}
                ],
                "roster": [
                    {"name": "Capt. Alistair Finch", "role": "Master & Polar Commander", "team": "Command", "cert": "Polar Code Ice Master", "location": "RRS Attenborough Bridge", "medical": "FIT_FOR_DUTY", "shift": "Watch Alpha", "deployed": True},
                    {"name": "Dr. Fiona MacLeod", "role": "Lead Oceanographer", "team": "Science", "cert": "Acoustic Hydrography Level 1", "location": "Ocean Lab 1", "medical": "FIT_FOR_DUTY", "shift": "Science Watch 1", "deployed": True}
                ]
            },
            "weather": {
                "station_id": "WDL_BUOY_04",
                "condition": "Overcast / Cold",
                "temperature_c": -14.2,
                "wind_speed_kt": 28.0,
                "wind_direction": "S (180°)",
                "wind_gust_kt": 38.0,
                "visibility_km": 8.5,
                "pressure_hpa": 988.2,
                "snowfall_rate": "Flurries",
                "storm_warning": False,
                "warning_title": "MODERATE ICEBERG CONVERGENCE",
                "warning_impact": "Radar watch doubled; sonar forward-looking active.",
                "forecast_confidence": 0.89,
                "provider": "ECMWF & Open-Meteo",
                "data_age_min": 20,
                "forecast_horizons": {
                    "current": {"temp": -14.2, "wind": 28, "vis": 8.5, "status": "Caution"},
                    "6_hour": {"temp": -15.5, "wind": 30, "vis": 7.0, "status": "Caution"},
                    "24_hour": {"temp": -16.0, "wind": 24, "vis": 9.0, "status": "Normal"},
                    "3_day": {"temp": -13.0, "wind": 18, "vis": 12.0, "status": "Optimal"},
                    "7_day": {"temp": -12.5, "wind": 16, "vis": 14.0, "status": "Optimal"}
                }
            },
            "sea_ice": {
                "source": "Sentinel-1C SAR & Copernicus Marine",
                "observation_time": (now - timedelta(hours=4, minutes=15)).isoformat(),
                "data_age_hours": 4.25,
                "confidence": 0.93,
                "concentration_pct": 55,
                "ice_class": "First-year pack ice with drifting tabular bergs",
                "ice_thickness_m": 1.40,
                "drift_speed_kt": 0.9,
                "drift_direction": "N (005°)",
                "operational_impact": "AUV launch envelope open; ice drift stable.",
                "compression_risk": "MEDIUM",
                "ice_edge_distance_km": 28.0
            },
            "satellite": {
                "source": "Sentinel-1B C-SAR",
                "scene_id": "S1B_IW_GRDH_20261013T221500",
                "observation_time": (now - timedelta(hours=6, minutes=0)).isoformat(),
                "footprint": "POLYGON((-64.0 -66.5, -61.0 -66.5, -61.0 -68.5, -64.0 -68.5, -64.0 -66.5))",
                "resolution_m": 20,
                "data_freshness": "Observed 6.0h ago",
                "satellite_type": "SAR_IMAGERY",
                "cloud_cover_pct": 0,
                "interpretation": "Larsen C ice shelf front shows no sudden fracturing; AUV sub-ice recovery corridor clear."
            },
            "logistics": {
                "cargo_readiness": 98,
                "fuel_readiness": 84,
                "supply_readiness": 90,
                "fuel_consumption_pct": 45,
                "fuel_projected_remaining_pct": 39,
                "fuel_reserve_warning": False,
                "items": [
                    {"category": "Fuel", "name": "Marine Gas Oil (MGO) Ultra-Low Sulfur", "required": 1200, "loaded": 1200, "consumed": 540, "remaining": 660, "unit": "metric tons", "reserve_pct": 55},
                    {"category": "Science", "name": "Lithium AUV Power Battery Modules", "required": 24, "loaded": 24, "consumed": 8, "remaining": 16, "unit": "sets", "reserve_pct": 67}
                ]
            },
            "risk_engine": {
                "overall_score": 52.0,
                "overall_level": "MEDIUM",
                "model_id": "XGB_EXP_RISK_v3.2",
                "confidence": 0.88,
                "main_contributor": "Calving event iceberg drift near Larsen C requiring dynamic acoustic tracking.",
                "categories": [
                    {"category": "Weather", "score": 42, "level": "MEDIUM", "weight": 0.20, "why": "Moderate southerly breeze with cold surge."},
                    {"category": "Sea Ice", "score": 65, "level": "HIGH", "weight": 0.22, "why": "Tabular iceberg fragments drifting in survey grid."},
                    {"category": "Vessel", "score": 18, "level": "LOW", "weight": 0.15, "why": "Polar Class 4 hull performant."},
                    {"category": "Aircraft", "score": 30, "level": "LOW", "weight": 0.10, "why": "S-100 drone flights subject to icing limit."},
                    {"category": "Personnel", "score": 15, "level": "LOW", "weight": 0.08, "why": "Crew healthy."},
                    {"category": "Medical", "score": 10, "level": "LOW", "weight": 0.05, "why": "Surgical suite fully operational."},
                    {"category": "Cargo", "score": 12, "level": "LOW", "weight": 0.05, "why": "Payload locked."},
                    {"category": "Fuel", "score": 32, "level": "LOW", "weight": 0.07, "why": "Fuel reserves 39%."},
                    {"category": "Communication", "score": 22, "level": "LOW", "weight": 0.03, "why": "Iridium Certus reliable."},
                    {"category": "Route", "score": 48, "level": "MEDIUM", "weight": 0.02, "why": "Iceberg avoidance zig-zag."},
                    {"category": "Environmental", "score": 14, "level": "LOW", "weight": 0.01, "why": "No hazards."},
                    {"category": "Schedule", "score": 25, "level": "LOW", "weight": 0.02, "why": "Nominal timetable."}
                ]
            },
            "objectives": [
                {"id": "OBJ-D1", "title": "Execute 120km sub-ice shelf autonomous bathymetric transect with Hugin AUV", "is_primary": True, "priority": "HIGH", "owner": "Dr. MacLeod", "deadline": "2026-11-20", "status": "IN PROGRESS", "success_criteria": "Acoustic return and complete bottom profile logged"},
                {"id": "OBJ-D2", "title": "Recover 4 deep oceanographic mooring arrays deployed in 2024", "is_primary": True, "priority": "HIGH", "owner": "Capt. Finch", "deadline": "2026-12-05", "status": "PLANNED", "success_criteria": "Acoustic release triggered and all instrument pods safely hoisted aboard"}
            ],
            "waypoints": [
                {"order": 1, "name": "Stanley Port", "lat": -51.70, "lon": -57.85, "passed": True, "eta": "2026-10-05T00:00:00Z", "ice_risk": "NONE"},
                {"order": 2, "name": "Elephant Island Passage", "lat": -61.10, "lon": -55.20, "passed": True, "eta": "2026-10-10T12:00:00Z", "ice_risk": "LOW"},
                {"order": 3, "name": "Larsen C Survey Station Bravo (Current)", "lat": -67.50, "lon": -62.51, "passed": False, "eta": "2026-10-15T00:00:00Z", "ice_risk": "MEDIUM"},
                {"order": 4, "name": "Ronne Ice Shelf Mooring Grid", "lat": -74.50, "lon": -58.00, "passed": False, "eta": "2026-11-25T00:00:00Z", "ice_risk": "HIGH"}
            ],
            "tasks": [
                {"id": "TSK-D401", "title": "Launch Hugin AUV for Mission #04 Sub-shelf Dive", "team": "Science", "owner": "Dr. MacLeod", "priority": "HIGH", "status": "IN PROGRESS", "due_date": "2026-10-15", "dependency": None, "location": "Larsen C Front"},
                {"id": "TSK-D402", "title": "Camcopter S-100 aerial ice reconnaissance flight", "team": "Aviation", "owner": "Drone Pilot Wright", "priority": "MEDIUM", "status": "TODO", "due_date": "2026-10-16", "dependency": None, "location": "Weddell Sea"}
            ],
            "timeline": [
                {"phase": "Phase 1: Falklands Departure & Drake Passage", "start": "2026-10-05", "end": "2026-10-11", "status": "COMPLETED", "progress": 100},
                {"phase": "Phase 2: Larsen C Shelf Acoustic Mapping", "start": "2026-10-12", "end": "2026-11-05", "status": "IN PROGRESS", "progress": 40},
                {"phase": "Phase 3: Weddell Gyre Mooring Array Recovery", "start": "2026-11-06", "end": "2026-12-10", "status": "PLANNED", "progress": 0},
                {"phase": "Phase 4: Return to Stanley", "start": "2026-12-11", "end": "2026-12-28", "status": "PLANNED", "progress": 0}
            ],
            "contingencies": [
                {
                    "plan": "Plan A (Baseline)",
                    "title": "Standard AUV under-ice deployment and acoustic beacon homing",
                    "trigger": "Ice drift <1.5kt",
                    "action": "Execute mission plan.",
                    "responsible": "Capt. Finch",
                    "resources": "RRS Attenborough moon pool",
                    "expected_impact": "Full mission profile",
                    "approval_required": "Master"
                }
            ],
            "incidents": [],
            "communication": {
                "status": "ONLINE",
                "mode": "Starlink Maritime High Speed + Inmarsat Fleet",
                "latency_ms": 94,
                "packet_loss_pct": 0.1,
                "bandwidth_kbps": 48000,
                "last_successful_sync": (now - timedelta(minutes=1)).isoformat(),
                "last_telemetry_received": (now - timedelta(seconds=30)).isoformat(),
                "pending_sync_records": 0
            },
            "recommendations": []
        }

        # Seed Expedition E (PRE-DEPARTURE)
        self.expeditions["EXP-2026-E"] = {
            "id": "EXP-2026-E",
            "name": "South Pole Overland Traverse",
            "mission_type": "Logistics & Overland Transport",
            "description": "Heavy tracked caterpillar tractor overland traverse carrying 450,000 liters of fuel and cargo from McMurdo across the Ross Ice Shelf and Transantarctic Mountains to Amundsen-Scott South Pole Station.",
            "lead": "Traverse Commander Tom Burke",
            "organization": "United States Antarctic Program (USAP)",
            "operational_season": "2026-2027",
            "status": "PRE-DEPARTURE",
            "status_display": "PRE-DEPARTURE",
            "risk_level": "HIGH",
            "risk_score": 72.0,
            "progress": 10,
            "current_phase": "Crevasse Radar Calibration & Sled Lashing",
            "planned_start": "2026-11-01T00:00:00Z",
            "planned_end": "2026-12-20T00:00:00Z",
            "expected_completion": "2026-12-20T00:00:00Z",
            "delay_hours": 0.0,
            "delay_reason": "None. Departure window opens in 34 days.",
            "origin_name": "McMurdo Station Logistics Staging",
            "destination_name": "Amundsen-Scott South Pole Station",
            "current_region": "Ross Ice Shelf / Transantarctic Route",
            "current_lat": -77.850,
            "current_lon": 166.666,
            "vessel_name": "Overland Heavy Traverse Fleet",
            "ships": [],
            "aircraft": ["DHC-6 Twin Otter (Ground Penetrating Radar Scout)"],
            "vehicles": ["6x Case/CAT MT865 Tracked Tractors", "2x PistenBully 300 GPR Scout"],
            "major_equipment": ["Ground Penetrating Crevasse Radar (GPR)", "Heavy High-Molecular-Weight Polyethylene Fuel Sleds"],
            "crew_count": 24,
            "personnel": {
                "planned": 25,
                "assigned": 24,
                "deployed": 0,
                "available": 24,
                "missing": 1,
                "breakdown": [
                    {"role": "Traverse Commander", "assigned": 1, "required": 1},
                    {"role": "Heavy Equipment Mechanics", "assigned": 10, "required": 10},
                    {"role": "Crevasse Safety & GPR Operators", "assigned": 6, "required": 6},
                    {"role": "Traverse Paramedics", "assigned": 2, "required": 2},
                    {"role": "Twin Otter Flight Crew", "assigned": 5, "required": 6}
                ],
                "roster": [
                    {"name": "Tom Burke", "role": "Traverse Commander", "team": "Command", "cert": "Polar Overland Master", "location": "McMurdo Heavy Shop", "medical": "FIT_FOR_DUTY", "shift": "Day Prep", "deployed": False},
                    {"name": "Jack 'Spanner' Miller", "role": "Lead Diesel Mechanic", "team": "Engineering", "cert": "Arctic Extreme Engine Overhaul", "location": "McMurdo Heavy Shop", "medical": "FIT_FOR_DUTY", "shift": "Day Prep", "deployed": False}
                ]
            },
            "weather": {
                "station_id": "MCM_TRAV_01",
                "condition": "Cold / Clear",
                "temperature_c": -38.2,
                "wind_speed_kt": 22.0,
                "wind_direction": "SSE (160°)",
                "wind_gust_kt": 29.0,
                "visibility_km": 10.0,
                "pressure_hpa": 978.0,
                "snowfall_rate": "None",
                "storm_warning": False,
                "warning_title": "EXTREME COLD ADVISORY (-38°C)",
                "warning_impact": "Hydraulic fluid pre-heating mandatory before tractor ignition.",
                "forecast_confidence": 0.90,
                "provider": "Open-Meteo & USAP Meteorological Network",
                "data_age_min": 30,
                "forecast_horizons": {
                    "current": {"temp": -38.2, "wind": 22, "vis": 10.0, "status": "Caution"},
                    "6_hour": {"temp": -40.0, "wind": 25, "vis": 9.0, "status": "Caution"},
                    "24_hour": {"temp": -36.0, "wind": 18, "vis": 12.0, "status": "Optimal"},
                    "3_day": {"temp": -32.0, "wind": 15, "vis": 15.0, "status": "Optimal"},
                    "7_day": {"temp": -34.0, "wind": 20, "vis": 12.0, "status": "Optimal"}
                }
            },
            "sea_ice": {
                "source": "N/A (Inland Continental Route)",
                "observation_time": (now - timedelta(hours=12)).isoformat(),
                "data_age_hours": 12.0,
                "confidence": 1.0,
                "concentration_pct": 0,
                "ice_class": "Glacial Ice Shelf & Polar Plateau Firn",
                "ice_thickness_m": 2800.0,
                "drift_speed_kt": 0.0,
                "drift_direction": "Inland",
                "operational_impact": "Crevasse shear zones at Shear Zone km 40-70.",
                "compression_risk": "LOW",
                "ice_edge_distance_km": 120.0
            },
            "satellite": {
                "source": "ICESat-2 Laser Altimetry / Sentinel-2 Surface Mosaic",
                "scene_id": "ICESAT2_ATL06_20261010_SHEARZONE",
                "observation_time": (now - timedelta(hours=18)).isoformat(),
                "footprint": "POLYGON((165.0 -78.0, 172.0 -78.0, 172.0 -85.0, 165.0 -85.0, 165.0 -78.0))",
                "resolution_m": 5,
                "data_freshness": "Observed 18.0h ago",
                "satellite_type": "LASER_ALTIMETRY",
                "cloud_cover_pct": 2.0,
                "interpretation": "Shear zone bridge thickness along Leverett Glacier pass confirmed at 14m minimum."
            },
            "logistics": {
                "cargo_readiness": 90,
                "fuel_readiness": 95,
                "supply_readiness": 92,
                "fuel_consumption_pct": 0,
                "fuel_projected_remaining_pct": 32,
                "fuel_reserve_warning": False,
                "items": [
                    {"category": "Fuel", "name": "AN-8 Polar Aviation & Vehicle Fuel Bladders", "required": 450, "loaded": 450, "consumed": 0, "remaining": 450, "unit": "kiloliters", "reserve_pct": 32},
                    {"category": "Spare Parts", "name": "Tractor track pins, hydraulic pumps, heaters", "required": 14, "loaded": 14, "consumed": 0, "remaining": 14, "unit": "heavy crates", "reserve_pct": 100}
                ]
            },
            "risk_engine": {
                "overall_score": 72.0,
                "overall_level": "HIGH",
                "model_id": "XGB_EXP_RISK_v3.2",
                "confidence": 0.92,
                "main_contributor": "Crevasse hazard along Leverett Glacier ascent to polar plateau (2,800m elevation).",
                "categories": [
                    {"category": "Weather", "score": 68, "level": "HIGH", "weight": 0.20, "why": "Plateau katabatic headwinds and -45C temperatures."},
                    {"category": "Sea Ice", "score": 10, "level": "LOW", "weight": 0.22, "why": "Inland glacial surface."},
                    {"category": "Vessel", "score": 88, "level": "CRITICAL", "weight": 0.15, "why": "Tractor mechanical breakdown at altitude would stop entire train."},
                    {"category": "Aircraft", "score": 45, "level": "MEDIUM", "weight": 0.10, "why": "Twin Otter GPR support reliant on weather window."},
                    {"category": "Personnel", "score": 65, "level": "HIGH", "weight": 0.08, "why": "High altitude sickness & hypothermia hazards."},
                    {"category": "Medical", "score": 50, "level": "MEDIUM", "weight": 0.05, "why": "Evacuation by air restricted if storms hit plateau."},
                    {"category": "Cargo", "score": 25, "level": "LOW", "weight": 0.05, "why": "Heavy polyethylene sleds secured."},
                    {"category": "Fuel", "score": 40, "level": "MEDIUM", "weight": 0.07, "why": "Heavy drag increases consumption in soft snow."},
                    {"category": "Communication", "score": 30, "level": "LOW", "weight": 0.03, "why": "Iridium PTT push-to-talk network live."},
                    {"category": "Route", "score": 92, "level": "CRITICAL", "weight": 0.02, "why": "Leverett Glacier crevasse field requires radar proofing."},
                    {"category": "Environmental", "score": 15, "level": "LOW", "weight": 0.01, "why": "Zero spill double-walled bladders."},
                    {"category": "Schedule", "score": 35, "level": "MEDIUM", "weight": 0.02, "why": "45-day traverse window tight before South Pole winter closure."}
                ]
            },
            "objectives": [
                {"id": "OBJ-E1", "title": "Transport 450,000 liters of AN-8 fuel to Amundsen-Scott South Pole Station", "is_primary": True, "priority": "CRITICAL", "owner": "Tom Burke", "deadline": "2026-12-15", "status": "PLANNED", "success_criteria": "Safe delivery without loss, manifold offload into Station Vault 1"},
                {"id": "OBJ-E2", "title": "Crevasse radar scan and flag 1,600km flagged traverse route", "is_primary": True, "priority": "HIGH", "owner": "Tom Burke", "deadline": "2026-11-20", "status": "IN PROGRESS", "success_criteria": "Zero tractor drop-ins, 100% GPR logged"}
            ],
            "waypoints": [
                {"order": 1, "name": "McMurdo Vehicle Staging", "lat": -77.85, "lon": 166.67, "passed": False, "eta": "2026-11-01T00:00:00Z", "ice_risk": "LOW"},
                {"order": 2, "name": "Ross Ice Shelf Shear Zone Entry", "lat": -78.30, "lon": 168.00, "passed": False, "eta": "2026-11-04T12:00:00Z", "ice_risk": "CRITICAL"},
                {"order": 3, "name": "Leverett Glacier Foot", "lat": -85.60, "lon": -150.00, "passed": False, "eta": "2026-11-20T00:00:00Z", "ice_risk": "HIGH"},
                {"order": 4, "name": "Amundsen-Scott South Pole Station (90S)", "lat": -90.00, "lon": 0.00, "passed": False, "eta": "2026-12-15T00:00:00Z", "ice_risk": "LOW"}
            ],
            "tasks": [
                {"id": "TSK-E501", "title": "Cold-soak test Caterpillar MT865 turbochargers at -40C", "team": "Engineering", "owner": "Jack Miller", "priority": "HIGH", "status": "COMPLETED", "due_date": "2026-10-20", "dependency": None, "location": "McMurdo"},
                {"id": "TSK-E502", "title": "Fill flexible rubber fuel bladders and conduct leak checks", "team": "Logistics", "owner": "Tom Burke", "priority": "CRITICAL", "status": "IN PROGRESS", "due_date": "2026-10-25", "dependency": "TSK-E501", "location": "Williams Field Fuel Pit"}
            ],
            "timeline": [
                {"phase": "Phase 1: Tractor Overhaul & Sled Rigging", "start": "2026-10-01", "end": "2026-10-31", "status": "IN PROGRESS", "progress": 80},
                {"phase": "Phase 2: Ross Shelf Leg to Shear Zone", "start": "2026-11-01", "end": "2026-11-12", "status": "PLANNED", "progress": 0},
                {"phase": "Phase 3: Transantarctic Mountains Ascent", "start": "2026-11-13", "end": "2026-11-30", "status": "PLANNED", "progress": 0},
                {"phase": "Phase 4: Polar Plateau Run to 90 South", "start": "2026-12-01", "end": "2026-12-15", "status": "PLANNED", "progress": 0},
                {"phase": "Phase 5: South Pole Turnaround & Unloading", "start": "2026-12-16", "end": "2026-12-20", "status": "PLANNED", "progress": 0}
            ],
            "contingencies": [
                {
                    "plan": "Plan A (Baseline)",
                    "title": "Continuous 24-hour staggered tractor train",
                    "trigger": "Route radar clean, temp > -50C",
                    "action": "Maintain 7.5 kt advance.",
                    "responsible": "Tom Burke",
                    "resources": "Traverse train",
                    "expected_impact": "Arrive Dec 15",
                    "approval_required": "Traverse Commander"
                }
            ],
            "incidents": [],
            "communication": {
                "status": "ONLINE",
                "mode": "Iridium Push-To-Talk & Dual Fixed Sat SBD",
                "latency_ms": 280,
                "packet_loss_pct": 1.2,
                "bandwidth_kbps": 2400,
                "last_successful_sync": (now - timedelta(minutes=5)).isoformat(),
                "last_telemetry_received": (now - timedelta(minutes=1)).isoformat(),
                "pending_sync_records": 0
            },
            "recommendations": []
        }

        # Seed Expedition F (READY FOR APPROVAL)
        self.expeditions["EXP-2026-F"] = {
            "id": "EXP-2026-F",
            "name": "Queen Maud Land Environmental Survey",
            "mission_type": "Environmental Monitoring",
            "description": "Comprehensive environmental impact assessment and baseline microplastic / air quality survey surrounding Troll Research Station and the Jutulsessen nunataks.",
            "lead": "Dr. Astrid Lindholm",
            "organization": "Norwegian Polar Institute (NPI)",
            "operational_season": "2026-2027",
            "status": "READY FOR APPROVAL",
            "status_display": "READY FOR APPROVAL",
            "risk_level": "LOW",
            "risk_score": 22.4,
            "progress": 0,
            "current_phase": "Mission Plan Commander Review",
            "planned_start": "2026-12-01T00:00:00Z",
            "planned_end": "2027-02-15T00:00:00Z",
            "expected_completion": "2027-02-15T00:00:00Z",
            "delay_hours": 0.0,
            "delay_reason": "Awaiting final Commander sign-off.",
            "origin_name": "Tromsø / Cape Town",
            "destination_name": "Troll Research Station, Dronning Maud Land",
            "current_region": "Jutulsessen Nunataks / Queen Maud Land",
            "current_lat": -72.012,
            "current_lon": 2.533,
            "vessel_name": "Kronprins Haakon",
            "ships": ["Kronprins Haakon"],
            "aircraft": ["Basler BT-67 Turbo Dakota"],
            "vehicles": ["2x Lynx Commander Snowmobiles"],
            "major_equipment": ["Air Particulate Optical Counters", "Ultra-Clean Aerosol Sampling Hoods"],
            "crew_count": 35,
            "personnel": {
                "planned": 35,
                "assigned": 35,
                "deployed": 0,
                "available": 35,
                "missing": 0,
                "breakdown": [
                    {"role": "Lead Environmental Scientist", "assigned": 1, "required": 1},
                    {"role": "Atmospheric Chemists", "assigned": 10, "required": 10},
                    {"role": "Ship & Aviation Crew", "assigned": 20, "required": 20},
                    {"role": "Medical Staff", "assigned": 4, "required": 4}
                ],
                "roster": [
                    {"name": "Dr. Astrid Lindholm", "role": "Lead Environmental Scientist", "team": "Science", "cert": "Polar Wilderness Advanced", "location": "Tromsø Office", "medical": "FIT_FOR_DUTY", "shift": "Day Operations", "deployed": False}
                ]
            },
            "weather": {
                "station_id": "TRL_AWS_02",
                "condition": "Clear / Cold",
                "temperature_c": -12.4,
                "wind_speed_kt": 12.0,
                "wind_direction": "NE (045°)",
                "wind_gust_kt": 16.0,
                "visibility_km": 15.0,
                "pressure_hpa": 1002.1,
                "snowfall_rate": "None",
                "storm_warning": False,
                "warning_title": "PRISTINE CONDITIONS",
                "warning_impact": "Optimal environmental sampling window.",
                "forecast_confidence": 0.95,
                "provider": "Norwegian Met Institute (MET Norway) & Open-Meteo",
                "data_age_min": 25,
                "forecast_horizons": {
                    "current": {"temp": -12.4, "wind": 12, "vis": 15.0, "status": "Optimal"},
                    "6_hour": {"temp": -13.0, "wind": 14, "vis": 15.0, "status": "Optimal"},
                    "24_hour": {"temp": -11.0, "wind": 10, "vis": 15.0, "status": "Optimal"},
                    "3_day": {"temp": -10.0, "wind": 15, "vis": 15.0, "status": "Optimal"},
                    "7_day": {"temp": -14.0, "wind": 18, "vis": 12.0, "status": "Optimal"}
                }
            },
            "sea_ice": {
                "source": "Sentinel-1C SAR",
                "observation_time": (now - timedelta(hours=8)).isoformat(),
                "data_age_hours": 8.0,
                "confidence": 0.94,
                "concentration_pct": 18,
                "ice_class": "Open Water & Loose Floes",
                "ice_thickness_m": 0.40,
                "drift_speed_kt": 0.3,
                "drift_direction": "W",
                "operational_impact": "Open access corridor.",
                "compression_risk": "LOW",
                "ice_edge_distance_km": 60.0
            },
            "satellite": {
                "source": "Sentinel-2 MSI",
                "scene_id": "S2_TRL_20261012_ATM",
                "observation_time": (now - timedelta(hours=10)).isoformat(),
                "footprint": "POLYGON((2.0 -71.5, 3.5 -71.5, 3.5 -72.5, 2.0 -72.5, 2.0 -71.5))",
                "resolution_m": 10,
                "data_freshness": "Observed 10.0h ago",
                "satellite_type": "OPTICAL_IMAGERY",
                "cloud_cover_pct": 1.0,
                "interpretation": "Troll Airfield blue ice runway surface dry and free of drift sastrugi."
            },
            "logistics": {
                "cargo_readiness": 100,
                "fuel_readiness": 100,
                "supply_readiness": 100,
                "fuel_consumption_pct": 0,
                "fuel_projected_remaining_pct": 60,
                "fuel_reserve_warning": False,
                "items": [
                    {"category": "Science", "name": "Ultra-Pure Teflon Sample Flasks", "required": 250, "loaded": 250, "consumed": 0, "remaining": 250, "unit": "flasks", "reserve_pct": 100}
                ]
            },
            "risk_engine": {
                "overall_score": 22.4,
                "overall_level": "LOW",
                "model_id": "XGB_EXP_RISK_v3.2",
                "confidence": 0.95,
                "main_contributor": "Low operational risk; awaiting Mission Commander final sign-off.",
                "categories": [
                    {"category": "Weather", "score": 15, "level": "LOW", "weight": 0.20, "why": "Stable katabatic pattern."},
                    {"category": "Sea Ice", "score": 12, "level": "LOW", "weight": 0.22, "why": "Open leads."},
                    {"category": "Vessel", "score": 10, "level": "LOW", "weight": 0.15, "why": "Kronprins Haakon modern PC-3."},
                    {"category": "Aircraft", "score": 18, "level": "LOW", "weight": 0.10, "why": "Basler BT-67 flight cert current."},
                    {"category": "Personnel", "score": 14, "level": "LOW", "weight": 0.08, "why": "Full roster filled."},
                    {"category": "Medical", "score": 10, "level": "LOW", "weight": 0.05, "why": "Ready."},
                    {"category": "Cargo", "score": 8, "level": "LOW", "weight": 0.05, "why": "Loaded."},
                    {"category": "Fuel", "score": 12, "level": "LOW", "weight": 0.07, "why": "Full."},
                    {"category": "Communication", "score": 15, "level": "LOW", "weight": 0.03, "why": "Troll SATCOM active."},
                    {"category": "Route", "score": 10, "level": "LOW", "weight": 0.02, "why": "Approved."},
                    {"category": "Environmental", "score": 5, "level": "LOW", "weight": 0.01, "why": "No impact."},
                    {"category": "Schedule", "score": 10, "level": "LOW", "weight": 0.02, "why": "On target."}
                ]
            },
            "objectives": [
                {"id": "OBJ-F1", "title": "Collect 200 cryospheric snow samples for microplastic baseline assessment", "is_primary": True, "priority": "HIGH", "owner": "Dr. Lindholm", "deadline": "2027-01-15", "status": "PLANNED", "success_criteria": "Ultra-clean protocol compliance with zero cross-contamination"}
            ],
            "waypoints": [
                {"order": 1, "name": "Cape Town Berth", "lat": -33.91, "lon": 18.43, "passed": False, "eta": "2026-12-01T00:00:00Z", "ice_risk": "NONE"},
                {"order": 2, "name": "Troll Airfield Skiway", "lat": -72.01, "lon": 2.53, "passed": False, "eta": "2026-12-10T00:00:00Z", "ice_risk": "LOW"}
            ],
            "tasks": [
                {"id": "TSK-F601", "title": "Submit Final Environmental Evaluation to CEP Secretariat", "team": "Science", "owner": "Dr. Lindholm", "priority": "HIGH", "status": "COMPLETED", "due_date": "2026-10-15", "dependency": None, "location": "Tromsø"},
                {"id": "TSK-F602", "title": "Commander Mission Authorization Sign-off", "team": "Command", "owner": "Duty Commander", "priority": "CRITICAL", "status": "TODO", "due_date": "2026-10-30", "dependency": "TSK-F601", "location": "PolarOne Command"}
            ],
            "timeline": [
                {"phase": "Phase 1: Commander Approval & Final Review", "start": "2026-10-15", "end": "2026-11-15", "status": "IN PROGRESS", "progress": 85},
                {"phase": "Phase 2: Deployment Transit", "start": "2026-12-01", "end": "2026-12-15", "status": "PLANNED", "progress": 0},
                {"phase": "Phase 3: Field Sampling", "start": "2026-12-16", "end": "2027-01-30", "status": "PLANNED", "progress": 0},
                {"phase": "Phase 4: Return", "start": "2027-02-01", "end": "2027-02-15", "status": "PLANNED", "progress": 0}
            ],
            "contingencies": [
                {
                    "plan": "Plan A (Baseline)",
                    "title": "Nominal flight and snowmobile survey",
                    "trigger": "Weather nominal",
                    "action": "Execute sample grid.",
                    "responsible": "Dr. Lindholm",
                    "resources": "Troll base facilities",
                    "expected_impact": "Complete survey",
                    "approval_required": "Field Lead"
                }
            ],
            "incidents": [],
            "communication": {
                "status": "ONLINE",
                "mode": "TrollSat Optical Ground Station / Dual Ka-band",
                "latency_ms": 32,
                "packet_loss_pct": 0.0,
                "bandwidth_kbps": 150000,
                "last_successful_sync": (now - timedelta(minutes=1)).isoformat(),
                "last_telemetry_received": (now - timedelta(seconds=15)).isoformat(),
                "pending_sync_records": 0
            },
            "recommendations": [
                {
                    "id": "REC-F-2026-01",
                    "title": "Approve Expedition EXP-2026-F for Operational Deployment",
                    "severity": "LOW",
                    "reason": "All 11 planning steps complete. Environmental evaluation ratified by Antarctic Treaty consultative committee. Resources, personnel, and medical readiness 100% verified.",
                    "model": "HEURISTIC_OPS_APPROVAL",
                    "confidence": 0.99,
                    "status": "PENDING_REVIEW",
                    "action_required": "Duty Commander Approval Required"
                }
            ]
        }

        # Seed initial audit log entries
        self.audit_logs.extend([
            {
                "audit_id": "AUD-EXP-101",
                "expedition_id": "EXP-2026-C",
                "timestamp": (now - timedelta(hours=36)).isoformat(),
                "actor": "Commander E. Hayes (Duty Commander)",
                "actor_role": "Commander",
                "action": "STATUS_CHANGE",
                "old_value": "OPERATIONAL",
                "new_value": "BLOCKED",
                "reason": "Severe Category 4 Blizzard (58kt sustained) triggered Contingency Plan B - High Camp lockdown."
            },
            {
                "audit_id": "AUD-EXP-102",
                "expedition_id": "EXP-2026-A",
                "timestamp": (now - timedelta(hours=18)).isoformat(),
                "actor": "Cmdr. Sarah Jenkins",
                "actor_role": "Expedition Lead",
                "action": "ROUTE_WAYPOINT_ADDED",
                "old_value": "Waypoint Delta Direct",
                "new_value": "Waypoint Delta-2 Cape Armitage Bypass",
                "reason": "Avoidance of multi-year ridge confirmed on Sentinel-1 SAR observation."
            }
        ])

    # Methods
    def get_expeditions(self,
                        status: Optional[str] = None,
                        risk: Optional[str] = None,
                        region: Optional[str] = None,
                        vessel: Optional[str] = None,
                        lead: Optional[str] = None,
                        search: Optional[str] = None) -> List[Dict[str, Any]]:
        results = list(self.expeditions.values())

        if status:
            s_lower = status.lower()
            results = [e for e in results if s_lower in e["status"].lower() or s_lower in e["status_display"].lower()]
        if risk:
            results = [e for e in results if e["risk_level"].lower() == risk.lower()]
        if region:
            results = [e for e in results if region.lower() in e["current_region"].lower()]
        if vessel:
            results = [e for e in results if vessel.lower() in e.get("vessel_name", "").lower()]
        if lead:
            results = [e for e in results if lead.lower() in e["lead"].lower()]
        if search:
            q = search.lower()
            results = [
                e for e in results
                if q in e["id"].lower()
                or q in e["name"].lower()
                or q in e["lead"].lower()
                or q in e.get("vessel_name", "").lower()
                or q in e["current_region"].lower()
                or q in e["mission_type"].lower()
            ]

        return results

    def get_kpis(self) -> Dict[str, Any]:
        exps = list(self.expeditions.values())
        active_count = sum(1 for e in exps if e["status"] in ["IN TRANSIT", "OPERATIONAL"])
        planning_count = sum(1 for e in exps if e["status"] in ["DRAFT", "PLANNING", "READY FOR APPROVAL"])
        high_risk_count = sum(1 for e in exps if e["risk_level"] in ["HIGH", "CRITICAL"])
        blocked_count = sum(1 for e in exps if "BLOCKED" in e["status"])
        total_personnel = sum(e["personnel"]["deployed"] for e in exps)
        
        # Count unique active ships + aircraft
        all_ships = set()
        all_aircraft = set()
        for e in exps:
            for s in e.get("ships", []):
                all_ships.add(s)
            for a in e.get("aircraft", []):
                all_aircraft.add(a)
        active_assets = len(all_ships) + len(all_aircraft)

        missions_season = len(exps)
        upcoming_departures = sum(1 for e in exps if e["status"] in ["APPROVED", "PRE-DEPARTURE"])

        return {
            "active_expeditions": active_count,
            "planning": planning_count,
            "high_risk_missions": high_risk_count,
            "blocked_missions": blocked_count,
            "personnel_deployed": total_personnel,
            "active_assets": active_assets,
            "missions_this_season": missions_season,
            "upcoming_departures": upcoming_departures
        }

    def get_expedition(self, exp_id: str) -> Optional[Dict[str, Any]]:
        return self.expeditions.get(exp_id)

    def create_expedition(self, data: Dict[str, Any], actor: str = "Commander E. Hayes") -> Dict[str, Any]:
        exp_id = data.get("id") or f"EXP-2026-{chr(65 + len(self.expeditions))}"
        data["id"] = exp_id
        data["status"] = data.get("status", "PLANNING")
        data["status_display"] = data["status"]
        data["created_at"] = utc_now().isoformat()
        
        # Ensure deep structures exist
        if "personnel" not in data:
            data["personnel"] = {"planned": 20, "assigned": 18, "deployed": 0, "available": 18, "missing": 2, "breakdown": [], "roster": []}
        if "weather" not in data:
            data["weather"] = {
                "condition": "Scattered Clouds",
                "temperature_c": -15.0,
                "wind_speed_kt": 15.0,
                "wind_direction": "S",
                "visibility_km": 10.0,
                "pressure_hpa": 990.0,
                "forecast_confidence": 0.90,
                "provider": "Open-Meteo",
                "data_age_min": 10,
                "forecast_horizons": {}
            }
        if "sea_ice" not in data:
            data["sea_ice"] = {
                "source": "Copernicus Marine SAR",
                "observation_time": utc_now().isoformat(),
                "data_age_hours": 1.0,
                "confidence": 0.90,
                "concentration_pct": 25,
                "ice_class": "Open Drift Ice",
                "ice_thickness_m": 0.8,
                "operational_impact": "Nominal passage"
            }
        if "satellite" not in data:
            data["satellite"] = {
                "source": "Sentinel-1 SAR",
                "observation_time": utc_now().isoformat(),
                "data_freshness": "Observed 1h ago",
                "satellite_type": "SAR_IMAGERY"
            }
        if "risk_engine" not in data:
            data["risk_engine"] = {
                "overall_score": data.get("risk_score", 20.0),
                "overall_level": data.get("risk_level", "LOW"),
                "model_id": "XGB_EXP_RISK_v3.2",
                "confidence": 0.88,
                "main_contributor": "Initial expedition plan; low operational risk.",
                "categories": []
            }
        if "logistics" not in data:
            data["logistics"] = {"cargo_readiness": 100, "fuel_readiness": 100, "supply_readiness": 100, "items": []}
        if "objectives" not in data:
            data["objectives"] = []
        if "waypoints" not in data:
            data["waypoints"] = []
        if "tasks" not in data:
            data["tasks"] = []
        if "timeline" not in data:
            data["timeline"] = []
        if "contingencies" not in data:
            data["contingencies"] = []
        if "incidents" not in data:
            data["incidents"] = []
        if "communication" not in data:
            data["communication"] = {"status": "ONLINE", "mode": "Dual Starlink / Iridium", "last_successful_sync": utc_now().isoformat(), "pending_sync_records": 0}
        if "recommendations" not in data:
            data["recommendations"] = []

        self.expeditions[exp_id] = data

        self.log_audit(
            expedition_id=exp_id,
            actor=actor,
            actor_role="Commander",
            action="CREATE_EXPEDITION",
            old_value=None,
            new_value=f"Created {data.get('name')} ({exp_id}) with status {data.get('status')}",
            reason="New polar mission registered via 11-step planning wizard."
        )

        return data

    def update_expedition(self, exp_id: str, updates: Dict[str, Any], actor: str = "Commander E. Hayes") -> Optional[Dict[str, Any]]:
        exp = self.expeditions.get(exp_id)
        if not exp:
            return None

        old_status = exp.get("status")
        for k, v in updates.items():
            exp[k] = v

        if "status" in updates and updates["status"] != old_status:
            exp["status_display"] = updates["status"]
            self.log_audit(
                expedition_id=exp_id,
                actor=actor,
                actor_role="Commander",
                action="STATUS_CHANGE",
                old_value=old_status,
                new_value=updates["status"],
                reason=updates.get("status_reason", "Operational update.")
            )

        return exp

    def delete_expedition(self, exp_id: str, actor: str = "Commander E. Hayes") -> bool:
        if exp_id in self.expeditions:
            name = self.expeditions[exp_id].get("name")
            del self.expeditions[exp_id]
            self.log_audit(
                expedition_id=exp_id,
                actor=actor,
                actor_role="Commander",
                action="DELETE_EXPEDITION",
                old_value=name,
                new_value=None,
                reason="Expedition archived/removed by authorized commander."
            )
            return True
        return False

    def update_status(self, exp_id: str, new_status: str, reason: str, actor: str = "Commander E. Hayes") -> Optional[Dict[str, Any]]:
        exp = self.expeditions.get(exp_id)
        if not exp:
            return None

        old_status = exp.get("status")
        exp["status"] = new_status
        exp["status_display"] = new_status
        if "BLOCKED" in new_status:
            exp["delay_reason"] = reason
        
        self.log_audit(
            expedition_id=exp_id,
            actor=actor,
            actor_role="Commander",
            action="STATUS_TRANSITION",
            old_value=old_status,
            new_value=new_status,
            reason=reason
        )
        return exp

    def approve_expedition(self, exp_id: str, actor: str = "Commander E. Hayes", comments: str = "Approved for deployment") -> Optional[Dict[str, Any]]:
        exp = self.expeditions.get(exp_id)
        if not exp:
            return None

        exp["status"] = "APPROVED"
        exp["status_display"] = "APPROVED"
        self.log_audit(
            expedition_id=exp_id,
            actor=actor,
            actor_role="Commander",
            action="EXPEDITION_APPROVED",
            old_value="READY FOR APPROVAL",
            new_value="APPROVED",
            reason=comments
        )
        return exp

    def pause_expedition(self, exp_id: str, reason: str = "Operational pause ordered by Commander", actor: str = "Commander E. Hayes") -> Optional[Dict[str, Any]]:
        exp = self.expeditions.get(exp_id)
        if not exp:
            return None

        old_status = exp.get("status")
        exp["status"] = "SUSPENDED"
        exp["status_display"] = "SUSPENDED"
        self.log_audit(
            expedition_id=exp_id,
            actor=actor,
            actor_role="Commander",
            action="EXPEDITION_PAUSED",
            old_value=old_status,
            new_value="SUSPENDED",
            reason=reason
        )
        return exp

    def resume_expedition(self, exp_id: str, actor: str = "Commander E. Hayes") -> Optional[Dict[str, Any]]:
        exp = self.expeditions.get(exp_id)
        if not exp:
            return None

        old_status = exp.get("status")
        exp["status"] = "OPERATIONAL"
        exp["status_display"] = "IN PROGRESS"
        self.log_audit(
            expedition_id=exp_id,
            actor=actor,
            actor_role="Commander",
            action="EXPEDITION_RESUMED",
            old_value=old_status,
            new_value="OPERATIONAL",
            reason="Operations resumed following clearance of block/suspension condition."
        )
        return exp

    def add_task(self, exp_id: str, task: Dict[str, Any], actor: str = "Operations Officer") -> Optional[Dict[str, Any]]:
        exp = self.expeditions.get(exp_id)
        if not exp:
            return None

        task_id = task.get("id") or f"TSK-{uuid.uuid4().hex[:6].upper()}"
        task["id"] = task_id
        task["status"] = task.get("status", "TODO")
        if "tasks" not in exp:
            exp["tasks"] = []
        exp["tasks"].append(task)

        self.log_audit(
            expedition_id=exp_id,
            actor=actor,
            actor_role="Operations Officer",
            action="TASK_CREATED",
            old_value=None,
            new_value=f"Created task {task_id}: {task.get('title')}",
            reason="Operational task added to mission."
        )
        return task

    def update_task(self, exp_id: str, task_id: str, updates: Dict[str, Any], actor: str = "Operations Officer") -> Optional[Dict[str, Any]]:
        exp = self.expeditions.get(exp_id)
        if not exp or "tasks" not in exp:
            return None

        for t in exp["tasks"]:
            if t["id"] == task_id:
                old_status = t.get("status")
                t.update(updates)
                if "status" in updates and updates["status"] != old_status:
                    self.log_audit(
                        expedition_id=exp_id,
                        actor=actor,
                        actor_role="Operations Officer",
                        action="TASK_STATUS_UPDATE",
                        old_value=old_status,
                        new_value=updates["status"],
                        reason=f"Task {task_id} transitioned."
                    )
                return t
        return None

    def add_incident(self, exp_id: str, incident: Dict[str, Any], actor: str = "Safety Officer") -> Optional[Dict[str, Any]]:
        exp = self.expeditions.get(exp_id)
        if not exp:
            return None

        inc_id = incident.get("id") or f"INC-{uuid.uuid4().hex[:6].upper()}"
        incident["id"] = inc_id
        incident["time"] = incident.get("time") or utc_now().isoformat()
        incident["status"] = incident.get("status", "ACTIVE")
        if "incidents" not in exp:
            exp["incidents"] = []
        exp["incidents"].append(incident)

        # High or critical severity incidents impact expedition risk
        if incident.get("severity") in ["HIGH", "CRITICAL"]:
            exp["risk_level"] = "HIGH"
            exp["risk_score"] = min(100.0, exp.get("risk_score", 50.0) + 20.0)

        self.log_audit(
            expedition_id=exp_id,
            actor=actor,
            actor_role="Safety Officer",
            action="INCIDENT_REPORTED",
            old_value=None,
            new_value=f"{incident.get('severity')} - {incident.get('title')} ({inc_id})",
            reason=incident.get("description", "Safety incident logged.")
        )
        return incident

    def decide_recommendation(self, exp_id: str, rec_id: str, decision: str, actor: str = "Commander E. Hayes", comments: str = "") -> Optional[Dict[str, Any]]:
        exp = self.expeditions.get(exp_id)
        if not exp or "recommendations" not in exp:
            return None

        for r in exp["recommendations"]:
            if r["id"] == rec_id:
                r["status"] = "APPROVED" if decision == "APPROVE" else "REJECTED"
                r["decision_time"] = utc_now().isoformat()
                r["decided_by"] = actor
                r["comments"] = comments

                self.log_audit(
                    expedition_id=exp_id,
                    actor=actor,
                    actor_role="Commander",
                    action=f"RECOMMENDATION_{r['status']}",
                    old_value="PENDING_REVIEW",
                    new_value=r["status"],
                    reason=f"Recommendation '{r.get('title')}' {r['status']}: {comments}"
                )
                return r
        return None

    def simulate_scenario(self, exp_id: str, scenario_type: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        What-if scenario analysis:
        - vessel delay (e.g. +24h)
        - severe weather deterioration
        - fuel consumption increase (+25%)
        - station unavailable / ice shelf closed
        - aircraft grounded
        """
        exp = self.expeditions.get(exp_id, {})
        base_eta = exp.get("expected_completion", "2026-12-15T00:00:00Z")
        base_fuel_remaining = exp.get("logistics", {}).get("fuel_projected_remaining_pct", 28)
        base_risk_score = exp.get("risk_score", 45.0)

        if scenario_type == "VESSEL_DELAY":
            delay_h = params.get("delay_hours", 24)
            return {
                "scenario_type": "VESSEL_DELAY",
                "title": f"Vessel Delayed by {delay_h} Hours",
                "current_eta": base_eta,
                "simulated_eta": "Projected +36h total (includes missed tidal window)",
                "resource_impact": f"Fuel consumption increases by {(delay_h * 0.4):.1f} metric tons (idling in ice).",
                "projected_fuel_remaining": max(5, base_fuel_remaining - 4),
                "risk_score_delta": "+14.5 (Risk increases to HIGH)",
                "affected_tasks": ["TSK-A102 (Berthing)", "TSK-A103 (Fuel Discharge)", "Flight Skiway Transfers"],
                "recommendation": "Review Departure Window. Advise tanker escort to hold speed at 8kt to minimize drift compression risk.",
                "human_approval_required": True
            }
        elif scenario_type == "WEATHER_DETERIORATION":
            return {
                "scenario_type": "WEATHER_DETERIORATION",
                "title": "Severe Gale Storm Front (+50kt Wind Shear)",
                "current_eta": base_eta,
                "simulated_eta": "Projected +48h delay due to whiteout halt",
                "resource_impact": "Heating kerosene consumption spikes +40% in field camps.",
                "projected_fuel_remaining": max(5, base_fuel_remaining - 9),
                "risk_score_delta": "+28.0 (CRITICAL RISK)",
                "affected_tasks": ["All Aviation flights suspended", "Overland traverses halted", "Deck crane lifts blocked"],
                "recommendation": "Pre-authorize tie-down protocol Plan B; stage emergency hot rations.",
                "human_approval_required": True
            }
        elif scenario_type == "FUEL_BURN_SPIKE":
            pct = params.get("increase_pct", 30)
            return {
                "scenario_type": "FUEL_BURN_SPIKE",
                "title": f"Heavy Pack Ice Ramming Fuel Surge (+{pct}%)",
                "current_eta": base_eta,
                "simulated_eta": "Nominal ETA preserved, but fuel reserves breached",
                "resource_impact": f"Reserve margin drops below critical 15% safety threshold.",
                "projected_fuel_remaining": 12,
                "risk_score_delta": "+22.0 (HIGH LOGISTICS RISK)",
                "affected_tasks": ["Station resupply transfer volume reduced by 120 kiloliters"],
                "recommendation": "Switch to Route Delta-2 (Thermal Lead) to reduce hull friction and conserve 18 tons of MGO.",
                "human_approval_required": True
            }
        elif scenario_type == "AIRCRAFT_UNAVAILABLE":
            return {
                "scenario_type": "AIRCRAFT_UNAVAILABLE",
                "title": "Aviation Support Grounded / Turbine Fault",
                "current_eta": base_eta,
                "simulated_eta": "+5 days for science team personnel transfers",
                "resource_impact": "Requires tracked vehicle overland deployment as substitute.",
                "projected_fuel_remaining": base_fuel_remaining,
                "risk_score_delta": "+16.0 (MEDIUM/HIGH)",
                "affected_tasks": ["Deep Ice Core sample backhaul", "Medical evacuation readiness"],
                "recommendation": "Request Twin Otter dispatch from Rothera or McMurdo air pool.",
                "human_approval_required": True
            }
        else:
            return {
                "scenario_type": "CUSTOM_SIMULATION",
                "title": "General Scenario Evaluation",
                "current_eta": base_eta,
                "simulated_eta": "+12h variance",
                "resource_impact": "Within manageable reserve margins.",
                "projected_fuel_remaining": base_fuel_remaining - 2,
                "risk_score_delta": "+5.0",
                "affected_tasks": ["Scheduled inspections"],
                "recommendation": "Maintain continuous situational monitoring.",
                "human_approval_required": False
            }

    def query_copilot(self, query: str, expedition_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Antarctic Operations AI Copilot.
        Grounds responses strictly in loaded expedition telemetry.
        """
        q = query.lower()
        now_str = utc_now().strftime("%Y-%m-%d %H:%M UTC")

        # Highest risk expeditions
        if "highest" in q and "risk" in q:
            high_exps = sorted(self.expeditions.values(), key=lambda x: x.get("risk_score", 0), reverse=True)
            top = high_exps[0]
            items_str = ", ".join([f"{e['id']} ({e['name']}, Score: {e['risk_score']}, {e['risk_level']})" for e in high_exps[:3]])
            return {
                "query": query,
                "answer": f"The highest-risk expedition currently is **{top['id']} ({top['name']})** with an explainable risk score of **{top['risk_score']}/100 ({top['risk_level']})**.\n\nTop 3 risk ranking:\n" + "\n".join([f"- **{e['id']}**: {e['name']} - Risk: {e['risk_level']} ({e['risk_score']}/100). Reason: {e.get('risk_engine', {}).get('main_contributor', 'N/A')}" for e in high_exps[:3]]),
                "confidence": 0.96,
                "model": "PolarOne_Copilot_Expeditions_v2",
                "data_freshness": "Live telemetry (<2 min)",
                "suggested_actions": ["Inspect EXP-2026-C Blizzard status", "Review High-Risk filter on Dashboard"]
            }

        # Why is an expedition delayed (e.g. EXP-2026-C)
        if "why" in q and ("delayed" in q or "delay" in q or "blocked" in q):
            target_id = expedition_id or ("EXP-2026-C" if "c" in q else "EXP-2026-A")
            target = self.expeditions.get(target_id, self.expeditions.get("EXP-2026-C"))
            return {
                "query": query,
                "answer": f"**{target['id']} ({target['name']})** is currently **{target['status_display']}** with an expected delay of **+{target['delay_hours']} hours**.\n\n**Root Cause:**\n{target.get('delay_reason', 'N/A')}\n\n**Current Condition:**\n- Weather: {target.get('weather', {}).get('condition', 'N/A')}, Wind: {target.get('weather', {}).get('wind_speed_kt', 'N/A')} kt\n- Sea Ice: {target.get('sea_ice', {}).get('ice_class', 'N/A')} ({target.get('sea_ice', {}).get('concentration_pct', 'N/A')}% concentration)\n- Plan in effect: {target.get('contingencies', [{}])[1].get('title', 'Plan B - Severe Weather Standby') if len(target.get('contingencies', [])) > 1 else 'Plan A'}",
                "confidence": 0.94,
                "model": "PolarOne_Copilot_Expeditions_v2",
                "data_freshness": "Observation timestamped 12 min ago",
                "suggested_actions": ["Review Contingency Plan B", "Check Weather Radar Forecast"]
            }

        # Personnel deployed
        if "personnel" in q or "people" in q or "deployed" in q:
            total_dep = sum(e["personnel"]["deployed"] for e in self.expeditions.values())
            total_ass = sum(e["personnel"]["assigned"] for e in self.expeditions.values())
            return {
                "query": query,
                "answer": f"Across all registered polar expeditions, there are currently **{total_dep} personnel actively deployed** in the field out of **{total_ass} total assigned personnel**.\n\nBreakdown by mission:\n" + "\n".join([f"- **{e['id']}** ({e['name']}): {e['personnel']['deployed']} deployed on {e.get('vessel_name', 'field units')}" for e in self.expeditions.values()]),
                "confidence": 0.99,
                "model": "PolarOne_Copilot_Expeditions_v2",
                "data_freshness": "Synced live",
                "suggested_actions": ["View Personnel Roster Tab", "Open Workload Distribution"]
            }

        # Resource running low / fuel
        if "resource" in q or "fuel" in q or "low" in q:
            exp_c = self.expeditions.get("EXP-2026-C", {})
            rem = exp_c.get("logistics", {}).get("fuel_projected_remaining_pct", 18)
            return {
                "query": query,
                "answer": f"**CRITICAL ALERT on EXP-2026-C (Glacier Core Extraction)**:\nProjected generator fuel reserve is currently at **{rem}%** due to continuous emergency heating during the Category 4 blizzard.\n\nAll other expeditions report adequate reserves (EXP-2026-A: 26% post-discharge, EXP-2026-B: 45%, EXP-2026-D: 39%, EXP-2026-E: 32%).",
                "confidence": 0.95,
                "model": "PolarOne_Copilot_Expeditions_v2",
                "data_freshness": "Fuel sensors updated 18 min ago",
                "suggested_actions": ["Authorize Fuel Conservation Protocol B-4", "Inspect Logistics Panel"]
            }

        # What if 12h / 24h delay
        if "what if" in q or "delayed by" in q:
            sim = self.simulate_scenario(expedition_id or "EXP-2026-A", "VESSEL_DELAY", {"delay_hours": 12})
            return {
                "query": query,
                "answer": f"**Scenario Simulation Output (Vessel +12h Delay):**\n\n- **Impact on ETA**: {sim['simulated_eta']}\n- **Fuel Impact**: {sim['resource_impact']}\n- **Risk Change**: {sim['risk_score_delta']}\n- **Affected Operations**: {', '.join(sim['affected_tasks'])}\n\n**Advisory**: {sim['recommendation']}\n\n*(Note: PolarOne does not automatically alter navigation plans. Commander sign-off is required.)*",
                "confidence": 0.88,
                "model": "XGB_POLAR_SIM_v2",
                "data_freshness": "Simulated on current environment models",
                "suggested_actions": ["Open Scenario Modal", "Export Simulation Report"]
            }

        # Default fallback query grounded in current mission count
        return {
            "query": query,
            "answer": f"PolarOne Expedition Management currently coordinates **{len(self.expeditions)} missions** across Antarctica for Season 2026-2027.\n\n- **Active**: {sum(1 for e in self.expeditions.values() if e['status'] in ['IN TRANSIT', 'OPERATIONAL'])}\n- **Blocked**: {sum(1 for e in self.expeditions.values() if 'BLOCKED' in e['status'])}\n- **Planning**: {sum(1 for e in self.expeditions.values() if e['status'] in ['DRAFT', 'PLANNING', 'READY FOR APPROVAL'])}\n\nYou can ask about specific missions (e.g. *'Why is EXP-2026-C delayed?'*), query risk factors, simulate what-if scenarios, or check personnel and fuel levels.",
            "confidence": 0.92,
            "model": "PolarOne_Copilot_Expeditions_v2",
            "data_freshness": f"Evaluated at {now_str}",
            "suggested_actions": ["Ask: 'Why is Expedition C delayed?'", "Ask: 'Which resources are low?'"]
        }

    def log_audit(self, expedition_id: str, actor: str, actor_role: str, action: str, old_value: Optional[str], new_value: Optional[str], reason: Optional[str]):
        entry = {
            "audit_id": f"AUD-{uuid.uuid4().hex[:8].upper()}",
            "expedition_id": expedition_id,
            "timestamp": utc_now().isoformat(),
            "actor": actor,
            "actor_role": actor_role,
            "action": action,
            "old_value": old_value,
            "new_value": new_value,
            "reason": reason
        }
        self.audit_logs.insert(0, entry)

    def get_audit_logs(self, expedition_id: Optional[str] = None) -> List[Dict[str, Any]]:
        if expedition_id:
            return [log for log in self.audit_logs if log.get("expedition_id") == expedition_id]
        return self.audit_logs

# Singleton accessor
expedition_service = ExpeditionService()
