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

class SubscriptionPlan extends Model
{
    use HasUuid, SoftDeletes;

    protected $table = 'subscription_plans';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $fillable = [
        'uuid', 'plan_code', 'plan_name', 'slug', 'description',
        'plan_type', 'billing_cycle', 'duration_days',
        'meal_category_id', 'kitchen_id', 'display_order',
        'price', 'offer_price', 'security_deposit', 'tax_percentage',
        'delivery_charge', 'joining_fee', 'minimum_order_amount',
        'maximum_skip_days', 'maximum_pause_days', 'maximum_active_subscriptions',
        'meal_selection_enabled', 'custom_meal_selection', 'default_meal_assignment',
        'carry_forward_skipped_meals', 'weekend_delivery', 'holiday_delivery',
        'allow_upgrade', 'allow_downgrade', 'allow_pause', 'allow_resume',
        'allow_skip', 'allow_cancel', 'auto_renew', 'renewal_discount',
        'trial_days', 'is_popular', 'is_recommended',
        'status', 'starts_at', 'ends_at', 'remarks',
        'created_by', 'updated_by', 'deleted_by',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'offer_price' => 'decimal:2',
            'security_deposit' => 'decimal:2',
            'tax_percentage' => 'decimal:2',
            'delivery_charge' => 'decimal:2',
            'joining_fee' => 'decimal:2',
            'minimum_order_amount' => 'decimal:2',
            'renewal_discount' => 'decimal:2',
            'duration_days' => 'integer',
            'maximum_skip_days' => 'integer',
            'maximum_pause_days' => 'integer',
            'maximum_active_subscriptions' => 'integer',
            'display_order' => 'integer',
            'trial_days' => 'integer',
            'meal_selection_enabled' => 'boolean',
            'custom_meal_selection' => 'boolean',
            'default_meal_assignment' => 'boolean',
            'carry_forward_skipped_meals' => 'boolean',
            'weekend_delivery' => 'boolean',
            'holiday_delivery' => 'boolean',
            'allow_upgrade' => 'boolean',
            'allow_downgrade' => 'boolean',
            'allow_pause' => 'boolean',
            'allow_resume' => 'boolean',
            'allow_skip' => 'boolean',
            'allow_cancel' => 'boolean',
            'auto_renew' => 'boolean',
            'is_popular' => 'boolean',
            'is_recommended' => 'boolean',
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    protected function isPublished(): Attribute
    {
        return Attribute::get(fn () => $this->status === 'active');
    }

    protected function effectivePrice(): Attribute
    {
        return Attribute::get(fn () => $this->offer_price > 0 && $this->offer_price < $this->price
            ? $this->offer_price
            : $this->price
        );
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopePopular($query)
    {
        return $query->where('is_popular', true);
    }

    public function scopeRecommended($query)
    {
        return $query->where('is_recommended', true);
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('plan_type', $type);
    }

    public function scopeByBillingCycle($query, string $cycle)
    {
        return $query->where('billing_cycle', $cycle);
    }

    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function mealCategory(): BelongsTo
    {
        return $this->belongsTo(MealCategory::class, 'meal_category_id');
    }

    public function kitchen(): BelongsTo
    {
        return $this->belongsTo(Kitchen::class, 'kitchen_id');
    }

    public function planMeals(): HasMany
    {
        return $this->hasMany(SubscriptionPlanMeal::class, 'subscription_plan_id');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Auth\Admin::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Auth\Admin::class, 'updated_by');
    }

    public function deletedBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Auth\Admin::class, 'deleted_by');
    }
}
