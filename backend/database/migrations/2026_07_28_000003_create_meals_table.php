<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('meals', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('meal_code', 50)->unique();
            $table->unsignedBigInteger('category_id')->nullable();
            $table->unsignedBigInteger('meal_type_id')->nullable();
            $table->unsignedBigInteger('kitchen_id')->nullable();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->string('short_description', 500)->nullable();
            $table->text('description')->nullable();
            $table->text('ingredients')->nullable();
            $table->text('allergens')->nullable();
            $table->unsignedTinyInteger('spice_level')->default(0);
            $table->string('serving_size', 50)->nullable();
            $table->string('unit', 50)->nullable();
            $table->string('meal_image', 500)->nullable();
            $table->string('thumbnail', 500)->nullable();
            $table->json('gallery')->nullable();
            $table->string('barcode', 100)->nullable();
            $table->string('sku', 100)->nullable()->unique();
            $table->string('hsn_code', 20)->nullable();
            $table->unsignedInteger('preparation_time')->default(0);
            $table->decimal('calories', 8, 2)->default(0);
            $table->decimal('protein', 8, 2)->default(0);
            $table->decimal('carbohydrates', 8, 2)->default(0);
            $table->decimal('fat', 8, 2)->default(0);
            $table->decimal('fiber', 8, 2)->default(0);
            $table->decimal('sugar', 8, 2)->default(0);
            $table->decimal('sodium', 8, 2)->default(0);
            $table->decimal('price', 10, 2);
            $table->decimal('offer_price', 10, 2)->nullable();
            $table->decimal('cost_price', 10, 2)->nullable();
            $table->decimal('tax_percentage', 5, 2)->default(0);
            $table->integer('display_order')->default(0);
            $table->string('availability_type', 50)->default('all_day');
            $table->json('availability_slots')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_recommended')->default(false);
            $table->boolean('is_new')->default(false);
            $table->boolean('is_bestseller')->default(false);
            $table->boolean('is_customizable')->default(false);
            $table->boolean('requires_preparation')->default(true);
            $table->string('status', 20)->default('active');
            $table->text('remarks')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('category_id')->references('id')->on('meal_categories')->cascadeOnDelete();
            $table->foreign('meal_type_id')->references('id')->on('meal_types')->cascadeOnDelete();
            $table->foreign('kitchen_id')->references('id')->on('kitchens')->cascadeOnDelete();
            $table->index('category_id');
            $table->index('meal_type_id');
            $table->index('kitchen_id');
            $table->index('status');
            $table->index('is_featured');
            $table->index('is_recommended');
            $table->index('is_new');
            $table->index('is_bestseller');
            $table->index('price');
            $table->index('display_order');
            $table->index('availability_type');
            $table->index('barcode');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meals');
    }
};
