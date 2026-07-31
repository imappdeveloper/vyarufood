<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\{
    Model,
    Relations\BelongsTo
};

class SubscriptionPlanMeal extends Model
{
    use HasUuid;

    protected $table = 'subscription_plan_meals';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $fillable = [
        'uuid', 'subscription_plan_id', 'meal_category_id',
        'meal_type_id', 'meal_id', 'day_of_week',
        'quantity', 'is_optional', 'is_default',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'is_optional' => 'boolean',
            'is_default' => 'boolean',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    public function subscriptionPlan(): BelongsTo
    {
        return $this->belongsTo(SubscriptionPlan::class, 'subscription_plan_id');
    }

    public function mealCategory(): BelongsTo
    {
        return $this->belongsTo(MealCategory::class, 'meal_category_id');
    }

    public function mealType(): BelongsTo
    {
        return $this->belongsTo(MealType::class, 'meal_type_id');
    }

    public function meal(): BelongsTo
    {
        return $this->belongsTo(Meal::class, 'meal_id');
    }
}
