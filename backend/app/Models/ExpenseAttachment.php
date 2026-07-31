<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use App\Models\Auth\Admin;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExpenseAttachment extends Model
{
    use HasUuid;

    protected $table = 'expense_attachments';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;

    protected $fillable = [
        'expense_id', 'file_name', 'file_path', 'file_size', 'mime_type', 'uploaded_by',
    ];

    protected $casts = [
        'file_size' => 'integer',
    ];

    public function expense(): BelongsTo
    {
        return $this->belongsTo(Expense::class, 'expense_id');
    }

    public function uploadedBy(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'uploaded_by');
    }
}
