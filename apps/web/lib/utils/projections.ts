import { Vessel, Station, WeatherIntelligence, SeaIceIntelligence, CommandKPIs, TimeHorizon, RegionFilter } from '@/types/command-center';

export interface SectorDefinition {
  id: RegionFilter;
  name: string;
  centerLat: number;
  centerLon: number;
  zoom: number;
  subtitle: string;
  vesselIds: string[];
  stationIds: string[];
  boundingCoords: [number, number][];
}

export const SECTOR_DEFINITIONS: Record<RegionFilter, SectorDefinition> = {
  'All Antarctica': {
    id: 'All Antarctica',
    name: 'All Antarctica Continental Basin',
    centerLat: -90.0,
    centerLon: 0.0,
    zoom: 1.0,
    subtitle: 'Entire Antarctic Operations Area (EPSG:3031)',
    vesselIds: [
      'VESSEL_POLAR_STAR',
      'VESSEL_AURORA_EXP',
      'VESSEL_XUE_LONG_2',
      'VESSEL_RRS_ATTENBOROUGH',
      'VESSEL_AGULHAS_II'
    ],
    stationIds: [
      'STATION_MCMURDO',
      'STATION_DAVIS',
      'STATION_HALLEY_VI',
      'STATION_ROTHERA',
      'STATION_MAITRI',
      'STATION_BHARATI',
      'STATION_CONCORDIA',
      'STATION_NEUMAYER_III'
    ],
    boundingCoords: [
      [-60.0, -180.0],
      [-60.0, -90.0],
      [-60.0, 0.0],
      [-60.0, 90.0],
      [-60.0, 180.0]
    ]
  },
  'Weddell Sea': {
    id: 'Weddell Sea',
    name: 'Weddell Sea & Filchner-Ronne Basin',
    centerLat: -73.0,
    centerLon: -45.0,
    zoom: 2.35,
    subtitle: 'Polar Star (Beset Hazard • Delayed) • Halley VI • Neumayer III',
    vesselIds: ['VESSEL_POLAR_STAR'],
    stationIds: ['STATION_HALLEY_VI', 'STATION_NEUMAYER_III'],
    boundingCoords: [
      [-63.0, -60.0],
      [-63.0, -25.0],
      [-78.0, -25.0],
      [-78.0, -60.0]
    ]
  },
  'Ross Sea': {
    id: 'Ross Sea',
    name: 'Ross Sea & McMurdo Sound Sector',
    centerLat: -76.5,
    centerLon: 175.0,
    zoom: 2.35,
    subtitle: 'Xue Long 2 (Ice Escort) • McMurdo Station • Concordia • Katabatic Gale',
    vesselIds: ['VESSEL_XUE_LONG_2'],
    stationIds: ['STATION_MCMURDO', 'STATION_CONCORDIA'],
    boundingCoords: [
      [-71.0, 160.0],
      [-71.0, -170.0],
      [-79.0, -170.0],
      [-79.0, 160.0]
    ]
  },
  'Antarctic Peninsula': {
    id: 'Antarctic Peninsula',
    name: 'Antarctic Peninsula & Drake Passage',
    centerLat: -65.0,
    centerLon: -64.0,
    zoom: 2.45,
    subtitle: 'RRS Sir David Attenborough • Rothera Research Station • Storm Corridor',
    vesselIds: ['VESSEL_RRS_ATTENBOROUGH'],
    stationIds: ['STATION_ROTHERA'],
    boundingCoords: [
      [-60.0, -75.0],
      [-60.0, -55.0],
      [-70.0, -55.0],
      [-70.0, -75.0]
    ]
  },
  'Indian Ocean Sector': {
    id: 'Indian Ocean Sector',
    name: 'Indian Ocean Sector & Prydz Bay',
    centerLat: -68.5,
    centerLon: 75.0,
    zoom: 2.2,
    subtitle: 'Aurora Explorer • S.A. Agulhas II • Davis Station • Bharati • Maitri',
    vesselIds: ['VESSEL_AURORA_EXP', 'VESSEL_AGULHAS_II'],
    stationIds: ['STATION_DAVIS', 'STATION_BHARATI', 'STATION_MAITRI'],
    boundingCoords: [
      [-64.0, 10.0],
      [-64.0, 95.0],
      [-73.0, 95.0],
      [-73.0, 10.0]
    ]
  },
  'Custom': {
    id: 'Custom',
    name: 'Custom Operator Sector',
    centerLat: -90.0,
    centerLon: 0.0,
    zoom: 1.2,
    subtitle: 'Customized Operations Area',
    vesselIds: [],
    stationIds: [],
    boundingCoords: []
  }
};

export function isEntityInRegion(
  lat: number,
  lon: number,
  region: RegionFilter,
  entityId?: string
): boolean {
  if (region === 'All Antarctica' || region === 'Custom') return true;

  const sector = SECTOR_DEFINITIONS[region];
  if (!sector) return true;

  if (entityId) {
    if (sector.vesselIds.includes(entityId) || sector.stationIds.includes(entityId)) {
      return true;
    }
  }

  if (region === 'Weddell Sea') {
    return lat <= -63 && lat >= -80 && lon >= -65 && lon <= -20;
  }
  if (region === 'Ross Sea') {
    return lat <= -70 && lat >= -85 && (lon >= 155 || lon <= -165);
  }
  if (region === 'Antarctic Peninsula') {
    return lat <= -61 && lat >= -72 && lon >= -78 && lon <= -54;
  }
  if (region === 'Indian Ocean Sector') {
    return lat <= -64 && lat >= -74 && lon >= 8 && lon <= 100;
  }

  return true;
}

export interface ProjectedVessel extends Vessel {
  live_lat: number;
  live_lon: number;
  forecast_speed_knots: number;
  forecast_heading_degrees: number;
  forecast_delay_hours: number;
  forecast_state: string;
  forecast_note: string;
}

export function computeVesselProjections(
  vessels: Vessel[],
  horizon: TimeHorizon
): ProjectedVessel[] {
  return vessels.map((v) => {
    const live_lat = v.current_lat;
    const live_lon = v.current_lon;

    if (horizon === 'Live') {
      return {
        ...v,
        live_lat,
        live_lon,
        forecast_speed_knots: v.speed_knots,
        forecast_heading_degrees: v.heading_degrees,
        forecast_delay_hours: v.expected_delay_hours,
        forecast_state: v.operational_state,
        forecast_note: 'Real-time AIS Telemetry (Live)',
      };
    }

    let projected_lat = live_lat;
    let projected_lon = live_lon;
    let projected_speed = v.speed_knots;
    let projected_heading = v.heading_degrees;
    let projected_delay = v.expected_delay_hours;
    let projected_state = v.operational_state;
    let forecast_note = '';

    if (v.id === 'VESSEL_POLAR_STAR') {
      if (horizon === '1 hour') {
        projected_lat = -73.24;
        projected_lon = -44.58;
        projected_speed = 3.0;
        projected_delay = 24.5;
        projected_state = 'Dead-Reckoning in Heavy Pack (Speed 3.0 kt)';
        forecast_note = '+1h Projection: Advective drift, pressure ridge impeding advance.';
      } else if (horizon === '6 hours') {
        projected_lat = -73.48;
        projected_lon = -44.92;
        projected_speed = 2.1;
        projected_delay = 28.0;
        projected_state = 'High Compression Hazard Encountered (Speed 2.1 kt)';
        forecast_note = '+6h Synoptic: Pack ice convergence increases delay to +28h. Alternate Route recommended.';
      } else if (horizon === '24 hours') {
        projected_lat = -73.92;
        projected_lon = -45.50;
        projected_speed = 1.2;
        projected_delay = 38.0;
        projected_state = 'Critical Beset Risk without Route Diversion';
        forecast_note = '+24h Advisory: Default route blocked by 88% ridge. Diversion to Lead Sector 4 saves 14.5h.';
      } else if (horizon === '7 days') {
        projected_lat = -69.50;
        projected_lon = -38.00;
        projected_speed = 10.5;
        projected_delay = 6.0;
        projected_state = 'Open Water Transit after Alternate Lead Breakout';
        forecast_note = '+7d Strategic: Cleared Weddell pack ice edge; progressing on Southern Ocean supply run.';
      }
    } else if (v.id === 'VESSEL_AURORA_EXP') {
      if (horizon === '1 hour') {
        projected_lat = -67.38;
        projected_lon = 78.38;
        projected_speed = 11.0;
        projected_delay = 0.0;
        projected_state = 'Prydz Bay Approach Transit';
        forecast_note = '+1h Projection: Speed 11.0 kt on planned shipping corridor.';
      } else if (horizon === '6 hours') {
        projected_lat = -68.08;
        projected_lon = 78.10;
        projected_speed = 6.5;
        projected_delay = 0.0;
        projected_state = 'Entering Davis Fast Ice Lead';
        forecast_note = '+6h Synoptic: Reduced speed to 6.5 kt for coastal ice pilotage.';
      } else if (horizon === '24 hours') {
        projected_lat = -68.58;
        projected_lon = 77.97;
        projected_speed = 0.0;
        projected_delay = 0.0;
        projected_state = 'Moored at Davis Fast Ice Anchorage • Offloading Cargo';
        forecast_note = '+24h Advisory: Cargo crane operations active at Davis Station ice edge.';
      } else if (horizon === '7 days') {
        projected_lat = -69.40;
        projected_lon = 76.19;
        projected_speed = 8.5;
        projected_delay = 0.0;
        projected_state = 'Arrived at Bharati Station, Larsemann Hills';
        forecast_note = '+7d Strategic: Commencing second supply transfer at Indian Station Bharati.';
      }
    } else if (v.id === 'VESSEL_XUE_LONG_2') {
      if (horizon === '1 hour') {
        projected_lat = -76.95;
        projected_lon = 167.92;
        projected_speed = 9.5;
        projected_delay = 4.2;
        projected_state = 'Ross Sea Convoy Escort';
        forecast_note = '+1h Projection: Escorting supply barge through broken fast ice.';
      } else if (horizon === '6 hours') {
        projected_lat = -77.52;
        projected_lon = 167.15;
        projected_speed = 8.0;
        projected_delay = 5.5;
        projected_state = 'Approaching McMurdo Sound Channel';
        forecast_note = '+6h Synoptic: Katabatic swell increases delay slightly to +5.5h.';
      } else if (horizon === '24 hours') {
        projected_lat = -77.85;
        projected_lon = 166.67;
        projected_speed = 0.0;
        projected_delay = 4.0;
        projected_state = 'Berthed at McMurdo Ice Pier';
        forecast_note = '+24h Advisory: Ice pier securing complete; refueling heavy equipment.';
      } else if (horizon === '7 days') {
        projected_lat = -75.20;
        projected_lon = 172.00;
        projected_speed = 10.2;
        projected_delay = 0.0;
        projected_state = 'Northbound Channel Maintenance Transit';
        forecast_note = '+7d Strategic: McMurdo shipping corridor carved and maintained open.';
      }
    } else if (v.id === 'VESSEL_RRS_ATTENBOROUGH') {
      if (horizon === '1 hour') {
        projected_lat = -65.08;
        projected_lon = -64.08;
        projected_speed = 12.2;
        projected_delay = 0.0;
        projected_state = 'Drake / Bransfield Southbound Transit';
        forecast_note = '+1h Projection: Nominal transit speed 12.2 kt.';
      } else if (horizon === '6 hours') {
        projected_lat = -66.30;
        projected_lon = -66.10;
        projected_speed = 11.8;
        projected_delay = 0.0;
        projected_state = 'Rounding Marguerite Bay Approach';
        forecast_note = '+6h Synoptic: Clear conditions along western Antarctic Peninsula.';
      } else if (horizon === '24 hours') {
        projected_lat = -67.57;
        projected_lon = -68.13;
        projected_speed = 0.0;
        projected_delay = 0.0;
        projected_state = 'Anchored at Rothera Station Wharf';
        forecast_note = '+24h Advisory: Rothera science party personnel rotation underway.';
      } else if (horizon === '7 days') {
        projected_lat = -70.10;
        projected_lon = -75.00;
        projected_speed = 11.0;
        projected_delay = 0.0;
        projected_state = 'Bellingshausen Sea Oceanographic Survey';
        forecast_note = '+7d Strategic: Deep CTD rosette stations and krill acoustic sampling.';
      }
    } else if (v.id === 'VESSEL_AGULHAS_II') {
      if (horizon === '1 hour') {
        projected_lat = -70.02;
        projected_lon = 12.18;
        projected_speed = 9.8;
        projected_delay = 0.0;
        projected_state = 'Queen Maud Land Margin Transit';
        forecast_note = '+1h Projection: Transit along Fimbul ice shelf margin.';
      } else if (horizon === '6 hours') {
        projected_lat = -70.52;
        projected_lon = 11.65;
        projected_speed = 5.0;
        projected_delay = 0.0;
        projected_state = 'Holding at Penguin Bay Fast Ice Margin';
        forecast_note = '+6h Synoptic: Positioning fuel bladders for snowcat traverse.';
      } else if (horizon === '24 hours') {
        projected_lat = -70.70;
        projected_lon = 11.70;
        projected_speed = 0.0;
        projected_delay = 0.0;
        projected_state = 'Fuel Pumping Delivery to Maitri Station Traverse';
        forecast_note = '+24h Advisory: Winter diesel fuel transfer in progress.';
      } else if (horizon === '7 days') {
        projected_lat = -62.50;
        projected_lon = 18.20;
        projected_speed = 12.0;
        projected_delay = 0.0;
        projected_state = 'Northbound Ocean Transit toward Cape Town';
        forecast_note = '+7d Strategic: Mission successful; returning to Cape Town base.';
      }
    }

    return {
      ...v,
      current_lat: projected_lat,
      current_lon: projected_lon,
      speed_knots: projected_speed,
      heading_degrees: projected_heading,
      expected_delay_hours: projected_delay,
      operational_state: projected_state,
      live_lat,
      live_lon,
      forecast_speed_knots: projected_speed,
      forecast_heading_degrees: projected_heading,
      forecast_delay_hours: projected_delay,
      forecast_state: projected_state,
      forecast_note,
    };
  });
}

export function computeHorizonKpis(
  baseKpis: CommandKPIs,
  horizon: TimeHorizon
): CommandKPIs {
  if (horizon === 'Live') return baseKpis;

  const clone: CommandKPIs = JSON.parse(JSON.stringify(baseKpis));

  if (horizon === '1 hour') {
    clone.active_delays.highest_delay = '+24.5h';
    clone.operational_risk.overall_risk = 'MEDIUM';
  } else if (horizon === '6 hours') {
    clone.active_delays.delayed_count = 2;
    clone.active_delays.highest_delay = '+28.0h';
    clone.active_delays.affected_vessel = 'Polar Star & Xue Long 2';
    clone.critical_incidents.count = 2;
    clone.critical_incidents.label = 'Weddell Pack Compression & Ross Katabatic Surge';
    clone.operational_risk.overall_risk = 'HIGH';
    clone.operational_risk.risk_trend = 'Worsening';
  } else if (horizon === '24 hours') {
    clone.active_delays.delayed_count = 1;
    clone.active_delays.highest_delay = '+38.0h (Alt: +8h)';
    clone.active_ships.at_port = 3;
    clone.active_ships.in_transit = 2;
    clone.cargo_in_transit.tonnage = '1,850 T';
    clone.cargo_in_transit.containers_teu = 128;
    clone.operational_risk.overall_risk = 'CRITICAL';
    clone.critical_incidents.count = 1;
  } else if (horizon === '7 days') {
    clone.active_delays.delayed_count = 0;
    clone.active_delays.highest_delay = '0.0h';
    clone.active_delays.affected_vessel = 'All Routes On Schedule';
    clone.critical_incidents.count = 0;
    clone.critical_incidents.label = 'All Expeditions Stabilized';
    clone.operational_risk.overall_risk = 'LOW';
    clone.cargo_in_transit.tonnage = '420 T';
    clone.cargo_in_transit.containers_teu = 32;
  }

  return clone;
}

export function getSimulatedUtcTime(baseDate: Date, horizon: TimeHorizon): string {
  const d = new Date(baseDate.getTime());
  if (horizon === '1 hour') {
    d.setHours(d.getHours() + 1);
  } else if (horizon === '6 hours') {
    d.setHours(d.getHours() + 6);
  } else if (horizon === '24 hours') {
    d.setHours(d.getHours() + 24);
  } else if (horizon === '7 days') {
    d.setDate(d.getDate() + 7);
  }
  return d.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
}
