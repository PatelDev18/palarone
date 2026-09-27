import React from 'react';
import { Layers, Activity } from 'lucide-react';

export default function DigitalTwinLoading() {
  return (
    <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center text-slate-100 select-none">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center animate-pulse shadow-[0_0_30px_rgba(6,182,212,0.3)]">
          <Layers className="w-8 h-8 text-cyan-400" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center border-2 border-slate-950">
          <Activity className="w-3 h-3 text-white animate-spin" />
        </div>
      </div>
      <div className="text-sm font-mono font-bold tracking-widest text-slate-200 uppercase">
        Initializing Antarctic Operational Digital Twin
      </div>
      <div className="text-xs font-mono text-slate-500 mt-1">
        Synchronizing 23-node knowledge graph & telemetry streams...
      </div>
    </div>
  );
}
