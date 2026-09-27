"use client";

import React from 'react';
import {
  Layers,
  MapPin,
  Ship,
  Wind,
  Snowflake,
  Satellite,
  LifeBuoy,
  AlertTriangle,
  Clock,
  Compass,
  Globe2,
  CheckSquare,
  Square
} from 'lucide-react';
import { TimeHorizon, RegionFilter, LayerConfig } from '@/types/command-center';

interface CommandToolbarProps {
  timeHorizon: TimeHorizon;
  onTimeHorizonChange: (horizon: TimeHorizon) => void;
  selectedRegion: RegionFilter;
  onRegionChange: (region: RegionFilter) => void;
  layers: LayerConfig;
  onToggleLayer: (layerKey: keyof LayerConfig) => void;
  onResetView: () => void;
}

export function CommandToolbar({
  timeHorizon,
  onTimeHorizonChange,
  selectedRegion,
  onRegionChange,
  layers,
  onToggleLayer,
  onResetView,
}: CommandToolbarProps) {
  const timeOptions: TimeHorizon[] = ['Live', '1 hour', '6 hours', '24 hours', '7 days'];
  const regionOptions: RegionFilter[] = [
    'All Antarctica',
    'Weddell Sea',
    'Ross Sea',
    'Antarctic Peninsula',
    'Indian Ocean Sector',
  ];

  return (
    <div className="bg-white dark:bg-[#0b1329] border-b border-slate-200 dark:border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 select-none shadow-sm">
      {/* Left: Operational Status & Region Filter */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Status Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-200 dark:border-slate-700/80">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-300">
            SYSTEM: <span className="text-emerald-400">OPERATIONAL MONITORING</span>
          </span>
        </div>

        {/* Region Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-mono flex items-center gap-1">
            <Globe2 className="w-3.5 h-3.5 text-blue-400" />
            REGION:
          </span>
          <div className="flex items-center bg-slate-900 border border-slate-200 dark:border-slate-800 rounded p-0.5">
            {regionOptions.map((region) => (
              <button
                key={region}
                onClick={() => onRegionChange(region)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all cursor-pointer ${
                  selectedRegion === region
                    ? 'bg-blue-600 text-white font-semibold shadow-[0_0_10px_rgba(37,99,235,0.4)]'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
                title={`Filter Command Center to ${region}`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Center/Right: Time Horizon & GIS Layer Toggles */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Time Horizon Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-mono flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            TIME:
          </span>
          <div className="flex items-center bg-slate-900 border border-slate-200 dark:border-slate-800 rounded p-0.5">
            {timeOptions.map((option) => (
              <button
                key={option}
                onClick={() => onTimeHorizonChange(option)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all font-mono cursor-pointer ${
                  timeHorizon === option
                    ? option === 'Live'
                      ? 'bg-emerald-600 text-white font-semibold shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                      : 'bg-cyan-600 text-white font-semibold shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
                title={`Switch operational time horizon to ${option}`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Simulation Active Indicator Tag */}
          {timeHorizon !== 'Live' && (
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 font-mono text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="font-semibold">SIMULATION (+{timeHorizon})</span>
              <button
                onClick={() => onTimeHorizonChange('Live')}
                className="text-[10px] text-cyan-400 hover:text-white underline font-semibold ml-1 cursor-pointer"
                title="Reset to Live telemetry"
              >
                Reset
              </button>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="hidden md:block h-4 w-px bg-slate-800"></div>

        {/* GIS Layers Toggles */}
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-mono mr-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            LAYERS:
          </span>

          <button
            onClick={() => onToggleLayer('vessels')}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] border font-medium transition-all ${
              layers.vessels
                ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-300'
            }`}
            title="Toggle Fleet Vessel Tracking"
          >
            <Ship className="w-3 h-3" />
            Vessels
          </button>

          <button
            onClick={() => onToggleLayer('stations')}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] border font-medium transition-all ${
              layers.stations
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-300'
            }`}
            title="Toggle Antarctic Research Stations"
          >
            <MapPin className="w-3 h-3" />
            Stations
          </button>

          <button
            onClick={() => onToggleLayer('routes')}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] border font-medium transition-all ${
              layers.routes
                ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-300'
            }`}
            title="Toggle Shipping Routes & Corridors"
          >
            <Compass className="w-3 h-3" />
            Routes
          </button>

          <button
            onClick={() => onToggleLayer('seaIce')}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] border font-medium transition-all ${
              layers.seaIce
                ? 'bg-sky-500/20 border-sky-500/50 text-sky-300'
                : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-300'
            }`}
            title="Toggle Sea-Ice Concentration & Hazard Zones"
          >
            <Snowflake className="w-3 h-3" />
            Sea Ice
          </button>

          <button
            onClick={() => onToggleLayer('weather')}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] border font-medium transition-all ${
              layers.weather
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-300'
            }`}
            title="Toggle Synoptic Weather & Blizzard Zones"
          >
            <Wind className="w-3 h-3" />
            Weather
          </button>

          <button
            onClick={() => onToggleLayer('satellite')}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] border font-medium transition-all ${
              layers.satellite
                ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-300'
            }`}
            title="Toggle Satellite SAR & Optical Swaths"
          >
            <Satellite className="w-3 h-3" />
            Satellites
          </button>

          <button
            onClick={() => onToggleLayer('sar')}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] border font-medium transition-all ${
              layers.sar
                ? 'bg-red-500/20 border-red-500/50 text-red-300'
                : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-300'
            }`}
            title="Toggle Search & Rescue (SAR) Grid"
          >
            <LifeBuoy className="w-3 h-3" />
            SAR
          </button>

          <button
            onClick={() => onToggleLayer('riskZones')}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] border font-medium transition-all ${
              layers.riskZones
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-300'
            }`}
            title="Toggle Geofenced Risk Zones"
          >
            <AlertTriangle className="w-3 h-3" />
            Risk Zones
          </button>
        </div>
      </div>
    </div>
  );
}
