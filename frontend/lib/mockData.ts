import { User, Hospital, DoctorProfile, Appointment, TriageSession, ClinicalReport, MedicalDocument, Medication, AuditLog, SystemSetting } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'patient.john@medisa.local',
    role: 'patient',
    status: 'active',
    phone: '+1 (555) 111-2233',
    patient_profile: {
      date_of_birth: '1985-06-15',
      gender: 'male',
      blood_group: 'O+',
      allergies: ['Penicillin', 'Peanuts'],
      chronic_conditions: ['Hypertension (Stage 1)'],
      emergency_contact_name: 'Jane Doe',
      emergency_contact_phone: '+1 (555) 999-8877',
      emergency_contact_relation: 'Spouse',
      address: '42 Elm Street, Metropolis, NY',
    },
  },
  {
    id: 2,
    name: 'Emma Watson',
    email: 'patient.emma@medisa.local',
    role: 'patient',
    status: 'active',
    phone: '+1 (555) 777-6655',
    patient_profile: {
      date_of_birth: '1992-11-20',
      gender: 'female',
      blood_group: 'A+',
      allergies: ['Sulfa drugs'],
      chronic_conditions: ['Mild Asthma'],
      emergency_contact_name: 'David Watson',
      emergency_contact_phone: '+1 (555) 888-3322',
      emergency_contact_relation: 'Brother',
      address: '88 Riverside Blvd, Metropolis, NY',
    },
  },
  {
    id: 3,
    name: 'Dr. Marcus Smith, MD',
    email: 'dr.smith@medisa.local',
    role: 'doctor',
    status: 'active',
    phone: '+1 (555) 234-5678',
    doctor_profile: {
      id: 1,
      user_id: 3,
      hospital_id: 1,
      specialty: 'Cardiology',
      license_number: 'MD-NY-2018-8841',
      bio: 'Board-certified Cardiologist with 14 years experience specializing in arrhythmia and preventive care.',
      experience_years: 14,
      consultation_fee: 150.00,
      is_verified: true,
    }
  },
  {
    id: 4,
    name: 'Dr. Sarah Jenkins, MD',
    email: 'dr.sarah@medisa.local',
    role: 'doctor',
    status: 'active',
    phone: '+1 (555) 345-6789',
    doctor_profile: {
      id: 2,
      user_id: 4,
      hospital_id: 1,
      specialty: 'General Practice',
      license_number: 'MD-NY-2020-5512',
      bio: 'Primary care physician focusing on holistic wellness and chronic disease management.',
      experience_years: 9,
      consultation_fee: 90.00,
      is_verified: true,
    }
  },
  {
    id: 5,
    name: 'MediSA Super Administrator',
    email: 'superadmin@medisa.local',
    role: 'super_admin',
    status: 'active',
    phone: '+1 (555) 000-0001',
  },
];

export const MOCK_HOSPITALS: Hospital[] = [
  {
    id: 1,
    name: 'MediSA Central Medical Center',
    slug: 'medisa-central-hospital',
    address: '742 Evergreen Terrace, Suite 100',
    city: 'Metropolis',
    phone: '+1 (555) 019-2831',
    emergency_services: true,
    emergency_hotline: '+1 (800) 555-0199',
    doctor_profiles_count: 24,
    meta: {
      bed_capacity: 450,
      trauma_level: 'Level 1 Trauma Center',
      specialties: ['Cardiology', 'Emergency Care', 'Neurology', 'Pediatrics'],
    }
  },
  {
    id: 2,
    name: 'St. Jude Community Health Hospital',
    slug: 'st-jude-community-health',
    address: '1204 Pine Street',
    city: 'Brookfield',
    phone: '+1 (555) 018-9922',
    emergency_services: true,
    emergency_hotline: '+1 (800) 555-0188',
    doctor_profiles_count: 12,
    meta: {
      bed_capacity: 180,
      trauma_level: 'Level 3 Urgent Center',
      specialties: ['Family Medicine', 'Internal Medicine', 'Urgent Care'],
    }
  }
];

export const MOCK_DOCTORS: DoctorProfile[] = [
  {
    id: 1,
    user_id: 3,
    hospital_id: 1,
    specialty: 'Cardiology',
    license_number: 'MD-NY-2018-8841',
    bio: 'Board-certified Cardiologist with 14 years of experience in cardiovascular diagnostics.',
    experience_years: 14,
    consultation_fee: 150,
    is_verified: true,
    user: MOCK_USERS[2],
    hospital: MOCK_HOSPITALS[0],
  },
  {
    id: 2,
    user_id: 4,
    hospital_id: 1,
    specialty: 'General Practice',
    license_number: 'MD-NY-2020-5512',
    bio: 'Primary care physician focusing on holistic wellness and preventative treatment.',
    experience_years: 9,
    consultation_fee: 90,
    is_verified: true,
    user: MOCK_USERS[3],
    hospital: MOCK_HOSPITALS[0],
  }
];

export const MOCK_MEDICATIONS: Medication[] = [
  {
    id: 1,
    patient_id: 1,
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily in the morning',
    route: 'Oral',
    start_date: '2024-01-10',
    status: 'active',
    prescribed_by: 'Dr. Marcus Smith',
    notes: 'For blood pressure control. Monitor weekly.',
  },
  {
    id: 2,
    patient_id: 1,
    name: 'Atorvastatin',
    dosage: '20mg',
    frequency: 'Once daily at bedtime',
    route: 'Oral',
    start_date: '2024-02-15',
    status: 'active',
    prescribed_by: 'Dr. Marcus Smith',
    notes: 'Lipid panel follow-up scheduled.',
  }
];

export const MOCK_REPORTS: ClinicalReport[] = [
  {
    id: 1,
    report_number: 'REP-2026-0801',
    patient_id: 1,
    summary: 'Tension-type cephalalgia exacerbated by screen eye fatigue.',
    clinical_assessment: 'Low-to-moderate risk tension headache. No focal neurological deficits reported.',
    recommendations: 'Adequate hydration, 20-20-20 screen break rule, OTC acetaminophen as indicated.',
    vitals_snapshot: { systolic_bp: 128, diastolic_bp: 82, pulse: 74, temperature: '98.6°F' },
    risk_level: 'medium',
    is_overridden: false,
    finalized_at: '2026-08-30 14:30:00',
    patient: MOCK_USERS[0],
    doctor: MOCK_USERS[2],
  },
  {
    id: 2,
    report_number: 'REP-2026-0742',
    patient_id: 1,
    summary: 'Seasonal allergic rhinitis with mild nasal congestion.',
    clinical_assessment: 'Mild upper airway seasonal allergy. Lungs clear to auscultation.',
    recommendations: 'Cetirizine 10mg daily as needed, saline nasal spray.',
    vitals_snapshot: { systolic_bp: 122, diastolic_bp: 78, pulse: 68 },
    risk_level: 'low',
    is_overridden: true,
    override_reason: 'Doctor adjusted recommendation to include saline rinse based on prior sinus sensitivities.',
    override_at: '2026-08-15 11:15:00',
    finalized_at: '2026-08-15 11:20:00',
    patient: MOCK_USERS[0],
    doctor: MOCK_USERS[2],
    override_by_doctor: MOCK_USERS[2],
  }
];

export const MOCK_DOCUMENTS: MedicalDocument[] = [
  {
    id: 1,
    patient_id: 1,
    title: 'Dr. Smith Cardiology Prescription (August 2026)',
    document_type: 'prescription',
    file_path: '/uploads/prescriptions/rx_cardio_0826.pdf',
    ocr_status: 'completed',
    ocr_confidence: 0.96,
    extracted_data: {
      medications: [
        { name: 'Lisinopril', dosage: '10mg', frequency: 'Daily' },
        { name: 'Atorvastatin', dosage: '20mg', frequency: 'Bedtime' },
      ],
      raw_line_count: 8,
    },
    is_verified: true,
    created_at: '2026-08-25',
  },
  {
    id: 2,
    patient_id: 1,
    title: 'Urgent Care Discharge Note (Blurry Scan)',
    document_type: 'discharge_summary',
    file_path: '/uploads/scans/blurry_scan_doc.jpg',
    ocr_status: 'low_confidence',
    ocr_confidence: 0.74,
    extracted_data: {
      medications: [
        { name: 'Am?xicil??n', dosage: '500?g', frequency: 'Daily' },
      ],
      raw_line_count: 5,
    },
    is_verified: false,
    created_at: '2026-08-28',
  }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 1,
    patient_id: 1,
    doctor_id: 3,
    hospital_id: 1,
    scheduled_at: '2026-09-08 10:30:00',
    status: 'scheduled',
    type: 'in_person',
    reason_for_visit: 'Routine 6-month blood pressure follow-up and prescription refill review.',
    doctor: MOCK_USERS[2],
    patient: MOCK_USERS[0],
    hospital: MOCK_HOSPITALS[0],
  },
  {
    id: 2,
    patient_id: 1,
    doctor_id: 4,
    hospital_id: 1,
    scheduled_at: '2026-08-10 14:00:00',
    status: 'completed',
    type: 'video',
    reason_for_visit: 'Seasonal allergies consultation.',
    clinical_notes: 'Patient responded well to non-drowsy antihistamines. Discharge home.',
    doctor: MOCK_USERS[3],
    patient: MOCK_USERS[0],
    hospital: MOCK_HOSPITALS[0],
  }
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 1,
    user_id: 3,
    action: 'clinical_report.override',
    entity_type: 'App\\Models\\ClinicalReport',
    entity_id: 2,
    ip_address: '192.168.1.45',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    diff_payload: {
      before: { risk_level: 'low', recommendations: 'Standard antihistamine' },
      after: { risk_level: 'low', override_reason: 'Added saline rinse requirement', doctor_id: 3 },
    },
    created_at: '2026-08-15 11:15:22',
    user: MOCK_USERS[2],
  },
  {
    id: 2,
    user_id: 5,
    action: 'doctor.verify',
    entity_type: 'App\\Models\\DoctorProfile',
    entity_id: 1,
    ip_address: '192.168.1.1',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    diff_payload: { is_verified: true, status: 'active' },
    created_at: '2026-08-01 09:30:00',
    user: MOCK_USERS[4],
  }
];

export const MOCK_SYSTEM_SETTINGS: SystemSetting[] = [
  { id: 1, key: 'ai_primary_model', value: 'gemini-2.0-flash', group: 'ai', is_secret: false, description: 'Primary reasoning model for conversational triage.' },
  { id: 2, key: 'ai_fallback_model', value: 'gpt-4o-mini', group: 'ai', is_secret: false, description: 'Secondary fallback when circuit breaker trips.' },
  { id: 3, key: 'ai_circuit_breaker_error_threshold', value: '3', group: 'ai', is_secret: false, description: 'Consecutive error count to open circuit.' },
  { id: 4, key: 'ocr_confidence_threshold', value: '0.85', group: 'triage', is_secret: false, description: 'Minimum confidence score required for auto medication ingestion (Rule 15).' },
  { id: 5, key: 'emergency_dispatch_hotline', value: '911', group: 'security', is_secret: false, description: 'Emergency medical dispatch hotline.' },
];
