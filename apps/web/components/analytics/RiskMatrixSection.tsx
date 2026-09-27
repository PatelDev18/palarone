'use client'

import React, { useState } from 'react'
import { OperationalRiskCategory } from '@/types/analytics'
import { ShieldAlert, TrendingUp, TrendingDown, Minus, Filter, AlertTriangle } from 'lucide-react'

interface RiskMatrixSectionProps {
  risks: OperationalRiskCategory[]
  onSelectRisk?: (risk: OperationalRiskCategory) => void
}

export const RiskMatrixSection: React.FC<RiskMatrixSectionProps> = ({
  risks,
  onSelectRisk,
}) => {
  const [selectedCell, setSelectedCell] = useState<{ p: number; i: number } | null>(null)

  // 5x5 matrix cells
  const getCellRisks = (prob: number, imp: number) => {
    return risks.filter((r) => r.probability === prob && r.impact === imp)
  }

  const getCellColor = (prob: number, imp: number) => {
    const score = prob * imp
    if (score >= 18) return 'bg-rose-950/70 border-rose-500/80 text-rose-300'
    if (score >= 12) return 'bg-amber-950/70 border-amber-500/80 text-amber-300'
    if (score >= 8) return 'bg-yellow-950/50 border-yellow-500/60 text-yellow-300'
    return 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
  }

  const displayedRisks = selectedCell
    ? risks.filter(
        (r) => r.probability === selectedCell.p && r.impact === selectedCell.i
      )
    : risks

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Operational Risk Intelligence (5x5 Probability × Impact Matrix)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Evaluates multi-domain mission hazards across maritime, cryogenic, power, and logistics vectors.
            </p>
          </div>
        </div>
        {selectedCell && (
          <button
            onClick={() => setSelectedCell(null)}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium"
          >
            Clear Matrix Filter ({selectedCell.p}x{selectedCell.i})
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 5x5 Heatmap Matrix */}
        <div className="lg:col-span-5 p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
              Risk Heatmap (Probability vs Consequence Severity)
            </h3>

            <div className="flex gap-2">
              {/* Y-axis label */}
              <div className="flex flex-col justify-between py-2 text-[10px] text-slate-500 dark:text-slate-400 font-mono text-right w-16 select-none">
                <span>5 - Catastrophic</span>
                <span>4 - Severe</span>
                <span>3 - Moderate</span>
                <span>2 - Minor</span>
                <span>1 - Negligible</span>
              </div>

              {/* Grid 5x5 */}
              <div className="flex-1 grid grid-cols-5 gap-1.5 aspect-square">
                {[5, 4, 3, 2, 1].map((impact) =>
                  [1, 2, 3, 4, 5].map((prob) => {
                    const cellRisks = getCellRisks(prob, impact)
                    const isSelected =
                      selectedCell?.p === prob && selectedCell?.i === impact
                    const cellColor = getCellColor(prob, impact)

                    return (
                      <div
                        key={`${prob}-${impact}`}
                        onClick={() =>
                          setSelectedCell(
                            isSelected ? null : { p: prob, i: impact }
                          )
                        }
                        className={`rounded-lg border flex flex-col items-center justify-center p-1 cursor-pointer transition-all ${cellColor} ${
                          isSelected ? 'ring-2 ring-white scale-105 z-10' : 'hover:scale-102'
                        }`}
                      >
                        <span className="text-[10px] opacity-60 font-mono">
                          {prob * impact}
                        </span>
                        {cellRisks.length > 0 && (
                          <span className="text-xs font-extrabold px-1.5 py-0.5 rounded-full bg-white/20 text-white font-mono">
                            {cellRisks.length}
                          </span>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between pl-18 pr-2 pt-2 text-[10px] text-slate-500 dark:text-slate-400 font-mono select-none">
              <span>1 - Remote</span>
              <span>2 - Low</span>
              <span>3 - Med</span>
              <span>4 - High</span>
              <span>5 - Frequent</span>
            </div>
            <div className="text-center text-[10px] font-sans text-slate-500 dark:text-slate-400 font-semibold mt-1">
              Probability Likelihood →
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-rose-500" /> High/Critical (&gt;15)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-amber-500" /> Medium (8-14)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Low (&lt;8)
            </span>
          </div>
        </div>

        {/* Detailed Risk List */}
        <div className="lg:col-span-7 space-y-3">
          {displayedRisks.map((risk) => {
            const isCritical = risk.risk_level === 'CRITICAL'
            const isHigh = risk.risk_level === 'HIGH'

            return (
              <div
                key={risk.id}
                onClick={() => onSelectRisk && onSelectRisk(risk)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer group ${
                  isCritical
                    ? 'bg-rose-950/20 hover:bg-rose-950/30 border-rose-500/40 shadow-sm'
                    : 'bg-white dark:bg-slate-900/60 hover:bg-slate-900/90 border-slate-200 dark:border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                      {risk.id}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-400 transition-colors">
                      {risk.category}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                        isCritical
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                          : risk.risk_level === 'MEDIUM'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      Score: {risk.risk_score} ({risk.probability}P × {risk.impact}I)
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{risk.description}</p>

                <div className="p-2 rounded bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/60 text-xs text-slate-700 dark:text-slate-300">
                  <strong className="text-blue-400">Mitigation Strategy:</strong>{' '}
                  {risk.mitigation_strategy}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
