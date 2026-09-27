"use client"
import React, { useState, useEffect } from 'react';
import Map, { Marker, Popup, NavigationControl, Source, Layer } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Ship, Anchor, CloudRain, Navigation, MapPin, Activity, Thermometer, Wind, CheckCircle, AlertTriangle } from 'lucide-react';

const INITIAL_VIEW_STATE = {
  longitude: 77.96,
  latitude: -68.57,
  zoom: 3,
  pitch: 30,
  bearing: 0
};

export default function MapView() {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [ships, setShips] = useState<any[]>([]);
  const [stations, setStations] = useState<any[]>([
    { id: 's1', name: 'Davis Station', lon: 77.96, lat: -68.57, status: 'Operational', personnel: 120, fuel_days: 45 },
    { id: 's2', name: 'Maitri Station', lon: 11.73, lat: -70.76, status: 'Maintenance', personnel: 65, fuel_days: 12 },
    { id: 's3', name: 'Bharati Station', lon: 76.19, lat: -69.40, status: 'Operational', personnel: 88, fuel_days: 120 },
  ]);
  const [weatherMarker, setWeatherMarker] = useState<any>(null);
  const [routeData, setRouteData] = useState<any>(null);
  const [selectedEntity, setSelectedEntity] = useState<any>(null);

  useEffect(() => {
    // Initial fetch
    fetch('http://localhost:8000/api/v1/ships')
      .then(res => res.json())
      .then(data => {
        if (data.ships) {
          const mappedShips = data.ships.map((s: any, idx: number) => ({
            ...s,
            lon: s.lon || (70.0 - idx * 10),
            lat: s.lat || (-65.0 + idx * 2),
          }));
          setShips(mappedShips);
        }
      })
      .catch(console.error);

    // Fetch Weather (Phase 33 integration)
    fetch('http://localhost:8000/api/v1/weather/current')
      .then(res => res.json())
      .then(data => {
        if (data.weather) setWeatherMarker(data.weather);
      })
      .catch(console.error);

    // Fake an optimized route (Phase 38 integration) GeoJSON
    setRouteData({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [147.32, -42.88], // Hobart
          [11.73, -70.76],  // Maitri
          [77.96, -68.57]   // Davis (urgent restock)
        ]
      }
    });

    // WebSocket connection for live AIS updates
    let ws: WebSocket;
    let reconnectTimer: NodeJS.Timeout;

    const connectWs = () => {
      ws = new WebSocket('ws://localhost:8000/ws/operations');
      
      ws.onopen = () => {
        console.log("Connected to operations stream");
      };

      ws.onmessage = (event) => {
        const payload = JSON.parse(event.data);
        if (payload.events) {
          setShips(prevShips => {
            let updatedShips = [...prevShips];
            payload.events.forEach((wsEvent: any) => {
              if (wsEvent.type === "AIS_UPDATE") {
                const newData = wsEvent.data;
                const idx = updatedShips.findIndex(s => s.id === newData.ship_id || s.name === newData.name);
                if (idx !== -1) {
                  updatedShips[idx] = { ...updatedShips[idx], lon: newData.longitude, lat: newData.latitude, speed: newData.speed };
                } else {
                  updatedShips.push({ id: newData.ship_id, name: newData.name, lon: newData.longitude, lat: newData.latitude, speed: newData.speed, status: newData.status });
                }
              }
            });
            return updatedShips;
          });
        }
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected. Reconnecting...");
        reconnectTimer = setTimeout(connectWs, 3000);
      };
    };

    connectWs();

    return () => {
      if (ws) ws.close();
      if (reconnectTimer) clearTimeout(reconnectTimer);
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        mapLib={maplibregl as any}
        onClick={() => setSelectedEntity(null)} // Close popup on map click
      >
        <NavigationControl position="top-right" />
        
        {/* Render Ships */}
        {ships.map(ship => (
          <Marker key={ship.id} longitude={ship.lon} latitude={ship.lat}>
            <div 
              className="flex flex-col items-center cursor-pointer group"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedEntity({ type: 'ship', ...ship });
              }}
            >
              <div className={`p-1.5 rounded-full shadow-md transition-transform ${selectedEntity?.id === ship.id ? 'bg-indigo-600 scale-125 ring-4 ring-indigo-200' : 'bg-blue-600 group-hover:scale-110'} text-white`}>
                <Ship size={16} />
              </div>
              <div className="bg-white px-2 py-0.5 rounded shadow text-xs font-semibold mt-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {ship.name}
              </div>
            </div>
          </Marker>
        ))}

        {/* Render Stations */}
        {stations.map(station => (
          <Marker key={station.id} longitude={station.lon} latitude={station.lat}>
            <div 
              className="flex flex-col items-center cursor-pointer group"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedEntity({ type: 'station', ...station });
              }}
            >
              <div className={`p-1.5 rounded shadow-md transition-transform ${selectedEntity?.id === station.id ? 'bg-slate-900 scale-125 ring-4 ring-slate-300' : 'bg-slate-800 group-hover:scale-110'} text-white`}>
                <Anchor size={16} />
              </div>
              <div className="bg-white px-2 py-0.5 rounded shadow text-xs font-semibold mt-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {station.name}
              </div>
            </div>
          </Marker>
        ))}

        {/* Render Weather Intelligence Overlay */}
        {weatherMarker && (
          <Marker longitude={weatherMarker.longitude || 77.96} latitude={weatherMarker.latitude || -68.57}>
            <div 
              className="flex flex-col items-center cursor-pointer group"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedEntity({ type: 'weather', ...weatherMarker, lon: weatherMarker.longitude || 77.96, lat: weatherMarker.latitude || -68.57 });
              }}
            >
              <div className={`bg-white/90 backdrop-blur-sm border border-blue-200 text-blue-900 px-2 py-1 rounded shadow-lg flex items-center space-x-2 transition-transform ${selectedEntity?.type === 'weather' ? 'scale-110 ring-2 ring-blue-400' : 'group-hover:scale-105'}`}>
                <CloudRain size={16} className="text-blue-500" />
                <span className="font-bold text-xs">{weatherMarker.wind_speed_knots} kt</span>
                <span className="text-xs text-gray-500">{weatherMarker.temperature_c}°C</span>
              </div>
            </div>
          </Marker>
        )}

        {/* Render Optimized Route Line */}
        {routeData && (
          <Source type="geojson" data={routeData}>
            <Layer 
              id="optimized-route"
              type="line"
              paint={{
                'line-color': '#2563eb',
                'line-width': 4,
                'line-dasharray': [2, 2]
              }}
            />
          </Source>
        )}

        {/* Popups */}
        {selectedEntity && (
          <Popup
            longitude={selectedEntity.lon}
            latitude={selectedEntity.lat}
            anchor="bottom"
            offset={25}
            closeButton={false}
            closeOnClick={false}
            className="z-50"
          >
            <div className="bg-slate-900 text-slate-200 p-4 rounded-xl border border-slate-700 shadow-2xl min-w-[240px] max-w-[300px]">
              {selectedEntity.type === 'ship' && (
                <>
                  <div className="flex items-center gap-3 border-b border-slate-700 pb-3 mb-3">
                    <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400">
                      <Ship size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100 text-lg">{selectedEntity.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Activity size={12} className="text-emerald-400" /> 
                        {selectedEntity.status || 'In Transit'}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center"><span className="text-slate-400 flex items-center gap-1"><Navigation size={14}/> Speed</span> <span className="font-semibold text-slate-200">{selectedEntity.speed || '8.5'} knots</span></div>
                    <div className="flex justify-between items-center"><span className="text-slate-400 flex items-center gap-1"><MapPin size={14}/> Lat</span> <span className="font-mono text-slate-300">{Number(selectedEntity.lat).toFixed(4)}°</span></div>
                    <div className="flex justify-between items-center"><span className="text-slate-400 flex items-center gap-1"><MapPin size={14}/> Lon</span> <span className="font-mono text-slate-300">{Number(selectedEntity.lon).toFixed(4)}°</span></div>
                  </div>
                  <button className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white rounded py-1.5 text-xs font-semibold transition-colors">
                    View Telemetry
                  </button>
                </>
              )}

              {selectedEntity.type === 'station' && (
                <>
                  <div className="flex items-center gap-3 border-b border-slate-700 pb-3 mb-3">
                    <div className="bg-slate-700 p-2 rounded-lg text-slate-200">
                      <Anchor size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100 text-lg">{selectedEntity.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        {selectedEntity.status === 'Operational' ? <CheckCircle size={12} className="text-emerald-400" /> : <AlertTriangle size={12} className="text-amber-400" />}
                        {selectedEntity.status}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center"><span className="text-slate-400">Personnel</span> <span className="font-semibold text-slate-200">{selectedEntity.personnel}</span></div>
                    <div className="flex justify-between items-center"><span className="text-slate-400">Fuel Reserves</span> <span className={`${selectedEntity.fuel_days < 30 ? 'text-amber-400' : 'text-emerald-400'} font-semibold`}>{selectedEntity.fuel_days} Days</span></div>
                  </div>
                  <button className="w-full mt-4 bg-slate-700 hover:bg-slate-600 text-white rounded py-1.5 text-xs font-semibold transition-colors">
                    Open Station Dashboard
                  </button>
                </>
              )}

              {selectedEntity.type === 'weather' && (
                <>
                  <div className="flex items-center gap-3 border-b border-slate-700 pb-3 mb-3">
                    <div className="bg-cyan-500/20 p-2 rounded-lg text-cyan-400">
                      <CloudRain size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100 text-lg">Weather Event</h3>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        Live STAC Update
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center"><span className="text-slate-400 flex items-center gap-1"><Wind size={14}/> Wind Speed</span> <span className="font-semibold text-slate-200">{selectedEntity.wind_speed_knots} knots</span></div>
                    <div className="flex justify-between items-center"><span className="text-slate-400 flex items-center gap-1"><Thermometer size={14}/> Temp</span> <span className="font-semibold text-slate-200">{selectedEntity.temperature_c}°C</span></div>
                    <div className="flex justify-between items-center"><span className="text-slate-400 flex items-center gap-1"><CloudRain size={14}/> Type</span> <span className="font-semibold text-slate-200">{selectedEntity.condition || 'Snow/Ice'}</span></div>
                  </div>
                </>
              )}
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
