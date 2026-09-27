"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  CommandCenterOverview,
  Vessel,
  Station,
  UserRole,
  TimeHorizon,
  RegionFilter,
  LayerConfig,
  AlertItem
} from '@/types/command-center';
import {
  fetchCommandCenterOverview,
  acknowledgeAlert,
  approveRecommendation,
  triggerDemoScenario,
  queryCopilot,
  searchEntities
} from '@/lib/api/command-center';
import {
  computeVesselProjections,
  computeHorizonKpis
} from '@/lib/utils/projections';

import { CommandHeader } from './CommandHeader';
import { CommandToolbar } from './CommandToolbar';
import { KPIGrid } from './KPIGrid';
import { OperationsMap } from './OperationsMap';
import { VesselDrawer } from './VesselDrawer';
import { StationDrawer } from './StationDrawer';
import { BottomDock } from './BottomDock';
import { ExplainabilityModal } from './ExplainabilityModal';
import { ApprovalDialog } from './ApprovalDialog';
import { DemoScenarioModal } from './DemoScenarioModal';

export function CommandCenter() {
  const [overview, setOverview] = useState<CommandCenterOverview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // User & Role State
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('Commander');

  // Map & Controls State
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>('Live');
  const [selectedRegion, setSelectedRegion] = useState<RegionFilter>('All Antarctica');
  const [layers, setLayers] = useState<LayerConfig>({
    vessels: true,
    stations: true,
    routes: true,
    seaIce: true,
    weather: true,
    satellite: true,
    sar: true,
    riskZones: true,
  });

  // Selected Entities
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>('VESSEL_POLAR_STAR');
  const [selectedEntityType, setSelectedEntityType] = useState<'VESSEL' | 'STATION' | null>('VESSEL');

  // Modals & Panels
  const [demoModalOpen, setDemoModalOpen] = useState<boolean>(false);
  const [explainabilityModalOpen, setExplainabilityModalOpen] = useState<boolean>(false);
  const [approvalModalOpen, setApprovalModalOpen] = useState<boolean>(false);
  const [activeBottomTab, setActiveBottomTab] = useState<'EVENTS' | 'PREDICTIONS' | 'ALERTS' | 'HEALTH' | 'COPILOT'>('EVENTS');
  const [kpiFilter, setKpiFilter] = useState<string | null>(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Telemetry Connection State
  const [networkState, setNetworkState] = useState<'ONLINE' | 'DEGRADED' | 'OFFLINE'>('ONLINE');

  // Reactive Projections for Time Horizon & Region (Must be declared at top level of component)
  const projectedVessels = useMemo(() => {
    if (!overview) return [];
    return computeVesselProjections(overview.vessels, timeHorizon);
  }, [overview, timeHorizon]);

  const projectedKpis = useMemo(() => {
    if (!overview) return null;
    return computeHorizonKpis(overview.kpis, timeHorizon);
  }, [overview, timeHorizon]);

  const activeVesselForDrawer = useMemo(() => {
    if (!selectedEntityId || selectedEntityType !== 'VESSEL') return selectedVessel;
    return projectedVessels.find((v) => v.id === selectedEntityId) || selectedVessel;
  }, [selectedEntityId, selectedEntityType, projectedVessels, selectedVessel]);

  // Initial Load
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchCommandCenterOverview();
      setOverview(data);
      // Pre-select Polar Star to showcase delayed status and predictions out-of-the-box
      if (data.vessels && data.vessels.length > 0) {
        const polarStar = data.vessels.find((v) => v.id === 'VESSEL_POLAR_STAR') || data.vessels[0];
        setSelectedVessel(polarStar);
        setSelectedEntityId(polarStar.id);
        setSelectedEntityType('VESSEL');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load Antarctic operations telemetry.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Periodic Telemetry Synchronization (Simulates real AIS/Station satellite batch sync)
  useEffect(() => {
    const syncInterval = setInterval(async () => {
      try {
        const data = await fetchCommandCenterOverview();
        setOverview(data);
        if (selectedVessel) {
          const updated = data.vessels.find((v) => v.id === selectedVessel.id);
          if (updated) setSelectedVessel(updated);
        }
        if (selectedStation) {
          const updated = data.stations.find((s) => s.id === selectedStation.id);
          if (updated) setSelectedStation(updated);
        }
      } catch (err) {
        setNetworkState('DEGRADED');
      }
    }, 20000);
    return () => clearInterval(syncInterval);
  }, [selectedVessel, selectedStation]);

  // Search Handler
  const handleSearchChange = async (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    const results = await searchEntities(q);
    setSearchResults(results);
  };

  const handleSearchSelect = (item: any) => {
    if (!overview) return;
    if (item.category === 'VESSEL') {
      const v = overview.vessels.find((v) => v.id === item.id);
      if (v) {
        setSelectedVessel(v);
        setSelectedStation(null);
        setSelectedEntityId(v.id);
        setSelectedEntityType('VESSEL');
      }
    } else if (item.category === 'STATION') {
      const s = overview.stations.find((s) => s.id === item.id);
      if (s) {
        setSelectedStation(s);
        setSelectedVessel(null);
        setSelectedEntityId(s.id);
        setSelectedEntityType('STATION');
      }
    } else if (item.category === 'ALERT') {
      setActiveBottomTab('ALERTS');
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  // Layer Toggle Handler
  const handleToggleLayer = (layerKey: keyof LayerConfig) => {
    setLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  // Vessel Selection
  const handleSelectVessel = (vessel: Vessel) => {
    setSelectedVessel(vessel);
    setSelectedStation(null);
    setSelectedEntityId(vessel.id);
    setSelectedEntityType('VESSEL');
  };

  // Station Selection
  const handleSelectStation = (station: Station) => {
    setSelectedStation(station);
    setSelectedVessel(null);
    setSelectedEntityId(station.id);
    setSelectedEntityType('STATION');
  };

  // Generic Entity Selector (from alerts or search)
  const handleSelectEntity = (type: 'VESSEL' | 'STATION' | 'ALERT' | 'CARGO' | 'WEATHER', id: string) => {
    if (!overview) return;
    if (type === 'VESSEL') {
      const v = overview.vessels.find((v) => v.id === id);
      if (v) handleSelectVessel(v);
    } else if (type === 'STATION') {
      const s = overview.stations.find((s) => s.id === id);
      if (s) handleSelectStation(s);
    } else {
      setActiveBottomTab('ALERTS');
    }
  };

  // Alert Acknowledgement
  const handleAcknowledgeAlert = async (alertId: string) => {
    await acknowledgeAlert(alertId, currentUserRole, `Duty ${currentUserRole}`);
    if (overview) {
      setOverview((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          alerts: prev.alerts.map((a) =>
            a.alert_id === alertId ? { ...a, status: 'ACKNOWLEDGED' } : a
          ),
        };
      });
    }
  };

  // Human-in-the-Loop Recommendation Approval
  const handleApproveRecommendation = async (recommendationId: string, comments: string) => {
    const res = await approveRecommendation(recommendationId, currentUserRole, `Duty ${currentUserRole}`, comments);
    if (res.success && overview) {
      setOverview((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          recommendations: prev.recommendations.map((r) =>
            r.recommendation_id === recommendationId ? { ...r, status: 'APPROVED' } : r
          ),
          events: [
            {
              event_id: `EVT-${Date.now().toString().slice(-4)}`,
              timestamp: new Date().toISOString(),
              time_display: new Date().toISOString().substring(11, 16) + ' UTC',
              category: 'HUMAN_APPROVAL',
              severity: 'INFO',
              title: `Route Diversion Approved (${currentUserRole})`,
              description: `Alternate Route B dispatched for ${selectedVessel?.name || 'vessel'}.`,
              entity: selectedVessel?.name || 'Vessel Fleet',
              source: 'Command Center HITL Gateway',
            },
            ...prev.events,
          ],
        };
      });
    }
  };

  // Demo Scenario Trigger
  const handleSelectDemoScenario = async (scenarioId: string) => {
    const res = await triggerDemoScenario(scenarioId);
    if (res.overview) {
      setOverview(res.overview);
      if (res.overview.vessels && res.overview.vessels.length > 0) {
        const polarStar = res.overview.vessels.find((v: Vessel) => v.id === 'VESSEL_POLAR_STAR') || res.overview.vessels[0];
        setSelectedVessel(polarStar);
        setSelectedStation(null);
        setSelectedEntityId(polarStar.id);
        setSelectedEntityType('VESSEL');
      }
    }
  };

  // KPI Card Filter Focus
  const handleKpiCardClick = (key: string) => {
    setKpiFilter((prev) => (prev === key ? null : key));
    if (key === 'DELAYS' && overview) {
      const delayed = overview.vessels.find((v) => v.expected_delay_hours > 2);
      if (delayed) handleSelectVessel(delayed);
    } else if (key === 'HEALTH') {
      setActiveBottomTab('HEALTH');
    } else if (key === 'INCIDENTS') {
      setActiveBottomTab('ALERTS');
    }
  };

  if (loading && !overview) {
    return (
      <div className="h-screen w-screen bg-white dark:bg-[#020617] flex flex-col items-center justify-center text-slate-200 select-none">
        <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mb-4 animate-bounce">
          <span className="w-4 h-4 rounded-full bg-blue-500 animate-ping"></span>
        </div>
        <div className="font-extrabold text-xl tracking-wider text-slate-100 font-mono">
          POLAR<span className="text-blue-500">ONE</span> OPS COMMAND
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
          Synchronizing Antarctic GIS overlays, AIS fleet telemetry, and ML prediction engines...
        </p>
      </div>
    );
  }

  if (error || !overview) {
    return (
      <div className="h-screen w-screen bg-white dark:bg-[#020617] flex flex-col items-center justify-center text-slate-200 select-none p-6">
        <div className="text-red-400 font-mono font-bold text-lg mb-2">OPERATIONAL TELEMETRY SYNC ERROR</div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md text-center mb-4">{error || 'Unknown Error'}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
        >
          Re-establish Comms Link
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-white dark:bg-[#020617] flex flex-col overflow-hidden text-slate-200 selection:bg-blue-500/30">
      {/* 1. Global Navigation & Command Header */}
      <CommandHeader
        currentRole={currentUserRole}
        onRoleChange={setCurrentUserRole}
        activeScenarioName={overview.scenario_name || 'Normal Operations'}
        onOpenDemoModal={() => setDemoModalOpen(true)}
        alerts={overview.alerts}
        onSelectEntity={handleSelectEntity}
        onSearchSelect={handleSearchSelect}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        searchResults={searchResults}
        networkState={networkState}
        timeHorizon={timeHorizon}
      />

      {/* 2. Secondary Command Center Toolbar */}
      <CommandToolbar
        timeHorizon={timeHorizon}
        onTimeHorizonChange={setTimeHorizon}
        selectedRegion={selectedRegion}
        onRegionChange={setSelectedRegion}
        layers={layers}
        onToggleLayer={handleToggleLayer}
        onResetView={() => {
          setSelectedRegion('All Antarctica');
        }}
      />

      {/* 3. Actionable Command-Level KPI Strip (Reacts to Predictive Time Horizon) */}
      <KPIGrid
        kpis={projectedKpis || overview.kpis}
        onCardClick={handleKpiCardClick}
        activeFilter={kpiFilter}
      />

      {/* 4. Central Workspace: Antarctic Operations Map & Selected Entity Drawer */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Antarctic Map (60% to 70% of Workspace) */}
        <div className="flex-1 h-full relative overflow-hidden">
          <OperationsMap
            vessels={projectedVessels}
            stations={overview.stations}
            weather={overview.weather}
            seaIce={overview.sea_ice}
            satellites={overview.satellites.active_footprints}
            routes={overview.routes}
            layers={layers}
            selectedEntityId={selectedEntityId}
            selectedEntityType={selectedEntityType}
            onSelectVessel={handleSelectVessel}
            onSelectStation={handleSelectStation}
            selectedRegion={selectedRegion}
            onRegionChange={setSelectedRegion}
            timeHorizon={timeHorizon}
            onTimeHorizonChange={setTimeHorizon}
          />
        </div>

        {/* Selected Vessel Drawer (Right Slide-Over, synchronized with time projection) */}
        {activeVesselForDrawer && (
          <VesselDrawer
            vessel={activeVesselForDrawer}
            onClose={() => {
              setSelectedVessel(null);
              setSelectedEntityId(null);
              setSelectedEntityType(null);
            }}
            onOpenExplainability={() => setExplainabilityModalOpen(true)}
            onOpenApproval={() => setApprovalModalOpen(true)}
            currentUserRole={currentUserRole}
          />
        )}

        {/* Selected Station Drawer (Right Slide-Over) */}
        {selectedStation && (
          <StationDrawer
            station={selectedStation}
            onClose={() => {
              setSelectedStation(null);
              setSelectedEntityId(null);
              setSelectedEntityType(null);
            }}
          />
        )}
      </div>

      {/* 5. Bottom Operational Dock: Events | Predictions | Alerts | Data Health | Copilot */}
      <BottomDock
        events={overview.events}
        predictions={overview.predictions}
        alerts={overview.alerts}
        dataHealth={overview.data_health}
        onAcknowledgeAlert={handleAcknowledgeAlert}
        onSelectEntity={handleSelectEntity}
        onAskCopilot={queryCopilot}
        currentUserRole={currentUserRole}
        activeTab={activeBottomTab}
        onTabChange={setActiveBottomTab}
      />

      {/* 6. AI Explainability Modal */}
      {explainabilityModalOpen && selectedVessel && (
        <ExplainabilityModal
          vessel={selectedVessel}
          onClose={() => setExplainabilityModalOpen(false)}
        />
      )}

      {/* 7. Human-in-the-Loop Operational Approval Dialog */}
      {approvalModalOpen && selectedVessel && (
        <ApprovalDialog
          vessel={selectedVessel}
          onClose={() => setApprovalModalOpen(false)}
          onApprove={handleApproveRecommendation}
          currentUserRole={currentUserRole}
        />
      )}

      {/* 8. Demo Scenario Switcher Modal */}
      <DemoScenarioModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        activeScenarioId={overview.active_scenario || 'SCENARIO_2_VESSEL_DELAY'}
        onSelectScenario={handleSelectDemoScenario}
      />
    </div>
  );
}
