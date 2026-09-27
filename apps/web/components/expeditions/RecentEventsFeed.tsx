"use client"

import React from 'react';
import { AuditLogEntry } from '@/types/expedition';
import { ShieldCheck, History, ArrowRight, UserCheck, FileEdit, AlertOctagon } from 'lucide-react';
import Link from 'next/link';

interface RecentEventsFeedProps {
  auditLogs: AuditLogEntry[];
}

export function RecentEventsFeed({ auditLogs }: RecentEventsFeedProps) {
  return (
    <div className="bg-[#0b1329] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Recent Expedition Events & Audit Trail
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Tamper-Evident</span>
        </div>

        <div className="space-y-2.5">
          {auditLogs.slice(0, 4).map((entry) => (
            <div
              key={entry.audit_id}
              className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-lg p-2.5 hover:border-slate-700 transition-colors"
            >
              <div className="flex justify-between items-start text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-200">
                  <UserCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>{entry.actor}</span>
                  <span className="text-[10px] text-slate-500 font-normal">({entry.actor_role})</span>
                </div>

                <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-900/50 shrink-0">
                  {entry.expedition_id}
                </span>
              </div>

              <div className="mt-1 text-xs text-slate-900 dark:text-white font-medium">
                <span className="text-blue-400 font-bold uppercase">{entry.action.replace('_', ' ')}: </span>
                {entry.new_value || entry.reason}
              </div>

              {entry.reason && entry.new_value && (
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 italic">
                  &quot;{entry.reason}&quot;
                </div>
              )}

              <div className="text-[10px] font-mono text-slate-500 mt-1 flex justify-between">
                <span>{entry.audit_id}</span>
                <span>{new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800/80 text-right">
        <span className="text-[11px] text-slate-500 font-mono">
          Full cryptographic SHA-256 audit log
        </span>
      </div>
    </div>
  );
}
