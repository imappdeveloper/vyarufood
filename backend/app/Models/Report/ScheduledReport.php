<?php

declare(strict_types=1);

namespace App\Models\Report;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScheduledReport extends Model
{
    use HasUuid;

    protected $fillable = [
        'report_name', 'report_type', 'frequency',
        'export_format', 'email_recipients', 'next_run',
        'status', 'created_by',
    ];

    protected function casts(): array
    {
        return [
            'email_recipients' => 'array',
            'next_run' => 'datetime',
        ];
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Auth\Admin::class, 'created_by');
    }
}
