"use client";

import React, { useState } from 'react';
import { DoctorProfile } from '../../lib/types';
import { MOCK_DOCTORS } from '../../lib/mockData';
import { api } from '../../lib/api';
import { Stethoscope } from '../Icons';

export const DoctorManagementView: React.FC = () => {
  const [doctors, setDoctors] = useState<DoctorProfile[]>(MOCK_DOCTORS);

  const handleVerify = async (docId: number, isVerified: boolean) => {
    await api.admin.verifyDoctor(docId, isVerified, isVerified ? 'Verified credential by medical board' : 'Unverified');
    setDoctors(prev => prev.map(d => (d.id === docId ? { ...d, is_verified: isVerified } : d)));
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-teal-400" /> Doctor Verification & Credentialing
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Approve or revoke clinical override permissions and medical license validation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {doctors.map((doc) => (
          <div key={doc.id} className="glass-panel p-5 rounded-2xl space-y-3 border border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-sm">{doc.user?.name}</h3>
                <span className="text-xs text-teal-400">{doc.specialty}</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                doc.is_verified ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400'
              }`}>
                {doc.is_verified ? 'Verified Active' : 'Pending Verification'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 text-xs space-y-1 text-slate-300">
              <div><strong>License:</strong> {doc.license_number}</div>
              <div><strong>Hospital:</strong> {doc.hospital?.name}</div>
              <div><strong>Experience:</strong> {doc.experience_years} years</div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleVerify(doc.id, !doc.is_verified)}
                className={`w-full py-1.5 rounded-xl font-bold text-xs transition ${
                  doc.is_verified
                    ? 'bg-rose-950 text-rose-300 border border-rose-800 hover:bg-rose-900'
                    : 'bg-emerald-600 text-white hover:bg-emerald-500'
                }`}
              >
                {doc.is_verified ? 'Revoke Verification' : 'Verify Credentials'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
