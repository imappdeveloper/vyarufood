<?php

declare(strict_types=1);

namespace App\Models\Master;

use App\Traits\HasUuid;
use App\Traits\Filterable;
use App\Enums\StatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class DeliverySlot extends Model
{
    use HasFactory, HasUuid, Filterable, SoftDeletes;

    protected $fillable = [
        'uuid', 'delivery_zone_id', 'slot_name', 'start_time', 'end_time',
        'maximum_orders', 'cutoff_time', 'status',
    ];

    protected function casts(): array
    {
        return [
            'maximum_orders' => 'integer',
            'start_time' => 'datetime:H:i',
            'end_time' => 'datetime:H:i',
            'cutoff_time' => 'datetime:H:i',
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
            $q->where('slot_name', 'LIKE', "%{$search}%");
        });
    }

    public function deliveryZone()
    {
        return $this->belongsTo(DeliveryZone::class);
    }
}
