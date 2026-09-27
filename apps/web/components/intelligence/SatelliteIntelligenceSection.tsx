"use client"

import React, { useState } from 'react'
import { SatelliteScene, SatelliteProvider, PipelineStage } from '@/types/intelligence'
import { 
  Satellite, 
  Layers, 
  Map as MapIcon, 
  Clock, 
  Eye, 
  Play, 
  ExternalLink, 
  CheckCircle, 
  AlertTriangle,
  Server,
  Cloud,
  ChevronRight,
  Filter
} from 'lucide-react'
import { GeospatialPipelineViewer } from './GeospatialPipelineViewer'
import { SatelliteCoveragePlanner } from './SatelliteCoveragePlanner'

interface SatelliteIntelligenceSectionProps {
  scenes: SatelliteScene[];
  providers?: SatelliteProvider[];
  pipelineStages?: PipelineStage[];
  coveragePasses?: any[];
  onOpenSceneModal?: (scene: SatelliteScene) => void;
  onOpenMap?: (scene: SatelliteScene) => void;
  onRunAnalysis?: (sceneId: string) => void;
}

export function SatelliteIntelligenceSection({
  scenes,
  providers = [],
  pipelineStages = [],
  coveragePasses = [],
  onOpenSceneModal,
  onOpenMap,
  onRunAnalysis
}: SatelliteIntelligenceSectionProps) {
  const [filterFamily, setFilterFamily] = useState<string>('ALL');

  const filteredScenes = scenes.filter(s => {
    if (filterFamily === 'ALL') return true;
    return s.family === filterFamily;
  });

  return (
    <div className="space-y-6">
      {/* Heading & Live Status (Preserving Original Element 1) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-500/10 rounded-md border border-blue-500/20 text-blue-400">
              <Satellite className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Satellite Intelligence</h1>
            <span className="text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
              LIVE STAC PROVIDERS
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            SAR & Optical Earth Observation Data across Sentinel-1, Sentinel-2, Landsat, MODIS, and ICEYE constellations.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-lg">
          {['ALL', 'SAR', 'Optical', 'Meteorological'].map(fam => (
            <button
              key={fam}
              onClick={() => setFilterFamily(fam)}
              className={`px-3 py-1 rounded text-xs font-semibold uppercase transition ${
                filterFamily === fam ? 'bg-blue-600 text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:text-white'
              }`}
            >
              {fam}
            </button>
          ))}
        </div>
      </div>

      {/* Geospatial Processing Pipeline (Preserving & Upgrading Original Element 4) */}
      {pipelineStages.length > 0 && (
        <GeospatialPipelineViewer stages={pipelineStages} />
      )}

      {/* Recent Acquisitions Section (Preserving & Upgrading Original Element 2 & 3) */}
      <div className="bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Satellite className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Recent Acquisitions</h2>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">({filteredScenes.length} scenes available)</span>
          </div>

          <div className="text-xs font-mono text-cyan-400 font-semibold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Latest: 18 min ago</span>
          </div>
        </div>

        {/* Scene Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredScenes.map((scene) => (
            <div
              key={scene.id}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-blue-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all flex flex-col justify-between shadow-lg"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                      {scene.provider}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">{scene.satellite}</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {scene.processing_status}
                  </span>
                </div>

                <div className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate mb-3" title={scene.scene_id}>
                  ID: <span className="text-slate-700 dark:text-slate-300">{scene.scene_id}</span>
                </div>

                {/* Core Parameters Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono p-3 rounded-lg bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 mb-3">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">PRODUCT</span>
                    <span className="text-slate-900 dark:text-white font-bold">{scene.product_type}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">RESOLUTION</span>
                    <span className="text-cyan-400 font-bold">{scene.resolution}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">CLOUD COVER</span>
                    <span className="text-slate-900 dark:text-white font-bold">{scene.cloud_cover}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">AI ANALYSIS</span>
                    <span className="text-purple-400 font-bold">{scene.ai_analysis_status}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  AOI: <strong className="text-slate-900 dark:text-white font-sans">{scene.aoi}</strong>
                </div>

                {/* Features Pill */}
                {scene.features_extracted && (
                  <div className="flex flex-wrap gap-1 my-2">
                    {scene.features_extracted.slice(0, 3).map((f, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded text-[10px] bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                        {f}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons: VIEW SCENE, OPEN MAP, RUN ANALYSIS, VIEW METADATA */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 mt-2 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onOpenSceneModal && onOpenSceneModal(scene)}
                    className="w-full bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 rounded-lg py-1.5 text-xs font-bold transition flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>VIEW SCENE</span>
                  </button>
                  <button
                    onClick={() => onOpenMap && onOpenMap(scene)}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg py-1.5 text-xs font-bold transition flex items-center justify-center gap-1"
                  >
                    <MapIcon className="w-3.5 h-3.5" />
                    <span>OPEN MAP</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onRunAnalysis && onRunAnalysis(scene.scene_id)}
                    className="w-full bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 rounded-lg py-1.5 text-xs font-bold transition flex items-center justify-center gap-1"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>RUN ANALYSIS</span>
                  </button>
                  <button
                    onClick={() => onOpenSceneModal && onOpenSceneModal(scene)}
                    className="w-full bg-slate-950 hover:bg-slate-850 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 rounded-lg py-1.5 text-xs font-semibold transition flex items-center justify-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>METADATA</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 font-mono">
                  <span>Freshness: {scene.data_freshness}</span>
                  <span className="text-emerald-400 font-bold">{scene.download_status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Satellite Coverage Planner (Section 31) */}
      {coveragePasses.length > 0 && (
        <SatelliteCoveragePlanner passes={coveragePasses} />
      )}
    </div>
  );
}
