"use client"

import React from 'react'
import { 
  LayoutDashboard, 
  AlertOctagon, 
  Map, 
  LifeBuoy, 
  FileText, 
  MessageSquare, 
  CheckCircle2, 
  History, 
  FileBarChart 
} from 'lucide-react'

export type ResponseSectionTab = 
  | 'overview'
  | 'incidents'
  | 'map'
  | 'assets'
  | 'protocols'
  | 'communications'
  | 'approvals'
  | 'history'
  | 'reports';

interface ResponseSubNavProps {
  activeTab: ResponseSectionTab;
  onTabChange: (tab: ResponseSectionTab) => void;
  activeIncidentsCount?: number;
  pendingApprovalsCount?: number;
}

export function ResponseSubNav({
  activeTab,
  onTabChange,
  activeIncidentsCount = 0,
  pendingApprovalsCount = 0
}: ResponseSubNavProps) {
  const tabs = [
    { id: 'overview' as ResponseSectionTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'incidents' as ResponseSectionTab, label: 'Active Incidents', icon: AlertOctagon, count: activeIncidentsCount, countColor: 'bg-red-500 text-white' },
    { id: 'map' as ResponseSectionTab, label: 'Incident Map', icon: Map },
    { id: 'assets' as ResponseSectionTab, label: 'Response Assets', icon: LifeBuoy },
    { id: 'protocols' as ResponseSectionTab, label: 'Protocols', icon: FileText },
    { id: 'communications' as ResponseSectionTab, label: 'Communications', icon: MessageSquare },
    { id: 'approvals' as ResponseSectionTab, label: 'Approvals', icon: CheckCircle2, count: pendingApprovalsCount, countColor: 'bg-amber-500 text-slate-950 font-bold' },
    { id: 'history' as ResponseSectionTab, label: 'Incident History', icon: History },
    { id: 'reports' as ResponseSectionTab, label: 'Reports', icon: FileBarChart }
  ];

  return (
    <div className="bg-[#0b1329] border-b border-slate-200 dark:border-slate-800 px-6 py-2 flex items-center justify-between overflow-x-auto no-scrollbar shrink-0 shadow-inner">
      <div className="flex items-center space-x-1 sm:space-x-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${tab.countColor}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="hidden lg:flex items-center text-[11px] font-mono text-slate-500 dark:text-slate-400 gap-3">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>ANTARCTIC RESCUE COORDINATION (ARCC)</span>
        </span>
        <span className="text-slate-600">|</span>
        <span>SECTOR: 60°S - 90°S CIRCUMPOLAR</span>
      </div>
    </div>
  );
}
