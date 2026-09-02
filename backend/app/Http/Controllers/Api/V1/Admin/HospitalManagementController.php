<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Hospital;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class HospitalManagementController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => Hospital::withCount('doctorProfiles')->paginate(20),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'city' => 'required|string|max:100',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'emergency_services' => 'boolean',
            'emergency_hotline' => 'nullable|string|max:20',
        ]);

        $hospital = Hospital::create([
            ...$validated,
            'slug' => Str::slug($validated['name']) . '-' . Str::random(5),
            'status' => 'active',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Hospital created.',
            'data' => $hospital,
        ], 201);
    }
}
