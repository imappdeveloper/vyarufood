<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('order_id')->constrained('orders');
            $table->foreignId('meal_id')->nullable()->constrained('meals');
            $table->string('meal_name');
            $table->foreignId('meal_category_id')->nullable()->constrained('meal_categories');
            $table->foreignId('meal_type_id')->nullable()->constrained('meal_types');
            $table->integer('quantity')->default(1);
            $table->decimal('unit_price', 12, 2)->default(0);
            $table->decimal('tax', 12, 2)->default(0);
            $table->decimal('discount', 12, 2)->default(0);
            $table->decimal('total', 12, 2)->default(0);
            $table->text('remarks')->nullable();
            $table->timestamps();

            $table->index('order_id');
            $table->index('meal_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
