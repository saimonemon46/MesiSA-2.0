<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medications', function (Blueprint ) {
            ->id();
            ->foreignId('patient_id')->constrained('users')->onDelete('cascade');
            ->foreignId('document_id')->nullable()->constrained('medical_documents')->nullOnDelete();
            ->string('name');
            ->string('generic_name')->nullable();
            ->string('dosage');
            ->string('frequency');
            ->string('route')->default('oral');
            ->date('start_date')->nullable();
            ->date('end_date')->nullable();
            ->string('status')->default('active');
            ->string('prescribed_by')->nullable();
            ->text('notes')->nullable();
            ->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medications');
    }
};
