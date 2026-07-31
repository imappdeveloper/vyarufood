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

class DeliveryZone extends Model
{
    use HasFactory, HasUuid, HasAuditFields, Filterable, SoftDeletes;

    protected $fillable = [
        'uuid', 'country_id', 'state_id', 'city_id', 'area_id', 'zone_name', 'zone_code',
        'description', 'delivery_radius', 'minimum_order_amount', 'delivery_charge',
        'free_delivery_above', 'estimated_delivery_time', 'maximum_orders_per_slot',
        'priority', 'status', 'is_default', 'remarks', 'created_by', 'updated_by', 'deleted_by',
    ];

    protected function casts(): array
    {
        return [
            'delivery_radius' => 'float',
            'minimum_order_amount' => 'float',
            'delivery_charge' => 'float',
            'free_delivery_above' => 'float',
            'estimated_delivery_time' => 'integer',
            'maximum_orders_per_slot' => 'integer',
            'priority' => 'integer',
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
        return $query->where('status', StatusEnum::Active);
    }

    public function scopeSearch($query, ?string $search)
    {
        if (! $search) {
            return $query;
        }

        return $query->where(function ($q) use ($search) {
            $q->where('zone_name', 'LIKE', "%{$search}%")
              ->orWhere('zone_code', 'LIKE', "%{$search}%")
              ->orWhere('description', 'LIKE', "%{$search}%");
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

    public function area()
    {
        return $this->belongsTo(Area::class);
    }

    public function pincodes()
    {
        return $this->hasMany(Pincode::class);
    }

    public function deliverySlots()
    {
        return $this->hasMany(DeliverySlot::class);
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
