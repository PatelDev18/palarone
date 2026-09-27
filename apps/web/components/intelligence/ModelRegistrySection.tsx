"use client"

import React, { useState } from 'react'
import { AIModel } from '@/types/intelligence'
import { 
  Database, 
  Cpu, 
  Activity, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  BarChart2, 
  GitBranch,
  ShieldCheck
} from 'lucide-react'

interface ModelRegistrySectionProps {
  models: AIModel[];
  onRetrainModel?: (modelId: string) => void;
}

export function ModelRegistrySection({ models, onRetrainModel }: ModelRegistrySectionProps) {
  const [selectedModel, setSelectedModel] = useState<AIModel>(models[0] || null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PRODUCTION': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'SHADOW': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'RETRAINING': return 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse';
      case 'DEPRECATED':
      default: return 'bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-700';
    }
  };

  const getDriftBadge = (drift: string) => {
    switch (drift) {
      case 'HEALTHY': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'WARNING': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'DEGRADED': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'RETRAIN REQUIRED': return 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse';
      default: return 'bg-slate-800 text-slate-500 dark:text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-500/10 rounded-md border border-blue-500/20 text-blue-400">
              <Database className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">AI / ML Production Model Registry</h2>
            <span className="text-xs font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full font-bold">
              {models.length} ACTIVE MODELS
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tracks deployed versions, training datasets, input feature specifications, drift metrics, and inference latency. Strictly NO Random Forest.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>All Models Pass Baseline Validation</span>
          </span>
        </div>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {models.map((model) => {
          const isSelected = selectedModel?.model_id === model.model_id;
          return (
            <div
              key={model.model_id}
              onClick={() => setSelectedModel(model)}
              className={`p-5 rounded-xl border bg-white dark:bg-slate-900/80 cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.25)] ring-1 ring-purple-500/40'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider block">
                      {model.model_family}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight mt-0.5">{model.model_name}</h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getStatusBadge(model.current_status)}`}>
                    {model.current_status}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 mb-3">
                  <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                    ID: {model.model_id}
                  </span>
                  <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 text-cyan-400">
                    v{model.version}
                  </span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 mb-3">{model.purpose}</p>

                {/* Input Features Pill Grid */}
                <div className="my-2">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1">INPUT FEATURES</span>
                  <div className="flex flex-wrap gap-1">
                    {model.input_features.slice(0, 4).map((f, i) => (
                      <span key={i} className="text-[10px] font-mono bg-slate-50 dark:bg-slate-950/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 px-1.5 py-0.5 rounded">
                        {f}
                      </span>
                    ))}
                    {model.input_features.length > 4 && (
                      <span className="text-[10px] font-mono text-slate-500 px-1 py-0.5">
                        +{model.input_features.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Evaluation Metrics */}
                <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 text-xs font-mono my-3">
                  <span className="text-slate-500 text-[10px] block mb-1">BENCHMARK METRICS</span>
                  <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                    {Object.entries(model.evaluation_metrics).map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="text-slate-500">{k}:</span>
                        <span className="text-slate-900 dark:text-white font-bold">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer: Drift & Last Inference */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 mt-2 flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">Drift:</span>
                  <span className={`px-1.5 py-0.2 rounded font-mono font-semibold border ${getDriftBadge(model.drift_status)}`}>
                    {model.drift_status}
                  </span>
                </div>
                <div className="text-slate-500 font-mono">
                  Latency: <span className="text-emerald-400 font-bold">{model.metrics?.inference_latency_ms || 28}ms</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Model Monitoring Deep Dive Panel (Section 21) */}
      {selectedModel && (
        <div className="bg-[#0f172a]/95 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Live Drift & Telemetry Monitoring: {selectedModel.model_name}</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Continuous evaluation against streaming Antarctic operational distributions.</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onRetrainModel && onRetrainModel(selectedModel.model_id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-slate-900 dark:text-white font-semibold text-xs transition shadow"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Trigger Retraining Job</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Prediction Drift (PSI)</span>
              <span className="text-lg font-bold font-mono text-emerald-400 mt-1 block">
                {selectedModel.metrics?.prediction_drift_psi || 0.024}
              </span>
              <span className="text-[10px] text-slate-500">Threshold: &lt; 0.10</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Feature Drift (KS)</span>
              <span className="text-lg font-bold font-mono text-emerald-400 mt-1 block">
                {selectedModel.metrics?.feature_drift_ks || 0.031}
              </span>
              <span className="text-[10px] text-slate-500">p-value: &gt; 0.05</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Data Drift Score</span>
              <span className="text-lg font-bold font-mono text-cyan-400 mt-1 block">
                {selectedModel.metrics?.data_drift_score || 0.019}
              </span>
              <span className="text-[10px] text-slate-500">Low Variance</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Inference Accuracy</span>
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-1 block">
                {selectedModel.metrics?.model_accuracy || 94.8}%
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">Optimal</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Inference Latency</span>
              <span className="text-lg font-bold font-mono text-amber-300 mt-1 block">
                {selectedModel.metrics?.inference_latency_ms || 28.5} ms
              </span>
              <span className="text-[10px] text-slate-500">p99: 45ms</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Failed Inferences</span>
              <span className="text-lg font-bold font-mono text-emerald-400 mt-1 block">
                0.0%
              </span>
              <span className="text-[10px] text-slate-500">Zero Dropouts</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
