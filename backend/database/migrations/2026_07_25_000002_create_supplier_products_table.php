<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('supplier_products', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->unsignedBigInteger('supplier_id');
            $table->unsignedBigInteger('inventory_item_id');
            $table->string('supplier_product_code', 50)->nullable();
            $table->string('supplier_product_name', 200)->nullable();
            $table->decimal('purchase_price', 12, 2)->default(0);
            $table->decimal('minimum_order_quantity', 12, 2)->default(1);
            $table->decimal('maximum_order_quantity', 12, 2)->nullable();
            $table->integer('lead_time_days')->default(0);
            $table->unsignedBigInteger('unit_id')->nullable();
            $table->boolean('is_primary_supplier')->default(false);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();

            $table->foreign('supplier_id')->references('id')->on('suppliers')->cascadeOnDelete();
            $table->index('supplier_id');
            $table->index('inventory_item_id');
            $table->index('is_primary_supplier');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('supplier_products');
    }
};
