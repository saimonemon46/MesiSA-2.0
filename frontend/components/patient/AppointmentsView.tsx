"use client";

import React, { useState } from 'react';
import { User, Appointment } from '../../lib/types';
import { MOCK_APPOINTMENTS } from '../../lib/mockData';
import { api } from '../../lib/api';
import { Calendar, Clock } from '../Icons';

interface AppointmentsViewProps {
  user: User;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({ user }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const handleCancel = async (id: number) => {
    await api.patient.cancelAppointment(id, cancelReason || 'Patient requested cancellation');
    setAppointments(prev =>
      prev.map(a => (a.id === id ? { ...a, status: 'cancelled', cancellation_reason: cancelReason } : a))
    );
    setCancellingId(null);
    setCancelReason('');
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-amber-400" /> Appointments & Consultations
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Manage scheduled, completed, and rescheduled doctor visits.
        </p>
      </div>

      <div className="space-y-3">
        {appointments.map((appt) => (
          <div
            key={appt.id}
            className="glass-panel p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">{appt.doctor?.name || 'Dr. Marcus Smith'}</span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                    appt.status === 'scheduled'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800'
                      : appt.status === 'completed'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}
                >
                  {appt.status}
                </span>
              </div>
              <div className="text-xs text-slate-300 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                <span>{appt.scheduled_at}</span>
              </div>
              <p className="text-xs text-slate-400">{appt.reason_for_visit}</p>
            </div>

            {appt.status === 'scheduled' && (
              <div>
                {cancellingId === appt.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Reason for cancellation..."
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCancel(appt.id)}
                        className="px-3 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setCancellingId(null)}
                        className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs"
                      >
                        Back
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setCancellingId(appt.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-400 border border-slate-700 text-xs font-semibold text-slate-300 transition"
                  >
                    Cancel Appointment
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
