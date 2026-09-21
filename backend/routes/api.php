<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'service' => 'medisa-backend',
        'version' => '1.0.0',
        'database_host' => config('database.connections.pgsql.host'),
        'ai_service_url' => env('AI_SERVICE_URL', 'http://medisa-ai:8000')
    ]);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

