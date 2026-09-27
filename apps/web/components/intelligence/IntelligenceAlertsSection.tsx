"use client"

import React, { useState } from 'react'
import { IntelligenceAlert } from '@/types/intelligence'
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle, 
  Clock, 
  Satellite, 
  ExternalLink, 
  Eye, 
  XCircle, 
  ChevronRight,
  UserCheck
} from 'lucide-react'

interface IntelligenceAlertsSectionProps {
  alerts: IntelligenceAlert[];
  onAction?: (action: 'ACKNOWLEDGE' | 'REVIEW' | 'DISMISS' | 'ESCALATE', alertId: string, notes?: string) => void;
}

export function IntelligenceAlertsSection({ alerts, onAction }: IntelligenceAlertsSectionProps) {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [selectedAlert, setSelectedAlert] = useState<IntelligenceAlert | null>(alerts[0] || null);
  const [actionNotes, setActionNotes] = useState<string>('');

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL': return 'bg-red-500/20 text-red-300 border-red-500/40 font-bold animate-pulse';
      case 'HIGH': return 'bg-red-500/20 text-red-400 border-red-500/30 font-semibold';
      case 'MEDIUM': return 'bg-amber-500/20 text-amber-300 border-amber-500/30 font-semibold';
      case 'LOW':
      default: return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-semibold';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-red-500/10 text-red-400 border border-red-500/30';
      case 'ACKNOWLEDGED': return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
      case 'UNDER_REVIEW': return 'bg-blue-500/10 text-blue-400 border border-blue-500/30';
      case 'RESOLVED': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
      case 'DISMISSED': return 'bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-700';
      default: return 'bg-slate-800 text-slate-700 dark:text-slate-300';
    }
  };

  const filtered = alerts.filter(a => {
    if (filterSeverity === 'ALL') return true;
    return a.severity === filterSeverity;
  });

  const handleAction = (action: 'ACKNOWLEDGE' | 'REVIEW' | 'DISMISS' | 'ESCALATE', alertId: string) => {
    if (onAction) {
      onAction(action, alertId, actionNotes);
      setActionNotes('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-red-500/10 rounded-md border border-red-500/20 text-red-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Intelligence Alerts & Human-in-the-Loop Operations</h2>
            <span className="text-xs font-mono bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-full font-bold">
              {alerts.length} ALERTS IN QUEUE
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Prioritized operational notifications requiring human command acknowledgment, review, escalation, or dismissal.
          </p>
        </div>

        {/* Severity Filters */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-lg">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(sev => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1 rounded text-xs font-semibold uppercase transition ${
                filterSeverity === sev ? 'bg-red-600 text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Main Alerts List & Selected Action Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts List */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.map((alert) => {
            const isSelected = selectedAlert?.id === alert.id;
            return (
              <div
                key={alert.id}
                onClick={() => setSelectedAlert(alert)}
                className={`p-4 rounded-xl border bg-white dark:bg-slate-900/80 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.25)] ring-1 ring-red-500/30'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${getSeverityBadge(alert.severity)}`}>
                        {alert.severity}
                      </span>
                      <span className="text-[11px] font-mono text-cyan-400 font-semibold">{alert.alert_type}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${getStatusBadge(alert.status)}`}>
                        {alert.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base mt-1.5">{alert.title}</h3>
                  </div>

                  <div className="text-right text-[11px] font-mono text-slate-500 shrink-0">
                    <Clock className="w-3 h-3 inline mr-1" />
                    <span>{alert.observation_freshness}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono my-2 text-slate-700 dark:text-slate-300">
                  <div>
                    <span className="text-slate-500 text-[10px] block">AFFECTED ENTITY</span>
                    <span className="font-bold text-slate-900 dark:text-white">{alert.affected_entity}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">DATA SOURCE</span>
                    <span className="text-cyan-400 font-bold">{alert.source_satellite || 'Multi-Feed'}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded border border-slate-200 dark:border-slate-800/80 mt-2">
                  <strong className="text-slate-800 dark:text-slate-200">Cause:</strong> {alert.cause}
                </p>

                <div className="flex items-center justify-between text-xs text-amber-300 mt-2 font-medium">
                  <span className="truncate"><strong>Action:</strong> {alert.recommended_action}</span>
                  <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Alert Action Panel (Section 23 Human-in-the-Loop) */}
        {selectedAlert && (
          <div className="bg-[#0f172a]/95 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col justify-between h-fit space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                  Human-in-the-Loop Decision
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${getSeverityBadge(selectedAlert.severity)}`}>
                  {selectedAlert.severity}
                </span>
              </div>

              <div className="my-3 space-y-3 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">TARGET ALERT</span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{selectedAlert.title}</h4>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1.5 font-mono text-[11px]">
                  <div>Entity: <span className="text-slate-900 dark:text-white font-bold">{selectedAlert.affected_entity}</span></div>
                  <div>Source: <span className="text-cyan-400">{selectedAlert.source_satellite || 'Telemetry'}</span></div>
                  <div>Status: <span className="text-amber-400 font-bold">{selectedAlert.status}</span></div>
                  {selectedAlert.human_reviewer && (
                    <div className="text-emerald-400">Reviewer: {selectedAlert.human_reviewer}</div>
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">DUTY OFFICER LOG NOTE</span>
                  <textarea
                    rows={3}
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                    placeholder="Enter operational directives, route clearance note, or reason for action..."
                    className="w-full bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleAction('ACKNOWLEDGE', selectedAlert.id)}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white font-semibold py-2 rounded-lg text-xs transition shadow"
                >
                  Acknowledge
                </button>
                <button
                  onClick={() => handleAction('REVIEW', selectedAlert.id)}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2 rounded-lg text-xs border border-slate-700 transition"
                >
                  Mark In Review
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleAction('ESCALATE', selectedAlert.id)}
                  className="w-full bg-red-600/30 hover:bg-red-600/50 text-red-300 font-semibold py-2 rounded-lg text-xs border border-red-500/40 transition"
                >
                  Escalate Alert
                </button>
                <button
                  onClick={() => handleAction('DISMISS', selectedAlert.id)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold py-2 rounded-lg text-xs border border-slate-200 dark:border-slate-800 transition"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
