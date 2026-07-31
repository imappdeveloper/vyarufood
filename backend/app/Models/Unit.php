<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\{Model, Relations\BelongsTo, Relations\HasMany, SoftDeletes};
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Unit extends Model
{
    use HasFactory, HasUuid, SoftDeletes;

    protected $table = 'units';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $fillable = [
        'uuid', 'name', 'symbol', 'type', 'base_unit_id',
        'conversion_factor', 'sort_order', 'status',
    ];

    protected function casts(): array
    {
        return [
            'conversion_factor' => 'float',
            'sort_order' => 'integer',
        ];
    }

    public function baseUnit(): BelongsTo
    {
        return $this->belongsTo(Unit::class, 'base_unit_id');
    }

    public function childUnits(): HasMany
    {
        return $this->hasMany(Unit::class, 'base_unit_id');
    }
}
