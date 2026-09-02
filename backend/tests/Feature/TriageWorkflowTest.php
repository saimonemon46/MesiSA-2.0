<?php

namespace Tests\Feature;

use App\Enums\RiskLevel;
use App\Enums\UserRole;
use App\Models\TriageSession;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TriageWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_patient_can_start_and_message_triage_session(): void
    {
        $patient = User::factory()->create([
            'role' => UserRole::PATIENT,
            'status' => 'active',
        ]);

        Sanctum::actingAs($patient);

        $startRes = $this->postJson('/api/v1/patient/triage/start');
        $startRes->assertStatus(201)
            ->assertJsonPath('success', true);

        $token = $startRes->json('data.session_token');

        $msgRes = $this->postJson("/api/v1/patient/triage/{$token}/messages", [
            'message' => 'I have a mild sore throat for 2 days.',
        ]);

        $msgRes->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.user_message.message', 'I have a mild sore throat for 2 days.');

        $this->assertDatabaseHas('triage_messages', ['message' => 'I have a mild sore throat for 2 days.']);
    }

    public function test_internal_ai_can_escalate_red_flag_emergency(): void
    {
        $patient = User::factory()->create(['role' => UserRole::PATIENT]);
        $session = TriageSession::create([
            'patient_id' => $patient->id,
            'session_token' => 'emergency-token-123',
            'status' => 'in_progress',
        ]);

        $response = $this->withHeader('X-Internal-Secret', 'medisa-internal-ai-secret-key')
            ->postJson('/api/v1/internal/triage/red-flag', [
                'session_token' => 'emergency-token-123',
                'red_flag_details' => ['symptom' => 'crushing chest pain radiating to left arm'],
                'emergency_summary' => 'Suspected acute coronary syndrome / myocardial infarction.',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.status', 'escalated_emergency')
            ->assertJsonPath('data.risk_level', RiskLevel::EMERGENCY->value);

        $this->assertDatabaseHas('clinical_reports', [
            'triage_session_id' => $session->id,
            'risk_level' => RiskLevel::EMERGENCY->value,
        ]);
    }
}
