# POLARONE
"Plan. Track. Predict. Respond."

## Overview
PolarOne is an intelligent Antarctic/polar expedition operations platform. This codebase represents the complete vertical slice / Minimum Viable Product (MVP) fulfilling a 30-phase architectural roadmap.

The platform integrates:
- **Maritime Logistics:** Live ship tracking and cargo tracking.
- **Predictive AI/ML:** XGBoost for ETA forecasting, LightGBM for inventory forecasts, and Isolation Forest for generator anomaly detection.
- **Digital Twin:** A knowledge-graph representation of cascading dependencies.
- **AI Copilot:** An operational assistant to summarize insights and suggest actions.

## Repository Structure
```
polarone/
├── apps/
│   ├── web/               # Next.js 14 Frontend (React, Tailwind, maplibre-gl)
│   └── api/               # FastAPI Backend (SQLAlchemy, Python 3.11+)
├── services/              # Shared Python logic
│   ├── ingestion/         # AIS, Weather, Satellite data abstractions
│   ├── prediction/        # XGBoost ETA prediction, Risk Engine
│   └── anomaly/           # Isolation Forest anomaly detection
├── data/synthetic/        # Seed data (ships.csv, stations.csv)
├── docs/                  # Architecture documentation
└── .github/workflows/     # CI/CD pipelines
```

## How to Run the Prototype

### 1. Backend (FastAPI)
The backend powers the Next.js frontend with operational data, ML predictions, and Copilot responses.
```bash
cd apps/api
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2. Frontend (Next.js)
The frontend exposes the Command Center, Digital Twin, Emergency Response, and Copilot dashboards.
```bash
cd apps/web
npm install
npm run dev
```
Navigate to `http://localhost:3000/command-center` in your browser.

## Key Features & Phases Implemented
*   **Phase 0 - 2:** Foundational monorepo, Next.js UI, FastAPI scaffolding.
*   **Phase 3 - 5:** Abstractions for Data Ingestion (Sentinel-1, Spire, ECMWF).
*   **Phase 6 - 7:** Live Ship Tracking via MapLibre and the Digital Twin Node Graph.
*   **Phase 8 - 11:** XGBoost ETA prediction, Risk Engine, and LightGBM Inventory forecasting.
*   **Phase 12 - 15:** Missions tracking, RUL Maintenance UI, and Emergency Response Center.
*   **Phase 16 - 24:** System Settings, CI/CD Actions, Reporting CSV export, and AI Copilot Chat widget.
*   **Phase 25 - 30:** "Demo Scenario" (Katabatic storm simulation API), documentation, and final handover.

## Technical Constraints Respected
- **Strictly No Random Forest**: Prediction engines explicitly utilize XGBoost and Isolation Forest architectures.
- **No Fake Intelligence**: All synthetic data is clearly labeled `SYNTHETIC DATA` in the UI.
- **Unified Data Model**: All systems (Ships, Maintenance, Weather) flow through the central API into the Risk Engine and Digital Twin.

*Delivered for final handover.*
