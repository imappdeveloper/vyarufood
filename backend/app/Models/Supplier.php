<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\{BelongsTo, HasMany};
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;
use App\Traits\HasUuid;

class Supplier extends Model
{
    use HasFactory, HasUuid, SoftDeletes;

    protected $guarded = ['id'];
    protected $keyType = 'int';
    public $incrementing = true;

    protected $casts = [
        'credit_limit' => 'float',
        'credit_days' => 'float',
        'outstanding_balance' => 'float',
        'opening_balance' => 'float',
        'current_balance' => 'float',
        'is_preferred' => 'boolean',
    ];

    public function products(): HasMany
    {
        return $this->hasMany(SupplierProduct::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(SupplierDocument::class);
    }

    public function contacts(): HasMany
    {
        return $this->hasMany(SupplierContact::class);
    }

    public function priceHistory(): HasMany
    {
        return $this->hasMany(SupplierPriceHistory::class);
    }

    public function purchaseOrders(): HasMany
    {
        return $this->hasMany(PurchaseOrder::class);
    }

    public function purchaseRequests(): HasMany
    {
        return $this->hasMany(PurchaseRequest::class);
    }

    public function goodsReceipts(): HasMany
    {
        return $this->hasMany(GoodsReceipt::class);
    }

    public function country(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Master\Country::class);
    }

    public function state(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Master\State::class);
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Master\City::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Auth\Admin::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Auth\Admin::class, 'updated_by');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }

    public function scopePreferred(Builder $query): Builder
    {
        return $query->where('is_preferred', true);
    }

    public function scopeByType(Builder $query, string $type): Builder
    {
        return $query->where('supplier_type', $type);
    }

    public function scopeNotBlacklisted(Builder $query): Builder
    {
        return $query->where('status', '!=', 'blacklisted');
    }
}
