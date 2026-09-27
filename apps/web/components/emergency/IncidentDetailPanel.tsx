"use client"

import React, { useState } from 'react'
import { Incident, ResponseAsset } from '@/types/emergency'
import { 
  ShieldAlert, 
  X, 
  Ship, 
  MapPin, 
  Clock, 
  Activity, 
  Cpu, 
  LifeBuoy, 
  Radio, 
  CheckCircle2, 
  Network, 
  FileText, 
  History, 
  FileBarChart,
  Navigation,
  Compass,
  AlertTriangle,
  Lock,
  CloudSnow,
  Send,
  Maximize2
} from 'lucide-react'
import { DataFreshnessBadge } from './DataFreshnessBadge'
import { RiskAssessment } from './RiskAssessment'
import { AIRecommendationCard } from './AIRecommendationCard'
import { ApprovalPanel } from './ApprovalPanel'
import { ResponseAssetPanel } from './ResponseAssetPanel'
import { WeatherIceEvidencePanel } from './WeatherIceEvidencePanel'
import { CommunicationPanel } from './CommunicationPanel'
import { CascadingImpactGraph } from './CascadingImpactGraph'
import { IncidentTimeline } from './IncidentTimeline'
import { EmergencyProtocols } from './EmergencyProtocols'
import { AuditLogViewer } from './AuditLogViewer'

interface IncidentDetailPanelProps {
  incident: Incident;
  responseAssets: ResponseAsset[];
  onClose: () => void;
  onApproveAction: (approvalId: string, commanderName: string, comment: string) => Promise<void>;
  onRejectAction: (approvalId: string, commanderName: string, reason: string) => Promise<void>;
  onSubmitApprovalRequest: (actionType: string, title: string, reason: string) => Promise<void>;
  onSendMessage: (sender: string, channel: string, message: string) => Promise<void>;
  onCloseIncident: (commanderName: string, notes: string, rootCause: string) => Promise<void>;
  onOpenReport: () => void;
  onSimulateDiversion: () => void;
}

export type DetailTab = 
  | 'overview'
  | 'ai_risk'
  | 'recommendation'
  | 'approvals'
  | 'assets'
  | 'weather_ice'
  | 'comms'
  | 'cascading'
  | 'timeline'
  | 'protocols'
  | 'close_incident';

export function IncidentDetailPanel({
  incident,
  responseAssets,
  onClose,
  onApproveAction,
  onRejectAction,
  onSubmitApprovalRequest,
  onSendMessage,
  onCloseIncident,
  onOpenReport,
  onSimulateDiversion
}: IncidentDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const [closureNotes, setClosureNotes] = useState('');
  const [rootCause, setRootCause] = useState('Severe pack ice ridge keels driven by 32kt southerly katabatic gale front');
  const [commanderSigner, setCommanderSigner] = useState('Cmdr. Hayes');
  const [isClosing, setIsClosing] = useState(false);

  const primaryAsset = incident.affected_assets?.[0];

  const tabs = [
    { id: 'overview' as DetailTab, label: 'Overview', icon: Ship },
    { id: 'ai_risk' as DetailTab, label: 'AI Risk & SHAP', icon: Cpu },
    { id: 'recommendation' as DetailTab, label: 'Recommendation', icon: Activity },
    { id: 'approvals' as DetailTab, label: `Approvals (${incident.pending_approvals?.filter(a => a.status === 'PENDING').length || 0})`, icon: Lock },
    { id: 'assets' as DetailTab, label: 'Response Assets', icon: LifeBuoy },
    { id: 'weather_ice' as DetailTab, label: 'Weather & Satellite', icon: CloudSnow },
    { id: 'comms' as DetailTab, label: 'Tactical Comms', icon: Radio },
    { id: 'cascading' as DetailTab, label: 'Cascading Impact', icon: Network },
    { id: 'timeline' as DetailTab, label: 'Timeline', icon: Clock },
    { id: 'close_incident' as DetailTab, label: 'Resolution & Report', icon: FileBarChart }
  ];

  const handleResolveAndClose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!closureNotes.trim()) {
      alert("Commander resolution notes are mandatory to close an operational incident.");
      return;
    }
    setIsClosing(true);
    try {
      await onCloseIncident(commanderSigner, closureNotes, rootCause);
      onOpenReport();
    } catch (err: any) {
      alert(`Closure error: ${err.message}`);
    } finally {
      setIsClosing(false);
    }
  };

  return (
    <div className="bg-[#0b1329] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col h-full shadow-2xl">
      {/* Workspace Top Header */}
      <div className="p-4 bg-[#0f172a] border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-600/20 border border-red-500/50 flex items-center justify-center text-red-400 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-900 dark:text-white px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 border border-slate-700">
                {incident.id}
              </span>
              <h2 className="text-sm sm:text-base font-bold text-slate-100 uppercase tracking-wide">
                {incident.title}
              </h2>
              {incident.is_simulation && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                  SIMULATION
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">
              <span>{incident.incident_type}</span>
              <span>•</span>
              <span className="text-slate-700 dark:text-slate-300">{incident.location_name}</span>
              <span>•</span>
              <span className="text-slate-500">Lead: {incident.response_lead}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 transition"
          >
            <FileBarChart className="w-3.5 h-3.5 text-blue-400" />
            <span>Generate Report</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Close Workspace"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Internal Sub-Navigation Tabs */}
      <div className="bg-[#080d1e] border-b border-slate-200 dark:border-slate-800 px-4 py-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Display Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-4 font-mono">
            {/* Primary Asset Telemetry Strip */}
            {primaryAsset && (
              <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Ship className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase">
                      Primary Affected Asset: {primaryAsset.name}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">({primaryAsset.asset_type})</span>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-bold">
                    STATUS: {primaryAsset.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block">Position</span>
                    <span className="text-slate-200 font-bold">{primaryAsset.current_lat}°S, {primaryAsset.current_lon}°E</span>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block">Speed / Heading</span>
                    <span className="text-amber-400 font-bold">{primaryAsset.speed_knots} kt / {primaryAsset.heading_deg}°</span>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block">Destination</span>
                    <span className="text-slate-200 font-bold">{primaryAsset.destination}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block">Expected Delay</span>
                    <span className="text-red-400 font-extrabold text-sm">+{primaryAsset.expected_delay_hours} hrs</span>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block">Original ETA</span>
                    <span className="text-slate-700 dark:text-slate-300">{primaryAsset.original_eta}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block">Predicted ETA</span>
                    <span className="text-red-300 font-bold">{primaryAsset.predicted_eta}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block">Fuel Reserve</span>
                    <span className="text-emerald-400 font-bold">{primaryAsset.fuel_remaining_pct}%</span>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block">Personnel Onboard</span>
                    <span className="text-slate-200 font-bold">{primaryAsset.personnel_count} Souls</span>
                  </div>
                </div>
              </div>
            )}

            {/* Description & Operational Narrative */}
            <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block">
                Incident Operational Narrative
              </span>
              <p className="text-slate-200 font-sans text-xs leading-relaxed">
                {incident.description}
              </p>
            </div>

            {/* Multimodal Data Source Freshness Matrix */}
            <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-200 uppercase">
                  Connected Data Feeds & Freshness Audit
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Antarctic Low-Bandwidth Telemetry</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                {incident.data_sources?.map((ds, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">{ds.source}</span>
                      <DataFreshnessBadge status={ds.freshness} />
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1">
                      <span>Updated: {ds.updated_at}</span>
                      <span className="text-slate-700 dark:text-slate-300 font-semibold">{ds.confidence}% Conf</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Recommendation Summary Teaser */}
            {incident.ai_recommendation && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/50 via-slate-900 to-slate-900 border border-blue-500/40 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.2 rounded bg-blue-900 text-blue-200 uppercase font-bold">
                      AI RECOMMENDATION
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{incident.ai_recommendation.title}</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-sans">{incident.ai_recommendation.recommended_action}</p>
                </div>

                <button
                  onClick={() => setActiveTab('recommendation')}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shrink-0 transition"
                >
                  Inspect Plan
                </button>
              </div>
            )}
          </div>
        )}

        {/* AI RISK TAB */}
        {activeTab === 'ai_risk' && (
          <RiskAssessment
            assessment={incident.ai_risk_assessment}
            severity={incident.severity}
            primaryCause={incident.primary_cause}
            secondaryRisks={incident.secondary_risks}
            potentialImpact={incident.potential_impact}
          />
        )}

        {/* RECOMMENDATION TAB */}
        {activeTab === 'recommendation' && (
          <AIRecommendationCard
            recommendation={incident.ai_recommendation}
            onViewAnalysis={() => setActiveTab('ai_risk')}
            onSimulateResponse={onSimulateDiversion}
            onSubmitForApproval={() => {
              onSubmitApprovalRequest(
                "VESSEL_DIVERSION",
                incident.ai_recommendation.title,
                incident.ai_recommendation.recommended_action
              );
              setActiveTab('approvals');
            }}
          />
        )}

        {/* APPROVALS TAB */}
        {activeTab === 'approvals' && (
          <ApprovalPanel
            approvals={incident.pending_approvals || []}
            onApprove={onApproveAction}
            onReject={onRejectAction}
          />
        )}

        {/* RESPONSE ASSETS TAB */}
        {activeTab === 'assets' && (
          <ResponseAssetPanel
            assets={responseAssets}
            onRequestDispatchApproval={asset => {
              onSubmitApprovalRequest(
                "RESOURCE_DISPATCH",
                `Dispatch ${asset.name} for Fairway Support`,
                `Deploy ${asset.name} (${asset.asset_type}) located ${asset.distance_km}km away with ETA ${asset.eta_hours}h.`
              );
              setActiveTab('approvals');
            }}
          />
        )}

        {/* WEATHER & SATELLITE TAB */}
        {activeTab === 'weather_ice' && (
          <WeatherIceEvidencePanel
            weatherIce={incident.weather_sea_ice}
            satellite={incident.satellite_evidence}
          />
        )}

        {/* COMMS TAB */}
        {activeTab === 'comms' && (
          <CommunicationPanel
            communications={incident.communications || []}
            onSendMessage={(sender, channel, message) => onSendMessage(sender, channel, message)}
          />
        )}

        {/* CASCADING IMPACT TAB */}
        {activeTab === 'cascading' && (
          <CascadingImpactGraph
            impact={incident.cascading_impact}
          />
        )}

        {/* TIMELINE TAB */}
        {activeTab === 'timeline' && (
          <IncidentTimeline
            timeline={incident.timeline || []}
            currentStatus={incident.status}
          />
        )}

        {/* CLOSURE & REPORT TAB */}
        {activeTab === 'close_incident' && (
          <div className="bg-[#0b1329] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileBarChart className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase">Incident Closure & Post-Incident Report</h3>
              </div>

              <button
                onClick={onOpenReport}
                className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold transition"
              >
                View Existing Report
              </button>
            </div>

            {incident.status === 'CLOSED' ? (
              <div className="p-4 rounded-lg bg-emerald-950/60 border border-emerald-700 text-emerald-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>INCIDENT RESOLVED & CLOSED</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-sans">
                  Closed on {incident.closed_at ? new Date(incident.closed_at).toLocaleString() : 'N/A'}. All operational diversions and audit trails recorded.
                </p>
              </div>
            ) : (
              <form onSubmit={handleResolveAndClose} className="space-y-4">
                <div>
                  <label className="text-slate-500 dark:text-slate-400 uppercase text-[10px] block mb-1">
                    Commander Formal Resolution Notes (Required)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter final outcome, vessel condition, fuel consumption delta, and confirmation that vessel cleared hazard pack..."
                    value={closureNotes}
                    onChange={e => setClosureNotes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-500 dark:text-slate-400 uppercase text-[10px] block mb-1">Root Cause Verification</label>
                  <input
                    type="text"
                    value={rootCause}
                    onChange={e => setRootCause(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 dark:text-slate-400">Signing Commander:</span>
                    <input
                      type="text"
                      value={commanderSigner}
                      onChange={e => setCommanderSigner(e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 font-bold focus:outline-none focus:border-blue-500 w-36"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isClosing}
                    className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition shadow-md shadow-red-900/40 disabled:opacity-50"
                  >
                    {isClosing ? 'Resolving...' : 'Resolve & Close Incident'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
