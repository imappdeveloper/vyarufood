<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\{Model, Relations\BelongsTo};

class OrderRefund extends Model
{
    use HasUuid;

    protected $table = 'order_refunds';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $fillable = [
        'uuid', 'order_id', 'refund_number', 'refund_amount', 'refund_method',
        'refund_status', 'refund_reason', 'processed_by', 'processed_at', 'remarks',
    ];

    protected function casts(): array { return ['refund_amount' => 'decimal:2', 'processed_at' => 'datetime']; }

    public function order(): BelongsTo { return $this->belongsTo(Order::class); }
    public function processedBy(): BelongsTo { return $this->belongsTo(\App\Models\Auth\Admin::class, 'processed_by'); }
}
