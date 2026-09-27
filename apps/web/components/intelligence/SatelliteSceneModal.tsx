"use client"

import React from 'react'
import { SatelliteScene } from '@/types/intelligence'
import { 
  X, 
  Satellite, 
  Calendar, 
  Clock, 
  Layers, 
  Eye, 
  Activity, 
  ShieldAlert, 
  Download, 
  ExternalLink,
  MapPin,
  Play
} from 'lucide-react'

interface SatelliteSceneModalProps {
  scene: SatelliteScene | null;
  onClose: () => void;
  onRunAnalysis?: (sceneId: string) => void;
  onOpenMap?: (scene: SatelliteScene) => void;
}

export function SatelliteSceneModal({
  scene,
  onClose,
  onRunAnalysis,
  onOpenMap
}: SatelliteSceneModalProps) {
  if (!scene) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header (Section 27) */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-white dark:bg-slate-900/80">
          <div>
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg border text-slate-900 dark:text-white ${
                scene.family === 'SAR' ? 'bg-blue-600/80 border-blue-400' : 'bg-emerald-600/80 border-emerald-400'
              }`}>
                <Satellite className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{scene.satellite}</h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {scene.family}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {scene.processing_status}
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  Sensor: <span className="text-cyan-400">{scene.sensor}</span> | Scene ID: <span className="text-slate-700 dark:text-slate-300">{scene.scene_id}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right text-xs font-mono text-slate-500 dark:text-slate-400 hidden sm:block">
              <div>Acquired: <strong className="text-slate-900 dark:text-white">{scene.data_freshness}</strong></div>
              <div className="text-[10px] text-slate-500">{new Date(scene.acquisition_time).toUTCString()}</div>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Left Imagery + Right Metadata */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Area: Imagery / Visualization */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative w-full h-[340px] bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center">
              {/* Synthetic Visual Preview of Antarctic scene */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 opacity-90"></div>
              <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>
              
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-80" viewBox="0 0 600 340">
                <polygon points="120,60 320,110 440,240 280,290 140,180" fill="#06b6d4" fillOpacity="0.25" stroke="#06b6d4" strokeWidth="2" />
                <polygon points="260,130 380,160 480,260 340,280" fill="#ef4444" fillOpacity="0.3" stroke="#ef4444" strokeWidth="2" />
                <circle cx="340" cy="220" r="6" fill="#ffffff" />
                <text x="355" y="225" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="monospace">Fairway Intersect</text>
              </svg>

              <div className="absolute top-3 left-3 bg-white dark:bg-slate-900/90 border border-slate-700 px-3 py-1 rounded text-xs font-mono text-cyan-300">
                EPSG:3031 Polar Stereographic View
              </div>

              <div className="absolute bottom-3 left-3 bg-white dark:bg-slate-900/90 border border-slate-700 px-3 py-1 rounded text-xs font-mono text-slate-700 dark:text-slate-300">
                BBOX: [{scene.bbox.join(', ')}]
              </div>
            </div>

            {/* Action Buttons (Section 6) */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button 
                onClick={() => onOpenMap && onOpenMap(scene)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>OPEN MAP</span>
              </button>
              <button 
                onClick={() => onRunAnalysis && onRunAnalysis(scene.scene_id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow"
              >
                <Play className="w-3.5 h-3.5" />
                <span>RUN ANALYSIS</span>
              </button>
              <button 
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>VIEW SCENE</span>
              </button>
              <button 
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>VIEW METADATA</span>
              </button>
            </div>
          </div>

          {/* Right Panel: Metadata & Acquisition Parameters (Section 27) */}
          <div className="bg-white dark:bg-slate-900/90 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-4 text-xs font-mono">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <span>Scene Acquisition Parameters</span>
            </h4>

            <div className="space-y-2 text-slate-700 dark:text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800/80">
                <span className="text-slate-500">Provider:</span>
                <span className="text-slate-900 dark:text-white font-bold">{scene.provider}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800/80">
                <span className="text-slate-500">AOI:</span>
                <span className="text-slate-900 dark:text-white text-right max-w-[150px] truncate">{scene.aoi}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800/80">
                <span className="text-slate-500">Resolution:</span>
                <span className="text-cyan-400 font-bold">{scene.resolution}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800/80">
                <span className="text-slate-500">Cloud Cover:</span>
                <span className="text-slate-900 dark:text-white">{scene.cloud_cover}%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800/80">
                <span className="text-slate-500">Coverage Area:</span>
                <span className="text-slate-900 dark:text-white">{scene.coverage_percentage}%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800/80">
                <span className="text-slate-500">Download Sync:</span>
                <span className="text-emerald-400">{scene.download_status}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800/80">
                <span className="text-slate-500">AI Analysis:</span>
                <span className="text-purple-400 font-bold">{scene.ai_analysis_status}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800/80">
                <span className="text-slate-500">Incidence Angle:</span>
                <span className="text-slate-900 dark:text-white">38.4° (Mid-swath)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800/80">
                <span className="text-slate-500">Orbit Pass:</span>
                <span className="text-slate-900 dark:text-white">Descending (#142)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Detected Features & AI Risk Assessment (Section 27) */}
        <div className="p-6 pt-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-2">
              DETECTED GEOSPATIAL FEATURES (RASTER PROCESSING)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(scene.features_extracted || ['Pack Ice Ridge', 'Open Lead Sector 4', 'Fast Ice Boundary']).map((f, i) => (
                <span key={i} className="px-2 py-1 bg-slate-900 border border-slate-700 text-slate-200 rounded font-mono text-[11px]">
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block mb-1">
              AI RISK ASSESSMENT & ROUTE ADVISORY
            </span>
            <div className="text-slate-700 dark:text-slate-300 text-xs leading-snug">
              {scene.recommendation_summary || 'Compressive pack convergence detected. Advise route deviation into open lead.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
