"use client"
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Ship, Anchor, AlertCircle } from "lucide-react"

export default function LogisticsOverview() {
  const [cargo, setCargo] = useState<any>(null);
  const [inventory, setInventory] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/logistics/cargo')
      .then(res => res.json())
      .then(setCargo)
      .catch(console.error);

    fetch('http://localhost:8000/api/v1/logistics/inventory/s1/forecast')
      .then(res => res.json())
      .then(data => {
        if (data.forecasts && data.forecasts.length > 0) {
          // Add the L suffix mapping for the UI since the API returns current_stock
          const forecast = data.forecasts[0];
          setInventory({
            ...forecast,
            item: forecast.item_category,
            risk_level: forecast.shortage_risk,
            current_stock_L: forecast.current_stock,
            avg_consumption_day: forecast.predicted_burn_rate,
            predicted_shortage_days: forecast.predicted_days_remaining,
            incoming_shipment_eta_days: forecast.incoming_eta_days,
            model: forecast.prediction_metadata?.model_id || 'LGBM_DEMAND_01'
          });
        } else {
          setInventory(data);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <header className="h-14 bg-primary text-primary-foreground flex items-center px-6 shadow-md z-10 shrink-0">
        <div className="font-bold text-xl mr-8">POLARONE</div>
        <nav className="flex space-x-6 text-sm font-medium">
          <a href="/command-center" className="text-gray-300 hover:text-white transition">Command Center</a>
          <a href="/digital-twin" className="text-gray-300 hover:text-white transition">Digital Twin</a>
          <a href="/logistics/ships" className="text-secondary hover:text-white transition">Logistics</a>
          <a href="/intelligence/satellites" className="text-gray-300 hover:text-white transition">Intelligence</a>
        </nav>
      </header>

      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        <h1 className="text-2xl font-bold text-primary">Logistics & Cargo Management</h1>
        <p className="text-gray-500">Inventory forecasting and supply chain tracking.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package size={18} className="text-blue-500"/> <span>Active Cargo Shipments</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cargo ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b text-gray-500">
                        <th className="py-2">Type</th>
                        <th className="py-2">Status</th>
                        <th className="py-2">Ship</th>
                        <th className="py-2">Destination</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cargo.cargo.map((item: any) => (
                        <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="py-2 font-medium">{item.type}</td>
                          <td className="py-2">
                            <span className="bg-gray-100 px-2 py-1 rounded text-xs">{item.status}</span>
                          </td>
                          <td className="py-2">{item.ship}</td>
                          <td className="py-2">{item.destination}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Loading cargo data...</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-600">
                <AlertCircle size={18} /> <span>AI Inventory Forecast</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {inventory ? (
                <div className="space-y-4 bg-amber-50 p-4 rounded-md border border-amber-100">
                  <div className="flex justify-between items-center border-b border-amber-200 pb-2">
                    <span className="font-bold text-amber-900">{inventory.item} (Davis Station)</span>
                    <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded font-bold uppercase">{inventory.risk_level} RISK</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Current Stock</p>
                      <p className="font-semibold text-lg">{inventory.current_stock_L} L</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Consumption Rate</p>
                      <p className="font-semibold">{inventory.avg_consumption_day} L/day</p>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded border border-amber-200 mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Predicted Shortage In:</span>
                      <span className="text-sm font-bold text-red-600">{inventory.predicted_shortage_days} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Resupply ETA (Polar Star):</span>
                      <span className="text-sm font-bold text-gray-800">{inventory.incoming_shipment_eta_days} days</span>
                    </div>
                  </div>
                  <p className="text-xs text-amber-700 italic">Prediction by {inventory.model}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Loading forecast...</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
