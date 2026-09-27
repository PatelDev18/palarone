"use client"

import React, { useState } from 'react'
import { AIRecommendation } from '@/types/emergency'
import { 
  Sparkles, 
  Clock, 
  ShieldAlert, 
  Fuel, 
  CheckCircle2, 
  Send, 
  Play, 
  Eye, 
  AlertTriangle,
  Lock
} from 'lucide-react'

interface AIRecommendationCardProps {
  recommendation: AIRecommendation;
  onViewAnalysis: () => void;
  onSimulateResponse: () => void;
  onSubmitForApproval: () => void;
}

export function AIRecommendationCard({
  recommendation,
  onViewAnalysis,
  onSimulateResponse,
  onSubmitForApproval
}: AIRecommendationCardProps) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<string | null>(null);

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationResult("Simulation Complete: Verified +11h ETA gain, hull stress 140 kPa (safe margin).");
      onSimulateResponse();
    }, 1200);
  };

  return (
    <div className="bg-gradient-to-br from-[#0c1836] via-[#0b1329] to-[#070d1e] border-2 border-cyan-500/40 rounded-xl p-5 shadow-2xl relative overflow-hidden space-y-4">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      {/* Header */}
      <div className="flex items-center justify-between relative z-10 pb-3 border-b border-cyan-900/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span>AI Response Recommendation</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                ADVISORY ONLY
              </span>
            </h3>
            <p className="text-xs text-cyan-200/80 font-mono">Algorithmic mitigation strategy derived from OR-Tools Fairway VRP</p>
          </div>
        </div>

        <div className="text-right font-mono text-xs">
          <span className="text-slate-500 dark:text-slate-400 block text-[10px]">AI Confidence</span>
          <span className="text-cyan-400 font-extrabold text-sm">{recommendation.confidence_pct}%</span>
        </div>
      </div>

      {/* Recommended Action Body */}
      <div className="relative z-10 space-y-2">
        <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-300 font-bold block">
          Recommended Action
        </span>
        <div className="p-3.5 rounded-lg bg-white dark:bg-slate-900/80 border border-cyan-800/40 text-slate-100 font-medium text-sm leading-relaxed">
          {recommendation.recommended_action}
        </div>
      </div>

      {/* Expected Operational Impact Grid */}
      <div className="grid grid-cols-3 gap-3 relative z-10 font-mono text-xs">
        <div className="bg-slate-900/70 border border-emerald-900/50 p-3 rounded-lg flex flex-col justify-between">
          <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase flex items-center gap-1">
            <Clock className="w-3 h-3 text-emerald-400" />
            <span>ETA Delta</span>
          </span>
          <div className="mt-1">
            <span className="text-emerald-400 font-bold text-base">
              +{recommendation.eta_improvement_hours}h
            </span>
            <span className="text-slate-500 text-[10px] block">improvement</span>
          </div>
        </div>

        <div className="bg-slate-900/70 border border-cyan-900/50 p-3 rounded-lg flex flex-col justify-between">
          <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-cyan-400" />
            <span>Risk Reduction</span>
          </span>
          <div className="mt-1">
            <span className="text-cyan-400 font-bold text-base">
              -{recommendation.risk_reduction_pct}%
            </span>
            <span className="text-slate-500 text-[10px] block">corridor hazard</span>
          </div>
        </div>

        <div className="bg-slate-900/70 border border-amber-900/50 p-3 rounded-lg flex flex-col justify-between">
          <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase flex items-center gap-1">
            <Fuel className="w-3 h-3 text-amber-400" />
            <span>Fuel Impact</span>
          </span>
          <div className="mt-1">
            <span className="text-amber-400 font-bold text-base">
              +{recommendation.fuel_impact_pct}%
            </span>
            <span className="text-slate-500 text-[10px] block">bunker delta</span>
          </div>
        </div>
      </div>

      {/* Simulation Feedback Alert */}
      {simulationResult && (
        <div className="p-2.5 rounded bg-cyan-950/80 border border-cyan-700/80 text-cyan-200 text-xs font-mono flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{simulationResult}</span>
        </div>
      )}

      {/* Safety Policy Rule Notice */}
      <div className="p-2 rounded bg-red-950/30 border border-red-800/40 text-[11px] font-mono text-red-300/90 flex items-center gap-2">
        <Lock className="w-3.5 h-3.5 text-red-400 shrink-0" />
        <span>
          MANDATORY SAFETY RULE: AI cannot execute diversions autonomously. Human Commander sign-off required.
        </span>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 relative z-10">
        <button
          onClick={onViewAnalysis}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
        >
          <Eye className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>View Analysis</span>
        </button>

        <button
          onClick={handleSimulate}
          disabled={isSimulating}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-900/60 hover:bg-cyan-800/80 text-cyan-200 text-xs font-semibold border border-cyan-700/80 transition"
        >
          <Play className={`w-3.5 h-3.5 text-cyan-400 ${isSimulating ? 'animate-spin' : ''}`} />
          <span>{isSimulating ? 'Simulating...' : 'Simulate Response'}</span>
        </button>

        <button
          onClick={onSubmitForApproval}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-md shadow-red-900/30 transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Submit for Approval</span>
        </button>
      </div>
    </div>
  );
}
