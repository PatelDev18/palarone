'use client'

import React from 'react'
import { X, ShieldAlert, Cpu, Download, FileJson } from 'lucide-react'
import { exportToJSON } from '@/lib/analytics/api'

interface DrillDownModalProps {
  isOpen: boolean
  title: string
  subtitle?: string
  data: any
  onClose: () => void
}

export const DrillDownModal: React.FC<DrillDownModalProps> = ({
  isOpen,
  title,
  subtitle,
  data,
  onClose,
}) => {
  if (!isOpen || !data) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">{title}</h2>
            {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportToJSON(data, `${title.toLowerCase().replace(/\s+/g, '_')}_diagnostic`)}
              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Download JSON record"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Diagnostic Fields
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {Object.entries(data).map(([key, val]) => {
                if (typeof val === 'object' && val !== null) return null
                return (
                  <div
                    key={key}
                    className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/60 flex flex-col justify-between"
                  >
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className="text-white font-mono font-semibold mt-0.5 break-all">
                      {String(val)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Raw JSON viewer */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                <FileJson className="w-3.5 h-3.5 text-blue-400" />
                Raw Telemetry Payload
              </span>
            </div>
            <pre className="p-3 rounded-lg bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-48 leading-relaxed">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>PolarOne Analytical Diagnostic Engine</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
