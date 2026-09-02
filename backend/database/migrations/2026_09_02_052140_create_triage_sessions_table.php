<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('triage_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('users')->onDelete('cascade');
            $table->string('session_token')->unique();
            $table->string('thread_id')->nullable()->index();
            $table->string('status')->default('in_progress');
            $table->string('risk_level')->default('pending');
            $table->boolean('red_flag_detected')->default(false);
            $table->json('red_flag_details')->nullable();
            $table->boolean('contradiction_detected')->default(false);
            $table->text('ai_summary')->nullable();
            $table->text('recommended_action')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('triage_sessions');
    }
};
