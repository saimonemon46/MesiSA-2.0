<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hospitals', function (Blueprint ) {
            ->id();
            ->string('name');
            ->string('slug')->unique();
            ->text('address');
            ->string('city');
            ->string('state')->nullable();
            ->string('postal_code')->nullable();
            ->string('phone');
            ->string('email')->nullable();
            ->boolean('emergency_services')->default(true);
            ->string('emergency_hotline')->nullable();
            ->string('status')->default('active');
            ->json('meta')->nullable();
            ->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hospitals');
    }
};
