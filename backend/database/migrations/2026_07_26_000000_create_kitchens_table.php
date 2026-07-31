<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kitchens', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('kitchen_code', 50)->unique();
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->enum('kitchen_type', ['main_kitchen', 'central_kitchen', 'cloud_kitchen', 'branch_kitchen', 'future_kitchen'])->default('main_kitchen');
            $table->string('manager_name', 100)->nullable();
            $table->string('manager_mobile', 20)->nullable();
            $table->string('manager_email')->nullable();
            $table->unsignedBigInteger('country_id')->nullable();
            $table->unsignedBigInteger('state_id')->nullable();
            $table->unsignedBigInteger('city_id')->nullable();
            $table->unsignedBigInteger('area_id')->nullable();
            $table->unsignedBigInteger('delivery_zone_id')->nullable();
            $table->text('address_line_1')->nullable();
            $table->text('address_line_2')->nullable();
            $table->string('landmark')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->time('opening_time')->nullable();
            $table->time('closing_time')->nullable();
            $table->time('preparation_start_time')->nullable();
            $table->time('accept_order_start_time')->nullable();
            $table->time('accept_order_end_time')->nullable();
            $table->unsignedInteger('daily_capacity')->nullable();
            $table->unsignedInteger('maximum_orders')->nullable();
            $table->string('emergency_contact', 20)->nullable();
            $table->string('license_number', 100)->nullable();
            $table->string('fssai_number', 50)->nullable();
            $table->string('gst_number', 20)->nullable();
            $table->string('logo', 500)->nullable();
            $table->string('status', 20)->default('active');
            $table->boolean('is_default')->default(false);
            $table->text('remarks')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('country_id')->references('id')->on('countries')->nullOnDelete();
            $table->foreign('state_id')->references('id')->on('states')->nullOnDelete();
            $table->foreign('city_id')->references('id')->on('cities')->nullOnDelete();
            $table->foreign('area_id')->references('id')->on('areas')->nullOnDelete();
            $table->foreign('delivery_zone_id')->references('id')->on('delivery_zones')->nullOnDelete();
            $table->index('country_id');
            $table->index('state_id');
            $table->index('city_id');
            $table->index('area_id');
            $table->index('delivery_zone_id');
            $table->index('status');
            $table->index('is_default');
            $table->index('kitchen_type');
            $table->index('kitchen_code');
            $table->index('name');
            $table->index(['is_default', 'status']);
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kitchens');
    }
};
