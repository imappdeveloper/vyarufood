<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('supplier_documents', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->unsignedBigInteger('supplier_id');
            $table->enum('document_type', ['gst_certificate', 'pan_card', 'fssai_license', 'drug_license', 'insurance', 'agreement', 'quality_certificate', 'other']);
            $table->string('document_name', 200);
            $table->string('document_path', 500);
            $table->date('expiry_date')->nullable();
            $table->enum('status', ['active', 'expired', 'revoked'])->default('active');
            $table->timestamps();

            $table->foreign('supplier_id')->references('id')->on('suppliers')->cascadeOnDelete();
            $table->index('supplier_id');
            $table->index('document_type');
            $table->index('expiry_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('supplier_documents');
    }
};
