export type UserRole = 'patient' | 'doctor' | 'nurse' | 'hospital_admin' | 'super_admin';
export type RiskLevel = 'emergency' | 'high' | 'medium' | 'low' | 'pending';
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'suspended';
  phone?: string;
  avatar?: string;
  patient_profile?: PatientProfile;
  doctor_profile?: DoctorProfile;
}

export interface PatientProfile {
  id?: number;
  user_id?: number;
  date_of_birth?: string;
  gender?: string;
  blood_group?: string;
  allergies?: string[];
  chronic_conditions?: string[];
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relation?: string;
  address?: string;
}

export interface Hospital {
  id: number;
  name: string;
  slug: string;
  address: string;
  city: string;
  phone: string;
  emergency_services: boolean;
  emergency_hotline?: string;
  doctor_profiles_count?: number;
  meta?: {
    bed_capacity?: number;
    trauma_level?: string;
    specialties?: string[];
  };
}

export interface DoctorProfile {
  id: number;
  user_id: number;
  hospital_id?: number;
  specialty: string;
  license_number: string;
  bio?: string;
  experience_years: number;
  consultation_fee: number;
  is_verified: boolean;
  verification_notes?: string;
  user?: User;
  hospital?: Hospital;
}

export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  hospital_id?: number;
  scheduled_at: string;
  status: AppointmentStatus;
  type: string;
  reason_for_visit?: string;
  clinical_notes?: string;
  cancellation_reason?: string;
  doctor?: User;
  patient?: User;
  hospital?: Hospital;
}

export interface TriageMessage {
  id?: number;
  sender_role: 'patient' | 'ai' | 'clinician' | 'system';
  message: string;
  red_flag_score?: number;
  created_at?: string;
}

export interface TriageSession {
  id: number;
  patient_id: number;
  session_token: string;
  status: 'in_progress' | 'completed' | 'escalated_emergency' | 'cancelled';
  risk_level: RiskLevel;
  red_flag_detected: boolean;
  red_flag_details?: any;
  contradiction_detected: boolean;
  ai_summary?: string;
  recommended_action?: string;
  messages?: TriageMessage[];
  clinical_report?: ClinicalReport;
  patient?: User;
  updated_at?: string;
}

export interface ClinicalReport {
  id: number;
  report_number: string;
  patient_id: number;
  doctor_id?: number;
  summary: string;
  clinical_assessment: string;
  recommendations: string;
  vitals_snapshot?: {
    systolic_bp?: number;
    diastolic_bp?: number;
    pulse?: number;
    temperature?: string;
  };
  risk_level: RiskLevel;
  is_overridden: boolean;
  override_reason?: string;
  override_by_doctor_id?: number;
  override_at?: string;
  finalized_at?: string;
  doctor?: User;
  override_by_doctor?: User;
  patient?: User;
}

export interface MedicalDocument {
  id: number;
  patient_id: number;
  title: string;
  document_type: string;
  file_path: string;
  ocr_status: 'pending' | 'processing' | 'completed' | 'failed' | 'low_confidence';
  ocr_confidence?: number;
  extracted_data?: {
    medications?: { name: string; dosage: string; frequency: string }[];
    raw_line_count?: number;
  };
  is_verified: boolean;
  created_at?: string;
}

export interface Medication {
  id: number;
  patient_id: number;
  name: string;
  generic_name?: string;
  dosage: string;
  frequency: string;
  route: string;
  start_date?: string;
  status: 'active' | 'completed' | 'discontinued';
  prescribed_by?: string;
  notes?: string;
}

export interface AuditLog {
  id: number;
  user_id?: number;
  action: string;
  entity_type?: string;
  entity_id?: number;
  ip_address?: string;
  user_agent?: string;
  diff_payload?: any;
  created_at: string;
  user?: User;
}

export interface SystemSetting {
  id: number;
  key: string;
  value: string;
  group: string;
  is_secret: boolean;
  description?: string;
}
