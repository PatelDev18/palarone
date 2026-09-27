"use client";

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import {
  Ship,
  Building2,
  Cpu,
  Package,
  Users,
  HardHat,
  CloudSnow,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  Clock,
  Activity
} from 'lucide-react';
import { NodeCategory, NodeStatus } from '@/types/digital-twin';

interface TwinNodeData {
  id: string;
  label: string;
  category: NodeCategory;
  status: NodeStatus;
  health_score: number;
  freshness: string;
  last_update: string;
  data_source: string;
  properties: Record<string, any>;
  risk?: {
    level: string;
    score: number;
    confidence: number;
  };
  isCritical?: boolean;
  isWarning?: boolean;
  isSelected?: boolean;
  isHighlighted?: boolean;
}

const CATEGORY_CONFIG: Record<NodeCategory, { icon: React.ElementType; color: string; border: string; bg: string }> = {
  SHIP: { icon: Ship, color: 'text-blue-400', border: 'border-blue-500/40', bg: 'bg-blue-950/40' },
  STATION: { icon: Building2, color: 'text-emerald-400', border: 'border-emerald-500/40', bg: 'bg-emerald-950/40' },
  EQUIPMENT: { icon: Cpu, color: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-950/40' },
  CARGO: { icon: Package, color: 'text-cyan-400', border: 'border-cyan-500/40', bg: 'bg-cyan-950/40' },
  PERSONNEL: { icon: Users, color: 'text-purple-400', border: 'border-purple-500/40', bg: 'bg-purple-950/40' },
  INFRASTRUCTURE: { icon: HardHat, color: 'text-rose-400', border: 'border-rose-500/40', bg: 'bg-rose-950/40' },
  ENVIRONMENT: { icon: CloudSnow, color: 'text-sky-400', border: 'border-sky-500/40', bg: 'bg-sky-950/40' },
};

export const CustomTwinNode = memo(({ data, selected }: NodeProps<TwinNodeData>) => {
  const cat = CATEGORY_CONFIG[data.category] || CATEGORY_CONFIG.SHIP;
  const IconComponent = cat.icon;

  const isCrit = data.status === 'CRITICAL';
  const isWarn = data.status === 'WARNING';

  // Glow styling
  const borderStatusClass = isCrit
    ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.45)] ring-1 ring-red-500/50'
    : isWarn
    ? 'border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.3)] ring-1 ring-amber-500/40'
    : selected
    ? 'border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)] ring-1 ring-cyan-400'
    : `${cat.border} hover:border-slate-400/60`;

  return (
    <div
      className={`relative min-w-[210px] max-w-[240px] rounded-lg bg-slate-900/95 backdrop-blur-md border p-3 text-slate-100 transition-all duration-200 cursor-pointer shadow-xl ${borderStatusClass}`}
    >
      {/* React Flow Connection Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !bg-blue-400 !border-slate-900 !rounded-full hover:!scale-150 transition-transform"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !bg-cyan-400 !border-slate-900 !rounded-full hover:!scale-150 transition-transform"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="!w-1.5 !h-1.5 !bg-slate-400 !border-slate-900 opacity-60"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-1.5 !h-1.5 !bg-slate-400 !border-slate-900 opacity-60"
      />

      {/* Header Bar */}
      <div className="flex items-center justify-between gap-1 mb-2">
        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-medium tracking-wide uppercase ${cat.bg} ${cat.color} border border-slate-700/50`}>
          <IconComponent className="w-3 h-3 shrink-0" />
          <span>{data.category}</span>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-1">
          {isCrit ? (
            <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-red-400 bg-red-950/80 px-1.5 py-0.5 rounded border border-red-800 animate-pulse">
              <AlertOctagon className="w-3 h-3 text-red-500" />
              CRIT
            </span>
          ) : isWarn ? (
            <span className="flex items-center gap-1 text-[10px] font-mono font-semibold text-amber-400 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800">
              <AlertTriangle className="w-3 h-3 text-amber-500" />
              WARN
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/60">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              OK
            </span>
          )}
        </div>
      </div>

      {/* Title & Core Details */}
      <div className="mb-2">
        <h4 className="text-xs font-bold text-slate-100 tracking-tight truncate flex items-center gap-1.5">
          {data.label}
        </h4>
        <div className="text-[10px] font-mono text-slate-600 dark:text-slate-400 truncate mt-0.5">
          {data.properties?.vessel_type ||
           data.properties?.station_type ||
           data.properties?.equipment_type ||
           data.properties?.cargo_type ||
           data.properties?.hazard_type ||
           data.data_source}
        </div>
      </div>

      {/* Health Score Progress Bar */}
      <div className="space-y-1 mb-2">
        <div className="flex items-center justify-between text-[10px] font-mono">
          <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
            <Activity className="w-2.5 h-2.5 text-blue-400" />
            Health
          </span>
          <span
            className={`font-semibold ${
              data.health_score < 50
                ? 'text-red-400 font-bold'
                : data.health_score < 75
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}
          >
            {data.health_score}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              data.health_score < 50
                ? 'bg-red-500'
                : data.health_score < 75
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.max(5, Math.min(100, data.health_score))}%` }}
          />
        </div>
      </div>

      {/* Key Metric Snapshot */}
      <div className="bg-slate-950/60 rounded px-2 py-1 border border-slate-200 dark:border-slate-800/80 mb-2 flex items-center justify-between text-[10px] font-mono">
        {data.properties?.speed_knots !== undefined && (
          <span className="text-slate-700 dark:text-slate-300">
            SPD: <strong className="text-blue-400">{data.properties.speed_knots} kt</strong>
          </span>
        )}
        {data.properties?.fuel_remaining_pct !== undefined && (
          <span className="text-slate-700 dark:text-slate-300">
            FUEL: <strong className="text-cyan-400">{data.properties.fuel_remaining_pct}%</strong>
          </span>
        )}
        {data.properties?.personnel_onboard !== undefined && (
          <span className="text-slate-700 dark:text-slate-300">
            CREW: <strong className="text-emerald-400">{data.properties.personnel_onboard}</strong>
          </span>
        )}
        {data.properties?.vibration_level !== undefined && (
          <span className="text-slate-700 dark:text-slate-300">
            VIB: <strong className="text-red-400">{data.properties.vibration_level}</strong>
          </span>
        )}
        {data.properties?.temperature_c !== undefined && (
          <span className="text-slate-700 dark:text-slate-300">
            TEMP: <strong className="text-sky-400">{data.properties.temperature_c}°C</strong>
          </span>
        )}
        {data.properties?.sea_ice_concentration !== undefined && (
          <span className="text-slate-700 dark:text-slate-300">
            ICE: <strong className="text-amber-400">{data.properties.sea_ice_concentration}</strong>
          </span>
        )}
        {data.properties?.speed_knots === undefined &&
         data.properties?.fuel_remaining_pct === undefined &&
         data.properties?.personnel_onboard === undefined &&
         data.properties?.vibration_level === undefined &&
         data.properties?.temperature_c === undefined &&
         data.properties?.sea_ice_concentration === undefined && (
          <span className="text-slate-600 dark:text-slate-400 truncate">
            {data.data_source}
          </span>
        )}
      </div>

      {/* Footer: Freshness & Risk Badge */}
      <div className="flex items-center justify-between text-[9px] font-mono text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800/60">
        <span className="flex items-center gap-1">
          <Clock className="w-2.5 h-2.5 text-slate-500" />
          {data.freshness}
        </span>
        {data.risk && (
          <span
            className={`font-semibold px-1 rounded ${
              data.risk.level === 'CRITICAL' || data.risk.level === 'HIGH'
                ? 'text-red-400 bg-red-950/60 border border-red-900/50'
                : data.risk.level === 'MEDIUM'
                ? 'text-amber-400 bg-amber-950/60'
                : 'text-emerald-400'
            }`}
          >
            RISK {data.risk.level}
          </span>
        )}
      </div>
    </div>
  );
});

CustomTwinNode.displayName = 'CustomTwinNode';
