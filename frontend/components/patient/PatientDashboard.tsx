"use client";

import React from 'react';
import { User } from '../../lib/types';
import { MOCK_REPORTS, MOCK_MEDICATIONS, MOCK_APPOINTMENTS } from '../../lib/mockData';
import {
  MessageSquareHeart,
  Pill,
  FileText,
  Calendar,
  AlertTriangle,
  PhoneCall,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from '../Icons';

interface PatientDashboardProps {
  user: User;
  onNavigate: (tab: string) => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({ user, onNavigate }) => {
  const profile = user.patient_profile;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 border-sky-900/40">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" /> MediSA AI Health Guardian Active
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome back, {user.name}</h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Your personal clinical dashboard is up to date. Start a conversational symptom triage, review doctor-verified prescriptions, or schedule an appointment.
          </p>
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => onNavigate('symptom-check')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 text-white font-medium text-sm hover:opacity-90 shadow-md shadow-sky-500/20 flex items-center gap-2 transition"
            >
              <MessageSquareHeart className="w-4 h-4" /> Start AI Symptom Check
            </button>
            <button
              onClick={() => onNavigate('doctors')}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 font-medium text-sm transition"
            >
              Book Doctor Appointment
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate('symptom-check')}
          className="glass-panel p-5 rounded-2xl glass-panel-hover cursor-pointer border-sky-500/20"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase">AI Triage</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <MessageSquareHeart className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">Ready</div>
          <p className="text-xs text-slate-400">Emergency Red-Flag Guard Active</p>
        </div>

        <div
          onClick={() => onNavigate('reports')}
          className="glass-panel p-5 rounded-2xl glass-panel-hover cursor-pointer border-teal-500/20"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase">Clinical Reports</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{MOCK_REPORTS.length}</div>
          <p className="text-xs text-slate-400">1 Doctor-Overridden</p>
        </div>

        <div
          onClick={() => onNavigate('medications')}
          className="glass-panel p-5 rounded-2xl glass-panel-hover cursor-pointer border-indigo-500/20"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase">Prescriptions</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Pill className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{MOCK_MEDICATIONS.length}</div>
          <p className="text-xs text-slate-400">Active daily medications</p>
        </div>

        <div
          onClick={() => onNavigate('appointments')}
          className="glass-panel p-5 rounded-2xl glass-panel-hover cursor-pointer border-amber-500/20"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase">Next Appointment</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="text-sm font-bold text-white mb-1 truncate">Sep 08, 10:30 AM</div>
          <p className="text-xs text-slate-400 truncate">Dr. Marcus Smith (Cardio)</p>
        </div>
      </div>

      {/* Emergency Quick Action & Health Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Pill className="w-4 h-4 text-sky-400" /> Active Prescriptions & Medications
              </h3>
              <button
                onClick={() => onNavigate('medications')}
                className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1"
              >
                View all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {MOCK_MEDICATIONS.map((med) => (
                <div key={med.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-sm">{med.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {med.dosage}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{med.frequency}</p>
                  <p className="text-[11px] text-slate-500 mt-1 italic">Prescribed by: {med.prescribed_by}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-400" /> Recent Triage & Clinical Reports
              </h3>
              <button
                onClick={() => onNavigate('reports')}
                className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1"
              >
                All Reports <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-3">
              {MOCK_REPORTS.map((rep) => (
                <div
                  key={rep.id}
                  onClick={() => onNavigate('reports')}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer transition flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-sky-400">{rep.report_number}</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${
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
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800">
                          Doctor Overridden
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{rep.summary}</p>
                  </div>
                  <span className="text-xs text-slate-500">{rep.finalized_at?.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border-rose-900/60 bg-gradient-to-b from-rose-950/20 to-slate-900">
            <div className="flex items-center gap-2 text-rose-400 font-bold mb-2 text-sm">
              <AlertTriangle className="w-4 h-4" /> Emergency Fast-Path
            </div>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              If experiencing crushing chest pain, difficulty breathing, or sudden stroke symptoms, call emergency services immediately.
            </p>
            <a
              href="tel:911"
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition"
            >
              <PhoneCall className="w-4 h-4" /> Call Emergency Hotline (911)
            </a>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Patient Medical Profile
            </h4>
            <div className="text-xs space-y-2 text-slate-300">
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-500">Blood Group:</span>
                <span className="font-semibold text-white">{profile?.blood_group || 'O+'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-500">Known Allergies:</span>
                <span className="font-semibold text-amber-300">{profile?.allergies?.join(', ') || 'None'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-500">Chronic Conditions:</span>
                <span className="font-semibold text-white">{profile?.chronic_conditions?.join(', ') || 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Emergency Contact:</span>
                <span className="font-semibold text-white">{profile?.emergency_contact_name} ({profile?.emergency_contact_phone})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
