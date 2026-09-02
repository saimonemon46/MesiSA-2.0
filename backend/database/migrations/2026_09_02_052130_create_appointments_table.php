<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint ) {
            ->id();
            ->foreignId('patient_id')->constrained('users')->onDelete('cascade');
            ->foreignId('doctor_id')->constrained('users')->onDelete('cascade');
            ->foreignId('hospital_id')->nullable()->constrained('hospitals')->nullOnDelete();
            ->dateTime('scheduled_at');
            ->string('status')->default('scheduled');
            ->string('type')->default('in_person');
            ->text('reason_for_visit')->nullable();
            ->text('clinical_notes')->nullable();
            ->text('cancellation_reason')->nullable();
            ->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
