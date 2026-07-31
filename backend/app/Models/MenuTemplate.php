<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\{
    Model,
    Relations\BelongsTo,
    Relations\HasMany,
    SoftDeletes
};

class MenuTemplate extends Model
{
    use HasUuid, SoftDeletes;

    protected $table = 'menu_templates';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $fillable = [
        'uuid', 'template_name', 'description', 'kitchen_id', 'is_default', 'status',
    ];

    protected function casts(): array
    {
        return [
            'is_default' => 'boolean',
        ];
    }

    public function kitchen(): BelongsTo
    {
        return $this->belongsTo(Kitchen::class, 'kitchen_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(MenuTemplateItem::class, 'menu_template_id');
    }

    public function monthlyMenus(): HasMany
    {
        return $this->hasMany(MonthlyMenu::class, 'menu_template_id');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
