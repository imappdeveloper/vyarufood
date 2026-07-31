<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\{Model, Relations\BelongsTo};

class OrderCancellation extends Model
{
    use HasUuid;

    protected $table = 'order_cancellations';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $fillable = [
        'uuid', 'order_id', 'cancellation_reason', 'additional_notes',
        'refund_amount', 'refund_processed', 'cancelled_by',
    ];

    protected function casts(): array { return ['refund_amount' => 'decimal:2', 'refund_processed' => 'boolean']; }

    public function order(): BelongsTo { return $this->belongsTo(Order::class); }
    public function cancelledBy(): BelongsTo { return $this->belongsTo(\App\Models\Auth\Admin::class, 'cancelled_by'); }
}
