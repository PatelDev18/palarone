"use client"

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { NewExpeditionWizard } from '@/components/expeditions/NewExpeditionWizard';

export default function NewExpeditionPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 sm:p-6 lg:p-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6 max-w-5xl mx-auto">
        <Link
          href="/expeditions"
          className="hover:text-blue-400 flex items-center gap-1 font-semibold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>EXPEDITIONS</span>
        </Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-medium">NEW MISSION ARCHITECTURE</span>
      </div>

      <NewExpeditionWizard />
    </div>
  );
}
