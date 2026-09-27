"use client"

import React, { useState } from 'react';
import { StationSupply } from '@/types/logistics';
import { Database, TrendingDown, AlertTriangle, ShieldCheck, Flame, Sparkles, Calendar, ChevronRight } from 'lucide-react';

interface Props {
  stations: StationSupply[];
}

export function InventoryForecastPanel({ stations }: Props) {
  const [selectedStationId, setSelectedStationId] = useState<string>(stations[0]?.id || 's1');

  const stationData = stations.find(s => s.id === selectedStationId) || stations[0];

  const inventoryItems = [
    {
      category: 'Arctic Diesel Fuel',
      currentStock: selectedStationId === 's1' ? '42,000 L' : selectedStationId === 's2' ? '68,000 L' : '48,000 L',
      consumption: selectedStationId === 's1' ? '3,800 L/day' : selectedStationId === 's2' ? '2,400 L/day' : '3,200 L/day',
      daysRemaining: stationData?.coverage.fuel_days ?? 8.5,
      predictedStockout: '22 Oct 2026',
      reorderPoint: '50,000 L',
      nextShipment: 'Polar Star (CRG-8910 in 5.4d)',
      risk: (stationData?.coverage.fuel_days ?? 8.5) < 10 ? 'CRITICAL' : 'WARNING',
      model: 'LightGBM Demand Forecast (LGBM_DEMAND_01)'
    },
    {
      category: 'Freeze-Dried & Winter Rations',
      currentStock: '18,500 kg',
      consumption: '450 kg/day',
      daysRemaining: stationData?.coverage.food_days ?? 42.0,
      predictedStockout: '08 Dec 2026',
      reorderPoint: '12,000 kg',
      nextShipment: 'Aurora Australis II (CRG-8911 in 7.2d)',
      risk: (stationData?.coverage.food_days ?? 42.0) < 25 ? 'WARNING' : 'NORMAL',
      model: 'LightGBM Demand Forecast (LGBM_DEMAND_01)'
    },
    {
      category: 'Medical Cryo-Supplies & Plasma',
      currentStock: '320 units',
      consumption: '12 units/day',
      daysRemaining: stationData?.coverage.medical_days ?? 18.0,
      predictedStockout: '15 Nov 2026',
      reorderPoint: '200 units',
      nextShipment: 'Aurora Australis II (CRG-8912 in 7.2d)',
      risk: (stationData?.coverage.medical_days ?? 18.0) < 15 ? 'CRITICAL' : 'NORMAL',
      model: 'LightGBM Demand Forecast (LGBM_DEMAND_01)'
    },
    {
      category: 'Generator & Vehicle Spare Parts',
      currentStock: '14 sets',
      consumption: '0.4 sets/day',
      daysRemaining: stationData?.coverage.spare_parts_days ?? 35.0,
      predictedStockout: '28 Nov 2026',
      reorderPoint: '8 sets',
      nextShipment: 'Kronprins Haakon (CRG-8913 in 4.1d)',
      risk: (stationData?.coverage.spare_parts_days ?? 35.0) < 20 ? 'WARNING' : 'NORMAL',
      model: 'LightGBM Demand Forecast (LGBM_DEMAND_01)'
    }
  ];

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">CRITICAL</span>;
      case 'WARNING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">WARNING</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">NORMAL</span>;
    }
  };

  return (
    <div className="my-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 backdrop-blur-sm p-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Database className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              Station Inventory & Shortage Forecaster
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                LightGBM DEMAND INFERENCE
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Predictive burn rate extrapolation taking into account extreme sub-zero weather, habitat heating, and station populations.
            </p>
          </div>
        </div>

        {/* Station Selector */}
        <div className="flex flex-wrap items-center gap-1.5">
          {stations.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedStationId(s.id)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                selectedStationId === s.id
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                  : 'bg-slate-950 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Station Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 my-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase">{stationData?.name}</h3>
            {getRiskBadge(stationData?.status || 'NORMAL')}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Country: {stationData?.country} • Wintering Personnel: {stationData?.population} • Next Scheduled Replenishment: {stationData?.next_resupply_deadline}
          </p>
        </div>
        <div className="text-xs font-mono text-purple-300 bg-purple-950/40 border border-purple-800/40 px-3 py-1.5 rounded-lg">
          ML Pipeline: LightGBM Demand Forecaster (v2.4)
        </div>
      </div>

      {/* Inventory Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {inventoryItems.map((item, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl border bg-slate-950/70 transition-all flex flex-col justify-between space-y-3 ${
              item.risk === 'CRITICAL' ? 'border-rose-900/60 shadow-sm shadow-rose-950' : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white text-xs">{item.category}</span>
                {getRiskBadge(item.risk)}
              </div>

              <div className="space-y-2 py-3 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Current Stock:</span>
                  <span className="font-bold text-slate-200">{item.currentStock}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Daily Consumption:</span>
                  <span className="font-semibold text-amber-300">{item.consumption}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Days Remaining:</span>
                  <span className={`font-bold text-sm ${item.daysRemaining < 10 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {item.daysRemaining} days
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Predicted Stockout:</span>
                  <span className="font-semibold text-rose-300">{item.predictedStockout}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Reorder Threshold:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{item.reorderPoint}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] space-y-1">
              <div className="text-slate-500 dark:text-slate-400 truncate">
                <span className="text-slate-500 font-medium">Inbound: </span>
                <span className="text-blue-300">{item.nextShipment}</span>
              </div>
              <div className="text-purple-400/80 font-mono truncate">{item.model}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
