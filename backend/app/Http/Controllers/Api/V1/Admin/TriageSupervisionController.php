<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\TriageSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TriageSupervisionController extends Controller
{
    public function liveSessions(): JsonResponse
    {
        $sessions = TriageSession::with(['patient.patientProfile', 'messages'])
            ->where('status', 'in_progress')
            ->latest('updated_at')
            ->take(20)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $sessions,
        ]);
    }

    public function sessionDetail(int $id): JsonResponse
    {
        $session = TriageSession::with(['patient.patientProfile', 'messages', 'clinicalReport'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $session,
        ]);
    }
}
