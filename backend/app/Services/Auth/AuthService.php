<?php

namespace App\Services\Auth;

use App\Enums\UserRole;
use App\Models\PatientProfile;
use App\Models\User;
use App\Services\Audit\AuditService;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function __construct(protected AuditService $auditService)
    {
    }

    public function registerPatient(array $data): array
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => UserRole::PATIENT,
            'status' => 'active',
            'phone' => $data['phone'] ?? null,
        ]);

        PatientProfile::create([
            'user_id' => $user->id,
            'date_of_birth' => $data['date_of_birth'] ?? null,
            'gender' => $data['gender'] ?? null,
            'blood_group' => $data['blood_group'] ?? null,
            'allergies' => $data['allergies'] ?? [],
            'chronic_conditions' => $data['chronic_conditions'] ?? [],
            'emergency_contact_name' => $data['emergency_contact_name'] ?? null,
            'emergency_contact_phone' => $data['emergency_contact_phone'] ?? null,
            'emergency_contact_relation' => $data['emergency_contact_relation'] ?? null,
            'address' => $data['address'] ?? null,
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        $this->auditService->log(
            userId: $user->id,
            action: 'auth.register',
            entityType: User::class,
            entityId: $user->id,
            diffPayload: ['email' => $user->email, 'role' => $user->role->value]
        );

        return [
            'user' => $user->load('patientProfile'),
            'token' => $token,
        ];
    }

    public function login(string $email, string $password): array
    {
        $user = User::where('email', $email)->first();

        if (!$user || !Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid email or password.'],
            ]);
        }

        if ($user->status !== 'active') {
            throw ValidationException::withMessages([
                'email' => ['Your account is inactive or suspended. Please contact administrator.'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        $this->auditService->log(
            userId: $user->id,
            action: 'auth.login',
            entityType: User::class,
            entityId: $user->id
        );

        return [
            'user' => $user->load(['patientProfile', 'doctorProfile']),
            'token' => $token,
        ];
    }

    public function logout(User $user): void
    {
        $user->currentAccessToken()->delete();

        $this->auditService->log(
            userId: $user->id,
            action: 'auth.logout',
            entityType: User::class,
            entityId: $user->id
        );
    }
}
