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

class CustomerAddress extends Model
{
    use HasFactory, HasUuid, HasAuditFields, Filterable, SoftDeletes;

    protected $fillable = [
        'uuid', 'customer_id', 'country_id', 'state_id', 'city_id',
        'area_id', 'delivery_zone_id', 'pincode_id',
        'address_type', 'house_no', 'building_name', 'floor', 'street',
        'landmark', 'address_line_1', 'address_line_2',
        'latitude', 'longitude', 'google_place_id',
        'contact_person', 'contact_mobile', 'delivery_instruction',
        'is_default', 'is_verified', 'status',
        'created_by', 'updated_by', 'deleted_by',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'float',
            'longitude' => 'float',
            'is_default' => 'boolean',
            'is_verified' => 'boolean',
            'status' => StatusEnum::class,
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    public function getAddressLabelAttribute(): string
    {
        return ucfirst($this->address_type);
    }

    public function getFullAddressAttribute(): string
    {
        $parts = array_filter([
            $this->address_line_1,
            $this->address_line_2,
            $this->street,
            $this->landmark,
            $this->city?->name,
            $this->pincode?->pincode,
        ]);

        return implode(', ', $parts);
    }

    public function setIsDefault(): void
    {
        $this->is_default = true;
        $this->save();
    }

    public function unsetDefault(): void
    {
        $this->is_default = false;
        $this->save();
    }

    public function scopeActive($query)
    {
        return $query->where('status', StatusEnum::Active);
    }

    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }

    public function scopeForCustomer($query, int $customerId)
    {
        return $query->where('customer_id', $customerId);
    }

    public function scopeSearch($query, ?string $search)
    {
        if (! $search) {
            return $query;
        }

        return $query->where(function ($q) use ($search) {
            $q->where('contact_person', 'LIKE', "%{$search}%")
              ->orWhere('contact_mobile', 'LIKE', "%{$search}%")
              ->orWhere('address_line_1', 'LIKE', "%{$search}%")
              ->orWhere('landmark', 'LIKE', "%{$search}%")
              ->orWhere('house_no', 'LIKE', "%{$search}%")
              ->orWhere('building_name', 'LIKE', "%{$search}%");
        });
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
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

    public function pincode()
    {
        return $this->belongsTo(\App\Models\Master\Pincode::class);
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
