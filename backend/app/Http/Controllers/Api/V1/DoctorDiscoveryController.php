<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\DoctorProfile;
use App\Models\Hospital;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DoctorDiscoveryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = DoctorProfile::with(['user', 'hospital'])
            ->where('is_verified', true)
            ->where('status', 'active');

        if ($request->has('specialty')) {
            $query->where('specialty', $request->query('specialty'));
        }

        if ($request->has('hospital_id')) {
            $query->where('hospital_id', $request->query('hospital_id'));
        }

        if ($request->has('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('specialty', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('hospital', function ($hq) use ($search) {
                      $hq->where('name', 'like', "%{$search}%")
                         ->orWhere('city', 'like', "%{$search}%");
                  });
            });
        }

        return response()->json([
            'success' => true,
            'data' => $query->paginate(15),
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $doctor = DoctorProfile::with(['user', 'hospital'])
            ->where('is_verified', true)
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $doctor,
        ]);
    }

    public function hospitals(Request $request): JsonResponse
    {
        $query = Hospital::withCount(['doctorProfiles' => function ($q) {
            $q->where('is_verified', true);
        }])->where('status', 'active');

        if ($request->has('city')) {
            $query->where('city', $request->query('city'));
        }

        if ($request->has('emergency')) {
            $query->where('emergency_services', true);
        }

        return response()->json([
            'success' => true,
            'data' => $query->get(),
        ]);
    }
}
