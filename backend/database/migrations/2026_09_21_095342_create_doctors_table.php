<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('doctors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hospital_id')->constrained('hospitals')->cascadeOnDelete();
            $table->foreignId('department_id')->constrained('departments')->cascadeOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('title')->default('MD'); // e.g. MD, PhD, FACS, MBBS
            $table->string('sub_specialty')->nullable(); // Focused clinical interest
            $table->string('qualifications')->nullable();
            $table->unsignedTinyInteger('experience_years')->default(5);
            $table->decimal('consultation_fee', 8, 2)->default(100.00);
            $table->string('availability')->default('Mon - Fri');
            $table->decimal('rating', 3, 2)->default(4.80);
            $table->unsignedInteger('review_count')->default(25);
            $table->text('bio')->nullable();
            $table->boolean('is_accepting_new_patients')->default(true);
            $table->timestamps();

            // High-traffic composite indexes for filter queries
            $table->index(['hospital_id', 'department_id']);
            $table->index('slug');
            $table->index('is_accepting_new_patients');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doctors');
    }
};
