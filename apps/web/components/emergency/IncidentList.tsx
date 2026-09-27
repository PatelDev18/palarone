"use client"

import React, { useState } from 'react'
import { 
  Incident, 
  IncidentSeverity, 
  IncidentStatus 
} from '@/types/emergency'
import { 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Ship, 
  Search, 
  Plus, 
  Filter, 
  ShieldAlert, 
  ArrowRight,
  Flame,
  UserCheck
} from 'lucide-react'

interface IncidentListProps {
  incidents: Incident[];
  selectedIncidentId: string;
  onSelectIncident: (incident: Incident) => void;
  onCreateIncidentClick: () => void;
}

export function IncidentList({
  incidents,
  selectedIncidentId,
  onSelectIncident,
  onCreateIncidentClick
}: IncidentListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredIncidents = incidents.filter(inc => {
    const matchesSearch = 
      inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.location_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.incident_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inc.affected_assets?.[0]?.name || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity = severityFilter === 'ALL' || inc.severity === severityFilter;
    const matchesStatus = statusFilter === 'ALL' || 
      (statusFilter === 'ACTIVE' && inc.status !== 'RESOLVED' && inc.status !== 'CLOSED') ||
      (statusFilter === 'AWAITING_APPROVAL' && inc.status === 'AWAITING_APPROVAL') ||
      (statusFilter === 'RESOLVED' && (inc.status === 'RESOLVED' || inc.status === 'CLOSED'));

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const getSeverityBadge = (sev: IncidentSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'MEDIUM':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'LOW':
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case 'AWAITING_APPROVAL':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse';
      case 'RESPONSE_ACTIVE':
      case 'MITIGATING':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'INCIDENT_DECLARED':
      case 'DETECTED':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'RESOLVED':
      case 'CLOSED':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      default:
        return 'bg-slate-700/50 text-slate-700 dark:text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="bg-[#0b1329] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col h-full shadow-lg">
      {/* Header & Controls */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-[#0f172a]/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
              Incident Management ({filteredIncidents.length})
            </h2>
          </div>
          <button
            onClick={onCreateIncidentClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-md shadow-red-900/30 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Declare Incident</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by ID, vessel, location, or type..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {['ALL', 'ACTIVE', 'AWAITING_APPROVAL', 'RESOLVED'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition ${
                  statusFilter === st
                    ? 'bg-slate-700 text-white font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="flex gap-1">
            {['ALL', 'CRITICAL', 'HIGH'].map(sev => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                  severityFilter === sev
                    ? 'border-blue-500 bg-blue-950/60 text-blue-300 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-850'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Incident List Body */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-200 dark:divide-slate-800/80 p-2 space-y-2">
        {filteredIncidents.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-500 dark:text-slate-400" />
            <p>No incidents match the active filter criteria.</p>
          </div>
        ) : (
          filteredIncidents.map(inc => {
            const isSelected = inc.id === selectedIncidentId;
            const primaryAsset = inc.affected_assets?.[0]?.name || 'Unassigned';

            return (
              <div
                key={inc.id}
                onClick={() => onSelectIncident(inc)}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-850 border-blue-500 shadow-md shadow-blue-900/20'
                    : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800/80 hover:bg-slate-850/60 hover:border-slate-700'
                }`}
              >
                {/* Top Row: ID, Severity, Status */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-100 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
                      {inc.id}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getSeverityBadge(inc.severity)}`}>
                      {inc.severity}
                    </span>
                    {inc.is_simulation && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-950 border border-amber-700/80 text-amber-400">
                        SIM
                      </span>
                    )}
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getStatusBadge(inc.status)}`}>
                    {inc.status.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Title & Type */}
                <h3 className="text-sm font-semibold text-slate-200 line-clamp-1 mb-1">
                  {inc.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-2.5">
                  {inc.description}
                </p>

                {/* Meta Details: Asset, Location, Risk Score */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-950/60 p-2 rounded border border-slate-200 dark:border-slate-800/80 mb-2">
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Affected Asset</span>
                    <span className="text-slate-200 font-medium truncate flex items-center gap-1">
                      <Ship className="w-3 h-3 text-blue-400" />
                      {primaryAsset}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Location</span>
                    <span className="text-slate-700 dark:text-slate-300 truncate block">{inc.location_name}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Risk Score</span>
                    <span className={`font-bold ${inc.risk_score >= 80 ? 'text-red-400' : 'text-amber-400'}`}>
                      {inc.risk_score}/100
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Response Lead</span>
                    <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <UserCheck className="w-3 h-3 text-emerald-400" />
                      {inc.response_lead}
                    </span>
                  </div>
                </div>

                {/* Bottom Footer: Detected Time & Action Indicator */}
                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-1">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-slate-500" />
                    Detected: {new Date(inc.detected_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC
                  </span>

                  <span className="text-blue-400 flex items-center gap-1 font-medium group-hover:translate-x-0.5 transition-transform">
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
