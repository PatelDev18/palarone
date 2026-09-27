"use client"

import React from 'react'
import { 
  AlertOctagon, 
  Flame, 
  CheckCircle2, 
  LifeBuoy, 
  History, 
  Timer, 
  Satellite, 
  Cpu, 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus 
} from 'lucide-react'
import { ResponseOverviewKPIs } from '@/types/emergency'

interface ResponseKPICardsProps {
  kpis: ResponseOverviewKPIs;
  onFilterClick?: (filterType: string) => void;
}

export function ResponseKPICards({ kpis, onFilterClick }: ResponseKPICardsProps) {
  const cards = [
    {
      id: 'active_incidents',
      title: 'ACTIVE INCIDENTS',
      value: kpis.active_incidents,
      unit: '',
      status: kpis.active_incidents > 0 ? 'CRITICAL' : 'NOMINAL',
      trend: '+1 since 06:00',
      trendDirection: 'up',
      icon: AlertOctagon,
      iconColor: 'text-red-400',
      bgColor: 'bg-red-950/20 border-red-800/40',
      accentColor: 'text-red-400',
      tooltip: 'Live unresolved maritime, station, or field distress incidents.'
    },
    {
      id: 'critical_incidents',
      title: 'CRITICAL SEVERITY',
      value: kpis.critical_incidents,
      unit: '',
      status: kpis.critical_incidents > 0 ? 'ACTION REQ' : 'SAFE',
      trend: '1 vessel impeded',
      trendDirection: 'neutral',
      icon: Flame,
      iconColor: 'text-rose-400',
      bgColor: 'bg-rose-950/20 border-rose-800/40',
      accentColor: 'text-rose-400',
      tooltip: 'Incidents requiring immediate Commander diversion or evacuation.'
    },
    {
      id: 'pending_approvals',
      title: 'PENDING APPROVALS',
      value: kpis.pending_approvals,
      unit: '',
      status: kpis.pending_approvals > 0 ? 'AWAITING' : 'CLEAR',
      trend: '1 route diversion',
      trendDirection: 'up',
      icon: CheckCircle2,
      iconColor: 'text-amber-400',
      bgColor: 'bg-amber-950/20 border-amber-800/40',
      accentColor: 'text-amber-400',
      tooltip: 'Human-in-the-Loop decision gates requiring Commander signature.'
    },
    {
      id: 'response_assets',
      title: 'AVAILABLE ASSETS',
      value: kpis.response_assets_available,
      unit: '',
      status: 'READY',
      trend: '2 icebreakers, 1 helo',
      trendDirection: 'neutral',
      icon: LifeBuoy,
      iconColor: 'text-emerald-400',
      bgColor: 'bg-emerald-950/20 border-emerald-800/40',
      accentColor: 'text-emerald-400',
      tooltip: 'Search & rescue capable icebreakers, helicopters, and stations.'
    },
    {
      id: 'last_24h',
      title: 'INCIDENTS LAST 24H',
      value: kpis.incidents_last_24h,
      unit: '',
      status: 'LOGGED',
      trend: '3 mitigated',
      trendDirection: 'down',
      icon: History,
      iconColor: 'text-blue-400',
      bgColor: 'bg-blue-950/20 border-blue-800/40',
      accentColor: 'text-blue-400',
      tooltip: 'Total emergency incidents recorded in the preceding 24 hours.'
    },
    {
      id: 'avg_response_time',
      title: 'AVG RESPONSE TIME',
      value: kpis.average_response_time_minutes,
      unit: 'min',
      status: 'OPTIMAL',
      trend: '-8m vs benchmark',
      trendDirection: 'down',
      icon: Timer,
      iconColor: 'text-cyan-400',
      bgColor: 'bg-cyan-950/20 border-cyan-800/40',
      accentColor: 'text-cyan-400',
      tooltip: 'Average elapsed time from detection to approved human action plan.'
    },
    {
      id: 'satellite_alerts',
      title: 'SATELLITE ALERTS',
      value: kpis.satellite_alerts,
      unit: '',
      status: 'MONITORING',
      trend: 'Sentinel-1 SAR active',
      trendDirection: 'neutral',
      icon: Satellite,
      iconColor: 'text-purple-400',
      bgColor: 'bg-purple-950/20 border-purple-800/40',
      accentColor: 'text-purple-400',
      tooltip: 'Automated satellite anomalies detected (SAR pressure ridges & MODIS).'
    },
    {
      id: 'ai_risk_alerts',
      title: 'AI RISK ALERTS',
      value: kpis.ai_risk_alerts,
      unit: '',
      status: 'ACTIVE',
      trend: 'XGBoost risk engine',
      trendDirection: 'neutral',
      icon: Cpu,
      iconColor: 'text-indigo-400',
      bgColor: 'bg-indigo-950/20 border-indigo-800/40',
      accentColor: 'text-indigo-400',
      tooltip: 'Explainable AI route risk warnings flagged for human review.'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3 px-6 py-4 bg-[#020617]/70 border-b border-slate-200 dark:border-slate-800/80">
      {cards.map(c => {
        const Icon = c.icon;
        return (
          <div
            key={c.id}
            onClick={() => onFilterClick && onFilterClick(c.id)}
            className={`p-3 rounded-lg border ${c.bgColor} hover:border-slate-600 transition-all cursor-pointer relative group flex flex-col justify-between`}
            title={c.tooltip}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono tracking-wider font-semibold text-slate-500 dark:text-slate-400 uppercase truncate">
                {c.title}
              </span>
              <Icon className={`w-3.5 h-3.5 ${c.iconColor} shrink-0`} />
            </div>

            <div className="flex items-baseline gap-1 my-1">
              <span className={`text-xl font-mono font-extrabold ${c.accentColor}`}>
                {c.value}
              </span>
              {c.unit && <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{c.unit}</span>}
            </div>

            <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-200 dark:border-slate-800/60 mt-1">
              <span className="text-slate-500 dark:text-slate-400 font-mono truncate">{c.trend}</span>
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-900 border border-slate-700/60 text-slate-700 dark:text-slate-300">
                {c.status}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
