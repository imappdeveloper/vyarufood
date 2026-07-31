<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('system_backups', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('backup_name', 255);
            $table->enum('backup_type', ['database', 'storage', 'full']);
            $table->string('file_path', 500);
            $table->unsignedBigInteger('file_size')->default(0);
            $table->enum('status', ['pending', 'in_progress', 'completed', 'failed']);
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->text('error_message')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();

            $table->index('backup_type');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('system_backups');
    }
};
