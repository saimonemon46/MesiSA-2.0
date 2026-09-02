<?php

use App\Http\Controllers\Api\V1\Admin\AdminDashboardController;
use App\Http\Controllers\Api\V1\Admin\AuditLogController;
use App\Http\Controllers\Api\V1\Admin\DoctorManagementController;
use App\Http\Controllers\Api\V1\Admin\HospitalManagementController;
use App\Http\Controllers\Api\V1\Admin\SystemSettingsController;
use App\Http\Controllers\Api\V1\Admin\TriageSupervisionController;
use App\Http\Controllers\Api\V1\Admin\UserManagementController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\DoctorDiscoveryController;
use App\Http\Controllers\Api\V1\Doctor\ClinicalOverrideController;
use App\Http\Controllers\Api\V1\Doctor\DoctorPortalController;
use App\Http\Controllers\Api\V1\Internal\InternalAiToolController;
use App\Http\Controllers\Api\V1\Patient\AppointmentController;
use App\Http\Controllers\Api\V1\Patient\DashboardController;
use App\Http\Controllers\Api\V1\Patient\DocumentController;
use App\Http\Controllers\Api\V1\Patient\MedicationController;
use App\Http\Controllers\Api\V1\Patient\ReportController;
use App\Http\Controllers\Api\V1\Patient\TriageController;
use Illuminate\Support\Facades\Route;

// MediSA API v1
Route::prefix('v1')->group(function () {

    // Public Authentication
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
    });

    // Public Doctor & Hospital Discovery
    Route::get('/doctors', [DoctorDiscoveryController::class, 'index']);
    Route::get('/doctors/{id}', [DoctorDiscoveryController::class, 'show']);
    Route::get('/hospitals', [DoctorDiscoveryController::class, 'hospitals']);

    // Protected Routes (Sanctum Auth + Audit Trail)
    Route::middleware(['auth:sanctum', 'audit'])->group(function () {

        // Authenticated User
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        // Patient Domain (Rule 19)
        Route::prefix('patient')->middleware('role:patient')->group(function () {
            Route::get('/dashboard', [DashboardController::class, 'index']);
            
            // Symptom Check & Triage
            Route::post('/triage/start', [TriageController::class, 'start']);
            Route::get('/triage/{token}', [TriageController::class, 'show']);
            Route::post('/triage/{token}/messages', [TriageController::class, 'sendMessage']);

            // Reports & History
            Route::get('/reports', [ReportController::class, 'index']);
            Route::get('/reports/{id}', [ReportController::class, 'show']);

            // Documents & Prescriptions
            Route::get('/documents', [DocumentController::class, 'index']);
            Route::post('/documents', [DocumentController::class, 'store']);

            // Medications
            Route::get('/medications', [MedicationController::class, 'index']);

            // Appointments
            Route::get('/appointments', [AppointmentController::class, 'index']);
            Route::post('/appointments', [AppointmentController::class, 'store']);
            Route::post('/appointments/{id}/cancel', [AppointmentController::class, 'cancel']);
        });

        // Doctor & Nurse Domain (Rule 11 & 19)
        Route::prefix('doctor')->middleware('role:doctor,nurse')->group(function () {
            Route::get('/dashboard', [DoctorPortalController::class, 'dashboard']);
            Route::post('/clinical-reports/{id}/override', [ClinicalOverrideController::class, 'override'])
                ->middleware('role:doctor,super_admin');
        });

        // Admin Domain (Rule 10, 11, 19)
        Route::prefix('admin')->middleware('role:hospital_admin,super_admin')->group(function () {
            Route::get('/dashboard', [AdminDashboardController::class, 'index']);
            
            // Users
            Route::get('/users', [UserManagementController::class, 'index']);
            Route::patch('/users/{id}/status', [UserManagementController::class, 'updateStatus']);

            // Doctors
            Route::get('/doctors', [DoctorManagementController::class, 'index']);
            Route::patch('/doctors/{id}/verify', [DoctorManagementController::class, 'verify']);

            // Hospitals
            Route::get('/hospitals', [HospitalManagementController::class, 'index']);
            Route::post('/hospitals', [HospitalManagementController::class, 'store']);

            // Triage Supervision
            Route::get('/triage/live', [TriageSupervisionController::class, 'liveSessions']);
            Route::get('/triage/{id}', [TriageSupervisionController::class, 'sessionDetail']);

            // Audit Logs
            Route::get('/audit-logs', [AuditLogController::class, 'index']);

            // System Settings
            Route::get('/settings', [SystemSettingsController::class, 'index']);
            Route::post('/settings', [SystemSettingsController::class, 'update'])
                ->middleware('role:super_admin');
        });
    });

    // Controlled Internal AI Tools (Rules 5 & 6)
    Route::prefix('internal')->middleware('verify.internal.api')->group(function () {
        Route::get('/patient-context/{patientId}', [InternalAiToolController::class, 'getPatientContext']);
        Route::post('/triage/red-flag', [InternalAiToolController::class, 'handleRedFlag']);
        Route::post('/triage/complete', [InternalAiToolController::class, 'completeTriage']);
    });
});
