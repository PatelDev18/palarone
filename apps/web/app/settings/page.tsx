"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, Database, Lock, Sun, Moon, Laptop, Palette, Check } from "lucide-react"
import { useTheme } from "@/components/theme/ThemeProvider"

export default function SettingsAdmin() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-150">

      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            System Settings & Preferences
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage appearance themes, user permissions, RBAC security, and operational data pipelines.
          </p>
        </div>

        {/* Appearance & Theme Section */}
        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base md:text-lg">
              <Palette className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Platform Appearance & Visual Theme</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Select how PolarOne displays across your workstation or bridge display. Changes persist across all operational modules.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* Light Mode Option */}
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`relative flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all ${
                  theme === "light"
                    ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 shadow-sm"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40"
                }`}
              >
                {theme === "light" && (
                  <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shadow-sm">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 flex items-center justify-center mb-3">
                  <Sun className="w-5 h-5" />
                </div>
                <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">Light Mode</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Crisp high-contrast daylight palette with white operational cards and clean slate borders.
                </span>
              </button>

              {/* Dark Mode Option */}
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`relative flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all ${
                  theme === "dark"
                    ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 shadow-sm"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40"
                }`}
              >
                {theme === "dark" && (
                  <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shadow-sm">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 flex items-center justify-center mb-3">
                  <Moon className="w-5 h-5" />
                </div>
                <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">Dark Mode</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Deep Antarctic command palette with obsidian navy backdrop and illuminated telemetry badges.
                </span>
              </button>

              {/* System Option */}
              <button
                type="button"
                onClick={() => setTheme("system")}
                className={`relative flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all ${
                  theme === "system"
                    ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 shadow-sm"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40"
                }`}
              >
                {theme === "system" && (
                  <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shadow-sm">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
                <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 flex items-center justify-center mb-3">
                  <Laptop className="w-5 h-5" />
                </div>
                <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">System Sync</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Automatically syncs with OS daylight schedules. Currently resolving to:{" "}
                  <strong className="capitalize text-blue-600 dark:text-blue-400">{resolvedTheme}</strong>.
                </span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Existing Settings Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-base">
                <Users size={18} className="text-blue-600 dark:text-blue-400"/> <span>User Management & RBAC</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                <div>
                  <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">Commander Hayes</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">hayes@polar.ops</p>
                </div>
                <span className="bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800 text-xs px-2.5 py-1 rounded font-bold font-mono">
                  MISSION_COMMANDER
                </span>
              </div>
              <div className="flex justify-between items-center p-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                <div>
                  <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">Sarah Jenks</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">jenks@polar.ops</p>
                </div>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 text-xs px-2.5 py-1 rounded font-bold font-mono">
                  CHIEF_ENGINEER
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-base">
                <Lock size={18} className="text-blue-600 dark:text-blue-400"/> <span>SSO & Authentication</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Enforce 2FA Organization-wide</span>
                  <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-0.5 bg-white w-4 h-4 rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">SAML/SSO Integration (Active Directory)</span>
                  <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-0.5 bg-white w-4 h-4 rounded-full"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-base">
                <Database size={18} className="text-blue-600 dark:text-blue-400"/> <span>Data Providers & Ingestion</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span>AIS Feed (Spire)</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono text-xs">CONNECTED</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2 pt-2">
                  <span>Weather (ECMWF)</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono text-xs">CONNECTED</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span>Satellite (Sentinel-1)</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono text-xs">CONNECTED</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-base">
                <Shield size={18} className="text-blue-600 dark:text-blue-400"/> <span>Offline / Low-Bandwidth Mode</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Configure caching and synchronization settings for isolated deployments without VSAT coverage.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg shadow-sm transition-colors font-medium">
                Force Local Cache Sync
              </button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
