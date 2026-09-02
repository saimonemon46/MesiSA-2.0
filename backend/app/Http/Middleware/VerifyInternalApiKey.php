<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyInternalApiKey
{
    public function handle(Request $request, Closure $next): Response
    {
        $internalSecret = config('services.internal_ai.secret', env('INTERNAL_AI_SECRET', 'medisa-internal-ai-secret-key'));
        $providedKey = $request->header('X-Internal-Secret') ?? $request->bearerToken();

        if (!$providedKey || !hash_equals($internalSecret, $providedKey)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized internal service request.'
            ], 401);
        }

        return $next($request);
    }
}
