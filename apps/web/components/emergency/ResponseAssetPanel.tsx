"use client"

import React, { useState } from 'react'
import { ResponseAsset } from '@/types/emergency'
import { 
  LifeBuoy, 
  Ship, 
  Plane, 
  Building2, 
  Fuel, 
  Radio, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Send, 
  Eye, 
  Sparkles,
  PhoneCall
} from 'lucide-react'

interface ResponseAssetPanelProps {
  assets: ResponseAsset[];
  onSelectAsset?: (asset: ResponseAsset) => void;
  onRequestDispatchApproval: (asset: ResponseAsset) => void;
  onSimulateDispatch?: (asset: ResponseAsset) => void;
  onContactAsset?: (asset: ResponseAsset) => void;
}

export function ResponseAssetPanel({
  assets,
  onSelectAsset,
  onRequestDispatchApproval,
  onSimulateDispatch,
  onContactAsset
}: ResponseAssetPanelProps) {
  const [selectedAssetId, setSelectedAssetId] = useState<string>(assets[0]?.id || '');

  // Sorted by suitability % descending
  const sortedAssets = [...assets].sort((a, b) => b.suitability_pct - a.suitability_pct);

  const getAssetIcon = (type: string) => {
    if (type.includes('Helicopter') || type.includes('Aircraft')) return Plane;
    if (type.includes('Station') || type.includes('Base')) return Building2;
    return Ship;
  };

  return (
    <div className="bg-[#0b1329] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <LifeBuoy className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
              <span>Nearby Response Assets & Suitability Engine</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                {assets.length} ASSETS READY
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Multi-criteria asset ranking by distance, ETA, ice class, and fuel margin</p>
          </div>
        </div>

        <div className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded">
          TOP SUITABILITY: {sortedAssets[0]?.suitability_pct || 91}%
        </div>
      </div>

      {/* Recommended Asset Highlight Banner */}
      {sortedAssets[0] && (
        <div className="p-3.5 rounded-lg bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600/30 border border-emerald-400 flex items-center justify-center text-emerald-300">
              <Ship className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-1.5 py-0.2 rounded bg-emerald-900 text-emerald-200 uppercase font-bold text-[9px]">
                  RECOMMENDED DISPATCH
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{sortedAssets[0].name}</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
                {sortedAssets[0].asset_type} • {sortedAssets[0].distance_km} km away (ETA ~{sortedAssets[0].eta_hours}h)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onSimulateDispatch && onSimulateDispatch(sortedAssets[0])}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 transition"
            >
              Simulate Dispatch
            </button>
            <button
              onClick={() => onRequestDispatchApproval(sortedAssets[0])}
              className="px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono shadow-md shadow-emerald-900/30 transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Dispatch</span>
            </button>
          </div>
        </div>
      )}

      {/* Asset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto no-scrollbar pr-1">
        {sortedAssets.map(asset => {
          const Icon = getAssetIcon(asset.asset_type);
          const isSelected = asset.id === selectedAssetId;

          return (
            <div
              key={asset.id}
              onClick={() => {
                setSelectedAssetId(asset.id);
                if (onSelectAsset) onSelectAsset(asset);
              }}
              className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-850 border-blue-500 shadow-md shadow-blue-900/20'
                  : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-700 hover:bg-slate-850/60'
              }`}
            >
              {/* Row 1: Name, Type, Suitability */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100 leading-tight">{asset.name}</h4>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{asset.asset_type}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-extrabold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80">
                    {asset.suitability_pct}% MATCH
                  </span>
                </div>
              </div>

              {/* Row 2: Metrics Grid */}
              <div className="grid grid-cols-4 gap-2 text-[10px] font-mono bg-slate-950/60 p-2 rounded border border-slate-200 dark:border-slate-800/80 mb-2.5">
                <div>
                  <span className="text-slate-500 uppercase block text-[8px]">Distance</span>
                  <span className="text-slate-200 font-semibold">{asset.distance_km} km</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase block text-[8px]">ETA</span>
                  <span className="text-slate-200 font-semibold">{asset.eta_hours} hrs</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase block text-[8px]">Fuel</span>
                  <span className="text-amber-400 font-semibold">{asset.fuel_pct}%</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase block text-[8px]">Status</span>
                  <span className="text-emerald-400 font-semibold">{asset.status}</span>
                </div>
              </div>

              {/* Row 3: Capabilities */}
              <div className="flex flex-wrap gap-1 mb-2.5">
                {asset.capabilities.map((cap, i) => (
                  <span
                    key={i}
                    className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-700/60"
                  >
                    {cap}
                  </span>
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-800/80 text-[11px]">
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                  Mission: {asset.current_mission}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      if (onContactAsset) onContactAsset(asset);
                    }}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-white transition"
                    title="Open Tactical Comms"
                  >
                    <PhoneCall className="w-3 h-3" />
                  </button>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onRequestDispatchApproval(asset);
                    }}
                    className="px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-mono font-bold transition"
                  >
                    Request Dispatch
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
