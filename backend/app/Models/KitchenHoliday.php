<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use App\Traits\HasAuditFields;
use App\Traits\Filterable;
use App\Enums\StatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KitchenHoliday extends Model
{
    use HasFactory, HasUuid, HasAuditFields, Filterable;

    protected $fillable = [
        'uuid', 'kitchen_id', 'holiday_name', 'holiday_type',
        'start_date', 'end_date', 'reason', 'status',
        'created_by', 'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'status' => StatusEnum::class,
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    public function getHolidayTypeLabelAttribute(): string
    {
        return ucfirst(str_replace('_', ' ', $this->holiday_type));
    }

    public function getStatusLabelAttribute(): string
    {
        return $this->status instanceof StatusEnum ? $this->status->label() : ucfirst($this->status ?? '');
    }

    public function getDurationAttribute(): int
    {
        return $this->start_date && $this->end_date
            ? (int) $this->start_date->diffInDays($this->end_date) + 1
            : 0;
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
        return $query->where('start_date', '<=', $date)
            ->where('end_date', '>=', $date);
    }

    public function scopeForDateRange($query, $from, $to)
    {
        return $query->where('start_date', '<=', $to)
            ->where('end_date', '>=', $from);
    }

    public function scopeSearch($query, ?string $search)
    {
        if (! $search) {
            return $query;
        }

        return $query->where(function ($q) use ($search) {
            $q->where('holiday_name', 'LIKE', "%{$search}%")
              ->orWhere('reason', 'LIKE', "%{$search}%");
        });
    }
}
