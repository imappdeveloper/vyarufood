<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_transactions', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->string('transaction_number', 50)->unique();
            $table->string('gateway_name', 50);
            $table->string('gateway_transaction_id', 255)->nullable();
            $table->string('gateway_order_id', 255)->nullable();
            $table->unsignedBigInteger('customer_id');
            $table->unsignedBigInteger('order_id')->nullable();
            $table->unsignedBigInteger('subscription_id')->nullable();
            $table->string('payment_type', 50);
            $table->string('payment_method', 50);
            $table->decimal('amount', 14, 2);
            $table->string('currency', 3)->default('INR');
            $table->decimal('gateway_fee', 14, 2)->default(0);
            $table->decimal('tax_amount', 14, 2)->default(0);
            $table->string('status', 20)->default('pending');
            $table->timestamp('payment_date')->nullable();
            $table->text('failure_reason')->nullable();
            $table->boolean('webhook_verified')->default(false);
            $table->timestamps();

            $table->index('customer_id');
            $table->index('order_id');
            $table->index('subscription_id');
            $table->index('gateway_name');
            $table->index('status');
            $table->index('payment_type');
            $table->index('created_at');
            $table->foreign('customer_id')->references('id')->on('customers');
            $table->foreign('order_id')->references('id')->on('orders')->nullOnDelete();
            $table->foreign('subscription_id')->references('id')->on('customer_subscriptions')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_transactions');
    }
};
