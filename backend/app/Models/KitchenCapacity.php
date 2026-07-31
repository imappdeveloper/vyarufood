<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use App\Traits\HasAuditFields;
use App\Traits\Filterable;
use App\Enums\StatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KitchenCapacity extends Model
{
    use HasFactory, HasUuid, HasAuditFields, Filterable;

    protected $table = 'kitchen_capacity';

    protected $fillable = [
        'uuid', 'kitchen_id', 'capacity_date',
        'breakfast_capacity', 'lunch_capacity', 'dinner_capacity',
        'healthy_meal_capacity', 'snack_capacity',
        'maximum_orders', 'reserved_orders', 'available_orders',
        'status',
        'created_by', 'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'capacity_date' => 'date',
            'breakfast_capacity' => 'integer',
            'lunch_capacity' => 'integer',
            'dinner_capacity' => 'integer',
            'healthy_meal_capacity' => 'integer',
            'snack_capacity' => 'integer',
            'maximum_orders' => 'integer',
            'reserved_orders' => 'integer',
            'available_orders' => 'integer',
            'status' => StatusEnum::class,
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    public function getCapacityPercentageAttribute(): float
    {
        return $this->maximum_orders > 0
            ? round(($this->reserved_orders / $this->maximum_orders) * 100, 1)
            : 0;
    }

    public function getTotalMealCapacityAttribute(): int
    {
        return $this->breakfast_capacity + $this->lunch_capacity + $this->dinner_capacity
            + $this->healthy_meal_capacity + $this->snack_capacity;
    }

    public function getStatusLabelAttribute(): string
    {
        return $this->status instanceof StatusEnum ? $this->status->label() : ucfirst($this->status ?? '');
    }

    public function kitchen()
    {
        return $this->belongsTo(Kitchen::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', StatusEnum::Active);
    }

    public function scopeForDate($query, $date)
    {
        return $query->where('capacity_date', $date);
    }

    public function scopeForDateRange($query, $from, $to)
    {
        return $query->where('capacity_date', '>=', $from)
            ->where('capacity_date', '<=', $to);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('capacity_date', '>=', now()->toDateString());
    }

    public function scopeSearch($query, ?string $search)
    {
        if (! $search) {
            return $query;
        }

        return $query->where('capacity_date', 'LIKE', "%{$search}%");
    }
}
