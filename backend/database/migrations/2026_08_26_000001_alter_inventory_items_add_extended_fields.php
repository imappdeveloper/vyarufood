<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('inventory_items', function (Blueprint $table) {
            $table->string('sku', 100)->nullable()->unique()->after('item_code');
            $table->string('barcode', 100)->nullable()->unique()->after('sku');
            $table->string('hsn_code', 20)->nullable()->after('barcode');
            $table->decimal('reserved_stock', 12, 2)->default(0)->after('current_stock');
            $table->decimal('available_stock', 12, 2)->default(0)->after('reserved_stock');
            $table->decimal('reorder_level', 12, 2)->default(0)->after('maximum_stock');
            $table->decimal('reorder_quantity', 12, 2)->default(0)->after('reorder_level');
            $table->decimal('average_cost', 12, 2)->default(0)->after('cost_price');
            $table->decimal('last_purchase_cost', 12, 2)->default(0)->after('average_cost');
            $table->string('stock_valuation_method', 20)->default('weighted_average')->after('last_purchase_cost');
            $table->boolean('expiry_tracking')->default(false)->after('stock_valuation_method');
            $table->boolean('batch_tracking')->default(false)->after('expiry_tracking');
            $table->boolean('serial_tracking')->default(false)->after('batch_tracking');
            $table->string('storage_location', 100)->nullable()->after('serial_tracking');
            $table->string('shelf_number', 20)->nullable()->after('storage_location');
            $table->string('rack_number', 20)->nullable()->after('shelf_number');
            $table->string('bin_number', 20)->nullable()->after('rack_number');
            $table->text('remarks')->nullable()->after('bin_number');
            $table->unsignedBigInteger('created_by')->nullable()->after('remarks');
            $table->unsignedBigInteger('updated_by')->nullable()->after('created_by');
            $table->unsignedBigInteger('deleted_by')->nullable()->after('updated_by');
        });

        try {
            Schema::table('inventory_items', function (Blueprint $table) {
                $table->renameColumn('name', 'item_name');
            });
        } catch (\Throwable $e) {
        }

        try {
            Schema::table('inventory_items', function (Blueprint $table) {
                $table->renameColumn('category', 'category_name');
            });
        } catch (\Throwable $e) {
        }
    }

    public function down(): void
    {
        Schema::table('inventory_items', function (Blueprint $table) {
            $table->dropColumn([
                'sku', 'barcode', 'hsn_code', 'reserved_stock', 'available_stock',
                'reorder_level', 'reorder_quantity', 'average_cost', 'last_purchase_cost',
                'stock_valuation_method', 'expiry_tracking', 'batch_tracking', 'serial_tracking',
                'storage_location', 'shelf_number', 'rack_number', 'bin_number',
                'remarks', 'created_by', 'updated_by', 'deleted_by',
            ]);
        });

        try {
            Schema::table('inventory_items', function (Blueprint $table) {
                $table->renameColumn('item_name', 'name');
                $table->renameColumn('category_name', 'category');
            });
        } catch (\Throwable $e) {
        }
    }
};
