"use client";

import React, { useState, useEffect } from 'react';
import {
  X,
  Activity,
  Layers,
  Link2,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  Clock,
  Compass,
  Cpu,
  Database,
  ArrowRight,
  ArrowLeft,
  Flame,
  BrainCircuit,
  Sliders,
  Play
} from 'lucide-react';
import { DigitalTwinNode } from '@/types/digital-twin';
import { digitalTwinApi } from '@/lib/api/digital-twin';

interface NodeDetailsPanelProps {
  nodeId: string | null;
  onClose: () => void;
  onSelectNode: (id: string) => void;
  onSimulateNode: (nodeId: string, nodeName: string) => void;
}

export function NodeDetailsPanel({
  nodeId,
  onClose,
  onSelectNode,
  onSimulateNode
}: NodeDetailsPanelProps) {
  const [node, setNode] = useState<DigitalTwinNode | null>(null);
  const [dependencies, setDependencies] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'DEPENDENCIES' | 'PREDICTION' | 'SOURCES'>('OVERVIEW');

  useEffect(() => {
    if (!nodeId) {
      setNode(null);
      setDependencies(null);
      return;
    }

    let isMounted = true;
    setLoading(true);

    Promise.all([
      digitalTwinApi.getNode(nodeId),
      digitalTwinApi.getDependencies(nodeId)
    ]).then(([nodeData, depData]) => {
      if (!isMounted) return;
      setNode(nodeData);
      setDependencies(depData);
      setLoading(false);
    }).catch((err) => {
      console.error('Failed to load node details:', err);
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [nodeId]);

  if (!nodeId) return null;

  return (
    <div className="absolute top-0 right-0 bottom-0 w-80 sm:w-96 bg-white/95 dark:bg-slate-950/95 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-20 flex flex-col backdrop-blur-md select-none animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-2 shrink-0 bg-slate-50 dark:bg-slate-900/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-700">
              {node?.category || 'NODE'}
            </span>
            {node?.status === 'CRITICAL' ? (
              <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800 animate-pulse">
                <AlertOctagon className="w-3 h-3 text-red-500" />
                CRITICAL ALERT
              </span>
            ) : node?.status === 'WARNING' ? (
              <span className="flex items-center gap-1 text-[10px] font-mono font-semibold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                <AlertTriangle className="w-3 h-3 text-amber-500" />
                WARNING
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                NORMAL
              </span>
            )}
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono tracking-tight">
            {node?.label || nodeId}
          </h3>
          <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400 mt-0.5 truncate">
            ID: <span className="text-cyan-400">{node?.id || nodeId}</span>
          </p>
        </div>

        <button
          onClick={onClose}
          className="text-slate-600 dark:text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Health Score Strip */}
      {node && (
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800/80 shrink-0">
          <div className="flex items-center justify-between text-xs font-mono mb-1">
            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              Operational Health Index
            </span>
            <span
              className={`font-bold ${
                node.health_score < 50
                  ? 'text-red-400'
                  : node.health_score < 75
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {node.health_score} / 100
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                node.health_score < 50
                  ? 'bg-red-500'
                  : node.health_score < 75
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.max(5, Math.min(100, node.health_score))}%` }}
            />
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-950 shrink-0 text-xs font-mono">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`flex-1 py-2 text-center transition-colors border-b-2 ${
            activeTab === 'OVERVIEW'
              ? 'border-cyan-400 text-cyan-300 font-bold bg-slate-50 dark:bg-slate-900/40'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-200'
          }`}
        >
          Telemetry
        </button>
        <button
          onClick={() => setActiveTab('DEPENDENCIES')}
          className={`flex-1 py-2 text-center transition-colors border-b-2 ${
            activeTab === 'DEPENDENCIES'
              ? 'border-cyan-400 text-cyan-300 font-bold bg-slate-50 dark:bg-slate-900/40'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-200'
          }`}
        >
          Dependencies
        </button>
        <button
          onClick={() => setActiveTab('PREDICTION')}
          className={`flex-1 py-2 text-center transition-colors border-b-2 ${
            activeTab === 'PREDICTION'
              ? 'border-cyan-400 text-cyan-300 font-bold bg-slate-50 dark:bg-slate-900/40'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-200'
          }`}
        >
          ML Risk
        </button>
        <button
          onClick={() => setActiveTab('SOURCES')}
          className={`flex-1 py-2 text-center transition-colors border-b-2 ${
            activeTab === 'SOURCES'
              ? 'border-cyan-400 text-cyan-300 font-bold bg-slate-50 dark:bg-slate-900/40'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-200'
          }`}
        >
          Sources
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-mono">
        {loading ? (
          <div className="flex items-center justify-center h-48 text-slate-600 dark:text-slate-400">
            <Activity className="w-5 h-5 animate-spin mr-2 text-cyan-400" />
            Loading node graph telemetry...
          </div>
        ) : !node ? (
          <div className="p-4 text-slate-600 dark:text-slate-400 text-center">Node data unavailable</div>
        ) : activeTab === 'OVERVIEW' ? (
          <div className="space-y-4">
            {/* Live Properties Matrix */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                Operational Telemetry
              </span>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(node.properties || {}).map(([key, val]) => (
                  <div key={key} className="bg-slate-900/80 p-2 rounded border border-slate-200 dark:border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase tracking-tight truncate">
                      {key.replace(/_/g, ' ')}
                    </div>
                    <div className="text-slate-200 font-bold truncate mt-0.5">
                      {Array.isArray(val) ? val.join(', ') : String(val)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action: Trigger Simulation */}
            <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-800/60 space-y-2">
              <div className="flex items-center gap-1.5 text-blue-300 font-bold">
                <Play className="w-3.5 h-3.5 text-blue-400" />
                What-If Failure Simulation
              </div>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 font-sans">
                Model the downstream operational ripple if <strong className="text-slate-900 dark:text-white">{node.label}</strong> fails or is delayed.
              </p>
              <button
                onClick={() => onSimulateNode(node.id, node.label)}
                className="w-full py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Launch Sandbox Simulation
              </button>
            </div>
          </div>
        ) : activeTab === 'DEPENDENCIES' ? (
          <div className="space-y-4">
            {/* Upstream Dependencies */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1">
                  <ArrowLeft className="w-3 h-3 text-cyan-400" />
                  Relies On (Upstream)
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {dependencies?.upstream_dependencies?.length || 0} links
                </span>
              </div>

              {dependencies?.upstream_dependencies?.length === 0 ? (
                <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded border border-slate-200 dark:border-slate-800 text-slate-500 text-center">
                  Root entity (no upstream dependencies)
                </div>
              ) : (
                <div className="space-y-1.5">
                  {dependencies?.upstream_dependencies?.map((dep: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => onSelectNode(dep.node.id)}
                      className="w-full text-left p-2 rounded bg-slate-900/80 hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between transition-colors group"
                    >
                      <div>
                        <div className="font-bold text-slate-200 group-hover:text-cyan-300 truncate">
                          {dep.node.label}
                        </div>
                        <div className="text-[10px] text-cyan-400 flex items-center gap-1">
                          ← {dep.relationship}
                        </div>
                      </div>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                        dep.status === 'CRITICAL' ? 'bg-red-950 text-red-400' :
                        dep.status === 'DELAYED' ? 'bg-amber-950 text-amber-400' :
                        'bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {dep.status}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Downstream Dependencies */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-blue-400" />
                  Powers / Resupplies (Downstream)
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {dependencies?.downstream_dependencies?.length || 0} links
                </span>
              </div>

              {dependencies?.downstream_dependencies?.length === 0 ? (
                <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded border border-slate-200 dark:border-slate-800 text-slate-500 text-center">
                  Terminal entity (no downstream dependents)
                </div>
              ) : (
                <div className="space-y-1.5">
                  {dependencies?.downstream_dependencies?.map((dep: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => onSelectNode(dep.node.id)}
                      className="w-full text-left p-2 rounded bg-slate-900/80 hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between transition-colors group"
                    >
                      <div>
                        <div className="font-bold text-slate-200 group-hover:text-blue-300 truncate">
                          {dep.node.label}
                        </div>
                        <div className="text-[10px] text-blue-400 flex items-center gap-1">
                          → {dep.relationship}
                        </div>
                      </div>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                        dep.status === 'CRITICAL' ? 'bg-red-950 text-red-400' :
                        dep.status === 'DELAYED' ? 'bg-amber-950 text-amber-400' :
                        'bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {dep.status}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'PREDICTION' ? (
          <div className="space-y-3">
            {node.risk ? (
              <>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400 text-[10px] uppercase">Assigned Model</span>
                    <span className="text-cyan-400 font-bold">{node.risk.model}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400 text-[10px] uppercase">Confidence</span>
                    <span className="text-emerald-400 font-bold">{(node.risk.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400 text-[10px] uppercase">Horizon</span>
                    <span className="text-amber-400 font-bold">{node.risk.horizon}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1">
                    <BrainCircuit className="w-3 h-3 text-purple-400" />
                    Feature Weights & Explainability
                  </span>
                  <div className="space-y-2">
                    {node.risk.contributing_factors?.map((factor, idx) => (
                      <div key={idx} className="p-2 rounded bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-200 font-medium">{factor.factor}</span>
                          <span className="text-cyan-400 font-bold font-mono">{(factor.weight * 100).toFixed(0)}% weight</span>
                        </div>
                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-cyan-500 rounded-full"
                            style={{ width: `${factor.weight * 100}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-amber-400/90 font-mono">
                          Impact: {factor.impact}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded border border-slate-200 dark:border-slate-800 text-slate-500 text-center">
                Nominal state — no active ML anomaly or survival risk flagged.
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 text-[10px] uppercase">Telemetry Ingest</span>
                <span className="text-slate-200 font-bold">{node.data_source}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 text-[10px] uppercase">Data Freshness</span>
                <span className="text-emerald-400 font-bold">{node.freshness}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 text-[10px] uppercase">Last Updated</span>
                <span className="text-slate-700 dark:text-slate-300 font-mono">{node.last_update.slice(11, 19)} UTC</span>
              </div>
            </div>

            <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              Ground-truth guarantee: Telemetry is continuously reconciled with satellite radar (SAR) passes and physical IoT sensors.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
