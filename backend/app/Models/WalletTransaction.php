<?php

declare(strict_types=1);

namespace App\Models;

use App\Models\Auth\Admin;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WalletTransaction extends Model
{
    use HasUuid;

    protected $fillable = [
        'wallet_id', 'transaction_number', 'transaction_type', 'reference_type',
        'reference_id', 'opening_balance', 'amount', 'closing_balance',
        'remarks', 'created_by',
    ];

    protected $casts = [
        'opening_balance' => 'decimal:2',
        'amount' => 'decimal:2',
        'closing_balance' => 'decimal:2',
    ];

    public function wallet(): BelongsTo
    {
        return $this->belongsTo(Wallet::class, 'wallet_id');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }
}
