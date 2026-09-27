'use client'

import React from 'react'
import { ExecutiveKpi } from '@/types/analytics'
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react'

interface ExecutiveKpiStripProps {
  kpis: ExecutiveKpi[]
  onKpiClick?: (kpi: ExecutiveKpi) => void
}

export const ExecutiveKpiStrip: React.FC<ExecutiveKpiStripProps> = ({ kpis, onKpiClick }) => {
  // Mini SVG Sparkline generator
  const renderSparkline = (points: number[], status: string) => {
    if (!points || points.length < 2) return null
    const min = Math.min(...points)
    const max = Math.max(...points)
    const range = max - min || 1
    const width = 80
    const height = 24
    const padding = 2

    const pathData = points
      .map((val, idx) => {
        const x = padding + (idx / (points.length - 1)) * (width - 2 * padding)
        const y = height - padding - ((val - min) / range) * (height - 2 * padding)
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
      })
      .join(' ')

    const strokeColor =
      status === 'critical'
        ? '#ef4444'
        : status === 'warning'
        ? '#f59e0b'
        : status === 'optimal'
        ? '#10b981'
        : '#3b82f6'

    return (
      <svg width={width} height={height} className="overflow-visible">
        <path d={pathData} fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3 my-6">
      {kpis.map((kpi) => {
        const isUp = kpi.trend === 'up'
        const isDown = kpi.trend === 'down'

        return (
          <div
            key={kpi.id}
            onClick={() => onKpiClick && onKpiClick(kpi)}
            className="group relative flex flex-col justify-between p-3.5 rounded-xl bg-white dark:bg-slate-900/60 hover:bg-slate-900/90 border border-slate-200 dark:border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer shadow-sm hover:shadow-md"
          >
            {/* Top row: Title and trend badge */}
            <div className="flex items-start justify-between gap-1 mb-2">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-tight line-clamp-2">
                {kpi.title}
              </span>
              <div
                className={`flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                  kpi.status === 'critical'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : kpi.status === 'warning'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : kpi.status === 'optimal'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                }`}
              >
                {isUp && <TrendingUp className="w-2.5 h-2.5 mr-0.5" />}
                {isDown && <TrendingDown className="w-2.5 h-2.5 mr-0.5" />}
                {!isUp && !isDown && <Minus className="w-2.5 h-2.5 mr-0.5" />}
                {Math.abs(kpi.delta_percent)}%
              </div>
            </div>

            {/* Middle row: Big Value + Unit */}
            <div className="flex items-baseline gap-1 my-1">
              <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight font-mono">
                {kpi.value}
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 font-mono">{kpi.unit}</span>
            </div>

            {/* Bottom row: Sparkline and mini status */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200 dark:border-slate-800/50">
              <div className="flex items-center gap-1 text-[10px] text-slate-500">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    kpi.status === 'critical'
                      ? 'bg-rose-500'
                      : kpi.status === 'warning'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                />
                <span className="capitalize">{kpi.status}</span>
              </div>
              <div className="opacity-80 group-hover:opacity-100 transition-opacity">
                {renderSparkline(kpi.sparkline, kpi.status)}
              </div>
            </div>

            {/* Hover Tooltip Description */}
            <div className="absolute inset-x-0 bottom-full mb-2 hidden group-hover:block z-50 p-2 text-[11px] text-slate-200 bg-slate-950 border border-slate-700 rounded-lg shadow-xl pointer-events-none">
              <p className="font-semibold text-white mb-0.5">{kpi.title}</p>
              <p className="text-slate-500 dark:text-slate-400 text-[10px]">{kpi.description}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
