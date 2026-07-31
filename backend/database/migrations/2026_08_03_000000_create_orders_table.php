<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('order_number')->unique();
            $table->string('order_type')->default('subscription');
            $table->foreignId('customer_id')->constrained('customers');
            $table->foreignId('subscription_id')->nullable()->constrained('customer_subscriptions');
            $table->foreignId('kitchen_id')->nullable()->constrained('kitchens');
            $table->foreignId('address_id')->nullable()->constrained('customer_addresses');
            $table->foreignId('delivery_zone_id')->nullable()->constrained('delivery_zones');
            $table->date('order_date');
            $table->date('delivery_date');
            $table->foreignId('meal_category_id')->nullable()->constrained('meal_categories');
            $table->foreignId('meal_type_id')->nullable()->constrained('meal_types');
            $table->foreignId('meal_id')->nullable()->constrained('meals');
            $table->integer('quantity')->default(1);
            $table->decimal('unit_price', 12, 2)->default(0);
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->decimal('discount_amount', 12, 2)->default(0);
            $table->decimal('coupon_amount', 12, 2)->default(0);
            $table->decimal('tax_amount', 12, 2)->default(0);
            $table->decimal('delivery_charge', 12, 2)->default(0);
            $table->decimal('total_amount', 12, 2)->default(0);
            $table->string('payment_status')->default('pending');
            $table->string('payment_method')->nullable();
            $table->string('order_status')->default('pending');
            $table->string('delivery_slot')->nullable();
            $table->text('delivery_instruction')->nullable();
            $table->decimal('wallet_amount', 12, 2)->default(0);
            $table->integer('reward_points_used')->default(0);
            $table->integer('reward_points_earned')->default(0);
            $table->text('notes')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->foreignId('cancelled_by')->nullable()->constrained('admins');
            $table->string('cancellation_reason')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('admins');
            $table->foreignId('updated_by')->nullable()->constrained('admins');
            $table->foreignId('deleted_by')->nullable()->constrained('admins');
            $table->timestamps();
            $table->softDeletes();

            $table->index('customer_id');
            $table->index('subscription_id');
            $table->index('kitchen_id');
            $table->index('order_date');
            $table->index('delivery_date');
            $table->index('order_status');
            $table->index('payment_status');
            $table->index('order_type');
            $table->index(['customer_id', 'order_status']);
            $table->index(['kitchen_id', 'order_date']);
            $table->index(['order_status', 'delivery_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
