<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\{Model, Relations\BelongsTo, Relations\HasMany, SoftDeletes};
use Illuminate\Database\Eloquent\Casts\Attribute;

class Order extends Model
{
    use HasUuid, SoftDeletes;

    protected $table = 'orders';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $fillable = [
        'uuid', 'order_number', 'order_type', 'customer_id', 'subscription_id',
        'kitchen_id', 'address_id', 'delivery_zone_id', 'order_date', 'delivery_date',
        'meal_category_id', 'meal_type_id', 'meal_id', 'quantity',
        'unit_price', 'subtotal', 'discount_amount', 'coupon_amount',
        'tax_amount', 'delivery_charge', 'total_amount',
        'payment_status', 'payment_method', 'order_status',
        'delivery_slot', 'delivery_instruction', 'wallet_amount',
        'reward_points_used', 'reward_points_earned', 'notes',
        'cancelled_at', 'cancelled_by', 'cancellation_reason',
        'created_by', 'updated_by', 'deleted_by',
    ];

    protected function casts(): array
    {
        return [
            'order_date' => 'date',
            'delivery_date' => 'date',
            'quantity' => 'integer',
            'unit_price' => 'decimal:2',
            'subtotal' => 'decimal:2',
            'discount_amount' => 'decimal:2',
            'coupon_amount' => 'decimal:2',
            'tax_amount' => 'decimal:2',
            'delivery_charge' => 'decimal:2',
            'total_amount' => 'decimal:2',
            'wallet_amount' => 'decimal:2',
            'reward_points_used' => 'integer',
            'reward_points_earned' => 'integer',
            'cancelled_at' => 'datetime',
        ];
    }

    public function getRouteKeyName(): string { return 'uuid'; }

    protected function isPending(): Attribute { return Attribute::get(fn () => $this->order_status === 'pending'); }
    protected function isActive(): Attribute { return Attribute::get(fn () => ! in_array($this->order_status, ['cancelled', 'refunded'])); }
    protected function orderNumberDisplay(): Attribute { return Attribute::get(fn () => 'ORD-' . str_pad((string) $this->id, 6, '0', STR_PAD_LEFT)); }

    public function scopeActive($query) { return $query->whereNotIn('order_status', ['cancelled', 'refunded']); }
    public function scopeByStatus($query, string $status) { return $query->where('order_status', $status); }
    public function scopeByType($query, string $type) { return $query->where('order_type', $type); }
    public function scopeByDate($query, string $date) { return $query->where('order_date', $date); }
    public function scopeToday($query) { return $query->where('order_date', now()->toDateString()); }
    public function scopeForDelivery($query, string $date) { return $query->where('delivery_date', $date)->active(); }

    public function customer(): BelongsTo { return $this->belongsTo(Customer::class); }
    public function subscription(): BelongsTo { return $this->belongsTo(CustomerSubscription::class, 'subscription_id'); }
    public function kitchen(): BelongsTo { return $this->belongsTo(Kitchen::class); }
    public function address(): BelongsTo { return $this->belongsTo(CustomerAddress::class, 'address_id'); }
    public function deliveryZone(): BelongsTo { return $this->belongsTo(\App\Models\Master\DeliveryZone::class, 'delivery_zone_id'); }
    public function mealCategory(): BelongsTo { return $this->belongsTo(MealCategory::class); }
    public function mealType(): BelongsTo { return $this->belongsTo(MealType::class); }
    public function meal(): BelongsTo { return $this->belongsTo(Meal::class); }
    public function orderItems(): HasMany { return $this->hasMany(OrderItem::class); }
    public function statusHistory(): HasMany { return $this->hasMany(OrderStatusHistory::class); }
    public function cancellations(): HasMany { return $this->hasMany(OrderCancellation::class); }
    public function refunds(): HasMany { return $this->hasMany(OrderRefund::class); }
    public function createdBy(): BelongsTo { return $this->belongsTo(\App\Models\Auth\Admin::class, 'created_by'); }
    public function updatedBy(): BelongsTo { return $this->belongsTo(\App\Models\Auth\Admin::class, 'updated_by'); }
}
