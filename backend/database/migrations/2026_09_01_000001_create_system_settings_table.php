<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('system_settings', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('setting_group', 100);
            $table->string('setting_key', 150)->unique();
            $table->longText('setting_value')->nullable();
            $table->enum('data_type', ['string', 'integer', 'float', 'boolean', 'json', 'text'])->default('string');
            $table->boolean('is_encrypted')->default(false);
            $table->boolean('autoload')->default(true);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->string('remarks', 500)->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('setting_group');
            $table->index('autoload');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('system_settings');
    }
};
