<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\{
    Model,
    Relations\BelongsTo,
    Relations\HasMany,
    SoftDeletes
};
use Illuminate\Database\Eloquent\Casts\Attribute;

class WeeklyMenu extends Model
{
    use HasUuid, SoftDeletes;

    protected $table = 'weekly_menus';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $fillable = [
        'uuid', 'kitchen_id', 'title', 'description',
        'week_start_date', 'week_end_date',
        'status', 'published_at', 'published_by', 'cut_off_hours',
        'created_by', 'updated_by', 'deleted_by',
    ];

    protected function casts(): array
    {
        return [
            'week_start_date' => 'date',
            'week_end_date' => 'date',
            'published_at' => 'datetime',
            'cut_off_hours' => 'integer',
        ];
    }

    public function kitchen(): BelongsTo
    {
        return $this->belongsTo(Kitchen::class, 'kitchen_id');
    }

    public function publishedBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Auth\Admin::class, 'published_by');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Auth\Admin::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Auth\Admin::class, 'updated_by');
    }

    public function items(): HasMany
    {
        return $this->hasMany(WeeklyMenuItem::class, 'weekly_menu_id');
    }

    public function customerSelections(): HasMany
    {
        return $this->hasMany(CustomerMealSelection::class, 'weekly_menu_id');
    }

    protected function isPublished(): Attribute
    {
        return Attribute::get(fn () => $this->status === 'published');
    }

    protected function isEditable(): Attribute
    {
        return Attribute::get(fn () => $this->status === 'draft'
            && $this->week_start_date->isFuture()
            && $this->week_end_date->isFuture()
        );
    }

    protected function durationDays(): Attribute
    {
        return Attribute::get(fn () => (int) $this->week_start_date->diffInDays($this->week_end_date) + 1);
    }

    public function scopeActive($query)
    {
        return $query->where('status', '!=', 'archived');
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    public function scopeArchived($query)
    {
        return $query->where('status', 'archived');
    }

    public function scopeForWeek($query, string $weekStartDate)
    {
        return $query->where('week_start_date', $weekStartDate);
    }

    public function scopeForKitchen($query, ?int $kitchenId = 1)
    {
        return $query->where('kitchen_id', $kitchenId ?? 1);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('week_start_date', '>=', now()->toDateString())
            ->where('status', 'published');
    }
}
