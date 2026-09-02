"use client";

import React, { useState } from 'react';
import { ClinicalReport, User, RiskLevel } from '../../lib/types';
import { ShieldAlert, X } from '../Icons';

interface ClinicalOverrideModalProps {
  report: ClinicalReport;
  doctor: User;
  onClose: () => void;
  onSubmit: (reportId: number, reason: string, assessment: string, recommendations: string, riskLevel: RiskLevel) => void;
}

export const ClinicalOverrideModal: React.FC<ClinicalOverrideModalProps> = ({
  report,
  doctor,
  onClose,
  onSubmit
}) => {
  const [reason, setReason] = useState(report.override_reason || '');
  const [assessment, setAssessment] = useState(report.clinical_assessment || '');
  const [recommendations, setRecommendations] = useState(report.recommendations || '');
  const [riskLevel, setRiskLevel] = useState<RiskLevel>(report.risk_level);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim() || !assessment.trim()) return;
    onSubmit(report.id, reason, assessment, recommendations, riskLevel);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-panel p-6 rounded-2xl max-w-xl w-full space-y-4 border border-teal-500/40 bg-slate-950">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
            <ShieldAlert className="w-5 h-5" /> Authorized Clinical Override (Rule 11)
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/40 text-[11px] text-amber-200">
          <strong>Mandatory Clinical Governance:</strong> Clinical overrides are audited under actor identity ({doctor.name}) and logged to immutable audit records with before/after diffs.
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Override Reason (Required):</label>
            <input
              type="text"
              required
              placeholder="e.g. Patient comorbidity justifies risk elevation to Urgent Care tier."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Adjust Risk Level:</label>
            <select
              value={riskLevel}
              onChange={(e) => setRiskLevel(e.target.value as RiskLevel)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-teal-500"
            >
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
              <option value="emergency">Emergency Risk</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Updated Clinical Assessment:</label>
            <textarea
              required
              rows={3}
              value={assessment}
              onChange={(e) => setAssessment(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Updated Recommendations:</label>
            <textarea
              required
              rows={2}
              value={recommendations}
              onChange={(e) => setRecommendations(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 font-bold text-white transition shadow-md shadow-teal-500/20"
            >
              Sign & Commit Override
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
