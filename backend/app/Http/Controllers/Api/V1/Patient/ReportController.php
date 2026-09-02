<?php

namespace App\Http\Controllers\Api\V1\Patient;

use App\Http\Controllers\Controller;
use App\Models\ClinicalReport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $reports = ClinicalReport::with(['doctor', 'overrideByDoctor'])
            ->where('patient_id', $request->user()->id)
            ->latest()
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $reports,
        ]);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $report = ClinicalReport::with(['triageSession.messages', 'doctor', 'overrideByDoctor'])
            ->where('patient_id', $request->user()->id)
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $report,
        ]);
    }
}
