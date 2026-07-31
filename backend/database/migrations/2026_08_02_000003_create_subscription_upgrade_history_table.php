<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscription_upgrade_history', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->unsignedBigInteger('customer_subscription_id');
            $table->string('action', 30);
            $table->unsignedBigInteger('from_plan_id');
            $table->unsignedBigInteger('to_plan_id');
            $table->decimal('price_difference', 12, 2)->default(0);
            $table->integer('remaining_meals_before')->default(0);
            $table->integer('remaining_meals_after')->default(0);
            $table->text('reason')->nullable();
            $table->string('status', 30)->default('pending');
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->decimal('refund_amount', 12, 2)->default(0);
            $table->decimal('additional_charge', 12, 2)->default(0);
            $table->text('remarks')->nullable();
            $table->timestamps();

            $table->foreign('customer_subscription_id')->references('id')->on('customer_subscriptions')->cascadeOnDelete();
            $table->foreign('from_plan_id')->references('id')->on('subscription_plans')->cascadeOnDelete();
            $table->foreign('to_plan_id')->references('id')->on('subscription_plans')->cascadeOnDelete();
            $table->foreign('approved_by')->references('id')->on('admins')->nullOnDelete();
            $table->index('customer_subscription_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscription_upgrade_history');
    }
};
