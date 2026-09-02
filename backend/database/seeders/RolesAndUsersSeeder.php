<?php

namespace Database\Seeders;

use App\Enums\RiskLevel;
use App\Enums\UserRole;
use App\Models\Appointment;
use App\Models\ClinicalReport;
use App\Models\Medication;
use App\Models\PatientProfile;
use App\Models\TriageMessage;
use App\Models\TriageSession;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class RolesAndUsersSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Super Admin
        User::updateOrCreate(
            ['email' => 'superadmin@medisa.local'],
            [
                'name' => 'MediSA Super Administrator',
                'password' => Hash::make('Password123!'),
                'role' => UserRole::SUPER_ADMIN,
                'status' => 'active',
                'phone' => '+1 (555) 000-0001',
            ]
        );

        // 2. Hospital Admin
        User::updateOrCreate(
            ['email' => 'hospitaladmin@medisa.local'],
            [
                'name' => 'Central Hospital Admin',
                'password' => Hash::make('Password123!'),
                'role' => UserRole::HOSPITAL_ADMIN,
                'status' => 'active',
                'phone' => '+1 (555) 000-0002',
            ]
        );

        // 3. Nurse
        User::updateOrCreate(
            ['email' => 'nurse.clara@medisa.local'],
            [
                'name' => 'Nurse Clara Oswald, RN',
                'password' => Hash::make('Password123!'),
                'role' => UserRole::NURSE,
                'status' => 'active',
                'phone' => '+1 (555) 000-0003',
            ]
        );

        // 4. Sample Patient 1: John Doe
        $patient1 = User::updateOrCreate(
            ['email' => 'patient.john@medisa.local'],
            [
                'name' => 'John Doe',
                'password' => Hash::make('Password123!'),
                'role' => UserRole::PATIENT,
                'status' => 'active',
                'phone' => '+1 (555) 111-2233',
            ]
        );

        PatientProfile::updateOrCreate(
            ['user_id' => $patient1->id],
            [
                'date_of_birth' => '1985-06-15',
                'gender' => 'male',
                'blood_group' => 'O+',
                'allergies' => ['Penicillin', 'Peanuts'],
                'chronic_conditions' => ['Hypertension (Stage 1)'],
                'emergency_contact_name' => 'Jane Doe',
                'emergency_contact_phone' => '+1 (555) 999-8877',
                'emergency_contact_relation' => 'Spouse',
                'address' => '42 Elm Street, Metropolis, NY',
            ]
        );

        // Add Active Medications for John
        Medication::updateOrCreate(
            ['patient_id' => $patient1->id, 'name' => 'Lisinopril'],
            [
                'dosage' => '10mg',
                'frequency' => 'Once daily in the morning',
                'route' => 'oral',
                'start_date' => '2024-01-10',
                'status' => 'active',
                'prescribed_by' => 'Dr. Marcus Smith',
                'notes' => 'Monitor blood pressure weekly.',
            ]
        );

        Medication::updateOrCreate(
            ['patient_id' => $patient1->id, 'name' => 'Atorvastatin'],
            [
                'dosage' => '20mg',
                'frequency' => 'Once daily at bedtime',
                'route' => 'oral',
                'start_date' => '2024-02-15',
                'status' => 'active',
                'prescribed_by' => 'Dr. Marcus Smith',
                'notes' => 'Lipid panel scheduled in 6 months.',
            ]
        );

        // Sample Completed Triage Session & Clinical Report for John
        $triageSession = TriageSession::updateOrCreate(
            ['session_token' => 'seed-token-patient-john-001'],
            [
                'patient_id' => $patient1->id,
                'thread_id' => 'langgraph-seed-thread-001',
                'status' => 'completed',
                'risk_level' => RiskLevel::MEDIUM,
                'red_flag_detected' => false,
                'contradiction_detected' => false,
                'ai_summary' => 'Patient presented with mild tension headache and neck stiffness lasting 2 days without red-flag neurological symptoms.',
                'recommended_action' => 'Hydration, over-the-counter acetaminophen, scheduled follow-up if symptoms persist beyond 72 hours.',
                'completed_at' => now()->subDays(3),
            ]
        );

        TriageMessage::create([
            'triage_session_id' => $triageSession->id,
            'sender_role' => 'patient',
            'message' => 'I have had a mild dull headache across my forehead for the last 2 days.',
            'created_at' => now()->subDays(3)->subMinutes(10),
        ]);

        TriageMessage::create([
            'triage_session_id' => $triageSession->id,
            'sender_role' => 'ai',
            'message' => 'Are you experiencing any fever, vision changes, sudden onset severe pain, or confusion?',
            'created_at' => now()->subDays(3)->subMinutes(9),
        ]);

        TriageMessage::create([
            'triage_session_id' => $triageSession->id,
            'sender_role' => 'patient',
            'message' => 'No fever or vision changes. Just mild stress and eye fatigue from screen work.',
            'created_at' => now()->subDays(3)->subMinutes(8),
        ]);

        ClinicalReport::updateOrCreate(
            ['report_number' => 'REP-2026-0801'],
            [
                'triage_session_id' => $triageSession->id,
                'patient_id' => $patient1->id,
                'summary' => 'Tension-type cephalalgia exacerbated by screen strain.',
                'clinical_assessment' => 'Low-to-moderate risk tension headache. No focal neurological deficits reported.',
                'recommendations' => 'Ergonomic adjustments, hydration, OTC analgesics as appropriate.',
                'vitals_snapshot' => ['systolic_bp' => 128, 'diastolic_bp' => 82, 'pulse' => 74],
                'risk_level' => RiskLevel::MEDIUM,
                'finalized_at' => now()->subDays(3),
            ]
        );

        // 5. Sample Patient 2: Emma Watson
        $patient2 = User::updateOrCreate(
            ['email' => 'patient.emma@medisa.local'],
            [
                'name' => 'Emma Watson',
                'password' => Hash::make('Password123!'),
                'role' => UserRole::PATIENT,
                'status' => 'active',
                'phone' => '+1 (555) 777-6655',
            ]
        );

        PatientProfile::updateOrCreate(
            ['user_id' => $patient2->id],
            [
                'date_of_birth' => '1992-11-20',
                'gender' => 'female',
                'blood_group' => 'A+',
                'allergies' => ['Sulfa drugs'],
                'chronic_conditions' => ['Mild Asthma'],
                'emergency_contact_name' => 'David Watson',
                'emergency_contact_phone' => '+1 (555) 888-3322',
                'emergency_contact_relation' => 'Brother',
                'address' => '88 Riverside Blvd, Metropolis, NY',
            ]
        );
    }
}
