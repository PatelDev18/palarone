"use client"

import React, { useState } from 'react'
import { IncidentTimelineEvent, IncidentStatus } from '@/types/emergency'
import { 
  Clock, 
  Satellite, 
  Ship, 
  Cpu, 
  Wifi, 
  UserCheck, 
  ShieldAlert, 
  CheckCircle2, 
  ChevronRight,
  Filter
} from 'lucide-react'

interface IncidentTimelineProps {
  timeline: IncidentTimelineEvent[];
  currentStatus: IncidentStatus;
}

export function IncidentTimeline({ timeline, currentStatus }: IncidentTimelineProps) {
  const [selectedSource, setSelectedSource] = useState<string>('ALL');

  const filteredTimeline = selectedSource === 'ALL'
    ? timeline
    : timeline.filter(t => t.source === selectedSource);

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'Satellite': return Satellite;
      case 'AIS': return Ship;
      case 'ML Model': return Cpu;
      case 'IoT': return Wifi;
      case 'Commander': return UserCheck;
      case 'Human': return UserCheck;
      default: return ShieldAlert;
    }
  };

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'Satellite': return 'bg-purple-950 text-purple-300 border-purple-800';
      case 'AIS': return 'bg-blue-950 text-blue-300 border-blue-800';
      case 'ML Model': return 'bg-indigo-950 text-indigo-300 border-indigo-800';
      case 'IoT': return 'bg-cyan-950 text-cyan-300 border-cyan-800';
      case 'Commander': return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      case 'Human': default: return 'bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-700';
    }
  };

  // 12-stage State Machine definition
  const stateMachineSteps = [
    { key: 'DETECTED', label: 'Detected' },
    { key: 'TRIAGE', label: 'Triage' },
    { key: 'ASSESSING', label: 'Assessing' },
    { key: 'INCIDENT_DECLARED', label: 'Declared' },
    { key: 'RESPONSE_PLAN_GENERATED', label: 'Plan Ready' },
    { key: 'HUMAN_REVIEW', label: 'Human Review' },
    { key: 'AWAITING_APPROVAL', label: 'Approval' },
    { key: 'RESPONSE_ACTIVE', label: 'Active Response' },
    { key: 'MITIGATING', label: 'Mitigating' },
    { key: 'RESOLVED', label: 'Resolved' },
    { key: 'CLOSED', label: 'Closed' }
  ];

  const currentIdx = stateMachineSteps.findIndex(s => s.key === currentStatus);

  return (
    <div className="bg-[#0b1329] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
              <span>Operational Incident Event Stream</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                CHRONOLOGICAL
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Time-synchronized sequence from anomaly discovery to resolution</p>
          </div>
        </div>

        {/* Source Filter Tabs */}
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {['ALL', 'Satellite', 'AIS', 'ML Model', 'Commander'].map(src => (
            <button
              key={src}
              onClick={() => setSelectedSource(src)}
              className={`px-2 py-1 rounded text-[10px] font-mono transition ${
                selectedSource === src
                  ? 'bg-slate-700 text-white font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              {src}
            </button>
          ))}
        </div>
      </div>

      {/* State Machine Flow Stepper */}
      <div className="bg-white dark:bg-slate-900/60 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2 font-bold">
          Emergency Response Lifecycle State Machine
        </span>
        <div className="flex items-center gap-1 min-w-[700px]">
          {stateMachineSteps.map((step, idx) => {
            const isCompleted = idx < currentIdx;
            const isCurrent = idx === currentIdx;

            return (
              <React.Fragment key={step.key}>
                <div 
                  className={`flex items-center gap-1.5 px-2 py-1 rounded border text-[10px] font-mono whitespace-nowrap transition-all ${
                    isCurrent
                      ? 'bg-blue-600 border-blue-400 text-white font-bold shadow-md shadow-blue-900/40 animate-pulse'
                      : isCompleted
                      ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                      : 'bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                  )}
                  <span>{step.label}</span>
                </div>
                {idx < stateMachineSteps.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Event Timeline List */}
      <div className="relative border-l border-slate-200 dark:border-slate-800 ml-4 pl-6 space-y-4 max-h-96 overflow-y-auto no-scrollbar font-mono">
        {filteredTimeline.map((item, idx) => {
          const Icon = getSourceIcon(item.source);

          return (
            <div key={idx} className="relative group">
              {/* Timeline Bullet */}
              <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-blue-500 flex items-center justify-center group-hover:scale-125 transition-transform">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              </div>

              {/* Event Content Box */}
              <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-lg p-3 space-y-1.5 hover:border-slate-700 transition">
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.2 rounded border text-[10px] font-bold flex items-center gap-1 ${getSourceBadgeColor(item.source)}`}>
                      <Icon className="w-3 h-3" />
                      <span>{item.source}</span>
                    </span>
                    <strong className="text-slate-200">{item.actor}</strong>
                  </div>

                  <span className="text-slate-500 dark:text-slate-400 text-[10px]">
                    {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC
                  </span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 font-sans leading-relaxed">
                  {item.action}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-800/60">
                  <span>Status: <strong className="text-slate-500 dark:text-slate-400">{item.status}</strong></span>
                  <span>Validated</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
