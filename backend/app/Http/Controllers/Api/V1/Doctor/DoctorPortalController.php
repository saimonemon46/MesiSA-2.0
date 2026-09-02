<?php

namespace App\Http\Controllers\Api\V1\Doctor;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\ClinicalReport;
use App\Models\DoctorProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DoctorPortalController extends Controller
{
    public function dashboard(Request $request): JsonResponse
    {
        $doctorId = $request->user()->id;

        $todayAppointments = Appointment::with(['patient.patientProfile', 'hospital'])
            ->where('doctor_id', $doctorId)
            ->whereDate('scheduled_at', today())
            ->orderBy('scheduled_at')
            ->get();

        $pendingReviews = ClinicalReport::with('patient')
            ->where(function ($q) use ($doctorId) {
                $q->where('doctor_id', $doctorId)
                  ->orWhereNull('doctor_id');
            })
            ->whereNull('finalized_at')
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'today_appointments' => $todayAppointments,
                'pending_report_reviews' => $pendingReviews,
                'stats' => [
                    'total_appointments_today' => $todayAppointments->count(),
                    'pending_reviews' => $pendingReviews->count(),
                ]
            ]
        ]);
    }
}
