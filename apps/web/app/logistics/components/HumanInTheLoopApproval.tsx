"use client"

import React, { useState } from 'react';
import { ApprovalItem, AuditLogEntry } from '@/types/logistics';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Edit3,
  FileCheck,
  UserCheck,
  History,
  AlertCircle
} from 'lucide-react';

interface Props {
  approvals: ApprovalItem[];
  auditLog: AuditLogEntry[];
  onDecision: (approvalId: string, decision: 'APPROVE' | 'REJECT' | 'MODIFY', notes?: string) => Promise<void>;
}

export function HumanInTheLoopApproval({ approvals, auditLog, onDecision }: Props) {
  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null);
  const [modalMode, setModalMode] = useState<'REVIEW' | 'MODIFY' | null>(null);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const pendingApprovals = approvals.filter(a => a.status === 'PENDING');

  const handleAction = async (id: string, decision: 'APPROVE' | 'REJECT' | 'MODIFY', actionNotes?: string) => {
    setSubmitting(true);
    try {
      await onDecision(id, decision, actionNotes || notes);
      setSelectedItem(null);
      setModalMode(null);
      setNotes('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="my-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 backdrop-blur-sm p-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <UserCheck className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              Human-in-the-Loop Operational Decisions (HITL)
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                COMMANDER APPROVAL REQUIRED
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Consequential operational modifications cannot be executed autonomously by AI. Human commander review and sign-off is mandatory.
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <span>Pending Decisions:</span>
          <span className="px-2 py-0.5 rounded font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {pendingApprovals.length} Awaiting
          </span>
        </div>
      </div>

      {/* Main Grid: Pending Action Cards & Live Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Pending Actions (2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            AI Operational Recommendations
          </span>

          {pendingApprovals.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              All consequential recommendations have been evaluated and resolved by the commander.
            </div>
          ) : (
            pendingApprovals.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {item.severity}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{item.title}</h3>
                  </div>
                  <span className="text-[11px] text-amber-400 font-medium">{item.urgency}</span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300">{item.description}</p>

                {/* Impact Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-200 dark:border-slate-800/80 text-[11px]">
                  {item.impact.distance_delta && (
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Distance Delta:</span>
                      <span className="font-semibold text-slate-200">{item.impact.distance_delta}</span>
                    </div>
                  )}
                  {item.impact.fuel_impact && (
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Fuel Impact:</span>
                      <span className="font-semibold text-slate-200">{item.impact.fuel_impact}</span>
                    </div>
                  )}
                  {item.impact.eta_gain_hours && (
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Time Saved:</span>
                      <span className="font-semibold text-emerald-400">{item.impact.eta_gain_hours}</span>
                    </div>
                  )}
                  {item.impact.safety_score && (
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Safety Gain:</span>
                      <span className="font-semibold text-cyan-300">{item.impact.safety_score}</span>
                    </div>
                  )}
                  {item.impact.stock_buffer_extended && (
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Stock Buffer:</span>
                      <span className="font-semibold text-emerald-400">{item.impact.stock_buffer_extended}</span>
                    </div>
                  )}
                  {item.impact.operational_risk && (
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Risk Mitigation:</span>
                      <span className="font-semibold text-amber-300">{item.impact.operational_risk}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons: [Review] [Approve] [Reject] [Modify] - Section 15 */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setModalMode('REVIEW');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-blue-400" />
                    <span>Review</span>
                  </button>

                  <button
                    disabled={submitting}
                    onClick={() => handleAction(item.id, 'APPROVE', 'Immediate execution authorized by Commander Hansen.')}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>

                  <button
                    disabled={submitting}
                    onClick={() => handleAction(item.id, 'REJECT', 'Rejected by Commander Hansen. Vessel will maintain current heading.')}
                    className="px-3 py-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setModalMode('MODIFY');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Modify</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Live Immutable Audit Log (Section 36) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" /> Audit Log
            </span>
            <span className="text-[10px] text-slate-500">Immutable Ledger</span>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {auditLog.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 text-[11px] space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-xs">{log.action}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC
                  </span>
                </div>
                <div className="text-slate-700 dark:text-slate-300">
                  <span className="text-slate-500">Target: </span>{log.object}
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-[10px]">
                  <span className="text-slate-500">User: </span>{log.user}
                </div>
                <div className="pt-1 text-[10px] font-mono text-emerald-400">
                  Status: {log.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review / Modify Modal */}
      {selectedItem && modalMode && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  {modalMode === 'REVIEW' ? 'Review Consequential Recommendation' : 'Modify Operational Parameters'}
                </h4>
              </div>
              <button
                onClick={() => { setSelectedItem(null); setModalMode(null); }}
                className="text-slate-500 dark:text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="font-bold text-white">{selectedItem.title}</span>
              <p className="text-slate-700 dark:text-slate-300">{selectedItem.description}</p>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                {modalMode === 'MODIFY' ? 'Custom Operational Directives / Heading Adjustments:' : 'Commander Sign-Off Operational Notes:'}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={modalMode === 'MODIFY' ? 'e.g. Divert to WP-Echo with speed limited to 9.5 knots...' : 'e.g. Reviewed with Chief Engineer and approved under standard storm protocol.'}
                className="w-full h-24 p-3 rounded-xl bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => { setSelectedItem(null); setModalMode(null); }}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                disabled={submitting}
                onClick={() => handleAction(selectedItem.id, modalMode === 'MODIFY' ? 'MODIFY' : 'APPROVE', notes)}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white font-semibold flex items-center gap-1.5 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm {modalMode === 'MODIFY' ? 'Modification' : 'Authorization'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
