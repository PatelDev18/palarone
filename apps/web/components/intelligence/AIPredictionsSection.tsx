"use client"

import React, { useState } from 'react'
import { AIPrediction, AIModel } from '@/types/intelligence'
import { 
  BrainCircuit, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Database, 
  Activity, 
  Cpu,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react'

interface AIPredictionsSectionProps {
  predictions: AIPrediction[];
  models?: AIModel[];
  onReviewAction?: (predictionId: string, action: string) => void;
}

export function AIPredictionsSection({
  predictions,
  models = [],
  onReviewAction
}: AIPredictionsSectionProps) {
  const [expandedReasoning, setExpandedReasoning] = useState<Record<string, boolean>>({
    PRED_ETA_POLAR_STAR: true // default expanded for immediate insight
  });

  const toggleReasoning = (id: string) => {
    setExpandedReasoning(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-500/20 text-red-300 border-red-500/40 font-bold';
      case 'HIGH': return 'bg-red-500/20 text-red-400 border-red-500/30 font-semibold';
      case 'MEDIUM': return 'bg-amber-500/20 text-amber-300 border-amber-500/30 font-semibold';
      case 'LOW':
      default: return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-semibold';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-purple-500/10 rounded-md border border-purple-500/20 text-purple-400">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">AI / ML Predictions & Explainability</h2>
              <span className="text-xs font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-bold">
                ADVISORY INTELLIGENCE
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Production models: XGBoost (ETA/Risk), LightGBM (Demand), Isolation Forest (Telemetry), Autoencoder (Multivariate), Survival Analysis (RUL), Knowledge Graph (Cascade), OR-Tools (Ice Routing).
            </p>
          </div>

          <div className="p-3 bg-red-950/20 border border-red-900/40 rounded-lg text-xs text-red-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>AI outputs are strictly advisory. Never execute autonomous vessel controls.</span>
          </div>
        </div>

        {/* Model Pipeline Breadcrumb (Section 22) */}
        <div className="mt-4 p-3 bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-lg overflow-x-auto scrollbar-thin">
          <div className="flex items-center gap-2 min-w-[760px] text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400">
            <span className="px-2 py-1 bg-slate-800 text-slate-200 rounded">DATA</span>
            <ArrowRight className="w-3 h-3 text-slate-600" />
            <span className="px-2 py-1 bg-slate-800 text-slate-200 rounded">VALIDATION</span>
            <ArrowRight className="w-3 h-3 text-slate-600" />
            <span className="px-2 py-1 bg-slate-800 text-slate-200 rounded">FEATURE ENG</span>
            <ArrowRight className="w-3 h-3 text-slate-600" />
            <span className="px-2 py-1 bg-purple-900/40 text-purple-300 border border-purple-700/50 rounded">MODEL</span>
            <ArrowRight className="w-3 h-3 text-slate-600" />
            <span className="px-2 py-1 bg-blue-900/40 text-blue-300 border border-blue-700/50 rounded">PREDICTION</span>
            <ArrowRight className="w-3 h-3 text-slate-600" />
            <span className="px-2 py-1 bg-cyan-900/40 text-cyan-300 border border-cyan-700/50 rounded">CONFIDENCE</span>
            <ArrowRight className="w-3 h-3 text-slate-600" />
            <span className="px-2 py-1 bg-indigo-900/40 text-indigo-300 border border-indigo-700/50 rounded">EXPLANATION</span>
            <ArrowRight className="w-3 h-3 text-slate-600" />
            <span className="px-2 py-1 bg-amber-900/40 text-amber-300 border border-amber-700/50 rounded">RISK ENGINE</span>
            <ArrowRight className="w-3 h-3 text-slate-600" />
            <span className="px-2 py-1 bg-red-900/40 text-red-300 border border-red-700/50 rounded font-bold">HUMAN REVIEW</span>
            <ArrowRight className="w-3 h-3 text-slate-600" />
            <span className="px-2 py-1 bg-emerald-900/40 text-emerald-300 border border-emerald-700/50 rounded">OPERATIONAL</span>
          </div>
        </div>
      </div>

      {/* Prediction Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {predictions.map((pred) => {
          const isExpanded = !!expandedReasoning[pred.prediction_id];
          return (
            <div
              key={pred.prediction_id}
              className="bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between"
            >
              <div>
                {/* Prediction Title & Meta */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider block font-bold">
                      {pred.model}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{pred.prediction_title}</h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${getRiskBadge(pred.risk_level)}`}>
                    {pred.risk_level}
                  </span>
                </div>

                {/* Primary Prediction Value Strip */}
                <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-200 dark:border-slate-800 my-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">PREDICTED OUTCOME</span>
                    <div className="text-xl font-black font-mono text-amber-400 mt-0.5">
                      {pred.prediction_value}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">AI CONFIDENCE</span>
                    <div className="text-xl font-bold font-mono text-purple-400 mt-0.5">
                      {pred.confidence}%
                    </div>
                  </div>
                </div>

                {/* Contributing Feature Drivers Breakdown (Section 14) */}
                <div className="space-y-2 my-3">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Main Feature Drivers (SHAP Attribution)
                  </span>
                  {pred.main_drivers.map((drv, i) => (
                    <div key={i} className="flex items-center text-xs">
                      <div className="w-48 text-slate-700 dark:text-slate-300 truncate">{drv.factor}</div>
                      <div className="flex-1 h-2 bg-slate-800 rounded-full mx-3 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                          style={{ width: `${drv.percentage}%` }}
                        ></div>
                      </div>
                      <div className="w-16 text-right font-mono font-bold text-amber-400">{drv.impact}</div>
                    </div>
                  ))}
                </div>

                {/* Explainability Section: WHY? (Section 15) */}
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800/80">
                  <button
                    onClick={() => toggleReasoning(pred.prediction_id)}
                    className="flex items-center justify-between w-full text-xs font-bold text-cyan-400 hover:text-cyan-300 py-1"
                  >
                    <span className="flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5" />
                      <span>VIEW AI REASONING (WHY IS THIS OCCURRING?)</span>
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isExpanded && (
                    <div className="mt-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-cyan-500/20 text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                      {pred.explanation}
                      <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-amber-300 font-medium">
                        <strong>Recommended Investigation:</strong> {pred.recommended_investigation}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer: Advisory Status & HITL Review */}
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                  <span className="font-mono text-[10px] text-amber-400 font-bold uppercase">
                    {pred.human_review_status}
                  </span>
                  <span className="text-[10px] text-slate-500">| {pred.data_freshness}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onReviewAction && onReviewAction(pred.prediction_id, 'ACKNOWLEDGE')}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold border border-slate-700 transition"
                  >
                    Acknowledge
                  </button>
                  <button
                    onClick={() => onReviewAction && onReviewAction(pred.prediction_id, 'OPEN_SOURCE')}
                    className="px-3 py-1 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 rounded text-xs font-semibold border border-blue-500/40 transition"
                  >
                    Open Source Data
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
