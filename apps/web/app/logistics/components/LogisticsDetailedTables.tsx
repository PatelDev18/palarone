"use client"

import React, { useState, useMemo } from 'react';
import { Vessel, CargoItem, StationSupply, RouteItem } from '@/types/logistics';
import {
  Table,
  Search,
  Filter,
  Ship,
  Package,
  Database,
  Route,
  ChevronDown,
  ArrowUpDown,
  ExternalLink
} from 'lucide-react';

interface Props {
  vessels: Vessel[];
  cargo: CargoItem[];
  stations: StationSupply[];
  routes: RouteItem[];
}

export function LogisticsDetailedTables({ vessels, cargo, stations, routes }: Props) {
  const [activeTab, setActiveTab] = useState<'VESSELS' | 'CARGO' | 'INVENTORY' | 'ROUTES'>('VESSELS');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Filtered Vessels
  const filteredVessels = useMemo(() => {
    return vessels.filter(v => {
      const matchSearch =
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.imo.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || v.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [vessels, searchQuery, statusFilter]);

  // Filtered Cargo
  const filteredCargo = useMemo(() => {
    return cargo.filter(c => {
      const matchSearch =
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.vessel.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || c.status === statusFilter || c.priority === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [cargo, searchQuery, statusFilter]);

  // Flattened Station Inventory items for Table 3
  const inventoryRows = useMemo(() => {
    const rows: any[] = [];
    stations.forEach(s => {
      rows.push({
        station: s.name,
        category: 'Arctic Diesel Fuel',
        currentStock: s.name === 'Davis Station' ? '42,000 L' : s.name === 'Maitri Station' ? '68,000 L' : '48,000 L',
        dailyBurn: s.name === 'Davis Station' ? '3,800 L/d' : '2,400 L/d',
        daysRemaining: s.coverage.fuel_days,
        forecastStockout: '22 Oct 2026',
        risk: s.coverage.fuel_days < 10 ? 'CRITICAL' : s.coverage.fuel_days < 20 ? 'WARNING' : 'NORMAL'
      });
      rows.push({
        station: s.name,
        category: 'Freeze-Dried Rations',
        currentStock: '18,500 kg',
        dailyBurn: '450 kg/d',
        daysRemaining: s.coverage.food_days,
        forecastStockout: '08 Dec 2026',
        risk: s.coverage.food_days < 25 ? 'WARNING' : 'NORMAL'
      });
      rows.push({
        station: s.name,
        category: 'Medical Cryo-Supplies',
        currentStock: '320 units',
        dailyBurn: '12 u/d',
        daysRemaining: s.coverage.medical_days,
        forecastStockout: '15 Nov 2026',
        risk: s.coverage.medical_days < 15 ? 'CRITICAL' : 'NORMAL'
      });
    });
    return rows.filter(r => {
      const matchSearch =
        r.station.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || r.risk === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [stations, searchQuery, statusFilter]);

  // Filtered Routes
  const filteredRoutes = useMemo(() => {
    return routes.filter(r => {
      const matchSearch =
        r.route_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.vessel.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || r.overall_operational_risk === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [routes, searchQuery, statusFilter]);

  return (
    <div id="vessels-table" className="my-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 backdrop-blur-sm p-6 shadow-xl">
      {/* Header and Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Logistics Operational Registry
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
              HIGH-DENSITY DATA TABLES
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Detailed registries for fleet vessels, cargo manifests, station inventory, and maritime corridors.
          </p>
        </div>

        {/* Global Search & Filters (Section 23) */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vessel, cargo, station, route..."
              className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 w-56 sm:w-64"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-700 dark:text-slate-300 focus:outline-none text-xs"
            >
              <option value="ALL">All Statuses</option>
              <option value="In Transit">In Transit</option>
              <option value="At Port">At Port</option>
              <option value="Delayed">Delayed</option>
              <option value="CRITICAL">Critical Risk</option>
              <option value="WARNING">Warning Risk</option>
              <option value="NORMAL">Normal / On Schedule</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 my-5">
        <button
          onClick={() => setActiveTab('VESSELS')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'VESSELS'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-50 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Ship className="w-4 h-4" />
          <span>Table 1: Vessels ({filteredVessels.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('CARGO')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'CARGO'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-slate-50 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Table 2: Cargo ({filteredCargo.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('INVENTORY')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'INVENTORY'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-slate-50 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Table 3: Inventory ({inventoryRows.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ROUTES')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'ROUTES'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-50 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Route className="w-4 h-4" />
          <span>Table 4: Routes ({filteredRoutes.length})</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TABLE 1: VESSELS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'VESSELS' && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950/50">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-950 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Vessel</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Position</th>
                <th className="py-3 px-4">Speed</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Predicted ETA</th>
                <th className="py-3 px-4">Delay</th>
                <th className="py-3 px-4">Risk</th>
                <th className="py-3 px-4">Last AIS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-medium">
              {filteredVessels.map(v => (
                <tr key={v.id} className="hover:bg-white dark:bg-slate-900/60 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <div>
                      {v.name}
                      <span className="block text-[10px] text-slate-500 font-normal">{v.imo}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      v.status === 'In Transit' ? 'bg-cyan-500/20 text-cyan-300' :
                      v.status === 'Delayed' ? 'bg-rose-500/20 text-rose-300' :
                      'bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                    {v.lat.toFixed(2)}°S, {v.lon.toFixed(2)}°E
                  </td>
                  <td className="py-3 px-4">{v.speed_knots} kts</td>
                  <td className="py-3 px-4 text-blue-400 font-semibold">{v.destination}</td>
                  <td className="py-3 px-4 text-purple-300 font-mono text-[11px]">
                    {new Date(v.predicted_eta).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} UTC
                  </td>
                  <td className="py-3 px-4">
                    <span className={v.delay_hours > 12 ? 'text-rose-400 font-bold' : 'text-slate-500 dark:text-slate-400'}>
                      {v.delay_hours > 0 ? `+${v.delay_hours}h` : 'On Time'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      v.route_risk === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' :
                      v.route_risk === 'WARNING' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {v.route_risk}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400">{v.last_ais_update}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TABLE 2: CARGO */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'CARGO' && (
        <div id="cargo-table" className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950/50">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-950 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Cargo ID</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Weight</th>
                <th className="py-3 px-4">Origin</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Carrier Vessel</th>
                <th className="py-3 px-4">ETA</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-medium">
              {filteredCargo.map(c => (
                <tr key={c.id} className="hover:bg-white dark:bg-slate-900/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue-400">{c.id}</td>
                  <td className="py-3 px-4 text-slate-900 dark:text-white font-semibold">{c.type}</td>
                  <td className="py-3 px-4 font-bold">{c.weight_tons} tons</td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400 truncate max-w-[120px]">{c.origin}</td>
                  <td className="py-3 px-4 text-amber-300 font-semibold truncate max-w-[120px]">{c.destination}</td>
                  <td className="py-3 px-4 text-cyan-300">{c.vessel}</td>
                  <td className="py-3 px-4 text-purple-300 font-mono text-[11px]">
                    {new Date(c.eta).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      c.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' :
                      c.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                      {c.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      c.status === 'IN TRANSIT' ? 'bg-cyan-500/20 text-cyan-300' :
                      c.status === 'DELAYED' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TABLE 3: INVENTORY */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'INVENTORY' && (
        <div id="inventory-table" className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950/50">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-950 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Station</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Daily Burn Rate</th>
                <th className="py-3 px-4">Days Remaining</th>
                <th className="py-3 px-4">Forecast Stockout</th>
                <th className="py-3 px-4">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-medium">
              {inventoryRows.map((inv, idx) => (
                <tr key={idx} className="hover:bg-white dark:bg-slate-900/60 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">{inv.station}</td>
                  <td className="py-3 px-4 text-slate-200">{inv.category}</td>
                  <td className="py-3 px-4 font-mono font-bold text-cyan-300">{inv.currentStock}</td>
                  <td className="py-3 px-4 text-amber-300">{inv.dailyBurn}</td>
                  <td className="py-3 px-4 font-bold text-sm">
                    <span className={inv.daysRemaining < 10 ? 'text-rose-400' : inv.daysRemaining < 20 ? 'text-amber-300' : 'text-emerald-400'}>
                      {inv.daysRemaining} days
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">{inv.forecastStockout}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      inv.risk === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' :
                      inv.risk === 'WARNING' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {inv.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TABLE 4: ROUTES */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'ROUTES' && (
        <div id="routes-table" className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950/50">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-950 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Route</th>
                <th className="py-3 px-4">Origin</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Distance</th>
                <th className="py-3 px-4">Predicted ETA</th>
                <th className="py-3 px-4">Weather Risk</th>
                <th className="py-3 px-4">Ice Risk</th>
                <th className="py-3 px-4">Fuel Impact</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-medium">
              {filteredRoutes.map(r => (
                <tr key={r.route_id} className="hover:bg-white dark:bg-slate-900/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-emerald-400">{r.route_id}</td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{r.origin}</td>
                  <td className="py-3 px-4 text-slate-900 dark:text-white font-bold">{r.destination}</td>
                  <td className="py-3 px-4">{r.distance_km.toLocaleString()} km</td>
                  <td className="py-3 px-4 text-purple-300 font-mono text-[11px]">
                    {new Date(r.predicted_eta).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </td>
                  <td className="py-3 px-4">
                    <span className={r.weather_risk === 'High' ? 'text-rose-400 font-bold' : 'text-slate-700 dark:text-slate-300'}>
                      {r.weather_risk}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={r.ice_risk === 'High' ? 'text-rose-400 font-bold' : 'text-slate-700 dark:text-slate-300'}>
                      {r.ice_risk}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-amber-300 font-bold">{r.fuel_impact_pct}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      r.overall_operational_risk === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' :
                      r.overall_operational_risk === 'WARNING' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {r.overall_operational_risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
