<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    /**
     * Display a listing of departments.
     */
    public function index(Request $request): JsonResponse
    {
        $departments = Department::withCount('doctors')->get();

        return response()->json([
            'success' => true,
            'count' => $departments->count(),
            'data' => $departments,
        ]);
    }

    /**
     * Display the specified department with specialists.
     */
    public function show(string $identifier): JsonResponse
    {
        $department = Department::where('slug', $identifier)
            ->orWhere('code', strtoupper($identifier))
            ->orWhere('id', is_numeric($identifier) ? $identifier : 0)
            ->with(['doctors.hospital'])
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $department,
        ]);
    }
}
