"use client"

import React from 'react';
import { ExpeditionKPIs } from '@/types/expedition';
import { 
  Activity, 
  Clock, 
  AlertTriangle, 
  Ban, 
  Users, 
  Ship, 
  Compass, 
  CalendarClock 
} from 'lucide-react';

interface ExpeditionKPIsProps {
  kpis: ExpeditionKPIs;
  selectedFilter: string | null;
  onSelectFilter: (filterKey: string) => void;
}

export function ExpeditionKPIsView({ kpis, selectedFilter, onSelectFilter }: ExpeditionKPIsProps) {
  const cards = [
    {
      key: 'ACTIVE',
      label: 'ACTIVE EXPEDITIONS',
      value: kpis.active_expeditions,
      sublabel: 'Currently operating in polar field',
      icon: Activity,
      color: 'text-blue-400',
      borderColor: 'border-blue-500/30',
      bgColor: 'bg-blue-950/20'
    },
    {
      key: 'PLANNING',
      label: 'PLANNING',
      value: kpis.planning,
      sublabel: 'Missions in preparation',
      icon: Clock,
      color: 'text-slate-700 dark:text-slate-300',
      borderColor: 'border-slate-700/50',
      bgColor: 'bg-white dark:bg-slate-900/40'
    },
    {
      key: 'HIGH_RISK',
      label: 'HIGH-RISK MISSIONS',
      value: kpis.high_risk_missions,
      sublabel: 'Attention / escalation required',
      icon: AlertTriangle,
      color: 'text-amber-400',
      borderColor: 'border-amber-500/30',
      bgColor: 'bg-amber-950/20'
    },
    {
      key: 'BLOCKED',
      label: 'BLOCKED MISSIONS',
      value: kpis.blocked_missions,
      sublabel: 'Weather / ice / logistics stalled',
      icon: Ban,
      color: 'text-rose-400',
      borderColor: 'border-rose-500/40',
      bgColor: 'bg-rose-950/25'
    },
    {
      key: 'PERSONNEL',
      label: 'PERSONNEL DEPLOYED',
      value: kpis.personnel_deployed,
      sublabel: 'Scientists, crew & operators',
      icon: Users,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      bgColor: 'bg-emerald-950/20'
    },
    {
      key: 'ASSETS',
      label: 'ACTIVE ASSETS',
      value: kpis.active_assets,
      sublabel: 'Ships + aircraft + field rigs',
      icon: Ship,
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/30',
      bgColor: 'bg-cyan-950/20'
    },
    {
      key: 'SEASON',
      label: 'MISSIONS THIS SEASON',
      value: kpis.missions_this_season,
      sublabel: 'Season 2026-2027 total',
      icon: Compass,
      color: 'text-purple-400',
      borderColor: 'border-purple-500/30',
      bgColor: 'bg-purple-950/20'
    },
    {
      key: 'UPCOMING',
      label: 'UPCOMING DEPARTURES',
      value: kpis.upcoming_departures,
      sublabel: 'Departing next 30 days',
      icon: CalendarClock,
      color: 'text-indigo-400',
      borderColor: 'border-indigo-500/30',
      bgColor: 'bg-indigo-950/20'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3 mb-6">
      {cards.map((c) => {
        const Icon = c.icon;
        const isSelected = selectedFilter === c.key;
        return (
          <button
            key={c.key}
            onClick={() => onSelectFilter(isSelected ? '' : c.key)}
            className={`flex flex-col text-left p-3 rounded-lg border transition-all duration-150 relative group ${c.bgColor} ${
              isSelected 
                ? 'border-blue-400 ring-2 ring-blue-500/40 shadow-lg shadow-blue-950/50' 
                : `${c.borderColor} hover:border-slate-600 hover:bg-white dark:bg-slate-900/60`
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase truncate">
                {c.label}
              </span>
              <Icon className={`w-3.5 h-3.5 ${c.color} shrink-0 opacity-80 group-hover:opacity-100`} />
            </div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className={`text-2xl font-black tracking-tight ${c.color}`}>
                {c.value}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-1 truncate">
              {c.sublabel}
            </span>
          </button>
        );
      })}
    </div>
  );
}
