"use client"

import React from 'react';
import { Expedition } from '@/types/expedition';
import Link from 'next/link';
import { Flag, CheckCircle2, Clock, AlertTriangle, ArrowRight } from 'lucide-react';

interface UpcomingMilestonesPanelProps {
  expeditions: Expedition[];
}

export function UpcomingMilestonesPanel({ expeditions }: UpcomingMilestonesPanelProps) {
  // Extract upcoming objectives and waypoints
  const milestones: {
    expId: string;
    expName: string;
    title: string;
    date: string;
    owner: string;
    priority: string;
    status: string;
  }[] = [];

  expeditions.forEach(e => {
    e.objectives?.forEach(obj => {
      if (obj.status !== 'COMPLETED') {
        milestones.push({
          expId: e.id,
          expName: e.name,
          title: obj.title,
          date: obj.deadline,
          owner: obj.owner,
          priority: obj.priority,
          status: obj.status
        });
      }
    });
  });

  const sorted = milestones.slice(0, 5);

  return (
    <div className="bg-[#0b1329] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
          <div className="flex items-center gap-2">
            <Flag className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Upcoming Mission Milestones
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">Next 30 Days</span>
        </div>

        <div className="space-y-2.5">
          {sorted.map((m, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 rounded-lg p-2.5 hover:border-slate-700 transition-colors"
            >
              <div className="flex justify-between items-start gap-2">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-950 px-1.5 py-0.2 rounded border border-blue-900/50">
                      {m.expId}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">{m.date}</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                    {m.title}
                  </div>
                </div>

                <span
                  className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border shrink-0 ${
                    m.priority === 'CRITICAL'
                      ? 'bg-rose-950/40 text-rose-300 border-rose-800'
                      : m.priority === 'HIGH'
                      ? 'bg-amber-950/40 text-amber-300 border-amber-800'
                      : 'bg-blue-950/40 text-blue-300 border-blue-800'
                  }`}
                >
                  {m.priority}
                </span>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 mt-2 pt-1 border-t border-slate-200 dark:border-slate-800/60">
                <span>Owner: <strong className="text-slate-700 dark:text-slate-300">{m.owner}</strong></span>
                <span className="text-blue-400 font-mono">{m.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800/80 text-right">
        <Link
          href="/expeditions?view=timeline"
          className="text-xs text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1"
        >
          <span>View Master Timeline</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
