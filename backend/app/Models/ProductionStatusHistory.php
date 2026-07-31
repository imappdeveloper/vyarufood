<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\{Model, Relations\BelongsTo};

class ProductionStatusHistory extends Model
{
    use HasUuid;

    protected $table = 'production_status_history';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $fillable = [
        'uuid', 'production_batch_id', 'from_status', 'to_status',
        'reason', 'changed_by', 'metadata',
    ];

    protected function casts(): array
    {
        return [
            'metadata' => 'array',
        ];
    }

    public function batch(): BelongsTo { return $this->belongsTo(ProductionBatch::class, 'production_batch_id'); }
    public function changedBy(): BelongsTo { return $this->belongsTo(\App\Models\Auth\Admin::class, 'changed_by'); }
}
