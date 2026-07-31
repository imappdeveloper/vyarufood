<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory_items', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('item_code', 50)->unique();
            $table->string('name', 150);
            $table->text('description')->nullable();
            $table->string('category', 100)->nullable();
            $table->foreignId('unit_id')->constrained('units')->cascadeOnDelete();
            $table->decimal('current_stock', 12, 2)->default(0);
            $table->decimal('minimum_stock', 12, 2)->default(0);
            $table->decimal('maximum_stock', 12, 2)->default(0);
            $table->decimal('cost_price', 12, 2)->default(0);
            $table->enum('status', ['active', 'inactive', 'low_stock'])->default('active');
            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
            $table->index('category');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_items');
    }
};
