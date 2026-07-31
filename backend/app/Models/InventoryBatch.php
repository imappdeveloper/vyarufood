<?php
declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryBatch extends Model
{
    use HasFactory, HasUuid;

    protected $table = 'inventory_batches';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $guarded = ['id'];

    protected $casts = [
        'manufacturing_date' => 'date',
        'expiry_date' => 'date',
        'received_date' => 'date',
        'available_quantity' => 'float',
        'reserved_quantity' => 'float',
        'unit_cost' => 'float',
    ];

    public function inventoryItem(): BelongsTo { return $this->belongsTo(InventoryItem::class); }
    public function supplier(): BelongsTo { return $this->belongsTo(Supplier::class); }
    public function purchaseOrder(): BelongsTo { return $this->belongsTo(PurchaseOrder::class); }
    public function goodsReceipt(): BelongsTo { return $this->belongsTo(GoodsReceipt::class); }

    public function scopeActive($query) { return $query->where('status', 'active'); }
    public function scopeExpired($query) { return $query->where('expiry_date', '<', now())->where('status', 'active'); }
    public function scopeAvailable($query) { return $query->where('status', 'active')->where('available_quantity', '>', 0); }

    protected function isExpired(): bool
    {
        return $this->expiry_date && $this->expiry_date->isPast();
    }
}
