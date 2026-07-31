<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->string('expense_number', 50)->unique();
            $table->unsignedBigInteger('expense_category_id');
            $table->date('expense_date');
            $table->string('expense_title', 300);
            $table->text('expense_description')->nullable();
            $table->string('vendor_name', 200)->nullable();
            $table->unsignedBigInteger('supplier_id')->nullable();
            $table->decimal('amount', 14, 2)->default(0);
            $table->decimal('tax_amount', 14, 2)->default(0);
            $table->decimal('discount_amount', 14, 2)->default(0);
            $table->decimal('total_amount', 14, 2)->default(0);
            $table->string('payment_method', 30)->default('cash');
            $table->string('payment_account', 100)->nullable();
            $table->string('transaction_reference', 100)->nullable();
            $table->string('invoice_number', 100)->nullable();
            $table->date('invoice_date')->nullable();
            $table->string('bill_attachment', 500)->nullable();
            $table->boolean('is_recurring')->default(false);
            $table->string('recurring_frequency', 30)->nullable();
            $table->date('next_due_date')->nullable();
            $table->string('approval_status', 30)->default('draft');
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->string('expense_status', 30)->default('draft');
            $table->text('remarks')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('expense_category_id')->references('id')->on('expense_categories')->restrictOnDelete();
            $table->foreign('supplier_id')->references('id')->on('suppliers')->nullOnDelete();
            $table->index('expense_date');
            $table->index('approval_status');
            $table->index('expense_status');
            $table->index('payment_method');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};
