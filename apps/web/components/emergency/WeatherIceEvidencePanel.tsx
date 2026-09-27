"use client"

import React, { useState } from 'react'
import { WeatherSeaIceObservation, SatelliteEvidence } from '@/types/emergency'
import { 
  CloudSnow, 
  Wind, 
  Eye, 
  Thermometer, 
  Snowflake, 
  Compass, 
  Satellite, 
  Layers, 
  Maximize2, 
  ShieldAlert, 
  Clock, 
  SlidersHorizontal,
  FileCheck
} from 'lucide-react'
import { DataFreshnessBadge } from './DataFreshnessBadge'

interface WeatherIceEvidencePanelProps {
  weatherIce: WeatherSeaIceObservation;
  satellite: SatelliteEvidence;
  onComparePrevious?: () => void;
  onViewChangeDetection?: () => void;
}

export function WeatherIceEvidencePanel({
  weatherIce,
  satellite,
  onComparePrevious,
  onViewChangeDetection
}: WeatherIceEvidencePanelProps) {
  const [activeViewMode, setActiveViewMode] = useState<'OBSERVATION' | 'PREVIOUS_PASS' | 'CHANGE_DETECTION'>('OBSERVATION');

  return (
    <div className="bg-[#0b1329] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xl space-y-5">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <CloudSnow className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
              <span>Weather, Sea Ice & Satellite Evidence</span>
              <DataFreshnessBadge status={weatherIce.data_freshness} updatedAt="12m ago" />
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Multimodal telemetry correlation from ECMWF & Sentinel-1 C-Band SAR</p>
          </div>
        </div>

        <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-800 font-bold">
          RISK: {weatherIce.risk_level}
        </span>
      </div>

      {/* Grid: Weather & Sea Ice Parameters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-3 rounded-lg flex flex-col justify-between">
          <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase flex items-center gap-1">
            <Thermometer className="w-3.5 h-3.5 text-blue-400" />
            <span>Air Temp</span>
          </span>
          <div className="mt-1">
            <span className="text-lg font-bold text-slate-100">{weatherIce.temperature_c}°C</span>
            <span className="text-[10px] text-slate-500 block">sub-zero gale</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-3 rounded-lg flex flex-col justify-between">
          <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase flex items-center gap-1">
            <Wind className="w-3.5 h-3.5 text-cyan-400" />
            <span>Wind / Gust</span>
          </span>
          <div className="mt-1">
            <span className="text-lg font-bold text-cyan-400">{weatherIce.wind_speed_knots} kt</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{weatherIce.wind_direction}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-3 rounded-lg flex flex-col justify-between">
          <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase flex items-center gap-1">
            <Snowflake className="w-3.5 h-3.5 text-cyan-300" />
            <span>Ice Concentration</span>
          </span>
          <div className="mt-1">
            <span className="text-lg font-bold text-red-400">{weatherIce.sea_ice_concentration_pct}%</span>
            <span className="text-[10px] text-slate-500 block">thick pack</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-3 rounded-lg flex flex-col justify-between">
          <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Ridge Thickness</span>
          </span>
          <div className="mt-1">
            <span className="text-lg font-bold text-amber-400">{weatherIce.sea_ice_thickness_m} m</span>
            <span className="text-[10px] text-slate-500 block">pressure keels</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-3 rounded-lg flex flex-col justify-between">
          <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Visibility</span>
          </span>
          <div className="mt-1">
            <span className="text-lg font-bold text-slate-200">{weatherIce.visibility_km} km</span>
            <span className="text-[10px] text-slate-500 block">drifting snow</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-3 rounded-lg flex flex-col justify-between">
          <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-orange-400" />
            <span>Iceberg Proximity</span>
          </span>
          <div className="mt-1">
            <span className="text-lg font-bold text-orange-400">{weatherIce.iceberg_proximity_nm} nm</span>
            <span className="text-[10px] text-slate-500 block">drifting NW</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-3 rounded-lg flex flex-col justify-between">
          <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
            <span>Wave Swell</span>
          </span>
          <div className="mt-1">
            <span className="text-lg font-bold text-blue-300">{weatherIce.wave_height_m} m</span>
            <span className="text-[10px] text-slate-500 block">very rough</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-3 rounded-lg flex flex-col justify-between">
          <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase flex items-center gap-1">
            <CloudSnow className="w-3.5 h-3.5 text-purple-400" />
            <span>Storm Risk</span>
          </span>
          <div className="mt-1">
            <span className="text-lg font-bold text-purple-300">{weatherIce.storm_probability_pct}%</span>
            <span className="text-[10px] text-slate-500 block">katabatic front</span>
          </div>
        </div>
      </div>

      {/* Satellite Evidence Section */}
      <div className="bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Satellite className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-slate-100 font-mono uppercase">
              {satellite.satellite} • {satellite.product_type}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-700">
              {satellite.display_time}
            </span>
            <span className="text-[10px] font-mono text-purple-300">
              Res: {satellite.resolution}
            </span>
          </div>
        </div>

        {/* Satellite Imagery Preview with Realistic SAR Texture */}
        <div className="relative h-48 rounded-lg overflow-hidden border border-slate-700 bg-slate-950 flex flex-col items-center justify-center group">
          {/* Synthetic Radar Texture */}
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-800 opacity-90"></div>
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, #38bdf8 1px, transparent 1px)',
              backgroundSize: '16px 16px'
            }}
          ></div>

          {/* SAR Feature Annotation Callout */}
          <div className="relative z-10 text-center p-4 max-w-md space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-950/80 border border-red-700 text-red-300 text-xs font-mono font-bold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>DETECTED: {satellite.feature_detected}</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-sans leading-relaxed">
              {satellite.finding}
            </p>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono pt-1">
              Acquisition Time: {satellite.acquisition_time} • Processing Status: {satellite.processing_status}
            </div>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="absolute bottom-2 left-2 z-20 flex gap-1">
            <button
              onClick={() => setActiveViewMode('OBSERVATION')}
              className={`px-2 py-1 rounded text-[10px] font-mono font-semibold transition ${
                activeViewMode === 'OBSERVATION'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 hover:text-slate-200'
              }`}
            >
              Latest Observation
            </button>
            <button
              onClick={() => {
                setActiveViewMode('PREVIOUS_PASS');
                if (onComparePrevious) onComparePrevious();
              }}
              className={`px-2 py-1 rounded text-[10px] font-mono font-semibold transition ${
                activeViewMode === 'PREVIOUS_PASS'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 hover:text-slate-200'
              }`}
            >
              Compare Previous
            </button>
            <button
              onClick={() => {
                setActiveViewMode('CHANGE_DETECTION');
                if (onViewChangeDetection) onViewChangeDetection();
              }}
              className={`px-2 py-1 rounded text-[10px] font-mono font-semibold transition ${
                activeViewMode === 'CHANGE_DETECTION'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 hover:text-slate-200'
              }`}
            >
              Change Detection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
