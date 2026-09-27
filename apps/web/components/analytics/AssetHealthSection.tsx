'use client'

import React from 'react'
import { AssetHealthRecord } from '@/types/analytics'
import { Wrench, ShieldAlert, Cpu, CheckCircle2, ChevronRight, Activity } from 'lucide-react'

interface AssetHealthSectionProps {
  assets: AssetHealthRecord[]
  onSelectAsset?: (asset: AssetHealthRecord) => void
}

export const AssetHealthSection: React.FC<AssetHealthSectionProps> = ({
  assets,
  onSelectAsset,
}) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <Wrench className="w-5 h-5 text-amber-400" />
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Machinery Health & Remaining Useful Life (RUL)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Parametric survival curves (Weibull & Cox PH) predicting component failure intervals.
            </p>
          </div>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          5 Monitored Critical Power & Propulsion Assets
        </span>
      </div>

      {/* Asset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {assets.map((asset) => {
          const isAtRisk = asset.health_score < 75 || asset.failure_probability_30d > 0.25

          return (
            <div
              key={asset.asset_id}
              onClick={() => onSelectAsset && onSelectAsset(asset)}
              className={`p-5 rounded-xl border transition-all flex flex-col justify-between cursor-pointer group ${
                isAtRisk
                  ? 'bg-amber-950/20 hover:bg-amber-950/30 border-amber-500/40 shadow-amber-950/20'
                  : 'bg-white dark:bg-slate-900/60 hover:bg-slate-900/90 border-slate-200 dark:border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-500 dark:text-slate-400">
                      {asset.asset_type}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5 group-hover:text-amber-400 transition-colors">
                      {asset.asset_name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{asset.location}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 dark:text-slate-400 block text-[10px]">Health</span>
                    <span
                      className={`text-lg font-mono font-extrabold ${
                        asset.health_score > 90
                          ? 'text-emerald-400'
                          : asset.health_score > 75
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {asset.health_score}%
                    </span>
                  </div>
                </div>

                {/* Remaining Useful Life Box */}
                <div className="my-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/60">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Estimated Remaining Useful Life:</span>
                    <span className="text-base font-extrabold font-mono text-slate-900 dark:text-white">
                      {asset.rul_days} Days
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${
                        asset.rul_days < 35
                          ? 'bg-rose-500'
                          : asset.rul_days < 90
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                      }`}
                      style={{ width: `${Math.min(100, (asset.rul_days / 200) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Survival Metrics */}
                <div className="grid grid-cols-2 gap-2 mb-3 text-xs font-mono">
                  <div className="p-2 rounded bg-slate-800/30 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-sans text-slate-500 dark:text-slate-400 block">30d Failure Risk</span>
                    <span
                      className={`font-bold ${
                        asset.failure_probability_30d > 0.2 ? 'text-rose-400' : 'text-slate-200'
                      }`}
                    >
                      {Math.round(asset.failure_probability_30d * 100)}%
                    </span>
                  </div>
                  <div className="p-2 rounded bg-slate-800/30 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-sans text-slate-500 dark:text-slate-400 block">60d Survival Prob</span>
                    <span className="text-emerald-400 font-bold">
                      {Math.round(asset.survival_probability_60d * 100)}%
                    </span>
                  </div>
                </div>

                {/* Recommended Remediation */}
                <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                    Recommended Maintenance
                  </span>
                  <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
                    {asset.recommended_action}
                  </p>
                </div>
              </div>

              {/* Model Tag */}
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
                <span className="truncate max-w-[200px]">Engine: {asset.model_used}</span>
                <span className="text-blue-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  Diagnostics <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
