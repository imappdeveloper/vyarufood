<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customer_addresses', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('customer_id')->constrained('customers')->cascadeOnDelete();
            $table->unsignedBigInteger('country_id')->nullable();
            $table->unsignedBigInteger('state_id')->nullable();
            $table->unsignedBigInteger('city_id')->nullable();
            $table->unsignedBigInteger('area_id')->nullable();
            $table->unsignedBigInteger('delivery_zone_id')->nullable();
            $table->unsignedBigInteger('pincode_id')->nullable();
            $table->enum('address_type', ['home', 'office', 'hostel', 'apartment', 'pg', 'other'])->default('home');
            $table->string('house_no', 50)->nullable();
            $table->string('building_name')->nullable();
            $table->string('floor', 20)->nullable();
            $table->string('street')->nullable();
            $table->string('landmark')->nullable();
            $table->text('address_line_1')->nullable();
            $table->text('address_line_2')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('google_place_id')->nullable();
            $table->string('contact_person', 100)->nullable();
            $table->string('contact_mobile', 20)->nullable();
            $table->text('delivery_instruction')->nullable();
            $table->boolean('is_default')->default(false);
            $table->boolean('is_verified')->default(false);
            $table->string('status', 20)->default('active');
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
            $table->foreign('pincode_id')->references('id')->on('pincodes')->nullOnDelete();
            $table->index('customer_id');
            $table->index('address_type');
            $table->index('status');
            $table->index('is_default');
            $table->index('is_verified');
            $table->index('country_id');
            $table->index('state_id');
            $table->index('city_id');
            $table->index('area_id');
            $table->index('delivery_zone_id');
            $table->index('pincode_id');
            $table->index(['customer_id', 'is_default']);
            $table->index(['customer_id', 'status']);
            $table->index(['city_id', 'status']);
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customer_addresses');
    }
};
