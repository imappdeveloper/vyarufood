<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notification_templates', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->nullable()->index();
            $table->string('template_code')->unique();
            $table->string('template_name');
            $table->enum('notification_type', ['transactional', 'marketing', 'system', 'reminder']);
            $table->enum('channel', ['push', 'email', 'sms', 'in_app', 'whatsapp']);
            $table->string('subject')->nullable();
            $table->string('title');
            $table->text('message');
            $table->json('variables')->nullable()->comment('Array of variable placeholders');
            $table->string('language')->default('en');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();

            $table->index('notification_type');
            $table->index('channel');
            $table->index('status');
            $table->foreign('created_by')->references('id')->on('admins')->nullOnDelete();
            $table->foreign('updated_by')->references('id')->on('admins')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notification_templates');
    }
};
