"use client"

import React from 'react';
import { KPIs } from '@/types/logistics';
import { Ship, Navigation, Package, Scale, AlertTriangle, ShieldAlert, Route, Clock } from 'lucide-react';

interface Props {
  kpis: KPIs;
}

export function LogisticsKPIStrip({ kpis }: Props) {
  const cards = [
    {
      label: 'ACTIVE VESSELS',
      value: kpis.active_vessels.toString(),
      subtext: `${kpis.at_port ?? 1} in port / ${kpis.delayed_vessels ?? 1} delayed`,
      icon: Ship,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20'
    },
    {
      label: 'IN TRANSIT',
      value: kpis.in_transit.toString(),
      subtext: 'High-seas polar corridors',
      icon: Navigation,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20'
    },
    {
      label: 'CARGO IN TRANSIT',
      value: `${kpis.cargo_in_transit_tons.toLocaleString()} t`,
      subtext: 'Diesel, food & equipment',
      icon: Package,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20'
    },
    {
      label: 'TOTAL CARGO STAGED',
      value: `${(kpis.total_cargo_weight_tons ?? 4860).toLocaleString()} t`,
      subtext: 'Ports & depot reserves',
      icon: Scale,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20'
    },
    {
      label: 'DELAYED SHIPMENTS',
      value: kpis.delayed_shipments.toString(),
      subtext: 'Storm / pack-ice hold',
      icon: AlertTriangle,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
      highlight: kpis.delayed_shipments > 0
    },
    {
      label: 'LOW STOCK ALERTS',
      value: kpis.critical_inventory_alerts.toString(),
      subtext: 'Davis & Maitri reserves',
      icon: ShieldAlert,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
      highlight: kpis.critical_inventory_alerts > 0
    },
    {
      label: 'ACTIVE ROUTES',
      value: kpis.active_routes.toString(),
      subtext: 'OR-Tools optimized',
      icon: Route,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
      label: 'ETA NEXT 7 DAYS',
      value: kpis.eta_next_7_days.toString(),
      subtext: 'Davis & Maitri arrivals',
      icon: Clock,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10 border-sky-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3 my-6">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className={`p-3.5 rounded-xl border bg-white dark:bg-slate-900/60 backdrop-blur-sm transition-all hover:border-slate-700/80 ${
              card.highlight ? 'border-amber-500/40 shadow-sm shadow-amber-500/5' : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <span className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase truncate">
                {card.label}
              </span>
              <div className={`w-6 h-6 rounded-md flex items-center justify-center border ${card.bg}`}>
                <Icon className={`w-3.5 h-3.5 ${card.color}`} />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {card.value}
            </div>
            <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
              {card.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
}
