<?php

namespace App\Http\Controllers\Api\V1\Internal;

use App\Enums\RiskLevel;
use App\Http\Controllers\Controller;
use App\Models\Medication;
use App\Models\TriageSession;
use App\Models\User;
use App\Services\Triage\TriageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Enum;

class InternalAiToolController extends Controller
{
    public function __construct(protected TriageService $triageService)
    {
    }

    public function getPatientContext(int $patientId): JsonResponse
    {
        $user = User::with(['patientProfile', 'medications' => function ($q) {
            $q->where('status', 'active');
        }])->findOrFail($patientId);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'gender' => $user->patientProfile?->gender,
                'date_of_birth' => $user->patientProfile?->date_of_birth,
                'blood_group' => $user->patientProfile?->blood_group,
                'allergies' => $user->patientProfile?->allergies ?? [],
                'chronic_conditions' => $user->patientProfile?->chronic_conditions ?? [],
                'active_medications' => $user->medications->map(fn($m) => [
                    'name' => $m->name,
                    'dosage' => $m->dosage,
                    'frequency' => $m->frequency,
                ]),
            ]
        ]);
    }

    public function handleRedFlag(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'session_token' => 'required|exists:triage_sessions,session_token',
            'red_flag_details' => 'required|array',
            'emergency_summary' => 'required|string',
        ]);

        $session = TriageSession::where('session_token', $validated['session_token'])->firstOrFail();
        $updatedSession = $this->triageService->handleRedFlagEmergency(
            $session,
            $validated['red_flag_details'],
            $validated['emergency_summary']
        );

        return response()->json([
            'success' => true,
            'message' => 'Emergency red-flag recorded and escalated.',
            'data' => $updatedSession,
        ]);
    }

    public function completeTriage(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'session_token' => 'required|exists:triage_sessions,session_token',
            'ai_summary' => 'required|string',
            'risk_level' => ['required', new Enum(RiskLevel::class)],
            'recommended_action' => 'required|string',
            'clinical_data' => 'nullable|array',
        ]);

        $session = TriageSession::where('session_token', $validated['session_token'])->firstOrFail();
        $report = $this->triageService->completeTriage(
            session: $session,
            aiSummary: $validated['ai_summary'],
            riskLevel: RiskLevel::from($validated['risk_level']),
            recommendedAction: $validated['recommended_action'],
            clinicalData: $validated['clinical_data'] ?? []
        );

        return response()->json([
            'success' => true,
            'message' => 'Triage session completed.',
            'data' => $report,
        ]);
    }
}
