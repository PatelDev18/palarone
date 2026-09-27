"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { getExpedition } from '@/lib/expedition/api';
import { Expedition } from '@/types/expedition';
import { ExpeditionDetailView } from '@/components/expeditions/ExpeditionDetailView';
import { ArrowLeft, Flag, Compass } from 'lucide-react';

export default function ExpeditionDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const expId = params.id as string;
  const initialTab = searchParams.get('tab') || 'overview';

  const [expedition, setExpedition] = useState<Expedition | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await getExpedition(expId);
      setExpedition(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (expId) {
      loadData();
    }
  }, [expId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#020617] text-slate-200">
        <Compass className="w-10 h-10 text-blue-500 animate-spin mb-3" />
        <p className="text-sm font-bold text-slate-900 dark:text-white font-mono">Loading Mission Command Center...</p>
        <span className="text-xs text-slate-500">{expId}</span>
      </div>
    );
  }

  if (!expedition) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#020617] text-slate-200 p-6 text-center">
        <Flag className="w-12 h-12 text-slate-600 mb-3" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Expedition Not Found</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          The requested expedition <strong className="text-blue-400 font-mono">{expId}</strong> was not found in active or archived polar records.
        </p>
        <Link
          href="/expeditions"
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Expedition Management
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 sm:p-6 lg:p-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-5">
        <Link
          href="/expeditions"
          className="hover:text-blue-400 flex items-center gap-1 font-semibold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>EXPEDITIONS</span>
        </Link>
        <span>/</span>
        <span className="font-mono text-blue-400 font-bold">{expedition.id}</span>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-medium truncate">{expedition.name}</span>
      </div>

      {/* Main Mission Control Component */}
      <ExpeditionDetailView
        expedition={expedition}
        initialTab={initialTab}
        onRefresh={loadData}
      />
    </div>
  );
}
