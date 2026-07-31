<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscription_renew_history', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->unsignedBigInteger('customer_subscription_id');
            $table->unsignedBigInteger('from_plan_id');
            $table->unsignedBigInteger('to_plan_id');
            $table->date('old_end_date');
            $table->date('new_end_date');
            $table->integer('old_remaining_meals')->default(0);
            $table->integer('new_remaining_meals')->default(0);
            $table->decimal('renewal_amount', 12, 2)->default(0);
            $table->decimal('discount_amount', 12, 2)->default(0);
            $table->decimal('final_amount', 12, 2)->default(0);
            $table->string('renewal_type', 30)->default('manual');
            $table->text('reason')->nullable();
            $table->text('remarks')->nullable();
            $table->timestamps();

            $table->foreign('customer_subscription_id')->references('id')->on('customer_subscriptions')->cascadeOnDelete();
            $table->foreign('from_plan_id')->references('id')->on('subscription_plans')->cascadeOnDelete();
            $table->foreign('to_plan_id')->references('id')->on('subscription_plans')->cascadeOnDelete();
            $table->index('customer_subscription_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscription_renew_history');
    }
};
