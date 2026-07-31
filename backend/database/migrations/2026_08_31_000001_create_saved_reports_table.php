<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('saved_reports', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->nullable()->index();
            $table->string('report_code')->unique();
            $table->string('report_name');
            $table->enum('report_type', ['executive', 'sales', 'revenue', 'order', 'subscription', 'customer', 'kitchen', 'meal', 'inventory', 'purchase', 'supplier', 'expense', 'finance', 'payment', 'gst', 'notification']);
            $table->json('filters')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->boolean('is_public')->default(false);
            $table->timestamps();

            $table->index('report_type');
            $table->index('created_by');
            $table->index('is_public');
            $table->index(['report_type', 'created_by']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('saved_reports');
    }
};
