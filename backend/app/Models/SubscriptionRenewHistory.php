<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\{Model, Relations\BelongsTo};

class SubscriptionRenewHistory extends Model
{
    use HasUuid;

    protected $table = 'subscription_renew_history';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $fillable = [
        'uuid', 'customer_subscription_id', 'from_plan_id', 'to_plan_id',
        'old_end_date', 'new_end_date', 'old_remaining_meals',
        'new_remaining_meals', 'renewal_amount', 'discount_amount',
        'final_amount', 'renewal_type', 'reason', 'remarks',
    ];

    protected function casts(): array
    {
        return [
            'old_end_date' => 'date',
            'new_end_date' => 'date',
            'old_remaining_meals' => 'integer',
            'new_remaining_meals' => 'integer',
            'renewal_amount' => 'decimal:2',
            'discount_amount' => 'decimal:2',
            'final_amount' => 'decimal:2',
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
}
