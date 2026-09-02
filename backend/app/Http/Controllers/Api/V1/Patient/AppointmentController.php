<?php

namespace App\Http\Controllers\Api\V1\Patient;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Services\Appointment\AppointmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function __construct(protected AppointmentService $appointmentService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $appointments = Appointment::with(['doctor.doctorProfile', 'hospital'])
            ->where('patient_id', $request->user()->id)
            ->orderByDesc('scheduled_at')
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $appointments,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'doctor_id' => 'required|exists:users,id',
            'scheduled_at' => 'required|date|after:now',
            'type' => 'nullable|string|in:in_person,video,consultation',
            'reason_for_visit' => 'nullable|string|max:1000',
        ]);

        $appointment = $this->appointmentService->bookAppointment(
            patient: $request->user(),
            doctorId: $validated['doctor_id'],
            scheduledAt: $validated['scheduled_at'],
            type: $validated['type'] ?? 'in_person',
            reasonForVisit: $validated['reason_for_visit'] ?? null
        );

        return response()->json([
            'success' => true,
            'message' => 'Appointment booked successfully.',
            'data' => $appointment,
        ], 201);
    }

    public function cancel(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'cancellation_reason' => 'required|string|max:500',
        ]);

        $appointment = Appointment::where('patient_id', $request->user()->id)->findOrFail($id);
        $updated = $this->appointmentService->cancelAppointment($appointment, $request->user(), $validated['cancellation_reason']);

        return response()->json([
            'success' => true,
            'message' => 'Appointment cancelled.',
            'data' => $updated,
        ]);
    }
}
