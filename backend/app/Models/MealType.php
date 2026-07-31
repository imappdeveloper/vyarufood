<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use App\Traits\HasAuditFields;
use App\Traits\Filterable;
use App\Enums\StatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class MealType extends Model
{
    use HasFactory, HasUuid, HasAuditFields, Filterable, SoftDeletes;

    protected $fillable = [
        'uuid', 'type_code', 'name', 'slug', 'description',
        'display_order', 'icon', 'image', 'color_code',
        'status', 'is_default', 'remarks',
        'created_by', 'updated_by', 'deleted_by',
    ];

    protected function casts(): array
    {
        return [
            'display_order' => 'integer',
            'is_default' => 'boolean',
            'status' => StatusEnum::class,
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    public function getStatusLabelAttribute(): string
    {
        return $this->status instanceof StatusEnum ? $this->status->label() : ucfirst($this->status ?? '');
    }

    public function scopeActive($query)
    {
        return $query->where('status', StatusEnum::Active);
    }

    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }

    public function scopeSearch($query, ?string $search)
    {
        if (! $search) {
            return $query;
        }

        return $query->where(function ($q) use ($search) {
            $q->where('name', 'LIKE', "%{$search}%")
              ->orWhere('type_code', 'LIKE', "%{$search}%")
              ->orWhere('slug', 'LIKE', "%{$search}%");
        });
    }

    public function meals()
    {
        return $this->hasMany(\App\Models\Meal::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(\App\Models\Auth\Admin::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(\App\Models\Auth\Admin::class, 'updated_by');
    }
}
