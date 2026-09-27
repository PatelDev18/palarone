# PolarOne Command Center — Operational Architecture

## 1. Executive Overview

The **PolarOne Command Center** serves as the primary "single pane of glass" operational monitoring and decision-support interface for Antarctic maritime, station, scientific, and logistics operations.

Designed specifically for the physical and operational realities of Antarctica:
- **Decision-Support Only**: The system does **not** autonomously control vessels, aircraft, stations, or emergency response systems.
- **Human-in-the-Loop (HITL)**: All safety-critical recommendations (route diversions, emergency expedites, resource reallocation) require explicit, authorized human approval with an immutable audit log.
- **Advisory AI**: AI predictions (XGBoost, LightGBM, Isolation Forest, Autoencoder, OR-Tools) provide explanations (SHAP feature attributions) and confidence intervals rather than presenting estimates as guaranteed truth. Random Forest is strictly excluded from the predictive ML stack.
- **Physical Data Realities**: Explicitly models intermittent AIS updates, periodic satellite passes (SAR/Optical with acquisition timestamps; never false "live continuous video"), batch telemetry, and degraded connectivity.

---

## 2. Global Layout Hierarchy

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ TOP GLOBAL NAVIGATION: PolarOne Logo | CC (Active) | Digital Twin | Logistics | ...   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ SECONDARY TOOLBAR: Operational Status | Time Horizon | Region Filter | GIS Layer Toggles│
├────────────────────────────────────────────────────────────────────────────────────────┤
│ TOP KPI STRIP: Active Ships | Cargo in Transit | Active Delays | Incidents | Risk | ... │
├──────────────────────────────────────────────────────────┬─────────────────────────────┤
│                                                          │                             │
│                                                          │  SELECTED ENTITY DRAWER:    │
│           ANTARCTIC OPERATIONS GIS MAP                   │                             │
│            (WGS84 Polar Stereographic)                   │  - Vessel Telemetry / ETA   │
│                 [60% - 70% Width]                        │  - AI SHAP Explanation     │
│                                                          │  - Risk Evolution Timeline  │
│  - Vessels with AIS heading vectors & trails             │  - Local Weather & Ice Pack │
│  - Stations with connectivity status rings               │  - Alternate Route Compare  │
│  - Weather gale & blizzard polygons                      │  - Human-in-the-Loop        │
│  - AMSR2 / CryoSat-2 Sea Ice concentration & hazards     │    Approval Card            │
│  - Sentinel-1 SAR swaths & capture timestamps            │                             │
│                                                          │                             │
├──────────────────────────────────────────────────────────┴─────────────────────────────┤
│ BOTTOM OPERATIONAL DOCK: [Events Timeline | Predictions | Alerts | Data Health | Copilot]│
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons, SVG Polar Stereographic Vector Projection Engine (EPSG:3031).
- **Backend API**: FastAPI (Python 3.14 / 3.13), Pydantic v2 validation, Loguru structured logging, Prometheus instrumentation.
- **Database Layer**: PostgreSQL + PostGIS (GeoAlchemy2) with SQLAlchemy ORM models.
- **ML & Analytics**:
  - **XGBoost**: Voyage ETA and operational delay regression (`XGB_POLAR_ETA_v2.4`).
  - **LightGBM**: High-resolution operational condition and station demand forecasting.
  - **Isolation Forest & Autoencoder**: Unsupervised multivariate sensor telemetry anomaly detection.
  - **Google OR-Tools**: Constrained maritime route optimization and open-lead waypoints.
  - *Random Forest is strictly prohibited.*
- **Data Freshness Engine**: Real-time evaluation of data staleness (`FRESH`, `STALE`, `OFFLINE`, `UNKNOWN`) across 7 distinct Antarctic data feeds.
