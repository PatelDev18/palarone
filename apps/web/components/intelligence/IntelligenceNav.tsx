"use client"

import React from 'react'
import { 
  LayoutDashboard, 
  Satellite, 
  Layers, 
  Snowflake, 
  CloudRain, 
  Ship, 
  ShieldAlert, 
  BrainCircuit, 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  History 
} from 'lucide-react'
import { IntelligenceSection } from '@/types/intelligence'

interface IntelligenceNavProps {
  activeSection: IntelligenceSection;
  onSelectSection: (section: IntelligenceSection) => void;
  criticalAlertsCount?: number;
  pendingReviewCount?: number;
}

export function IntelligenceNav({
  activeSection,
  onSelectSection,
  criticalAlertsCount = 2,
  pendingReviewCount = 3
}: IntelligenceNavProps) {
  const navItems: Array<{ id: IntelligenceSection; label: string; icon: React.ReactNode; badge?: string; badgeColor?: string }> = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'satellite', label: 'Satellite Intelligence', icon: <Satellite className="w-4 h-4" />, badge: '5 Scenes', badgeColor: 'bg-blue-500/20 text-blue-400' },
    { id: 'earth-observation', label: 'Earth Observation', icon: <Layers className="w-4 h-4" /> },
    { id: 'ice', label: 'Ice Intelligence', icon: <Snowflake className="w-4 h-4 text-cyan-400" />, badge: 'High Risk', badgeColor: 'bg-red-500/20 text-red-400' },
    { id: 'weather', label: 'Weather Intelligence', icon: <CloudRain className="w-4 h-4 text-amber-400" />, badge: '48kt Gale', badgeColor: 'bg-amber-500/20 text-amber-400' },
    { id: 'vessel', label: 'Vessel Intelligence', icon: <Ship className="w-4 h-4 text-blue-400" /> },
    { id: 'risk', label: 'Risk Intelligence', icon: <ShieldAlert className="w-4 h-4 text-rose-400" /> },
    { id: 'models', label: 'AI/ML Models', icon: <BrainCircuit className="w-4 h-4 text-purple-400" /> },
    { id: 'model-registry', label: 'Model Registry', icon: <Database className="w-4 h-4" /> },
    { id: 'data-quality', label: 'Data Quality', icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />, badge: 'Degraded', badgeColor: 'bg-amber-500/20 text-amber-400' },
    { 
      id: 'alerts', 
      label: 'Alerts & HITL', 
      icon: <AlertTriangle className="w-4 h-4 text-red-400" />, 
      badge: criticalAlertsCount > 0 ? `${criticalAlertsCount} Critical` : undefined, 
      badgeColor: 'bg-red-500/30 text-red-300 font-bold border border-red-500/40' 
    },
    { id: 'history', label: 'Intelligence History', icon: <History className="w-4 h-4" /> }
  ];

  return (
    <div className="w-full bg-white dark:bg-[#0a0f1d] border-b border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center gap-1 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 transition-colors duration-150">
      <div className="flex items-center space-x-1 shrink-0">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                isActive 
                  ? 'bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/40 shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge && (
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono leading-none ${item.badgeColor || 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
