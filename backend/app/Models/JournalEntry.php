<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JournalEntry extends Model
{
    use HasUuid;

    protected $table = 'journal_entries';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'journal_number', 'financial_year_id', 'journal_date', 'entry_type',
        'reference_type', 'reference_id', 'description', 'total_debit',
        'total_credit', 'posting_status', 'posted_at', 'posted_by',
        'created_by', 'updated_by',
    ];

    protected $casts = [
        'journal_date' => 'date',
        'total_debit' => 'decimal:2',
        'total_credit' => 'decimal:2',
        'posting_status' => 'string',
        'posted_at' => 'datetime',
    ];

    public function financialYear(): BelongsTo
    {
        return $this->belongsTo(FinancialYear::class, 'financial_year_id');
    }

    public function lines(): HasMany
    {
        return $this->hasMany(JournalEntryLine::class, 'journal_entry_id');
    }

    public function postedBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Auth\Admin::class, 'posted_by');
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
