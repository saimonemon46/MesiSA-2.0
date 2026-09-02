import {
  User,
  DoctorProfile,
  Hospital,
  TriageSession,
  ClinicalReport,
  MedicalDocument,
  Medication,
  Appointment,
  AuditLog,
  SystemSetting,
  RiskLevel
} from './types';
import {
  MOCK_USERS,
  MOCK_DOCTORS,
  MOCK_HOSPITALS,
  MOCK_MEDICATIONS,
  MOCK_REPORTS,
  MOCK_DOCUMENTS,
  MOCK_APPOINTMENTS,
  MOCK_AUDIT_LOGS,
  MOCK_SYSTEM_SETTINGS
} from './mockData';

const API_BASE = 'http://localhost:8000/api/v1';
const AI_BASE = 'http://localhost:8001/api/v1';

export const api = {
  patient: {
    getDashboard: async () => ({
      recent_triage_sessions: [
        { id: 1, session_token: 'token-001', risk_level: 'medium', status: 'completed', ai_summary: 'Mild tension headache.' }
      ],
      upcoming_appointments: MOCK_APPOINTMENTS.filter(a => a.status === 'scheduled'),
      recent_reports: MOCK_REPORTS,
      active_medications: MOCK_MEDICATIONS,
      summary_stats: {
        total_reports: MOCK_REPORTS.length,
        active_prescriptions: MOCK_MEDICATIONS.length,
        upcoming_visits: 1,
      }
    }),

    getReports: async () => MOCK_REPORTS,
    getDocuments: async () => MOCK_DOCUMENTS,
    getMedications: async () => MOCK_MEDICATIONS,
    getAppointments: async () => MOCK_APPOINTMENTS,

    bookAppointment: async (doctorId: number, scheduledAt: string, reason: string) => {
      const doc = MOCK_USERS.find(u => u.id === doctorId);
      const newAppt: Appointment = {
        id: Date.now(),
        patient_id: 1,
        doctor_id: doctorId,
        scheduled_at: scheduledAt,
        status: 'scheduled',
        type: 'in_person',
        reason_for_visit: reason,
        doctor: doc,
        hospital: MOCK_HOSPITALS[0],
      };
      MOCK_APPOINTMENTS.unshift(newAppt);
      return newAppt;
    },

    cancelAppointment: async (id: number, reason: string) => {
      const appt = MOCK_APPOINTMENTS.find(a => a.id === id);
      if (appt) {
        appt.status = 'cancelled';
        appt.cancellation_reason = reason;
      }
    }
  },

  discovery: {
    getDoctors: async () => MOCK_DOCTORS,
    getHospitals: async () => MOCK_HOSPITALS
  },

  ai: {
    sendTriageStep: async (
      sessionToken: string,
      patientId: number,
      userInput: string,
      messages: { role: string; content: string }[],
      patientContext?: any
    ) => {
      const lower = userInput.toLowerCase();
      
      // Emergency Check (Rule 12)
      if (lower.includes('chest pain') || lower.includes('cannot breathe') || lower.includes('slurred speech') || lower.includes('crushing')) {
        return {
          session_token: sessionToken,
          red_flag_detected: true,
          contradiction_detected: false,
          is_completed: true,
          risk_level: 'emergency',
          ai_summary: 'CRITICAL EMERGENCY: Severe cardiopulmonary danger signs detected.',
          recommended_action: 'Seek immediate emergency medical care or call 911 immediately.',
        };
      }

      // Contradiction Check (Rule 13)
      if (lower.includes('no medical history') || lower.includes('no conditions') || lower.includes('never had health issues')) {
        if (patientContext?.chronic_conditions?.length) {
          return {
            session_token: sessionToken,
            red_flag_detected: false,
            contradiction_detected: true,
            is_completed: false,
            risk_level: 'pending',
            reply: `To ensure accurate triage: your medical profile notes a history of ${patientContext.chronic_conditions.join(', ')}. Could you clarify if your current symptoms relate to this?`,
          };
        }
      }

      if (messages.length >= 4) {
        return {
          session_token: sessionToken,
          red_flag_detected: false,
          contradiction_detected: false,
          is_completed: true,
          risk_level: lower.includes('severe') ? 'high' : 'medium',
          ai_summary: 'Symptom evaluation completed for acute onset condition without immediate red flags.',
          recommended_action: 'Rest, hydrate, and schedule an outpatient consultation with a general physician within 48-72 hours.',
        };
      }

      return {
        session_token: sessionToken,
        red_flag_detected: false,
        contradiction_detected: false,
        is_completed: false,
        risk_level: 'pending',
        reply: 'Could you describe when these symptoms first started and if anything makes them better or worse?',
      };
    },

    processOcr: async (rawText: string, confidence: number = 0.92) => {
      const isSafe = confidence >= 0.85;
      return {
        ocr_status: isSafe ? 'completed' : 'low_confidence',
        confidence_score: confidence,
        threshold_applied: 0.85,
        is_safe_for_clinical_ingestion: isSafe,
        requires_manual_verification: !isSafe,
        extracted_data: {
          medications: [
            { name: 'Amoxicillin', dosage: '500mg', frequency: '3 times daily' },
            { name: 'Ibuprofen', dosage: '400mg', frequency: 'As needed' }
          ],
          raw_line_count: 4,
        },
        warning: isSafe ? null : 'Low OCR confidence score detected (< 0.85). Human clinician/patient manual confirmation required before clinical reasoning ingestion.'
      };
    }
  },

  doctor: {
    overrideReport: async (
      reportId: number,
      doctorId: number,
      reason: string,
      assessment: string,
      recommendations: string,
      riskLevel: RiskLevel
    ) => {
      const report = MOCK_REPORTS.find(r => r.id === reportId);
      if (report) {
        report.is_overridden = true;
        report.override_reason = reason;
        report.clinical_assessment = assessment;
        report.recommendations = recommendations;
        report.risk_level = riskLevel;
        report.override_at = new Date().toISOString();
        report.override_by_doctor_id = doctorId;
      }
      MOCK_AUDIT_LOGS.unshift({
        id: Date.now(),
        user_id: doctorId,
        action: 'clinical_report.override',
        entity_type: 'App\\Models\\ClinicalReport',
        entity_id: reportId,
        ip_address: '192.168.1.45',
        diff_payload: { override_reason: reason, risk_level: riskLevel },
        created_at: new Date().toISOString(),
        user: MOCK_USERS.find(u => u.id === doctorId)
      });
      return report || MOCK_REPORTS[0];
    }
  },

  admin: {
    getDashboard: async () => ({
      counts: {
        total_users: MOCK_USERS.length,
        patients: 2,
        doctors: 2,
        hospitals: MOCK_HOSPITALS.length,
        active_triage_sessions: 3,
        emergency_triage_cases: 1,
        total_appointments: MOCK_APPOINTMENTS.length,
        clinical_overrides: MOCK_REPORTS.filter(r => r.is_overridden).length,
      },
      recent_emergencies: [
        { id: 99, patient: MOCK_USERS[0], risk_level: 'emergency', ai_summary: 'Acute Coronary Syndrome red-flag escalated.', updated_at: 'Just now' }
      ],
      recent_overrides: MOCK_REPORTS.filter(r => r.is_overridden),
    }),

    getUsers: async () => MOCK_USERS,
    
    toggleUserStatus: async (userId: number, status: 'active' | 'inactive' | 'suspended') => {
      const u = MOCK_USERS.find(x => x.id === userId);
      if (u) u.status = status;
    },

    getDoctors: async () => MOCK_DOCTORS,

    verifyDoctor: async (doctorId: number, isVerified: boolean, notes: string) => {
      const doc = MOCK_DOCTORS.find(d => d.id === doctorId);
      if (doc) {
        doc.is_verified = isVerified;
        doc.verification_notes = notes;
      }
      MOCK_AUDIT_LOGS.unshift({
        id: Date.now(),
        user_id: 5,
        action: 'doctor.verify',
        entity_type: 'App\\Models\\DoctorProfile',
        entity_id: doctorId,
        ip_address: '192.168.1.1',
        diff_payload: { is_verified: isVerified, notes },
        created_at: new Date().toISOString(),
        user: MOCK_USERS[4]
      });
    },

    getAuditLogs: async () => MOCK_AUDIT_LOGS,
    getSettings: async () => MOCK_SYSTEM_SETTINGS,

    updateSettings: async (key: string, value: string) => {
      const setting = MOCK_SYSTEM_SETTINGS.find(s => s.key === key);
      if (setting) setting.value = value;
    }
  }
};
