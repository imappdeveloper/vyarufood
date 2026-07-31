<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\{Model, Relations\BelongsTo};

class OrderItem extends Model
{
    use HasUuid;

    protected $table = 'order_items';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $fillable = [
        'uuid', 'order_id', 'meal_id', 'meal_name', 'meal_category_id',
        'meal_type_id', 'quantity', 'unit_price', 'tax', 'discount', 'total', 'remarks',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer', 'unit_price' => 'decimal:2',
            'tax' => 'decimal:2', 'discount' => 'decimal:2', 'total' => 'decimal:2',
        ];
    }

    public function order(): BelongsTo { return $this->belongsTo(Order::class); }
    public function meal(): BelongsTo { return $this->belongsTo(Meal::class); }
    public function mealCategory(): BelongsTo { return $this->belongsTo(MealCategory::class); }
    public function mealType(): BelongsTo { return $this->belongsTo(MealType::class); }
}
