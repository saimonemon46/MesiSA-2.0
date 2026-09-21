<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\HospitalController;
use App\Http\Controllers\MedicalDocumentController;

Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'service' => 'medisa-backend',
        'version' => '1.0.0',
        'database_host' => config('database.connections.pgsql.host'),
        'ai_service_url' => env('AI_SERVICE_URL', 'http://medisa-ai:8000')
    ]);
});

// Healthcare Discovery Endpoints
Route::prefix('v1')->group(function () {
    // Hospitals
    Route::get('/hospitals', [HospitalController::class, 'index']);
    Route::get('/hospitals/{slug}', [HospitalController::class, 'show']);

    // Departments
    Route::get('/departments', [DepartmentController::class, 'index']);
    Route::get('/departments/{slug}', [DepartmentController::class, 'show']);

    // Doctors / Specialists
    Route::get('/doctors', [DoctorController::class, 'index']);
    Route::get('/doctors/{slug}', [DoctorController::class, 'show']);

    // Medical Knowledge Documents (Knowledge Bases)
    Route::get('/documents', [MedicalDocumentController::class, 'index']);
    Route::get('/documents/{code}', [MedicalDocumentController::class, 'show']);
});

// Backward compatibility alias without /v1 prefix
Route::get('/hospitals', [HospitalController::class, 'index']);
Route::get('/departments', [DepartmentController::class, 'index']);
Route::get('/doctors', [DoctorController::class, 'index']);
Route::get('/documents', [MedicalDocumentController::class, 'index']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

