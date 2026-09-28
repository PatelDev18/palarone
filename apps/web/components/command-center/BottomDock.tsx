"use client";

import React, { useState } from 'react';
import {
  Clock,
  Sparkles,
  AlertTriangle,
  Activity,
  Bot,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  Filter,
  Send,
  Radio,
  Layers,
  ArrowRight,
  ShieldAlert,
  Info,
  ExternalLink,
  Search
} from 'lucide-react';
import {
  EventTimelineItem,
  PredictionsData,
  AlertItem,
  DataHealthSummary,
  UserRole
} from '@/types/command-center';

interface BottomDockProps {
  events: EventTimelineItem[];
  predictions: PredictionsData;
  alerts: AlertItem[];
  dataHealth: DataHealthSummary;
  onAcknowledgeAlert: (alertId: string) => void;
  onSelectEntity: (type: 'VESSEL' | 'STATION' | 'ALERT', id: string) => void;
  onAskCopilot: (question: string) => Promise<{ answer: string; sources: any[]; suggested_actions: string[] }>;
  currentUserRole: UserRole;
  activeTab: 'EVENTS' | 'PREDICTIONS' | 'ALERTS' | 'HEALTH' | 'COPILOT';
  onTabChange: (tab: 'EVENTS' | 'PREDICTIONS' | 'ALERTS' | 'HEALTH' | 'COPILOT') => void;
}

export function BottomDock({
  events,
  predictions,
  alerts,
  dataHealth,
  onAcknowledgeAlert,
  onSelectEntity,
  onAskCopilot,
  currentUserRole,
  activeTab,
  onTabChange,
}: BottomDockProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [eventCategoryFilter, setEventCategoryFilter] = useState<string>('ALL');
  const [alertSeverityFilter, setAlertSeverityFilter] = useState<string>('ALL');

  // Copilot State
  const [copilotQuestion, setCopilotQuestion] = useState<string>('');
  const [copilotHistory, setCopilotHistory] = useState<
    Array<{ q: string; a: string; sources: any[]; actions: string[] }>
  >([
    {
      q: 'Which ship is delayed right now?',
      a: '**Polar Star** is currently delayed by **+26 hours** on its voyage to Davis Station. Its AIS speed is reduced to 6.2 knots due to high sea-ice concentration (42%) and strong headwind gale in the Weddell Sea corridor.',
      sources: [
        { type: 'AIS Stream', info: 'Speed 6.2 kt, heading 112° (Updated 32s ago)' },
        { type: 'XGBoost ETA Model', info: 'XGB_POLAR_ETA_v2.4 (Confidence 76%)' },
        { type: 'Sentinel-1 SAR', info: 'Obs ID SAR-S1A-20260927-0415 (Pack convergence confirmed)' },
      ],
      actions: ['Review Alternate Route B', 'Inspect Polar Star Telemetry'],
    },
  ]);
  const [copilotLoading, setCopilotLoading] = useState<boolean>(false);

  const handleSendCopilot = async (qToSend?: string) => {
    const q = qToSend || copilotQuestion;
    if (!q.trim()) return;

    setCopilotLoading(true);
    try {
      const res = await onAskCopilot(q);
      setCopilotHistory((prev) => [
        ...prev,
        {
          q,
          a: res.answer,
          sources: res.sources || [],
          actions: res.suggested_actions || [],
        },
      ]);
      setCopilotQuestion('');
    } catch (err) {
      console.error(err);
    } finally {
      setCopilotLoading(false);
    }
  };

  const safeEvents = Array.isArray(events) ? events : [];
  const safeAlerts = Array.isArray(alerts) ? alerts : [];

  const filteredEvents =
    eventCategoryFilter === 'ALL'
      ? safeEvents
      : safeEvents.filter((e) => e.category === eventCategoryFilter);

  const filteredAlerts =
    alertSeverityFilter === 'ALL'
      ? safeAlerts
      : safeAlerts.filter((a) => a.severity === alertSeverityFilter);

  return (
    <div
      className={`border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070d1e] flex flex-col transition-all duration-300 shrink-0 select-none z-20 ${
        isExpanded ? 'h-64 sm:h-72' : 'h-10'
      }`}
    >
      {/* Dock Header Tabs & Toggle */}
      <div className="h-10 bg-white dark:bg-[#0b1329] border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => {
              onTabChange('EVENTS');
              if (!isExpanded) setIsExpanded(true);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-md font-semibold transition-colors ${
              activeTab === 'EVENTS' && isExpanded
                ? 'bg-white dark:bg-[#070d1e] text-blue-400 border-t-2 border-blue-500'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            Events Timeline ({events.length})
          </button>

          <button
            onClick={() => {
              onTabChange('PREDICTIONS');
              if (!isExpanded) setIsExpanded(true);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-md font-semibold transition-colors ${
              activeTab === 'PREDICTIONS' && isExpanded
                ? 'bg-white dark:bg-[#070d1e] text-purple-400 border-t-2 border-purple-500'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Prediction Center (ML)
          </button>

          <button
            onClick={() => {
              onTabChange('ALERTS');
              if (!isExpanded) setIsExpanded(true);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-md font-semibold transition-colors relative ${
              activeTab === 'ALERTS' && isExpanded
                ? 'bg-white dark:bg-[#070d1e] text-amber-400 border-t-2 border-amber-500'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Alert Center
            {safeAlerts.filter((a) => a.status === 'NEW').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            )}
          </button>

          <button
            onClick={() => {
              onTabChange('HEALTH');
              if (!isExpanded) setIsExpanded(true);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-md font-semibold transition-colors ${
              activeTab === 'HEALTH' && isExpanded
                ? 'bg-white dark:bg-[#070d1e] text-emerald-400 border-t-2 border-emerald-500'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            Data Health & Feeds
          </button>

          <button
            onClick={() => {
              onTabChange('COPILOT');
              if (!isExpanded) setIsExpanded(true);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-md font-semibold transition-colors ${
              activeTab === 'COPILOT' && isExpanded
                ? 'bg-white dark:bg-[#070d1e] text-blue-400 border-t-2 border-blue-500'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-blue-400" />
            AI Ops Copilot
          </button>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1 transition-colors"
          title={isExpanded ? 'Collapse Dock' : 'Expand Dock'}
        >
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {/* Dock Content Body */}
      {isExpanded && (
        <div className="flex-1 overflow-hidden p-3 bg-white dark:bg-[#070d1e]">
          {/* TAB 1: EVENTS TIMELINE */}
          {activeTab === 'EVENTS' && (
            <div className="flex flex-col h-full space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  CHRONOLOGICAL LOG OF ANTARCTIC TELEMETRY & ML EVENTS
                </span>
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <Filter className="w-3 h-3 text-slate-500" />
                  <span>FILTER:</span>
                  {['ALL', 'VESSEL_TELEMETRY', 'ENVIRONMENTAL_ICE', 'SATELLITE', 'PREDICTION_ML'].map(
                    (cat) => (
                      <button
                        key={cat}
                        onClick={() => setEventCategoryFilter(cat)}
                        className={`px-2 py-0.5 rounded text-[10px] ${
                          eventCategoryFilter === cat
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {cat.replace('_', ' ')}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-1.5 pr-2">
                {filteredEvents.map((evt) => (
                  <div
                    key={evt.event_id}
                    className="p-2 rounded bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs hover:border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-cyan-400 text-[11px] font-bold w-16 shrink-0">
                        {evt.time_display}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          evt.severity === 'CRITICAL'
                            ? 'bg-red-500/20 text-red-400'
                            : evt.severity === 'WARNING'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-blue-500/20 text-blue-300'
                        }`}
                      >
                        {evt.category.replace('_', ' ')}
                      </span>
                      <span className="font-semibold text-slate-200">{evt.title}</span>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px] hidden md:inline truncate max-w-md">
                        — {evt.description}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-500 shrink-0">{evt.source}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: PREDICTION CENTER */}
          {activeTab === 'PREDICTIONS' && (
            <div className="flex flex-col h-full space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-mono text-[11px] font-semibold text-purple-300">
                  AI PREDICTION CENTER • INFERENCE ENGINES (XGBoost, LightGBM, Isolation Forest, OR-Tools)
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  Random Forest Strictly Excluded
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto flex-1 pr-1">
                {predictions.fleet_eta_predictions.map((pred) => (
                  <div
                    key={pred.entity_id}
                    className="p-3 rounded-lg bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-100">{pred.entity_name}</span>
                      <span className="text-[10px] font-mono text-purple-400">
                        Conf: {Math.round(pred.confidence * 100)}%
                      </span>
                    </div>
                    <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      Destination: <span className="text-slate-200 font-bold">{pred.target}</span>
                    </div>
                    <div className="flex items-center justify-between bg-slate-950/60 p-2 rounded text-[11px] font-mono">
                      <span>Predicted ETA:</span>
                      <span className="text-cyan-300 font-bold">
                        {pred.predicted_eta.replace('T', ' ').substring(0, 16)} UTC
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 flex justify-between">
                      <span>Model: {pred.model_framework}</span>
                      <span className="text-amber-400 font-bold">+{pred.expected_delay_hours}h delay</span>
                    </div>
                  </div>
                ))}

                {predictions.risk_predictions.map((r, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">{r.prediction_type}</span>
                      <span className="text-[10px] font-mono text-cyan-400">
                        Conf: {Math.round(r.confidence * 100)}%
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-700 dark:text-slate-300">
                      Horizon: <span className="text-purple-300">{r.horizon}</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950/60 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                      Status: <span className="font-bold text-amber-400">{r.overall_level}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">Engine: {r.model}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ALERT CENTER */}
          {activeTab === 'ALERTS' && (
            <div className="flex flex-col h-full space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-mono text-[11px] font-semibold text-amber-300">
                  COMMAND-LEVEL PRIORITIZED OPERATIONAL ALERTS
                </span>
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <span>SEVERITY:</span>
                  {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => (
                    <button
                      key={sev}
                      onClick={() => setAlertSeverityFilter(sev)}
                      className={`px-2 py-0.5 rounded text-[10px] ${
                        alertSeverityFilter === sev
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {filteredAlerts.map((alert) => (
                  <div
                    key={alert.alert_id}
                    className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs hover:border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            alert.severity === 'CRITICAL'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : alert.severity === 'HIGH'
                              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                              : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          }`}
                        >
                          {alert.severity}
                        </span>
                        <span className="font-bold text-slate-100">{alert.title}</span>
                        <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                          ({alert.entity_name} • {alert.location})
                        </span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-[11px]">{alert.description}</p>
                      <p className="text-[10px] text-cyan-400 font-mono">
                        Direct Action: {alert.recommended_action}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0 pl-3">
                      <span className="text-[10px] font-mono text-slate-500">
                        {alert.timestamp.substring(11, 19)} UTC
                      </span>
                      {alert.status === 'NEW' ? (
                        <button
                          onClick={() => onAcknowledgeAlert(alert.alert_id)}
                          className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-medium transition-colors shadow-sm"
                        >
                          Acknowledge
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Acknowledged
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: DATA HEALTH */}
          {activeTab === 'HEALTH' && (
            <div className="flex flex-col h-full space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-mono text-[11px] font-semibold text-emerald-300">
                  MULTI-SOURCE DATA FUSION MATRIX & FRESHNESS TELEMETRY
                </span>
                <span className="text-[10px] font-mono text-slate-700 dark:text-slate-300">
                  Data Integrity: <span className="text-emerald-400 font-bold">{dataHealth.summary.data_integrity_score}</span>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5 overflow-y-auto flex-1 pr-1">
                {dataHealth.feeds.map((feed, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs font-mono"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200 text-[11px] truncate">
                        {feed.feed_name}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                          feed.status === 'FRESH'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : feed.status === 'STALE'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {feed.status}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Source: {feed.source}</div>
                    <div className="flex justify-between text-[10px] text-slate-700 dark:text-slate-300 pt-1 border-t border-slate-200 dark:border-slate-800">
                      <span>Age: {feed.data_age}</span>
                      <span>Latency: {feed.latency_ms}ms</span>
                    </div>
                    {feed.warning && (
                      <div className="text-[9px] text-amber-300/90 bg-amber-500/10 p-1 rounded">
                        ⚠ {feed.warning}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: AI COPILOT */}
          {activeTab === 'COPILOT' && (
            <div className="flex flex-col h-full space-y-2">
              {/* Preset Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs shrink-0 pb-1">
                <span className="text-slate-500 text-[11px] font-mono mr-1">QUICK PROMPTS:</span>
                {[
                  'Which ship is delayed?',
                  "What is causing Polar Star's delay?",
                  'Which station has stale telemetry?',
                  'Show all critical alerts',
                  'Which cargo is likely to arrive late?',
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendCopilot(chip)}
                    className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 text-[11px] text-slate-700 dark:text-slate-300 hover:text-blue-300 whitespace-nowrap transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Chat Log */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 font-mono text-xs">
                {copilotHistory.map((item, idx) => (
                  <div key={idx} className="space-y-1.5 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/80">
                    <div className="text-blue-400 font-bold flex items-center gap-1.5">
                      <span>&gt; {item.q}</span>
                    </div>
                    <div className="text-slate-200 text-xs whitespace-pre-line leading-relaxed font-sans">
                      {item.a}
                    </div>
                    {item.sources && item.sources.length > 0 && (
                      <div className="pt-1.5 border-t border-slate-200 dark:border-slate-800/80 text-[10px] text-slate-500 dark:text-slate-400">
                        <span className="font-bold text-slate-500 uppercase">Grounded Sources: </span>
                        {item.sources.map((s, si) => (
                          <span key={si} className="inline-block mr-2 bg-slate-950 px-1.5 py-0.5 rounded text-cyan-300">
                            [{s.type}]: {s.info}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {copilotLoading && (
                  <div className="text-blue-400 font-mono text-xs flex items-center gap-2 animate-pulse p-2">
                    <Bot className="w-4 h-4" /> Analyzing real-time Antarctic telemetry...
                  </div>
                )}
              </div>

              {/* Input Box */}
              <div className="flex items-center gap-2 shrink-0 pt-1">
                <input
                  type="text"
                  value={copilotQuestion}
                  onChange={(e) => setCopilotQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendCopilot()}
                  placeholder="Ask the Command Center Copilot about fleet, weather, ice, cargo, or stations..."
                  className="flex-1 bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                />
                <button
                  onClick={() => handleSendCopilot()}
                  disabled={copilotLoading || !copilotQuestion.trim()}
                  className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  Ask
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
