<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DoctorController extends Controller
{
    /**
     * Display a listing of doctors with department and hospital relations.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Doctor::query()->with(['hospital', 'department']);

        // Filter by Department slug or ID
        if ($request->filled('department')) {
            $dept = $request->query('department');
            $query->whereHas('department', function ($q) use ($dept) {
                $q->where('slug', $dept)->orWhere('code', strtoupper($dept));
            });
        }

        // Filter by Hospital slug or ID
        if ($request->filled('hospital')) {
            $hosp = $request->query('hospital');
            $query->whereHas('hospital', function ($q) use ($hosp) {
                $q->where('slug', $hosp)->orWhere('code', strtoupper($hosp));
            });
        }

        // Search query across name, sub_specialty, and qualifications
        if ($request->filled('search')) {
            $term = '%' . $request->query('search') . '%';
            $query->where(function ($q) use ($term) {
                $q->where('name', 'ilike', $term)
                  ->orWhere('sub_specialty', 'ilike', $term)
                  ->orWhere('bio', 'ilike', $term);
            });
        }

        $doctors = $query->orderByDesc('rating')->get();

        return response()->json([
            'success' => true,
            'count' => $doctors->count(),
            'data' => $doctors,
        ]);
    }

    /**
     * Display the specified doctor profile.
     */
    public function show(string $identifier): JsonResponse
    {
        $doctor = Doctor::where('slug', $identifier)
            ->orWhere('id', is_numeric($identifier) ? $identifier : 0)
            ->with(['hospital', 'department'])
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $doctor,
        ]);
    }
}
