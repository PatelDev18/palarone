"use client"

import React, { useState } from 'react';
import { Expedition } from '@/types/expedition';
import { addExpeditionTask } from '@/lib/expedition/api';
import { X, CheckSquare } from 'lucide-react';

interface AddTaskModalProps {
  expedition: Expedition;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddTaskModal({ expedition, onClose, onSuccess }: AddTaskModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    team: 'Operations',
    owner: expedition.lead || 'Duty Officer',
    priority: 'MEDIUM',
    status: 'TODO',
    due_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    dependency: '',
    location: expedition.current_region || 'Polar Field'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;
    setLoading(true);
    try {
      await addExpeditionTask(expedition.id, formData as any);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to add task:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-[#0b1329] border border-blue-500/40 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden text-slate-200">
        <div className="px-5 py-3.5 bg-gradient-to-r from-blue-950 to-slate-900 border-b border-blue-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase">
              Add Operational Task ({expedition.id})
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3 text-xs">
          <div>
            <label className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">Task Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Conduct daily sea-ice thickness acoustic drill..."
              className="w-full bg-[#020617] border border-slate-700 rounded p-2 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">Assigned Team</label>
              <select
                value={formData.team}
                onChange={e => setFormData({ ...formData, team: e.target.value })}
                className="w-full bg-[#020617] border border-slate-700 rounded p-2 text-xs text-white"
              >
                <option value="Command">Command</option>
                <option value="Maritime">Maritime / Deck</option>
                <option value="Science">Science / Research</option>
                <option value="Aviation">Aviation / Heli</option>
                <option value="Engineering">Engineering / Mechanics</option>
                <option value="Medical">Medical</option>
                <option value="Logistics">Logistics / Supply</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={e => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-[#020617] border border-slate-700 rounded p-2 text-xs text-white"
              >
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">Task Owner</label>
              <input
                type="text"
                value={formData.owner}
                onChange={e => setFormData({ ...formData, owner: e.target.value })}
                className="w-full bg-[#020617] border border-slate-700 rounded p-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">Due Date</label>
              <input
                type="date"
                value={formData.due_date}
                onChange={e => setFormData({ ...formData, due_date: e.target.value })}
                className="w-full bg-[#020617] border border-slate-700 rounded p-2 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">Preceding Task Dependency (Optional)</label>
            <input
              type="text"
              value={formData.dependency}
              onChange={e => setFormData({ ...formData, dependency: e.target.value })}
              placeholder="e.g. TSK-A102"
              className="w-full bg-[#020617] border border-slate-700 rounded p-2 text-xs text-white font-mono"
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
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-1.5 rounded text-xs shadow-md"
            >
              {loading ? 'Creating...' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
