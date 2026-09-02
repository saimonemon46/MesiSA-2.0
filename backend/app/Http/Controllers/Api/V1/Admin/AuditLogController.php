<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = AuditLog::with('user');

        if ($request->has('action')) {
            $action = $request->query('action');
            $query->where('action', 'like', "%{$action}%");
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->query('user_id'));
        }

        return response()->json([
            'success' => true,
            'data' => $query->latest('created_at')->paginate(50),
        ]);
    }
}
