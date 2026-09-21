<?php

namespace App\Http\Controllers;

use App\Models\Hospital;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HospitalController extends Controller
{
    /**
     * Display a listing of hospitals with doctor counts.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Hospital::query()->where('is_active', true);

        if ($request->filled('city')) {
            $query->where('city', 'ilike', '%' . $request->query('city') . '%');
        }

        if ($request->filled('tier')) {
            $query->where('tier', 'ilike', '%' . $request->query('tier') . '%');
        }

        $hospitals = $query->withCount('doctors')->get();

        return response()->json([
            'success' => true,
            'count' => $hospitals->count(),
            'data' => $hospitals,
        ]);
    }

    /**
     * Display the specified hospital with doctors and departments.
     */
    public function show(string $identifier): JsonResponse
    {
        $hospital = Hospital::where('slug', $identifier)
            ->orWhere('id', is_numeric($identifier) ? $identifier : 0)
            ->with(['doctors.department', 'medicalDocuments'])
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $hospital,
        ]);
    }
}
