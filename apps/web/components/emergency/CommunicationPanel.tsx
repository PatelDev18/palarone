"use client"

import React, { useState } from 'react'
import { CommunicationEvent, CommunicationQuality } from '@/types/emergency'
import { 
  Radio, 
  MessageSquare, 
  Send, 
  Wifi, 
  WifiOff, 
  PhoneCall, 
  Ship, 
  Building2, 
  ShieldCheck, 
  UserCheck, 
  Sparkles,
  Signal
} from 'lucide-react'

interface CommunicationPanelProps {
  communications: CommunicationEvent[];
  onSendMessage: (sender: string, channel: string, message: string) => Promise<void>;
  currentCommanderName?: string;
}

export function CommunicationPanel({
  communications,
  onSendMessage,
  currentCommanderName = 'Cmdr. Hayes'
}: CommunicationPanelProps) {
  const [selectedChannel, setSelectedChannel] = useState('Iridium Polar SAT-3');
  const [activeSender, setActiveSender] = useState(currentCommanderName);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Tactical Channel Status
  const channels = [
    { name: 'Polar Star (Bridge)', role: 'Master', status: 'DEGRADED' as CommunicationQuality, channel: 'Iridium Polar SAT-3', lastContact: '2 min ago' },
    { name: 'Davis Station (Radio)', role: 'Station Comms', status: 'STRONG' as CommunicationQuality, channel: 'VHF Marine Ch 16', lastContact: '5 min ago' },
    { name: 'Ocean Guardian', role: 'Icebreaker Escort', status: 'GOOD' as CommunicationQuality, channel: 'Inmarsat-C Fleet', lastContact: '12 min ago' },
    { name: 'Falcon-1 SAR Helo', role: 'Airborne Team', status: 'DEGRADED' as CommunicationQuality, channel: 'HF 4125 kHz', lastContact: '18 min ago' },
    { name: 'ARCC Australia', role: 'External SAR Agency', status: 'STRONG' as CommunicationQuality, channel: 'Encrypted Terrestrial Mesh', lastContact: '1 min ago' }
  ];

  const getSignalBadge = (sig: CommunicationQuality) => {
    switch (sig) {
      case 'STRONG': return 'bg-emerald-950 text-emerald-400 border-emerald-800';
      case 'GOOD': return 'bg-blue-950 text-blue-400 border-blue-800';
      case 'DEGRADED': return 'bg-amber-950 text-amber-400 border-amber-800';
      case 'LOST': default: return 'bg-rose-950 text-rose-400 border-rose-800';
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsSending(true);
    try {
      await onSendMessage(activeSender, selectedChannel, newMessage.trim());
      setNewMessage('');
    } catch (err: any) {
      alert(`Communication transmission error: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-[#0b1329] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
              <span>Antarctic Maritime Tactical Communications</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                MULTI-CHANNEL
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Secure high-latitude satellite and HF radio links with bridge, bases, and escorts</p>
          </div>
        </div>

        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
          Messages: <strong className="text-cyan-400">{communications.length}</strong>
        </span>
      </div>

      {/* Channel & Fleet Station Status Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 font-mono text-[11px]">
        {channels.map((ch, i) => (
          <div 
            key={i}
            className="p-2.5 rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1 hover:border-slate-700 transition"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 truncate">{ch.name}</span>
              <span className={`text-[9px] px-1 py-0.2 rounded border font-semibold ${getSignalBadge(ch.status)}`}>
                {ch.status}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{ch.channel}</div>
            <div className="text-[9px] text-slate-500 flex items-center justify-between pt-1">
              <span>{ch.lastContact}</span>
              <button 
                onClick={() => setSelectedChannel(ch.channel)}
                className="text-blue-400 hover:text-blue-300 font-semibold"
              >
                Connect
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Communications Message Stream */}
      <div className="bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-lg p-3 space-y-3 h-64 overflow-y-auto no-scrollbar font-mono text-xs">
        {communications.map(msg => {
          const isMe = msg.sender.includes('Cmdr') || msg.sender.includes('Command');
          const isAI = msg.sender.includes('AI');

          return (
            <div
              key={msg.id}
              className={`p-3 rounded-lg border max-w-[85%] ${
                isMe
                  ? 'ml-auto bg-blue-950/40 border-blue-800 text-blue-100'
                  : isAI
                  ? 'bg-purple-950/40 border-purple-800 text-purple-100'
                  : 'bg-slate-900/90 border-slate-200 dark:border-slate-800 text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between gap-4 mb-1 text-[10px] text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800/60 pb-1">
                <span className="font-bold flex items-center gap-1.5">
                  {isAI ? <Sparkles className="w-3 h-3 text-purple-400" /> : <UserCheck className="w-3 h-3 text-blue-400" />}
                  <span>{msg.sender}</span>
                  {msg.sender_role && <span className="opacity-75">({msg.sender_role})</span>}
                </span>

                <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC</span>
              </div>

              <p className="text-xs font-sans leading-relaxed mt-1">
                {msg.message}
              </p>

              <div className="flex items-center justify-between text-[9px] text-slate-500 mt-2 font-mono">
                <span>Via: {msg.channel}</span>
                <span className="text-emerald-400">ACKNOWLEDGED</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Transmit Bar */}
      <form onSubmit={handleSend} className="space-y-2 pt-1">
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={activeSender}
            onChange={e => setActiveSender(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500"
          >
            <option value="Cmdr. Hayes">Cmdr. Hayes (Operations Commander)</option>
            <option value="Duty Officer">Duty Officer (ARCC Command)</option>
            <option value="Ice Pilot">Ice Pilot (Operations Bridge)</option>
          </select>

          <select
            value={selectedChannel}
            onChange={e => setSelectedChannel(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500"
          >
            <option value="Iridium Polar SAT-3">Channel: Iridium Polar SAT-3</option>
            <option value="VHF Marine Ch 16">Channel: VHF Marine Ch 16</option>
            <option value="Inmarsat-C Fleet">Channel: Inmarsat-C Fleet</option>
            <option value="HF 4125 kHz">Channel: HF 4125 kHz Distress</option>
          </select>

          <input
            type="text"
            placeholder="Type tactical bridge transmission or query..."
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={isSending}
            className="flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold font-mono transition shadow-md shadow-blue-900/30 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSending ? 'Sending...' : 'Transmit'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
