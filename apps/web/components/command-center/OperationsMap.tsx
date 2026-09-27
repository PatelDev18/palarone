"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Ship,
  MapPin,
  Wind,
  Snowflake,
  Satellite,
  Compass,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  AlertTriangle,
  Info,
  Radio,
  Eye,
  Shield,
  LifeBuoy,
  Clock,
  Globe2,
  Sparkles
} from 'lucide-react';
import {
  Vessel,
  Station,
  WeatherIntelligence,
  SeaIceIntelligence,
  SatelliteObservation,
  RouteItem,
  LayerConfig,
  RegionFilter,
  TimeHorizon
} from '@/types/command-center';
import {
  SECTOR_DEFINITIONS,
  ProjectedVessel,
  isEntityInRegion
} from '@/lib/utils/projections';

interface OperationsMapProps {
  vessels: (Vessel | ProjectedVessel)[];
  stations: Station[];
  weather: WeatherIntelligence;
  seaIce: SeaIceIntelligence;
  satellites: SatelliteObservation[];
  routes: RouteItem[];
  layers: LayerConfig;
  selectedEntityId: string | null;
  selectedEntityType: 'VESSEL' | 'STATION' | null;
  onSelectVessel: (vessel: Vessel) => void;
  onSelectStation: (station: Station) => void;
  selectedRegion: RegionFilter;
  onRegionChange?: (region: RegionFilter) => void;
  timeHorizon?: TimeHorizon;
  onTimeHorizonChange?: (horizon: TimeHorizon) => void;
}

// Antarctic Polar Stereographic Projection Mathematics (Standard WGS84 South Polar)
// Maps latitude (-90° to -50°) and longitude (-180° to +180°) to 2D Cartesian SVG space
function projectPolarStereographic(
  lat: number,
  lon: number,
  centerX: number,
  centerY: number,
  radiusScale: number,
  rotationDeg = 0
): { x: number; y: number } {
  // Constrain to Southern Hemisphere
  const clampedLat = Math.min(-50, Math.max(-90, lat));
  // Polar distance: 0 at South Pole (-90°), 1 at -50°
  const rNorm = (90 + clampedLat) / 40.0;
  const radius = rNorm * radiusScale;

  const thetaRad = ((lon + rotationDeg) * Math.PI) / 180.0;
  const x = centerX + radius * Math.sin(thetaRad);
  const y = centerY - radius * Math.cos(thetaRad);

  return { x, y };
}

export function OperationsMap({
  vessels,
  stations,
  weather,
  seaIce,
  satellites,
  routes,
  layers,
  selectedEntityId,
  selectedEntityType,
  onSelectVessel,
  onSelectStation,
  selectedRegion,
  onRegionChange,
  timeHorizon = 'Live',
  onTimeHorizonChange,
}: OperationsMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Map Navigation State
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [mouseCoords, setMouseCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [showGraticule, setShowGraticule] = useState<boolean>(true);
  const [hoveredEntity, setHoveredEntity] = useState<any>(null);

  // Canvas Geometry Constants
  const SVG_SIZE = 1000;
  const CENTER_X = SVG_SIZE / 2;
  const CENTER_Y = SVG_SIZE / 2;
  const BASE_RADIUS = 420;

  // Zoom controls
  const handleZoomIn = () => setZoom((prev) => Math.min(prev * 1.25, 4.0));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev / 1.25, 0.75));
  const handleReset = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
    onRegionChange?.('All Antarctica');
  };

  // Synchronize pan and zoom smoothly when operator changes selectedRegion
  useEffect(() => {
    if (selectedRegion === 'All Antarctica') {
      setZoom(1.0);
      setPan({ x: 0, y: 0 });
    } else {
      const sector = SECTOR_DEFINITIONS[selectedRegion];
      if (sector) {
        const pt = projectPolarStereographic(
          sector.centerLat,
          sector.centerLon,
          CENTER_X,
          CENTER_Y,
          BASE_RADIUS
        );
        const targetZoom = sector.zoom;
        const targetPanX = -(pt.x - CENTER_X) * targetZoom;
        const targetPanY = -(pt.y - CENTER_Y) * targetZoom;
        setZoom(targetZoom);
        setPan({ x: targetPanX, y: targetPanY });
      }
    }
  }, [selectedRegion]);

  // Pan controls
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }

    // Inverse projection to approximate Lat/Lon under mouse
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      // Normalize into SVG coordinates
      const svgX = ((clientX - rect.width / 2 - pan.x) / (rect.width / 2)) * (SVG_SIZE / 2) / zoom + CENTER_X;
      const svgY = ((clientY - rect.height / 2 - pan.y) / (rect.height / 2)) * (SVG_SIZE / 2) / zoom + CENTER_Y;

      const dx = svgX - CENTER_X;
      const dy = CENTER_Y - svgY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const rNorm = dist / BASE_RADIUS;
      const calculatedLat = -(90 - rNorm * 40);
      let calculatedLon = (Math.atan2(dx, dy) * 180) / Math.PI;
      if (calculatedLon > 180) calculatedLon -= 360;

      if (calculatedLat <= -50 && calculatedLat >= -90) {
        setMouseCoords({
          lat: parseFloat(calculatedLat.toFixed(2)),
          lon: parseFloat(calculatedLon.toFixed(2)),
        });
      }
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // Continental Antarctic Coastline Coordinates (Realistic Vector Topology)
  const antarcticCoastlinePoints: [number, number][] = useMemo(
    () => [
      [-63.3, -57.0], // Antarctic Peninsula Tip
      [-65.0, -64.0], // Palmer Land
      [-67.5, -68.0], // Alexander Island / Marguerite Bay
      [-73.0, -78.0], // Ronne Entrance
      [-74.0, -100.0], // Walgreen Coast
      [-73.5, -120.0], // Amundsen Sea
      [-74.5, -135.0], // Marie Byrd Land
      [-76.0, -155.0], // Edward VII Peninsula
      [-78.0, 166.0], // McMurdo Sound / Ross Ice Shelf Edge
      [-72.0, 170.0], // Cape Adare / Ross Sea
      [-66.5, 140.0], // Terre Adélie / D'Urville
      [-66.0, 110.0], // Wilkes Land / Casey
      [-67.0, 85.0], // Queen Mary Land
      [-69.4, 76.2], // Larsemann Hills / Bharati
      [-68.5, 78.0], // Prydz Bay / Davis Station
      [-67.0, 60.0], // Mac. Robertson Land / Mawson
      [-68.0, 40.0], // Enderby Land
      [-70.0, 20.0], // Princess Ragnhild Coast
      [-70.7, 11.7], // Schirmacher Oasis / Maitri
      [-70.5, -8.0], // Atka Bay / Neumayer III
      [-75.5, -26.6], // Brunt Ice Shelf / Halley VI
      [-77.5, -45.0], // Filchner Ice Shelf Edge
      [-75.0, -60.0], // Ronne Ice Shelf
      [-63.3, -57.0], // Loop back to Peninsula
    ],
    []
  );

  // Generate SVG Path for Coastline
  const coastlineSvgPath = useMemo(() => {
    const coords = antarcticCoastlinePoints.map(([lat, lon]) =>
      projectPolarStereographic(lat, lon, CENTER_X, CENTER_Y, BASE_RADIUS)
    );
    return coords.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x},${pt.y}`, '') + ' Z';
  }, [antarcticCoastlinePoints]);

  // Generate Ronne and Ross Ice Shelf Polygons
  const rossIceShelfPath = useMemo(() => {
    const pts: [number, number][] = [
      [-78.0, 166.0],
      [-82.0, 180.0],
      [-84.0, -160.0],
      [-81.0, -150.0],
      [-78.5, -165.0],
      [-78.0, 166.0],
    ];
    return pts
      .map(([lat, lon]) => projectPolarStereographic(lat, lon, CENTER_X, CENTER_Y, BASE_RADIUS))
      .reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x},${pt.y}`, '') + ' Z';
  }, []);

  const ronneIceShelfPath = useMemo(() => {
    const pts: [number, number][] = [
      [-75.0, -60.0],
      [-78.0, -50.0],
      [-81.0, -55.0],
      [-82.0, -70.0],
      [-78.0, -75.0],
      [-75.0, -60.0],
    ];
    return pts
      .map(([lat, lon]) => projectPolarStereographic(lat, lon, CENTER_X, CENTER_Y, BASE_RADIUS))
      .reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x},${pt.y}`, '') + ' Z';
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="relative w-full h-full bg-white dark:bg-[#020617] overflow-hidden cursor-crosshair select-none flex items-center justify-center"
    >
      {/* Background Deep Ocean Bathymetric Radials */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#081735_0%,_#020617_75%)] pointer-events-none" />

      {/* Interactive SVG Polar GIS Viewport */}
      <svg
        viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
        className="w-full h-full max-w-full max-h-full select-none"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 550ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <defs>
          {/* Gradients for ice shelves, hazards, and SAR radar */}
          <radialGradient id="polarGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.3" />
            <stop offset="70%" stopColor="#0f172a" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0.9" />
          </radialGradient>

          <pattern id="polarGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeOpacity="0.4" />
          </pattern>

          <linearGradient id="iceHazardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0369a1" stopOpacity="0.15" />
          </linearGradient>

          <linearGradient id="blizzardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#b45309" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id="sarSwathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#7e22ce" stopOpacity="0.1" />
          </linearGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Bathymetry Basin Background */}
        <circle cx={CENTER_X} cy={CENTER_Y} r={BASE_RADIUS + 40} fill="url(#polarGlow)" />

        {/* 1. Polar Graticules (Latitude Circles: 60°S, 70°S, 80°S) */}
        {showGraticule && (
          <g className="graticules pointer-events-none opacity-40">
            {/* Latitude Circles */}
            {[-60, -70, -80].map((lat) => {
              const rNorm = (90 + lat) / 40.0;
              const radius = rNorm * BASE_RADIUS;
              return (
                <g key={lat}>
                  <circle
                    cx={CENTER_X}
                    cy={CENTER_Y}
                    r={radius}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="0.8"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={CENTER_X + 6}
                    y={CENTER_Y - radius + 12}
                    fill="#38bdf8"
                    fontSize="9"
                    fontFamily="monospace"
                    className="opacity-70"
                  >
                    {Math.abs(lat)}°S
                  </text>
                </g>
              );
            })}

            {/* Meridian Radials (every 45 degrees) */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((lon) => {
              const pt = projectPolarStereographic(-50, lon, CENTER_X, CENTER_Y, BASE_RADIUS + 30);
              return (
                <g key={lon}>
                  <line
                    x1={CENTER_X}
                    y1={CENTER_Y}
                    x2={pt.x}
                    y2={pt.y}
                    stroke="#1e293b"
                    strokeWidth="0.8"
                    strokeDasharray="2 4"
                  />
                  <text
                    x={pt.x}
                    y={pt.y}
                    fill="#64748b"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                  >
                    {lon}°
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* Sector Spotlight Radar Ring when a specific region is active */}
        {selectedRegion !== 'All Antarctica' && (() => {
          const sector = SECTOR_DEFINITIONS[selectedRegion];
          if (!sector) return null;
          const centerPt = projectPolarStereographic(sector.centerLat, sector.centerLon, CENTER_X, CENTER_Y, BASE_RADIUS);
          const spotlightRadius = 145;
          return (
            <g className="sector-spotlight pointer-events-none">
              {/* Outer rotating pulse radar ring */}
              <circle
                cx={centerPt.x}
                cy={centerPt.y}
                r={spotlightRadius + 22}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.2"
                strokeDasharray="6 6"
                className="animate-spin opacity-40"
                style={{ transformOrigin: `${centerPt.x}px ${centerPt.y}px`, animationDuration: '28s' }}
              />
              {/* Main sector radar glow */}
              <circle
                cx={centerPt.x}
                cy={centerPt.y}
                r={spotlightRadius}
                fill="#0284c7"
                fillOpacity="0.09"
                stroke="#0ea5e9"
                strokeWidth="2"
                strokeDasharray="4 2"
                filter="url(#glow)"
              />
              {/* Sector Name Banner on map */}
              <g transform={`translate(${centerPt.x}, ${centerPt.y - spotlightRadius - 12})`}>
                <rect x={-90} y={-12} width={180} height={20} rx={4} fill="#090d16" stroke="#0ea5e9" strokeWidth="1" />
                <text x={0} y={1} fill="#38bdf8" fontSize="8.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle" alignmentBaseline="middle">
                  {sector.name.toUpperCase()}
                </text>
              </g>
            </g>
          );
        })()}

        {/* 2. Sea-Ice Layer (AMSR2 / CryoSat-2 Contours) */}
        {layers.seaIce && (
          <g className="sea-ice-layer">
            {/* Outer Pack Ice Fringe Circle */}
            <circle
              cx={CENTER_X}
              cy={CENTER_Y}
              r={BASE_RADIUS * 0.88}
              fill="none"
              stroke="#0284c7"
              strokeWidth="2.5"
              strokeDasharray="6 3"
              opacity="0.6"
            />
            <text
              x={CENTER_X + BASE_RADIUS * 0.72}
              y={CENTER_Y + 14}
              fill="#38bdf8"
              fontSize="9"
              fontFamily="monospace"
              className="opacity-80"
            >
              ICE EDGE BOUNDARY (AMSR2)
            </text>

            {/* Weddell Sea Ice Compression Hazard Polygon */}
            {seaIce.hazard_zones.map((hz) => {
              const pts = hz.coordinates.map(([lat, lon]) =>
                projectPolarStereographic(lat, lon, CENTER_X, CENTER_Y, BASE_RADIUS)
              );
              const pathD = pts.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`, '') + ' Z';
              return (
                <g key={hz.zone_id}>
                  <path
                    d={pathD}
                    fill="url(#iceHazardGrad)"
                    stroke="#38bdf8"
                    strokeWidth="1.2"
                    strokeDasharray="4 2"
                    className="cursor-pointer hover:opacity-100 transition-opacity"
                    onMouseEnter={() => setHoveredEntity({ title: hz.name, desc: `${hz.concentration_pct}% Concentration • ${hz.drift_vector}` })}
                    onMouseLeave={() => setHoveredEntity(null)}
                  />
                  {pts[0] && (
                    <text
                      x={pts[0].x}
                      y={pts[0].y - 6}
                      fill="#7dd3fc"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {hz.name.toUpperCase()} ({hz.concentration_pct}%)
                    </text>
                  )}
                </g>
              );
            })}

            {/* Iceberg Markers (A-23A & B-22A) */}
            {seaIce.iceberg_tracking.map((iceberg) => {
              const pt = projectPolarStereographic(iceberg.lat, iceberg.lon, CENTER_X, CENTER_Y, BASE_RADIUS);
              return (
                <g
                  key={iceberg.id}
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredEntity({ title: `Giant Iceberg ${iceberg.id}`, desc: `${iceberg.area_sqkm} km² • Drift: ${iceberg.drift}` })}
                  onMouseLeave={() => setHoveredEntity(null)}
                >
                  <polygon
                    points={`${pt.x},${pt.y - 6} ${pt.x + 6},${pt.y} ${pt.x},${pt.y + 6} ${pt.x - 6},${pt.y}`}
                    fill="#38bdf8"
                    stroke="#ffffff"
                    strokeWidth="1"
                    filter="url(#glow)"
                  />
                  <text
                    x={pt.x + 9}
                    y={pt.y + 3}
                    fill="#e0f2fe"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {iceberg.id}
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* 3. Antarctic Continent Landmass (Realistic PostGIS Boundary) */}
        <g className="continent">
          {/* Continental Base */}
          <path
            d={coastlineSvgPath}
            fill="#0f172a"
            stroke="#475569"
            strokeWidth="1.8"
            className="transition-colors duration-300"
          />

          {/* Permanent Ice Shelves (Ross & Ronne) */}
          <path d={rossIceShelfPath} fill="#1e293b" stroke="#334155" strokeWidth="1" opacity="0.8" />
          <path d={ronneIceShelfPath} fill="#1e293b" stroke="#334155" strokeWidth="1" opacity="0.8" />

          {/* Ice Shelf Labels */}
          {(() => {
            const rossPt = projectPolarStereographic(-80, 180, CENTER_X, CENTER_Y, BASE_RADIUS);
            const ronnePt = projectPolarStereographic(-78, -60, CENTER_X, CENTER_Y, BASE_RADIUS);
            return (
              <>
                <text x={rossPt.x} y={rossPt.y} fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="middle">
                  ROSS ICE SHELF
                </text>
                <text x={ronnePt.x} y={ronnePt.y} fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="middle">
                  RONNE ICE SHELF
                </text>
              </>
            );
          })()}

          {/* Geographic South Pole Marker (90°S) */}
          <g>
            <circle cx={CENTER_X} cy={CENTER_Y} r={4} fill="#f43f5e" />
            <circle cx={CENTER_X} cy={CENTER_Y} r={10} fill="none" stroke="#f43f5e" strokeWidth="1" strokeDasharray="2 2" className="animate-spin" />
            <text x={CENTER_X + 12} y={CENTER_Y + 3} fill="#f43f5e" fontSize="9" fontFamily="monospace" fontWeight="bold">
              SOUTH POLE (90°S)
            </text>
          </g>
        </g>

        {/* 4. Weather Overlays (Blizzard Polygons & Wind Streamlines) */}
        {layers.weather && (
          <g className="weather-layer pointer-events-none">
            {weather.active_blizzard_zones.map((bz) => {
              const pts = bz.polygon.map(([lat, lon]) =>
                projectPolarStereographic(lat, lon, CENTER_X, CENTER_Y, BASE_RADIUS)
              );
              const pathD = pts.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`, '') + ' Z';
              return (
                <g key={bz.zone_id} className="pointer-events-auto">
                  <path
                    d={pathD}
                    fill="url(#blizzardGrad)"
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    strokeDasharray="5 3"
                    onMouseEnter={() => setHoveredEntity({ title: bz.region, desc: `Blizzard Alert: ${bz.winds_knots} kt winds • Vis: ${bz.visibility_km} km` })}
                    onMouseLeave={() => setHoveredEntity(null)}
                  />
                  {pts[0] && (
                    <text x={pts[0].x} y={pts[0].y - 5} fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      GALE: {bz.winds_knots} KT
                    </text>
                  )}
                </g>
              );
            })}

            {/* Wind Vector Vectors */}
            {weather.observation_points.map((obs, idx) => {
              const pt = projectPolarStereographic(obs.lat, obs.lon, CENTER_X, CENTER_Y, BASE_RADIUS);
              const angleRad = (obs.wind_deg * Math.PI) / 180;
              const len = Math.min(obs.wind_kt * 0.6, 24);
              const dx = len * Math.sin(angleRad);
              const dy = -len * Math.cos(angleRad);
              return (
                <g key={idx} opacity="0.75">
                  <line
                    x1={pt.x}
                    y1={pt.y}
                    x2={pt.x + dx}
                    y2={pt.y + dy}
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle cx={pt.x + dx} cy={pt.y + dy} r={1.5} fill="#38bdf8" />
                </g>
              );
            })}
          </g>
        )}

        {/* 5. Satellite Footprints (SAR Swaths & Optical Passes) */}
        {layers.satellite && (
          <g className="satellite-layer">
            {satellites.map((sat) => {
              const pts = sat.swath_polygon.map(([lat, lon]) =>
                projectPolarStereographic(lat, lon, CENTER_X, CENTER_Y, BASE_RADIUS)
              );
              const pathD = pts.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`, '') + ' Z';
              return (
                <g
                  key={sat.observation_id}
                  className="cursor-pointer hover:opacity-100 transition-opacity"
                  onMouseEnter={() => setHoveredEntity({ title: `${sat.satellite_name} (${sat.sensor_type})`, desc: `${sat.data_freshness} • Res: ${sat.resolution}` })}
                  onMouseLeave={() => setHoveredEntity(null)}
                >
                  <path
                    d={pathD}
                    fill="url(#sarSwathGrad)"
                    stroke="#c084fc"
                    strokeWidth="1.2"
                    strokeDasharray="4 2"
                  />
                  {pts[0] && (
                    <text x={pts[0].x} y={pts[0].y - 6} fill="#e9d5ff" fontSize="9" fontFamily="monospace">
                      {sat.satellite_name} SAR [10m]
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        )}

        {/* 6. Shipping Routes & Waypoints */}
        {layers.routes && (
          <g className="routes-layer pointer-events-none">
            {vessels.map((v) => {
              if (!v.coordinates_trail) return null;

              // Planned Route
              const plannedPts = v.coordinates_trail.planned_route.map(([lat, lon]) =>
                projectPolarStereographic(lat, lon, CENTER_X, CENTER_Y, BASE_RADIUS)
              );
              const plannedPath = plannedPts.reduce(
                (acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`,
                ''
              );

              // Predicted Alternate Route (OR-Tools Diversion)
              const alternatePts = v.coordinates_trail.predicted_alternate_route.map(([lat, lon]) =>
                projectPolarStereographic(lat, lon, CENTER_X, CENTER_Y, BASE_RADIUS)
              );
              const alternatePath = alternatePts.reduce(
                (acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`,
                ''
              );

              // Historical Trail
              const prevPts = v.coordinates_trail.previous.map(([lat, lon]) =>
                projectPolarStereographic(lat, lon, CENTER_X, CENTER_Y, BASE_RADIUS)
              );
              const prevPath = prevPts.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`, '');

              return (
                <g key={`route-${v.id}`}>
                  {/* Historical Track */}
                  <path
                    d={prevPath}
                    fill="none"
                    stroke="#475569"
                    strokeWidth="1.2"
                    strokeDasharray="2 3"
                    opacity="0.6"
                  />
                  {/* Planned Route */}
                  <path
                    d={plannedPath}
                    fill="none"
                    stroke={v.status === 'DELAYED' ? '#f59e0b' : '#3b82f6'}
                    strokeWidth="1.8"
                    strokeDasharray={v.status === 'DELAYED' ? '6 4' : 'none'}
                    opacity="0.75"
                  />
                  {/* AI Alternate Route if Delayed */}
                  {v.status === 'DELAYED' && (
                    <path
                      d={alternatePath}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.2"
                      strokeDasharray="3 3"
                      filter="url(#glow)"
                      opacity="0.9"
                    />
                  )}
                </g>
              );
            })}
          </g>
        )}

        {/* 7. Search & Rescue (SAR) Grid Layer */}
        {layers.sar && (
          <g className="sar-layer pointer-events-none opacity-50">
            {/* Ushuaia MRCC Antarctic Sector Boundary */}
            <circle cx={CENTER_X} cy={CENTER_Y} r={BASE_RADIUS * 0.95} fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="8 8" />
            <text x={CENTER_X + 20} y={CENTER_Y - BASE_RADIUS * 0.95 + 14} fill="#f87171" fontSize="9" fontFamily="monospace">
              SAR ZONE 1: SOUTHERN OCEAN RESCUE GRID
            </text>
          </g>
        )}

        {/* 8. Antarctic Stations Layer */}
        {layers.stations && (
          <g className="stations-layer">
            {stations.map((st) => {
              const inSector = isEntityInRegion(st.lat, st.lon, selectedRegion, st.id);
              const pt = projectPolarStereographic(st.lat, st.lon, CENTER_X, CENTER_Y, BASE_RADIUS);
              const isSelected = selectedEntityType === 'STATION' && selectedEntityId === st.id;

              const statusColor =
                st.connectivity === 'ONLINE'
                  ? '#10b981'
                  : st.connectivity === 'DEGRADED'
                  ? '#f59e0b'
                  : st.connectivity === 'STALE'
                  ? '#fbbf24'
                  : '#ef4444';

              return (
                <g
                  key={st.id}
                  transform={`translate(${pt.x}, ${pt.y})`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectStation(st);
                  }}
                  className={`cursor-pointer group transition-opacity duration-300 ${
                    !inSector ? 'opacity-30 hover:opacity-100' : 'opacity-100'
                  }`}
                  onMouseEnter={() =>
                    setHoveredEntity({
                      title: st.name,
                      desc: `${st.country} • Pop: ${st.population} • Comms: ${st.connectivity} • Temp: ${st.current_weather.temperature_c}°C`,
                    })
                  }
                  onMouseLeave={() => setHoveredEntity(null)}
                >
                  {/* Selection pulse ring */}
                  {isSelected && (
                    <circle cx={0} cy={0} r={14} fill="none" stroke="#38bdf8" strokeWidth="2" className="animate-ping opacity-75" />
                  )}

                  {/* Outer status ring */}
                  <circle cx={0} cy={0} r={7} fill="#090d16" stroke={statusColor} strokeWidth="2" />
                  {/* Inner dot */}
                  <circle cx={0} cy={0} r={3.5} fill={statusColor} />

                  {/* Station Label */}
                  <text
                    x={9}
                    y={3}
                    fill="#f1f5f9"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                    className="group-hover:fill-cyan-300 transition-colors pointer-events-none drop-shadow-md"
                  >
                    {st.name}
                  </text>
                  <text
                    x={9}
                    y={13}
                    fill="#94a3b8"
                    fontSize="8"
                    fontFamily="monospace"
                    className="pointer-events-none"
                  >
                    {st.country} • {st.population}p
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* 9. Fleet Vessels Layer (AIS Tracking & Predictive Horizon Projections) */}
        {layers.vessels && (
          <g className="vessels-layer">
            {vessels.map((v: any) => {
              const inSector = isEntityInRegion(v.current_lat, v.current_lon, selectedRegion, v.id);
              const pt = projectPolarStereographic(v.current_lat, v.current_lon, CENTER_X, CENTER_Y, BASE_RADIUS);
              const isSelected = selectedEntityType === 'VESSEL' && selectedEntityId === v.id;
              const isProjected = timeHorizon !== 'Live' && v.live_lat !== undefined && (v.live_lat !== v.current_lat || v.live_lon !== v.current_lon);
              const livePt = v.live_lat !== undefined ? projectPolarStereographic(v.live_lat, v.live_lon, CENTER_X, CENTER_Y, BASE_RADIUS) : pt;

              const markerColor =
                v.status === 'NORMAL'
                  ? '#10b981' // Green
                  : v.status === 'ATTENTION'
                  ? '#eab308' // Yellow
                  : v.status === 'DELAYED'
                  ? '#f97316' // Orange
                  : v.status === 'CRITICAL'
                  ? '#ef4444' // Red
                  : '#94a3b8'; // Gray (Stale)

              return (
                <g
                  key={v.id}
                  className={`transition-opacity duration-300 ${!inSector ? 'opacity-30 hover:opacity-100' : 'opacity-100'}`}
                >
                  {/* Projected Vector Line connecting Live position to Forecast position */}
                  {isProjected && (
                    <g className="projection-vector pointer-events-none">
                      <line
                        x1={livePt.x}
                        y1={livePt.y}
                        x2={pt.x}
                        y2={pt.y}
                        stroke="#06b6d4"
                        strokeWidth="2"
                        strokeDasharray="4 3"
                        className="animate-pulse"
                      />
                      {/* Ghost live AIS marker */}
                      <circle cx={livePt.x} cy={livePt.y} r={6} fill="#0b1329" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.8" />
                      <circle cx={livePt.x} cy={livePt.y} r={2} fill="#06b6d4" opacity="0.9" />
                      <text x={livePt.x + 8} y={livePt.y - 3} fill="#67e8f9" fontSize="7.5" fontFamily="monospace" opacity="0.85">
                        Live AIS (T+0)
                      </text>
                    </g>
                  )}

                  {/* Active Vessel Marker at current/projected coordinate */}
                  <g
                    transform={`translate(${pt.x}, ${pt.y})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectVessel(v);
                    }}
                    className="cursor-pointer group"
                    onMouseEnter={() =>
                      setHoveredEntity({
                        title: `${v.name} ${isProjected ? `(${timeHorizon} Horizon)` : ''}`,
                        desc: v.forecast_note || `Speed: ${v.speed_knots} kt • Dest: ${v.destination} • Status: ${v.status} • Delay: +${v.expected_delay_hours}h`,
                      })
                    }
                    onMouseLeave={() => setHoveredEntity(null)}
                  >
                    {/* Sector Highlight Ring when focused */}
                    {selectedRegion !== 'All Antarctica' && inSector && (
                      <circle cx={0} cy={0} r={22} fill="none" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="3 3" className="animate-spin" style={{ animationDuration: '8s' }} />
                    )}

                    {/* Selection Pulsing Target */}
                    {isSelected && (
                      <circle cx={0} cy={0} r={18} fill="none" stroke="#38bdf8" strokeWidth="2.5" className="animate-ping opacity-80" />
                    )}

                    {/* Heading Vector Arrow */}
                    <g transform={`rotate(${v.heading_degrees})`}>
                      <line x1={0} y1={0} x2={0} y2={-16} stroke={markerColor} strokeWidth="2" strokeLinecap="round" />
                      <polygon points="0,-18 -3,-13 3,-13" fill={markerColor} />
                    </g>

                    {/* Vessel Hull Diamond */}
                    <polygon
                      points="0,-8 6,0 0,8 -6,0"
                      fill="#0f172a"
                      stroke={markerColor}
                      strokeWidth="2.2"
                      filter="url(#glow)"
                    />
                    <circle cx={0} cy={0} r={2.5} fill={markerColor} />

                    {/* Time Projection Horizon Badge */}
                    {isProjected && (
                      <g transform="translate(10, -14)">
                        <rect x={0} y={-8} width={72} height={12} rx={2} fill="#083344" stroke="#06b6d4" strokeWidth="0.8" />
                        <text x={4} y={1} fill="#67e8f9" fontSize="7" fontFamily="monospace" fontWeight="bold">
                          +{timeHorizon.toUpperCase()} FORECAST
                        </text>
                      </g>
                    )}

                    {/* Vessel Name Label */}
                    <text
                      x={10}
                      y={-3}
                      fill="#f8fafc"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                      className="group-hover:fill-cyan-300 transition-colors pointer-events-none drop-shadow-md"
                    >
                      {v.name}
                    </text>
                    <text
                      x={10}
                      y={8}
                      fill="#94a3b8"
                      fontSize="8.5"
                      fontFamily="monospace"
                      className="pointer-events-none"
                    >
                      {v.speed_knots} kt • {v.destination}
                    </text>
                    {v.expected_delay_hours > 2 && (
                      <text
                        x={10}
                        y={18}
                        fill="#f97316"
                        fontSize="8"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        DELAY: +{v.expected_delay_hours}h
                      </text>
                    )}
                  </g>
                </g>
              );
            })}
          </g>
        )}
      </svg>

      {/* Floating Top Center: Predictive Simulation HUD (when horizon !== Live) */}
      {timeHorizon !== 'Live' && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-cyan-950/95 border border-cyan-500/80 px-3.5 py-1.5 rounded-lg shadow-2xl backdrop-blur-md z-30 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '12s' }} />
            <div>
              <div className="text-xs font-bold font-mono text-cyan-200 flex items-center gap-2">
                SIMULATION HORIZON: +{timeHorizon.toUpperCase()}
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                  PREDICTIVE
                </span>
              </div>
              <div className="text-[10px] text-cyan-300/80 font-mono">
                Vessels projected along dynamic ice routing & synoptic drift vectors
              </div>
            </div>
          </div>
          {onTimeHorizonChange && (
            <button
              onClick={() => onTimeHorizonChange('Live')}
              className="ml-2 px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold flex items-center gap-1 shadow-md transition-all cursor-pointer"
              title="Return to real-time live telemetry"
            >
              <RotateCcw className="w-3 h-3" />
              Return to Live
            </button>
          )}
        </div>
      )}

      {/* Floating Top Left: Sector Focus HUD (when selectedRegion !== All Antarctica) */}
      {selectedRegion !== 'All Antarctica' && (() => {
        const sector = SECTOR_DEFINITIONS[selectedRegion];
        return (
          <div className="absolute top-4 left-4 flex items-center gap-2.5 bg-slate-900/95 border border-blue-500/70 px-3 py-1.5 rounded-lg shadow-2xl backdrop-blur-md z-30 animate-in fade-in slide-in-from-left-2 duration-200">
            <Globe2 className="w-4 h-4 text-blue-400 shrink-0" />
            <div>
              <div className="text-xs font-bold font-mono text-slate-100 flex items-center gap-1.5">
                <span>{sector?.name || selectedRegion}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  SECTOR FOCUS
                </span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                {sector?.subtitle}
              </div>
            </div>
            {onRegionChange && (
              <button
                onClick={() => onRegionChange('All Antarctica')}
                className="ml-2 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-white border border-slate-200 dark:border-slate-700 text-[11px] font-mono transition-all cursor-pointer shrink-0"
                title="Reset view to All Antarctica"
              >
                Reset
              </button>
            )}
          </div>
        );
      })()}

      {/* Floating Hover Context Card */}
      {hoveredEntity && (
        <div className="absolute bottom-14 left-4 max-w-sm bg-slate-900/95 border border-slate-200 dark:border-slate-700 p-2.5 rounded-lg shadow-2xl backdrop-blur-md pointer-events-none z-30 transition-all">
          <div className="font-semibold text-xs text-slate-100 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-blue-400" />
            {hoveredEntity.title}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">{hoveredEntity.desc}</div>
        </div>
      )}

      {/* Floating Map HUD Controls (Zoom, Reset, Graticule) */}
      <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-20">
        <button
          onClick={handleZoomIn}
          className="w-8 h-8 rounded bg-white/95 hover:bg-slate-100 dark:bg-slate-900/90 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-md dark:shadow-lg transition-all"
          title="Zoom In (+)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-8 h-8 rounded bg-white/95 hover:bg-slate-100 dark:bg-slate-900/90 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-md dark:shadow-lg transition-all"
          title="Zoom Out (-)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleReset}
          className="w-8 h-8 rounded bg-white/95 hover:bg-slate-100 dark:bg-slate-900/90 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-md dark:shadow-lg transition-all"
          title="Fit to Antarctica (Reset View)"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={() => setShowGraticule(!showGraticule)}
          className={`w-8 h-8 rounded border flex items-center justify-center shadow-md dark:shadow-lg transition-all ${
            showGraticule
              ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-600/30 dark:border-blue-500/60 dark:text-blue-300'
              : 'bg-white/95 border-slate-200 text-slate-700 dark:bg-slate-900/90 dark:border-slate-200 dark:border-slate-700/80 dark:text-slate-200'
          }`}
          title="Toggle Polar Graticule Lines"
        >
          <Compass className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Floating Coordinate / Projection Readout */}
      <div className="absolute bottom-3 left-4 flex items-center gap-3 text-[11px] font-mono text-slate-600 dark:text-slate-400 bg-white/90 dark:bg-slate-950/80 px-3 py-1 rounded border border-slate-200 dark:border-slate-200 dark:border-slate-800/80 pointer-events-none z-20 backdrop-blur-sm shadow-sm dark:shadow-none">
        <span>PROJ: WGS84 POLAR STEREOGRAPHIC (EPSG:3031)</span>
        <span className="text-slate-500 dark:text-slate-400 dark:text-slate-600">•</span>
        <span>ZOOM: {(zoom * 100).toFixed(0)}%</span>
        {mouseCoords && (
          <>
            <span className="text-slate-500 dark:text-slate-400 dark:text-slate-600">•</span>
            <span className="text-cyan-600 dark:text-cyan-400 font-semibold">
              CURSOR: {Math.abs(mouseCoords.lat)}°S, {Math.abs(mouseCoords.lon)}°{mouseCoords.lon >= 0 ? 'E' : 'W'}
            </span>
          </>
        )}
      </div>

      {/* Map Legend Indicator */}
      <div className="absolute bottom-3 right-4 hidden lg:flex items-center gap-2 text-[10px] font-mono text-slate-600 dark:text-slate-400 bg-white/90 dark:bg-slate-950/80 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-200 dark:border-slate-800/80 z-20 backdrop-blur-sm shadow-sm dark:shadow-none">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Normal
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-yellow-500"></span> Attention
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-orange-500"></span> Delayed
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500"></span> Critical
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500"></span> Stale
        </span>
      </div>
    </div>
  );
}
