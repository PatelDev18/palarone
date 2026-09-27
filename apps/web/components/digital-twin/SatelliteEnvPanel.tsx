"use client";

import React, { useState, useEffect } from 'react';
import {
  Satellite,
  X,
  Clock,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Activity,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { SatelliteObservation } from '@/types/digital-twin';
import { digitalTwinApi } from '@/lib/api/digital-twin';

interface SatelliteEnvPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SatelliteEnvPanel({ isOpen, onClose }: SatelliteEnvPanelProps) {
  const [observations, setObservations] = useState<SatelliteObservation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    digitalTwinApi.getObservations().then((data) => {
      setObservations(data);
      setLoading(false);
    }).catch((err) => {
      console.error('Failed to load satellite observations:', err);
      setLoading(false);
    });
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center">
              <Satellite className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono tracking-wider">
                  ORBITAL SATELLITE PASSES & RADAR LAYERS
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700 font-mono">
                  REALISTIC REVISIT
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400">
                Ground-truth synthetic aperture radar (SAR) & optical metadata
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-600 dark:text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Realistic Telemetry Disclaimer Banner */}
        <div className="p-3 bg-cyan-950/30 border-b border-cyan-800/40 text-[11px] font-mono text-cyan-300 flex items-center gap-2">
          <Eye className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            <strong>Authentic Operational Physics:</strong> Satellite radar passes in polar orbits occur at discrete revisit intervals. Telemetry freshness reflects true SAR swathes; no fabricated continuous video.
          </span>
        </div>

        {/* Passes List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
          {loading ? (
            <div className="flex items-center justify-center h-40 text-slate-600 dark:text-slate-400">
              <Activity className="w-5 h-5 animate-spin mr-2 text-cyan-400" />
              Fetching orbital telemetry passes...
            </div>
          ) : (
            observations.map((obs) => {
              const isRecent = obs.freshness === 'RECENT' || obs.freshness === 'FRESH';

              return (
                <div
                  key={obs.observation_id}
                  className="p-3 rounded-lg bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100">{obs.satellite_name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                        {obs.type}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        isRecent
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {obs.age_display} • {obs.freshness}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] text-slate-600 dark:text-slate-400">
                    <div>
                      Sensor: <strong className="text-slate-200">{obs.sensor_type}</strong>
                    </div>
                    <div>
                      Resolution: <strong className="text-slate-200">{obs.resolution}</strong>
                    </div>
                    <div>
                      Confidence: <strong className="text-emerald-400">{(obs.confidence * 100).toFixed(0)}%</strong>
                    </div>
                    <div className="col-span-2">
                      Area Coverage: <strong className="text-slate-200">{obs.area}</strong>
                    </div>
                  </div>

                  {/* Detected Ice Features */}
                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 text-[11px] font-sans text-cyan-300">
                    <strong className="font-mono text-[10px] uppercase text-cyan-400 block mb-0.5">
                      Navigable Ice Lead Detection:
                    </strong>
                    {obs.lead_features_detected}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
