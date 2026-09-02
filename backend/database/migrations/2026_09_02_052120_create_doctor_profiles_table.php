<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('doctor_profiles', function (Blueprint ) {
            ->id();
            ->foreignId('user_id')->constrained('users')->onDelete('cascade')->unique();
            ->foreignId('hospital_id')->nullable()->constrained('hospitals')->nullOnDelete();
            ->string('specialty');
            ->string('license_number')->unique();
            ->text('bio')->nullable();
            ->integer('experience_years')->default(0);
            ->decimal('consultation_fee', 10, 2)->default(0.00);
            ->boolean('is_verified')->default(false);
            ->text('verification_notes')->nullable();
            ->timestamp('verified_at')->nullable();
            ->json('availability_schedule')->nullable();
            ->string('status')->default('pending');
            ->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('doctor_profiles');
    }
};
