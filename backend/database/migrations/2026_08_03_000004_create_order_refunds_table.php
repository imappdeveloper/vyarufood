<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_refunds', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('order_id')->constrained('orders');
            $table->string('refund_number')->unique();
            $table->decimal('refund_amount', 12, 2)->default(0);
            $table->string('refund_method')->default('wallet');
            $table->string('refund_status')->default('pending');
            $table->text('refund_reason')->nullable();
            $table->foreignId('processed_by')->nullable()->constrained('admins');
            $table->timestamp('processed_at')->nullable();
            $table->text('remarks')->nullable();
            $table->timestamps();

            $table->index('order_id');
            $table->index('refund_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_refunds');
    }
};
