"use client"

import React from 'react';
import { Search, Filter, X, LayoutGrid, GitCommit, Map, Calendar } from 'lucide-react';

export type ViewMode = 'cards' | 'timeline' | 'map' | 'calendar';

export interface FilterState {
  search: string;
  status: string;
  risk: string;
  region: string;
  vessel: string;
  lead: string;
  missionType: string;
}

interface ExpeditionFiltersProps {
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onReset: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalCount: number;
  filteredCount: number;
}

export function ExpeditionFilters({
  filters,
  onFilterChange,
  onReset,
  viewMode,
  onViewModeChange,
  totalCount,
  filteredCount
}: ExpeditionFiltersProps) {
  const hasActiveFilters = Boolean(
    filters.search ||
    filters.status ||
    filters.risk ||
    filters.region ||
    filters.vessel ||
    filters.lead ||
    filters.missionType
  );

  return (
    <div className="bg-[#0b1329] border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 mb-6 space-y-3 shadow-md">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search expeditions by ID, name, commander, vessel, coordinates, or science domain..."
            className="w-full bg-[#020617] border border-slate-700/80 rounded-md pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center bg-[#020617] border border-slate-700/80 rounded-md p-0.5 shrink-0">
          <button
            onClick={() => onViewModeChange('cards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
              viewMode === 'cards'
                ? 'bg-blue-600 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Cards
          </button>
          <button
            onClick={() => onViewModeChange('timeline')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
              viewMode === 'timeline'
                ? 'bg-blue-600 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitCommit className="w-3.5 h-3.5" />
            Timeline
          </button>
          <button
            onClick={() => onViewModeChange('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
              viewMode === 'map'
                ? 'bg-blue-600 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-200'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            Map
          </button>
          <button
            onClick={() => onViewModeChange('calendar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
              viewMode === 'calendar'
                ? 'bg-blue-600 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Calendar
          </button>
        </div>
      </div>

      {/* Select Filters Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1 border-t border-slate-200 dark:border-slate-800/80">
        {/* Status */}
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1">Status</label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="w-full bg-[#020617] border border-slate-700/80 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="OPERATIONAL">Operational / In Progress</option>
            <option value="PLANNING">Planning</option>
            <option value="READY FOR APPROVAL">Ready for Approval</option>
            <option value="APPROVED">Approved</option>
            <option value="PRE-DEPARTURE">Pre-Departure</option>
            <option value="BLOCKED">Blocked (Weather/Ice)</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="RETURNING">Returning</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        {/* Risk */}
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1">Risk Level</label>
          <select
            value={filters.risk}
            onChange={(e) => onFilterChange({ risk: e.target.value })}
            className="w-full bg-[#020617] border border-slate-700/80 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Risk Levels</option>
            <option value="LOW">Low Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="HIGH">High Risk</option>
            <option value="CRITICAL">Critical Risk</option>
          </select>
        </div>

        {/* Region */}
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1">Region</label>
          <select
            value={filters.region}
            onChange={(e) => onFilterChange({ region: e.target.value })}
            className="w-full bg-[#020617] border border-slate-700/80 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Polar Sectors</option>
            <option value="Ross">Ross Sea / McMurdo</option>
            <option value="Queen Maud">Queen Maud Land / Astrid</option>
            <option value="Wilkes">Wilkes Land / Casey</option>
            <option value="Weddell">Weddell Sea / Larsen C</option>
            <option value="Plateau">South Pole / Transantarctic</option>
          </select>
        </div>

        {/* Vessel */}
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1">Assigned Asset</label>
          <select
            value={filters.vessel}
            onChange={(e) => onFilterChange({ vessel: e.target.value })}
            className="w-full bg-[#020617] border border-slate-700/80 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Primary Assets</option>
            <option value="USCGC Polar Star">USCGC Polar Star</option>
            <option value="Ocean Explorer">Ocean Explorer</option>
            <option value="Aurora Australis">Aurora Australis</option>
            <option value="RRS Sir David Attenborough">RRS Sir David Attenborough</option>
            <option value="Kronprins Haakon">Kronprins Haakon</option>
            <option value="Overland">Overland Heavy Fleet</option>
          </select>
        </div>

        {/* Mission Type */}
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1">Mission Type</label>
          <select
            value={filters.missionType}
            onChange={(e) => onFilterChange({ missionType: e.target.value })}
            className="w-full bg-[#020617] border border-slate-700/80 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Mission Types</option>
            <option value="Scientific">Scientific Research</option>
            <option value="Resupply">Logistics & Resupply</option>
            <option value="Survey">Survey & Bathymetry</option>
            <option value="Overland">Overland Transport</option>
            <option value="Environmental">Environmental Monitoring</option>
          </select>
        </div>

        {/* Reset / Count */}
        <div className="flex items-end justify-between gap-2">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono self-center">
            Showing <strong className="text-slate-900 dark:text-white">{filteredCount}</strong> of {totalCount}
          </span>
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold px-2 py-1.5 rounded hover:bg-rose-950/30 transition-colors"
            >
              <X className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
