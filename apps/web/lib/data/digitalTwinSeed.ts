import { GraphPayload, DigitalTwinNode, CascadingImpact, SatelliteObservation, DigitalTwinEvent } from '@/types/digital-twin';

export const SEED_GRAPH: GraphPayload = {
  "nodes": [
    {
      "id": "ship_polar_star",
      "type": "twinNode",
      "position": {
        "x": 180,
        "y": 200
      },
      "data": {
        "id": "ship_polar_star",
        "label": "Polar Star",
        "category": "SHIP",
        "status": "WARNING",
        "health_score": 72,
        "freshness": "FRESH",
        "last_update": "2026-09-28T10:18:43.536218+00:00",
        "data_source": "AIS Direct Stream + SAR Cross-Ref",
        "properties": {
          "vessel_type": "Heavy Polar Icebreaker (WAGB-10)",
          "ice_class": "Polar Class 1 (PC1)",
          "imo": "7367471",
          "latitude": -73.2,
          "longitude": -44.5,
          "speed_knots": 6.2,
          "design_speed_knots": 17.0,
          "heading_degrees": 112,
          "destination": "Davis Station",
          "eta": "2026-10-02T12:00:00Z",
          "predicted_eta": "2026-10-03T14:33:00Z",
          "expected_delay_hours": 26.5,
          "fuel_remaining_pct": 68.0,
          "crew_complement": 134,
          "cargo_onboard": [
            "Food Resupply (42t)",
            "Generator Rotor Spares",
            "Winter Diesel (180t)"
          ],
          "weather_exposure": "Headwind 38kt, Temp -22\u00b0C",
          "sea_ice_exposure": "Heavy Compression Pack (82%)",
          "comms_status": "ONLINE (Iridium SBD + VSAT)"
        },
        "risk": {
          "level": "HIGH",
          "score": 0.78,
          "confidence": 0.84,
          "horizon": "+24h",
          "model": "XGBoost Polar Voyage Regressor v2.4",
          "contributing_factors": [
            {
              "factor": "Weddell Pack Compression",
              "weight": 0.44,
              "impact": "+14.2h delay"
            },
            {
              "factor": "Headwind Shear (38kt)",
              "weight": 0.28,
              "impact": "+7.5h delay"
            },
            {
              "factor": "Reduced Hull Speed in Ridge",
              "weight": 0.28,
              "impact": "+4.8h delay"
            }
          ]
        },
        "isCritical": false,
        "isWarning": true,
        "healthScore": 72
      }
    },
    {
      "id": "ship_aurora_exp",
      "type": "twinNode",
      "position": {
        "x": 520,
        "y": 200
      },
      "data": {
        "id": "ship_aurora_exp",
        "label": "Aurora Explorer",
        "category": "SHIP",
        "status": "NORMAL",
        "health_score": 96,
        "freshness": "FRESH",
        "last_update": "2026-09-28T10:18:57.536218+00:00",
        "data_source": "AIS Direct Stream",
        "properties": {
          "vessel_type": "Polar Research & Supply Vessel",
          "ice_class": "Polar Class 3 (PC3)",
          "imo": "9845123",
          "latitude": -67.2,
          "longitude": 78.5,
          "speed_knots": 11.5,
          "design_speed_knots": 14.5,
          "heading_degrees": 210,
          "destination": "Bharati Station",
          "eta": "2026-10-04T09:15:00Z",
          "predicted_eta": "2026-10-04T10:30:00Z",
          "expected_delay_hours": 1.25,
          "fuel_remaining_pct": 82.0,
          "crew_complement": 48,
          "cargo_onboard": [
            "Scientific Drilling Ice Rigs",
            "Cryogenic Nitrogen Dewars",
            "Dry Food Provisions"
          ],
          "weather_exposure": "Calm, Wind 14kt, Temp -11\u00b0C",
          "sea_ice_exposure": "Open Navigable Leads (15%)",
          "comms_status": "ONLINE (Starlink Polar + Inmarsat Fleet)"
        },
        "risk": {
          "level": "LOW",
          "score": 0.14,
          "confidence": 0.92,
          "horizon": "+48h",
          "model": "XGBoost Polar Voyage Regressor v2.4",
          "contributing_factors": [
            {
              "factor": "Open Water Swell",
              "weight": 0.7,
              "impact": "+1.0h delay"
            },
            {
              "factor": "Minor Crosswind",
              "weight": 0.3,
              "impact": "+0.25h delay"
            }
          ]
        },
        "isCritical": false,
        "isWarning": false,
        "healthScore": 96
      }
    },
    {
      "id": "ship_southern_cross",
      "type": "twinNode",
      "position": {
        "x": 860,
        "y": 200
      },
      "data": {
        "id": "ship_southern_cross",
        "label": "Southern Cross",
        "category": "SHIP",
        "status": "NORMAL",
        "health_score": 91,
        "freshness": "FRESH",
        "last_update": "2026-09-28T10:17:25.536218+00:00",
        "data_source": "AIS Direct Stream",
        "properties": {
          "vessel_type": "Antarctic Logistic Support Vessel",
          "ice_class": "1A Super Ice Class",
          "imo": "9722340",
          "latitude": -69.8,
          "longitude": 12.5,
          "speed_knots": 10.2,
          "design_speed_knots": 13.0,
          "heading_degrees": 145,
          "destination": "Maitri Station Fast Ice Margin",
          "eta": "2026-10-03T18:00:00Z",
          "predicted_eta": "2026-10-03T20:45:00Z",
          "expected_delay_hours": 2.75,
          "fuel_remaining_pct": 74.0,
          "crew_complement": 42,
          "cargo_onboard": [
            "Bulk Diesel (500t)",
            "Vehicle Spares",
            "Modular Lab Units"
          ],
          "weather_exposure": "Wind 22kt E, Temp -14\u00b0C",
          "sea_ice_exposure": "First-year pack fringe",
          "comms_status": "ONLINE (VSAT)"
        },
        "risk": {
          "level": "LOW",
          "score": 0.22,
          "confidence": 0.88,
          "horizon": "+24h",
          "model": "XGBoost Polar Voyage Regressor v2.4",
          "contributing_factors": [
            {
              "factor": "Fringe Pack Navigation",
              "weight": 0.65,
              "impact": "+2.0h delay"
            },
            {
              "factor": "Light Snow Squalls",
              "weight": 0.35,
              "impact": "+0.75h delay"
            }
          ]
        },
        "isCritical": false,
        "isWarning": false,
        "healthScore": 91
      }
    },
    {
      "id": "ship_ocean_guardian",
      "type": "twinNode",
      "position": {
        "x": 1180,
        "y": 200
      },
      "data": {
        "id": "ship_ocean_guardian",
        "label": "Ocean Guardian",
        "category": "SHIP",
        "status": "NORMAL",
        "health_score": 94,
        "freshness": "RECENT",
        "last_update": "2026-09-28T10:13:25.536218+00:00",
        "data_source": "AIS Direct Stream",
        "properties": {
          "vessel_type": "Environmental & SAR Patrol Vessel",
          "ice_class": "Polar Class 4 (PC4)",
          "imo": "9618824",
          "latitude": -64.8,
          "longitude": -63.5,
          "speed_knots": 12.0,
          "design_speed_knots": 15.0,
          "heading_degrees": 235,
          "destination": "Rothera Station",
          "eta": "2026-10-01T14:00:00Z",
          "predicted_eta": "2026-10-01T14:30:00Z",
          "expected_delay_hours": 0.5,
          "fuel_remaining_pct": 88.0,
          "crew_complement": 36,
          "cargo_onboard": [
            "Medical Trauma Kits",
            "Aviation Jet-A1 Drums (40t)"
          ],
          "weather_exposure": "Drake Passage Swell 3.5m, Temp -6\u00b0C",
          "sea_ice_exposure": "Ice Free Corridor",
          "comms_status": "ONLINE (Starlink + Iridium)"
        },
        "risk": {
          "level": "LOW",
          "score": 0.12,
          "confidence": 0.95,
          "horizon": "+24h",
          "model": "XGBoost Polar Voyage Regressor v2.4",
          "contributing_factors": [
            {
              "factor": "Ocean Swell Retardation",
              "weight": 1.0,
              "impact": "+0.5h delay"
            }
          ]
        },
        "isCritical": false,
        "isWarning": false,
        "healthScore": 94
      }
    },
    {
      "id": "station_davis",
      "type": "twinNode",
      "position": {
        "x": 340,
        "y": 360
      },
      "data": {
        "id": "station_davis",
        "label": "Davis Station",
        "category": "STATION",
        "status": "WARNING",
        "health_score": 68,
        "freshness": "FRESH",
        "last_update": "2026-09-28T10:15:25.536218+00:00",
        "data_source": "Davis SCADA Gateway + BGAN Link",
        "properties": {
          "station_type": "Year-Round Continental Research Station",
          "country": "Australia (AAD)",
          "latitude": -68.576,
          "longitude": 77.967,
          "elevation_m": 12,
          "population": 84,
          "power_status": "74% (1 of 3 Main Turbines Offline)",
          "fuel_days_remaining": 142,
          "food_days_remaining": 18,
          "water_reserve_days": 45,
          "critical_inventory_pct": 72.0,
          "landing_facility": "Davis Sea-Ice Skiway (Active)",
          "emergency_status": "ATTENTION_REQUIRED",
          "current_weather": "Temp -18.4\u00b0C, Wind 28kt NE, Visibility 6km, Pressure 982 hPa",
          "comms_link": "Optus C1 Satellite VSAT (Online)"
        },
        "risk": {
          "level": "MEDIUM",
          "score": 0.64,
          "confidence": 0.89,
          "horizon": "+72h",
          "model": "LightGBM Station Operational Classifier v1.8",
          "contributing_factors": [
            {
              "factor": "Generator #2 Mechanical Anomaly",
              "weight": 0.52,
              "impact": "Power margin degraded"
            },
            {
              "factor": "Polar Star Resupply Delay (+26h)",
              "weight": 0.34,
              "impact": "Food stock buffer shrinking"
            },
            {
              "factor": "Approaching Katabatic Squall",
              "weight": 0.14,
              "impact": "Outdoor movement restricted"
            }
          ]
        },
        "isCritical": false,
        "isWarning": true,
        "healthScore": 68
      }
    },
    {
      "id": "station_maitri",
      "type": "twinNode",
      "position": {
        "x": 1000,
        "y": 360
      },
      "data": {
        "id": "station_maitri",
        "label": "Maitri Station",
        "category": "STATION",
        "status": "NORMAL",
        "health_score": 88,
        "freshness": "RECENT",
        "last_update": "2026-09-28T10:05:25.536218+00:00",
        "data_source": "Schirmacher Oasis Telemetry Node",
        "properties": {
          "station_type": "Year-Round Research Base",
          "country": "India (NCPOR)",
          "latitude": -70.767,
          "longitude": 11.733,
          "elevation_m": 117,
          "population": 25,
          "power_status": "94% (Combined Diesel + Solar)",
          "fuel_days_remaining": 68,
          "food_days_remaining": 82,
          "water_reserve_days": 38,
          "critical_inventory_pct": 84.0,
          "landing_facility": "Blue Ice Runway (ALCI / DROMLAN Link)",
          "emergency_status": "NORMAL",
          "current_weather": "Temp -14.1\u00b0C, Wind 24kt E, Clear, Pressure 986 hPa",
          "comms_link": "GSAT-10 Dedicated Transponder (Online)"
        },
        "risk": {
          "level": "LOW",
          "score": 0.24,
          "confidence": 0.91,
          "horizon": "+7 days",
          "model": "LightGBM Station Operational Classifier v1.8",
          "contributing_factors": [
            {
              "factor": "Seasonal Fuel Burn Tracking",
              "weight": 0.8,
              "impact": "Resupply tanker S.A. Agulhas II en route"
            },
            {
              "factor": "Minor Filter Service Due",
              "weight": 0.2,
              "impact": "Routine task"
            }
          ]
        },
        "isCritical": false,
        "isWarning": false,
        "healthScore": 88
      }
    },
    {
      "id": "station_bharati",
      "type": "twinNode",
      "position": {
        "x": 680,
        "y": 360
      },
      "data": {
        "id": "station_bharati",
        "label": "Bharati Station",
        "category": "STATION",
        "status": "NORMAL",
        "health_score": 95,
        "freshness": "FRESH",
        "last_update": "2026-09-28T10:17:25.536218+00:00",
        "data_source": "Larsemann Hills High-Speed Optical Hub",
        "properties": {
          "station_type": "State-of-the-Art Containerized Antarctic Base",
          "country": "India (NCPOR)",
          "latitude": -69.407,
          "longitude": 76.195,
          "elevation_m": 35,
          "population": 46,
          "power_status": "98% (Multi-Tier Redundant)",
          "fuel_days_remaining": 210,
          "food_days_remaining": 160,
          "water_reserve_days": 90,
          "critical_inventory_pct": 94.0,
          "landing_facility": "Twin Helipads + Fast Ice Approach",
          "emergency_status": "NORMAL",
          "current_weather": "Temp -16.0\u00b0C, Wind 18kt ENE, Visibility 12km, Pressure 988 hPa",
          "comms_link": "Dual Fiber-backed VSAT to Hyderabad Ground Station"
        },
        "risk": {
          "level": "LOW",
          "score": 0.1,
          "confidence": 0.97,
          "horizon": "+30 days",
          "model": "LightGBM Station Operational Classifier v1.8",
          "contributing_factors": [
            {
              "factor": "Nominal Vitals Across All Subsystems",
              "weight": 1.0,
              "impact": "Stable baseline"
            }
          ]
        },
        "isCritical": false,
        "isWarning": false,
        "healthScore": 95
      }
    },
    {
      "id": "station_himadri",
      "type": "twinNode",
      "position": {
        "x": 1320,
        "y": 360
      },
      "data": {
        "id": "station_himadri",
        "label": "Himadri Station Link",
        "category": "STATION",
        "status": "NORMAL",
        "health_score": 92,
        "freshness": "RECENT",
        "last_update": "2026-09-28T10:01:25.536218+00:00",
        "data_source": "Polar Gateway Cross-Link",
        "properties": {
          "station_type": "Atmospheric & Polar Science Node",
          "country": "International / NCPOR Polar Collaborative",
          "latitude": -78.85,
          "longitude": 166.67,
          "elevation_m": 24,
          "population": 18,
          "power_status": "92%",
          "fuel_days_remaining": 95,
          "food_days_remaining": 60,
          "water_reserve_days": 50,
          "critical_inventory_pct": 89.0,
          "landing_facility": "Ice Shelf Skiway",
          "emergency_status": "NORMAL",
          "current_weather": "Temp -28.2\u00b0C, Wind 31kt SW, Pressure 974 hPa",
          "comms_link": "Iridium Certus Relay"
        },
        "risk": {
          "level": "LOW",
          "score": 0.18,
          "confidence": 0.93,
          "horizon": "+72h",
          "model": "LightGBM Station Operational Classifier v1.8",
          "contributing_factors": [
            {
              "factor": "Low Ambient Temp Thermal Stress",
              "weight": 0.7,
              "impact": "Insulation monitoring nominal"
            },
            {
              "factor": "Comms Jitter in Magnetic Drift",
              "weight": 0.3,
              "impact": "Packet loss <2%"
            }
          ]
        },
        "isCritical": false,
        "isWarning": false,
        "healthScore": 92
      }
    },
    {
      "id": "equipment_gen_2",
      "type": "twinNode",
      "position": {
        "x": 120,
        "y": 520
      },
      "data": {
        "id": "equipment_gen_2",
        "label": "Generator #2 (Davis Diesel)",
        "category": "EQUIPMENT",
        "status": "CRITICAL",
        "health_score": 38,
        "freshness": "FRESH",
        "last_update": "2026-09-28T10:18:25.536218+00:00",
        "data_source": "Davis Station IoT Vibration SCADA Node 4",
        "properties": {
          "equipment_type": "Caterpillar 3512B Arctic Diesel Generator",
          "rated_power_kw": 1200,
          "current_output_kw": 640,
          "utilization_pct": 53.3,
          "temperature_c": 98.4,
          "vibration_rms_mms": 14.8,
          "baseline_vibration_mms": 4.2,
          "bearing_pressure_bar": 3.8,
          "runtime_hours": 18420,
          "maintenance_status": "OVERDUE by 420 hrs",
          "assigned_location": "Davis Station Powerhouse #1"
        },
        "risk": {
          "level": "CRITICAL",
          "score": 0.88,
          "failure_probability_pct": 68.0,
          "failure_horizon": "24 hours",
          "confidence": 0.82,
          "model": "Isolation Forest + Weibull Survival Analysis Engine",
          "contributing_factors": [
            {
              "factor": "Vibration Anomaly Spike",
              "weight": 0.42,
              "impact": "+18% failure probability"
            },
            {
              "factor": "Overdue Scheduled Overhaul",
              "weight": 0.28,
              "impact": "+21% failure probability"
            },
            {
              "factor": "Cooling Circuit Thermal Elevation (+14%)",
              "weight": 0.18,
              "impact": "+12% failure probability"
            },
            {
              "factor": "Continuous Extreme Load Cycle",
              "weight": 0.12,
              "impact": "+9% failure probability"
            }
          ]
        },
        "isCritical": true,
        "isWarning": false,
        "healthScore": 38
      }
    },
    {
      "id": "equipment_gen_1",
      "type": "twinNode",
      "position": {
        "x": 300,
        "y": 520
      },
      "data": {
        "id": "equipment_gen_1",
        "label": "Generator #1 (Primary)",
        "category": "EQUIPMENT",
        "status": "NORMAL",
        "health_score": 94,
        "freshness": "FRESH",
        "last_update": "2026-09-28T10:16:25.536218+00:00",
        "data_source": "Davis Station IoT SCADA Node 1",
        "properties": {
          "equipment_type": "Caterpillar 3512B Arctic Diesel Generator",
          "rated_power_kw": 1200,
          "current_output_kw": 980,
          "utilization_pct": 81.6,
          "temperature_c": 76.2,
          "vibration_rms_mms": 3.9,
          "bearing_pressure_bar": 4.6,
          "runtime_hours": 9240,
          "maintenance_status": "Nominal (Next in 760 hrs)",
          "assigned_location": "Davis Station Powerhouse #1"
        },
        "risk": {
          "level": "LOW",
          "score": 0.15,
          "failure_probability_pct": 8.0,
          "failure_horizon": "60 days",
          "confidence": 0.94,
          "model": "Isolation Forest Sensor Anomaly",
          "contributing_factors": [
            {
              "factor": "Nominal Harmonic Signature",
              "weight": 1.0,
              "impact": "Safe operating limits"
            }
          ]
        },
        "isCritical": false,
        "isWarning": false,
        "healthScore": 94
      }
    },
    {
      "id": "equipment_fuel_pump_3",
      "type": "twinNode",
      "position": {
        "x": 480,
        "y": 520
      },
      "data": {
        "id": "equipment_fuel_pump_3",
        "label": "Fuel Transfer Pump #3",
        "category": "EQUIPMENT",
        "status": "WARNING",
        "health_score": 74,
        "freshness": "RECENT",
        "last_update": "2026-09-28T10:07:25.536218+00:00",
        "data_source": "Davis Bulk Fuel Supervisory Telemetry",
        "properties": {
          "equipment_type": "Positive Displacement Heavy Fuel Pump",
          "flow_rate_lpm": 380,
          "suction_pressure_bar": 1.2,
          "temperature_c": -6.0,
          "runtime_hours": 6420,
          "cavitation_risk": "MEDIUM (Viscosity elevated by extreme ambient cold)",
          "assigned_location": "Davis Fuel Farm Manifold"
        },
        "risk": {
          "level": "MEDIUM",
          "score": 0.48,
          "failure_probability_pct": 28.0,
          "failure_horizon": "72 hours",
          "confidence": 0.86,
          "model": "Autoencoder Multivariate Anomaly Detector",
          "contributing_factors": [
            {
              "factor": "Cold Viscosity Drag on Impeller",
              "weight": 0.6,
              "impact": "Current draw elevated +15%"
            },
            {
              "factor": "Minor Seal Gland Leakage",
              "weight": 0.4,
              "impact": "Pressure drop 0.4 bar"
            }
          ]
        },
        "isCritical": false,
        "isWarning": true,
        "healthScore": 74
      }
    },
    {
      "id": "equipment_cold_storage",
      "type": "twinNode",
      "position": {
        "x": 660,
        "y": 520
      },
      "data": {
        "id": "equipment_cold_storage",
        "label": "Station Deep Freezer / Cold Storage",
        "category": "EQUIPMENT",
        "status": "NORMAL",
        "health_score": 86,
        "freshness": "FRESH",
        "last_update": "2026-09-28T10:17:25.536218+00:00",
        "data_source": "Davis Facilities Management SCADA",
        "properties": {
          "equipment_type": "Dual-Compressor Blast & Holding Cold Store",
          "chamber_temp_c": -22.4,
          "setpoint_temp_c": -24.0,
          "thermal_buffer_hours": 6.5,
          "compressor_status": "Compressor A Active, B Standby",
          "power_source": "Generator #2 / Bus A Circuit",
          "assigned_location": "Davis Logistics Compound"
        },
        "risk": {
          "level": "MEDIUM",
          "score": 0.58,
          "failure_probability_pct": 34.0,
          "failure_horizon": "6 hours (if power drops)",
          "confidence": 0.9,
          "model": "Physics-Based Thermal Degradation Predictor",
          "contributing_factors": [
            {
              "factor": "Dependency on Vulnerable Gen #2 Bus",
              "weight": 0.75,
              "impact": "High cascade exposure"
            },
            {
              "factor": "Door Seal Air Ingress",
              "weight": 0.25,
              "impact": "Minor 1.2\u00b0C temperature creep"
            }
          ]
        },
        "isCritical": false,
        "isWarning": false,
        "healthScore": 86
      }
    },
    {
      "id": "equipment_sat_terminal",
      "type": "twinNode",
      "position": {
        "x": 840,
        "y": 520
      },
      "data": {
        "id": "equipment_sat_terminal",
        "label": "C-Band Radome VSAT Terminal",
        "category": "EQUIPMENT",
        "status": "NORMAL",
        "health_score": 96,
        "freshness": "FRESH",
        "last_update": "2026-09-28T10:19:07.536218+00:00",
        "data_source": "Comms Tower Telemetry",
        "properties": {
          "equipment_type": "2.4m Heated Radome Satellite Dish",
          "uplink_margin_db": 8.4,
          "de-icing_heater_state": "ACTIVE (Maintaining +4\u00b0C dome shell)",
          "radome_wind_rating_kt": 110,
          "latency_ms": 580,
          "assigned_location": "Davis Comms Mast Hill"
        },
        "risk": {
          "level": "LOW",
          "score": 0.08,
          "failure_probability_pct": 3.0,
          "failure_horizon": "30 days",
          "confidence": 0.98,
          "model": "Isolation Forest",
          "contributing_factors": [
            {
              "factor": "Radome Heating Functional",
              "weight": 1.0,
              "impact": "No ice build-up"
            }
          ]
        },
        "isCritical": false,
        "isWarning": false,
        "healthScore": 96
      }
    },
    {
      "id": "cargo_food",
      "type": "twinNode",
      "position": {
        "x": 200,
        "y": 680
      },
      "data": {
        "id": "cargo_food",
        "label": "Food Resupply Provisions",
        "category": "CARGO",
        "status": "WARNING",
        "health_score": 70,
        "freshness": "FRESH",
        "last_update": "2026-09-28T10:14:25.536218+00:00",
        "data_source": "Inventory & Logistics ERP Synchronizer",
        "properties": {
          "quantity": "42 Metric Tons (4,800 Man-Days)",
          "current_location": "En Route aboard Polar Star",
          "destination": "Davis Station Logistics Store",
          "temperature_requirement": "-20\u00b0C Reefer Container",
          "expiration_risk": "Reefer battery reserve 72h without vessel power",
          "priority": "P1 - MISSION CRITICAL",
          "transport_status": "Delayed in Weddell Compression"
        },
        "risk": {
          "level": "HIGH",
          "score": 0.74,
          "confidence": 0.85,
          "horizon": "+24h",
          "model": "XGBoost Supply Chain Disruption Forecaster",
          "contributing_factors": [
            {
              "factor": "Carrier Vessel Delay (+26h)",
              "weight": 0.7,
              "impact": "Station buffer down to 18 days"
            },
            {
              "factor": "Reefer Container Power Cycling",
              "weight": 0.3,
              "impact": "Cold-chain thermal stress"
            }
          ]
        },
        "isCritical": false,
        "isWarning": true,
        "healthScore": 70
      }
    },
    {
      "id": "cargo_fuel_diesel",
      "type": "twinNode",
      "position": {
        "x": 960,
        "y": 680
      },
      "data": {
        "id": "cargo_fuel_diesel",
        "label": "Polar Winter Diesel (SAB Grade)",
        "category": "CARGO",
        "status": "NORMAL",
        "health_score": 92,
        "freshness": "RECENT",
        "last_update": "2026-09-28T10:04:25.536218+00:00",
        "data_source": "Bulk Fuel Telemetry",
        "properties": {
          "quantity": "650 Metric Tons",
          "current_location": "Southern Cross Cargo Tanks",
          "destination": "Maitri Station Bulk Depot",
          "temperature_requirement": "Pour point -50\u00b0C additives certified",
          "priority": "P1 - LIFE SUPPORT",
          "transport_status": "On schedule for marginal ice transfer"
        },
        "risk": {
          "level": "LOW",
          "score": 0.16,
          "confidence": 0.92,
          "horizon": "+72h",
          "model": "LightGBM Demand Forecaster",
          "contributing_factors": [
            {
              "factor": "Stable Transit Rate",
              "weight": 1.0,
              "impact": "Tanker within 48h of fast ice margin"
            }
          ]
        },
        "isCritical": false,
        "isWarning": false,
        "healthScore": 92
      }
    },
    {
      "id": "cargo_rotor_spares",
      "type": "twinNode",
      "position": {
        "x": 40,
        "y": 680
      },
      "data": {
        "id": "cargo_rotor_spares",
        "label": "Generator Rotor & Bearing Spares",
        "category": "CARGO",
        "status": "WARNING",
        "health_score": 65,
        "freshness": "FRESH",
        "last_update": "2026-09-28T10:11:25.536218+00:00",
        "data_source": "Critical Spares Logistics Inventory",
        "properties": {
          "quantity": "2x Main Drive Bearings + 1x Exciter Stator",
          "current_location": "Cargo Hold #2, Polar Star",
          "destination": "Davis Station Powerhouse #1",
          "target_equipment": "Generator #2",
          "priority": "P0 - URGENT OVERHAUL REQUIREMENT",
          "transport_status": "Delayed"
        },
        "risk": {
          "level": "HIGH",
          "score": 0.82,
          "confidence": 0.88,
          "horizon": "+24h",
          "model": "OR-Tools Critical Path Analyzer",
          "contributing_factors": [
            {
              "factor": "Polar Star Speed Loss (6.2kt)",
              "weight": 0.85,
              "impact": "Rotor cannot reach Davis before Gen #2 predicted failure"
            },
            {
              "factor": "Heavy Rigging Lead Time at Sea",
              "weight": 0.15,
              "impact": "Dockside crane required"
            }
          ]
        },
        "isCritical": false,
        "isWarning": true,
        "healthScore": 65
      }
    },
    {
      "id": "cargo_medical",
      "type": "twinNode",
      "position": {
        "x": 1180,
        "y": 680
      },
      "data": {
        "id": "cargo_medical",
        "label": "Emergency Surgical & Trauma Supplies",
        "category": "CARGO",
        "status": "NORMAL",
        "health_score": 98,
        "freshness": "FRESH",
        "last_update": "2026-09-28T10:09:25.536218+00:00",
        "data_source": "Polar Medical Logistics Unit",
        "properties": {
          "quantity": "3x Aeromedical Evacuation Kits + Blood Plasma",
          "current_location": "Ocean Guardian Medical Locker",
          "destination": "Rothera Station Surgical Suite",
          "temperature_requirement": "+2\u00b0C to +8\u00b0C Active Chilled Box",
          "priority": "P1 - CLINICAL CONTINGENCY",
          "transport_status": "Transit proceeding nominally"
        },
        "risk": {
          "level": "LOW",
          "score": 0.08,
          "confidence": 0.96,
          "horizon": "+24h",
          "model": "LightGBM Demand Forecaster",
          "contributing_factors": [
            {
              "factor": "Protected Onboard Stowage",
              "weight": 1.0,
              "impact": "No temperature deviation"
            }
          ]
        },
        "isCritical": false,
        "isWarning": false,
        "healthScore": 98
      }
    },
    {
      "id": "personnel_davis_crew",
      "type": "twinNode",
      "position": {
        "x": 340,
        "y": 820
      },
      "data": {
        "id": "personnel_davis_crew",
        "label": "Davis Station Winter-Over Team",
        "category": "PERSONNEL",
        "status": "WARNING",
        "health_score": 78,
        "freshness": "RECENT",
        "last_update": "2026-09-28T09:54:25.536218+00:00",
        "data_source": "Station Daily Muster & Personnel Roster",
        "properties": {
          "headcount": 84,
          "roles": "24 Engineering/Maintenance, 32 Science/Meteorology, 8 Medical, 20 Logistics/Ops",
          "location": "Davis Station Main Accommodation Living Module",
          "life_support_dependency": "Station Power Bus & Heating Circuit",
          "food_stock_per_capita": "18 days remaining buffer",
          "evacuation_status": "Shelter-in-Place Nominal"
        },
        "risk": {
          "level": "MEDIUM",
          "score": 0.54,
          "confidence": 0.86,
          "horizon": "+72h",
          "model": "Human Safety Impact Assessor",
          "contributing_factors": [
            {
              "factor": "Potential Power Rationing if Gen #2 Trips",
              "weight": 0.65,
              "impact": "Habitation heating restricted to redundant circuit"
            },
            {
              "factor": "Delayed Fresh Food Influx",
              "weight": 0.35,
              "impact": "Transition to dry military rations"
            }
          ]
        },
        "isCritical": false,
        "isWarning": true,
        "healthScore": 78
      }
    },
    {
      "id": "personnel_maitri_engineers",
      "type": "twinNode",
      "position": {
        "x": 1000,
        "y": 820
      },
      "data": {
        "id": "personnel_maitri_engineers",
        "label": "Maitri Station Engineering Unit",
        "category": "PERSONNEL",
        "status": "NORMAL",
        "health_score": 94,
        "freshness": "RECENT",
        "last_update": "2026-09-28T09:39:25.536218+00:00",
        "data_source": "NCPOR Station Roster",
        "properties": {
          "headcount": 12,
          "roles": "Diesel Mechanics, High-Voltage Technicians, HVAC Specialist",
          "location": "Maitri Workshop Complex",
          "operational_readiness": "100%",
          "emergency_response": "Equipped for PistenBully traverse & heavy recovery"
        },
        "risk": {
          "level": "LOW",
          "score": 0.12,
          "confidence": 0.95,
          "horizon": "+7 days",
          "model": "Human Safety Impact Assessor",
          "contributing_factors": [
            {
              "factor": "All Facilities Operating Nominally",
              "weight": 1.0,
              "impact": "No incident"
            }
          ]
        },
        "isCritical": false,
        "isWarning": false,
        "healthScore": 94
      }
    },
    {
      "id": "infra_davis_runway",
      "type": "twinNode",
      "position": {
        "x": 520,
        "y": 520
      },
      "data": {
        "id": "infra_davis_runway",
        "label": "Davis Sea-Ice Skiway",
        "category": "INFRASTRUCTURE",
        "status": "NORMAL",
        "health_score": 90,
        "freshness": "RECENT",
        "last_update": "2026-09-28T09:19:25.536218+00:00",
        "data_source": "Airfield Ground Observer Report",
        "properties": {
          "surface_type": "Compressed Perennial Sea Ice / Snowcap",
          "usable_length_m": 2400,
          "bearing_capacity": "Max 55t (LC-130 Hercules / Basler BT-67 approved)",
          "ice_core_thickness_cm": 182,
          "friction_coefficient": 0.38,
          "lighting": "LED Portable PAPI Units Functional"
        },
        "risk": {
          "level": "LOW",
          "score": 0.2,
          "confidence": 0.9,
          "horizon": "+48h",
          "model": "Aviation Ice Structural Evaluator",
          "contributing_factors": [
            {
              "factor": "Stable Negative Air Temperature",
              "weight": 0.85,
              "impact": "Ice sheet strength solid"
            },
            {
              "factor": "Light Surface Drifting Snow",
              "weight": 0.15,
              "impact": "Snowcat grooming required"
            }
          ]
        },
        "isCritical": false,
        "isWarning": false,
        "healthScore": 90
      }
    },
    {
      "id": "infra_fast_ice_wharf",
      "type": "twinNode",
      "position": {
        "x": 160,
        "y": 360
      },
      "data": {
        "id": "infra_fast_ice_wharf",
        "label": "Prydz Bay Fast Ice Mooring Wharf",
        "category": "INFRASTRUCTURE",
        "status": "WARNING",
        "health_score": 68,
        "freshness": "RECENT",
        "last_update": "2026-09-28T08:19:25.536218+00:00",
        "data_source": "Sentinel-1 SAR Swath + Coastal Ice Profiler",
        "properties": {
          "wharf_type": "Natural Fast Ice Edge Offload Pier",
          "ice_thickness_m": 2.4,
          "stability": "Micro-cracks detected by ground radar 350m west",
          "crane_operations_limit": "Max 25t container lift",
          "target_vessel": "Polar Star / Aurora Explorer"
        },
        "risk": {
          "level": "MEDIUM",
          "score": 0.58,
          "confidence": 0.84,
          "horizon": "+24h",
          "model": "CryoSat-2 / SAR Ice Fatigue Analyzer",
          "contributing_factors": [
            {
              "factor": "Tidal Wave Flexing",
              "weight": 0.6,
              "impact": "Edge calving hazard during heavy surge"
            },
            {
              "factor": "Late Arrival of Offload Convoy",
              "weight": 0.4,
              "impact": "Warm diurnal cycle exposure"
            }
          ]
        },
        "isCritical": false,
        "isWarning": true,
        "healthScore": 68
      }
    },
    {
      "id": "env_weddell_ice",
      "type": "twinNode",
      "position": {
        "x": 180,
        "y": 60
      },
      "data": {
        "id": "env_weddell_ice",
        "label": "Weddell Sea Heavy Pack Ice Zone",
        "category": "ENVIRONMENT",
        "status": "CRITICAL",
        "health_score": 42,
        "freshness": "FRESH",
        "last_update": "2026-09-28T08:05:25.536218+00:00",
        "data_source": "Sentinel-1A SAR Swath Obs (Acquired 2h 14m ago)",
        "properties": {
          "observation_type": "10m C-Band SAR Synthetic Aperture Radar",
          "concentration_pct": 82.0,
          "ice_thickness_m": 2.8,
          "ridge_height_m": 3.4,
          "drift_vector": "18nm / 24h towards Northeast (Convergence)",
          "lead_navigability": "Compressed shut by cyclonic gyre",
          "affected_corridors": "Route R-01 (Polar Star Track)"
        },
        "risk": {
          "level": "CRITICAL",
          "score": 0.92,
          "confidence": 0.88,
          "horizon": "+24h",
          "model": "XGBoost Ice Advection & Dynamic Resistance",
          "contributing_factors": [
            {
              "factor": "Cyclonic Atmospheric Wind Forcing",
              "weight": 0.55,
              "impact": "High compressive pack stress"
            },
            {
              "factor": "Multi-Year Floe Incorporation",
              "weight": 0.45,
              "impact": "Severe hull kinetic resistance"
            }
          ]
        },
        "isCritical": true,
        "isWarning": false,
        "healthScore": 42
      }
    },
    {
      "id": "env_ross_storm",
      "type": "twinNode",
      "position": {
        "x": 780,
        "y": 60
      },
      "data": {
        "id": "env_ross_storm",
        "label": "Ross Sea Katabatic Storm Cell",
        "category": "ENVIRONMENT",
        "status": "WARNING",
        "health_score": 58,
        "freshness": "FRESH",
        "last_update": "2026-09-28T10:15:25.536218+00:00",
        "data_source": "ECMWF High-Res 0.1\u00b0 Numerical Weather Cycle",
        "properties": {
          "observation_type": "Synoptic Polar Atmosphere Forecast",
          "wind_speed_knots": 48.0,
          "wind_gusts_knots": 62.0,
          "temperature_c": -26.5,
          "visibility_km": 0.8,
          "barometric_trend": "Falling 3.4 hPa/3hr (Rapid Deepening)",
          "affected_systems": "Himadri Link, McMurdo Convoy Route"
        },
        "risk": {
          "level": "HIGH",
          "score": 0.72,
          "confidence": 0.85,
          "horizon": "+12h",
          "model": "ECMWF / NOAA Polar Ensemble",
          "contributing_factors": [
            {
              "factor": "Interior Plateau Cold Air Gravitational Surge",
              "weight": 0.8,
              "impact": "Severe katabatic wind acceleration"
            },
            {
              "factor": "Blowing Snow Blindness",
              "weight": 0.2,
              "impact": "Zero visual flight rules (VFR)"
            }
          ]
        },
        "isCritical": false,
        "isWarning": true,
        "healthScore": 58
      }
    }
  ],
  "edges": [
    {
      "id": "rel-01",
      "source": "ship_polar_star",
      "target": "station_davis",
      "label": "RESUPPLIES",
      "animated": true,
      "style": {
        "stroke": "#f59e0b",
        "strokeWidth": 1.6
      },
      "data": {
        "relation": "RESUPPLIES",
        "status": "DELAYED",
        "weight": 0.9,
        "full_label": "RESUPPLIES (Delayed +26h)"
      }
    },
    {
      "id": "rel-02",
      "source": "ship_aurora_exp",
      "target": "station_bharati",
      "label": "RESUPPLIES",
      "animated": false,
      "style": {
        "stroke": "#3b82f6",
        "strokeWidth": 1.6
      },
      "data": {
        "relation": "RESUPPLIES",
        "status": "NORMAL",
        "weight": 0.95,
        "full_label": "RESUPPLIES (On Time)"
      }
    },
    {
      "id": "rel-03",
      "source": "ship_southern_cross",
      "target": "station_maitri",
      "label": "RESUPPLIES",
      "animated": false,
      "style": {
        "stroke": "#3b82f6",
        "strokeWidth": 1.6
      },
      "data": {
        "relation": "RESUPPLIES",
        "status": "NORMAL",
        "weight": 0.88,
        "full_label": "RESUPPLIES (Approaching)"
      }
    },
    {
      "id": "rel-04",
      "source": "cargo_food",
      "target": "ship_polar_star",
      "label": "LOADED_ON",
      "animated": false,
      "style": {
        "stroke": "#3b82f6",
        "strokeWidth": 1.6
      },
      "data": {
        "relation": "LOADED_ON",
        "status": "NORMAL",
        "weight": 0.95,
        "full_label": "LOADED_ON"
      }
    },
    {
      "id": "rel-05",
      "source": "cargo_rotor_spares",
      "target": "ship_polar_star",
      "label": "LOADED_ON",
      "animated": false,
      "style": {
        "stroke": "#3b82f6",
        "strokeWidth": 1.6
      },
      "data": {
        "relation": "LOADED_ON",
        "status": "NORMAL",
        "weight": 0.95,
        "full_label": "LOADED_ON"
      }
    },
    {
      "id": "rel-06",
      "source": "cargo_fuel_diesel",
      "target": "ship_southern_cross",
      "label": "LOADED_ON",
      "animated": false,
      "style": {
        "stroke": "#3b82f6",
        "strokeWidth": 1.6
      },
      "data": {
        "relation": "LOADED_ON",
        "status": "NORMAL",
        "weight": 0.9,
        "full_label": "LOADED_ON"
      }
    },
    {
      "id": "rel-07",
      "source": "cargo_medical",
      "target": "ship_ocean_guardian",
      "label": "LOADED_ON",
      "animated": false,
      "style": {
        "stroke": "#3b82f6",
        "strokeWidth": 1.6
      },
      "data": {
        "relation": "LOADED_ON",
        "status": "NORMAL",
        "weight": 0.95,
        "full_label": "LOADED_ON"
      }
    },
    {
      "id": "rel-08",
      "source": "cargo_food",
      "target": "station_davis",
      "label": "DESTINED_FOR",
      "animated": true,
      "style": {
        "stroke": "#f59e0b",
        "strokeWidth": 1.6
      },
      "data": {
        "relation": "DESTINED_FOR",
        "status": "DELAYED",
        "weight": 0.85,
        "full_label": "DESTINED_FOR (Critical)"
      }
    },
    {
      "id": "rel-09",
      "source": "cargo_fuel_diesel",
      "target": "station_maitri",
      "label": "DESTINED_FOR",
      "animated": false,
      "style": {
        "stroke": "#3b82f6",
        "strokeWidth": 1.6
      },
      "data": {
        "relation": "DESTINED_FOR",
        "status": "NORMAL",
        "weight": 0.9,
        "full_label": "DESTINED_FOR"
      }
    },
    {
      "id": "rel-10",
      "source": "cargo_rotor_spares",
      "target": "equipment_gen_2",
      "label": "REQUIRED_BY",
      "animated": true,
      "style": {
        "stroke": "#ef4444",
        "strokeWidth": 2.2
      },
      "data": {
        "relation": "REQUIRED_BY",
        "status": "CRITICAL",
        "weight": 0.98,
        "full_label": "REQUIRED_BY (Overdue Repair)"
      }
    },
    {
      "id": "rel-11",
      "source": "equipment_gen_2",
      "target": "station_davis",
      "label": "POWERS",
      "animated": true,
      "style": {
        "stroke": "#ef4444",
        "strokeWidth": 2.2
      },
      "data": {
        "relation": "POWERS",
        "status": "CRITICAL",
        "weight": 0.9,
        "full_label": "POWERS (Degraded Bus)"
      }
    },
    {
      "id": "rel-12",
      "source": "equipment_gen_1",
      "target": "station_davis",
      "label": "POWERS",
      "animated": false,
      "style": {
        "stroke": "#3b82f6",
        "strokeWidth": 1.6
      },
      "data": {
        "relation": "POWERS",
        "status": "NORMAL",
        "weight": 0.95,
        "full_label": "POWERS (Primary 81%)"
      }
    },
    {
      "id": "rel-13",
      "source": "equipment_gen_2",
      "target": "equipment_cold_storage",
      "label": "POWERS",
      "animated": true,
      "style": {
        "stroke": "#ef4444",
        "strokeWidth": 2.2
      },
      "data": {
        "relation": "POWERS",
        "status": "THREATENED",
        "weight": 0.92,
        "full_label": "POWERS (Cascade Risk)"
      }
    },
    {
      "id": "rel-14",
      "source": "equipment_fuel_pump_3",
      "target": "equipment_gen_2",
      "label": "FEEDS_FUEL_TO",
      "animated": false,
      "style": {
        "stroke": "#3b82f6",
        "strokeWidth": 1.6
      },
      "data": {
        "relation": "FEEDS_FUEL_TO",
        "status": "WARNING",
        "weight": 0.88,
        "full_label": "FEEDS_FUEL_TO"
      }
    },
    {
      "id": "rel-15",
      "source": "equipment_fuel_pump_3",
      "target": "equipment_gen_1",
      "label": "FEEDS_FUEL_TO",
      "animated": false,
      "style": {
        "stroke": "#3b82f6",
        "strokeWidth": 1.6
      },
      "data": {
        "relation": "FEEDS_FUEL_TO",
        "status": "NORMAL",
        "weight": 0.88,
        "full_label": "FEEDS_FUEL_TO"
      }
    },
    {
      "id": "rel-16",
      "source": "equipment_cold_storage",
      "target": "cargo_food",
      "label": "PRESERVES",
      "animated": true,
      "style": {
        "stroke": "#ef4444",
        "strokeWidth": 2.2
      },
      "data": {
        "relation": "PRESERVES",
        "status": "THREATENED",
        "weight": 0.96,
        "full_label": "PRESERVES (6.5h Buffer)"
      }
    },
    {
      "id": "rel-17",
      "source": "station_davis",
      "target": "personnel_davis_crew",
      "label": "HOUSES_AND_PROTECTS",
      "animated": false,
      "style": {
        "stroke": "#3b82f6",
        "strokeWidth": 1.6
      },
      "data": {
        "relation": "HOUSES_AND_PROTECTS",
        "status": "NORMAL",
        "weight": 0.99,
        "full_label": "HOUSES_AND_PROTECTS"
      }
    },
    {
      "id": "rel-18",
      "source": "cargo_food",
      "target": "personnel_davis_crew",
      "label": "SUSTAINS",
      "animated": false,
      "style": {
        "stroke": "#3b82f6",
        "strokeWidth": 1.6
      },
      "data": {
        "relation": "SUSTAINS",
        "status": "WARNING",
        "weight": 0.99,
        "full_label": "SUSTAINS (18 Days Left)"
      }
    },
    {
      "id": "rel-19",
      "source": "equipment_sat_terminal",
      "target": "station_davis",
      "label": "CONNECTS",
      "animated": false,
      "style": {
        "stroke": "#3b82f6",
        "strokeWidth": 1.6
      },
      "data": {
        "relation": "CONNECTS",
        "status": "NORMAL",
        "weight": 0.98,
        "full_label": "CONNECTS (Telemetry Hub)"
      }
    },
    {
      "id": "rel-20",
      "source": "equipment_sat_terminal",
      "target": "ship_polar_star",
      "label": "COMMS_LINK",
      "animated": false,
      "style": {
        "stroke": "#3b82f6",
        "strokeWidth": 1.6
      },
      "data": {
        "relation": "COMMS_LINK",
        "status": "NORMAL",
        "weight": 0.85,
        "full_label": "COMMS_LINK"
      }
    },
    {
      "id": "rel-21",
      "source": "infra_fast_ice_wharf",
      "target": "ship_polar_star",
      "label": "BERTHING_FACILITY",
      "animated": false,
      "style": {
        "stroke": "#3b82f6",
        "strokeWidth": 1.6
      },
      "data": {
        "relation": "BERTHING_FACILITY",
        "status": "WARNING",
        "weight": 0.8,
        "full_label": "BERTHING_FACILITY"
      }
    },
    {
      "id": "rel-22",
      "source": "infra_davis_runway",
      "target": "station_davis",
      "label": "AEROMEDICAL_ACCESS",
      "animated": false,
      "style": {
        "stroke": "#3b82f6",
        "strokeWidth": 1.6
      },
      "data": {
        "relation": "AEROMEDICAL_ACCESS",
        "status": "NORMAL",
        "weight": 0.9,
        "full_label": "AEROMEDICAL_ACCESS"
      }
    },
    {
      "id": "rel-23",
      "source": "env_weddell_ice",
      "target": "ship_polar_star",
      "label": "THREATENS",
      "animated": true,
      "style": {
        "stroke": "#ef4444",
        "strokeWidth": 2.2
      },
      "data": {
        "relation": "THREATENS",
        "status": "CRITICAL",
        "weight": 0.94,
        "full_label": "THREATENS (Beset Hazard)"
      }
    },
    {
      "id": "rel-24",
      "source": "env_ross_storm",
      "target": "station_himadri",
      "label": "THREATENS",
      "animated": false,
      "style": {
        "stroke": "#3b82f6",
        "strokeWidth": 1.6
      },
      "data": {
        "relation": "THREATENS",
        "status": "WARNING",
        "weight": 0.85,
        "full_label": "THREATENS (Katabatic 48kt)"
      }
    },
    {
      "id": "rel-25",
      "source": "station_bharati",
      "target": "station_davis",
      "label": "MUTUAL_AID_PARTNER",
      "animated": false,
      "style": {
        "stroke": "#3b82f6",
        "strokeWidth": 1.6
      },
      "data": {
        "relation": "MUTUAL_AID_PARTNER",
        "status": "NORMAL",
        "weight": 0.75,
        "full_label": "MUTUAL_AID (340nm Air Link)"
      }
    },
    {
      "id": "rel-26",
      "source": "personnel_maitri_engineers",
      "target": "station_maitri",
      "label": "MAINTAINED_BY",
      "animated": false,
      "style": {
        "stroke": "#3b82f6",
        "strokeWidth": 1.6
      },
      "data": {
        "relation": "MAINTAINED_BY",
        "status": "NORMAL",
        "weight": 0.95,
        "full_label": "MAINTAINED_BY"
      }
    }
  ],
  "total_nodes": 23,
  "total_edges": 26
};

export const SEED_NODES: Record<string, DigitalTwinNode> = {
  "ship_polar_star": {
    "id": "ship_polar_star",
    "label": "Polar Star",
    "category": "SHIP",
    "status": "WARNING",
    "health_score": 72,
    "freshness": "FRESH",
    "last_update": "2026-09-28T10:18:43.536218+00:00",
    "data_source": "AIS Direct Stream + SAR Cross-Ref",
    "properties": {
      "vessel_type": "Heavy Polar Icebreaker (WAGB-10)",
      "ice_class": "Polar Class 1 (PC1)",
      "imo": "7367471",
      "latitude": -73.2,
      "longitude": -44.5,
      "speed_knots": 6.2,
      "design_speed_knots": 17.0,
      "heading_degrees": 112,
      "destination": "Davis Station",
      "eta": "2026-10-02T12:00:00Z",
      "predicted_eta": "2026-10-03T14:33:00Z",
      "expected_delay_hours": 26.5,
      "fuel_remaining_pct": 68.0,
      "crew_complement": 134,
      "cargo_onboard": [
        "Food Resupply (42t)",
        "Generator Rotor Spares",
        "Winter Diesel (180t)"
      ],
      "weather_exposure": "Headwind 38kt, Temp -22\u00b0C",
      "sea_ice_exposure": "Heavy Compression Pack (82%)",
      "comms_status": "ONLINE (Iridium SBD + VSAT)"
    },
    "risk": {
      "level": "HIGH",
      "score": 0.78,
      "confidence": 0.84,
      "horizon": "+24h",
      "model": "XGBoost Polar Voyage Regressor v2.4",
      "contributing_factors": [
        {
          "factor": "Weddell Pack Compression",
          "weight": 0.44,
          "impact": "+14.2h delay"
        },
        {
          "factor": "Headwind Shear (38kt)",
          "weight": 0.28,
          "impact": "+7.5h delay"
        },
        {
          "factor": "Reduced Hull Speed in Ridge",
          "weight": 0.28,
          "impact": "+4.8h delay"
        }
      ]
    }
  },
  "ship_aurora_exp": {
    "id": "ship_aurora_exp",
    "label": "Aurora Explorer",
    "category": "SHIP",
    "status": "NORMAL",
    "health_score": 96,
    "freshness": "FRESH",
    "last_update": "2026-09-28T10:18:57.536218+00:00",
    "data_source": "AIS Direct Stream",
    "properties": {
      "vessel_type": "Polar Research & Supply Vessel",
      "ice_class": "Polar Class 3 (PC3)",
      "imo": "9845123",
      "latitude": -67.2,
      "longitude": 78.5,
      "speed_knots": 11.5,
      "design_speed_knots": 14.5,
      "heading_degrees": 210,
      "destination": "Bharati Station",
      "eta": "2026-10-04T09:15:00Z",
      "predicted_eta": "2026-10-04T10:30:00Z",
      "expected_delay_hours": 1.25,
      "fuel_remaining_pct": 82.0,
      "crew_complement": 48,
      "cargo_onboard": [
        "Scientific Drilling Ice Rigs",
        "Cryogenic Nitrogen Dewars",
        "Dry Food Provisions"
      ],
      "weather_exposure": "Calm, Wind 14kt, Temp -11\u00b0C",
      "sea_ice_exposure": "Open Navigable Leads (15%)",
      "comms_status": "ONLINE (Starlink Polar + Inmarsat Fleet)"
    },
    "risk": {
      "level": "LOW",
      "score": 0.14,
      "confidence": 0.92,
      "horizon": "+48h",
      "model": "XGBoost Polar Voyage Regressor v2.4",
      "contributing_factors": [
        {
          "factor": "Open Water Swell",
          "weight": 0.7,
          "impact": "+1.0h delay"
        },
        {
          "factor": "Minor Crosswind",
          "weight": 0.3,
          "impact": "+0.25h delay"
        }
      ]
    }
  },
  "ship_southern_cross": {
    "id": "ship_southern_cross",
    "label": "Southern Cross",
    "category": "SHIP",
    "status": "NORMAL",
    "health_score": 91,
    "freshness": "FRESH",
    "last_update": "2026-09-28T10:17:25.536218+00:00",
    "data_source": "AIS Direct Stream",
    "properties": {
      "vessel_type": "Antarctic Logistic Support Vessel",
      "ice_class": "1A Super Ice Class",
      "imo": "9722340",
      "latitude": -69.8,
      "longitude": 12.5,
      "speed_knots": 10.2,
      "design_speed_knots": 13.0,
      "heading_degrees": 145,
      "destination": "Maitri Station Fast Ice Margin",
      "eta": "2026-10-03T18:00:00Z",
      "predicted_eta": "2026-10-03T20:45:00Z",
      "expected_delay_hours": 2.75,
      "fuel_remaining_pct": 74.0,
      "crew_complement": 42,
      "cargo_onboard": [
        "Bulk Diesel (500t)",
        "Vehicle Spares",
        "Modular Lab Units"
      ],
      "weather_exposure": "Wind 22kt E, Temp -14\u00b0C",
      "sea_ice_exposure": "First-year pack fringe",
      "comms_status": "ONLINE (VSAT)"
    },
    "risk": {
      "level": "LOW",
      "score": 0.22,
      "confidence": 0.88,
      "horizon": "+24h",
      "model": "XGBoost Polar Voyage Regressor v2.4",
      "contributing_factors": [
        {
          "factor": "Fringe Pack Navigation",
          "weight": 0.65,
          "impact": "+2.0h delay"
        },
        {
          "factor": "Light Snow Squalls",
          "weight": 0.35,
          "impact": "+0.75h delay"
        }
      ]
    }
  },
  "ship_ocean_guardian": {
    "id": "ship_ocean_guardian",
    "label": "Ocean Guardian",
    "category": "SHIP",
    "status": "NORMAL",
    "health_score": 94,
    "freshness": "RECENT",
    "last_update": "2026-09-28T10:13:25.536218+00:00",
    "data_source": "AIS Direct Stream",
    "properties": {
      "vessel_type": "Environmental & SAR Patrol Vessel",
      "ice_class": "Polar Class 4 (PC4)",
      "imo": "9618824",
      "latitude": -64.8,
      "longitude": -63.5,
      "speed_knots": 12.0,
      "design_speed_knots": 15.0,
      "heading_degrees": 235,
      "destination": "Rothera Station",
      "eta": "2026-10-01T14:00:00Z",
      "predicted_eta": "2026-10-01T14:30:00Z",
      "expected_delay_hours": 0.5,
      "fuel_remaining_pct": 88.0,
      "crew_complement": 36,
      "cargo_onboard": [
        "Medical Trauma Kits",
        "Aviation Jet-A1 Drums (40t)"
      ],
      "weather_exposure": "Drake Passage Swell 3.5m, Temp -6\u00b0C",
      "sea_ice_exposure": "Ice Free Corridor",
      "comms_status": "ONLINE (Starlink + Iridium)"
    },
    "risk": {
      "level": "LOW",
      "score": 0.12,
      "confidence": 0.95,
      "horizon": "+24h",
      "model": "XGBoost Polar Voyage Regressor v2.4",
      "contributing_factors": [
        {
          "factor": "Ocean Swell Retardation",
          "weight": 1.0,
          "impact": "+0.5h delay"
        }
      ]
    }
  },
  "station_davis": {
    "id": "station_davis",
    "label": "Davis Station",
    "category": "STATION",
    "status": "WARNING",
    "health_score": 68,
    "freshness": "FRESH",
    "last_update": "2026-09-28T10:15:25.536218+00:00",
    "data_source": "Davis SCADA Gateway + BGAN Link",
    "properties": {
      "station_type": "Year-Round Continental Research Station",
      "country": "Australia (AAD)",
      "latitude": -68.576,
      "longitude": 77.967,
      "elevation_m": 12,
      "population": 84,
      "power_status": "74% (1 of 3 Main Turbines Offline)",
      "fuel_days_remaining": 142,
      "food_days_remaining": 18,
      "water_reserve_days": 45,
      "critical_inventory_pct": 72.0,
      "landing_facility": "Davis Sea-Ice Skiway (Active)",
      "emergency_status": "ATTENTION_REQUIRED",
      "current_weather": "Temp -18.4\u00b0C, Wind 28kt NE, Visibility 6km, Pressure 982 hPa",
      "comms_link": "Optus C1 Satellite VSAT (Online)"
    },
    "risk": {
      "level": "MEDIUM",
      "score": 0.64,
      "confidence": 0.89,
      "horizon": "+72h",
      "model": "LightGBM Station Operational Classifier v1.8",
      "contributing_factors": [
        {
          "factor": "Generator #2 Mechanical Anomaly",
          "weight": 0.52,
          "impact": "Power margin degraded"
        },
        {
          "factor": "Polar Star Resupply Delay (+26h)",
          "weight": 0.34,
          "impact": "Food stock buffer shrinking"
        },
        {
          "factor": "Approaching Katabatic Squall",
          "weight": 0.14,
          "impact": "Outdoor movement restricted"
        }
      ]
    }
  },
  "station_maitri": {
    "id": "station_maitri",
    "label": "Maitri Station",
    "category": "STATION",
    "status": "NORMAL",
    "health_score": 88,
    "freshness": "RECENT",
    "last_update": "2026-09-28T10:05:25.536218+00:00",
    "data_source": "Schirmacher Oasis Telemetry Node",
    "properties": {
      "station_type": "Year-Round Research Base",
      "country": "India (NCPOR)",
      "latitude": -70.767,
      "longitude": 11.733,
      "elevation_m": 117,
      "population": 25,
      "power_status": "94% (Combined Diesel + Solar)",
      "fuel_days_remaining": 68,
      "food_days_remaining": 82,
      "water_reserve_days": 38,
      "critical_inventory_pct": 84.0,
      "landing_facility": "Blue Ice Runway (ALCI / DROMLAN Link)",
      "emergency_status": "NORMAL",
      "current_weather": "Temp -14.1\u00b0C, Wind 24kt E, Clear, Pressure 986 hPa",
      "comms_link": "GSAT-10 Dedicated Transponder (Online)"
    },
    "risk": {
      "level": "LOW",
      "score": 0.24,
      "confidence": 0.91,
      "horizon": "+7 days",
      "model": "LightGBM Station Operational Classifier v1.8",
      "contributing_factors": [
        {
          "factor": "Seasonal Fuel Burn Tracking",
          "weight": 0.8,
          "impact": "Resupply tanker S.A. Agulhas II en route"
        },
        {
          "factor": "Minor Filter Service Due",
          "weight": 0.2,
          "impact": "Routine task"
        }
      ]
    }
  },
  "station_bharati": {
    "id": "station_bharati",
    "label": "Bharati Station",
    "category": "STATION",
    "status": "NORMAL",
    "health_score": 95,
    "freshness": "FRESH",
    "last_update": "2026-09-28T10:17:25.536218+00:00",
    "data_source": "Larsemann Hills High-Speed Optical Hub",
    "properties": {
      "station_type": "State-of-the-Art Containerized Antarctic Base",
      "country": "India (NCPOR)",
      "latitude": -69.407,
      "longitude": 76.195,
      "elevation_m": 35,
      "population": 46,
      "power_status": "98% (Multi-Tier Redundant)",
      "fuel_days_remaining": 210,
      "food_days_remaining": 160,
      "water_reserve_days": 90,
      "critical_inventory_pct": 94.0,
      "landing_facility": "Twin Helipads + Fast Ice Approach",
      "emergency_status": "NORMAL",
      "current_weather": "Temp -16.0\u00b0C, Wind 18kt ENE, Visibility 12km, Pressure 988 hPa",
      "comms_link": "Dual Fiber-backed VSAT to Hyderabad Ground Station"
    },
    "risk": {
      "level": "LOW",
      "score": 0.1,
      "confidence": 0.97,
      "horizon": "+30 days",
      "model": "LightGBM Station Operational Classifier v1.8",
      "contributing_factors": [
        {
          "factor": "Nominal Vitals Across All Subsystems",
          "weight": 1.0,
          "impact": "Stable baseline"
        }
      ]
    }
  },
  "station_himadri": {
    "id": "station_himadri",
    "label": "Himadri Station Link",
    "category": "STATION",
    "status": "NORMAL",
    "health_score": 92,
    "freshness": "RECENT",
    "last_update": "2026-09-28T10:01:25.536218+00:00",
    "data_source": "Polar Gateway Cross-Link",
    "properties": {
      "station_type": "Atmospheric & Polar Science Node",
      "country": "International / NCPOR Polar Collaborative",
      "latitude": -78.85,
      "longitude": 166.67,
      "elevation_m": 24,
      "population": 18,
      "power_status": "92%",
      "fuel_days_remaining": 95,
      "food_days_remaining": 60,
      "water_reserve_days": 50,
      "critical_inventory_pct": 89.0,
      "landing_facility": "Ice Shelf Skiway",
      "emergency_status": "NORMAL",
      "current_weather": "Temp -28.2\u00b0C, Wind 31kt SW, Pressure 974 hPa",
      "comms_link": "Iridium Certus Relay"
    },
    "risk": {
      "level": "LOW",
      "score": 0.18,
      "confidence": 0.93,
      "horizon": "+72h",
      "model": "LightGBM Station Operational Classifier v1.8",
      "contributing_factors": [
        {
          "factor": "Low Ambient Temp Thermal Stress",
          "weight": 0.7,
          "impact": "Insulation monitoring nominal"
        },
        {
          "factor": "Comms Jitter in Magnetic Drift",
          "weight": 0.3,
          "impact": "Packet loss <2%"
        }
      ]
    }
  },
  "equipment_gen_2": {
    "id": "equipment_gen_2",
    "label": "Generator #2 (Davis Diesel)",
    "category": "EQUIPMENT",
    "status": "CRITICAL",
    "health_score": 38,
    "freshness": "FRESH",
    "last_update": "2026-09-28T10:18:25.536218+00:00",
    "data_source": "Davis Station IoT Vibration SCADA Node 4",
    "properties": {
      "equipment_type": "Caterpillar 3512B Arctic Diesel Generator",
      "rated_power_kw": 1200,
      "current_output_kw": 640,
      "utilization_pct": 53.3,
      "temperature_c": 98.4,
      "vibration_rms_mms": 14.8,
      "baseline_vibration_mms": 4.2,
      "bearing_pressure_bar": 3.8,
      "runtime_hours": 18420,
      "maintenance_status": "OVERDUE by 420 hrs",
      "assigned_location": "Davis Station Powerhouse #1"
    },
    "risk": {
      "level": "CRITICAL",
      "score": 0.88,
      "failure_probability_pct": 68.0,
      "failure_horizon": "24 hours",
      "confidence": 0.82,
      "model": "Isolation Forest + Weibull Survival Analysis Engine",
      "contributing_factors": [
        {
          "factor": "Vibration Anomaly Spike",
          "weight": 0.42,
          "impact": "+18% failure probability"
        },
        {
          "factor": "Overdue Scheduled Overhaul",
          "weight": 0.28,
          "impact": "+21% failure probability"
        },
        {
          "factor": "Cooling Circuit Thermal Elevation (+14%)",
          "weight": 0.18,
          "impact": "+12% failure probability"
        },
        {
          "factor": "Continuous Extreme Load Cycle",
          "weight": 0.12,
          "impact": "+9% failure probability"
        }
      ]
    }
  },
  "equipment_gen_1": {
    "id": "equipment_gen_1",
    "label": "Generator #1 (Primary)",
    "category": "EQUIPMENT",
    "status": "NORMAL",
    "health_score": 94,
    "freshness": "FRESH",
    "last_update": "2026-09-28T10:16:25.536218+00:00",
    "data_source": "Davis Station IoT SCADA Node 1",
    "properties": {
      "equipment_type": "Caterpillar 3512B Arctic Diesel Generator",
      "rated_power_kw": 1200,
      "current_output_kw": 980,
      "utilization_pct": 81.6,
      "temperature_c": 76.2,
      "vibration_rms_mms": 3.9,
      "bearing_pressure_bar": 4.6,
      "runtime_hours": 9240,
      "maintenance_status": "Nominal (Next in 760 hrs)",
      "assigned_location": "Davis Station Powerhouse #1"
    },
    "risk": {
      "level": "LOW",
      "score": 0.15,
      "failure_probability_pct": 8.0,
      "failure_horizon": "60 days",
      "confidence": 0.94,
      "model": "Isolation Forest Sensor Anomaly",
      "contributing_factors": [
        {
          "factor": "Nominal Harmonic Signature",
          "weight": 1.0,
          "impact": "Safe operating limits"
        }
      ]
    }
  },
  "equipment_fuel_pump_3": {
    "id": "equipment_fuel_pump_3",
    "label": "Fuel Transfer Pump #3",
    "category": "EQUIPMENT",
    "status": "WARNING",
    "health_score": 74,
    "freshness": "RECENT",
    "last_update": "2026-09-28T10:07:25.536218+00:00",
    "data_source": "Davis Bulk Fuel Supervisory Telemetry",
    "properties": {
      "equipment_type": "Positive Displacement Heavy Fuel Pump",
      "flow_rate_lpm": 380,
      "suction_pressure_bar": 1.2,
      "temperature_c": -6.0,
      "runtime_hours": 6420,
      "cavitation_risk": "MEDIUM (Viscosity elevated by extreme ambient cold)",
      "assigned_location": "Davis Fuel Farm Manifold"
    },
    "risk": {
      "level": "MEDIUM",
      "score": 0.48,
      "failure_probability_pct": 28.0,
      "failure_horizon": "72 hours",
      "confidence": 0.86,
      "model": "Autoencoder Multivariate Anomaly Detector",
      "contributing_factors": [
        {
          "factor": "Cold Viscosity Drag on Impeller",
          "weight": 0.6,
          "impact": "Current draw elevated +15%"
        },
        {
          "factor": "Minor Seal Gland Leakage",
          "weight": 0.4,
          "impact": "Pressure drop 0.4 bar"
        }
      ]
    }
  },
  "equipment_cold_storage": {
    "id": "equipment_cold_storage",
    "label": "Station Deep Freezer / Cold Storage",
    "category": "EQUIPMENT",
    "status": "NORMAL",
    "health_score": 86,
    "freshness": "FRESH",
    "last_update": "2026-09-28T10:17:25.536218+00:00",
    "data_source": "Davis Facilities Management SCADA",
    "properties": {
      "equipment_type": "Dual-Compressor Blast & Holding Cold Store",
      "chamber_temp_c": -22.4,
      "setpoint_temp_c": -24.0,
      "thermal_buffer_hours": 6.5,
      "compressor_status": "Compressor A Active, B Standby",
      "power_source": "Generator #2 / Bus A Circuit",
      "assigned_location": "Davis Logistics Compound"
    },
    "risk": {
      "level": "MEDIUM",
      "score": 0.58,
      "failure_probability_pct": 34.0,
      "failure_horizon": "6 hours (if power drops)",
      "confidence": 0.9,
      "model": "Physics-Based Thermal Degradation Predictor",
      "contributing_factors": [
        {
          "factor": "Dependency on Vulnerable Gen #2 Bus",
          "weight": 0.75,
          "impact": "High cascade exposure"
        },
        {
          "factor": "Door Seal Air Ingress",
          "weight": 0.25,
          "impact": "Minor 1.2\u00b0C temperature creep"
        }
      ]
    }
  },
  "equipment_sat_terminal": {
    "id": "equipment_sat_terminal",
    "label": "C-Band Radome VSAT Terminal",
    "category": "EQUIPMENT",
    "status": "NORMAL",
    "health_score": 96,
    "freshness": "FRESH",
    "last_update": "2026-09-28T10:19:07.536218+00:00",
    "data_source": "Comms Tower Telemetry",
    "properties": {
      "equipment_type": "2.4m Heated Radome Satellite Dish",
      "uplink_margin_db": 8.4,
      "de-icing_heater_state": "ACTIVE (Maintaining +4\u00b0C dome shell)",
      "radome_wind_rating_kt": 110,
      "latency_ms": 580,
      "assigned_location": "Davis Comms Mast Hill"
    },
    "risk": {
      "level": "LOW",
      "score": 0.08,
      "failure_probability_pct": 3.0,
      "failure_horizon": "30 days",
      "confidence": 0.98,
      "model": "Isolation Forest",
      "contributing_factors": [
        {
          "factor": "Radome Heating Functional",
          "weight": 1.0,
          "impact": "No ice build-up"
        }
      ]
    }
  },
  "cargo_food": {
    "id": "cargo_food",
    "label": "Food Resupply Provisions",
    "category": "CARGO",
    "status": "WARNING",
    "health_score": 70,
    "freshness": "FRESH",
    "last_update": "2026-09-28T10:14:25.536218+00:00",
    "data_source": "Inventory & Logistics ERP Synchronizer",
    "properties": {
      "quantity": "42 Metric Tons (4,800 Man-Days)",
      "current_location": "En Route aboard Polar Star",
      "destination": "Davis Station Logistics Store",
      "temperature_requirement": "-20\u00b0C Reefer Container",
      "expiration_risk": "Reefer battery reserve 72h without vessel power",
      "priority": "P1 - MISSION CRITICAL",
      "transport_status": "Delayed in Weddell Compression"
    },
    "risk": {
      "level": "HIGH",
      "score": 0.74,
      "confidence": 0.85,
      "horizon": "+24h",
      "model": "XGBoost Supply Chain Disruption Forecaster",
      "contributing_factors": [
        {
          "factor": "Carrier Vessel Delay (+26h)",
          "weight": 0.7,
          "impact": "Station buffer down to 18 days"
        },
        {
          "factor": "Reefer Container Power Cycling",
          "weight": 0.3,
          "impact": "Cold-chain thermal stress"
        }
      ]
    }
  },
  "cargo_fuel_diesel": {
    "id": "cargo_fuel_diesel",
    "label": "Polar Winter Diesel (SAB Grade)",
    "category": "CARGO",
    "status": "NORMAL",
    "health_score": 92,
    "freshness": "RECENT",
    "last_update": "2026-09-28T10:04:25.536218+00:00",
    "data_source": "Bulk Fuel Telemetry",
    "properties": {
      "quantity": "650 Metric Tons",
      "current_location": "Southern Cross Cargo Tanks",
      "destination": "Maitri Station Bulk Depot",
      "temperature_requirement": "Pour point -50\u00b0C additives certified",
      "priority": "P1 - LIFE SUPPORT",
      "transport_status": "On schedule for marginal ice transfer"
    },
    "risk": {
      "level": "LOW",
      "score": 0.16,
      "confidence": 0.92,
      "horizon": "+72h",
      "model": "LightGBM Demand Forecaster",
      "contributing_factors": [
        {
          "factor": "Stable Transit Rate",
          "weight": 1.0,
          "impact": "Tanker within 48h of fast ice margin"
        }
      ]
    }
  },
  "cargo_rotor_spares": {
    "id": "cargo_rotor_spares",
    "label": "Generator Rotor & Bearing Spares",
    "category": "CARGO",
    "status": "WARNING",
    "health_score": 65,
    "freshness": "FRESH",
    "last_update": "2026-09-28T10:11:25.536218+00:00",
    "data_source": "Critical Spares Logistics Inventory",
    "properties": {
      "quantity": "2x Main Drive Bearings + 1x Exciter Stator",
      "current_location": "Cargo Hold #2, Polar Star",
      "destination": "Davis Station Powerhouse #1",
      "target_equipment": "Generator #2",
      "priority": "P0 - URGENT OVERHAUL REQUIREMENT",
      "transport_status": "Delayed"
    },
    "risk": {
      "level": "HIGH",
      "score": 0.82,
      "confidence": 0.88,
      "horizon": "+24h",
      "model": "OR-Tools Critical Path Analyzer",
      "contributing_factors": [
        {
          "factor": "Polar Star Speed Loss (6.2kt)",
          "weight": 0.85,
          "impact": "Rotor cannot reach Davis before Gen #2 predicted failure"
        },
        {
          "factor": "Heavy Rigging Lead Time at Sea",
          "weight": 0.15,
          "impact": "Dockside crane required"
        }
      ]
    }
  },
  "cargo_medical": {
    "id": "cargo_medical",
    "label": "Emergency Surgical & Trauma Supplies",
    "category": "CARGO",
    "status": "NORMAL",
    "health_score": 98,
    "freshness": "FRESH",
    "last_update": "2026-09-28T10:09:25.536218+00:00",
    "data_source": "Polar Medical Logistics Unit",
    "properties": {
      "quantity": "3x Aeromedical Evacuation Kits + Blood Plasma",
      "current_location": "Ocean Guardian Medical Locker",
      "destination": "Rothera Station Surgical Suite",
      "temperature_requirement": "+2\u00b0C to +8\u00b0C Active Chilled Box",
      "priority": "P1 - CLINICAL CONTINGENCY",
      "transport_status": "Transit proceeding nominally"
    },
    "risk": {
      "level": "LOW",
      "score": 0.08,
      "confidence": 0.96,
      "horizon": "+24h",
      "model": "LightGBM Demand Forecaster",
      "contributing_factors": [
        {
          "factor": "Protected Onboard Stowage",
          "weight": 1.0,
          "impact": "No temperature deviation"
        }
      ]
    }
  },
  "personnel_davis_crew": {
    "id": "personnel_davis_crew",
    "label": "Davis Station Winter-Over Team",
    "category": "PERSONNEL",
    "status": "WARNING",
    "health_score": 78,
    "freshness": "RECENT",
    "last_update": "2026-09-28T09:54:25.536218+00:00",
    "data_source": "Station Daily Muster & Personnel Roster",
    "properties": {
      "headcount": 84,
      "roles": "24 Engineering/Maintenance, 32 Science/Meteorology, 8 Medical, 20 Logistics/Ops",
      "location": "Davis Station Main Accommodation Living Module",
      "life_support_dependency": "Station Power Bus & Heating Circuit",
      "food_stock_per_capita": "18 days remaining buffer",
      "evacuation_status": "Shelter-in-Place Nominal"
    },
    "risk": {
      "level": "MEDIUM",
      "score": 0.54,
      "confidence": 0.86,
      "horizon": "+72h",
      "model": "Human Safety Impact Assessor",
      "contributing_factors": [
        {
          "factor": "Potential Power Rationing if Gen #2 Trips",
          "weight": 0.65,
          "impact": "Habitation heating restricted to redundant circuit"
        },
        {
          "factor": "Delayed Fresh Food Influx",
          "weight": 0.35,
          "impact": "Transition to dry military rations"
        }
      ]
    }
  },
  "personnel_maitri_engineers": {
    "id": "personnel_maitri_engineers",
    "label": "Maitri Station Engineering Unit",
    "category": "PERSONNEL",
    "status": "NORMAL",
    "health_score": 94,
    "freshness": "RECENT",
    "last_update": "2026-09-28T09:39:25.536218+00:00",
    "data_source": "NCPOR Station Roster",
    "properties": {
      "headcount": 12,
      "roles": "Diesel Mechanics, High-Voltage Technicians, HVAC Specialist",
      "location": "Maitri Workshop Complex",
      "operational_readiness": "100%",
      "emergency_response": "Equipped for PistenBully traverse & heavy recovery"
    },
    "risk": {
      "level": "LOW",
      "score": 0.12,
      "confidence": 0.95,
      "horizon": "+7 days",
      "model": "Human Safety Impact Assessor",
      "contributing_factors": [
        {
          "factor": "All Facilities Operating Nominally",
          "weight": 1.0,
          "impact": "No incident"
        }
      ]
    }
  },
  "infra_davis_runway": {
    "id": "infra_davis_runway",
    "label": "Davis Sea-Ice Skiway",
    "category": "INFRASTRUCTURE",
    "status": "NORMAL",
    "health_score": 90,
    "freshness": "RECENT",
    "last_update": "2026-09-28T09:19:25.536218+00:00",
    "data_source": "Airfield Ground Observer Report",
    "properties": {
      "surface_type": "Compressed Perennial Sea Ice / Snowcap",
      "usable_length_m": 2400,
      "bearing_capacity": "Max 55t (LC-130 Hercules / Basler BT-67 approved)",
      "ice_core_thickness_cm": 182,
      "friction_coefficient": 0.38,
      "lighting": "LED Portable PAPI Units Functional"
    },
    "risk": {
      "level": "LOW",
      "score": 0.2,
      "confidence": 0.9,
      "horizon": "+48h",
      "model": "Aviation Ice Structural Evaluator",
      "contributing_factors": [
        {
          "factor": "Stable Negative Air Temperature",
          "weight": 0.85,
          "impact": "Ice sheet strength solid"
        },
        {
          "factor": "Light Surface Drifting Snow",
          "weight": 0.15,
          "impact": "Snowcat grooming required"
        }
      ]
    }
  },
  "infra_fast_ice_wharf": {
    "id": "infra_fast_ice_wharf",
    "label": "Prydz Bay Fast Ice Mooring Wharf",
    "category": "INFRASTRUCTURE",
    "status": "WARNING",
    "health_score": 68,
    "freshness": "RECENT",
    "last_update": "2026-09-28T08:19:25.536218+00:00",
    "data_source": "Sentinel-1 SAR Swath + Coastal Ice Profiler",
    "properties": {
      "wharf_type": "Natural Fast Ice Edge Offload Pier",
      "ice_thickness_m": 2.4,
      "stability": "Micro-cracks detected by ground radar 350m west",
      "crane_operations_limit": "Max 25t container lift",
      "target_vessel": "Polar Star / Aurora Explorer"
    },
    "risk": {
      "level": "MEDIUM",
      "score": 0.58,
      "confidence": 0.84,
      "horizon": "+24h",
      "model": "CryoSat-2 / SAR Ice Fatigue Analyzer",
      "contributing_factors": [
        {
          "factor": "Tidal Wave Flexing",
          "weight": 0.6,
          "impact": "Edge calving hazard during heavy surge"
        },
        {
          "factor": "Late Arrival of Offload Convoy",
          "weight": 0.4,
          "impact": "Warm diurnal cycle exposure"
        }
      ]
    }
  },
  "env_weddell_ice": {
    "id": "env_weddell_ice",
    "label": "Weddell Sea Heavy Pack Ice Zone",
    "category": "ENVIRONMENT",
    "status": "CRITICAL",
    "health_score": 42,
    "freshness": "FRESH",
    "last_update": "2026-09-28T08:05:25.536218+00:00",
    "data_source": "Sentinel-1A SAR Swath Obs (Acquired 2h 14m ago)",
    "properties": {
      "observation_type": "10m C-Band SAR Synthetic Aperture Radar",
      "concentration_pct": 82.0,
      "ice_thickness_m": 2.8,
      "ridge_height_m": 3.4,
      "drift_vector": "18nm / 24h towards Northeast (Convergence)",
      "lead_navigability": "Compressed shut by cyclonic gyre",
      "affected_corridors": "Route R-01 (Polar Star Track)"
    },
    "risk": {
      "level": "CRITICAL",
      "score": 0.92,
      "confidence": 0.88,
      "horizon": "+24h",
      "model": "XGBoost Ice Advection & Dynamic Resistance",
      "contributing_factors": [
        {
          "factor": "Cyclonic Atmospheric Wind Forcing",
          "weight": 0.55,
          "impact": "High compressive pack stress"
        },
        {
          "factor": "Multi-Year Floe Incorporation",
          "weight": 0.45,
          "impact": "Severe hull kinetic resistance"
        }
      ]
    }
  },
  "env_ross_storm": {
    "id": "env_ross_storm",
    "label": "Ross Sea Katabatic Storm Cell",
    "category": "ENVIRONMENT",
    "status": "WARNING",
    "health_score": 58,
    "freshness": "FRESH",
    "last_update": "2026-09-28T10:15:25.536218+00:00",
    "data_source": "ECMWF High-Res 0.1\u00b0 Numerical Weather Cycle",
    "properties": {
      "observation_type": "Synoptic Polar Atmosphere Forecast",
      "wind_speed_knots": 48.0,
      "wind_gusts_knots": 62.0,
      "temperature_c": -26.5,
      "visibility_km": 0.8,
      "barometric_trend": "Falling 3.4 hPa/3hr (Rapid Deepening)",
      "affected_systems": "Himadri Link, McMurdo Convoy Route"
    },
    "risk": {
      "level": "HIGH",
      "score": 0.72,
      "confidence": 0.85,
      "horizon": "+12h",
      "model": "ECMWF / NOAA Polar Ensemble",
      "contributing_factors": [
        {
          "factor": "Interior Plateau Cold Air Gravitational Surge",
          "weight": 0.8,
          "impact": "Severe katabatic wind acceleration"
        },
        {
          "factor": "Blowing Snow Blindness",
          "weight": 0.2,
          "impact": "Zero visual flight rules (VFR)"
        }
      ]
    }
  }
};

export const SEED_CASCADES: CascadingImpact[] = [
  {
    "cascade_id": "CASCADE-GEN2-DAVIS",
    "trigger_node": "equipment_gen_2",
    "trigger_name": "Generator #2 Mechanical Vibration Anomaly",
    "root_cause": "Bearing fatigue and cooling loop thermal creep (+14\u00b0C above baseline) causing 14.8 mm/s vibration RMS.",
    "overall_severity": "CRITICAL",
    "confidence_score": 0.82,
    "stages": [
      {
        "step": 1,
        "node_id": "equipment_gen_2",
        "node_name": "Generator #2",
        "impact_type": "PRIMARY_TRIGGER",
        "severity": "CRITICAL",
        "time_horizon": "NOW",
        "estimated_elapsed_minutes": 0,
        "description": "IoT vibration sensor registers 14.8 mm/s (threshold: 7.1 mm/s). Failure probability is 68% within 24h.",
        "confidence": 0.88
      },
      {
        "step": 2,
        "node_id": "station_davis",
        "node_name": "Davis Station Power Grid",
        "impact_type": "POWER_DEGRADATION",
        "severity": "HIGH",
        "time_horizon": "5 MIN",
        "estimated_elapsed_minutes": 5,
        "description": "If Gen #2 trips, station power drops to 52% capacity. Non-essential circuits shed automatically.",
        "confidence": 0.92
      },
      {
        "step": 3,
        "node_id": "equipment_cold_storage",
        "node_name": "Cold Storage & Blast Freezers",
        "impact_type": "THERMAL_BUFFER_DEPLETION",
        "severity": "HIGH",
        "time_horizon": "30 MIN",
        "estimated_elapsed_minutes": 30,
        "description": "Backup compressor fails over to battery. Internal temperature starts creeping above -20\u00b0C after 6.5 hours.",
        "confidence": 0.84
      },
      {
        "step": 4,
        "node_id": "cargo_food",
        "node_name": "Food Resupply Provisions",
        "impact_type": "PRESERVATION_SPOILAGE_RISK",
        "severity": "CRITICAL",
        "time_horizon": "6 HOURS",
        "estimated_elapsed_minutes": 360,
        "description": "Loss of freezer storage imperils station perishables. Food buffer reduces from 18 days to emergency rations.",
        "confidence": 0.79
      },
      {
        "step": 5,
        "node_id": "ship_polar_star",
        "node_name": "Polar Star Logistics Conveyance",
        "impact_type": "RESUPPLY_PRIORITY_ESCALATION",
        "severity": "CRITICAL",
        "time_horizon": "24 HOURS",
        "estimated_elapsed_minutes": 1440,
        "description": "Polar Star carries Generator Rotor Spares & 42t provisions. Its +26h delay becomes the limiting factor for station sustainability.",
        "confidence": 0.86
      }
    ],
    "recommended_human_actions": [
      "Authorize emergency PHOENIX power shed protocol at Davis Station.",
      "Approve alternate ice-lead Route B for Polar Star to cut 14.5 hours off transit time.",
      "Dispatch maintenance crew to inspect Generator #2 bearing lubrication reservoir.",
      "Verify standby batteries for Reefer Container Holding facility."
    ]
  },
  {
    "cascade_id": "CASCADE-ICE-POLARSTAR",
    "trigger_node": "env_weddell_ice",
    "trigger_name": "Weddell Sea Pack Ice Convergence Surge",
    "root_cause": "Copernicus AMSR2 radiometer and Sentinel-1 SAR detect 82% multi-year ice compression.",
    "overall_severity": "HIGH",
    "confidence_score": 0.87,
    "stages": [
      {
        "step": 1,
        "node_id": "env_weddell_ice",
        "node_name": "Weddell Pack Compression",
        "impact_type": "ENVIRONMENTAL_SURGE",
        "severity": "HIGH",
        "time_horizon": "NOW",
        "estimated_elapsed_minutes": 0,
        "description": "Multi-year floes incorporated into 3.4m pressure ridges directly across shipping route R-01.",
        "confidence": 0.91
      },
      {
        "step": 2,
        "node_id": "ship_polar_star",
        "node_name": "Polar Star",
        "impact_type": "VESSEL_IMPEDANCE",
        "severity": "HIGH",
        "time_horizon": "2 HOURS",
        "estimated_elapsed_minutes": 120,
        "description": "Vessel speed drops to 3.2 knots. Engine thermal load increases 18% as ramming cycle commences.",
        "confidence": 0.86
      },
      {
        "step": 3,
        "node_id": "cargo_food",
        "node_name": "Food Resupply Provisions",
        "impact_type": "LOGISTICS_DELAY_CASCADE",
        "severity": "HIGH",
        "time_horizon": "24 HOURS",
        "estimated_elapsed_minutes": 1440,
        "description": "ETA at Davis Station postponed by +26.5 hours.",
        "confidence": 0.84
      },
      {
        "step": 4,
        "node_id": "station_davis",
        "node_name": "Davis Station Sustainability",
        "impact_type": "INVENTORY_STRESS",
        "severity": "MEDIUM",
        "time_horizon": "72 HOURS",
        "estimated_elapsed_minutes": 4320,
        "description": "Station food inventory margin drops below nominal contingency threshold.",
        "confidence": 0.81
      }
    ],
    "recommended_human_actions": [
      "Review Alternate Lead Sector 4 diversion route with Commander.",
      "Task high-resolution Cosmo-SkyMed SAR pass over Lead Sector 4.",
      "Alert Davis Logistics Officer to prepare for delayed discharge window."
    ]
  }
];

export const SEED_SATELLITE: SatelliteObservation[] = [
  {
    "observation_id": "OBS-S1A-20260927-0415",
    "satellite_name": "Sentinel-1A (ESA Copernicus)",
    "sensor_type": "C-Band Synthetic Aperture Radar (SAR)",
    "captured_timestamp": "2026-09-28T08:05:25.536218+00:00",
    "age_display": "2h 14m ago",
    "freshness": "RECENT",
    "area": "Weddell Sea / Filchner Shelf Margin",
    "resolution": "10m Ground Sampling Distance (GSD)",
    "type": "SAR Stripmap Polarimetric",
    "lead_features_detected": "Open navigable lead visible 18nm Northeast of Polar Star track.",
    "confidence": 0.89,
    "coverage_polygon": [
      [
        -72.0,
        -48.0
      ],
      [
        -72.0,
        -42.0
      ],
      [
        -74.5,
        -42.0
      ],
      [
        -74.5,
        -48.0
      ]
    ]
  },
  {
    "observation_id": "OBS-RCM-20260927-0630",
    "satellite_name": "Radarsat Constellation Mission (RCM-2)",
    "sensor_type": "High-Res SAR Stripmap",
    "captured_timestamp": "2026-09-28T06:34:25.536218+00:00",
    "age_display": "3h 45m ago",
    "freshness": "RECENT",
    "area": "Prydz Bay / Larsemann Hills Approach",
    "resolution": "5m High-Resolution SAR",
    "type": "SAR Backscatter Intensity",
    "lead_features_detected": "Fast ice fringe stable along approach to Davis and Bharati Station.",
    "confidence": 0.93,
    "coverage_polygon": [
      [
        -68.0,
        75.0
      ],
      [
        -68.0,
        79.5
      ],
      [
        -70.0,
        79.5
      ],
      [
        -70.0,
        75.0
      ]
    ]
  },
  {
    "observation_id": "OBS-L9-20260926-2245",
    "satellite_name": "Landsat-9 (USGS/NASA)",
    "sensor_type": "Operational Land Imager 2 (Optical Multispectral)",
    "captured_timestamp": "2026-09-28T01:04:25.536218+00:00",
    "age_display": "9h 15m ago",
    "freshness": "STALE",
    "area": "Ross Island & McMurdo Sound",
    "resolution": "15m Panchromatic / 30m Thermal",
    "type": "Optical Visual & Thermal Bands",
    "lead_features_detected": "Clear optical pass; fast-ice breakup along southern Ross Sound.",
    "confidence": 0.84,
    "coverage_polygon": [
      [
        -76.0,
        164.0
      ],
      [
        -76.0,
        172.0
      ],
      [
        -78.5,
        172.0
      ],
      [
        -78.5,
        164.0
      ]
    ]
  }
];

export const SEED_EVENTS: DigitalTwinEvent[] = [
  {
    "event_id": "DTE-201",
    "timestamp": "2026-09-28T10:14:25.536218+00:00",
    "time_display": "14:21 UTC",
    "node_id": "equipment_gen_2",
    "node_name": "Generator #2",
    "severity": "CRITICAL",
    "source": "Davis IoT SCADA Gateway",
    "title": "Abnormal Vibration Spike Detected (14.8 mm/s)",
    "description": "Harmonic sensor #3 on bearing block exceeded warning threshold by 108%. Autoencoder anomaly flagged.",
    "data_freshness": "FRESH"
  },
  {
    "event_id": "DTE-202",
    "timestamp": "2026-09-28T10:01:25.536218+00:00",
    "time_display": "14:08 UTC",
    "node_id": "env_weddell_ice",
    "node_name": "Weddell Sea Zone",
    "severity": "HIGH",
    "source": "Sentinel-1A SAR Processing",
    "title": "Sea-Ice Convergence Advisory Ingested",
    "description": "ESA Copernicus radar processing detected 18nm pack ice ridge compression directly on Route R-01.",
    "data_freshness": "RECENT"
  },
  {
    "event_id": "DTE-203",
    "timestamp": "2026-09-28T09:47:25.536218+00:00",
    "time_display": "13:54 UTC",
    "node_id": "ship_polar_star",
    "node_name": "Polar Star",
    "severity": "WARNING",
    "source": "AIS Direct Stream",
    "title": "Vessel Speed Reduced to 6.2 knots",
    "description": "AIS dead-reckoning reports transit speed slowed from 12.4 kt to 6.2 kt in heavy floes.",
    "data_freshness": "FRESH"
  },
  {
    "event_id": "DTE-204",
    "timestamp": "2026-09-28T09:09:25.536218+00:00",
    "time_display": "13:16 UTC",
    "node_id": "station_davis",
    "node_name": "Davis Station",
    "severity": "INFO",
    "source": "Optus C1 Telemetry",
    "title": "Station SCADA Synchronized",
    "description": "All 42 environmental, power, and life-support channels received and validated with 99.4% parity.",
    "data_freshness": "FRESH"
  },
  {
    "event_id": "DTE-205",
    "timestamp": "2026-09-28T08:14:25.536218+00:00",
    "time_display": "12:21 UTC",
    "node_id": "cargo_food",
    "node_name": "Food Provisions",
    "severity": "WARNING",
    "source": "XGBoost ETA Model v2.4",
    "title": "Predicted ETA Slippage (+26.5 Hours)",
    "description": "Machine learning regressor projected arrival slip, triggering station reserve buffer warning.",
    "data_freshness": "RECENT"
  }
];
