<?php

declare(strict_types=1);

namespace App\Models\Report;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReportExport extends Model
{
    use HasUuid;

    public $timestamps = false;

    protected $fillable = [
        'report_name', 'export_format', 'file_path',
        'generated_by', 'generated_at',
    ];

    protected function casts(): array
    {
        return [
            'generated_at' => 'datetime',
        ];
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Auth\Admin::class, 'generated_by');
    }
}
