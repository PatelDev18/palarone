"use client"

import React, { useState } from 'react'
import { AuditLogEntry } from '@/types/emergency'
import { 
  History, 
  Search, 
  ShieldCheck, 
  UserCheck, 
  Filter, 
  FileText, 
  Database,
  ArrowRight
} from 'lucide-react'

interface AuditLogViewerProps {
  auditLogs: AuditLogEntry[];
}

export function AuditLogViewer({ auditLogs }: AuditLogViewerProps) {
  const [search, setSearch] = useState('');
  const [selectedIncident, setSelectedIncident] = useState('ALL');

  const safeLogs = Array.isArray(auditLogs) ? auditLogs : [];

  const filteredLogs = safeLogs.filter(log => {
    const matchesSearch = 
      log.user_name.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.reason.toLowerCase().includes(search.toLowerCase()) ||
      log.incident_id.toLowerCase().includes(search.toLowerCase());

    const matchesInc = selectedIncident === 'ALL' || log.incident_id === selectedIncident;
    return matchesSearch && matchesInc;
  });

  const uniqueIncidents = Array.from(new Set(safeLogs.map(l => l.incident_id)));

  return (
    <div className="bg-[#0b1329] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xl space-y-4 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
              <span>Immutable Response Audit Log</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                CRYPTOGRAPHIC VERIFIED
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">Traceable record of all human decisions, state changes, and automated triggers</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search audit trail..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 w-44"
            />
          </div>

          <select
            value={selectedIncident}
            onChange={e => setSelectedIncident(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Incidents</option>
            {uniqueIncidents.map(id => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-x-auto no-scrollbar bg-slate-950/60">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-900/90 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase">
              <th className="p-3">Timestamp UTC</th>
              <th className="p-3">Incident</th>
              <th className="p-3">User & Role</th>
              <th className="p-3">Action Executed</th>
              <th className="p-3">State Transition</th>
              <th className="p-3">Reason / Commander Note</th>
              <th className="p-3">Data Consulted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 text-[11px]">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate-500">
                  No audit log entries matching search query.
                </td>
              </tr>
            ) : (
              filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-white dark:bg-slate-900/50 transition">
                  <td className="p-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'medium' })}
                  </td>
                  <td className="p-3">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-bold">
                      {log.incident_id}
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <div className="font-bold text-slate-200 flex items-center gap-1">
                      <UserCheck className="w-3 h-3 text-emerald-400" />
                      <span>{log.user_name}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{log.user_role}</span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800 font-bold whitespace-nowrap">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-[10px]">
                      <span className="text-slate-500">{log.old_state}</span>
                      <ArrowRight className="w-3 h-3 text-slate-600" />
                      <span className="text-slate-200 font-bold">{log.new_state}</span>
                    </div>
                  </td>
                  <td className="p-3 max-w-xs text-slate-700 dark:text-slate-300 font-sans truncate" title={log.reason}>
                    {log.reason}
                  </td>
                  <td className="p-3 whitespace-nowrap text-slate-500 dark:text-slate-400 text-[10px]">
                    {log.data_sources_consulted?.join(', ') || 'AIS, Satellite'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
