<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customer_meal_selections', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->unsignedBigInteger('customer_id');
            $table->unsignedBigInteger('subscription_id')->nullable();
            $table->unsignedBigInteger('weekly_menu_item_id');
            $table->unsignedBigInteger('weekly_menu_id');
            $table->date('menu_date');
            $table->unsignedBigInteger('meal_id');
            $table->unsignedBigInteger('meal_category_id');
            $table->string('selection_status', 20)->default('selected');
            $table->timestamp('selected_at')->nullable();
            $table->string('remarks', 255)->nullable();
            $table->timestamps();

            $table->foreign('customer_id')->references('id')->on('customers')->cascadeOnDelete();
            $table->foreign('weekly_menu_item_id')->references('id')->on('weekly_menu_items')->cascadeOnDelete();
            $table->foreign('weekly_menu_id')->references('id')->on('weekly_menus')->cascadeOnDelete();
            $table->foreign('meal_id')->references('id')->on('meals')->cascadeOnDelete();
            $table->foreign('meal_category_id')->references('id')->on('meal_categories')->cascadeOnDelete();
            $table->index('customer_id');
            $table->index('weekly_menu_item_id');
            $table->index('weekly_menu_id');
            $table->index('menu_date');
            $table->unique(['customer_id', 'menu_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customer_meal_selections');
    }
};
