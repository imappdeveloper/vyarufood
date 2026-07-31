<?php
declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryAdjustment extends Model
{
    use HasFactory, HasUuid;

    protected $table = 'inventory_adjustments';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $guarded = ['id'];

    protected $casts = [
        'adjustment_quantity' => 'float',
        'approved_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function inventoryItem(): BelongsTo { return $this->belongsTo(InventoryItem::class); }
    public function approvedBy(): BelongsTo { return $this->belongsTo(\App\Models\Auth\Admin::class, 'approved_by'); }
    public function createdBy(): BelongsTo { return $this->belongsTo(\App\Models\Auth\Admin::class, 'created_by'); }
}
