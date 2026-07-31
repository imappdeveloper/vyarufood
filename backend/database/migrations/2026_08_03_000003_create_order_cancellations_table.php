<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_cancellations', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('order_id')->constrained('orders');
            $table->string('cancellation_reason');
            $table->text('additional_notes')->nullable();
            $table->decimal('refund_amount', 12, 2)->default(0);
            $table->boolean('refund_processed')->default(false);
            $table->foreignId('cancelled_by')->nullable()->constrained('admins');
            $table->timestamps();

            $table->index('order_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_cancellations');
    }
};
