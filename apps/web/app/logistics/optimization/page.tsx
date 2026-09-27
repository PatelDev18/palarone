"use client"
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Map, ArrowRight, Route, Clock, Zap } from "lucide-react"

export default function RouteOptimization() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/optimization/route/optimize/SHIP001')
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <header className="h-14 bg-primary text-primary-foreground flex items-center px-6 shadow-md z-10 shrink-0">
        <div className="font-bold text-xl mr-8">POLARONE</div>
        <nav className="flex space-x-6 text-sm font-medium">
          <a href="/command-center" className="text-gray-300 hover:text-white transition">Command Center</a>
          <a href="/logistics/ships" className="text-gray-300 hover:text-white transition">Ships</a>
          <a href="/logistics/inventory" className="text-gray-300 hover:text-white transition">Inventory</a>
          <a href="/logistics/optimization" className="text-secondary hover:text-white transition">Route Optimization</a>
        </nav>
      </header>

      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Dynamic Route Optimization</h1>
          <p className="text-gray-500">Google OR-Tools VRP Solver (Phase 38)</p>
        </div>

        {data ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-gray-200">
              <CardHeader className="bg-gray-50 border-b border-gray-100">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Map size={18} className="text-gray-500"/>
                  <span>Original Plan</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  {data.original_plan.route.map((stop: string, i: number) => (
                    <React.Fragment key={i}>
                      <span className="bg-gray-100 px-2 py-1 rounded text-sm font-medium">{stop}</span>
                      {i < data.original_plan.route.length - 1 && <ArrowRight size={14} className="text-gray-400" />}
                    </React.Fragment>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Est. Distance</p>
                    <p className="font-bold">{data.original_plan.distance_nm} nm</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Est. Time</p>
                    <p className="font-bold">{data.original_plan.estimated_hours} hrs</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 shadow-md ring-1 ring-blue-100">
              <CardHeader className="bg-blue-50 border-b border-blue-100">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center space-x-2 text-blue-900">
                    <Zap size={18} className="text-blue-600 fill-blue-600"/>
                    <span>OR-Tools Optimized Route</span>
                  </CardTitle>
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-bold">RECOMMENDED</span>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  {data.optimized_plan.route.map((stop: string, i: number) => (
                    <React.Fragment key={i}>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium border border-blue-200">{stop}</span>
                      {i < data.optimized_plan.route.length - 1 && <ArrowRight size={14} className="text-blue-400" />}
                    </React.Fragment>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-100">
                  <div>
                    <p className="text-xs text-blue-500 uppercase">Opt. Distance</p>
                    <p className="font-bold text-blue-900">{data.optimized_plan.distance_nm} nm</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-500 uppercase">Opt. Time</p>
                    <p className="font-bold text-blue-900">{data.optimized_plan.estimated_hours} hrs</p>
                  </div>
                </div>
                <div className="bg-white p-3 rounded border border-blue-100 shadow-sm mt-4">
                   <p className="text-xs font-bold text-blue-800 mb-1">Reason for Rerouting</p>
                   <p className="text-sm text-gray-700">{data.primary_reason}</p>
                </div>
                <div className="flex justify-between text-xs text-gray-500 pt-2">
                   <span>Delta: {data.metrics.distance_delta_nm > 0 ? '+' : ''}{data.metrics.distance_delta_nm} nm / {data.metrics.time_delta_hours > 0 ? '+' : ''}{data.metrics.time_delta_hours} hrs</span>
                   <span className="font-mono bg-gray-100 px-1 rounded">{data.optimization_engine}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Running route solver...</p>
        )}
      </div>
    </div>
  )
}
