"use client";

import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Play,
  RotateCcw,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Flame,
  Activity,
  Layers
} from 'lucide-react';
import { WhatIfSimulationResult } from '@/types/digital-twin';
import { digitalTwinApi } from '@/lib/api/digital-twin';

interface WhatIfSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySimulationToGraph: (result: WhatIfSimulationResult) => void;
  initialScenarioKey?: string;
}

const PRESET_SCENARIOS = [
  {
    key: 'generator_failure',
    title: 'Davis Station Generator #2 Complete Failure',
    desc: 'Simulates complete loss of Generator #2 while Polar Star remains delayed.',
    icon: Flame,
    color: 'text-red-400'
  },
  {
    key: 'ship_delay_36h',
    title: 'Polar Star 36-Hour Pack Ice Besetting',
    desc: 'Deep compression ridge delays resupply vessel arrival by 36 hours.',
    icon: Activity,
    color: 'text-amber-400'
  },
  {
    key: 'station_comms_loss',
    title: 'Davis Station Radome / Satellite Comms Loss',
    desc: 'Catastrophic VSAT feed freeze severs real-time SCADA telemetry stream.',
    icon: Layers,
    color: 'text-blue-400'
  },
  {
    key: 'severe_blizzard',
    title: 'Category 4 Katabatic Blizzard Surge (75kt)',
    desc: 'Interior plateau gravitational wind forces fleet heave-to & base lockdown.',
    icon: AlertTriangle,
    color: 'text-sky-400'
  },
  {
    key: 'fuel_shortage',
    title: 'Maitri Station Fuel Pump Cavitation',
    desc: 'Transfer line gelation stops diesel delivery to living quarter boilers.',
    icon: Flame,
    color: 'text-purple-400'
  }
];

export function WhatIfSimulationModal({
  isOpen,
  onClose,
  onApplySimulationToGraph,
  initialScenarioKey = 'generator_failure'
}: WhatIfSimulationModalProps) {
  const [selectedScenarioKey, setSelectedScenarioKey] = useState(initialScenarioKey);
  const [simulationResult, setSimulationResult] = useState<WhatIfSimulationResult | null>(null);
  const [running, setRunning] = useState(false);

  if (!isOpen) return null;

  const handleRunSimulation = async () => {
    setRunning(true);
    try {
      const result = await digitalTwinApi.simulateWhatIf(selectedScenarioKey);
      setSimulationResult(result);
    } catch (err) {
      console.error('Simulation execution failed:', err);
    } finally {
      setRunning(false);
    }
  };

  const handleApplyToGraph = () => {
    if (simulationResult) {
      onApplySimulationToGraph(simulationResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with Prominent Sandbox Warning */}
        <div className="p-4 bg-gradient-to-r from-amber-950/50 via-slate-900 to-slate-900 border-b border-amber-800/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-600/20 border border-amber-500/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono tracking-wider">
                  WHAT-IF SIMULATION SANDBOX
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono font-bold animate-pulse">
                  NON-DESTRUCTIVE
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400">
                Model catastrophic scenarios without modifying real operational telemetry
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
          {/* Scenario Picker */}
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-wider text-slate-600 dark:text-slate-400 font-semibold">
              Select Operational Crisis Scenario
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_SCENARIOS.map((sc) => {
                const Icon = sc.icon;
                const isSelected = selectedScenarioKey === sc.key;

                return (
                  <button
                    key={sc.key}
                    onClick={() => {
                      setSelectedScenarioKey(sc.key);
                      setSimulationResult(null); // clear old result
                    }}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'bg-blue-950/60 border-blue-500 ring-1 ring-blue-500/40 shadow-md'
                        : 'bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:bg-slate-800/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`w-3.5 h-3.5 ${sc.color}`} />
                      <span className="font-bold text-slate-100 text-xs truncate">
                        {sc.title}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 font-sans leading-relaxed line-clamp-2">
                      {sc.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action to Run */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="text-[11px] text-slate-600 dark:text-slate-400 font-sans">
              Applies graph perturbation vectors and calculates multi-order cascading ripple.
            </div>
            <button
              onClick={handleRunSimulation}
              disabled={running}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{running ? 'Running Simulation...' : 'Execute Simulation Run'}</span>
            </button>
          </div>

          {/* Simulation Results Display */}
          {simulationResult && (
            <div className="p-4 rounded-lg bg-slate-950 border border-amber-900/60 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h4 className="font-bold text-slate-100 text-sm">{simulationResult.title}</h4>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400">{simulationResult.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 font-bold">
                    RISK {simulationResult.risk_level}
                  </span>
                  <div className="text-[10px] text-emerald-400 mt-1">
                    Confidence: {simulationResult.confidence_pct}%
                  </div>
                </div>
              </div>

              {/* Multi-Order Impacts */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                <div className="p-2.5 rounded bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-[10px] text-red-400 uppercase font-bold">1st Order Direct Impact</div>
                  <div className="text-[11px] text-slate-700 dark:text-slate-300 font-sans">{simulationResult.direct_impact}</div>
                </div>
                <div className="p-2.5 rounded bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-[10px] text-amber-400 uppercase font-bold">2nd Order Ripple</div>
                  <div className="text-[11px] text-slate-700 dark:text-slate-300 font-sans">{simulationResult.secondary_impact}</div>
                </div>
                <div className="p-2.5 rounded bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-[10px] text-purple-400 uppercase font-bold">3rd Order Ripple</div>
                  <div className="text-[11px] text-slate-700 dark:text-slate-300 font-sans">{simulationResult.third_order_impact}</div>
                </div>
              </div>

              {/* Propagation Chain */}
              <div className="space-y-1.5">
                <div className="text-[10px] uppercase text-slate-600 dark:text-slate-400 font-bold">
                  Cascading Failure Propagation Chain
                </div>
                <div className="flex flex-wrap items-center gap-1.5 p-2.5 rounded bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-[11px]">
                  {simulationResult.impact_chain.map((step, idx) => (
                    <React.Fragment key={idx}>
                      <span className="px-2 py-1 rounded bg-slate-800 text-slate-200 font-bold">
                        {step}
                      </span>
                      {idx < simulationResult.impact_chain.length - 1 && (
                        <ArrowRight className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Recommended Mitigations */}
              <div className="space-y-1.5">
                <div className="text-[10px] uppercase text-blue-400 font-bold">
                  Recommended Action Plan (Human Commander Authorization Required)
                </div>
                <ul className="space-y-1 text-[11px] text-slate-700 dark:text-slate-300 font-sans">
                  {simulationResult.recommended_actions.map((act, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Button to Project on Graph */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleApplyToGraph}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold transition-all shadow-md flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>Project Simulation on Knowledge Graph</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
