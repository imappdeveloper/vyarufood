<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recipes', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('recipe_code', 50)->unique();
            $table->foreignId('meal_id')->constrained('meals')->cascadeOnDelete();
            $table->string('recipe_name', 200);
            $table->integer('version')->default(1);
            $table->decimal('yield_quantity', 10, 2)->default(1);
            $table->string('yield_unit', 50);
            $table->integer('preparation_time')->nullable()->default(0);
            $table->integer('cooking_time')->nullable()->default(0);
            $table->integer('serving_size')->default(1);
            $table->decimal('recipe_cost', 12, 2)->default(0);
            $table->decimal('food_cost_percentage', 5, 2)->default(0);
            $table->enum('status', ['draft', 'active', 'inactive', 'archived'])->default('draft');
            $table->text('remarks')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
            $table->index('meal_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recipes');
    }
};
