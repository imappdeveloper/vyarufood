<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\{Model, Relations\BelongsTo};

class ProductionBatchItem extends Model
{
    use HasUuid;

    protected $table = 'production_batch_items';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $fillable = [
        'uuid', 'production_batch_id', 'meal_id', 'meal_category_id', 'meal_type_id',
        'planned_quantity', 'prepared_quantity', 'packed_quantity', 'wastage_quantity',
        'remaining_quantity', 'status', 'remarks',
    ];

    protected function casts(): array
    {
        return [
            'planned_quantity' => 'integer',
            'prepared_quantity' => 'integer',
            'packed_quantity' => 'integer',
            'wastage_quantity' => 'integer',
            'remaining_quantity' => 'integer',
        ];
    }

    public function batch(): BelongsTo { return $this->belongsTo(ProductionBatch::class, 'production_batch_id'); }
    public function meal(): BelongsTo { return $this->belongsTo(Meal::class); }
    public function mealCategory(): BelongsTo { return $this->belongsTo(MealCategory::class); }
    public function mealType(): BelongsTo { return $this->belongsTo(MealType::class); }
}
