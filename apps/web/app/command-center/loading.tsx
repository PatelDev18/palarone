import React from 'react';
import { Compass } from 'lucide-react';

export default function CommandCenterLoading() {
  return (
    <div className="h-screen w-screen bg-[#020617] flex flex-col items-center justify-center text-slate-200 select-none">
      <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mb-4">
        <Compass className="w-6 h-6 animate-spin" />
      </div>
      <div className="font-extrabold text-xl tracking-wider text-slate-100 font-mono">
        POLAR<span className="text-blue-500">ONE</span>
      </div>
      <p className="text-xs text-slate-400 font-mono mt-2">
        Loading Command Center Telemetry, Bathymetry & Predictive ML Systems...
      </p>
    </div>
  );
}
