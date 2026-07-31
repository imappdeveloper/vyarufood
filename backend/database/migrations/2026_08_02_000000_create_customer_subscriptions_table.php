<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customer_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('subscription_number')->unique();
            $table->unsignedBigInteger('customer_id');
            $table->unsignedBigInteger('subscription_plan_id');
            $table->unsignedBigInteger('kitchen_id')->nullable();
            $table->date('start_date');
            $table->date('end_date');
            $table->date('activation_date')->nullable();
            $table->string('billing_cycle', 30)->default('monthly');
            $table->unsignedBigInteger('meal_category_id')->nullable();
            $table->string('subscription_status', 30)->default('pending');
            $table->string('payment_status', 30)->default('pending');
            $table->decimal('wallet_adjustment', 12, 2)->default(0);
            $table->integer('remaining_meals')->default(0);
            $table->integer('consumed_meals')->default(0);
            $table->integer('skipped_meals')->default(0);
            $table->integer('paused_days')->default(0);
            $table->date('pause_start')->nullable();
            $table->date('pause_end')->nullable();
            $table->date('next_delivery_date')->nullable();
            $table->boolean('auto_renew')->default(false);
            $table->date('renewal_date')->nullable();
            $table->date('cancellation_date')->nullable();
            $table->string('cancellation_reason')->nullable();
            $table->decimal('refund_amount', 12, 2)->default(0);
            $table->text('remarks')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('customer_id')->references('id')->on('customers')->cascadeOnDelete();
            $table->foreign('subscription_plan_id')->references('id')->on('subscription_plans')->cascadeOnDelete();
            $table->foreign('kitchen_id')->references('id')->on('kitchens')->nullOnDelete();
            $table->foreign('meal_category_id')->references('id')->on('meal_categories')->nullOnDelete();
            $table->foreign('created_by')->references('id')->on('admins')->nullOnDelete();
            $table->foreign('updated_by')->references('id')->on('admins')->nullOnDelete();
            $table->foreign('deleted_by')->references('id')->on('admins')->nullOnDelete();
            $table->index('customer_id');
            $table->index('subscription_plan_id');
            $table->index('subscription_status');
            $table->index('payment_status');
            $table->index('next_delivery_date');
            $table->index(['customer_id', 'subscription_status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customer_subscriptions');
    }
};
