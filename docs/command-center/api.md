# PolarOne Command Center — API Reference

Base Endpoint: `/api/v1/command-center`

## Endpoints

### 1. `GET /overview`
Returns the consolidated single-pane-of-glass payload: KPIs, fleet vessels, stations, weather, sea-ice, satellite observations, routes, missions, alerts, recommendations, events, predictions, and data health matrix.

### 2. `GET /kpis`
Returns the 6 actionable command KPI metrics:
- `active_ships`: total, in transit, at port, stale/offline, freshness.
- `cargo_in_transit`: total tonnage, TEU containers, percentage change, critical manifests.
- `active_delays`: count, highest delay (+26h), affected vessel.
- `critical_incidents`: active incidents count, life support status.
- `operational_risk`: overall rating, confidence %, high risk zone, trend.
- `data_health`: healthy, stale, and offline feeds breakdown.

### 3. `GET /vessels` & `GET /vessels/{id}`
Returns polar fleet AIS telemetry, design vs actual speed, heading, destination, original ETA, provider ETA, AI predicted ETA, expected delay, contributing factors, weather at position, and historical/planned/predicted coordinates trail.

### 4. `GET /stations` & `GET /stations/{id}`
Returns Antarctic research stations (Davis, Maitri, Bharati, McMurdo, South Pole, Halley VI, Rothera, Neumayer III) with connectivity status (`ONLINE`, `DEGRADED`, `STALE`, `OFFLINE`), comms methods, population, power generation, fuel reserves in days, and meteorological sensor readings.

### 5. `GET /weather`
Returns synoptic weather, active blizzard hazard polygons, wind vector points, wave height, and visibility across forecast horizons (`now`, `+6h`, `+12h`, `+24h`, `+48h`, `+7d`).

### 6. `GET /sea-ice`
Returns AMSR2 / CryoSat-2 microwave radiometer observations: ice concentration zones (0-100%), ice edge boundaries, compression hazard zones, and tracked giant tabular icebergs (A-23A, B-22A fragments).

### 7. `GET /satellites`
Returns periodic satellite SAR (Sentinel-1, Radarsat RCM) and optical (Landsat-9) observation swaths with explicit acquisition timestamps, coverage areas, and ground sampling distances.

### 8. `GET /alerts`
Returns prioritized alerts queue filtered by severity (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`, `INFORMATIONAL`).

### 9. `POST /alerts/{id}/acknowledge`
Acknowledge an operational alert.
```json
{
  "user_role": "Commander",
  "user_name": "Commander Hayes",
  "note": "Bridge watch alerted to pack ice entry."
}
```

### 10. `POST /recommendations/{id}/approve`
Authorized Human-in-the-Loop approval for advisory AI recommendations.
Enforces role permissions (`Commander`, `Operations Officer`, `Safety Officer`, `Administrator`).
Logs action to immutable audit trail.
```json
{
  "user_role": "Commander",
  "user_name": "Commander Hayes",
  "comments": "Approved diversion via Sector 4 open lead."
}
```

### 11. `POST /demo/scenario`
Switches simulation scenario (`SCENARIO_1_NORMAL` to `SCENARIO_8_MULTIPLE_SIMULTANEOUS_RISKS`).

### 12. `POST /copilot/query`
Grounded conversational Q&A over real-time operations telemetry.
```json
{
  "question": "Which ship is delayed?"
}
```
