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
        Schema::create('medical_documents', function (Blueprint $table) {
            $table->id();
            // Nullable because national guidelines apply across all hospitals
            $table->foreignId('hospital_id')->nullable()->constrained('hospitals')->nullOnDelete();
            $table->foreignId('department_id')->nullable()->constrained('departments')->nullOnDelete();
            
            // Knowledge base partition key for Federated RAG (FRAG)
            $table->string('kb_source', 50); // 'hospital_a', 'hospital_b', 'hospital_c', 'national_guidelines'
            $table->string('document_code', 50)->unique();
            $table->string('title');
            $table->string('condition_name');
            $table->text('clinical_summary');
            $table->longText('full_content');
            $table->string('evidence_level', 50)->default('Class I, Level A');
            $table->string('citation')->nullable();
            $table->json('keywords')->nullable(); // Target medical keywords for hybrid lexical + semantic search
            $table->timestamps();

            // Indexes for fast federated retrieval
            $table->index(['kb_source', 'department_id']);
            $table->index('condition_name');
            $table->index('document_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medical_documents');
    }
};
