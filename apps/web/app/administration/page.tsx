"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, Key, Database, Activity } from "lucide-react"

export default function AdministrationDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-150">

      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <Shield className="text-red-500 w-8 h-8" />
              Administration & Security
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Role-Based Access Control, system audit logs, and infrastructure health.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur-sm shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Active Operators</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">124</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur-sm shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-500/20 rounded-lg text-emerald-600 dark:text-emerald-400">
                <Key className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Active Roles</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">11</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur-sm shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-purple-50 dark:bg-purple-500/20 rounded-lg text-purple-600 dark:text-purple-400">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Database Size (PostGIS)</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">428 GB</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur-sm shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-500/20 rounded-lg text-amber-600 dark:text-amber-400">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">API Health</p>
                <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">99.9%</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur-sm shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900 dark:text-white">Recent Security Audit Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-700 dark:text-slate-300">
                <thead className="text-xs text-slate-500 uppercase bg-slate-100 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Timestamp (UTC)</th>
                    <th className="px-4 py-3">Actor</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">Target</th>
                    <th className="px-4 py-3 rounded-tr-lg">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs">2026-09-27 10:45:12</td>
                    <td className="px-4 py-3">s.jenkins@polarone</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-red-50 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30 rounded text-xs font-semibold">
                        Commander
                      </span>
                    </td>
                    <td className="px-4 py-3">Override Safety Gate</td>
                    <td className="px-4 py-3 font-mono text-xs">EXP-2026-A</td>
                    <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-medium">SUCCESS</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs">2026-09-27 10:42:01</td>
                    <td className="px-4 py-3">System.EdgeSync</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-600/30 rounded text-xs font-semibold">
                        System
                      </span>
                    </td>
                    <td className="px-4 py-3">Priority Transmission</td>
                    <td className="px-4 py-3 font-mono text-xs">STATION-DAVIS-GEN1</td>
                    <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-medium">SUCCESS</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs">2026-09-27 10:15:33</td>
                    <td className="px-4 py-3">unknown_ip (192.168.x.x)</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-600/30 rounded text-xs font-semibold">
                        None
                      </span>
                    </td>
                    <td className="px-4 py-3">Failed Login</td>
                    <td className="px-4 py-3 font-mono text-xs">Auth Service</td>
                    <td className="px-4 py-3 text-rose-600 dark:text-red-400 font-medium">DENIED</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
