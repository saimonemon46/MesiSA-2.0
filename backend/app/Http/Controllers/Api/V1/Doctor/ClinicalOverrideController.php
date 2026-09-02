<?php

namespace App\Http\Controllers\Api\V1\Doctor;

use App\Enums\RiskLevel;
use App\Http\Controllers\Controller;
use App\Models\ClinicalReport;
use App\Services\Clinical\ClinicalReportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Enum;

class ClinicalOverrideController extends Controller
{
    public function __construct(protected ClinicalReportService $clinicalService)
    {
    }

    public function override(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'override_reason' => 'required|string|min:10|max:1000',
            'updated_assessment' => 'required|string|min:10',
            'updated_recommendations' => 'required|string|min:10',
            'updated_risk_level' => ['required', new Enum(RiskLevel::class)],
        ]);

        $report = ClinicalReport::findOrFail($id);

        $updatedReport = $this->clinicalService->overrideReport(
            report: $report,
            doctor: $request->user(),
            overrideReason: $validated['override_reason'],
            updatedAssessment: $validated['updated_assessment'],
            updatedRecommendations: $validated['updated_recommendations'],
            updatedRiskLevel: RiskLevel::from($validated['updated_risk_level'])
        );

        return response()->json([
            'success' => true,
            'message' => 'Clinical triage report successfully overridden and audited.',
            'data' => $updatedReport,
        ]);
    }
}
