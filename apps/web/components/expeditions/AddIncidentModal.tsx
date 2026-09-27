"use client"

import React, { useState } from 'react';
import { Expedition } from '@/types/expedition';
import { addExpeditionIncident } from '@/lib/expedition/api';
import { X, AlertTriangle, ShieldAlert } from 'lucide-react';

interface AddIncidentModalProps {
  expedition: Expedition;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddIncidentModal({ expedition, onClose, onSuccess }: AddIncidentModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Weather',
    severity: 'MEDIUM',
    description: '',
    affected_people: 'None reported',
    affected_assets: expedition.vessel_name || 'Vessel / Gear',
    mission_impact: '',
    response: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;
    setLoading(true);
    try {
      await addExpeditionIncident(expedition.id, formData as any);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to log incident:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-[#0b1329] border border-rose-500/40 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden text-slate-200">
        <div className="px-5 py-3.5 bg-gradient-to-r from-rose-950/80 to-slate-900 border-b border-rose-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase">
              Log Mission Incident ({expedition.id})
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3 text-xs">
          <div>
            <label className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">Incident Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Anchor winch hydraulic line leak in ice pack..."
              className="w-full bg-[#020617] border border-slate-700 rounded p-2 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">Type</label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-[#020617] border border-slate-700 rounded p-2 text-xs text-white"
              >
                <option value="Weather">Weather / Blizzard</option>
                <option value="Ice">Sea Ice / Ridge Compression</option>
                <option value="Equipment">Mechanical / Machinery</option>
                <option value="Medical">Medical / Cold Injury</option>
                <option value="Logistics">Logistics / Supply Shortage</option>
                <option value="Communication">SATCOM Outage</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">Severity</label>
              <select
                value={formData.severity}
                onChange={e => setFormData({ ...formData, severity: e.target.value })}
                className="w-full bg-[#020617] border border-slate-700 rounded p-2 text-xs text-white"
              >
                <option value="INFO">INFO</option>
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">Description</label>
            <textarea
              rows={2}
              required
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#020617] border border-slate-700 rounded p-2 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">Affected Personnel</label>
              <input
                type="text"
                value={formData.affected_people}
                onChange={e => setFormData({ ...formData, affected_people: e.target.value })}
                className="w-full bg-[#020617] border border-slate-700 rounded p-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">Affected Assets</label>
              <input
                type="text"
                value={formData.affected_assets}
                onChange={e => setFormData({ ...formData, affected_assets: e.target.value })}
                className="w-full bg-[#020617] border border-slate-700 rounded p-2 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">Operational Response Taken</label>
            <input
              type="text"
              value={formData.response}
              onChange={e => setFormData({ ...formData, response: e.target.value })}
              className="w-full bg-[#020617] border border-slate-700 rounded p-2 text-xs text-white"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 py-1.5 rounded text-xs shadow-md"
            >
              {loading ? 'Logging...' : 'Record Incident'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
