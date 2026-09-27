"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Trash2, 
  Ship, 
  Users, 
  MapPin, 
  Calendar, 
  Compass, 
  Package, 
  ShieldAlert, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { createExpedition } from '@/lib/expedition/api';
import { Expedition, RiskLevel } from '@/types/expedition';

interface NewExpeditionWizardProps {
  onCancel?: () => void;
}

const MISSION_TYPES = [
  'Scientific Research',
  'Resupply',
  'Survey',
  'Ice Monitoring',
  'Environmental Monitoring',
  'Logistics',
  'Infrastructure',
  'Search & Rescue Support',
  'Maintenance',
  'Exploration',
  'Multi-purpose'
];

export function NewExpeditionWizard({ onCancel }: NewExpeditionWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State across 11 Steps
  const [formData, setFormData] = useState({
    // Step 1: Basic
    id: `EXP-2026-${String.fromCharCode(65 + Math.floor(Math.random() * 20))}`,
    name: 'Princess Elisabeth Ice Shelf Acoustic Sounding',
    mission_type: 'Scientific Research',
    description: 'High-resolution acoustic sounding of sub-ice shelf oceanic circulation and melt rates near Princess Elisabeth Antarctica.',
    lead: 'Dr. Katherine Bell',
    organization: 'International Polar Science Foundation',
    operational_season: '2026-2027',

    // Step 2: Objectives
    objectives: [
      {
        id: 'OBJ-01',
        title: 'Conduct 240km sub-ice shelf acoustic survey profile',
        is_primary: true,
        priority: 'HIGH',
        owner: 'Dr. Katherine Bell',
        deadline: '2026-12-15',
        status: 'PLANNED',
        success_criteria: 'Zero data gap along continental grounding line transect'
      },
      {
        id: 'OBJ-02',
        title: 'Deploy autonomous weather & seismic beacon array',
        is_primary: false,
        priority: 'MEDIUM',
        owner: 'Field Eng. Thomas Vance',
        deadline: '2026-12-28',
        status: 'PLANNED',
        success_criteria: 'Satellite telemetry transmission verified for 7 consecutive days'
      }
    ],

    // Step 3: Location
    origin_name: 'Cape Town Logistics Hub, South Africa',
    destination_name: 'Princess Elisabeth Station / Sor Rondane Mountains',
    current_region: 'Queen Maud Land / Astrid Coast',
    current_lat: -71.95,
    current_lon: 23.35,
    waypoints: [
      { order: 1, name: 'Cape Town Departure Berth', lat: -33.91, lon: 18.43, passed: false, eta: '2026-11-15T08:00:00Z', ice_risk: 'NONE' },
      { order: 2, name: 'Southern Ocean Waypoint 50S', lat: -50.00, lon: 20.00, passed: false, eta: '2026-11-22T12:00:00Z', ice_risk: 'LOW' },
      { order: 3, name: 'Astrid Marginal Ice Boundary', lat: -69.40, lon: 22.50, passed: false, eta: '2026-12-01T18:00:00Z', ice_risk: 'MEDIUM' },
      { order: 4, name: 'Crown Bay Fast Ice Mooring', lat: -70.80, lon: 24.00, passed: false, eta: '2026-12-05T06:00:00Z', ice_risk: 'LOW' }
    ],

    // Step 4: Time Plan
    planned_start: '2026-11-15',
    planned_end: '2027-01-10',
    weather_window: 'Nov 20 - Dec 28 (Optimal Polar Summer)',
    personnel_rotation_date: '2026-12-20',

    // Step 5: Assets
    vessel_name: 'Ocean Explorer',
    aircraft: ['AS350 B3 Écureuil (Ski-equipped)'],
    vehicles: ['2x Prinoth Everest Snow Groomers', '3x Yamaha VK540 Snowmobiles'],
    major_equipment: ['High-Frequency Acoustic Profiler', 'Cryospheric Ice Core Drill Rig'],

    // Step 6: Personnel
    crew_count: 32,
    personnel_planned: 35,
    personnel_assigned: 32,
    personnel_available: 32,
    personnel_missing: 3,

    // Step 7: Cargo & Resources
    fuel_required_tons: 320,
    fuel_available_tons: 320,
    food_required_tons: 22,
    medical_required_packs: 12,
    spare_parts_crates: 15,

    // Step 8: Route
    route_distance_nm: 2450,
    estimated_duration_days: 18,
    fuel_consumption_est_tons: 140,
    ice_exposure_level: 'MEDIUM',

    // Step 9: Risk Assessment
    risk_level: 'LOW' as RiskLevel,
    risk_score: 24.5,
    main_risk_factor: 'Marginal ice pack crossing near Crown Bay during early summer thaw.',

    // Step 10: Contingency
    plan_a: 'Direct maritime escort to Crown Bay fast ice edge with tracked vehicle relay to station.',
    plan_b: 'If fast ice weak, divert 45nm west to Breid Bay anchorage and sling-load high priority cargo via helicopter.',
    plan_c: 'Severe blizzard abort: Rendezvous with Belgian Princess Elisabeth resupply aircraft pool.',

    // Step 11: Approval
    status: 'READY FOR APPROVAL',
    commander_comments: 'Plan verified against Antarctic Treaty environmental criteria.'
  });

  const updateField = (field: string, val: any) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const addObjective = () => {
    const newObj = {
      id: `OBJ-0${formData.objectives.length + 1}`,
      title: 'New Mission Objective',
      is_primary: false,
      priority: 'MEDIUM',
      owner: formData.lead,
      deadline: formData.planned_end,
      status: 'PLANNED',
      success_criteria: 'Deliverable completed on schedule'
    };
    setFormData(prev => ({ ...prev, objectives: [...prev.objectives, newObj] }));
  };

  const removeObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (targetStatus: string = 'PLANNING') => {
    setIsSubmitting(true);
    try {
      const payload: Partial<Expedition> = {
        id: formData.id,
        name: formData.name,
        mission_type: formData.mission_type,
        description: formData.description,
        lead: formData.lead,
        organization: formData.organization,
        operational_season: formData.operational_season,
        status: targetStatus as any,
        status_display: targetStatus,
        risk_level: formData.risk_level,
        risk_score: formData.risk_score,
        progress: 0,
        current_phase: 'Mission Planning & Marshalling',
        planned_start: `${formData.planned_start}T00:00:00Z`,
        planned_end: `${formData.planned_end}T00:00:00Z`,
        expected_completion: `${formData.planned_end}T00:00:00Z`,
        delay_hours: 0,
        origin_name: formData.origin_name,
        destination_name: formData.destination_name,
        current_region: formData.current_region,
        current_lat: formData.current_lat,
        current_lon: formData.current_lon,
        vessel_name: formData.vessel_name,
        ships: [formData.vessel_name],
        aircraft: formData.aircraft,
        vehicles: formData.vehicles,
        major_equipment: formData.major_equipment,
        crew_count: formData.personnel_assigned,
        objectives: formData.objectives as any,
        waypoints: formData.waypoints as any,
        personnel: {
          planned: formData.personnel_planned,
          assigned: formData.personnel_assigned,
          deployed: 0,
          available: formData.personnel_available,
          missing: formData.personnel_missing,
          breakdown: [
            { role: 'Expedition Commander', assigned: 1, required: 1 },
            { role: 'Field Scientists', assigned: 12, required: 14 },
            { role: 'Vessel Crew', assigned: 16, required: 16 },
            { role: 'Medical Team', assigned: 3, required: 4 }
          ],
          roster: [
            {
              name: formData.lead,
              role: 'Expedition Lead',
              team: 'Command',
              cert: 'Polar Code Advanced',
              location: formData.origin_name,
              medical: 'FIT_FOR_DUTY',
              shift: 'Day Operations',
              deployed: false
            }
          ]
        },
        logistics: {
          cargo_readiness: 90,
          fuel_readiness: 100,
          supply_readiness: 95,
          fuel_projected_remaining_pct: 42,
          fuel_reserve_warning: false,
          items: [
            {
              category: 'Fuel',
              name: 'Arctic Grade Diesel',
              required: formData.fuel_required_tons,
              loaded: formData.fuel_available_tons,
              consumed: 0,
              remaining: formData.fuel_available_tons,
              unit: 'tons',
              reserve_pct: 45
            }
          ]
        },
        contingencies: [
          {
            plan: 'Plan A (Baseline)',
            title: 'Primary Coastal Route',
            trigger: 'Nominal ice conditions',
            action: formData.plan_a,
            responsible: formData.lead,
            resources: formData.vessel_name,
            expected_impact: 'On Schedule',
            approval_required: 'Watch Officer'
          },
          {
            plan: 'Plan B (Alternative)',
            title: 'Ice Bypass Diversion',
            trigger: 'Sea ice concentration >75%',
            action: formData.plan_b,
            responsible: formData.lead,
            resources: 'Helicopter & Tracked Relays',
            expected_impact: '+48h Delay',
            approval_required: 'Commander Sign-off'
          }
        ]
      };

      await createExpedition(payload);
      router.push(`/expeditions/${formData.id}`);
    } catch (err) {
      console.error('Failed to create expedition:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, title: 'Basic Info' },
    { num: 2, title: 'Objectives' },
    { num: 3, title: 'Location' },
    { num: 4, title: 'Time Plan' },
    { num: 5, title: 'Assets' },
    { num: 6, title: 'Personnel' },
    { num: 7, title: 'Cargo' },
    { num: 8, title: 'Route' },
    { num: 9, title: 'Risk' },
    { num: 10, title: 'Contingency' },
    { num: 11, title: 'Approval' }
  ];

  return (
    <div className="bg-[#0b1329] border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-6 mb-8 max-w-5xl mx-auto">
      {/* Wizard Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Compass className="w-6 h-6 text-blue-500" />
            EXPEDITION STRATEGIC PLANNING WIZARD
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Step {currentStep} of 11: <strong className="text-blue-400">{steps[currentStep - 1].title}</strong> — Polar Mission Architecture & Resource Commissioning
          </p>
        </div>

        <button
          onClick={onCancel || (() => router.push('/expeditions'))}
          className="text-xs text-slate-500 dark:text-slate-400 hover:text-white px-3 py-1.5 rounded hover:bg-slate-800 transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Stepper Progress Bar */}
      <div className="grid grid-cols-11 gap-1 mb-8">
        {steps.map(s => {
          const isDone = s.num < currentStep;
          const isCurrent = s.num === currentStep;
          return (
            <button
              key={s.num}
              onClick={() => setCurrentStep(s.num)}
              className={`flex flex-col items-center gap-1 group text-center py-1 transition-all ${
                isCurrent
                  ? 'border-b-2 border-blue-500 pb-1'
                  : isDone
                  ? 'border-b-2 border-emerald-500/60 pb-1'
                  : 'border-b-2 border-slate-200 dark:border-slate-800 pb-1 opacity-50'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-mono transition-colors ${
                  isCurrent
                    ? 'bg-blue-600 text-white'
                    : isDone
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5" /> : s.num}
              </div>
              <span className="text-[9px] font-semibold tracking-tight text-slate-700 dark:text-slate-300 truncate w-full hidden sm:block">
                {s.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* STEP CONTENT BODY */}
      <div className="min-h-[360px] mb-8">
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Expedition ID
                </label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={e => updateField('id', e.target.value)}
                  className="w-full bg-[#020617] border border-slate-700 rounded-md p-2 text-xs font-mono text-blue-400 font-bold focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Expedition Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => updateField('name', e.target.value)}
                  className="w-full bg-[#020617] border border-slate-700 rounded-md p-2 text-xs text-white font-semibold focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Mission Type
                </label>
                <select
                  value={formData.mission_type}
                  onChange={e => updateField('mission_type', e.target.value)}
                  className="w-full bg-[#020617] border border-slate-700 rounded-md p-2 text-xs text-slate-200 focus:border-blue-500"
                >
                  {MISSION_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Expedition Lead / Commander
                </label>
                <input
                  type="text"
                  value={formData.lead}
                  onChange={e => updateField('lead', e.target.value)}
                  className="w-full bg-[#020617] border border-slate-700 rounded-md p-2 text-xs text-white focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Sponsoring Organization
                </label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={e => updateField('organization', e.target.value)}
                  className="w-full bg-[#020617] border border-slate-700 rounded-md p-2 text-xs text-white focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Operational Season
                </label>
                <input
                  type="text"
                  value={formData.operational_season}
                  onChange={e => updateField('operational_season', e.target.value)}
                  className="w-full bg-[#020617] border border-slate-700 rounded-md p-2 text-xs text-white focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Strategic Mission Description & Scope
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={e => updateField('description', e.target.value)}
                className="w-full bg-[#020617] border border-slate-700 rounded-md p-2 text-xs text-slate-200 focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {/* Step 2: Mission Objectives */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Define measurable operational and scientific objectives with clear ownership and success criteria.
              </span>
              <button
                type="button"
                onClick={addObjective}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Objective
              </button>
            </div>

            <div className="space-y-3">
              {formData.objectives.map((obj, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-blue-400">
                      {obj.is_primary ? 'PRIMARY OBJECTIVE' : `SECONDARY #${idx + 1}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeObjective(idx)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={obj.title}
                    onChange={e => {
                      const updated = [...formData.objectives];
                      updated[idx].title = e.target.value;
                      updateField('objectives', updated);
                    }}
                    placeholder="Objective title..."
                    className="w-full bg-[#020617] border border-slate-700 rounded p-2 text-xs text-white font-medium"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Owner</label>
                      <input
                        type="text"
                        value={obj.owner}
                        onChange={e => {
                          const updated = [...formData.objectives];
                          updated[idx].owner = e.target.value;
                          updateField('objectives', updated);
                        }}
                        className="w-full bg-[#020617] border border-slate-700 rounded p-1.5 text-xs text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Priority</label>
                      <select
                        value={obj.priority}
                        onChange={e => {
                          const updated = [...formData.objectives];
                          updated[idx].priority = e.target.value;
                          updateField('objectives', updated);
                        }}
                        className="w-full bg-[#020617] border border-slate-700 rounded p-1.5 text-xs text-slate-200"
                      >
                        <option value="CRITICAL">CRITICAL</option>
                        <option value="HIGH">HIGH</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="LOW">LOW</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Deadline</label>
                      <input
                        type="date"
                        value={obj.deadline}
                        onChange={e => {
                          const updated = [...formData.objectives];
                          updated[idx].deadline = e.target.value;
                          updateField('objectives', updated);
                        }}
                        className="w-full bg-[#020617] border border-slate-700 rounded p-1.5 text-xs text-slate-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Success Criteria</label>
                    <input
                      type="text"
                      value={obj.success_criteria}
                      onChange={e => {
                        const updated = [...formData.objectives];
                        updated[idx].success_criteria = e.target.value;
                        updateField('objectives', updated);
                      }}
                      className="w-full bg-[#020617] border border-slate-700 rounded p-1.5 text-xs text-slate-700 dark:text-slate-300"
                      placeholder="e.g. 100% data telemetry uplink verified"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Location */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Origin Staging Port / Airfield
                </label>
                <input
                  type="text"
                  value={formData.origin_name}
                  onChange={e => updateField('origin_name', e.target.value)}
                  className="w-full bg-[#020617] border border-slate-700 rounded-md p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Destination Antarctic Station / Geographic Target
                </label>
                <input
                  type="text"
                  value={formData.destination_name}
                  onChange={e => updateField('destination_name', e.target.value)}
                  className="w-full bg-[#020617] border border-slate-700 rounded-md p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Operational Sector / Region
                </label>
                <input
                  type="text"
                  value={formData.current_region}
                  onChange={e => updateField('current_region', e.target.value)}
                  className="w-full bg-[#020617] border border-slate-700 rounded-md p-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Latitude (°S)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.current_lat}
                    onChange={e => updateField('current_lat', parseFloat(e.target.value))}
                    className="w-full bg-[#020617] border border-slate-700 rounded-md p-2 text-xs font-mono text-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Longitude (°E/°W)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.current_lon}
                    onChange={e => updateField('current_lon', parseFloat(e.target.value))}
                    className="w-full bg-[#020617] border border-slate-700 rounded-md p-2 text-xs font-mono text-cyan-400"
                  />
                </div>
              </div>
            </div>

            {/* Waypoints Preview */}
            <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg p-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block mb-2">
                Defined Operational Waypoints ({formData.waypoints.length})
              </span>
              <div className="space-y-1.5">
                {formData.waypoints.map((w, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs text-slate-700 dark:text-slate-300 bg-[#020617] p-2 rounded border border-slate-200 dark:border-slate-800">
                    <span className="font-mono text-blue-400">#{w.order} {w.name}</span>
                    <span className="font-mono text-slate-500 dark:text-slate-400">{Math.abs(w.lat).toFixed(2)}°S, {w.lon.toFixed(2)}°E</span>
                    <span className="text-[10px] text-amber-400 font-mono">Ice Risk: {w.ice_risk}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Time Plan */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Planned Departure Date
                </label>
                <input
                  type="date"
                  value={formData.planned_start}
                  onChange={e => updateField('planned_start', e.target.value)}
                  className="w-full bg-[#020617] border border-slate-700 rounded-md p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Planned Arrival / Return Date
                </label>
                <input
                  type="date"
                  value={formData.planned_end}
                  onChange={e => updateField('planned_end', e.target.value)}
                  className="w-full bg-[#020617] border border-slate-700 rounded-md p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Approved Weather Window
                </label>
                <input
                  type="text"
                  value={formData.weather_window}
                  onChange={e => updateField('weather_window', e.target.value)}
                  className="w-full bg-[#020617] border border-slate-700 rounded-md p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Personnel Mid-Season Rotation Window
                </label>
                <input
                  type="date"
                  value={formData.personnel_rotation_date}
                  onChange={e => updateField('personnel_rotation_date', e.target.value)}
                  className="w-full bg-[#020617] border border-slate-700 rounded-md p-2 text-xs text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Assets */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Primary Vessel / Flagship
                </label>
                <select
                  value={formData.vessel_name}
                  onChange={e => updateField('vessel_name', e.target.value)}
                  className="w-full bg-[#020617] border border-slate-700 rounded-md p-2 text-xs text-white"
                >
                  <option value="USCGC Polar Star">USCGC Polar Star (Heavy Polar Icebreaker)</option>
                  <option value="Ocean Explorer">Ocean Explorer (Strengthened Cargo/Pax)</option>
                  <option value="Aurora Australis">Aurora Australis (Icebreaker RSV)</option>
                  <option value="RRS Sir David Attenborough">RRS Sir David Attenborough (PC4)</option>
                  <option value="Kronprins Haakon">Kronprins Haakon (Polar Class 3)</option>
                  <option value="Overland Fleet">Overland Heavy Caterpillar Fleet</option>
                </select>
                <span className="text-[10px] text-emerald-400 mt-1 block">Asset status: READY & COMMISSIONED</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Assigned Aviation / Helicopters
                </label>
                <input
                  type="text"
                  value={formData.aircraft.join(', ')}
                  onChange={e => updateField('aircraft', e.target.value.split(', '))}
                  className="w-full bg-[#020617] border border-slate-700 rounded-md p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Tracked Snow Vehicles
                </label>
                <input
                  type="text"
                  value={formData.vehicles.join(', ')}
                  onChange={e => updateField('vehicles', e.target.value.split(', '))}
                  className="w-full bg-[#020617] border border-slate-700 rounded-md p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Scientific & Emergency Gear
                </label>
                <input
                  type="text"
                  value={formData.major_equipment.join(', ')}
                  onChange={e => updateField('major_equipment', e.target.value.split(', '))}
                  className="w-full bg-[#020617] border border-slate-700 rounded-md p-2 text-xs text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Personnel */}
        {currentStep === 6 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="text-center">
                <div className="text-2xl font-black text-slate-900 dark:text-white">{formData.personnel_planned}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Planned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-blue-400">{formData.personnel_assigned}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Assigned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-emerald-400">{formData.personnel_available}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-amber-400">{formData.personnel_missing}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Missing</div>
              </div>
            </div>

            <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <p>Key roles accounted for:</p>
              <ul className="list-disc pl-5 text-slate-500 dark:text-slate-400 text-[11px] space-y-0.5">
                <li>Expedition Commander: <strong>{formData.lead}</strong> (Verified)</li>
                <li>Marine / Flight Crew: 16 assigned (Verified)</li>
                <li>Field Scientists: 12 assigned (2 pending altitude clearance)</li>
                <li>Medical Trauma Officers: 3 assigned (Full coverage)</li>
              </ul>
            </div>
          </div>
        )}

        {/* Step 7: Cargo & Resources */}
        {currentStep === 7 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <label className="text-xs font-bold text-white block mb-1">Fuel Requirement</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={formData.fuel_required_tons}
                    onChange={e => updateField('fuel_required_tons', parseFloat(e.target.value))}
                    className="w-full bg-[#020617] border border-slate-700 rounded p-1.5 text-xs text-white"
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400">tons</span>
                </div>
                <span className="text-[10px] text-emerald-400 mt-1 block">Allocated in storage</span>
              </div>

              <div className="bg-white dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <label className="text-xs font-bold text-white block mb-1">Food Provisions</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={formData.food_required_tons}
                    onChange={e => updateField('food_required_tons', parseFloat(e.target.value))}
                    className="w-full bg-[#020617] border border-slate-700 rounded p-1.5 text-xs text-white"
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400">tons</span>
                </div>
                <span className="text-[10px] text-emerald-400 mt-1 block">18-Month Polar reserve</span>
              </div>

              <div className="bg-white dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <label className="text-xs font-bold text-white block mb-1">Medical Trauma Packs</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={formData.medical_required_packs}
                    onChange={e => updateField('medical_required_packs', parseInt(e.target.value))}
                    className="w-full bg-[#020617] border border-slate-700 rounded p-1.5 text-xs text-white"
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400">kits</span>
                </div>
                <span className="text-[10px] text-emerald-400 mt-1 block">Complete surgical readiness</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 8: Route */}
        {currentStep === 8 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-blue-950/20 border border-blue-500/30 rounded-lg p-3 text-xs text-blue-200">
              <strong className="text-blue-300">OR-Tools Advisory Polar Passage Optimizer:</strong> Proposed route minimizes multi-year pack ice encounters while respecting 12nm marine wildlife boundaries.
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white dark:bg-slate-900/60 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Total Distance</div>
                <div className="text-lg font-bold text-white font-mono">{formData.route_distance_nm} nm</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Estimated Duration</div>
                <div className="text-lg font-bold text-white font-mono">{formData.estimated_duration_days} days</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Fuel Consumption</div>
                <div className="text-lg font-bold text-white font-mono">{formData.fuel_consumption_est_tons} tons</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Ice Exposure</div>
                <div className="text-lg font-bold text-amber-400 font-mono">{formData.ice_exposure_level}</div>
              </div>
            </div>
          </div>
        )}

        {/* Step 9: Risk Assessment */}
        {currentStep === 9 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between bg-white dark:bg-slate-900/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Pre-Computed Mission Risk</div>
                <div className="text-2xl font-black text-emerald-400 flex items-center gap-2 mt-0.5">
                  <span>{formData.risk_level} ({formData.risk_score}/100)</span>
                </div>
              </div>
              <div className="text-right text-xs text-slate-500 dark:text-slate-400">
                Model: <span className="font-mono text-purple-400">XGB_EXP_RISK_v3.2</span>
              </div>
            </div>

            <div className="bg-[#020617] p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Explainable Contributor Rationale:</span>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                {formData.main_risk_factor}
              </p>
            </div>
          </div>
        )}

        {/* Step 10: Contingency Plans */}
        {currentStep === 10 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <label className="block text-xs font-bold text-blue-400 uppercase mb-1">
                Plan A (Baseline Operations)
              </label>
              <textarea
                rows={2}
                value={formData.plan_a}
                onChange={e => updateField('plan_a', e.target.value)}
                className="w-full bg-[#020617] border border-slate-700 rounded-md p-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-400 uppercase mb-1">
                Plan B (Weather / Ice Diversion)
              </label>
              <textarea
                rows={2}
                value={formData.plan_b}
                onChange={e => updateField('plan_b', e.target.value)}
                className="w-full bg-[#020617] border border-slate-700 rounded-md p-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-400 uppercase mb-1">
                Plan C (Emergency Extraction / Abort Protocol)
              </label>
              <textarea
                rows={2}
                value={formData.plan_c}
                onChange={e => updateField('plan_c', e.target.value)}
                className="w-full bg-[#020617] border border-slate-700 rounded-md p-2 text-xs text-white"
              />
            </div>
          </div>
        )}

        {/* Step 11: Approval Gate */}
        {currentStep === 11 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="bg-[#04091a] border border-blue-500/40 rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Comprehensive Mission Summary for Commander Sign-off
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-700 dark:text-slate-300">
                <div>
                  <span className="text-slate-500 block text-[10px]">ID:</span>
                  <strong className="text-blue-400 font-mono">{formData.id}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Mission:</span>
                  <strong className="text-white truncate block">{formData.name}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Flagship:</span>
                  <strong className="text-white">{formData.vessel_name}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Risk Score:</span>
                  <strong className="text-emerald-400">{formData.risk_level} ({formData.risk_score}/100)</strong>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Commander Authorization Endorsement
              </label>
              <textarea
                rows={2}
                value={formData.commander_comments}
                onChange={e => updateField('commander_comments', e.target.value)}
                className="w-full bg-[#020617] border border-slate-700 rounded-md p-2 text-xs text-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* Wizard Footer Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          type="button"
          disabled={currentStep === 1 || isSubmitting}
          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          className="bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-semibold px-4 py-2 rounded flex items-center gap-1.5 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous Step
        </button>

        <div className="flex items-center gap-2">
          {currentStep < 11 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => Math.min(11, prev + 1))}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-5 py-2 rounded flex items-center gap-1.5 transition-colors shadow-md"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmit('DRAFT')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold px-3 py-2 rounded transition-colors"
              >
                Save Draft
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmit('READY FOR APPROVAL')}
                className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-4 py-2 rounded transition-colors"
              >
                Request Approval
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmit('APPROVED')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-2 rounded transition-colors shadow-lg shadow-emerald-950/50 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                APPROVE EXPEDITION
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
