"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Activity, Globe, Package, Cpu, Shield, AlertTriangle, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

export function Navbar() {
  const pathname = usePathname()
  
  // Mobile / Click states for dropdowns
  const [openLogistics, setOpenLogistics] = useState(false)
  const [openIntelligence, setOpenIntelligence] = useState(false)
  
  // Phase 55 & 62: Offline Connectivity States
  const [networkState, setNetworkState] = useState<'ONLINE' | 'DEGRADED' | 'OFFLINE' | 'SYNCING'>('ONLINE')
  const [pendingSync, setPendingSync] = useState(0)

  // Simulate Antarctic communication intermittency
  useEffect(() => {
    const interval = setInterval(() => {
      const rand = Math.random();
      if (rand > 0.95) setNetworkState('OFFLINE');
      else if (rand > 0.85) setNetworkState('DEGRADED');
      else if (rand > 0.80) { setNetworkState('SYNCING'); setPendingSync(0); }
      else setNetworkState('ONLINE');
      
      if (networkState === 'OFFLINE') setPendingSync(prev => prev + Math.floor(Math.random() * 3));
    }, 15000);
    return () => clearInterval(interval);
  }, [networkState]);

  if (
    pathname === '/' ||
    pathname.includes('/command-center') ||
    pathname.includes('/response') ||
    pathname.includes('/digital-twin')
  ) {
    return null
  }

  const getLinkClass = (path: string, activeColor: string) => {
    const isActive = pathname.includes(path)
    return `flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
      isActive
        ? `bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-${activeColor}-400 font-semibold shadow-sm`
        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
    }`
  }

  return (
    <header className="h-16 bg-white dark:bg-[#020617] border-b border-slate-200 dark:border-slate-800 flex items-center px-6 shadow-sm z-50 shrink-0 w-full relative">
      <Link href="/" className="font-extrabold text-xl mr-8 tracking-tight flex items-center gap-2">
        <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white shadow-sm">
          <Shield className="w-5 h-5" />
        </div>
        <span className="text-slate-900 dark:text-slate-100">POLAR<span className="text-blue-600 dark:text-blue-500">ONE</span></span>
      </Link>
      
      <nav className="flex space-x-1 text-sm font-medium">
        <Link href="/command-center" className={getLinkClass('/command-center', 'blue')}>
          <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          Command Center
        </Link>
        
        <Link href="/digital-twin" className={getLinkClass('/digital-twin', 'purple')}>
          <Globe className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          Digital Twin
        </Link>
        
        <Link href="/analytics" className={getLinkClass('/analytics', 'cyan')}>
          <Activity className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          Analytics
        </Link>

        <Link href="/expeditions" className={getLinkClass('/expeditions', 'blue')}>
          <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Expeditions
        </Link>

        {/* Logistics Dropdown */}
        <div 
          className="relative flex items-center"
          onMouseEnter={() => setOpenLogistics(true)}
          onMouseLeave={() => setOpenLogistics(false)}
        >
          <Link href="/logistics" className={getLinkClass('/logistics', 'amber')}>
            <Package className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            Logistics
            <ChevronDown className={`w-3 h-3 transition-transform ${openLogistics ? 'rotate-180' : ''}`} />
          </Link>
          
          {/* Dropdown Menu */}
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
          <Link href="/intelligence" className={getLinkClass('/intelligence', 'pink')}>
            <Cpu className="w-4 h-4 text-pink-600 dark:text-pink-400" />
            Intelligence
            <ChevronDown className={`w-3 h-3 transition-transform ${openIntelligence ? 'rotate-180' : ''}`} />
          </Link>
          
          {/* Dropdown Menu */}
          {openIntelligence && (
            <div className="absolute top-[100%] left-0 pt-2 w-56 z-50">
              <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xl p-1.5 flex flex-col gap-1">
                <Link href="/intelligence/satellites" className="px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-pink-600 dark:hover:text-pink-400 rounded-md transition-colors text-sm">Live Satellites (STAC)</Link>
                <Link href="/intelligence/ml" className="px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-pink-600 dark:hover:text-pink-400 rounded-md transition-colors text-sm">ML Model Registry</Link>
              </div>
            </div>
          )}
        </div>

        <Link href="/response" className={getLinkClass('/response', 'red')}>
          <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
          Response Center
        </Link>
        
        <Link href="/copilot" className={getLinkClass('/copilot', 'purple')}>
          <Globe className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          Copilot
        </Link>
        
        <Link href="/administration" className={getLinkClass('/administration', 'blue')}>
          <Shield className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          Admin
        </Link>
      </nav>

      <div className="ml-auto flex items-center space-x-3">
        {/* Global Theme Toggle */}
        <ThemeToggle variant="dropdown" />

        {/* Phase 62: Offline User Experience Indicator */}
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider font-mono transition-colors ${
          networkState === 'ONLINE' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' :
          networkState === 'OFFLINE' ? 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400' :
          networkState === 'SYNCING' ? 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400' :
          'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
        }`}>
          <span className="relative flex h-2 w-2">
            {networkState === 'ONLINE' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
            {networkState === 'SYNCING' && <span className="animate-spin absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 border-t-2 border-blue-200"></span>}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              networkState === 'ONLINE' ? 'bg-emerald-500' :
              networkState === 'OFFLINE' ? 'bg-red-500' :
              networkState === 'SYNCING' ? 'bg-blue-500' : 'bg-amber-500'
            }`}></span>
          </span>
          {networkState} {pendingSync > 0 && `(${pendingSync} PENDING)`}
        </div>

        <button 
          onClick={() => {
            fetch('http://localhost:8000/api/v1/demo/trigger', { method: 'POST' })
              .then(res => res.json())
              .then(data => alert(data.message + "\n\n" + data.events_triggered.map((e: any) => e.system + ": " + e.update).join("\n")))
              .catch(console.error);
          }}
          className="text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-3.5 py-1.5 rounded-md font-medium transition-all shadow-sm">
          Trigger Demo
        </button>
      </div>
    </header>
  )
}
