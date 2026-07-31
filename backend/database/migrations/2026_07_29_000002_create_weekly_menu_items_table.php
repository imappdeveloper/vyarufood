<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('weekly_menu_items', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->unsignedBigInteger('weekly_menu_id');
            $table->date('menu_date');
            $table->unsignedBigInteger('meal_category_id');
            $table->unsignedBigInteger('meal_id');
            $table->unsignedBigInteger('meal_type_id')->nullable();
            $table->unsignedInteger('display_order')->default(0);
            $table->unsignedInteger('meal_limit')->default(0);
            $table->unsignedInteger('remaining_quantity')->default(0);
            $table->boolean('is_default')->default(false);
            $table->boolean('is_optional')->default(false);
            $table->boolean('is_recommended')->default(false);
            $table->boolean('is_active')->default(true);
            $table->string('status', 20)->default('active');
            $table->timestamps();

            $table->foreign('weekly_menu_id')->references('id')->on('weekly_menus')->cascadeOnDelete();
            $table->foreign('meal_category_id')->references('id')->on('meal_categories')->cascadeOnDelete();
            $table->foreign('meal_id')->references('id')->on('meals')->cascadeOnDelete();
            $table->foreign('meal_type_id')->references('id')->on('meal_types')->nullOnDelete();
            $table->index('weekly_menu_id');
            $table->index('menu_date');
            $table->index('meal_category_id');
            $table->unique(['weekly_menu_id', 'menu_date', 'meal_category_id', 'display_order'], 'wmi_menu_date_cat_order_uniq');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('weekly_menu_items');
    }
};
