"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Activity,
  Layers,
  Sparkles,
  Play,
  RotateCcw,
  Shield,
  HelpCircle,
  Database,
  Radio,
  Clock,
  Satellite,
  Compass,
  Ship,
  AlertTriangle
} from 'lucide-react';
import { FreshnessState } from '@/types/digital-twin';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

interface DigitalTwinHeaderProps {
  isSimulationMode: boolean;
  onToggleMode: (sim: boolean) => void;
  onOpenQueryModal: () => void;
  onOpenSimModal: () => void;
  onOpenDataHealthModal: () => void;
  onOpenSatelliteModal: () => void;
  onOpenEventsModal: () => void;
  syncSecondsAgo: number;
}

export function DigitalTwinHeader({
  isSimulationMode,
  onToggleMode,
  onOpenQueryModal,
  onOpenSimModal,
  onOpenDataHealthModal,
  onOpenSatelliteModal,
  onOpenEventsModal,
  syncSecondsAgo
}: DigitalTwinHeaderProps) {
  const [utcTime, setUtcTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-14 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 flex items-center justify-between px-4 z-30 shrink-0 shadow-sm dark:shadow-lg select-none transition-colors duration-150">
      {/* Left: Brand + Global Navigation Tabs */}
      <div className="flex items-center gap-4">
        <Link href="/command-center" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/40 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-600/30 transition-colors">
            <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-1.5 font-mono">
              POLAR<span className="text-blue-600 dark:text-blue-400">ONE</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-50 text-cyan-700 border border-cyan-200 dark:bg-cyan-950 dark:text-cyan-400 dark:border-cyan-800 font-normal">
                TWIN v2.4
              </span>
            </div>
            <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 tracking-tight">
              OPERATIONAL KNOWLEDGE GRAPH
            </div>
          </div>
        </Link>

        {/* Global Module Navigation */}
        <nav className="hidden xl:flex items-center gap-1 ml-3 pl-3 border-l border-slate-200 dark:border-slate-800 text-xs font-medium">
          <Link
            href="/command-center"
            className="px-2.5 py-1.5 rounded text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
          >
            Command Center
          </Link>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-50 text-cyan-700 border border-cyan-200 dark:bg-cyan-600/20 dark:text-cyan-400 dark:border-cyan-500/40 shadow-sm font-semibold">
            <Layers className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 animate-pulse" />
            Digital Twin
          </span>
          <Link
            href="/analytics"
            className="px-2.5 py-1.5 rounded text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
          >
            Analytics
          </Link>
          <Link
            href="/expeditions"
            className="px-2.5 py-1.5 rounded text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
          >
            Expeditions
          </Link>
          <Link
            href="/logistics"
            className="px-2.5 py-1.5 rounded text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
          >
            Logistics
          </Link>
          <Link
            href="/intelligence"
            className="px-2.5 py-1.5 rounded text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
          >
            Intelligence
          </Link>
          <Link
            href="/response"
            className="px-2.5 py-1.5 rounded text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
          >
            Response Center
          </Link>
          <Link
            href="/copilot"
            className="px-2.5 py-1.5 rounded text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
          >
            Copilot
          </Link>
        </nav>
      </div>

      {/* Center: Live / Simulation Mode Toggle + Freshness Pill */}
      <div className="flex items-center gap-3">
        {/* Mode Toggle Button */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-lg p-0.5 shadow-inner">
          <button
            onClick={() => onToggleMode(false)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-medium transition-all ${
              !isSimulationMode
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-600/30 dark:text-emerald-300 dark:border-emerald-500/50 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            LIVE TWIN
          </button>
          <button
            onClick={() => onToggleMode(true)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-medium transition-all ${
              isSimulationMode
                ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-600/30 dark:text-amber-300 dark:border-amber-500/50 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Play className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            WHAT-IF SIMULATION
          </button>
        </div>

        {/* Data Stream Freshness Pills */}
        <button
          onClick={onOpenDataHealthModal}
          className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
          title="Click to view data health and telemetry freshness matrix"
        >
          <Radio className="w-3 h-3 text-blue-500 dark:text-blue-400 animate-pulse" />
          <span>AIS: <strong className="text-emerald-600 dark:text-emerald-400">{syncSecondsAgo}s</strong></span>
          <span className="text-slate-700 dark:text-slate-300 dark:text-slate-600">|</span>
          <span>SAR: <strong className="text-cyan-600 dark:text-cyan-400">2h</strong></span>
          <span className="text-slate-700 dark:text-slate-300 dark:text-slate-600">|</span>
          <span>SCADA: <strong className="text-emerald-600 dark:text-emerald-400">1m</strong></span>
        </button>
      </div>

      {/* Right: Operational Tool Actions & Live Clock */}
      <div className="flex items-center gap-2">
        {/* Satellite Passes Button */}
        <button
          onClick={onOpenSatelliteModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 text-slate-700 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-300 text-xs font-mono transition-colors"
          title="Satellite SAR and Optical Observations"
        >
          <Satellite className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span className="hidden sm:inline">Satellites</span>
        </button>

        {/* What-If Simulation Sandbox Button */}
        <button
          onClick={onOpenSimModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 text-blue-700 dark:text-blue-300 text-xs font-mono transition-colors shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span className="hidden sm:inline">Simulate</span>
        </button>

        {/* Ask Twin Natural Language Assistant */}
        <button
          onClick={onOpenQueryModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs font-mono transition-colors shadow-md hover:shadow-cyan-500/20"
        >
          <HelpCircle className="w-3.5 h-3.5 text-white" />
          <span>Ask Twin</span>
        </button>

        {/* Global Theme Toggle */}
        <ThemeToggle mode="dropdown" className="shrink-0" />

        {/* Live Clock Display */}
        <div className="hidden lg:flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-300">
          <Clock className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400 dark:text-slate-500" />
          <span className="font-semibold">{utcTime || 'UTC'}</span>
        </div>
      </div>
    </header>
  );
}
