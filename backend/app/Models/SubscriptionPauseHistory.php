<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\{Model, Relations\BelongsTo};

class SubscriptionPauseHistory extends Model
{
    use HasUuid;

    protected $table = 'subscription_pause_history';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $fillable = [
        'uuid', 'customer_subscription_id', 'action', 'pause_start',
        'pause_end', 'pause_days', 'new_end_date', 'reason',
        'status', 'approved_by', 'remarks',
    ];

    protected function casts(): array
    {
        return [
            'pause_start' => 'date',
            'pause_end' => 'date',
            'pause_days' => 'integer',
            'new_end_date' => 'date',
        ];
    }

    public function customerSubscription(): BelongsTo
    {
        return $this->belongsTo(CustomerSubscription::class);
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Auth\Admin::class, 'approved_by');
    }
}
