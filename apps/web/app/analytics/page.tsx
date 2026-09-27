'use client'

import React, { useState, useEffect } from 'react'
import {
  Timeframe,
  AnalyticsBundle,
  VesselPerformanceRecord,
  StationMetricRecord,
  AssetHealthRecord,
  SensorAnomalyRecord,
  ETAPredictionRecord,
  ExecutiveKpi,
} from '@/types/analytics'
import {
  fetchAnalyticsBundle,
  exportToCSV,
  exportToJSON,
  getFallbackAnalyticsBundle,
} from '@/lib/analytics/api'
import { AnalyticsHeader } from '@/components/analytics/AnalyticsHeader'
import { ExecutiveKpiStrip } from '@/components/analytics/ExecutiveKpiStrip'
import { FleetPerformanceSection } from '@/components/analytics/FleetPerformanceSection'
import { EnergyIntelligenceSection } from '@/components/analytics/EnergyIntelligenceSection'
import { ETAIntelligenceSection } from '@/components/analytics/ETAIntelligenceSection'
import { StationPerformanceSection } from '@/components/analytics/StationPerformanceSection'
import { InventoryForecastSection } from '@/components/analytics/InventoryForecastSection'
import { AssetHealthSection } from '@/components/analytics/AssetHealthSection'
import { AnomalyIntelligenceSection } from '@/components/analytics/AnomalyIntelligenceSection'
import { MLModelRegistrySection } from '@/components/analytics/MLModelRegistrySection'
import { RiskMatrixSection } from '@/components/analytics/RiskMatrixSection'
import { CorrelationCausationSection } from '@/components/analytics/CorrelationCausationSection'
import { TrendsForecastSection } from '@/components/analytics/TrendsForecastSection'
import { DataQualityNetworkSection } from '@/components/analytics/DataQualityNetworkSection'
import { AIInsightFeedSection } from '@/components/analytics/AIInsightFeedSection'
import { WhatIfScenarioModal } from '@/components/analytics/WhatIfScenarioModal'
import { DrillDownModal } from '@/components/analytics/DrillDownModal'
import {
  Ship,
  Flame,
  Building2,
  Wrench,
  Cpu,
  ShieldAlert,
  Layers,
  Sparkles,
} from 'lucide-react'

type TabKey =
  | 'ALL'
  | 'FLEET_ENERGY'
  | 'STATIONS_LOGISTICS'
  | 'ASSETS_ANOMALIES'
  | 'ML_DRIFT'
  | 'RISKS_CORRELATIONS'

export default function AnalyticsDashboardPage() {
  const [timeframe, setTimeframe] = useState<Timeframe>('7D')
  const [data, setData] = useState<AnalyticsBundle>(getFallbackAnalyticsBundle('7D'))
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [lastUpdated, setLastUpdated] = useState<string>('Just now')
  const [connectionStatus, setConnectionStatus] = useState<'ONLINE' | 'DEGRADED' | 'OFFLINE'>('ONLINE')
  const [activeTab, setActiveTab] = useState<TabKey>('ALL')

  // Modals state
  const [isWhatIfOpen, setIsWhatIfOpen] = useState<boolean>(false)
  const [drillDownData, setDrillDownData] = useState<{
    isOpen: boolean
    title: string
    subtitle?: string
    payload: any
  }>({
    isOpen: false,
    title: '',
    subtitle: '',
    payload: null,
  })

  const loadData = async (tf: Timeframe) => {
    setIsLoading(true)
    try {
      const bundle = await fetchAnalyticsBundle(tf)
      setData(bundle)
      setConnectionStatus('ONLINE')
      setLastUpdated(new Date().toLocaleTimeString() + ' UTC')
    } catch (e) {
      console.error('Failed to fetch analytics:', e)
      setConnectionStatus('DEGRADED')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData(timeframe)
  }, [timeframe])

  // Drill down handlers
  const handleSelectVessel = (v: VesselPerformanceRecord) => {
    setDrillDownData({
      isOpen: true,
      title: `${v.vessel_name} Telemetry Drill-Down`,
      subtitle: `${v.ice_class} • Mission: ${v.active_mission}`,
      payload: v,
    })
  }

  const handleSelectStation = (s: StationMetricRecord) => {
    setDrillDownData({
      isOpen: true,
      title: `${s.station_name} Station Infrastructure`,
      subtitle: s.location,
      payload: s,
    })
  }

  const handleSelectAsset = (a: AssetHealthRecord) => {
    setDrillDownData({
      isOpen: true,
      title: `${a.asset_name} Health Analysis`,
      subtitle: `${a.location} • Model: ${a.model_used}`,
      payload: a,
    })
  }

  const handleSelectAnomaly = (anom: SensorAnomalyRecord) => {
    setDrillDownData({
      isOpen: true,
      title: `Sensor Anomaly ${anom.anomaly_id}`,
      subtitle: `${anom.equipment_name} (${anom.location})`,
      payload: anom,
    })
  }

  const handleSelectVoyage = (voyage: ETAPredictionRecord) => {
    setDrillDownData({
      isOpen: true,
      title: `Voyage ${voyage.voyage_id} ETA Deep-Dive`,
      subtitle: `${voyage.vessel_name} → ${voyage.destination}`,
      payload: voyage,
    })
  }

  const handleKpiClick = (kpi: ExecutiveKpi) => {
    setDrillDownData({
      isOpen: true,
      title: `${kpi.title} Metric Detail`,
      subtitle: kpi.description,
      payload: kpi,
    })
  }

  // Export handlers
  const handleExportCSV = () => {
    exportToCSV(data.fleet, `polarone_fleet_analytics_${timeframe}`)
  }

  const handleExportJSON = () => {
    exportToJSON(data, `polarone_analytical_intelligence_${timeframe}`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-200 transition-colors duration-150">
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-8 max-w-[1700px] mx-auto w-full">
        {/* Top Header */}
        <AnalyticsHeader
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          onRefresh={() => loadData(timeframe)}
          isRefreshing={isLoading}
          lastUpdated={lastUpdated}
          connectionStatus={connectionStatus}
          onOpenWhatIf={() => setIsWhatIfOpen(true)}
          onExportCSV={handleExportCSV}
          onExportJSON={handleExportJSON}
        />

        {/* Executive KPI Strip */}
        <ExecutiveKpiStrip kpis={data.kpis} onKpiClick={handleKpiClick} />

        {/* Navigation Sub-Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'ALL'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Intelligence</span>
          </button>

          <button
            onClick={() => setActiveTab('FLEET_ENERGY')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'FLEET_ENERGY'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-900'
            }`}
          >
            <Ship className="w-3.5 h-3.5" />
            <span>Fleet & Energy</span>
          </button>

          <button
            onClick={() => setActiveTab('STATIONS_LOGISTICS')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'STATIONS_LOGISTICS'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Stations & Supplies</span>
          </button>

          <button
            onClick={() => setActiveTab('ASSETS_ANOMALIES')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'ASSETS_ANOMALIES'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-900'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Assets & Anomalies</span>
          </button>

          <button
            onClick={() => setActiveTab('ML_DRIFT')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'ML_DRIFT'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-900'
            }`}
          >
          <Cpu className="w-3.5 h-3.5" />
          <span>ML Models & Drift</span>
        </button>

        <button
          onClick={() => setActiveTab('RISKS_CORRELATIONS')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
            activeTab === 'RISKS_CORRELATIONS'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Risks & Correlations</span>
        </button>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-12">
        {/* Section: AI Operational Insights */}
        {(activeTab === 'ALL' || activeTab === 'RISKS_CORRELATIONS') && (
          <AIInsightFeedSection insights={data.insights} />
        )}

        {/* Section: Fleet Performance */}
        {(activeTab === 'ALL' || activeTab === 'FLEET_ENERGY') && (
          <FleetPerformanceSection
            fleet={data.fleet}
            onSelectVessel={handleSelectVessel}
          />
        )}

        {/* Section: Energy Intelligence */}
        {(activeTab === 'ALL' || activeTab === 'FLEET_ENERGY') && (
          <EnergyIntelligenceSection fuelData={data.fuel} />
        )}

        {/* Section: ETA Intelligence */}
        {(activeTab === 'ALL' || activeTab === 'FLEET_ENERGY') && (
          <ETAIntelligenceSection
            etaData={data.eta}
            onSelectVoyage={handleSelectVoyage}
          />
        )}

        {/* Section: Station Performance */}
        {(activeTab === 'ALL' || activeTab === 'STATIONS_LOGISTICS') && (
          <StationPerformanceSection
            stations={data.stations}
            onSelectStation={handleSelectStation}
          />
        )}

        {/* Section: Supply & Inventory Depletion */}
        {(activeTab === 'ALL' || activeTab === 'STATIONS_LOGISTICS') && (
          <InventoryForecastSection inventory={data.inventory} />
        )}

        {/* Section: Asset Health & RUL */}
        {(activeTab === 'ALL' || activeTab === 'ASSETS_ANOMALIES') && (
          <AssetHealthSection
            assets={data.assets}
            onSelectAsset={handleSelectAsset}
          />
        )}

        {/* Section: Sensor Anomaly Intelligence */}
        {(activeTab === 'ALL' || activeTab === 'ASSETS_ANOMALIES') && (
          <AnomalyIntelligenceSection
            anomalies={data.anomalies}
            onSelectAnomaly={handleSelectAnomaly}
          />
        )}

        {/* Section: ML Model Registry & Drift */}
        {(activeTab === 'ALL' || activeTab === 'ML_DRIFT') && (
          <MLModelRegistrySection models={data.models} />
        )}

        {/* Section: Operational Risk Matrix */}
        {(activeTab === 'ALL' || activeTab === 'RISKS_CORRELATIONS') && (
          <RiskMatrixSection risks={data.risks} />
        )}

        {/* Section: Correlations & Causation */}
        {(activeTab === 'ALL' || activeTab === 'RISKS_CORRELATIONS') && (
          <CorrelationCausationSection correlations={data.correlations} />
        )}

        {/* Section: Emerging Trends & Forecast Center */}
        {(activeTab === 'ALL' || activeTab === 'FLEET_ENERGY' || activeTab === 'STATIONS_LOGISTICS') && (
          <TrendsForecastSection forecasts={data.forecast} />
        )}

        {/* Section: Data Quality & Network Resilience */}
        {(activeTab === 'ALL' || activeTab === 'ML_DRIFT') && (
          <DataQualityNetworkSection
            dataQuality={data.data_quality}
            network={data.network}
          />
        )}
      </div>
      </main>

      {/* Interactive What-If Scenario Modal */}
      <WhatIfScenarioModal
        isOpen={isWhatIfOpen}
        onClose={() => setIsWhatIfOpen(false)}
      />

      {/* Deep-Dive Inspection Modal */}
      <DrillDownModal
        isOpen={drillDownData.isOpen}
        title={drillDownData.title}
        subtitle={drillDownData.subtitle}
        data={drillDownData.payload}
        onClose={() =>
          setDrillDownData({ isOpen: false, title: '', subtitle: '', payload: null })
        }
      />
    </div>
  )
}
