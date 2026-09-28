"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  Search,
  Bell,
  Clock,
  Radio,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X,
  Compass,
  Ship,
  Building2,
  Activity,
  Layers
} from 'lucide-react';
import { UserRole, AlertItem, TimeHorizon } from '@/types/command-center';
import { getSimulatedUtcTime } from '@/lib/utils/projections';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

interface CommandHeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeScenarioName: string;
  onOpenDemoModal: () => void;
  alerts: AlertItem[];
  onSelectEntity: (type: 'VESSEL' | 'STATION' | 'ALERT' | 'CARGO' | 'WEATHER', id: string) => void;
  onSearchSelect: (item: any) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  searchResults: any[];
  networkState: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  timeHorizon?: TimeHorizon;
}

export function CommandHeader({
  currentRole,
  onRoleChange,
  activeScenarioName,
  onOpenDemoModal,
  alerts,
  onSelectEntity,
  onSearchSelect,
  searchQuery,
  onSearchChange,
  searchResults,
  networkState,
  timeHorizon = 'Live',
}: CommandHeaderProps) {
  const [utcTime, setUtcTime] = useState<string>('');
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(getSimulatedUtcTime(now, timeHorizon));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timeHorizon]);

  const safeAlerts = Array.isArray(alerts) ? alerts : [];
  const unreadAlerts = safeAlerts.filter(a => a.status === 'NEW' || a.status === 'ACKNOWLEDGED');

  return (
    <header className="h-14 bg-white dark:bg-[#020617] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 shrink-0 z-40 relative select-none transition-colors duration-150">
      {/* Left: Branding & Direct Navigation */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white shadow-sm dark:shadow-[0_0_12px_rgba(37,99,235,0.5)] border border-blue-500/40">
            <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-extrabold text-base tracking-wider text-slate-900 dark:text-slate-100">
                POLAR<span className="text-blue-600 dark:text-blue-500">ONE</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30 uppercase tracking-widest">
                OPS CC
              </span>
            </div>
          </div>
        </Link>

        {/* Global Module Tabs (Command Center visually highlighted) */}
        <nav className="hidden lg:flex items-center gap-1 ml-4 pl-4 border-l border-slate-200 dark:border-slate-800 text-xs font-medium">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-600/20 dark:text-blue-400 dark:border-blue-500/40 shadow-sm font-semibold">
            <Activity className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-pulse" />
            Command Center
          </span>
          <Link href="/digital-twin" className="px-2.5 py-1.5 rounded text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors">
            Digital Twin
          </Link>
          <Link href="/analytics" className="px-2.5 py-1.5 rounded text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors">
            Analytics
          </Link>
          <Link href="/expeditions" className="px-2.5 py-1.5 rounded text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors">
            Expeditions
          </Link>
          <Link href="/logistics" className="px-2.5 py-1.5 rounded text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors">
            Logistics
          </Link>
          <Link href="/intelligence" className="px-2.5 py-1.5 rounded text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors">
            Intelligence
          </Link>
          <Link href="/response" className="px-2.5 py-1.5 rounded text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors">
            Response Center
          </Link>
          <Link href="/copilot" className="px-2.5 py-1.5 rounded text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors">
            Copilot
          </Link>
          <Link href="/administration" className="px-2.5 py-1.5 rounded text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors">
            Admin
          </Link>
        </nav>
      </div>

      {/* Center: Global Command Search */}
      <div className="relative w-64 md:w-80 lg:w-96 mx-3">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            placeholder="Search vessels, stations, missions, cargo, alerts..."
            className="w-full bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-200 dark:border-slate-700/80 rounded-md pl-9 pr-7 py-1.5 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-700 dark:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {searchFocused && searchQuery.length > 0 && (
          <div
            className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xl p-1.5 z-50 max-h-72 overflow-y-auto backdrop-blur-md"
            onMouseDown={(e) => e.preventDefault()}
          >
            <div className="px-2 py-1 text-[10px] font-mono text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {searchResults.length} Results Found
            </div>
            {searchResults.length === 0 ? (
              <div className="p-3 text-center text-xs text-slate-500 dark:text-slate-400">
                No matching operational entities found.
              </div>
            ) : (
              searchResults.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSearchSelect(item);
                    setSearchFocused(false);
                  }}
                  className="w-full text-left p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between text-xs transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    {item.category === 'VESSEL' && <Ship className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />}
                    {item.category === 'STATION' && <Building2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />}
                    {item.category === 'ALERT' && <AlertTriangle className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />}
                    {item.category === 'MISSION' && <Compass className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />}
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.subtitle}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {item.category}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Right Controls: Clock, Status, Demo Scenario, Role & Notifications */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* UTC Clock */}
        <div
          className={`hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded font-mono text-xs border ${
            timeHorizon !== 'Live'
              ? 'bg-cyan-50 dark:bg-cyan-950/80 border-cyan-300 dark:border-cyan-500/60 text-cyan-800 dark:text-cyan-200'
              : 'bg-slate-100 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <Clock className={`w-3.5 h-3.5 ${timeHorizon !== 'Live' ? 'text-cyan-600 dark:text-cyan-400 animate-spin' : 'text-cyan-600 dark:text-cyan-400'}`} style={{ animationDuration: '10s' }} />
          <span>{utcTime || 'SYNCHRONIZING...'}</span>
          {timeHorizon !== 'Live' && (
            <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-400/40 uppercase font-semibold">
              SIM (+{timeHorizon})
            </span>
          )}
        </div>

        {/* Network & Freshness Status */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold uppercase tracking-wider font-mono ${
            networkState === 'ONLINE'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
              : networkState === 'DEGRADED'
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.2)]'
          }`}
          title={`Antarctic Telemetry Sync: ${networkState}`}
        >
          <span className="relative flex h-2 w-2">
            {networkState === 'ONLINE' && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                networkState === 'ONLINE'
                  ? 'bg-emerald-500'
                  : networkState === 'DEGRADED'
                  ? 'bg-amber-500'
                  : 'bg-red-500'
              }`}
            ></span>
          </span>
          <span className="hidden sm:inline">{networkState}</span>
        </div>

        {/* Demo Mode Switcher Button */}
        <button
          onClick={onOpenDemoModal}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 dark:bg-blue-600/20 dark:hover:bg-blue-600/30 dark:border-blue-500/40 dark:text-blue-300 text-xs font-medium transition-all shadow-sm group"
          title="Trigger Antarctic Operational Scenarios"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 group-hover:rotate-12 transition-transform" />
          <span className="font-mono hidden md:inline">DEMO:</span>
          <span className="max-w-[120px] truncate text-[11px] font-semibold">
            {activeScenarioName.replace('Scenario ', 'S')}
          </span>
        </button>

        {/* Role Selector (Commander, Operations Officer, Safety Officer) */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-200 dark:border-slate-700/80 hover:border-slate-400 dark:hover:border-slate-600 text-slate-800 dark:text-slate-200 text-xs font-medium transition-all"
            title="Switch User Role for Human-in-the-Loop Decisions"
          >
            <Shield className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span className="hidden sm:inline">{currentRole}</span>
            <ChevronDown className="w-3 h-3 text-slate-500 dark:text-slate-400" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xl p-1 z-50">
              <div className="px-2.5 py-1 text-[10px] font-mono text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Select Active Role
              </div>
              {(
                ['Commander', 'Operations Officer', 'Logistics Officer', 'Safety Officer', 'Administrator'] as UserRole[]
              ).map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    onRoleChange(role);
                    setRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between transition-colors ${
                    currentRole === role
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-600/20 dark:text-blue-400 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{role}</span>
                  {currentRole === role && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Global Theme Toggle */}
        <ThemeToggle mode="dropdown" className="shrink-0" />

        {/* Notification Indicator Bell */}
        <div className="relative">
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="relative p-1.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            title="Operational Alerts & Warnings"
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-[#020617] animate-pulse">
                {unreadAlerts.length}
              </span>
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-80 sm:w-96 bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xl p-2 z-50 backdrop-blur-md">
              <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-200 dark:border-slate-800 mb-2">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Priority Alerts ({unreadAlerts.length})
                </span>
                <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400">COMMAND QUEUE</span>
              </div>
              <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
                {alerts.slice(0, 5).map((alert) => (
                  <div
                    key={alert.alert_id}
                    onClick={() => {
                      onSelectEntity(alert.entity_type, alert.entity_id);
                      setNotifDropdownOpen(false);
                    }}
                    className="p-2 rounded bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/50 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span
                        className={`font-mono font-bold px-1.5 py-0.2 rounded text-[10px] ${
                          alert.severity === 'CRITICAL'
                            ? 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30'
                            : alert.severity === 'HIGH'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30'
                            : 'bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30'
                        }`}
                      >
                        {alert.severity}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 text-[10px]">{alert.location}</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">{alert.title}</div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 mt-0.5">
                      {alert.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
