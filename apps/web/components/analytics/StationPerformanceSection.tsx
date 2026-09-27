'use client'

import React from 'react'
import { StationMetricRecord } from '@/types/analytics'
import { Building2, BatteryCharging, Users, Flame, Droplets, AlertTriangle, CheckCircle2 } from 'lucide-react'

interface StationPerformanceSectionProps {
  stations: StationMetricRecord[]
  onSelectStation?: (station: StationMetricRecord) => void
}

export const StationPerformanceSection: React.FC<StationPerformanceSectionProps> = ({
  stations,
  onSelectStation,
}) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <Building2 className="w-5 h-5 text-purple-400" />
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Polar Station Infrastructure & Energy Sustainability
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live telemetry from Bharati, Maitri, Himadri, and Davis research bases.
            </p>
          </div>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          4 Manned Stations Monitored
        </span>
      </div>

      {/* Station Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stations.map((stn) => {
          const isCritical = stn.status === 'CRITICAL_MARGIN'
          const fuelReserveTight = stn.fuel_reserve_days < 25

          return (
            <div
              key={stn.station_id}
              onClick={() => onSelectStation && onSelectStation(stn)}
              className={`p-5 rounded-xl border transition-all flex flex-col justify-between cursor-pointer group ${
                isCritical
                  ? 'bg-rose-950/20 hover:bg-rose-950/30 border-rose-500/40 shadow-rose-950/20'
                  : 'bg-white dark:bg-slate-900/60 hover:bg-slate-900/90 border-slate-200 dark:border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Station Title & Status */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-400 transition-colors">
                      {stn.station_name} Station
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[210px] mt-0.5">
                      {stn.location}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                      isCritical
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    {isCritical ? 'Margin Warning' : 'Nominal'}
                  </span>
                </div>

                {/* Occupancy and Ambient Temp */}
                <div className="grid grid-cols-2 gap-2 my-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/60 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <Users className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>
                      Crew: <strong className="text-slate-900 dark:text-white font-mono">{stn.occupancy_current}</strong>/{stn.occupancy_capacity}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>
                      Temp: <strong className="text-slate-900 dark:text-white font-mono">{stn.ambient_temp_c}°C</strong>
                    </span>
                  </div>
                </div>

                {/* Power Demand vs Generation */}
                <div className="space-y-2 mb-4 text-xs font-mono">
                  <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                    <span className="font-sans text-[11px]">Power Load:</span>
                    <span className="text-slate-900 dark:text-white font-semibold">
                      {stn.power_demand_kw} / {stn.power_generation_kw} kW
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-purple-500 h-1.5 rounded-full"
                      style={{
                        width: `${Math.min(100, (stn.power_demand_kw / stn.power_generation_kw) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Generator Load Split */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-[11px] font-mono">
                  <div className="p-2 rounded bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 text-[10px] block">Gen #1 (Prime)</span>
                    <span className="text-emerald-400 font-bold">{stn.generator_1_load_pct}% Load</span>
                  </div>
                  <div className="p-2 rounded bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 text-[10px] block">Gen #2 (Standby)</span>
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">{stn.generator_2_load_pct}% Load</span>
                  </div>
                </div>

                {/* Fuel & Water Reserves */}
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800/60 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-500" /> Thermal Fuel Reserve:
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        fuelReserveTight ? 'text-rose-400 animate-pulse' : 'text-emerald-400'
                      }`}
                    >
                      {stn.fuel_reserve_days} Days
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Droplets className="w-3.5 h-3.5 text-blue-400" /> Potable Water Reserve:
                    </span>
                    <span className="font-mono font-bold text-slate-200">
                      {stn.water_reserve_days} Days
                    </span>
                  </div>
                </div>
              </div>

              {/* Warning Banner if Fuel Reserve < Resupply */}
              {fuelReserveTight && (
                <div className="mt-4 p-2 rounded-lg bg-rose-500/20 border border-rose-500/40 text-[10px] text-rose-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Depletion date precedes scheduled resupply voyage by 3.5 days!</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
