<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\{Model, Relations\BelongsTo};

class OrderStatusHistory extends Model
{
    use HasUuid;

    protected $table = 'order_status_history';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $fillable = ['uuid', 'order_id', 'from_status', 'to_status', 'reason', 'changed_by', 'metadata'];

    protected function casts(): array { return ['metadata' => 'array']; }

    public function order(): BelongsTo { return $this->belongsTo(Order::class); }
    public function changedBy(): BelongsTo { return $this->belongsTo(\App\Models\Auth\Admin::class, 'changed_by'); }
}
