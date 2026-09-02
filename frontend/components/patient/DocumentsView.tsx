"use client";

import React, { useState } from 'react';
import { User, MedicalDocument } from '../../lib/types';
import { MOCK_DOCUMENTS } from '../../lib/mockData';
import { api } from '../../lib/api';
import {
  FolderOpen,
  Upload,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck
} from '../Icons';

interface DocumentsViewProps {
  user: User;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({ user }) => {
  const [documents, setDocuments] = useState<MedicalDocument[]>(MOCK_DOCUMENTS);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSimulateUpload = async (isLowConfidence = false) => {
    setIsProcessing(true);
    const score = isLowConfidence ? 0.72 : 0.95;

    const sampleText = isLowConfidence
      ? 'Am?xicil??n - 500?g - Daily'
      : 'Amoxicillin - 500mg - 3 times daily\nIbuprofen - 400mg - As needed';

    const ocrResult = await api.ai.processOcr(sampleText, score);

    const newDoc: MedicalDocument = {
      id: Date.now(),
      patient_id: user.id,
      title: isLowConfidence ? 'Uploaded Lab Record (Low OCR Quality)' : 'New Clinic Prescription (High Quality)',
      document_type: 'prescription',
      file_path: '/uploads/sample_doc.pdf',
      ocr_status: ocrResult.ocr_status as 'completed' | 'low_confidence',
      ocr_confidence: ocrResult.confidence_score,
      extracted_data: ocrResult.extracted_data,
      is_verified: ocrResult.is_safe_for_clinical_ingestion,
      created_at: new Date().toISOString().split('T')[0],
    };

    setDocuments(prev => [newDoc, ...prev]);
    setIsProcessing(false);
  };

  const handleVerifyManually = (docId: number) => {
    setDocuments(prev =>
      prev.map(d => (d.id === docId ? { ...d, is_verified: true, ocr_status: 'completed' } : d))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-sky-400" /> Medical Documents & OCR Vault
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Securely uploaded prescriptions with Rule 15 Confidence Score Gatekeeping (0.85 threshold).
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleSimulateUpload(false)}
            disabled={isProcessing}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 hover:opacity-90 text-white text-xs font-semibold flex items-center gap-2 transition"
          >
            <Upload className="w-4 h-4" /> Upload High-Quality Doc (95% OCR)
          </button>
          <button
            onClick={() => handleSimulateUpload(true)}
            disabled={isProcessing}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-700/50 text-xs font-semibold flex items-center gap-2 transition"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" /> Upload Blurry Scan (72% OCR)
          </button>
        </div>
      </div>

      {/* Documents List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => {
          const confidence = doc.ocr_confidence || 0;
          const isLow = doc.ocr_status === 'low_confidence' || confidence < 0.85;

          return (
            <div
              key={doc.id}
              className={`glass-panel p-5 rounded-2xl space-y-4 border ${
                isLow ? 'border-amber-500/50 bg-amber-950/10' : 'border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{doc.title}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider">{doc.document_type}</span>
                </div>

                <div className="text-right">
                  <div
                    className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                      isLow
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}
                  >
                    {isLow ? <AlertTriangle className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                    <span>{Math.round(confidence * 100)}% OCR Confidence</span>
                  </div>
                </div>
              </div>

              {/* Extracted Data Box */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 text-xs space-y-2">
                <span className="font-semibold text-slate-400 text-[11px] uppercase tracking-wider">
                  OCR Extracted Medications:
                </span>
                {doc.extracted_data?.medications?.length ? (
                  <div className="space-y-1">
                    {doc.extracted_data.medications.map((m, idx) => (
                      <div key={idx} className="flex justify-between text-slate-200">
                        <span className="font-medium text-sky-300">{m.name}</span>
                        <span className="text-slate-400">{m.dosage} ({m.frequency})</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic">No structured medications parsed.</p>
                )}
              </div>

              {/* Rule 15 Safety Notice */}
              {isLow && !doc.is_verified && (
                <div className="p-3 rounded-xl bg-amber-950/80 border border-amber-700/60 text-xs text-amber-200 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Rule 15 Confidence Lock Active</span>
                  </div>
                  <p className="text-[11px] text-amber-100/90 leading-relaxed">
                    Confidence is below 0.85. Medication is blocked from automated clinical ingestion until human verification.
                  </p>
                  <button
                    onClick={() => handleVerifyManually(doc.id)}
                    className="w-full py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition"
                  >
                    Verify & Confirm Accurate
                  </button>
                </div>
              )}

              {doc.is_verified && (
                <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified & Safe for Clinical Reasoning
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
