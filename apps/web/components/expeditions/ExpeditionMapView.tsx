"use client"

import React, { useState } from 'react';
import { Expedition } from '@/types/expedition';
import { 
  Layers, 
  Eye, 
  EyeOff, 
  Compass, 
  Ship, 
  Plane, 
  MapPin, 
  CloudSnow, 
  AlertTriangle, 
  Maximize2, 
  Minimize2, 
  Info 
} from 'lucide-react';
import Link from 'next/link';

interface ExpeditionMapViewProps {
  expeditions: Expedition[];
  selectedExpeditionId?: string;
  onSelectExpedition?: (exp: Expedition) => void;
}

export function ExpeditionMapView({
  expeditions,
  selectedExpeditionId,
  onSelectExpedition
}: ExpeditionMapViewProps) {
  // Layer toggles
  const [layers, setLayers] = useState({
    routes: true,
    assets: true,
    stations: true,
    ice: true,
    weather: true,
    satellite: true,
    riskZones: true
  });
  const [fullscreen, setFullscreen] = useState(false);
  const [hoveredEntity, setHoveredEntity] = useState<any>(null);

  // Key Antarctic research stations coordinates (projected into 800x800 polar map)
  // Antarctic projection center: South Pole (-90, 0)
  // Formula: R = (90 - abs(lat)) * 6.5
  // angle = lon * (Math.PI / 180)
  const project = (lat: number, lon: number) => {
    const cx = 400;
    const cy = 400;
    const r = (90 - Math.abs(lat)) * 14.5;
    const rad = ((lon - 90) * Math.PI) / 180;
    const x = cx + r * Math.cos(rad);
    const y = cy + r * Math.sin(rad);
    return { x, y };
  };

  const stations = [
    { name: "McMurdo Station (USA)", lat: -77.85, lon: 166.67, code: "MCM" },
    { name: "South Pole Station (USA)", lat: -90.00, lon: 0.00, code: "AMU" },
    { name: "Maitri Station (IND)", lat: -70.77, lon: 11.73, code: "MAI" },
    { name: "Casey Station (AUS)", lat: -66.28, lon: 110.53, code: "CSY" },
    { name: "Rothera Station (GBR)", lat: -67.57, lon: -68.13, code: "ROT" },
    { name: "Troll Station (NOR)", lat: -72.01, lon: 2.53, code: "TRL" },
    { name: "Davis Station (AUS)", lat: -68.58, lon: 77.97, code: "DAV" },
    { name: "Concordia Station (FRA/ITA)", lat: -75.10, lon: 123.33, code: "DOM" }
  ];

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className={`bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col ${
      fullscreen ? 'fixed inset-4 z-50' : 'h-[680px] w-full mb-6'
    }`}>
      {/* Top Map Toolbar */}
      <div className="bg-[#0b1329] border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            <Compass className="w-4 h-4 text-blue-400 animate-spin-slow" />
            ANTARCTIC MULTI-ASSET OPERATIONAL THEATER
          </div>
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 hidden sm:inline">
            Projection: Polar Stereographic (WGS84 EPSG:3031 Grounded)
          </span>
        </div>

        {/* Layer Toggles & Fullscreen */}
        <div className="flex items-center gap-1.5">
          <div className="hidden lg:flex items-center gap-1 bg-[#020617] border border-slate-200 dark:border-slate-800 p-0.5 rounded text-[11px]">
            <button
              onClick={() => toggleLayer('routes')}
              className={`px-2 py-1 rounded font-medium transition-colors ${layers.routes ? 'bg-blue-600/40 text-blue-300 border border-blue-500/40' : 'text-slate-500'}`}
            >
              Routes
            </button>
            <button
              onClick={() => toggleLayer('assets')}
              className={`px-2 py-1 rounded font-medium transition-colors ${layers.assets ? 'bg-cyan-600/40 text-cyan-300 border border-cyan-500/40' : 'text-slate-500'}`}
            >
              Assets
            </button>
            <button
              onClick={() => toggleLayer('ice')}
              className={`px-2 py-1 rounded font-medium transition-colors ${layers.ice ? 'bg-indigo-600/40 text-indigo-300 border border-indigo-500/40' : 'text-slate-500'}`}
            >
              Sea Ice
            </button>
            <button
              onClick={() => toggleLayer('weather')}
              className={`px-2 py-1 rounded font-medium transition-colors ${layers.weather ? 'bg-rose-600/40 text-rose-300 border border-rose-500/40' : 'text-slate-500'}`}
            >
              Weather Fronts
            </button>
            <button
              onClick={() => toggleLayer('satellite')}
              className={`px-2 py-1 rounded font-medium transition-colors ${layers.satellite ? 'bg-purple-600/40 text-purple-300 border border-purple-500/40' : 'text-slate-500'}`}
            >
              SAR Footprints
            </button>
          </div>

          <button
            onClick={() => setFullscreen(!fullscreen)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition-colors"
            title={fullscreen ? "Exit Fullscreen" : "Fullscreen Map"}
          >
            {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div className="relative flex-1 bg-[#020617] overflow-hidden flex items-center justify-center select-none">
        {/* Floating Metadata Indicator */}
        <div className="absolute top-3 left-3 bg-[#0b1329]/90 backdrop-blur-md border border-slate-700/80 rounded-lg p-2.5 z-20 text-[11px] space-y-1 shadow-lg pointer-events-none">
          <div className="text-slate-500 dark:text-slate-400 font-mono">
            AIS TELEMETRY: <strong className="text-emerald-400">LIVE (45s ago)</strong>
          </div>
          <div className="text-slate-500 dark:text-slate-400 font-mono">
            SAR OBSERVATION: <strong className="text-purple-400">Sentinel-1C (3.2h old)</strong>
          </div>
          <div className="text-slate-500 dark:text-slate-400 font-mono">
            WEATHER GRID: <strong className="text-blue-400">ECMWF / BoM Polar (18m old)</strong>
          </div>
          <div className="text-slate-500 text-[10px]">
            *Periodic observation only - no fake live video
          </div>
        </div>

        {/* Hover Entity Card */}
        {hoveredEntity && (
          <div className="absolute bottom-4 left-4 bg-[#0f172a] border border-blue-500/50 rounded-lg p-3 z-30 shadow-2xl max-w-xs text-xs pointer-events-none animate-fadeIn">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              {hoveredEntity.title}
            </div>
            <div className="text-slate-700 dark:text-slate-300 text-[11px] mb-1">{hoveredEntity.subtitle}</div>
            <div className="text-slate-500 dark:text-slate-400 text-[10px] space-y-0.5 border-t border-slate-200 dark:border-slate-800 pt-1">
              <div>Coordinates: <span className="font-mono text-slate-200">{hoveredEntity.coords}</span></div>
              {hoveredEntity.details && <div>Status: <span className="text-amber-400">{hoveredEntity.details}</span></div>}
              {hoveredEntity.weather && <div>Local Weather: <span className="text-cyan-300">{hoveredEntity.weather}</span></div>}
            </div>
          </div>
        )}

        {/* SVG Polar Map Engine */}
        <svg
          viewBox="0 0 800 800"
          className="w-full h-full max-h-[700px] object-contain"
        >
          <defs>
            {/* Grid Radial Gradient */}
            <radialGradient id="polarGrid" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#081433" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#040b1f" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#020617" stopOpacity="1" />
            </radialGradient>

            {/* Sea Ice Concentration Pattern */}
            <pattern id="packIcePattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 0 10 L 10 0 L 20 10 L 10 20 Z" fill="none" stroke="#60a5fa" strokeWidth="0.4" strokeOpacity="0.3" />
            </pattern>

            {/* Gale Storm Cloud Gradient */}
            <radialGradient id="stormGale" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.45" />
              <stop offset="70%" stopColor="#e11d48" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#be123c" stopOpacity="0" />
            </radialGradient>

            {/* SAR Swath Gradient */}
            <linearGradient id="sarSwath" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#7e22ce" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Deep Ocean Polar Disk */}
          <circle cx="400" cy="400" r="380" fill="url(#polarGrid)" stroke="#1e293b" strokeWidth="1.5" />

          {/* Latitude Range Rings (60S, 70S, 80S) */}
          <circle cx="400" cy="400" r="145" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
          <text x="405" y="258" fill="#64748b" fontSize="9" fontFamily="monospace">80°S</text>

          <circle cx="400" cy="400" r="290" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
          <text x="405" y="113" fill="#64748b" fontSize="9" fontFamily="monospace">70°S</text>

          {/* Meridian lines (0°, 90°E, 180°, 90°W) */}
          <line x1="400" y1="20" x2="400" y2="780" stroke="#1e293b" strokeWidth="1" strokeDasharray="2 4" />
          <line x1="20" y1="400" x2="780" y2="400" stroke="#1e293b" strokeWidth="1" strokeDasharray="2 4" />

          <text x="405" y="32" fill="#64748b" fontSize="10" fontFamily="monospace">0° (Prime Meridian)</text>
          <text x="405" y="775" fill="#64748b" fontSize="10" fontFamily="monospace">180° (Ross Sea)</text>
          <text x="710" y="395" fill="#64748b" fontSize="10" fontFamily="monospace">90°E</text>
          <text x="30" y="395" fill="#64748b" fontSize="10" fontFamily="monospace">90°W</text>

          {/* Schematic Antarctic Continent Outlines */}
          <path
            d="M 400 240 
               C 460 230, 520 270, 560 330 
               C 600 390, 610 470, 550 530 
               C 490 590, 420 570, 370 560 
               C 330 550, 270 500, 250 440 
               C 230 380, 260 310, 310 270 
               C 340 245, 370 242, 400 240 Z"
            fill="#091428"
            stroke="#3b82f6"
            strokeWidth="1.5"
            strokeOpacity="0.6"
          />

          {/* Antarctic Peninsula Spur */}
          <path
            d="M 310 270 C 290 230, 270 170, 250 140 C 240 135, 230 145, 235 160 C 250 200, 270 240, 285 275 Z"
            fill="#091428"
            stroke="#3b82f6"
            strokeWidth="1.2"
            strokeOpacity="0.6"
          />

          {/* Ross Ice Shelf Bay */}
          <path
            d="M 370 560 C 400 620, 470 610, 490 550 Z"
            fill="#061226"
            stroke="#38bdf8"
            strokeWidth="1.2"
            strokeDasharray="4 2"
          />

          {/* Sea Ice Concentration Overlays */}
          {layers.ice && (
            <g>
              {/* Wilkes Land / Casey Heavy Pack */}
              <circle
                cx={project(-66.28, 110.53).x}
                cy={project(-66.28, 110.53).y}
                r="45"
                fill="url(#packIcePattern)"
                stroke="#38bdf8"
                strokeWidth="1"
                strokeOpacity="0.5"
              />
              {/* Ross Sea Fast Ice */}
              <circle
                cx={project(-77.85, 166.67).x}
                cy={project(-77.85, 166.67).y}
                r="35"
                fill="url(#packIcePattern)"
                stroke="#60a5fa"
                strokeWidth="1"
                strokeOpacity="0.4"
              />
            </g>
          )}

          {/* Weather Gale / Storm Overlays */}
          {layers.weather && (
            <g>
              {/* Category 4 Blizzard over Casey Station (EXP-2026-C) */}
              <circle
                cx={project(-66.28, 110.53).x}
                cy={project(-66.28, 110.53).y}
                r="70"
                fill="url(#stormGale)"
                className="animate-pulse"
              />
              <text
                x={project(-66.28, 110.53).x + 10}
                y={project(-66.28, 110.53).y - 25}
                fill="#fda4af"
                fontSize="9"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                BLIZZARD WARNING (58kt Gale)
              </text>
            </g>
          )}

          {/* Sentinel-1 SAR Footprints */}
          {layers.satellite && (
            <g>
              {/* McMurdo Sound SAR scene */}
              <polygon
                points={`
                  ${project(-77.2, 165.2).x},${project(-77.2, 165.2).y}
                  ${project(-77.2, 168.4).x},${project(-77.2, 168.4).y}
                  ${project(-78.1, 168.4).x},${project(-78.1, 168.4).y}
                  ${project(-78.1, 165.2).x},${project(-78.1, 165.2).y}
                `}
                fill="url(#sarSwath)"
                stroke="#c084fc"
                strokeWidth="1.2"
                strokeDasharray="4 2"
              />
              <text
                x={project(-77.2, 165.2).x - 10}
                y={project(-77.2, 165.2).y - 6}
                fill="#d8b4fe"
                fontSize="8"
                fontFamily="monospace"
              >
                SENTINEL-1C SAR (3.2h)
              </text>
            </g>
          )}

          {/* Research Stations */}
          {layers.stations && (
            <g>
              {stations.map((st) => {
                const pt = project(st.lat, st.lon);
                return (
                  <g
                    key={st.code}
                    className="cursor-pointer group"
                    onMouseEnter={() =>
                      setHoveredEntity({
                        title: st.name,
                        subtitle: "Manned Antarctic Research Base",
                        coords: `${Math.abs(st.lat).toFixed(2)}°S, ${st.lon.toFixed(2)}°E`,
                        details: "Operational Year-Round"
                      })
                    }
                    onMouseLeave={() => setHoveredEntity(null)}
                  >
                    <rect
                      x={pt.x - 3}
                      y={pt.y - 3}
                      width="6"
                      height="6"
                      fill="#94a3b8"
                      stroke="#0f172a"
                      strokeWidth="1"
                    />
                    <text
                      x={pt.x + 6}
                      y={pt.y + 3}
                      fill="#94a3b8"
                      fontSize="9"
                      fontWeight="bold"
                      className="group-hover:fill-white transition-colors"
                    >
                      {st.code}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* Expedition Routes & Waypoints */}
          {layers.routes && (
            <g>
              {expeditions.map((e) => {
                if (!e.waypoints || e.waypoints.length < 2) return null;
                const pointsStr = e.waypoints
                  .map(w => {
                    const pt = project(w.lat, w.lon);
                    return `${pt.x},${pt.y}`;
                  })
                  .join(' ');

                const isSelected = selectedExpeditionId === e.id;
                const isBlocked = e.status.includes('BLOCKED');

                return (
                  <g key={`route-${e.id}`}>
                    <polyline
                      points={pointsStr}
                      fill="none"
                      stroke={isBlocked ? '#f43f5e' : isSelected ? '#38bdf8' : '#3b82f6'}
                      strokeWidth={isSelected ? '3' : '1.8'}
                      strokeDasharray={e.status === 'PLANNING' ? '5 3' : undefined}
                      strokeOpacity={isSelected ? 1 : 0.75}
                    />

                    {/* Waypoint Dots */}
                    {e.waypoints.map((w, idx) => {
                      const pt = project(w.lat, w.lon);
                      return (
                        <circle
                          key={`wpt-${e.id}-${idx}`}
                          cx={pt.x}
                          cy={pt.y}
                          r={w.passed ? 2.5 : 3.5}
                          fill={w.passed ? '#38bdf8' : isBlocked ? '#fb7185' : '#60a5fa'}
                          stroke="#020617"
                          strokeWidth="1"
                          onMouseEnter={() =>
                            setHoveredEntity({
                              title: `${e.id}: ${w.name}`,
                              subtitle: `Waypoint #${w.order} (${w.passed ? 'PASSED' : 'PENDING'})`,
                              coords: `${Math.abs(w.lat).toFixed(2)}°S, ${w.lon.toFixed(2)}°E`,
                              details: `ETA: ${w.eta || 'Awaiting schedule'}`
                            })
                          }
                          onMouseLeave={() => setHoveredEntity(null)}
                        />
                      );
                    })}
                  </g>
                );
              })}
            </g>
          )}

          {/* Active Vessels / Aircraft Positions */}
          {layers.assets && (
            <g>
              {expeditions.map((e) => {
                if (!e.current_lat || !e.current_lon) return null;
                const pt = project(e.current_lat, e.current_lon);
                const isSelected = selectedExpeditionId === e.id;
                const isBlocked = e.status.includes('BLOCKED');

                return (
                  <g
                    key={`asset-${e.id}`}
                    className="cursor-pointer"
                    onClick={() => onSelectExpedition?.(e)}
                    onMouseEnter={() =>
                      setHoveredEntity({
                        title: `${e.name} (${e.id})`,
                        subtitle: `${e.vessel_name || 'Fleet'} · Lead: ${e.lead}`,
                        coords: `${Math.abs(e.current_lat!).toFixed(2)}°S, ${e.current_lon!.toFixed(2)}°E`,
                        details: e.status_display || e.status,
                        weather: `${e.weather?.temperature_c}°C, Wind ${e.weather?.wind_speed_kt}kt`
                      })
                    }
                    onMouseLeave={() => setHoveredEntity(null)}
                  >
                    {/* Pulsing ring for active tracking */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isSelected ? 14 : 9}
                      fill={isBlocked ? '#f43f5e' : '#38bdf8'}
                      fillOpacity="0.2"
                      className="animate-ping"
                    />

                    {/* Vessel Marker Anchor */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isSelected ? 6 : 4.5}
                      fill={isBlocked ? '#ef4444' : '#0284c7'}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />

                    {/* Callout Label */}
                    <text
                      x={pt.x + 8}
                      y={pt.y + 4}
                      fill={isSelected ? '#38bdf8' : '#ffffff'}
                      fontSize={isSelected ? '10' : '9'}
                      fontWeight="bold"
                      fontFamily="monospace"
                      className="drop-shadow-md"
                    >
                      {e.id} {e.vessel_name ? `(${e.vessel_name.split(' ')[0]})` : ''}
                    </text>
                  </g>
                );
              })}
            </g>
          )}
        </svg>
      </div>

      {/* Bottom Map Legend */}
      <div className="bg-[#0b1329] border-t border-slate-200 dark:border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 border border-white" />
            <span>Active Vessel (AIS Live)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-white" />
            <span>Blocked / Storm Hazard</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-slate-400" />
            <span>Research Base</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-blue-500 inline-block" />
            <span>Planned Route</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 border border-purple-400 bg-purple-950/40 inline-block" />
            <span>Sentinel-1 SAR Swath</span>
          </div>
        </div>

        <div className="text-slate-500 dark:text-slate-400">
          Click any mission marker to inspect telemetry & logs
        </div>
      </div>
    </div>
  );
}
