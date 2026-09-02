<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\ClinicalReport;
use App\Models\DoctorProfile;
use App\Models\Hospital;
use App\Models\TriageSession;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AdminDashboardController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'counts' => [
                    'total_users' => User::count(),
                    'patients' => User::where('role', 'patient')->count(),
                    'doctors' => User::where('role', 'doctor')->count(),
                    'hospitals' => Hospital::count(),
                    'active_triage_sessions' => TriageSession::where('status', 'in_progress')->count(),
                    'emergency_triage_cases' => TriageSession::where('risk_level', 'emergency')->count(),
                    'total_appointments' => Appointment::count(),
                    'clinical_overrides' => ClinicalReport::where('is_overridden', true)->count(),
                ],
                'recent_emergencies' => TriageSession::with('patient')
                    ->where('risk_level', 'emergency')
                    ->latest()
                    ->take(5)
                    ->get(),
                'recent_overrides' => ClinicalReport::with(['patient', 'overrideByDoctor'])
                    ->where('is_overridden', true)
                    ->latest('override_at')
                    ->take(5)
                    ->get(),
            ]
        ]);
    }
}
