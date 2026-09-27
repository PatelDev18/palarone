"use client"

import React from 'react'
import { DataFreshnessStatus } from '@/types/emergency'
import { Clock, Wifi, AlertCircle, WifiOff } from 'lucide-react'

interface DataFreshnessBadgeProps {
  status: DataFreshnessStatus;
  updatedAt?: string;
  sourceName?: string;
  showIcon?: boolean;
}

export function DataFreshnessBadge({
  status,
  updatedAt,
  sourceName,
  showIcon = true
}: DataFreshnessBadgeProps) {
  const getBadgeStyle = () => {
    switch (status) {
      case 'FRESH':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      case 'RECENT':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      case 'STALE':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      case 'OFFLINE':
      default:
        return 'bg-rose-500/10 border-rose-500/30 text-rose-400';
    }
  };

  const getDotStyle = () => {
    switch (status) {
      case 'FRESH':
        return 'bg-emerald-400';
      case 'RECENT':
        return 'bg-blue-400';
      case 'STALE':
        return 'bg-amber-400';
      case 'OFFLINE':
      default:
        return 'bg-rose-400';
    }
  };

  return (
    <div 
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[11px] font-mono tracking-wider font-semibold uppercase ${getBadgeStyle()}`}
      title={sourceName ? `${sourceName} - Last updated ${updatedAt || 'N/A'}` : `Telemetry freshness: ${status}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        {status === 'FRESH' && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        )}
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${getDotStyle()}`}></span>
      </span>
      <span>{status}</span>
      {updatedAt && <span className="opacity-75 font-normal">({updatedAt})</span>}
    </div>
  );
}
