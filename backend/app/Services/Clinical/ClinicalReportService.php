<?php

namespace App\Services\Clinical;

use App\Enums\RiskLevel;
use App\Models\ClinicalReport;
use App\Models\User;
use App\Services\Audit\AuditService;
use Illuminate\Auth\Access\AuthorizationException;

class ClinicalReportService
{
    public function __construct(protected AuditService $auditService)
    {
    }

    public function overrideReport(
        ClinicalReport $report,
        User $doctor,
        string $overrideReason,
        string $updatedAssessment,
        string $updatedRecommendations,
        RiskLevel $updatedRiskLevel
    ): ClinicalReport {
        if (!$doctor->canOverrideClinicalReports()) {
            throw new AuthorizationException('Only authorized medical doctors and administrators can perform clinical triage overrides.');
        }

        $oldValues = [
            'risk_level' => $report->risk_level->value,
            'clinical_assessment' => $report->clinical_assessment,
            'recommendations' => $report->recommendations,
        ];

        $report->update([
            'is_overridden' => true,
            'override_reason' => $overrideReason,
            'override_by_doctor_id' => $doctor->id,
            'override_at' => now(),
            'clinical_assessment' => $updatedAssessment,
            'recommendations' => $updatedRecommendations,
            'risk_level' => $updatedRiskLevel,
        ]);

        $this->auditService->log(
            userId: $doctor->id,
            action: 'clinical_report.override',
            entityType: ClinicalReport::class,
            entityId: $report->id,
            diffPayload: [
                'before' => $oldValues,
                'after' => [
                    'risk_level' => $updatedRiskLevel->value,
                    'override_reason' => $overrideReason,
                    'doctor_id' => $doctor->id,
                ]
            ]
        );

        return $report->fresh(['patient', 'doctor', 'overrideByDoctor']);
    }
}
