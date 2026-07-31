<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('monthly_menus', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->unsignedInteger('month');
            $table->unsignedInteger('year');
            $table->unsignedBigInteger('kitchen_id')->default(1);
            $table->string('title');
            $table->text('description')->nullable();
            $table->unsignedBigInteger('menu_template_id')->nullable();
            $table->string('status', 20)->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->unsignedBigInteger('published_by')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('kitchen_id')->references('id')->on('kitchens')->cascadeOnDelete();
            $table->foreign('menu_template_id')->references('id')->on('menu_templates')->nullOnDelete();
            $table->foreign('published_by')->references('id')->on('admins')->nullOnDelete();
            $table->foreign('approved_by')->references('id')->on('admins')->nullOnDelete();
            $table->foreign('created_by')->references('id')->on('admins')->nullOnDelete();
            $table->foreign('updated_by')->references('id')->on('admins')->nullOnDelete();
            $table->foreign('deleted_by')->references('id')->on('admins')->nullOnDelete();
            $table->index('kitchen_id');
            $table->index('status');
            $table->index(['month', 'year']);
            $table->unique(['kitchen_id', 'month', 'year']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('monthly_menus');
    }
};
