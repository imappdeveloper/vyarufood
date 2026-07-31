<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\HasUuid;

class GoodsReceiptItem extends Model
{
    use HasFactory, HasUuid;

    protected $guarded = ['id'];
    protected $keyType = 'int';
    public $incrementing = true;

    protected $casts = [
        'received_quantity' => 'float',
        'accepted_quantity' => 'float',
        'rejected_quantity' => 'float',
        'unit_cost' => 'float',
    ];

    public function goodsReceipt(): BelongsTo
    {
        return $this->belongsTo(GoodsReceipt::class);
    }

    public function inventoryItem(): BelongsTo
    {
        return $this->belongsTo(InventoryItem::class);
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }
}
