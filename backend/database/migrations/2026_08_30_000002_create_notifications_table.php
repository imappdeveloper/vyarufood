<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->nullable()->index();
            $table->string('notification_number')->unique();
            $table->string('recipient_type')->comment('Customer, Admin, etc.');
            $table->unsignedBigInteger('recipient_id');
            $table->unsignedBigInteger('template_id')->nullable();
            $table->string('event_name')->nullable()->comment('e.g. order.placed, payment.success');
            $table->enum('channel', ['push', 'email', 'sms', 'in_app', 'whatsapp']);
            $table->string('title');
            $table->text('message');
            $table->json('payload')->nullable();
            $table->enum('priority', ['low', 'normal', 'high', 'critical'])->default('normal');
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->enum('delivery_status', ['pending', 'queued', 'sent', 'delivered', 'read', 'failed', 'cancelled'])->default('pending');
            $table->timestamp('read_at')->nullable();
            $table->text('failure_reason')->nullable();
            $table->timestamps();

            $table->index(['recipient_type', 'recipient_id']);
            $table->index('event_name');
            $table->index('delivery_status');
            $table->index('channel');
            $table->index('priority');
            $table->index('scheduled_at');
            $table->index('created_at');
            $table->foreign('template_id')->references('id')->on('notification_templates')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
