"use client"

import React, { useState } from 'react'
import { 
  Layers, 
  Sliders, 
  Split, 
  ZoomIn, 
  ZoomOut, 
  Move, 
  Ruler, 
  Crosshair, 
  RefreshCw, 
  Download,
  Eye,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'

export function EarthObservationWorkspace() {
  const [activeLayer, setActiveLayer] = useState<'optical' | 'sar' | 'false_color' | 'ndvi' | 'sea_ice' | 'risk_class'>('sar');
  const [comparisonMode, setComparisonMode] = useState<'SWIPE' | 'SIDE_BY_SIDE' | 'OVERLAY'>('SWIPE');
  const [opacity, setOpacity] = useState<number>(75);
  const [swipePosition, setSwipePosition] = useState<number>(50); // 0 to 100%
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [measureMode, setMeasureMode] = useState<boolean>(false);
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lon: number }>({ lat: -68.572, lon: 77.964 });
  const [measuredDistance, setMeasuredDistance] = useState<string>("14.2 nm (26.3 km)");

  // Simulated spectral band layers
  const layers = [
    { id: 'optical', label: 'Sentinel-2 L2A (True Color RGB)', type: 'Optical', res: '10m', description: 'Red, Green, Blue natural reflectance (B04, B03, B02)' },
    { id: 'sar', label: 'Sentinel-1 C-SAR (Calibrated VV/VH)', type: 'SAR Radar', res: '10m', description: 'Speckle-filtered backscatter penetrating cloud & polar night' },
    { id: 'false_color', label: 'Infrared / False Color Ice (NIR/SWIR)', type: 'Multispectral', res: '20m', description: 'Differentiates snow vs blue ice vs open meltwater (B08, B11, B04)' },
    { id: 'ndvi', label: 'NDSI / Snow & Albedo Index', type: 'Environmental', res: '20m', description: 'Normalized Difference Snow Index for ice pack albedo degradation' },
    { id: 'sea_ice', label: 'Classified Sea-Ice Polygons', type: 'Derived Vector', res: '10m', description: 'ML-classified Fast Ice, Heavy Pack, Nilas, and Open Lead contours' },
    { id: 'risk_class', label: 'ML Operational Route Risk Heatmap', type: 'Risk Engine', res: '25m', description: 'Continuous danger surface based on ridge keel depth & compression' }
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const pctX = x / rect.width;
    const pctY = y / rect.height;

    // Approximate mapping to Prydz Bay coords
    const lon = 75.0 + pctX * 4.5;
    const lat = -67.0 - pctY * 2.2;
    setCursorCoords({ lat: parseFloat(lat.toFixed(4)), lon: parseFloat(lon.toFixed(4)) });
  };

  return (
    <div className="bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col gap-4">
      {/* Header & Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-cyan-500/10 rounded-md border border-cyan-500/20 text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Earth Observation Analysis Workspace</h2>
            <span className="text-xs font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full">
              INTERACTIVE COMPARISON
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Compare Optical vs SAR backscatter, false-color ice classification, and ML risk heatmaps with swipe & opacity blending.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Comparison Mode */}
          <div className="bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1 flex items-center gap-1">
            {(['SWIPE', 'SIDE_BY_SIDE', 'OVERLAY'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setComparisonMode(mode)}
                className={`px-2.5 py-1 rounded text-xs font-semibold uppercase transition ${
                  comparisonMode === mode ? 'bg-blue-600 text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Measurement Tool Toggle */}
          <button
            onClick={() => setMeasureMode(!measureMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
              measureMode 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]' 
                : 'bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>Measure Tool</span>
          </button>

          {/* Zoom Controls */}
          <div className="flex items-center bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1 text-slate-700 dark:text-slate-300">
            <button 
              onClick={() => setZoomLevel(prev => Math.max(50, prev - 25))} 
              className="p-1 hover:text-slate-900 dark:text-white hover:bg-slate-800 rounded"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-2 text-xs font-mono">{zoomLevel}%</span>
            <button 
              onClick={() => setZoomLevel(prev => Math.min(250, prev + 25))} 
              className="p-1 hover:text-slate-900 dark:text-white hover:bg-slate-800 rounded"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Layer Selectors Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
        {layers.map(layer => {
          const isSelected = activeLayer === layer.id;
          return (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id as any)}
              className={`px-3 py-2 rounded-lg border text-left shrink-0 transition-all ${
                isSelected
                  ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.2)] ring-1 ring-blue-500/30'
                  : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between gap-2">
                <span>{layer.label}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-500 dark:text-slate-400">{layer.res}</span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[220px]">{layer.description}</div>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Canvas Area */}
      <div 
        onMouseMove={handleMouseMove}
        className="relative w-full h-[520px] bg-[#020617] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden select-none"
      >
        {/* Synthetic High-Resolution Canvas Emulating SAR / Optical imagery */}
        <div 
          className="absolute inset-0 flex items-center justify-center transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel / 100})` }}
        >
          {/* Base Layer: SAR Radar (Texture Grid) */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-[#031525] flex items-center justify-center">
            {/* Visual simulation of Antarctic ice pack radar backscatter */}
            <div className="w-full h-full opacity-60 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            {/* Ice Ridges SVG Visualization */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-80" viewBox="0 0 1000 600" preserveAspectRatio="none">
              {/* Pack ice boundaries */}
              <path d="M 120 80 Q 300 150 480 90 T 820 180 T 960 320" fill="none" stroke="#06b6d4" strokeWidth="3" strokeDasharray="6 3" />
              <path d="M 80 280 Q 250 320 440 290 T 780 410 T 920 540" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
              {/* Heavy compressive ridge (High Risk) */}
              <polygon points="420,180 580,210 640,320 510,340 380,240" fill="#ef4444" fillOpacity="0.25" stroke="#ef4444" strokeWidth="2" />
              {/* Open lead fairway (Safe Passage) */}
              <polygon points="620,140 760,180 840,300 780,380 690,260" fill="#10b981" fillOpacity="0.22" stroke="#10b981" strokeWidth="2" strokeDasharray="4 2" />
              
              {/* Polar Star Vessel Position Marker */}
              <circle cx="480" cy="260" r="8" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
              <text x="495" y="265" fill="#ffffff" fontSize="13" fontWeight="bold" fontFamily="monospace">USCGC Polar Star (6.2kt)</text>
              <line x1="480" y1="260" x2="710" y2="240" stroke="#10b981" strokeWidth="2.5" strokeDasharray="5 3" />
              <text x="560" y="235" fill="#10b981" fontSize="11" fontWeight="bold">Recommended Lead Diversion (Sector 4)</text>
            </svg>
          </div>

          {/* Swipe Comparison Overlay */}
          {comparisonMode === 'SWIPE' && (
            <div 
              className="absolute inset-0 overflow-hidden border-r-2 border-cyan-400 pointer-events-none shadow-[0_0_20px_rgba(6,182,212,0.5)]"
              style={{ width: `${swipePosition}%` }}
            >
              {/* Optical True Color Layer Simulation */}
              <div className="absolute inset-0 w-[1000px] h-[600px] bg-gradient-to-br from-blue-950/90 via-slate-900/90 to-cyan-950/90">
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
                <div className="p-4 text-xs font-mono text-cyan-300 font-bold bg-white dark:bg-slate-900/80 rounded inline-block m-4 border border-cyan-500/30">
                  BEFORE: Sentinel-2 Optical (Cloud Mask: 18%)
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Swipe Handle Controller */}
        {comparisonMode === 'SWIPE' && (
          <div 
            className="absolute top-0 bottom-0 w-1 bg-cyan-400 z-10 flex items-center justify-center cursor-ew-resize"
            style={{ left: `${swipePosition}%` }}
          >
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={swipePosition}
              onChange={(e) => setSwipePosition(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
            />
            <div className="w-7 h-7 rounded-full bg-cyan-500 text-slate-950 font-bold flex items-center justify-center shadow-lg border border-white text-xs">
              <Split className="w-3.5 h-3.5" />
            </div>
          </div>
        )}

        {/* Crosshair & Measurement Readout */}
        <div className="absolute bottom-4 left-4 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-lg p-2.5 text-xs font-mono text-slate-700 dark:text-slate-300 flex items-center gap-4 z-20 shadow-xl">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Crosshair className="w-4 h-4" />
            <span>LAT: {cursorCoords.lat}°S | LON: {cursorCoords.lon}°E</span>
          </div>
          {measureMode && (
            <div className="flex items-center gap-1 text-amber-400 border-l border-slate-700 pl-3">
              <Ruler className="w-3.5 h-3.5" />
              <span>Distance to Lead: {measuredDistance}</span>
            </div>
          )}
        </div>

        {/* Opacity Controller Slider */}
        <div className="absolute top-4 right-4 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-lg p-3 text-xs z-20 shadow-xl flex items-center gap-3">
          <Sliders className="w-4 h-4 text-blue-400" />
          <span className="font-mono text-slate-700 dark:text-slate-300">Layer Opacity:</span>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            className="w-24 accent-blue-500 cursor-pointer"
          />
          <span className="font-mono text-slate-900 dark:text-white font-bold w-8 text-right">{opacity}%</span>
        </div>
      </div>

      {/* Analysis Legend & Intelligence Insight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3 rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span>Compressive Ridge Zone</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400">Keel thickness 2.1m exceeds continuous icebreaker threshold. High probability of vessel besetting.</p>
        </div>

        <div className="p-3 rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Navigable Polyna Lead (Sector 4)</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400">Thermal IR and SAR verify open brine water (width: 420m). Recommended diversion corridor.</p>
        </div>

        <div className="p-3 rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <span>Fast Ice Margin</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400">Anchor fast ice attached to Larsemann Hills shoreline. High shear friction.</p>
        </div>
      </div>
    </div>
  );
}
