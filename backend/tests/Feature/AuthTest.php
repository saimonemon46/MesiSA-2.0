<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_patient_can_register_and_receive_token(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Alice Test',
            'email' => 'alice@test.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'phone' => '+15551234567',
            'gender' => 'female',
            'blood_group' => 'B+',
            'allergies' => ['Aspirin'],
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonStructure(['data' => ['user' => ['id', 'name', 'email', 'patient_profile'], 'token']]);

        $this->assertDatabaseHas('users', ['email' => 'alice@test.com', 'role' => UserRole::PATIENT->value]);
        $this->assertDatabaseHas('patient_profiles', ['blood_group' => 'B+']);
    }

    public function test_user_can_login_with_valid_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'login@test.com',
            'password' => bcrypt('Secret123!'),
            'role' => UserRole::PATIENT,
            'status' => 'active',
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'login@test.com',
            'password' => 'Secret123!',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure(['data' => ['token']]);
    }
}
