<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint ) {
            ->id();
            ->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            ->string('action');
            ->string('entity_type')->nullable();
            ->unsignedBigInteger('entity_id')->nullable();
            ->string('ip_address', 45)->nullable();
            ->text('user_agent')->nullable();
            ->json('diff_payload')->nullable();
            ->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
