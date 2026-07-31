<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\{Model, Relations\BelongsTo};

class SubscriptionUpgradeHistory extends Model
{
    use HasUuid;

    protected $table = 'subscription_upgrade_history';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $fillable = [
        'uuid', 'customer_subscription_id', 'action', 'from_plan_id',
        'to_plan_id', 'price_difference', 'remaining_meals_before',
        'remaining_meals_after', 'reason', 'status', 'approved_by',
        'refund_amount', 'additional_charge', 'remarks',
    ];

    protected function casts(): array
    {
        return [
            'price_difference' => 'decimal:2',
            'remaining_meals_before' => 'integer',
            'remaining_meals_after' => 'integer',
            'refund_amount' => 'decimal:2',
            'additional_charge' => 'decimal:2',
        ];
    }

    public function customerSubscription(): BelongsTo
    {
        return $this->belongsTo(CustomerSubscription::class);
    }

    public function fromPlan(): BelongsTo
    {
        return $this->belongsTo(SubscriptionPlan::class, 'from_plan_id');
    }

    public function toPlan(): BelongsTo
    {
        return $this->belongsTo(SubscriptionPlan::class, 'to_plan_id');
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Auth\Admin::class, 'approved_by');
    }
}
