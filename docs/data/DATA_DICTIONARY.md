# Data Dictionary

## Ships
- `id` (UUID): Unique identifier
- `name` (String): Ship name
- `imo` (String): IMO number
- `type` (String): Vessel type

## Ship Positions
- `ship_id` (UUID): Reference to ship
- `timestamp` (DateTime): Time of observation
- `location` (Point): PostGIS Point geometry (lon, lat)
- `speed` (Float): Speed over ground in knots
- `heading` (Float): Heading in degrees

## Stations
- `id` (UUID): Station identifier
- `name` (String): Station name
- `location` (Point): Geographic location
- `occupancy` (Integer): Current number of personnel

*(To be expanded during Phase 1 Database setup)*
