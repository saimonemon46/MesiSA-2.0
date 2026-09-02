<?php

namespace App\Http\Middleware;

use App\Services\Audit\AuditService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuditMiddleware
{
    public function __construct(protected AuditService $auditService)
    {
    }

    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE'], true)) {
            $user = $request->user();
            if ($user) {
                $action = $request->route() ? $request->route()->getName() : ($request->method() . ' ' . $request->path());
                $this->auditService->log(
                    userId: $user->id,
                    action: $action ?? ($request->method() . ' ' . $request->path()),
                    entityType: null,
                    entityId: null,
                    diffPayload: [
                        'method' => $request->method(),
                        'path' => $request->path(),
                        'payload' => $request->except(['password', 'password_confirmation', 'token']),
                        'status_code' => $response->getStatusCode(),
                    ],
                    ipAddress: $request->ip(),
                    userAgent: $request->userAgent()
                );
            }
        }

        return $response;
    }
}
