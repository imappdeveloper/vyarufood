<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('meal_packing_lists', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('production_batch_id')->constrained()->cascadeOnDelete();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->foreignId('meal_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('quantity')->default(1);
            $table->enum('packing_status', ['pending', 'packed', 'verified', 'loaded'])->default('pending');
            $table->datetime('packed_at')->nullable();
            $table->unsignedBigInteger('packed_by')->nullable();
            $table->timestamps();

            $table->index('production_batch_id');
            $table->index('order_id');
            $table->index('customer_id');
            $table->index('packing_status');
            $table->index(['production_batch_id', 'packing_status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meal_packing_lists');
    }
};
