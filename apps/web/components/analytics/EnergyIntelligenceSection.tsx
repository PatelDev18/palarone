'use client'

import React, { useState } from 'react'
import { FuelAnalyticsPoint } from '@/types/analytics'
import { Flame, Zap, Thermometer, ShieldAlert, Cpu } from 'lucide-react'
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

interface EnergyIntelligenceSectionProps {
  fuelData: FuelAnalyticsPoint[]
}

export const EnergyIntelligenceSection: React.FC<EnergyIntelligenceSectionProps> = ({ fuelData }) => {
  const [unit, setUnit] = useState<'LITRES' | 'TONS'>('LITRES')

  const scaleFactor = unit === 'TONS' ? 0.00085 : 1 // 1 L ~ 0.85 kg diesel
  const unitLabel = unit === 'TONS' ? 'MT' : 'Litres'

  const chartData = fuelData.map((d) => ({
    ...d,
    actualScaled: Math.round(d.actual_burn_litres * scaleFactor),
    predictedScaled: Math.round(d.predicted_burn_litres * scaleFactor),
    upperScaled: Math.round(d.upper_bound * scaleFactor),
    lowerScaled: Math.round(d.lower_bound * scaleFactor),
    uncertaintyRange: [
      Math.round(d.lower_bound * scaleFactor),
      Math.round(d.upper_bound * scaleFactor),
    ],
  }))

  const latest = fuelData[fuelData.length - 1]

  return (
    <div className="flex flex-col gap-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-slate-200 dark:border-slate-800/80 gap-2">
        <div className="flex items-center gap-2.5">
          <Flame className="w-5 h-5 text-amber-500" />
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Energy Intelligence & Fuel Predictive Modeling
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              14-Day Trajectory: Actuals vs XGBoost Regression with 90% Confidence Interval.
            </p>
          </div>
        </div>

        {/* Unit Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">Display Units:</span>
          <div className="flex bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setUnit('LITRES')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                unit === 'LITRES' ? 'bg-blue-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-white'
              }`}
            >
              Litres
            </button>
            <button
              onClick={() => setUnit('TONS')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                unit === 'TONS' ? 'bg-blue-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-white'
              }`}
            >
              Metric Tons
            </button>
          </div>
        </div>
      </div>

      {/* Main Chart + Metrics Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main 14-day Fuel Curve */}
        <div className="xl:col-span-3 p-5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                Fleet Burn Trajectory & Confidence Envelope
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              Model: <strong className="text-slate-700 dark:text-slate-300">XGBoost Ice-Penetration v3.4 (R² = 0.951)</strong>
            </span>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="timestamp" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit={` ${unitLabel}`} />
                <Tooltip
                  content={({ payload, label }) => {
                    if (payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="p-3 bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl text-xs space-y-1">
                          <p className="font-bold text-slate-900 dark:text-white mb-1">{label}</p>
                          <p className="text-slate-700 dark:text-slate-300">
                            Actual Burn:{' '}
                            <span className="font-mono text-emerald-400 font-semibold">
                              {data.actualScaled.toLocaleString()} {unitLabel}
                            </span>
                          </p>
                          <p className="text-slate-700 dark:text-slate-300">
                            Predicted Burn (XGB):{' '}
                            <span className="font-mono text-blue-400 font-semibold">
                              {data.predictedScaled.toLocaleString()} {unitLabel}
                            </span>
                          </p>
                          <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                            90% Confidence:{' '}
                            <span className="font-mono">
                              [{data.lowerScaled.toLocaleString()} - {data.upperScaled.toLocaleString()}]
                            </span>
                          </p>
                          <div className="pt-1 mt-1 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 flex justify-between gap-4">
                            <span>Ambient: {data.ambient_temp_c}°C</span>
                            <span>Gen Load: {data.generator_load_pct}%</span>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Legend iconType="circle" />
                {/* Confidence band */}
                <Area
                  type="monotone"
                  dataKey="uncertaintyRange"
                  name="90% Confidence Interval"
                  stroke="none"
                  fill="url(#confidenceBand)"
                />
                {/* Predicted Line */}
                <Line
                  type="monotone"
                  dataKey="predictedScaled"
                  name="XGBoost Predicted"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
                {/* Actual Line */}
                <Line
                  type="monotone"
                  dataKey="actualScaled"
                  name="Actual Consumption"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#0f172a', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-200 dark:border-slate-800/80">
            <span>Residual Mean Absolute Error (MAE): 1.1 L/nm</span>
            <span className="text-emerald-400">Model Variance within ±2.8% operational tolerance</span>
          </div>
        </div>

        {/* Side Panel: Generator & Station Load */}
        <div className="flex flex-col justify-between gap-4">
          {/* Current Daily Average */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              24-Hour Telemetry Snapshot
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                {latest ? Math.round(latest.actual_burn_litres * scaleFactor).toLocaleString() : '3,640'}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{unitLabel} / 24h</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-400">
              <Thermometer className="w-3.5 h-3.5" />
              <span>Ambient Temp: {latest?.ambient_temp_c ?? -28.0}°C</span>
            </div>
          </div>

          {/* Generator Load Distribution */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 flex-1 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Fleet Prime Generator Load
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Continuous electrical and propulsion draw.
              </p>

              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300 mb-1">
                    <span>Polar Star (ALCO 251)</span>
                    <span className="font-mono text-emerald-400 font-semibold">78% Load</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: '78%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300 mb-1">
                    <span>Southern Cross (MaK 8M)</span>
                    <span className="font-mono text-amber-400 font-semibold">89% Load</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: '89%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300 mb-1">
                    <span>Aurora Explorer (Rolls-Royce)</span>
                    <span className="font-mono text-blue-400 font-semibold">68% Load</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-400 h-1.5 rounded-full" style={{ width: '68%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-2.5 mt-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Southern Cross operating at 89% continuous rating to overcome 1.85x ice drag.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
