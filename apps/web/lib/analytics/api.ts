import {
  AnalyticsBundle,
  ExecutiveKpi,
  VesselPerformanceRecord,
  FuelAnalyticsPoint,
  ETAPredictionRecord,
  EnvironmentalPoint,
  StationMetricRecord,
  InventoryForecastItem,
  AssetHealthRecord,
  SensorAnomalyRecord,
  MLModelPerformanceRecord,
  OperationalRiskCategory,
  CorrelationPair,
  ForecastPoint,
  ScenarioSimulationRequest,
  ScenarioSimulationResult,
  DataQualityRecord,
  NetworkResilienceMetric,
  AIInsight,
  Timeframe,
} from '@/types/analytics'
import { getApiBase } from '@/lib/utils/apiBase'

const API_BASE = getApiBase()

export async function fetchAnalyticsBundle(timeframe: Timeframe = '7D'): Promise<AnalyticsBundle> {
  try {
    const res = await fetch(`${API_BASE}/analytics/all?timeframe=${timeframe}`, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) {
      throw new Error(`API returned HTTP ${res.status}`)
    }
    const data: AnalyticsBundle = await res.json()
    return data
  } catch (err) {
    console.warn('Falling back to local high-fidelity telemetry dataset:', err)
    return getFallbackAnalyticsBundle(timeframe)
  }
}

export async function simulateWhatIfScenario(
  payload: ScenarioSimulationRequest
): Promise<ScenarioSimulationResult> {
  try {
    const res = await fetch(`${API_BASE}/analytics/scenarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      throw new Error(`Simulation API error HTTP ${res.status}`)
    }
    return await res.json()
  } catch (err) {
    console.warn('Simulating locally:', err)
    // Fallback client-side calculation
    let fuelDelta = 0
    let delayHours = 0
    let riskScore = 28.4
    let highRiskStations = 1

    if (payload.speed_delta_pct < 0) {
      const ratio = (100 + payload.speed_delta_pct) / 100
      fuelDelta -= (1 - Math.pow(ratio, 2.2)) * 100
      delayHours += Math.abs(payload.speed_delta_pct) * 0.85
    } else if (payload.speed_delta_pct > 0) {
      const ratio = (100 + payload.speed_delta_pct) / 100
      fuelDelta += (Math.pow(ratio, 2.5) - 1) * 100
      delayHours -= payload.speed_delta_pct * 0.4
    }

    if (payload.severe_weather_event) {
      fuelDelta += 14.2
      delayHours += 28
      riskScore += 22
    }

    if (payload.supply_delay_days > 0) {
      delayHours += payload.supply_delay_days * 24
      riskScore += Math.min(35, payload.supply_delay_days * 3.5)
      if (payload.supply_delay_days >= 3) highRiskStations += 1
    }

    if (payload.generator_derate) {
      fuelDelta += 8.5
      riskScore += 15
    }

    const projectedLitres = (fuelDelta / 100) * 45000

    const recs: string[] = []
    if (payload.supply_delay_days > 0) {
      recs.push('Implement Stage-2 Conservation Protocol at Maitri Station immediately (shed non-essential scientific freezers).')
    }
    if (payload.severe_weather_event) {
      recs.push('Reroute Southern Cross along Cape Darnley polynya to bypass 9/10ths pack ice.')
    }
    if (payload.speed_delta_pct < -10) {
      recs.push('Eco-speed confirmed viable; adjust crew rotation schedules for extended transit.')
    }
    if (recs.length === 0) {
      recs.push('Nominal operational envelope maintained. No corrective intervention required.')
    }

    return {
      scenario_name: `What-If Simulation (Speed ${payload.speed_delta_pct > 0 ? '+' : ''}${payload.speed_delta_pct.toFixed(1)}%, Storm=${payload.severe_weather_event}, Delay=${payload.supply_delay_days}d)`,
      simulated_at: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      fuel_burn_delta_pct: parseFloat(fuelDelta.toFixed(1)),
      projected_additional_fuel_litres: Math.round(projectedLitres),
      eta_delay_average_hours: parseFloat(delayHours.toFixed(1)),
      high_risk_stations_count: highRiskStations,
      overall_operational_risk_score: Math.min(100, parseFloat(riskScore.toFixed(1))),
      impact_summary: `Simulation projects ${fuelDelta > 0 ? '+' : ''}${fuelDelta.toFixed(1)}% fuel variance with ${delayHours.toFixed(1)} hours aggregated transit delay across fleet.`,
      recommendations: recs,
    }
  }
}

export function exportToCSV(data: any[], filename: string) {
  if (!data || !data.length) return
  const headers = Object.keys(data[0])
  const rows = data.map((item) =>
    headers
      .map((header) => {
        const val = item[header]
        if (typeof val === 'object') {
          return `"${JSON.stringify(val).replace(/"/g, '""')}"`
        }
        return `"${String(val).replace(/"/g, '""')}"`
      })
      .join(',')
  )
  const csvContent = [headers.join(','), ...rows].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportToJSON(data: any, filename: string) {
  const jsonContent = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonContent], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.json`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function getFallbackAnalyticsBundle(timeframe: Timeframe = '7D'): AnalyticsBundle {
  return {
    kpis: [
      {
        id: 'kpi-fuel-efficiency',
        title: 'Fleet Fuel Efficiency',
        value: '24.8',
        numeric_value: 24.8,
        unit: 'L/nm',
        delta_percent: -4.2,
        trend: 'down',
        status: 'optimal',
        sparkline: [27.1, 26.8, 26.2, 25.9, 25.4, 25.1, 24.8],
        description: 'Fleet-wide fuel consumption normalized by nautical miles navigated across ice and open water.',
      },
      {
        id: 'kpi-route-variance',
        title: 'Route Execution Fidelity',
        value: '96.4',
        numeric_value: 96.4,
        unit: '%',
        delta_percent: 1.8,
        trend: 'up',
        status: 'optimal',
        sparkline: [92.0, 93.4, 94.1, 94.8, 95.5, 96.0, 96.4],
        description: 'Adherence to ice-optimized waypoints versus planned expedition transit lines.',
      },
      {
        id: 'kpi-station-energy',
        title: 'Station Thermal Demand',
        value: '342.5',
        numeric_value: 342.5,
        unit: 'L/day',
        delta_percent: 6.5,
        trend: 'up',
        status: 'warning',
        sparkline: [310.0, 318.5, 325.0, 331.0, 335.5, 340.0, 342.5],
        description: 'Aggregated heating and power fuel burn rate across Bharati, Maitri, Himadri, and Davis.',
      },
      {
        id: 'kpi-delay-index',
        title: 'ETA Confidence Score',
        value: '91.2',
        numeric_value: 91.2,
        unit: '%',
        delta_percent: 3.1,
        trend: 'up',
        status: 'optimal',
        sparkline: [84.0, 86.2, 88.0, 89.5, 90.1, 90.8, 91.2],
        description: 'Ensemble XGBoost confidence index reflecting sea ice drift and polar weather predictability.',
      },
      {
        id: 'kpi-active-anomalies',
        title: 'Critical Sensor Anomalies',
        value: '3',
        numeric_value: 3.0,
        unit: 'active',
        delta_percent: -25.0,
        trend: 'down',
        status: 'warning',
        sparkline: [6.0, 5.0, 5.0, 4.0, 4.0, 3.0, 3.0],
        description: 'Unresolved multivariate anomalies detected by Isolation Forest & Autoencoder engines.',
      },
      {
        id: 'kpi-supply-shortage',
        title: 'Resupply Margin At-Risk',
        value: '1',
        numeric_value: 1.0,
        unit: 'stations',
        delta_percent: 0.0,
        trend: 'stable',
        status: 'critical',
        sparkline: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
        description: 'Stations where predicted supply depletion date precedes scheduled resupply arrival.',
      },
      {
        id: 'kpi-model-health',
        title: 'ML Model Drift Index (PSI)',
        value: '0.042',
        numeric_value: 0.042,
        unit: 'PSI',
        delta_percent: -12.5,
        trend: 'down',
        status: 'optimal',
        sparkline: [0.065, 0.059, 0.054, 0.049, 0.046, 0.044, 0.042],
        description: 'Population Stability Index across operational feature distributions (< 0.10 is stable).',
      },
      {
        id: 'kpi-operational-risk',
        title: 'Aggregated Mission Risk',
        value: '28.4',
        numeric_value: 28.4,
        unit: '/100',
        delta_percent: -5.2,
        trend: 'down',
        status: 'optimal',
        sparkline: [34.0, 32.5, 31.0, 30.2, 29.5, 29.0, 28.4],
        description: 'Composite operational risk score evaluating machinery, ice entrapment, weather, and logistics.',
      },
    ],
    fleet: [
      {
        vessel_id: 'VES-001',
        vessel_name: 'Polar Star',
        ice_class: 'PC1 Heavy Icebreaker',
        current_speed_knots: 12.4,
        optimal_speed_knots: 13.0,
        fuel_burn_rate_l_per_nm: 32.4,
        voyage_progress_pct: 68.5,
        route_efficiency_pct: 95.8,
        ice_resistance_factor: 1.42,
        active_mission: 'Operation Deep Freeze Resupply',
        eta_variance_hours: 4.5,
        maintenance_risk: 'LOW',
        anomaly_count: 1,
        health_score: 94.2,
      },
      {
        vessel_id: 'VES-002',
        vessel_name: 'Aurora Explorer',
        ice_class: 'PC3 Polar Research Vessel',
        current_speed_knots: 10.2,
        optimal_speed_knots: 11.5,
        fuel_burn_rate_l_per_nm: 24.1,
        voyage_progress_pct: 82.0,
        route_efficiency_pct: 97.1,
        ice_resistance_factor: 1.18,
        active_mission: 'Weddell Sea Oceanographic Survey',
        eta_variance_hours: -1.2,
        maintenance_risk: 'LOW',
        anomaly_count: 0,
        health_score: 98.0,
      },
      {
        vessel_id: 'VES-003',
        vessel_name: 'Southern Cross',
        ice_class: 'PC4 Logistics & Cargo Carrier',
        current_speed_knots: 8.8,
        optimal_speed_knots: 10.0,
        fuel_burn_rate_l_per_nm: 28.6,
        voyage_progress_pct: 45.0,
        route_efficiency_pct: 91.4,
        ice_resistance_factor: 1.85,
        active_mission: 'Bharati & Maitri Annual Resupply',
        eta_variance_hours: 14.8,
        maintenance_risk: 'MEDIUM',
        anomaly_count: 2,
        health_score: 83.5,
      },
      {
        vessel_id: 'VES-004',
        vessel_name: 'Arctic Voyager',
        ice_class: 'PC5 Sub-polar Scientific Surveyor',
        current_speed_knots: 11.8,
        optimal_speed_knots: 12.0,
        fuel_burn_rate_l_per_nm: 19.5,
        voyage_progress_pct: 91.2,
        route_efficiency_pct: 98.4,
        ice_resistance_factor: 1.05,
        active_mission: 'Svalbard Glacial Core Sampling',
        eta_variance_hours: 0.5,
        maintenance_risk: 'LOW',
        anomaly_count: 0,
        health_score: 96.7,
      },
      {
        vessel_id: 'VES-005',
        vessel_name: 'Ocean Guardian',
        ice_class: 'PC2 Multi-purpose Patrol / SAR',
        current_speed_knots: 14.0,
        optimal_speed_knots: 14.5,
        fuel_burn_rate_l_per_nm: 36.0,
        voyage_progress_pct: 34.0,
        route_efficiency_pct: 94.2,
        ice_resistance_factor: 1.30,
        active_mission: 'Ross Ice Shelf Standby & SAR',
        eta_variance_hours: 2.0,
        maintenance_risk: 'LOW',
        anomaly_count: 0,
        health_score: 95.1,
      },
    ],
    fuel: [
      { timestamp: 'Sep 14', actual_burn_litres: 3120, predicted_burn_litres: 3140, upper_bound: 3260, lower_bound: 3020, ambient_temp_c: -18.2, generator_load_pct: 71.5 },
      { timestamp: 'Sep 15', actual_burn_litres: 3280, predicted_burn_litres: 3250, upper_bound: 3380, lower_bound: 3120, ambient_temp_c: -19.5, generator_load_pct: 74.0 },
      { timestamp: 'Sep 16', actual_burn_litres: 3420, predicted_burn_litres: 3400, upper_bound: 3540, lower_bound: 3260, ambient_temp_c: -22.1, generator_load_pct: 78.2 },
      { timestamp: 'Sep 17', actual_burn_litres: 3310, predicted_burn_litres: 3340, upper_bound: 3470, lower_bound: 3210, ambient_temp_c: -20.4, generator_load_pct: 75.0 },
      { timestamp: 'Sep 18', actual_burn_litres: 3250, predicted_burn_litres: 3220, upper_bound: 3350, lower_bound: 3090, ambient_temp_c: -17.8, generator_load_pct: 73.1 },
      { timestamp: 'Sep 19', actual_burn_litres: 3490, predicted_burn_litres: 3460, upper_bound: 3600, lower_bound: 3320, ambient_temp_c: -23.5, generator_load_pct: 80.4 },
      { timestamp: 'Sep 20', actual_burn_litres: 3560, predicted_burn_litres: 3520, upper_bound: 3670, lower_bound: 3370, ambient_temp_c: -25.2, generator_load_pct: 82.5 },
      { timestamp: 'Sep 21', actual_burn_litres: 3410, predicted_burn_litres: 3430, upper_bound: 3580, lower_bound: 3280, ambient_temp_c: -21.8, generator_load_pct: 76.9 },
      { timestamp: 'Sep 22', actual_burn_litres: 3350, predicted_burn_litres: 3380, upper_bound: 3530, lower_bound: 3230, ambient_temp_c: -20.1, generator_load_pct: 74.5 },
      { timestamp: 'Sep 23', actual_burn_litres: 3480, predicted_burn_litres: 3450, upper_bound: 3610, lower_bound: 3290, ambient_temp_c: -24.0, generator_load_pct: 79.2 },
      { timestamp: 'Sep 24', actual_burn_litres: 3520, predicted_burn_litres: 3510, upper_bound: 3680, lower_bound: 3340, ambient_temp_c: -25.8, generator_load_pct: 81.0 },
      { timestamp: 'Sep 25', actual_burn_litres: 3600, predicted_burn_litres: 3580, upper_bound: 3760, lower_bound: 3400, ambient_temp_c: -27.2, generator_load_pct: 83.5 },
      { timestamp: 'Sep 26', actual_burn_litres: 3580, predicted_burn_litres: 3610, upper_bound: 3800, lower_bound: 3420, ambient_temp_c: -26.5, generator_load_pct: 82.1 },
      { timestamp: 'Sep 27', actual_burn_litres: 3640, predicted_burn_litres: 3650, upper_bound: 3850, lower_bound: 3450, ambient_temp_c: -28.0, generator_load_pct: 84.8 },
    ],
    eta: [
      {
        voyage_id: 'VOY-2026-088',
        vessel_name: 'Southern Cross',
        destination: 'Bharati Station, Larsemann Hills',
        departure_date: '2026-09-21',
        original_planned_eta: '2026-09-30 04:00 UTC',
        provider_eta: '2026-09-30 18:00 UTC',
        ai_predicted_eta: '2026-10-01 02:00 UTC',
        p10_eta: '2026-09-30 20:00 UTC',
        p50_eta: '2026-10-01 02:00 UTC',
        p90_eta: '2026-10-01 16:00 UTC',
        confidence_score: 0.91,
        delay_hours: 22.0,
        primary_delay_cause: 'Heavy Pack Ice (1.8m multi-year ice ridges)',
        delay_breakdown: { ice_pack: 14.5, katabatic_winds: 5.0, machinery_derate: 2.5 },
      },
      {
        voyage_id: 'VOY-2026-092',
        vessel_name: 'Polar Star',
        destination: 'McMurdo Sound / Ross Sea',
        departure_date: '2026-09-18',
        original_planned_eta: '2026-09-29 12:00 UTC',
        provider_eta: '2026-09-29 14:00 UTC',
        ai_predicted_eta: '2026-09-29 16:00 UTC',
        p10_eta: '2026-09-29 13:00 UTC',
        p50_eta: '2026-09-29 16:00 UTC',
        p90_eta: '2026-09-29 22:00 UTC',
        confidence_score: 0.96,
        delay_hours: 4.0,
        primary_delay_cause: 'Channel clearing ice operations',
        delay_breakdown: { ice_pack: 3.2, katabatic_winds: 0.8, machinery_derate: 0.0 },
      },
      {
        voyage_id: 'VOY-2026-095',
        vessel_name: 'Aurora Explorer',
        destination: 'Rothera Research Station',
        departure_date: '2026-09-23',
        original_planned_eta: '2026-09-28 08:00 UTC',
        provider_eta: '2026-09-28 06:00 UTC',
        ai_predicted_eta: '2026-09-28 07:00 UTC',
        p10_eta: '2026-09-28 05:00 UTC',
        p50_eta: '2026-09-28 07:00 UTC',
        p90_eta: '2026-09-28 10:00 UTC',
        confidence_score: 0.98,
        delay_hours: -1.0,
        primary_delay_cause: 'Favorable polynya corridor opening',
        delay_breakdown: { ice_pack: -1.5, katabatic_winds: 0.5, machinery_derate: 0.0 },
      },
    ],
    environmental: [
      { timestamp: '09/25 00:00', location: 'Larsemann Hills', temperature_c: -22.5, wind_speed_knots: 24.2, ice_thickness_m: 1.62, sea_ice_concentration_pct: 75.0, visibility_km: 16.0, barometric_hpa: 994.2 },
      { timestamp: '09/25 12:00', location: 'Larsemann Hills', temperature_c: -23.1, wind_speed_knots: 28.5, ice_thickness_m: 1.64, sea_ice_concentration_pct: 77.2, visibility_km: 14.5, barometric_hpa: 991.0 },
      { timestamp: '09/26 00:00', location: 'Larsemann Hills', temperature_c: -24.8, wind_speed_knots: 34.0, ice_thickness_m: 1.66, sea_ice_concentration_pct: 81.0, visibility_km: 9.2, barometric_hpa: 987.5 },
      { timestamp: '09/26 12:00', location: 'Larsemann Hills', temperature_c: -26.2, wind_speed_knots: 41.5, ice_thickness_m: 1.68, sea_ice_concentration_pct: 84.5, visibility_km: 4.8, barometric_hpa: 983.0 },
      { timestamp: '09/27 00:00', location: 'Larsemann Hills', temperature_c: -27.5, wind_speed_knots: 48.0, ice_thickness_m: 1.70, sea_ice_concentration_pct: 88.0, visibility_km: 2.1, barometric_hpa: 978.4 },
      { timestamp: '09/27 12:00', location: 'Larsemann Hills', temperature_c: -28.4, wind_speed_knots: 52.5, ice_thickness_m: 1.72, sea_ice_concentration_pct: 90.2, visibility_km: 1.4, barometric_hpa: 974.1 },
    ],
    stations: [
      {
        station_id: 'STN-001',
        station_name: 'Bharati',
        location: "Larsemann Hills, East Antarctica (69°24'S, 76°11'E)",
        occupancy_current: 24,
        occupancy_capacity: 47,
        power_generation_kw: 185.0,
        power_demand_kw: 168.4,
        thermal_burn_rate_l_day: 115.0,
        ambient_temp_c: -26.8,
        generator_1_load_pct: 78.5,
        generator_2_load_pct: 15.0,
        fuel_reserve_days: 44.0,
        water_reserve_days: 28.0,
        status: 'OPERATIONAL',
      },
      {
        station_id: 'STN-002',
        station_name: 'Maitri',
        location: "Schirmacher Oasis, Queen Maud Land (70°45'S, 11°44'E)",
        occupancy_current: 19,
        occupancy_capacity: 25,
        power_generation_kw: 140.0,
        power_demand_kw: 132.0,
        thermal_burn_rate_l_day: 98.5,
        ambient_temp_c: -31.2,
        generator_1_load_pct: 88.2,
        generator_2_load_pct: 0.0,
        fuel_reserve_days: 18.5,
        water_reserve_days: 16.0,
        status: 'CRITICAL_MARGIN',
      },
      {
        station_id: 'STN-003',
        station_name: 'Himadri',
        location: "Ny-Ålesund, Svalbard, Arctic (78°55'N, 11°56'E)",
        occupancy_current: 12,
        occupancy_capacity: 16,
        power_generation_kw: 95.0,
        power_demand_kw: 76.2,
        thermal_burn_rate_l_day: 52.0,
        ambient_temp_c: -14.5,
        generator_1_load_pct: 64.0,
        generator_2_load_pct: 0.0,
        fuel_reserve_days: 82.0,
        water_reserve_days: 45.0,
        status: 'OPTIMAL',
      },
      {
        station_id: 'STN-004',
        station_name: 'Davis',
        location: "Vestfold Hills, Princess Elizabeth Land (68°34'S, 77°58'E)",
        occupancy_current: 32,
        occupancy_capacity: 70,
        power_generation_kw: 240.0,
        power_demand_kw: 215.8,
        thermal_burn_rate_l_day: 145.2,
        ambient_temp_c: -22.0,
        generator_1_load_pct: 72.0,
        generator_2_load_pct: 45.0,
        fuel_reserve_days: 62.0,
        water_reserve_days: 38.0,
        status: 'OPERATIONAL',
      },
    ],
    inventory: [
      {
        item_id: 'INV-001',
        item_name: 'Polar Diesel Fuel (Jet A-1 Special)',
        category: 'Energy / Fuel',
        location: 'Maitri Station',
        current_stock: 18200,
        unit: 'Litres',
        daily_burn_rate: 985,
        days_remaining: 18.5,
        predicted_depletion_date: '2026-10-15',
        next_resupply_date: '2026-10-19',
        shortage_risk: true,
        confidence_lower_days: 16.8,
        confidence_upper_days: 20.1,
      },
      {
        item_id: 'INV-002',
        item_name: 'Polar Diesel Fuel (Jet A-1 Special)',
        category: 'Energy / Fuel',
        location: 'Bharati Station',
        current_stock: 52400,
        unit: 'Litres',
        daily_burn_rate: 1190,
        days_remaining: 44.0,
        predicted_depletion_date: '2026-11-10',
        next_resupply_date: '2026-10-11',
        shortage_risk: false,
        confidence_lower_days: 41.5,
        confidence_upper_days: 47.2,
      },
      {
        item_id: 'INV-003',
        item_name: 'Freeze-Dried Medical & Trauma Packs',
        category: 'Medical',
        location: 'Maitri Station',
        current_stock: 42,
        unit: 'Units',
        daily_burn_rate: 0.45,
        days_remaining: 93.3,
        predicted_depletion_date: '2026-12-29',
        next_resupply_date: '2026-10-19',
        shortage_risk: false,
        confidence_lower_days: 85.0,
        confidence_upper_days: 102.0,
      },
      {
        item_id: 'INV-004',
        item_name: 'Desalination Membrane Filters',
        category: 'Life Support',
        location: 'Davis Station',
        current_stock: 8,
        unit: 'Filter Sets',
        daily_burn_rate: 0.08,
        days_remaining: 100.0,
        predicted_depletion_date: '2027-01-05',
        next_resupply_date: '2026-11-11',
        shortage_risk: false,
        confidence_lower_days: 88.0,
        confidence_upper_days: 115.0,
      },
      {
        item_id: 'INV-005',
        item_name: 'Caterpillar 3512B Injector Assemblies',
        category: 'Spare Parts',
        location: 'Bharati Station',
        current_stock: 3,
        unit: 'Assemblies',
        daily_burn_rate: 0.04,
        days_remaining: 75.0,
        predicted_depletion_date: '2026-12-11',
        next_resupply_date: '2026-10-11',
        shortage_risk: false,
        confidence_lower_days: 60.0,
        confidence_upper_days: 90.0,
      },
    ],
    assets: [
      {
        asset_id: 'AST-MTR-GEN1',
        asset_name: 'Main Diesel Generator #1 (CAT 3512)',
        location: 'Maitri Power Plant',
        asset_type: 'Power Generation',
        health_score: 68.4,
        rul_days: 26.5,
        failure_probability_30d: 0.34,
        survival_probability_60d: 0.48,
        active_anomalies: 1,
        recommended_action: 'Inspect fuel injector timing; switch base load to Generator #2 during mild weather',
        model_used: 'Weibull Survival Analysis + XGBoost Feature Regressor',
      },
      {
        asset_id: 'AST-BHR-GEN2',
        asset_name: 'Backup Diesel Generator #2 (Volvo D16)',
        location: 'Bharati Station',
        asset_type: 'Power Generation',
        health_score: 94.0,
        rul_days: 240.0,
        failure_probability_30d: 0.02,
        survival_probability_60d: 0.96,
        active_anomalies: 0,
        recommended_action: 'Optimal condition; standard scheduled monthly test run',
        model_used: 'Weibull Survival Analysis',
      },
      {
        asset_id: 'AST-VES-PSTAR-ENG1',
        asset_name: 'Port Propulsion Diesel Engine (ALCO 251)',
        location: 'Polar Star Engine Room',
        asset_type: 'Marine Propulsion',
        health_score: 87.2,
        rul_days: 115.0,
        failure_probability_30d: 0.06,
        survival_probability_60d: 0.88,
        active_anomalies: 1,
        recommended_action: 'Clean turbocharger air intake filter; harmonic vibration within tolerance',
        model_used: 'Cox Proportional Hazards Model',
      },
      {
        asset_id: 'AST-DAV-HVAC1',
        asset_name: 'Central Habitat Thermal Recovery Unit',
        location: 'Davis Living Quarters',
        asset_type: 'HVAC / Life Support',
        health_score: 91.5,
        rul_days: 180.0,
        failure_probability_30d: 0.04,
        survival_probability_60d: 0.92,
        active_anomalies: 0,
        recommended_action: 'Routine filter backwash',
        model_used: 'Weibull Survival Analysis',
      },
      {
        asset_id: 'AST-VES-SCROSS-PROP',
        asset_name: 'Controllable Pitch Propeller Hub',
        location: 'Southern Cross Stern',
        asset_type: 'Propulsion & Steering',
        health_score: 76.8,
        rul_days: 48.0,
        failure_probability_30d: 0.18,
        survival_probability_60d: 0.69,
        active_anomalies: 1,
        recommended_action: 'Monitor hydraulic seal pressure under heavy ice ramming maneuvers',
        model_used: 'XGBoost Degradation Regressor',
      },
    ],
    anomalies: [
      {
        anomaly_id: 'ANOM-2026-901',
        timestamp: '2026-09-27 17:44 UTC',
        equipment_id: 'AST-MTR-GEN1',
        equipment_name: 'Generator #1 Cylinder 4 Exh Temp',
        location: 'Maitri Station',
        sensor_id: 'SNS-TEMP-CYL4-MTR',
        anomaly_type: 'Thermal Gradient Outlier (Z-score +3.8)',
        detection_model: 'Isolation Forest',
        reconstruction_error: 0.084,
        z_score: 3.82,
        severity: 'HIGH',
        status: 'OPEN',
        actionable_remediation: 'Thermocouple indicates 542°C (baseline 480°C). Check fuel atomization nozzle 4.',
      },
      {
        anomaly_id: 'ANOM-2026-902',
        timestamp: '2026-09-27 16:11 UTC',
        equipment_id: 'AST-VES-PSTAR-ENG1',
        equipment_name: 'Port Propulsion Shaft Bearing 2',
        location: 'Polar Star Engine Room',
        sensor_id: 'SNS-VIB-SHAFT2-PST',
        anomaly_type: 'Harmonic Resonance Latent Reconstruction Error',
        detection_model: 'Autoencoder',
        reconstruction_error: 0.142,
        z_score: 2.95,
        severity: 'MEDIUM',
        status: 'INVESTIGATING',
        actionable_remediation: 'Autoencoder detected uncharacteristic 42Hz frequency spike under 85% torque.',
      },
      {
        anomaly_id: 'ANOM-2026-903',
        timestamp: '2026-09-27 12:56 UTC',
        equipment_id: 'AST-VES-SCROSS-PROP',
        equipment_name: 'Hydraulic Pitch Actuator Pressure',
        location: 'Southern Cross Stern',
        sensor_id: 'SNS-HYD-PRESS-SC',
        anomaly_type: 'Pressure Transience Spike',
        detection_model: 'Isolation Forest',
        reconstruction_error: 0.091,
        z_score: 3.10,
        severity: 'MEDIUM',
        status: 'OPEN',
        actionable_remediation: 'Transient surge to 215 bar during reverse thrust through multi-year ridge.',
      },
      {
        anomaly_id: 'ANOM-2026-899',
        timestamp: '2026-09-27 04:26 UTC',
        equipment_id: 'AST-DAV-HVAC1',
        equipment_name: 'Intake Air Velocity Differential',
        location: 'Davis Living Quarters',
        sensor_id: 'SNS-AIR-VEL-DAV',
        anomaly_type: 'Rime Ice Vent Obstruction',
        detection_model: 'Autoencoder',
        reconstruction_error: 0.198,
        z_score: 4.20,
        severity: 'LOW',
        status: 'RESOLVED',
        actionable_remediation: 'Heater tape actuated automatically; airflow restored to 12.4 m/s nominal.',
      },
    ],
    models: [
      {
        model_id: 'XGB-ETA-V4',
        name: 'Polar Voyage ETA Predictor',
        algorithm: 'XGBoost Gradient Boosting Regressor',
        version: 'v4.2.1',
        task_type: 'REGRESSION',
        deployment_status: 'PRODUCTION',
        last_trained: '2026-09-18',
        dataset_version: 'DS-POLAR-ETA-2026A (84,000 nautical miles)',
        metrics: { mae: 1.4, rmse: 2.1, r2: 0.942, mape: 3.8 },
        drift_score_psi: 0.038,
        drift_status: 'STABLE',
        recommendation: 'Performance within optimal envelope; no retraining required',
      },
      {
        model_id: 'LGBM-DEMAND-V2',
        name: 'Station Consumables Demand Forecaster',
        algorithm: 'LightGBM Multi-output Regressor',
        version: 'v2.3.0',
        task_type: 'TIME_SERIES',
        deployment_status: 'PRODUCTION',
        last_trained: '2026-09-20',
        dataset_version: 'DS-STN-LOGISTICS-2025Q4 (4 Antarctic seasons)',
        metrics: { mae: 8.2, rmse: 11.5, r2: 0.925, mape: 4.1 },
        drift_score_psi: 0.052,
        drift_status: 'STABLE',
        recommendation: 'Feature distribution stable; scheduled bi-weekly recalibration',
      },
      {
        model_id: 'IF-ANOMALY-V3',
        name: 'Multivariate Equipment Anomaly Detector',
        algorithm: 'Isolation Forest',
        version: 'v3.1.0',
        task_type: 'ANOMALY_DETECTION',
        deployment_status: 'PRODUCTION',
        last_trained: '2026-09-15',
        dataset_version: 'DS-IOT-TELEMETRY-2026-S1 (1.8M sensor pings)',
        metrics: { precision: 0.94, recall: 0.91, f1: 0.925, auc: 0.962 },
        drift_score_psi: 0.045,
        drift_status: 'STABLE',
        recommendation: 'Optimal contamination ratio 0.035; healthy discrimination',
      },
      {
        model_id: 'AE-SENSOR-V1',
        name: 'Deep Latent Vibration Autoencoder',
        algorithm: 'Autoencoder (PyTorch Deep Neural Net)',
        version: 'v1.2.4',
        task_type: 'ANOMALY_DETECTION',
        deployment_status: 'PRODUCTION',
        last_trained: '2026-09-10',
        dataset_version: 'DS-HARMONIC-SHAFT-2026 (Continuous 1kHz streaming)',
        metrics: { precision: 0.96, recall: 0.89, f1: 0.923, auc: 0.971 },
        drift_score_psi: 0.061,
        drift_status: 'STABLE',
        recommendation: 'Reconstruction threshold fine-tuned for high sea-ice vibration harmonics',
      },
      {
        model_id: 'SURV-ASSET-RUL-V2',
        name: 'Machinery Remaining Useful Life Engine',
        algorithm: 'Survival Analysis (Weibull & Cox PH)',
        version: 'v2.0.2',
        task_type: 'REGRESSION',
        deployment_status: 'PRODUCTION',
        last_trained: '2026-09-12',
        dataset_version: 'DS-GEN-FAILURE-RUNS (Caterpillar/Volvo historical MTBF)',
        metrics: { mae: 3.8, rmse: 5.2, r2: 0.898 },
        drift_score_psi: 0.041,
        drift_status: 'STABLE',
        recommendation: 'Weibull shape parameter beta=2.14 confirms wear-out regime tracking',
      },
      {
        model_id: 'XGB-FUEL-EFF-V3',
        name: 'Vessel Ice-Resistance Fuel Estimator',
        algorithm: 'XGBoost Ice-Penetration Regressor',
        version: 'v3.4.0',
        task_type: 'REGRESSION',
        deployment_status: 'PRODUCTION',
        last_trained: '2026-09-16',
        dataset_version: 'DS-ICE-RESISTANCE-S1 (Sentinel-1 SAR + AIS logs)',
        metrics: { mae: 1.1, rmse: 1.7, r2: 0.951, mape: 3.2 },
        drift_score_psi: 0.078,
        drift_status: 'MONITOR',
        recommendation: 'Early drift observed in Sentinel-1 ice classification input; monitor next SAR pass',
      },
    ],
    risks: [
      {
        id: 'RSK-001',
        category: 'Sea Ice Entrapment / Besetting',
        description: 'Vessel trapped in convergent multi-year pack ice or pressure ridges',
        probability: 3,
        impact: 4,
        risk_score: 12,
        risk_level: 'MEDIUM',
        mitigation_strategy: 'Dynamic satellite SAR ice routing; Polar Star escort standby',
        trend: 'stable',
      },
      {
        id: 'RSK-002',
        category: 'Fuel Depletion Margin Breach',
        description: 'Station fuel reserves drop below safety reserve buffer before annual resupply voyage',
        probability: 4,
        impact: 5,
        risk_score: 20,
        risk_level: 'CRITICAL',
        mitigation_strategy: 'Mandatory power-saving protocol at Maitri; prioritize Southern Cross transit',
        trend: 'up',
      },
      {
        id: 'RSK-003',
        category: 'Critical Generator Power Plant Failure',
        description: 'Catastrophic breakdown of prime station or vessel generator during deep polar freeze',
        probability: 2,
        impact: 5,
        risk_score: 10,
        risk_level: 'MEDIUM',
        mitigation_strategy: 'N+1 redundant standby gensets; automated emergency load shedding',
        trend: 'stable',
      },
      {
        id: 'RSK-004',
        category: 'Severe Katabatic Blizzard / Zero Visibility',
        description: 'Wind gusts > 80 knots with blowing snow preventing all outdoor and aviation movement',
        probability: 4,
        impact: 3,
        risk_score: 12,
        risk_level: 'MEDIUM',
        mitigation_strategy: 'Condition 1 station lockdown; lifeline cables and indoor survival modules',
        trend: 'up',
      },
      {
        id: 'RSK-005',
        category: 'Medical Emergency during Transport Blackout',
        description: 'Severe crew trauma or illness when aeromedical evacuation is impossible due to storm',
        probability: 2,
        impact: 4,
        risk_score: 8,
        risk_level: 'LOW',
        mitigation_strategy: 'On-site physician, telemedicine SATCOM link, surgical capability',
        trend: 'stable',
      },
      {
        id: 'RSK-006',
        category: 'Satellite Communications Outage',
        description: 'Simultaneous loss of Iridium and Starlink coverage during high geomagnetic storm',
        probability: 2,
        impact: 3,
        risk_score: 6,
        risk_level: 'LOW',
        mitigation_strategy: 'HF radio backup networks; local edge autonomous operational buffering',
        trend: 'down',
      },
      {
        id: 'RSK-007',
        category: 'Ski-way Runway Unserviceable',
        description: 'Surface melting or severe sastrugi drifts halting LC-130 / Basler flights',
        probability: 3,
        impact: 3,
        risk_score: 9,
        risk_level: 'MEDIUM',
        mitigation_strategy: 'Continuous snow groomer maintenance; alternate ice runway reconnaissance',
        trend: 'down',
      },
      {
        id: 'RSK-008',
        category: 'Potable Water Depletion',
        description: 'Reverse osmosis intake freezing or failure requiring emergency snow melting fuel burn',
        probability: 2,
        impact: 4,
        risk_score: 8,
        risk_level: 'LOW',
        mitigation_strategy: 'Emergency thermal snow-melters; 30-day potable buffer tanks',
        trend: 'stable',
      },
      {
        id: 'RSK-009',
        category: 'Crew Isolation Fatigue / Overwinter Syndrome',
        description: 'Psychological stress and sleep disruption during 6-month continuous polar night',
        probability: 3,
        impact: 2,
        risk_score: 6,
        risk_level: 'LOW',
        mitigation_strategy: 'Circadian full-spectrum lighting; structured psychological support check-ins',
        trend: 'stable',
      },
      {
        id: 'RSK-010',
        category: 'Antarctic Treaty Environmental Compliance',
        description: 'Accidental fuel spill or waste handling deviation violating Madrid Protocol',
        probability: 1,
        impact: 5,
        risk_score: 5,
        risk_level: 'LOW',
        mitigation_strategy: 'Double-walled fuel bladders; strict zero-discharge waste incineration',
        trend: 'stable',
      },
    ],
    correlations: [
      {
        variable_a: 'Wind Speed (Knots)',
        variable_b: 'Vessel Fuel Consumption (L/nm)',
        pearson_r: 0.88,
        causality_type: 'DIRECT_CAUSATION',
        explanation: 'Headwinds create direct hydrodynamic hull drag and aerodynamic resistance, forcing increased engine RPM to maintain steerage.',
      },
      {
        variable_a: 'Sea Ice Concentration (%)',
        variable_b: 'Transit Speed (Knots)',
        pearson_r: -0.92,
        causality_type: 'DIRECT_CAUSATION',
        explanation: 'Thick floe concentration physically increases hull friction and necessitates icebreaker ramming cycles, directly slowing transit.',
      },
      {
        variable_a: 'Ambient Temperature (°C)',
        variable_b: 'Station Thermal Fuel Burn (L/day)',
        pearson_r: -0.89,
        causality_type: 'DIRECT_CAUSATION',
        explanation: "Newton's law of cooling: lower outdoor temperatures proportionally increase building envelope heat loss, demanding greater hydronic heating burn.",
      },
      {
        variable_a: 'Geomagnetic K-Index',
        variable_b: 'Iridium Packet Latency (ms)',
        pearson_r: 0.74,
        causality_type: 'DIRECT_CAUSATION',
        explanation: 'Ionospheric scintillation directly scatters L-band satellite signals in polar auroral zones, increasing retransmissions.',
      },
      {
        variable_a: 'Station Occupancy',
        variable_b: 'Daily Water Consumption (L)',
        pearson_r: 0.95,
        causality_type: 'DIRECT_CAUSATION',
        explanation: 'Direct linear relationship with human life-support requirements (drinking, galley, hygiene).',
      },
      {
        variable_a: 'Ice Thickness (m)',
        variable_b: 'Shaft Vibration (mm/s)',
        pearson_r: 0.81,
        causality_type: 'STRONG_CORRELATION',
        explanation: 'Propeller milling against milled ice blocks induces periodic torsional vibrations in propulsion line.',
      },
      {
        variable_a: 'Generator Operating Hours',
        variable_b: 'Exhaust Gas Temperature (°C)',
        pearson_r: 0.67,
        causality_type: 'INDIRECT_EFFECT',
        explanation: 'Carbon deposition on turbocharger and injectors degrades combustion efficiency over time, raising exhaust temperature.',
      },
      {
        variable_a: 'Solar Elevation Angle',
        variable_b: 'Crew Communication Frequency',
        pearson_r: 0.58,
        causality_type: 'SPURIOUS',
        explanation: 'Both variables correlate with diurnal activity schedules, but sunlight elevation does not physically drive radio communication packets.',
      },
    ],
    forecast: [
      { horizon_days: 7, date: '2026-10-04', metric: 'Fleet Daily Fuel Consumption (Litres)', value_mean: 3279.4, value_p10: 3120.9, value_p90: 3437.9 },
      { horizon_days: 7, date: '2026-10-04', metric: 'Station Thermal Burn (Litres/Day)', value_mean: 350.6, value_p10: 327.2, value_p90: 374.0 },
      { horizon_days: 14, date: '2026-10-11', metric: 'Fleet Daily Fuel Consumption (Litres)', value_mean: 3308.8, value_p10: 3111.8, value_p90: 3505.8 },
      { horizon_days: 14, date: '2026-10-11', metric: 'Station Thermal Burn (Litres/Day)', value_mean: 356.2, value_p10: 324.4, value_p90: 388.0 },
      { horizon_days: 30, date: '2026-10-27', metric: 'Fleet Daily Fuel Consumption (Litres)', value_mean: 3376.0, value_p10: 3091.0, value_p90: 3661.0 },
      { horizon_days: 30, date: '2026-10-27', metric: 'Station Thermal Burn (Litres/Day)', value_mean: 369.0, value_p10: 318.0, value_p90: 420.0 },
      { horizon_days: 90, date: '2026-12-26', metric: 'Fleet Daily Fuel Consumption (Litres)', value_mean: 3628.0, value_p10: 3013.0, value_p90: 4243.0 },
      { horizon_days: 90, date: '2026-12-26', metric: 'Station Thermal Burn (Litres/Day)', value_mean: 417.0, value_p10: 294.0, value_p90: 540.0 },
    ],
    data_quality: [
      {
        data_source: 'Shipboard Engine & Navigation Telemetry',
        completeness_pct: 99.4,
        latency_seconds: 4.2,
        freshness_status: 'REALTIME',
        anomalous_records_count: 2,
        last_ingestion_timestamp: '18:12:40 UTC',
      },
      {
        data_source: 'Station Environmental & Power Scada',
        completeness_pct: 98.8,
        latency_seconds: 18.5,
        freshness_status: 'HEALTHY',
        anomalous_records_count: 1,
        last_ingestion_timestamp: '18:12:28 UTC',
      },
      {
        data_source: 'Sentinel-1 SAR Sea Ice Mosaic',
        completeness_pct: 94.2,
        latency_seconds: 12600.0,
        freshness_status: 'PASS_ALIGNED (Periodic Orbit)',
        anomalous_records_count: 0,
        last_ingestion_timestamp: 'Orbit Pass 2026-09-27 14:40 UTC',
      },
      {
        data_source: 'ECMWF High-Resolution Polar Forecasts',
        completeness_pct: 100.0,
        latency_seconds: 21600.0,
        freshness_status: 'CYCLE_ALIGNED (00z/12z)',
        anomalous_records_count: 0,
        last_ingestion_timestamp: 'Model Run 2026-09-27 12:00 UTC',
      },
    ],
    network: [
      {
        channel: 'Starlink Maritime (Low Earth Orbit)',
        uptime_pct: 88.5,
        current_latency_ms: 145.0,
        packet_loss_pct: 2.1,
        offline_backlog_kb: 0,
        status: 'ONLINE',
      },
      {
        channel: 'Iridium Certus 700 (Polar L-Band)',
        uptime_pct: 99.8,
        current_latency_ms: 620.0,
        packet_loss_pct: 0.4,
        offline_backlog_kb: 0,
        status: 'ONLINE',
      },
      {
        channel: 'Inmarsat-C Safety & Distress',
        uptime_pct: 99.9,
        current_latency_ms: 1200.0,
        packet_loss_pct: 0.1,
        offline_backlog_kb: 0,
        status: 'ONLINE',
      },
      {
        channel: 'High-Frequency (HF) ALE Radio Backup',
        uptime_pct: 82.0,
        current_latency_ms: 2800.0,
        packet_loss_pct: 8.4,
        offline_backlog_kb: 42,
        status: 'STANDBY',
      },
    ],
    insights: [
      {
        id: 'INS-001',
        timestamp: '2026-09-27 18:20 UTC',
        category: 'LOGISTICS',
        severity: 'CRITICAL',
        title: 'Maitri Station Fuel Depletion Margin Breach',
        finding: 'Station reserves are projected to exhaust in 18.5 days, while Southern Cross resupply arrival is projected at Day 22.0.',
        root_cause: 'Ambient temperatures have stayed -4.5°C colder than 10-year climatology, elevating thermal heating burn rate by 18.4%.',
        recommended_action: 'Execute Stage-2 heat conservation in non-critical science wing and advise Southern Cross to maintain PC4 ice-breaking speed.',
        confidence: 0.96,
        model_source: 'LightGBM Demand Forecaster + Weather Climatology Engine',
      },
      {
        id: 'INS-002',
        timestamp: '2026-09-27 16:50 UTC',
        category: 'ANOMALY',
        severity: 'WARNING',
        title: 'Maitri Generator #1 Cylinder 4 Exh Thermal Outlier',
        finding: 'Isolation Forest detected Z-score +3.82 on Cylinder 4 exhaust gas temperature (542°C vs 480°C baseline).',
        root_cause: 'Localized fuel injector spray pattern degradation causing late in-cylinder combustion.',
        recommended_action: 'Switch primary electrical bus to Generator #2 and clean/replace fuel injector nozzle assembly on Cylinder 4.',
        confidence: 0.93,
        model_source: 'Isolation Forest Multivariate Detector',
      },
      {
        id: 'INS-003',
        timestamp: '2026-09-27 15:20 UTC',
        category: 'EFFICIENCY',
        severity: 'INFO',
        title: 'Polynya Corridor Opportunity for Southern Cross',
        finding: 'Sentinel-1 SAR analysis identifies an offshore lead opening along Prydz Bay that reduces ice resistance factor from 1.85 to 1.22.',
        root_cause: 'Persistent south-easterly katabatic winds pushing pack ice northward away from the coast.',
        recommended_action: 'Adopt Waypoint Option Charlie (-14.2 nm diversion) to gain estimated 18 hours in transit time to Bharati.',
        confidence: 0.89,
        model_source: 'Sentinel-1 SAR Lead Detector + Route Optimizer',
      },
      {
        id: 'INS-004',
        timestamp: '2026-09-27 12:20 UTC',
        category: 'SAFETY',
        severity: 'WARNING',
        title: 'Approaching Deep Depressional Blizzard at Larsemann Hills',
        finding: 'Barometric pressure falling 1.8 hPa/hr; ECMWF ensemble indicates 65-knot gusts within 36 hours.',
        root_cause: 'Polar vortex depression tracking eastward along Antarctic coastal margin.',
        recommended_action: 'Secure all outdoor cargo staging at Bharati and halt inter-station snowcat traverses until system clears.',
        confidence: 0.94,
        model_source: 'ECMWF Polar Ensemble & Barometric Gradient Analyzer',
      },
    ],
  }
}
