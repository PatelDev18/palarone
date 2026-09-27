"use client"

import React, { useState, useEffect } from 'react'
import { SatelliteScene, SatelliteProvider, PipelineStage, CoveragePass } from '@/types/intelligence'
import { SatelliteIntelligenceSection } from '@/components/intelligence/SatelliteIntelligenceSection'
import { SatelliteSceneModal } from '@/components/intelligence/SatelliteSceneModal'
import { IntelligenceNav } from '@/components/intelligence/IntelligenceNav'
import { useRouter } from 'next/navigation'

export default function SatellitesRoutePage() {
  const router = useRouter();
  const [scenes, setScenes] = useState<SatelliteScene[]>([]);
  const [providers, setProviders] = useState<SatelliteProvider[]>([]);
  const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>([]);
  const [coveragePasses, setCoveragePasses] = useState<CoveragePass[]>([]);
  const [selectedSceneModal, setSelectedSceneModal] = useState<SatelliteScene | null>(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/intelligence/satellite/acquisitions')
      .then(res => res.json())
      .then(data => {
        if (data.scenes) setScenes(data.scenes);
        if (data.pipeline_stages) setPipelineStages(data.pipeline_stages);
        if (data.coverage_passes) setCoveragePasses(data.coverage_passes);
      })
      .catch(console.error);

    fetch('http://localhost:8000/api/v1/intelligence/satellite/providers')
      .then(res => res.json())
      .then(data => {
        if (data.providers) setProviders(data.providers);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#020617] text-slate-200">
      <IntelligenceNav 
        activeSection="satellite" 
        onSelectSection={(sec) => {
          if (sec === 'satellite') return;
          router.push(`/intelligence?section=${sec}`);
        }} 
      />

      <main className="flex-1 p-6 space-y-6 max-w-[1800px] w-full mx-auto">
        <SatelliteIntelligenceSection
          scenes={scenes}
          providers={providers}
          pipelineStages={pipelineStages}
          coveragePasses={coveragePasses}
          onOpenSceneModal={setSelectedSceneModal}
          onOpenMap={() => router.push('/intelligence?section=overview')}
          onRunAnalysis={() => router.push('/intelligence?section=models')}
        />
      </main>

      <SatelliteSceneModal 
        scene={selectedSceneModal}
        onClose={() => setSelectedSceneModal(null)}
        onOpenMap={() => router.push('/intelligence?section=overview')}
        onRunAnalysis={() => router.push('/intelligence?section=models')}
      />
    </div>
  );
}
