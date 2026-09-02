<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class RbacAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_non_admin_cannot_access_admin_dashboard(): void
    {
        $patient = User::factory()->create(['role' => UserRole::PATIENT]);

        Sanctum::actingAs($patient);

        $response = $this->getJson('/api/v1/admin/dashboard');
        $response->assertStatus(403);
    }

    public function test_admin_can_access_admin_dashboard(): void
    {
        $admin = User::factory()->create(['role' => UserRole::SUPER_ADMIN]);

        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/v1/admin/dashboard');
        $response->assertStatus(200)
            ->assertJsonPath('success', true);
    }
}
