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
        Schema::create('hospitals', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('code', 30)->unique(); // e.g. HOSP_A, HOSP_B
            $table->string('kb_source', 50)->unique(); // Partition identifier for Federated RAG (hospital_a, etc.)
            $table->string('tier')->default('Tertiary Referral'); // Academic, Specialty, Community
            $table->string('city');
            $table->string('address');
            $table->string('phone')->nullable();
            $table->string('emergency_phone')->nullable();
            $table->decimal('rating', 3, 2)->default(4.50);
            $table->unsignedInteger('total_beds')->default(250);
            $table->json('facilities')->nullable(); // JSON list of clinical facilities/equipment
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // Indexes for fast lookup by city, slug, and AI knowledge base source
            $table->index('slug');
            $table->index('kb_source');
            $table->index('city');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hospitals');
    }
};
