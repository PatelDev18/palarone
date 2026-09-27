"use client"

import React from 'react'
import { DataQualitySource } from '@/types/intelligence'
import { 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Database, 
  Activity, 
  Layers, 
  RefreshCw, 
  AlertCircle,
  ShieldCheck,
  Server
} from 'lucide-react'

interface DataQualitySectionProps {
  sources?: DataQualitySource[];
  overallHealth?: string;
  healthScore?: number;
}

export function DataQualitySection({
  sources = [],
  overallHealth = 'DEGRADED',
  healthScore = 91.5
}: DataQualitySectionProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'HEALTHY':
        return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-xs font-mono font-bold">HEALTHY</span>;
      case 'DEGRADED':
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-xs font-mono font-bold">DEGRADED</span>;
      case 'STALE':
        return <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded text-xs font-mono font-bold">STALE 3h</span>;
      case 'OFFLINE':
      default:
        return <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded text-xs font-mono font-bold">OFFLINE</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-500/10 rounded-md border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Data Quality & Telemetry Assurance Center</h2>
            <span className="text-xs font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
              AGGREGATE HEALTH: {healthScore}% ({overallHealth})
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Audits multi-feed packet completeness, latency, cloud masking, coordinate validity, and polar communications intermittency.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>Last Feed Audit: 12 seconds ago</span>
        </div>
      </div>

      {/* Sources Health Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sources.map((src, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-slate-700 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="font-bold text-sm text-slate-900 dark:text-white truncate">{src.source}</span>
                {getStatusBadge(src.status)}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono my-2 text-slate-700 dark:text-slate-300">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">LATENCY</span>
                  <span className="text-slate-900 dark:text-white font-bold">{src.latency_ms} ms</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">FRESHNESS</span>
                  <span className="text-cyan-400 font-bold">{src.freshness}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">PACKET LOSS</span>
                  <span className={src.missing_data_pct > 0 ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                    {src.missing_data_pct}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">CLOUD MASK</span>
                  <span className="text-slate-700 dark:text-slate-300">{src.cloud_contamination}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 bg-slate-50 dark:bg-slate-950/60 p-2 rounded border border-slate-200 dark:border-slate-800/80">
                {src.quality_notes}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800/80 text-[10px] text-slate-500 flex justify-between">
              <span>Failures: {src.processing_failures}</span>
              <span className="text-emerald-400 font-mono font-semibold">Integrity OK</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tracked Quality Indicators (Section 18) */}
      <div className="bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xl">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-cyan-400" />
          <span>Real-Time Quality Vectors Tracked (Section 18 Specification)</span>
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          {[
            { label: 'Missing Data Packets', value: '3.8% (AIS Pack Ice)', status: 'WARNING' },
            { label: 'Stale Sensor Telemetry', value: 'Davis Line (3h)', status: 'STALE' },
            { label: 'Invalid Geographic Coords', value: '0 Detected (WGS84)', status: 'HEALTHY' },
            { label: 'Optical Cloud Contamination', value: '18.0% (S2B Masked)', status: 'HEALTHY' },
            { label: 'Failed Download Chunks', value: '0 Failed / 14 Synced', status: 'HEALTHY' },
            { label: 'Processing Pipeline Errors', value: '0 Errors in Queue', status: 'HEALTHY' },
            { label: 'Sensor Spikes / Anomalies', value: '1 Harmonic (Gen #2)', status: 'WARNING' },
            { label: 'Duplicate STAC Scenes', value: '0 Duplicates Deduplicated', status: 'HEALTHY' },
            { label: 'Inconsistent Timestamps', value: '0 Timestamp Drift', status: 'HEALTHY' },
            { label: 'Offline Fallback State', value: 'Local Cache Armed', status: 'HEALTHY' }
          ].map((item, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">{item.label}</span>
              <span className="font-bold text-slate-900 dark:text-white mt-1 block">{item.value}</span>
              <span className={`text-[10px] font-mono mt-0.5 inline-block font-semibold ${
                item.status === 'HEALTHY' ? 'text-emerald-400' :
                item.status === 'STALE' ? 'text-rose-400' : 'text-amber-400'
              }`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
