"use client"

import React from 'react'
import { AlertTriangle, Lock, X } from 'lucide-react'

interface ActionConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmVariant?: 'danger' | 'warning' | 'primary';
}

export function ActionConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm Action",
  confirmVariant = 'danger'
}: ActionConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-mono">
      <div className="bg-[#0b1329] border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl space-y-4 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              confirmVariant === 'danger' ? 'bg-red-600/20 text-red-400 border border-red-500/40' :
              confirmVariant === 'warning' ? 'bg-amber-600/20 text-amber-400 border border-amber-500/40' :
              'bg-blue-600/20 text-blue-400 border border-blue-500/40'
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase">{title}</h3>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">SAFETY RULE CONFIRMATION</span>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-700 dark:text-slate-300 font-sans leading-relaxed">
          {message}
        </p>

        <div className="p-2.5 rounded bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Action will be permanently recorded in the cryptographic audit trail.</span>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold text-white shadow-lg transition ${
              confirmVariant === 'danger' ? 'bg-red-600 hover:bg-red-500 shadow-red-900/40' :
              confirmVariant === 'warning' ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-900/40 text-slate-950 font-extrabold' :
              'bg-blue-600 hover:bg-blue-500 shadow-blue-900/40'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
