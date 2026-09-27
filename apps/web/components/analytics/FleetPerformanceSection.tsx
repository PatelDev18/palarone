'use client'

import React, { useState } from 'react'
import { VesselPerformanceRecord } from '@/types/analytics'
import {
  Ship,
  Gauge,
  Flame,
  Compass,
  AlertTriangle,
  ChevronRight,
  Shield,
  Activity,
  ArrowUpDown,
} from 'lucide-react'
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts'

interface FleetPerformanceSectionProps {
  fleet: VesselPerformanceRecord[]
  onSelectVessel: (vessel: VesselPerformanceRecord) => void
}

export const FleetPerformanceSection: React.FC<FleetPerformanceSectionProps> = ({
  fleet,
  onSelectVessel,
}) => {
  const [sortField, setSortField] = useState<keyof VesselPerformanceRecord>('health_score')
  const [sortAsc, setSortAsc] = useState<boolean>(false)

  const handleSort = (field: keyof VesselPerformanceRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc)
    } else {
      setSortField(field)
      setSortAsc(false)
    }
  }

  const sortedFleet = [...fleet].sort((a, b) => {
    const valA = a[sortField]
    const valB = b[sortField]
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortAsc ? valA - valB : valB - valA
    }
    return sortAsc
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA))
  })

  // Data for Speed vs Fuel Burn Scatter plot
  const scatterData = fleet.map((v) => ({
    name: v.vessel_name,
    speed: v.current_speed_knots,
    fuel: v.fuel_burn_rate_l_per_nm,
    health: v.health_score,
    iceFactor: v.ice_resistance_factor,
    vessel: v,
  }))

  return (
    <div className="flex flex-col gap-6">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <Ship className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Fleet Operational Performance & Vessel Intelligence
          </h2>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          5 Monitored Vessels (PC1 - PC5 Polar Classes)
        </span>
      </div>

      {/* Visual Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Speed vs Fuel Curve */}
        <div className="lg:col-span-2 p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Gauge className="w-4 h-4 text-emerald-400" />
                Hydrodynamic Curve: Speed vs Fuel Burn (L/nm)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Evaluates hydrodynamic resistance in sea ice conditions against vessel engine curves.
              </p>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
              Live AIS & Flowmeter Telemetry
            </span>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  type="number"
                  dataKey="speed"
                  name="Speed (knots)"
                  unit=" kn"
                  domain={[6, 16]}
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  type="number"
                  dataKey="fuel"
                  name="Fuel Burn"
                  unit=" L/nm"
                  domain={[15, 45]}
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="p-3 bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl text-xs space-y-1">
                          <p className="font-bold text-slate-900 dark:text-white">{data.name}</p>
                          <p className="text-slate-700 dark:text-slate-300">
                            Current Speed:{' '}
                            <span className="font-mono text-emerald-400">{data.speed} knots</span>
                          </p>
                          <p className="text-slate-700 dark:text-slate-300">
                            Fuel Burn:{' '}
                            <span className="font-mono text-amber-400">{data.fuel} L/nm</span>
                          </p>
                          <p className="text-slate-700 dark:text-slate-300">
                            Ice Resistance Factor:{' '}
                            <span className="font-mono text-blue-400">{data.iceFactor}x</span>
                          </p>
                          <p className="text-slate-700 dark:text-slate-300">
                            Diagnostic Health:{' '}
                            <span className="font-mono text-purple-400">{data.health}%</span>
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Scatter
                  name="Vessels"
                  data={scatterData}
                  fill="#3b82f6"
                  onClick={(e: any) => {
                    const target = e?.payload?.vessel || e?.vessel
                    if (target) onSelectVessel(target)
                  }}
                  cursor="pointer"
                >
                  {scatterData.map((entry, index) => {
                    const color =
                      entry.name === 'Southern Cross'
                        ? '#f59e0b'
                        : entry.name === 'Polar Star'
                        ? '#3b82f6'
                        : '#10b981'
                    return <Cell key={`cell-${index}`} fill={color} />
                  })}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800/50">
            <span>Bottom Left: Optimal Eco-Transit Zone</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Heavy Icebreaker
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Resupply Transport (High Ice Drag)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Survey / Patrol
              </span>
            </div>
          </div>
        </div>

        {/* Quick Diagnostics Highlights Card */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <Compass className="w-4 h-4 text-blue-400" />
              Route Efficiency & Sea Ice Impact
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              XGBoost route optimization compares planned vs actual transit trajectories through polar ice corridors.
            </p>

            <div className="space-y-3">
              {fleet.slice(0, 3).map((v) => (
                <div
                  key={v.vessel_id}
                  onClick={() => onSelectVessel(v)}
                  className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 hover:bg-slate-800/60 border border-slate-200 dark:border-slate-800/60 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{v.vessel_name}</span>
                    <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {v.route_efficiency_pct}% Eff.
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mb-1">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full"
                      style={{ width: `${v.voyage_progress_pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                    <span>{v.voyage_progress_pct}% Completed</span>
                    <span className={v.eta_variance_hours > 0 ? 'text-amber-400' : 'text-emerald-400'}>
                      ETA: {v.eta_variance_hours > 0 ? `+${v.eta_variance_hours}h` : `${v.eta_variance_hours}h`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Fleet Avg Route Efficiency:</span>
            <strong className="text-emerald-400 font-mono">95.4%</strong>
          </div>
        </div>
      </div>

      {/* Comprehensive Vessel Comparison Table */}
      <div className="rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 overflow-hidden shadow-sm">
        <div className="p-3.5 bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Vessel Telemetry & Diagnostic Registry
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Click any row to open Deep Diagnostic Drill-Down
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-950/80 text-[11px] text-slate-500 dark:text-slate-400 uppercase border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th
                  onClick={() => handleSort('vessel_name')}
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Vessel</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 font-semibold">Ice Class</th>
                <th
                  onClick={() => handleSort('current_speed_knots')}
                  className="py-3 px-3 font-semibold cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Speed / Opt</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('fuel_burn_rate_l_per_nm')}
                  className="py-3 px-3 font-semibold cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Fuel Burn</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 font-semibold">Ice Drag Factor</th>
                <th className="py-3 px-3 font-semibold">Active Mission</th>
                <th
                  onClick={() => handleSort('eta_variance_hours')}
                  className="py-3 px-3 font-semibold cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>ETA Variance</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 font-semibold">Anomalies</th>
                <th
                  onClick={() => handleSort('health_score')}
                  className="py-3 px-3 font-semibold cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Health Score</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-mono text-[11px]">
              {sortedFleet.map((v) => (
                <tr
                  key={v.vessel_id}
                  onClick={() => onSelectVessel(v)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-4 font-sans font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Ship className="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-300" />
                    <span>{v.vessel_name}</span>
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-500 dark:text-slate-400">{v.ice_class}</td>
                  <td className="py-3 px-3">
                    <span className="text-slate-900 dark:text-white font-semibold">{v.current_speed_knots}</span>
                    <span className="text-slate-500"> / {v.optimal_speed_knots} kn</span>
                  </td>
                  <td className="py-3 px-3 text-amber-400 font-semibold">
                    {v.fuel_burn_rate_l_per_nm} L/nm
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] ${
                        v.ice_resistance_factor > 1.5
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {v.ice_resistance_factor}x
                    </span>
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                    {v.active_mission}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`font-semibold ${
                        v.eta_variance_hours > 6
                          ? 'text-rose-400'
                          : v.eta_variance_hours > 0
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {v.eta_variance_hours > 0 ? `+${v.eta_variance_hours}h` : `${v.eta_variance_hours}h`}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {v.anomaly_count > 0 ? (
                      <span className="flex items-center gap-1 text-rose-400 font-bold">
                        <AlertTriangle className="w-3 h-3" />
                        {v.anomaly_count}
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-semibold">0</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${
                            v.health_score > 90
                              ? 'bg-emerald-400'
                              : v.health_score > 80
                              ? 'bg-amber-400'
                              : 'bg-rose-400'
                          }`}
                          style={{ width: `${v.health_score}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">{v.health_score}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors inline" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
