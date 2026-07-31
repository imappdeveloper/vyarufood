<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\{Model, Relations\BelongsTo};
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RecipeItem extends Model
{
    use HasFactory, HasUuid;

    protected $table = 'recipe_items';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $fillable = [
        'uuid', 'recipe_id', 'inventory_item_id', 'unit_id',
        'required_quantity', 'wastage_percentage', 'actual_quantity',
        'cost', 'display_order', 'remarks',
    ];

    protected function casts(): array
    {
        return [
            'required_quantity' => 'float',
            'wastage_percentage' => 'float',
            'actual_quantity' => 'float',
            'cost' => 'float',
            'display_order' => 'integer',
        ];
    }

    public function recipe(): BelongsTo
    {
        return $this->belongsTo(Recipe::class);
    }

    public function inventoryItem(): BelongsTo
    {
        return $this->belongsTo(InventoryItem::class);
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }
}
