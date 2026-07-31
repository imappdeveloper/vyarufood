<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('delivery_zones', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('country_id')->constrained('countries')->cascadeOnDelete();
            $table->foreignId('state_id')->constrained('states')->cascadeOnDelete();
            $table->foreignId('city_id')->constrained('cities')->cascadeOnDelete();
            $table->foreignId('area_id')->nullable()->constrained('areas')->nullOnDelete();
            $table->string('zone_name');
            $table->string('zone_code', 20)->unique();
            $table->text('description')->nullable();
            $table->decimal('delivery_radius', 5, 2)->nullable()->comment('Radius in km');
            $table->decimal('minimum_order_amount', 10, 2)->default(0);
            $table->decimal('delivery_charge', 10, 2)->default(0);
            $table->decimal('free_delivery_above', 10, 2)->nullable()->comment('Free delivery above this amount');
            $table->integer('estimated_delivery_time')->nullable()->comment('Minutes');
            $table->integer('maximum_orders_per_slot')->nullable();
            $table->integer('priority')->default(0);
            $table->string('status', 20)->default('active');
            $table->boolean('is_default')->default(false);
            $table->text('remarks')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['city_id', 'zone_name']);
            $table->index('zone_name');
            $table->index('zone_code');
            $table->index('status');
            $table->index('is_default');
            $table->index('priority');
            $table->index('country_id');
            $table->index('state_id');
            $table->index('city_id');
            $table->index('area_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('delivery_zones');
    }
};
