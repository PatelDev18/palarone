"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  ShieldAlert, 
  Activity, 
  Globe, 
  Package, 
  Cpu, 
  AlertTriangle, 
  ChevronDown, 
  Bell, 
  UserCheck, 
  Sparkles,
  Wifi,
  WifiOff,
  Radio
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

interface ResponseHeaderProps {
  activeIncidentsCount: number;
  pendingApprovalsCount: number;
  systemStatus: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  isSimulationActive?: boolean;
  onOpenSimulationModal: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount?: number;
}

export function ResponseHeader({
  activeIncidentsCount,
  pendingApprovalsCount,
  systemStatus,
  isSimulationActive = false,
  onOpenSimulationModal,
  onOpenNotifications,
  unreadNotificationsCount = 3
}: ResponseHeaderProps) {
  const [openLogistics, setOpenLogistics] = useState(false);
  const [openIntelligence, setOpenIntelligence] = useState(false);

  return (
    <header className="h-16 bg-white dark:bg-[#020617] border-b border-slate-200 dark:border-slate-800 flex items-center px-6 shadow-sm dark:shadow-xl z-40 shrink-0 w-full relative transition-colors duration-150">
      {/* Brand & Logo */}
      <Link href="/" className="font-extrabold text-xl mr-6 tracking-tight flex items-center gap-2 group">
        <div className="w-8 h-8 rounded bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white shadow-sm dark:shadow-[0_0_12px_rgba(225,29,72,0.4)] group-hover:scale-105 transition-transform">
          <ShieldAlert className="w-5 h-5 text-white" />
        </div>
        <span className="text-slate-900 dark:text-slate-100">POLAR<span className="text-blue-600 dark:text-blue-500">ONE</span></span>
        <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/80 dark:text-red-400 dark:border-red-800/80 ml-1">
          RESP-CMD
        </span>
      </Link>

      {/* Global Navigation */}
      <nav className="hidden xl:flex space-x-1 text-sm font-medium">
        <Link href="/command-center" className="flex items-center gap-1.5 px-3 py-2 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
          <Activity className="w-4 h-4 text-blue-500 dark:text-blue-400" />
          Command Center
        </Link>
        
        <Link href="/digital-twin" className="flex items-center gap-1.5 px-3 py-2 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
          <Globe className="w-4 h-4 text-purple-500 dark:text-purple-400" />
          Digital Twin
        </Link>
        
        <Link href="/analytics" className="flex items-center gap-1.5 px-3 py-2 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
          <Activity className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
          Analytics
        </Link>

        <Link href="/expeditions" className="flex items-center gap-1.5 px-3 py-2 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
          <Globe className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          Expeditions
        </Link>

        {/* Logistics Dropdown */}
        <div 
          className="relative flex items-center"
          onMouseEnter={() => setOpenLogistics(true)}
          onMouseLeave={() => setOpenLogistics(false)}
        >
          <Link href="/logistics" className="flex items-center gap-1.5 px-3 py-2 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
            <Package className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            Logistics
            <ChevronDown className={`w-3 h-3 transition-transform ${openLogistics ? 'rotate-180' : ''}`} />
          </Link>
          {openLogistics && (
            <div className="absolute top-[100%] left-0 pt-2 w-56 z-50">
              <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xl p-1.5 flex flex-col gap-1">
                <Link href="/logistics/ships" className="px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-amber-600 dark:hover:text-amber-400 rounded-md transition-colors text-sm">Ship Logistics</Link>
                <Link href="/logistics/inventory" className="px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-amber-600 dark:hover:text-amber-400 rounded-md transition-colors text-sm">Inventory Prediction</Link>
                <Link href="/logistics/optimization" className="px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-amber-600 dark:hover:text-amber-400 rounded-md transition-colors text-sm">Route Optimization</Link>
              </div>
            </div>
          )}
        </div>

        {/* Intelligence Dropdown */}
        <div 
          className="relative flex items-center"
          onMouseEnter={() => setOpenIntelligence(true)}
          onMouseLeave={() => setOpenIntelligence(false)}
        >
          <Link href="/intelligence" className="flex items-center gap-1.5 px-3 py-2 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
            <Cpu className="w-4 h-4 text-pink-500 dark:text-pink-400" />
            Intelligence
            <ChevronDown className={`w-3 h-3 transition-transform ${openIntelligence ? 'rotate-180' : ''}`} />
          </Link>
          {openIntelligence && (
            <div className="absolute top-[100%] left-0 pt-2 w-56 z-50">
              <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xl p-1.5 flex flex-col gap-1">
                <Link href="/intelligence/satellites" className="px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-pink-600 dark:hover:text-pink-400 rounded-md transition-colors text-sm">Live Satellites (STAC)</Link>
                <Link href="/intelligence/ml" className="px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-pink-600 dark:hover:text-pink-400 rounded-md transition-colors text-sm">ML Model Registry</Link>
              </div>
            </div>
          )}
        </div>

        {/* Response Center (ACTIVE HIGHLIGHT) */}
        <Link href="/response" className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-rose-50 text-rose-700 border border-rose-200 dark:bg-gradient-to-r dark:from-red-950/80 dark:to-slate-900 dark:border-red-700/60 dark:text-red-300 font-semibold shadow-sm dark:shadow-[0_0_12px_rgba(225,29,72,0.25)]">
          <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-red-400 animate-pulse" />
          Response Center
        </Link>
        
        <Link href="/copilot" className="flex items-center gap-1.5 px-3 py-2 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
          <Sparkles className="w-4 h-4 text-purple-500 dark:text-purple-400" />
          Copilot
        </Link>
      </nav>

      {/* Right-Side Operational Status & Controls */}
      <div className="ml-auto flex items-center space-x-3">
        {/* Simulation Indicator */}
        {isSimulationActive && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-400 text-xs font-mono font-bold animate-pulse">
            <Radio className="w-3.5 h-3.5" />
            <span>SIMULATION MODE</span>
          </div>
        )}

        {/* System Connectivity Status */}
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider font-mono ${
          systemStatus === 'ONLINE' ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400 shadow-sm dark:shadow-[0_0_10px_rgba(16,185,129,0.2)]' :
          systemStatus === 'DEGRADED' ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-400' :
          'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-400 shadow-sm dark:shadow-[0_0_10px_rgba(244,63,94,0.3)]'
        }`}>
          <span className="relative flex h-2 w-2">
            {systemStatus === 'ONLINE' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              systemStatus === 'ONLINE' ? 'bg-emerald-500' :
              systemStatus === 'DEGRADED' ? 'bg-amber-500' : 'bg-rose-500'
            }`}></span>
          </span>
          <span>{systemStatus}</span>
        </div>

        {/* Active Incidents Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-50 border border-rose-200 text-rose-700 dark:bg-red-950/70 dark:border-red-800/80 dark:text-red-300 text-xs font-mono font-bold">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <span>{activeIncidentsCount} ACTIVE INCIDENT{activeIncidentsCount === 1 ? '' : 'S'}</span>
        </div>

        {/* Pending Approvals Badge */}
        {pendingApprovalsCount > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-950/70 dark:border-amber-700/80 dark:text-amber-300 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>{pendingApprovalsCount} PENDING APPROVAL{pendingApprovalsCount === 1 ? '' : 'S'}</span>
          </div>
        )}

        {/* Global Theme Toggle */}
        <ThemeToggle mode="dropdown" className="shrink-0" />

        {/* Notification Bell */}
        <button 
          onClick={onOpenNotifications}
          className="relative p-2 rounded-lg bg-slate-100 border border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-200 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700 transition"
          title="Response Center Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* User / Commander Profile */}
        <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-7 h-7 rounded-full bg-blue-100 border border-blue-300 dark:bg-blue-600/30 dark:border-blue-500/50 flex items-center justify-center text-blue-700 dark:text-blue-300 text-xs font-bold">
            CH
          </div>
          <div className="text-left text-xs">
            <div className="font-semibold text-slate-900 dark:text-slate-200 leading-tight">Cmdr. Hayes</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Operations Lead</div>
          </div>
        </div>

        {/* Trigger Demo / Simulation Button */}
        <button 
          onClick={onOpenSimulationModal}
          className="text-xs bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white px-3.5 py-1.5 rounded font-medium transition shadow-sm dark:shadow-[0_0_12px_rgba(225,29,72,0.3)] flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Trigger Demo</span>
        </button>
      </div>
    </header>
  );
}
