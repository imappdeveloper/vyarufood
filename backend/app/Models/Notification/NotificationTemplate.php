<?php

declare(strict_types=1);

namespace App\Models\Notification;

use App\Models\Auth\Admin;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NotificationTemplate extends Model
{
    use HasUuid;

    protected $fillable = [
        'template_code', 'template_name', 'notification_type', 'channel',
        'subject', 'title', 'message', 'variables', 'language', 'status',
        'created_by', 'updated_by',
    ];

    protected $casts = [
        'variables' => 'array',
        'status' => 'string',
    ];

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'updated_by');
    }
}
