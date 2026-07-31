<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscription_skip_history', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->unsignedBigInteger('customer_subscription_id');
            $table->string('skip_type', 30);
            $table->date('skip_date');
            $table->unsignedBigInteger('meal_id')->nullable();
            $table->integer('meals_credited')->default(0);
            $table->decimal('credit_amount', 12, 2)->default(0);
            $table->text('reason')->nullable();
            $table->string('status', 30)->default('approved');
            $table->text('remarks')->nullable();
            $table->timestamps();

            $table->foreign('customer_subscription_id')->references('id')->on('customer_subscriptions')->cascadeOnDelete();
            $table->foreign('meal_id')->references('id')->on('meals')->nullOnDelete();
            $table->index('customer_subscription_id');
            $table->index('skip_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscription_skip_history');
    }
};
