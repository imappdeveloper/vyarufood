<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('expense_approvals', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->unsignedBigInteger('expense_id');
            $table->integer('approval_level')->default(1);
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->string('approval_status', 30)->default('pending');
            $table->timestamp('approval_date')->nullable();
            $table->text('remarks')->nullable();
            $table->timestamp('created_at')->nullable();

            $table->foreign('expense_id')->references('id')->on('expenses')->cascadeOnDelete();
            $table->index(['expense_id', 'approval_status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expense_approvals');
    }
};
