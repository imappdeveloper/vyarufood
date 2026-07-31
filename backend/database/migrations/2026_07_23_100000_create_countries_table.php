<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('countries', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('iso2', 2)->unique();
            $table->string('iso3', 3)->unique();
            $table->string('numeric_code', 10)->nullable();
            $table->string('phone_code', 10)->nullable();
            $table->string('name')->unique();
            $table->string('native_name')->nullable();
            $table->string('capital')->nullable();
            $table->string('currency_code', 10)->nullable();
            $table->string('currency_symbol', 10)->nullable();
            $table->string('currency_name')->nullable();
            $table->string('emoji')->nullable();
            $table->string('emoji_unicode')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('region')->nullable();
            $table->string('subregion')->nullable();
            $table->string('nationality')->nullable();
            $table->string('flag_image')->nullable();
            $table->string('status', 20)->default('active');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_default')->default(false);
            $table->text('remarks')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('name');
            $table->index('status');
            $table->index('is_default');
            $table->index('sort_order');
            $table->index('region');
            $table->index('subregion');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('countries');
    }
};
