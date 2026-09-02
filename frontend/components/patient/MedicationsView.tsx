"use client";

import React from 'react';
import { User } from '../../lib/types';
import { MOCK_MEDICATIONS } from '../../lib/mockData';
import { Pill, Clock, CheckCircle2 } from '../Icons';

interface MedicationsViewProps {
  user: User;
}

export const MedicationsView: React.FC<MedicationsViewProps> = ({ user }) => {
  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Pill className="w-5 h-5 text-indigo-400" /> Active Medications & Dosages
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Current verified prescription schedule synchronized with medical records.
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
          {MOCK_MEDICATIONS.length} Active Prescriptions
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_MEDICATIONS.map((med) => (
          <div key={med.id} className="glass-panel p-5 rounded-2xl space-y-3 border border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">{med.name}</h3>
                <span className="text-xs text-slate-400">{med.route} Route</span>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                {med.dosage}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-slate-300 font-medium">
                <Clock className="w-3.5 h-3.5 text-sky-400" /> {med.frequency}
              </div>
              {med.notes && <p className="text-slate-400 italic text-[11px]">{med.notes}</p>}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800/60">
              <span>Prescribed by: {med.prescribed_by}</span>
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Active
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
