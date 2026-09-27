"use client"

import React, { useState, useEffect } from 'react'
import Map, { Marker, NavigationControl, Source, Layer } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { 
  Incident, 
  ResponseAsset, 
  RouteComparison 
} from '@/types/emergency'
import { 
  Ship, 
  Building2, 
  AlertTriangle, 
  Plane, 
  LifeBuoy, 
  Satellite, 
  CloudRain, 
  Snowflake, 
  MapPin, 
  Layers, 
  Maximize2, 
  Eye, 
  CheckSquare, 
  Square,
  Compass,
  RotateCcw,
  Sparkles
} from 'lucide-react'
import { useTheme } from '@/components/theme/ThemeProvider'

interface IncidentMapProps {
  selectedIncident?: Incident | null;
  responseAssets?: ResponseAsset[];
  onSelectAsset?: (asset: ResponseAsset) => void;
  onSelectWaypoint?: (wp: any) => void;
}

export function IncidentMap({
  selectedIncident,
  responseAssets = [],
  onSelectAsset,
  onSelectWaypoint
}: IncidentMapProps) {
  const { resolvedTheme } = useTheme();

  // Center view on Southern Ocean / Davis Sea / Prydz Bay
  const [viewState, setViewState] = useState({
    longitude: 76.92,
    latitude: -67.84,
    zoom: 4.2,
    pitch: 20,
    bearing: 0
  });

  // Layer Controls
  const [layerControls, setLayerControls] = useState({
    vessels: true,
    stations: true,
    incidents: true,
    responseAssets: true,
    originalRoute: true,
    currentRoute: true,
    recommendedRoute: true,
    seaIce: true,
    weatherHazard: true,
    blockedArea: true,
    riskZones: true
  });

  const [selectedEntity, setSelectedEntity] = useState<any>(null);

  // Key Antarctic Stations
  const stations = [
    { id: 'st_davis', name: 'Davis Station (AU)', lat: -68.57, lon: 77.96, personnel: 42, station_type: 'Base Hub' },
    { id: 'st_bharati', name: 'Bharati Station (IN)', lat: -69.40, lon: 76.19, personnel: 30, station_type: 'Research Station' },
    { id: 'st_maitri', name: 'Maitri Station (IN)', lat: -70.76, lon: 11.73, personnel: 25, station_type: 'Research Station' },
    { id: 'st_mcmurdo', name: 'McMurdo Station (US)', lat: -77.85, lon: 166.66, personnel: 250, station_type: 'Main Gateway' },
    { id: 'st_mawson', name: 'Mawson Station (AU)', lat: -67.60, lon: 62.87, personnel: 28, station_type: 'Research Station' }
  ];

  // Update center when incident changes
  useEffect(() => {
    if (selectedIncident?.coordinates) {
      setViewState(prev => ({
        ...prev,
        longitude: selectedIncident.coordinates.lon,
        latitude: selectedIncident.coordinates.lat,
        zoom: 4.5
      }));
    }
  }, [selectedIncident]);

  const routeComparison: RouteComparison | undefined = selectedIncident?.ai_recommendation?.route_comparison || undefined;

  // Build GeoJSON routes
  const originalRouteGeoJSON: any = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: (routeComparison?.original_route || []).map(wp => [wp.lon, wp.lat])
    }
  };

  const currentRouteGeoJSON: any = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: (routeComparison?.current_route || []).map(wp => [wp.lon, wp.lat])
    }
  };

  const recommendedRouteGeoJSON: any = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: (routeComparison?.recommended_route || []).map(wp => [wp.lon, wp.lat])
    }
  };

  // Blocked and High Risk Areas
  const blockedCenter = routeComparison?.blocked_area || { lat: -67.84, lon: 76.92, radius_nm: 16.0 };

  const resetView = () => {
    setViewState({
      longitude: 76.92,
      latitude: -67.84,
      zoom: 4.2,
      pitch: 20,
      bearing: 0
    });
  };

  const toggleLayer = (layer: keyof typeof layerControls) => {
    setLayerControls(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <div className="relative w-full h-full min-h-[500px] bg-slate-100 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm dark:shadow-2xl flex flex-col transition-colors duration-150">
      {/* Map Header Overlay */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700/80 px-3 py-1.5 rounded-lg shadow-md dark:shadow-lg">
        <Compass className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin-slow" />
        <span className="text-xs font-bold text-slate-800 dark:text-slate-100 font-mono">
          ANTARCTIC OPERATIONAL INCIDENT MAP
        </span>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">
          STEREOGRAPHIC 60°S-90°S
        </span>
      </div>

      {/* Layer Toggles Floating Control */}
      <div className="absolute top-3 right-3 z-20 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700/80 p-2.5 rounded-lg shadow-md dark:shadow-xl text-xs space-y-1.5 w-52 max-h-[calc(100%-2rem)] overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 font-bold font-mono">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Map Layers</span>
          </span>
          <button 
            onClick={resetView}
            className="text-[10px] text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 font-mono"
            title="Reset to incident datum"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>Reset</span>
          </button>
        </div>

        <div className="space-y-1 text-[11px] font-mono">
          <label className="flex items-center justify-between cursor-pointer text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>Active Incidents</span>
            </span>
            <input 
              type="checkbox" 
              checked={layerControls.incidents} 
              onChange={() => toggleLayer('incidents')} 
              className="rounded bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-blue-600" 
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>Affected Vessels</span>
            </span>
            <input 
              type="checkbox" 
              checked={layerControls.vessels} 
              onChange={() => toggleLayer('vessels')} 
              className="rounded bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-blue-600" 
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Response Assets</span>
            </span>
            <input 
              type="checkbox" 
              checked={layerControls.responseAssets} 
              onChange={() => toggleLayer('responseAssets')} 
              className="rounded bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-blue-600" 
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
              <span>AI Recommended Route</span>
            </span>
            <input 
              type="checkbox" 
              checked={layerControls.recommendedRoute} 
              onChange={() => toggleLayer('recommendedRoute')} 
              className="rounded bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-blue-600" 
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-0.5 bg-slate-500"></span>
              <span>Original Route</span>
            </span>
            <input 
              type="checkbox" 
              checked={layerControls.originalRoute} 
              onChange={() => toggleLayer('originalRoute')} 
              className="rounded bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-blue-600" 
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600/80"></span>
              <span>Blocked Hazard Area</span>
            </span>
            <input 
              type="checkbox" 
              checked={layerControls.blockedArea} 
              onChange={() => toggleLayer('blockedArea')} 
              className="rounded bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-blue-600" 
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>Dense Sea Ice Pack</span>
            </span>
            <input 
              type="checkbox" 
              checked={layerControls.seaIce} 
              onChange={() => toggleLayer('seaIce')} 
              className="rounded bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-blue-600" 
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              <span>Research Stations</span>
            </span>
            <input 
              type="checkbox" 
              checked={layerControls.stations} 
              onChange={() => toggleLayer('stations')} 
              className="rounded bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-blue-600" 
            />
          </label>
        </div>
      </div>

      {/* Main MapLibre Container */}
      <div className="flex-1 w-full h-full relative">
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapStyle={{
            version: 8,
            sources: {
              'osm-tiles': {
                type: 'raster',
                tiles: [
                  resolvedTheme === 'light'
                    ? 'https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
                    : 'https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
                ],
                tileSize: 256,
                attribution: '&copy; OpenStreetMap &copy; CARTO'
              }
            },
            layers: [
              {
                id: 'osm-tiles-layer',
                type: 'raster',
                source: 'osm-tiles',
                minzoom: 0,
                maxzoom: 19
              }
            ]
          }}
          attributionControl={false}
          style={{ width: '100%', height: '100%' }}
        >
          <NavigationControl position="bottom-right" />

          {/* Original Route (Dashed Neutral Line) */}
          {layerControls.originalRoute && routeComparison?.original_route && (
            <Source id="original-route" type="geojson" data={originalRouteGeoJSON}>
              <Layer
                id="original-route-line"
                type="line"
                paint={{
                  'line-color': '#94a3b8',
                  'line-width': 2,
                  'line-dasharray': [3, 2],
                  'line-opacity': 0.7
                }}
              />
            </Source>
          )}

          {/* Current Route (Active Blue Line) */}
          {layerControls.currentRoute && routeComparison?.current_route && (
            <Source id="current-route" type="geojson" data={currentRouteGeoJSON}>
              <Layer
                id="current-route-line"
                type="line"
                paint={{
                  'line-color': '#3b82f6',
                  'line-width': 3.5,
                  'line-opacity': 0.85
                }}
              />
            </Source>
          )}

          {/* Recommended Route (Bright Cyan / Green Line) */}
          {layerControls.recommendedRoute && routeComparison?.recommended_route && (
            <Source id="recommended-route" type="geojson" data={recommendedRouteGeoJSON}>
              <Layer
                id="recommended-route-line"
                type="line"
                paint={{
                  'line-color': '#06b6d4',
                  'line-width': 4,
                  'line-opacity': 0.95
                }}
              />
            </Source>
          )}

          {/* Permanent Research Stations */}
          {layerControls.stations && stations.map(st => (
            <Marker
              key={st.id}
              longitude={st.lon}
              latitude={st.lat}
              anchor="center"
              onClick={e => {
                e.originalEvent.stopPropagation();
                setSelectedEntity({ type: 'station', ...st });
              }}
            >
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="w-5 h-5 rounded bg-purple-700 border border-purple-400 flex items-center justify-center text-white shadow-md shadow-purple-900/50 group-hover:scale-125 transition-transform">
                  <Building2 className="w-3 h-3" />
                </div>
                <span className="text-[9px] font-mono text-slate-700 dark:text-slate-300 bg-slate-900/90 px-1 rounded border border-slate-700/60 mt-0.5 whitespace-nowrap">
                  {st.name}
                </span>
              </div>
            </Marker>
          ))}

          {/* Response Assets (Icebreakers, Helicopters, Rescue Teams) */}
          {layerControls.responseAssets && responseAssets.map(asset => (
            <Marker
              key={asset.id}
              longitude={asset.lon}
              latitude={asset.lat}
              anchor="center"
              onClick={e => {
                e.originalEvent.stopPropagation();
                setSelectedEntity({ type: 'response_asset', ...asset });
                if (onSelectAsset) onSelectAsset(asset);
              }}
            >
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="w-6 h-6 rounded-full bg-emerald-600 border border-emerald-300 flex items-center justify-center text-white shadow-md shadow-emerald-900/50 group-hover:scale-125 transition-transform">
                  {asset.asset_type.includes('Helicopter') || asset.asset_type.includes('Aircraft') ? (
                    <Plane className="w-3.5 h-3.5" />
                  ) : (
                    <LifeBuoy className="w-3.5 h-3.5" />
                  )}
                </div>
                <div className="text-[9px] font-mono text-emerald-300 bg-slate-900/90 px-1.5 rounded border border-emerald-700/60 mt-0.5 whitespace-nowrap font-bold flex items-center gap-1">
                  <span>{asset.name}</span>
                  <span className="text-[8px] text-emerald-400">({asset.suitability_pct}%)</span>
                </div>
              </div>
            </Marker>
          ))}

          {/* Selected Incident Marker & Blocked Hazard Overlay */}
          {layerControls.incidents && selectedIncident && (
            <>
              {/* Blocked Area Visualizer */}
              {layerControls.blockedArea && (
                <Marker
                  longitude={blockedCenter.lon}
                  latitude={blockedCenter.lat}
                  anchor="center"
                >
                  <div className="w-24 h-24 rounded-full bg-red-600/25 border-2 border-red-500 border-dashed animate-pulse flex items-center justify-center pointer-events-none">
                    <span className="text-[9px] font-mono font-bold text-red-300 bg-red-950/80 px-1 rounded border border-red-700">
                      BLOCKED PACK
                    </span>
                  </div>
                </Marker>
              )}

              {/* Sea Ice Concentration Overlay Indicator */}
              {layerControls.seaIce && (
                <Marker
                  longitude={selectedIncident.coordinates.lon + 0.3}
                  latitude={selectedIncident.coordinates.lat + 0.2}
                  anchor="center"
                >
                  <div className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/60 text-cyan-300 text-[10px] font-mono flex items-center gap-1 pointer-events-none shadow-md">
                    <Snowflake className="w-3 h-3 text-cyan-400" />
                    <span>78.4% Pack Ice (2.1m Ridges)</span>
                  </div>
                </Marker>
              )}

              {/* Waypoint B (Recommended Corridor) */}
              {routeComparison?.recommended_route && routeComparison.recommended_route[1] && (
                <Marker
                  longitude={routeComparison.recommended_route[1].lon}
                  latitude={routeComparison.recommended_route[1].lat}
                  anchor="center"
                  onClick={e => {
                    e.originalEvent.stopPropagation();
                    if (onSelectWaypoint) onSelectWaypoint(routeComparison.recommended_route[1]);
                  }}
                >
                  <div className="flex flex-col items-center cursor-pointer group">
                    <div className="w-5 h-5 rounded-full bg-cyan-500 border-2 border-white flex items-center justify-center text-slate-950 font-bold text-[10px] shadow-lg shadow-cyan-500/50 group-hover:scale-125 transition-transform">
                      B
                    </div>
                    <span className="text-[9px] font-mono text-cyan-300 bg-slate-900/90 px-1 rounded border border-cyan-600 mt-0.5">
                      Waypoint B (Open Lead)
                    </span>
                  </div>
                </Marker>
              )}

              {/* Primary Incident Marker */}
              <Marker
                longitude={selectedIncident.coordinates.lon}
                latitude={selectedIncident.coordinates.lat}
                anchor="center"
                onClick={e => {
                  e.originalEvent.stopPropagation();
                  setSelectedEntity({ type: 'incident', ...selectedIncident });
                }}
              >
                <div className="relative flex items-center justify-center cursor-pointer group">
                  <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-red-500 opacity-75"></span>
                  <div className="w-7 h-7 rounded-full bg-red-600 border-2 border-white flex items-center justify-center text-white shadow-xl shadow-red-600/60 group-hover:scale-125 transition-transform z-10">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-red-950/90 border border-red-700 text-red-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-lg pointer-events-none">
                    {selectedIncident.id}: {selectedIncident.severity}
                  </div>
                </div>
              </Marker>
            </>
          )}

          {/* Affected Vessel Marker */}
          {layerControls.vessels && selectedIncident?.affected_assets?.[0] && (
            <Marker
              longitude={selectedIncident.affected_assets[0].current_lon}
              latitude={selectedIncident.affected_assets[0].current_lat}
              anchor="center"
              onClick={e => {
                e.originalEvent.stopPropagation();
                setSelectedEntity({ type: 'affected_asset', ...selectedIncident.affected_assets[0] });
              }}
            >
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-white shadow-lg shadow-blue-900/60 group-hover:scale-125 transition-transform">
                  <Ship className="w-3.5 h-3.5" />
                </div>
                <div className="text-[9px] font-mono text-blue-200 bg-slate-900/90 px-1.5 rounded border border-blue-700/60 mt-0.5 whitespace-nowrap font-bold">
                  {selectedIncident.affected_assets[0].name} (6.2 kt)
                </div>
              </div>
            </Marker>
          )}
        </Map>
      </div>

      {/* Selected Entity Popup Modal / Drawer */}
      {selectedEntity && (
        <div className="absolute bottom-16 left-3 z-30 bg-slate-900/95 backdrop-blur-md border border-slate-700 p-3.5 rounded-xl shadow-2xl w-80 text-xs text-slate-700 dark:text-slate-300 space-y-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white uppercase font-mono flex items-center gap-1.5">
              {selectedEntity.type === 'incident' && <AlertTriangle className="w-4 h-4 text-red-500" />}
              {selectedEntity.type === 'response_asset' && <LifeBuoy className="w-4 h-4 text-emerald-400" />}
              {selectedEntity.type === 'station' && <Building2 className="w-4 h-4 text-purple-400" />}
              {selectedEntity.type === 'affected_asset' && <Ship className="w-4 h-4 text-blue-400" />}
              <span>{selectedEntity.name || selectedEntity.title || selectedEntity.id}</span>
            </span>
            <button 
              onClick={() => setSelectedEntity(null)}
              className="text-slate-500 hover:text-white font-bold px-1"
            >
              ✕
            </button>
          </div>

          <div className="space-y-1 font-mono text-[11px]">
            {selectedEntity.type === 'incident' && (
              <>
                <div className="flex justify-between"><span className="text-slate-500">Severity:</span> <span className="text-red-400 font-bold">{selectedEntity.severity}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Risk Score:</span> <span className="text-amber-400">{selectedEntity.risk_score}/100</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Location:</span> <span>{selectedEntity.location_name}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Primary Cause:</span> <span className="text-slate-200">{selectedEntity.primary_cause}</span></div>
              </>
            )}

            {selectedEntity.type === 'response_asset' && (
              <>
                <div className="flex justify-between"><span className="text-slate-500">Type:</span> <span>{selectedEntity.asset_type}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Suitability:</span> <span className="text-emerald-400 font-bold">{selectedEntity.suitability_pct}%</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Distance / ETA:</span> <span>{selectedEntity.distance_km} km / {selectedEntity.eta_hours}h</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Fuel:</span> <span>{selectedEntity.fuel_pct}%</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Status:</span> <span className="text-emerald-300 font-semibold">{selectedEntity.status}</span></div>
              </>
            )}

            {selectedEntity.type === 'affected_asset' && (
              <>
                <div className="flex justify-between"><span className="text-slate-500">Class:</span> <span>{selectedEntity.asset_type}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Speed / Heading:</span> <span>{selectedEntity.speed_knots} kt / {selectedEntity.heading_deg}°</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Destination:</span> <span>{selectedEntity.destination}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Delay:</span> <span className="text-red-400 font-bold">+{selectedEntity.expected_delay_hours} hrs</span></div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Bottom Route Comparison Ribbon */}
      {routeComparison && (
        <div className="bg-[#0b1329]/95 border-t border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center justify-between z-20 text-xs font-mono">
          <div className="flex items-center gap-4">
            <span className="font-bold text-slate-700 dark:text-slate-300 uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Route Diversion Comparison:</span>
            </span>

            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <span className="w-3 h-0.5 bg-slate-400"></span>
                <span>Original (+26h Delay)</span>
              </span>

              <span className="flex items-center gap-1 text-blue-400 font-bold">
                <span className="w-3 h-1 bg-blue-500 rounded"></span>
                <span>Current Slow (6.2kt)</span>
              </span>

              <span className="flex items-center gap-1 text-cyan-300 font-bold">
                <span className="w-3 h-1 bg-cyan-400 rounded"></span>
                <span>Recommended Lead B (+11h ETA Gain, -24% Risk)</span>
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
            <span>Model: OR-Tools Fairway VRP (Confidence: 84%)</span>
          </div>
        </div>
      )}
    </div>
  );
}
