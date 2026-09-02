"use client";

import React, { useState } from 'react';
import { User, ClinicalReport } from '../../lib/types';
import { MOCK_REPORTS } from '../../lib/mockData';
import {
  FileText,
  ShieldAlert,
  HeartPulse
} from '../Icons';

interface ReportsViewProps {
  user: User;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ user }) => {
  const [selectedReport, setSelectedReport] = useState<ClinicalReport | null>(MOCK_REPORTS[0]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Reports Catalog */}
      <div className="lg:col-span-1 space-y-3">
        <div className="glass-panel p-4 rounded-2xl">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-400" /> Clinical Reports ({MOCK_REPORTS.length})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Triage outcomes and physician overrides</p>
        </div>

        {MOCK_REPORTS.map((rep) => {
          const isSelected = selectedReport?.id === rep.id;
          return (
            <div
              key={rep.id}
              onClick={() => setSelectedReport(rep)}
              className={`glass-panel p-4 rounded-2xl cursor-pointer transition border ${
                isSelected
                  ? 'border-sky-500/80 bg-sky-950/20 shadow-lg shadow-sky-500/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-bold text-sky-400">{rep.report_number}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    rep.risk_level === 'emergency'
                      ? 'bg-rose-950 text-rose-400 border border-rose-800'
                      : rep.risk_level === 'high'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}
                >
                  {rep.risk_level}
                </span>
              </div>
              <p className="text-xs text-slate-200 line-clamp-2">{rep.summary}</p>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                <span>{rep.finalized_at?.split(' ')[0]}</span>
                {rep.is_overridden && (
                  <span className="text-indigo-400 font-semibold text-[10px]">Overridden</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Report Detail */}
      <div className="lg:col-span-2">
        {selectedReport ? (
          <div className="glass-panel p-6 rounded-2xl space-y-6">
            <div className="flex items-start justify-between border-b border-slate-800/80 pb-4">
              <div>
                <span className="font-mono text-xs text-sky-400 font-bold">{selectedReport.report_number}</span>
                <h3 className="text-lg font-bold text-white mt-1">{selectedReport.summary}</h3>
                <p className="text-xs text-slate-400">Finalized at {selectedReport.finalized_at}</p>
              </div>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                  selectedReport.risk_level === 'emergency'
                    ? 'bg-rose-950 text-rose-400 border border-rose-800'
                    : selectedReport.risk_level === 'high'
                    ? 'bg-amber-950 text-amber-400 border border-amber-800'
                    : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                }`}
              >
                {selectedReport.risk_level} Risk Tier
              </span>
            </div>

            {/* Overridden Alert (Rule 11) */}
            {selectedReport.is_overridden && (
              <div className="p-4 rounded-xl bg-indigo-950/60 border border-indigo-700/60 text-xs text-indigo-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-indigo-300">
                  <ShieldAlert className="w-4 h-4" /> Doctor Clinical Override Applied (Rule 11)
                </div>
                <p className="text-indigo-100/90 leading-relaxed">
                  <span className="font-semibold">Reason: </span>{selectedReport.override_reason}
                </p>
                <div className="text-[11px] text-indigo-400">
                  Audited at {selectedReport.override_at} by {selectedReport.override_by_doctor?.name || 'Dr. Marcus Smith, MD'}
                </div>
              </div>
            )}

            {/* Vitals Snapshot */}
            {selectedReport.vitals_snapshot && (
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4 text-rose-400" /> Vital Signs Snapshot
                </h4>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500">Blood Pressure:</span>
                    <p className="text-white font-bold">{selectedReport.vitals_snapshot.systolic_bp}/{selectedReport.vitals_snapshot.diastolic_bp} mmHg</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Pulse:</span>
                    <p className="text-white font-bold">{selectedReport.vitals_snapshot.pulse} bpm</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Temp:</span>
                    <p className="text-white font-bold">{selectedReport.vitals_snapshot.temperature || '98.6°F'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Assessment & Recommendations */}
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-1">Clinical Assessment:</h4>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 leading-relaxed">
                  {selectedReport.clinical_assessment}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-1">Care Plan & Recommendations:</h4>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 leading-relaxed">
                  {selectedReport.recommendations}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-panel p-12 rounded-2xl text-center text-slate-500 text-xs">
            Select a report from the list to view clinical details.
          </div>
        )}
      </div>
    </div>
  );
};
