"use client";

import React, { useState } from 'react';
import { SystemSetting } from '../../lib/types';
import { MOCK_SYSTEM_SETTINGS } from '../../lib/mockData';
import { api } from '../../lib/api';
import { Sliders } from '../Icons';

export const SystemSettingsView: React.FC = () => {
  const [settings, setSettings] = useState<SystemSetting[]>(MOCK_SYSTEM_SETTINGS);
  const [savedKey, setSavedKey] = useState<string | null>(null);

  const handleUpdate = async (key: string, val: string) => {
    await api.admin.updateSettings(key, val);
    setSettings(prev => prev.map(s => (s.key === key ? { ...s, value: val } : s)));
    setSavedKey(key);
    setTimeout(() => setSavedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Sliders className="w-5 h-5 text-indigo-400" /> AI & System Operational Settings
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure model fallbacks (Rule 14) and OCR confidence thresholds (Rule 15).
        </p>
      </div>

      <div className="glass-panel p-6 rounded-2xl space-y-4">
        {settings.map((s) => (
          <div key={s.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="max-w-md">
              <span className="font-mono font-bold text-sky-400">{s.key}</span>
              <p className="text-slate-400 mt-0.5">{s.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                defaultValue={s.value}
                onBlur={(e) => handleUpdate(s.key, e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs w-48 focus:outline-none focus:border-sky-500"
              />
              {savedKey === s.key && (
                <span className="text-emerald-400 text-xs font-bold">Saved ✓</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
