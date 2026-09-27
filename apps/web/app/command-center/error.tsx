"use client";

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function CommandCenterError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Command Center caught runtime error:', error);
  }, [error]);

  return (
    <div className="h-screen w-screen bg-[#020617] flex flex-col items-center justify-center text-slate-200 select-none p-6">
      <div className="w-12 h-12 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 mb-4">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h2 className="text-lg font-bold font-mono text-slate-100 mb-1">
        Command Center Telemetry Exception
      </h2>
      <p className="text-xs text-slate-400 font-mono max-w-md text-center mb-6">
        {error.message || 'An unexpected error occurred while rendering the operational display.'}
      </p>
      <button
        onClick={() => reset()}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg transition-all"
      >
        <RefreshCw className="w-4 h-4" />
        Reset Operational Interface
      </button>
    </div>
  );
}
