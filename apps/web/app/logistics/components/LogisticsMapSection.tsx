"use client"

import React, { useState } from 'react';
import { Vessel, StationSupply, RouteItem, WeatherIntelligence, SeaIceIntelligence, SatelliteObservation } from '@/types/logistics';
import {
  Compass,
  Layers,
  MapPin,
  Ship,
  Anchor,
  CloudRain,
  Radio,
  Eye,
  X,
  Maximize2,
  AlertTriangle,
  Info,
  Calendar,
  Zap,
  Wind
} from 'lucide-react';

interface Props {
  vessels: Vessel[];
  stations: StationSupply[];
  routes: RouteItem[];
  weather: WeatherIntelligence;
  seaIce: SeaIceIntelligence;
  satellites: SatelliteObservation[];
}

export function LogisticsMapSection({
  vessels,
  stations,
  routes,
  weather,
  seaIce,
  satellites
}: Props) {
  // Map controls
  const [mapMode, setMapMode] = useState<'MAP' | 'SATELLITE' | 'TACTICAL'>('TACTICAL');

  // Layer toggles
  const [layers, setLayers] = useState({
    vessels: true,
    routes: true,
    stations: true,
    weather: true,
    seaIce: true,
    satellites: true,
    cargo: true,
    alerts: true
  });

  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);
  const [selectedStation, setSelectedStation] = useState<StationSupply | null>(null);

  const toggleLayer = (layerKey: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  // Convert lat/lon roughly to SVG Antarctic polar projection coordinates
  // Center is South Pole (lat: -90), radius extends to ~-30 (Southern Africa, Australia)
  const projectPolar = (lat: number, lon: number): { x: number; y: number } => {
    // Map radius in SVG: center is (400, 300)
    const centerX = 450;
    const centerY = 300;
    const rScale = 6.2; // pixels per degree of latitude from pole
    const r = Math.max(10, Math.min(270, (lat - (-90)) * rScale));
    const angleRad = (lon - 90) * (Math.PI / 180);
    const x = centerX + r * Math.cos(angleRad);
    const y = centerY + r * Math.sin(angleRad);
    return { x, y };
  };

  return (
    <div className="my-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#020617] overflow-hidden shadow-2xl relative">
      {/* Top Map Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900/90 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Compass className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              Antarctic Maritime & Logistics Command Map
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                POLAR STEREOGRAPHIC
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live vessel AIS telemetry, sea-ice concentrations, weather hazards, and station logistics.
            </p>
          </div>
        </div>

        {/* View Mode Controls: [MAP] [SATELLITE] [3D/TACTICAL] */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setMapMode('MAP')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              mapMode === 'MAP'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-200'
            }`}
          >
            MAP
          </button>
          <button
            onClick={() => setMapMode('SATELLITE')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              mapMode === 'SATELLITE'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-200'
            }`}
          >
            SATELLITE
          </button>
          <button
            onClick={() => setMapMode('TACTICAL')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              mapMode === 'TACTICAL'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-200'
            }`}
          >
            3D TACTICAL
          </button>
        </div>
      </div>

      {/* Layer Controls Bar */}
      <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-xs">
        <span className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1 mr-2">
          <Layers className="w-3.5 h-3.5 text-blue-400" /> Layers:
        </span>

        {[
          { key: 'vessels', label: 'Vessels', color: 'text-blue-400' },
          { key: 'routes', label: 'Routes', color: 'text-emerald-400' },
          { key: 'stations', label: 'Stations', color: 'text-amber-400' },
          { key: 'weather', label: 'Weather Warnings', color: 'text-sky-400' },
          { key: 'seaIce', label: 'Sea Ice Risk', color: 'text-cyan-400' },
          { key: 'satellites', label: 'Satellite Observations', color: 'text-purple-400' },
          { key: 'cargo', label: 'Cargo Destinations', color: 'text-pink-400' },
          { key: 'alerts', label: 'Alerts', color: 'text-rose-400' }
        ].map(item => {
          const active = layers[item.key as keyof typeof layers];
          return (
            <button
              key={item.key}
              onClick={() => toggleLayer(item.key as keyof typeof layers)}
              className={`px-2.5 py-1 rounded-md border text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                active
                  ? 'bg-slate-800 border-slate-700 text-slate-200'
                  : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/60 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${active ? 'bg-emerald-400' : 'bg-slate-600'}`} />
              <span className={active ? item.color : ''}>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Map View Canvas (Tactical High-Precision Polar Canvas) */}
      <div className="relative w-full h-[520px] bg-[#070d1e] overflow-hidden select-none">
        {/* Antarctic Continent & Grid SVG Vector Backdrop */}
        <svg className="w-full h-full" viewBox="0 0 900 600">
          <defs>
            {/* Ice gradient */}
            <radialGradient id="antarcticIce" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#0f172a" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#070d1e" stopOpacity="1" />
            </radialGradient>

            {/* Sea Ice pattern */}
            <pattern id="packIcePattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="5" cy="5" r="1.5" fill="#38bdf8" fillOpacity="0.3" />
              <circle cx="15" cy="15" r="2" fill="#38bdf8" fillOpacity="0.25" />
            </pattern>
          </defs>

          {/* Ocean background */}
          <rect width="900" height="600" fill="#040816" />

          {/* Latitude Range Rings (60S, 70S, 80S) */}
          <circle cx="450" cy="300" r="186" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
          <text x="455" y="118" fill="#475569" fontSize="10" fontFamily="monospace">60°S (Southern Ocean Bound)</text>

          <circle cx="450" cy="300" r="124" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
          <text x="455" y="180" fill="#475569" fontSize="10" fontFamily="monospace">70°S (Antarctic Circle)</text>

          <circle cx="450" cy="300" r="62" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
          <text x="455" y="242" fill="#475569" fontSize="10" fontFamily="monospace">80°S (Polar Plateau)</text>

          {/* South Pole Marker */}
          <circle cx="450" cy="300" r="4" fill="#38bdf8" />
          <text x="458" y="304" fill="#94a3b8" fontSize="11" fontWeight="bold">South Pole (90°S)</text>

          {/* Stylized Antarctic Coastline Outline */}
          <path
            d="M 450,150 
               C 530,160 590,200 600,280 
               C 610,340 560,420 480,450 
               C 420,470 330,440 310,370 
               C 290,320 280,240 330,190 
               C 380,150 410,140 450,150 Z"
            fill="url(#antarcticIce)"
            stroke="#334155"
            strokeWidth="1.5"
          />

          {/* Sea Ice Concentration Overlay Layer */}
          {layers.seaIce && (
            <g>
              <path
                d="M 420,130 C 560,140 640,190 640,300 C 640,380 580,460 480,480 C 370,500 270,420 270,300 C 270,210 320,130 420,130 Z"
                fill="url(#packIcePattern)"
                stroke="#0284c7"
                strokeWidth="1"
                strokeDasharray="6 3"
                opacity="0.8"
              />
              <text x="560" y="160" fill="#38bdf8" fontSize="10" fontWeight="bold" opacity="0.9">
                PACK ICE MARGIN (42% CONC)
              </text>
            </g>
          )}

          {/* Weather Storm Warning Zone */}
          {layers.weather && (
            <g>
              <ellipse
                cx="580"
                cy="230"
                rx="65"
                ry="45"
                fill="#f43f5e"
                fillOpacity="0.12"
                stroke="#f43f5e"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <text x="535" y="225" fill="#fda4af" fontSize="10" fontWeight="bold">
                KATABATIC GALE SECTOR
              </text>
              <text x="545" y="240" fill="#fb7185" fontSize="9">
                52 kts / 6.8m Waves
              </text>
            </g>
          )}

          {/* Satellite Footprints Layer */}
          {layers.satellites && (
            <g>
              <rect
                x="520"
                y="190"
                width="80"
                height="90"
                fill="#a855f7"
                fillOpacity="0.1"
                stroke="#c084fc"
                strokeWidth="1"
                strokeDasharray="4 2"
              />
              <text x="525" y="205" fill="#e9d5ff" fontSize="9" fontWeight="bold">
                Sentinel-1A SAR SWATH
              </text>
            </g>
          )}

          {/* Routes Layer */}
          {layers.routes && routes.map(route => {
            const points = route.coordinates.map(coord => projectPolar(coord[1], coord[0]));
            const d = points.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x},${p.y}` : `${acc} L ${p.x},${p.y}`), '');
            const isDelayed = route.overall_operational_risk === 'CRITICAL';
            const isWarning = route.overall_operational_risk === 'WARNING';
            const strokeColor = isDelayed ? '#f43f5e' : isWarning ? '#fbbf24' : '#10b981';

            return (
              <g key={route.route_id}>
                <path
                  d={d}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="2.5"
                  strokeDasharray={isDelayed ? '6 4' : 'none'}
                  opacity="0.85"
                />
                {points.map((p, idx) => (
                  <circle
                    key={idx}
                    cx={p.x}
                    cy={p.y}
                    r={idx === 0 || idx === points.length - 1 ? 4 : 2.5}
                    fill={strokeColor}
                  />
                ))}
              </g>
            );
          })}
        </svg>

        {/* HTML / DOM Interactive Vessel & Station Markers */}
        {layers.stations && stations.map(station => {
          const pos = projectPolar(station.lat, station.lon);
          const isCritical = station.status === 'CRITICAL';
          const isWarning = station.status === 'WARNING';

          return (
            <div
              key={station.id}
              style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
              onClick={() => setSelectedStation(station)}
            >
              <div
                className={`p-1.5 rounded-lg shadow-xl border transition-transform group-hover:scale-125 flex items-center justify-center ${
                  isCritical
                    ? 'bg-rose-950 border-rose-500 text-rose-300'
                    : isWarning
                    ? 'bg-amber-950 border-amber-500 text-amber-300'
                    : 'bg-slate-900 border-slate-700 text-emerald-400'
                }`}
              >
                <Anchor className="w-3.5 h-3.5" />
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 -top-6 px-2 py-0.5 rounded bg-slate-950/90 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-white whitespace-nowrap shadow-md pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
                {station.name} ({station.status})
              </div>
            </div>
          );
        })}

        {layers.vessels && vessels.map(vessel => {
          const pos = projectPolar(vessel.lat, vessel.lon);
          const isSelected = selectedVessel?.id === vessel.id;
          const isDelayed = vessel.status === 'Delayed';
          const isAtPort = vessel.status === 'At Port';

          return (
            <div
              key={vessel.id}
              style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-30"
              onClick={() => setSelectedVessel(vessel)}
            >
              <div
                className={`p-2 rounded-full border shadow-2xl transition-all ${
                  isSelected
                    ? 'bg-blue-600 border-white scale-125 ring-4 ring-blue-500/40'
                    : isDelayed
                    ? 'bg-rose-600 border-rose-300 animate-bounce'
                    : isAtPort
                    ? 'bg-slate-800 border-slate-600'
                    : 'bg-blue-600 border-blue-400 group-hover:scale-110'
                } text-white`}
              >
                <Ship className="w-4 h-4" />
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 top-7 px-2 py-0.5 rounded bg-slate-950/95 border border-slate-700 text-[10px] font-bold text-slate-100 whitespace-nowrap shadow-lg flex items-center gap-1.5 pointer-events-none">
                <span className={`w-1.5 h-1.5 rounded-full ${isDelayed ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                {vessel.name} ({vessel.speed_knots}kt)
              </div>
            </div>
          );
        })}

        {/* Selected Vessel Details Drawer / Modal (Section 9) */}
        {selectedVessel && (
          <div className="absolute top-4 right-4 w-84 sm:w-96 bg-slate-900/95 border border-slate-700 rounded-xl p-5 shadow-2xl backdrop-blur-md z-40 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Ship className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{selectedVessel.name}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{selectedVessel.imo} • {selectedVessel.ice_class}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedVessel(null)}
                className="p-1 rounded-md text-slate-500 dark:text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 py-3 border-b border-slate-200 dark:border-slate-800 text-[11px]">
              <div>
                <span className="text-slate-500 dark:text-slate-400">Current Position:</span>
                <p className="font-semibold text-slate-200">{selectedVessel.lat.toFixed(2)}°S, {selectedVessel.lon.toFixed(2)}°E</p>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Speed & Heading:</span>
                <p className="font-semibold text-slate-200">{selectedVessel.speed_knots} kts • {selectedVessel.heading_deg}°</p>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Destination:</span>
                <p className="font-semibold text-blue-400">{selectedVessel.destination}</p>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Operational Delay:</span>
                <p className={`font-semibold ${selectedVessel.delay_hours > 12 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {selectedVessel.delay_hours > 0 ? `+${selectedVessel.delay_hours}h` : 'On Schedule'}
                </p>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Cargo Load:</span>
                <p className="font-semibold text-slate-200">{selectedVessel.cargo_load_tons} tons</p>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Fuel Status:</span>
                <p className="font-semibold text-slate-200">{selectedVessel.fuel_status_pct}%</p>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Predicted ETA (XGBoost):</span>
                <p className="font-semibold text-purple-300">
                  {new Date(selectedVessel.predicted_eta).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} UTC
                </p>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Last AIS Update:</span>
                <p className="font-semibold text-emerald-400">{selectedVessel.last_ais_update}</p>
              </div>
            </div>

            {/* Risk & Recommendation */}
            <div className="pt-3 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 dark:text-slate-400">Route Risk Level:</span>
                <span className={`px-2 py-0.5 rounded font-bold ${
                  selectedVessel.route_risk === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' :
                  selectedVessel.route_risk === 'WARNING' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {selectedVessel.route_risk}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Nav Advisory: </span>
                {selectedVessel.status === 'Delayed'
                  ? 'Cyclonic gale & 40% pack ice slowing advance. Review alternate waypoint.'
                  : 'Favorable passage along current ice lead. Maintain economic throttle.'}
              </div>
            </div>
          </div>
        )}

        {/* Selected Station Details Drawer */}
        {selectedStation && (
          <div className="absolute top-4 left-4 w-80 sm:w-88 bg-slate-900/95 border border-slate-700 rounded-xl p-5 shadow-2xl backdrop-blur-md z-40 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Anchor className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{selectedStation.name}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{selectedStation.country} • Pop: {selectedStation.population}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStation(null)}
                className="p-1 rounded-md text-slate-500 dark:text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3 border-b border-slate-200 dark:border-slate-800 space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Replenishment Status:</span>
                <span className={`px-2 py-0.5 rounded font-bold ${
                  selectedStation.status === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' :
                  selectedStation.status === 'WARNING' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {selectedStation.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Next Resupply Deadline:</span>
                <span className="font-bold text-white">{selectedStation.next_resupply_deadline}</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                {selectedStation.status_reason}
              </div>
            </div>

            <div className="pt-3">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                Inventory Days Remaining:
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Diesel Fuel:</span>
                  <p className={`font-bold text-sm ${selectedStation.coverage.fuel_days < 10 ? 'text-rose-400' : 'text-slate-200'}`}>
                    {selectedStation.coverage.fuel_days} days
                  </p>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Food Rations:</span>
                  <p className="font-bold text-sm text-slate-200">{selectedStation.coverage.food_days} days</p>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Medical:</span>
                  <p className={`font-bold text-sm ${selectedStation.coverage.medical_days < 15 ? 'text-rose-400' : 'text-slate-200'}`}>
                    {selectedStation.coverage.medical_days} days
                  </p>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Spare Parts:</span>
                  <p className="font-bold text-sm text-slate-200">{selectedStation.coverage.spare_parts_days} days</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-3 left-4 flex flex-wrap items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 backdrop-blur-sm z-10">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> In Transit</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Delayed</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Active Route</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Pack Ice (38%)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-400" /> Satellite Observation</span>
        </div>
      </div>
    </div>
  );
}
