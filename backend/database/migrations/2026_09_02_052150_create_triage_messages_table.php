<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('triage_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('triage_session_id')->constrained('triage_sessions')->onDelete('cascade');
            $table->string('sender_role');
            $table->text('message');
            $table->float('red_flag_score')->nullable();
            $table->json('structured_data')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('triage_messages');
    }
};
