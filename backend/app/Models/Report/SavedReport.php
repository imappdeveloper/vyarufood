<?php

declare(strict_types=1);

namespace App\Models\Report;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SavedReport extends Model
{
    use HasUuid;

    protected $fillable = [
        'report_code', 'report_name', 'report_type',
        'filters', 'created_by', 'is_public',
    ];

    protected function casts(): array
    {
        return [
            'filters' => 'array',
            'is_public' => 'boolean',
        ];
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Auth\Admin::class, 'created_by');
    }
}
