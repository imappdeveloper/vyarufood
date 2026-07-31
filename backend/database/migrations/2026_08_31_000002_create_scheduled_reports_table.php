<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('scheduled_reports', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->nullable()->index();
            $table->string('report_name');
            $table->enum('report_type', ['executive', 'sales', 'revenue', 'order', 'subscription', 'customer', 'kitchen', 'meal', 'inventory', 'purchase', 'supplier', 'expense', 'finance', 'payment', 'gst', 'notification']);
            $table->enum('frequency', ['daily', 'weekly', 'monthly', 'quarterly', 'yearly']);
            $table->enum('export_format', ['pdf', 'excel', 'csv'])->default('pdf');
            $table->json('email_recipients')->nullable();
            $table->timestamp('next_run')->nullable();
            $table->enum('status', ['active', 'paused'])->default('active');
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();

            $table->index('report_type');
            $table->index('frequency');
            $table->index('status');
            $table->index('next_run');
            $table->index('created_by');
            $table->index(['status', 'next_run']);
            $table->index(['status', 'frequency']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scheduled_reports');
    }
};
