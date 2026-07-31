<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\{Model, Relations\BelongsTo};
use Illuminate\Database\Eloquent\Factories\HasFactory;

class InventoryConsumptionLog extends Model
{
    use HasFactory, HasUuid;

    protected $table = 'inventory_consumption_logs';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $fillable = [
        'uuid', 'production_batch_id', 'recipe_id', 'meal_id',
        'inventory_item_id', 'consumed_quantity', 'unit_cost',
        'total_cost', 'consumption_date',
    ];

    protected function casts(): array
    {
        return [
            'consumed_quantity' => 'float',
            'unit_cost' => 'float',
            'total_cost' => 'float',
            'consumption_date' => 'date',
        ];
    }

    public function productionBatch(): BelongsTo
    {
        return $this->belongsTo(ProductionBatch::class);
    }

    public function recipe(): BelongsTo
    {
        return $this->belongsTo(Recipe::class);
    }

    public function meal(): BelongsTo
    {
        return $this->belongsTo(Meal::class);
    }

    public function inventoryItem(): BelongsTo
    {
        return $this->belongsTo(InventoryItem::class);
    }
}
