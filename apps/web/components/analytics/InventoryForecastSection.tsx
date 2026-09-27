'use client'

import React, { useState } from 'react'
import { InventoryForecastItem } from '@/types/analytics'
import { Boxes, AlertTriangle, CheckCircle2, Calendar, TrendingDown, ArrowRight } from 'lucide-react'

interface InventoryForecastSectionProps {
  inventory: InventoryForecastItem[]
  onSelectItem?: (item: InventoryForecastItem) => void
}

export const InventoryForecastSection: React.FC<InventoryForecastSectionProps> = ({
  inventory,
  onSelectItem,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL')

  const categories = ['ALL', 'Energy / Fuel', 'Medical', 'Life Support', 'Spare Parts']

  const filteredItems =
    filterCategory === 'ALL'
      ? inventory
      : inventory.filter((item) => item.category === filterCategory)

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-slate-200 dark:border-slate-800/80 gap-3">
        <div className="flex items-center gap-2.5">
          <Boxes className="w-5 h-5 text-emerald-400" />
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Supply & Consumables Depletion Intelligence
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Demand forecast (LightGBM) mapping depletion trajectories against scheduled resupply arrivals.
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                filterCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          return (
            <div
              key={item.item_id}
              onClick={() => onSelectItem && onSelectItem(item)}
              className={`p-5 rounded-xl border transition-all flex flex-col justify-between cursor-pointer group ${
                item.shortage_risk
                  ? 'bg-rose-950/20 hover:bg-rose-950/30 border-rose-500/50 shadow-lg shadow-rose-950/20'
                  : 'bg-white dark:bg-slate-900/60 hover:bg-slate-900/90 border-slate-200 dark:border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-700 dark:text-slate-300">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5 group-hover:text-blue-400 transition-colors">
                      {item.item_name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.location}</p>
                  </div>

                  {item.shortage_risk ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                      <AlertTriangle className="w-3 h-3 text-rose-400" />
                      Shortage Warning
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      Secure
                    </span>
                  )}
                </div>

                {/* Current Stock & Burn Rate */}
                <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/60 font-mono text-xs">
                  <div>
                    <span className="text-[10px] font-sans text-slate-500 dark:text-slate-400 block">Current Stock</span>
                    <span className="text-slate-900 dark:text-white font-bold text-sm">
                      {item.current_stock.toLocaleString()}{' '}
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-sans">{item.unit}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-sans text-slate-500 dark:text-slate-400 block">Daily Burn</span>
                    <span className="text-amber-400 font-bold text-sm">
                      {item.daily_burn_rate}{' '}
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-sans">{item.unit}/d</span>
                    </span>
                  </div>
                </div>

                {/* Days Remaining with Confidence Bounds */}
                <div className="mb-4">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Days of Supply Remaining:</span>
                    <span
                      className={`text-base font-extrabold font-mono ${
                        item.shortage_risk ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {item.days_remaining} Days
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>P10: {item.confidence_lower_days}d</span>
                    <span>P90: {item.confidence_upper_days}d</span>
                  </div>
                </div>

                {/* Depletion Date vs Resupply Date */}
                <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-1.5">
                  <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                    <span className="font-sans text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500 dark:text-slate-400" /> Predicted Depletion:
                    </span>
                    <span className={item.shortage_risk ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                      {item.predicted_depletion_date}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                    <span className="font-sans text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-emerald-400" /> Resupply ETA:
                    </span>
                    <span className="text-emerald-400 font-semibold">{item.next_resupply_date}</span>
                  </div>
                </div>
              </div>

              {/* Shortage Risk Action Banner */}
              {item.shortage_risk && (
                <div className="mt-4 p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-[11px] text-rose-300">
                  <strong>Critical Alert:</strong> Stock depletes 3.5 days prior to scheduled vessel resupply arrival. Conservation or emergency air-drop recommended.
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
