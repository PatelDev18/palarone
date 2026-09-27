"use client"

import React, { useState } from 'react';
import { Expedition, ScenarioSimulationResult } from '@/types/expedition';
import { simulateScenario } from '@/lib/expedition/api';
import { X, Sparkles, Clock, AlertTriangle, Fuel, ArrowRight, ShieldCheck } from 'lucide-react';

interface ScenarioModalProps {
  expedition: Expedition;
  onClose: () => void;
}

export function ScenarioModal({ expedition, onClose }: ScenarioModalProps) {
  const [scenarioType, setScenarioType] = useState('VESSEL_DELAY');
  const [params, setParams] = useState({ delay_hours: 24, increase_pct: 30 });
  const [result, setResult] = useState<ScenarioSimulationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const res = await simulateScenario(expedition.id, scenarioType, params);
      setResult(res);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-[#0b1329] border border-purple-500/40 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden text-slate-200">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-purple-950/60 to-slate-900 border-b border-purple-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600/30 border border-purple-400/50 flex items-center justify-center text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                WHAT-IF SCENARIO SIMULATION
                <span className="text-[10px] font-mono text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                  {expedition.id}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Predict cascading impacts on ETA, fuel reserves, risk scores, and affected tasks.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px] mb-1.5">
              Select What-if Hypothesis
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'VESSEL_DELAY', label: 'Vessel Delay (+24h)' },
                { id: 'WEATHER_DETERIORATION', label: 'Blizzard Front (+50kt)' },
                { id: 'FUEL_BURN_SPIKE', label: 'Ice Ramming Fuel Surge' },
                { id: 'AIRCRAFT_UNAVAILABLE', label: 'Aircraft Grounded' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setScenarioType(opt.id);
                    setResult(null);
                  }}
                  className={`p-2.5 rounded-lg border text-left font-medium transition-colors ${
                    scenarioType === opt.id
                      ? 'bg-purple-600/20 border-purple-500 text-purple-300 font-bold'
                      : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={handleSimulate}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-purple-950/50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Evaluating Model...' : 'Execute Simulation'}</span>
            </button>
          </div>

          {/* Simulation Output */}
          {result && (
            <div className="bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-3 animate-fadeIn">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white text-sm">{result.title}</span>
                <span className="text-[10px] font-mono text-purple-400">Model: XGB_POLAR_SIM_v2</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white dark:bg-slate-900/60 p-2.5 rounded border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Projected ETA Impact</div>
                  <div className="text-sm font-bold text-rose-400 mt-0.5">{result.simulated_eta}</div>
                </div>

                <div className="bg-white dark:bg-slate-900/60 p-2.5 rounded border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Fuel Reserve Impact</div>
                  <div className="text-sm font-bold text-amber-400 mt-0.5">{result.projected_fuel_remaining}% remaining</div>
                </div>

                <div className="bg-white dark:bg-slate-900/60 p-2.5 rounded border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Risk Score Delta</div>
                  <div className="text-sm font-bold text-rose-300 mt-0.5">{result.risk_score_delta}</div>
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">Affected Mission Tasks:</div>
                <div className="flex flex-wrap gap-1.5">
                  {result.affected_tasks?.map((tsk, i) => (
                    <span key={i} className="bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded text-[11px] border border-slate-700">
                      {tsk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-purple-950/20 border border-purple-500/30 p-2.5 rounded text-purple-200 text-xs">
                <strong>AI Advisory:</strong> {result.recommendation}
              </div>

              <div className="text-[10px] text-slate-500 italic flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                Scenario outcomes are advisory only. PolarOne will not automatically modify active navigation plans.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#070d1e] border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
