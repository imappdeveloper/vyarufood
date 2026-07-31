<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use App\Traits\HasAuditFields;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Review extends Model
{
    use HasFactory, HasUuid, HasAuditFields, SoftDeletes;

    protected $fillable = [
        'uuid', 'customer_id', 'meal_id', 'order_id',
        'rating', 'title', 'comment', 'photo',
        'status', 'is_verified_purchase',
        'admin_response', 'admin_responded_at', 'admin_responded_by',
        'reviewed_by', 'rejection_reason', 'is_featured',
        'created_by', 'updated_by', 'deleted_by',
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'integer',
            'is_verified_purchase' => 'boolean',
            'is_featured' => 'boolean',
            'admin_responded_at' => 'datetime',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    protected function statusLabel(): Attribute
    {
        return Attribute::get(fn () => match ($this->status) {
            'approved' => 'Approved',
            'pending' => 'Pending',
            'rejected' => 'Rejected',
            'hidden' => 'Hidden',
            default => ucfirst($this->status),
        });
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeForMeal($query, int $mealId)
    {
        return $query->where('meal_id', $mealId);
    }

    public function scopeForCustomer($query, int $customerId)
    {
        return $query->where('customer_id', $customerId);
    }

    public function scopeVerified($query)
    {
        return $query->where('is_verified_purchase', true);
    }

    public function scopePublic($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeWithPhotos($query)
    {
        return $query->whereNotNull('photo')->where('photo', '!=', '');
    }

    public function scopeByRating($query, int $rating)
    {
        return $query->where('rating', $rating);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function meal(): BelongsTo
    {
        return $this->belongsTo(Meal::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function adminRespondedBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Auth\Admin::class, 'admin_responded_by');
    }

    public static function boot(): void
    {
        parent::boot();

        static::created(function (Review $review) {
            self::updateMealRating((int) $review->meal_id);
        });

        static::updated(function (Review $review) {
            self::updateMealRating((int) $review->meal_id);
        });

        static::deleted(function (Review $review) {
            self::updateMealRating((int) $review->meal_id);
        });

        static::restored(function (Review $review) {
            self::updateMealRating((int) $review->meal_id);
        });
    }

    private static function updateMealRating(int $mealId): void
    {
        $stats = static::where('meal_id', $mealId)
            ->where('status', 'approved')
            ->selectRaw('AVG(rating) as avg_rating, COUNT(*) as review_count')
            ->first();

        Meal::where('id', $mealId)->update([
            'average_rating' => round((float) ($stats->avg_rating ?? 0), 2),
            'reviews_count' => (int) ($stats->review_count ?? 0),
        ]);
    }
}
