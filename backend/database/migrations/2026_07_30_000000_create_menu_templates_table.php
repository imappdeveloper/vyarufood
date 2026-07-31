<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('menu_templates', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('template_name');
            $table->text('description')->nullable();
            $table->unsignedBigInteger('kitchen_id')->default(1);
            $table->boolean('is_default')->default(false);
            $table->string('status', 20)->default('active');
            $table->timestamps();

            $table->foreign('kitchen_id')->references('id')->on('kitchens')->cascadeOnDelete();
            $table->index('kitchen_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('menu_templates');
    }
};
