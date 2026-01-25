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
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('user_role')->nullable();
            $table->string('user_name')->nullable();
            $table->string('session_id')->nullable();

            $table->string('action');
            $table->string('resource_type');
            $table->string('resource_id')->nullable();
            $table->json('before')->nullable();
            $table->json('after')->nullable();

            $table->string('ip_address')->nullable();
            $table->string('user_agent');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
