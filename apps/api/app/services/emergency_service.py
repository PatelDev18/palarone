"""
POLARONE Emergency Response Service.
Operational Antarctic Maritime Emergency Intelligence and Command System.
Strictly complies with the Safety Rule:
- AI may detect, classify, analyze, recommend, simulate, draft, prioritize, and calculate.
- AI must NOT autonomously execute life-critical actions (no autonomous vessel diversion, helicopter dispatch, or SOS execution).
- Every critical action requires Human-in-the-Loop review and Commander approval with an immutable audit log.
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
    total_seconds = max(0, int(diff.total_seconds()))
    if total_seconds < 60:
        return f"{total_seconds}s ago"
    elif total_seconds < 3600:
        return f"{total_seconds // 60}m ago"
    elif total_seconds < 86400:
        return f"{total_seconds // 3600}h ago"
    else:
        return f"{total_seconds // 86400}d ago"

class EmergencyService:
    def __init__(self):
        self._init_protocols()
        self._init_response_assets()
        self._init_incidents()
        self._init_audit_log()

    def _init_protocols(self):
        """10 Maritime Emergency Protocols with checklists."""
        self.protocols = [
            {
                "id": "PROT_ICE_01",
                "name": "Sea Ice Blockage & Ridge Entrapment",
                "code": "SEA_ICE_BLOCKAGE",
                "severity": "CRITICAL",
                "required_approval": "Commander / Maritime Operations Lead",
                "escalation_path": "Duty Officer -> Ice Pilot -> Operations Commander -> Fleet HQ",
                "description": "Protocol for vessels immobilized or obstructed by heavy pack ice, pressure ridges, or multi-year floes.",
                "checklist": [
                    {"step": 1, "title": "Assess Satellite Ice Conditions", "action": "Query latest Sentinel-1 SAR and AMSR2 passive microwave observations.", "completed": True},
                    {"step": 2, "title": "Confirm Vessel Position & Engine State", "action": "Verify AIS lat/lon, heading, propulsion RPM, and hull vibration sensors.", "completed": True},
                    {"step": 3, "title": "Calculate Alternative Route Options", "action": "Run XGBoost Route Risk & OR-Tools Fairway Optimizer through open leads.", "completed": True},
                    {"step": 4, "title": "Assess Fuel Impact & Hull Stress", "action": "Simulate fuel delta and structural strain across alternate waypoints.", "completed": True},
                    {"step": 5, "title": "Identify Nearest Response Assets", "action": "Identify icebreakers and rotary-wing aircraft within 200nm.", "completed": True},
                    {"step": 6, "title": "Submit for Commander Approval", "action": "Present diversion package with AI confidence and risk reduction metrics.", "completed": False},
                    {"step": 7, "title": "Transmit Approved Waypoint Instruction", "action": "Send cryptographic waypoint order to vessel bridge via Iridium/Inmarsat.", "completed": False},
                    {"step": 8, "title": "Continuously Monitor Vessel Progress", "action": "Track telemetry every 5 minutes until vessel clears compressive pack.", "completed": False}
                ]
            },
            {
                "id": "PROT_BRK_02",
                "name": "Vessel Propulsion or Rudder Breakdown",
                "code": "VESSEL_BREAKDOWN",
                "severity": "CRITICAL",
                "required_approval": "Commander / Fleet Chief Engineer",
                "escalation_path": "Chief Engineer -> Master -> Operations Commander -> Maritime Rescue Center",
                "description": "Loss of main propulsion, steering failure, or electrical blackout in ice-covered waters.",
                "checklist": [
                    {"step": 1, "title": "Establish Emergency Drift Vector", "action": "Calculate ice and wind drift trajectory towards shoals or icebergs.", "completed": True},
                    {"step": 2, "title": "Activate Secondary Auxiliary Power", "action": "Confirm emergency generators are supplying navigation and life support.", "completed": True},
                    {"step": 3, "title": "Assess Repair Feasibility", "action": "Receive onboard damage control report and spare parts availability.", "completed": False},
                    {"step": 4, "title": "Dispatch Heavy Icebreaker Tug", "action": "Require human approval to mobilize nearest tow-capable vessel.", "completed": False},
                    {"step": 5, "title": "Prepare Evacuation Contingency", "action": "Alert station medical team and rotary wing search & rescue.", "completed": False}
                ]
            },
            {
                "id": "PROT_MED_03",
                "name": "Critical Medical Evacuation (MEDEVAC)",
                "code": "MEDICAL_EMERGENCY",
                "severity": "CRITICAL",
                "required_approval": "Chief Medical Officer + Operations Commander",
                "escalation_path": "Station Doctor -> Chief Medical Officer -> Operations Commander",
                "description": "Life-threatening trauma, hypothermia, acute surgical illness, or toxic exposure.",
                "checklist": [
                    {"step": 1, "title": "Telemetry Triage & Patient Tele-consult", "action": "Connect satellite telemedicine link with Antarctic medical director.", "completed": True},
                    {"step": 2, "title": "Evaluate Weather Window for Flight", "action": "Check ceiling, katabatic gust risk, and icing levels along flight path.", "completed": True},
                    {"step": 3, "title": "Authorize Long-Range Helicopter Sortie", "action": "Commander approval for SAR Helicopter BK-117 dispatch.", "completed": False},
                    {"step": 4, "title": "Coordinate Receiving Facility", "action": "Alert Davis Station surgical unit or Cape Town hospital link.", "completed": False}
                ]
            },
            {
                "id": "PROT_DIST_04",
                "name": "Personnel Distress & Overdue Expedition",
                "code": "PERSONNEL_DISTRESS",
                "severity": "HIGH",
                "required_approval": "Field Operations Leader + Commander",
                "escalation_path": "Field Leader -> Station Commander -> Response Center",
                "description": "Field traverse team lost contact, beacon activation, or snowcat crevasse fall.",
                "checklist": [
                    {"step": 1, "title": "Triangulate PLB / InReach Satellite Signal", "action": "Plot emergency beacon lat/lon on Antarctic DEM map.", "completed": True},
                    {"step": 2, "title": "Review Crevasse Radar Map", "action": "Inspect high-resolution SAR and optical crevasse zone boundaries.", "completed": False},
                    {"step": 3, "title": "Mobilize Ground Rescue Hägglunds", "action": "Dispatch tracked snow vehicles with search radar and ropes.", "completed": False}
                ]
            },
            {
                "id": "PROT_WX_05",
                "name": "Severe Katabatic Storm & Whiteout",
                "code": "SEVERE_WEATHER",
                "severity": "HIGH",
                "required_approval": "Station Commander",
                "escalation_path": "Meteorologist -> Safety Officer -> Station Commander",
                "description": "Katabatic winds exceeding 50 knots, sub-zero windchill below -40C, or zero visibility.",
                "checklist": [
                    {"step": 1, "title": "Declare Station Tie-Down Condition Charlie", "action": "Lock external doors, secure radomes, and rig guide lines.", "completed": True},
                    {"step": 2, "title": "Suspend All Outdoor Movements", "action": "Account for all personnel on station roster.", "completed": True},
                    {"step": 3, "title": "Monitor Wind Shear & Generator Air Intakes", "action": "Verify snow ingestion filters on main diesel generators.", "completed": False}
                ]
            },
            {
                "id": "PROT_COMM_06",
                "name": "Complete Communication Blackout",
                "code": "COMMUNICATION_LOSS",
                "severity": "HIGH",
                "required_approval": "Operations Lead",
                "escalation_path": "Comms Engineer -> Duty Officer -> Operations Lead",
                "description": "Vessel or field camp uncontactable on Primary Iridium and secondary HF channels for > 60 minutes.",
                "checklist": [
                    {"step": 1, "title": "Attempt Multi-Band Polling", "action": "Cycle Iridium, Inmarsat-C, VHF Marine 16, and High-Frequency 4125 kHz.", "completed": True},
                    {"step": 2, "title": "Request High-Priority Satellite Pass", "action": "Task commercial optical/SAR satellite to image last known coordinate.", "completed": True},
                    {"step": 3, "title": "Alert Nearest Vessel for Radio Relay", "action": "Request nearby ship attempt direct line-of-sight VHF query.", "completed": False}
                ]
            },
            {
                "id": "PROT_FIRE_07",
                "name": "Station or Vessel Fire Hazard",
                "code": "FIRE",
                "severity": "CRITICAL",
                "required_approval": "Commander / Master",
                "escalation_path": "Fire Team Leader -> Master / Station Leader -> Operations Commander",
                "description": "Thermal anomaly or confirmed fire in fuel storage, engine room, or living modules.",
                "checklist": [
                    {"step": 1, "title": "Isolate Electrical & Fuel Supply", "action": "Emergency remote trip of fuel valves and ventilation dampers.", "completed": True},
                    {"step": 2, "title": "Deploy Fixed CO2 / Hi-Fog Fire Suppression", "action": "Discharge suppression system in sealed compartment.", "completed": True},
                    {"step": 3, "title": "Prepare Emergency Shelter / Lifeboats", "action": "Muster all personnel at secondary independent survival refuge.", "completed": False}
                ]
            },
            {
                "id": "PROT_PWR_08",
                "name": "Station Power Failure & Microgrid Blackout",
                "code": "STATION_POWER_FAILURE",
                "severity": "CRITICAL",
                "required_approval": "Station Engineer + Commander",
                "escalation_path": "Station Electrician -> Facilities Lead -> Station Commander",
                "description": "Total loss of primary diesel generator array in sub-zero ambient environment.",
                "checklist": [
                    {"step": 1, "title": "Automatic Black-Start Emergency Generator", "action": "Verify emergency 150kW generator picked up critical life-support bus.", "completed": True},
                    {"step": 2, "title": "Shed Non-Essential Heating & Scientific Loads", "action": "Prioritize habitat core, communications, and water melt tank.", "completed": True},
                    {"step": 3, "title": "Inspect Fuel Gelation & Injector Line", "action": "Warm fuel filter lines with electric trace heating.", "completed": False}
                ]
            },
            {
                "id": "PROT_CARGO_09",
                "name": "Critical Cargo Loss or Contamination",
                "code": "CARGO_EMERGENCY",
                "severity": "MEDIUM",
                "required_approval": "Logistics Lead",
                "escalation_path": "Cargo Officer -> Logistics Director -> Commander",
                "description": "Damage or loss of wintering food supplies, Arctic diesel fuel, or critical scientific hardware.",
                "checklist": [
                    {"step": 1, "title": "Survey Remaining Stock in Digital Twin", "action": "Calculate days of runway remaining at affected research station.", "completed": True},
                    {"step": 2, "title": "Query Resupply Surplus at Partner Stations", "action": "Assess emergency fuel transfer possibilities from nearby bases.", "completed": False}
                ]
            },
            {
                "id": "PROT_SAR_10",
                "name": "Maritime Search & Rescue (SAR)",
                "code": "SEARCH_AND_RESCUE",
                "severity": "CRITICAL",
                "required_approval": "Antarctic Rescue Coordination Center (ARCC) Commander",
                "escalation_path": "ARCC Duty Controller -> Joint SAR Commander -> International Partners",
                "description": "Coordination of multi-national assets for aircraft ditching, vessel sinking, or person overboard.",
                "checklist": [
                    {"step": 1, "title": "Define Datum Point & Search Patterns", "action": "Compute expanding square / creeping line search area using drift vectors.", "completed": True},
                    {"step": 2, "title": "Task Fixed-Wing & Helicopter Assets", "action": "Authorize search sorties with onboard infrared cameras.", "completed": False},
                    {"step": 3, "title": "Notify COSPAS-SARSAT & Maritime HQ", "action": "Broadcast NAVAREA warning to all shipping in Southern Ocean sector.", "completed": False}
                ]
            }
        ]

    def _init_response_assets(self):
        """Pre-configured Antarctic Response Assets."""
        self.response_assets = [
            {
                "id": "ASSET_OG_01",
                "name": "Ocean Guardian",
                "asset_type": "Heavy Polar Icebreaker (PC-1)",
                "location_name": "Prydz Bay Approaches (66.4°S, 74.2°E)",
                "lat": -66.40,
                "lon": 74.20,
                "distance_km": 128.0,
                "eta_hours": 5.3,
                "status": "AVAILABLE",
                "suitability_pct": 91,
                "capabilities": ["Continuous 2m Ice Breaking", "Vessel Towing (180t BP)", "Medical Bay", "Helo Deck"],
                "fuel_pct": 88.0,
                "comm_status": "CONNECTED",
                "current_mission": "Prydz Bay Fairway Escort",
                "personnel_capacity": 45,
                "callsign": "VNLK",
                "imo": "9812450"
            },
            {
                "id": "ASSET_AE_02",
                "name": "Aurora Explorer",
                "asset_type": "Medium Research Icebreaker (PC-3)",
                "location_name": "Mawson Coast (67.1°S, 62.8°E)",
                "lat": -67.10,
                "lon": 62.80,
                "distance_km": 284.0,
                "eta_hours": 11.2,
                "status": "AVAILABLE",
                "suitability_pct": 76,
                "capabilities": ["1.2m Ice Navigation", "Oceanographic Crane", "Emergency Bunkering"],
                "fuel_pct": 72.0,
                "comm_status": "CONNECTED",
                "current_mission": "Southern Ocean Transect",
                "personnel_capacity": 30,
                "callsign": "ZGDF",
                "imo": "9456721"
            },
            {
                "id": "ASSET_SC_03",
                "name": "Southern Cross",
                "asset_type": "Polar Cargo & Supply Vessel (PC-4)",
                "location_name": "Princess Astrid Coast (69.8°S, 12.4°E)",
                "lat": -69.80,
                "lon": 12.40,
                "distance_km": 490.0,
                "eta_hours": 20.5,
                "status": "STANDBY",
                "suitability_pct": 68,
                "capabilities": ["Heavy Container Crane", "Containerized Medical Pod", "Fuel Transfer"],
                "fuel_pct": 81.0,
                "comm_status": "CONNECTED",
                "current_mission": "Maitri Station Supply",
                "personnel_capacity": 24,
                "callsign": "HP89",
                "imo": "9345091"
            },
            {
                "id": "ASSET_HELO_04",
                "name": "SAR Helicopter Falcon-1 (BK-117)",
                "asset_type": "Antarctic Rescue Helicopter",
                "location_name": "Davis Station Helipad",
                "lat": -68.57,
                "lon": 77.96,
                "distance_km": 82.0,
                "eta_hours": 0.45,
                "status": "STANDBY",
                "suitability_pct": 89,
                "capabilities": ["Night Vision / FLIR", "Rescue Winch", "Emergency Hypothermia Pod", "2x Stretcher"],
                "fuel_pct": 95.0,
                "comm_status": "CONNECTED",
                "current_mission": "Station SAR Standby",
                "personnel_capacity": 6,
                "callsign": "VH-SAR1",
                "imo": "N/A"
            },
            {
                "id": "ASSET_DAVIS_05",
                "name": "Davis Station Emergency Base",
                "asset_type": "Permanent Antarctic Station",
                "location_name": "Vestfold Hills, Princess Elizabeth Land",
                "lat": -68.57,
                "lon": 77.96,
                "distance_km": 82.0,
                "eta_hours": 0.0,
                "status": "AVAILABLE",
                "suitability_pct": 85,
                "capabilities": ["Surgical Hospital Unit", "Emergency Quarters (40 berths)", "Bulk Fuel Depot", "Satellite Relay"],
                "fuel_pct": 94.0,
                "comm_status": "CONNECTED",
                "current_mission": "Year-Round Operation",
                "personnel_capacity": 60,
                "callsign": "VJSD",
                "imo": "N/A"
            },
            {
                "id": "ASSET_BHARATI_06",
                "name": "Bharati Base Rescue Team",
                "asset_type": "Field Search & Rescue Unit",
                "location_name": "Larsemann Hills (69.4°S, 76.19°E)",
                "lat": -69.40,
                "lon": 76.19,
                "distance_km": 175.0,
                "eta_hours": 4.8,
                "status": "AVAILABLE",
                "suitability_pct": 82,
                "capabilities": ["Tracked Snowcat Team", "Crevasse Extrication", "High-Latitude VHF Relay"],
                "fuel_pct": 89.0,
                "comm_status": "CONNECTED",
                "current_mission": "Larsemann Survey",
                "personnel_capacity": 12,
                "callsign": "ATBR",
                "imo": "N/A"
            },
            {
                "id": "ASSET_P3_07",
                "name": "Polar Sky Patrol (Basler BT-67)",
                "asset_type": "Ski-Equipped Turboprop Aircraft",
                "location_name": "Wilkins Aerodrome Runway",
                "lat": -66.69,
                "lon": 111.52,
                "distance_km": 610.0,
                "eta_hours": 2.2,
                "status": "AVAILABLE",
                "suitability_pct": 74,
                "capabilities": ["Long Range Maritime Patrol", "Air-Drop Survival Kits", "Airdrop Life Rafts"],
                "fuel_pct": 90.0,
                "comm_status": "CONNECTED",
                "current_mission": "Aviation Logistics Standby",
                "personnel_capacity": 18,
                "callsign": "BT-67",
                "imo": "N/A"
            }
        ]

    def _init_incidents(self):
        """Realistic Antarctic incidents."""
        t_now = utc_now()
        
        self.incidents = [
            {
                "id": "INC-001",
                "title": "Dense Sea Ice Blocking Polar Star",
                "incident_type": "Sea Ice Obstruction",
                "severity": "CRITICAL",
                "status": "AWAITING_APPROVAL",
                "risk_score": 87,
                "ai_confidence": 91,
                "response_lead": "Cmdr. Hayes",
                "description": "Unexpected heavy pack convergence (78.4% concentration) and 2.1m compressive ridge keels obstructing primary fairway 18nm northwest of Davis Station. Vessel speed reduced to 6.2 kt with main propulsion load at 92%.",
                "location_name": "Davis Station Route (Sector 4)",
                "coordinates": {"lat": -67.84, "lon": 76.92},
                "is_simulation": False,
                "detected_at": (t_now - timedelta(hours=3, minutes=15)).isoformat(),
                "updated_at": (t_now - timedelta(minutes=4)).isoformat(),
                "resolved_at": None,
                "closed_at": None,
                "primary_cause": "Dense convergent sea ice driven by 32kt southerly katabatic gale front",
                "secondary_risks": [
                    "Increased fuel consumption (+18% daily burn)",
                    "Severe ETA delay (+26 hours)",
                    "Engine thermal and mechanical stress",
                    "Davis Station food & medical supply depletion"
                ],
                "potential_impact": "Direct delay to Davis Station 2026-27 season changeover; food supplies reduced to 12 days safety margin.",
                "affected_assets": [
                    {
                        "id": "VESSEL_POLAR_STAR",
                        "name": "Polar Star",
                        "asset_type": "Heavy Polar Icebreaker (PC-1)",
                        "imo_or_id": "9123456",
                        "current_lat": -67.84,
                        "current_lon": 76.92,
                        "speed_knots": 6.2,
                        "heading_deg": 142.0,
                        "destination": "Davis Station",
                        "original_eta": "01 Oct 2026 10:33 UTC",
                        "predicted_eta": "02 Oct 2026 12:33 UTC",
                        "expected_delay_hours": 26.0,
                        "status": "RESTRICTED_MANEUVER",
                        "fuel_remaining_pct": 68.4,
                        "personnel_count": 34
                    }
                ],
                "data_sources": [
                    {"source": "AIS Stream", "updated_at": "2 min ago", "freshness": "FRESH", "confidence": 98},
                    {"source": "Sentinel-1A SAR", "updated_at": "38 min ago", "freshness": "FRESH", "confidence": 96},
                    {"source": "ECMWF Marine Weather", "updated_at": "12 min ago", "freshness": "FRESH", "confidence": 92},
                    {"source": "IoT Engine Telemetry", "updated_at": "3 hours ago", "freshness": "STALE", "confidence": 74}
                ],
                "weather_sea_ice": {
                    "temperature_c": -16.2,
                    "wind_speed_knots": 32.0,
                    "wind_direction": "SSW (195°)",
                    "visibility_km": 8.0,
                    "sea_ice_concentration_pct": 78.4,
                    "sea_ice_thickness_m": 2.1,
                    "iceberg_proximity_nm": 4.2,
                    "wave_height_m": 3.8,
                    "storm_probability_pct": 65,
                    "risk_level": "HIGH",
                    "data_freshness": "FRESH",
                    "last_updated": (t_now - timedelta(minutes=12)).isoformat()
                },
                "satellite_evidence": {
                    "satellite": "Sentinel-1A SAR (C-band)",
                    "product_type": "GRD (Ground Range Detected) Dual-Pol (HH+HV)",
                    "acquisition_time": "2026-09-27T13:46:00Z",
                    "display_time": "Latest Available Observation (38 min ago)",
                    "resolution": "10 m",
                    "cloud_coverage_pct": 0.0,
                    "processing_status": "COMPLETED",
                    "finding": "High radar backscatter indicates thick first-year consolidated pack with compressive ridging exceeding 2.1m. Open leads detected 14nm northeast in Sector 4.",
                    "feature_detected": "Dense Sea Ice Pack & Compressive Ridge Keels",
                    "preview_url": "/api/static/imagery/s1a_davis_sar_preview.png"
                },
                "ai_risk_assessment": {
                    "risk_score": 87,
                    "confidence_pct": 91,
                    "model_name": "XGB_ROUTE_RISK_01",
                    "model_version": "1.3.0",
                    "prediction_summary": "Route obstruction likely to persist with high probability (>88%) over the next 36 hours due to sustained southerly wind stress.",
                    "factor_drivers": [
                        {"factor": "Sea Ice Concentration (78.4%)", "impact_pct": 42},
                        {"factor": "Wind Speed (32 kt SSW)", "impact_pct": 24},
                        {"factor": "Vessel Speed Drop (-31%)", "impact_pct": 18},
                        {"factor": "Reduced Visibility (8 km)", "impact_pct": 9},
                        {"factor": "Historical Route Risk Pattern", "impact_pct": 7}
                    ],
                    "why_flagged_narrative": "Dense sea ice (78.4% concentration) was confirmed by C-band SAR satellite observations. Polar Star's forward transit speed dropped by 31% from 9.0 to 6.2 knots while engine load surged to 92%. ECMWF model forecasts headwinds sustaining at 32-45 knots, accelerating ice convergence. The predicted route arrival delay (+26 hours) exceeds the 18-hour mission tolerance threshold."
                },
                "ai_recommendation": {
                    "title": "Evaluate Alternate Route B via Waypoint Beta",
                    "recommended_action": "Divert Polar Star 14nm northeast to exploit the natural open lead corridor identified in Sentinel-1A SAR Sector 4.",
                    "eta_improvement_hours": 11.0,
                    "risk_reduction_pct": 24.0,
                    "fuel_impact_pct": 4.0,
                    "confidence_pct": 84,
                    "model_name": "XGB_ROUTE_RISK_01 + OR_TOOLS_VRP",
                    "status": "AWAITING_HUMAN_APPROVAL",
                    "created_at": (t_now - timedelta(minutes=45)).isoformat(),
                    "route_comparison": {
                        "original_route": [
                            {"name": "WP-1 Open Sea", "lat": -66.50, "lon": 74.00},
                            {"name": "WP-2 Outer Fairway", "lat": -67.20, "lon": 75.50},
                            {"name": "WP-3 Blocked Lead (Sector 4)", "lat": -67.84, "lon": 76.92},
                            {"name": "WP-4 Davis Anchorage", "lat": -68.57, "lon": 77.96}
                        ],
                        "current_route": [
                            {"name": "Current Position", "lat": -67.84, "lon": 76.92},
                            {"name": "Dead Slow Ahead", "lat": -68.05, "lon": 77.20},
                            {"name": "Davis Anchorage", "lat": -68.57, "lon": 77.96}
                        ],
                        "recommended_route": [
                            {"name": "Current Position", "lat": -67.84, "lon": 76.92},
                            {"name": "Waypoint B (Open Lead 14nm NE)", "lat": -67.65, "lon": 77.40},
                            {"name": "Waypoint C (Flaw Lead)", "lat": -68.10, "lon": 77.80},
                            {"name": "Davis Anchorage", "lat": -68.57, "lon": 77.96}
                        ],
                        "blocked_area": {
                            "lat": -67.84,
                            "lon": 76.92,
                            "radius_nm": 16.0,
                            "description": "Consolidated 2.1m compressive ridge pack"
                        },
                        "high_risk_area": {
                            "lat": -68.00,
                            "lon": 76.80,
                            "radius_nm": 28.0,
                            "description": "Katabatic convergence zone"
                        }
                    }
                },
                "pending_approvals": [
                    {
                        "id": "APPR-001",
                        "action_type": "VESSEL_DIVERSION",
                        "title": "Divert Polar Star to Alternate Route B",
                        "reason": "Primary fairway obstructed by dense sea ice (78.4%) with 2.1m compressive ridges. Alternate Route B navigates open lead, saving 11 hours and cutting route risk by 24%.",
                        "ai_confidence": 84,
                        "expected_impact": {
                            "delay_reduction_hours": 11.0,
                            "risk_reduction_pct": 24.0,
                            "fuel_delta_pct": 4.0
                        },
                        "requested_by": "AI Risk Engine (XGB_ROUTE_RISK_01)",
                        "status": "PENDING",
                        "requires_role": "Commander / Master",
                        "reviewer_name": None,
                        "reviewer_role": None,
                        "reviewer_notes": None,
                        "decision_timestamp": None,
                        "created_at": (t_now - timedelta(minutes=45)).isoformat()
                    }
                ],
                "cascading_impact": {
                    "primary_asset": "Polar Star",
                    "downstream_impacts": [
                        {"node": "Polar Star (Vessel)", "status": "OBSTRUCTED", "type": "Vessel", "impact": "Speed dropped to 6.2kt; +26h delay."},
                        {"node": "Davis Station Resupply", "status": "CRITICAL", "type": "Operation", "impact": "Fuel & food transfer window shortened."},
                        {"node": "Food & Medical Cargo", "status": "MEDIUM_RISK", "type": "Cargo", "impact": "Refrigeration intact, inventory runway constrained."},
                        {"node": "Station Food Inventory", "status": "HIGH_RISK", "type": "Station", "impact": "12 days safety buffer remaining at Davis."},
                        {"node": "Personnel Operations", "status": "WARNING", "type": "Crew", "impact": "Wintering team rotation delayed."},
                        {"node": "2026-27 Mission Schedule", "status": "ADVISORY", "type": "Mission", "impact": "Subsequent McMurdo transit may require rescheduling."}
                    ],
                    "graph_nodes": [
                        {"id": "incident", "label": "Dense Sea Ice (INC-001)", "type": "incident", "severity": "CRITICAL"},
                        {"id": "vessel", "label": "Polar Star (WAGB-10)", "type": "vessel", "severity": "HIGH"},
                        {"id": "cargo", "label": "42t Fresh Food & Medical", "type": "cargo", "severity": "MEDIUM"},
                        {"id": "station", "label": "Davis Station (42 Crew)", "type": "station", "severity": "HIGH"},
                        {"id": "mission", "label": "Expedition 2026-B Schedule", "type": "mission", "severity": "MEDIUM"}
                    ],
                    "graph_edges": [
                        {"source": "incident", "target": "vessel", "label": "Physical Obstruction"},
                        {"source": "vessel", "target": "cargo", "label": "Carries Payload"},
                        {"source": "cargo", "target": "station", "label": "Critical Provisioning"},
                        {"source": "station", "target": "mission", "label": "Enables Science Ops"}
                    ]
                },
                "communications": [
                    {
                        "id": "COMM-001",
                        "timestamp": (t_now - timedelta(hours=3, minutes=10)).isoformat(),
                        "sender": "Polar Star (Bridge)",
                        "sender_role": "Master",
                        "channel": "Iridium Polar SAT-3",
                        "signal_quality": "DEGRADED",
                        "message": "Encountered unexpected thick multi-year ridge pack near 67.8°S. Decreasing speed to 6 knots to prevent bow pressure damage.",
                        "acknowledged": True
                    },
                    {
                        "id": "COMM-002",
                        "timestamp": (t_now - timedelta(hours=2, minutes=50)).isoformat(),
                        "sender": "POLARONE AI Assistant",
                        "sender_role": "Autonomous Monitor",
                        "channel": "Internal Bus",
                        "signal_quality": "STRONG",
                        "message": "Satellite Sentinel-1A SAR pass processed. Detected 78.4% ice concentration ahead. Flagged Route Risk 87/100.",
                        "acknowledged": True
                    },
                    {
                        "id": "COMM-003",
                        "timestamp": (t_now - timedelta(hours=2, minutes=15)).isoformat(),
                        "sender": "Cmdr. Hayes",
                        "sender_role": "Commander",
                        "channel": "Encrypted VoIP / SAT",
                        "signal_quality": "GOOD",
                        "message": "Polar Star Bridge, this is Command. We see the SAR ridge map. Standby for alternate waypoint calculation.",
                        "acknowledged": True
                    },
                    {
                        "id": "COMM-004",
                        "timestamp": (t_now - timedelta(minutes=45)).isoformat(),
                        "sender": "POLARONE AI Assistant",
                        "sender_role": "Autonomous Monitor",
                        "channel": "Internal Bus",
                        "signal_quality": "STRONG",
                        "message": "Alternative Route B generated through open lead (+11h ETA improvement, -24% risk). Awaiting Commander human signoff.",
                        "acknowledged": True
                    }
                ],
                "timeline": [
                    {"time": (t_now - timedelta(hours=3, minutes=20)).isoformat(), "source": "Satellite", "actor": "Sentinel-1A SAR", "action": "Observation acquired: High radar backscatter detected in Sector 4", "status": "CONFIRMED"},
                    {"time": (t_now - timedelta(hours=3, minutes=15)).isoformat(), "source": "AIS", "actor": "AIS Stream Engine", "action": "Vessel speed dropped from 9.0kt to 6.2kt (-31%)", "status": "ALERTED"},
                    {"time": (t_now - timedelta(hours=3, minutes=10)).isoformat(), "source": "Human", "actor": "Polar Star Bridge", "action": "Bridge report received: Encountered heavy compressive ridge pack", "status": "LOGGED"},
                    {"time": (t_now - timedelta(hours=3, minutes=0)).isoformat(), "source": "ML Model", "actor": "XGB_ROUTE_RISK_01", "action": "Route risk score spiked to 87/100. Predicted delay: +26 hours", "status": "EVALUATED"},
                    {"time": (t_now - timedelta(hours=2, minutes=30)).isoformat(), "source": "Commander", "actor": "Cmdr. Hayes", "action": "Incident INC-001 declared (Severity: CRITICAL)", "status": "DECLARED"},
                    {"time": (t_now - timedelta(hours=1, minutes=45)).isoformat(), "source": "ML Model", "actor": "OR-Tools Route Optimizer", "action": "Alternate Route B generated via Waypoint Beta", "status": "DRAFTED"},
                    {"time": (t_now - timedelta(minutes=45)).isoformat(), "source": "System", "actor": "HITL Approval Engine", "action": "Action Request APPR-001 queued for Commander human review", "status": "PENDING_APPROVAL"}
                ]
            },
            {
                "id": "INC-002",
                "title": "Severe Katabatic Blizzard - Bharati Environs",
                "incident_type": "Severe Weather",
                "severity": "HIGH",
                "status": "RESPONSE_ACTIVE",
                "risk_score": 78,
                "ai_confidence": 94,
                "response_lead": "Lt. Dr. R. Vance",
                "description": "48-knot sustained katabatic headwind with gusts exceeding 62 knots originating from continental ice slope. Ground visibility reduced below 1.2km; blizzard conditions affecting Bharati traverse operations.",
                "location_name": "Larsemann Hills & Coastal Maritime Corridor",
                "coordinates": {"lat": -69.40, "lon": 76.19},
                "is_simulation": False,
                "detected_at": (t_now - timedelta(hours=5)).isoformat(),
                "updated_at": (t_now - timedelta(minutes=18)).isoformat(),
                "resolved_at": None,
                "closed_at": None,
                "primary_cause": "Intense thermal gradient driving continental katabatic gravity winds",
                "secondary_risks": [
                    "Helicopter flight suspension",
                    "Rapid coastal sea ice drift acceleration",
                    "Outdoor field party hypothermia risk"
                ],
                "potential_impact": "Station exterior ops locked down; rotary-wing flight sorties suspended for next 14 hours.",
                "affected_assets": [
                    {
                        "id": "STATION_BHARATI",
                        "name": "Bharati Station",
                        "asset_type": "Research Base",
                        "imo_or_id": "STN-IN-02",
                        "current_lat": -69.40,
                        "current_lon": 76.19,
                        "speed_knots": 0.0,
                        "heading_deg": 0.0,
                        "destination": "N/A",
                        "original_eta": "N/A",
                        "predicted_eta": "N/A",
                        "expected_delay_hours": 14.0,
                        "status": "STATION_LOCKDOWN",
                        "fuel_remaining_pct": 91.0,
                        "personnel_count": 30
                    }
                ],
                "data_sources": [
                    {"source": "ECMWF Weather Model", "updated_at": "14 min ago", "freshness": "FRESH", "confidence": 94},
                    {"source": "Terra / MODIS Polar Winds", "updated_at": "42 min ago", "freshness": "FRESH", "confidence": 91},
                    {"source": "Station AWS Anemometer", "updated_at": "1 min ago", "freshness": "FRESH", "confidence": 99}
                ],
                "weather_sea_ice": {
                    "temperature_c": -23.5,
                    "wind_speed_knots": 48.0,
                    "wind_direction": "SE (140°)",
                    "visibility_km": 1.2,
                    "sea_ice_concentration_pct": 65.0,
                    "sea_ice_thickness_m": 1.4,
                    "iceberg_proximity_nm": 8.0,
                    "wave_height_m": 4.5,
                    "storm_probability_pct": 95,
                    "risk_level": "CRITICAL",
                    "data_freshness": "FRESH",
                    "last_updated": (t_now - timedelta(minutes=14)).isoformat()
                },
                "satellite_evidence": {
                    "satellite": "Terra / MODIS Polar Mosaic",
                    "product_type": "MOD29 Surface Thermal & Ice Drift",
                    "acquisition_time": "2026-09-27T11:15:00Z",
                    "display_time": "Latest Available Observation (2.5 hrs ago)",
                    "resolution": "250 m",
                    "cloud_coverage_pct": 52.0,
                    "processing_status": "COMPLETED",
                    "finding": "Katabatic wind streak plumes extending 80km out into Prydz Bay with rapid drift vectors of 1.8 knots northwest.",
                    "feature_detected": "Severe Katabatic Blizzard Plume",
                    "preview_url": "/api/static/imagery/modis_circumpolar.png"
                },
                "ai_risk_assessment": {
                    "risk_score": 78,
                    "confidence_pct": 94,
                    "model_name": "LIGHTGBM_METEOROLOGICAL_GALE_02",
                    "model_version": "2.1.0",
                    "prediction_summary": "Blizzard winds will remain >40 knots until 28 Sep 04:00 UTC before ridge weakens.",
                    "factor_drivers": [
                        {"factor": "Wind Velocity (48 kt sustained)", "impact_pct": 51},
                        {"factor": "Air Temperature (-23.5°C)", "impact_pct": 22},
                        {"factor": "Severely Restricted Visibility (1.2 km)", "impact_pct": 18},
                        {"factor": "Barometric Pressure Drop (-9.2 hPa/3h)", "impact_pct": 9}
                    ],
                    "why_flagged_narrative": "Station anemometers and MODIS thermal bands confirmed rapid drop in barometric pressure accompanied by 48kt southeasterly wind gusts. Protocol PROT_WX_05 criteria reached."
                },
                "ai_recommendation": {
                    "title": "Maintain Condition Charlie & Ground Aviation",
                    "recommended_action": "Enforce station tie-down protocol; ground SAR helicopter sorties and keep snowcat traverses within visual camp radius.",
                    "eta_improvement_hours": 0.0,
                    "risk_reduction_pct": 35.0,
                    "fuel_impact_pct": 0.0,
                    "confidence_pct": 92,
                    "model_name": "RULES_ENGINE + LIGHTGBM",
                    "status": "APPROVED",
                    "created_at": (t_now - timedelta(hours=4)).isoformat(),
                    "route_comparison": None
                },
                "pending_approvals": [],
                "cascading_impact": {
                    "primary_asset": "Bharati Station",
                    "downstream_impacts": [
                        {"node": "Traverse Route 3", "status": "BLOCKED", "type": "Route", "impact": "Zero visibility across ice shelf."},
                        {"node": "Helicopter Sorties", "status": "GROUNDED", "type": "Asset", "impact": "Gust limits exceeded."},
                        {"node": "Scientific Sampling", "status": "SUSPENDED", "type": "Mission", "impact": "Lake sediment core sampling paused 24h."}
                    ],
                    "graph_nodes": [
                        {"id": "incident", "label": "Katabatic Gale (INC-002)", "type": "incident", "severity": "HIGH"},
                        {"id": "station", "label": "Bharati Station", "type": "station", "severity": "MEDIUM"},
                        {"id": "aircraft", "label": "Helicopter Sorties", "type": "asset", "severity": "HIGH"},
                        {"id": "field_ops", "label": "Field Science Operations", "type": "mission", "severity": "LOW"}
                    ],
                    "graph_edges": [
                        {"source": "incident", "target": "station", "label": "Direct Weather Impact"},
                        {"source": "station", "target": "aircraft", "label": "Grounds Aircraft"},
                        {"source": "aircraft", "target": "field_ops", "label": "Delays Sampling"}
                    ]
                },
                "communications": [
                    {
                        "id": "COMM-005",
                        "timestamp": (t_now - timedelta(hours=4, minutes=30)).isoformat(),
                        "sender": "Bharati Station Lead",
                        "sender_role": "Station Commander",
                        "channel": "HF Radio 4125 kHz",
                        "signal_quality": "GOOD",
                        "message": "Condition Charlie declared. All 30 personnel safely inside living module. Outside doors locked.",
                        "acknowledged": True
                    }
                ],
                "timeline": [
                    {"time": (t_now - timedelta(hours=5)).isoformat(), "source": "IoT", "actor": "Bharati AWS Anemometer", "action": "Wind speed exceeded 40kt threshold", "status": "ALERTED"},
                    {"time": (t_now - timedelta(hours=4, minutes=45)).isoformat(), "source": "Human", "actor": "Lt. Dr. R. Vance", "action": "Condition Charlie tie-down order issued", "status": "EXECUTED"}
                ]
            }
        ]

    def _init_audit_log(self):
        """Historical immutable audit log."""
        t_now = utc_now()
        self.audit_log = [
            {
                "id": "AUD-001",
                "incident_id": "INC-001",
                "timestamp": (t_now - timedelta(hours=2, minutes=30)).isoformat(),
                "user_name": "Cmdr. Hayes",
                "user_role": "Operations Commander",
                "action": "DECLARED_INCIDENT",
                "old_state": "ASSESSING",
                "new_state": "INCIDENT_DECLARED",
                "reason": "High-confidence SAR satellite imagery and vessel AIS speed drop indicate critical fairway obstruction.",
                "ai_recommendation_summary": "Risk Score 87/100, Predicted Delay +26h",
                "data_sources_consulted": ["Sentinel-1A SAR", "AIS Stream", "ECMWF Marine"],
                "is_simulation": False
            },
            {
                "id": "AUD-002",
                "incident_id": "INC-002",
                "timestamp": (t_now - timedelta(hours=4, minutes=40)).isoformat(),
                "user_name": "Lt. Dr. R. Vance",
                "user_role": "Safety Officer",
                "action": "APPROVED_PROTOCOL_ACTION",
                "old_state": "DETECTED",
                "new_state": "RESPONSE_ACTIVE",
                "reason": "Enforced Condition Charlie lockdown to protect station personnel during katabatic blizzard.",
                "ai_recommendation_summary": "Ground all rotary-wing sorties and secure habitat.",
                "data_sources_consulted": ["AWS Anemometer", "Terra / MODIS Polar Winds"],
                "is_simulation": False
            }
        ]

    # =========================================================================
    # CORE API QUERY & ACTION METHODS
    # =========================================================================

    def get_overview(self) -> Dict[str, Any]:
        """Provides the 8 KPI metrics for the Response Overview Bar."""
        active = [inc for inc in self.incidents if inc["status"] not in ["RESOLVED", "CLOSED"]]
        critical = [inc for inc in active if inc["severity"] == "CRITICAL"]
        
        pending_approvals = 0
        for inc in self.incidents:
            pending_approvals += len([a for a in inc.get("pending_approvals", []) if a.get("status") == "PENDING"])
            
        available_assets = len([a for a in self.response_assets if a.get("status") == "AVAILABLE"])
        
        return {
            "active_incidents": len(active),
            "critical_incidents": len(critical),
            "pending_approvals": pending_approvals,
            "response_assets_available": available_assets,
            "incidents_last_24h": 5,
            "average_response_time_minutes": 42,
            "satellite_alerts": 8,
            "ai_risk_alerts": 4,
            "system_status": "ONLINE",
            "timestamp": utc_now().isoformat()
        }

    def get_incidents(self, status: Optional[str] = None, severity: Optional[str] = None) -> List[Dict[str, Any]]:
        results = self.incidents
        if status:
            results = [inc for inc in results if inc["status"] == status]
        if severity:
            results = [inc for inc in results if inc["severity"] == severity]
        return results

    def get_incident_by_id(self, incident_id: str) -> Optional[Dict[str, Any]]:
        for inc in self.incidents:
            if inc["id"] == incident_id:
                return inc
        return None

    def create_incident(self, data: Dict[str, Any], user: str = "Operator", role: str = "Analyst") -> Dict[str, Any]:
        inc_id = f"INC-{len(self.incidents) + 1:03d}"
        now_str = utc_now().isoformat()
        
        severity = data.get("severity", "HIGH")
        risk_score = int(data.get("risk_score", 75))
        confidence = int(data.get("ai_confidence", 85))
        
        new_inc = {
            "id": inc_id,
            "title": data.get("title", f"Emergency: {data.get('incident_type', 'Maritime Anomaly')}"),
            "incident_type": data.get("incident_type", "Sea Ice Obstruction"),
            "severity": severity,
            "status": "INCIDENT_DECLARED",
            "risk_score": risk_score,
            "ai_confidence": confidence,
            "response_lead": data.get("response_lead", "Cmdr. Hayes"),
            "description": data.get("description", "Reported Antarctic maritime emergency."),
            "location_name": data.get("location_name", "Southern Ocean Fairway"),
            "coordinates": data.get("coordinates", {"lat": -68.0, "lon": 77.0}),
            "is_simulation": bool(data.get("is_simulation", False)),
            "detected_at": now_str,
            "updated_at": now_str,
            "resolved_at": None,
            "closed_at": None,
            "primary_cause": data.get("primary_cause", "Environmental or mechanical distress."),
            "secondary_risks": data.get("secondary_risks", ["Route delay", "Fuel reserve burn"]),
            "potential_impact": data.get("potential_impact", "Mission delay and resource diversion."),
            "affected_assets": data.get("affected_assets", [
                {
                    "id": "VESSEL_01",
                    "name": data.get("affected_asset_name", "Polar Star"),
                    "asset_type": "Icebreaker",
                    "imo_or_id": "9123456",
                    "current_lat": data.get("coordinates", {}).get("lat", -68.0),
                    "current_lon": data.get("coordinates", {}).get("lon", 77.0),
                    "speed_knots": 7.5,
                    "heading_deg": 120.0,
                    "destination": "Davis Station",
                    "original_eta": "01 Oct 2026",
                    "predicted_eta": "02 Oct 2026",
                    "expected_delay_hours": 18.0,
                    "status": "ASSESSING",
                    "fuel_remaining_pct": 75.0,
                    "personnel_count": 28
                }
            ]),
            "data_sources": [
                {"source": "AIS Stream", "updated_at": "1 min ago", "freshness": "FRESH", "confidence": 95},
                {"source": "Satellite Observation", "updated_at": "25 min ago", "freshness": "FRESH", "confidence": 92}
            ],
            "weather_sea_ice": {
                "temperature_c": -18.0,
                "wind_speed_knots": 35.0,
                "wind_direction": "S",
                "visibility_km": 5.0,
                "sea_ice_concentration_pct": 72.0,
                "sea_ice_thickness_m": 1.8,
                "iceberg_proximity_nm": 6.0,
                "wave_height_m": 3.2,
                "storm_probability_pct": 70,
                "risk_level": "HIGH",
                "data_freshness": "FRESH",
                "last_updated": now_str
            },
            "satellite_evidence": {
                "satellite": "Sentinel-1A SAR",
                "product_type": "GRD Dual-Pol",
                "acquisition_time": now_str,
                "display_time": "Latest Available Observation",
                "resolution": "10 m",
                "cloud_coverage_pct": 0.0,
                "processing_status": "COMPLETED",
                "finding": "Ice or environmental anomaly detected at vessel coordinates.",
                "feature_detected": "Hazard Cluster",
                "preview_url": "/api/static/imagery/s1a_davis_sar_preview.png"
            },
            "ai_risk_assessment": {
                "risk_score": risk_score,
                "confidence_pct": confidence,
                "model_name": "XGB_ROUTE_RISK_01",
                "model_version": "1.3.0",
                "prediction_summary": "Active risk identified. Vessel requires route inspection.",
                "factor_drivers": [
                    {"factor": "Sea Ice Concentration", "impact_pct": 40},
                    {"factor": "Weather Gale", "impact_pct": 30},
                    {"factor": "Vessel Speed Deceleration", "impact_pct": 30}
                ],
                "why_flagged_narrative": f"Incident {inc_id} flagged by AI engine due to abnormal parameters at {data.get('location_name', 'Southern Ocean')}."
            },
            "ai_recommendation": {
                "title": "Establish Safe Waypoint Corridor",
                "recommended_action": "Request human approval to simulate alternate diversion corridor.",
                "eta_improvement_hours": 8.0,
                "risk_reduction_pct": 20.0,
                "fuel_impact_pct": 3.0,
                "confidence_pct": 82,
                "model_name": "XGB_ROUTE_RISK_01 + OR_TOOLS_VRP",
                "status": "AWAITING_HUMAN_APPROVAL",
                "created_at": now_str,
                "route_comparison": None
            },
            "pending_approvals": [
                {
                    "id": f"APPR-{len(self.incidents) + 1:03d}",
                    "action_type": "RESOURCE_DISPATCH_OR_DIVERSION",
                    "title": f"Approve Emergency Mitigation Plan for {inc_id}",
                    "reason": data.get("description", "Address reported maritime emergency."),
                    "ai_confidence": confidence,
                    "expected_impact": {"delay_reduction_hours": 8.0, "risk_reduction_pct": 20.0, "fuel_delta_pct": 3.0},
                    "requested_by": "AI Risk Engine",
                    "status": "PENDING",
                    "requires_role": "Commander",
                    "reviewer_name": None,
                    "reviewer_role": None,
                    "reviewer_notes": None,
                    "decision_timestamp": None,
                    "created_at": now_str
                }
            ],
            "cascading_impact": {
                "primary_asset": data.get("affected_asset_name", "Polar Star"),
                "downstream_impacts": [
                    {"node": "Vessel Operation", "status": "AFFECTED", "type": "Vessel", "impact": "Corridor transit restricted."},
                    {"node": "Station Supply Schedule", "status": "WARNING", "type": "Station", "impact": "Resupply buffer reduced."}
                ],
                "graph_nodes": [
                    {"id": "incident", "label": f"{data.get('incident_type', 'Anomaly')} ({inc_id})", "type": "incident", "severity": severity},
                    {"id": "vessel", "label": data.get("affected_asset_name", "Polar Star"), "type": "vessel", "severity": severity},
                    {"id": "station", "label": "Destination Base", "type": "station", "severity": "MEDIUM"}
                ],
                "graph_edges": [
                    {"source": "incident", "target": "vessel", "label": "Impacts"},
                    {"source": "vessel", "target": "station", "label": "Delays Resupply"}
                ]
            },
            "communications": [
                {
                    "id": f"COMM-{uuid.uuid4().hex[:6].upper()}",
                    "timestamp": now_str,
                    "sender": user,
                    "sender_role": role,
                    "channel": "Operations VHF / SAT",
                    "signal_quality": "GOOD",
                    "message": f"Incident {inc_id} manually created: {data.get('title', '')}.",
                    "acknowledged": True
                }
            ],
            "timeline": [
                {"time": now_str, "source": "Human", "actor": f"{user} ({role})", "action": f"Incident {inc_id} declared", "status": "DECLARED"}
            ]
        }
        
        self.incidents.insert(0, new_inc)
        
        # Audit Log
        self.audit_log.insert(0, {
            "id": f"AUD-{uuid.uuid4().hex[:6].upper()}",
            "incident_id": inc_id,
            "timestamp": now_str,
            "user_name": user,
            "user_role": role,
            "action": "CREATED_INCIDENT",
            "old_state": "NONE",
            "new_state": "INCIDENT_DECLARED",
            "reason": f"Incident declared: {new_inc['title']}",
            "ai_recommendation_summary": f"Risk Score {risk_score}",
            "data_sources_consulted": ["User Input", "AIS", "Satellite"],
            "is_simulation": new_inc["is_simulation"]
        })
        
        return new_inc

    def add_communication_message(self, incident_id: str, sender: str, role: str, channel: str, message: str) -> Dict[str, Any]:
        inc = self.get_incident_by_id(incident_id)
        if not inc:
            raise ValueError(f"Incident {incident_id} not found")
            
        comm = {
            "id": f"COMM-{uuid.uuid4().hex[:6].upper()}",
            "timestamp": utc_now().isoformat(),
            "sender": sender,
            "sender_role": role,
            "channel": channel,
            "signal_quality": "GOOD",
            "message": message,
            "acknowledged": True
        }
        inc.setdefault("communications", []).append(comm)
        
        # Also add to timeline
        inc.setdefault("timeline", []).append({
            "time": comm["timestamp"],
            "source": "Human" if "Cmdr" in sender or "Bridge" in sender else "System",
            "actor": sender,
            "action": f"Comms: {message[:60]}...",
            "status": "SENT"
        })
        return comm

    def submit_for_approval(self, incident_id: str, action_type: str, title: str, reason: str, user: str, role: str) -> Dict[str, Any]:
        """Queues an action for Human-in-the-Loop review. Does NOT execute autonomously!"""
        inc = self.get_incident_by_id(incident_id)
        if not inc:
            raise ValueError(f"Incident {incident_id} not found")
            
        appr_id = f"APPR-{len(inc.get('pending_approvals', [])) + 1:03d}"
        now_str = utc_now().isoformat()
        
        approval = {
            "id": appr_id,
            "action_type": action_type,
            "title": title,
            "reason": reason,
            "ai_confidence": inc.get("ai_confidence", 85),
            "expected_impact": {
                "delay_reduction_hours": 11.0,
                "risk_reduction_pct": 24.0,
                "fuel_delta_pct": 4.0
            },
            "requested_by": f"{user} ({role})",
            "status": "PENDING",
            "requires_role": "Commander / Master",
            "reviewer_name": None,
            "reviewer_role": None,
            "reviewer_notes": None,
            "decision_timestamp": None,
            "created_at": now_str
        }
        
        inc.setdefault("pending_approvals", []).insert(0, approval)
        inc["status"] = "AWAITING_APPROVAL"
        
        # Timeline
        inc.setdefault("timeline", []).append({
            "time": now_str,
            "source": "System",
            "actor": f"{user} ({role})",
            "action": f"Action submitted for Commander Approval: {title}",
            "status": "PENDING_APPROVAL"
        })
        
        # Audit
        self.audit_log.insert(0, {
            "id": f"AUD-{uuid.uuid4().hex[:6].upper()}",
            "incident_id": incident_id,
            "timestamp": now_str,
            "user_name": user,
            "user_role": role,
            "action": "SUBMITTED_APPROVAL_REQUEST",
            "old_state": inc.get("status", "RESPONSE_ACTIVE"),
            "new_state": "AWAITING_APPROVAL",
            "reason": reason,
            "ai_recommendation_summary": title,
            "data_sources_consulted": ["AI Risk Engine", "Route Optimizer"],
            "is_simulation": inc.get("is_simulation", False)
        })
        
        return approval

    def approve_action(self, incident_id: str, approval_id: str, commander_name: str, commander_role: str, comment: str) -> Dict[str, Any]:
        """
        Human-in-the-Loop Approval Execution.
        Only called when human Commander reviews and formally approves the action.
        """
        inc = self.get_incident_by_id(incident_id)
        if not inc:
            raise ValueError(f"Incident {incident_id} not found")
            
        target_appr = None
        for appr in inc.get("pending_approvals", []):
            if appr["id"] == approval_id:
                target_appr = appr
                break
                
        if not target_appr:
            raise ValueError(f"Approval request {approval_id} not found")
            
        now_str = utc_now().isoformat()
        target_appr["status"] = "APPROVED"
        target_appr["reviewer_name"] = commander_name
        target_appr["reviewer_role"] = commander_role
        target_appr["reviewer_notes"] = comment
        target_appr["decision_timestamp"] = now_str
        
        inc["status"] = "RESPONSE_ACTIVE"
        if inc.get("ai_recommendation"):
            inc["ai_recommendation"]["status"] = "APPROVED_BY_COMMANDER"
            
        # Add to timeline
        inc.setdefault("timeline", []).append({
            "time": now_str,
            "source": "Commander",
            "actor": f"{commander_name} ({commander_role})",
            "action": f"APPROVED: {target_appr['title']} - Note: {comment}",
            "status": "APPROVED"
        })
        
        # Add simulated execution transmission to timeline
        inc.setdefault("timeline", []).append({
            "time": (utc_now() + timedelta(seconds=15)).isoformat(),
            "source": "System",
            "actor": "Fleet Communication Gateway",
            "action": f"Cryptographic Waypoint Order transmitted to vessel bridge via Iridium SAT-3",
            "status": "EXECUTED"
        })
        
        # Immutable Audit Record
        audit_entry = {
            "id": f"AUD-{uuid.uuid4().hex[:6].upper()}",
            "incident_id": incident_id,
            "timestamp": now_str,
            "user_name": commander_name,
            "user_role": commander_role,
            "action": f"APPROVED_{target_appr['action_type']}",
            "old_state": "AWAITING_APPROVAL",
            "new_state": "RESPONSE_ACTIVE",
            "reason": comment,
            "ai_recommendation_summary": target_appr["title"],
            "data_sources_consulted": ["Sentinel-1 SAR", "AIS Stream", "OR-Tools Route Optimizer", "Human Commander Assessment"],
            "is_simulation": inc.get("is_simulation", False)
        }
        self.audit_log.insert(0, audit_entry)
        
        return {
            "approval": target_appr,
            "audit_entry": audit_entry,
            "status": "APPROVED"
        }

    def reject_action(self, incident_id: str, approval_id: str, commander_name: str, commander_role: str, reason: str) -> Dict[str, Any]:
        """Commander explicitly rejects action."""
        inc = self.get_incident_by_id(incident_id)
        if not inc:
            raise ValueError(f"Incident {incident_id} not found")
            
        target_appr = None
        for appr in inc.get("pending_approvals", []):
            if appr["id"] == approval_id:
                target_appr = appr
                break
                
        if not target_appr:
            raise ValueError(f"Approval request {approval_id} not found")
            
        now_str = utc_now().isoformat()
        target_appr["status"] = "REJECTED"
        target_appr["reviewer_name"] = commander_name
        target_appr["reviewer_role"] = commander_role
        target_appr["reviewer_notes"] = reason
        target_appr["decision_timestamp"] = now_str
        
        inc["status"] = "ASSESSING"
        
        inc.setdefault("timeline", []).append({
            "time": now_str,
            "source": "Commander",
            "actor": f"{commander_name} ({commander_role})",
            "action": f"REJECTED: {target_appr['title']} - Reason: {reason}",
            "status": "REJECTED"
        })
        
        audit_entry = {
            "id": f"AUD-{uuid.uuid4().hex[:6].upper()}",
            "incident_id": incident_id,
            "timestamp": now_str,
            "user_name": commander_name,
            "user_role": commander_role,
            "action": f"REJECTED_{target_appr['action_type']}",
            "old_state": "AWAITING_APPROVAL",
            "new_state": "ASSESSING",
            "reason": reason,
            "ai_recommendation_summary": target_appr["title"],
            "data_sources_consulted": ["Human Commander Assessment"],
            "is_simulation": inc.get("is_simulation", False)
        }
        self.audit_log.insert(0, audit_entry)
        
        return {
            "approval": target_appr,
            "audit_entry": audit_entry,
            "status": "REJECTED"
        }

    def close_incident(self, incident_id: str, commander_name: str, commander_notes: str, root_cause: str) -> Dict[str, Any]:
        """Resolves and closes incident, producing final closure summary and report."""
        inc = self.get_incident_by_id(incident_id)
        if not inc:
            raise ValueError(f"Incident {incident_id} not found")
            
        now_str = utc_now().isoformat()
        inc["status"] = "CLOSED"
        inc["resolved_at"] = now_str
        inc["closed_at"] = now_str
        
        closure = {
            "resolution_time": now_str,
            "response_duration_hours": 3.8,
            "assets_involved": [a.get("name") for a in inc.get("affected_assets", [])] + ["Ocean Guardian"],
            "final_outcome": "Vessel successfully diverted through Alternate Route B open leads without hull damage or fuel starvation.",
            "delay_caused_hours": 15.0, # significantly reduced from original +26h
            "cargo_impact": "Negligible. Food and medical containers remained temperature-controlled.",
            "personnel_impact": "Zero injuries reported.",
            "operational_impact": "Davis Station resupply schedule maintained within 48h operational buffer.",
            "root_cause": root_cause,
            "commander_notes": commander_notes,
            "ai_prediction_accuracy": {
                "predicted_delay_hours": 26.0,
                "actual_delay_hours": 24.0,
                "prediction_error_hours": 2.0,
                "ai_confidence_pct": 84,
                "outcome_evaluation": "Route successfully diverted with 92% adherence to OR-Tools fairway model."
            }
        }
        inc["closure_summary"] = closure
        
        inc.setdefault("timeline", []).append({
            "time": now_str,
            "source": "Commander",
            "actor": commander_name,
            "action": f"INCIDENT CLOSED: {commander_notes}",
            "status": "CLOSED"
        })
        
        self.audit_log.insert(0, {
            "id": f"AUD-{uuid.uuid4().hex[:6].upper()}",
            "incident_id": incident_id,
            "timestamp": now_str,
            "user_name": commander_name,
            "user_role": "Commander",
            "action": "CLOSED_INCIDENT",
            "old_state": "RESPONSE_ACTIVE",
            "new_state": "CLOSED",
            "reason": commander_notes,
            "ai_recommendation_summary": "Incident resolved.",
            "data_sources_consulted": ["Post-Incident Analysis"],
            "is_simulation": inc.get("is_simulation", False)
        })
        
        return {
            "incident": inc,
            "closure_summary": closure
        }

    def generate_post_incident_report(self, incident_id: str) -> Dict[str, Any]:
        """Generates comprehensive post-incident analysis report."""
        inc = self.get_incident_by_id(incident_id)
        if not inc:
            raise ValueError(f"Incident {incident_id} not found")
            
        closure = inc.get("closure_summary") or {
            "resolution_time": utc_now().isoformat(),
            "response_duration_hours": 4.2,
            "assets_involved": ["Polar Star", "Ocean Guardian"],
            "final_outcome": "Diversion completed safely.",
            "delay_caused_hours": 15.0,
            "cargo_impact": "Minimal",
            "personnel_impact": "None",
            "operational_impact": "Resupply completed",
            "root_cause": inc.get("primary_cause", "Environmental pack convergence"),
            "commander_notes": "Prompt response and adherence to human review safeguarded the vessel.",
            "ai_prediction_accuracy": {
                "predicted_delay_hours": 26.0,
                "actual_delay_hours": 24.0,
                "prediction_error_hours": 2.0,
                "ai_confidence_pct": 84
            }
        }
        
        report = {
            "report_id": f"REP-{incident_id}-{uuid.uuid4().hex[:4].upper()}",
            "incident_id": incident_id,
            "title": f"Post-Incident Intelligence Report: {inc['title']}",
            "generated_at": utc_now().isoformat(),
            "executive_summary": f"Incident {incident_id} ({inc['incident_type']}) was declared on {inc['detected_at']}. Prompt human Commander review of AI-generated alternate routes resulted in a 42% risk reduction and avoided catastrophic compressive hull entrapment.",
            "metrics": {
                "detection_time_minutes": 15,
                "assessment_time_minutes": 25,
                "approval_time_minutes": 18,
                "response_time_minutes": 42,
                "resolution_time_hours": closure.get("response_duration_hours", 4.2)
            },
            "timeline": inc.get("timeline", []),
            "root_cause_analysis": closure.get("root_cause", "Severe unforecast ice ridge keels"),
            "ai_performance": {
                "model": "XGB_ROUTE_RISK_01 (v1.3.0) + OR_TOOLS_VRP",
                "confidence": inc.get("ai_confidence", 85),
                "predicted_delay_hours": closure.get("ai_prediction_accuracy", {}).get("predicted_delay_hours", 26.0),
                "actual_delay_hours": closure.get("ai_prediction_accuracy", {}).get("actual_delay_hours", 24.0),
                "prediction_error_hours": closure.get("ai_prediction_accuracy", {}).get("prediction_error_hours", 2.0),
                "accuracy_grade": "HIGH (92.3% fidelity)"
            },
            "response_asset_performance": [
                {"asset": "Ocean Guardian", "role": "Fairway Escort / Standby", "rating": "EXEMPLARY (On-scene within 5h)"},
                {"asset": "Falcon-1 HELO", "role": "Aerial FLIR Reconnaissance", "rating": "READY (No flight needed)"}
            ],
            "data_quality_evaluation": {
                "satellite_freshness": "FRESH (Sentinel-1 SAR 38 min old)",
                "ais_telemetry": "EXCELLENT (2 min latency)",
                "iot_vibration": "DEGRADED (3 hr latency due to Iridium bandwidth)"
            },
            "lessons_learned": [
                "Early C-band SAR processing enabled 14nm advance notice of ridge keels.",
                "Mandatory Human-in-the-Loop review ensured Master had bridge tactical autonomy.",
                "High-latitude Iridium telemetry drops require local edge caching on shipboard sensors."
            ],
            "recommended_improvements": [
                "Deploy automated SAR change detection alerts directly into bridge ECDIS display.",
                "Integrate continuous micro-Doppler radar for local ridge thickness profiling."
            ]
        }
        return report

    def trigger_scenario(self, scenario_id: int) -> Dict[str, Any]:
        """
        Launches one of the 8 controlled Simulation Scenarios.
        Clearly tags all entities with is_simulation = True.
        """
        scenarios = {
            1: {
                "type": "Dense Sea Ice",
                "title": "SIMULATION: Sudden Fast-Ice Convergence on Mawson Coast",
                "vessel": "Aurora Explorer",
                "location": "Mawson Coast Fairway",
                "coords": {"lat": -67.10, "lon": 62.80},
                "severity": "CRITICAL",
                "risk": 89,
                "desc": "Synthetic simulation: Rapid fast-ice shelf blowout creating 2.5m pressure ridges across Aurora Explorer transit path."
            },
            2: {
                "type": "Engine Failure",
                "title": "SIMULATION: Main Propulsion Turbocharger Blackout",
                "vessel": "Southern Cross",
                "location": "Queen Maud Land Approaches",
                "coords": {"lat": -69.80, "lon": 12.40},
                "severity": "CRITICAL",
                "risk": 92,
                "desc": "Synthetic simulation: Main diesel engine trip in freezing drift fairway. Vessel drifting toward shoal at 1.4 knots."
            },
            3: {
                "type": "Severe Storm",
                "title": "SIMULATION: Category 2 Antarctic Polar Low Gale",
                "vessel": "Polar Star",
                "location": "Prydz Bay High Seas",
                "coords": {"lat": -66.80, "lon": 75.20},
                "severity": "HIGH",
                "risk": 82,
                "desc": "Synthetic simulation: Violent polar low generating 55-knot sustained winds and 6m rogue wave swells."
            },
            4: {
                "type": "Station Infrastructure Failure",
                "title": "SIMULATION: Maitri Station Main Generator Tripped",
                "vessel": "Maitri Base Powerhouse",
                "location": "Schirmacher Oasis",
                "coords": {"lat": -70.76, "lon": 11.73},
                "severity": "CRITICAL",
                "risk": 88,
                "desc": "Synthetic simulation: Diesel fuel line gelling caused generator shutdown during -28C ambient temperatures."
            },
            5: {
                "type": "Communication Loss",
                "title": "SIMULATION: Total Iridium / HF Blackout on Traverse Party",
                "vessel": "Inland Traverse Snowcat Alpha",
                "location": "Amery Ice Shelf",
                "coords": {"lat": -71.20, "lon": 70.50},
                "severity": "HIGH",
                "risk": 79,
                "desc": "Synthetic simulation: Solar geomagnetic flare severed all satellite uplinks for 120 minutes."
            },
            6: {
                "type": "Medical Emergency",
                "title": "SIMULATION: Acute Compound Fracture on Bharati Helipad",
                "vessel": "Bharati Base",
                "location": "Larsemann Hills",
                "coords": {"lat": -69.40, "lon": 76.19},
                "severity": "CRITICAL",
                "risk": 91,
                "desc": "Synthetic simulation: Expedition engineer suffered severe injury during cargo crane offload. Immediate MEDEVAC required."
            },
            7: {
                "type": "Cargo Loss",
                "title": "SIMULATION: Critical Arctic Diesel Container Tank Breach",
                "vessel": "Polar Star Deck Bay 4",
                "location": "Prydz Bay Lead",
                "coords": {"lat": -67.84, "lon": 76.92},
                "severity": "MEDIUM",
                "risk": 64,
                "desc": "Synthetic simulation: Structural lashing failure caused fuel tank container shifting. Minor containment leak."
            },
            8: {
                "type": "Satellite Anomaly",
                "title": "SIMULATION: Uncharted Giant Iceberg Calving Event (A-84)",
                "vessel": "Cape Town -> Davis Fairway",
                "location": "Shackleton Ice Shelf",
                "coords": {"lat": -65.90, "lon": 95.30},
                "severity": "HIGH",
                "risk": 85,
                "desc": "Synthetic simulation: Sentinel-1 SAR change detection flagged a 18nm x 6nm tabular iceberg calving directly into maritime fairway."
            }
        }
        
        sc = scenarios.get(scenario_id, scenarios[1])
        
        sim_data = {
            "title": sc["title"],
            "incident_type": sc["type"],
            "severity": sc["severity"],
            "risk_score": sc["risk"],
            "ai_confidence": 88,
            "description": sc["desc"],
            "location_name": sc["location"],
            "coordinates": sc["coords"],
            "affected_asset_name": sc["vessel"],
            "is_simulation": True
        }
        
        inc = self.create_incident(sim_data, user="Simulation Engine", role="Automated Tester")
        return inc

# Global singleton
emergency_service = EmergencyService()
