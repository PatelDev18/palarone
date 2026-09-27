"use client"

import React, { useState } from 'react';
import { Package, RefreshCw, Radio, Cloud, Satellite, Database, CheckCircle2, AlertCircle } from 'lucide-react';
import { SyncStatus } from '@/types/logistics';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

interface Props {
  syncStatus: SyncStatus;
  offlineMode: boolean;
  onRefresh: () => Promise<void>;
}

export function LogisticsHeader({ syncStatus, offlineMode, onRefresh }: Props) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setTimeout(() => setRefreshing(false), 600);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-200 dark:border-slate-800/80 transition-colors duration-150">
      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-500 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Global Logistics Hub
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20 tracking-wider">
                CONTROL TOWER
              </span>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20">
                SIMULATION DATA
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
              Integrated supply chain, tracking, routing, and inventory forecasting.
            </p>
          </div>
        </div>
      </div>

      {/* Telemetry / Data Synchronization Status Panel */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 shadow-sm dark:shadow-inner">
        <div className="flex flex-col mr-1">
          <span className="text-[10px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">
            Telemetry Sync
          </span>
          <span className="text-xs text-slate-700 dark:text-slate-300 font-mono flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${offlineMode ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 animate-ping'}`} />
            {offlineMode ? 'CACHED / OFFLINE' : 'ALL FEEDS ACTIVE'}
          </span>
        </div>

        <div className="h-7 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block" />

        <div className="flex items-center gap-3 text-xs">
          {/* AIS Feed */}
          <div className="flex items-center gap-1.5" title="AIS Live Transponder Status">
            <Radio className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">AIS:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{syncStatus.ais}</span>
          </div>

          {/* Weather Feed */}
          <div className="flex items-center gap-1.5" title="ECMWF & NOAA Polar Meteorological Grid">
            <Cloud className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">Weather:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{syncStatus.weather}</span>
          </div>

          {/* Satellite */}
          <div className="flex items-center gap-1.5" title="Sentinel-1 SAR & Optical Staging">
            <Satellite className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">Satellite:</span>
            <span className="font-semibold text-purple-600 dark:text-purple-300">{syncStatus.satellite}</span>
          </div>

          {/* Inventory */}
          <div className="flex items-center gap-1.5" title="Station Microgrid & Tank Telemetry">
            <Database className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">Inventory:</span>
            <span className="font-semibold text-amber-600 dark:text-amber-300">{syncStatus.inventory}</span>
          </div>
        </div>

        <div className="h-7 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block" />

        {/* Refresh Action */}
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-all disabled:opacity-50"
          title="Refresh logistics telemetry from providers"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-blue-500 dark:text-blue-400 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Syncing...' : 'Refresh Data'}</span>
        </button>

        {/* Global Theme Toggle */}
        <ThemeToggle mode="dropdown" className="shrink-0" />
      </div>
    </div>
  );
}
