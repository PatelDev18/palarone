"use client";

import React from 'react';
import {
  X,
  Building2,
  Radio,
  Fuel,
  Users,
  Wind,
  Thermometer,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Clock,
  Compass,
  Package
} from 'lucide-react';
import { Station } from '@/types/command-center';

interface StationDrawerProps {
  station: Station | null;
  onClose: () => void;
}

export function StationDrawer({ station, onClose }: StationDrawerProps) {
  if (!station) return null;

  return (
    <div className="w-full sm:w-[420px] lg:w-[460px] bg-white dark:bg-[#0b1329] border-l border-slate-200 dark:border-slate-800 flex flex-col h-full overflow-hidden shadow-2xl z-30 select-none animate-in slide-in-from-right duration-200">
      {/* 1. Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070d1e] shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{station.name}</h2>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                    station.connectivity === 'ONLINE'
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                      : station.connectivity === 'DEGRADED'
                      ? 'bg-orange-500/15 border-orange-500/30 text-orange-400'
                      : station.connectivity === 'STALE'
                      ? 'bg-yellow-500/15 border-yellow-500/30 text-yellow-400'
                      : 'bg-red-500/15 border-red-500/30 text-red-400'
                  }`}
                >
                  {station.connectivity}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                {station.country} • {station.operator}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Telemetry Age & Link */}
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800/80 text-[11px] font-mono">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            Last Contact: <span className="text-slate-200">{station.telemetry_age}</span>
          </span>
          <span className="text-slate-500">Elev: {station.elevation_m}m AMSL</span>
        </div>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* 2. Station Vitals Grid */}
        <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
            Station Operational Vitals
          </div>
          <div className="grid grid-cols-2 gap-3 font-mono">
            <div className="bg-slate-950/50 p-2.5 rounded border border-slate-200 dark:border-slate-800/60">
              <span className="text-slate-500 text-[10px] uppercase flex items-center gap-1">
                <Users className="w-3 h-3 text-blue-400" /> Population
              </span>
              <p className="font-bold text-sm text-slate-100 mt-0.5">
                {station.population} / {station.max_capacity}
              </p>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                <div
                  className="bg-blue-500 h-full rounded-full"
                  style={{ width: `${(station.population / station.max_capacity) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-slate-950/50 p-2.5 rounded border border-slate-200 dark:border-slate-800/60">
              <span className="text-slate-500 text-[10px] uppercase flex items-center gap-1">
                <Fuel className="w-3 h-3 text-amber-400" /> Fuel Reserves
              </span>
              <p className="font-bold text-sm text-amber-400 mt-0.5">
                {station.fuel_days_remaining} Days
              </p>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${Math.min(100, (station.fuel_days_remaining / 180) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-slate-950/50 p-2.5 rounded border border-slate-200 dark:border-slate-800/60">
              <span className="text-slate-500 text-[10px] uppercase flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Life Support
              </span>
              <p className="font-bold text-sm text-emerald-400 mt-0.5">{station.life_support_pct}%</p>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Atmosphere & Thermal</span>
            </div>

            <div className="bg-slate-950/50 p-2.5 rounded border border-slate-200 dark:border-slate-800/60">
              <span className="text-slate-500 text-[10px] uppercase flex items-center gap-1">
                <Package className="w-3 h-3 text-purple-400" /> Critical Supplies
              </span>
              <p className="font-bold text-sm text-slate-100 mt-0.5">{station.critical_inventory_pct}%</p>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Medical / Food Stock</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-yellow-400" /> Power Generation:
            </span>
            <span className="font-mono text-slate-200 font-semibold">{station.power_status}</span>
          </div>
        </div>

        {/* 3. Comms Infrastructure & Connectivity */}
        <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2.5">
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-blue-400" />
            Telecommunications & Uplink
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded border border-slate-200 dark:border-slate-800 font-mono text-[11px] space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Method:</span>
              <span className="text-slate-200 font-semibold text-right">{station.comms_method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Coordinates:</span>
              <span className="text-cyan-400">
                {Math.abs(station.lat)}°S, {Math.abs(station.lon)}°{station.lon >= 0 ? 'E' : 'W'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Emergency State:</span>
              <span
                className={`font-bold ${
                  station.emergency_state === 'NORMAL' ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {station.emergency_state}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Local Station Weather */}
        {station.current_weather && (
          <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              On-Site Meteorological Sensor
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="bg-slate-950/40 p-2 rounded">
                <span className="text-slate-500 text-[10px]">Temperature</span>
                <p className="font-bold text-slate-100">{station.current_weather.temperature_c}°C</p>
              </div>
              <div className="bg-slate-950/40 p-2 rounded">
                <span className="text-slate-500 text-[10px]">Wind Velocity</span>
                <p className="font-bold text-slate-100">
                  {station.current_weather.wind_speed_knots} kt ({station.current_weather.wind_direction})
                </p>
              </div>
              <div className="bg-slate-950/40 p-2 rounded">
                <span className="text-slate-500 text-[10px]">Visibility</span>
                <p className="font-bold text-slate-100">{station.current_weather.visibility_km} km</p>
              </div>
              <div className="bg-slate-950/40 p-2 rounded">
                <span className="text-slate-500 text-[10px]">Barometric</span>
                <p className="font-bold text-slate-100">{station.current_weather.pressure_hpa} hPa</p>
              </div>
            </div>
            {station.current_weather.blizzard_active && (
              <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                Active Katabatic Blizzard in progress. External station travel restricted.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
