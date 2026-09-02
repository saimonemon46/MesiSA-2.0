<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medical_documents', function (Blueprint ) {
            ->id();
            ->foreignId('patient_id')->constrained('users')->onDelete('cascade');
            ->string('title');
            ->string('document_type');
            ->string('file_path');
            ->unsignedBigInteger('file_size')->nullable();
            ->string('mime_type')->nullable();
            ->string('ocr_status')->default('pending');
            ->float('ocr_confidence')->nullable();
            ->json('extracted_data')->nullable();
            ->boolean('is_verified')->default(false);
            ->foreignId('verified_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            ->timestamp('verified_at')->nullable();
            ->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medical_documents');
    }
};
