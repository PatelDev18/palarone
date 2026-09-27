'use client'

import React from 'react'
import { Timeframe } from '@/types/analytics'
import {
  Activity,
  RefreshCw,
  Sliders,
  Download,
  FileSpreadsheet,
  FileCode,
  ShieldCheck,
  Radio,
  Clock,
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

interface AnalyticsHeaderProps {
  timeframe: Timeframe
  setTimeframe: (tf: Timeframe) => void
  onRefresh: () => void
  isRefreshing: boolean
  lastUpdated: string
  connectionStatus: 'ONLINE' | 'DEGRADED' | 'OFFLINE'
  onOpenWhatIf: () => void
  onExportCSV: () => void
  onExportJSON: () => void
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  timeframe,
  setTimeframe,
  onRefresh,
  isRefreshing,
  lastUpdated,
  connectionStatus,
  onOpenWhatIf,
  onExportCSV,
  onExportJSON,
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800 transition-colors duration-150">
      <div>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/30 dark:text-blue-400">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Analytical Intelligence
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/60 dark:text-blue-300 dark:border-blue-700/50">
                PROD ML-ENGINE v4.2
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Historical analytics, predictive telemetry, anomaly diagnostics, and risk intelligence across Antarctic & Arctic operations.
            </p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Radio
              className={`w-3.5 h-3.5 ${
                connectionStatus === 'ONLINE'
                  ? 'text-emerald-500 dark:text-emerald-400 animate-pulse'
                  : connectionStatus === 'DEGRADED'
                  ? 'text-amber-500 dark:text-amber-400'
                  : 'text-rose-500 dark:text-rose-400'
              }`}
            />
            <span className="font-mono text-slate-700 dark:text-slate-300">
              Telemetry Status:{' '}
              <strong
                className={
                  connectionStatus === 'ONLINE'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : connectionStatus === 'DEGRADED'
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-rose-600 dark:text-rose-400'
                }
              >
                {connectionStatus}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 dark:text-slate-500" />
            <span>
              Freshness: <span className="font-mono text-slate-700 dark:text-slate-300">{lastUpdated}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
            <span>Advisory Mode (Human-in-the-Loop)</span>
          </div>
        </div>
      </div>

      {/* Controls & Action Buttons */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Timeframe Selector */}
        <div className="flex bg-slate-100 dark:bg-slate-900/90 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
          {(['24H', '7D', '30D', '90D', 'YTD'] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                timeframe === tf
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800/80'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/90 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
          title="Refresh operational telemetry"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-500' : ''}`} />
          <span>Sync</span>
        </button>

        {/* What-If Simulator Button */}
        <button
          onClick={onOpenWhatIf}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-medium shadow-sm transition-all"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>What-If Simulator</span>
        </button>

        {/* Global Theme Toggle */}
        <ThemeToggle mode="dropdown" className="shrink-0" />

        {/* Export Buttons */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-900/90 rounded-lg border border-slate-200 dark:border-slate-800 p-0.5">
          <button
            onClick={onExportCSV}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors"
            title="Export analytical data to CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>CSV</span>
          </button>
          <div className="w-[1px] h-3.5 bg-slate-300 dark:bg-slate-800" />
          <button
            onClick={onExportJSON}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors"
            title="Export analytical data to JSON"
          >
            <FileCode className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>JSON</span>
          </button>
        </div>
      </div>
    </div>
  )
}
