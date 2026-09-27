"use client";

import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  Send,
  FileCheck,
  CheckCircle2,
  Lock,
  UserCheck
} from 'lucide-react';
import { Vessel, UserRole } from '@/types/command-center';

interface ApprovalDialogProps {
  vessel: Vessel | null;
  onClose: () => void;
  onApprove: (recommendationId: string, comments: string) => Promise<void>;
  currentUserRole: UserRole;
}

export function ApprovalDialog({
  vessel,
  onClose,
  onApprove,
  currentUserRole,
}: ApprovalDialogProps) {
  const [comments, setComments] = useState<string>(
    'Route diversion authorized based on Sentinel-1 SAR lead confirmation and 45kt wind mitigation.'
  );
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [approvedSuccess, setApprovedSuccess] = useState<boolean>(false);

  if (!vessel) return null;

  const isAuthorized = ['Commander', 'Operations Officer', 'Safety Officer', 'Administrator'].includes(
    currentUserRole
  );

  const handleExecuteApproval = async () => {
    if (!isAuthorized) return;
    setSubmitting(true);
    try {
      await onApprove('REC-2026-088', comments);
      setApprovedSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 select-none animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-slate-700/80 rounded-xl shadow-2xl max-w-lg w-full p-5 text-slate-200 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Human-in-the-Loop Operational Approval
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Recommendation: REC-2026-088 • Target: {vessel.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Advisory Principle Notice */}
        <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            AI predictions are strictly advisory. Final decision and navigation safety authority
            remains exclusively with the authorized human watch commander.
          </span>
        </div>

        {/* Recommendation Content */}
        <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between text-slate-700 dark:text-slate-300">
            <span className="font-semibold text-slate-100">Proposed Action:</span>
            <span className="font-mono text-cyan-400 font-bold">Alternate Route B (Lead Bypass)</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            Divert {vessel.name} northeast through waypoint Sector 4 open lead to bypass heavy pack
            ice ridge and recover approximately 14.5 hours of schedule.
          </p>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 font-mono text-[11px]">
            <div>
              <span className="text-slate-500">Route Deviation:</span>
              <p className="text-slate-700 dark:text-slate-300">+34 nautical miles</p>
            </div>
            <div>
              <span className="text-slate-500">Time Saved:</span>
              <p className="text-emerald-400 font-bold">14.5 hours net</p>
            </div>
            <div>
              <span className="text-slate-500">Evidence Source:</span>
              <p className="text-purple-300">Sentinel-1 SAR Obs</p>
            </div>
            <div>
              <span className="text-slate-500">ML Confidence:</span>
              <p className="text-slate-700 dark:text-slate-300">76% (XGBoost)</p>
            </div>
          </div>
        </div>

        {/* Authorization Role Indicator */}
        <div className="flex items-center justify-between p-2.5 rounded bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-mono">
            <UserCheck className="w-3.5 h-3.5 text-blue-400" />
            Signatory Role:
          </span>
          <span
            className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
              isAuthorized
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}
          >
            {currentUserRole} {isAuthorized ? '✓ AUTHORIZED' : '✕ UNAUTHORIZED'}
          </span>
        </div>

        {/* Operational Justification Input */}
        <div className="space-y-1">
          <label className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
            Operational Justification & Dispatch Directive:
          </label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            disabled={!isAuthorized || submitting || approvedSuccess}
            rows={2}
            className="w-full bg-slate-950 border border-slate-200 dark:border-slate-700 rounded p-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono disabled:opacity-50"
          />
        </div>

        {/* Status Message */}
        {approvedSuccess && (
          <div className="p-2.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Approved! Directive dispatched to fleet operations and logged in audit trail.
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExecuteApproval}
            disabled={!isAuthorized || submitting || approvedSuccess}
            className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            {submitting ? 'Dispatching...' : 'Authorize & Send to Operations'}
          </button>
        </div>
      </div>
    </div>
  );
}
