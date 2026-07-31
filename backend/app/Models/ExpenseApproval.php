<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use App\Models\Auth\Admin;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExpenseApproval extends Model
{
    use HasUuid;

    protected $table = 'expense_approvals';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;

    protected $fillable = [
        'expense_id', 'approval_level', 'approved_by', 'approval_status',
        'approval_date', 'remarks',
    ];

    protected $casts = [
        'approval_level' => 'integer',
        'approval_date' => 'datetime',
    ];

    public function expense(): BelongsTo
    {
        return $this->belongsTo(Expense::class, 'expense_id');
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'approved_by');
    }
}
