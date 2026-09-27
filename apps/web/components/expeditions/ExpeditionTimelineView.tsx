"use client"

import React from 'react';
import { Expedition } from '@/types/expedition';
import Link from 'next/link';
import { Clock, Calendar, AlertTriangle, ChevronRight, CheckCircle2 } from 'lucide-react';

interface ExpeditionTimelineViewProps {
  expeditions: Expedition[];
}

export function ExpeditionTimelineView({ expeditions }: ExpeditionTimelineViewProps) {
  // Operational months for Season 2026-2027
  const months = ['Sep 2026', 'Oct 2026', 'Nov 2026', 'Dec 2026', 'Jan 2027', 'Feb 2027'];

  return (
    <div className="bg-[#0b1329] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xl mb-6">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            Polar Operations Strategic Gantt Timeline
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Operational and weather windows across Season 2026-2027 deployments
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <span className="w-3 h-3 rounded bg-blue-600" />
            <span>In Progress</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <span className="w-3 h-3 rounded bg-rose-600" />
            <span>Blocked</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <span className="w-3 h-3 rounded bg-slate-700" />
            <span>Planned</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <span className="w-3 h-3 rounded bg-emerald-600" />
            <span>Completed</span>
          </div>
        </div>
      </div>

      {/* Gantt Header Columns */}
      <div className="grid grid-cols-12 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 py-2.5 px-4">
        <div className="col-span-4">EXPEDITION / MISSION</div>
        <div className="col-span-8 grid grid-cols-6 text-center border-l border-slate-200 dark:border-slate-800 pl-2">
          {months.map(m => (
            <div key={m} className="truncate border-r border-slate-200 dark:border-slate-800/40 last:border-r-0">
              {m}
            </div>
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-slate-200 dark:divide-slate-800/60">
        {expeditions.map(exp => {
          const isBlocked = exp.status.includes('BLOCKED');
          const isProgress = exp.status === 'OPERATIONAL' || exp.status_display.includes('PROGRESS');

          return (
            <div
              key={exp.id}
              className="grid grid-cols-12 items-center px-4 py-3.5 hover:bg-white dark:bg-slate-900/40 transition-colors"
            >
              {/* Mission Label */}
              <div className="col-span-4 pr-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-blue-400 font-bold bg-blue-950 px-1.5 py-0.5 rounded border border-blue-900/50">
                    {exp.id}
                  </span>
                  <Link
                    href={`/expeditions/${exp.id}`}
                    className="font-bold text-sm text-slate-900 dark:text-white hover:text-blue-400 transition-colors truncate"
                  >
                    {exp.name}
                  </Link>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                  <span>{exp.vessel_name || exp.ships?.[0] || 'Overland Fleet'}</span>
                  <span>·</span>
                  <span>{exp.lead}</span>
                  {exp.delay_hours > 0 && (
                    <span className="text-rose-400 font-mono font-bold">+{exp.delay_hours}h</span>
                  )}
                </div>
              </div>

              {/* Gantt Bar Visualization */}
              <div className="col-span-8 relative border-l border-slate-200 dark:border-slate-800 pl-2 py-1">
                {/* Background gridlines */}
                <div className="absolute inset-0 grid grid-cols-6 pointer-events-none">
                  {months.map((_, i) => (
                    <div key={i} className="border-r border-slate-200 dark:border-slate-800/40 last:border-r-0 h-full" />
                  ))}
                </div>

                {/* Simulated bar positioning based on dates */}
                <div className="relative z-10">
                  <div
                    className={`h-7 rounded-md p-1.5 flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-white shadow-md transition-all ${
                      isBlocked
                        ? 'bg-rose-600/80 border border-rose-400'
                        : isProgress
                        ? 'bg-blue-600/80 border border-blue-400'
                        : exp.status === 'APPROVED'
                        ? 'bg-emerald-600/80 border border-emerald-400'
                        : 'bg-slate-700/80 border border-slate-600'
                    }`}
                    style={{
                      marginLeft: exp.id === 'EXP-2026-A' ? '14%' : exp.id === 'EXP-2026-B' ? '32%' : exp.id === 'EXP-2026-C' ? '5%' : exp.id === 'EXP-2026-D' ? '18%' : exp.id === 'EXP-2026-E' ? '28%' : '48%',
                      width: exp.id === 'EXP-2026-A' ? '42%' : exp.id === 'EXP-2026-B' ? '34%' : exp.id === 'EXP-2026-C' ? '38%' : exp.id === 'EXP-2026-D' ? '46%' : exp.id === 'EXP-2026-E' ? '30%' : '38%'
                    }}
                  >
                    <span className="truncate text-[11px] pl-1">{exp.current_phase || exp.status_display}</span>
                    <span className="font-mono text-[10px] bg-black/30 px-1.5 py-0.5 rounded shrink-0">
                      {exp.progress}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
