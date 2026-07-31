<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GstTransaction extends Model
{
    use HasUuid;

    protected $table = 'gst_transactions';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'journal_entry_id', 'transaction_date', 'transaction_type',
        'reference_type', 'reference_id', 'invoice_number', 'invoice_date',
        'party_name', 'party_gstin', 'gst_rate', 'hsn_code',
        'taxable_amount', 'cgst_amount', 'sgst_amount', 'igst_amount',
        'cess_amount', 'total_tax', 'total_amount',
        'gstin_type', 'filing_period', 'filing_year',
        'is_reconciled', 'reconciled_at',
        'created_by',
    ];

    protected $casts = [
        'transaction_date' => 'date',
        'invoice_date' => 'date',
        'gst_rate' => 'decimal:2',
        'taxable_amount' => 'decimal:2',
        'cgst_amount' => 'decimal:2',
        'sgst_amount' => 'decimal:2',
        'igst_amount' => 'decimal:2',
        'cess_amount' => 'decimal:2',
        'total_tax' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'is_reconciled' => 'boolean',
        'reconciled_at' => 'datetime',
    ];

    public function journalEntry(): BelongsTo
    {
        return $this->belongsTo(JournalEntry::class, 'journal_entry_id');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Auth\Admin::class, 'created_by');
    }
}
