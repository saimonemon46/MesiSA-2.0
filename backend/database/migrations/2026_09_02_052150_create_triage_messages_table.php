<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('triage_messages', function (Blueprint ) {
            ->id();
            ->foreignId('triage_session_id')->constrained('triage_sessions')->onDelete('cascade');
            ->string('sender_role');
            ->text('message');
            ->float('red_flag_score')->nullable();
            ->json('structured_data')->nullable();
            ->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('triage_messages');
    }
};
