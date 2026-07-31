<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscription_status_history', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->unsignedBigInteger('customer_subscription_id');
            $table->string('from_status', 30);
            $table->string('to_status', 30);
            $table->text('reason')->nullable();
            $table->unsignedBigInteger('changed_by')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->foreign('customer_subscription_id')->references('id')->on('customer_subscriptions')->cascadeOnDelete();
            $table->foreign('changed_by')->references('id')->on('admins')->nullOnDelete();
            $table->index('customer_subscription_id');
            $table->index('to_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscription_status_history');
    }
};
