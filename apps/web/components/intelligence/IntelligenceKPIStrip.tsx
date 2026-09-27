"use client"

import React from 'react'
import { KPICard } from '@/types/intelligence'
import { ArrowUpRight, ArrowDownRight, Minus, Clock, ShieldAlert } from 'lucide-react'

interface IntelligenceKPIStripProps {
  kpis: KPICard[];
  onKPIClick?: (kpiId: string) => void;
}

export function IntelligenceKPIStrip({ kpis, onKPIClick }: IntelligenceKPIStripProps) {
  const getAccentBorder = (accent: string) => {
    switch (accent) {
      case 'red': return 'border-red-500/30 hover:border-red-500/60 shadow-[0_0_12px_rgba(239,68,68,0.15)]';
      case 'amber': return 'border-amber-500/30 hover:border-amber-500/60';
      case 'cyan': return 'border-cyan-500/30 hover:border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.15)]';
      case 'purple': return 'border-purple-500/30 hover:border-purple-500/60 shadow-[0_0_12px_rgba(168,85,247,0.15)]';
      case 'emerald': return 'border-emerald-500/30 hover:border-emerald-500/60';
      case 'blue':
      default: return 'border-blue-500/30 hover:border-blue-500/60 shadow-[0_0_12px_rgba(59,130,246,0.15)]';
    }
  };

  const getAccentText = (accent: string) => {
    switch (accent) {
      case 'red': return 'text-red-400';
      case 'amber': return 'text-amber-400';
      case 'cyan': return 'text-cyan-400';
      case 'purple': return 'text-purple-400';
      case 'emerald': return 'text-emerald-400';
      case 'blue':
      default: return 'text-blue-400';
    }
  };

  const getStatusBadge = (status: string, accent: string) => {
    let bg = 'bg-slate-800 text-slate-700 dark:text-slate-300';
    if (status.includes('CRITICAL') || status.includes('REQUIRES REVIEW')) {
      bg = 'bg-red-500/20 text-red-300 border border-red-500/40 font-semibold animate-pulse';
    } else if (status.includes('FRESH') || status.includes('HEALTHY')) {
      bg = 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
    } else if (status.includes('WARNING') || status.includes('DEGRADED')) {
      bg = 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
    } else if (status.includes('ACTIVE ADVISORY')) {
      bg = 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
    }
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] tracking-wide font-mono uppercase ${bg}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3 w-full">
      {kpis.map((kpi) => {
        return (
          <div
            key={kpi.id}
            onClick={() => onKPIClick && onKPIClick(kpi.id)}
            className={`bg-[#0f172a]/80 backdrop-blur-md rounded-lg p-3 border transition-all cursor-pointer flex flex-col justify-between hover:scale-[1.02] ${getAccentBorder(kpi.accent)}`}
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
                  {kpi.title}
                </span>
                {kpi.trend === 'UP' && <ArrowUpRight className={`w-3.5 h-3.5 shrink-0 ${getAccentText(kpi.accent)}`} />}
                {kpi.trend === 'DOWN' && <ArrowDownRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                {kpi.trend === 'STABLE' && <Minus className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
              </div>

              <div className="flex items-baseline gap-2 my-1">
                <span className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                  {kpi.current_value}
                </span>
                <span className={`text-xs font-medium truncate ${kpi.accent === 'red' ? 'text-red-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                  {kpi.change}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800/80 mt-2 text-[10px] text-slate-500">
              <div className="flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" />
                <span>{kpi.freshness}</span>
              </div>
              <div>{getStatusBadge(kpi.status, kpi.accent)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
