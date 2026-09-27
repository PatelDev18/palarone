"use client"

import React, { useState } from 'react'
import { RiskCategory } from '@/types/intelligence'
import { 
  ShieldAlert, 
  AlertTriangle, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Search, 
  Filter,
  ArrowRight,
  ShieldCheck
} from 'lucide-react'

interface RiskIntelligenceSectionProps {
  categories: RiskCategory[];
  overallScore?: number;
  overallStatus?: string;
  onSelectRisk?: (risk: RiskCategory) => void;
}

export function RiskIntelligenceSection({
  categories,
  overallScore = 76,
  overallStatus = 'ELEVATED',
  onSelectRisk
}: RiskIntelligenceSectionProps) {
  const [filterLevel, setFilterLevel] = useState<string>('ALL');

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-500/20 text-red-300 border-red-500/40 font-bold animate-pulse';
      case 'HIGH': return 'bg-red-500/20 text-red-400 border-red-500/30 font-semibold';
      case 'MEDIUM': return 'bg-amber-500/20 text-amber-300 border-amber-500/30 font-semibold';
      case 'LOW':
      default: return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-semibold';
    }
  };

  const filteredCategories = categories.filter(c => {
    if (filterLevel === 'ALL') return true;
    return c.level === filterLevel;
  });

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-rose-500/10 rounded-md border border-rose-500/20 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Antarctic Operational Risk Intelligence</h2>
            <span className="text-xs font-mono bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-full font-bold">
              STATUS: {overallStatus} ({overallScore}/100)
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Continuous Bayesian vulnerability scoring across 8 operational risk vectors (Vessel, Ice, Weather, Asset, Station, Cargo, Mission, Comms).
          </p>
        </div>

        {/* Level Filters */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-lg">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(lvl => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-3 py-1 rounded text-xs font-semibold uppercase transition ${
                filterLevel === lvl ? 'bg-rose-600 text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:text-white'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* 8 Risk Categories Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredCategories.map((cat, idx) => (
          <div
            key={idx}
            onClick={() => onSelectRisk && onSelectRisk(cat)}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="font-bold text-sm text-slate-900 dark:text-white">{cat.category}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${getRiskBadge(cat.level)}`}>
                  {cat.level}
                </span>
              </div>

              <div className="flex items-baseline justify-between mb-3">
                <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                  {cat.score} <span className="text-xs text-slate-500 font-normal">/ 100</span>
                </div>
                <div className="text-[11px] font-mono text-purple-400 font-semibold">
                  Conf: {Math.round(cat.confidence * 100)}%
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">AFFECTED ASSET</span>
                  <span className="font-semibold text-slate-200">{cat.affected_asset}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">LOCATION</span>
                  <span className="text-cyan-400 font-mono text-[11px]">{cat.affected_location}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">PRIMARY CAUSE</span>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-snug line-clamp-2">{cat.cause}</p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">POTENTIAL IMPACT</span>
                  <p className="text-amber-400/90 text-[11px] leading-snug line-clamp-2">{cat.potential_impact}</p>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800/80 text-[10px] flex items-center justify-between text-slate-500">
              <span className="font-mono">{cat.review_status}</span>
              <span className="text-blue-400 hover:underline flex items-center gap-0.5">
                Investigate <ArrowRight className="w-2.5 h-2.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
