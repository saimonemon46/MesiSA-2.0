<?php

namespace App\Services\Triage;

use App\Enums\RiskLevel;
use App\Models\ClinicalReport;
use App\Models\TriageMessage;
use App\Models\TriageSession;
use App\Models\User;
use App\Services\Audit\AuditService;
use Illuminate\Support\Str;

class TriageService
{
    public function __construct(protected AuditService $auditService)
    {
    }

    public function startSession(User $patient): TriageSession
    {
        $session = TriageSession::create([
            'patient_id' => $patient->id,
            'session_token' => Str::random(40),
            'status' => 'in_progress',
            'risk_level' => RiskLevel::PENDING,
            'red_flag_detected' => false,
            'contradiction_detected' => false,
        ]);

        TriageMessage::create([
            'triage_session_id' => $session->id,
            'sender_role' => 'ai',
            'message' => 'Hello, I am MediSA AI triage assistant. Please describe your main symptoms, duration, and severity.',
            'created_at' => now(),
        ]);

        $this->auditService->log(
            userId: $patient->id,
            action: 'triage.start',
            entityType: TriageSession::class,
            entityId: $session->id
        );

        return $session->load('messages');
    }

    public function appendUserMessage(TriageSession $session, string $message): TriageMessage
    {
        return TriageMessage::create([
            'triage_session_id' => $session->id,
            'sender_role' => 'patient',
            'message' => $message,
            'created_at' => now(),
        ]);
    }

    public function handleRedFlagEmergency(TriageSession $session, array $redFlagDetails, string $emergencySummary): TriageSession
    {
        $session->update([
            'status' => 'escalated_emergency',
            'risk_level' => RiskLevel::EMERGENCY,
            'red_flag_detected' => true,
            'red_flag_details' => $redFlagDetails,
            'ai_summary' => $emergencySummary,
            'recommended_action' => 'EMERGENCY: Seek immediate medical care or call 911 / emergency hotline.',
            'completed_at' => now(),
        ]);

        TriageMessage::create([
            'triage_session_id' => $session->id,
            'sender_role' => 'ai',
            'message' => 'CRITICAL ALERT: Your symptoms indicate an immediate medical emergency. Please call your local emergency hotline (911/999) or visit the nearest emergency room immediately.',
            'red_flag_score' => 1.0,
            'created_at' => now(),
        ]);

        ClinicalReport::create([
            'triage_session_id' => $session->id,
            'patient_id' => $session->patient_id,
            'report_number' => 'REP-EMG-' . strtoupper(Str::random(8)),
            'summary' => $emergencySummary,
            'clinical_assessment' => 'EMERGENCY RED FLAG DETECTED. Immediate physical hospital intervention required.',
            'recommendations' => 'Immediate emergency department dispatch and critical care admission.',
            'risk_level' => RiskLevel::EMERGENCY,
            'finalized_at' => now(),
        ]);

        $this->auditService->log(
            userId: $session->patient_id,
            action: 'triage.red_flag_emergency',
            entityType: TriageSession::class,
            entityId: $session->id,
            diffPayload: $redFlagDetails
        );

        return $session->fresh(['messages', 'clinicalReport']);
    }

    public function completeTriage(
        TriageSession $session,
        string $aiSummary,
        RiskLevel $riskLevel,
        string $recommendedAction,
        array $clinicalData
    ): ClinicalReport {
        $session->update([
            'status' => 'completed',
            'risk_level' => $riskLevel,
            'ai_summary' => $aiSummary,
            'recommended_action' => $recommendedAction,
            'completed_at' => now(),
        ]);

        $report = ClinicalReport::create([
            'triage_session_id' => $session->id,
            'patient_id' => $session->patient_id,
            'report_number' => 'REP-' . strtoupper(Str::random(8)),
            'summary' => $aiSummary,
            'clinical_assessment' => $clinicalData['assessment'] ?? 'Standard AI Triage Assessment',
            'recommendations' => $recommendedAction,
            'vitals_snapshot' => $clinicalData['vitals'] ?? null,
            'risk_level' => $riskLevel,
            'finalized_at' => now(),
        ]);

        $this->auditService->log(
            userId: $session->patient_id,
            action: 'triage.complete',
            entityType: ClinicalReport::class,
            entityId: $report->id
        );

        return $report;
    }
}
