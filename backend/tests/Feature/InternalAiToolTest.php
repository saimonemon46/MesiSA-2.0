<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\PatientProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InternalAiToolTest extends TestCase
{
    use RefreshDatabase;

    public function test_internal_ai_tool_rejects_unauthorized_requests(): void
    {
        $response = $this->getJson('/api/v1/internal/patient-context/1');
        $response->assertStatus(401);
    }

    public function test_internal_ai_tool_allows_authorized_context_retrieval(): void
    {
        $patient = User::factory()->create([
            'role' => UserRole::PATIENT,
            'name' => 'Context Patient',
        ]);

        PatientProfile::create([
            'user_id' => $patient->id,
            'blood_group' => 'AB+',
            'allergies' => ['Latex'],
            'chronic_conditions' => ['Asthma'],
        ]);

        $response = $this->withHeader('X-Internal-Secret', 'medisa-internal-ai-secret-key')
            ->getJson("/api/v1/internal/patient-context/{$patient->id}");

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'Context Patient')
            ->assertJsonPath('data.blood_group', 'AB+')
            ->assertJsonPath('data.allergies.0', 'Latex');
    }
}
