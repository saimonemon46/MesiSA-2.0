<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('patient_profiles', function (Blueprint ) {
            ->id();
            ->foreignId('user_id')->constrained('users')->onDelete('cascade')->unique();
            ->date('date_of_birth')->nullable();
            ->string('gender')->nullable();
            ->string('blood_group')->nullable();
            ->json('allergies')->nullable();
            ->json('chronic_conditions')->nullable();
            ->string('emergency_contact_name')->nullable();
            ->string('emergency_contact_phone')->nullable();
            ->string('emergency_contact_relation')->nullable();
            ->text('address')->nullable();
            ->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patient_profiles');
    }
};
