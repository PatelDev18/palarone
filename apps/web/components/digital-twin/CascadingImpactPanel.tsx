"use client";

import React, { useState } from 'react';
import {
  Flame,
  X,
  Clock,
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { CascadingImpact, CascadeStage } from '@/types/digital-twin';

interface CascadingImpactPanelProps {
  cascades: CascadingImpact[];
  isOpen: boolean;
  onClose: () => void;
  onSelectNode: (nodeId: string) => void;
}

export function CascadingImpactPanel({
  cascades,
  isOpen,
  onClose,
  onSelectNode
}: CascadingImpactPanelProps) {
  const [activeCascadeIndex, setActiveCascadeIndex] = useState(0);

  if (!isOpen) return null;

  const currentCascade = cascades[activeCascadeIndex] || cascades[0];

  return (
    <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-[540px] max-h-[82vh] bg-white/95 dark:bg-slate-950/95 border border-amber-900/60 rounded-xl shadow-2xl z-20 flex flex-col backdrop-blur-md overflow-hidden select-none animate-in slide-in-from-bottom duration-200">
      {/* Header */}
      <div className="p-3 bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border-b border-amber-900/40 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-900/40 border border-amber-700/60 flex items-center justify-center">
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 font-mono tracking-tight flex items-center gap-1.5">
              CASCADING IMPACT INTELLIGENCE
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                MULTI-HORIZON
              </span>
            </h3>
            <p className="text-[10px] font-mono text-slate-600 dark:text-slate-400">
              Cross-system dependency failure propagation
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-600 dark:text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Cascade Selector Tabs */}
      {cascades.length > 1 && (
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-1.5 gap-1 shrink-0 overflow-x-auto">
          {cascades.map((c, idx) => (
            <button
              key={c.cascade_id}
              onClick={() => setActiveCascadeIndex(idx)}
              className={`flex-1 py-1.5 px-2 rounded text-[11px] font-mono whitespace-nowrap transition-colors border ${
                activeCascadeIndex === idx
                  ? 'bg-amber-950/80 text-amber-300 border-amber-700/80 font-bold'
                  : 'bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              {c.trigger_name}
            </button>
          ))}
        </div>
      )}

      {/* Main Cascade Content */}
      {currentCascade ? (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-mono">
          {/* Summary Box */}
          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400 text-[10px] uppercase">Root Cause Trigger</span>
              <button
                onClick={() => onSelectNode(currentCascade.trigger_node)}
                className="text-cyan-400 font-bold hover:underline flex items-center gap-1"
              >
                {currentCascade.trigger_name}
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 font-sans leading-relaxed">
              {currentCascade.root_cause}
            </p>
            <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-800/80 text-[10px] text-slate-600 dark:text-slate-400">
              <span>Confidence: <strong className="text-emerald-400">{(currentCascade.confidence_score * 100).toFixed(0)}%</strong></span>
              <span className="text-red-400 font-bold">Severity: {currentCascade.overall_severity}</span>
            </div>
          </div>

          {/* Time Horizon Progression Timeline */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" />
              Time-Horizon Failure Ripple
            </span>

            <div className="relative pl-6 space-y-3 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {currentCascade.stages.map((stage: CascadeStage) => {
                const isCrit = stage.severity === 'CRITICAL';
                const isWarn = stage.severity === 'WARNING';

                return (
                  <div key={stage.step} className="relative group">
                    {/* Timeline Node Marker */}
                    <div
                      className={`absolute -left-[23px] top-1 w-3 h-3 rounded-full border-2 transition-transform group-hover:scale-125 ${
                        isCrit
                          ? 'bg-red-500 border-red-950 ring-2 ring-red-500/40'
                          : isWarn
                          ? 'bg-amber-500 border-amber-950 ring-2 ring-amber-500/40'
                          : 'bg-blue-500 border-blue-950'
                      }`}
                    />

                    {/* Step Card */}
                    <div
                      onClick={() => onSelectNode(stage.node_id)}
                      className="p-2.5 rounded-lg bg-white dark:bg-slate-900/90 hover:bg-slate-850 border border-slate-200 dark:border-slate-800/90 hover:border-cyan-500/50 cursor-pointer transition-all space-y-1 shadow-sm"
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-slate-200 flex items-center gap-1">
                          <span className="text-cyan-400">T+{stage.time_horizon}:</span> {stage.node_name}
                        </span>
                        <span
                          className={`font-semibold px-1.5 py-0.2 rounded ${
                            isCrit
                              ? 'bg-red-950 text-red-400 border border-red-800'
                              : isWarn
                              ? 'bg-amber-950 text-amber-400 border border-amber-800'
                              : 'bg-blue-950 text-blue-400'
                          }`}
                        >
                          {stage.impact_type}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 font-sans leading-snug">
                        {stage.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommended Human-In-The-Loop Actions */}
          <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-800/60 space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-blue-300 font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
              Recommended Human-In-The-Loop Mitigations
            </span>
            <ul className="space-y-1.5 text-[11px] font-sans text-slate-700 dark:text-slate-300">
              {currentCascade.recommended_human_actions.map((act, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="p-6 text-center text-slate-600 dark:text-slate-400 text-xs font-mono">
          No cascading failures currently propagating.
        </div>
      )}
    </div>
  );
}
