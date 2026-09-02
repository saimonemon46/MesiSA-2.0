<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clinical_reports', function (Blueprint ) {
            ->id();
            ->foreignId('triage_session_id')->nullable()->constrained('triage_sessions')->nullOnDelete();
            ->foreignId('patient_id')->constrained('users')->onDelete('cascade');
            ->foreignId('doctor_id')->nullable()->constrained('users')->nullOnDelete();
            ->string('report_number')->unique();
            ->text('summary');
            ->text('clinical_assessment');
            ->text('recommendations');
            ->json('vitals_snapshot')->nullable();
            ->string('risk_level');
            ->boolean('is_overridden')->default(false);
            ->text('override_reason')->nullable();
            ->foreignId('override_by_doctor_id')->nullable()->constrained('users')->nullOnDelete();
            ->timestamp('override_at')->nullable();
            ->timestamp('finalized_at')->nullable();
            ->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clinical_reports');
    }
};
