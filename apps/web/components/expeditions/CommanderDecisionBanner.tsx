"use client"

import React from 'react';
import { Expedition } from '@/types/expedition';
import { ShieldAlert, Compass, Target, AlertTriangle, ArrowRightCircle, CheckSquare } from 'lucide-react';

interface CommanderDecisionBannerProps {
  expeditions: Expedition[];
  onOpenReviewModal?: (expeditionId: string, recommendationId: string) => void;
}

export function CommanderDecisionBanner({ expeditions, onOpenReviewModal }: CommanderDecisionBannerProps) {
  // Find highest priority decision requiring Commander action
  let criticalDecision = {
    expId: 'EXP-2026-C',
    expName: 'Glacier Core Extraction',
    recId: 'REC-C-2026-01',
    where: 'Casey Sector / Law Dome (-66.28°S, 110.53°E)',
    doing: 'Emergency blizzard shelter lockdown & heating fuel conservation',
    couldGoWrong: 'Category 4 Blizzard (58kt) exhausting field kerosene reserves in 72h',
    next: 'Storm relaxation expected in 28 hours (BoM model confidence 94%)',
    decisionRequired: 'Authorize Generator Duty Cycle Reduction Protocol B-4 (Commander sign-off required)',
    severity: 'CRITICAL'
  };

  // Inspect live expeditions for pending recommendations
  for (const exp of expeditions) {
    const pendingRec = exp.recommendations?.find(r => r.status === 'PENDING_REVIEW');
    if (pendingRec) {
      criticalDecision = {
        expId: exp.id,
        expName: exp.name,
        recId: pendingRec.id,
        where: `${exp.current_region} (${exp.current_lat ? exp.current_lat.toFixed(2) : '-77.85'}°S, ${exp.current_lon ? exp.current_lon.toFixed(2) : '166.67'}°E)`,
        doing: exp.current_phase || 'Active Polar Operations',
        couldGoWrong: exp.risk_engine?.main_contributor || 'Severe environmental hazard',
        next: exp.waypoints?.find(w => !w.passed)?.name || 'Next mission milestone waypoint',
        decisionRequired: `${pendingRec.title} - ${pendingRec.action_required}`,
        severity: pendingRec.severity
      };
      break;
    }
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 via-indigo-50/50 to-slate-50 dark:from-[#0c1a3a] dark:via-[#091530] dark:to-[#0c1328] border-2 border-blue-200 dark:border-blue-500/40 rounded-xl p-4 mb-6 shadow-sm dark:shadow-xl relative overflow-hidden transition-colors duration-150">
      {/* Background radar grid effect */}
      <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-blue-100 dark:border-blue-900/60 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-600/30 border border-blue-300 dark:border-blue-400/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm">
            <ShieldAlert className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold tracking-wider text-slate-900 dark:text-white uppercase flex items-center gap-2">
              COMMANDER DECISION SUPPORT
              <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40 px-2 py-0.5 rounded">
                HUMAN-IN-THE-LOOP ACTIVE
              </span>
            </h2>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Immediate operational clarity for Duty Polar Operations Commander
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenReviewModal?.(criticalDecision.expId, criticalDecision.recId)}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-md transition-all flex items-center gap-2 shrink-0 border border-blue-500 dark:border-blue-400/30 hover:scale-[1.02]"
        >
          <CheckSquare className="w-4 h-4" />
          REVIEW DECISION ({criticalDecision.expId})
        </button>
      </div>

      {/* 5 Core Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
        {/* 1. Where are we */}
        <div className="bg-white dark:bg-[#04091a]/80 p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold mb-1 text-[11px]">
            <Compass className="w-3.5 h-3.5" />
            1. WHERE ARE WE?
          </div>
          <div className="font-semibold text-slate-900 dark:text-white truncate" title={criticalDecision.where}>
            {criticalDecision.where}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 truncate">
            Target: {criticalDecision.expName}
          </div>
        </div>

        {/* 2. What are we doing */}
        <div className="bg-white dark:bg-[#04091a]/80 p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-1.5 text-cyan-700 dark:text-cyan-400 font-bold mb-1 text-[11px]">
            <Target className="w-3.5 h-3.5" />
            2. WHAT ARE WE DOING?
          </div>
          <div className="font-semibold text-slate-900 dark:text-white line-clamp-2" title={criticalDecision.doing}>
            {criticalDecision.doing}
          </div>
        </div>

        {/* 3. What could go wrong */}
        <div className="bg-rose-50 dark:bg-rose-950/20 p-3 rounded-lg border border-rose-200 dark:border-rose-900/40 shadow-sm">
          <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold mb-1 text-[11px]">
            <AlertTriangle className="w-3.5 h-3.5" />
            3. WHAT COULD GO WRONG?
          </div>
          <div className="font-semibold text-rose-900 dark:text-rose-200 line-clamp-2" title={criticalDecision.couldGoWrong}>
            {criticalDecision.couldGoWrong}
          </div>
        </div>

        {/* 4. What will happen next */}
        <div className="bg-white dark:bg-[#04091a]/80 p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-1.5 text-purple-700 dark:text-purple-400 font-bold mb-1 text-[11px]">
            <ArrowRightCircle className="w-3.5 h-3.5" />
            4. WHAT WILL HAPPEN NEXT?
          </div>
          <div className="font-semibold text-slate-900 dark:text-purple-200 line-clamp-2" title={criticalDecision.next}>
            {criticalDecision.next}
          </div>
        </div>

        {/* 5. What decision is required */}
        <div className="bg-amber-50/70 dark:bg-blue-950/40 p-3 rounded-lg border border-amber-300 dark:border-blue-500/50 ring-1 ring-amber-400/40 dark:ring-blue-500/30 shadow-sm">
          <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-bold mb-1 text-[11px]">
            <CheckSquare className="w-3.5 h-3.5" />
            5. WHAT DECISION IS REQUIRED?
          </div>
          <div className="font-bold text-slate-900 dark:text-white line-clamp-2" title={criticalDecision.decisionRequired}>
            {criticalDecision.decisionRequired}
          </div>
        </div>
      </div>
    </div>
  );
}
