<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_refunds', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->string('refund_number', 50)->unique();
            $table->unsignedBigInteger('payment_transaction_id');
            $table->unsignedBigInteger('customer_id');
            $table->decimal('refund_amount', 14, 2);
            $table->text('refund_reason')->nullable();
            $table->string('gateway_refund_id', 255)->nullable();
            $table->string('status', 20)->default('pending');
            $table->unsignedBigInteger('processed_by')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();

            $table->index('payment_transaction_id');
            $table->index('customer_id');
            $table->index('status');
            $table->foreign('payment_transaction_id')->references('id')->on('payment_transactions');
            $table->foreign('customer_id')->references('id')->on('customers');
            $table->foreign('processed_by')->references('id')->on('admins')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_refunds');
    }
};
