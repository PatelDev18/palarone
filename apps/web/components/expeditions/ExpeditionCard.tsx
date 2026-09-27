"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { Expedition } from '@/types/expedition';
import { 
  Users, 
  Ship, 
  Clock, 
  AlertTriangle, 
  MapPin, 
  CloudSnow, 
  Compass, 
  Layers, 
  Radio, 
  CheckCircle2, 
  Ban, 
  ChevronRight, 
  Play, 
  Pause, 
  Sparkles, 
  MoreVertical 
} from 'lucide-react';

interface ExpeditionCardProps {
  expedition: Expedition;
  onTrackLive?: (exp: Expedition) => void;
  onOpenScenario?: (exp: Expedition) => void;
  onPauseResume?: (exp: Expedition) => void;
}

export function ExpeditionCard({
  expedition: exp,
  onTrackLive,
  onOpenScenario,
  onPauseResume
}: ExpeditionCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  // Status color mapper
  const getStatusBadge = () => {
    const s = (exp.status_display || exp.status).toUpperCase();
    if (s.includes('BLOCKED')) {
      return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    }
    if (s.includes('PROGRESS') || s.includes('OPERATIONAL')) {
      return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    }
    if (s.includes('PLANNING')) {
      return 'bg-slate-700/50 text-slate-700 dark:text-slate-300 border-slate-600/50';
    }
    if (s.includes('APPROVED')) {
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
    if (s.includes('SUSPENDED')) {
      return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }
    return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
  };

  const getRiskBadge = () => {
    switch (exp.risk_level) {
      case 'CRITICAL':
        return 'text-rose-400 bg-rose-950/40 border-rose-500/30';
      case 'HIGH':
        return 'text-amber-400 bg-amber-950/40 border-amber-500/30';
      case 'MEDIUM':
        return 'text-yellow-400 bg-yellow-950/40 border-yellow-500/30';
      default:
        return 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30';
    }
  };

  const isBlocked = exp.status.includes('BLOCKED') || exp.status_display.includes('BLOCKED');
  const isSuspended = exp.status === 'SUSPENDED';

  return (
    <div className="bg-[#0b1329] border border-slate-200 dark:border-slate-800 hover:border-slate-700 rounded-xl shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden relative group">
      {/* Top Banner Stripe */}
      <div className={`h-1.5 w-full ${isBlocked ? 'bg-rose-500' : isSuspended ? 'bg-amber-500' : exp.progress > 50 ? 'bg-blue-500' : 'bg-slate-700'}`} />

      {/* Card Header */}
      <div className="p-5 pb-3">
        <div className="flex justify-between items-start gap-2 mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950/50 px-2 py-0.5 rounded border border-blue-900/60">
                {exp.id}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-[160px]">
                {exp.mission_type}
              </span>
            </div>
            <Link href={`/expeditions/${exp.id}`}>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white hover:text-blue-400 transition-colors cursor-pointer leading-snug">
                {exp.name}
              </h3>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Lead: <strong className="text-slate-800 dark:text-slate-200">{exp.lead}</strong>
            </p>
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span className={`text-[10px] px-2.5 py-1 rounded-md font-extrabold uppercase tracking-wider border ${getStatusBadge()}`}>
              {exp.status_display || exp.status}
            </span>
            <div className={`text-[10px] px-2 py-0.5 rounded border font-semibold flex items-center gap-1 ${getRiskBadge()}`}>
              <AlertTriangle className="w-3 h-3" />
              <span>{exp.risk_level} ({Math.round(exp.risk_score)}/100)</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 bg-white dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/80">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Mission Progress</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">{exp.progress}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isBlocked ? 'bg-rose-500' : 'bg-gradient-to-r from-blue-600 to-cyan-400'
              }`}
              style={{ width: `${Math.max(2, exp.progress)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 truncate">
            <span>Phase: <strong className="text-slate-700 dark:text-slate-300">{exp.current_phase || 'Nominal Operations'}</strong></span>
            {exp.delay_hours > 0 ? (
              <span className="text-rose-400 font-semibold font-mono">+{exp.delay_hours}h delay</span>
            ) : (
              <span className="text-emerald-400 font-semibold">On Schedule</span>
            )}
          </div>
        </div>
      </div>

      {/* Middle Specs Grid */}
      <div className="px-5 py-2.5 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-2 gap-3 text-xs">
        {/* Personnel & Assets */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Users className="w-4 h-4 text-blue-400 shrink-0" />
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">{exp.crew_count} Personnel</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                {exp.personnel?.deployed ?? 0} Deployed · {exp.personnel?.assigned ?? exp.crew_count} Assigned
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Ship className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="truncate">
              <div className="font-semibold text-slate-900 dark:text-white truncate" title={exp.vessel_name || exp.ships?.join(', ')}>
                {exp.vessel_name || exp.ships?.[0] || 'Overland Fleet'}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {exp.aircraft?.length ? `+${exp.aircraft.length} Aircraft` : 'No air assets'}
              </div>
            </div>
          </div>
        </div>

        {/* Location & Dates */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
            <div className="truncate">
              <div className="font-semibold text-slate-900 dark:text-white truncate" title={exp.current_region}>
                {exp.current_region}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                {exp.current_lat && exp.current_lon ? `${exp.current_lat.toFixed(2)}°S, ${exp.current_lon.toFixed(2)}°E` : 'Awaiting coordinates'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">
                {exp.planned_start ? new Date(exp.planned_start).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'TBD'} - {exp.planned_end ? new Date(exp.planned_end).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'TBD'}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                ETA: {exp.expected_completion ? new Date(exp.expected_completion).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit' }) : 'On schedule'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Environmental & Logistics Strip */}
      <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800/80 text-[11px] grid grid-cols-3 gap-2 text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5 truncate">
          <CloudSnow className={`w-3.5 h-3.5 shrink-0 ${exp.weather?.storm_warning ? 'text-rose-400 animate-pulse' : 'text-slate-500 dark:text-slate-400'}`} />
          <span className="truncate">
            {exp.weather?.temperature_c != null ? `${exp.weather.temperature_c}°C, ${exp.weather.wind_speed_kt}kt` : 'Weather unavailable'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 truncate">
          <Compass className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="truncate">
            Ice: {exp.sea_ice?.concentration_pct != null ? `${exp.sea_ice.concentration_pct}% (${exp.sea_ice.ice_class?.slice(0, 10)}...)` : 'Open'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 truncate">
          <Layers className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate">
            Cargo: {exp.logistics?.cargo_readiness != null ? `${exp.logistics.cargo_readiness}% ready` : 'Awaiting data'}
          </span>
        </div>
      </div>

      {/* Warning/Delay Reason callout if present */}
      {isBlocked && (
        <div className="px-5 py-2 bg-rose-950/30 border-t border-rose-900/40 text-[11px] text-rose-300 flex items-start gap-2">
          <Ban className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
          <span className="line-clamp-2">
            <strong>BLOCKED:</strong> {exp.delay_reason || 'Severe weather or sea-ice obstruction.'}
          </span>
        </div>
      )}

      {/* Card Actions Footer */}
      <div className="p-3.5 bg-[#070d1e] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-1">
          <Link
            href={`/expeditions/${exp.id}`}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-1.5 px-3 rounded text-center transition-colors shadow-sm flex items-center justify-center gap-1"
          >
            <span>VIEW EXPEDITION</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href={`/expeditions/${exp.id}?tab=map`}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold py-1.5 px-3 rounded transition-colors flex items-center gap-1"
          >
            <Radio className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">TRACK LIVE</span>
          </Link>
        </div>

        {/* More Actions Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-800 rounded transition-colors"
            title="More actions"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div
              className="absolute right-0 bottom-full mb-1 w-48 bg-[#0f172a] border border-slate-700 rounded-lg shadow-2xl p-1 z-50 text-xs flex flex-col gap-0.5"
              onMouseLeave={() => setShowMenu(false)}
            >
              <Link
                href={`/expeditions/${exp.id}?tab=plan`}
                className="px-3 py-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-800 rounded hover:text-slate-900 dark:text-white transition-colors"
              >
                Mission Plan
              </Link>
              <button
                onClick={() => {
                  setShowMenu(false);
                  onOpenScenario?.(exp);
                }}
                className="w-full text-left px-3 py-1.5 text-purple-400 hover:bg-purple-950/40 rounded transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                What-if Analysis
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  onPauseResume?.(exp);
                }}
                className={`w-full text-left px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                  isSuspended ? 'text-emerald-400 hover:bg-emerald-950/40' : 'text-amber-400 hover:bg-amber-950/40'
                }`}
              >
                {isSuspended ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                {isSuspended ? 'Resume Operations' : 'Pause Mission'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
