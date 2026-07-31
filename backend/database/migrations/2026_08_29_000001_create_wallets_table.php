<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wallets', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->unsignedBigInteger('customer_id');
            $table->string('wallet_number', 50)->unique();
            $table->decimal('current_balance', 14, 2)->default(0);
            $table->decimal('blocked_balance', 14, 2)->default(0);
            $table->decimal('total_credit', 14, 2)->default(0);
            $table->decimal('total_debit', 14, 2)->default(0);
            $table->string('status', 20)->default('active');
            $table->timestamps();

            $table->index('customer_id');
            $table->index('status');
            $table->foreign('customer_id')->references('id')->on('customers');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wallets');
    }
};
