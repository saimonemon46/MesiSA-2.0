"use client";

import React, { useState } from 'react';
import { User, ClinicalReport, RiskLevel } from '../../lib/types';
import { MOCK_REPORTS } from '../../lib/mockData';
import { api } from '../../lib/api';
import { ClinicalOverrideModal } from './ClinicalOverrideModal';
import {
  Stethoscope,
  ShieldAlert,
  FileEdit
} from '../Icons';

interface DoctorDashboardProps {
  user: User;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ user }) => {
  const [reports, setReports] = useState<ClinicalReport[]>(MOCK_REPORTS);
  const [overrideReport, setOverrideReport] = useState<ClinicalReport | null>(null);

  const handleOverrideSubmit = async (
    reportId: number,
    reason: string,
    assessment: string,
    recommendations: string,
    riskLevel: RiskLevel
  ) => {
    const updated = await api.doctor.overrideReport(reportId, user.id, reason, assessment, recommendations, riskLevel);
    setReports(prev => prev.map(r => (r.id === reportId ? updated : r)));
    setOverrideReport(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border-teal-900/40 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold mb-2">
            <Stethoscope className="w-3.5 h-3.5" /> Clinical Authority Active
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome, {user.name}</h1>
          <p className="text-xs text-slate-300 mt-1">
            {user.doctor_profile?.specialty} • License {user.doctor_profile?.license_number} • Authorized for Clinical Triage Overrides (Rule 11).
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
          Verified Physician
        </span>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border-teal-500/20">
          <div className="text-xs font-bold text-slate-400 uppercase mb-2">Today's Appointments</div>
          <div className="text-2xl font-bold text-white">2 Consultations</div>
          <p className="text-xs text-slate-400 mt-1">Next: John Doe (10:30 AM)</p>
        </div>
        <div className="glass-panel p-5 rounded-2xl border-indigo-500/20">
          <div className="text-xs font-bold text-slate-400 uppercase mb-2">Pending Triage Reviews</div>
          <div className="text-2xl font-bold text-white">{reports.length} Reports</div>
          <p className="text-xs text-slate-400 mt-1">AI-generated triage assessments</p>
        </div>
        <div className="glass-panel p-5 rounded-2xl border-amber-500/20">
          <div className="text-xs font-bold text-slate-400 uppercase mb-2">Audited Overrides (Rule 11)</div>
          <div className="text-2xl font-bold text-amber-300">{reports.filter(r => r.is_overridden).length} Overrides</div>
          <p className="text-xs text-slate-400 mt-1">Recorded in system audit log</p>
        </div>
      </div>

      {/* Reports Awaiting Review / Override */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-teal-400" /> Clinical Reports & AI Triage Queue
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Review AI assessments and perform authorized clinical overrides with reason logging.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-sky-400">{rep.report_number}</span>
                  <span className="text-xs font-bold text-white">• {rep.patient?.name || 'Patient'}</span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                      rep.risk_level === 'emergency'
                        ? 'bg-rose-950 text-rose-400 border border-rose-800'
                        : rep.risk_level === 'high'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}
                  >
                    {rep.risk_level} Risk
                  </span>
                  {rep.is_overridden && (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800">
                      Overridden
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300">{rep.summary}</p>
                {rep.is_overridden && (
                  <p className="text-[11px] text-indigo-300 italic">
                    Override reason: {rep.override_reason}
                  </p>
                )}
              </div>

              <button
                onClick={() => setOverrideReport(rep)}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 font-bold text-white text-xs flex items-center gap-1.5 shadow-md shrink-0 transition"
              >
                <FileEdit className="w-3.5 h-3.5" /> Override / Edit Report
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Clinical Override Dialog Modal (Rule 11) */}
      {overrideReport && (
        <ClinicalOverrideModal
          report={overrideReport}
          doctor={user}
          onClose={() => setOverrideReport(null)}
          onSubmit={handleOverrideSubmit}
        />
      )}
    </div>
  );
};
