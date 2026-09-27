"use client"

import React, { useState } from 'react';
import { Expedition } from '@/types/expedition';
import Link from 'next/link';
import { Calendar, ChevronLeft, ChevronRight, AlertTriangle, Ship, Plane } from 'lucide-react';

interface ExpeditionCalendarViewProps {
  expeditions: Expedition[];
}

export function ExpeditionCalendarView({ expeditions }: ExpeditionCalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState('October 2026');

  const events = [
    { date: 1, expId: 'EXP-2026-A', title: 'Lyttelton Departure', type: 'departure', status: 'COMPLETED' },
    { date: 5, expId: 'EXP-2026-D', title: 'Stanley Falklands Departure', type: 'departure', status: 'COMPLETED' },
    { date: 9, expId: 'EXP-2026-C', title: 'Deep Core Drilling Commenced', type: 'operation', status: 'COMPLETED' },
    { date: 12, expId: 'EXP-2026-C', title: 'BLIZZARD RED ALERT HALT', type: 'hazard', status: 'BLOCKED' },
    { date: 14, expId: 'EXP-2026-A', title: 'Winter Quarters Bay Lead Entry', type: 'waypoint', status: 'ACTIVE' },
    { date: 16, expId: 'EXP-2026-A', title: 'McMurdo Fuel Discharge Commences', type: 'resupply', status: 'UPCOMING' },
    { date: 22, expId: 'EXP-2026-C', title: 'Projected Storm Clearance Window', type: 'weather', status: 'UPCOMING' },
    { date: 25, expId: 'EXP-2026-E', title: 'Traverse Sled Fuel Bladder Lashing', type: 'logistics', status: 'UPCOMING' },
    { date: 30, expId: 'EXP-2026-F', title: 'Commander Final Plan Review Sign-off', type: 'approval', status: 'UPCOMING' }
  ];

  // 31 days in October
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="bg-[#0b1329] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xl mb-6">
      {/* Calendar Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">{currentMonth} - Operational Schedule</h3>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono text-slate-700 dark:text-slate-300 px-2 font-bold">{currentMonth}</span>
          <button className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Header */}
      <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-950/70 text-center py-2 text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
        <div>SUN</div>
        <div>MON</div>
        <div>TUE</div>
        <div>WED</div>
        <div>THU</div>
        <div>FRI</div>
        <div>SAT</div>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 divide-x divide-y divide-slate-200 dark:divide-slate-800/80">
        {/* Empty padding days for Thursday start (Oct 1 2026 is Thursday = 4 offset) */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={`empty-${i}`} className="min-h-[90px] bg-slate-950/30 p-1.5" />
        ))}

        {days.map(d => {
          const dayEvents = events.filter(e => e.date === d);
          const isToday = d === 14;

          return (
            <div
              key={`day-${d}`}
              className={`min-h-[95px] p-2 transition-colors flex flex-col justify-between ${
                isToday ? 'bg-blue-950/20 ring-1 ring-blue-500/50' : 'hover:bg-slate-900/30'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={`text-xs font-mono font-bold ${isToday ? 'text-blue-400 font-extrabold' : 'text-slate-500 dark:text-slate-400'}`}>
                  {d}
                </span>
                {isToday && (
                  <span className="text-[9px] uppercase font-bold text-blue-300 bg-blue-900/50 px-1 rounded">
                    TODAY
                  </span>
                )}
              </div>

              <div className="space-y-1">
                {dayEvents.map((ev, idx) => (
                  <Link
                    key={idx}
                    href={`/expeditions/${ev.expId}`}
                    className={`block text-[10px] p-1 rounded font-semibold truncate transition-colors ${
                      ev.status === 'BLOCKED'
                        ? 'bg-rose-950/60 border border-rose-800 text-rose-300 hover:bg-rose-900/80'
                        : ev.status === 'ACTIVE'
                        ? 'bg-blue-950/60 border border-blue-800 text-blue-300 hover:bg-blue-900/80'
                        : 'bg-slate-800/70 text-slate-700 dark:text-slate-300 hover:bg-slate-700/80'
                    }`}
                    title={`${ev.expId}: ${ev.title}`}
                  >
                    <strong>{ev.expId.slice(-1)}:</strong> {ev.title}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
