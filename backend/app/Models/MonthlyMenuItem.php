<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\{
    Model,
    Relations\BelongsTo,
    SoftDeletes
};
use Illuminate\Database\Eloquent\Casts\Attribute;

class MonthlyMenuItem extends Model
{
    use HasUuid, SoftDeletes;

    protected $table = 'monthly_menu_items';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $fillable = [
        'uuid', 'monthly_menu_id', 'menu_date', 'day_name',
        'meal_category_id', 'meal_id', 'meal_type_id',
        'display_order', 'meal_limit', 'remaining_quantity',
        'is_default', 'is_optional', 'is_special', 'is_festival', 'status',
    ];

    protected function casts(): array
    {
        return [
            'menu_date' => 'date',
            'display_order' => 'integer',
            'meal_limit' => 'integer',
            'remaining_quantity' => 'integer',
            'is_default' => 'boolean',
            'is_optional' => 'boolean',
            'is_special' => 'boolean',
            'is_festival' => 'boolean',
        ];
    }

    public function monthlyMenu(): BelongsTo
    {
        return $this->belongsTo(MonthlyMenu::class, 'monthly_menu_id');
    }

    public function mealCategory(): BelongsTo
    {
        return $this->belongsTo(MealCategory::class, 'meal_category_id');
    }

    public function meal(): BelongsTo
    {
        return $this->belongsTo(Meal::class, 'meal_id');
    }

    public function mealType(): BelongsTo
    {
        return $this->belongsTo(MealType::class, 'meal_type_id');
    }

    protected function mealCategoryName(): Attribute
    {
        return Attribute::get(fn () => $this->mealCategory?->name);
    }

    protected function mealName(): Attribute
    {
        return Attribute::get(fn () => $this->meal?->name);
    }

    protected function mealTypeName(): Attribute
    {
        return Attribute::get(fn () => $this->mealType?->name);
    }
}
