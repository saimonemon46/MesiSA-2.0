<?php

namespace Tests\Feature;

use App\Enums\RiskLevel;
use App\Enums\UserRole;
use App\Models\ClinicalReport;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ClinicalOverrideTest extends TestCase
{
    use RefreshDatabase;

    public function test_doctor_can_override_clinical_report_with_audit_trail(): void
    {
        $doctor = User::factory()->create([
            'role' => UserRole::DOCTOR,
            'status' => 'active',
        ]);

        $patient = User::factory()->create(['role' => UserRole::PATIENT]);

        $report = ClinicalReport::create([
            'patient_id' => $patient->id,
            'report_number' => 'REP-TEST-001',
            'summary' => 'AI Initial Summary',
            'clinical_assessment' => 'Initial Assessment',
            'recommendations' => 'Rest',
            'risk_level' => RiskLevel::LOW,
        ]);

        Sanctum::actingAs($doctor);

        $response = $this->postJson("/api/v1/doctor/clinical-reports/{$report->id}/override", [
            'override_reason' => 'Patient has additional comorbid factors requiring urgent care.',
            'updated_assessment' => 'Elevated risk due to prior cardiovascular history.',
            'updated_recommendations' => 'Schedule urgent in-person ECG and cardiac evaluation.',
            'updated_risk_level' => RiskLevel::HIGH->value,
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.is_overridden', true)
            ->assertJsonPath('data.risk_level', RiskLevel::HIGH->value);

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $doctor->id,
            'action' => 'clinical_report.override',
            'entity_id' => $report->id,
        ]);
    }

    public function test_patient_cannot_override_clinical_report(): void
    {
        $patient = User::factory()->create(['role' => UserRole::PATIENT]);

        $report = ClinicalReport::create([
            'patient_id' => $patient->id,
            'report_number' => 'REP-TEST-002',
            'summary' => 'Initial Summary',
            'clinical_assessment' => 'Initial Assessment',
            'recommendations' => 'Rest',
            'risk_level' => RiskLevel::LOW,
        ]);

        Sanctum::actingAs($patient);

        $response = $this->postJson("/api/v1/doctor/clinical-reports/{$report->id}/override", [
            'override_reason' => 'Patient self edit.',
            'updated_assessment' => 'Updated',
            'updated_recommendations' => 'Updated',
            'updated_risk_level' => RiskLevel::MEDIUM->value,
        ]);

        $response->assertStatus(403);
    }
}
