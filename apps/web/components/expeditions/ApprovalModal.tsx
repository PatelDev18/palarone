"use client"

import React, { useState } from 'react';
import { Expedition, ExpeditionRecommendation } from '@/types/expedition';
import { decideRecommendation } from '@/lib/expedition/api';
import { X, ShieldAlert, CheckCircle2, XCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface ApprovalModalProps {
  expedition: Expedition;
  recommendationId?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ApprovalModal({
  expedition,
  recommendationId,
  onClose,
  onSuccess
}: ApprovalModalProps) {
  const rec = expedition.recommendations?.find(r => r.id === recommendationId) || expedition.recommendations?.[0];
  const [comments, setComments] = useState('');
  const [approver, setApprover] = useState('Commander E. Hayes (Duty Commander)');
  const [loading, setLoading] = useState(false);

  const handleDecision = async (decision: 'APPROVE' | 'REJECT') => {
    if (!rec) return;
    setLoading(true);
    try {
      await decideRecommendation(expedition.id, rec.id, decision, comments, approver);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to submit decision:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!rec) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
        <div className="bg-[#0b1329] border border-slate-200 dark:border-slate-800 rounded-xl p-6 text-center text-slate-200">
          <p>No pending recommendations found for this mission.</p>
          <button onClick={onClose} className="mt-4 bg-slate-800 text-xs px-4 py-2 rounded">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-[#0b1329] border-2 border-blue-500/50 rounded-xl shadow-2xl w-full max-w-xl overflow-hidden text-slate-200">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-blue-950/80 to-slate-900 border-b border-blue-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-400/50 flex items-center justify-center text-blue-400">
              <ShieldAlert className="w-5 h-5 text-blue-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                COMMANDER OPERATIONAL DECISION GATE
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                RECOMMENDATION → REVIEW → APPROVE/REJECT → AUDIT
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Mission context */}
          <div className="flex justify-between items-center bg-white dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Expedition</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">{expedition.name} ({expedition.id})</span>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase border ${
              rec.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border-rose-800' : 'bg-amber-950 text-amber-300 border-amber-800'
            }`}>
              {rec.severity} SEVERITY
            </span>
          </div>

          {/* AI Recommendation details */}
          <div className="bg-[#020617] border border-blue-900/40 rounded-lg p-3.5 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5 text-blue-300">
              {rec.title}
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {rec.reason}
            </p>
            <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-2 font-mono">
              <span>MODEL: <strong className="text-purple-400">{rec.model}</strong></span>
              <span>CONFIDENCE: <strong className="text-emerald-400">{Math.round(rec.confidence * 100)}%</strong></span>
              {rec.fuel_delta && <span>FUEL DELTA: <strong className="text-blue-400">{rec.fuel_delta}</strong></span>}
            </div>
          </div>

          {/* Approver Sign-off fields */}
          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">
                Authorized Approver
              </label>
              <input
                type="text"
                value={approver}
                onChange={e => setApprover(e.target.value)}
                className="w-full bg-[#020617] border border-slate-700 rounded p-2 text-xs text-white font-semibold"
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">
                Commander Decision Comments & Rationale (Recorded in Audit Log)
              </label>
              <textarea
                rows={2}
                value={comments}
                onChange={e => setComments(e.target.value)}
                placeholder="State operational rationale for approval or rejection..."
                className="w-full bg-[#020617] border border-slate-700 rounded p-2 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 bg-[#070d1e] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Cryptographic audit entry will be sealed</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDecision('REJECT')}
              disabled={loading}
              className="bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold px-4 py-2 rounded text-xs transition-colors flex items-center gap-1.5"
            >
              <XCircle className="w-4 h-4" />
              <span>REJECT RECOMMENDATION</span>
            </button>
            <button
              onClick={() => handleDecision('APPROVE')}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2 rounded text-xs transition-colors shadow-lg shadow-emerald-950/50 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>APPROVE & EXECUTE</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
