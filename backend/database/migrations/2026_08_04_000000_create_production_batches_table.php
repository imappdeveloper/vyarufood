<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('production_batches', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('batch_number', 50)->unique();
            $table->date('production_date');
            $table->foreignId('kitchen_id')->constrained()->cascadeOnDelete();
            $table->string('batch_name', 150);
            $table->enum('batch_type', ['regular', 'special', 'bulk', 'emergency'])->default('regular');
            $table->unsignedInteger('total_orders')->default(0);
            $table->unsignedInteger('total_meals')->default(0);
            $table->time('planned_start_time')->nullable();
            $table->time('planned_end_time')->nullable();
            $table->datetime('actual_start_time')->nullable();
            $table->datetime('actual_end_time')->nullable();
            $table->enum('production_status', [
                'draft', 'planned', 'cooking', 'prepared', 'packing', 'packed', 'completed', 'cancelled',
            ])->default('draft');
            $table->unsignedBigInteger('prepared_by')->nullable();
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->text('remarks')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('production_date');
            $table->index('production_status');
            $table->index(['kitchen_id', 'production_date']);
            $table->index(['production_status', 'production_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('production_batches');
    }
};
