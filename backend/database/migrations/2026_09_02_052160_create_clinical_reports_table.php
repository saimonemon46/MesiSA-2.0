<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clinical_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('triage_session_id')->nullable()->constrained('triage_sessions')->nullOnDelete();
            $table->foreignId('patient_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('doctor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('report_number')->unique();
            $table->text('summary');
            $table->text('clinical_assessment');
            $table->text('recommendations');
            $table->json('vitals_snapshot')->nullable();
            $table->string('risk_level');
            $table->boolean('is_overridden')->default(false);
            $table->text('override_reason')->nullable();
            $table->foreignId('override_by_doctor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('override_at')->nullable();
            $table->timestamp('finalized_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clinical_reports');
    }
};
