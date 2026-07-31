<?php

declare(strict_types=1);

namespace App\Models\Notification;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NotificationPreference extends Model
{
    use HasUuid;

    protected $fillable = [
        'customer_id', 'push_enabled', 'email_enabled', 'sms_enabled',
        'marketing_enabled', 'order_enabled', 'payment_enabled',
        'subscription_enabled', 'system_enabled', 'language',
    ];

    protected $casts = [
        'push_enabled' => 'boolean',
        'email_enabled' => 'boolean',
        'sms_enabled' => 'boolean',
        'marketing_enabled' => 'boolean',
        'order_enabled' => 'boolean',
        'payment_enabled' => 'boolean',
        'subscription_enabled' => 'boolean',
        'system_enabled' => 'boolean',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Customer::class, 'customer_id');
    }
}
