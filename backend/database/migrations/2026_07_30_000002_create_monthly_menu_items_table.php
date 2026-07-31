<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('monthly_menu_items', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->unsignedBigInteger('monthly_menu_id');
            $table->date('menu_date');
            $table->string('day_name', 20);
            $table->unsignedBigInteger('meal_category_id');
            $table->unsignedBigInteger('meal_id');
            $table->unsignedBigInteger('meal_type_id')->nullable();
            $table->unsignedInteger('display_order')->default(0);
            $table->unsignedInteger('meal_limit')->default(50);
            $table->unsignedInteger('remaining_quantity')->default(50);
            $table->boolean('is_default')->default(false);
            $table->boolean('is_optional')->default(false);
            $table->boolean('is_special')->default(false);
            $table->boolean('is_festival')->default(false);
            $table->string('status', 20)->default('active');
            $table->timestamps();

            $table->foreign('monthly_menu_id')->references('id')->on('monthly_menus')->cascadeOnDelete();
            $table->foreign('meal_category_id')->references('id')->on('meal_categories')->cascadeOnDelete();
            $table->foreign('meal_id')->references('id')->on('meals')->cascadeOnDelete();
            $table->foreign('meal_type_id')->references('id')->on('meal_types')->nullOnDelete();
            $table->index('monthly_menu_id');
            $table->index('menu_date');
            $table->index('meal_category_id');
            $table->unique(['monthly_menu_id', 'menu_date', 'meal_category_id', 'display_order'], 'mmi_menu_date_cat_order_uniq');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('monthly_menu_items');
    }
};
