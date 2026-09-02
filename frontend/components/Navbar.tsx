"use client";

import React from 'react';
import { User, UserRole } from '../lib/types';
import { MOCK_USERS } from '../lib/mockData';
import { Activity, ShieldAlert, UserCheck, Stethoscope, Shield, Bell } from './Icons';

interface NavbarProps {
  currentUser: User;
  onSelectUser: (user: User) => void;
  activeTab: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentUser, onSelectUser, activeTab }) => {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-6 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-white">Medi<span className="text-sky-400">SA</span></span>
            <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-sky-950 text-sky-400 border border-sky-800">
              AI Clinical OS
            </span>
          </div>
          <p className="text-xs text-slate-400">Conversational Triage & Clinical Governance</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center bg-slate-900/80 border border-slate-800 rounded-lg p-1 gap-1">
          <span className="text-xs font-medium text-slate-400 px-2 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-sky-400" /> Switch Role:
          </span>
          {MOCK_USERS.map((u) => {
            const isSelected = currentUser.id === u.id;
            return (
              <button
                key={u.id}
                onClick={() => onSelectUser(u)}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                  isSelected
                    ? u.role === 'patient'
                      ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30'
                      : u.role === 'doctor'
                      ? 'bg-teal-500 text-white shadow-sm shadow-teal-500/30'
                      : 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {u.role === 'patient' && '👤 Patient (' + u.name.split(' ')[0] + ')'}
                {u.role === 'doctor' && '🩺 ' + u.name.split(',')[0]}
                {u.role === 'super_admin' && '🛡️ Super Admin'}
              </button>
            );
          })}
        </div>

        <button className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
        </button>
      </div>
    </header>
  );
};
