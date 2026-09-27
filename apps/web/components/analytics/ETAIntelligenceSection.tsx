'use client'

import React from 'react'
import { ETAPredictionRecord } from '@/types/analytics'
import { Clock, Navigation, AlertCircle, CheckCircle2, ChevronRight, Wind, Snowflake, Wrench } from 'lucide-react'

interface ETAIntelligenceSectionProps {
  etaData: ETAPredictionRecord[]
  onSelectVoyage?: (voyage: ETAPredictionRecord) => void
}

export const ETAIntelligenceSection: React.FC<ETAIntelligenceSectionProps> = ({
  etaData,
  onSelectVoyage,
}) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <Clock className="w-5 h-5 text-indigo-400" />
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              ETA Intelligence & Route Delay Root-Cause Attribution
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Multi-factor XGBoost ETA model reconciling Planned vs AIS Provider vs AI Predictions.
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          Model Confidence: 91.2% - 98.0%
        </span>
      </div>

      {/* Voyage ETA Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {etaData.map((rec) => {
          const isDelayed = rec.delay_hours > 0
          const delaySign = rec.delay_hours > 0 ? '+' : ''

          return (
            <div
              key={rec.voyage_id}
              onClick={() => onSelectVoyage && onSelectVoyage(rec)}
              className="p-5 rounded-xl bg-white dark:bg-slate-900/60 hover:bg-slate-900/90 border border-slate-200 dark:border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between cursor-pointer group shadow-sm"
            >
              <div>
                {/* Voyage Title */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-semibold">
                      {rec.voyage_id}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-400 transition-colors">
                      {rec.vessel_name}
                    </h3>
                  </div>
                  <div
                    className={`px-2 py-0.5 text-xs font-mono font-bold rounded-full ${
                      rec.delay_hours > 12
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : rec.delay_hours > 0
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    {delaySign}
                    {rec.delay_hours}h Variance
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800/60">
                  <Navigation className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="truncate">{rec.destination}</span>
                </div>

                {/* Timeline Matrix */}
                <div className="space-y-2.5 font-mono text-xs mb-4">
                  <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                    <span className="font-sans text-[11px]">Original Planned:</span>
                    <span className="text-slate-700 dark:text-slate-300">{rec.original_planned_eta}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                    <span className="font-sans text-[11px]">Provider AIS ETA:</span>
                    <span className="text-slate-700 dark:text-slate-300">{rec.provider_eta}</span>
                  </div>
                  <div className="flex justify-between items-center bg-blue-950/40 p-1.5 rounded border border-blue-900/50">
                    <span className="font-sans text-[11px] text-blue-300 font-bold">
                      AI Predicted ETA:
                    </span>
                    <span className="text-slate-900 dark:text-white font-bold">{rec.ai_predicted_eta}</span>
                  </div>
                </div>

                {/* Confidence Bounds (P10, P50, P90) */}
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 mb-4">
                  <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider font-semibold">
                    <span>P10 (Optimistic)</span>
                    <span>P50 (Median)</span>
                    <span>P90 (Conservative)</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-200">
                    <span className="text-slate-500 dark:text-slate-400">{rec.p10_eta.substring(11, 16)}</span>
                    <span className="text-blue-400 font-bold">{rec.p50_eta.substring(11, 16)}</span>
                    <span className="text-amber-400">{rec.p90_eta.substring(11, 16)}</span>
                  </div>
                </div>

                {/* Root Cause Delay Attribution */}
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 block mb-2">
                    Primary Delay Driver
                  </span>
                  <div className="flex items-center gap-2 text-xs text-slate-200 p-2 rounded bg-slate-800/40 border border-slate-200 dark:border-slate-800 mb-2">
                    <Snowflake className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="truncate">{rec.primary_delay_cause}</span>
                  </div>

                  {/* Delay Breakdown bars */}
                  <div className="space-y-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    {Object.entries(rec.delay_breakdown).map(([factor, hours]) => (
                      <div key={factor} className="flex justify-between items-center">
                        <span className="capitalize">{factor.replace('_', ' ')}:</span>
                        <span className={hours > 0 ? 'text-amber-400' : 'text-emerald-400'}>
                          {hours > 0 ? `+${hours}h` : `${hours}h`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Confidence Footer */}
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  Confidence Score:{' '}
                  <strong className="text-emerald-400 font-mono">
                    {Math.round(rec.confidence_score * 100)}%
                  </strong>
                </span>
                <span className="text-blue-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-[11px]">
                  Drill-down <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
