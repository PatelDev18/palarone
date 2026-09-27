"use client"

import React, { useState } from 'react';
import {
  BrainCircuit,
  Cpu,
  TrendingDown,
  Activity,
  AlertTriangle,
  GitBranch,
  Route,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

export function PredictiveLogisticsIntelligence() {
  const [activeTab, setActiveTab] = useState<'XGBOOST' | 'LIGHTGBM' | 'ISOLATION_FOREST' | 'AUTOENCODER' | 'SURVIVAL' | 'GRAPH' | 'OR_TOOLS'>('XGBOOST');

  return (
    <div className="my-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 backdrop-blur-sm p-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <BrainCircuit className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              Predictive Logistics Intelligence Layer
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-mono">
                7 ML MODELS ACTIVE
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Explainable AI decision support powered by XGBoost, LightGBM, Deep Autoencoder, Isolation Forest, Survival Analysis, Knowledge Graph & OR-Tools.
            </p>
          </div>
        </div>
      </div>

      {/* Model Selection Tabs */}
      <div className="flex flex-wrap gap-2 my-5">
        {[
          { id: 'XGBOOST', label: 'XGBoost', sub: 'ETA & Delay Regressor', color: 'text-blue-400' },
          { id: 'LIGHTGBM', label: 'LightGBM', sub: 'Demand Forecaster', color: 'text-emerald-400' },
          { id: 'ISOLATION_FOREST', label: 'Isolation Forest', sub: 'Sensor Outlier Detection', color: 'text-amber-400' },
          { id: 'AUTOENCODER', label: 'Autoencoder', sub: 'Multivariate Telemetry', color: 'text-purple-400' },
          { id: 'SURVIVAL', label: 'Survival Analysis', sub: 'Weibull RUL Estimator', color: 'text-rose-400' },
          { id: 'GRAPH', label: 'Knowledge Graph', sub: 'Cascading Impact DAG', color: 'text-cyan-400' },
          { id: 'OR_TOOLS', label: 'Google OR-Tools', sub: 'Constraint VRP Solver', color: 'text-teal-400' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-left border transition-all ${
              activeTab === tab.id
                ? 'bg-slate-800 border-slate-600 shadow-md ring-1 ring-slate-600'
                : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-500 dark:text-slate-400'
            }`}
          >
            <div className={`text-xs font-bold ${activeTab === tab.id ? tab.color : 'text-slate-700 dark:text-slate-300'}`}>
              {tab.label}
            </div>
            <div className="text-[10px] text-slate-500 font-medium">{tab.sub}</div>
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 text-xs">
        {/* ------------------------------------------------------------- */}
        {/* 1. XGBOOST TAB */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'XGBOOST' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="font-bold text-slate-900 dark:text-white text-sm">Polar Star Voyage ETA & Delay Inference</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Model: XGBoost ETA Predictor (v1.3.joblib) • Regressor</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Model Confidence:</span>
                <span className="px-2 py-0.5 rounded font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  87.4% High
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold">Predicted Arrival (ETA)</span>
                <div className="text-lg font-bold text-blue-400">13 Oct 2026 20:15 UTC</div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">Original Scheduled: 12 Oct 2026 14:30 UTC</p>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold">Predicted Delay Delta</span>
                <div className="text-lg font-bold text-rose-400">+1d 5h 45m (+29.8 hrs)</div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">Fuel burn adjustment: +8.2%</p>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold">Operational Impact</span>
                <div className="text-lg font-bold text-amber-300">Station Restock Margin Tight</div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">Reserve cushion: 2.8 days at Davis</p>
              </div>
            </div>

            {/* Explainable Factors (Section 14) */}
            <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="font-bold text-white text-[11px] flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                <span>Explainable Prediction Feature Attribution (SHAP / Feature Weights):</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                <div className="p-2 rounded bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-slate-700 dark:text-slate-300">+ Headwind Drag (42 kts):</span>
                  <span className="font-bold text-blue-400">+14.2 hrs (48% impact)</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-slate-700 dark:text-slate-300">+ Pack Ice (38% density):</span>
                  <span className="font-bold text-cyan-400">+11.6 hrs (39% impact)</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-slate-700 dark:text-slate-300">+ Vessel Speed Variation:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">+4.0 hrs (13% impact)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 2. LIGHTGBM TAB */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'LIGHTGBM' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="font-bold text-slate-900 dark:text-white text-sm">Station Demand & Consumption Forecasting</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Model: LightGBM Gradient Booster (LGBM_DEMAND_01) • Time Series</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Model Confidence:</span>
                <span className="px-2 py-0.5 rounded font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  92.1% High
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 text-[10px]">Davis Diesel Stock</span>
                <div className="text-base font-bold text-rose-400 mt-1">42,000 L</div>
                <p className="text-[10px] text-slate-500">Burn: 3,800 L/day (High)</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 text-[10px]">Predicted Stockout</span>
                <div className="text-base font-bold text-rose-400 mt-1">8.5 Days</div>
                <p className="text-[10px] text-slate-500">Shortage risk: CRITICAL</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 text-[10px]">Maitri Medical Cryo</span>
                <div className="text-base font-bold text-amber-300 mt-1">9.0 Days</div>
                <p className="text-[10px] text-slate-500">Burn: 12 units/day</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 text-[10px]">Bharati Generator Parts</span>
                <div className="text-base font-bold text-amber-300 mt-1">11.0 Days</div>
                <p className="text-[10px] text-slate-500">Scheduled maintenance cycle</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="font-semibold text-slate-900 dark:text-white">Demand Forecast Drivers:</span>
              <p className="text-slate-700 dark:text-slate-300 text-[11px]">
                Sub-zero blizzards (-18.4°C) drive boiler heating loads to peak capacity. Population increased to 94 personnel for polar spring field operations. Reorder buffer recommended: 30-day supply (114,000 L).
              </p>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 3. ISOLATION FOREST TAB */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'ISOLATION_FOREST' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="font-bold text-slate-900 dark:text-white text-sm">Telemetry Sensor Anomaly Isolation</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Model: Isolation Forest (IF_ANOMALY_01) • Unsupervised Outlier Ensemble</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Confidence:</span>
                <span className="px-2 py-0.5 rounded font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  85.0%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 text-[10px]">Monitored Hardware:</span>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">Polar Star Port Main Engine #2</div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Vibration: 15.2 mm/s (Nominal &lt; 8.0)</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 text-[10px]">Anomaly Score:</span>
                <div className="text-sm font-bold text-rose-400 mt-1">0.92 (Threshold: 0.85)</div>
                <p className="text-[10px] text-rose-300">HIGH ANOMALY DETECTED</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 text-[10px]">Recommended Action:</span>
                <div className="text-sm font-bold text-amber-300 mt-1">Throttle Governor Derate 15%</div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Reduce harmonic excitation</p>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 4. AUTOENCODER TAB */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'AUTOENCODER' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="font-bold text-slate-900 dark:text-white text-sm">Deep Autoencoder Multivariate Telemetry Reconstruction</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Model: AE_MULTIVARIATE_TELEMETRY_V2 • Latent Dimension Embedding</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Reconstruction Loss:</span>
                <span className="px-2 py-0.5 rounded font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  0.0914 (Loss Threshold: 0.0820)
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="font-bold text-slate-900 dark:text-white text-xs">Cross-Sensor Reconstruction Disparity:</span>
              <p className="text-slate-700 dark:text-slate-300 text-[11px]">
                The Autoencoder identified a non-linear discrepancy between shaft torque (220 kNm) and fuel flow (460 kg/h). Hull friction has spiked by 24%, indicating heavy sea-ice adhesion on the bow plating or propeller pitch cavitation.
              </p>
              <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                <div className="p-2 rounded bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Powertrain Loop:</span>
                  <div className="font-bold text-amber-300 mt-0.5">WARNING (Drift +8%)</div>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Thermal Loop:</span>
                  <div className="font-bold text-emerald-400 mt-0.5">NOMINAL (84°C)</div>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Shaft Harmonics:</span>
                  <div className="font-bold text-rose-400 mt-0.5">ELEVATED (2.4x baseline)</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 5. SURVIVAL ANALYSIS TAB */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'SURVIVAL' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="font-bold text-slate-900 dark:text-white text-sm">Survival Analysis & Remaining Useful Life (RUL)</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Model: Weibull Degradation Hazard Estimator (WEIBULL_SURVIVAL_RUL_V1)</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Confidence:</span>
                <span className="px-2 py-0.5 rounded font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  89.6%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 text-[10px]">Asset Evaluated:</span>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">Kronprins Haakon Thruster Azipods</div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Duty cycle: 4,800 operating hours</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 text-[10px]">Estimated RUL Remaining:</span>
                <div className="text-base font-bold text-amber-300 mt-1">42.5 Operating Days</div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">30-day failure probability: 28%</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 text-[10px]">Maintenance Protocol:</span>
                <div className="text-sm font-bold text-emerald-400 mt-1">Scheduled Docking in Hobart</div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Bearing replacement pre-allocated</p>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 6. KNOWLEDGE GRAPH TAB */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'GRAPH' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="font-bold text-slate-900 dark:text-white text-sm">Cascading Supply Chain Knowledge Graph</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  VESSEL → ROUTE → STATION → CARGO → INVENTORY → MISSION → DEPENDENCY
                </p>
              </div>
              <span className="px-2 py-0.5 rounded font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                DAG RESOLVER ACTIVE
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="font-bold text-slate-900 dark:text-white text-xs">Cascading Bottleneck Analysis:</span>
              <div className="space-y-2 text-[11px]">
                <div className="flex items-center gap-2 p-2 rounded bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">1</span>
                  <span><strong>Vessel Delay:</strong> Polar Star delayed +28h in Route R-03 by storm front.</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">2</span>
                  <span><strong>Station Stockout Risk:</strong> Davis Station fuel reserves dip to 4.2 days before tanker docking.</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-slate-950 border border-rose-900/40">
                  <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">3</span>
                  <span><strong>Mission Jeopardy:</strong> Amery Ice Shelf Deep Core Drilling rig generators face shutdown risk.</span>
                </div>
              </div>

              <div className="mt-3 p-3 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-[11px] space-y-1">
                <span className="font-bold text-cyan-300">Graph-Recommended Alternative Path:</span>
                <p className="text-slate-700 dark:text-slate-300">
                  Divert Polar Star via Waypoint WP-Echo (12nm North) to gain 32 hours and pre-stage 20,000L LC-130 air-transport buffer from Casey Station if weather worsens.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 7. OR-TOOLS TAB */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'OR_TOOLS' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="font-bold text-slate-900 dark:text-white text-sm">Google OR-Tools Multi-Constraint Route Optimization</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">VRP Solver v7.2 • Integer Programming & Constraint Programming Engine</p>
              </div>
              <span className="px-2 py-0.5 rounded font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                OPTIMIZED PLAN READY
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-slate-500 dark:text-slate-400 uppercase text-[10px]">Original Plan (Pre-Storm)</div>
                <div className="p-2 rounded bg-slate-950 text-slate-700 dark:text-slate-300">
                  Fremantle → Waypoint-Alpha → Waypoint-Bravo (Gale blocked) → Davis Station
                </div>
                <div className="flex justify-between text-[11px] pt-1">
                  <span>Distance: 3,920 km</span>
                  <span className="text-rose-400">Storm Transit Risk: 84%</span>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900 border border-teal-800/40 space-y-2">
                <div className="font-bold text-teal-400 uppercase text-[10px]">OR-Tools Optimized Reroute</div>
                <div className="p-2 rounded bg-slate-950 text-teal-200">
                  Fremantle → Waypoint-Alpha → Waypoint-Echo (North Divert) → Davis Station
                </div>
                <div className="flex justify-between text-[11px] pt-1">
                  <span>Distance: +42 km (+1.1%)</span>
                  <span className="text-emerald-400">Risk Reduced to: 12%</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] space-y-1">
              <span className="font-semibold text-slate-900 dark:text-white">Active Constraints Satisfied:</span>
              <p className="text-slate-700 dark:text-slate-300">
                1. Avoid 45kt gale sector. 2. Obey PC1 minimum ice capability. 3. Ensure Davis delivery before critical reserve threshold. 4. Preserve bunker fuel reserves (+3.4% consumption within acceptable safety envelope).
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
