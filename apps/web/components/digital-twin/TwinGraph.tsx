"use client";

import React, { useMemo, useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  Node,
  Edge,
  ConnectionLineType,
  BackgroundVariant,
  useNodesState,
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';

import { CustomTwinNode } from './CustomTwinNode';
import { DigitalTwinEdge } from '@/types/digital-twin';

const nodeTypes = {
  twinNode: CustomTwinNode
};

interface TwinGraphProps {
  initialNodes: Node[];
  initialEdges: DigitalTwinEdge[];
  selectedNodeId: string | null;
  onSelectNode: (id: string | null) => void;
  filterCategory: string;
  filterSeverity: string;
  searchQuery: string;
}

export function TwinGraph({
  initialNodes,
  initialEdges,
  selectedNodeId,
  onSelectNode,
  filterCategory,
  filterSeverity,
  searchQuery
}: TwinGraphProps) {
  // Apply filtering and visual highlighting
  const filteredNodes = useMemo(() => {
    return initialNodes.map((n) => {
      const cat = n.data?.category?.toUpperCase();
      const status = n.data?.status?.toUpperCase();
      const label = (n.data?.label || '').toLowerCase();
      const query = searchQuery.toLowerCase();

      const matchesCat = filterCategory === 'ALL' || cat === filterCategory;
      const matchesSev = filterSeverity === 'ALL' || status === filterSeverity;
      const matchesSearch = !query || label.includes(query) || (n.data?.data_source || '').toLowerCase().includes(query);

      const isVisible = matchesCat && matchesSev && matchesSearch;
      const isSelected = n.id === selectedNodeId;

      return {
        ...n,
        selected: isSelected,
        style: {
          opacity: isVisible ? 1 : 0.22,
          filter: isVisible ? 'none' : 'grayscale(80%)',
          transition: 'opacity 0.2s ease, filter 0.2s ease'
        },
        data: {
          ...n.data,
          isSelected
        }
      };
    });
  }, [initialNodes, filterCategory, filterSeverity, searchQuery, selectedNodeId]);

  // Highlight connected edges if a node is selected
  const styledEdges = useMemo<Edge[]>(() => {
    return initialEdges.map((e) => {
      const isDirectlyConnected = selectedNodeId && (e.source === selectedNodeId || e.target === selectedNodeId);
      const isCritical = e.status === 'CRITICAL' || e.status === 'THREATENED';
      const isDelayed = e.status === 'DELAYED';

      let strokeColor = '#3b82f6'; // default blue
      if (isCritical) strokeColor = '#ef4444'; // red
      else if (isDelayed) strokeColor = '#f59e0b'; // amber

      if (selectedNodeId) {
        if (isDirectlyConnected) {
          strokeColor = '#06b6d4'; // bright cyan highlight
        } else {
          strokeColor = '#334155'; // dimmed slate
        }
      }

      return {
        id: e.id,
        source: e.source,
        target: e.target,
        type: 'smoothstep',
        animated: isCritical || isDelayed || Boolean(selectedNodeId && isDirectlyConnected),
        label: e.label || e.relation,
        labelStyle: {
          fill: isDirectlyConnected ? '#38bdf8' : isCritical ? '#f87171' : '#94a3b8',
          fontFamily: 'monospace',
          fontSize: 9,
          fontWeight: 600
        },
        labelBgStyle: {
          fill: '#020617',
          fillOpacity: 0.85,
          stroke: isDirectlyConnected ? '#0ea5e9' : '#1e293b',
          strokeWidth: 1,
          rx: 4,
          ry: 4
        },
        style: {
          stroke: strokeColor,
          strokeWidth: isDirectlyConnected ? 2.5 : isCritical ? 2.0 : 1.4,
          opacity: selectedNodeId ? (isDirectlyConnected ? 1 : 0.2) : 0.85
        }
      };
    });
  }, [initialEdges, selectedNodeId]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      onSelectNode(node.id === selectedNodeId ? null : node.id);
    },
    [onSelectNode, selectedNodeId]
  );

  const onPaneClick = useCallback(() => {
    onSelectNode(null);
  }, [onSelectNode]);

  return (
    <div className="w-full h-full relative bg-slate-950 overflow-hidden select-none">
      <ReactFlow
        nodes={filteredNodes}
        edges={styledEdges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView
        fitViewOptions={{ padding: 0.18 }}
        minZoom={0.25}
        maxZoom={1.8}
        connectionLineType={ConnectionLineType.SmoothStep}
        attributionPosition="bottom-right"
        className="touch-none"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.2}
          color="#1e293b"
          className="bg-[#020617]"
        />

        <Controls
          className="!bg-white dark:bg-slate-900/90 !border !border-slate-200 dark:border-slate-800 !rounded-lg !shadow-2xl overflow-hidden [&>button]:!bg-slate-900 [&>button]:!border-b [&>button]:!border-slate-200 dark:border-slate-800 [&>button]:!text-slate-700 dark:text-slate-300 hover:[&>button]:!bg-slate-800"
        />

        <MiniMap
          nodeColor={(n) => {
            const status = (n.data as any)?.status;
            if (status === 'CRITICAL') return '#ef4444';
            if (status === 'WARNING') return '#f59e0b';
            return '#3b82f6';
          }}
          nodeStrokeWidth={2}
          maskColor="rgba(2, 6, 23, 0.75)"
          className="!bg-slate-950 !border !border-slate-200 dark:border-slate-800/80 !rounded-lg overflow-hidden shadow-2xl"
          zoomable
          pannable
        />
      </ReactFlow>

      {/* Canvas Watermark / Quick Stats Overlay */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-none flex items-center gap-3 text-[11px] font-mono text-slate-500 bg-slate-950/80 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-800/70 backdrop-blur-sm">
        <span>ANTARCTIC KNOWLEDGE GRAPH v2.4</span>
        <span>•</span>
        <span>23 NODES / 26 DIRECTED EDGES</span>
        <span>•</span>
        <span className="text-cyan-400">REACT FLOW HIGH-DENSITY ENGINE</span>
      </div>
    </div>
  );
}
