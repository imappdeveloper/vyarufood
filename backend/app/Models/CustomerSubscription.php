<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\{
    Model,
    Relations\BelongsTo,
    Relations\HasMany,
    SoftDeletes
};
use Illuminate\Database\Eloquent\Casts\Attribute;

class CustomerSubscription extends Model
{
    use HasUuid, SoftDeletes;

    protected $table = 'customer_subscriptions';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $fillable = [
        'uuid', 'subscription_number', 'customer_id', 'subscription_plan_id',
        'kitchen_id', 'start_date', 'end_date', 'activation_date',
        'billing_cycle', 'meal_category_id', 'subscription_status', 'payment_status',
        'wallet_adjustment', 'remaining_meals', 'consumed_meals', 'skipped_meals',
        'paused_days', 'pause_start', 'pause_end', 'next_delivery_date', 'delivery_slot',
        'auto_renew', 'renewal_date', 'cancellation_date', 'cancellation_reason',
        'refund_amount', 'remarks', 'created_by', 'updated_by', 'deleted_by',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'activation_date' => 'date',
            'wallet_adjustment' => 'decimal:2',
            'remaining_meals' => 'integer',
            'consumed_meals' => 'integer',
            'skipped_meals' => 'integer',
            'paused_days' => 'integer',
            'pause_start' => 'date',
            'pause_end' => 'date',
            'next_delivery_date' => 'date',
            'delivery_slot' => 'string',
            'auto_renew' => 'boolean',
            'renewal_date' => 'date',
            'cancellation_date' => 'date',
            'refund_amount' => 'decimal:2',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    protected function isActive(): Attribute
    {
        return Attribute::get(fn () => $this->subscription_status === 'active');
    }

    protected function totalMeals(): Attribute
    {
        return Attribute::get(fn () => $this->remaining_meals + $this->consumed_meals + $this->skipped_meals);
    }

    protected function progressPercentage(): Attribute
    {
        $total = $this->total_meals;
        return Attribute::get(fn () => $total > 0 ? round(($this->consumed_meals / $total) * 100, 1) : 0);
    }

    protected function daysRemaining(): Attribute
    {
        return Attribute::get(fn () => max(0, now()->diffInDays($this->end_date, false)));
    }

    protected function subscriptionNumberDisplay(): Attribute
    {
        return Attribute::get(fn () => 'SUB-' . str_pad((string) $this->id, 6, '0', STR_PAD_LEFT));
    }

    public function scopeActive($query)
    {
        return $query->where('subscription_status', 'active');
    }

    public function scopeByStatus($query, string $status)
    {
        return $query->where('subscription_status', $status);
    }

    public function scopeByPaymentStatus($query, string $status)
    {
        return $query->where('payment_status', $status);
    }

    public function scopeByCustomer($query, int $customerId)
    {
        return $query->where('customer_id', $customerId);
    }

    public function scopePendingRenewal($query)
    {
        return $query->where('auto_renew', true)
            ->where('subscription_status', 'active')
            ->where('end_date', '<=', now()->addDays(3));
    }

    public function scopeExpiringSoon($query, int $days = 3)
    {
        return $query->where('subscription_status', 'active')
            ->where('end_date', '<=', now()->addDays($days))
            ->where('end_date', '>', now());
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function subscriptionPlan(): BelongsTo
    {
        return $this->belongsTo(SubscriptionPlan::class);
    }

    public function kitchen(): BelongsTo
    {
        return $this->belongsTo(Kitchen::class);
    }

    public function mealCategory(): BelongsTo
    {
        return $this->belongsTo(MealCategory::class);
    }

    public function pauseHistory(): HasMany
    {
        return $this->hasMany(SubscriptionPauseHistory::class, 'customer_subscription_id');
    }

    public function skipHistory(): HasMany
    {
        return $this->hasMany(SubscriptionSkipHistory::class, 'customer_subscription_id');
    }

    public function upgradeHistory(): HasMany
    {
        return $this->hasMany(SubscriptionUpgradeHistory::class, 'customer_subscription_id');
    }

    public function renewHistory(): HasMany
    {
        return $this->hasMany(SubscriptionRenewHistory::class, 'customer_subscription_id');
    }

    public function statusHistory(): HasMany
    {
        return $this->hasMany(SubscriptionStatusHistory::class, 'customer_subscription_id');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Auth\Admin::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Auth\Admin::class, 'updated_by');
    }
}
