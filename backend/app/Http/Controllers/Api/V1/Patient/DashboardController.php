<?php

namespace App\Http\Controllers\Api\V1\Patient;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\ClinicalReport;
use App\Models\Medication;
use App\Models\TriageSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $patientId = $request->user()->id;

        $recentTriage = TriageSession::where('patient_id', $patientId)
            ->latest()
            ->take(3)
            ->get();

        $upcomingAppointments = Appointment::with(['doctor.doctorProfile', 'hospital'])
            ->where('patient_id', $patientId)
            ->where('scheduled_at', '>=', now())
            ->where('status', '!=', 'cancelled')
            ->orderBy('scheduled_at')
            ->take(3)
            ->get();

        $recentReports = ClinicalReport::where('patient_id', $patientId)
            ->latest()
            ->take(3)
            ->get();

        $activeMedications = Medication::where('patient_id', $patientId)
            ->where('status', 'active')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'recent_triage_sessions' => $recentTriage,
                'upcoming_appointments' => $upcomingAppointments,
                'recent_reports' => $recentReports,
                'active_medications' => $activeMedications,
                'summary_stats' => [
                    'total_reports' => ClinicalReport::where('patient_id', $patientId)->count(),
                    'active_prescriptions' => $activeMedications->count(),
                    'upcoming_visits' => $upcomingAppointments->count(),
                ]
            ]
        ]);
    }
}
