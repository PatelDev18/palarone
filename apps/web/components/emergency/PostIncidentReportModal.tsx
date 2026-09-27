"use client"

import React from 'react'
import { PostIncidentReport } from '@/types/emergency'
import { 
  FileBarChart, 
  X, 
  Download, 
  Printer, 
  CheckCircle2, 
  Timer, 
  Cpu, 
  ShieldAlert, 
  LifeBuoy, 
  Layers,
  Sparkles
} from 'lucide-react'

interface PostIncidentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: PostIncidentReport | null;
}

export function PostIncidentReportModal({
  isOpen,
  onClose,
  report
}: PostIncidentReportModalProps) {
  if (!isOpen || !report) return null;

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${report.report_id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0b1329] border border-slate-700 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-[#0f172a] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <FileBarChart className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
                <span>{report.title}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {report.report_id}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Formal post-incident analysis, AI prediction fidelity, and lessons learned</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-white transition"
              title="Print Report"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownloadJSON}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-white transition"
              title="Export JSON"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 no-scrollbar text-xs font-mono text-slate-700 dark:text-slate-300">
          {/* Executive Summary */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block">
              Executive Incident Summary
            </span>
            <p className="text-slate-200 font-sans text-xs leading-relaxed">
              {report.executive_summary}
            </p>
          </div>

          {/* Performance Timeline Metrics */}
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block">
              Response Performance Metrics
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 text-[9px] uppercase block">Detection Time</span>
                <span className="text-base font-bold text-slate-100">{report.metrics.detection_time_minutes} min</span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 text-[9px] uppercase block">Assessment Time</span>
                <span className="text-base font-bold text-slate-100">{report.metrics.assessment_time_minutes} min</span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 text-[9px] uppercase block">Approval Time</span>
                <span className="text-base font-bold text-emerald-400">{report.metrics.approval_time_minutes} min</span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 text-[9px] uppercase block">Response Time</span>
                <span className="text-base font-bold text-cyan-400">{report.metrics.response_time_minutes} min</span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 text-[9px] uppercase block">Resolution Time</span>
                <span className="text-base font-bold text-indigo-400">{report.metrics.resolution_time_hours} hrs</span>
              </div>
            </div>
          </div>

          {/* AI / ML Performance Evaluation */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase">AI / ML Model Performance</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                {report.ai_performance.accuracy_grade}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-500 text-[9px] uppercase block">Model Architecture</span>
                <span className="text-slate-200 font-bold">{report.ai_performance.model}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[9px] uppercase block">Predicted Delay</span>
                <span className="text-slate-200 font-bold">+{report.ai_performance.predicted_delay_hours} hrs</span>
              </div>
              <div>
                <span className="text-slate-500 text-[9px] uppercase block">Actual Delay</span>
                <span className="text-slate-200 font-bold">+{report.ai_performance.actual_delay_hours} hrs</span>
              </div>
              <div>
                <span className="text-slate-500 text-[9px] uppercase block">Prediction Error</span>
                <span className="text-emerald-400 font-bold">{report.ai_performance.prediction_error_hours} hrs (8.3%)</span>
              </div>
            </div>
          </div>

          {/* Root Cause & Lessons Learned */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[10px] uppercase text-slate-500 dark:text-slate-400 font-bold block">
                Root Cause Analysis
              </span>
              <p className="text-slate-700 dark:text-slate-300 font-sans text-xs leading-relaxed">
                {report.root_cause_analysis}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[10px] uppercase text-slate-500 dark:text-slate-400 font-bold block">
                Lessons Learned & Improvements
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 font-sans">
                {report.lessons_learned.map((ll, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{ll}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-[#0f172a] flex items-center justify-between font-mono text-xs">
          <span className="text-slate-500">
            Generated: {new Date(report.generated_at).toLocaleString()}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadJSON}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
