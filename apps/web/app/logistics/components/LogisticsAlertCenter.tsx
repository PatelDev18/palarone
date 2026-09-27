"use client"

import React, { useState } from 'react';
import { LogisticsAlert, ExceptionsSummary } from '@/types/logistics';
import {
  Bell,
  AlertTriangle,
  AlertOctagon,
  Info,
  CheckCircle2,
  UserPlus,
  Eye,
  Check,
  Clock,
  ShieldCheck,
  Filter
} from 'lucide-react';

interface Props {
  alerts: LogisticsAlert[];
  exceptions: ExceptionsSummary;
  onAlertAction: (alertId: string, action: string) => Promise<void>;
}

export function LogisticsAlertCenter({ alerts, exceptions, onAlertAction }: Props) {
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'INFO'>('ALL');
  const [selectedAlert, setSelectedAlert] = useState<LogisticsAlert | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const filteredAlerts = filterSeverity === 'ALL'
    ? alerts
    : alerts.filter(a => a.severity === filterSeverity);

  const handleAction = async (alertId: string, action: string) => {
    setActionInProgress(`${alertId}-${action}`);
    try {
      await onAlertAction(alertId, action);
    } finally {
      setTimeout(() => setActionInProgress(null), 500);
    }
  };

  return (
    <div className="my-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 backdrop-blur-sm p-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
            <Bell className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              Logistics Alert & Exception Command Center
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                ACTIVE MONITORING
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Real-time maritime anomalies, weather gales, stockout projections, and exception triage.
            </p>
          </div>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center gap-1.5 text-xs">
          {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev as any)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                filterSeverity === sev
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-slate-950 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-800'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Exception Management Strip (Section 19) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5">
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">OPEN EXCEPTIONS</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{exceptions.summary.open_exceptions}</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs">
            OPN
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-rose-900/40 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">CRITICAL EXCEPTIONS</span>
            <div className="text-2xl font-black text-rose-400 mt-0.5">{exceptions.summary.critical_exceptions}</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-bold text-xs">
            CRT
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">RESOLVED TODAY</span>
            <div className="text-2xl font-black text-emerald-400 mt-0.5">{exceptions.summary.resolved_today}</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs">
            OK
          </div>
        </div>
      </div>

      {/* Alerts Table / Feed (Section 18) */}
      <div className="space-y-3 mt-4">
        {filteredAlerts.map((alert) => {
          const isCritical = alert.severity === 'CRITICAL';
          const isWarning = alert.severity === 'WARNING';

          return (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                isCritical
                  ? 'bg-rose-950/20 border-rose-900/60'
                  : isWarning
                  ? 'bg-amber-950/20 border-amber-900/60'
                  : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isCritical
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : isWarning
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}
                  >
                    {alert.severity}
                  </span>
                  <span className="text-xs font-bold text-white">{alert.related_object}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Source: {alert.source}</span>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC
                  </span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300">{alert.description}</p>

                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Recommended Action: </span>
                  <span className="text-amber-300 font-medium">{alert.recommended_action}</span>
                </div>
              </div>

              {/* Action Buttons: [View] [Acknowledge] [Assign] [Resolve] - Section 18 */}
              <div className="flex items-center gap-1.5 self-start md:self-center shrink-0">
                <button
                  onClick={() => setSelectedAlert(alert)}
                  className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-400" />
                  <span>View</span>
                </button>

                <button
                  disabled={actionInProgress === `${alert.id}-ACK`}
                  onClick={() => handleAction(alert.id, 'ACKNOWLEDGE')}
                  className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1 disabled:opacity-50"
                >
                  <Check className="w-3.5 h-3.5 text-amber-400" />
                  <span>Acknowledge</span>
                </button>

                <button
                  disabled={actionInProgress === `${alert.id}-ASSIGN`}
                  onClick={() => handleAction(alert.id, 'ASSIGN')}
                  className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1 disabled:opacity-50"
                >
                  <UserPlus className="w-3.5 h-3.5 text-purple-400" />
                  <span>Assign</span>
                </button>

                <button
                  disabled={actionInProgress === `${alert.id}-RESOLVE`}
                  onClick={() => handleAction(alert.id, 'RESOLVE')}
                  className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600/80 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Resolve</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alert View Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-400" />
                <h4 className="font-bold text-slate-900 dark:text-white text-base">Alert Details: {selectedAlert.id}</h4>
              </div>
              <button onClick={() => setSelectedAlert(null)} className="text-slate-500 dark:text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Severity:</span>
                <span className="font-bold text-rose-400">{selectedAlert.severity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Source Component:</span>
                <span className="font-mono text-slate-200">{selectedAlert.source}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Related Object:</span>
                <span className="font-semibold text-slate-200">{selectedAlert.related_object}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Assigned Officer:</span>
                <span className="font-semibold text-blue-400">{selectedAlert.assigned_to || 'Duty Commander'}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 dark:text-slate-400 font-semibold">Incident Telemetry:</span>
              <p className="p-3 rounded-lg bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-200">{selectedAlert.description}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setSelectedAlert(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleAction(selectedAlert.id, 'RESOLVE');
                  setSelectedAlert(null);
                }}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-900 dark:text-white font-semibold flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Resolve Alert</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
