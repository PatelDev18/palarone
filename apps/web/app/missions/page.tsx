"use client"
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flag, Navigation, Users } from "lucide-react"

export default function Missions() {
  const [missions, setMissions] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/operations/missions')
      .then(res => res.json())
      .then(setMissions)
      .catch(console.error);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Active Expeditions & Missions</h1>
          <p className="text-gray-500">Track overarching mission progress and assigned resources.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {missions?.missions.map((mission: any) => (
            <Card key={mission.id}>
              <CardHeader className="bg-blue-50 border-b border-blue-100 pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <Flag size={20} className="text-blue-700" />
                    <CardTitle className="text-xl text-blue-900">{mission.name}</CardTitle>
                  </div>
                  <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded font-bold">{mission.status}</span>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-6">
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Users size={16} className="text-gray-500"/>
                    <span className="font-semibold text-gray-700">Commander:</span>
                    <span>{mission.commander}</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-600">Mission Progress</span>
                    <span className="font-bold">{mission.completion_pct}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${mission.completion_pct}%` }}></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center space-x-1">
                      <Navigation size={14} /> <span>Assigned Ships</span>
                    </h4>
                    <div className="flex flex-col gap-1">
                      {mission.assigned_ships.map((ship: string) => (
                        <span key={ship} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded w-fit">{ship}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center space-x-1">
                      <Flag size={14} /> <span>Target Stations</span>
                    </h4>
                    <div className="flex flex-col gap-1">
                      {mission.stations.map((station: string) => (
                        <span key={station} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded w-fit">{station}</span>
                      ))}
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
