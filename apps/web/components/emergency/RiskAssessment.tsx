"use client"

import React from 'react'
import { AIRiskAssessment, IncidentSeverity } from '@/types/emergency'
import { 
  Cpu, 
  AlertTriangle, 
  HelpCircle, 
  TrendingUp, 
  ShieldCheck, 
  Layers, 
  Info,
  CheckCircle2
} from 'lucide-react'

interface RiskAssessmentProps {
  assessment: AIRiskAssessment;
  severity: IncidentSeverity;
  primaryCause?: string;
  secondaryRisks?: string[];
  potentialImpact?: string;
}

export function RiskAssessment({
  assessment,
  severity,
  primaryCause,
  secondaryRisks = [],
  potentialImpact
}: RiskAssessmentProps) {
  const getSeverityColor = (sev: IncidentSeverity) => {
    switch (sev) {
      case 'CRITICAL': return 'text-red-400 bg-red-950/40 border-red-800/80';
      case 'HIGH': return 'text-orange-400 bg-orange-950/40 border-orange-800/80';
      case 'MEDIUM': return 'text-amber-400 bg-amber-950/40 border-amber-800/80';
      case 'LOW': default: return 'text-emerald-400 bg-emerald-950/40 border-emerald-800/80';
    }
  };

  return (
    <div className="bg-[#0b1329] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
      {/* Header with Model Badge */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
              <span>Explainable AI Risk Assessment</span>
              <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                {assessment.model_name} v{assessment.model_version}
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Multi-source SHAP feature attribution & risk gradient</p>
          </div>
        </div>

        {/* Severity & Confidence Badges */}
        <div className="flex items-center gap-2">
          <div className={`px-2.5 py-1 rounded border text-xs font-mono font-bold ${getSeverityColor(severity)}`}>
            {severity} SEVERITY
          </div>
          <div className="px-2.5 py-1 rounded border border-blue-800/60 bg-blue-950/40 text-blue-300 text-xs font-mono font-bold">
            CONFIDENCE: {assessment.confidence_pct}%
          </div>
        </div>
      </div>

      {/* Main Score & Risk Overview Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white dark:bg-slate-900/60 p-4 rounded-lg border border-slate-200 dark:border-slate-800 font-mono">
        <div className="flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 pb-3 md:pb-0 md:pr-4">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">Composite Risk Score</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-3xl font-extrabold ${assessment.risk_score >= 80 ? 'text-red-400' : 'text-amber-400'}`}>
              {assessment.risk_score}
            </span>
            <span className="text-slate-500 text-xs">/100</span>
          </div>
          <span className="text-[10px] text-red-400/90 mt-1 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            <span>High Risk Threshold Exceeded</span>
          </span>
        </div>

        <div className="md:col-span-3 space-y-2 text-xs">
          <div>
            <span className="text-slate-500 dark:text-slate-400 font-bold block uppercase text-[10px]">Primary Cause</span>
            <p className="text-slate-200 mt-0.5">{primaryCause || 'Dense multi-year ice ridge convergence.'}</p>
          </div>

          <div>
            <span className="text-slate-500 dark:text-slate-400 font-bold block uppercase text-[10px]">Potential Impact</span>
            <p className="text-slate-700 dark:text-slate-300 mt-0.5">{potentialImpact || 'Critical resupply delay and propulsion strain.'}</p>
          </div>
        </div>
      </div>

      {/* SHAP Factor Attribution Breakdown */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span className="flex items-center gap-1.5 font-mono uppercase text-[11px]">
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
            <span>Primary Contributing Risk Drivers (SHAP Values)</span>
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Relative Weight %</span>
        </div>

        <div className="space-y-2 bg-white dark:bg-slate-900/40 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800/80">
          {assessment.factor_drivers.map((driver, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-700 dark:text-slate-300">{driver.factor}</span>
                <span className="text-slate-200 font-bold">{driver.impact_pct}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    idx === 0 ? 'bg-red-500' :
                    idx === 1 ? 'bg-orange-500' :
                    idx === 2 ? 'bg-amber-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${driver.impact_pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* "Why was this incident flagged?" Explainable Narrative */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-300 font-mono uppercase">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Why was this incident flagged by the system?</span>
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
          {assessment.why_flagged_narrative}
        </p>
      </div>

      {/* Secondary Cascading Risks */}
      {secondaryRisks.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 block font-bold">
            Secondary Cascading Risks Identified
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {secondaryRisks.map((risk, i) => (
              <div key={i} className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                <span className="truncate">{risk}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
