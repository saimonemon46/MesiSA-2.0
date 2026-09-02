"use client";

import React, { useEffect, useState } from 'react';
import { User } from '../../lib/types';
import { api } from '../../lib/api';
import {
  Shield,
  Users,
  Building2,
  Stethoscope,
  Activity,
  AlertTriangle,
  History,
  CheckCircle2
} from '../Icons';

interface AdminDashboardProps {
  user: User;
  onNavigate: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onNavigate }) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.admin.getDashboard().then(setData);
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-indigo-900/40 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Shield className="w-3.5 h-3.5" /> Super Admin Governance Dashboard
          </div>
          <h1 className="text-2xl font-bold text-white">System Operations & Clinical Oversight</h1>
          <p className="text-xs text-slate-300 mt-1">
            Monitoring active AI triage workloads, doctor verification credentials, audit trails, and system settings.
          </p>
        </div>
        <button
          onClick={() => onNavigate('live-supervision')}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:opacity-90 font-bold text-white text-xs flex items-center gap-2 shadow-lg shadow-rose-600/20 transition"
        >
          <Activity className="w-4 h-4 animate-pulse" /> Live Triage Supervision
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate('user-management')}
          className="glass-panel p-5 rounded-2xl glass-panel-hover cursor-pointer border-slate-800"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Users</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-white">{data?.counts?.total_users || 5}</div>
          <p className="text-[11px] text-slate-400 mt-1">Patients, Doctors, Admins</p>
        </div>

        <div
          onClick={() => onNavigate('doctor-management')}
          className="glass-panel p-5 rounded-2xl glass-panel-hover cursor-pointer border-slate-800"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Verified Doctors</span>
            <Stethoscope className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-white">{data?.counts?.doctors || 2}</div>
          <p className="text-[11px] text-slate-400 mt-1">Good standing credentialed</p>
        </div>

        <div
          onClick={() => onNavigate('hospital-management')}
          className="glass-panel p-5 rounded-2xl glass-panel-hover cursor-pointer border-slate-800"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Hospitals</span>
            <Building2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white">{data?.counts?.hospitals || 2}</div>
          <p className="text-[11px] text-slate-400 mt-1">Trauma centers & clinics</p>
        </div>

        <div
          onClick={() => onNavigate('audit-logs')}
          className="glass-panel p-5 rounded-2xl glass-panel-hover cursor-pointer border-slate-800"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Audit Records</span>
            <History className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">Active</div>
          <p className="text-[11px] text-slate-400 mt-1">Immutable trace log</p>
        </div>
      </div>

      {/* Recent Emergencies & Overrides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl border-rose-900/40 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" /> Emergency Red-Flag Triage Alerts
          </h3>
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
            <div className="flex justify-between font-bold text-rose-400">
              <span>Patient John Doe</span>
              <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-rose-950 border border-rose-800">Critical</span>
            </div>
            <p className="text-slate-300">Acute Coronary Syndrome red-flag escalated.</p>
            <span className="text-[10px] text-slate-500">Auto-dispatched emergency alert</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border-indigo-900/40 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-400" /> Recent Clinical Overrides (Rule 11)
          </h3>
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
            <div className="flex justify-between font-bold text-indigo-300">
              <span>Report #REP-2026-0742</span>
              <span>By Dr. Marcus Smith</span>
            </div>
            <p className="text-slate-300">Reason: Doctor adjusted recommendation to include saline rinse based on prior sinus sensitivities.</p>
            <span className="text-[10px] text-slate-500">Audited with cryptographic timestamp</span>
          </div>
        </div>
      </div>
    </div>
  );
};
