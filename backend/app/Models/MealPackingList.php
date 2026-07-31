<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\{Model, Relations\BelongsTo};

class MealPackingList extends Model
{
    use HasUuid;

    protected $table = 'meal_packing_lists';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $fillable = [
        'uuid', 'production_batch_id', 'order_id', 'customer_id', 'meal_id',
        'quantity', 'packing_status', 'packed_at', 'packed_by',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'packed_at' => 'datetime',
        ];
    }

    public function batch(): BelongsTo { return $this->belongsTo(ProductionBatch::class, 'production_batch_id'); }
    public function order(): BelongsTo { return $this->belongsTo(Order::class); }
    public function customer(): BelongsTo { return $this->belongsTo(Customer::class); }
    public function meal(): BelongsTo { return $this->belongsTo(Meal::class); }
}
