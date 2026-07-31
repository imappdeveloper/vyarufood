<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('purchase_requests', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('request_number', 50)->unique();
            $table->date('request_date');
            $table->enum('request_type', ['manual', 'auto_reorder', 'auto_forecast', 'auto_production'])->default('manual');
            $table->string('requested_by', 150)->nullable();
            $table->string('department', 100)->nullable();
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->enum('status', ['draft', 'pending_approval', 'approved', 'rejected', 'converted_to_po', 'cancelled'])->default('draft');
            $table->date('expected_date')->nullable();
            $table->text('remarks')->nullable();
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('approved_by')->references('id')->on('admins')->nullOnDelete();
            $table->foreign('created_by')->references('id')->on('admins')->nullOnDelete();
            $table->foreign('updated_by')->references('id')->on('admins')->nullOnDelete();
            $table->foreign('deleted_by')->references('id')->on('admins')->nullOnDelete();
            $table->index('status');
            $table->index('priority');
            $table->index('request_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('purchase_requests');
    }
};
