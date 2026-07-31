<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\{
    Model,
    Relations\BelongsTo,
    Relations\HasMany
};
use Illuminate\Database\Eloquent\Casts\Attribute;

class WeeklyMenuItem extends Model
{
    use HasUuid;

    protected $table = 'weekly_menu_items';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $fillable = [
        'uuid', 'weekly_menu_id', 'menu_date', 'meal_category_id', 'meal_id',
        'meal_type_id', 'display_order', 'meal_limit', 'remaining_quantity',
        'is_default', 'is_optional', 'is_recommended', 'is_active', 'status',
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
            'is_recommended' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function weeklyMenu(): BelongsTo
    {
        return $this->belongsTo(WeeklyMenu::class, 'weekly_menu_id');
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

    public function customerSelections(): HasMany
    {
        return $this->hasMany(CustomerMealSelection::class, 'weekly_menu_item_id');
    }

    protected function isAvailable(): Attribute
    {
        return Attribute::get(fn () => $this->is_active
            && ($this->meal_limit === 0 || $this->remaining_quantity > 0)
        );
    }

    protected function isFullyBooked(): Attribute
    {
        return Attribute::get(fn () => $this->meal_limit > 0 && $this->remaining_quantity <= 0);
    }

    protected function availableCount(): Attribute
    {
        return Attribute::get(fn () => $this->meal_limit === 0
            ? PHP_INT_MAX
            : (int) $this->remaining_quantity
        );
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where('status', 'active');
    }

    public function scopeForDate($query, string $date)
    {
        return $query->where('menu_date', $date);
    }

    public function scopeForCategory($query, int $categoryId)
    {
        return $query->where('meal_category_id', $categoryId);
    }

    public function scopeDefaults($query)
    {
        return $query->where('is_default', true);
    }

    public function scopeOptional($query)
    {
        return $query->where('is_optional', true);
    }
}
