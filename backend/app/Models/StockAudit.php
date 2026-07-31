<?php
declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockAudit extends Model
{
    use HasFactory, HasUuid;

    protected $table = 'stock_audits';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $guarded = ['id'];

    protected $casts = [
        'audit_date' => 'date',
        'system_quantity' => 'float',
        'physical_quantity' => 'float',
        'difference_quantity' => 'float',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function inventoryItem(): BelongsTo { return $this->belongsTo(InventoryItem::class); }
    public function createdBy(): BelongsTo { return $this->belongsTo(\App\Models\Auth\Admin::class, 'created_by'); }
    public function approvedBy(): BelongsTo { return $this->belongsTo(\App\Models\Auth\Admin::class, 'approved_by'); }

    public function scopePending($query) { return $query->where('status', 'pending'); }
    public function scopeApproved($query) { return $query->where('status', 'approved'); }
}
