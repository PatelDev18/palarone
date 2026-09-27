"use client"

import React, { useState } from 'react'
import { EmergencyProtocol, ProtocolChecklistStep } from '@/types/emergency'
import { 
  FileText, 
  CheckSquare, 
  Square, 
  ShieldAlert, 
  AlertTriangle, 
  Flame, 
  LifeBuoy, 
  ChevronRight, 
  Lock,
  ArrowUpRight
} from 'lucide-react'

interface EmergencyProtocolsProps {
  protocols: EmergencyProtocol[];
  activeProtocolCode?: string;
  onSelectProtocol?: (protocol: EmergencyProtocol) => void;
  onInitiateProtocolWorkflow?: (protocol: EmergencyProtocol) => void;
}

export function EmergencyProtocols({
  protocols,
  activeProtocolCode = 'SEA_ICE_BLOCKAGE',
  onSelectProtocol,
  onInitiateProtocolWorkflow
}: EmergencyProtocolsProps) {
  const [selectedCode, setSelectedCode] = useState<string>(activeProtocolCode);
  const [checklistState, setChecklistState] = useState<Record<string, Record<number, boolean>>>({});

  const activeProto = protocols.find(p => p.code === selectedCode) || protocols[0];

  const toggleChecklistStep = (protocolId: string, stepNum: number) => {
    setChecklistState(prev => {
      const protoSteps = prev[protocolId] || {};
      return {
        ...prev,
        [protocolId]: {
          ...protoSteps,
          [stepNum]: !protoSteps[stepNum]
        }
      };
    });
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL': return 'bg-red-950 text-red-400 border-red-800';
      case 'HIGH': return 'bg-orange-950 text-orange-400 border-orange-800';
      case 'MEDIUM': return 'bg-amber-950 text-amber-400 border-amber-800';
      case 'LOW': default: return 'bg-emerald-950 text-emerald-400 border-emerald-800';
    }
  };

  return (
    <div className="bg-[#0b1329] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
              <span>Antarctic Maritime Emergency Protocols</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                10 STANDARD PROTOCOLS
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Pre-approved operational response checklists with strict escalation safeguards</p>
          </div>
        </div>

        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
          Standard: <strong className="text-slate-200">SOLAS / Polar Code Part I-A</strong>
        </span>
      </div>

      {/* Protocol Selection Tabs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs">
        {protocols.map(p => {
          const isSelected = p.code === selectedCode;
          return (
            <button
              key={p.id}
              onClick={() => {
                setSelectedCode(p.code);
                if (onSelectProtocol) onSelectProtocol(p);
              }}
              className={`p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-850 border-blue-500 shadow-md shadow-blue-900/20'
                  : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-700 hover:bg-slate-850/60'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{p.id}</span>
                <span className={`text-[9px] px-1 rounded border font-bold ${getSeverityBadge(p.severity)}`}>
                  {p.severity[0]}
                </span>
              </div>
              <span className={`text-[11px] font-bold line-clamp-2 ${isSelected ? 'text-blue-300' : 'text-slate-200'}`}>
                {p.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Selected Protocol Detail View */}
      {activeProto && (
        <div className="bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-4 font-mono text-xs">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white uppercase">{activeProto.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded border font-bold ${getSeverityBadge(activeProto.severity)}`}>
                  {activeProto.severity}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-0.5">{activeProto.description}</p>
            </div>

            <button
              onClick={() => onInitiateProtocolWorkflow && onInitiateProtocolWorkflow(activeProto)}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-md shadow-blue-900/30"
            >
              <span>Initiate Protocol Flow</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/60 p-3 rounded border border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-slate-500 text-[10px] uppercase block">Required Authorizing Authority</span>
              <span className="text-slate-200 font-bold">{activeProto.required_approval}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase block">Escalation Path</span>
              <span className="text-slate-700 dark:text-slate-300">{activeProto.escalation_path}</span>
            </div>
          </div>

          {/* Interactive Checklist Steps */}
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-wider text-slate-700 dark:text-slate-300 font-bold block flex items-center justify-between">
              <span>Operational Action Checklist ({activeProto.checklist.length} Steps)</span>
              <span className="text-[10px] text-slate-500 font-normal">Click step to verify completed actions</span>
            </span>

            <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-slate-950/40">
              {activeProto.checklist.map(step => {
                const isChecked = checklistState[activeProto.id]?.[step.step] ?? step.completed;

                return (
                  <div
                    key={step.step}
                    onClick={() => toggleChecklistStep(activeProto.id, step.step)}
                    className="p-3 flex items-start gap-3 hover:bg-white dark:bg-slate-900/80 cursor-pointer transition"
                  >
                    <button className="mt-0.5 text-blue-400 hover:text-blue-300">
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          isChecked ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}>
                          Step {step.step}
                        </span>
                        <span className={`text-xs font-bold ${isChecked ? 'text-slate-500 dark:text-slate-400 line-through' : 'text-slate-100'}`}>
                          {step.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans mt-0.5 leading-relaxed">
                        {step.action}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
