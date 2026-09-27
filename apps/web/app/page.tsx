import Link from 'next/link'
import { ArrowRight, Activity, Globe, Package, Cpu, Shield, Zap } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500/30 overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute top-0 inset-x-0 h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[25%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-sky-600/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center pt-24 pb-16 px-6 sm:px-12 max-w-7xl mx-auto min-h-screen justify-center">
        
        {/* Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Production V2 Live
        </div>

        {/* Hero Text */}
        <h1 className="text-5xl sm:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-blue-100 to-slate-400 tracking-tight text-center mb-6">
          POLAR<span className="text-blue-500">ONE</span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-400 text-center max-w-2xl font-light mb-12">
          The ultimate Antarctic & Polar Expedition Operations Platform. 
          <br className="hidden sm:block"/> Plan with precision. Track in real-time. Predict anomalies. Respond instantly.
        </p>

        {/* Main CTA */}
        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Link href="/command-center" className="group flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-lg font-semibold transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]">
            Enter Command Center
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/digital-twin" className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-8 py-3.5 rounded-lg font-semibold transition-all">
            <Globe className="w-5 h-5" />
            View Digital Twin
          </Link>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          
          <Link href="/command-center" className="group p-6 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/50 transition-all">
            <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <h2 className="font-semibold text-lg text-slate-100 mb-2">Command Center</h2>
            <p className="text-sm text-slate-400">Unified operational dashboard for real-time fleet, asset, and weather telemetry.</p>
          </Link>

          <Link href="/digital-twin" className="group p-6 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 hover:border-purple-500/50 hover:bg-slate-800/50 transition-all">
            <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Globe className="w-6 h-6" />
            </div>
            <h2 className="font-semibold text-lg text-slate-100 mb-2">Digital Twin</h2>
            <p className="text-sm text-slate-400">Interactive 3D mapping and knowledge graph of global expedition dependencies.</p>
          </Link>

          <Link href="/logistics/ships" className="group p-6 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/50 transition-all">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Package className="w-6 h-6" />
            </div>
            <h2 className="font-semibold text-lg text-slate-100 mb-2">Logistics</h2>
            <p className="text-sm text-slate-400">Inventory forecasting, cargo manifesting, and dynamic VRP route optimization.</p>
          </Link>

          <Link href="/intelligence/satellites" className="group p-6 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/50 transition-all">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h2 className="font-semibold text-lg text-slate-100 mb-2">Intelligence</h2>
            <p className="text-sm text-slate-400">STAC satellite ingestion and predictive ML registry for ETA and anomaly detection.</p>
          </Link>

        </div>

        {/* Footer info */}
        <div className="mt-20 flex gap-8 text-sm text-slate-500 font-medium">
          <div className="flex items-center gap-2"><Shield className="w-4 h-4"/> SOC2 Compliant</div>
          <div className="flex items-center gap-2"><Zap className="w-4 h-4"/> 99.99% Uptime</div>
        </div>

      </div>
    </main>
  )
}
