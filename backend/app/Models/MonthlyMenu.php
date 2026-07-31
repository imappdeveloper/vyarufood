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

class MonthlyMenu extends Model
{
    use HasUuid, SoftDeletes;

    protected $table = 'monthly_menus';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $fillable = [
        'uuid', 'month', 'year', 'kitchen_id', 'title', 'description',
        'menu_template_id', 'status', 'published_at', 'published_by',
        'approved_at', 'approved_by', 'created_by', 'updated_by', 'deleted_by',
    ];

    protected function casts(): array
    {
        return [
            'month' => 'integer',
            'year' => 'integer',
            'published_at' => 'datetime',
            'approved_at' => 'datetime',
        ];
    }

    public function kitchen(): BelongsTo
    {
        return $this->belongsTo(Kitchen::class, 'kitchen_id');
    }

    public function menuTemplate(): BelongsTo
    {
        return $this->belongsTo(MenuTemplate::class, 'menu_template_id');
    }

    public function publishedBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Auth\Admin::class, 'published_by');
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Auth\Admin::class, 'approved_by');
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
        return $this->hasMany(MonthlyMenuItem::class, 'monthly_menu_id');
    }

    protected function isPublished(): Attribute
    {
        return Attribute::get(fn () => $this->status === 'published');
    }

    protected function isApproved(): Attribute
    {
        return Attribute::get(fn () => $this->status === 'approved');
    }

    protected function daysInMonth(): Attribute
    {
        return Attribute::get(fn () => (int) cal_days_in_month(CAL_GREGORIAN, $this->month, $this->year));
    }

    public function scopeActive($query)
    {
        return $query->where('status', '!=', 'archived');
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeForMonth($query, int $month, int $year)
    {
        return $query->where('month', $month)->where('year', $year);
    }

    public function scopeForKitchen($query, ?int $kitchenId = 1)
    {
        return $query->where('kitchen_id', $kitchenId ?? 1);
    }
}
