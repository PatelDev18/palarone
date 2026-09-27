"use client";

import React from 'react';
import {
  Search,
  Filter,
  X,
  RotateCcw,
  Ship,
  Building2,
  Cpu,
  Package,
  Users,
  HardHat,
  CloudSnow
} from 'lucide-react';
import { NodeCategory } from '@/types/digital-twin';

interface DigitalTwinFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedSeverity: string;
  onSelectSeverity: (sev: string) => void;
  onResetFilters: () => void;
  nodeCountsByCategory: Record<string, number>;
}

const CATEGORIES: Array<{ key: string; label: string; icon: React.ElementType }> = [
  { key: 'ALL', label: 'All Entities', icon: Filter },
  { key: 'SHIP', label: 'Ships', icon: Ship },
  { key: 'STATION', label: 'Stations', icon: Building2 },
  { key: 'EQUIPMENT', label: 'Equipment', icon: Cpu },
  { key: 'CARGO', label: 'Cargo', icon: Package },
  { key: 'PERSONNEL', label: 'Personnel', icon: Users },
  { key: 'INFRASTRUCTURE', label: 'Infra', icon: HardHat },
  { key: 'ENVIRONMENT', label: 'Hazards', icon: CloudSnow },
];

export function DigitalTwinFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  selectedSeverity,
  onSelectSeverity,
  onResetFilters,
  nodeCountsByCategory
}: DigitalTwinFiltersProps) {
  const isFiltered = searchQuery !== '' || selectedCategory !== 'ALL' || selectedSeverity !== 'ALL';

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 bg-white dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 shrink-0">
      {/* Search Input */}
      <div className="relative w-56 sm:w-64">
        <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter graph nodes..."
          className="w-full bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md pl-8 pr-7 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-300"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1 overflow-x-auto pb-0.5 max-w-full">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const count = nodeCountsByCategory[cat.key] ?? (cat.key === 'ALL' ? nodeCountsByCategory.TOTAL || 23 : 0);
          const isSelected = selectedCategory === cat.key;

          return (
            <button
              key={cat.key}
              onClick={() => onSelectCategory(cat.key)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50 shadow-sm font-semibold'
                  : 'bg-slate-950/60 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800/80 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1 rounded ${isSelected ? 'bg-blue-900/60 text-blue-200' : 'bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Severity Filter + Reset */}
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md p-0.5">
          <button
            onClick={() => onSelectSeverity('ALL')}
            className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
              selectedSeverity === 'ALL' ? 'bg-slate-800 text-slate-100 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => onSelectSeverity('CRITICAL')}
            className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
              selectedSeverity === 'CRITICAL' ? 'bg-red-950 text-red-300 border border-red-800 font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-red-400'
            }`}
          >
            Crit
          </button>
          <button
            onClick={() => onSelectSeverity('WARNING')}
            className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
              selectedSeverity === 'WARNING' ? 'bg-amber-950 text-amber-300 border border-amber-800 font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-amber-400'
            }`}
          >
            Warn
          </button>
          <button
            onClick={() => onSelectSeverity('NORMAL')}
            className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
              selectedSeverity === 'NORMAL' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-emerald-400'
            }`}
          >
            OK
          </button>
        </div>

        {isFiltered && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-mono transition-colors"
            title="Reset all filters"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
