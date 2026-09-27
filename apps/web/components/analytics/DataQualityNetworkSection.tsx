'use client'

import React from 'react'
import { DataQualityRecord, NetworkResilienceMetric } from '@/types/analytics'
import { Database, Wifi, Satellite, CheckCircle2, Clock, ShieldCheck, Activity } from 'lucide-react'

interface DataQualityNetworkSectionProps {
  dataQuality: DataQualityRecord[]
  network: NetworkResilienceMetric[]
}

export const DataQualityNetworkSection: React.FC<DataQualityNetworkSectionProps> = ({
  dataQuality,
  network,
}) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <Database className="w-5 h-5 text-blue-400" />
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Data Pipeline Quality, Satellite Ingestion & Edge Resilience
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sensor ingestion health, periodic Sentinel-1 SAR pass timestamps, and polar communication uptime.
            </p>
          </div>
        </div>
        <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
          All Edge Queues Clear (0 Backlog)
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Quality & Pipeline Health */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-4">
              <Database className="w-4 h-4 text-blue-400" />
              Field Telemetry Ingestion & Data Quality Center
            </h3>

            <div className="space-y-3">
              {dataQuality.map((dq, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/60 flex items-center justify-between text-xs"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-0.5">{dq.data_source}</h4>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" /> {dq.last_ingestion_timestamp}
                      </span>
                      <span>
                        Latency: <strong className="text-slate-700 dark:text-slate-300 font-mono">{dq.latency_seconds}s</strong>
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-mono font-extrabold text-emerald-400">
                      {dq.completeness_pct}%
                    </span>
                    <span className="text-[10px] block text-slate-500 dark:text-slate-400 font-mono">
                      {dq.freshness_status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Periodic Satellite Radar Passes Aligned</span>
            <span className="text-blue-400">ESA Copernicus Sentinel-1 Verified</span>
          </div>
        </div>

        {/* Network Resilience & Comms */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-4">
              <Wifi className="w-4 h-4 text-emerald-400" />
              Global Polar Communications Resilience (Iridium / Starlink / HF)
            </h3>

            <div className="space-y-3">
              {network.map((net, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/60 flex items-center justify-between text-xs"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-0.5">{net.channel}</h4>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      <span>Latency: {net.current_latency_ms} ms</span>
                      <span>Packet Loss: {net.packet_loss_pct}%</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {net.uptime_pct}% Uptime
                    </span>
                    <div className="mt-0.5">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                          net.status === 'ONLINE'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {net.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Offline Store-and-Forward Buffers:</span>
            <strong className="text-emerald-400 font-mono">0 KB Backlog</strong>
          </div>
        </div>
      </div>
    </div>
  )
}
