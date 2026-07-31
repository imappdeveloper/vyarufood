<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kitchen_working_days', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->unsignedBigInteger('kitchen_id')->nullable();
            $table->enum('day_of_week', ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);
            $table->boolean('is_working')->default(true);
            $table->time('opening_time')->nullable();
            $table->time('closing_time')->nullable();
            $table->time('preparation_start_time')->nullable();
            $table->time('accept_order_start')->nullable();
            $table->time('accept_order_end')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();

            $table->foreign('kitchen_id')->references('id')->on('kitchens')->nullOnDelete();
            $table->unique(['kitchen_id', 'day_of_week']);
            $table->index('kitchen_id');
            $table->index('day_of_week');
            $table->index('is_working');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kitchen_working_days');
    }
};
