"use client"

import React, { useEffect, useState, useCallback } from 'react';
import { fetchLogisticsOverview, submitApprovalAction, submitAlertAction } from '@/lib/api/logistics';
import {
  SyncStatus,
  KPIs,
  Vessel,
  CargoItem,
  StationSupply,
  RouteItem,
  WeatherIntelligence,
  SeaIceIntelligence,
  SatelliteObservation,
  LogisticsAlert,
  ExceptionsSummary,
  ApprovalItem,
  AuditLogEntry
} from '@/types/logistics';

import { LogisticsHeader } from './components/LogisticsHeader';
import { LogisticsKPIStrip } from './components/LogisticsKPIStrip';
import { PrimaryLogisticsWorkspace } from './components/PrimaryLogisticsWorkspace';
import { LogisticsMapSection } from './components/LogisticsMapSection';
import { EnvironmentAndSatelliteSection } from './components/EnvironmentAndSatelliteSection';
import { PredictiveLogisticsIntelligence } from './components/PredictiveLogisticsIntelligence';
import { HumanInTheLoopApproval } from './components/HumanInTheLoopApproval';
import { CargoFlowVisualization } from './components/CargoFlowVisualization';
import { InventoryForecastPanel } from './components/InventoryForecastPanel';
import { LogisticsAlertCenter } from './components/LogisticsAlertCenter';
import { MissionAndTwinIntegration } from './components/MissionAndTwinIntegration';
import { LogisticsDetailedTables } from './components/LogisticsDetailedTables';
import { LogisticsCopilotAssistant } from './components/LogisticsCopilotAssistant';
import { AlertTriangle, RefreshCw, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function LogisticsCommandCenterPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offlineMode, setOfflineMode] = useState(false);

  // Core Data States
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [cargo, setCargo] = useState<CargoItem[]>([]);
  const [stations, setStations] = useState<StationSupply[]>([]);
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [weather, setWeather] = useState<WeatherIntelligence | null>(null);
  const [seaIce, setSeaIce] = useState<SeaIceIntelligence | null>(null);
  const [satellites, setSatellites] = useState<SatelliteObservation[]>([]);
  const [alerts, setAlerts] = useState<LogisticsAlert[]>([]);
  const [exceptions, setExceptions] = useState<ExceptionsSummary | null>(null);
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);

  // Modal states
  const [resupplyModalOpen, setResupplyModalOpen] = useState(false);
  const [missionCreatedNotice, setMissionCreatedNotice] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchLogisticsOverview();
      setSyncStatus(data.sync_status);
      setKpis(data.kpis);
      setVessels(data.vessels);
      setCargo(data.cargo);
      setStations(data.stations);
      setRoutes(data.routes);
      setWeather(data.weather);
      setSeaIce(data.sea_ice);
      setSatellites(data.satellite);
      setAlerts(data.alerts);
      setExceptions(data.exceptions);
      setApprovals(data.approvals);
      setAuditLog(data.audit_log);
      setOfflineMode(data.offlineMode);
    } catch (err: any) {
      console.error('Failed to load logistics data:', err);
      setError(err?.message || 'Unable to connect to logistics telemetry feeds.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handler for HITL decisions
  const handleDecision = async (approvalId: string, decision: 'APPROVE' | 'REJECT' | 'MODIFY', notes?: string) => {
    const result = await submitApprovalAction(approvalId, decision, notes);
    if (result.success) {
      const finalStatus: 'APPROVED' | 'REJECTED' | 'MODIFIED' =
        decision === 'APPROVE' ? 'APPROVED' : decision === 'REJECT' ? 'REJECTED' : 'MODIFIED';
      setApprovals(prev => prev.map(a => a.id === approvalId ? { ...a, status: finalStatus, decision_notes: notes } : a));
      if (result.audit_entry) {
        setAuditLog(prev => [result.audit_entry, ...prev]);
      }
    }
  };

  // Handler for Alert actions
  const handleAlertAction = async (alertId: string, action: string) => {
    await submitAlertAction(alertId, action);
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: action === 'RESOLVE' ? 'RESOLVED' : 'ACKNOWLEDGED' } : a));
  };

  // Create Resupply Mission Trigger
  const handleCreateMission = (e: React.FormEvent) => {
    e.preventDefault();
    setResupplyModalOpen(false);
    setMissionCreatedNotice(true);
    setTimeout(() => setMissionCreatedNotice(false), 5000);
  };

  // Loading Skeleton State (Section 34)
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#020617] text-slate-200 p-6 pt-8 space-y-6">
        <div className="h-16 rounded-xl bg-white dark:bg-slate-900/60 animate-pulse border border-slate-200 dark:border-slate-800" />
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-white dark:bg-slate-900/60 animate-pulse border border-slate-200 dark:border-slate-800" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-80 rounded-2xl bg-white dark:bg-slate-900/60 animate-pulse border border-slate-200 dark:border-slate-800" />
          ))}
        </div>
        <div className="h-96 rounded-2xl bg-white dark:bg-slate-900/60 animate-pulse border border-slate-200 dark:border-slate-800" />
      </div>
    );
  }

  // Error State with Retry Button (Section 34)
  if (error && !kpis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-[#020617] text-slate-200 p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Logistics Telemetry Feed Unavailable</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">{error}</p>
        <button
          onClick={() => { setLoading(true); loadData(); }}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-200 transition-colors duration-150">
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-4 max-w-[1700px] mx-auto w-full">
        {/* ------------------------------------------------------------- */}
        {/* SUCCESS NOTICE TOAST */}
        {/* ------------------------------------------------------------- */}
        {missionCreatedNotice && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-300 dark:bg-emerald-950 dark:border-emerald-500 dark:text-emerald-200 shadow-2xl flex items-center gap-3 animate-fade-in text-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold text-slate-900 dark:text-white">Emergency Resupply Mission Registered</div>
              <div className="text-[11px] text-emerald-700 dark:text-emerald-300">Fast-track LC-130 / Icebreaker route logged in audit registry.</div>
            </div>
          </div>
        )}

      {/* ------------------------------------------------------------- */}
      {/* 1. HEADER (Section 5) */}
      {/* ------------------------------------------------------------- */}
      {syncStatus && (
        <LogisticsHeader
          syncStatus={syncStatus}
          offlineMode={offlineMode}
          onRefresh={loadData}
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. KPI STRIP (Section 6) */}
      {/* ------------------------------------------------------------- */}
      {kpis && <LogisticsKPIStrip kpis={kpis} />}

      {/* ------------------------------------------------------------- */}
      {/* 3. PRIMARY LOGISTICS WORKSPACE (4 CARDS: Section 7 & 8) */}
      {/* ------------------------------------------------------------- */}
      <PrimaryLogisticsWorkspace
        vessels={vessels}
        cargo={cargo}
        routes={routes}
        stations={stations}
        onOpenResupplyModal={() => setResupplyModalOpen(true)}
      />

      {/* ------------------------------------------------------------- */}
      {/* 4. OPERATIONAL LOGISTICS MAP (Section 9) */}
      {/* ------------------------------------------------------------- */}
      {weather && seaIce && (
        <LogisticsMapSection
          vessels={vessels}
          stations={stations}
          routes={routes}
          weather={weather}
          seaIce={seaIce}
          satellites={satellites}
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. WEATHER + SEA ICE + SATELLITE INTELLIGENCE (Section 10 & 11) */}
      {/* ------------------------------------------------------------- */}
      {weather && seaIce && (
        <EnvironmentAndSatelliteSection
          weather={weather}
          seaIce={seaIce}
          satellites={satellites}
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* 6. PREDICTIVE LOGISTICS INTELLIGENCE (Section 13 & 14) */}
      {/* ------------------------------------------------------------- */}
      <PredictiveLogisticsIntelligence />

      {/* ------------------------------------------------------------- */}
      {/* 7. HUMAN-IN-THE-LOOP APPROVAL WORKFLOW & AUDIT LOG (Section 15 & 36) */}
      {/* ------------------------------------------------------------- */}
      <HumanInTheLoopApproval
        approvals={approvals}
        auditLog={auditLog}
        onDecision={handleDecision}
      />

      {/* ------------------------------------------------------------- */}
      {/* 8. CARGO FLOW VISUALIZATION (Section 16) */}
      {/* ------------------------------------------------------------- */}
      <CargoFlowVisualization cargo={cargo} />

      {/* ------------------------------------------------------------- */}
      {/* 9. INVENTORY FORECAST PANEL (Section 17) */}
      {/* ------------------------------------------------------------- */}
      <InventoryForecastPanel stations={stations} />

      {/* ------------------------------------------------------------- */}
      {/* 10. LOGISTICS ALERT CENTER & EXCEPTION MANAGEMENT (Section 18 & 19) */}
      {/* ------------------------------------------------------------- */}
      {exceptions && (
        <LogisticsAlertCenter
          alerts={alerts}
          exceptions={exceptions}
          onAlertAction={handleAlertAction}
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* 11. MISSION / EXPEDITION & DIGITAL TWIN INTEGRATION (Section 20 & 21) */}
      {/* ------------------------------------------------------------- */}
      <MissionAndTwinIntegration />

      {/* ------------------------------------------------------------- */}
      {/* 12. DETAILED TABLES (Section 22 & 23) */}
      {/* ------------------------------------------------------------- */}
      <LogisticsDetailedTables
        vessels={vessels}
        cargo={cargo}
        stations={stations}
        routes={routes}
      />

      {/* ------------------------------------------------------------- */}
      {/* 13. LOGISTICS COPILOT ASSISTANT (Section 40) */}
      {/* ------------------------------------------------------------- */}
      <LogisticsCopilotAssistant />

      {/* ------------------------------------------------------------- */}
      {/* CREATE RESUPPLY MISSION MODAL (From Section 8 Action) */}
      {/* ------------------------------------------------------------- */}
      {resupplyModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateMission}
            className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Create Resupply Mission</h3>
              <button
                type="button"
                onClick={() => setResupplyModalOpen(false)}
                className="text-slate-500 dark:text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-slate-500 dark:text-slate-400 font-semibold block mb-1">Target Research Station:</label>
                <select className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-200">
                  <option value="davis">Davis Station (CRITICAL - 8.5d Fuel remaining)</option>
                  <option value="maitri">Maitri Station (WARNING - 9.0d Medical remaining)</option>
                  <option value="bharati">Bharati Station (WARNING - 11.0d Parts remaining)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-500 dark:text-slate-400 font-semibold block mb-1">Assigned Transport Asset:</label>
                <select className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-200">
                  <option value="polar_star">Polar Star (Heavy Icebreaker PC1)</option>
                  <option value="aurora">Aurora Australis II (PC2)</option>
                  <option value="c130">LC-130 Hercules Ski-Plane (Air Transport)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-500 dark:text-slate-400 font-semibold block mb-1">Urgent Cargo Allocation:</label>
                <input
                  type="text"
                  defaultValue="45,000L Arctic Diesel + Medical Units"
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-200"
                />
              </div>

              <div>
                <label className="text-slate-500 dark:text-slate-400 font-semibold block mb-1">Operational Justification:</label>
                <textarea
                  defaultValue="Mitigate projected fuel stockout before winter polar front."
                  className="w-full p-2.5 h-16 rounded-lg bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-200"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setResupplyModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-900 dark:text-white font-semibold"
              >
                Dispatch Resupply Order
              </button>
            </div>
          </form>
        </div>
      )}
      </main>
    </div>
  );
}
