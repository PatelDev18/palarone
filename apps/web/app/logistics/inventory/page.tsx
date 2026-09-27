"use client"
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Package, Calendar } from "lucide-react"

export default function InventoryLogistics() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/logistics/inventory/DAVIS/forecast')
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
          <a href="/logistics/inventory" className="text-secondary hover:text-white transition">Inventory</a>
        </nav>
      </header>

      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Inventory & Shortage Prediction</h1>
          <p className="text-gray-500">LightGBM Demand Forecaster (Phase 37)</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data ? data.forecasts.map((forecast: any, i: number) => (
            <Card key={i} className={forecast.shortage_risk === "CRITICAL" ? 'border-red-200 bg-red-50' : 'border-gray-200'}>
              <CardHeader className="pb-2 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Package size={18} />
                    <span>{forecast.item_category}</span>
                  </CardTitle>
                  <span className={`px-2 py-1 text-xs font-bold rounded ${forecast.shortage_risk === 'CRITICAL' ? 'bg-red-200 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {forecast.shortage_risk} RISK
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Current Stock</p>
                    <p className="text-lg font-bold">{forecast.current_stock}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Burn Rate (Predicted)</p>
                    <p className="text-lg font-bold text-blue-600">{forecast.predicted_burn_rate} / day</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Predicted Days Remaining</span>
                    <span className={`font-bold ${forecast.predicted_days_remaining < forecast.incoming_eta_days ? 'text-red-600' : 'text-green-600'}`}>
                      {forecast.predicted_days_remaining} days
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Next Resupply ETA</span>
                    <span className="font-bold">{forecast.incoming_eta_days} days</span>
                  </div>
                  {forecast.shortage_risk === "CRITICAL" && (
                    <div className="flex justify-between text-sm bg-red-100 text-red-800 p-2 rounded">
                      <span className="font-semibold flex items-center space-x-1"><AlertTriangle size={14}/> <span>Shortage Gap</span></span>
                      <span className="font-bold">{forecast.shortage_gap_days} days</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                   <div>
                     <p className="text-xs text-gray-500">Recommended Restock</p>
                     <p className="font-semibold text-primary">{forecast.recommended_restock_amount}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-[10px] text-purple-600 font-mono bg-purple-50 px-1 rounded">{forecast.prediction_metadata.model_id}</p>
                     <p className="text-[10px] text-gray-500">Conf: {forecast.prediction_metadata.confidence * 100}%</p>
                   </div>
                </div>
              </CardContent>
            </Card>
          )) : (
            <p className="text-sm text-gray-500">Loading LightGBM predictions...</p>
          )}
        </div>
      </div>
    </div>
  )
}
