# PolarOne Command Center — Operational Procedures & Human-in-the-Loop Guide

## 1. Core Operating Philosophy

The PolarOne Command Center is an **operational monitoring and decision-support tool**.
- **No Autonomous Control**: The system cannot steer vessels, modify autopilots, discharge ballast, launch search & rescue helicopters, or shut down station life-support systems.
- **Advisory Recommendations**: AI provides alerts and drafts suggested actions.
- **Human Approval**: Only designated personnel (`Commander`, `Operations Officer`, `Safety Officer`) can sign off on safety-critical directives.

---

## 2. Five-Second Operator Assessment Flow

Upon glancing at the Command Center, an operator can immediately determine:
1. **WHAT is happening?**
   - Read the Top KPI Strip: Active ships count, cargo status, number of active delays, critical incidents, overall operational risk rating.
2. **WHERE is it happening?**
   - The Antarctic GIS Map immediately highlights anomalous vessels (orange/red markers), severe ice compression zones (sky blue dashed polygons), and active blizzards (amber dashed polygons).
3. **WHY is it happening?**
   - Clicking any entity opens the right-side detail drawer with multi-source diagnostic breakdowns (e.g., Polar Star delay caused by 42% sea ice and 45kt headwinds).
4. **RISK & SEVERITY:**
   - Evaluated by XGBoost and LightGBM with explicit confidence percentages (e.g., High Risk, 76% confidence).
5. **ACTION REQUIRED:**
   - Advisory action cards prompt the commander to review and execute Human-in-the-Loop approval for route diversions or logistics prioritizations.

---

## 3. Demo Engine Scenarios

The Command Center provides 8 built-in simulation scenarios:
1. `Normal Operations`: All fleet vessels on schedule, nominal telemetry, benign ice.
2. `Vessel Delay`: Polar Star delayed +26h in Weddell pack ice; alternate lead recommended.
3. `Sea Ice Threat`: Rapid pack ice advance towards Maitri corridor.
4. `Weather Escalation`: 56-knot blizzard in Ross Sea sector.
5. `Station Connectivity Loss`: Halley VI comms drop due to aurora storm.
6. `Critical Incident`: Generator anomaly flagged by Isolation Forest at South Pole Station.
7. `Satellite Observation Update`: Sentinel-1 SAR swath ingests new navigable lead.
8. `Multiple Simultaneous Risks`: Compound threat scenario testing operator decision-making.
