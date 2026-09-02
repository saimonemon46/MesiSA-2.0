<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Enum;

class UserManagementController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = User::with(['patientProfile', 'doctorProfile.hospital']);

        if ($request->has('role')) {
            $query->where('role', $request->query('role'));
        }

        if ($request->has('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->has('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return response()->json([
            'success' => true,
            'data' => $query->paginate(20),
        ]);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|string|in:active,inactive,suspended',
        ]);

        $user = User::findOrFail($id);
        $user->update(['status' => $validated['status']]);

        return response()->json([
            'success' => true,
            'message' => 'User status updated.',
            'data' => $user,
        ]);
    }
}
