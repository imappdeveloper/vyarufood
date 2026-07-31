<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use App\Traits\HasAuditFields;
use App\Traits\Filterable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KitchenWorkingDay extends Model
{
    use HasFactory, HasUuid, HasAuditFields, Filterable;

    protected $fillable = [
        'uuid', 'kitchen_id', 'day_of_week', 'is_working',
        'opening_time', 'closing_time', 'preparation_start_time',
        'accept_order_start', 'accept_order_end',
        'created_by', 'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'is_working' => 'boolean',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    public function getDayOfWeekLabelAttribute(): string
    {
        return ucfirst($this->day_of_week);
    }

    public function kitchen()
    {
        return $this->belongsTo(Kitchen::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_working', true);
    }

    public function scopeForDay($query, string $day)
    {
        return $query->where('day_of_week', $day);
    }

    public function scopeSearch($query, ?string $search)
    {
        if (! $search) {
            return $query;
        }

        return $query->where('day_of_week', 'LIKE', "%{$search}%");
    }
}
