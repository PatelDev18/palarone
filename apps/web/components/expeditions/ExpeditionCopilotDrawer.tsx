"use client"

import React, { useState } from 'react';
import { queryCopilot } from '@/lib/expedition/api';
import { Sparkles, Send, X, Bot, User, Clock, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ExpeditionCopilotDrawerProps {
  expeditionId?: string;
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  sender: 'user' | 'copilot';
  text: string;
  model?: string;
  confidence?: number;
  data_freshness?: string;
  suggested_actions?: string[];
  timestamp: string;
}

export function ExpeditionCopilotDrawer({
  expeditionId,
  isOpen,
  onClose
}: ExpeditionCopilotDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'copilot',
      text: expeditionId
        ? `PolarOne Copilot active for **${expeditionId}**. Ask anything about this mission's weather windows, ice concentration, telemetry anomalies, fuel burn projections, or contingency protocols.`
        : `PolarOne Expedition Copilot active. Grounded in live AIS, SAR, and station telemetry across all Antarctic missions. Try asking: *"Show me the highest-risk expeditions"*, *"Why is Expedition C delayed?"*, or *"What resources are running low?"*`,
      model: 'PolarOne_Copilot_Expeditions_v2',
      confidence: 0.98,
      data_freshness: 'Synchronized live (<1 min)',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = expeditionId ? [
    `Why is ${expeditionId} delayed?`,
    `What weather conditions could affect ${expeditionId}?`,
    `What resources are running low?`,
    `Show alternative contingency plans`
  ] : [
    'Show me the highest-risk expeditions',
    'Why is Expedition C delayed?',
    'How many personnel are deployed?',
    'What resources are running low?'
  ];

  const handleSend = async (queryText?: string) => {
    const q = queryText || input;
    if (!q.trim() || loading) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await queryCopilot(q, expeditionId);
      const copilotMsg: ChatMessage = {
        sender: 'copilot',
        text: res.answer,
        model: res.model,
        confidence: res.confidence,
        data_freshness: res.data_freshness,
        suggested_actions: res.suggested_actions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, copilotMsg]);
    } catch (err) {
      console.error('Copilot error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-[#070e24] border-l border-purple-500/40 shadow-2xl flex flex-col animate-slideLeft text-slate-200">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-purple-950/80 to-[#0b1329] border-b border-purple-900/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-600/30 border border-purple-400/50 flex items-center justify-center text-purple-400">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              POLARONE COPILOT
              <span className="text-[10px] font-mono text-purple-300 bg-purple-900/50 px-1.5 py-0.5 rounded border border-purple-700/60">
                OPERATIONAL AI
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Grounded polar telemetry & decision assistant
            </p>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-white p-1">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Prompts */}
      <div className="p-3 bg-[#030712] border-b border-slate-200 dark:border-slate-800/80 overflow-x-auto whitespace-nowrap space-x-1.5 flex shrink-0 scrollbar-none">
        {quickPrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(p)}
            className="text-[11px] bg-slate-900 hover:bg-slate-800 text-purple-300 border border-purple-900/50 px-2.5 py-1 rounded-full transition-colors shrink-0"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-500 dark:text-slate-400">
              {m.sender === 'user' ? (
                <>
                  <span>You (Commander)</span>
                  <User className="w-3 h-3 text-blue-400" />
                </>
              ) : (
                <>
                  <Bot className="w-3 h-3 text-purple-400" />
                  <span>PolarOne Copilot</span>
                </>
              )}
              <span>· {m.timestamp}</span>
            </div>

            <div
              className={`p-3 rounded-xl max-w-[90%] leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-200 rounded-tl-none space-y-2'
              }`}
            >
              <div className="whitespace-pre-wrap">{m.text}</div>

              {m.sender === 'copilot' && m.model && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 text-[10px] text-slate-500 dark:text-slate-400 font-mono flex flex-wrap gap-2 justify-between">
                  <span>MODEL: <strong className="text-purple-400">{m.model}</strong></span>
                  {m.confidence && <span>CONFIDENCE: <strong className="text-emerald-400">{Math.round(m.confidence * 100)}%</strong></span>}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-purple-400 p-2">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Consulting Antarctic telemetry & ML models...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 bg-[#0b1329] border-t border-slate-200 dark:border-slate-800 shrink-0">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask Copilot about missions, delays, weather..."
            className="flex-1 bg-[#020617] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white rounded-lg transition-colors shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="text-[10px] text-slate-500 text-center mt-2 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          Responses strictly grounded in live polar records. AI cannot alter mission parameters without Commander sign-off.
        </div>
      </div>
    </div>
  );
}
