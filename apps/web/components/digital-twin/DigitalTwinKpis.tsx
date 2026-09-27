"use client";

import React from 'react';
import {
  Activity,
  Link2,
  AlertOctagon,
  AlertTriangle,
  Flame,
  ShieldCheck,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { DigitalTwinOverview } from '@/types/digital-twin';

interface DigitalTwinKpisProps {
  overview: DigitalTwinOverview | null;
  selectedSeverity: string;
  onSelectSeverity: (sev: string) => void;
  onOpenCascades: () => void;
  onOpenDataHealth: () => void;
}

export function DigitalTwinKpis({
  overview,
  selectedSeverity,
  onSelectSeverity,
  onOpenCascades,
  onOpenDataHealth
}: DigitalTwinKpisProps) {
  const kpis = overview?.kpis || {
    system_nodes: 23,
    active_relationships: 26,
    critical_nodes: 2,
    active_cascades: 2,
    high_risk_assets: 6,
    data_quality_pct: 94,
    last_sync_seconds_ago: 42
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 p-3 bg-white dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800/80 shrink-0">
      {/* 1. System Nodes */}
      <button
        onClick={() => onSelectSeverity('ALL')}
        className={`p-2.5 rounded-lg border text-left transition-all ${
          selectedSeverity === 'ALL'
            ? 'bg-slate-900 border-blue-500/50 shadow-sm ring-1 ring-blue-500/30'
            : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 hover:bg-white dark:bg-slate-900/90 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            System Nodes
          </span>
          <ArrowUpRight className="w-3 h-3 text-slate-500" />
        </div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100">{kpis.system_nodes}</span>
          <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400">entities</span>
        </div>
        <div className="mt-0.5 text-[9px] font-mono text-slate-500 truncate">
          Vessels, bases, power & cargo
        </div>
      </button>

      {/* 2. Active Dependencies */}
      <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/60 text-left">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5 text-cyan-400" />
            Dependencies
          </span>
        </div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100">{kpis.active_relationships}</span>
          <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400">typed links</span>
        </div>
        <div className="mt-0.5 text-[9px] font-mono text-cyan-400 truncate">
          Directed supply & power
        </div>
      </div>

      {/* 3. Critical Nodes */}
      <button
        onClick={() => onSelectSeverity('CRITICAL')}
        className={`p-2.5 rounded-lg border text-left transition-all ${
          selectedSeverity === 'CRITICAL'
            ? 'bg-red-950/50 border-red-500 shadow-sm ring-1 ring-red-500/40'
            : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 hover:bg-red-950/30 hover:border-red-800/50'
        }`}
      >
        <div className="flex items-center justify-between text-[11px] font-mono text-red-400">
          <span className="flex items-center gap-1.5">
            <AlertOctagon className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            Critical Nodes
          </span>
          <span className="text-[9px] px-1 py-0.2 bg-red-950 text-red-400 rounded border border-red-900">
            FILTER
          </span>
        </div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-xl font-bold font-mono text-red-400">{kpis.critical_nodes}</span>
          <span className="text-[10px] font-mono text-red-300/70">failing</span>
        </div>
        <div className="mt-0.5 text-[9px] font-mono text-red-400 truncate">
          Gen #2 & Fast Ice Wharf
        </div>
      </button>

      {/* 4. Active Cascades */}
      <button
        onClick={onOpenCascades}
        className="p-2.5 rounded-lg border border-amber-900/40 bg-amber-950/20 hover:bg-amber-950/40 hover:border-amber-700/60 text-left transition-all group"
      >
        <div className="flex items-center justify-between text-[11px] font-mono text-amber-400">
          <span className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-500 group-hover:scale-110 transition-transform" />
            Active Cascades
          </span>
          <span className="text-[9px] text-amber-400 font-mono underline">VIEW</span>
        </div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-xl font-bold font-mono text-amber-300">{kpis.active_cascades}</span>
          <span className="text-[10px] font-mono text-amber-400/80">chains</span>
        </div>
        <div className="mt-0.5 text-[9px] font-mono text-amber-400/80 truncate">
          Davis Power & Polar Star
        </div>
      </button>

      {/* 5. High Risk Assets */}
      <button
        onClick={() => onSelectSeverity('WARNING')}
        className={`p-2.5 rounded-lg border text-left transition-all ${
          selectedSeverity === 'WARNING'
            ? 'bg-amber-950/40 border-amber-500 shadow-sm ring-1 ring-amber-500/40'
            : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 hover:bg-white dark:bg-slate-900/90 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            High Risk Assets
          </span>
        </div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-xl font-bold font-mono text-amber-400">{kpis.high_risk_assets}</span>
          <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400">predicted</span>
        </div>
        <div className="mt-0.5 text-[9px] font-mono text-slate-500 truncate">
          XGBoost & Isolation Forest
        </div>
      </button>

      {/* 6. Knowledge Graph Health */}
      <button
        onClick={onOpenDataHealth}
        className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/60 hover:bg-white dark:bg-slate-900/90 text-left transition-all group"
      >
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Graph Health
          </span>
          <span className="text-[9px] text-slate-500 group-hover:text-emerald-400 transition-colors">MATRIX</span>
        </div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-xl font-bold font-mono text-emerald-400">{kpis.data_quality_pct}%</span>
          <span className="text-[10px] font-mono text-emerald-500">validated</span>
        </div>
        <div className="mt-0.5 text-[9px] font-mono text-slate-500 truncate">
          0 Schema Orphan Nodes
        </div>
      </button>

      {/* 7. Telemetry Freshness */}
      <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/60 text-left">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            Sync Latency
          </span>
        </div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-xl font-bold font-mono text-cyan-400">{kpis.last_sync_seconds_ago}s</span>
          <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400">ago</span>
        </div>
        <div className="mt-0.5 text-[9px] font-mono text-emerald-400 truncate">
          Sub-minute telemetry sync
        </div>
      </div>
    </div>
  );
}
