<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscription_plans', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('plan_code', 50)->unique();
            $table->string('plan_name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('plan_type', 30)->default('monthly');
            $table->string('billing_cycle', 30)->default('monthly');
            $table->unsignedInteger('duration_days')->default(30);
            $table->unsignedBigInteger('meal_category_id');
            $table->unsignedBigInteger('kitchen_id')->default(1);
            $table->unsignedInteger('display_order')->default(0);
            $table->decimal('price', 10, 2)->default(0);
            $table->decimal('offer_price', 10, 2)->default(0);
            $table->decimal('security_deposit', 10, 2)->default(0);
            $table->decimal('tax_percentage', 5, 2)->default(0);
            $table->decimal('delivery_charge', 10, 2)->default(0);
            $table->decimal('joining_fee', 10, 2)->default(0);
            $table->decimal('minimum_order_amount', 10, 2)->default(0);
            $table->unsignedInteger('maximum_skip_days')->default(0);
            $table->unsignedInteger('maximum_pause_days')->default(0);
            $table->unsignedInteger('maximum_active_subscriptions')->default(1);
            $table->boolean('meal_selection_enabled')->default(false);
            $table->boolean('custom_meal_selection')->default(false);
            $table->boolean('default_meal_assignment')->default(true);
            $table->boolean('carry_forward_skipped_meals')->default(false);
            $table->boolean('weekend_delivery')->default(true);
            $table->boolean('holiday_delivery')->default(false);
            $table->boolean('allow_upgrade')->default(true);
            $table->boolean('allow_downgrade')->default(false);
            $table->boolean('allow_pause')->default(true);
            $table->boolean('allow_resume')->default(true);
            $table->boolean('allow_skip')->default(true);
            $table->boolean('allow_cancel')->default(true);
            $table->boolean('auto_renew')->default(false);
            $table->decimal('renewal_discount', 5, 2)->default(0);
            $table->unsignedInteger('trial_days')->default(0);
            $table->boolean('is_popular')->default(false);
            $table->boolean('is_recommended')->default(false);
            $table->string('status', 20)->default('active');
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->text('remarks')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('meal_category_id')->references('id')->on('meal_categories')->cascadeOnDelete();
            $table->foreign('kitchen_id')->references('id')->on('kitchens')->cascadeOnDelete();
            $table->foreign('created_by')->references('id')->on('admins')->nullOnDelete();
            $table->foreign('updated_by')->references('id')->on('admins')->nullOnDelete();
            $table->foreign('deleted_by')->references('id')->on('admins')->nullOnDelete();
            $table->index('plan_type');
            $table->index('billing_cycle');
            $table->index('status');
            $table->index('is_popular');
            $table->index('is_recommended');
            $table->index('meal_category_id');
            $table->index('kitchen_id');
            $table->index('display_order');
        });

        Schema::create('subscription_plan_meals', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->unsignedBigInteger('subscription_plan_id');
            $table->unsignedBigInteger('meal_category_id');
            $table->unsignedBigInteger('meal_type_id')->nullable();
            $table->unsignedBigInteger('meal_id');
            $table->string('day_of_week', 20)->nullable();
            $table->unsignedInteger('quantity')->default(1);
            $table->boolean('is_optional')->default(false);
            $table->boolean('is_default')->default(true);
            $table->timestamps();

            $table->foreign('subscription_plan_id')->references('id')->on('subscription_plans')->cascadeOnDelete();
            $table->foreign('meal_category_id')->references('id')->on('meal_categories')->cascadeOnDelete();
            $table->foreign('meal_type_id')->references('id')->on('meal_types')->nullOnDelete();
            $table->foreign('meal_id')->references('id')->on('meals')->cascadeOnDelete();
            $table->index('subscription_plan_id');
            $table->index('meal_category_id');
            $table->index('meal_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscription_plan_meals');
        Schema::dropIfExists('subscription_plans');
    }
};
