"use client"

import React, { useState } from 'react'
import { PipelineStage } from '@/types/intelligence'
import { 
  CheckCircle, 
  Clock, 
  Cpu, 
  Layers, 
  ChevronRight, 
  Activity, 
  ArrowRight,
  Info,
  Server,
  Zap
} from 'lucide-react'

interface GeospatialPipelineViewerProps {
  stages: PipelineStage[];
  activeStep?: number;
  onStepSelect?: (step: number) => void;
}

export function GeospatialPipelineViewer({
  stages,
  activeStep,
  onStepSelect
}: GeospatialPipelineViewerProps) {
  const [selectedStage, setSelectedStage] = useState<PipelineStage | null>(stages[11] || stages[0] || null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded text-[10px] font-mono">COMPLETED</span>;
      case 'PROCESSING':
        return <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded text-[10px] font-mono animate-pulse">PROCESSING</span>;
      case 'DOWNLOADING':
        return <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-1.5 py-0.5 rounded text-[10px] font-mono">DOWNLOADING</span>;
      case 'QUEUED':
        return <span className="bg-slate-700 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded text-[10px] font-mono">QUEUED</span>;
      case 'FAILED':
        return <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded text-[10px] font-mono">FAILED</span>;
      case 'PARTIAL':
        return <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded text-[10px] font-mono">PARTIAL</span>;
      case 'STALE':
      default:
        return <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 px-1.5 py-0.5 rounded text-[10px] font-mono">STALE</span>;
    }
  };

  return (
    <div className="bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-500/10 rounded-md border border-blue-500/20 text-blue-400">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Geospatial Processing Pipeline</h3>
            <span className="text-xs font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full">
              14 STAGES ACTIVE
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Deterministic ingestion: Raw STAC / SAR / Optical telemetry → Radiometric calibration → ML Risk Engine → Command Dispatch
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Live Ingestion: 28.4 MB/s</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Total Latency: 9.8s</span>
          </div>
        </div>
      </div>

      {/* Horizontal Flow Stages */}
      <div className="overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-slate-800">
        <div className="flex items-center min-w-[1100px] gap-1.5">
          {stages.map((stage, idx) => {
            const isSelected = selectedStage?.step === stage.step;
            return (
              <React.Fragment key={stage.step}>
                <div
                  onClick={() => {
                    setSelectedStage(stage);
                    onStepSelect && onStepSelect(stage.step);
                  }}
                  className={`flex-1 p-2.5 rounded-lg border cursor-pointer transition-all min-w-[130px] flex flex-col justify-between ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] ring-1 ring-blue-400'
                      : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-mono font-bold text-slate-500 dark:text-slate-400">#{stage.step}</span>
                    {stage.status === 'COMPLETED' ? (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Activity className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                    )}
                  </div>
                  
                  <div className="font-semibold text-xs text-slate-900 dark:text-white leading-tight mb-2 truncate" title={stage.label}>
                    {stage.label}
                  </div>

                  <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-200 dark:border-slate-800/80">
                    <span className="font-mono text-slate-500">{stage.duration_ms}ms</span>
                    {getStatusBadge(stage.status)}
                  </div>
                </div>

                {idx < stages.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Selected Stage Detail Drawer */}
      {selectedStage && (
        <div className="mt-3 p-3.5 rounded-lg bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-500/10 rounded border border-blue-500/20 text-blue-400 shrink-0">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-blue-400">Stage {selectedStage.step}: {selectedStage.name}</span>
                {getStatusBadge(selectedStage.status)}
              </div>
              <p className="text-slate-700 dark:text-slate-300 mt-0.5">{selectedStage.details}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 shrink-0">
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-slate-500 uppercase font-mono">Execution Time</span>
              <span className="font-mono text-slate-900 dark:text-white font-semibold">{selectedStage.duration_ms} ms</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-slate-500 uppercase font-mono">Compute Resources</span>
              <span className="font-mono text-emerald-400 font-semibold">4 vCPU / 2GB RAM</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
