"use client";

import React from 'react';
import {
  X,
  Ship,
  Navigation,
  Compass,
  Clock,
  AlertTriangle,
  Wind,
  Snowflake,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Info,
  CheckCircle2,
  FileText,
  Send,
  Fuel,
  Users,
  Anchor
} from 'lucide-react';
import { Vessel, UserRole } from '@/types/command-center';

interface VesselDrawerProps {
  vessel: Vessel | null;
  onClose: () => void;
  onOpenExplainability: (vessel: Vessel) => void;
  onOpenApproval: (vessel: Vessel) => void;
  currentUserRole: UserRole;
}

export function VesselDrawer({
  vessel,
  onClose,
  onOpenExplainability,
  onOpenApproval,
  currentUserRole,
}: VesselDrawerProps) {
  if (!vessel) return null;

  const isDelayed = vessel.expected_delay_hours > 2;

  return (
    <div className="w-full sm:w-[420px] lg:w-[460px] bg-white dark:bg-[#0b1329] border-l border-slate-200 dark:border-slate-800 flex flex-col h-full overflow-hidden shadow-2xl z-30 select-none animate-in slide-in-from-right duration-200">
      {/* 1. Vessel Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070d1e] shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center">
              <Ship className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{vessel.name}</h2>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                    vessel.status === 'NORMAL'
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                      : vessel.status === 'ATTENTION'
                      ? 'bg-yellow-500/15 border-yellow-500/30 text-yellow-400'
                      : vessel.status === 'DELAYED'
                      ? 'bg-orange-500/15 border-orange-500/30 text-orange-400'
                      : vessel.status === 'CRITICAL'
                      ? 'bg-red-500/15 border-red-500/30 text-red-400'
                      : 'bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {vessel.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                IMO: {vessel.imo} • {vessel.vessel_type} • {vessel.ice_class}
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

        {/* Telemetry Freshness Indicator */}
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800/80 text-[11px] font-mono">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                vessel.telemetry_freshness === 'FRESH'
                  ? 'bg-emerald-400 animate-pulse'
                  : 'bg-amber-400'
              }`}
            ></span>
            AIS Position: <span className="text-slate-200">{vessel.telemetry_freshness}</span>
          </span>
          <span className="text-slate-500">Updated {vessel.last_position_update.substring(11, 19)} UTC</span>
        </div>
      </div>

      {/* Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* 2. Current Telemetry & Operational State */}
        <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
            Current Status & Position
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-mono">Speed</span>
              <p className="font-bold text-sm font-mono text-slate-100">{vessel.speed_knots} knots</p>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Design: {vessel.design_speed_knots} kt</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-mono">Heading</span>
              <p className="font-bold text-sm font-mono text-slate-100">{vessel.heading_degrees}°</p>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Navigational Course</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-mono">Coordinates</span>
              <p className="font-bold text-xs font-mono text-cyan-400">
                {Math.abs(vessel.current_lat)}°S, {Math.abs(vessel.current_lon)}°{vessel.current_lon >= 0 ? 'E' : 'W'}
              </p>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-mono">Destination</span>
              <p className="font-bold text-xs text-slate-100 truncate">{vessel.destination}</p>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">From: {vessel.origin}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 dark:text-slate-400">Operational State:</span>
            <span className="font-semibold text-slate-200">{vessel.operational_state}</span>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Fuel className="w-3.5 h-3.5 text-amber-400" /> Fuel Remaining:
            </span>
            <span className="font-mono font-bold text-slate-200">{vessel.fuel_remaining_pct}%</span>
          </div>
        </div>

        {/* 3. ETA & AI Prediction Section */}
        <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              ETA & Delay Analytics
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30">
              Confidence: {Math.round(vessel.risk_confidence * 100)}%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950/60 p-2.5 rounded border border-slate-200 dark:border-slate-800/80 font-mono">
            <div>
              <span className="text-slate-500 text-[10px]">Original ETA</span>
              <p className="text-slate-700 dark:text-slate-300 font-semibold">{vessel.original_eta.replace('T', ' ').substring(0, 16)}</p>
            </div>
            <div>
              <span className="text-slate-500 text-[10px]">Provider ETA</span>
              <p className="text-slate-700 dark:text-slate-300 font-semibold">{vessel.provider_eta.replace('T', ' ').substring(0, 16)}</p>
            </div>
            <div className="col-span-2 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-baseline justify-between">
              <div>
                <span className="text-blue-400 text-[10px] font-bold">AI PREDICTED ETA</span>
                <p className="text-cyan-300 font-bold text-xs">{vessel.ai_predicted_eta.replace('T', ' ').substring(0, 16)}</p>
              </div>
              <div className="text-right">
                <span className="text-slate-500 text-[10px]">Expected Delay</span>
                <p className={`font-bold text-xs ${isDelayed ? 'text-amber-400' : 'text-emerald-400'}`}>
                  +{vessel.expected_delay_hours} hours
                </p>
              </div>
            </div>
          </div>

          {/* Contributing Factors */}
          {vessel.factors && vessel.factors.length > 0 && (
            <div>
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1.5 flex items-center justify-between">
                <span>Delay Contributing Factors:</span>
                <span className="text-[10px] text-slate-500 font-mono">{vessel.model_version}</span>
              </div>
              <div className="space-y-1.5">
                {vessel.factors.map((f, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px] bg-slate-950/40 px-2 py-1 rounded">
                    <span className="text-slate-700 dark:text-slate-300">{f.name || f.factor}</span>
                    <span className="font-mono font-semibold text-amber-400">{f.impact}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Explainability Button */}
          <button
            onClick={() => onOpenExplainability(vessel)}
            className="w-full py-1.5 rounded bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-300 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
            Why this prediction? (SHAP Analysis)
          </button>
        </div>

        {/* 4. Risk Assessment */}
        <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              Operational Risk Assessment
            </span>
            <span
              className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] ${
                vessel.risk_level === 'HIGH'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : vessel.risk_level === 'MEDIUM'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {vessel.risk_level} RISK
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Risk Trend:</span>
            <span
              className={`font-semibold flex items-center gap-1 ${
                vessel.risk_trend === 'Worsening'
                  ? 'text-rose-400'
                  : vessel.risk_trend === 'Improving'
                  ? 'text-emerald-400'
                  : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              {vessel.risk_trend === 'Worsening' && <TrendingUp className="w-3.5 h-3.5" />}
              {vessel.risk_trend === 'Improving' && <TrendingDown className="w-3.5 h-3.5" />}
              {vessel.risk_trend}
            </span>
          </div>

          <div className="text-[11px] text-slate-700 dark:text-slate-300 bg-slate-950/50 p-2 rounded border border-slate-200 dark:border-slate-800/80">
            <div className="font-semibold text-slate-200 mb-1">Key Risk Factors:</div>
            <ul className="list-disc list-inside space-y-0.5 text-slate-500 dark:text-slate-400">
              <li>Heavy convergent pack ice in Weddell Corridor</li>
              <li>Sustained headwind gale shear (34-45 kt)</li>
              <li>Station resupply time degradation (+26h)</li>
            </ul>
          </div>
        </div>

        {/* 5. Local Weather at Vessel Position */}
        {vessel.weather_at_pos && (
          <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              Local Weather at Position
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="bg-slate-950/40 p-2 rounded">
                <span className="text-slate-500 text-[10px]">Temperature</span>
                <p className="font-bold text-slate-200">{vessel.weather_at_pos.temperature_c}°C</p>
              </div>
              <div className="bg-slate-950/40 p-2 rounded">
                <span className="text-slate-500 text-[10px]">Wind Speed</span>
                <p className="font-bold text-slate-200">{vessel.weather_at_pos.wind_speed_knots} kt ({vessel.weather_at_pos.wind_direction})</p>
              </div>
              <div className="bg-slate-950/40 p-2 rounded">
                <span className="text-slate-500 text-[10px]">Visibility</span>
                <p className="font-bold text-slate-200">{vessel.weather_at_pos.visibility_km} km</p>
              </div>
              <div className="bg-slate-950/40 p-2 rounded">
                <span className="text-slate-500 text-[10px]">Wave Height</span>
                <p className="font-bold text-slate-200">{vessel.weather_at_pos.wave_height_m} m</p>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 italic">{vessel.weather_at_pos.sea_state}</p>
          </div>
        )}

        {/* 6. Human-in-the-Loop Recommendation & Action */}
        <div className="p-3.5 rounded-lg bg-blue-950/30 border border-blue-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-blue-300 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
              AI Advisory Recommendation
            </span>
            <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/30">
              HITL REQUIRED
            </span>
          </div>

          <div className="text-[11px] text-slate-700 dark:text-slate-300 space-y-1">
            <p className="font-semibold text-slate-100">
              {vessel.name} may experience +{vessel.expected_delay_hours}h delay.
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              {vessel.delay_reason}. Suggested action: Review and dispatch Alternate Route B via Sector 4 open lead.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => onOpenExplainability(vessel)}
              className="flex-1 py-2 px-3 rounded bg-slate-900 hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
            >
              View Analysis
            </button>
            <button
              onClick={() => onOpenApproval(vessel)}
              className="flex-1 py-2 px-3 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Approve Action
            </button>
          </div>
          <p className="text-[10px] text-slate-500 text-center font-mono">
            Safety-critical decisions require authorized human signature ({currentUserRole}).
          </p>
        </div>
      </div>
    </div>
  );
}
