"use client";

import React from 'react';
import { User } from '../../lib/types';
import { HeartPulse, AlertTriangle } from '../Icons';

interface ProfileViewProps {
  user: User;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user }) => {
  const p = user.patient_profile;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-sky-500/20">
          {user.name.charAt(0)}
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{user.name}</h2>
          <p className="text-xs text-slate-400">{user.email} • {user.phone}</p>
          <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
            Authenticated Patient Profile
          </span>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
          <HeartPulse className="w-4 h-4 text-rose-400" /> Clinical Demographics & Vitals Context
        </h3>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-500">Date of Birth:</span>
            <p className="font-bold text-white">{p?.date_of_birth || '1985-06-15'}</p>
          </div>
          <div>
            <span className="text-slate-500">Gender:</span>
            <p className="font-bold text-white capitalize">{p?.gender || 'Male'}</p>
          </div>
          <div>
            <span className="text-slate-500">Blood Group:</span>
            <p className="font-bold text-amber-300">{p?.blood_group || 'O+'}</p>
          </div>
          <div>
            <span className="text-slate-500">Address:</span>
            <p className="font-bold text-white">{p?.address || '42 Elm Street, Metropolis, NY'}</p>
          </div>
        </div>

        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pt-4 pb-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" /> Medical Alerts & Emergency Dispatch
        </h3>
        <div className="space-y-3 text-xs">
          <div>
            <span className="text-slate-500">Known Allergies:</span>
            <div className="flex gap-2 mt-1">
              {p?.allergies?.map((a, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-rose-950 text-rose-300 border border-rose-800 font-bold">
                  {a}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="text-slate-500">Chronic Conditions:</span>
            <div className="flex gap-2 mt-1">
              {p?.chronic_conditions?.map((c, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="text-slate-500">Emergency Contact:</span>
            <p className="font-bold text-white mt-0.5">
              {p?.emergency_contact_name} ({p?.emergency_contact_relation}) • {p?.emergency_contact_phone}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
