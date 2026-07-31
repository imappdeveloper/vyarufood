<?php
declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class InventoryItem extends Model
{
    use HasFactory, HasUuid, SoftDeletes;

    protected $table = 'inventory_items';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $guarded = ['id'];

    protected $casts = [
        'current_stock' => 'float',
        'reserved_stock' => 'float',
        'available_stock' => 'float',
        'minimum_stock' => 'float',
        'maximum_stock' => 'float',
        'reorder_level' => 'float',
        'reorder_quantity' => 'float',
        'cost_price' => 'float',
        'average_cost' => 'float',
        'last_purchase_cost' => 'float',
        'expiry_tracking' => 'boolean',
        'batch_tracking' => 'boolean',
        'serial_tracking' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relations
    public function unit(): BelongsTo { return $this->belongsTo(Unit::class); }
    public function category(): BelongsTo { return $this->belongsTo(MealCategory::class, 'category_id'); }
    public function batches(): HasMany { return $this->hasMany(InventoryBatch::class); }
    public function transactions(): HasMany { return $this->hasMany(InventoryTransaction::class); }
    public function adjustments(): HasMany { return $this->hasMany(InventoryAdjustment::class); }
    public function audits(): HasMany { return $this->hasMany(StockAudit::class); }
    public function recipeItems(): HasMany { return $this->hasMany(RecipeItem::class); }
    public function consumptionLogs(): HasMany { return $this->hasMany(InventoryConsumptionLog::class); }
    public function createdBy(): BelongsTo { return $this->belongsTo(\App\Models\Auth\Admin::class, 'created_by'); }
    public function updatedBy(): BelongsTo { return $this->belongsTo(\App\Models\Auth\Admin::class, 'updated_by'); }

    // Scopes
    public function scopeActive($query) { return $query->where('status', 'active'); }
    public function scopeLowStock($query) { return $query->whereColumn('current_stock', '<=', 'reorder_level')->where('reorder_level', '>', 0); }
    public function scopeWithBatchTracking($query) { return $query->where('batch_tracking', true); }
    public function scopeWithExpiryTracking($query) { return $query->where('expiry_tracking', true); }

}
