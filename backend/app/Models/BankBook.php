<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BankBook extends Model
{
    use HasUuid;

    protected $table = 'bank_book';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'bank_account_id', 'journal_entry_id', 'transaction_date',
        'transaction_type', 'reference_type', 'reference_id', 'description',
        'debit_amount', 'credit_amount', 'balance',
        'is_reconciled', 'reconciled_at',
        'created_by',
    ];

    protected $casts = [
        'transaction_date' => 'date',
        'debit_amount' => 'decimal:2',
        'credit_amount' => 'decimal:2',
        'balance' => 'decimal:2',
        'is_reconciled' => 'boolean',
        'reconciled_at' => 'datetime',
    ];

    public function bankAccount(): BelongsTo
    {
        return $this->belongsTo(BankAccount::class, 'bank_account_id');
    }

    public function journalEntry(): BelongsTo
    {
        return $this->belongsTo(JournalEntry::class, 'journal_entry_id');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Auth\Admin::class, 'created_by');
    }
}
