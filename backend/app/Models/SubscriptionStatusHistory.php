<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\{Model, Relations\BelongsTo};

class SubscriptionStatusHistory extends Model
{
    use HasUuid;

    protected $table = 'subscription_status_history';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $fillable = [
        'uuid', 'customer_subscription_id', 'from_status', 'to_status',
        'reason', 'changed_by', 'metadata',
    ];

    protected function casts(): array
    {
        return [
            'metadata' => 'array',
        ];
    }

    public function customerSubscription(): BelongsTo
    {
        return $this->belongsTo(CustomerSubscription::class);
    }

    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Auth\Admin::class, 'changed_by');
    }
}
