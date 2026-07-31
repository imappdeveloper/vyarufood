<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use App\Models\Auth\Admin;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Expense extends Model
{
    use HasUuid, SoftDeletes;

    protected $table = 'expenses';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'expense_number', 'expense_category_id', 'expense_date', 'expense_title',
        'expense_description', 'vendor_name', 'supplier_id', 'amount', 'tax_amount',
        'discount_amount', 'total_amount', 'payment_method', 'payment_account',
        'transaction_reference', 'invoice_number', 'invoice_date', 'bill_attachment',
        'is_recurring', 'recurring_frequency', 'next_due_date',
        'approval_status', 'approved_by', 'approved_at',
        'expense_status', 'remarks',
        'created_by', 'updated_by', 'deleted_by',
    ];

    protected $casts = [
        'expense_date' => 'date',
        'invoice_date' => 'date',
        'next_due_date' => 'date',
        'amount' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'is_recurring' => 'boolean',
        'approved_at' => 'datetime',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(ExpenseCategory::class, 'expense_category_id');
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class, 'supplier_id');
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'approved_by');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'updated_by');
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(ExpenseAttachment::class, 'expense_id');
    }

    public function approvals(): HasMany
    {
        return $this->hasMany(ExpenseApproval::class, 'expense_id');
    }
}
