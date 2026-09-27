"use client"

import React, { useState } from 'react';
import { CargoItem } from '@/types/logistics';
import {
  Factory,
  Anchor,
  Ship,
  Navigation,
  Building2,
  Database,
  ArrowRight,
  Package,
  Clock,
  AlertTriangle,
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';

interface Props {
  cargo: CargoItem[];
}

export function CargoFlowVisualization({ cargo }: Props) {
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  const filteredCargo = selectedFilter === 'ALL'
    ? cargo
    : cargo.filter(c => c.category.toUpperCase() === selectedFilter.toUpperCase() || c.priority === selectedFilter);

  const stages = [
    { label: 'SUPPLIER', icon: Factory, color: 'text-slate-500 dark:text-slate-400', bg: 'bg-slate-800' },
    { label: 'PORT', icon: Anchor, color: 'text-amber-400', bg: 'bg-amber-950/40' },
    { label: 'VESSEL', icon: Ship, color: 'text-blue-400', bg: 'bg-blue-950/40' },
    { label: 'TRANSIT', icon: Navigation, color: 'text-cyan-400', bg: 'bg-cyan-950/40' },
    { label: 'STATION', icon: Building2, color: 'text-purple-400', bg: 'bg-purple-950/40' },
    { label: 'INVENTORY', icon: Database, color: 'text-emerald-400', bg: 'bg-emerald-950/40' }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'IN TRANSIT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">IN TRANSIT</span>;
      case 'DELAYED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">DELAYED</span>;
      case 'LOADING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">LOADING</span>;
      case 'DELIVERED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">DELIVERED</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-700">PLANNED</span>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return <span className="text-[10px] font-black text-rose-400 uppercase">CRITICAL PRIORITY</span>;
      case 'HIGH':
        return <span className="text-[10px] font-bold text-amber-400 uppercase">HIGH PRIORITY</span>;
      default:
        return <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase">{priority} PRIORITY</span>;
    }
  };

  return (
    <div className="my-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 backdrop-blur-sm p-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Package className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              End-to-End Cargo Flow Pipeline
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                SUPPLY CHAIN STAGES
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live tracking from global suppliers through port staging, polar vessel transit, and station inventory integration.
            </p>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {['ALL', 'CRITICAL', 'FUEL', 'FOOD', 'MEDICAL', 'SPARE PARTS'].map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFilter(f)}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors ${
                selectedFilter === f
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-slate-950 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Pipeline Flow Header */}
      <div className="hidden md:flex items-center justify-between my-6 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          return (
            <React.Fragment key={stage.label}>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border border-slate-700/60 ${stage.bg}`}>
                  <Icon className={`w-4 h-4 ${stage.color}`} />
                </div>
                <div className="text-left">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Step 0{idx + 1}</div>
                  <div className="text-xs font-bold text-slate-200">{stage.label}</div>
                </div>
              </div>
              {idx < stages.length - 1 && (
                <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Cargo Shipments Pipeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
        {filteredCargo.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-slate-950/70 border border-slate-200 dark:border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800/80">
                <div>
                  <span className="font-mono text-[11px] text-blue-400 font-bold">{item.id}</span>
                  <div className="font-bold text-slate-900 dark:text-white text-xs mt-0.5 truncate max-w-[200px]">{item.description}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {getStatusBadge(item.status)}
                  {getPriorityBadge(item.priority)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] py-2.5">
                <div>
                  <span className="text-slate-500 block text-[10px]">Weight:</span>
                  <span className="font-semibold text-slate-200">{item.weight_tons} tons</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Carrier Vessel:</span>
                  <span className="font-semibold text-cyan-300">{item.vessel}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Origin:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 truncate block">{item.origin}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Destination:</span>
                  <span className="font-semibold text-amber-300 truncate block">{item.destination}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>ETA: {new Date(item.eta).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} UTC</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                {item.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
