<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\{Model, Relations\BelongsTo};
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RecipeVersion extends Model
{
    use HasFactory, HasUuid;

    protected $table = 'recipe_versions';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $fillable = [
        'uuid', 'recipe_id', 'version', 'approved_by',
        'approved_at', 'change_notes',
    ];

    protected function casts(): array
    {
        return [
            'version' => 'integer',
            'approved_at' => 'datetime',
        ];
    }

    public function recipe(): BelongsTo
    {
        return $this->belongsTo(Recipe::class);
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Auth\Admin::class, 'approved_by');
    }
}
