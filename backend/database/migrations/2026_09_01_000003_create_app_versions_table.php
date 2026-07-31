<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('app_versions', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->enum('platform', ['android', 'ios', 'web']);
            $table->string('version_name', 50);
            $table->integer('version_code');
            $table->string('minimum_supported_version', 50)->nullable();
            $table->boolean('force_update')->default(false);
            $table->text('release_notes')->nullable();
            $table->enum('status', ['active', 'inactive', 'deprecated'])->default('active');
            $table->timestamps();
            $table->softDeletes();

            $table->index('platform');
            $table->index('status');
            $table->unique(['platform', 'version_code']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('app_versions');
    }
};
