'use client';

import React, { useEffect } from 'react';
import { AlertOctagon, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function DigitalTwinError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Digital Twin Route Error:', error);
  }, [error]);

  return (
    <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-100 select-none">
      <div className="w-16 h-16 rounded-xl bg-red-950/60 border border-red-500/40 flex items-center justify-center mb-4">
        <AlertOctagon className="w-8 h-8 text-red-400" />
      </div>
      <h2 className="text-lg font-bold font-mono text-slate-100 uppercase tracking-wider mb-1">
        Digital Twin Telemetry Fault
      </h2>
      <p className="text-xs font-mono text-slate-400 max-w-md text-center mb-6">
        {error.message || 'An unexpected telemetry synchronization exception occurred in the knowledge graph runtime.'}
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={() => reset()}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs transition-colors flex items-center gap-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retry Synchronization</span>
        </button>
        <Link
          href="/command-center"
          className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-mono text-xs transition-colors flex items-center gap-2"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Return to Command Center</span>
        </Link>
      </div>
    </div>
  );
}
