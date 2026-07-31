<?php
declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryTransaction extends Model
{
    use HasFactory, HasUuid;

    protected $table = 'inventory_transactions';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $guarded = ['id'];

    public $timestamps = false;

    protected $casts = [
        'quantity' => 'float',
        'unit_cost' => 'float',
        'total_cost' => 'float',
        'stock_before' => 'float',
        'stock_after' => 'float',
        'created_at' => 'datetime',
    ];

    public function inventoryItem(): BelongsTo { return $this->belongsTo(InventoryItem::class); }
    public function batch(): BelongsTo { return $this->belongsTo(InventoryBatch::class, 'batch_id'); }
    public function createdBy(): BelongsTo { return $this->belongsTo(\App\Models\Auth\Admin::class, 'created_by'); }

    public function scopeOfType($query, string $type) { return $query->where('transaction_type', $type); }
    public function scopeForItem($query, int $itemId) { return $query->where('inventory_item_id', $itemId); }

    // Transactions are immutable - no update/delete scopes
    public function referenceable(): ?Model
    {
        if (!$this->reference_type || !$this->reference_id) return null;
        $class = 'App\\Models\\' . class_basename($this->reference_type);
        return $class::find($this->reference_id);
    }
}
