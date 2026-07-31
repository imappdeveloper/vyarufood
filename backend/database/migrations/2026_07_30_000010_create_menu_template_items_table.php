<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('menu_template_items', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->unsignedBigInteger('menu_template_id');
            $table->string('day_name', 20);
            $table->unsignedBigInteger('meal_category_id');
            $table->unsignedBigInteger('meal_id');
            $table->unsignedBigInteger('meal_type_id')->nullable();
            $table->unsignedInteger('display_order')->default(0);
            $table->timestamps();

            $table->foreign('menu_template_id')->references('id')->on('menu_templates')->cascadeOnDelete();
            $table->foreign('meal_category_id')->references('id')->on('meal_categories')->cascadeOnDelete();
            $table->foreign('meal_id')->references('id')->on('meals')->cascadeOnDelete();
            $table->foreign('meal_type_id')->references('id')->on('meal_types')->nullOnDelete();
            $table->index('menu_template_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('menu_template_items');
    }
};
