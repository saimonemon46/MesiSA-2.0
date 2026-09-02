<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('system_settings', function (Blueprint ) {
            ->id();
            ->string('key')->unique();
            ->text('value')->nullable();
            ->string('group')->default('general');
            ->boolean('is_secret')->default(false);
            ->string('description')->nullable();
            ->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('system_settings');
    }
};
