<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\{Model, Relations\BelongsTo};

class SubscriptionSkipHistory extends Model
{
    use HasUuid;

    protected $table = 'subscription_skip_history';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $fillable = [
        'uuid', 'customer_subscription_id', 'skip_type', 'skip_date',
        'meal_id', 'meals_credited', 'credit_amount', 'reason',
        'status', 'remarks',
    ];

    protected function casts(): array
    {
        return [
            'skip_date' => 'date',
            'meals_credited' => 'integer',
            'credit_amount' => 'decimal:2',
        ];
    }

    public function customerSubscription(): BelongsTo
    {
        return $this->belongsTo(CustomerSubscription::class);
    }

    public function meal(): BelongsTo
    {
        return $this->belongsTo(Meal::class);
    }
}
