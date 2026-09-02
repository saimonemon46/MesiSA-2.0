<?php

namespace App\Services\Appointment;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use App\Models\User;
use App\Services\Audit\AuditService;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;

class AppointmentService
{
    public function __construct(protected AuditService $auditService)
    {
    }

    public function bookAppointment(
        User $patient,
        int $doctorId,
        string $scheduledAt,
        string $type = 'in_person',
        ?string $reasonForVisit = null
    ): Appointment {
        $doctor = User::with('doctorProfile')->findOrFail($doctorId);

        if (!$doctor->isDoctor()) {
            throw ValidationException::withMessages(['doctor_id' => ['Selected user is not a valid medical doctor.']]);
        }

        $scheduledDateTime = Carbon::parse($scheduledAt);

        $existing = Appointment::where('doctor_id', $doctorId)
            ->where('scheduled_at', $scheduledDateTime)
            ->whereIn('status', [AppointmentStatus::SCHEDULED, AppointmentStatus::CONFIRMED])
            ->exists();

        if ($existing) {
            throw ValidationException::withMessages(['scheduled_at' => ['Doctor is already booked for this time slot.']]);
        }

        $appointment = Appointment::create([
            'patient_id' => $patient->id,
            'doctor_id' => $doctorId,
            'hospital_id' => $doctor->doctorProfile?->hospital_id,
            'scheduled_at' => $scheduledDateTime,
            'status' => AppointmentStatus::SCHEDULED,
            'type' => $type,
            'reason_for_visit' => $reasonForVisit,
        ]);

        $this->auditService->log(
            userId: $patient->id,
            action: 'appointment.book',
            entityType: Appointment::class,
            entityId: $appointment->id
        );

        return $appointment->load(['doctor.doctorProfile', 'hospital']);
    }

    public function cancelAppointment(Appointment $appointment, User $actor, string $reason): Appointment
    {
        $appointment->update([
            'status' => AppointmentStatus::CANCELLED,
            'cancellation_reason' => $reason,
        ]);

        $this->auditService->log(
            userId: $actor->id,
            action: 'appointment.cancel',
            entityType: Appointment::class,
            entityId: $appointment->id,
            diffPayload: ['reason' => $reason]
        );

        return $appointment;
    }
}
