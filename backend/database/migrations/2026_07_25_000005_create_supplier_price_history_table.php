<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('supplier_price_history', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->unsignedBigInteger('supplier_id');
            $table->unsignedBigInteger('inventory_item_id');
            $table->decimal('old_price', 12, 2)->default(0);
            $table->decimal('new_price', 12, 2)->default(0);
            $table->date('effective_from');
            $table->text('remarks')->nullable();
            $table->timestamps();

            $table->foreign('supplier_id')->references('id')->on('suppliers')->cascadeOnDelete();
            $table->index('supplier_id');
            $table->index('inventory_item_id');
            $table->index('effective_from');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('supplier_price_history');
    }
};
