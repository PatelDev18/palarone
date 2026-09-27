"use client"

import React, { useState } from 'react'
import { 
  Sparkles, 
  X, 
  Play, 
  ShieldAlert, 
  Ship, 
  Building2, 
  Wind, 
  Radio, 
  Layers, 
  Activity, 
  AlertTriangle 
} from 'lucide-react'

interface SimulationScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerScenario: (scenarioId: number) => Promise<void>;
}

export function SimulationScenarioModal({
  isOpen,
  onClose,
  onTriggerScenario
}: SimulationScenarioModalProps) {
  const [selectedScenarioId, setSelectedScenarioId] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const scenarios = [
    {
      id: 1,
      title: "Dense Sea Ice Ridge Entrapment",
      type: "Sea Ice Obstruction",
      vessel: "Aurora Explorer",
      location: "Mawson Coast Fairway",
      severity: "CRITICAL",
      risk: 89,
      icon: Layers,
      color: "text-red-400",
      description: "Fast-ice shelf blowout creating 2.5m pressure ridges across fairway; vessel speed reduced to 4 knots."
    },
    {
      id: 2,
      title: "Main Engine Turbocharger Blackout",
      type: "Engine Failure",
      vessel: "Southern Cross",
      location: "Queen Maud Land Approaches",
      severity: "CRITICAL",
      risk: 92,
      icon: Ship,
      color: "text-rose-400",
      description: "Loss of main propulsion in freezing drift fairway. Vessel drifting toward shoal at 1.4 knots."
    },
    {
      id: 3,
      title: "Category 2 Polar Low Gale",
      type: "Severe Weather",
      vessel: "Polar Star",
      location: "Prydz Bay High Seas",
      severity: "HIGH",
      risk: 82,
      icon: Wind,
      color: "text-cyan-400",
      description: "Violent polar low generating 55-knot sustained winds and 6m rogue wave swells."
    },
    {
      id: 4,
      title: "Station Main Power Generator Trip",
      type: "Station Infrastructure Failure",
      vessel: "Maitri Base Powerhouse",
      location: "Schirmacher Oasis",
      severity: "CRITICAL",
      risk: 88,
      icon: Building2,
      color: "text-amber-400",
      description: "Diesel fuel gelling caused generator shutdown during -28C ambient temperatures. Habitat on emergency bus."
    },
    {
      id: 5,
      title: "Total Satellite Uplink Blackout",
      type: "Communication Loss",
      vessel: "Inland Traverse Snowcat Alpha",
      location: "Amery Ice Shelf",
      severity: "HIGH",
      risk: 79,
      icon: Radio,
      color: "text-blue-400",
      description: "Solar geomagnetic storm severed Iridium and Inmarsat uplinks for >120 minutes."
    },
    {
      id: 6,
      title: "Compound Fracture MEDEVAC",
      type: "Medical Emergency",
      vessel: "Bharati Base",
      location: "Larsemann Hills",
      severity: "CRITICAL",
      risk: 91,
      icon: Activity,
      color: "text-emerald-400",
      description: "Expedition engineer suffered severe injury during cargo crane offload. Immediate helicopter evacuation required."
    },
    {
      id: 7,
      title: "Arctic Diesel Container Breach",
      type: "Cargo Emergency",
      vessel: "Polar Star Deck Bay 4",
      location: "Prydz Bay Lead",
      severity: "MEDIUM",
      risk: 64,
      icon: AlertTriangle,
      color: "text-yellow-400",
      description: "Structural lashing failure caused fuel tank container shifting. Secondary containment valve activated."
    },
    {
      id: 8,
      title: "Giant Tabular Iceberg Calving (A-84)",
      type: "Satellite Anomaly",
      vessel: "Fairway Alpha",
      location: "Shackleton Ice Shelf",
      severity: "HIGH",
      risk: 85,
      icon: Sparkles,
      color: "text-purple-400",
      description: "Sentinel-1 SAR change detection flagged a 18nm x 6nm tabular iceberg calving directly into navigation fairway."
    }
  ];

  const handleLaunch = async () => {
    setIsLoading(true);
    try {
      await onTriggerScenario(selectedScenarioId);
      onClose();
    } catch (err: any) {
      alert(`Simulation failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0b1329] border border-slate-700 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-[#0f172a] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
                <span>Antarctic Emergency Scenario Simulator</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                  SIMULATION MODE
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Select a scenario to trigger synthetic multi-sensor emergency cascades</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-500 dark:text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scenarios Grid */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1 no-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {scenarios.map(sc => {
              const Icon = sc.icon;
              const isSelected = sc.id === selectedScenarioId;

              return (
                <div
                  key={sc.id}
                  onClick={() => setSelectedScenarioId(sc.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-850 border-blue-500 shadow-md shadow-blue-900/30 ring-1 ring-blue-500'
                      : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-700 hover:bg-slate-850/60'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 px-1.5 py-0.2 rounded bg-slate-800">
                        SCENARIO #{sc.id}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800">
                        {sc.severity} • {sc.risk}/100
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Icon className={`w-4 h-4 ${sc.color} shrink-0`} />
                      <h3 className="text-xs font-bold text-slate-100">{sc.title}</h3>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                      {sc.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-800/80 mt-2">
                    <span>Target: <strong className="text-slate-700 dark:text-slate-300">{sc.vessel}</strong></span>
                    <span>{sc.location}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-[#0f172a] flex items-center justify-between">
          <div className="text-xs font-mono text-amber-400 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" />
            <span>Actions will be isolated to SIMULATION MODE with zero live fleet impact.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold font-mono transition"
            >
              Cancel
            </button>

            <button
              onClick={handleLaunch}
              disabled={isLoading}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold font-mono shadow-md shadow-red-900/30 transition flex items-center gap-2 disabled:opacity-50"
            >
              <Play className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Injecting Synthetic Telemetry...' : 'Launch Simulation'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
