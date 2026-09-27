"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  Cpu,
  Layers,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Activity
} from 'lucide-react';

export function MissionAndTwinIntegration() {
  const [selectedMission, setSelectedMission] = useState<string>('MSN-2026-01');

  const missions = [
    {
      id: 'MSN-2026-01',
      name: 'Amery Ice Shelf Deep Core Drilling',
      status: 'LOGISTICS AT RISK',
      target_station: 'Davis Station',
      assigned_vessel: 'Polar Star',
      primary_cargo: 'CRG-8910 (Arctic Diesel)',
      route: 'R-03',
      deadline: '24 Oct 2026',
      days_to_deadline: 12,
      logistics_dependency: 'Requires 80,000L diesel fuel delivered to Davis Station before deep-drilling generator array can run.',
      risk_level: 'HIGH',
      pipeline: ['Expedition Core Team', 'Polar Star (Vessel)', 'Route R-03', 'Davis Station', 'Ice Core Camp #4']
    },
    {
      id: 'MSN-2026-02',
      name: 'Queen Maud Land Atmospheric Clean Air Campaign',
      status: 'ON TRACK',
      target_station: 'Maitri Station',
      assigned_vessel: 'Aurora Australis II',
      primary_cargo: 'CRG-8912 (Medical / Sensor Cryo)',
      route: 'R-01',
      deadline: '04 Nov 2026',
      days_to_deadline: 23,
      logistics_dependency: 'Requires liquid nitrogen containers & bio-medical staff clearance.',
      risk_level: 'LOW',
      pipeline: ['Atmospheric Scientists', 'Aurora Australis II', 'Route R-01', 'Maitri Station', 'Lidar Array']
    },
    {
      id: 'MSN-2026-03',
      name: 'Larsemann Hills Seismological Mesh Deployment',
      status: 'DELAYED',
      target_station: 'Bharati Station',
      assigned_vessel: 'Kronprins Haakon',
      primary_cargo: 'CRG-8914 (Seismic Spectroscopy)',
      route: 'R-02',
      deadline: '18 Oct 2026',
      days_to_deadline: 6,
      logistics_dependency: 'Requires generator replacement parts (CRG-8913) to ensure continuous power to seismic telemetry uplink.',
      risk_level: 'CRITICAL',
      pipeline: ['Geophysics Squad', 'Kronprins Haakon', 'Route R-02', 'Bharati Station', 'Seismic Vault']
    }
  ];

  const currentMission = missions.find(m => m.id === selectedMission) || missions[0];

  const digitalTwinLinks = [
    {
      entity: 'Polar Star (Heavy Icebreaker)',
      twin_url: '/digital-twin?entity=PolarStar',
      state: 'Operational',
      subsystems: 'Azipod Propulsion, Hull Strain Gauges, Microgrid',
      health: 91,
      maintenance: 'Next drydock in 180 days'
    },
    {
      entity: 'Aurora Australis II (Research Vessel)',
      twin_url: '/digital-twin?entity=AuroraAustralis',
      state: 'Operational',
      subsystems: 'Labs, Reefer Hold #1, Dynamic Positioning',
      health: 96,
      maintenance: 'Routine lube oil test OK'
    },
    {
      entity: 'Davis Station Microgrid Twin',
      twin_url: '/digital-twin?entity=DavisStation',
      state: 'High Load (Winter Peak)',
      subsystems: 'Caterpillar Generator Array, Fuel Line Heat Trace',
      health: 84,
      maintenance: 'Injector overhaul due after fuel resupply'
    },
    {
      entity: 'Bharati Station Diesel Array',
      twin_url: '/digital-twin?entity=BharatiStation',
      state: 'Maintenance Needed',
      subsystems: 'Scania Genset #3, Heat Recovery Exchanger',
      health: 72,
      maintenance: 'Awaiting CRG-8913 spare parts'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-8">
      {/* ------------------------------------------------------------- */}
      {/* MISSION / EXPEDITION LOGISTICS INTEGRATION (SECTION 20) */}
      {/* ------------------------------------------------------------- */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 backdrop-blur-sm shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Compass className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Mission & Expedition Logistics</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Expedition dependencies, timelines, and critical path tracking</p>
              </div>
            </div>
            <Link
              href="/expeditions"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>Expeditions</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mission Selector */}
          <div className="grid grid-cols-3 gap-2 my-4">
            {missions.map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedMission(m.id)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedMission === m.id
                    ? 'bg-blue-600/20 border-blue-500 text-white'
                    : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="font-mono text-[10px] text-blue-400 font-bold">{m.id}</div>
                <div className="text-xs font-bold truncate mt-0.5">{m.name}</div>
              </button>
            ))}
          </div>

          {/* Selected Mission Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">{currentMission.name}</h4>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  currentMission.risk_level === 'CRITICAL'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : currentMission.risk_level === 'HIGH'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {currentMission.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500 dark:text-slate-400">Target Station:</span>
                <p className="font-semibold text-slate-200">{currentMission.target_station}</p>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Assigned Vessel:</span>
                <p className="font-semibold text-cyan-300">{currentMission.assigned_vessel}</p>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Supply Dependency:</span>
                <p className="font-semibold text-purple-300">{currentMission.primary_cargo}</p>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Deployment Deadline:</span>
                <p className="font-semibold text-amber-300">{currentMission.deadline} ({currentMission.days_to_deadline}d remaining)</p>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-white block mb-0.5">Critical Dependency Gate:</span>
              {currentMission.logistics_dependency}
            </div>

            {/* Pipeline Step Chain */}
            <div className="pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                Supply Chain Lineage
              </span>
              <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                {currentMission.pipeline.map((step, idx) => (
                  <React.Fragment key={idx}>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                      {step}
                    </span>
                    {idx < currentMission.pipeline.length - 1 && (
                      <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* DIGITAL TWIN INTEGRATION (SECTION 21) */}
      {/* ------------------------------------------------------------- */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 backdrop-blur-sm shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Digital Twin Integration</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Physical-to-digital telemetry & component health bridges</p>
              </div>
            </div>
            <Link
              href="/digital-twin"
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <span>Digital Twin</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3 my-4">
            {digitalTwinLinks.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-200 dark:border-slate-800 hover:border-purple-500/40 transition-colors text-xs flex flex-col justify-between gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{item.entity}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.health > 90 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    item.health > 80 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {item.state} ({item.health}%)
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="text-slate-500">Subsystems: </span>{item.subsystems}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-800 text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400">{item.maintenance}</span>
                  <Link
                    href={item.twin_url}
                    className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 text-[11px]"
                  >
                    <span>Inspect Twin</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
