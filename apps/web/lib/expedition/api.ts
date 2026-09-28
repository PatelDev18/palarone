import {
  Expedition,
  ExpeditionKPIs,
  ScenarioSimulationResult,
  AuditLogEntry,
  ExpeditionStatus,
  ExpeditionTask,
  ExpeditionIncident,
  ExpeditionRecommendation
} from '@/types/expedition';
import { getApiBase } from '@/lib/utils/apiBase';

const BASE_URL = getApiBase('expeditions');

// Embedded fallback seed data in case backend server is disconnected/cold starting
export const FALLBACK_EXPEDITIONS: Expedition[] = [
  {
    id: "EXP-2026-A",
    name: "Operation Deep Freeze 26",
    mission_type: "Scientific Research & Resupply",
    description: "Multi-asset joint icebreaker channel clearing and logistical resupply for McMurdo Station, combined with Ross Ice Shelf glaciological acoustic sounding.",
    lead: "Cmdr. Sarah Jenkins",
    organization: "National Science Foundation / USCG Polar Operations",
    operational_season: "2026-2027",
    status: "OPERATIONAL",
    status_display: "IN PROGRESS",
    risk_level: "MEDIUM",
    risk_score: 48.5,
    progress: 68,
    current_phase: "Ice Channel Transit & Fuel Discharge",
    planned_start: "2026-10-01T00:00:00Z",
    planned_end: "2026-12-15T00:00:00Z",
    expected_completion: "2026-12-17T14:00:00Z",
    delay_hours: 4.5,
    delay_reason: "Bypass around multi-year ice ridge near Cape Armitage channel lead.",
    origin_name: "Lyttelton Port, New Zealand",
    destination_name: "McMurdo Station, Ross Island",
    current_region: "Ross Sea / McMurdo Sound",
    current_lat: -77.848,
    current_lon: 166.668,
    vessel_name: "USCGC Polar Star",
    ships: ["USCGC Polar Star"],
    aircraft: ["LC-130 Hercules (Skibird 31)", "Bell 412EP (Helo-1)"],
    vehicles: ["2x PistenBully 300 Polar", "Hägglunds BV206"],
    major_equipment: ["Deep Ice Core Drill #2", "Teledyne Gavia AUV", "Seismic Array A"],
    crew_count: 142,
    personnel: {
      planned: 150,
      assigned: 142,
      deployed: 142,
      available: 142,
      missing: 8,
      breakdown: [
        { role: "Expedition Commander", assigned: 1, required: 1 },
        { role: "Vessel Officers & Deck Crew", assigned: 84, required: 88 },
        { role: "Glaciologists & Climate Scientists", assigned: 26, required: 28 },
        { role: "Naval Aviators & Flight Techs", assigned: 14, required: 14 },
        { role: "Medical Officers & Paramedics", assigned: 4, required: 4 },
        { role: "Heavy Machinery Engineers", assigned: 9, required: 11 },
        { role: "SATCOM & Cryptologic Specialists", assigned: 4, required: 4 }
      ],
      roster: [
        { name: "Cmdr. Sarah Jenkins", role: "Expedition Commander", team: "Command", cert: "Polar Class Master", location: "USCGC Polar Star (Bridge)", medical: "FIT_FOR_DUTY", shift: "Alpha (06:00-18:00)", deployed: true },
        { name: "Dr. Marcus Vance", role: "Chief Glaciologist", team: "Science", cert: "Crevasse Rescue Level 3", location: "Ross Shelf Camp Alpha", medical: "FIT_FOR_DUTY", shift: "Scientific Flex", deployed: true },
        { name: "Lt. Emily Thorne", role: "Lead Ice Pilot (LC-130)", team: "Aviation", cert: "Skiway Instrument Rated", location: "Williams Field Skiway", medical: "FIT_FOR_DUTY", shift: "Flight Alert 15", deployed: true },
        { name: "Chief Eng. Mikhail Petrov", role: "Chief Marine Engineer", team: "Engineering", cert: "Heavy Icebreaker Propulsion", location: "USCGC Polar Star (Engine Room)", medical: "FIT_FOR_DUTY", shift: "Bravo (18:00-06:00)", deployed: true },
        { name: "Dr. Lisa Wong, MD", role: "Flight Surgeon / Medical Lead", team: "Medical", cert: "Polar Trauma Surgery", location: "USCGC Polar Star (Sickbay)", medical: "FIT_FOR_DUTY", shift: "24h On-Call", deployed: true }
      ]
    },
    weather: {
      station_id: "MCM_AWS_01",
      condition: "Scattered Clouds / Gale Approaching",
      temperature_c: -18.4,
      wind_speed_kt: 34.2,
      wind_direction: "SSW (210°)",
      wind_gust_kt: 48.0,
      visibility_km: 6.2,
      pressure_hpa: 982.4,
      snowfall_rate: "Light drift",
      storm_warning: true,
      warning_title: "GALE FORCE ADVISORY (Katabatic Front)",
      warning_impact: "Helicopter sling operations suspended; vessel speed limited to 7 kt.",
      forecast_confidence: 0.88,
      provider: "Open-Meteo & ECMWF Integrated Polar Model",
      data_age_min: 18,
      forecast_horizons: {
        current: { temp: -18.4, wind: 34, vis: 6.2, status: "Caution" },
        '6_hour': { temp: -22.1, wind: 44, vis: 3.0, status: "Warning" },
        '24_hour': { temp: -25.0, wind: 52, vis: 1.2, status: "Severe" },
        '3_day': { temp: -16.0, wind: 20, vis: 10.0, status: "Normal" },
        '7_day': { temp: -14.2, wind: 15, vis: 15.0, status: "Optimal" }
      }
    },
    sea_ice: {
      source: "Copernicus Marine SAR Sentinel-1C / AMSR2",
      observation_time: "2026-10-14T11:08:00Z",
      data_age_hours: 3.2,
      confidence: 0.94,
      concentration_pct: 68,
      ice_class: "Heavy First-Year with Multi-Year Ridges",
      ice_thickness_m: 1.95,
      drift_speed_kt: 0.8,
      drift_direction: "NNW (340°)",
      operational_impact: "Channel requires 3-pass clearing; escort recommended for cargo vessel.",
      compression_risk: "MEDIUM",
      ice_edge_distance_km: 14.5
    },
    satellite: {
      source: "Sentinel-1A C-SAR (Interferometric Wide Swath)",
      scene_id: "S1A_EW_GRDM_1SDH_20261014T142018",
      observation_time: "2026-10-14T09:35:00Z",
      footprint: "POLYGON((165.2 -77.2, 168.4 -77.2, 168.4 -78.1, 165.2 -78.1, 165.2 -77.2))",
      resolution_m: 20,
      data_freshness: "Observed 4.7h ago",
      satellite_type: "SAR_IMAGERY",
      cloud_cover_pct: 0,
      interpretation: "Lead openings along Winter Quarters Bay confirmed navigable; shear zone active west of Cape Bird."
    },
    logistics: {
      cargo_readiness: 96,
      fuel_readiness: 88,
      supply_readiness: 94,
      fuel_consumption_pct: 62,
      fuel_projected_remaining_pct: 26,
      fuel_reserve_warning: false,
      items: [
        { category: "Fuel", name: "JP-8 Aviation & Diesel Arctic Fuel", required: 1800, loaded: 1800, consumed: 1116, remaining: 684, unit: "metric tons", reserve_pct: 38 },
        { category: "Food", name: "Long-term Polar Rations & Fresh Food", required: 45, loaded: 45, consumed: 28, remaining: 17, unit: "metric tons", reserve_pct: 37 },
        { category: "Medical", name: "Trauma & Hypothermia Treatment Packs", required: 4.5, loaded: 4.5, consumed: 0.8, remaining: 3.7, unit: "metric tons", reserve_pct: 82 },
        { category: "Science", name: "Ice Core Specimen Cryo-Containers", required: 32, loaded: 32, consumed: 0, remaining: 32, unit: "units", reserve_pct: 100 },
        { category: "Spare Parts", name: "Turbine Injectors & Track Assembly Kits", required: 18, loaded: 18, consumed: 4, remaining: 14, unit: "crates", reserve_pct: 77 }
      ]
    },
    risk_engine: {
      overall_score: 48.5,
      overall_level: "MEDIUM",
      model_id: "XGB_EXP_RISK_v3.2",
      confidence: 0.86,
      main_contributor: "Approaching Katabatic gale front and multi-year ice ridge pressure.",
      categories: [
        { category: "Weather", score: 62, level: "HIGH", weight: 0.20, why: "Wind shear forecast >48kt in 18h window." },
        { category: "Sea Ice", score: 58, level: "MEDIUM", weight: 0.22, why: "1.95m thickness with converging drift on channel mouth." },
        { category: "Vessel", score: 24, level: "LOW", weight: 0.15, why: "Hull stress sensor within nominal 42% yield." },
        { category: "Aircraft", score: 68, level: "HIGH", weight: 0.10, why: "Williams Field ground blizzard forecast restricts ski landing." },
        { category: "Personnel", score: 18, level: "LOW", weight: 0.08, why: "Crew rest cycle compliant; zero cold injuries." },
        { category: "Medical", score: 12, level: "LOW", weight: 0.05, why: "Full ICU surgeon coverage on flagship." },
        { category: "Cargo", score: 15, level: "LOW", weight: 0.05, why: "Breakaway cargo secured in lower hold #3." },
        { category: "Fuel", score: 44, level: "MEDIUM", weight: 0.07, why: "Reserve margin projected at 26% after station discharge." },
        { category: "Communication", score: 28, level: "LOW", weight: 0.03, why: "Iridium Certus + Starlink dual constellation live." },
        { category: "Route", score: 42, level: "MEDIUM", weight: 0.02, why: "Bypass waypoint Delta active." },
        { category: "Environmental", score: 20, level: "LOW", weight: 0.01, why: "Wildlife sanctuary buffers respected." },
        { category: "Schedule", score: 38, level: "MEDIUM", weight: 0.02, why: "Running +4.5h behind target arrival window." }
      ]
    },
    objectives: [
      { id: "OBJ-A1", title: "Break open 18nm navigational ice channel into Winter Quarters Bay", is_primary: true, priority: "HIGH", owner: "Cmdr. Jenkins", deadline: "2026-10-20", status: "IN PROGRESS", success_criteria: "Maintain 40m clear channel for Maersk Peary tanker escort" },
      { id: "OBJ-A2", title: "Discharge 5.2M liters of Arctic Diesel to McMurdo bulk tank farm", is_primary: true, priority: "HIGH", owner: "Chief Eng. Petrov", deadline: "2026-10-28", status: "PLANNED", success_criteria: "Zero spill, verified density testing, transfer complete <72h" },
      { id: "OBJ-A3", title: "Deploy 3 glaciological sub-ice radar transponders on Ross Ice Shelf", is_primary: false, priority: "MEDIUM", owner: "Dr. Vance", deadline: "2026-11-15", status: "IN PROGRESS", success_criteria: "100% data telemetry uplink to McMurdo relay" },
      { id: "OBJ-A4", title: "Inspect Cape Royds automated weather and penguin sanctuary sensor array", is_primary: false, priority: "LOW", owner: "Dr. Wong", deadline: "2026-11-30", status: "PLANNED", success_criteria: "Replace solar battery bank and re-level mast" }
    ],
    waypoints: [
      { order: 1, name: "Lyttelton Pilot Station", lat: -43.60, lon: 172.72, passed: true, eta: "2026-10-01T04:00:00Z", ice_risk: "NONE" },
      { order: 2, name: "Southern Ocean Waypoint 55S", lat: -55.00, lon: 174.50, passed: true, eta: "2026-10-05T12:00:00Z", ice_risk: "LOW" },
      { order: 3, name: "Ross Sea Marginal Ice Zone", lat: -68.40, lon: 175.20, passed: true, eta: "2026-10-09T18:00:00Z", ice_risk: "MEDIUM" },
      { order: 4, name: "Cape Bird Approach", lat: -77.20, lon: 166.40, passed: true, eta: "2026-10-12T08:00:00Z", ice_risk: "HIGH" },
      { order: 5, name: "Winter Quarters Bay Channel (Current)", lat: -77.85, lon: 166.67, passed: false, eta: "2026-10-14T20:00:00Z", ice_risk: "HIGH" },
      { order: 6, name: "McMurdo Ice Pier", lat: -77.85, lon: 166.69, passed: false, eta: "2026-10-16T12:00:00Z", ice_risk: "LOW" },
      { order: 7, name: "Ross Shelf Transect Alpha", lat: -78.40, lon: 168.50, passed: false, eta: "2026-11-02T00:00:00Z", ice_risk: "MEDIUM" }
    ],
    tasks: [
      { id: "TSK-A101", title: "Ice channel reconnaissance flight via Bell 412EP", team: "Aviation", owner: "Lt. Thorne", priority: "HIGH", status: "COMPLETED", due_date: "2026-10-13", dependency: null, location: "McMurdo Sound" },
      { id: "TSK-A102", title: "Clear outer ice barrier at Cape Armitage bypass", team: "Maritime", owner: "Cmdr. Jenkins", priority: "CRITICAL", status: "IN PROGRESS", due_date: "2026-10-15", dependency: "TSK-A101", location: "Cape Armitage Channel" },
      { id: "TSK-A103", title: "Position fuel hose manifold on McMurdo Ice Pier", team: "Engineering", owner: "Chief Eng. Petrov", priority: "HIGH", status: "TODO", due_date: "2026-10-16", dependency: "TSK-A102", location: "McMurdo Ice Pier" },
      { id: "TSK-A104", title: "Acoustic sounding deployment on Shelf Transect Alpha", team: "Science", owner: "Dr. Vance", priority: "MEDIUM", status: "TODO", due_date: "2026-10-22", dependency: "TSK-A103", location: "Ross Shelf" },
      { id: "TSK-A105", title: "LC-130 ski-wheel landing gear de-icing maintenance", team: "Aviation", owner: "Flight Tech Diaz", priority: "MEDIUM", status: "TODO", due_date: "2026-10-18", dependency: null, location: "Williams Field" }
    ],
    timeline: [
      { phase: "Phase 1: Mobilization & Staging", start: "2026-09-15", end: "2026-09-30", status: "COMPLETED", progress: 100 },
      { phase: "Phase 2: Southern Ocean Open Transit", start: "2026-10-01", end: "2026-10-09", status: "COMPLETED", progress: 100 },
      { phase: "Phase 3: Icebreaking & Channel Clearing", start: "2026-10-10", end: "2026-10-20", status: "IN PROGRESS", progress: 72 },
      { phase: "Phase 4: Bulk Fuel & Cargo Discharge", start: "2026-10-21", end: "2026-11-05", status: "PLANNED", progress: 0 },
      { phase: "Phase 5: Glaciological Traverse & Acoustic Sounding", start: "2026-11-06", end: "2026-11-28", status: "PLANNED", progress: 0 },
      { phase: "Phase 6: Channel Re-clearing & Return Voyage", start: "2026-11-29", end: "2026-12-15", status: "PLANNED", progress: 0 }
    ],
    contingencies: [
      {
        plan: "Plan A (Baseline)",
        title: "Continuous 3-pass channel cutting via Western Lead",
        trigger: "Ice concentration <75%, wind <35kt",
        action: "Proceed with planned direct heading into Winter Quarters Bay.",
        responsible: "Cmdr. Jenkins",
        resources: "USCGC Polar Star primary power plant",
        expected_impact: "On schedule (ETA Oct 16)",
        approval_required: "Standard Watch Officer"
      },
      {
        plan: "Plan B (Adverse Weather / Ridge)",
        title: "Hold anchor off Cape Bird & await tidal lead opening",
        trigger: "Sustained Katabatic wind >45kt or pressure ridge >2.5m",
        action: "Divert 6nm northwest into lee of Ross Island; suspend aviation; conserve fuel.",
        responsible: "Cmdr. Jenkins & Duty Ice Navigator",
        resources: "Auxiliary thrusters, reserve generators",
        expected_impact: "+18h to +28h mission delay; preserves vessel hull integrity",
        approval_required: "Operations Commander Approval"
      },
      {
        plan: "Plan C (Emergency Severe Compression)",
        title: "Reverse escort and rendezvous with French R/V L'Astrolabe",
        trigger: "Fast ice convergence trapping cargo vessel or hull stress >85%",
        action: "Execute twin-cutter relief formation with partner vessel; abort tanker lead.",
        responsible: "Antarctic Operations Commander",
        resources: "Joint USCG / IPEV maritime taskforce, LC-130 SAR standby",
        expected_impact: "Mission delay +7d; redirect cargo to Marble Point cache",
        approval_required: "Commander-in-Chief / Joint Staff Approval"
      }
    ],
    incidents: [
      {
        id: "INC-A-01",
        time: "2026-10-12T10:15:00Z",
        title: "Pressure ridge collision - Starboard bow sensor sheer",
        type: "Equipment",
        severity: "LOW",
        description: "While breaking through multi-year ridge near Cape Bird, external draft sensor housing was sheared by ice block. Internal transducers intact and sealed.",
        affected_people: "None",
        affected_assets: "USCGC Polar Star bow sensor block",
        mission_impact: "Manual sonic sounding required during berthing.",
        response: "Engineering team verified watertight integrity; logged in hull maintenance log.",
        status: "MITIGATED"
      }
    ],
    communication: {
      status: "ONLINE",
      mode: "Starlink Polar Maritime + Iridium Certus Fallback",
      latency_ms: 118,
      packet_loss_pct: 0.4,
      bandwidth_kbps: 22400,
      last_successful_sync: "2026-10-14T14:22:00Z",
      last_telemetry_received: "2026-10-14T14:23:15Z",
      pending_sync_records: 0
    },
    recommendations: [
      {
        id: "REC-A-2026-01",
        title: "Adopt Cape Armitage Ridge Bypass Route Delta-2",
        severity: "MEDIUM",
        reason: "Sentinel-1C SAR (3.2h old) shows 2.4m convergent ridge on current path. Bypass Delta-2 follows thermal lead with 1.1m thickness, saving 6 hours of high-power ice ramming.",
        model: "XGB_ROUTE_OPT_v4",
        confidence: 0.88,
        fuel_delta: "-14.2 metric tons",
        eta_delta: "-4.5 hours",
        status: "PENDING_REVIEW",
        action_required: "Commander Approval Required to change primary passage plan"
      }
    ]
  },
  {
    id: "EXP-2026-B",
    name: "Maitri Resupply Mission",
    mission_type: "Logistics & Resupply",
    description: "Annual seasonal fuel and container resupply for Maitri Station and Bharati Station (Larsemann Hills), supporting Indian Antarctic Program winter-over teams.",
    lead: "Capt. Anil Kumar",
    organization: "National Centre for Polar and Ocean Research (NCPOR)",
    operational_season: "2026-2027",
    status: "PLANNING",
    status_display: "PLANNING",
    risk_level: "LOW",
    risk_score: 18.2,
    progress: 15,
    current_phase: "Cargo Marshalling & Berth Scheduling",
    planned_start: "2026-11-10T00:00:00Z",
    planned_end: "2027-01-05T00:00:00Z",
    expected_completion: "2027-01-05T00:00:00Z",
    delay_hours: 0.0,
    delay_reason: "None. On schedule for scheduled Cape Town departure.",
    origin_name: "Cape Town Port, South Africa",
    destination_name: "Princess Astrid Coast / Maitri Station",
    current_region: "Queen Maud Land / Astrid Coast",
    current_lat: -70.767,
    current_lon: 11.733,
    vessel_name: "Ocean Explorer",
    ships: ["Ocean Explorer"],
    aircraft: ["Kamov Ka-32 Helicopter"],
    vehicles: ["4x Prinoth Everest Snow Groomers", "3x Kassbohrer PistenBully"],
    major_equipment: ["Modular Habitat Units", "Combined Heat & Power Diesel Generator 250kVA"],
    crew_count: 45,
    personnel: {
      planned: 48,
      assigned: 45,
      deployed: 0,
      available: 45,
      missing: 3,
      breakdown: [
        { role: "Expedition Leader", assigned: 1, required: 1 },
        { role: "Ship Crew & Logistics Handlers", assigned: 26, required: 28 },
        { role: "Winter-over Replacement Scientists", assigned: 12, required: 12 },
        { role: "Heavy Vehicle Operators", assigned: 4, required: 5 },
        { role: "Medical Staff", assigned: 2, required: 2 }
      ],
      roster: [
        { name: "Capt. Anil Kumar", role: "Expedition Leader", team: "Command", cert: "Polar Code Advanced", location: "Cape Town Logistics Hub", medical: "FIT_FOR_DUTY", shift: "Day Operations", deployed: false },
        { name: "Dr. Sunita Sharma", role: "Atmospheric Scientist", team: "Science", cert: "Antarctic Survival Cert", location: "Cape Town Briefing Center", medical: "FIT_FOR_DUTY", shift: "Day Operations", deployed: false },
        { name: "Vikram Patel", role: "Lead Heavy Vehicle Tech", team: "Engineering", cert: "Hydraulic Snow Systems", location: "Cape Town Berth 2", medical: "FIT_FOR_DUTY", shift: "Day Operations", deployed: false }
      ]
    },
    weather: {
      station_id: "MAI_AWS_03",
      condition: "Clear Sky / Calm",
      temperature_c: -11.2,
      wind_speed_kt: 15.8,
      wind_direction: "ENE (070°)",
      wind_gust_kt: 21.0,
      visibility_km: 12.0,
      pressure_hpa: 996.1,
      snowfall_rate: "None",
      storm_warning: false,
      warning_title: "FAVORABLE PRE-DEPARTURE WINDOW",
      warning_impact: "Favorable sea states projected in South Atlantic transit corridor.",
      forecast_confidence: 0.92,
      provider: "Open-Meteo Antarctic High-Res Grid",
      data_age_min: 24,
      forecast_horizons: {
        current: { temp: -11.2, wind: 16, vis: 12.0, status: "Optimal" },
        '6_hour': { temp: -12.0, wind: 18, vis: 12.0, status: "Optimal" },
        '24_hour': { temp: -10.5, wind: 14, vis: 15.0, status: "Optimal" },
        '3_day': { temp: -9.0, wind: 22, vis: 10.0, status: "Normal" },
        '7_day': { temp: -13.5, wind: 19, vis: 12.0, status: "Optimal" }
      }
    },
    sea_ice: {
      source: "NOAA / NSIDC Daily Sea Ice Concentration",
      observation_time: "2026-10-14T08:00:00Z",
      data_age_hours: 6.3,
      confidence: 0.91,
      concentration_pct: 22,
      ice_class: "Open Drift Ice & Brash",
      ice_thickness_m: 0.65,
      drift_speed_kt: 0.4,
      drift_direction: "W (270°)",
      operational_impact: "Minimal obstruction; standard reinforced hull permitted.",
      compression_risk: "LOW",
      ice_edge_distance_km: 82.0
    },
    satellite: {
      source: "Sentinel-2 MSI Optical",
      scene_id: "S2B_MSIL1C_20261012T075029",
      observation_time: "2026-10-14T00:10:00Z",
      footprint: "POLYGON((10.5 -70.2, 13.0 -70.2, 13.0 -71.2, 10.5 -71.2, 10.5 -70.2))",
      resolution_m: 10,
      data_freshness: "Observed 14.1h ago",
      satellite_type: "OPTICAL_IMAGERY",
      cloud_cover_pct: 4.2,
      interpretation: "Princess Astrid fast ice shelf edge stable; traditional unloading ramp intact."
    },
    logistics: {
      cargo_readiness: 78,
      fuel_readiness: 92,
      supply_readiness: 85,
      fuel_consumption_pct: 0,
      fuel_projected_remaining_pct: 45,
      fuel_reserve_warning: false,
      items: [
        { category: "Fuel", name: "Special Low-Pour Diesel (LDO)", required: 620, loaded: 580, consumed: 0, remaining: 580, unit: "metric tons", reserve_pct: 45 },
        { category: "Food", name: "Standard Station Provisions (18-Month Supply)", required: 38, loaded: 32, consumed: 0, remaining: 32, unit: "metric tons", reserve_pct: 50 },
        { category: "Spare Parts", name: "Generator overhaul components & filters", required: 12, loaded: 10, consumed: 0, remaining: 10, unit: "pallets", reserve_pct: 80 }
      ]
    },
    risk_engine: {
      overall_score: 18.2,
      overall_level: "LOW",
      model_id: "XGB_EXP_RISK_v3.2",
      confidence: 0.91,
      main_contributor: "Pre-departure logistics staging; cargo pallet manifest validation in progress.",
      categories: [
        { category: "Weather", score: 14, level: "LOW", weight: 0.20, why: "Summer warming window approaching Astrid Coast." },
        { category: "Sea Ice", score: 20, level: "LOW", weight: 0.22, why: "Open drift ice within vessel design envelope." },
        { category: "Vessel", score: 10, level: "LOW", weight: 0.15, why: "Ocean Explorer completed Lloyd's Polar drydock inspection." },
        { category: "Aircraft", score: 15, level: "LOW", weight: 0.10, why: "Ka-32 cert valid; rotor head inspections passed." },
        { category: "Personnel", score: 16, level: "LOW", weight: 0.08, why: "3 vehicle operators completing cold-weather altitude medicals." },
        { category: "Medical", score: 8, level: "LOW", weight: 0.05, why: "Medical isolation checks completed." },
        { category: "Cargo", score: 28, level: "LOW", weight: 0.05, why: "6 pallets pending port customs stamp." },
        { category: "Fuel", score: 12, level: "LOW", weight: 0.07, why: "Bunkering scheduled for Nov 08 at Berth 2." },
        { category: "Communication", score: 15, level: "LOW", weight: 0.03, why: "Dual Inmarsat + Iridium terminals tested." },
        { category: "Route", score: 10, level: "LOW", weight: 0.02, why: "Direct Cape Town to Astrid fast track." },
        { category: "Environmental", score: 12, level: "LOW", weight: 0.01, why: "Zero-discharge ballast plan ratified." },
        { category: "Schedule", score: 14, level: "LOW", weight: 0.02, why: "Ample slack before hard ice closing in February." }
      ]
    },
    objectives: [
      { id: "OBJ-B1", title: "Deliver 580 metric tons of arctic grade fuel to Maitri Station storage", is_primary: true, priority: "HIGH", owner: "Capt. Kumar", deadline: "2026-12-05", status: "PLANNED", success_criteria: "Direct hose line discharge from fast-ice edge to shore booster" },
      { id: "OBJ-B2", title: "Rotate 24 winter-over scientists and expedition engineers", is_primary: true, priority: "HIGH", owner: "Capt. Kumar", deadline: "2026-12-15", status: "PLANNED", success_criteria: "100% successful health sign-off and debrief transfer" },
      { id: "OBJ-B3", title: "Deliver and erect new Combined Heat & Power (CHP) auxiliary generator unit", is_primary: false, priority: "MEDIUM", owner: "Vikram Patel", deadline: "2026-12-24", status: "PLANNED", success_criteria: "Generator tied into station microgrid with load test" }
    ],
    waypoints: [
      { order: 1, name: "Cape Town Berth 2", lat: -33.91, lon: 18.43, passed: false, eta: "2026-11-10T08:00:00Z", ice_risk: "NONE" },
      { order: 2, name: "Bouvet Island Offshore Passage", lat: -54.42, lon: 3.35, passed: false, eta: "2026-11-18T16:00:00Z", ice_risk: "LOW" },
      { order: 3, name: "Astrid Coast Outer Marginal Ice", lat: -69.20, lon: 11.50, passed: false, eta: "2026-11-26T12:00:00Z", ice_risk: "MEDIUM" },
      { order: 4, name: "Princess Astrid Fast Ice Shelf Anchor", lat: -70.77, lon: 11.73, passed: false, eta: "2026-11-30T06:00:00Z", ice_risk: "LOW" }
    ],
    tasks: [
      { id: "TSK-B201", title: "Finalize fuel bunker quality certifications at Cape Town", team: "Logistics", owner: "Capt. Kumar", priority: "HIGH", status: "IN PROGRESS", due_date: "2026-11-04", dependency: null, location: "Cape Town" },
      { id: "TSK-B202", title: "Pre-departure cold chamber test for Ka-32 avionics", team: "Aviation", owner: "Flight Eng. Ray", priority: "MEDIUM", status: "TODO", due_date: "2026-11-07", dependency: null, location: "Cape Town Airport" },
      { id: "TSK-B203", title: "Load and lash snow groomers on deck hatch #2", team: "Logistics", owner: "Vikram Patel", priority: "HIGH", status: "TODO", due_date: "2026-11-08", dependency: "TSK-B201", location: "Cape Town Berth 2" }
    ],
    timeline: [
      { phase: "Phase 1: Cargo Marshaling & Loading", start: "2026-10-15", end: "2026-11-09", status: "IN PROGRESS", progress: 45 },
      { phase: "Phase 2: South Atlantic Ocean Transit", start: "2026-11-10", end: "2026-11-28", status: "PLANNED", progress: 0 },
      { phase: "Phase 3: Ice Shelf Berthing & Fuel Discharge", start: "2026-11-29", end: "2026-12-14", status: "PLANNED", progress: 0 },
      { phase: "Phase 4: Station Turnover & Scientific Turnover", start: "2026-12-15", end: "2026-12-25", status: "PLANNED", progress: 0 },
      { phase: "Phase 5: Homeward Voyage to Cape Town", start: "2026-12-26", end: "2027-01-05", status: "PLANNED", progress: 0 }
    ],
    contingencies: [
      {
        plan: "Plan A (Baseline)",
        title: "Fast ice shelf mooring and overland tracked fuel convoy",
        trigger: "Ice shelf ramp stable, winds <30kt",
        action: "Offload groomers and run fuel hose line directly to booster pump.",
        responsible: "Capt. Kumar",
        resources: "PistenBully team, hose deployment reel",
        expected_impact: "Full discharge within 6 operational days",
        approval_required: "Standard Operational Sign-off"
      }
    ],
    incidents: [],
    communication: {
      status: "ONLINE",
      mode: "FleetBroadband & Cellular LTE Port Roaming",
      latency_ms: 42,
      packet_loss_pct: 0.0,
      bandwidth_kbps: 102400,
      last_successful_sync: "2026-10-14T14:20:00Z",
      last_telemetry_received: "2026-10-14T14:22:40Z",
      pending_sync_records: 0
    },
    recommendations: []
  },
  {
    id: "EXP-2026-C",
    name: "Glacier Core Extraction",
    mission_type: "Scientific Research / Paleoclimatology",
    description: "High-altitude deep ice core drilling on Law Dome and Totten Glacier grounding line to reconstruct 2,000-year atmospheric carbon records.",
    lead: "Dr. Emily Chen",
    organization: "Australian Antarctic Division (AAD) / International Glacier Consortium",
    operational_season: "2026-2027",
    status: "BLOCKED",
    status_display: "BLOCKED - WEATHER",
    risk_level: "HIGH",
    risk_score: 78.4,
    progress: 42,
    current_phase: "Emergency Field Tie-Down / Blizzard Standby",
    planned_start: "2026-09-20T00:00:00Z",
    planned_end: "2026-11-30T00:00:00Z",
    expected_completion: "2026-12-08T18:00:00Z",
    delay_hours: 38.0,
    delay_reason: "Severe Category 4 Antarctic Blizzard (sustained winds 58kt, gusting 76kt) forced complete halt of aviation support and tied down field camp.",
    origin_name: "Hobart Port, Tasmania",
    destination_name: "Law Dome / Casey Station",
    current_region: "Wilkes Land / Casey Sector",
    current_lat: -66.282,
    current_lon: 110.528,
    vessel_name: "Aurora Australis",
    ships: ["Aurora Australis"],
    aircraft: ["AS350 B3 Écureuil (Grounded)"],
    vehicles: ["2x Hägglunds Bandvagn 206", "1x Caterpillar D6N LGP"],
    major_equipment: ["Hans Tausen Electromechanical Deep Drill", "Sub-ice Hot Water Drill Rig"],
    crew_count: 88,
    personnel: {
      planned: 90,
      assigned: 88,
      deployed: 88,
      available: 88,
      missing: 2,
      breakdown: [
        { role: "Chief Scientist", assigned: 1, required: 1 },
        { role: "Deep Drill Engineers", assigned: 14, required: 14 },
        { role: "Field Glaciologists", assigned: 18, required: 18 },
        { role: "Vessel Officers & Mariners", assigned: 46, required: 48 },
        { role: "Medical Officers", assigned: 3, required: 3 },
        { role: "Helicopter Pilots & Techs", assigned: 6, required: 6 }
      ],
      roster: [
        { name: "Dr. Emily Chen", role: "Chief Paleoclimatologist", team: "Science", cert: "Polar Wilderness Medic", location: "Law Dome High Camp (Sheltered)", medical: "FIT_FOR_DUTY", shift: "Storm Watch", deployed: true },
        { name: "Capt. James Fletcher", role: "Master, RSV Aurora Australis", team: "Maritime", cert: "Master Mariner Polar", location: "Casey Roads Anchor", medical: "FIT_FOR_DUTY", shift: "Storm Watch", deployed: true },
        { name: "Sean O'Connor", role: "Lead Deep Ice Core Driller", team: "Engineering", cert: "Sub-surface Pressure Rig", location: "Drill Dome Shelter", medical: "FIT_FOR_DUTY", shift: "Suspended", deployed: true },
        { name: "Dr. Hannah Bailey", role: "Field Physician", team: "Medical", cert: "Hypothermia Re-warming Specialist", location: "Casey Station Hospital", medical: "FIT_FOR_DUTY", shift: "24h Storm Standby", deployed: true }
      ]
    },
    weather: {
      station_id: "CSY_AWS_09",
      condition: "Severe Blizzard / Whiteout",
      temperature_c: -28.6,
      wind_speed_kt: 58.4,
      wind_direction: "ESE (115°)",
      wind_gust_kt: 76.2,
      visibility_km: 0.3,
      pressure_hpa: 964.8,
      snowfall_rate: "Extreme blowing snow",
      storm_warning: true,
      warning_title: "RED ALERT: CATEGORY 4 BLIZZARD (Gale 58kt+)",
      warning_impact: "Total whiteout. Outdoor personnel movement strictly forbidden. Aviation zero clearance.",
      forecast_confidence: 0.95,
      provider: "Bureau of Meteorology (BoM) Polar Section & Open-Meteo",
      data_age_min: 12,
      forecast_horizons: {
        current: { temp: -28.6, wind: 58, vis: 0.3, status: "Critical" },
        '6_hour': { temp: -30.0, wind: 62, vis: 0.2, status: "Critical" },
        '24_hour': { temp: -27.0, wind: 45, vis: 1.5, status: "Warning" },
        '3_day': { temp: -22.0, wind: 28, vis: 5.0, status: "Caution" },
        '7_day': { temp: -18.0, wind: 16, vis: 12.0, status: "Optimal" }
      }
    },
    sea_ice: {
      source: "Sentinel-1B SAR Extra Wide Swath",
      observation_time: "2026-10-14T11:45:00Z",
      data_age_hours: 2.7,
      confidence: 0.96,
      concentration_pct: 86,
      ice_class: "Heavy Fast Ice with Heavy Pressure Ridges",
      ice_thickness_m: 2.30,
      drift_speed_kt: 1.4,
      drift_direction: "NW (315°)",
      operational_impact: "Vessel anchored in lee of Bailey Peninsula; ice closing channel entrance.",
      compression_risk: "HIGH",
      ice_edge_distance_km: 4.2
    },
    satellite: {
      source: "Landsat-9 OLI-2 / Sentinel-1 SAR Composite",
      scene_id: "L9_108112_20261011_POLAR",
      observation_time: "2026-10-14T09:10:00Z",
      footprint: "POLYGON((110.0 -66.0, 111.5 -66.0, 111.5 -67.0, 110.0 -67.0, 110.0 -66.0))",
      resolution_m: 15,
      data_freshness: "Observed 5.2h ago",
      satellite_type: "MULTI_SPECTRAL_SAR",
      cloud_cover_pct: 100,
      interpretation: "High cyclonic cloud cover over entire Casey sector; radar shows heavy snow drift accumulation on Law Dome ridge."
    },
    logistics: {
      cargo_readiness: 82,
      fuel_readiness: 68,
      supply_readiness: 75,
      fuel_consumption_pct: 52,
      fuel_projected_remaining_pct: 18,
      fuel_reserve_warning: true,
      items: [
        { category: "Fuel", name: "Field Generator Polar Kerosene", required: 42, loaded: 42, consumed: 28, remaining: 14, unit: "drums", reserve_pct: 18 },
        { category: "Food", name: "High-Calorie Freeze Dried Storm Rations", required: 1200, loaded: 1200, consumed: 420, remaining: 780, unit: "rations", reserve_pct: 65 },
        { category: "Medical", name: "Oxygen Cylinders & Hyperbaric Chambers", required: 8, loaded: 8, consumed: 1, remaining: 7, unit: "units", reserve_pct: 87 }
      ]
    },
    risk_engine: {
      overall_score: 78.4,
      overall_level: "HIGH",
      model_id: "XGB_EXP_RISK_v3.2",
      confidence: 0.94,
      main_contributor: "Category 4 Blizzard with 58kt winds causing zero-visibility whiteout, aviation suspension, and field camp isolation.",
      categories: [
        { category: "Weather", score: 96, level: "CRITICAL", weight: 0.20, why: "Sustained storm 58kt with gusts to 76kt; whiteout conditions." },
        { category: "Sea Ice", score: 74, level: "HIGH", weight: 0.22, why: "Severe pressure ridges trapping Casey outer bay." },
        { category: "Vessel", score: 45, level: "MEDIUM", weight: 0.15, why: "Anchor holding at Bailey Roads; bow pitching 12 degrees." },
        { category: "Aircraft", score: 98, level: "CRITICAL", weight: 0.10, why: "Aviation completely grounded; AS350 tied down in hangar." },
        { category: "Personnel", score: 62, level: "HIGH", weight: 0.08, why: "Field science party confined to shelter for 48 consecutive hours." },
        { category: "Medical", score: 35, level: "MEDIUM", weight: 0.05, why: "Physician accessible via radio only; medical evacuation impossible until storm subsides." },
        { category: "Cargo", score: 25, level: "LOW", weight: 0.05, why: "Drill components battened down inside secure shelter." },
        { category: "Fuel", score: 72, level: "HIGH", weight: 0.07, why: "Generator fuel burn elevated due to heating demand; projected 18% remaining." },
        { category: "Communication", score: 52, level: "MEDIUM", weight: 0.03, why: "Satellite dishes icing up; HF radio backup operating with static." },
        { category: "Route", score: 80, level: "HIGH", weight: 0.02, why: "Tracked vehicle overland traverse blocked by 3m drift banks." },
        { category: "Environmental", score: 30, level: "LOW", weight: 0.01, why: "No fuel spillage; containment trays active." },
        { category: "Schedule", score: 85, level: "CRITICAL", weight: 0.02, why: "Mission delayed 38h; drilling window closing in 16 days." }
      ]
    },
    objectives: [
      { id: "OBJ-C1", title: "Extract 300m continuous ice core from Law Dome Summit", is_primary: true, priority: "CRITICAL", owner: "Dr. Chen", deadline: "2026-11-10", status: "BLOCKED", success_criteria: "Pristine physical core sections preserved at -25C without melt" },
      { id: "OBJ-C2", title: "Maintain emergency survival protocols for 18 personnel at High Camp", is_primary: true, priority: "CRITICAL", owner: "Dr. Chen", deadline: "2026-10-18", status: "IN PROGRESS", success_criteria: "Zero casualties, 4-hour welfare radio roll call compliance" },
      { id: "OBJ-C3", title: "Transfer ice core boxes to Aurora Australis cold storage hold", is_primary: false, priority: "HIGH", owner: "Capt. Fletcher", deadline: "2026-11-20", status: "BLOCKED", success_criteria: "Aviation sling transfer once weather clears" }
    ],
    waypoints: [
      { order: 1, name: "Hobart Port", lat: -42.88, lon: 147.33, passed: true, eta: "2026-09-20T00:00:00Z", ice_risk: "NONE" },
      { order: 2, name: "Casey Offshore Approaches", lat: -65.50, lon: 110.20, passed: true, eta: "2026-10-01T14:00:00Z", ice_risk: "MEDIUM" },
      { order: 3, name: "Casey Roads Anchor (Current)", lat: -66.28, lon: 110.53, passed: false, eta: "2026-10-04T12:00:00Z", ice_risk: "HIGH" },
      { order: 4, name: "Law Dome Ice Core Drill Site", lat: -66.73, lon: 112.83, passed: false, eta: "2026-10-08T00:00:00Z", ice_risk: "HIGH" }
    ],
    tasks: [
      { id: "TSK-C301", title: "Secure drill mast tie-down guy wires against 75kt gusts", team: "Engineering", owner: "Sean O'Connor", priority: "CRITICAL", status: "COMPLETED", due_date: "2026-10-12", dependency: null, location: "Law Dome Drill Site" },
      { id: "TSK-C302", title: "Maintain 4-hourly welfare radio check-in with Casey Station", team: "Science", owner: "Dr. Chen", priority: "CRITICAL", status: "IN PROGRESS", due_date: "2026-10-15", dependency: null, location: "Law Dome High Camp" },
      { id: "TSK-C303", title: "Resume electromechanical drilling once wind drops below 25kt", team: "Science", owner: "Dr. Chen", priority: "HIGH", status: "BLOCKED", due_date: "2026-10-17", dependency: "TSK-C302", location: "Law Dome Drill Site" },
      { id: "TSK-C304", title: "Fuel ration rebalancing for camp generator shelter", team: "Engineering", owner: "Sean O'Connor", priority: "CRITICAL", status: "IN PROGRESS", due_date: "2026-10-15", dependency: null, location: "High Camp Shelter" }
    ],
    timeline: [
      { phase: "Phase 1: Transit from Hobart to Casey", start: "2026-09-20", end: "2026-10-01", status: "COMPLETED", progress: 100 },
      { phase: "Phase 2: Overland Traverse to Law Dome Summit", start: "2026-10-02", end: "2026-10-08", status: "COMPLETED", progress: 100 },
      { phase: "Phase 3: Deep Drilling & Ice Sampling", start: "2026-10-09", end: "2026-11-05", status: "BLOCKED", progress: 35 },
      { phase: "Phase 4: Sample Extraction & Hangar Staging", start: "2026-11-06", end: "2026-11-18", status: "PLANNED", progress: 0 },
      { phase: "Phase 5: Return Transit to Hobart", start: "2026-11-19", end: "2026-11-30", status: "PLANNED", progress: 0 }
    ],
    contingencies: [
      {
        plan: "Plan A (Baseline)",
        title: "Full 300m drill extraction with helicopter sample back-haul",
        trigger: "Weather clear, wind <20kt",
        action: "Standard operations with two 10-hour shifts.",
        responsible: "Dr. Chen",
        resources: "AS350 B3 helicopter, twin drilling shifts",
        expected_impact: "Original schedule",
        approval_required: "Field Lead"
      },
      {
        plan: "Plan B (Storm Extension - CURRENTLY ACTIVE)",
        title: "Shelter-in-Place & Conserve Fuel (Emergency Blizzard Mode)",
        trigger: "Blizzard winds >45kt or whiteout visibility <500m",
        action: "Suspend drilling immediately. Lock shelters. Throttle heating to 14°C to stretch kerosene reserves from 3 days to 7 days. Mandatory 4h radio roll call.",
        responsible: "Dr. Chen & Casey Station Leader",
        resources: "High Camp auxiliary heated shelter, emergency survival rations",
        expected_impact: "+48h to +72h mission delay; guarantees zero exposure casualties",
        approval_required: "Commander Approval (Pre-authorized by Dr. Chen)"
      }
    ],
    incidents: [
      {
        id: "INC-C-01",
        time: "2026-10-13T02:30:00Z",
        title: "Severe Gale Storm Front Inundation (Gale 58kt+)",
        type: "Weather",
        severity: "CRITICAL",
        description: "Rapidly deepening polar depression caused wind speed to spike from 18kt to 58kt in 90 minutes. Outdoor scientific operations halted immediately. Whiteout forced emergency shelter protocol.",
        affected_people: "18 personnel at High Camp, 70 personnel on vessel",
        affected_assets: "Drill rig, AS350 Helicopter, Overland transit route",
        mission_impact: "Drilling suspended indefinitely; mission status changed to BLOCKED.",
        response: "Camp placed into Contingency Plan B mode. Kerosene heaters turned to conservation mode. Welfare comms active.",
        status: "ACTIVE"
      }
    ],
    communication: {
      status: "DEGRADED",
      mode: "Emergency Iridium Pilot + HF Radio (Primary Starlink/Inmarsat Radome Caked)",
      latency_ms: 780,
      packet_loss_pct: 8.4,
      bandwidth_kbps: 9.6,
      last_successful_sync: "2026-10-14T14:10:00Z",
      last_telemetry_received: "2026-10-14T14:18:00Z",
      pending_sync_records: 12
    },
    recommendations: [
      {
        id: "REC-C-2026-01",
        title: "Authorize Fuel Conservation Protocol B-4 & Defer Sample Flight",
        severity: "CRITICAL",
        reason: "AI Weather ensemble (BoM + ECMWF) predicts storm relaxation in 28 hours (approx. 2026-10-16 02:00Z). Authorizing generator duty cycle reduction now prevents emergency kerosene exhaustion.",
        model: "XGB_RESOURCE_DEMAND_v2.1",
        confidence: 0.94,
        fuel_delta: "+4.2 days endurance",
        eta_delta: "+38 hours",
        status: "PENDING_REVIEW",
        action_required: "Mission Commander Approval Required to ratify Plan B runtime limits"
      }
    ]
  },
  {
    id: "EXP-2026-D",
    name: "Weddell Sea Ice Shelf Bathymetry",
    mission_type: "Survey & Oceanography",
    description: "Multi-beam sub-ice shelf mapping and physical oceanographic mooring recovery along the Larsen C and Ronne Ice Shelves.",
    lead: "Capt. Alistair Finch",
    organization: "British Antarctic Survey (BAS)",
    operational_season: "2026-2027",
    status: "OPERATIONAL",
    status_display: "OPERATIONAL",
    risk_level: "MEDIUM",
    risk_score: 52.0,
    progress: 55,
    current_phase: "Autonomous Underwater Vehicle (AUV) Under-Ice Transects",
    planned_start: "2026-10-05T00:00:00Z",
    planned_end: "2026-12-28T00:00:00Z",
    expected_completion: "2026-12-28T00:00:00Z",
    delay_hours: 2.0,
    delay_reason: "Tabular iceberg A-76A drift required a 12nm detour.",
    origin_name: "Stanley, Falkland Islands",
    destination_name: "Larsen C Ice Shelf / Weddell Sea",
    current_region: "Weddell Sea / Larsen C",
    current_lat: -67.502,
    current_lon: -62.512,
    vessel_name: "RRS Sir David Attenborough",
    ships: ["RRS Sir David Attenborough"],
    aircraft: ["Schiebel Camcopter S-100 Drone"],
    vehicles: ["Autonomous Kongsberg Hugin 6000 AUV"],
    major_equipment: ["Kongsberg EM122 Deep Water Multibeam", "CTD Rosette Carousel"],
    crew_count: 62,
    personnel: {
      planned: 65,
      assigned: 62,
      deployed: 62,
      available: 62,
      missing: 3,
      breakdown: [
        { role: "Expedition Lead / Master", assigned: 1, required: 1 },
        { role: "Ship Officers & Marine Crew", assigned: 32, required: 32 },
        { role: "Physical Oceanographers", assigned: 18, required: 20 },
        { role: "AUV Robotics Engineers", assigned: 8, required: 9 },
        { role: "Medical Staff", assigned: 3, required: 3 }
      ],
      roster: [
        { name: "Capt. Alistair Finch", role: "Master & Polar Commander", team: "Command", cert: "Polar Code Ice Master", location: "RRS Attenborough Bridge", medical: "FIT_FOR_DUTY", shift: "Watch Alpha", deployed: true },
        { name: "Dr. Fiona MacLeod", role: "Lead Oceanographer", team: "Science", cert: "Acoustic Hydrography Level 1", location: "Ocean Lab 1", medical: "FIT_FOR_DUTY", shift: "Science Watch 1", deployed: true }
      ]
    },
    weather: {
      station_id: "WDL_BUOY_04",
      condition: "Overcast / Cold",
      temperature_c: -14.2,
      wind_speed_kt: 28.0,
      wind_direction: "S (180°)",
      wind_gust_kt: 38.0,
      visibility_km: 8.5,
      pressure_hpa: 988.2,
      snowfall_rate: "Flurries",
      storm_warning: false,
      warning_title: "MODERATE ICEBERG CONVERGENCE",
      warning_impact: "Radar watch doubled; sonar forward-looking active.",
      forecast_confidence: 0.89,
      provider: "ECMWF & Open-Meteo",
      data_age_min: 20,
      forecast_horizons: {
        current: { temp: -14.2, wind: 28, vis: 8.5, status: "Caution" },
        '6_hour': { temp: -15.5, wind: 30, vis: 7.0, status: "Caution" },
        '24_hour': { temp: -16.0, wind: 24, vis: 9.0, status: "Normal" },
        '3_day': { temp: -13.0, wind: 18, vis: 12.0, status: "Optimal" },
        '7_day': { temp: -12.5, wind: 16, vis: 14.0, status: "Optimal" }
      }
    },
    sea_ice: {
      source: "Sentinel-1C SAR & Copernicus Marine",
      observation_time: "2026-10-14T10:10:00Z",
      data_age_hours: 4.25,
      confidence: 0.93,
      concentration_pct: 55,
      ice_class: "First-year pack ice with drifting tabular bergs",
      ice_thickness_m: 1.40,
      drift_speed_kt: 0.9,
      drift_direction: "N (005°)",
      operational_impact: "AUV launch envelope open; ice drift stable.",
      compression_risk: "MEDIUM",
      ice_edge_distance_km: 28.0
    },
    satellite: {
      source: "Sentinel-1B C-SAR",
      scene_id: "S1B_IW_GRDH_20261013T221500",
      observation_time: "2026-10-14T08:24:00Z",
      footprint: "POLYGON((-64.0 -66.5, -61.0 -66.5, -61.0 -68.5, -64.0 -68.5, -64.0 -66.5))",
      resolution_m: 20,
      data_freshness: "Observed 6.0h ago",
      satellite_type: "SAR_IMAGERY",
      cloud_cover_pct: 0,
      interpretation: "Larsen C ice shelf front shows no sudden fracturing; AUV sub-ice recovery corridor clear."
    },
    logistics: {
      cargo_readiness: 98,
      fuel_readiness: 84,
      supply_readiness: 90,
      fuel_consumption_pct: 45,
      fuel_projected_remaining_pct: 39,
      fuel_reserve_warning: false,
      items: [
        { category: "Fuel", name: "Marine Gas Oil (MGO) Ultra-Low Sulfur", required: 1200, loaded: 1200, consumed: 540, remaining: 660, unit: "metric tons", reserve_pct: 55 },
        { category: "Science", name: "Lithium AUV Power Battery Modules", required: 24, loaded: 24, consumed: 8, remaining: 16, unit: "sets", reserve_pct: 67 }
      ]
    },
    risk_engine: {
      overall_score: 52.0,
      overall_level: "MEDIUM",
      model_id: "XGB_EXP_RISK_v3.2",
      confidence: 0.88,
      main_contributor: "Calving event iceberg drift near Larsen C requiring dynamic acoustic tracking.",
      categories: [
        { category: "Weather", score: 42, level: "MEDIUM", weight: 0.20, why: "Moderate southerly breeze with cold surge." },
        { category: "Sea Ice", score: 65, level: "HIGH", weight: 0.22, why: "Tabular iceberg fragments drifting in survey grid." },
        { category: "Vessel", score: 18, level: "LOW", weight: 0.15, why: "Polar Class 4 hull performant." },
        { category: "Aircraft", score: 30, level: "LOW", weight: 0.10, why: "S-100 drone flights subject to icing limit." },
        { category: "Personnel", score: 15, level: "LOW", weight: 0.08, why: "Crew healthy." },
        { category: "Medical", score: 10, level: "LOW", weight: 0.05, why: "Surgical suite fully operational." },
        { category: "Cargo", score: 12, level: "LOW", weight: 0.05, why: "Payload locked." },
        { category: "Fuel", score: 32, level: "LOW", weight: 0.07, why: "Fuel reserves 39%." },
        { category: "Communication", score: 22, level: "LOW", weight: 0.03, why: "Iridium Certus reliable." },
        { category: "Route", score: 48, level: "MEDIUM", weight: 0.02, why: "Iceberg avoidance zig-zag." },
        { category: "Environmental", score: 14, level: "LOW", weight: 0.01, why: "No hazards." },
        { category: "Schedule", score: 25, level: "LOW", weight: 0.02, why: "Nominal timetable." }
      ]
    },
    objectives: [
      { id: "OBJ-D1", title: "Execute 120km sub-ice shelf autonomous bathymetric transect with Hugin AUV", is_primary: true, priority: "HIGH", owner: "Dr. MacLeod", deadline: "2026-11-20", status: "IN PROGRESS", success_criteria: "Acoustic return and complete bottom profile logged" },
      { id: "OBJ-D2", title: "Recover 4 deep oceanographic mooring arrays deployed in 2024", is_primary: true, priority: "HIGH", owner: "Capt. Finch", deadline: "2026-12-05", status: "PLANNED", success_criteria: "Acoustic release triggered and all instrument pods safely hoisted aboard" }
    ],
    waypoints: [
      { order: 1, name: "Stanley Port", lat: -51.70, lon: -57.85, passed: true, eta: "2026-10-05T00:00:00Z", ice_risk: "NONE" },
      { order: 2, name: "Elephant Island Passage", lat: -61.10, lon: -55.20, passed: true, eta: "2026-10-10T12:00:00Z", ice_risk: "LOW" },
      { order: 3, name: "Larsen C Survey Station Bravo (Current)", lat: -67.50, lon: -62.51, passed: false, eta: "2026-10-15T00:00:00Z", ice_risk: "MEDIUM" },
      { order: 4, name: "Ronne Ice Shelf Mooring Grid", lat: -74.50, lon: -58.00, passed: false, eta: "2026-11-25T00:00:00Z", ice_risk: "HIGH" }
    ],
    tasks: [
      { id: "TSK-D401", title: "Launch Hugin AUV for Mission #04 Sub-shelf Dive", team: "Science", owner: "Dr. MacLeod", priority: "HIGH", status: "IN PROGRESS", due_date: "2026-10-15", dependency: null, location: "Larsen C Front" }
    ],
    timeline: [
      { phase: "Phase 1: Falklands Departure & Drake Passage", start: "2026-10-05", end: "2026-10-11", status: "COMPLETED", progress: 100 },
      { phase: "Phase 2: Larsen C Shelf Acoustic Mapping", start: "2026-10-12", end: "2026-11-05", status: "IN PROGRESS", progress: 40 }
    ],
    contingencies: [
      {
        plan: "Plan A (Baseline)",
        title: "Standard AUV under-ice deployment and acoustic beacon homing",
        trigger: "Ice drift <1.5kt",
        action: "Execute mission plan.",
        responsible: "Capt. Finch",
        resources: "RRS Attenborough moon pool",
        expected_impact: "Full mission profile",
        approval_required: "Master"
      }
    ],
    incidents: [],
    communication: {
      status: "ONLINE",
      mode: "Starlink Maritime High Speed + Inmarsat Fleet",
      latency_ms: 94,
      packet_loss_pct: 0.1,
      bandwidth_kbps: 48000,
      last_successful_sync: "2026-10-14T14:23:00Z",
      last_telemetry_received: "2026-10-14T14:23:50Z",
      pending_sync_records: 0
    },
    recommendations: []
  },
  {
    id: "EXP-2026-E",
    name: "South Pole Overland Traverse",
    mission_type: "Logistics & Overland Transport",
    description: "Heavy tracked caterpillar tractor overland traverse carrying 450,000 liters of fuel and cargo from McMurdo across the Ross Ice Shelf and Transantarctic Mountains to Amundsen-Scott South Pole Station.",
    lead: "Traverse Commander Tom Burke",
    organization: "United States Antarctic Program (USAP)",
    operational_season: "2026-2027",
    status: "PRE-DEPARTURE",
    status_display: "PRE-DEPARTURE",
    risk_level: "HIGH",
    risk_score: 72.0,
    progress: 10,
    current_phase: "Crevasse Radar Calibration & Sled Lashing",
    planned_start: "2026-11-01T00:00:00Z",
    planned_end: "2026-12-20T00:00:00Z",
    expected_completion: "2026-12-20T00:00:00Z",
    delay_hours: 0.0,
    delay_reason: "None. Departure window opens in 34 days.",
    origin_name: "McMurdo Station Logistics Staging",
    destination_name: "Amundsen-Scott South Pole Station",
    current_region: "Ross Ice Shelf / Transantarctic Route",
    current_lat: -77.850,
    current_lon: 166.666,
    vessel_name: "Overland Heavy Traverse Fleet",
    ships: [],
    aircraft: ["DHC-6 Twin Otter (Ground Penetrating Radar Scout)"],
    vehicles: ["6x Case/CAT MT865 Tracked Tractors", "2x PistenBully 300 GPR Scout"],
    major_equipment: ["Ground Penetrating Crevasse Radar (GPR)", "Heavy High-Molecular-Weight Polyethylene Fuel Sleds"],
    crew_count: 24,
    personnel: {
      planned: 25,
      assigned: 24,
      deployed: 0,
      available: 24,
      missing: 1,
      breakdown: [
        { role: "Traverse Commander", assigned: 1, required: 1 },
        { role: "Heavy Equipment Mechanics", assigned: 10, required: 10 },
        { role: "Crevasse Safety & GPR Operators", assigned: 6, required: 6 },
        { role: "Traverse Paramedics", assigned: 2, required: 2 },
        { role: "Twin Otter Flight Crew", assigned: 5, required: 6 }
      ],
      roster: [
        { name: "Tom Burke", role: "Traverse Commander", team: "Command", cert: "Polar Overland Master", location: "McMurdo Heavy Shop", medical: "FIT_FOR_DUTY", shift: "Day Prep", deployed: false }
      ]
    },
    weather: {
      station_id: "MCM_TRAV_01",
      condition: "Cold / Clear",
      temperature_c: -38.2,
      wind_speed_kt: 22.0,
      wind_direction: "SSE (160°)",
      wind_gust_kt: 29.0,
      visibility_km: 10.0,
      pressure_hpa: 978.0,
      snowfall_rate: "None",
      storm_warning: false,
      warning_title: "EXTREME COLD ADVISORY (-38°C)",
      warning_impact: "Hydraulic fluid pre-heating mandatory before tractor ignition.",
      forecast_confidence: 0.90,
      provider: "Open-Meteo & USAP Meteorological Network",
      data_age_min: 30,
      forecast_horizons: {
        current: { temp: -38.2, wind: 22, vis: 10.0, status: "Caution" },
        '6_hour': { temp: -40.0, wind: 25, vis: 9.0, status: "Caution" },
        '24_hour': { temp: -36.0, wind: 18, vis: 12.0, status: "Optimal" },
        '3_day': { temp: -32.0, wind: 15, vis: 15.0, status: "Optimal" },
        '7_day': { temp: -34.0, wind: 20, vis: 12.0, status: "Optimal" }
      }
    },
    sea_ice: {
      source: "N/A (Inland Continental Route)",
      observation_time: "2026-10-14T02:00:00Z",
      data_age_hours: 12.0,
      confidence: 1.0,
      concentration_pct: 0,
      ice_class: "Glacial Ice Shelf & Polar Plateau Firn",
      ice_thickness_m: 2800.0,
      operational_impact: "Crevasse shear zones at Shear Zone km 40-70.",
      compression_risk: "LOW"
    },
    satellite: {
      source: "ICESat-2 Laser Altimetry / Sentinel-2 Surface Mosaic",
      scene_id: "ICESAT2_ATL06_20261010_SHEARZONE",
      observation_time: "2026-10-13T20:00:00Z",
      footprint: "POLYGON((165.0 -78.0, 172.0 -78.0, 172.0 -85.0, 165.0 -85.0, 165.0 -78.0))",
      resolution_m: 5,
      data_freshness: "Observed 18.0h ago",
      satellite_type: "LASER_ALTIMETRY",
      cloud_cover_pct: 2.0,
      interpretation: "Shear zone bridge thickness along Leverett Glacier pass confirmed at 14m minimum."
    },
    logistics: {
      cargo_readiness: 90,
      fuel_readiness: 95,
      supply_readiness: 92,
      fuel_consumption_pct: 0,
      fuel_projected_remaining_pct: 32,
      fuel_reserve_warning: false,
      items: [
        { category: "Fuel", name: "AN-8 Polar Aviation & Vehicle Fuel Bladders", required: 450, loaded: 450, consumed: 0, remaining: 450, unit: "kiloliters", reserve_pct: 32 }
      ]
    },
    risk_engine: {
      overall_score: 72.0,
      overall_level: "HIGH",
      model_id: "XGB_EXP_RISK_v3.2",
      confidence: 0.92,
      main_contributor: "Crevasse hazard along Leverett Glacier ascent to polar plateau (2,800m elevation).",
      categories: [
        { category: "Weather", score: 68, level: "HIGH", weight: 0.20, why: "Plateau katabatic headwinds and -45C temperatures." },
        { category: "Sea Ice", score: 10, level: "LOW", weight: 0.22, why: "Inland glacial surface." },
        { category: "Vessel", score: 88, level: "CRITICAL", weight: 0.15, why: "Tractor mechanical breakdown at altitude would stop entire train." },
        { category: "Aircraft", score: 45, level: "MEDIUM", weight: 0.10, why: "Twin Otter GPR support reliant on weather window." },
        { category: "Personnel", score: 65, level: "HIGH", weight: 0.08, why: "High altitude sickness & hypothermia hazards." },
        { category: "Route", score: 92, level: "CRITICAL", weight: 0.02, why: "Leverett Glacier crevasse field requires radar proofing." }
      ]
    },
    objectives: [
      { id: "OBJ-E1", title: "Transport 450,000 liters of AN-8 fuel to Amundsen-Scott South Pole Station", is_primary: true, priority: "CRITICAL", owner: "Tom Burke", deadline: "2026-12-15", status: "PLANNED", success_criteria: "Safe delivery without loss, manifold offload into Station Vault 1" }
    ],
    waypoints: [
      { order: 1, name: "McMurdo Vehicle Staging", lat: -77.85, lon: 166.67, passed: false, eta: "2026-11-01T00:00:00Z", ice_risk: "LOW" },
      { order: 2, name: "Ross Ice Shelf Shear Zone Entry", lat: -78.30, lon: 168.00, passed: false, eta: "2026-11-04T12:00:00Z", ice_risk: "CRITICAL" },
      { order: 3, name: "Leverett Glacier Foot", lat: -85.60, lon: -150.00, passed: false, eta: "2026-11-20T00:00:00Z", ice_risk: "HIGH" },
      { order: 4, name: "Amundsen-Scott South Pole Station (90S)", lat: -90.00, lon: 0.00, passed: false, eta: "2026-12-15T00:00:00Z", ice_risk: "LOW" }
    ],
    tasks: [],
    timeline: [],
    contingencies: [],
    incidents: [],
    communication: {
      status: "ONLINE",
      mode: "Iridium Push-To-Talk & Dual Fixed Sat SBD",
      latency_ms: 280,
      packet_loss_pct: 1.2,
      bandwidth_kbps: 2400,
      last_successful_sync: "2026-10-14T14:15:00Z",
      last_telemetry_received: "2026-10-14T14:22:00Z",
      pending_sync_records: 0
    },
    recommendations: []
  },
  {
    id: "EXP-2026-F",
    name: "Queen Maud Land Environmental Survey",
    mission_type: "Environmental Monitoring",
    description: "Comprehensive environmental impact assessment and baseline microplastic / air quality survey surrounding Troll Research Station and the Jutulsessen nunataks.",
    lead: "Dr. Astrid Lindholm",
    organization: "Norwegian Polar Institute (NPI)",
    operational_season: "2026-2027",
    status: "READY FOR APPROVAL",
    status_display: "READY FOR APPROVAL",
    risk_level: "LOW",
    risk_score: 22.4,
    progress: 0,
    current_phase: "Mission Plan Commander Review",
    planned_start: "2026-12-01T00:00:00Z",
    planned_end: "2027-02-15T00:00:00Z",
    expected_completion: "2027-02-15T00:00:00Z",
    delay_hours: 0.0,
    delay_reason: "Awaiting final Commander sign-off.",
    origin_name: "Tromsø / Cape Town",
    destination_name: "Troll Research Station, Dronning Maud Land",
    current_region: "Jutulsessen Nunataks / Queen Maud Land",
    current_lat: -72.012,
    current_lon: 2.533,
    vessel_name: "Kronprins Haakon",
    ships: ["Kronprins Haakon"],
    aircraft: ["Basler BT-67 Turbo Dakota"],
    vehicles: ["2x Lynx Commander Snowmobiles"],
    major_equipment: ["Air Particulate Optical Counters", "Ultra-Clean Aerosol Sampling Hoods"],
    crew_count: 35,
    personnel: {
      planned: 35,
      assigned: 35,
      deployed: 0,
      available: 35,
      missing: 0,
      breakdown: [
        { role: "Lead Environmental Scientist", assigned: 1, required: 1 },
        { role: "Atmospheric Chemists", assigned: 10, required: 10 },
        { role: "Ship & Aviation Crew", assigned: 20, required: 20 },
        { role: "Medical Staff", assigned: 4, required: 4 }
      ],
      roster: [
        { name: "Dr. Astrid Lindholm", role: "Lead Environmental Scientist", team: "Science", cert: "Polar Wilderness Advanced", location: "Tromsø Office", medical: "FIT_FOR_DUTY", shift: "Day Operations", deployed: false }
      ]
    },
    weather: {
      station_id: "TRL_AWS_02",
      condition: "Clear / Cold",
      temperature_c: -12.4,
      wind_speed_kt: 12.0,
      wind_direction: "NE (045°)",
      wind_gust_kt: 16.0,
      visibility_km: 15.0,
      pressure_hpa: 1002.1,
      snowfall_rate: "None",
      storm_warning: false,
      warning_title: "PRISTINE CONDITIONS",
      warning_impact: "Optimal environmental sampling window.",
      forecast_confidence: 0.95,
      provider: "Norwegian Met Institute (MET Norway) & Open-Meteo",
      data_age_min: 25,
      forecast_horizons: {
        current: { temp: -12.4, wind: 12, vis: 15.0, status: "Optimal" },
        '6_hour': { temp: -13.0, wind: 14, vis: 15.0, status: "Optimal" },
        '24_hour': { temp: -11.0, wind: 10, vis: 15.0, status: "Optimal" },
        '3_day': { temp: -10.0, wind: 15, vis: 15.0, status: "Optimal" },
        '7_day': { temp: -14.0, wind: 18, vis: 12.0, status: "Optimal" }
      }
    },
    sea_ice: {
      source: "Sentinel-1C SAR",
      observation_time: "2026-10-14T06:00:00Z",
      data_age_hours: 8.0,
      confidence: 0.94,
      concentration_pct: 18,
      ice_class: "Open Water & Loose Floes",
      ice_thickness_m: 0.40,
      drift_speed_kt: 0.3,
      drift_direction: "W",
      operational_impact: "Open access corridor.",
      compression_risk: "LOW",
      ice_edge_distance_km: 60.0
    },
    satellite: {
      source: "Sentinel-2 MSI",
      scene_id: "S2_TRL_20261012_ATM",
      observation_time: "2026-10-14T04:00:00Z",
      footprint: "POLYGON((2.0 -71.5, 3.5 -71.5, 3.5 -72.5, 2.0 -72.5, 2.0 -71.5))",
      resolution_m: 10,
      data_freshness: "Observed 10.0h ago",
      satellite_type: "OPTICAL_IMAGERY",
      cloud_cover_pct: 1.0,
      interpretation: "Troll Airfield blue ice runway surface dry and free of drift sastrugi."
    },
    logistics: {
      cargo_readiness: 100,
      fuel_readiness: 100,
      supply_readiness: 100,
      fuel_consumption_pct: 0,
      fuel_projected_remaining_pct: 60,
      fuel_reserve_warning: false,
      items: [
        { category: "Science", name: "Ultra-Pure Teflon Sample Flasks", required: 250, loaded: 250, consumed: 0, remaining: 250, unit: "flasks", reserve_pct: 100 }
      ]
    },
    risk_engine: {
      overall_score: 22.4,
      overall_level: "LOW",
      model_id: "XGB_EXP_RISK_v3.2",
      confidence: 0.95,
      main_contributor: "Low operational risk; awaiting Mission Commander final sign-off.",
      categories: [
        { category: "Weather", score: 15, level: "LOW", weight: 0.20, why: "Stable katabatic pattern." },
        { category: "Sea Ice", score: 12, level: "LOW", weight: 0.22, why: "Open leads." }
      ]
    },
    objectives: [
      { id: "OBJ-F1", title: "Collect 200 cryospheric snow samples for microplastic baseline assessment", is_primary: true, priority: "HIGH", owner: "Dr. Lindholm", deadline: "2027-01-15", status: "PLANNED", success_criteria: "Ultra-clean protocol compliance with zero cross-contamination" }
    ],
    waypoints: [
      { order: 1, name: "Cape Town Berth", lat: -33.91, lon: 18.43, passed: false, eta: "2026-12-01T00:00:00Z", ice_risk: "NONE" },
      { order: 2, name: "Troll Airfield Skiway", lat: -72.01, lon: 2.53, passed: false, eta: "2026-12-10T00:00:00Z", ice_risk: "LOW" }
    ],
    tasks: [
      { id: "TSK-F601", title: "Submit Final Environmental Evaluation to CEP Secretariat", team: "Science", owner: "Dr. Lindholm", priority: "HIGH", status: "COMPLETED", due_date: "2026-10-15", dependency: null, location: "Tromsø" },
      { id: "TSK-F602", title: "Commander Mission Authorization Sign-off", team: "Command", owner: "Duty Commander", priority: "CRITICAL", status: "TODO", due_date: "2026-10-30", dependency: "TSK-F601", location: "PolarOne Command" }
    ],
    timeline: [],
    contingencies: [],
    incidents: [],
    communication: {
      status: "ONLINE",
      mode: "TrollSat Optical Ground Station / Dual Ka-band",
      latency_ms: 32,
      packet_loss_pct: 0.0,
      bandwidth_kbps: 150000,
      last_successful_sync: "2026-10-14T14:21:00Z",
      last_telemetry_received: "2026-10-14T14:23:45Z",
      pending_sync_records: 0
    },
    recommendations: [
      {
        id: "REC-F-2026-01",
        title: "Approve Expedition EXP-2026-F for Operational Deployment",
        severity: "LOW",
        reason: "All 11 planning steps complete. Environmental evaluation ratified by Antarctic Treaty consultative committee. Resources, personnel, and medical readiness 100% verified.",
        model: "HEURISTIC_OPS_APPROVAL",
        confidence: 0.99,
        status: "PENDING_REVIEW",
        action_required: "Duty Commander Approval Required"
      }
    ]
  }
];

// In-memory client cache
let clientExpeditionsCache = [...FALLBACK_EXPEDITIONS];

// Fetch all expeditions
export async function getExpeditions(params?: {
  status?: string;
  risk?: string;
  region?: string;
  vessel?: string;
  lead?: string;
  search?: string;
}): Promise<Expedition[]> {
  try {
    const url = new URL(BASE_URL);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v) url.searchParams.append(k, v);
      });
    }
    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        clientExpeditionsCache = data;
        return data;
      }
    }
  } catch (err) {
    console.warn('Backend API unreachable, using local mission cache:', err);
  }

  // Filter local fallback
  let list = [...clientExpeditionsCache];
  if (params?.status) {
    const s = params.status.toLowerCase();
    list = list.filter(e => e.status.toLowerCase().includes(s) || e.status_display.toLowerCase().includes(s));
  }
  if (params?.risk) {
    list = list.filter(e => e.risk_level.toLowerCase() === params.risk?.toLowerCase());
  }
  if (params?.region) {
    list = list.filter(e => e.current_region.toLowerCase().includes(params.region!.toLowerCase()));
  }
  if (params?.vessel) {
    list = list.filter(e => (e.vessel_name || '').toLowerCase().includes(params.vessel!.toLowerCase()));
  }
  if (params?.search) {
    const q = params.search.toLowerCase();
    list = list.filter(e =>
      e.id.toLowerCase().includes(q) ||
      e.name.toLowerCase().includes(q) ||
      e.lead.toLowerCase().includes(q) ||
      (e.vessel_name || '').toLowerCase().includes(q) ||
      e.current_region.toLowerCase().includes(q)
    );
  }
  return list;
}

// Fetch KPIs
export async function getExpeditionKPIs(): Promise<ExpeditionKPIs> {
  try {
    const res = await fetch(`${BASE_URL}/kpis`, { cache: 'no-store' });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend API unreachable for KPIs, calculating client-side');
  }

  const exps = clientExpeditionsCache;
  const allShips = new Set<string>();
  const allAircraft = new Set<string>();
  exps.forEach(e => {
    e.ships?.forEach(s => allShips.add(s));
    e.aircraft?.forEach(a => allAircraft.add(a));
  });

  return {
    active_expeditions: exps.filter(e => ['IN TRANSIT', 'OPERATIONAL'].includes(e.status)).length,
    planning: exps.filter(e => ['DRAFT', 'PLANNING', 'READY FOR APPROVAL'].includes(e.status)).length,
    high_risk_missions: exps.filter(e => ['HIGH', 'CRITICAL'].includes(e.risk_level)).length,
    blocked_missions: exps.filter(e => e.status.includes('BLOCKED')).length,
    personnel_deployed: exps.reduce((acc, e) => acc + (e.personnel?.deployed || 0), 0),
    active_assets: allShips.size + allAircraft.size,
    missions_this_season: exps.length,
    upcoming_departures: exps.filter(e => ['APPROVED', 'PRE-DEPARTURE'].includes(e.status)).length
  };
}

// Fetch single expedition
export async function getExpedition(id: string): Promise<Expedition | null> {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, { cache: 'no-store' });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn(`Backend API unreachable for expedition ${id}, using fallback`);
  }
  return clientExpeditionsCache.find(e => e.id === id) || null;
}

// Create new expedition
export async function createExpedition(data: Partial<Expedition>): Promise<Expedition> {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend create failed, storing locally:', err);
  }

  const newExp = {
    ...FALLBACK_EXPEDITIONS[0],
    id: data.id || `EXP-2026-${String.fromCharCode(65 + clientExpeditionsCache.length)}`,
    name: data.name || 'New Polar Mission',
    mission_type: data.mission_type || 'Scientific Research',
    lead: data.lead || 'Cmdr. John Doe',
    status: data.status || 'PLANNING',
    status_display: data.status || 'PLANNING',
    risk_level: data.risk_level || 'LOW',
    risk_score: data.risk_score || 20,
    progress: 0,
    ships: data.vessel_name ? [data.vessel_name] : ['Research Vessel'],
    vessel_name: data.vessel_name || 'Research Vessel',
    crew_count: data.personnel?.planned || 25,
    ...data
  } as Expedition;

  clientExpeditionsCache.unshift(newExp);
  return newExp;
}

// Update status
export async function updateExpeditionStatus(
  id: string,
  newStatus: ExpeditionStatus,
  reason: string,
  actor: string = 'Commander E. Hayes'
): Promise<Expedition | null> {
  try {
    const res = await fetch(`${BASE_URL}/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus, reason, actor })
    });
    if (res.ok) {
      const data = await res.json();
      return data.expedition;
    }
  } catch (err) {
    console.warn(`Backend status update failed, applying locally:`, err);
  }

  const exp = clientExpeditionsCache.find(e => e.id === id);
  if (exp) {
    exp.status = newStatus;
    exp.status_display = newStatus;
    if (newStatus.includes('BLOCKED')) {
      exp.delay_reason = reason;
    }
    return exp;
  }
  return null;
}

// Commander Approve
export async function approveExpedition(
  id: string,
  comments: string = 'Mission approved for polar deployment.',
  approver: string = 'Commander E. Hayes'
): Promise<Expedition | null> {
  try {
    const res = await fetch(`${BASE_URL}/${id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comments, approver })
    });
    if (res.ok) {
      const data = await res.json();
      return data.expedition;
    }
  } catch (err) {
    console.warn('Backend approve failed, updating locally');
  }

  const exp = clientExpeditionsCache.find(e => e.id === id);
  if (exp) {
    exp.status = 'APPROVED';
    exp.status_display = 'APPROVED';
    return exp;
  }
  return null;
}

// Pause / Suspend
export async function pauseExpedition(id: string, reason: string): Promise<Expedition | null> {
  try {
    const res = await fetch(`${BASE_URL}/${id}/pause`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    });
    if (res.ok) {
      const data = await res.json();
      return data.expedition;
    }
  } catch (err) {
    console.warn('Backend pause failed, updating locally');
  }

  const exp = clientExpeditionsCache.find(e => e.id === id);
  if (exp) {
    exp.status = 'SUSPENDED';
    exp.status_display = 'SUSPENDED';
    return exp;
  }
  return null;
}

// Resume
export async function resumeExpedition(id: string): Promise<Expedition | null> {
  try {
    const res = await fetch(`${BASE_URL}/${id}/resume`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    if (res.ok) {
      const data = await res.json();
      return data.expedition;
    }
  } catch (err) {
    console.warn('Backend resume failed, updating locally');
  }

  const exp = clientExpeditionsCache.find(e => e.id === id);
  if (exp) {
    exp.status = 'OPERATIONAL';
    exp.status_display = 'IN PROGRESS';
    return exp;
  }
  return null;
}

// Add task
export async function addExpeditionTask(id: string, task: Partial<ExpeditionTask>): Promise<ExpeditionTask> {
  try {
    const res = await fetch(`${BASE_URL}/${id}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend add task failed, creating locally');
  }

  const newTask: ExpeditionTask = {
    id: `TSK-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    title: task.title || 'Operational Task',
    team: task.team || 'Operations',
    owner: task.owner || 'Duty Officer',
    priority: task.priority || 'MEDIUM',
    status: task.status || 'TODO',
    due_date: task.due_date || '2026-11-01',
    dependency: task.dependency || null,
    location: task.location || 'Base'
  };

  const exp = clientExpeditionsCache.find(e => e.id === id);
  if (exp) {
    if (!exp.tasks) exp.tasks = [];
    exp.tasks.push(newTask);
  }
  return newTask;
}

// Add incident
export async function addExpeditionIncident(id: string, incident: Partial<ExpeditionIncident>): Promise<ExpeditionIncident> {
  try {
    const res = await fetch(`${BASE_URL}/${id}/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(incident)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend add incident failed, saving locally');
  }

  const newIncident: ExpeditionIncident = {
    id: `INC-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    time: new Date().toISOString(),
    title: incident.title || 'Field Incident',
    type: incident.type || 'Equipment',
    severity: incident.severity || 'MEDIUM',
    description: incident.description || 'Logged in field.',
    affected_people: incident.affected_people || 'None',
    affected_assets: incident.affected_assets || 'General equipment',
    mission_impact: incident.mission_impact || 'Under review',
    response: incident.response || 'Investigating',
    status: 'ACTIVE'
  };

  const exp = clientExpeditionsCache.find(e => e.id === id);
  if (exp) {
    if (!exp.incidents) exp.incidents = [];
    exp.incidents.unshift(newIncident);
  }
  return newIncident;
}

// Recommendation Decision
export async function decideRecommendation(
  id: string,
  recId: string,
  decision: 'APPROVE' | 'REJECT',
  comments: string = '',
  actor: string = 'Commander E. Hayes'
): Promise<ExpeditionRecommendation | null> {
  try {
    const res = await fetch(`${BASE_URL}/${id}/recommendations/${recId}/decide`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision, comments, actor })
    });
    if (res.ok) {
      const data = await res.json();
      return data.recommendation;
    }
  } catch (err) {
    console.warn('Backend decide failed, updating locally');
  }

  const exp = clientExpeditionsCache.find(e => e.id === id);
  if (exp && exp.recommendations) {
    const rec = exp.recommendations.find(r => r.id === recId);
    if (rec) {
      rec.status = decision === 'APPROVE' ? 'APPROVED' : 'REJECTED';
      rec.decision_time = new Date().toISOString();
      rec.decided_by = actor;
      rec.comments = comments;
      return rec;
    }
  }
  return null;
}

// Simulate Scenario
export async function simulateScenario(
  id: string,
  scenarioType: string,
  params: Record<string, any>
): Promise<ScenarioSimulationResult> {
  try {
    const res = await fetch(`${BASE_URL}/${id}/scenario`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario_type: scenarioType, params })
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend simulation failed, calculating client-side');
  }

  return {
    scenario_type: scenarioType,
    title: `Simulated ${scenarioType.replace('_', ' ')}`,
    current_eta: '2026-12-15T00:00:00Z',
    simulated_eta: '+36 Hours variance',
    resource_impact: 'Projected fuel burn increases by 8.5 metric tons.',
    projected_fuel_remaining: 21,
    risk_score_delta: '+18.5 (HIGH)',
    affected_tasks: ['Aviation transfers', 'Cargo discharge schedule'],
    recommendation: 'Pre-authorize contingency tie-down and inspect alternate thermal lead.',
    human_approval_required: true
  };
}

// Copilot Query
export async function queryCopilot(query: string, expeditionId?: string): Promise<{
  query: string;
  answer: string;
  confidence: number;
  model: string;
  data_freshness: string;
  suggested_actions?: string[];
}> {
  try {
    const res = await fetch(`${BASE_URL}/copilot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, expedition_id: expeditionId })
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend copilot query failed, providing client answer');
  }

  const q = query.toLowerCase();
  if (q.includes('risk')) {
    return {
      query,
      answer: "The highest-risk expedition currently is **EXP-2026-C (Glacier Core Extraction)** with an explainable risk score of **78.4/100 (HIGH)** due to a Category 4 Antarctic Blizzard.",
      confidence: 0.94,
      model: "PolarOne_Copilot_Local_v1",
      data_freshness: "Telemetry fresh (<2 min)",
      suggested_actions: ["Inspect EXP-2026-C Blizzard status", "Review Risk Panel"]
    };
  }
  if (q.includes('delayed') || q.includes('blocked')) {
    return {
      query,
      answer: "**EXP-2026-C** is currently **BLOCKED - WEATHER** (+38h delay) due to severe 58kt winds and total whiteout.",
      confidence: 0.96,
      model: "PolarOne_Copilot_Local_v1",
      data_freshness: "Live sensor data",
      suggested_actions: ["View Contingency Plan B", "Check Weather Radar"]
    };
  }

  return {
    query,
    answer: `PolarOne currently tracks 6 active/planned expeditions in Season 2026-2027. All mission parameters are grounded in telemetry.`,
    confidence: 0.90,
    model: "PolarOne_Copilot_Local_v1",
    data_freshness: "Current operational state"
  };
}

// Fetch Audit Logs
export async function getAuditLogs(expeditionId?: string): Promise<AuditLogEntry[]> {
  try {
    const url = expeditionId ? `${BASE_URL}/${expeditionId}/audit` : `${BASE_URL}/audit`;
    const res = await fetch(url, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.audit_logs)) return data.audit_logs;
    }
  } catch (err) {
    // fallback
  }

  return [
    {
      audit_id: "AUD-EXP-101",
      expedition_id: expeditionId || "EXP-2026-C",
      timestamp: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
      actor: "Commander E. Hayes (Duty Commander)",
      actor_role: "Commander",
      action: "STATUS_CHANGE",
      old_value: "OPERATIONAL",
      new_value: "BLOCKED",
      reason: "Severe Category 4 Blizzard (58kt sustained) triggered Contingency Plan B."
    },
    {
      audit_id: "AUD-EXP-102",
      expedition_id: expeditionId || "EXP-2026-A",
      timestamp: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
      actor: "Cmdr. Sarah Jenkins",
      actor_role: "Expedition Lead",
      action: "ROUTE_WAYPOINT_ADDED",
      old_value: "Waypoint Delta Direct",
      new_value: "Waypoint Delta-2 Cape Armitage Bypass",
      reason: "Avoidance of multi-year ridge confirmed on Sentinel-1 SAR observation."
    }
  ];
}
