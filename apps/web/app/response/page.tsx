"use client"

import React, { useState, useEffect } from 'react'
import { 
  Incident, 
  ResponseAsset, 
  EmergencyProtocol, 
  AuditLogEntry, 
  PostIncidentReport, 
  ResponseOverviewKPIs 
} from '@/types/emergency'
import { ResponseHeader } from '@/components/emergency/ResponseHeader'
import { ResponseSubNav, ResponseSectionTab } from '@/components/emergency/ResponseSubNav'
import { ResponseKPICards } from '@/components/emergency/ResponseKPICards'
import { IncidentList } from '@/components/emergency/IncidentList'
import { IncidentMap } from '@/components/emergency/IncidentMap'
import { IncidentDetailPanel } from '@/components/emergency/IncidentDetailPanel'
import { ResponseAssetPanel } from '@/components/emergency/ResponseAssetPanel'
import { EmergencyProtocols } from '@/components/emergency/EmergencyProtocols'
import { CommunicationPanel } from '@/components/emergency/CommunicationPanel'
import { ApprovalPanel } from '@/components/emergency/ApprovalPanel'
import { AuditLogViewer } from '@/components/emergency/AuditLogViewer'
import { SimulationScenarioModal } from '@/components/emergency/SimulationScenarioModal'
import { CreateIncidentModal } from '@/components/emergency/CreateIncidentModal'
import { PostIncidentReportModal } from '@/components/emergency/PostIncidentReportModal'
import { 
  Bell, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Radio, 
  Sparkles,
  MapPin,
  Ship,
  X
} from 'lucide-react'

const API_BASE = 'http://127.0.0.1:8000/api/v1/incidents';

export default function EmergencyResponseCenterPage() {
  // Navigation & Sub-navigation State
  const [activeTab, setActiveTab] = useState<ResponseSectionTab>('overview');

  // Core Data States
  const [kpis, setKpis] = useState<ResponseOverviewKPIs>({
    active_incidents: 2,
    critical_incidents: 1,
    pending_approvals: 1,
    response_assets_available: 5,
    incidents_last_24h: 5,
    average_response_time_minutes: 42,
    satellite_alerts: 8,
    ai_risk_alerts: 4,
    system_status: 'ONLINE',
    timestamp: new Date().toISOString()
  });

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [responseAssets, setResponseAssets] = useState<ResponseAsset[]>([]);
  const [protocols, setProtocols] = useState<EmergencyProtocol[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  
  // Modals & Panels
  const [isSimulationModalOpen, setIsSimulationModalOpen] = useState(false);
  const [isCreateIncidentOpen, setIsCreateIncidentOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [activeReport, setActiveReport] = useState<PostIncidentReport | null>(null);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isSimulationActive, setIsSimulationActive] = useState(false);

  // Loading & Connectivity States
  const [isLoading, setIsLoading] = useState(true);
  const [networkStatus, setNetworkStatus] = useState<'ONLINE' | 'DEGRADED' | 'OFFLINE'>('ONLINE');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Initial Fetch & Polling
  const fetchAllData = async () => {
    try {
      // 1. Fetch KPIs
      const kpiRes = await fetch(`${API_BASE}/overview`).catch(() => null);
      if (kpiRes && kpiRes.ok) {
        const kpiData = await kpiRes.json();
        setKpis(kpiData);
        setNetworkStatus('ONLINE');
      } else {
        setNetworkStatus('DEGRADED');
      }

      // 2. Fetch Incidents
      const incRes = await fetch(`${API_BASE}`).catch(() => null);
      if (incRes && incRes.ok) {
        const incData = await incRes.json();
        const list = incData.incidents || [];
        setIncidents(list);
        if (!selectedIncident && list.length > 0) {
          setSelectedIncident(list[0]);
        } else if (selectedIncident) {
          const updated = list.find((i: Incident) => i.id === selectedIncident.id);
          if (updated) setSelectedIncident(updated);
        }
      }

      // 3. Fetch Response Assets
      const assetRes = await fetch(`${API_BASE}/assets`).catch(() => null);
      if (assetRes && assetRes.ok) {
        const assetData = await assetRes.json();
        setResponseAssets(assetData);
      }

      // 4. Fetch Protocols
      const protoRes = await fetch(`${API_BASE}/protocols`).catch(() => null);
      if (protoRes && protoRes.ok) {
        const protoData = await protoRes.json();
        setProtocols(protoData);
      }

      // 5. Fetch Audit Logs
      const auditRes = await fetch(`${API_BASE}/audit`).catch(() => null);
      if (auditRes && auditRes.ok) {
        const auditData = await auditRes.json();
        setAuditLogs(auditData);
      }
    } catch (err) {
      console.error("Failed to fetch response center data:", err);
      setNetworkStatus('OFFLINE');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Action Handlers
  const handleSelectIncident = (inc: Incident) => {
    setSelectedIncident(inc);
  };

  const handleCreateIncident = async (formData: any) => {
    const res = await fetch(`${API_BASE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (!res.ok) throw new Error("Failed to declare incident");
    const data = await res.json();
    setSelectedIncident(data.incident);
    setStatusMessage(`Incident ${data.incident.id} declared successfully.`);
    await fetchAllData();
  };

  const handleApproveAction = async (approvalId: string, commanderName: string, comment: string) => {
    if (!selectedIncident) return;
    const res = await fetch(`${API_BASE}/${selectedIncident.id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        approval_id: approvalId,
        commander_name: commanderName,
        commander_role: "Operations Commander",
        comment_or_reason: comment
      })
    });
    if (!res.ok) throw new Error("Approval execution failed");
    setStatusMessage(`Action approved by ${commanderName}. Order dispatched to vessel.`);
    await fetchAllData();
  };

  const handleRejectAction = async (approvalId: string, commanderName: string, reason: string) => {
    if (!selectedIncident) return;
    const res = await fetch(`${API_BASE}/${selectedIncident.id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        approval_id: approvalId,
        commander_name: commanderName,
        commander_role: "Operations Commander",
        comment_or_reason: reason
      })
    });
    if (!res.ok) throw new Error("Rejection failed");
    setStatusMessage(`Action rejected by ${commanderName}.`);
    await fetchAllData();
  };

  const handleSubmitApprovalRequest = async (actionType: string, title: string, reason: string) => {
    if (!selectedIncident) return;
    const res = await fetch(`${API_BASE}/${selectedIncident.id}/approval`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action_type: actionType,
        title: title,
        reason: reason,
        user: "Cmdr. Hayes",
        role: "Operations Commander"
      })
    });
    if (!res.ok) throw new Error("Failed to queue approval");
    setStatusMessage(`Action queued for Human-in-the-Loop review.`);
    await fetchAllData();
  };

  const handleSendMessage = async (sender: string, channel: string, message: string) => {
    if (!selectedIncident) return;
    const res = await fetch(`${API_BASE}/${selectedIncident.id}/communications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender,
        sender_role: "Commander",
        channel,
        message
      })
    });
    if (!res.ok) throw new Error("Failed to transmit message");
    await fetchAllData();
  };

  const handleCloseIncident = async (commanderName: string, notes: string, rootCause: string) => {
    if (!selectedIncident) return;
    const res = await fetch(`${API_BASE}/${selectedIncident.id}/close`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        commander_name: commanderName,
        commander_notes: notes,
        root_cause: rootCause
      })
    });
    if (!res.ok) throw new Error("Failed to close incident");
    setStatusMessage(`Incident ${selectedIncident.id} closed.`);
    await fetchAllData();
  };

  const handleOpenReport = async () => {
    if (!selectedIncident) return;
    try {
      const res = await fetch(`${API_BASE}/${selectedIncident.id}/report`);
      if (res.ok) {
        const report = await res.json();
        setActiveReport(report);
        setIsReportModalOpen(true);
      }
    } catch (err) {
      console.error("Report fetch error:", err);
    }
  };

  const handleTriggerScenario = async (scenarioId: number) => {
    setIsSimulationActive(true);
    const res = await fetch(`${API_BASE}/demo/scenario`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario_id: scenarioId })
    });
    if (!res.ok) throw new Error("Failed to trigger demo scenario");
    const data = await res.json();
    setSelectedIncident(data.incident);
    setStatusMessage(`Simulation Scenario #${scenarioId} launched.`);
    await fetchAllData();
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#020617] text-slate-100 font-sans">
      {/* 1. TOP GLOBAL NAVIGATION & HEADER */}
      <ResponseHeader
        activeIncidentsCount={kpis.active_incidents}
        pendingApprovalsCount={kpis.pending_approvals}
        systemStatus={networkStatus}
        isSimulationActive={isSimulationActive}
        onOpenSimulationModal={() => setIsSimulationModalOpen(true)}
        onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
        unreadNotificationsCount={kpis.critical_incidents + kpis.pending_approvals}
      />

      {/* 2. RESPONSE CENTER SUB-NAVIGATION */}
      <ResponseSubNav
        activeTab={activeTab}
        onTabChange={tab => setActiveTab(tab)}
        activeIncidentsCount={kpis.active_incidents}
        pendingApprovalsCount={kpis.pending_approvals}
      />

      {/* 3. RESPONSE OVERVIEW KPI BAR */}
      <ResponseKPICards
        kpis={kpis}
        onFilterClick={filterType => {
          if (filterType === 'pending_approvals') setActiveTab('approvals');
          else if (filterType === 'active_incidents') setActiveTab('incidents');
          else if (filterType === 'response_assets') setActiveTab('assets');
        }}
      />

      {/* Status Alert Banner */}
      {statusMessage && (
        <div className="bg-blue-950/80 border-b border-blue-800 px-6 py-2 flex items-center justify-between text-xs font-mono text-blue-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
            <span>{statusMessage}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-slate-500 dark:text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* 4. MAIN OPERATIONAL WORKSPACE (SWITCHABLE BY SUB-NAV) */}
      <main className="flex-1 p-4 lg:p-6 space-y-6 overflow-y-auto">
        {/* OVERVIEW SECTION (SPLIT COMMAND VIEW) */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top Grid: Incident List (Left) + Interactive Map (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[620px]">
              {/* Left Column: Incidents Queue */}
              <div className="lg:col-span-4 h-full">
                <IncidentList
                  incidents={incidents}
                  selectedIncidentId={selectedIncident?.id || ''}
                  onSelectIncident={handleSelectIncident}
                  onCreateIncidentClick={() => setIsCreateIncidentOpen(true)}
                />
              </div>

              {/* Right Column: Polar Map */}
              <div className="lg:col-span-8 h-full">
                <IncidentMap
                  selectedIncident={selectedIncident}
                  responseAssets={responseAssets}
                  onSelectAsset={asset => {
                    if (selectedIncident) {
                      handleSubmitApprovalRequest(
                        "RESOURCE_DISPATCH",
                        `Dispatch ${asset.name} to Assist ${selectedIncident.affected_assets?.[0]?.name || 'Vessel'}`,
                        `Deploy ${asset.name} (${asset.asset_type}) with ETA ${asset.eta_hours}h.`
                      );
                    }
                  }}
                />
              </div>
            </div>

            {/* Bottom Section: Active Incident Detailed Workspace */}
            {selectedIncident && (
              <div className="w-full">
                <IncidentDetailPanel
                  incident={selectedIncident}
                  responseAssets={responseAssets}
                  onClose={() => {}}
                  onApproveAction={handleApproveAction}
                  onRejectAction={handleRejectAction}
                  onSubmitApprovalRequest={handleSubmitApprovalRequest}
                  onSendMessage={handleSendMessage}
                  onCloseIncident={handleCloseIncident}
                  onOpenReport={handleOpenReport}
                  onSimulateDiversion={() => setStatusMessage("Simulated diversion route verified.")}
                />
              </div>
            )}
          </div>
        )}

        {/* ACTIVE INCIDENTS TAB */}
        {activeTab === 'incidents' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[700px]">
            <div className="lg:col-span-4 h-[700px]">
              <IncidentList
                incidents={incidents}
                selectedIncidentId={selectedIncident?.id || ''}
                onSelectIncident={handleSelectIncident}
                onCreateIncidentClick={() => setIsCreateIncidentOpen(true)}
              />
            </div>
            <div className="lg:col-span-8">
              {selectedIncident ? (
                <IncidentDetailPanel
                  incident={selectedIncident}
                  responseAssets={responseAssets}
                  onClose={() => {}}
                  onApproveAction={handleApproveAction}
                  onRejectAction={handleRejectAction}
                  onSubmitApprovalRequest={handleSubmitApprovalRequest}
                  onSendMessage={handleSendMessage}
                  onCloseIncident={handleCloseIncident}
                  onOpenReport={handleOpenReport}
                  onSimulateDiversion={() => setStatusMessage("Diversion simulated.")}
                />
              ) : (
                <div className="bg-[#0b1329] border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center text-slate-500 font-mono">
                  Select an incident from the list to open the operations workspace.
                </div>
              )}
            </div>
          </div>
        )}

        {/* INCIDENT MAP TAB */}
        {activeTab === 'map' && (
          <div className="h-[750px] w-full">
            <IncidentMap
              selectedIncident={selectedIncident}
              responseAssets={responseAssets}
              onSelectAsset={asset => {
                setStatusMessage(`Asset ${asset.name} selected: ${asset.suitability_pct}% suitability.`);
              }}
            />
          </div>
        )}

        {/* RESPONSE ASSETS TAB */}
        {activeTab === 'assets' && (
          <ResponseAssetPanel
            assets={responseAssets}
            onRequestDispatchApproval={asset => {
              if (selectedIncident) {
                handleSubmitApprovalRequest(
                  "RESOURCE_DISPATCH",
                  `Dispatch ${asset.name}`,
                  `Deploy ${asset.name} (${asset.asset_type}) located ${asset.distance_km}km away with ETA ${asset.eta_hours}h.`
                );
                setActiveTab('approvals');
              } else {
                alert("Please select an incident first.");
              }
            }}
          />
        )}

        {/* PROTOCOLS TAB */}
        {activeTab === 'protocols' && (
          <EmergencyProtocols
            protocols={protocols}
            activeProtocolCode={selectedIncident?.incident_type === 'Sea Ice Obstruction' ? 'SEA_ICE_BLOCKAGE' : 'VESSEL_BREAKDOWN'}
            onInitiateProtocolWorkflow={proto => {
              setStatusMessage(`Initiated protocol flow: ${proto.name}.`);
            }}
          />
        )}

        {/* COMMUNICATIONS TAB */}
        {activeTab === 'communications' && selectedIncident && (
          <CommunicationPanel
            communications={selectedIncident.communications || []}
            onSendMessage={handleSendMessage}
          />
        )}

        {/* APPROVALS TAB */}
        {activeTab === 'approvals' && selectedIncident && (
          <ApprovalPanel
            approvals={selectedIncident.pending_approvals || []}
            onApprove={handleApproveAction}
            onReject={handleRejectAction}
          />
        )}

        {/* AUDIT LOG TAB */}
        {activeTab === 'history' && (
          <AuditLogViewer auditLogs={auditLogs} />
        )}

        {/* REPORTS TAB */}
        {activeTab === 'reports' && (
          <div className="bg-[#0b1329] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xl space-y-4 font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase">Incident Reports & Debrief Archive</h3>
              <button
                onClick={handleOpenReport}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition"
              >
                Generate Report for {selectedIncident?.id || 'Active'}
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
              All resolved incidents generate formal executive reports detailing detection speed, response duration, root cause, and AI prediction fidelity.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div 
                onClick={handleOpenReport}
                className="p-4 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-slate-700 cursor-pointer space-y-1"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-200">REP-INC-001-A24F</span>
                  <span className="text-[10px] text-emerald-400 font-bold">READY</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-sans">Dense Sea Ice Blocking Polar Star - Post-Incident Intelligence Report</p>
                <div className="text-[10px] text-slate-500">Predicted delay: +26h • Actual: +24h (Error: 2h)</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 5. MODALS & DRAWERS */}
      {/* Simulation Scenario Modal */}
      <SimulationScenarioModal
        isOpen={isSimulationModalOpen}
        onClose={() => setIsSimulationModalOpen(false)}
        onTriggerScenario={handleTriggerScenario}
      />

      {/* Create Incident Modal */}
      <CreateIncidentModal
        isOpen={isCreateIncidentOpen}
        onClose={() => setIsCreateIncidentOpen(false)}
        onSubmit={handleCreateIncident}
      />

      {/* Post-Incident Report Modal */}
      <PostIncidentReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        report={activeReport}
      />

      {/* Notification Drawer */}
      {isNotificationDrawerOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-96 bg-[#0b1329] border-l border-slate-200 dark:border-slate-800 shadow-2xl p-5 flex flex-col font-mono text-xs animate-slide-left">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-400" />
              <span className="font-bold text-slate-900 dark:text-white uppercase">Operational Alerts Queue</span>
            </div>
            <button onClick={() => setIsNotificationDrawerOpen(false)} className="text-slate-500 dark:text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-200 dark:divide-slate-800 space-y-2 py-3 no-scrollbar">
            <div className="p-3 rounded bg-red-950/40 border border-red-800/60 space-y-1">
              <span className="text-[10px] font-bold text-red-400 uppercase">CRITICAL ALERT</span>
              <p className="text-slate-200 font-sans text-xs">Polar Star forward progress restricted by 2.1m compressive ridge pack.</p>
              <div className="text-[9px] text-slate-500 dark:text-slate-400 flex justify-between pt-1">
                <span>Action Required: Commander Approval</span>
                <span>2m ago</span>
              </div>
            </div>

            <div className="p-3 rounded bg-amber-950/40 border border-amber-800/60 space-y-1">
              <span className="text-[10px] font-bold text-amber-400 uppercase">APPROVAL REQUIRED</span>
              <p className="text-slate-200 font-sans text-xs">Route Diversion B awaiting formal sign-off from Cmdr. Hayes.</p>
              <div className="text-[9px] text-slate-500 dark:text-slate-400 flex justify-between pt-1">
                <span>HITL Gate</span>
                <span>45m ago</span>
              </div>
            </div>

            <div className="p-3 rounded bg-blue-950/40 border border-blue-800/60 space-y-1">
              <span className="text-[10px] font-bold text-blue-400 uppercase">TELEMETRY UPDATE</span>
              <p className="text-slate-200 font-sans text-xs">Sentinel-1A SAR observation processed successfully.</p>
              <div className="text-[9px] text-slate-500 dark:text-slate-400 flex justify-between pt-1">
                <span>Feed: FRESH</span>
                <span>38m ago</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
