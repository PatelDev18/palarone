"use client"

import React, { useState } from 'react'
import { IceRegion } from '@/types/intelligence'
import { 
  Snowflake, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Satellite, 
  Compass, 
  ShieldAlert, 
  AlertTriangle,
  ArrowRight,
  Gauge
} from 'lucide-react'

interface IceIntelligenceSectionProps {
  regions: IceRegion[];
  onSelectRegion?: (region: IceRegion) => void;
}

export function IceIntelligenceSection({ regions, onSelectRegion }: IceIntelligenceSectionProps) {
  const [selectedRegion, setSelectedRegion] = useState<IceRegion>(regions[0] || null);

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return <span className="bg-red-500/20 text-red-300 border border-red-500/40 px-2 py-0.5 rounded text-xs font-bold animate-pulse">CRITICAL RISK</span>;
      case 'HIGH':
        return <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded text-xs font-semibold">HIGH RISK</span>;
      case 'MEDIUM':
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-xs font-semibold">MEDIUM RISK</span>;
      case 'LOW':
      default:
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded text-xs font-semibold">LOW RISK</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Headline Card */}
      <div className="bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-cyan-500/10 rounded-md border border-cyan-500/20 text-cyan-400">
                <Snowflake className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Antarctic Sea-Ice Intelligence</h2>
              <span className="text-xs font-mono bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-full font-bold">
                HIGH CONVERGENCE ADVISORY
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Synthetic Aperture Radar (SAR) & Passive Microwave observation of pack concentration, ridge thickness, and drift kinetics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {regions.map((reg) => (
              <button
                key={reg.region_name}
                onClick={() => {
                  setSelectedRegion(reg);
                  onSelectRegion && onSelectRegion(reg);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedRegion.region_name === reg.region_name
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'
                }`}
              >
                {reg.region_name}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Region Detailed Metrics */}
        {selectedRegion && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {/* Concentration Card */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Current Ice Concentration
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black font-mono text-cyan-400">
                    {selectedRegion.current_concentration_pct}%
                  </span>
                  <span className={`text-xs font-bold flex items-center gap-0.5 ${
                    selectedRegion.change_pct > 0 ? 'text-red-400' : 'text-emerald-400'
                  }`}>
                    {selectedRegion.change_pct > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    {selectedRegion.change_pct > 0 ? `+${selectedRegion.change_pct}%` : `${selectedRegion.change_pct}%`}
                  </span>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800/80 mt-3">
                Previous Obs: <span className="font-mono text-slate-900 dark:text-white">{selectedRegion.previous_observation_pct}%</span>
              </div>
            </div>

            {/* Thickness & Class */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Ice Class & Thickness
                </span>
                <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  {selectedRegion.ice_thickness_m} m
                </div>
                <div className="text-xs text-cyan-300 font-medium truncate mt-0.5">
                  {selectedRegion.ice_class}
                </div>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800/80 mt-3">
                Density: <span className="font-mono text-slate-900 dark:text-white">{selectedRegion.ice_density}</span>
              </div>
            </div>

            {/* Drift Kinetics */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Ice Drift Kinetics
                </span>
                <div className="text-xl font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                  <span className="font-mono">{selectedRegion.ice_drift_speed_knots} kt</span>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">@ {selectedRegion.ice_drift_direction_deg}°</span>
                </div>
                <div className="text-xs text-amber-400 font-medium mt-0.5">
                  Anomaly: +{selectedRegion.ice_anomaly_sigma}σ vs Climatology
                </div>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800/80 mt-3">
                Route Hazard: <span className="font-bold text-red-400">{selectedRegion.route_intersection_hazard}</span>
              </div>
            </div>

            {/* Ice Risk Score & Observations */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Ice Risk Score
                  </span>
                  {getRiskBadge(selectedRegion.ice_risk_level)}
                </div>
                <div className="text-3xl font-black font-mono text-red-400 mt-1">
                  {selectedRegion.ice_risk_score} / 100
                </div>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800/80 mt-3 space-y-0.5">
                <div>Last Obs: <span className="text-slate-900 dark:text-white font-mono">{selectedRegion.last_satellite_source}</span></div>
                {selectedRegion.next_expected_observation && (
                  <div>Next Pass: <span className="text-cyan-400 font-mono">In ~9 hrs</span></div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Regional Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {regions.map((reg) => (
          <div
            key={reg.region_name}
            className={`p-4 rounded-xl border bg-slate-900/70 transition-all ${
              selectedRegion.region_name === reg.region_name
                ? 'border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/30'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">{reg.region_name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{reg.notes}</p>
              </div>
              {getRiskBadge(reg.ice_risk_level)}
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 text-xs font-mono">
              <div className="p-2 rounded bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
                <span className="text-slate-500 text-[10px] block">CONCENTRATION</span>
                <span className="text-cyan-400 font-bold">{reg.current_concentration_pct}%</span>
              </div>
              <div className="p-2 rounded bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
                <span className="text-slate-500 text-[10px] block">THICKNESS</span>
                <span className="text-slate-900 dark:text-white font-bold">{reg.ice_thickness_m} m</span>
              </div>
              <div className="p-2 rounded bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
                <span className="text-slate-500 text-[10px] block">AFFECTED VESSEL</span>
                <span className="text-amber-400 font-bold truncate block">{reg.affected_vessel || 'None'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
