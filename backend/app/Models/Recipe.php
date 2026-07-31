<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\{Model, Relations\BelongsTo, Relations\HasMany, SoftDeletes};
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Recipe extends Model
{
    use HasFactory, HasUuid, SoftDeletes;

    protected $table = 'recipes';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $fillable = [
        'uuid', 'recipe_code', 'meal_id', 'recipe_name', 'version',
        'yield_quantity', 'yield_unit', 'preparation_time', 'cooking_time',
        'serving_size', 'recipe_cost', 'food_cost_percentage', 'status',
        'remarks', 'created_by', 'updated_by', 'deleted_by',
    ];

    protected function casts(): array
    {
        return [
            'yield_quantity' => 'float',
            'recipe_cost' => 'float',
            'food_cost_percentage' => 'float',
            'preparation_time' => 'integer',
            'cooking_time' => 'integer',
            'serving_size' => 'integer',
            'version' => 'integer',
        ];
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function meal(): BelongsTo
    {
        return $this->belongsTo(Meal::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(RecipeItem::class);
    }

    public function versions(): HasMany
    {
        return $this->hasMany(RecipeVersion::class);
    }

    public function consumptionLogs(): HasMany
    {
        return $this->hasMany(InventoryConsumptionLog::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Auth\Admin::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Auth\Admin::class, 'updated_by');
    }
}
