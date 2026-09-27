"use client"

import React from 'react';
import { Expedition } from '@/types/expedition';
import Link from 'next/link';
import { AlertTriangle, CloudSnow, Compass, Fuel, WifiOff, ArrowRight } from 'lucide-react';

interface ActiveWarningsPanelProps {
  expeditions: Expedition[];
}

export function ActiveWarningsPanel({ expeditions }: ActiveWarningsPanelProps) {
  const warnings: {
    expId: string;
    expName: string;
    type: 'WEATHER' | 'ICE' | 'FUEL' | 'COMMS' | 'BLOCKED';
    title: string;
    detail: string;
    impact: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  }[] = [];

  expeditions.forEach(e => {
    // Weather warning
    if (e.weather?.storm_warning) {
      warnings.push({
        expId: e.id,
        expName: e.name,
        type: 'WEATHER',
        title: e.weather.warning_title || 'Severe Meteorological Advisory',
        detail: `${e.weather.condition} (${e.weather.wind_speed_kt}kt winds, gusts ${e.weather.wind_gust_kt || 45}kt)`,
        impact: e.weather.warning_impact || 'Aviation and outdoor operations restricted',
        severity: e.weather.wind_speed_kt > 50 ? 'CRITICAL' : 'HIGH'
      });
    }

    // Fuel warning
    if (e.logistics?.fuel_reserve_warning) {
      warnings.push({
        expId: e.id,
        expName: e.name,
        type: 'FUEL',
        title: 'CRITICAL FUEL RESERVE DEPLETION',
        detail: `Projected remaining fuel is ${e.logistics.fuel_projected_remaining_pct}% (<20% threshold)`,
        impact: 'Field generators running emergency duty cycles to prevent blackout',
        severity: 'CRITICAL'
      });
    }

    // Comms warning
    if (e.communication?.status === 'DEGRADED' || e.communication?.status === 'OFFLINE') {
      warnings.push({
        expId: e.id,
        expName: e.name,
        type: 'COMMS',
        title: `SATCOM STATUS: ${e.communication.status}`,
        detail: `Primary link degraded; bandwidth throttled to ${e.communication.bandwidth_kbps} kbps`,
        impact: 'Telemetry queue delayed; relying on HF radio backup',
        severity: 'HIGH'
      });
    }

    // Blocked warning
    if (e.status.includes('BLOCKED')) {
      warnings.push({
        expId: e.id,
        expName: e.name,
        type: 'BLOCKED',
        title: `MISSION BLOCKED (+${e.delay_hours}h delay)`,
        detail: e.delay_reason || 'Severe environmental hazard',
        impact: 'Contingency Plan B activated; Commander review required',
        severity: 'CRITICAL'
      });
    }
  });

  return (
    <div className="bg-[#0b1329] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Active Operational Warnings
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold bg-rose-950/60 text-rose-300 border border-rose-800 px-2 py-0.5 rounded">
            {warnings.length} ESCALATED
          </span>
        </div>

        <div className="space-y-2.5">
          {warnings.slice(0, 4).map((w, idx) => (
            <Link
              key={idx}
              href={`/expeditions/${w.expId}`}
              className={`block rounded-lg p-2.5 border transition-all ${
                w.severity === 'CRITICAL'
                  ? 'bg-rose-950/30 border-rose-900/60 hover:bg-rose-950/50'
                  : 'bg-amber-950/20 border-amber-900/50 hover:bg-amber-950/40'
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-1.5">
                  {w.type === 'WEATHER' && <CloudSnow className="w-4 h-4 text-rose-400 shrink-0" />}
                  {w.type === 'FUEL' && <Fuel className="w-4 h-4 text-amber-400 shrink-0" />}
                  {w.type === 'COMMS' && <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />}
                  {w.type === 'BLOCKED' && <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}

                  <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {w.title}
                  </span>
                </div>

                <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-950 px-1.5 py-0.5 rounded border border-blue-900/40 shrink-0">
                  {w.expId}
                </span>
              </div>

              <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-1.5">
                {w.detail}
              </p>

              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between border-t border-slate-200 dark:border-slate-800/40 pt-1">
                <span className="truncate">Impact: {w.impact}</span>
                <span className="text-rose-400 font-bold ml-2 shrink-0">{w.severity}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800/80 text-right">
        <span className="text-[11px] text-slate-500 font-mono">
          Auto-triaged by PolarOne Risk Engine
        </span>
      </div>
    </div>
  );
}
