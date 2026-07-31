<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('production_schedules', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->unsignedBigInteger('kitchen_id')->nullable();
            $table->date('production_date');
            $table->enum('meal_type', ['breakfast', 'lunch', 'dinner', 'healthy_meal', 'snack']);
            $table->unsignedInteger('planned_quantity')->default(0);
            $table->unsignedInteger('produced_quantity')->default(0);
            $table->unsignedInteger('remaining_quantity')->default(0);
            $table->dateTime('production_start')->nullable();
            $table->dateTime('production_end')->nullable();
            $table->enum('status', ['planned', 'in_progress', 'completed', 'cancelled'])->default('planned');
            $table->text('remarks')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();

            $table->foreign('kitchen_id')->references('id')->on('kitchens')->nullOnDelete();
            $table->unique(['kitchen_id', 'production_date', 'meal_type']);
            $table->index('kitchen_id');
            $table->index('production_date');
            $table->index('meal_type');
            $table->index('status');
            $table->index(['kitchen_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('production_schedules');
    }
};
