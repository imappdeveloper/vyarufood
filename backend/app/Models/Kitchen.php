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

class Kitchen extends Model
{
    use HasFactory, HasUuid, HasAuditFields, Filterable, SoftDeletes;

    protected $fillable = [
        'uuid', 'kitchen_code', 'name', 'description', 'kitchen_type',
        'manager_name', 'manager_mobile', 'manager_email',
        'country_id', 'state_id', 'city_id', 'area_id', 'delivery_zone_id',
        'address_line_1', 'address_line_2', 'landmark',
        'latitude', 'longitude',
        'opening_time', 'closing_time', 'preparation_start_time',
        'accept_order_start_time', 'accept_order_end_time',
        'daily_capacity', 'maximum_orders',
        'emergency_contact', 'license_number', 'fssai_number', 'gst_number',
        'logo', 'status', 'is_default', 'remarks',
        'created_by', 'updated_by', 'deleted_by',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'float',
            'longitude' => 'float',
            'is_default' => 'boolean',
            'status' => StatusEnum::class,
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    public function getKitchenTypeLabelAttribute(): string
    {
        return ucfirst(str_replace('_', ' ', $this->kitchen_type));
    }

    public function getFullAddressAttribute(): string
    {
        $parts = array_filter([
            $this->address_line_1,
            $this->address_line_2,
            $this->landmark,
            $this->city?->name,
            $this->state?->name,
        ]);

        return implode(', ', $parts);
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
              ->orWhere('kitchen_code', 'LIKE', "%{$search}%")
              ->orWhere('manager_name', 'LIKE', "%{$search}%")
              ->orWhere('manager_mobile', 'LIKE', "%{$search}%")
              ->orWhere('manager_email', 'LIKE', "%{$search}%");
        });
    }

    public function country()
    {
        return $this->belongsTo(\App\Models\Master\Country::class);
    }

    public function state()
    {
        return $this->belongsTo(\App\Models\Master\State::class);
    }

    public function city()
    {
        return $this->belongsTo(\App\Models\Master\City::class);
    }

    public function area()
    {
        return $this->belongsTo(\App\Models\Master\Area::class);
    }

    public function deliveryZone()
    {
        return $this->belongsTo(\App\Models\Master\DeliveryZone::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(\App\Models\Auth\Admin::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(\App\Models\Auth\Admin::class, 'updated_by');
    }

    public function workingDays()
    {
        return $this->hasMany(\App\Models\KitchenWorkingDay::class);
    }

    public function holidays()
    {
        return $this->hasMany(\App\Models\KitchenHoliday::class);
    }

    public function capacities()
    {
        return $this->hasMany(\App\Models\KitchenCapacity::class);
    }

    public function productionSchedules()
    {
        return $this->hasMany(\App\Models\ProductionSchedule::class);
    }
}
