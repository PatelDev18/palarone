"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flag, Plus, Sparkles, RefreshCw, Layers } from 'lucide-react';
import { 
  getExpeditions, 
  getExpeditionKPIs, 
  getAuditLogs, 
  pauseExpedition, 
  resumeExpedition 
} from '@/lib/expedition/api';
import { Expedition, ExpeditionKPIs, AuditLogEntry } from '@/types/expedition';
import { ExpeditionKPIsView } from '@/components/expeditions/ExpeditionKPIs';
import { ExpeditionFilters, ViewMode, FilterState } from '@/components/expeditions/ExpeditionFilters';
import { ExpeditionCard } from '@/components/expeditions/ExpeditionCard';
import { CommanderDecisionBanner } from '@/components/expeditions/CommanderDecisionBanner';
import { ExpeditionMapView } from '@/components/expeditions/ExpeditionMapView';
import { ExpeditionTimelineView } from '@/components/expeditions/ExpeditionTimelineView';
import { ExpeditionCalendarView } from '@/components/expeditions/ExpeditionCalendarView';
import { UpcomingMilestonesPanel } from '@/components/expeditions/UpcomingMilestonesPanel';
import { ActiveWarningsPanel } from '@/components/expeditions/ActiveWarningsPanel';
import { RecentEventsFeed } from '@/components/expeditions/RecentEventsFeed';
import { NewExpeditionWizard } from '@/components/expeditions/NewExpeditionWizard';
import { ScenarioModal } from '@/components/expeditions/ScenarioModal';
import { ApprovalModal } from '@/components/expeditions/ApprovalModal';
import { ExpeditionCopilotDrawer } from '@/components/expeditions/ExpeditionCopilotDrawer';

export default function ExpeditionsDashboard() {
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [kpis, setKpis] = useState<ExpeditionKPIs>({
    active_expeditions: 3,
    planning: 2,
    high_risk_missions: 2,
    blocked_missions: 1,
    personnel_deployed: 292,
    active_assets: 12,
    missions_this_season: 6,
    upcoming_departures: 2
  });
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // View state
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: '',
    risk: '',
    region: '',
    vessel: '',
    lead: '',
    missionType: ''
  });
  const [selectedKpiFilter, setSelectedKpiFilter] = useState<string | null>(null);

  // Modals state
  const [showNewWizard, setShowNewWizard] = useState(false);
  const [scenarioExpedition, setScenarioExpedition] = useState<Expedition | null>(null);
  const [approvalExpedition, setApprovalExpedition] = useState<{ exp: Expedition; recId?: string } | null>(null);
  const [showCopilot, setShowCopilot] = useState(false);

  // Load data
  const loadData = async () => {
    try {
      const [expList, kpiData, logs] = await Promise.all([
        getExpeditions(),
        getExpeditionKPIs(),
        getAuditLogs()
      ]);
      setExpeditions(Array.isArray(expList) ? expList : []);
      if (kpiData) setKpis(kpiData);
      setAuditLogs(Array.isArray(logs) ? logs : []);
    } catch (err) {
      console.error('Error loading expeditions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle KPI Click Filter
  const handleSelectKpiFilter = (filterKey: string) => {
    setSelectedKpiFilter(filterKey || null);
    if (!filterKey) {
      setFilters(prev => ({ ...prev, status: '', risk: '' }));
      return;
    }
    if (filterKey === 'ACTIVE') {
      setFilters(prev => ({ ...prev, status: 'OPERATIONAL', risk: '' }));
    } else if (filterKey === 'PLANNING') {
      setFilters(prev => ({ ...prev, status: 'PLANNING', risk: '' }));
    } else if (filterKey === 'HIGH_RISK') {
      setFilters(prev => ({ ...prev, risk: 'HIGH', status: '' }));
    } else if (filterKey === 'BLOCKED') {
      setFilters(prev => ({ ...prev, status: 'BLOCKED', risk: '' }));
    } else if (filterKey === 'UPCOMING') {
      setFilters(prev => ({ ...prev, status: 'PRE-DEPARTURE', risk: '' }));
    } else {
      setFilters(prev => ({ ...prev, status: '', risk: '' }));
    }
  };

  // Filter application
  const safeExpeditions = Array.isArray(expeditions) ? expeditions : [];
  const filteredExpeditions = safeExpeditions.filter(exp => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const match =
        exp.id.toLowerCase().includes(q) ||
        exp.name.toLowerCase().includes(q) ||
        exp.lead.toLowerCase().includes(q) ||
        (exp.vessel_name || '').toLowerCase().includes(q) ||
        exp.current_region.toLowerCase().includes(q) ||
        exp.mission_type.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (filters.status) {
      const s = filters.status.toLowerCase();
      if (!exp.status.toLowerCase().includes(s) && !exp.status_display.toLowerCase().includes(s)) {
        return false;
      }
    }
    if (filters.risk) {
      if (exp.risk_level.toLowerCase() !== filters.risk.toLowerCase()) return false;
    }
    if (filters.region) {
      if (!exp.current_region.toLowerCase().includes(filters.region.toLowerCase())) return false;
    }
    if (filters.vessel) {
      const v = (exp.vessel_name || exp.ships?.join(' ') || '').toLowerCase();
      if (!v.includes(filters.vessel.toLowerCase())) return false;
    }
    if (filters.lead) {
      if (!exp.lead.toLowerCase().includes(filters.lead.toLowerCase())) return false;
    }
    if (filters.missionType) {
      if (!exp.mission_type.toLowerCase().includes(filters.missionType.toLowerCase())) return false;
    }
    return true;
  });

  const handlePauseResume = async (exp: Expedition) => {
    if (exp.status === 'SUSPENDED') {
      await resumeExpedition(exp.id);
    } else {
      await pauseExpedition(exp.id, 'Commander ordered pause');
    }
    loadData();
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-150">
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1700px] mx-auto w-full">
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <Flag className="text-blue-600 dark:text-blue-500 w-8 h-8" />
              EXPEDITION MANAGEMENT
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Strategic planning and tracking for multi-asset polar missions.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowCopilot(true)}
              className="bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-purple-300 dark:border-purple-900/50 px-3.5 py-2 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="hidden sm:inline">AI Copilot</span>
            </button>

            <button
              onClick={loadData}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
              title="Refresh mission telemetry"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowNewWizard(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-md dark:shadow-blue-900/40 hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              + New Expedition
            </button>
          </div>
        </div>

      {/* NEW EXPEDITION WIZARD MODAL */}
      {showNewWizard && (
        <NewExpeditionWizard
          onCancel={() => {
            setShowNewWizard(false);
            loadData();
          }}
        />
      )}

      {/* TOP KPI ROW (CLICKABLE) */}
      <ExpeditionKPIsView
        kpis={kpis}
        selectedFilter={selectedKpiFilter}
        onSelectFilter={handleSelectKpiFilter}
      />

      {/* COMMANDER DECISION SUPPORT 5 QUESTIONS CALLOUT */}
      <CommanderDecisionBanner
        expeditions={expeditions}
        onOpenReviewModal={(expId, recId) => {
          const target = expeditions.find(e => e.id === expId) || expeditions[0];
          setApprovalExpedition({ exp: target, recId });
        }}
      />

      {/* SEARCH AND FILTERS TOOLBAR */}
      <ExpeditionFilters
        filters={filters}
        onFilterChange={updates => setFilters(prev => ({ ...prev, ...updates }))}
        onReset={() => {
          setFilters({
            search: '',
            status: '',
            risk: '',
            region: '',
            vessel: '',
            lead: '',
            missionType: ''
          });
          setSelectedKpiFilter(null);
        }}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalCount={expeditions.length}
        filteredCount={filteredExpeditions.length}
      />

      {/* PRIMARY OPERATIONAL VIEW */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {filteredExpeditions.map(exp => (
            <ExpeditionCard
              key={exp.id}
              expedition={exp}
              onOpenScenario={target => setScenarioExpedition(target)}
              onPauseResume={handlePauseResume}
            />
          ))}

          {filteredExpeditions.length === 0 && (
            <div className="col-span-full bg-[#0b1329] border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center text-slate-500 dark:text-slate-400">
              <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">No expeditions match your active filters.</p>
              <p className="text-xs">Adjust search parameters or reset filters to view registered missions.</p>
            </div>
          )}
        </div>
      )}

      {viewMode === 'timeline' && (
        <ExpeditionTimelineView expeditions={filteredExpeditions} />
      )}

      {viewMode === 'map' && (
        <ExpeditionMapView
          expeditions={filteredExpeditions}
          onSelectExpedition={target => {
            // direct navigation
            window.location.href = `/expeditions/${target.id}`;
          }}
        />
      )}

      {viewMode === 'calendar' && (
        <ExpeditionCalendarView expeditions={filteredExpeditions} />
      )}

      {/* AUXILIARY OPERATIONAL PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        {/* 1. Upcoming Milestones */}
        <UpcomingMilestonesPanel expeditions={expeditions} />

        {/* 2. Active Warnings */}
        <ActiveWarningsPanel expeditions={expeditions} />

        {/* 3. Recent Expedition Events / Audit */}
        <RecentEventsFeed auditLogs={auditLogs} />
      </div>

      {/* WHAT-IF SCENARIO MODAL */}
      {scenarioExpedition && (
        <ScenarioModal
          expedition={scenarioExpedition}
          onClose={() => setScenarioExpedition(null)}
        />
      )}

      {/* HUMAN-IN-THE-LOOP APPROVAL MODAL */}
      {approvalExpedition && (
        <ApprovalModal
          expedition={approvalExpedition.exp}
          recommendationId={approvalExpedition.recId}
          onClose={() => setApprovalExpedition(null)}
          onSuccess={loadData}
        />
      )}

      {/* AI COPILOT DRAWER */}
      <ExpeditionCopilotDrawer
        isOpen={showCopilot}
        onClose={() => setShowCopilot(false)}
      />
      </main>
    </div>
  );
}
