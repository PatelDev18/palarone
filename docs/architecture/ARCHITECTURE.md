# POLARONE Architecture

## Core System Architecture
POLARONE uses a layered event-driven architecture combining real-time maritime logistics with predictive AI and satellite intelligence.

### Data Flow
1. **Ingestion**: AIS, Weather, Satellite, IoT sensors
2. **Processing**: Normalization, Geospatial transformations (PostGIS)
3. **Storage**: Relational (PostgreSQL), Time-series (TimescaleDB)
4. **Feature Engineering**: Preparing features for ML
5. **AI/ML Engine**: XGBoost, LightGBM, Isolation Forest, Optimization
6. **Risk Engine**: Decision recommendation
7. **Frontend**: Next.js, MapLibre GL for Digital Twin

### Modules
- Command Center
- Digital Twin
- Expeditions & Missions
- Logistics (Ships, Cargo, Routes)
- Intelligence (Satellites, Weather, Sea Ice)
- Asset Maintenance & IoT Anomalies
- Analytics
