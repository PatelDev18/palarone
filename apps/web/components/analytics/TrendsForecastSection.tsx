'use client'

import React, { useState } from 'react'
import { ForecastPoint } from '@/types/analytics'
import { TrendingUp, Calendar, Compass, Shield } from 'lucide-react'

interface TrendsForecastSectionProps {
  forecasts: ForecastPoint[]
}

export const TrendsForecastSection: React.FC<TrendsForecastSectionProps> = ({ forecasts }) => {
  const [selectedHorizon, setSelectedHorizon] = useState<number>(14)

  const horizons = [7, 14, 30, 90]

  const filtered = forecasts.filter((f) => f.horizon_days === selectedHorizon)

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-slate-200 dark:border-slate-800/80 gap-3">
        <div className="flex items-center gap-2.5">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Emerging Trends & Multi-Horizon Forecast Center
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Probabilistic projections spanning tactical (7-14d), operational (30d), and strategic seasonal (90d) windows.
            </p>
          </div>
        </div>

        {/* Horizon Selector */}
        <div className="flex bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1 text-xs">
          {horizons.map((h) => (
            <button
              key={h}
              onClick={() => setSelectedHorizon(h)}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                selectedHorizon === h
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-white'
              }`}
            >
              +{h} Days
            </button>
          ))}
        </div>
      </div>

      {/* Projection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item, idx) => {
          const uncertaintyPercent = Math.round(
            ((item.value_p90 - item.value_p10) / (2 * item.value_mean)) * 100
          )

          return (
            <div
              key={idx}
              className="p-5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold uppercase">
                      +{item.horizon_days}-Day Outlook (Target: {item.date})
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1.5">{item.metric}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block font-mono">Uncertainty</span>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      ±{uncertaintyPercent}%
                    </span>
                  </div>
                </div>

                {/* Mean Projection Big Display */}
                <div className="my-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">Expected Mean Value</span>
                    <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                      {item.value_mean.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right font-mono text-xs text-slate-700 dark:text-slate-300">
                    <span className="text-[10px] text-slate-500 block font-sans">Confidence Envelope</span>
                    <span className="text-emerald-400">P10: {item.value_p10}</span>
                    <span className="text-slate-500 mx-1">|</span>
                    <span className="text-rose-400">P90: {item.value_p90}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Projected demand incorporates historical winter sea-ice freeze up, katabatic wind cycles, and scheduled expedition logistics.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                <span>Model: LightGBM Multi-horizon Ensemble</span>
                <span>Calculated via Monte Carlo (10,000 runs)</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
