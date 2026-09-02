<?php

namespace App\Enums;

enum UserRole: string
{
    case PATIENT = 'patient';
    case DOCTOR = 'doctor';
    case NURSE = 'nurse';
    case HOSPITAL_ADMIN = 'hospital_admin';
    case SUPER_ADMIN = 'super_admin';

    public function label(): string
    {
        return match($this) {
            self::PATIENT => 'Patient',
            self::DOCTOR => 'Doctor',
            self::NURSE => 'Nurse',
            self::HOSPITAL_ADMIN => 'Hospital Admin',
            self::SUPER_ADMIN => 'Super Admin',
        };
    }
}
