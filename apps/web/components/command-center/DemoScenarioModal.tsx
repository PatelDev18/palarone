"use client";

import React from 'react';
import { X, Sparkles, Check, Play, RotateCcw, AlertTriangle, Shield, Wind, Snowflake, Radio } from 'lucide-react';

interface DemoScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeScenarioId: string;
  onSelectScenario: (scenarioId: string) => void;
}

export function DemoScenarioModal({
  isOpen,
  onClose,
  activeScenarioId,
  onSelectScenario,
}: DemoScenarioModalProps) {
  if (!isOpen) return null;

  const scenarios = [
    {
      id: 'SCENARIO_1_NORMAL',
      title: 'Scenario 1: Normal Operations',
      badge: 'NOMINAL',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      description: 'All 6 fleet vessels in transit on schedule, nominal telemetry across all stations, benign sea-ice conditions.',
      impact: '0 Active Delays • 0 Critical Incidents • All Feeds Fresh',
    },
    {
      id: 'SCENARIO_2_VESSEL_DELAY',
      title: 'Scenario 2: Vessel Delay (Polar Star)',
      badge: 'DELAY',
      badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      description: 'Polar Star slowed to 6.2 kt in heavy Weddell Sea pack ice; AI predicts +26h arrival delay to Davis Station.',
      impact: 'Polar Star +26h Delay • High Operational Risk • HITL Alternate Route Recommendation',
    },
    {
      id: 'SCENARIO_3_SEA_ICE_THREAT',
      title: 'Scenario 3: Sea Ice Threat',
      badge: 'ICE PACK',
      badgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
      description: 'Rapid pack ice advance towards Maitri transit corridor. S.A. Agulhas II encounters 88% concentration ridge.',
      impact: 'S.A. Agulhas II Speed Drop to 4.8 kt • Compression Warning Generated',
    },
    {
      id: 'SCENARIO_4_WEATHER_ESCALATION',
      title: 'Scenario 4: Weather Escalation (Ross Sea Gale)',
      badge: 'BLIZZARD',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      description: 'Severe Antarctic katabatic blizzard with 56kt sustained winds erupts in the Ross Sea sector. Visibility drops below 400m.',
      impact: 'McMurdo Shore Operations Standby • Gale Alert Dispatched',
    },
    {
      id: 'SCENARIO_5_STATION_CONNECTIVITY_LOSS',
      title: 'Scenario 5: Station Connectivity Loss (Halley VI)',
      badge: 'COMMS DROP',
      badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
      description: 'Halley VI primary Starlink terminal knocked offline by geomagnetic storm; telemetry stale for 48 minutes.',
      impact: '1 Critical Alert • Secondary Iridium Handshake Protocol Triggered',
    },
    {
      id: 'SCENARIO_6_CRITICAL_INCIDENT',
      title: 'Scenario 6: Critical Incident (South Pole Generator)',
      badge: 'EQUIPMENT',
      badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      description: 'Generator #2 abnormal thermal gradient at Amundsen-Scott South Pole Station. Isolation Forest flags 94% anomaly.',
      impact: 'Critical SCADA Telemetry Flagged • Spare Parts Traverse Alert',
    },
    {
      id: 'SCENARIO_7_SATELLITE_OBSERVATION_UPDATE',
      title: 'Scenario 7: Satellite Observation Update (Sentinel-1 SAR)',
      badge: 'SAR INGEST',
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      description: 'New Sentinel-1 SAR swath ingested at 10m GSD. Navigable lead mapped in Weddell Sector 4.',
      impact: 'Swath Overlay Refreshed • Open Lead Alternate Route Recommended',
    },
    {
      id: 'SCENARIO_8_MULTIPLE_SIMULTANEOUS_RISKS',
      title: 'Scenario 8: Multiple Simultaneous Risks',
      badge: 'MULTI-VECTOR',
      badgeColor: 'bg-red-600/30 text-red-300 border-red-500/50',
      description: 'High sea ice delaying Polar Star + Katabatic gale in Ross Sea + Comms drop at Halley VI + Critical medical cargo pending.',
      impact: 'Compound Risk Index 0.88 • Multiple Operational Decisions Required',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 select-none animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-slate-700/80 rounded-xl shadow-2xl max-w-2xl w-full p-5 text-slate-200 space-y-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Trigger Demo Simulation Scenarios
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Select an Antarctic operational condition to update KPIs, Map, Telemetry, and Alerts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Disclaimer */}
        <div className="p-2.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs flex items-center gap-2 shrink-0">
          <Shield className="w-4 h-4 shrink-0" />
          <span>
            DEMO MODE: Updates telemetry and predictions for drill evaluation. Never confuses simulated data with live production records.
          </span>
        </div>

        {/* Scenarios Grid */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {scenarios.map((sc) => {
            const isActive = activeScenarioId === sc.id;
            return (
              <div
                key={sc.id}
                onClick={() => {
                  onSelectScenario(sc.id);
                  onClose();
                }}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  isActive
                    ? 'bg-blue-950/40 border-blue-500 shadow-md'
                    : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-200 dark:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-100">{sc.title}</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${sc.badgeColor}`}>
                      {sc.badge}
                    </span>
                  </div>
                  {isActive ? (
                    <span className="text-[10px] font-mono font-bold text-blue-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> ACTIVE
                    </span>
                  ) : (
                    <button className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 hover:bg-blue-600 text-slate-700 dark:text-slate-300 hover:text-white transition-colors">
                      Run Scenario
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{sc.description}</p>
                <div className="text-[10px] font-mono text-cyan-400/90 mt-1.5 pt-1.5 border-t border-slate-200 dark:border-slate-800/80">
                  Impact: {sc.impact}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <button
            onClick={() => {
              onSelectScenario('SCENARIO_1_NORMAL');
              onClose();
            }}
            className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Live (Nominal)
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
