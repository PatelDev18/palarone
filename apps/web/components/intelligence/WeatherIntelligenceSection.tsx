"use client"

import React, { useState } from 'react'
import { WeatherReport } from '@/types/intelligence'
import { 
  CloudRain, 
  Wind, 
  Thermometer, 
  Eye, 
  Gauge, 
  AlertTriangle, 
  Clock, 
  Compass,
  ArrowRight
} from 'lucide-react'

interface WeatherIntelligenceSectionProps {
  reports: WeatherReport[];
}

export function WeatherIntelligenceSection({ reports }: WeatherIntelligenceSectionProps) {
  const [selectedReport, setSelectedReport] = useState<WeatherReport>(reports[0] || null);
  const [activeHorizon, setActiveHorizon] = useState<string>('now');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-500/10 rounded-md border border-amber-500/20 text-amber-400">
                <CloudRain className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Antarctic Weather Intelligence</h2>
              <span className="text-xs font-mono bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-full font-bold animate-pulse">
                KATABATIC GALE ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              ECMWF & Polar WRF 0.1° numerical weather forecasts with real-time station barometer and anemometer telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {reports.map((rep) => (
              <button
                key={rep.location_name}
                onClick={() => setSelectedReport(rep)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedReport.location_name === rep.location_name
                    ? 'bg-amber-600 text-white shadow'
                    : 'bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'
                }`}
              >
                {rep.location_name.split('&')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Sector Weather Detail */}
        {selectedReport && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px] font-semibold uppercase">
                <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
                <span>Temperature</span>
              </div>
              <div className="text-2xl font-black font-mono text-cyan-300 mt-1">
                {selectedReport.temperature_c}°C
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Windchill: -38.2°C</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px] font-semibold uppercase">
                <Wind className="w-3.5 h-3.5 text-amber-400" />
                <span>Wind Speed</span>
              </div>
              <div className="text-2xl font-black font-mono text-amber-300 mt-1">
                {selectedReport.wind_speed_knots} kt
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Direction: {selectedReport.wind_direction}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px] font-semibold uppercase">
                <Eye className="w-3.5 h-3.5 text-blue-400" />
                <span>Visibility</span>
              </div>
              <div className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">
                {selectedReport.visibility_km} km
              </div>
              <div className="text-[10px] text-red-400 font-bold mt-0.5">Severe Blowing Snow</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px] font-semibold uppercase">
                <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                <span>Barometer</span>
              </div>
              <div className="text-2xl font-black font-mono text-emerald-300 mt-1">
                {selectedReport.pressure_hpa}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">hPa (Low Pressure Cell)</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px] font-semibold uppercase">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>Weather Risk</span>
              </div>
              <div className="text-2xl font-black font-mono text-rose-400 mt-1">
                {selectedReport.weather_risk_score} / 100
              </div>
              <div className="text-[10px] text-rose-300 font-bold mt-0.5">HIGH HAZARD</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px] font-semibold uppercase">
                <Compass className="w-3.5 h-3.5 text-indigo-400" />
                <span>Sea State</span>
              </div>
              <div className="text-base font-bold text-indigo-300 mt-1 truncate">
                {selectedReport.sea_state}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Wave Height: 4.8m</div>
            </div>
          </div>
        )}

        {/* Forecast Horizon Selector & Forecast Display */}
        {selectedReport && selectedReport.forecast_horizons && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Multi-Horizon Forecast & Route Weather Impact
              </span>
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-lg">
                {Object.keys(selectedReport.forecast_horizons).map((hz) => (
                  <button
                    key={hz}
                    onClick={() => setActiveHorizon(hz)}
                    className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition ${
                      activeHorizon === hz ? 'bg-blue-600 text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:text-white'
                    }`}
                  >
                    {hz}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="font-bold text-slate-900 dark:text-white">Route Weather Impact ({activeHorizon}):</span>{' '}
                <span className="text-amber-400 font-mono font-semibold">{selectedReport.route_weather_impact}</span>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                  Forecast wind at {activeHorizon}: <strong className="text-slate-900 dark:text-white">{selectedReport.forecast_horizons[activeHorizon]?.wind_knots} kt</strong>, 
                  Temperature: <strong className="text-slate-900 dark:text-white">{selectedReport.forecast_horizons[activeHorizon]?.temp_c}°C</strong>
                </p>
              </div>

              <div className="px-3 py-1.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 text-[11px] font-bold">
                RISK LEVEL: {selectedReport.forecast_horizons[activeHorizon]?.risk}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
