<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('weekly_menus', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->unsignedBigInteger('kitchen_id')->default(1);
            $table->string('title');
            $table->text('description')->nullable();
            $table->date('week_start_date');
            $table->date('week_end_date');
            $table->string('status', 20)->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->unsignedBigInteger('published_by')->nullable();
            $table->unsignedInteger('cut_off_hours')->default(12);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('kitchen_id')->references('id')->on('kitchens')->cascadeOnDelete();
            $table->foreign('published_by')->references('id')->on('admins')->nullOnDelete();
            $table->foreign('created_by')->references('id')->on('admins')->nullOnDelete();
            $table->foreign('updated_by')->references('id')->on('admins')->nullOnDelete();
            $table->foreign('deleted_by')->references('id')->on('admins')->nullOnDelete();
            $table->index('kitchen_id');
            $table->index('status');
            $table->index('week_start_date');
            $table->index('week_end_date');
            $table->unique(['kitchen_id', 'week_start_date', 'week_end_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('weekly_menus');
    }
};
