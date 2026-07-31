<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use App\Traits\HasAuditFields;
use App\Traits\Filterable;
use App\Enums\StatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Meal extends Model
{
    use HasFactory, HasUuid, HasAuditFields, Filterable, SoftDeletes;

    protected $fillable = [
        'uuid', 'meal_code', 'category_id', 'meal_type_id', 'kitchen_id',
        'name', 'slug', 'short_description', 'description',
        'ingredients', 'allergens', 'spice_level',
        'serving_size', 'unit',
        'meal_image', 'thumbnail', 'gallery',
        'barcode', 'sku', 'hsn_code',
        'preparation_time',
        'calories', 'protein', 'carbohydrates', 'fat', 'fiber', 'sugar', 'sodium',
        'price', 'offer_price', 'cost_price', 'tax_percentage',
        'display_order', 'availability_type', 'availability_slots',
        'is_featured', 'is_recommended', 'is_new', 'is_bestseller',
        'is_customizable', 'requires_preparation',
        'average_rating', 'reviews_count',
        'status', 'remarks',
        'created_by', 'updated_by', 'deleted_by',
    ];

    protected function casts(): array
    {
        return [
            'ingredients' => 'array',
            'allergens' => 'array',
            'gallery' => 'array',
            'availability_slots' => 'array',
            'spice_level' => 'integer',
            'preparation_time' => 'integer',
            'calories' => 'decimal:2',
            'protein' => 'decimal:2',
            'carbohydrates' => 'decimal:2',
            'fat' => 'decimal:2',
            'fiber' => 'decimal:2',
            'sugar' => 'decimal:2',
            'sodium' => 'decimal:2',
            'price' => 'decimal:2',
            'offer_price' => 'decimal:2',
            'cost_price' => 'decimal:2',
            'tax_percentage' => 'decimal:2',
            'average_rating' => 'decimal:2',
            'reviews_count' => 'integer',
            'display_order' => 'integer',
            'is_featured' => 'boolean',
            'is_recommended' => 'boolean',
            'is_new' => 'boolean',
            'is_bestseller' => 'boolean',
            'is_customizable' => 'boolean',
            'requires_preparation' => 'boolean',
            'status' => StatusEnum::class,
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    public function getEffectivePriceAttribute(): string
    {
        if ($this->offer_price !== null && (float) $this->offer_price > 0 && (float) $this->offer_price < (float) $this->price) {
            return $this->offer_price;
        }

        return $this->price;
    }

    public function getSpiceLevelLabelAttribute(): string
    {
        return match ($this->spice_level) {
            0 => 'None',
            1 => 'Mild',
            2 => 'Medium',
            3 => 'Hot',
            4 => 'Very Hot',
            default => 'Unknown',
        };
    }

    public function getAvailabilityTypeLabelAttribute(): string
    {
        return ucfirst(str_replace('_', ' ', $this->availability_type));
    }

    public function getDiscountPercentageAttribute(): float|null
    {
        if (! $this->offer_price || $this->price <= 0) {
            return null;
        }

        return (float) round((($this->price - $this->offer_price) / $this->price) * 100, 1);
    }

    public function scopeActive($query)
    {
        return $query->where('status', StatusEnum::Active);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeRecommended($query)
    {
        return $query->where('is_recommended', true);
    }

    public function scopeBestseller($query)
    {
        return $query->where('is_bestseller', true);
    }

    public function scopeNew($query)
    {
        return $query->where('is_new', true);
    }

    public function scopeForAvailability($query, string $availability)
    {
        return $query->where('availability_type', $availability)
            ->orWhere('availability_type', 'all_day');
    }

    public function scopeInPriceRange($query, ?float $min, ?float $max)
    {
        if ($min !== null) {
            $query->where('price', '>=', $min);
        }

        if ($max !== null) {
            $query->where('price', '<=', $max);
        }

        return $query;
    }

    public function scopeSearch($query, ?string $search)
    {
        if (! $search) {
            return $query;
        }

        return $query->where(function ($q) use ($search) {
            $q->where('name', 'LIKE', "%{$search}%")
              ->orWhere('meal_code', 'LIKE', "%{$search}%")
              ->orWhere('sku', 'LIKE', "%{$search}%")
              ->orWhere('slug', 'LIKE', "%{$search}%");
        });
    }

    public function category()
    {
        return $this->belongsTo(MealCategory::class, 'category_id');
    }

    public function mealType()
    {
        return $this->belongsTo(MealType::class, 'meal_type_id');
    }

    public function kitchen()
    {
        return $this->belongsTo(Kitchen::class, 'kitchen_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function approvedReviews()
    {
        return $this->hasMany(Review::class)->where('status', 'approved');
    }

    public function createdBy()
    {
        return $this->belongsTo(\App\Models\Auth\Admin::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(\App\Models\Auth\Admin::class, 'updated_by');
    }

    public function hasDiscount(): bool
    {
        return $this->offer_price !== null && (float) $this->offer_price < (float) $this->price;
    }

    public function getGalleryUrlsAttribute(): array
    {
        return $this->gallery ?? [];
    }
}
