<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bank_accounts', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->string('account_name', 200);
            $table->string('bank_name', 200);
            $table->string('account_number', 50);
            $table->string('ifsc_code', 20)->nullable();
            $table->string('branch', 200)->nullable();
            $table->string('account_type', 30)->default('savings');
            $table->unsignedBigInteger('account_id')->nullable();
            $table->decimal('opening_balance', 14, 2)->default(0);
            $table->decimal('current_balance', 14, 2)->default(0);
            $table->boolean('is_default')->default(false);
            $table->string('status', 20)->default('active');
            $table->text('remarks')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('account_id')->references('id')->on('chart_of_accounts')->nullOnDelete();
            $table->foreign('created_by')->references('id')->on('admins')->nullOnDelete();
            $table->foreign('updated_by')->references('id')->on('admins')->nullOnDelete();
            $table->foreign('deleted_by')->references('id')->on('admins')->nullOnDelete();
            $table->index('account_name');
            $table->index('bank_name');
            $table->index('is_default');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bank_accounts');
    }
};
