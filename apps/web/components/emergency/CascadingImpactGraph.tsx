"use client"

import React, { useState } from 'react'
import { CascadingImpact } from '@/types/emergency'
import { 
  Network, 
  ArrowRight, 
  AlertTriangle, 
  Ship, 
  Building2, 
  Package, 
  Calendar, 
  Activity,
  Layers
} from 'lucide-react'

interface CascadingImpactGraphProps {
  impact: CascadingImpact;
}

export function CascadingImpactGraph({ impact }: CascadingImpactGraphProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const getNodeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'incident': return AlertTriangle;
      case 'vessel': return Ship;
      case 'cargo': return Package;
      case 'station': return Building2;
      case 'mission': default: return Calendar;
    }
  };

  const getNodeColor = (severity: string) => {
    switch (severity.toUpperCase()) {
      case 'CRITICAL': return 'bg-red-950/80 border-red-500 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.3)]';
      case 'HIGH': return 'bg-orange-950/80 border-orange-500 text-orange-300 shadow-[0_0_10px_rgba(249,115,22,0.2)]';
      case 'MEDIUM': return 'bg-amber-950/80 border-amber-500 text-amber-300';
      case 'LOW': default: return 'bg-blue-950/80 border-blue-500 text-blue-300';
    }
  };

  return (
    <div className="bg-[#0b1329] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
              <span>Cascading Impact & Knowledge Graph</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                DIGITAL TWIN INTEGRATED
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Propagation chain from physical maritime hazard to station wintering survival runway</p>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
          Primary: <strong className="text-slate-900 dark:text-white">{impact.primary_asset}</strong>
        </div>
      </div>

      {/* Visual Dependency Flow Graph */}
      <div className="bg-white dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 relative overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between min-w-[650px] gap-2 py-2">
          {impact.graph_nodes.map((node, idx) => {
            const Icon = getNodeIcon(node.type);
            const isLast = idx === impact.graph_nodes.length - 1;
            const isSelected = selectedNode === node.id;

            return (
              <React.Fragment key={node.id}>
                {/* Node Box */}
                <div
                  onClick={() => setSelectedNode(node.id)}
                  className={`flex flex-col items-center p-3 rounded-lg border transition-all cursor-pointer w-36 shrink-0 ${getNodeColor(node.severity)} ${
                    isSelected ? 'ring-2 ring-white scale-105' : 'hover:scale-102'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900/80 flex items-center justify-center mb-1.5 border border-slate-700/80">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-mono uppercase font-bold text-slate-500 dark:text-slate-400">
                    {node.type}
                  </span>
                  <span className="text-xs font-bold text-center leading-tight line-clamp-2 mt-0.5">
                    {node.label}
                  </span>
                  <span className="text-[9px] font-mono mt-1 px-1.5 py-0.2 rounded bg-black/40 border border-white/10">
                    {node.severity}
                  </span>
                </div>

                {/* Arrow connector */}
                {!isLast && (
                  <div className="flex flex-col items-center justify-center shrink-0 px-1">
                    <span className="text-[9px] font-mono text-slate-500 mb-0.5">
                      {impact.graph_edges[idx]?.label || 'Impacts'}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-500 animate-pulse" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Impact Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-slate-900/70 border border-slate-200 dark:border-slate-800 p-3 rounded-lg">
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase block font-semibold">
            Station Food & Medical Buffer
          </span>
          <div className="text-base font-bold text-amber-400 font-mono mt-1">
            12 Days Runway
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Davis Station reserves intact but approaching 10-day safety reorder threshold.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-200 dark:border-slate-800 p-3 rounded-lg">
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase block font-semibold">
            Station Arctic Diesel Stock
          </span>
          <div className="text-base font-bold text-emerald-400 font-mono mt-1">
            184 Days Runway
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Bulk tank storage sufficient for wintering season. Power risk nominal.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-200 dark:border-slate-800 p-3 rounded-lg">
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase block font-semibold">
            Mission Science Schedule
          </span>
          <div className="text-base font-bold text-orange-400 font-mono mt-1">
            High Operational Impact
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Marine sediment coring delayed; summer team changeover buffer compressed.
          </p>
        </div>
      </div>

      {/* Downstream Chain Details */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 font-bold block">
          Downstream Entity Status Audit
        </span>
        <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-slate-900/40 text-xs">
          {impact.downstream_impacts.map((ds, i) => (
            <div key={i} className="p-2.5 flex items-center justify-between font-mono">
              <div className="flex items-center gap-2">
                <span className="text-slate-200 font-semibold">{ds.node}</span>
                <span className="text-[10px] text-slate-500">({ds.type})</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-700 dark:text-slate-300 text-[11px]">{ds.impact}</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-amber-300 font-bold">
                  {ds.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
