<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gst_transactions', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->string('reference_type', 100);
            $table->unsignedBigInteger('reference_id');
            $table->unsignedBigInteger('journal_entry_id')->nullable();
            $table->date('transaction_date');
            $table->string('gst_type', 20);
            $table->decimal('gst_rate', 5, 2)->default(0);
            $table->decimal('taxable_amount', 14, 2)->default(0);
            $table->decimal('cgst_amount', 14, 2)->default(0);
            $table->decimal('sgst_amount', 14, 2)->default(0);
            $table->decimal('igst_amount', 14, 2)->default(0);
            $table->decimal('cess_amount', 14, 2)->default(0);
            $table->decimal('total_tax', 14, 2)->default(0);
            $table->string('invoice_number', 100)->nullable();
            $table->date('invoice_date')->nullable();
            $table->string('supplier_gstin', 20)->nullable();
            $table->string('place_of_supply', 5)->nullable();
            $table->boolean('is_reconciled')->default(false);
            $table->timestamp('reconciled_at')->nullable();
            $table->string('status', 20)->default('active');
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();

            $table->foreign('journal_entry_id')->references('id')->on('journal_entries')->nullOnDelete();
            $table->foreign('created_by')->references('id')->on('admins')->nullOnDelete();
            $table->index(['reference_type', 'reference_id']);
            $table->index('journal_entry_id');
            $table->index('transaction_date');
            $table->index('gst_type');
            $table->index('gst_rate');
            $table->index('is_reconciled');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gst_transactions');
    }
};
