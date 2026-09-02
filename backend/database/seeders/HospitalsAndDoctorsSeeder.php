<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\DoctorProfile;
use App\Models\Hospital;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class HospitalsAndDoctorsSeeder extends Seeder
{
    public function run(): void
    {
        $centralHospital = Hospital::updateOrCreate(
            ['slug' => 'medisa-central-hospital'],
            [
                'name' => 'MediSA Central Medical Center',
                'address' => '742 Evergreen Terrace, Suite 100',
                'city' => 'Metropolis',
                'state' => 'NY',
                'postal_code' => '10001',
                'phone' => '+1 (555) 019-2831',
                'email' => 'central@medisa-health.org',
                'emergency_services' => true,
                'emergency_hotline' => '+1 (800) 555-0199',
                'status' => 'active',
                'meta' => [
                    'bed_capacity' => 450,
                    'trauma_level' => 'Level 1 Trauma Center',
                    'specialties' => ['Cardiology', 'Emergency Care', 'Neurology', 'Pediatrics', 'Oncology'],
                ]
            ]
        );

        $communityHospital = Hospital::updateOrCreate(
            ['slug' => 'st-jude-community-health'],
            [
                'name' => 'St. Jude Community Health Hospital',
                'address' => '1204 Pine Street',
                'city' => 'Brookfield',
                'state' => 'NY',
                'postal_code' => '10002',
                'phone' => '+1 (555) 018-9922',
                'email' => 'care@stjude-community.org',
                'emergency_services' => true,
                'emergency_hotline' => '+1 (800) 555-0188',
                'status' => 'active',
                'meta' => [
                    'bed_capacity' => 180,
                    'specialties' => ['Family Medicine', 'Internal Medicine', 'Urgent Care'],
                ]
            ]
        );

        // Doctor 1: Dr. Marcus Smith (Cardiology)
        $doc1User = User::updateOrCreate(
            ['email' => 'dr.smith@medisa.local'],
            [
                'name' => 'Dr. Marcus Smith, MD',
                'password' => Hash::make('Password123!'),
                'role' => UserRole::DOCTOR,
                'status' => 'active',
                'phone' => '+1 (555) 234-5678',
            ]
        );

        DoctorProfile::updateOrCreate(
            ['user_id' => $doc1User->id],
            [
                'hospital_id' => $centralHospital->id,
                'specialty' => 'Cardiology',
                'license_number' => 'MD-NY-2018-8841',
                'bio' => 'Board-certified Cardiologist with 14 years of experience specializing in cardiovascular diagnostics, arrhythmia management, and preventive cardiology.',
                'experience_years' => 14,
                'consultation_fee' => 150.00,
                'is_verified' => true,
                'verification_notes' => 'State medical board verified credentials in good standing.',
                'verified_at' => now(),
                'availability_schedule' => [
                    'monday' => ['09:00-12:00', '14:00-17:00'],
                    'wednesday' => ['09:00-12:00', '14:00-17:00'],
                    'friday' => ['09:00-13:00'],
                ],
                'status' => 'active',
            ]
        );

        // Doctor 2: Dr. Sarah Jenkins (General Medicine)
        $doc2User = User::updateOrCreate(
            ['email' => 'dr.sarah@medisa.local'],
            [
                'name' => 'Dr. Sarah Jenkins, MD',
                'password' => Hash::make('Password123!'),
                'role' => UserRole::DOCTOR,
                'status' => 'active',
                'phone' => '+1 (555) 345-6789',
            ]
        );

        DoctorProfile::updateOrCreate(
            ['user_id' => $doc2User->id],
            [
                'hospital_id' => $centralHospital->id,
                'specialty' => 'General Practice',
                'license_number' => 'MD-NY-2020-5512',
                'bio' => 'Primary care physician focusing on holistic wellness, chronic disease management, and acute symptom resolution.',
                'experience_years' => 9,
                'consultation_fee' => 90.00,
                'is_verified' => true,
                'verification_notes' => 'Verified by hospital credentialing committee.',
                'verified_at' => now(),
                'availability_schedule' => [
                    'monday' => ['08:00-16:00'],
                    'tuesday' => ['08:00-16:00'],
                    'thursday' => ['08:00-16:00'],
                ],
                'status' => 'active',
            ]
        );

        // Doctor 3: Dr. Robert Chen (Pediatrics)
        $doc3User = User::updateOrCreate(
            ['email' => 'dr.chen@medisa.local'],
            [
                'name' => 'Dr. Robert Chen, MD',
                'password' => Hash::make('Password123!'),
                'role' => UserRole::DOCTOR,
                'status' => 'active',
                'phone' => '+1 (555) 456-7890',
            ]
        );

        DoctorProfile::updateOrCreate(
            ['user_id' => $doc3User->id],
            [
                'hospital_id' => $communityHospital->id,
                'specialty' => 'Pediatrics',
                'license_number' => 'MD-NY-2016-1934',
                'bio' => 'Pediatric specialist with dedicated care for infant, child, and adolescent developmental health.',
                'experience_years' => 12,
                'consultation_fee' => 120.00,
                'is_verified' => true,
                'verification_notes' => 'Active license and pediatric board certified.',
                'verified_at' => now(),
                'availability_schedule' => [
                    'tuesday' => ['09:00-17:00'],
                    'wednesday' => ['09:00-17:00'],
                    'friday' => ['09:00-15:00'],
                ],
                'status' => 'active',
            ]
        );
    }
}
