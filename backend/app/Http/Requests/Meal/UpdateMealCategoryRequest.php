<?php

declare(strict_types=1);

namespace App\Http\Requests\Meal;

use App\Support\BaseRequest;

class UpdateMealCategoryRequest extends BaseRequest
{
    public function rules(): array
    {
        $mealCategoryId = $this->route('mealCategory')?->id;

        return [
            'category_code' => ['sometimes', 'string', 'max:50', 'unique:meal_categories,category_code,' . $mealCategoryId],
            'name' => ['sometimes', 'string', 'max:255', 'unique:meal_categories,name,' . $mealCategoryId],
            'slug' => ['sometimes', 'string', 'max:255', 'unique:meal_categories,slug,' . $mealCategoryId],
            'description' => ['nullable', 'string', 'max:1000'],
            'display_order' => ['nullable', 'integer', 'min:0'],
            'icon' => ['nullable', 'string', 'max:100'],
            'image' => ['nullable', 'string', 'max:500'],
            'color_code' => ['nullable', 'string', 'max:20'],
            'status' => ['sometimes', 'string', 'in:active,inactive'],
            'is_default' => ['sometimes', 'boolean'],
            'remarks' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function attributes(): array
    {
        return [
            'category_code' => 'Category Code',
            'name' => 'Category Name',
            'slug' => 'Slug',
            'description' => 'Description',
            'display_order' => 'Display Order',
            'icon' => 'Icon',
            'image' => 'Image',
            'color_code' => 'Color Code',
            'status' => 'Status',
            'is_default' => 'Default Category',
            'remarks' => 'Remarks',
        ];
    }
}
