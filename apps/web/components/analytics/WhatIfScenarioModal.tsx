'use client'

import React, { useState } from 'react'
import {
  ScenarioSimulationRequest,
  ScenarioSimulationResult,
} from '@/types/analytics'
import { simulateWhatIfScenario } from '@/lib/analytics/api'
import {
  Sliders,
  X,
  Play,
  RotateCcw,
  AlertTriangle,
  Flame,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react'

interface WhatIfScenarioModalProps {
  isOpen: boolean
  onClose: () => void
}

export const WhatIfScenarioModal: React.FC<WhatIfScenarioModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [params, setParams] = useState<ScenarioSimulationRequest>({
    speed_delta_pct: -15.0,
    severe_weather_event: false,
    supply_delay_days: 0,
    generator_derate: false,
  })

  const [result, setResult] = useState<ScenarioSimulationResult | null>(null)
  const [isSimulating, setIsSimulating] = useState<boolean>(false)

  if (!isOpen) return null

  const handleRunSimulation = async () => {
    setIsSimulating(true)
    try {
      const res = await simulateWhatIfScenario(params)
      setResult(res)
    } catch (e) {
      console.error(e)
    } finally {
      setIsSimulating(false)
    }
  }

  const handleReset = () => {
    setParams({
      speed_delta_pct: 0,
      severe_weather_event: false,
      supply_delay_days: 0,
      generator_derate: false,
    })
    setResult(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                What-If Scenario Simulation Center
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Simulate operational adjustments without modifying real-world fleet or station parameters.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Simulation Notice */}
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              <strong>Advisory Sandbox:</strong> Calculations use coupled hydrodynamic and thermal decay models. No physical commands are transmitted to field assets.
            </span>
          </div>

          {/* Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Speed Delta Slider */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-200">Fleet Transit Speed Adjustment</span>
                <span className="font-mono text-blue-400 font-bold">
                  {params.speed_delta_pct > 0 ? '+' : ''}
                  {params.speed_delta_pct}%
                </span>
              </div>
              <input
                type="range"
                min="-25"
                max="25"
                step="5"
                value={params.speed_delta_pct}
                onChange={(e) =>
                  setParams({ ...params, speed_delta_pct: parseFloat(e.target.value) })
                }
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>-25% (Eco-Slow)</span>
                <span>0% (Baseline)</span>
                <span>+25% (Sprint)</span>
              </div>
            </div>

            {/* Resupply Delay Slider */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-200">Resupply Voyage Delay</span>
                <span className="font-mono text-amber-400 font-bold">
                  +{params.supply_delay_days} Days
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="14"
                step="1"
                value={params.supply_delay_days}
                onChange={(e) =>
                  setParams({ ...params, supply_delay_days: parseInt(e.target.value) })
                }
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0 Days</span>
                <span>7 Days</span>
                <span>14 Days (Severe)</span>
              </div>
            </div>

            {/* Severe Weather Event Toggle */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                  Simulate Katabatic Blizzard
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  +40 knot storm gusts across Prydz Bay
                </span>
              </div>
              <input
                type="checkbox"
                checked={params.severe_weather_event}
                onChange={(e) =>
                  setParams({ ...params, severe_weather_event: e.target.checked })
                }
                className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>

            {/* Generator Derate Toggle */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                  Primary Generator Derate
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Force fallback to auxiliary genset
                </span>
              </div>
              <input
                type="checkbox"
                checked={params.generator_derate}
                onChange={(e) =>
                  setParams({ ...params, generator_derate: e.target.checked })
                }
                className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-blue-900/30"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{isSimulating ? 'Computing Trajectory...' : 'Run What-If Simulation'}</span>
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Simulation Output Results */}
          {result && (
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Simulation Outcome Analysis
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{result.simulated_at}</span>
              </div>

              {/* KPI Deltas */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans block">Fuel Variance</span>
                  <span
                    className={`text-base font-bold ${
                      result.fuel_burn_delta_pct > 0 ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    {result.fuel_burn_delta_pct > 0 ? '+' : ''}
                    {result.fuel_burn_delta_pct}%
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans block">Added Transit Delay</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white">
                    +{result.eta_delay_average_hours}h
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans block">At-Risk Bases</span>
                  <span
                    className={`text-base font-bold ${
                      result.high_risk_stations_count > 1 ? 'text-rose-400' : 'text-amber-400'
                    }`}
                  >
                    {result.high_risk_stations_count} Station(s)
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans block">Simulated Risk</span>
                  <span
                    className={`text-base font-bold ${
                      result.overall_operational_risk_score > 40
                        ? 'text-rose-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {result.overall_operational_risk_score}/100
                  </span>
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <span className="text-xs font-bold text-slate-200 block mb-2">
                  Advisory Recommendations:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
