<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('journal_entries', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->string('journal_number', 50)->unique();
            $table->date('journal_date');
            $table->unsignedBigInteger('financial_year_id');
            $table->string('reference_type', 100)->nullable();
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->text('description');
            $table->decimal('total_debit', 14, 2)->default(0);
            $table->decimal('total_credit', 14, 2)->default(0);
            $table->string('posting_status', 20)->default('draft');
            $table->unsignedBigInteger('posted_by')->nullable();
            $table->timestamp('posted_at')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();

            $table->foreign('financial_year_id')->references('id')->on('financial_years')->restrictOnDelete();
            $table->foreign('posted_by')->references('id')->on('admins')->nullOnDelete();
            $table->foreign('created_by')->references('id')->on('admins')->nullOnDelete();
            $table->foreign('updated_by')->references('id')->on('admins')->nullOnDelete();
            $table->index('journal_date');
            $table->index('financial_year_id');
            $table->index(['reference_type', 'reference_id']);
            $table->index('posting_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('journal_entries');
    }
};
