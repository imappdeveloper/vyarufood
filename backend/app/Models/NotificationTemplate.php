<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

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
    ];

    public function createdBy()
    {
        return $this->belongsTo(\App\Models\Auth\Admin::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(\App\Models\Auth\Admin::class, 'updated_by');
    }
}
