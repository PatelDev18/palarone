"use client";

import React from 'react';
import {
  ShieldCheck,
  X,
  Radio,
  Clock,
  Database,
  CheckCircle2,
  AlertTriangle,
  Server,
  Layers
} from 'lucide-react';
import { DigitalTwinOverview, DataFreshnessItem } from '@/types/digital-twin';

interface DataHealthModalProps {
  isOpen: boolean;
  onClose: () => void;
  overview: DigitalTwinOverview | null;
}

export function DataHealthModal({ isOpen, onClose, overview }: DataHealthModalProps) {
  if (!isOpen) return null;

  const dataStreams = overview?.data_freshness || {
    ais: { age: "42 sec", state: "FRESH", health_pct: 98 },
    weather: { age: "4 min", state: "FRESH", health_pct: 96 },
    satellite: { age: "2 hr", state: "RECENT", health_pct: 89 },
    iot: { age: "18 min", state: "RECENT", health_pct: 91 },
    inventory: { age: "7 min", state: "FRESH", health_pct: 97 },
    knowledge_graph: { age: "Real-time", state: "FRESH", health_pct: 100 },
    ml_predictions: { age: "5 min", state: "FRESH", health_pct: 94 }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono tracking-wider">
                KNOWLEDGE GRAPH DATA QUALITY & FRESHNESS MATRIX
              </h3>
              <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400">
                Live ingest telemetry status, latency audit, and schema validation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-600 dark:text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Matrix Grid */}
        <div className="p-4 space-y-3 font-mono text-xs overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(dataStreams).map(([streamKey, stream]: [string, DataFreshnessItem]) => {
              const isFresh = stream.state === 'FRESH';
              const isRecent = stream.state === 'RECENT';

              return (
                <div
                  key={streamKey}
                  className="p-3 rounded-lg bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <Server className="w-4 h-4 text-blue-400 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-100 uppercase tracking-wide">
                        {streamKey.replace(/_/g, ' ')}
                      </div>
                      <div className="text-[10px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-500" />
                        Age: <span className="text-slate-700 dark:text-slate-300 font-semibold">{stream.age}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Health % */}
                    <div className="text-right">
                      <div className="text-[10px] text-slate-500 uppercase">Health</div>
                      <div className="text-emerald-400 font-bold">{stream.health_pct}%</div>
                    </div>

                    {/* Freshness Badge */}
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        isFresh
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : isRecent
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {stream.state}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-[11px] font-sans text-slate-600 dark:text-slate-400 leading-relaxed">
            <strong>Graph Integrity Guarantee:</strong> PolarOne Knowledge Graph rejects orphan links or stale transponder feeds older than 24 hours unless explicitly tagged as degraded mode.
          </div>
        </div>
      </div>
    </div>
  );
}
