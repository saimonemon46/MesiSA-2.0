"use client";

import React, { useState } from 'react';
import { User } from '../../lib/types';
import { MOCK_USERS } from '../../lib/mockData';
import { api } from '../../lib/api';
import { Users } from '../Icons';

export const UserManagementView: React.FC = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);

  const handleStatusChange = async (userId: number, newStatus: 'active' | 'inactive' | 'suspended') => {
    await api.admin.toggleUserStatus(userId, newStatus);
    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, status: newStatus } : u)));
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-sky-400" /> User & Role Management (Rule 19)
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Separate access tiers: Patient, Doctor, Nurse, Hospital Admin, Super Admin.
        </p>
      </div>

      <div className="glass-panel p-6 rounded-2xl space-y-3">
        {users.map((u) => (
          <div key={u.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">{u.name}</span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-sky-300 border border-slate-700">
                  {u.role}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  u.status === 'active' ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                }`}>
                  {u.status}
                </span>
              </div>
              <p className="text-slate-400 mt-1">{u.email} • {u.phone}</p>
            </div>

            <div className="flex gap-2">
              {u.status === 'active' ? (
                <button
                  onClick={() => handleStatusChange(u.id, 'suspended')}
                  className="px-3 py-1 rounded-lg bg-rose-950/80 text-rose-300 border border-rose-800 text-xs font-semibold"
                >
                  Suspend
                </button>
              ) : (
                <button
                  onClick={() => handleStatusChange(u.id, 'active')}
                  className="px-3 py-1 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-xs font-semibold"
                >
                  Activate
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
