<?php

namespace App\Http\Controllers\Api\V1\Patient;

use App\Http\Controllers\Controller;
use App\Models\TriageSession;
use App\Services\Triage\TriageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TriageController extends Controller
{
    public function __construct(protected TriageService $triageService)
    {
    }

    public function start(Request $request): JsonResponse
    {
        $session = $this->triageService->startSession($request->user());

        return response()->json([
            'success' => true,
            'message' => 'Triage session initiated.',
            'data' => $session,
        ], 201);
    }

    public function show(Request $request, string $token): JsonResponse
    {
        $session = TriageSession::with(['messages', 'clinicalReport'])
            ->where('patient_id', $request->user()->id)
            ->where('session_token', $token)
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $session,
        ]);
    }

    public function sendMessage(Request $request, string $token): JsonResponse
    {
        $validated = $request->validate([
            'message' => 'required|string|max:2000',
        ]);

        $session = TriageSession::where('patient_id', $request->user()->id)
            ->where('session_token', $token)
            ->firstOrFail();

        if ($session->status === 'completed' || $session->status === 'escalated_emergency') {
            return response()->json([
                'success' => false,
                'message' => 'This triage session is already closed.',
            ], 400);
        }

        $userMsg = $this->triageService->appendUserMessage($session, $validated['message']);

        return response()->json([
            'success' => true,
            'data' => [
                'user_message' => $userMsg,
                'session' => $session->fresh('messages'),
            ]
        ]);
    }
}
