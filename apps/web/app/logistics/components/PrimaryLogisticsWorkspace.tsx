"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Vessel, CargoItem, RouteItem, StationSupply } from '@/types/logistics';
import {
  Ship,
  Package,
  Route,
  Anchor,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Gauge,
  Flame,
  PlusCircle,
  CheckCircle2
} from 'lucide-react';

interface Props {
  vessels: Vessel[];
  cargo: CargoItem[];
  routes: RouteItem[];
  stations: StationSupply[];
  onSelectStationModal?: (station: StationSupply) => void;
  onOpenResupplyModal?: () => void;
}

export function PrimaryLogisticsWorkspace({
  vessels,
  cargo,
  routes,
  stations,
  onOpenResupplyModal
}: Props) {
  // Metric derivations
  const inTransitVessels = vessels.filter(v => v.status === 'In Transit').length;
  const atPortVessels = vessels.filter(v => v.status === 'At Port').length;
  const delayedVessels = vessels.filter(v => v.status === 'Delayed').length;
  const awaitingVessels = vessels.filter(v => v.status === 'Awaiting Departure').length;
  const avgSpeed = (vessels.reduce((acc, v) => acc + v.speed_knots, 0) / (vessels.length || 1)).toFixed(1);

  const cargoInTransitTons = cargo
    .filter(c => c.status === 'IN TRANSIT')
    .reduce((acc, c) => acc + c.weight_tons, 0);
  const cargoAwaitingTons = cargo
    .filter(c => c.status === 'LOADING' || c.status === 'PLANNED')
    .reduce((acc, c) => acc + c.weight_tons, 0);
  const criticalSuppliesCount = cargo.filter(c => c.priority === 'CRITICAL').length;
  const lowStockStationsCount = stations.filter(s => s.status === 'CRITICAL' || s.status === 'WARNING').length;

  const weatherAffectedRoutes = routes.filter(r => r.weather_risk === 'Moderate' || r.weather_risk === 'High').length;
  const iceAffectedRoutes = routes.filter(r => r.ice_risk === 'Moderate' || r.ice_risk === 'High').length;
  const delayedRoutes = routes.filter(r => r.status.includes('DELAYED') || r.overall_operational_risk === 'CRITICAL').length;

  const categories = [
    'Fuel',
    'Food',
    'Medical',
    'Spare Parts',
    'Scientific Equipment',
    'Construction Materials',
    'Emergency Supplies'
  ];

  const optimizationFactors = [
    'WEATHER',
    'SEA ICE',
    'DISTANCE',
    'FUEL',
    'ETA',
    'STATION PRIORITY',
    'VESSEL CAPABILITY'
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 my-6">
      {/* ------------------------------------------------------------- */}
      {/* CARD 1 — VESSEL TRACKING */}
      {/* ------------------------------------------------------------- */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 backdrop-blur-sm hover:border-slate-700 transition-all flex flex-col justify-between">
        <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
          <div>
            {/* Header with Circle Icon */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center shrink-0">
                <Ship className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Vessel Tracking</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Live AIS feeds, ETA predictions, and fleet performance.</p>
              </div>
            </div>

            {/* Vessel Status Indicators */}
            <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 text-xs">
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" /> In Transit:
                </span>
                <span className="font-bold text-white">{inTransitVessels}</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> At Port:
                </span>
                <span className="font-bold text-white">{atPortVessels}</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" /> Delayed:
                </span>
                <span className="font-bold text-rose-300">{delayedVessels}</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> Awaiting:
                </span>
                <span className="font-bold text-white">{awaitingVessels}</span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 border-t border-slate-200 dark:border-slate-800/80 pt-3">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Average Fleet Speed:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{avgSpeed} knots</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Next Arrival:</span>
                <span className="font-semibold text-blue-400">Polar Star (Davis / 5d)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Latest AIS Signal:</span>
                <span className="font-semibold text-emerald-400">1 min ago (Aurora II)</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-800/80">
            <Link
              href="/logistics/ships"
              className="flex-1 text-center py-2 px-3 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              Open Vessel Tracking
            </Link>
            <a
              href="#vessels-table"
              className="py-2 px-3 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              View Fleet
            </a>
          </div>
        </CardContent>
      </Card>

      {/* ------------------------------------------------------------- */}
      {/* CARD 2 — CARGO & INVENTORY */}
      {/* ------------------------------------------------------------- */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 backdrop-blur-sm hover:border-slate-700 transition-all flex flex-col justify-between">
        <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
          <div>
            {/* Header with Circle Icon */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center shrink-0">
                <Package className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Cargo & Inventory</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Station supply levels, burn rates, and cargo manifests.</p>
              </div>
            </div>

            {/* Metrics */}
            <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 py-1">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Cargo in Transit:</span>
                <span className="font-semibold text-purple-300">{cargoInTransitTons.toLocaleString()} tons</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Awaiting Loading:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{cargoAwaitingTons.toLocaleString()} tons</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Critical Priority Supplies:</span>
                <span className="font-semibold text-rose-400">{criticalSuppliesCount} shipments</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Low-Stock Stations:</span>
                <span className="font-semibold text-amber-400">{lowStockStationsCount} stations</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Highest-Priority Cargo:</span>
                <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[140px]">CRG-8910 (Diesel)</span>
              </div>
            </div>

            {/* Cargo Category Pills */}
            <div className="pt-2">
              <div className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase mb-1.5">
                Supply Categories
              </div>
              <div className="flex flex-wrap gap-1">
                {categories.map((cat, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-700/60"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-800/80">
            <Link
              href="/logistics/inventory"
              className="flex-1 text-center py-2 px-3 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors"
            >
              Open Cargo
            </Link>
            <a
              href="#inventory-table"
              className="py-2 px-3 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              View Inventory
            </a>
          </div>
        </CardContent>
      </Card>

      {/* ------------------------------------------------------------- */}
      {/* CARD 3 — ROUTE OPTIMIZATION */}
      {/* ------------------------------------------------------------- */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 backdrop-blur-sm hover:border-slate-700 transition-all flex flex-col justify-between">
        <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
          <div>
            {/* Header with Circle Icon */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center shrink-0">
                <Route className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Route Optimization</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">OR-Tools based routing avoiding severe weather and ice.</p>
              </div>
            </div>

            {/* Route Metrics */}
            <div className="grid grid-cols-2 gap-2 my-2.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 text-xs">
              <div>
                <div className="text-slate-500 dark:text-slate-400 text-[10px]">Active Routes</div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">{routes.length} Active</div>
              </div>
              <div>
                <div className="text-slate-500 dark:text-slate-400 text-[10px]">Delayed Routes</div>
                <div className="font-bold text-rose-400 text-sm">{delayedRoutes} Delayed</div>
              </div>
              <div>
                <div className="text-slate-500 dark:text-slate-400 text-[10px]">Weather Hazards</div>
                <div className="font-bold text-amber-300 text-sm">{weatherAffectedRoutes} Sectors</div>
              </div>
              <div>
                <div className="text-slate-500 dark:text-slate-400 text-[10px]">Ice Hazards</div>
                <div className="font-bold text-cyan-300 text-sm">{iceAffectedRoutes} Pack Zones</div>
              </div>
            </div>

            {/* Optimization Factors */}
            <div className="pt-1">
              <div className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase mb-1.5">
                Optimization Constraints (OR-Tools)
              </div>
              <div className="flex flex-wrap gap-1">
                {optimizationFactors.map((factor, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 font-mono"
                  >
                    {factor}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-800/80">
            <Link
              href="/logistics/optimization"
              className="flex-1 text-center py-2 px-3 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
            >
              Optimize Route
            </Link>
            <a
              href="#routes-table"
              className="py-2 px-3 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              View Routes
            </a>
          </div>
        </CardContent>
      </Card>

      {/* ------------------------------------------------------------- */}
      {/* CARD 4 — STATION SUPPLY NETWORK (SECTION 8) */}
      {/* ------------------------------------------------------------- */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 backdrop-blur-sm hover:border-slate-700 transition-all flex flex-col justify-between">
        <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
          <div>
            {/* Header with Circle Icon */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center shrink-0">
                <Anchor className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Station Supply Network</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Base replenishment schedules, stock coverage & deadlines.</p>
              </div>
            </div>

            {/* Station Supply Statuses */}
            <div className="space-y-2 text-xs">
              {/* Maitri Station */}
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-200">Maitri Station</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    WARNING
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                  <div>Fuel: <span className="text-slate-200 font-semibold">14d</span></div>
                  <div>Food: <span className="text-slate-200 font-semibold">21d</span></div>
                  <div>Med: <span className="text-rose-400 font-semibold">9d</span></div>
                  <div>Parts: <span className="text-slate-200 font-semibold">32d</span></div>
                </div>
              </div>

              {/* Davis Station */}
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-red-900/40">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-200">Davis Station</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    CRITICAL
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                  <div>Fuel: <span className="text-rose-400 font-semibold">8.5d</span></div>
                  <div>Food: <span className="text-slate-200 font-semibold">42d</span></div>
                  <div>Med: <span className="text-slate-200 font-semibold">18d</span></div>
                  <div>Parts: <span className="text-slate-200 font-semibold">35d</span></div>
                </div>
              </div>

              {/* Bharati Station */}
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-200">Bharati Station</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    WARNING
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                  <div>Fuel: <span className="text-slate-200 font-semibold">18d</span></div>
                  <div>Food: <span className="text-slate-200 font-semibold">36d</span></div>
                  <div>Med: <span className="text-slate-200 font-semibold">29d</span></div>
                  <div>Parts: <span className="text-amber-400 font-semibold">11d</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-800/80">
            <a
              href="#inventory-table"
              className="flex-1 text-center py-2 px-3 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-500 text-white transition-colors"
            >
              View Stations
            </a>
            <button
              onClick={onOpenResupplyModal}
              className="py-2 px-3 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Resupply</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
