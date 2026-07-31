<?php

declare(strict_types=1);

namespace App\Models\Master;

use App\Traits\HasUuid;
use App\Traits\HasAuditFields;
use App\Traits\Filterable;
use App\Enums\StatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    use HasFactory, HasUuid, HasAuditFields, Filterable, SoftDeletes;

    protected $fillable = [
        'uuid', 'iso2', 'iso3', 'numeric_code', 'phone_code', 'name',
        'native_name', 'capital', 'currency_code', 'currency_symbol',
        'currency_name', 'emoji', 'emoji_unicode', 'latitude', 'longitude',
        'region', 'subregion', 'nationality', 'flag_image', 'status',
        'sort_order', 'is_default', 'remarks', 'created_by', 'updated_by', 'deleted_by',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'float',
            'longitude' => 'float',
            'sort_order' => 'integer',
            'is_default' => 'boolean',
            'status' => StatusEnum::class,
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    public function scopeActive($query)
    {
        return $query->where('status', StatusEnum::Active);
    }

    public function scopeSearch($query, ?string $search)
    {
        if (! $search) {
            return $query;
        }

        return $query->where(function ($q) use ($search) {
            $q->where('name', 'LIKE', "%{$search}%")
              ->orWhere('iso2', 'LIKE', "%{$search}%")
              ->orWhere('iso3', 'LIKE', "%{$search}%")
              ->orWhere('phone_code', 'LIKE', "%{$search}%")
              ->orWhere('capital', 'LIKE', "%{$search}%")
              ->orWhere('currency_code', 'LIKE', "%{$search}%");
        });
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
