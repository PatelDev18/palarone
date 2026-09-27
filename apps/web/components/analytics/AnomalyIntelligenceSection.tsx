'use client'

import React, { useState } from 'react'
import { SensorAnomalyRecord } from '@/types/analytics'
import { AlertOctagon, CheckCircle2, Search, Cpu, ShieldAlert, ChevronRight } from 'lucide-react'

interface AnomalyIntelligenceSectionProps {
  anomalies: SensorAnomalyRecord[]
  onSelectAnomaly?: (anomaly: SensorAnomalyRecord) => void
}

export const AnomalyIntelligenceSection: React.FC<AnomalyIntelligenceSectionProps> = ({
  anomalies,
  onSelectAnomaly,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL')

  const filtered =
    filterStatus === 'ALL'
      ? anomalies
      : anomalies.filter((a) => a.status === filterStatus)

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-slate-200 dark:border-slate-800/80 gap-3">
        <div className="flex items-center gap-2.5">
          <AlertOctagon className="w-5 h-5 text-rose-500" />
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Sensor Anomaly Intelligence & Multivariate Detection
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Isolation Forest and Deep Latent Autoencoder models detecting subtle subsystem degradation.
            </p>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1 text-xs">
          {['ALL', 'OPEN', 'INVESTIGATING', 'RESOLVED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                filterStatus === st
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Anomalies List */}
      <div className="space-y-3">
        {filtered.map((anom) => {
          const isCritical = anom.severity === 'CRITICAL' || anom.severity === 'HIGH'

          return (
            <div
              key={anom.anomaly_id}
              onClick={() => onSelectAnomaly && onSelectAnomaly(anom)}
              className="p-4 rounded-xl bg-white dark:bg-slate-900/60 hover:bg-slate-900/90 border border-slate-200 dark:border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`p-2.5 rounded-lg shrink-0 ${
                    isCritical
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      : anom.severity === 'MEDIUM'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}
                >
                  <AlertOctagon className="w-5 h-5" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                      {anom.anomaly_id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                        anom.severity === 'HIGH' || anom.severity === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : anom.severity === 'MEDIUM'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {anom.severity}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {anom.detection_model}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{anom.timestamp}</span>
                  </div>

                  <h3 className="text-sm font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">
                    {anom.equipment_name} ({anom.location})
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{anom.anomaly_type}</p>

                  <div className="mt-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/60 p-2 rounded border border-slate-200 dark:border-slate-800/60 font-sans">
                    <strong className="text-slate-200">Actionable Remediation:</strong>{' '}
                    {anom.actionable_remediation}
                  </div>
                </div>
              </div>

              {/* Right Side: Metrics & Status */}
              <div className="flex md:flex-col items-center md:items-end justify-between gap-2 shrink-0 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">Z-Score:</span>
                  <span className="font-bold text-rose-400">+{anom.z_score}σ</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">Rec Error:</span>
                  <span className="text-slate-700 dark:text-slate-300">{anom.reconstruction_error}</span>
                </div>
                <div className="mt-1">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${
                      anom.status === 'RESOLVED'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : anom.status === 'INVESTIGATING'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {anom.status}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
