"use client"

import React, { useState } from 'react'
import { VesselIntelligence } from '@/types/intelligence'
import { 
  Ship, 
  Satellite, 
  Snowflake, 
  CloudRain, 
  Clock, 
  ShieldAlert, 
  ArrowRight,
  ExternalLink,
  Cpu,
  Activity
} from 'lucide-react'
import Link from 'next/link'

interface VesselFusionSectionProps {
  vessels: VesselIntelligence[];
  onSelectVessel?: (vessel: VesselIntelligence) => void;
}

export function VesselFusionSection({ vessels, onSelectVessel }: VesselFusionSectionProps) {
  const [selectedVessel, setSelectedVessel] = useState<VesselIntelligence>(vessels[0] || null);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'CRITICAL': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'HIGH': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'MEDIUM': return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
      case 'LOW':
      default: return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-500/10 rounded-md border border-blue-500/20 text-blue-400">
              <Ship className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Vessel + Satellite Multi-Source Fusion</h2>
            <span className="text-xs font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full">
              FLEET AIS + SAR REAL-TIME
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Correlates live vessel navigation telemetry, engine load, satellite SAR ice roughness, and XGBoost ETA delay projections.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/command-center"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-blue-400 hover:text-white hover:border-slate-700 transition"
          >
            <span>Command Center</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
          <Link
            href="/logistics/ships"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-amber-400 hover:text-white hover:border-slate-700 transition"
          >
            <span>Ship Logistics</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Fleet Fusion Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vessels.map((vessel) => {
          const isSelected = selectedVessel?.id === vessel.id;
          return (
            <div
              key={vessel.id}
              onClick={() => {
                setSelectedVessel(vessel);
                onSelectVessel && onSelectVessel(vessel);
              }}
              className={`p-5 rounded-xl border bg-white dark:bg-slate-900/80 cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.25)] ring-1 ring-blue-500/40'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <div>
                {/* Top Title & Risk */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <Ship className="w-4 h-4 text-blue-400" />
                      <span>{vessel.name}</span>
                    </h3>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{vessel.vessel_type}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getRiskColor(vessel.route_risk_level)}`}>
                    {vessel.route_risk_level} RISK
                  </span>
                </div>

                <div className="text-xs text-slate-700 dark:text-slate-300 font-medium my-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                  {vessel.route}
                </div>

                {/* Key Fusion Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono my-3">
                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
                    <span className="text-slate-500 text-[10px] block">AIS TELEMETRY</span>
                    <span className="text-emerald-400 font-bold">{vessel.ais_status}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-[10px] block mt-0.5">{vessel.speed_knots} kt @ {vessel.heading_deg}°</span>
                  </div>

                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
                    <span className="text-slate-500 text-[10px] block">SATELLITE OBS</span>
                    <span className="text-cyan-400 font-bold">{vessel.satellite_observations.freshness}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-[10px] block mt-0.5">{vessel.satellite_observations.satellite}</span>
                  </div>

                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
                    <span className="text-slate-500 text-[10px] block">SEA ICE HAZARD</span>
                    <span className="text-red-400 font-bold">{vessel.nearby_ice.concentration_pct}% Pack</span>
                    <span className="text-slate-500 dark:text-slate-400 text-[10px] block mt-0.5 truncate">{vessel.nearby_ice.ice_class}</span>
                  </div>

                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
                    <span className="text-slate-500 text-[10px] block">ETA IMPACT (XGB)</span>
                    <span className="text-amber-400 font-bold font-mono">
                      {vessel.predicted_delay_hours > 0 ? `+${vessel.predicted_delay_hours} hrs` : 'On Time'}
                    </span>
                    <span className="text-purple-400 text-[10px] block mt-0.5">Conf: {vessel.ai_confidence_pct}%</span>
                  </div>
                </div>

                {/* Satellite Feature Excerpt */}
                <div className="p-2.5 rounded bg-blue-950/20 border border-blue-900/30 text-[11px] text-blue-200 mt-2">
                  <div className="flex items-center gap-1 font-semibold text-blue-300 mb-0.5">
                    <Satellite className="w-3 h-3 text-cyan-400" />
                    <span>EO Feature Extraction:</span>
                  </div>
                  <span className="italic">{vessel.satellite_observations.detected_feature}</span>
                </div>

                {/* Anomaly Indicators */}
                {vessel.anomaly_indicators.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {vessel.anomaly_indicators.map((anom, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[10px] text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded">
                        <Activity className="w-3 h-3 text-amber-400 shrink-0" />
                        <span className="truncate">{anom.system}: {anom.detail}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800/80 mt-3 text-[10px] text-slate-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  <span>Freshness: {vessel.telemetry_freshness}</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-cyan-400 font-semibold">
                  <span>{vessel.sync_state}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
