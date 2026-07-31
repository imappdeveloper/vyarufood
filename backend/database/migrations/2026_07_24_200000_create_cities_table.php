<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cities', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('country_id')->constrained('countries')->cascadeOnDelete();
            $table->foreignId('state_id')->constrained('states')->cascadeOnDelete();
            $table->string('name');
            $table->string('city_code', 20)->unique();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('timezone', 50)->nullable();
            $table->unsignedBigInteger('population')->nullable();
            $table->string('pincode', 20)->nullable();
            $table->decimal('area', 12, 2)->nullable();
            $table->integer('display_order')->default(0);
            $table->boolean('is_metro')->default(false);
            $table->string('status', 20)->default('active');
            $table->boolean('is_default')->default(false);
            $table->text('remarks')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['state_id', 'name']);
            $table->index('name');
            $table->index('status');
            $table->index('is_default');
            $table->index('is_metro');
            $table->index('display_order');
            $table->index('city_code');
            $table->index('country_id');
            $table->index('state_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cities');
    }
};
