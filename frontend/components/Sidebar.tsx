"use client";

import React from 'react';
import { UserRole } from '../lib/types';
import {
  LayoutDashboard,
  MessageSquareHeart,
  FileText,
  FolderOpen,
  Pill,
  Search,
  Calendar,
  User,
  Users,
  Building2,
  Stethoscope,
  ActivitySquare,
  ShieldCheck,
  History,
  Sliders,
  ShieldAlert
} from './Icons';

interface SidebarProps {
  role: UserRole;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ role, activeTab, onTabChange }) => {
  const patientTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'symptom-check', label: 'Symptom Check', icon: MessageSquareHeart, highlight: true },
    { id: 'reports', label: 'My Reports', icon: FileText },
    { id: 'documents', label: 'Documents & OCR', icon: FolderOpen },
    { id: 'medications', label: 'Medications', icon: Pill },
    { id: 'doctors', label: 'Find Doctors', icon: Search },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'profile', label: 'Medical Profile', icon: User },
  ];

  const doctorTabs = [
    { id: 'doctor-dashboard', label: 'Clinical Dashboard', icon: LayoutDashboard },
    { id: 'clinical-reviews', label: 'Reports & Overrides', icon: ShieldCheck, highlight: true },
    { id: 'doctor-appointments', label: 'Patient Appointments', icon: Calendar },
    { id: 'patient-records', label: 'Patient Roster', icon: Users },
  ];

  const adminTabs = [
    { id: 'admin-dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
    { id: 'user-management', label: 'User Management', icon: Users },
    { id: 'doctor-management', label: 'Doctor Verification', icon: Stethoscope },
    { id: 'hospital-management', label: 'Hospital Management', icon: Building2 },
    { id: 'live-supervision', label: 'Live Triage Supervision', icon: ActivitySquare, highlight: true },
    { id: 'audit-logs', label: 'Audit Logs', icon: History },
    { id: 'system-settings', label: 'AI & System Config', icon: Sliders },
  ];

  const tabs = role === 'patient' ? patientTabs : role === 'doctor' ? doctorTabs : adminTabs;

  return (
    <aside className="w-64 glass-panel border-r border-slate-800/80 p-4 flex flex-col justify-between shrink-0 min-h-[calc(100vh-65px)]">
      <div className="space-y-1">
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          {role === 'patient' ? 'Patient Portal' : role === 'doctor' ? 'Clinical Workspace' : 'System Administration'}
        </div>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-sky-500/20 to-teal-500/10 text-sky-400 border border-sky-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              } ${tab.highlight && !isActive ? 'border border-amber-500/30 text-amber-300' : ''}`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : tab.highlight ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-1.5 text-slate-300 font-semibold mb-1">
          <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
          <span>Clinical OS Active</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Rule-bound LangGraph engine & Sanctum RBAC active.
        </p>
      </div>
    </aside>
  );
};
