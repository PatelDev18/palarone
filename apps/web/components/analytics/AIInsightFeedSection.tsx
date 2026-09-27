'use client'

import React from 'react'
import { AIInsight } from '@/types/analytics'
import { Sparkles, AlertTriangle, Info, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react'

interface AIInsightFeedSectionProps {
  insights: AIInsight[]
  onSelectInsight?: (insight: AIInsight) => void
}

export const AIInsightFeedSection: React.FC<AIInsightFeedSectionProps> = ({
  insights,
  onSelectInsight,
}) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Actionable AI Analytical Insights & Decision Support
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cross-system causal synthesis with evidence-grounded operational recommendations.
            </p>
          </div>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          Advisory Intelligence (Human Verification Required)
        </span>
      </div>

      {/* Insights List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insights.map((ins) => {
          const isCritical = ins.severity === 'CRITICAL'
          const isWarning = ins.severity === 'WARNING'

          return (
            <div
              key={ins.id}
              onClick={() => onSelectInsight && onSelectInsight(ins)}
              className={`p-5 rounded-xl border transition-all flex flex-col justify-between cursor-pointer group ${
                isCritical
                  ? 'bg-rose-950/20 hover:bg-rose-950/30 border-rose-500/40 shadow-sm'
                  : isWarning
                  ? 'bg-amber-950/20 hover:bg-amber-950/30 border-amber-500/40'
                  : 'bg-white dark:bg-slate-900/60 hover:bg-slate-900/90 border-slate-200 dark:border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono ${
                        isCritical
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : isWarning
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      }`}
                    >
                      {ins.category} • {ins.severity}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{ins.timestamp}</span>
                  </div>

                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {Math.round(ins.confidence * 100)}% Conf.
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-400 transition-colors mt-1 mb-2">
                  {ins.title}
                </h3>

                <p className="text-xs text-slate-700 dark:text-slate-300 mb-3 leading-relaxed">{ins.finding}</p>

                {/* Root Cause & Remediation */}
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-200 dark:border-slate-800/80">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-0.5">
                      Identified Root Cause
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{ins.root_cause}</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-blue-950/30 border border-blue-900/50">
                    <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider block mb-0.5">
                      Recommended Human Action
                    </span>
                    <p className="text-slate-200 leading-relaxed font-medium">
                      {ins.recommended_action}
                    </p>
                  </div>
                </div>
              </div>

              {/* Source Footer */}
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
                <span className="truncate max-w-[280px]">Engine: {ins.model_source}</span>
                <span className="text-blue-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-xs">
                  Details <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
