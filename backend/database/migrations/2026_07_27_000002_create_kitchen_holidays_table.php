<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kitchen_holidays', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->unsignedBigInteger('kitchen_id')->nullable();
            $table->string('holiday_name', 255);
            $table->enum('holiday_type', ['weekly_off', 'public_holiday', 'festival', 'maintenance', 'emergency', 'custom']);
            $table->date('start_date');
            $table->date('end_date');
            $table->text('reason')->nullable();
            $table->string('status')->default('active');
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();

            $table->foreign('kitchen_id')->references('id')->on('kitchens')->nullOnDelete();
            $table->index('kitchen_id');
            $table->index('holiday_type');
            $table->index('status');
            $table->index('start_date');
            $table->index('end_date');
            $table->index(['kitchen_id', 'start_date', 'end_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kitchen_holidays');
    }
};
