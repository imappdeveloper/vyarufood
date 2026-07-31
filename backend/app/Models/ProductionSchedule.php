<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use App\Traits\HasAuditFields;
use App\Traits\Filterable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductionSchedule extends Model
{
    use HasFactory, HasUuid, HasAuditFields, Filterable;

    protected $fillable = [
        'uuid', 'kitchen_id', 'production_date', 'meal_type',
        'planned_quantity', 'produced_quantity', 'remaining_quantity',
        'production_start', 'production_end',
        'status', 'remarks',
        'created_by', 'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'production_date' => 'date',
            'production_start' => 'datetime',
            'production_end' => 'datetime',
            'planned_quantity' => 'integer',
            'produced_quantity' => 'integer',
            'remaining_quantity' => 'integer',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    public function getMealTypeLabelAttribute(): string
    {
        return ucfirst(str_replace('_', ' ', $this->meal_type));
    }

    public function getStatusLabelAttribute(): string
    {
        return ucfirst(str_replace('_', ' ', $this->status));
    }

    public function getCompletionPercentageAttribute(): float
    {
        return $this->planned_quantity > 0
            ? round(($this->produced_quantity / $this->planned_quantity) * 100, 1)
            : 0;
    }

    public function getIsOverdueAttribute(): bool
    {
        return $this->status === 'in_progress'
            && $this->production_end
            && $this->production_end->isPast();
    }

    public function kitchen()
    {
        return $this->belongsTo(Kitchen::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', '!=', 'cancelled');
    }

    public function scopeForDate($query, $date)
    {
        return $query->where('production_date', $date);
    }

    public function scopeForDateRange($query, $from, $to)
    {
        return $query->where('production_date', '>=', $from)
            ->where('production_date', '<=', $to);
    }

    public function scopeForMealType($query, string $type)
    {
        return $query->where('meal_type', $type);
    }

    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('production_date', '>=', now()->toDateString());
    }

    public function scopeSearch($query, ?string $search)
    {
        if (! $search) {
            return $query;
        }

        return $query->where(function ($q) use ($search) {
            $q->where('meal_type', 'LIKE', "%{$search}%")
              ->orWhere('remarks', 'LIKE', "%{$search}%");
        });
    }
}
