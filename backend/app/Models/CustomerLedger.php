<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomerLedger extends Model
{
    use HasUuid;

    protected $table = 'customer_ledger';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'customer_id', 'journal_entry_id', 'transaction_date', 'transaction_type',
        'reference_type', 'reference_id', 'description',
        'debit_amount', 'credit_amount', 'balance',
        'created_by',
    ];

    protected $casts = [
        'transaction_date' => 'date',
        'debit_amount' => 'decimal:2',
        'credit_amount' => 'decimal:2',
        'balance' => 'decimal:2',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'customer_id');
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
