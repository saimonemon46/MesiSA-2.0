"use client";

import React from 'react';
import { Activity } from '../Icons';

export const LiveSupervisionView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-2">
            <Activity className="w-3.5 h-3.5 animate-pulse" /> Live Telemetry
          </div>
          <h2 className="text-xl font-bold text-white">Live AI-Patient Triage Supervision</h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time observational feed of active LangGraph triage reasoning workflows.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-panel p-5 rounded-2xl border-rose-500/40 bg-rose-950/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-rose-300 text-xs">Session #TS-991 • John Doe</span>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800">
              Escalated Emergency
            </span>
          </div>
          <p className="text-xs text-slate-300">Patient reported: "Crushing chest pain radiating to left arm"</p>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
            <strong>Rule 12 Applied:</strong> Fast-path red flag bypass triggered. Emergency dispatch notified.
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sky-300 text-xs">Session #TS-992 • Emma Watson</span>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
              In Progress
            </span>
          </div>
          <p className="text-xs text-slate-300">Patient reported: "Mild dry cough for 3 days"</p>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
            <strong>LangGraph State:</strong> Question 2 of 3 (Evaluating fever / chest tightness).
          </div>
        </div>
      </div>
    </div>
  );
};
