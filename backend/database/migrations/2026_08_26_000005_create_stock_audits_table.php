<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_audits', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('audit_number', 50)->unique();
            $table->date('audit_date');
            $table->foreignId('inventory_item_id')->constrained('inventory_items')->cascadeOnDelete();
            $table->decimal('system_quantity', 12, 2);
            $table->decimal('physical_quantity', 12, 2);
            $table->decimal('difference_quantity', 12, 2);
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('remarks')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->timestamps();

            $table->index(['inventory_item_id', 'status']);
            $table->index('audit_number');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_audits');
    }
};
