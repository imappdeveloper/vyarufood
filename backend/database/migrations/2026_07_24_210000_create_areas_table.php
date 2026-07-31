<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('areas', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('country_id')->constrained('countries')->cascadeOnDelete();
            $table->foreignId('state_id')->constrained('states')->cascadeOnDelete();
            $table->foreignId('city_id')->constrained('cities')->cascadeOnDelete();
            $table->string('name');
            $table->string('area_code', 20)->unique();
            $table->string('postal_zone', 20)->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->decimal('delivery_radius', 5, 2)->nullable()->comment('Radius in km');
            $table->decimal('minimum_order_amount', 10, 2)->nullable()->default(0);
            $table->decimal('delivery_charge', 10, 2)->nullable()->default(0);
            $table->integer('estimated_delivery_time')->nullable()->comment('Minutes');
            $table->boolean('is_serviceable')->default(true);
            $table->boolean('is_default')->default(false);
            $table->integer('display_order')->default(0);
            $table->string('status', 20)->default('active');
            $table->text('remarks')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['city_id', 'name']);
            $table->index('name');
            $table->index('status');
            $table->index('is_default');
            $table->index('is_serviceable');
            $table->index('display_order');
            $table->index('area_code');
            $table->index('country_id');
            $table->index('state_id');
            $table->index('city_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('areas');
    }
};
