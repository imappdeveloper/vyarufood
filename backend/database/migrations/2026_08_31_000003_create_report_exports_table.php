<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('report_exports', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->nullable()->index();
            $table->string('report_name');
            $table->enum('export_format', ['pdf', 'excel', 'csv']);
            $table->string('file_path')->nullable();
            $table->unsignedBigInteger('generated_by')->nullable();
            $table->timestamp('generated_at')->nullable();
            $table->timestamps();

            $table->index('export_format');
            $table->index('generated_by');
            $table->index('generated_at');
            $table->index(['export_format', 'generated_by']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('report_exports');
    }
};
