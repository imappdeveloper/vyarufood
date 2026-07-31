<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->unsignedBigInteger('customer_id');
            $table->unsignedBigInteger('meal_id');
            $table->unsignedBigInteger('order_id')->nullable();
            $table->unsignedTinyInteger('rating');
            $table->text('title')->nullable();
            $table->text('comment')->nullable();
            $table->string('photo', 500)->nullable();
            $table->string('status', 20)->default('approved');
            $table->boolean('is_verified_purchase')->default(false);
            $table->text('admin_response')->nullable();
            $table->datetime('admin_responded_at')->nullable();
            $table->unsignedBigInteger('admin_responded_by')->nullable();
            $table->unsignedBigInteger('reviewed_by')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('customer_id')->references('id')->on('customers')->cascadeOnDelete();
            $table->foreign('meal_id')->references('id')->on('meals')->cascadeOnDelete();
            $table->foreign('order_id')->references('id')->on('orders')->nullOnDelete();

            $table->index('customer_id');
            $table->index('meal_id');
            $table->index('order_id');
            $table->index('rating');
            $table->index('status');
            $table->index('is_featured');
            $table->index('created_at');

            $table->unique(['customer_id', 'meal_id', 'order_id'], 'unique_review_per_order_meal');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
