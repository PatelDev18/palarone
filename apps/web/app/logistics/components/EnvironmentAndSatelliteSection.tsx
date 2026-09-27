"use client"

import React, { useState } from 'react';
import { WeatherIntelligence, SeaIceIntelligence, SatelliteObservation } from '@/types/logistics';
import {
  Cloud,
  Wind,
  Thermometer,
  Eye,
  Waves,
  Satellite,
  ShieldAlert,
  Clock,
  Compass,
  CheckCircle2,
  ExternalLink,
  Layers,
  X,
  FileText
} from 'lucide-react';

interface Props {
  weather: WeatherIntelligence;
  seaIce: SeaIceIntelligence;
  satellites: SatelliteObservation[];
}

export function EnvironmentAndSatelliteSection({ weather, seaIce, satellites }: Props) {
  const [selectedObservation, setSelectedObservation] = useState<SatelliteObservation | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">CRITICAL</span>;
      case 'WARNING':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">WARNING</span>;
      case 'WATCH':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">WATCH</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">NORMAL</span>;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-8">
      {/* ------------------------------------------------------------------ */}
      {/* PANEL 1: WEATHER ENVIRONMENT INTELLIGENCE */}
      {/* ------------------------------------------------------------------ */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 backdrop-blur-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                <Cloud className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Weather Intelligence</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Atmospheric & oceanographic conditions</p>
              </div>
            </div>
            {getStatusBadge(weather.status_level)}
          </div>

          <div className="grid grid-cols-2 gap-3 my-4">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Thermometer className="w-3 h-3 text-sky-400" /> Temperature
              </span>
              <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {weather.metrics.temperature_c}°C
              </div>
              <span className="text-[10px] text-slate-500">SST: {weather.metrics.sea_surface_temp_c}°C</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Wind className="w-3 h-3 text-sky-400" /> Wind Velocity
              </span>
              <div className="text-lg font-bold text-amber-300 mt-1">
                {weather.metrics.wind_speed_knots} kts
              </div>
              <span className="text-[10px] text-slate-500">{weather.metrics.wind_direction}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Waves className="w-3 h-3 text-sky-400" /> Significant Wave
              </span>
              <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {weather.metrics.wave_height_m} m
              </div>
              <span className="text-[10px] text-slate-500">Southern Ocean swell</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Eye className="w-3 h-3 text-sky-400" /> Surface Visibility
              </span>
              <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {weather.metrics.visibility_km} km
              </div>
              <span className="text-[10px] text-slate-500">{weather.metrics.precipitation}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
            <div className="font-semibold text-amber-300 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Storm Advisory: {weather.metrics.storm_status}</span>
            </div>
            <p className="text-[11px] text-slate-700 dark:text-slate-300">{weather.storm_advisory}</p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>Source: {weather.source}</span>
          <span className="text-slate-500">Synced {new Date(weather.observation_timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC</span>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* PANEL 2: SEA ICE RISKS & ICE DRIFT */}
      {/* ------------------------------------------------------------------ */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 backdrop-blur-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <Compass className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Sea Ice Intelligence</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">SAR & AMSR2 passive microwave telemetry</p>
              </div>
            </div>
            {getStatusBadge(seaIce.status_level)}
          </div>

          <div className="grid grid-cols-2 gap-3 my-4">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Ice Concentration</span>
              <div className="text-lg font-bold text-cyan-300 mt-1">
                {seaIce.metrics.ice_concentration_pct}%
              </div>
              <span className="text-[10px] text-slate-500">Prydz Bay / 65°S sector</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Est. Ice Thickness</span>
              <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {seaIce.metrics.ice_thickness_m} m
              </div>
              <span className="text-[10px] text-slate-500">First-year pack ice</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Marginal Ice Edge</span>
              <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {seaIce.metrics.ice_edge_latitude}°S
              </div>
              <span className="text-[10px] text-slate-500">Southern boundary</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Ice Drift Vector</span>
              <div className="text-lg font-bold text-slate-200 mt-1 truncate">
                {seaIce.metrics.ice_movement_vector.split(' ')[0]} kts
              </div>
              <span className="text-[10px] text-slate-500">Heading 035° (NE drift)</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-xs space-y-1">
            <span className="font-semibold text-cyan-300 block">Navigational Guidance:</span>
            <p className="text-[11px] text-slate-700 dark:text-slate-300">{seaIce.navigational_recommendation}</p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>Source: {seaIce.source}</span>
          <span className="text-slate-500">Observed {new Date(seaIce.observation_timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC</span>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* PANEL 3: DEDICATED SATELLITE INTELLIGENCE SECTION (SECTION 10) */}
      {/* ------------------------------------------------------------------ */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 backdrop-blur-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <Satellite className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Satellite Intelligence</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Periodic SAR & Optical Observations</p>
              </div>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              LATEST ACQUISITION
            </span>
          </div>

          {/* Periodic observation banner - Section 10 explicitly requires communicating periodic observation */}
          <div className="mt-3 mb-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>Observations are periodic overflights, not live video streams.</span>
          </div>

          {/* Observations List */}
          <div className="space-y-2.5 my-2">
            {satellites.map((obs) => (
              <div
                key={obs.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 hover:border-purple-500/40 transition-colors cursor-pointer"
                onClick={() => setSelectedObservation(obs)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    {obs.satellite} ({obs.sensor})
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {new Date(obs.observation_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC
                  </span>
                </div>
                <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium truncate">
                  Coverage: {obs.coverage}
                </div>
                <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                  <span>Type: {obs.data_type}</span>
                  <span className="text-purple-300 font-semibold flex items-center gap-1">
                    <Eye className="w-3 h-3" /> View Observation
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>Pipeline: ESA / NASA STAC Catalog</span>
          <span className="text-slate-500">Architecture Ready</span>
        </div>
      </div>

      {/* Observation Modal Drawer */}
      {selectedObservation && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <Satellite className="w-5 h-5 text-purple-400" />
                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  {selectedObservation.satellite} SAR Observation
                </h4>
              </div>
              <button
                onClick={() => setSelectedObservation(null)}
                className="p-1 rounded-md text-slate-500 dark:text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 py-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Observation ID:</span>
                  <p className="font-mono text-slate-200 mt-0.5">{selectedObservation.id}</p>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Sensor Type:</span>
                  <p className="font-semibold text-slate-200 mt-0.5">{selectedObservation.sensor}</p>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Acquisition Time:</span>
                  <p className="font-semibold text-purple-300 mt-0.5">
                    {new Date(selectedObservation.observation_time).toUTCString()}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Resolution:</span>
                  <p className="font-semibold text-slate-200 mt-0.5">{selectedObservation.resolution}</p>
                </div>
              </div>

              <div>
                <span className="text-slate-500 dark:text-slate-400 font-medium">Coverage Zone:</span>
                <p className="font-bold text-slate-200 text-sm mt-0.5">{selectedObservation.coverage}</p>
              </div>

              <div>
                <span className="text-slate-500 dark:text-slate-400 font-medium">Extracted Features:</span>
                <p className="text-slate-700 dark:text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 mt-1">
                  {selectedObservation.notable_features}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Ice Concentration:</span>
                  <p className="text-cyan-400 font-bold text-sm">{selectedObservation.sea_ice_concentration_pct}%</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Confidence Score:</span>
                  <p className="text-emerald-400 font-bold text-sm">{(selectedObservation.confidence * 100).toFixed(0)}%</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedObservation(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors"
              >
                Close Observation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
