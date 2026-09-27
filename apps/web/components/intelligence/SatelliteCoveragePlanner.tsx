"use client"

import React from 'react'
import { CoveragePass } from '@/types/intelligence'
import { 
  Satellite, 
  Calendar, 
  Clock, 
  ShieldAlert, 
  AlertCircle,
  Eye, 
  CheckCircle,
  Activity
} from 'lucide-react'

interface SatelliteCoveragePlannerProps {
  passes: CoveragePass[];
}

export function SatelliteCoveragePlanner({ passes }: SatelliteCoveragePlannerProps) {
  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'CRITICAL': return 'bg-red-500/20 text-red-300 border-red-500/40 font-bold';
      case 'HIGH': return 'bg-amber-500/20 text-amber-300 border-amber-500/30 font-semibold';
      case 'MEDIUM': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default: return 'bg-slate-800 text-slate-500 dark:text-slate-400';
    }
  };

  return (
    <div className="bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Satellite className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Satellite Constellation Coverage Planner</h3>
            <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full font-bold">
              ORBITAL PASS PREDICTION
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Upcoming satellite acquisition windows over Antarctic Areas of Interest (AOIs) based on Two-Line Element (TLE) orbital mechanics.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
          Revisit Cycle: <span className="text-slate-900 dark:text-white font-bold">~6 to 12 Hours</span>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-950 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase text-[10px]">
            <tr>
              <th className="p-3">Satellite / Sensor</th>
              <th className="p-3">Target AOI</th>
              <th className="p-3">Next Window (UTC)</th>
              <th className="p-3">Pass Duration</th>
              <th className="p-3">Priority</th>
              <th className="p-3">Cloud Risk</th>
              <th className="p-3">Est. Resolution</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
            {passes.map((pass, i) => (
              <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                <td className="p-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Satellite className="w-4 h-4 text-blue-400" />
                  <span>{pass.satellite}</span>
                </td>
                <td className="p-3 text-cyan-300 font-semibold">{pass.aoi}</td>
                <td className="p-3 font-mono text-slate-900 dark:text-white">{new Date(pass.next_window).toUTCString().replace('GMT', 'UTC')}</td>
                <td className="p-3 text-slate-500 dark:text-slate-400">{pass.window_duration_min} min</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] border ${getPriorityBadge(pass.priority)}`}>
                    {pass.priority}
                  </span>
                </td>
                <td className="p-3 text-amber-400">{pass.cloud_risk}</td>
                <td className="p-3 text-slate-900 dark:text-white font-bold">{pass.estimated_resolution}</td>
                <td className="p-3 text-emerald-400 font-bold">{pass.coverage_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
