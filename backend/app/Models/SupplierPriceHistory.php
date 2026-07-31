<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\HasUuid;

class SupplierPriceHistory extends Model
{
    use HasFactory, HasUuid;

    protected $guarded = ['id'];
    protected $keyType = 'int';
    public $incrementing = true;

    public $timestamps = false;

    protected $casts = [
        'old_price' => 'float',
        'new_price' => 'float',
        'effective_from' => 'date',
        'created_at' => 'datetime',
    ];

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function inventoryItem(): BelongsTo
    {
        return $this->belongsTo(InventoryItem::class);
    }
}
