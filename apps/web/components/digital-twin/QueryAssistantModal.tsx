"use client";

import React, { useState } from 'react';
import {
  HelpCircle,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Database,
  ArrowRight,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { AssistantQueryResponse } from '@/types/digital-twin';
import { digitalTwinApi } from '@/lib/api/digital-twin';

interface QueryAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNode: (nodeId: string) => void;
}

interface ChatMessage {
  sender: 'USER' | 'ASSISTANT';
  text: string;
  sources?: Array<{ type: string; detail: string }>;
  confidence?: number;
  relatedNodes?: string[];
  timestamp: string;
}

const SAMPLE_PROMPTS = [
  "What happens if Generator #2 fails completely?",
  "Why is Polar Star delayed in the Weddell Sea?",
  "What is Davis Station's current compound risk?",
  "What are the latest satellite SAR radar passes?"
];

export function QueryAssistantModal({
  isOpen,
  onClose,
  onSelectNode
}: QueryAssistantModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ASSISTANT',
      text: "Greetings, Commander. I am the grounded **Antarctic Operational Digital Twin Assistant**. I answer questions using the live 23-node knowledge graph, telemetry, and cascading impact engine. How can I assist?",
      timestamp: new Date().toTimeString().slice(0, 5)
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputValue;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      sender: 'USER',
      text: textToSend,
      timestamp: new Date().toTimeString().slice(0, 5)
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const res: AssistantQueryResponse = await digitalTwinApi.queryAssistant(textToSend);
      const assistantMsg: ChatMessage = {
        sender: 'ASSISTANT',
        text: res.answer,
        sources: res.sources,
        confidence: res.confidence,
        relatedNodes: res.related_nodes,
        timestamp: new Date().toTimeString().slice(0, 5)
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Twin assistant error:', err);
      const errorMsg: ChatMessage = {
        sender: 'ASSISTANT',
        text: "Error querying the Operational Knowledge Graph engine. Reverting to cached state.",
        timestamp: new Date().toTimeString().slice(0, 5)
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="w-full max-w-2xl bg-slate-900 border border-cyan-800/60 rounded-xl shadow-2xl overflow-hidden flex flex-col h-[600px] max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-cyan-950/60 via-slate-900 to-slate-900 border-b border-cyan-800/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center">
              <Bot className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono tracking-wider">
                  ASK THE OPERATIONAL DIGITAL TWIN
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono font-semibold">
                  GROUNDED AI
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400">
                Natural language query assistant strictly rooted in graph telemetry
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

        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ASSISTANT' && (
                <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-cyan-400" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-lg p-3 space-y-2 ${
                  msg.sender === 'USER'
                    ? 'bg-blue-600 text-white font-sans'
                    : 'bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-slate-200'
                }`}
              >
                <div className="text-[11px] font-sans leading-relaxed whitespace-pre-line">
                  {msg.text}
                </div>

                {/* Grounding Sources */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 space-y-1 font-mono text-[10px]">
                    <div className="text-cyan-400 font-bold flex items-center gap-1">
                      <Database className="w-3 h-3 text-cyan-400" />
                      Grounded Data Lineage:
                    </div>
                    {msg.sources.map((s, idx) => (
                      <div key={idx} className="text-slate-600 dark:text-slate-400 pl-2">
                        • <strong className="text-slate-700 dark:text-slate-300">{s.type}:</strong> {s.detail}
                      </div>
                    ))}
                  </div>
                )}

                {/* Related Graph Nodes */}
                {msg.relatedNodes && msg.relatedNodes.length > 0 && (
                  <div className="pt-1 flex flex-wrap items-center gap-1 font-mono text-[10px]">
                    <span className="text-slate-500">Related Entities:</span>
                    {msg.relatedNodes.map((nId) => (
                      <button
                        key={nId}
                        onClick={() => {
                          onSelectNode(nId);
                          onClose();
                        }}
                        className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors flex items-center gap-1"
                      >
                        {nId}
                        <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {msg.sender === 'USER' && (
                <div className="w-7 h-7 rounded-lg bg-blue-900 border border-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 text-blue-200" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-cyan-400 text-xs">
              <Activity className="w-4 h-4 animate-spin" />
              <span>Querying operational knowledge graph & telemetry streams...</span>
            </div>
          )}
        </div>

        {/* Suggested Prompts */}
        <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <div className="text-[10px] text-slate-500 font-mono mb-1.5">Suggested Questions:</div>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_PROMPTS.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                className="text-[10px] font-mono px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-cyan-300 border border-slate-200 dark:border-slate-800 transition-colors text-left"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything about ships, stations, equipment, or cascading risk..."
            className="flex-1 bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || loading}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold font-mono text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ask</span>
          </button>
        </div>
      </div>
    </div>
  );
}
