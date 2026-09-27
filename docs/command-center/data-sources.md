# PolarOne Command Center — Data Sources & Freshness Architecture

## 1. Multi-Source Fusion

Antarctic operations require fusing disparate data sources with fundamentally different latency characteristics:

| Feed Name | Primary Provider | Ingestion Frequency | Nominal Freshness Window | Failure / Degradation Handling |
|-----------|------------------|---------------------|--------------------------|--------------------------------|
| **Satellite AIS** | Spire Global / ExactEarth | Continuous stream / Batch | 0 – 5 minutes | Marks fix as `STALE`; preserves last-known coordinates without fabricating positions. |
| **Numerical Weather** | ECMWF 0.1° / NOAA GFS Polar | 6-hour synoptic cycles | 0 – 6 hours | Extrapolates using previous run; generates warning if cycle is missed. |
| **Sea Ice Concentration** | Copernicus Marine AMSR2 / CryoSat-2 | Daily orbital composite | 0 – 24 hours | Cloud-penetrating passive microwave; flags cloud gaps for optical feeds. |
| **SAR Satellite Swaths** | Sentinel-1 (ESA) / Radarsat RCM | Orbital passes (1-3 days) | 0 – 12 hours | Explicitly timestamped; UI indicates time since acquisition. |
| **Station SCADA Telemetry** | Iridium SBD / Starlink Polar | 5 – 15 minutes batch | 0 – 30 minutes | Flags as `DEGRADED` or `STALE` if geomagnetic aurora disturbance interrupts uplink. |
| **Cargo Manifests** | Polar Logistics Inventory DB | Real-time event log | 0 – 1 hour | Syncs cold-chain and dangerous cargo statuses. |
| **Emergency SAR Grid** | MRCC Ushuaia / COSPAS-SARSAT | Continuous beacon listen | 0 – 2 minutes | High-priority interrupt to command console. |

---

## 2. Handling Real-World Antarctic Data Limitations

1. **No Continuous Live Video**: Satellites in polar orbit pass periodically (typically every 12 to 72 hours). Swaths are displayed with explicit UTC timestamps. The system strictly forbids labeling historical satellite passes as "live video".
2. **Offline Vessels**: If AIS signal is lost in high latitudes, the vessel's last reported position is rendered in **GRAY (`STALE`)** with a clear data age counter (e.g. `2h 14m ago`).
3. **Station Connectivity Disturbance**: Solar flares, geomagnetic storms, and blizzard antenna accumulation frequently degrade satellite links. The system classifies connectivity as `ONLINE`, `DEGRADED`, `STALE`, or `OFFLINE` without falsely reporting equipment failure.
