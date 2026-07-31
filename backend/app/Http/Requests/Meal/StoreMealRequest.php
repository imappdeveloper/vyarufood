<?php

declare(strict_types=1);

namespace App\Http\Requests\Meal;

use App\Support\BaseRequest;

class StoreMealRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'meal_code' => ['required', 'string', 'max:50', 'unique:meals,meal_code'],
            'category_id' => ['required', 'integer', 'exists:meal_categories,id'],
            'meal_type_id' => ['required', 'integer', 'exists:meal_types,id'],
            'kitchen_id' => ['required', 'integer', 'exists:kitchens,id'],
            'name' => ['required', 'string', 'max:255', 'unique:meals,name'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:meals,slug'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string', 'max:10000'],
            'ingredients' => ['nullable', 'array'],
            'ingredients.*' => ['string', 'max:255'],
            'allergens' => ['nullable', 'array'],
            'allergens.*' => ['string', 'max:255'],
            'spice_level' => ['nullable', 'integer', 'in:0,1,2,3,4'],
            'serving_size' => ['nullable', 'string', 'max:50'],
            'unit' => ['nullable', 'string', 'max:50'],
            'barcode' => ['nullable', 'string', 'max:100'],
            'sku' => ['nullable', 'string', 'max:100', 'unique:meals,sku'],
            'hsn_code' => ['nullable', 'string', 'max:20'],
            'preparation_time' => ['nullable', 'integer', 'min:0'],
            'calories' => ['nullable', 'numeric', 'min:0'],
            'protein' => ['nullable', 'numeric', 'min:0'],
            'carbohydrates' => ['nullable', 'numeric', 'min:0'],
            'fat' => ['nullable', 'numeric', 'min:0'],
            'fiber' => ['nullable', 'numeric', 'min:0'],
            'sugar' => ['nullable', 'numeric', 'min:0'],
            'sodium' => ['nullable', 'numeric', 'min:0'],
            'price' => ['required', 'numeric', 'min:0'],
            'offer_price' => ['nullable', 'numeric', 'min:0', 'lte:price'],
            'cost_price' => ['nullable', 'numeric', 'min:0', 'lte:price'],
            'tax_percentage' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'display_order' => ['nullable', 'integer', 'min:0'],
            'availability_type' => ['required', 'string', 'in:breakfast,lunch,dinner,snacks,special,festival,all_day,custom'],
            'availability_slots' => ['nullable', 'array'],
            'availability_slots.*' => ['string', 'in:breakfast,lunch,dinner,snacks'],
            'is_featured' => ['sometimes', 'boolean'],
            'is_recommended' => ['sometimes', 'boolean'],
            'is_new' => ['sometimes', 'boolean'],
            'is_bestseller' => ['sometimes', 'boolean'],
            'is_customizable' => ['sometimes', 'boolean'],
            'requires_preparation' => ['sometimes', 'boolean'],
            'status' => ['required', 'string', 'in:active,inactive'],
            'remarks' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function attributes(): array
    {
        return [
            'meal_code' => 'Meal Code',
            'category_id' => 'Category',
            'meal_type_id' => 'Meal Type',
            'kitchen_id' => 'Kitchen',
            'name' => 'Meal Name',
            'slug' => 'Slug',
            'short_description' => 'Short Description',
            'description' => 'Description',
            'ingredients' => 'Ingredients',
            'allergens' => 'Allergens',
            'spice_level' => 'Spice Level',
            'serving_size' => 'Serving Size',
            'unit' => 'Unit',
            'barcode' => 'Barcode',
            'sku' => 'SKU',
            'hsn_code' => 'HSN Code',
            'preparation_time' => 'Preparation Time',
            'calories' => 'Calories',
            'protein' => 'Protein',
            'carbohydrates' => 'Carbohydrates',
            'fat' => 'Fat',
            'fiber' => 'Fiber',
            'sugar' => 'Sugar',
            'sodium' => 'Sodium',
            'price' => 'Price',
            'offer_price' => 'Offer Price',
            'cost_price' => 'Cost Price',
            'tax_percentage' => 'Tax Percentage',
            'display_order' => 'Display Order',
            'availability_type' => 'Availability Type',
            'availability_slots' => 'Availability Slots',
            'is_featured' => 'Featured',
            'is_recommended' => 'Recommended',
            'is_new' => 'New',
            'is_bestseller' => 'Bestseller',
            'is_customizable' => 'Customizable',
            'requires_preparation' => 'Requires Preparation',
            'status' => 'Status',
            'remarks' => 'Remarks',
        ];
    }
}
