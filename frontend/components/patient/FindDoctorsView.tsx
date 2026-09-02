"use client";

import React, { useState } from 'react';
import { User, DoctorProfile } from '../../lib/types';
import { MOCK_DOCTORS } from '../../lib/mockData';
import { api } from '../../lib/api';
import {
  Search,
  Building2,
  Calendar,
  ShieldCheck
} from '../Icons';

interface FindDoctorsViewProps {
  user: User;
  onBookSuccess?: () => void;
}

export const FindDoctorsView: React.FC<FindDoctorsViewProps> = ({ user, onBookSuccess }) => {
  const [search, setSearch] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile | null>(null);
  const [scheduledAt, setScheduledAt] = useState('2026-09-12T10:00');
  const [reason, setReason] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const filtered = MOCK_DOCTORS.filter(
    d =>
      d.specialty.toLowerCase().includes(search.toLowerCase()) ||
      d.user?.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor) return;

    await api.patient.bookAppointment(selectedDoctor.user_id, scheduledAt.replace('T', ' ') + ':00', reason || 'Consultation');
    setIsSuccess(true);
    setTimeout(() => {
      setSelectedDoctor(null);
      setIsSuccess(false);
      if (onBookSuccess) onBookSuccess();
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-sky-400" /> Find & Book Medical Doctors
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Verified physicians across hospital systems with transparent consultation fees.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search specialty or doctor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((doc) => (
          <div key={doc.id} className="glass-panel p-5 rounded-2xl space-y-4 border border-slate-800">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-md">
                  {doc.user?.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                    {doc.user?.name}
                    {doc.is_verified && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                  </h3>
                  <span className="text-xs text-teal-400 font-medium">{doc.specialty}</span>
                </div>
              </div>
              <span className="text-xs font-bold text-white px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800">
                ${doc.consultation_fee} Fee
              </span>
            </div>

            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{doc.bio}</p>

            <div className="text-xs text-slate-400 flex items-center gap-1.5 border-t border-slate-800/80 pt-3">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              <span>{doc.hospital?.name}</span>
            </div>

            <button
              onClick={() => setSelectedDoctor(doc)}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 hover:opacity-90 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <Calendar className="w-3.5 h-3.5" /> Book Consultation
            </button>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl max-w-md w-full space-y-4 border border-slate-700">
            <h3 className="text-base font-bold text-white">Book with {selectedDoctor.user?.name}</h3>
            {isSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs text-center font-bold">
                ✓ Appointment scheduled successfully!
              </div>
            ) : (
              <form onSubmit={handleBook} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Select Date & Time</label>
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Reason for Visit</label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Brief description of symptoms or consultation goal..."
                    rows={3}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 font-bold text-white transition"
                  >
                    Confirm Appointment
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDoctor(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
