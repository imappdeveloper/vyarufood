<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BankReconciliation extends Model
{
    use HasUuid;

    protected $table = 'bank_reconciliations';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'reconciliation_number', 'bank_account_id', 'reconciliation_date',
        'statement_date', 'opening_balance', 'closing_balance',
        'total_deposits', 'total_withdrawals', 'adjusted_balance',
        'difference', 'status', 'notes', 'reconciled_at', 'reconciled_by',
        'created_by', 'updated_by',
    ];

    protected $casts = [
        'reconciliation_date' => 'date',
        'statement_date' => 'date',
        'opening_balance' => 'decimal:2',
        'closing_balance' => 'decimal:2',
        'total_deposits' => 'decimal:2',
        'total_withdrawals' => 'decimal:2',
        'adjusted_balance' => 'decimal:2',
        'difference' => 'decimal:2',
        'reconciled_at' => 'datetime',
    ];

    public function bankAccount(): BelongsTo
    {
        return $this->belongsTo(BankAccount::class, 'bank_account_id');
    }

    public function reconciledBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Auth\Admin::class, 'reconciled_by');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Auth\Admin::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Auth\Admin::class, 'updated_by');
    }
}
