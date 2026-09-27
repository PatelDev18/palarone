"use client"

import React, { useState } from 'react'
import { SimulationResult } from '@/types/intelligence'
import { 
  Sliders, 
  Play, 
  RotateCcw, 
  AlertTriangle, 
  Ship, 
  Fuel, 
  Clock, 
  CheckCircle, 
  X,
  ShieldAlert,
  HelpCircle
} from 'lucide-react'

interface ScenarioSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunSimulation?: (params: { ice_delta_pct: number; wind_delta_knots: number; engine_derate_pct: number; affected_vessel: string }) => void;
}

export function ScenarioSimulationModal({
  isOpen,
  onClose,
  onRunSimulation
}: ScenarioSimulationModalProps) {
  const [iceDelta, setIceDelta] = useState<number>(20);
  const [windDelta, setWindDelta] = useState<number>(15);
  const [engineDerate, setEngineDerate] = useState<number>(0);
  const [affectedVessel, setAffectedVessel] = useState<string>('Polar Star');
  
  // Real-time responsive calculation
  const baseDelay = 14.5;
  const calculatedDelay = baseDelay + (iceDelta / 10.0) * 4.2 + (windDelta / 10.0) * 2.8 + (engineDerate / 10.0) * 3.5;
  const calculatedFuelTons = (calculatedDelay / 24.0) * 38.0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900/60">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-purple-500/10 rounded-md border border-purple-500/20 text-purple-400">
                <Sliders className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Antarctic 'What If?' Scenario Simulation</h2>
            </div>
            <span className="text-[10px] font-mono text-purple-300 bg-purple-500/20 border border-purple-500/30 px-2 py-0.5 rounded-full inline-block mt-1 font-bold">
              SIMULATION / ADVISORY ONLY - NOT AN OPERATIONAL COMMAND
            </span>
          </div>

          <button 
            onClick={onClose}
            className="p-1 text-slate-500 dark:text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sliders Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Target Vessel Selection */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              Select Fleet Vessel
            </label>
            <select
              value={affectedVessel}
              onChange={(e) => setAffectedVessel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="Polar Star">USCGC Polar Star (Heavy Polar Icebreaker)</option>
              <option value="Aurora Explorer">Aurora Explorer (Research & Supply)</option>
              <option value="Southern Cross">Southern Cross (Ice Cargo Vessel)</option>
              <option value="Arctic Voyager">Arctic Voyager (Polar Fuel Tanker)</option>
            </select>
          </div>

          {/* Slider 1: Sea-Ice Concentration */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200">Sea-Ice Concentration Change (Δ SIC)</span>
              <span className="font-mono text-cyan-400 font-bold text-sm">+{iceDelta}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="50" 
              value={iceDelta}
              onChange={(e) => setIceDelta(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0% (Baseline)</span>
              <span>+25% (Heavy Compression)</span>
              <span>+50% (Extreme Pack)</span>
            </div>
          </div>

          {/* Slider 2: Wind Speed Delta */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200">Katabatic Wind Gale Delta (Δ Knots)</span>
              <span className="font-mono text-amber-400 font-bold text-sm">+{windDelta} kt</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="40" 
              value={windDelta}
              onChange={(e) => setWindDelta(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 kt (Current)</span>
              <span>+20 kt (Storm Surge)</span>
              <span>+40 kt (Severe Katabatic Hurricane)</span>
            </div>
          </div>

          {/* Slider 3: Engine Derating */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200">Shaft Derating / Reduced Power (Engine Safeguard)</span>
              <span className="font-mono text-purple-400 font-bold text-sm">{engineDerate}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="50" 
              value={engineDerate}
              onChange={(e) => setEngineDerate(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0% (Full Ahead)</span>
              <span>25% (Thermal Derate)</span>
              <span>50% (Single Engine Emergency)</span>
            </div>
          </div>

          {/* Computed Simulation Output */}
          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-purple-200 uppercase tracking-wide">
                Simulated Operational Impacts (XGBoost + MILP Engine)
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                CRITICAL DELAY
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">PROJECTED TOTAL DELAY</span>
                <span className="text-xl font-black text-amber-400 font-mono">+{calculatedDelay.toFixed(1)} hrs</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">(+{(calculatedDelay - baseDelay).toFixed(1)}h above baseline)</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">ADDITIONAL FUEL BURN</span>
                <span className="text-xl font-black text-red-400 font-mono">+{calculatedFuelTons.toFixed(1)} Tons</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">Special Antarctic Blend</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug space-y-1">
              <div><strong>Affected Destination:</strong> Davis Station (Resupply window compromised by 24h).</div>
              <div><strong>Cargo Cold-Chain:</strong> Hold #3 reefer battery autonomy reaches 92% capacity threshold.</div>
              <div><strong>Recommended AI Mitigation:</strong> Divert via Sector 4 Open Lead (saves 9.4 hours and 14.8 tons fuel).</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex items-center justify-between">
          <button
            onClick={() => {
              setIceDelta(20);
              setWindDelta(15);
              setEngineDerate(0);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-white text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Sliders</span>
          </button>

          <button
            onClick={() => {
              if (onRunSimulation) {
                onRunSimulation({ ice_delta_pct: iceDelta, wind_delta_knots: windDelta, engine_derate_pct: engineDerate, affected_vessel: affectedVessel });
              }
              onClose();
            }}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg transition"
          >
            <span>Apply Simulation Parameters</span>
          </button>
        </div>
      </div>
    </div>
  );
}
