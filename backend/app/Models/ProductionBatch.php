<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\{Model, Relations\BelongsTo, Relations\HasMany, SoftDeletes};
use Illuminate\Database\Eloquent\Casts\Attribute;

class ProductionBatch extends Model
{
    use HasUuid, SoftDeletes;

    protected $table = 'production_batches';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $fillable = [
        'uuid', 'batch_number', 'production_date', 'kitchen_id', 'batch_name',
        'batch_type', 'total_orders', 'total_meals',
        'planned_start_time', 'planned_end_time', 'actual_start_time', 'actual_end_time',
        'production_status', 'prepared_by', 'approved_by', 'remarks',
        'created_by', 'updated_by', 'deleted_by',
    ];

    protected function casts(): array
    {
        return [
            'production_date' => 'date',
            'total_orders' => 'integer',
            'total_meals' => 'integer',
            'actual_start_time' => 'datetime',
            'actual_end_time' => 'datetime',
        ];
    }

    public function getRouteKeyName(): string { return 'uuid'; }

    protected function isDraft(): Attribute { return Attribute::get(fn () => $this->production_status === 'draft'); }
    protected function isCompleted(): Attribute { return Attribute::get(fn () => $this->production_status === 'completed'); }
    protected function isLocked(): Attribute { return Attribute::get(fn () => in_array($this->production_status, ['completed', 'cancelled'])); }

    public function scopeByDate($query, string $date) { return $query->where('production_date', $date); }
    public function scopeToday($query) { return $query->where('production_date', now()->toDateString()); }
    public function scopeByKitchen($query, int $kitchenId) { return $query->where('kitchen_id', $kitchenId); }
    public function scopeByStatus($query, string $status) { return $query->where('production_status', $status); }
    public function scopeActive($query) { return $query->whereNotIn('production_status', ['cancelled', 'completed']); }

    public function kitchen(): BelongsTo { return $this->belongsTo(Kitchen::class); }
    public function items(): HasMany { return $this->hasMany(ProductionBatchItem::class, 'production_batch_id'); }
    public function packingLists(): HasMany { return $this->hasMany(MealPackingList::class, 'production_batch_id'); }
    public function statusHistory(): HasMany { return $this->hasMany(ProductionStatusHistory::class, 'production_batch_id'); }
    public function createdBy(): BelongsTo { return $this->belongsTo(\App\Models\Auth\Admin::class, 'created_by'); }
    public function updatedBy(): BelongsTo { return $this->belongsTo(\App\Models\Auth\Admin::class, 'updated_by'); }
    public function preparedBy(): BelongsTo { return $this->belongsTo(\App\Models\Auth\Admin::class, 'prepared_by'); }
    public function approvedBy(): BelongsTo { return $this->belongsTo(\App\Models\Auth\Admin::class, 'approved_by'); }
}
