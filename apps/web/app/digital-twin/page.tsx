"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Node } from 'reactflow';
import {
  Sparkles,
  RotateCcw,
  Flame,
  Radio,
  Clock,
  Layers,
  Activity,
  AlertTriangle,
  Play,
  X
} from 'lucide-react';

import {
  DigitalTwinOverview,
  GraphPayload,
  DigitalTwinEdge,
  CascadingImpact,
  WhatIfSimulationResult
} from '@/types/digital-twin';
import { digitalTwinApi } from '@/lib/api/digital-twin';

import { DigitalTwinHeader } from '@/components/digital-twin/DigitalTwinHeader';
import { DigitalTwinKpis } from '@/components/digital-twin/DigitalTwinKpis';
import { DigitalTwinFilters } from '@/components/digital-twin/DigitalTwinFilters';
import { TwinGraph } from '@/components/digital-twin/TwinGraph';
import { NodeDetailsPanel } from '@/components/digital-twin/NodeDetailsPanel';
import { CascadingImpactPanel } from '@/components/digital-twin/CascadingImpactPanel';
import { WhatIfSimulationModal } from '@/components/digital-twin/WhatIfSimulationModal';
import { QueryAssistantModal } from '@/components/digital-twin/QueryAssistantModal';
import { SatelliteEnvPanel } from '@/components/digital-twin/SatelliteEnvPanel';
import { DataHealthModal } from '@/components/digital-twin/DataHealthModal';
import { EventTimelineModal } from '@/components/digital-twin/EventTimelineModal';

export default function DigitalTwinPage() {
  // Main Data States
  const [overview, setOverview] = useState<DigitalTwinOverview | null>(null);
  const [graphData, setGraphData] = useState<GraphPayload | null>(null);
  const [cascades, setCascades] = useState<CascadingImpact[]>([]);
  const [loading, setLoading] = useState(true);

  // Selection & Filtering States
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');

  // Simulation & Modal States
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [activeSimulation, setActiveSimulation] = useState<WhatIfSimulationResult | null>(null);
  const [simulationTriggerNode, setSimulationTriggerNode] = useState<string>('generator_failure');

  const [isSimModalOpen, setIsSimModalOpen] = useState(false);
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
  const [isSatelliteModalOpen, setIsSatelliteModalOpen] = useState(false);
  const [isDataHealthModalOpen, setIsDataHealthModalOpen] = useState(false);
  const [isEventsModalOpen, setIsEventsModalOpen] = useState(false);
  const [isCascadesOpen, setIsCascadesOpen] = useState(false);

  // Initial Fetch
  const loadData = useCallback(async () => {
    try {
      const [ov, gr, cas] = await Promise.all([
        digitalTwinApi.getOverview(),
        digitalTwinApi.getGraph(),
        digitalTwinApi.getCascades()
      ]);
      setOverview(ov);
      setGraphData(gr);
      setCascades(cas);
    } catch (err) {
      console.error('Failed to load digital twin data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    // Background polling every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Compute node count by category for filter pills
  const nodeCountsByCategory = useMemo(() => {
    if (!graphData?.nodes) return { TOTAL: 0 };
    const counts: Record<string, number> = {
      TOTAL: graphData.nodes.length,
      ALL: graphData.nodes.length
    };
    graphData.nodes.forEach((n) => {
      const cat = n.data?.category?.toUpperCase() || 'OTHER';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [graphData]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedSeverity('ALL');
    setSelectedNodeId(null);
  };

  // Launch Simulation from Node Panel
  const handleSimulateNode = (nodeId: string, nodeName: string) => {
    if (nodeId.includes('gen_2')) {
      setSimulationTriggerNode('generator_failure');
    } else if (nodeId.includes('polar_star')) {
      setSimulationTriggerNode('ship_delay_36h');
    } else if (nodeId.includes('fuel_pump')) {
      setSimulationTriggerNode('fuel_shortage');
    } else {
      setSimulationTriggerNode('generator_failure');
    }
    setIsSimModalOpen(true);
  };

  // Apply Simulation Result to Graph Canvas
  const handleApplySimulation = (result: WhatIfSimulationResult) => {
    setIsSimulationMode(true);
    setActiveSimulation(result);

    // If result has an affected node, focus it
    if (result.scenario_key === 'generator_failure') {
      setSelectedNodeId('equipment_gen_2');
    } else if (result.scenario_key === 'ship_delay_36h') {
      setSelectedNodeId('ship_polar_star');
    } else if (result.scenario_key === 'fuel_shortage') {
      setSelectedNodeId('equipment_fuel_pump_3');
    }
  };

  // Exit Simulation Mode
  const handleExitSimulation = () => {
    setIsSimulationMode(false);
    setActiveSimulation(null);
  };

  if (loading && !graphData) {
    return (
      <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center text-slate-100 select-none">
        <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center animate-pulse mb-3">
          <Layers className="w-6 h-6 text-cyan-400" />
        </div>
        <div className="text-xs font-mono font-bold uppercase tracking-widest text-slate-300">
          Loading Operational Digital Twin...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 select-none font-sans transition-colors duration-150">
      {/* 1. Header Bar */}
      <DigitalTwinHeader
        isSimulationMode={isSimulationMode}
        onToggleMode={(sim) => {
          if (sim) {
            setIsSimModalOpen(true);
          } else {
            handleExitSimulation();
          }
        }}
        onOpenQueryModal={() => setIsQueryModalOpen(true)}
        onOpenSimModal={() => setIsSimModalOpen(true)}
        onOpenDataHealthModal={() => setIsDataHealthModalOpen(true)}
        onOpenSatelliteModal={() => setIsSatelliteModalOpen(true)}
        onOpenEventsModal={() => setIsEventsModalOpen(true)}
        syncSecondsAgo={overview?.kpis?.last_sync_seconds_ago ?? 42}
      />

      {/* 2. Interactive KPI Strip */}
      <DigitalTwinKpis
        overview={overview}
        selectedSeverity={selectedSeverity}
        onSelectSeverity={(sev) => setSelectedSeverity(sev)}
        onOpenCascades={() => setIsCascadesOpen((prev) => !prev)}
        onOpenDataHealth={() => setIsDataHealthModalOpen(true)}
      />

      {/* 3. Filter & Search Strip */}
      <DigitalTwinFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedSeverity={selectedSeverity}
        onSelectSeverity={setSelectedSeverity}
        onResetFilters={handleResetFilters}
        nodeCountsByCategory={nodeCountsByCategory}
      />

      {/* 4. Active Simulation Banner (if Sandbox Active) */}
      {isSimulationMode && activeSimulation && (
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-b border-amber-600/60 px-4 py-2 flex items-center justify-between text-xs font-mono text-amber-300 shrink-0 z-10 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span>
              <strong>SIMULATION SANDBOX ACTIVE:</strong> {activeSimulation.title} (Risk: {activeSimulation.risk_level}, Confidence: {activeSimulation.confidence_pct}%)
            </span>
          </div>
          <button
            onClick={handleExitSimulation}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-900/60 hover:bg-amber-800 text-amber-200 border border-amber-600/80 transition-colors font-bold"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Exit to Live Mode</span>
          </button>
        </div>
      )}

      {/* 5. Main Canvas Area with React Flow */}
      <div className="flex-1 relative overflow-hidden">
        {graphData && (
          <TwinGraph
            initialNodes={graphData.nodes as Node[]}
            initialEdges={graphData.edges}
            selectedNodeId={selectedNodeId}
            onSelectNode={(id) => setSelectedNodeId(id)}
            filterCategory={selectedCategory}
            filterSeverity={selectedSeverity}
            searchQuery={searchQuery}
          />
        )}

        {/* Selected Node Details Slide-Over Drawer */}
        <NodeDetailsPanel
          nodeId={selectedNodeId}
          onClose={() => setSelectedNodeId(null)}
          onSelectNode={(id) => setSelectedNodeId(id)}
          onSimulateNode={handleSimulateNode}
        />

        {/* Cascading Impact Panel (Collapsible floating panel) */}
        <CascadingImpactPanel
          cascades={cascades}
          isOpen={isCascadesOpen}
          onClose={() => setIsCascadesOpen(false)}
          onSelectNode={(id) => setSelectedNodeId(id)}
        />
      </div>

      {/* 6. Modals */}
      <WhatIfSimulationModal
        isOpen={isSimModalOpen}
        onClose={() => setIsSimModalOpen(false)}
        onApplySimulationToGraph={handleApplySimulation}
        initialScenarioKey={simulationTriggerNode}
      />

      <QueryAssistantModal
        isOpen={isQueryModalOpen}
        onClose={() => setIsQueryModalOpen(false)}
        onSelectNode={(id) => setSelectedNodeId(id)}
      />

      <SatelliteEnvPanel
        isOpen={isSatelliteModalOpen}
        onClose={() => setIsSatelliteModalOpen(false)}
      />

      <DataHealthModal
        isOpen={isDataHealthModalOpen}
        onClose={() => setIsDataHealthModalOpen(false)}
        overview={overview}
      />

      <EventTimelineModal
        isOpen={isEventsModalOpen}
        onClose={() => setIsEventsModalOpen(false)}
        onSelectNode={(id) => setSelectedNodeId(id)}
      />
    </div>
  );
}
