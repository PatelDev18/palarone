"use client"

import React, { useState } from 'react'
import { IncidentSeverity } from '@/types/emergency'
import { 
  ShieldAlert, 
  X, 
  Plus, 
  Ship, 
  MapPin, 
  AlertTriangle 
} from 'lucide-react'

interface CreateIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => Promise<void>;
}

export function CreateIncidentModal({
  isOpen,
  onClose,
  onSubmit
}: CreateIncidentModalProps) {
  const [title, setTitle] = useState('');
  const [incidentType, setIncidentType] = useState('Sea Ice Obstruction');
  const [severity, setSeverity] = useState<IncidentSeverity>('HIGH');
  const [affectedAsset, setAffectedAsset] = useState('Polar Star');
  const [locationName, setLocationName] = useState('Davis Station Route (Sector 4)');
  const [lat, setLat] = useState(-67.84);
  const [lon, setLon] = useState(76.92);
  const [description, setDescription] = useState('');
  const [primaryCause, setPrimaryCause] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const incidentTypes = [
    'Sea Ice Obstruction',
    'Vessel Collision Risk',
    'Vessel Breakdown',
    'Engine Failure',
    'Generator Failure',
    'Medical Emergency',
    'Personnel Distress',
    'Severe Weather',
    'Communication Loss',
    'Cargo Loss',
    'Fuel Emergency',
    'Fire',
    'Station Infrastructure Failure',
    'Satellite Anomaly',
    'Navigation Hazard',
    'Environmental Hazard',
    'Security Incident',
    'Unknown / AI Detected Anomaly'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert("Please provide an incident title and operational description.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title,
        incident_type: incidentType,
        severity,
        affected_asset_name: affectedAsset,
        location_name: locationName,
        coordinates: { lat: Number(lat), lon: Number(lon) },
        description,
        primary_cause: primaryCause || 'Operational anomaly reported.',
        is_simulation: false
      });
      onClose();
    } catch (err: any) {
      alert(`Declaration error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-mono">
      <div className="bg-[#0b1329] border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-[#0f172a] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                Declare Maritime Emergency Incident
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">Formal operational incident declaration into Antarctic ARCC Stream</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-500 dark:text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1 no-scrollbar">
          <div>
            <label className="text-slate-500 dark:text-slate-400 uppercase text-[10px] block mb-1">Incident Title</label>
            <input
              type="text"
              placeholder="e.g. Sudden Heavy Pack Convergence Blocking Fairway"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-500 dark:text-slate-400 uppercase text-[10px] block mb-1">Incident Type (18 Categories)</label>
              <select
                value={incidentType}
                onChange={e => setIncidentType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              >
                {incidentTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-500 dark:text-slate-400 uppercase text-[10px] block mb-1">Severity Rating</label>
              <select
                value={severity}
                onChange={e => setSeverity(e.target.value as IncidentSeverity)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500 font-bold"
              >
                <option value="CRITICAL">CRITICAL (Immediate Danger to Vessel/Life)</option>
                <option value="HIGH">HIGH (Severe Mission / Asset Delay)</option>
                <option value="MEDIUM">MEDIUM (Restricted Operations)</option>
                <option value="LOW">LOW (Advisory / Non-Critical)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-500 dark:text-slate-400 uppercase text-[10px] block mb-1">Affected Asset</label>
              <input
                type="text"
                placeholder="e.g. Polar Star or Davis Station"
                value={affectedAsset}
                onChange={e => setAffectedAsset(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="text-slate-500 dark:text-slate-400 uppercase text-[10px] block mb-1">Location Name / Sector</label>
              <input
                type="text"
                placeholder="e.g. Prydz Bay Marine Sector"
                value={locationName}
                onChange={e => setLocationName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-500 dark:text-slate-400 uppercase text-[10px] block mb-1">Latitude (°S)</label>
              <input
                type="number"
                step="0.001"
                value={lat}
                onChange={e => setLat(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-slate-500 dark:text-slate-400 uppercase text-[10px] block mb-1">Longitude (°E/°W)</label>
              <input
                type="number"
                step="0.001"
                value={lon}
                onChange={e => setLon(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-500 dark:text-slate-400 uppercase text-[10px] block mb-1">Primary Operational Cause</label>
            <input
              type="text"
              placeholder="e.g. 45kt katabatic gale front compressing first-year pack into 2m ridges"
              value={primaryCause}
              onChange={e => setPrimaryCause(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-slate-500 dark:text-slate-400 uppercase text-[10px] block mb-1">Incident Description & Bridge Telemetry</label>
            <textarea
              rows={3}
              placeholder="Detailed tactical narrative, speed drops, sensor alarms, and on-scene environmental status..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-900/40 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Logging Declaration...' : 'Declare Incident into ARCC Stream'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
