'use client'

import React from 'react'
import { MLModelPerformanceRecord } from '@/types/analytics'
import { Cpu, CheckCircle2, AlertTriangle, RefreshCw, BarChart2, Layers } from 'lucide-react'

interface MLModelRegistrySectionProps {
  models: MLModelPerformanceRecord[]
}

export const MLModelRegistrySection: React.FC<MLModelRegistrySectionProps> = ({ models }) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <Cpu className="w-5 h-5 text-blue-400" />
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Machine Learning Model Registry & Health Monitoring
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Evaluates model accuracy, inference metrics, and Population Stability Index (PSI) drift monitoring.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
            Strict Architecture: Gradient Boosting, Isolation Forest, Autoencoders & Survival Analysis
          </span>
        </div>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {models.map((model) => {
          const isDrifting = model.drift_status === 'DRIFT_DETECTED'
          const isMonitor = model.drift_status === 'MONITOR'

          return (
            <div
              key={model.model_id}
              className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
                isDrifting
                  ? 'bg-rose-950/20 border-rose-500/40 shadow-rose-950/20'
                  : isMonitor
                  ? 'bg-amber-950/20 border-amber-500/40'
                  : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block font-semibold">
                      {model.model_id} ({model.version})
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{model.name}</h3>
                    <p className="text-xs text-blue-400 font-mono mt-0.5">{model.algorithm}</p>
                  </div>

                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider font-mono ${
                      isDrifting
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                        : isMonitor
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    {model.drift_status}
                  </span>
                </div>

                {/* Evaluation Metrics Matrix */}
                <div className="my-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                    Evaluation Benchmark Metrics
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                    {Object.entries(model.metrics).map(([metricKey, val]) => (
                      <div key={metricKey} className="p-1.5 rounded bg-slate-800/40 border border-slate-200 dark:border-slate-800/60">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase block">{metricKey}</span>
                        <span className="text-slate-900 dark:text-white font-bold">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Data Drift & Dataset Version */}
                <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 mb-3 font-mono">
                  <div className="flex justify-between items-center">
                    <span className="font-sans text-[11px] text-slate-500 dark:text-slate-400">Drift PSI Score:</span>
                    <span
                      className={`font-bold ${
                        model.drift_score_psi > 0.1
                          ? 'text-rose-400'
                          : model.drift_score_psi > 0.05
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {model.drift_score_psi} PSI
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-sans text-[11px] text-slate-500 dark:text-slate-400">Trained:</span>
                    <span className="text-slate-700 dark:text-slate-300">{model.last_trained}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-sans truncate">
                    Dataset: {model.dataset_version}
                  </div>
                </div>

                {/* Recommendation */}
                <div className="p-2 rounded bg-slate-800/30 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300">
                  <strong className="text-slate-200">Advisory:</strong> {model.recommendation}
                </div>
              </div>

              {/* Status Footer */}
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Status: {model.deployment_status}
                </span>
                <span className="font-mono text-[10px] text-slate-500">
                  PSI &lt; 0.10 Nominal
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
