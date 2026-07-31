<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kitchen_capacity', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->unsignedBigInteger('kitchen_id')->nullable();
            $table->date('capacity_date');
            $table->unsignedInteger('breakfast_capacity')->default(0);
            $table->unsignedInteger('lunch_capacity')->default(0);
            $table->unsignedInteger('dinner_capacity')->default(0);
            $table->unsignedInteger('healthy_meal_capacity')->default(0);
            $table->unsignedInteger('snack_capacity')->default(0);
            $table->unsignedInteger('maximum_orders')->default(0);
            $table->unsignedInteger('reserved_orders')->default(0);
            $table->unsignedInteger('available_orders')->default(0);
            $table->string('status')->default('active');
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();

            $table->foreign('kitchen_id')->references('id')->on('kitchens')->nullOnDelete();
            $table->unique(['kitchen_id', 'capacity_date']);
            $table->index('kitchen_id');
            $table->index('capacity_date');
            $table->index('status');
            $table->index(['kitchen_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kitchen_capacity');
    }
};
