"use client"

import React, { useState } from 'react'
import { ApprovalRequest } from '@/types/emergency'
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ShieldCheck, 
  UserCheck, 
  Lock, 
  AlertCircle,
  FileCheck,
  Send
} from 'lucide-react'

interface ApprovalPanelProps {
  approvals: ApprovalRequest[];
  onApprove: (approvalId: string, commanderName: string, comment: string) => Promise<void>;
  onReject: (approvalId: string, commanderName: string, reason: string) => Promise<void>;
  onRequestMoreInfo?: (approvalId: string, query: string) => void;
}

export function ApprovalPanel({
  approvals,
  onApprove,
  onReject,
  onRequestMoreInfo
}: ApprovalPanelProps) {
  const [commanderName, setCommanderName] = useState('Cmdr. Hayes');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const pendingApprovals = approvals.filter(a => a.status === 'PENDING');
  const decidedApprovals = approvals.filter(a => a.status !== 'PENDING');

  const handleApprove = async (approvalId: string) => {
    if (!comment.trim()) {
      alert("Commander sign-off comment/justification is required before formal approval.");
      return;
    }
    setIsSubmitting(true);
    try {
      await onApprove(approvalId, commanderName, comment);
      setActionFeedback(`Approved by ${commanderName}. Waypoint order dispatched to vessel bridge.`);
      setComment('');
    } catch (err: any) {
      alert(`Approval error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (approvalId: string) => {
    if (!comment.trim()) {
      alert("Please provide the rejection rationale.");
      return;
    }
    setIsSubmitting(true);
    try {
      await onReject(approvalId, commanderName, comment);
      setActionFeedback(`Rejected by ${commanderName}. Incident returned to assessment.`);
      setComment('');
    } catch (err: any) {
      alert(`Rejection error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0b1329] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
              <span>Human-in-the-Loop Approval Center</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                MANDATORY GATE
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">All maritime diversions and resource dispatches require authenticated Commander sign-off</p>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
          <span>Pending: </span>
          <span className="text-amber-400 font-bold">{pendingApprovals.length}</span>
        </div>
      </div>

      {actionFeedback && (
        <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs font-mono flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Pending Approval Requests */}
      {pendingApprovals.length === 0 ? (
        <div className="p-6 text-center text-slate-500 text-xs font-mono bg-white dark:bg-slate-900/40 rounded-lg border border-slate-200 dark:border-slate-800">
          <ShieldCheck className="w-8 h-8 text-emerald-500/50 mx-auto mb-2" />
          <p>No pending operational approvals in queue.</p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">All proposed response plans have been reviewed or executed.</span>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingApprovals.map(appr => (
            <div 
              key={appr.id}
              className="bg-slate-900/90 border border-amber-500/40 rounded-lg p-4 space-y-3 shadow-md"
            >
              {/* Row 1: Title & Status */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700/60">
                  ACTION REQUEST: {appr.id}
                </span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  Requested by: <strong className="text-slate-200">{appr.requested_by}</strong>
                </span>
              </div>

              {/* Action Title */}
              <h4 className="text-sm font-bold text-slate-100">
                {appr.title}
              </h4>

              {/* Reason */}
              <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-950/60 p-2.5 rounded border border-slate-200 dark:border-slate-800 leading-relaxed">
                <strong className="text-slate-500 dark:text-slate-400 font-mono text-[10px] block uppercase mb-1">Reason & Intelligence Justification</strong>
                {appr.reason}
              </p>

              {/* Expected Impact Summary */}
              <div className="grid grid-cols-3 gap-2 text-[11px] font-mono bg-slate-950/80 p-2 rounded border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-slate-500 text-[9px] uppercase block">Delay Reduction</span>
                  <span className="text-emerald-400 font-bold">+{appr.expected_impact.delay_reduction_hours} hrs</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[9px] uppercase block">Risk Reduction</span>
                  <span className="text-cyan-400 font-bold">-{appr.expected_impact.risk_reduction_pct}%</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[9px] uppercase block">AI Confidence</span>
                  <span className="text-blue-400 font-bold">{appr.ai_confidence}%</span>
                </div>
              </div>

              {/* Commander Input Section */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                    <span>Signing Commander:</span>
                  </span>
                  <input
                    type="text"
                    value={commanderName}
                    onChange={e => setCommanderName(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 font-bold focus:outline-none focus:border-blue-500 w-44"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 block mb-1">
                    Commander Operational Rationale / Notes (Mandatory for Audit Trail)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Enter formal justification, bridge verification, or conditions of approval..."
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Decision Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <button
                  onClick={() => handleApprove(appr.id)}
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-900/30 transition-all disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>APPROVE ACTION</span>
                </button>

                <button
                  onClick={() => handleReject(appr.id)}
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold transition disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  <span>REJECT</span>
                </button>

                <button
                  onClick={() => onRequestMoreInfo && onRequestMoreInfo(appr.id, "Request SAR radar backscatter check")}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-700 transition"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>REQUEST INFO</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Historical Approvals Log */}
      {decidedApprovals.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 block font-semibold">
            Decided Action Log ({decidedApprovals.length})
          </span>
          <div className="space-y-2 max-h-40 overflow-y-auto no-scrollbar">
            {decidedApprovals.map(d => (
              <div 
                key={d.id}
                className="p-2.5 rounded bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-bold px-1.5 rounded ${
                      d.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}>
                      {d.status}
                    </span>
                    <span className="text-slate-200 font-semibold">{d.title}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    By: {d.reviewer_name} ({d.reviewer_role}) - {d.decision_timestamp ? new Date(d.decision_timestamp).toLocaleTimeString() : 'N/A'}
                  </div>
                </div>

                <span className="text-[10px] font-mono text-slate-500">
                  Audit Verified
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
