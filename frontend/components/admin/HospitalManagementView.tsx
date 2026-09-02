"use client";

import React, { useState } from 'react';
import { Hospital } from '../../lib/types';
import { MOCK_HOSPITALS } from '../../lib/mockData';
import { Building2 } from '../Icons';

export const HospitalManagementView: React.FC = () => {
  const [hospitals] = useState<Hospital[]>(MOCK_HOSPITALS);

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-400" /> Hospital Facilities & Centers
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Affiliated hospitals, trauma facilities, and 24/7 emergency dispatch centers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hospitals.map((h) => (
          <div key={h.id} className="glass-panel p-5 rounded-2xl space-y-3 border border-slate-800">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-white text-base">{h.name}</h3>
                <p className="text-xs text-slate-400">{h.address}, {h.city}</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                {h.meta?.trauma_level || 'Level 1'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 text-xs space-y-1 text-slate-300">
              <div><strong>Emergency Hotline:</strong> {h.emergency_hotline}</div>
              <div><strong>Bed Capacity:</strong> {h.meta?.bed_capacity} beds</div>
              <div><strong>Specialties:</strong> {h.meta?.specialties?.join(', ')}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
