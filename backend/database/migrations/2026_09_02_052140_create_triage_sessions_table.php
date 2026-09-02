<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('triage_sessions', function (Blueprint ) {
            ->id();
            ->foreignId('patient_id')->constrained('users')->onDelete('cascade');
            ->string('session_token')->unique();
            ->string('thread_id')->nullable()->index();
            ->string('status')->default('in_progress');
            ->string('risk_level')->default('pending');
            ->boolean('red_flag_detected')->default(false);
            ->json('red_flag_details')->nullable();
            ->boolean('contradiction_detected')->default(false);
            ->text('ai_summary')->nullable();
            ->text('recommended_action')->nullable();
            ->json('metadata')->nullable();
            ->timestamp('completed_at')->nullable();
            ->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('triage_sessions');
    }
};
