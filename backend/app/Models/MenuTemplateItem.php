<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\{
    Model,
    Relations\BelongsTo,
    SoftDeletes
};

class MenuTemplateItem extends Model
{
    use HasUuid, SoftDeletes;

    protected $table = 'menu_template_items';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $fillable = [
        'uuid', 'menu_template_id', 'day_name', 'meal_category_id',
        'meal_id', 'meal_type_id', 'display_order',
    ];

    protected function casts(): array
    {
        return [
            'display_order' => 'integer',
        ];
    }

    public function menuTemplate(): BelongsTo
    {
        return $this->belongsTo(MenuTemplate::class, 'menu_template_id');
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
}
