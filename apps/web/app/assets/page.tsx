"use client"
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, AlertTriangle, CheckCircle, ActivitySquare } from "lucide-react"

export default function AssetsMaintenance() {
  const [assets, setAssets] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/maintenance/assets')
      .then(res => res.json())
      .then(setAssets)
      .catch(console.error);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Asset Health & Predictive Maintenance</h1>
          <p className="text-gray-500">IoT anomaly detection and Remaining Useful Life (RUL) models.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets?.assets.map((asset: any) => (
            <Card key={asset.id} className={asset.health_pct < 70 ? 'border-amber-200' : 'border-gray-200'}>
              <CardHeader className={`${asset.health_pct < 70 ? 'bg-amber-50' : 'bg-gray-50'} pb-4 border-b border-gray-100`}>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <Settings size={18} className="text-gray-700" />
                    <CardTitle className="text-lg">{asset.name}</CardTitle>
                  </div>
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded font-medium">{asset.station}</span>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Health Score</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-2xl font-bold ${asset.health_pct < 70 ? 'text-amber-600' : 'text-green-600'}`}>
                        {asset.health_pct}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">RUL (Predicted)</p>
                    <p className="text-lg font-bold text-primary mt-1">{asset.rul_days} days</p>
                    <p className="text-[10px] text-purple-600 font-mono mt-1 bg-purple-50 inline-block px-1 rounded">{asset.metadata.model_id}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Failure Probability (14 days)</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className={`h-2.5 rounded-full ${asset.failure_probability_14d > 15 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${asset.failure_probability_14d}%` }}></div>
                  </div>
                  <p className="text-xs mt-1 text-right text-gray-600">{asset.failure_probability_14d}% Risk</p>
                </div>

                {asset.anomalies.length > 0 && (
                  <div className="bg-red-50 border border-red-100 rounded p-3">
                    <p className="text-xs font-bold text-red-800 flex items-center space-x-1 mb-1">
                      <ActivitySquare size={14} /> <span>Anomalies Detected (Isolation Forest)</span>
                    </p>
                    <ul className="list-disc pl-4 text-xs text-red-700">
                      {asset.anomalies.map((anom: string, i: number) => <li key={i}>{anom}</li>)}
                    </ul>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-100 rounded p-3">
                  <p className="text-xs font-bold text-blue-800 mb-1">Recommended Action</p>
                  <p className="text-sm text-blue-900">{asset.recommended_action}</p>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
