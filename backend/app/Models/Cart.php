<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'subtotal',
        'tax_amount',
        'delivery_charge',
        'discount_amount',
        'coupon_amount',
        'coupon_code',
        'wallet_amount',
        'total_amount',
        'tax_percentage',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'delivery_charge' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'coupon_amount' => 'decimal:2',
        'wallet_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'tax_percentage' => 'decimal:2',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function itemCount(): int
    {
        return $this->items()->sum('quantity');
    }
}
