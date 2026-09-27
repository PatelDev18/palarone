# Satellite Architecture

Satellite data is treated as an intelligence layer, not just a visual map overlay.

## Pipeline
`Satellite Provider -> Data Acquisition -> Raw Object Storage -> Processing -> Geospatial Products -> Feature Extraction -> ML Models -> Operational Dashboard`

## Providers (Abstraction)
- Sentinel-1 (SAR / Sea Ice)
- Sentinel-2 (Optical)
- Landsat 8/9
- NOAA / Modis
