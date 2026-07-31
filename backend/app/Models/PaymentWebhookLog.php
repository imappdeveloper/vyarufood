<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class PaymentWebhookLog extends Model
{
    use HasUuid;

    protected $fillable = [
        'gateway_name', 'event_name', 'payload', 'signature',
        'verification_status', 'processed_at',
    ];

    protected $casts = [
        'payload' => 'array',
        'processed_at' => 'datetime',
    ];
}
