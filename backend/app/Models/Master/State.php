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

class State extends Model
{
    use HasFactory, HasUuid, HasAuditFields, Filterable, SoftDeletes;

    protected $fillable = [
        'uuid', 'country_id', 'name', 'state_code', 'abbreviation',
        'gst_code', 'latitude', 'longitude', 'status', 'sort_order',
        'is_default', 'remarks', 'created_by', 'updated_by', 'deleted_by',
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
              ->orWhere('state_code', 'LIKE', "%{$search}%")
              ->orWhere('abbreviation', 'LIKE', "%{$search}%")
              ->orWhere('gst_code', 'LIKE', "%{$search}%");
        });
    }

    public function country()
    {
        return $this->belongsTo(Country::class);
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
