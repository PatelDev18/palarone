"use client";

import React from 'react';
import {
  Ship,
  Package,
  Clock,
  AlertOctagon,
  ShieldAlert,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  Radio
} from 'lucide-react';
import { CommandKPIs } from '@/types/command-center';

interface KPIGridProps {
  kpis: CommandKPIs;
  onCardClick?: (kpiKey: string) => void;
  activeFilter?: string | null;
}

export function KPIGrid({ kpis, onCardClick, activeFilter }: KPIGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2.5 p-3 bg-white dark:bg-[#020617] border-b border-slate-200 dark:border-slate-800/80 shrink-0">
      {/* Card A: Active Ships */}
      <div
        onClick={() => onCardClick?.('SHIPS')}
        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 select-none group relative overflow-hidden ${
          activeFilter === 'SHIPS'
            ? 'bg-blue-950/40 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.25)]'
            : 'bg-slate-50 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800/90 hover:border-blue-500/50 hover:bg-slate-900'
        }`}
      >
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span className="font-mono text-[11px] uppercase tracking-wider font-semibold">
            Active Ships
          </span>
          <Ship className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
            {kpis.active_ships.total}
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            {kpis.active_ships.freshness}
          </span>
        </div>
        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
          <span className="text-blue-300 font-medium">{kpis.active_ships.in_transit} In Transit</span> •{' '}
          <span>{kpis.active_ships.at_port} At Port</span> •{' '}
          <span className="text-amber-400">{kpis.active_ships.stale_offline} Stale</span>
        </div>
      </div>

      {/* Card B: Cargo in Transit */}
      <div
        onClick={() => onCardClick?.('CARGO')}
        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 select-none group relative overflow-hidden ${
          activeFilter === 'CARGO'
            ? 'bg-emerald-950/40 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
            : 'bg-slate-50 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800/90 hover:border-emerald-500/50 hover:bg-slate-900'
        }`}
      >
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span className="font-mono text-[11px] uppercase tracking-wider font-semibold">
            Cargo in Transit
          </span>
          <Package className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
            {kpis.cargo_in_transit.tonnage}
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30">
            {kpis.cargo_in_transit.containers_teu} TEU
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1">
          <span className="text-emerald-400 flex items-center gap-0.5 font-medium">
            <TrendingUp className="w-3 h-3" />
            {kpis.cargo_in_transit.percentage_change}
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            {kpis.cargo_in_transit.critical_manifests} Critical
          </span>
        </div>
      </div>

      {/* Card C: Active Delays */}
      <div
        onClick={() => onCardClick?.('DELAYS')}
        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 select-none group relative overflow-hidden ${
          activeFilter === 'DELAYS'
            ? 'bg-amber-950/40 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
            : 'bg-slate-50 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800/90 hover:border-amber-500/50 hover:bg-slate-900'
        }`}
      >
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span className="font-mono text-[11px] uppercase tracking-wider font-semibold">
            Active Delays
          </span>
          <Clock className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold font-mono text-amber-400">
            {kpis.active_delays.delayed_count}
          </div>
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
            {kpis.active_delays.highest_delay}
          </span>
        </div>
        <div className="text-[11px] text-slate-700 dark:text-slate-300 mt-1 truncate">
          <span className="font-semibold text-amber-300">{kpis.active_delays.affected_vessel}</span> (Weddell Pack)
        </div>
      </div>

      {/* Card D: Critical Incidents */}
      <div
        onClick={() => onCardClick?.('INCIDENTS')}
        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 select-none group relative overflow-hidden ${
          activeFilter === 'INCIDENTS'
            ? 'bg-red-950/40 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
            : 'bg-slate-50 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800/90 hover:border-red-500/50 hover:bg-slate-900'
        }`}
      >
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span className="font-mono text-[11px] uppercase tracking-wider font-semibold">
            Critical Incidents
          </span>
          <AlertOctagon className={`w-4 h-4 ${kpis.critical_incidents.count > 0 ? 'text-red-400 animate-pulse' : 'text-slate-500'} group-hover:scale-110 transition-transform`} />
        </div>
        <div className="flex items-baseline justify-between">
          <div className={`text-2xl font-bold font-mono ${kpis.critical_incidents.count > 0 ? 'text-red-400' : 'text-slate-100'}`}>
            {kpis.critical_incidents.count}
          </div>
          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
            kpis.critical_incidents.count > 0
              ? 'bg-red-500/20 text-red-300 border-red-500/40'
              : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
          }`}>
            {kpis.critical_incidents.count > 0 ? 'ACTION REQ' : 'NORMAL'}
          </span>
        </div>
        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
          {kpis.critical_incidents.label}
        </div>
      </div>

      {/* Card E: Operational Risk */}
      <div
        onClick={() => onCardClick?.('RISK')}
        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 select-none group relative overflow-hidden ${
          activeFilter === 'RISK'
            ? 'bg-rose-950/40 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.25)]'
            : 'bg-slate-50 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800/90 hover:border-rose-500/50 hover:bg-slate-900'
        }`}
      >
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span className="font-mono text-[11px] uppercase tracking-wider font-semibold">
            Operational Risk
          </span>
          <ShieldAlert className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold font-mono text-rose-400">
            {kpis.operational_risk.overall_risk}
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30">
            Conf: {kpis.operational_risk.confidence}
          </span>
        </div>
        <div className="text-[11px] text-slate-700 dark:text-slate-300 mt-1 truncate flex items-center justify-between">
          <span className="truncate">{kpis.operational_risk.high_risk_areas}</span>
          <span className="text-[10px] text-rose-400 font-mono flex items-center shrink-0">
            {kpis.operational_risk.risk_trend}
          </span>
        </div>
      </div>

      {/* Card F: Data Health */}
      <div
        onClick={() => onCardClick?.('HEALTH')}
        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 select-none group relative overflow-hidden ${
          activeFilter === 'HEALTH'
            ? 'bg-cyan-950/40 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
            : 'bg-slate-50 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800/90 hover:border-cyan-500/50 hover:bg-slate-900'
        }`}
      >
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span className="font-mono text-[11px] uppercase tracking-wider font-semibold">
            Data Health
          </span>
          <Activity className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold font-mono text-cyan-300">
            {kpis.data_health.healthy_feeds} / {kpis.data_health.healthy_feeds + kpis.data_health.stale_feeds + kpis.data_health.offline_feeds}
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            {kpis.data_health.status}
          </span>
        </div>
        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
          <span className="text-emerald-400">{kpis.data_health.healthy_feeds} Fresh</span> •{' '}
          <span className="text-amber-400">{kpis.data_health.stale_feeds} Stale</span> •{' '}
          <span className="text-slate-500">{kpis.data_health.offline_feeds} Offline</span>
        </div>
      </div>
    </div>
  );
}
