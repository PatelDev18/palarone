"use client"

import React, { useState } from 'react'
import { TimelineStep } from '@/types/intelligence'
import { 
  History, 
  Clock, 
  Calendar, 
  Snowflake, 
  Wind, 
  Ship, 
  ShieldAlert, 
  ChevronRight,
  Play,
  RotateCcw
} from 'lucide-react'

interface TimeMachineSectionProps {
  timeline: TimelineStep[];
}

export function TimeMachineSection({ timeline }: TimeMachineSectionProps) {
  const [selectedIdx, setSelectedIdx] = useState<number>(timeline.length - 1); // default to current
  const activeStep = timeline[selectedIdx] || timeline[0];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-500/10 rounded-md border border-blue-500/20 text-blue-400">
              <History className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Antarctic Intelligence Time Machine</h2>
            <span className="text-xs font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full font-bold">
              HISTORICAL 4-WEEK REPLAY
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Compare sea-ice pack dynamics, storm patterns, and vessel transit progressions across September 2026.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedIdx(0)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-white transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Start</span>
          </button>
        </div>
      </div>

      {/* Interactive Timeline Stepper */}
      <div className="bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-4 scrollbar-thin">
          {timeline.map((step, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <div
                key={step.date}
                onClick={() => setSelectedIdx(idx)}
                className={`flex-1 min-w-[170px] p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] ring-1 ring-blue-500/40'
                    : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono font-bold mb-1">
                  <span className={isSelected ? 'text-blue-400' : 'text-slate-500 dark:text-slate-400'}>{step.date}</span>
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-cyan-400 animate-ping' : 'bg-slate-700'}`}></span>
                </div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">{step.label.split('(')[1]?.replace(')', '') || step.label}</div>
                <div className="text-[10px] font-mono text-slate-500 mt-1">
                  Ice: <span className="text-cyan-400 font-bold">{step.ice_concentration_davis}%</span> | Risk: <span className="text-amber-400 font-bold">{step.route_risk_score}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Temporal State Snapshot */}
        {activeStep && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
                <Snowflake className="w-4 h-4 text-cyan-400" />
                <span>Prydz Bay Sea Ice</span>
              </div>
              <div className="text-2xl font-black font-mono text-cyan-400">
                {activeStep.ice_concentration_davis}% Pack
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Satellite Scenes: {activeStep.satellite_scenes_count}</div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
                <Wind className="w-4 h-4 text-amber-400" />
                <span>Weather Severity</span>
              </div>
              <div className="text-xl font-bold font-mono text-amber-300">
                {activeStep.weather_severity}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Active Alerts: {activeStep.critical_alerts} Critical</div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
                <Ship className="w-4 h-4 text-blue-400" />
                <span>Polar Star Speed</span>
              </div>
              <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                {activeStep.polar_star_speed} kt
              </div>
              <div className="text-[11px] text-slate-500 mt-1 font-mono">
                Coords: {activeStep.polar_star_lat}°S, {activeStep.polar_star_lon}°E
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Route Risk Score</span>
              </div>
              <div className="text-2xl font-black font-mono text-rose-400">
                {activeStep.route_risk_score} / 100
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Status: {activeStep.route_risk_score > 70 ? 'HIGH RISK' : 'STABLE TRANSIT'}
              </div>
            </div>
          </div>
        )}

        {/* Narrative Summary */}
        {activeStep && (
          <div className="mt-4 p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
            <strong className="text-slate-900 dark:text-white">Historical Situation Summary ({activeStep.date}):</strong> {activeStep.summary}
          </div>
        )}
      </div>
    </div>
  );
}
