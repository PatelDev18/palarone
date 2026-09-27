"use client";

import React, { useState, useEffect } from 'react';
import {
  Activity,
  X,
  Clock,
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  Database,
  Radio
} from 'lucide-react';
import { DigitalTwinEvent } from '@/types/digital-twin';
import { digitalTwinApi } from '@/lib/api/digital-twin';

interface EventTimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNode: (nodeId: string) => void;
}

export function EventTimelineModal({ isOpen, onClose, onSelectNode }: EventTimelineModalProps) {
  const [events, setEvents] = useState<DigitalTwinEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    digitalTwinApi.getEvents().then((data) => {
      setEvents(data);
      setLoading(false);
    }).catch((err) => {
      console.error('Failed to load events:', err);
      setLoading(false);
    });
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center">
              <Activity className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono tracking-wider">
                REAL-TIME EVENT & STATE TRANSITION STREAM
              </h3>
              <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400">
                Audited operational events registered across Antarctic digital twin entities
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-600 dark:text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Events Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
          {loading ? (
            <div className="flex items-center justify-center h-40 text-slate-600 dark:text-slate-400">
              <Activity className="w-5 h-5 animate-spin mr-2 text-cyan-400" />
              Loading state transition events...
            </div>
          ) : events.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No recent events logged.</div>
          ) : (
            events.map((evt) => {
              const isCrit = evt.severity === 'CRITICAL';
              const isWarn = evt.severity === 'WARNING';

              return (
                <div
                  key={evt.event_id}
                  className="p-3 rounded-lg bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-1.5 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-bold">{evt.time_display}</span>
                      <span className="font-bold text-slate-100">{evt.title}</span>
                    </div>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                        isCrit
                          ? 'bg-red-950 text-red-400 border border-red-800'
                          : isWarn
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}
                    >
                      {evt.severity}
                    </span>
                  </div>

                  <p className="text-[11px] font-sans text-slate-700 dark:text-slate-300 leading-snug">
                    {evt.description}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-800/80 text-[10px] text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Radio className="w-3 h-3 text-blue-400" />
                      Source: <strong className="text-slate-700 dark:text-slate-300">{evt.source}</strong>
                    </span>
                    <button
                      onClick={() => {
                        onSelectNode(evt.node_id);
                        onClose();
                      }}
                      className="text-cyan-400 hover:underline flex items-center gap-1 font-bold"
                    >
                      <span>Focus {evt.node_name}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
