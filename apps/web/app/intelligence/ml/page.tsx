"use client"

import React, { useState, useEffect } from 'react'
import { AIModel, AIPrediction } from '@/types/intelligence'
import { AIPredictionsSection } from '@/components/intelligence/AIPredictionsSection'
import { ModelRegistrySection } from '@/components/intelligence/ModelRegistrySection'
import { IntelligenceNav } from '@/components/intelligence/IntelligenceNav'
import { useRouter } from 'next/navigation'

export default function MLRoutePage() {
  const router = useRouter();
  const [models, setModels] = useState<AIModel[]>([]);
  const [predictions, setPredictions] = useState<AIPrediction[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/intelligence/models')
      .then(res => res.json())
      .then(data => {
        if (data.models) setModels(data.models);
      })
      .catch(console.error);

    fetch('http://localhost:8000/api/v1/intelligence/predictions')
      .then(res => res.json())
      .then(data => {
        if (data.predictions) setPredictions(data.predictions);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#020617] text-slate-200">
      <IntelligenceNav 
        activeSection="models" 
        onSelectSection={(sec) => {
          if (sec === 'models') return;
          router.push(`/intelligence?section=${sec}`);
        }} 
      />

      <main className="flex-1 p-6 space-y-6 max-w-[1800px] w-full mx-auto">
        <AIPredictionsSection predictions={predictions} models={models} />
        <ModelRegistrySection models={models} />
      </main>
    </div>
  );
}
