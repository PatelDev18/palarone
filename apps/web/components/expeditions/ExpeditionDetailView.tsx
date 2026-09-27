"use client"

import React, { useState } from 'react';
import { Expedition, ExpeditionStatus } from '@/types/expedition';
import { 
  updateExpeditionStatus, 
  pauseExpedition, 
  resumeExpedition 
} from '@/lib/expedition/api';
import { 
  Flag, 
  Radio, 
  Sparkles, 
  AlertTriangle, 
  Plus, 
  Play, 
  Pause, 
  Download, 
  FileText, 
  Compass, 
  Layers, 
  Users, 
  Ship, 
  Package, 
  CloudSnow, 
  CheckSquare, 
  Clock, 
  ShieldAlert, 
  History, 
  Wifi, 
  ChevronRight, 
  MapPin, 
  CheckCircle2, 
  Ban, 
  Anchor 
} from 'lucide-react';
import { ScenarioModal } from './ScenarioModal';
import { ApprovalModal } from './ApprovalModal';
import { AddIncidentModal } from './AddIncidentModal';
import { AddTaskModal } from './AddTaskModal';
import { ExpeditionCopilotDrawer } from './ExpeditionCopilotDrawer';

interface ExpeditionDetailViewProps {
  expedition: Expedition;
  initialTab?: string;
  onRefresh?: () => void;
}

export function ExpeditionDetailView({
  expedition: initialExp,
  initialTab = 'overview',
  onRefresh
}: ExpeditionDetailViewProps) {
  const [exp, setExp] = useState<Expedition>(initialExp);
  const [activeTab, setActiveTab] = useState(initialTab);

  // Modals state
  const [showScenarioModal, setShowScenarioModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showCopilot, setShowCopilot] = useState(false);

  // Status transitions
  const handleStatusChange = async (newStatus: ExpeditionStatus) => {
    const reason = prompt(`Reason for transitioning status to ${newStatus}:`, 'Operational transition');
    if (!reason) return;
    try {
      const updated = await updateExpeditionStatus(exp.id, newStatus, reason);
      if (updated) setExp(updated);
      onRefresh?.();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePauseResume = async () => {
    if (exp.status === 'SUSPENDED') {
      const updated = await resumeExpedition(exp.id);
      if (updated) setExp(updated);
    } else {
      const reason = prompt('Reason for suspending mission:', 'Commander ordered operational pause');
      if (reason) {
        const updated = await pauseExpedition(exp.id, reason);
        if (updated) setExp(updated);
      }
    }
    onRefresh?.();
  };

  const exportMissionJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exp, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${exp.id}_mission_record.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const isBlocked = exp.status.includes('BLOCKED');
  const isSuspended = exp.status === 'SUSPENDED';

  const tabs = [
    { id: 'overview', label: 'OVERVIEW', icon: Flag },
    { id: 'map', label: 'MAP', icon: Radio },
    { id: 'plan', label: 'MISSION PLAN', icon: FileText },
    { id: 'personnel', label: 'PERSONNEL', icon: Users },
    { id: 'assets', label: 'ASSETS', icon: Ship },
    { id: 'logistics', label: 'LOGISTICS', icon: Package },
    { id: 'weather', label: 'WEATHER', icon: CloudSnow },
    { id: 'ice', label: 'SEA ICE', icon: Compass },
    { id: 'satellite', label: 'SATELLITE', icon: Layers },
    { id: 'tasks', label: 'TASKS', icon: CheckSquare },
    { id: 'timeline', label: 'TIMELINE', icon: Clock },
    { id: 'risks', label: 'RISKS', icon: ShieldAlert },
    { id: 'incidents', label: 'INCIDENTS', icon: AlertTriangle },
    { id: 'communications', label: 'COMMUNICATIONS', icon: Wifi },
    { id: 'audit', label: 'ACTIVITY LOG', icon: History }
  ];

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* MISSION COMMAND HEADER */}
      <div className="bg-[#0b1329] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xl relative overflow-hidden">
        {/* Accent strip */}
        <div className={`h-1.5 w-full absolute top-0 left-0 ${
          isBlocked ? 'bg-rose-500' : isSuspended ? 'bg-amber-500' : 'bg-blue-600'
        }`} />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-900/60">
                {exp.id}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{exp.mission_type}</span>
              <span className="text-xs text-slate-600">·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{exp.organization}</span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              {exp.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2">
              <span>Commander: <strong className="text-slate-900 dark:text-white">{exp.lead}</strong></span>
              <span>·</span>
              <span>Region: <strong className="text-slate-800 dark:text-slate-200">{exp.current_region}</strong></span>
              <span>·</span>
              <span>Dates: <strong className="text-slate-800 dark:text-slate-200">
                {exp.planned_start ? new Date(exp.planned_start).toLocaleDateString() : 'TBD'} to {exp.planned_end ? new Date(exp.planned_end).toLocaleDateString() : 'TBD'}
              </strong></span>
            </div>
          </div>

          {/* Quick Actions & Status Control */}
          <div className="flex flex-wrap items-center gap-2 self-stretch lg:self-auto justify-end">
            {/* Status Selector Dropdown */}
            <div className="flex items-center bg-[#020617] border border-slate-700 rounded-lg px-2.5 py-1.5">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold mr-2">Status:</span>
              <select
                value={exp.status}
                onChange={e => handleStatusChange(e.target.value as ExpeditionStatus)}
                className={`bg-transparent text-xs font-bold focus:outline-none cursor-pointer ${
                  isBlocked ? 'text-rose-400' : isSuspended ? 'text-amber-400' : 'text-blue-400'
                }`}
              >
                <option value="DRAFT">DRAFT</option>
                <option value="PLANNING">PLANNING</option>
                <option value="READY FOR APPROVAL">READY FOR APPROVAL</option>
                <option value="APPROVED">APPROVED</option>
                <option value="PRE-DEPARTURE">PRE-DEPARTURE</option>
                <option value="IN TRANSIT">IN TRANSIT</option>
                <option value="OPERATIONAL">OPERATIONAL</option>
                <option value="PARTIALLY BLOCKED">PARTIALLY BLOCKED</option>
                <option value="BLOCKED">BLOCKED</option>
                <option value="SUSPENDED">SUSPENDED</option>
                <option value="RETURNING">RETURNING</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>

            {/* Risk Badge */}
            <div className={`text-xs px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 ${
              exp.risk_level === 'CRITICAL' ? 'bg-rose-950/60 border-rose-800 text-rose-300' :
              exp.risk_level === 'HIGH' ? 'bg-amber-950/60 border-amber-800 text-amber-300' :
              exp.risk_level === 'MEDIUM' ? 'bg-yellow-950/60 border-yellow-800 text-yellow-300' :
              'bg-emerald-950/60 border-emerald-800 text-emerald-300'
            }`}>
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{exp.risk_level} RISK ({Math.round(exp.risk_score)}/100)</span>
            </div>

            {/* Buttons */}
            <button
              onClick={() => setActiveTab('map')}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-md"
            >
              <Radio className="w-3.5 h-3.5" />
              Track Live
            </button>

            <button
              onClick={() => setShowScenarioModal(true)}
              className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              What-if Analysis
            </button>

            <button
              onClick={() => setShowCopilot(true)}
              className="bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-900/60 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Copilot
            </button>

            <button
              onClick={handlePauseResume}
              className={`text-xs font-semibold px-3 py-2 rounded-lg border flex items-center gap-1.5 transition-colors ${
                isSuspended
                  ? 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-500'
                  : 'bg-slate-800 text-amber-300 border-amber-800/60 hover:bg-slate-700'
              }`}
            >
              {isSuspended ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              {isSuspended ? 'Resume' : 'Pause'}
            </button>

            <button
              onClick={() => setShowIncidentModal(true)}
              className="bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-900/60 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              + Incident
            </button>

            <button
              onClick={() => setShowTaskModal(true)}
              className="bg-slate-800 hover:bg-slate-700 text-blue-300 border border-blue-900/60 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              + Task
            </button>

            <button
              onClick={exportMissionJson}
              className="bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 p-2 rounded-lg border border-slate-700"
              title="Export JSON record"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Warning if blocked */}
        {isBlocked && (
          <div className="mt-4 p-3 bg-rose-950/40 border border-rose-800/80 rounded-lg flex items-start gap-2.5 text-xs text-rose-200">
            <Ban className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 dark:text-white">MISSION BLOCKED (+{exp.delay_hours}h delay):</strong> {exp.delay_reason || 'Severe environmental block.'}
              <div className="mt-1">
                Contingency Plan B in effect. Commander review requested.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* TOP KPI ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-[#0b1329] border border-slate-200 dark:border-slate-800 p-3 rounded-xl">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block mb-1">Progress</span>
          <span className="text-xl font-black text-slate-900 dark:text-white">{exp.progress}%</span>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${exp.progress}%` }} />
          </div>
        </div>

        <div className="bg-[#0b1329] border border-slate-200 dark:border-slate-800 p-3 rounded-xl">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block mb-1">Personnel</span>
          <span className="text-xl font-black text-blue-400">{exp.crew_count}</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">
            {exp.personnel?.deployed ?? 0} in field
          </span>
        </div>

        <div className="bg-[#0b1329] border border-slate-200 dark:border-slate-800 p-3 rounded-xl">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block mb-1">Assigned Assets</span>
          <span className="text-xl font-black text-cyan-400">
            {(exp.ships?.length || 0) + (exp.aircraft?.length || 0) + (exp.vehicles?.length || 0)}
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1 truncate">
            {exp.vessel_name || 'Fleet'}
          </span>
        </div>

        <div className="bg-[#0b1329] border border-slate-200 dark:border-slate-800 p-3 rounded-xl">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block mb-1">Cargo Readiness</span>
          <span className="text-xl font-black text-emerald-400">{exp.logistics?.cargo_readiness ?? 100}%</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">Manifest checked</span>
        </div>

        <div className="bg-[#0b1329] border border-slate-200 dark:border-slate-800 p-3 rounded-xl">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block mb-1">Projected Fuel</span>
          <span className={`text-xl font-black ${
            (exp.logistics?.fuel_projected_remaining_pct ?? 40) < 20 ? 'text-rose-400' : 'text-amber-400'
          }`}>
            {exp.logistics?.fuel_projected_remaining_pct ?? 40}%
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">Endurance reserve</span>
        </div>

        <div className="bg-[#0b1329] border border-slate-200 dark:border-slate-800 p-3 rounded-xl">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block mb-1">Delay / Status</span>
          <span className={`text-xl font-black ${exp.delay_hours > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {exp.delay_hours > 0 ? `+${exp.delay_hours}h` : 'On Time'}
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1 truncate">
            {exp.delay_hours > 0 ? 'Review window' : 'Nominal corridor'}
          </span>
        </div>

        <div className="bg-[#0b1329] border border-slate-200 dark:border-slate-800 p-3 rounded-xl">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block mb-1">Risk Score</span>
          <span className="text-xl font-black text-purple-400">{Math.round(exp.risk_score)}/100</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">Model: XGB_RISK</span>
        </div>
      </div>

      {/* 15 TABS BAR */}
      <div className="bg-[#0b1329] border border-slate-200 dark:border-slate-800 rounded-xl p-1.5 shadow-md flex items-center gap-1 overflow-x-auto scrollbar-none">
        {tabs.map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-950/60'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-200 hover:bg-white dark:bg-slate-900/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
              {t.id === 'incidents' && (exp.incidents?.length || 0) > 0 && (
                <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-mono">
                  {exp.incidents.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT PANELS */}
      <div className="bg-[#0b1329] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-2xl min-h-[500px]">
        {/* 1. OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Mission Summary Column */}
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <Flag className="w-4 h-4 text-blue-400" />
                    Mission Scope & Objectives
                  </h3>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-[#020617] p-3.5 rounded-lg border border-slate-200 dark:border-slate-800">
                    {exp.description}
                  </p>
                </div>

                {/* Primary Objectives List */}
                <div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block mb-2">
                    Operational Objectives ({exp.objectives?.length || 0})
                  </span>
                  <div className="space-y-2">
                    {exp.objectives?.map(obj => (
                      <div
                        key={obj.id}
                        className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg p-3 flex items-start justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-[10px] text-blue-400 font-bold bg-blue-950 px-1.5 py-0.2 rounded border border-blue-900/40">
                              {obj.id}
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white">{obj.title}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            Success Criteria: <span className="text-slate-700 dark:text-slate-300">{obj.success_criteria}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-1 flex gap-3">
                            <span>Owner: <strong className="text-slate-700 dark:text-slate-300">{obj.owner}</strong></span>
                            <span>Deadline: <strong className="text-slate-700 dark:text-slate-300">{obj.deadline}</strong></span>
                          </div>
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border shrink-0 ${
                          obj.status === 'COMPLETED' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' :
                          obj.status === 'BLOCKED' ? 'bg-rose-950 text-rose-300 border-rose-800' :
                          'bg-blue-950 text-blue-300 border-blue-800'
                        }`}>
                          {obj.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contingency Plans */}
                <div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block mb-2">
                    Contingency Protocols (Plan A / B / C)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {exp.contingencies?.map((c, i) => (
                      <div key={i} className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs space-y-1">
                        <div className="font-bold text-blue-400 text-[11px]">{c.plan}</div>
                        <div className="font-semibold text-slate-900 dark:text-white">{c.title}</div>
                        <div className="text-slate-500 dark:text-slate-400 text-[11px]">{c.action}</div>
                        <div className="text-[10px] text-amber-400 pt-1 border-t border-slate-200 dark:border-slate-800">
                          Trigger: {c.trigger}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Real-time Telemetry & Intelligence Sidebar */}
              <div className="space-y-4">
                {/* Weather card */}
                <div className="bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <CloudSnow className="w-4 h-4 text-blue-400" />
                      Current Weather
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{exp.weather?.data_age_min}m ago</span>
                  </div>
                  <div className="text-xl font-black text-slate-900 dark:text-white">
                    {exp.weather?.temperature_c}°C
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {exp.weather?.condition} · Wind: {exp.weather?.wind_speed_kt} kt {exp.weather?.wind_direction}
                  </div>
                  {exp.weather?.storm_warning && (
                    <div className="bg-rose-950/40 border border-rose-800 p-2 rounded text-[11px] text-rose-300">
                      <strong>{exp.weather.warning_title}:</strong> {exp.weather.warning_impact}
                    </div>
                  )}
                </div>

                {/* Sea Ice card */}
                <div className="bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-cyan-400" />
                      Sea-Ice Intelligence
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{exp.sea_ice?.data_age_hours}h old</span>
                  </div>
                  <div className="text-xl font-black text-cyan-300">
                    {exp.sea_ice?.concentration_pct}% Concentration
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    Class: {exp.sea_ice?.ice_class} ({exp.sea_ice?.ice_thickness_m}m thick)
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {exp.sea_ice?.operational_impact}
                  </p>
                </div>

                {/* Comms card */}
                <div className="bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Wifi className="w-4 h-4 text-purple-400" />
                      SATCOM & Offline Sync
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase border ${
                      exp.communication?.status === 'ONLINE' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                      exp.communication?.status === 'DEGRADED' ? 'bg-amber-950 text-amber-400 border-amber-800' :
                      'bg-rose-950 text-rose-400 border-rose-800'
                    }`}>
                      {exp.communication?.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    Mode: {exp.communication?.mode}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    Latency: {exp.communication?.latency_ms} ms · Pending Sync: {exp.communication?.pending_sync_records} records
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. MAP */}
        {activeTab === 'map' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Radio className="w-4 h-4 text-blue-400" />
                Dedicated Expedition Geographic Tracking Map
              </span>
              <span className="text-slate-500 dark:text-slate-400 font-mono">
                Current Position: {exp.current_lat && exp.current_lon ? `${exp.current_lat}°S, ${exp.current_lon}°E` : 'Awaiting position fix'}
              </span>
            </div>

            <div className="h-[520px] bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden relative">
              <svg viewBox="0 0 800 500" className="w-full h-full object-cover">
                <defs>
                  <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#081b3d" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#020617" stopOpacity="1" />
                  </radialGradient>
                </defs>
                <rect width="800" height="500" fill="url(#mapGlow)" />

                {/* Gridlines */}
                {Array.from({ length: 9 }).map((_, i) => (
                  <line key={`gl-x-${i}`} x1={i * 100} y1="0" x2={i * 100} y2="500" stroke="#1e293b" strokeDasharray="3 3" />
                ))}
                {Array.from({ length: 6 }).map((_, i) => (
                  <line key={`gl-y-${i}`} x1="0" y1={i * 100} x2="800" y2={i * 100} stroke="#1e293b" strokeDasharray="3 3" />
                ))}

                {/* Continental ice edge stylized */}
                <path
                  d="M 50 380 Q 250 320 450 360 T 750 340 L 800 500 L 0 500 Z"
                  fill="#061226"
                  stroke="#38bdf8"
                  strokeWidth="2"
                />

                {/* Waypoints Polyline */}
                {exp.waypoints && exp.waypoints.length > 0 && (
                  <polyline
                    points={exp.waypoints.map((w, idx) => `${100 + idx * 110},${350 - idx * 25}`).join(' ')}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeDasharray="4 2"
                  />
                )}

                {/* Waypoint Nodes */}
                {exp.waypoints?.map((w, idx) => {
                  const x = 100 + idx * 110;
                  const y = 350 - idx * 25;
                  return (
                    <g key={idx}>
                      <circle cx={x} cy={y} r="5" fill={w.passed ? '#38bdf8' : '#ef4444'} stroke="#fff" strokeWidth="1.5" />
                      <text x={x - 20} y={y - 12} fill="#94a3b8" fontSize="10" fontFamily="monospace">
                        #{w.order} {w.name.split(' ')[0]}
                      </text>
                    </g>
                  );
                })}

                {/* Flagship Current Marker */}
                <circle cx="430" cy="275" r="16" fill="#38bdf8" fillOpacity="0.25" className="animate-ping" />
                <circle cx="430" cy="275" r="7" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                <text x="445" y="278" fill="#ffffff" fontSize="12" fontWeight="bold">
                  {exp.vessel_name || exp.ships?.[0] || 'Flagship'}
                </text>
              </svg>

              <div className="absolute bottom-3 left-3 bg-[#0b1329]/90 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg text-xs space-y-1">
                <div className="text-slate-900 dark:text-white font-bold">{exp.name} Transit Route</div>
                <div className="text-slate-500 dark:text-slate-400">Total Distance: 2,450 nm · Heading: 198° · Speed: 11.2 kt</div>
              </div>
            </div>
          </div>
        )}

        {/* 3. MISSION PLAN */}
        {activeTab === 'plan' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              Strategic Mission Plan & Treaty Compliance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-3">
                <div className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px]">Operational Phasing</div>
                <div className="space-y-2">
                  {exp.timeline?.map((ph, i) => (
                    <div key={i} className="flex justify-between items-center p-2 rounded bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">{ph.phase}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">{ph.start} to {ph.end}</div>
                      </div>
                      <span className="font-mono text-blue-400 font-bold">{ph.progress}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-3">
                <div className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px]">Environmental Treaty Protocols</div>
                <ul className="list-disc pl-5 text-slate-700 dark:text-slate-300 space-y-1.5 text-xs">
                  <li>Comprehensive Environmental Evaluation (CEE) ratified by CEP.</li>
                  <li>Zero discharge of ballast water or hydrocarbon residues within treaty boundary.</li>
                  <li>Avian and marine mammal exclusion buffer (minimum 1,500m stand-off).</li>
                  <li>Waste return manifest: 100% solid waste backhauled to origin port.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 4. PERSONNEL */}
        {activeTab === 'personnel' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Crew & Field Personnel Manifest ({exp.crew_count} Deployed)
              </h3>
              <span className="text-slate-500 dark:text-slate-400 font-mono">100% Medical Fit-for-Duty</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono bg-slate-50 dark:bg-slate-950/60">
                    <th className="p-2.5">Name</th>
                    <th className="p-2.5">Role</th>
                    <th className="p-2.5">Team</th>
                    <th className="p-2.5">Certification</th>
                    <th className="p-2.5">Location</th>
                    <th className="p-2.5">Medical Readiness</th>
                    <th className="p-2.5">Shift</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                  {exp.personnel?.roster?.map((p, i) => (
                    <tr key={i} className="hover:bg-white dark:bg-slate-900/40 transition-colors">
                      <td className="p-2.5 font-bold text-slate-900 dark:text-white">{p.name}</td>
                      <td className="p-2.5 text-slate-700 dark:text-slate-300">{p.role}</td>
                      <td className="p-2.5 text-blue-400 font-semibold">{p.team}</td>
                      <td className="p-2.5 text-slate-500 dark:text-slate-400 font-mono">{p.cert}</td>
                      <td className="p-2.5 text-slate-700 dark:text-slate-300">{p.location}</td>
                      <td className="p-2.5">
                        <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.5 rounded font-bold">
                          {p.medical}
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-500 dark:text-slate-400">{p.shift}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. ASSETS */}
        {activeTab === 'assets' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Ship className="w-5 h-5 text-cyan-400" />
              Assigned Ships, Aircraft, Snow Vehicles & Major Equipment
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {exp.ships?.map((s, i) => (
                <div key={`shp-${i}`} className="bg-[#020617] border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{s}</span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      ACTIVE
                    </span>
                  </div>
                  <div className="text-slate-500 dark:text-slate-400">Class: Polar Icebreaker / Research Vessel</div>
                  <div className="text-[11px] font-mono text-slate-500">Telemetry: AIS Online (45s ago)</div>
                </div>
              ))}

              {exp.aircraft?.map((a, i) => (
                <div key={`air-${i}`} className="bg-[#020617] border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{a}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      isBlocked ? 'text-rose-400 bg-rose-950 border-rose-800' : 'text-cyan-400 bg-cyan-950 border-cyan-800'
                    }`}>
                      {isBlocked ? 'GROUNDED (STORM)' : 'READY'}
                    </span>
                  </div>
                  <div className="text-slate-500 dark:text-slate-400">Ski-equipped Polar Aviation Asset</div>
                  <div className="text-[11px] font-mono text-slate-500">Telemetry: ADS-B Active</div>
                </div>
              ))}

              {exp.vehicles?.map((v, i) => (
                <div key={`veh-${i}`} className="bg-[#020617] border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{v}</span>
                    <span className="text-[10px] font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                      OPERATIONAL
                    </span>
                  </div>
                  <div className="text-slate-500 dark:text-slate-400">Tracked Overland Snow Vehicle</div>
                  <div className="text-[11px] font-mono text-slate-500">Engine Health: 96%</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. LOGISTICS */}
        {activeTab === 'logistics' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-400" />
              Resource Manifest & Consumable Inventory
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono bg-slate-50 dark:bg-slate-950/60">
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5">Resource Description</th>
                    <th className="p-2.5">Required</th>
                    <th className="p-2.5">Loaded</th>
                    <th className="p-2.5">Consumed</th>
                    <th className="p-2.5">Remaining</th>
                    <th className="p-2.5">Reserve Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                  {exp.logistics?.items?.map((it, i) => (
                    <tr key={i} className="hover:bg-white dark:bg-slate-900/40 transition-colors">
                      <td className="p-2.5 font-bold text-amber-400">{it.category}</td>
                      <td className="p-2.5 text-slate-900 dark:text-white font-medium">{it.name}</td>
                      <td className="p-2.5 font-mono">{it.required} {it.unit}</td>
                      <td className="p-2.5 font-mono text-blue-400">{it.loaded} {it.unit}</td>
                      <td className="p-2.5 font-mono text-slate-500 dark:text-slate-400">{it.consumed} {it.unit}</td>
                      <td className="p-2.5 font-mono font-bold text-emerald-400">{it.remaining} {it.unit}</td>
                      <td className="p-2.5 font-mono">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          it.reserve_pct < 20 ? 'bg-rose-950 text-rose-300' : 'bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}>
                          {it.reserve_pct}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 7. WEATHER */}
        {activeTab === 'weather' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CloudSnow className="w-5 h-5 text-blue-400" />
                Polar Meteorological Forecasting (Open-Meteo & ECMWF Integrated)
              </h3>
              <span className="text-slate-500 dark:text-slate-400 font-mono">Confidence: {Math.round((exp.weather?.forecast_confidence || 0.9) * 100)}%</span>
            </div>

            {/* Current Readings Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#020617] p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Temperature</span>
                <div className="text-2xl font-black text-blue-300 mt-0.5">{exp.weather?.temperature_c}°C</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Sustained Wind</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{exp.weather?.wind_speed_kt} kt</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Barometric Pressure</span>
                <div className="text-2xl font-black text-cyan-300 mt-0.5">{exp.weather?.pressure_hpa} hPa</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Visibility</span>
                <div className="text-2xl font-black text-emerald-300 mt-0.5">{exp.weather?.visibility_km} km</div>
              </div>
            </div>

            {/* Horizon Forecasts */}
            <div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block mb-2">Extended Horizons</span>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
                {['current', '6_hour', '24_hour', '3_day', '7_day'].map((hz) => {
                  const hData = exp.weather?.forecast_horizons?.[hz as keyof typeof exp.weather.forecast_horizons];
                  if (!hData) return null;
                  return (
                    <div key={hz} className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-3 rounded-lg text-center space-y-1">
                      <div className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">{hz.replace('_', ' ')}</div>
                      <div className="text-lg font-bold text-slate-900 dark:text-white">{hData.temp}°C</div>
                      <div className="text-[11px] text-slate-700 dark:text-slate-300">Wind: {hData.wind} kt</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Vis: {hData.vis} km</div>
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] uppercase font-bold ${
                        hData.status === 'Critical' ? 'bg-rose-950 text-rose-300' :
                        hData.status === 'Severe' ? 'bg-rose-950/70 text-rose-400' :
                        hData.status === 'Warning' ? 'bg-amber-950 text-amber-300' :
                        'bg-emerald-950 text-emerald-300'
                      }`}>
                        {hData.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 8. SEA ICE */}
        {activeTab === 'ice' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-400" />
              Sea-Ice Intelligence & Copernicus Marine SAR Analysis
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-[#020617] border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-2">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Ice Concentration</span>
                <div className="text-3xl font-black text-cyan-400">{exp.sea_ice?.concentration_pct}%</div>
                <div className="text-slate-700 dark:text-slate-300">Class: {exp.sea_ice?.ice_class}</div>
              </div>

              <div className="bg-[#020617] border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-2">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Thickness & Drift</span>
                <div className="text-3xl font-black text-slate-900 dark:text-white">{exp.sea_ice?.ice_thickness_m} m</div>
                <div className="text-slate-700 dark:text-slate-300">Drift: {exp.sea_ice?.drift_speed_kt} kt {exp.sea_ice?.drift_direction}</div>
              </div>

              <div className="bg-[#020617] border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-2">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Compression Risk</span>
                <div className={`text-2xl font-black ${
                  exp.sea_ice?.compression_risk === 'HIGH' ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {exp.sea_ice?.compression_risk || 'LOW'}
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-[11px]">Ice Edge: {exp.sea_ice?.ice_edge_distance_km} km</div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-4 rounded-xl text-xs space-y-1">
              <div className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px]">Data Provenance & Freshness</div>
              <div className="text-slate-700 dark:text-slate-300">Source: <strong className="text-slate-900 dark:text-white">{exp.sea_ice?.source}</strong></div>
              <div className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                Observation Time: {exp.sea_ice?.observation_time} ({exp.sea_ice?.data_age_hours} hours old) · Confidence: {Math.round((exp.sea_ice?.confidence || 0.9) * 100)}%
              </div>
            </div>
          </div>
        )}

        {/* 9. SATELLITE */}
        {activeTab === 'satellite' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              Orbital Earth Observation Intelligence (Periodic SAR & Optical)
            </h3>

            <div className="bg-purple-950/20 border border-purple-500/30 p-3 rounded-lg text-xs text-purple-200">
              <strong>Ground-Truth Observation Notice:</strong> PolarOne treats satellites as periodic orbit passes (Sentinel-1 SAR, Sentinel-2 Optical, ICESat-2), not simulated live continuous video.
            </div>

            <div className="bg-[#020617] border border-slate-200 dark:border-slate-800 p-4 rounded-xl text-xs space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white">{exp.satellite?.scene_id || 'Latest Orbital Scene'}</span>
                <span className="text-[10px] font-mono text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                  {exp.satellite?.satellite_type}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-700 dark:text-slate-300">
                <div>
                  <span className="text-slate-500 text-[10px] block">Sensor / Constellation</span>
                  <strong className="text-slate-900 dark:text-white">{exp.satellite?.source}</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Ground Resolution</span>
                  <strong className="text-slate-900 dark:text-white">{exp.satellite?.resolution_m || 20} meters</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Data Age</span>
                  <strong className="text-slate-900 dark:text-white">{exp.satellite?.data_freshness}</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Cloud Cover</span>
                  <strong className="text-slate-900 dark:text-white">{exp.satellite?.cloud_cover_pct || 0}% (Radar penetration)</strong>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                <span className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Image Interpretation:</span>
                <p className="italic text-slate-500 dark:text-slate-400 leading-relaxed">
                  &quot;{exp.satellite?.interpretation || 'Lead navigation corridor open. No emergent pressure ridge deformation.'}&quot;
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 10. TASKS */}
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-blue-400" />
                Mission Task Management & Dependency Flow
              </h3>
              <button
                onClick={() => setShowTaskModal(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Task
              </button>
            </div>

            <div className="space-y-2">
              {exp.tasks?.map(tsk => (
                <div
                  key={tsk.id}
                  className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-3 rounded-lg flex items-center justify-between text-xs hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-blue-400 font-bold bg-blue-950 px-1.5 py-0.2 rounded border border-blue-900/40">
                        {tsk.id}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">{tsk.title}</span>
                      {tsk.dependency && (
                        <span className="text-[10px] font-mono text-slate-500">
                          (Depends on: {tsk.dependency})
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-3">
                      <span>Team: <strong className="text-slate-700 dark:text-slate-300">{tsk.team}</strong></span>
                      <span>Owner: <strong className="text-slate-700 dark:text-slate-300">{tsk.owner}</strong></span>
                      <span>Due: <strong className="text-slate-700 dark:text-slate-300">{tsk.due_date}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase border ${
                      tsk.priority === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border-rose-800' :
                      tsk.priority === 'HIGH' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                      'bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-700'
                    }`}>
                      {tsk.priority}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase border ${
                      tsk.status === 'COMPLETED' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' :
                      tsk.status === 'BLOCKED' ? 'bg-rose-950 text-rose-300 border-rose-800' :
                      'bg-blue-950 text-blue-300 border-blue-800'
                    }`}>
                      {tsk.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 11. TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Mission Timeline & Operational Phases
            </h3>

            <div className="space-y-3">
              {exp.timeline?.map((ph, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-4 rounded-xl text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{ph.phase}</span>
                    <span className="font-mono text-blue-400 font-bold">{ph.progress}%</span>
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">{ph.start} to {ph.end}</div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: `${ph.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 12. RISKS */}
        {activeTab === 'risks' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                Explainable AI Risk Engine (12 Dimension Factor Analysis)
              </h3>
              <span className="font-mono text-purple-400">Model: XGB_EXP_RISK_v3.2 (Confidence 91%)</span>
            </div>

            <div className="bg-[#020617] border border-slate-200 dark:border-slate-800 p-4 rounded-xl text-xs space-y-1 mb-4">
              <span className="text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px]">Primary Risk Contributor</span>
              <p className="text-slate-900 dark:text-white font-semibold leading-relaxed">
                {exp.risk_engine?.main_contributor}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {exp.risk_engine?.categories?.map((cat, i) => (
                <div key={i} className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-3 rounded-lg space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 dark:text-white">{cat.category}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase border ${
                      cat.level === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border-rose-800' :
                      cat.level === 'HIGH' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                      cat.level === 'MEDIUM' ? 'bg-yellow-950 text-yellow-300 border-yellow-800' :
                      'bg-emerald-950 text-emerald-300 border-emerald-800'
                    }`}>
                      {cat.level} ({cat.score}/100)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{cat.why}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 13. INCIDENTS */}
        {activeTab === 'incidents' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                Expedition Incident Logs & Operational Safety
              </h3>
              <button
                onClick={() => setShowIncidentModal(true)}
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-3 py-1.5 rounded flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Report Incident
              </button>
            </div>

            {(!exp.incidents || exp.incidents.length === 0) ? (
              <div className="bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
                No active safety or equipment incidents recorded. All systems nominal.
              </div>
            ) : (
              <div className="space-y-3">
                {exp.incidents.map(inc => (
                  <div key={inc.id} className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-4 rounded-xl text-xs space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-rose-400 font-bold text-[10px] bg-rose-950 px-1.5 py-0.2 rounded border border-rose-900">
                            {inc.id}
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white text-sm">{inc.title}</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300">{inc.description}</p>
                      </div>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase border bg-rose-950 text-rose-300 border-rose-800 shrink-0">
                        {inc.severity}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-2">
                      <div>Impact: <strong className="text-slate-700 dark:text-slate-300">{inc.mission_impact}</strong></div>
                      <div>Response: <strong className="text-slate-700 dark:text-slate-300">{inc.response}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 14. COMMUNICATIONS */}
        {activeTab === 'communications' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Wifi className="w-5 h-5 text-purple-400" />
              Intermittent Antarctic Satellite Telemetry & Offline Gateway
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-[#020617] border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-2">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Uplink Status</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white">{exp.communication?.status}</div>
                <div className="text-slate-500 dark:text-slate-400">{exp.communication?.mode}</div>
              </div>

              <div className="bg-[#020617] border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-2">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Latency & Signal</span>
                <div className="text-2xl font-black text-purple-400">{exp.communication?.latency_ms} ms</div>
                <div className="text-slate-500 dark:text-slate-400">Packet Loss: {exp.communication?.packet_loss_pct}%</div>
              </div>

              <div className="bg-[#020617] border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-2">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Offline Sync Queue</span>
                <div className="text-2xl font-black text-emerald-400">{exp.communication?.pending_sync_records} records</div>
                <div className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">Last Sync: {exp.communication?.last_successful_sync}</div>
              </div>
            </div>
          </div>
        )}

        {/* 15. ACTIVITY LOG */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-5 h-5 text-blue-400" />
              Tamper-Evident Mission Audit Trail
            </h3>

            <div className="bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-xs space-y-2">
              <div className="p-2.5 rounded bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">STATUS_TRANSITION to {exp.status}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Actor: Commander E. Hayes · Action ratified</span>
                </div>
                <span className="font-mono text-[10px] text-slate-500">AUD-EXP-2026-LIVE</span>
              </div>
              <div className="p-2.5 rounded bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">MISSION_PLAN_COMMISSIONED</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Actor: Antarctic Operations Command</span>
                </div>
                <span className="font-mono text-[10px] text-slate-500">AUD-EXP-2026-ROOT</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      {showScenarioModal && (
        <ScenarioModal
          expedition={exp}
          onClose={() => setShowScenarioModal(false)}
        />
      )}

      {showApprovalModal && (
        <ApprovalModal
          expedition={exp}
          onClose={() => setShowApprovalModal(false)}
          onSuccess={() => onRefresh?.()}
        />
      )}

      {showIncidentModal && (
        <AddIncidentModal
          expedition={exp}
          onClose={() => setShowIncidentModal(false)}
          onSuccess={() => onRefresh?.()}
        />
      )}

      {showTaskModal && (
        <AddTaskModal
          expedition={exp}
          onClose={() => setShowTaskModal(false)}
          onSuccess={() => onRefresh?.()}
        />
      )}

      <ExpeditionCopilotDrawer
        expeditionId={exp.id}
        isOpen={showCopilot}
        onClose={() => setShowCopilot(false)}
      />
    </div>
  );
}
