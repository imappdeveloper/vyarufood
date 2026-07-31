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

class Area extends Model
{
    use HasFactory, HasUuid, HasAuditFields, Filterable, SoftDeletes;

    protected $fillable = [
        'uuid', 'country_id', 'state_id', 'city_id', 'name', 'area_code', 'postal_zone',
        'latitude', 'longitude', 'delivery_radius', 'minimum_order_amount', 'delivery_charge',
        'estimated_delivery_time', 'is_serviceable', 'is_default', 'display_order',
        'status', 'remarks', 'created_by', 'updated_by', 'deleted_by',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'float',
            'longitude' => 'float',
            'delivery_radius' => 'float',
            'minimum_order_amount' => 'float',
            'delivery_charge' => 'float',
            'estimated_delivery_time' => 'integer',
            'display_order' => 'integer',
            'is_serviceable' => 'boolean',
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

    public function scopeServiceable($query)
    {
        return $query->where('is_serviceable', true);
    }

    public function scopeSearch($query, ?string $search)
    {
        if (! $search) {
            return $query;
        }

        return $query->where(function ($q) use ($search) {
            $q->where('name', 'LIKE', "%{$search}%")
              ->orWhere('area_code', 'LIKE', "%{$search}%")
              ->orWhere('postal_zone', 'LIKE', "%{$search}%");
        });
    }

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function state()
    {
        return $this->belongsTo(State::class);
    }

    public function city()
    {
        return $this->belongsTo(City::class);
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
