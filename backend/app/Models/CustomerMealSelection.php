<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\{
    Model,
    Relations\BelongsTo
};
use Illuminate\Database\Eloquent\Casts\Attribute;

class CustomerMealSelection extends Model
{
    use HasUuid;

    protected $table = 'customer_meal_selections';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $fillable = [
        'uuid', 'customer_id', 'subscription_id',
        'weekly_menu_item_id', 'weekly_menu_id',
        'menu_date', 'meal_id', 'meal_category_id',
        'selection_status', 'selected_at', 'remarks',
    ];

    protected function casts(): array
    {
        return [
            'menu_date' => 'date',
            'selected_at' => 'datetime',
        ];
    }

    public static function boot(): void
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->selected_at)) {
                $model->selected_at = now();
            }
        });
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function subscription(): BelongsTo
    {
        return $this->belongsTo(Subscription::class, 'subscription_id');
    }

    public function weeklyMenuItem(): BelongsTo
    {
        return $this->belongsTo(WeeklyMenuItem::class, 'weekly_menu_item_id');
    }

    public function weeklyMenu(): BelongsTo
    {
        return $this->belongsTo(WeeklyMenu::class, 'weekly_menu_id');
    }

    public function meal(): BelongsTo
    {
        return $this->belongsTo(Meal::class, 'meal_id');
    }

    public function mealCategory(): BelongsTo
    {
        return $this->belongsTo(MealCategory::class, 'meal_category_id');
    }

    protected function selectionStatusLabel(): Attribute
    {
        return Attribute::get(fn () => ucfirst($this->selection_status));
    }

    public function scopeForCustomer($query, int $customerId)
    {
        return $query->where('customer_id', $customerId);
    }

    public function scopeForDate($query, string $date)
    {
        return $query->where('menu_date', $date);
    }

    public function scopeSelected($query)
    {
        return $query->where('selection_status', 'selected');
    }

    public function scopeDefault($query)
    {
        return $query->where('selection_status', 'default');
    }

    public function scopeSkipped($query)
    {
        return $query->where('selection_status', 'skipped');
    }

    public function scopeForWeek($query, string $weekStartDate)
    {
        return $query->whereHas('weeklyMenu', function ($q) use ($weekStartDate) {
            $q->where('week_start_date', $weekStartDate);
        });
    }
}
