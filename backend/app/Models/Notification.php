<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Notification extends Model
{
    use HasUuid;

    protected $fillable = [
        'notification_number', 'recipient_type', 'recipient_id', 'template_id',
        'event_name', 'channel', 'title', 'message', 'payload',
        'priority', 'scheduled_at', 'sent_at', 'delivery_status',
        'read_at', 'failure_reason',
    ];

    protected $casts = [
        'payload' => 'array',
        'scheduled_at' => 'datetime',
        'sent_at' => 'datetime',
        'read_at' => 'datetime',
    ];

    public function template(): BelongsTo
    {
        return $this->belongsTo(NotificationTemplate::class, 'template_id');
    }

    public function logs(): HasMany
    {
        return $this->hasMany(NotificationLog::class, 'notification_id');
    }

    public function recipient()
    {
        return $this->morphTo();
    }
}
