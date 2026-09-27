"use client"

import React, { useState } from 'react'
import Map, { Marker, NavigationControl, Source, Layer } from 'react-map-gl/maplibre'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { 
  Ship, 
  MapPin, 
  Satellite, 
  Wind, 
  Snowflake, 
  Eye, 
  Layers, 
  CheckSquare, 
  Square,
  AlertTriangle,
  Info,
  Maximize2,
  Compass
} from 'lucide-react'
import { SatelliteScene, VesselIntelligence, IceRegion } from '@/types/intelligence'
import { useTheme } from '@/components/theme/ThemeProvider'

interface IntelligenceMapProps {
  scenes?: SatelliteScene[];
  vessels?: VesselIntelligence[];
  iceRegions?: IceRegion[];
  onSelectScene?: (scene: SatelliteScene) => void;
  onSelectVessel?: (vessel: VesselIntelligence) => void;
}

export function IntelligenceMap({
  scenes = [],
  vessels = [],
  iceRegions = [],
  onSelectScene,
  onSelectVessel
}: IntelligenceMapProps) {
  const { resolvedTheme } = useTheme();

  // Polar Stereographic centered view over Prydz Bay / Davis Sea
  const [viewState, setViewState] = useState({
    longitude: 77.96,
    latitude: -68.57,
    zoom: 3.5,
    pitch: 25,
    bearing: 0
  });

  // Toggleable Layer States as specified in Section 7
  const [layerControls, setLayerControls] = useState({
    vessels: true,
    stations: true,
    routes: true,
    footprints: true,
    seaIce: true,
    weather: false,
    wind: false,
    ocean: false,
    riskZones: true,
    historicalScenes: false
  });

  const [selectedEntity, setSelectedEntity] = useState<any>(null);

  // Antarctic Stations
  const stations = [
    { id: 'st_davis', name: 'Davis Station (AU)', lat: -68.57, lon: 77.96, status: 'Active Research', fuel_days: 184, personnel: 42 },
    { id: 'st_maitri', name: 'Maitri Station (IN)', lat: -70.76, lon: 11.73, status: 'Active Research', fuel_days: 140, personnel: 25 },
    { id: 'st_bharati', name: 'Bharati Station (IN)', lat: -69.40, lon: 76.19, status: 'Active Research', fuel_days: 210, personnel: 30 },
    { id: 'st_mcmurdo', name: 'McMurdo Station (US)', lat: -77.85, lon: 166.66, status: 'Logistics Hub', fuel_days: 320, personnel: 250 },
    { id: 'st_casey', name: 'Casey Station (AU)', lat: -66.28, lon: 110.52, status: 'Active Research', fuel_days: 165, personnel: 35 },
    { id: 'st_neumayer', name: 'Neumayer III (DE)', lat: -70.66, lon: -8.26, status: 'Active Research', fuel_days: 190, personnel: 28 }
  ];

  // Route GeoJSON
  const routesGeoJSON: any = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: 'Cape Town -> Davis Station (Active Fairway)', risk: 'HIGH' },
        geometry: {
          type: 'LineString',
          coordinates: [
            [18.42, -33.92], // Cape Town
            [55.0, -52.0],
            [70.0, -62.0],
            [76.92, -67.84], // Polar Star Position
            [77.96, -68.57]  // Davis Station
          ]
        }
      },
      {
        type: 'Feature',
        properties: { name: 'Alternate Sector 4 Lead Bypass (AI Recommended)', risk: 'LOW' },
        geometry: {
          type: 'LineString',
          coordinates: [
            [76.92, -67.84], // From Polar Star
            [78.50, -67.20], // Sector 4 Open Polyna Lead
            [79.20, -67.90],
            [77.96, -68.57]  // Davis Station
          ]
        }
      },
      {
        type: 'Feature',
        properties: { name: 'Hobart -> Casey Station', risk: 'LOW' },
        geometry: {
          type: 'LineString',
          coordinates: [
            [147.32, -42.88], // Hobart
            [125.0, -55.0],
            [108.65, -65.42], // Aurora Explorer
            [110.52, -66.28]  // Casey
          ]
        }
      }
    ]
  };

  // Sea-ice hazard polygons GeoJSON
  const seaIceGeoJSON: any = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: 'Prydz Bay Heavy Pack Ridge (78% SIC)', risk: 'HIGH' },
        geometry: {
          type: 'Polygon',
          coordinates: [[[74.0, -69.2], [80.5, -69.2], [80.5, -67.0], [74.0, -67.0], [74.0, -69.2]]]
        }
      },
      {
        type: 'Feature',
        properties: { name: 'Ross Sea First-Year Pack', risk: 'MEDIUM' },
        geometry: {
          type: 'Polygon',
          coordinates: [[[163.0, -78.8], [171.0, -78.8], [171.0, -75.8], [163.0, -75.8], [163.0, -78.8]]]
        }
      }
    ]
  };

  const toggleLayer = (layer: keyof typeof layerControls) => {
    setLayerControls(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <div className="relative w-full h-[640px] bg-slate-100 dark:bg-[#020617] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-2xl transition-colors duration-150">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle={
          resolvedTheme === 'light'
            ? 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
            : 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
        }
        mapLib={maplibregl as any}
      >
        <NavigationControl position="top-right" />

        {/* Sea Ice Layer */}
        {layerControls.seaIce && (
          <Source id="sea-ice-source" type="geojson" data={seaIceGeoJSON}>
            <Layer
              id="sea-ice-fill"
              type="fill"
              paint={{
                'fill-color': '#06b6d4',
                'fill-opacity': 0.18
              }}
            />
            <Layer
              id="sea-ice-outline"
              type="line"
              paint={{
                'line-color': '#06b6d4',
                'line-width': 1.8,
                'line-dasharray': [3, 2]
              }}
            />
          </Source>
        )}

        {/* Shipping Routes */}
        {layerControls.routes && (
          <Source id="routes-source" type="geojson" data={routesGeoJSON}>
            <Layer
              id="routes-line"
              type="line"
              paint={{
                'line-color': [
                  'case',
                  ['==', ['get', 'risk'], 'HIGH'], '#ef4444',
                  '#3b82f6'
                ],
                'line-width': 2.5,
                'line-dasharray': [2, 1]
              }}
            />
          </Source>
        )}

        {/* Satellite Acquisition Footprints (Section 7) */}
        {layerControls.footprints && scenes.map(scene => {
          if (!scene.bbox) return null;
          const [minLon, minLat, maxLon, maxLat] = scene.bbox;
          const centerLon = (minLon + maxLon) / 2;
          const centerLat = (minLat + maxLat) / 2;

          return (
            <Marker key={scene.id} longitude={centerLon} latitude={centerLat}>
              <div 
                onClick={() => {
                  setSelectedEntity({ type: 'SCENE', data: scene });
                  onSelectScene && onSelectScene(scene);
                }}
                className="cursor-pointer group flex flex-col items-center"
              >
                <div className={`p-1.5 rounded-md border text-xs shadow-lg transition-transform group-hover:scale-125 flex items-center gap-1 ${
                  scene.family === 'SAR' 
                    ? 'bg-blue-600/80 border-blue-400 text-white' 
                    : 'bg-emerald-600/80 border-emerald-400 text-white'
                }`}>
                  <Satellite className="w-3.5 h-3.5" />
                  <span className="font-mono text-[10px] font-bold">{scene.satellite}</span>
                </div>
                
                {/* Footprint Metadata Badge */}
                <div className="bg-[#0f172a]/95 border border-slate-700 rounded p-1.5 text-[10px] text-slate-700 dark:text-slate-300 mt-1 shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                  <div className="font-bold text-white">{scene.satellite} ({scene.family})</div>
                  <div>Sensor: <span className="text-cyan-400 font-mono">{scene.sensor}</span></div>
                  <div>Res: <span className="font-mono">{scene.resolution}</span> | Cloud: <span className="font-mono">{scene.cloud_cover}%</span></div>
                  <div>Status: <span className="text-emerald-400 font-mono">{scene.processing_status}</span></div>
                  <div className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5">Acquired: {scene.data_freshness}</div>
                </div>
              </div>
            </Marker>
          );
        })}

        {/* Vessels (Section 7) */}
        {layerControls.vessels && vessels.map(vessel => (
          <Marker key={vessel.id} longitude={vessel.current_lon} latitude={vessel.current_lat}>
            <div 
              onClick={() => {
                setSelectedEntity({ type: 'VESSEL', data: vessel });
                onSelectVessel && onSelectVessel(vessel);
              }}
              className="cursor-pointer group flex flex-col items-center"
            >
              <div className={`p-2 rounded-full border shadow-xl transition-transform group-hover:scale-125 ${
                vessel.route_risk_level === 'HIGH' || vessel.route_risk_level === 'CRITICAL'
                  ? 'bg-red-600 text-white border-red-300 ring-4 ring-red-500/30 animate-pulse'
                  : 'bg-blue-600 text-white border-blue-300 ring-2 ring-blue-500/20'
              }`}>
                <Ship className="w-4 h-4" />
              </div>
              <div className="bg-[#0f172a]/90 border border-slate-700 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-900 dark:text-white mt-1 shadow-md whitespace-nowrap">
                {vessel.name} {vessel.predicted_delay_hours > 0 && <span className="text-red-400 font-mono text-[10px]">+{vessel.predicted_delay_hours}h</span>}
              </div>
            </div>
          </Marker>
        ))}

        {/* Stations (Section 7) */}
        {layerControls.stations && stations.map(station => (
          <Marker key={station.id} longitude={station.lon} latitude={station.lat}>
            <div 
              onClick={() => setSelectedEntity({ type: 'STATION', data: station })}
              className="cursor-pointer group flex flex-col items-center"
            >
              <div className="p-1.5 rounded-md bg-amber-600/90 text-white border border-amber-400 shadow-md">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-700 dark:text-slate-300 mt-0.5 whitespace-nowrap">
                {station.name}
              </div>
            </div>
          </Marker>
        ))}
      </Map>

      {/* Floating Layer Controls Panel (Section 7) */}
      <div className="absolute top-4 left-4 bg-[#0f172a]/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-2xl z-20 w-56 text-xs">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800 font-bold text-white uppercase tracking-wider text-[11px]">
          <div className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-blue-400" />
            <span>Map Layers</span>
          </div>
          <span className="text-[10px] font-mono text-cyan-400">GIS 3031</span>
        </div>

        <div className="space-y-1.5">
          {[
            { key: 'vessels', label: 'Vessels', color: 'text-blue-400' },
            { key: 'stations', label: 'Stations', color: 'text-amber-400' },
            { key: 'routes', label: 'Routes & Fairways', color: 'text-indigo-400' },
            { key: 'footprints', label: 'Satellite Footprints', color: 'text-cyan-400' },
            { key: 'seaIce', label: 'Sea Ice Contours', color: 'text-cyan-300' },
            { key: 'weather', label: 'Weather / Gale Zones', color: 'text-amber-300' },
            { key: 'wind', label: 'Wind Vector Grids', color: 'text-emerald-400' },
            { key: 'ocean', label: 'Oceanographic Currents', color: 'text-blue-300' },
            { key: 'riskZones', label: 'Operational Risk Zones', color: 'text-red-400' },
            { key: 'historicalScenes', label: 'Historical Scenes', color: 'text-purple-400' }
          ].map(item => {
            const isChecked = layerControls[item.key as keyof typeof layerControls];
            return (
              <div
                key={item.key}
                onClick={() => toggleLayer(item.key as keyof typeof layerControls)}
                className="flex items-center justify-between p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer select-none"
              >
                <div className="flex items-center gap-2">
                  {isChecked ? (
                    <CheckSquare className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 dark:text-slate-600" />
                  )}
                  <span className={`text-[11px] ${isChecked ? 'text-slate-900 dark:text-slate-200 font-medium' : 'text-slate-500'}`}>
                    {item.label}
                  </span>
                </div>
                <span className={`w-1.5 h-1.5 rounded-full ${isChecked ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}></span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Entity Card Drawer */}
      {selectedEntity && (
        <div className="absolute bottom-4 right-4 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-xl dark:shadow-2xl z-20 w-80 text-xs text-slate-700 dark:text-slate-300">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              {selectedEntity.type === 'SCENE' && 'Satellite Acquisition'}
              {selectedEntity.type === 'VESSEL' && 'Fleet Vessel Telemetry'}
              {selectedEntity.type === 'STATION' && 'Antarctic Station Vitals'}
            </span>
            <button 
              onClick={() => setSelectedEntity(null)} 
              className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white font-mono text-sm"
            >
              ✕
            </button>
          </div>

          {selectedEntity.type === 'SCENE' && (
            <div className="space-y-2">
              <div className="font-bold text-sm text-cyan-400">{selectedEntity.data.satellite}</div>
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">{selectedEntity.data.scene_id}</div>
              <div className="grid grid-cols-2 gap-1 text-[11px] pt-1">
                <div>Sensor: <span className="text-white">{selectedEntity.data.sensor}</span></div>
                <div>Family: <span className="text-white">{selectedEntity.data.family}</span></div>
                <div>Resolution: <span className="text-white">{selectedEntity.data.resolution}</span></div>
                <div>Cloud: <span className="text-white">{selectedEntity.data.cloud_cover}%</span></div>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => onSelectScene && onSelectScene(selectedEntity.data)}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white font-semibold py-1.5 rounded text-xs transition"
                >
                  VIEW FULL SCENE DETAILS
                </button>
              </div>
            </div>
          )}

          {selectedEntity.type === 'VESSEL' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-white">{selectedEntity.data.name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                  {selectedEntity.data.route_risk_level} RISK
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">{selectedEntity.data.route}</div>
              <div className="grid grid-cols-2 gap-1 text-[11px] pt-1">
                <div>Speed: <span className="text-white font-mono">{selectedEntity.data.speed_knots} kt</span></div>
                <div>Delay: <span className="text-red-400 font-mono font-bold">+{selectedEntity.data.predicted_delay_hours}h</span></div>
                <div>Ice: <span className="text-cyan-400">{selectedEntity.data.nearby_ice?.concentration_pct}%</span></div>
                <div>Confidence: <span className="text-purple-400">{selectedEntity.data.ai_confidence_pct}%</span></div>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => onSelectVessel && onSelectVessel(selectedEntity.data)}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white font-semibold py-1.5 rounded text-xs transition"
                >
                  INSPECT VESSEL FUSION
                </button>
              </div>
            </div>
          )}

          {selectedEntity.type === 'STATION' && (
            <div className="space-y-2">
              <div className="font-bold text-sm text-amber-400">{selectedEntity.data.name}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Position: {selectedEntity.data.lat}°S, {selectedEntity.data.lon}°E</div>
              <div className="grid grid-cols-2 gap-1 text-[11px] pt-1">
                <div>Fuel Days: <span className="text-white font-mono">{selectedEntity.data.fuel_days}d</span></div>
                <div>Personnel: <span className="text-white font-mono">{selectedEntity.data.personnel}</span></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
