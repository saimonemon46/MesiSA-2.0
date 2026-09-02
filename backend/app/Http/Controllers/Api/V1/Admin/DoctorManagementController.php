<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\DoctorProfile;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DoctorManagementController extends Controller
{
    public function index(): JsonResponse
    {
        $doctors = DoctorProfile::with(['user', 'hospital'])->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $doctors,
        ]);
    }

    public function verify(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'is_verified' => 'required|boolean',
            'verification_notes' => 'nullable|string|max:500',
        ]);

        $profile = DoctorProfile::findOrFail($id);
        $profile->update([
            'is_verified' => $validated['is_verified'],
            'verification_notes' => $validated['verification_notes'] ?? null,
            'verified_at' => $validated['is_verified'] ? now() : null,
            'status' => $validated['is_verified'] ? 'active' : 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Doctor verification status updated.',
            'data' => $profile->load(['user', 'hospital']),
        ]);
    }
}
