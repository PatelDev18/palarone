"use client"

import React, { useState } from 'react';
import { askLogisticsCopilot } from '@/lib/api/logistics';
import {
  Sparkles,
  Send,
  HelpCircle,
  Database,
  Radio,
  Cloud,
  Satellite,
  CheckCircle2,
  BrainCircuit,
  MessageSquare
} from 'lucide-react';

export function LogisticsCopilotAssistant() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Array<{
    question: string;
    answer: string;
    sources: Array<{ type: string; detail: string }>;
  }>>([
    {
      question: "Which vessel is delayed?",
      answer: "Currently, **Kronprins Haakon** (Route R-02 to Bharati Station) is delayed by **+38 hours** due to a 52-knot cyclonic storm front in the Indian Ocean sector. Additionally, **Polar Star** (Route R-03 to Davis Station) is delayed by **+28 hours** due to headwinds and pack-ice concentration (38%).",
      sources: [
        { type: "AIS", detail: "Live AIS telemetry from Kronprins Haakon & Polar Star" },
        { type: "Weather", detail: "ECMWF / NOAA gale advisory 65°S-70°S" },
        { type: "ML Prediction", detail: "XGBoost ETA Predictor (v1.3, confidence 0.89)" }
      ]
    }
  ]);

  const quickPrompts = [
    "Why is Polar Star delayed?",
    "Which station will run out of fuel first?",
    "Which route has the highest ice risk?",
    "What cargo is currently at risk?"
  ];

  const handleAsk = async (textToAsk?: string) => {
    const q = (textToAsk || query).trim();
    if (!q) return;
    setLoading(true);
    setQuery('');
    try {
      const response = await askLogisticsCopilot(q);
      setHistory(prev => [response, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 backdrop-blur-sm p-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              Logistics AI Copilot Decision Support
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                GROUNDED IN LIVE TELEMETRY
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Query real-time vessel delays, inventory forecasts, satellite radar observations, and route risks without hallucinations.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Questions Pills */}
      <div className="flex flex-wrap items-center gap-2 my-4">
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1">
          Quick Inquiries:
        </span>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleAsk(prompt)}
            className="px-3 py-1 rounded-lg bg-slate-50 dark:bg-slate-950/80 hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-white border border-slate-200 dark:border-slate-800 text-xs transition-colors flex items-center gap-1.5"
          >
            <HelpCircle className="w-3 h-3 text-purple-400" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Query Input */}
      <div className="flex items-center gap-2 my-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          placeholder="Ask copilot about fleet positions, delayed shipments, station resupply deadlines, or ice risks..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 shadow-inner"
        />
        <button
          disabled={loading || !query.trim()}
          onClick={() => handleAsk()}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors flex items-center gap-2 disabled:opacity-50 shadow-md"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{loading ? 'Consulting Models...' : 'Query Copilot'}</span>
        </button>
      </div>

      {/* Response Stream History */}
      <div className="space-y-4 mt-6">
        {history.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs"
          >
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold">
              <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
              <span>{item.question}</span>
            </div>

            <p className="text-slate-200 leading-relaxed pl-5 border-l-2 border-purple-500/40">
              {item.answer}
            </p>

            {/* Source citations (Section 40) */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-[10px] pl-5">
              <span className="text-slate-500 font-bold uppercase tracking-wider">Grounding Telemetry Sources:</span>
              {item.sources.map((src, sIdx) => (
                <span
                  key={sIdx}
                  className="px-2 py-0.5 rounded bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1 font-mono"
                  title={src.detail}
                >
                  <BrainCircuit className="w-3 h-3 text-purple-400" />
                  <strong>{src.type}:</strong> {src.detail}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
