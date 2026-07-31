<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscription_pause_history', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->unsignedBigInteger('customer_subscription_id');
            $table->string('action', 30);
            $table->date('pause_start')->nullable();
            $table->date('pause_end')->nullable();
            $table->integer('pause_days')->default(0);
            $table->date('new_end_date')->nullable();
            $table->text('reason')->nullable();
            $table->string('status', 30)->default('approved');
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->text('remarks')->nullable();
            $table->timestamps();

            $table->foreign('customer_subscription_id')->references('id')->on('customer_subscriptions')->cascadeOnDelete();
            $table->foreign('approved_by')->references('id')->on('admins')->nullOnDelete();
            $table->index('customer_subscription_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscription_pause_history');
    }
};
