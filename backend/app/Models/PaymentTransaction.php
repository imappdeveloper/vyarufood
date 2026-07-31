<?php

declare(strict_types=1);

namespace App\Models;

use App\Models\Auth\Admin;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PaymentTransaction extends Model
{
    use HasUuid;

    protected $fillable = [
        'transaction_number', 'gateway_name', 'gateway_transaction_id',
        'gateway_order_id', 'customer_id', 'order_id', 'subscription_id',
        'payment_type', 'payment_method', 'amount', 'currency', 'gateway_fee',
        'tax_amount', 'status', 'payment_date', 'failure_reason', 'webhook_verified',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'gateway_fee' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'payment_date' => 'datetime',
        'webhook_verified' => 'boolean',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    public function subscription(): BelongsTo
    {
        return $this->belongsTo(CustomerSubscription::class, 'subscription_id');
    }

    public function refunds(): HasMany
    {
        return $this->hasMany(PaymentRefund::class, 'payment_transaction_id');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'updated_by');
    }
}
