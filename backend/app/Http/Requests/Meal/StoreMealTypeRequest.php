<?php

declare(strict_types=1);

namespace App\Http\Requests\Meal;

use App\Support\BaseRequest;

class StoreMealTypeRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'type_code' => ['required', 'string', 'max:50', 'unique:meal_types,type_code'],
            'name' => ['required', 'string', 'max:255', 'unique:meal_types,name'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:meal_types,slug'],
            'description' => ['nullable', 'string', 'max:1000'],
            'display_order' => ['nullable', 'integer', 'min:0'],
            'icon' => ['nullable', 'string', 'max:100'],
            'image' => ['nullable', 'string', 'max:500'],
            'color_code' => ['nullable', 'string', 'max:20'],
            'status' => ['required', 'string', 'in:active,inactive'],
            'is_default' => ['sometimes', 'boolean'],
            'remarks' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function attributes(): array
    {
        return [
            'type_code' => 'Type Code',
            'name' => 'Type Name',
            'slug' => 'Slug',
            'description' => 'Description',
            'display_order' => 'Display Order',
            'icon' => 'Icon',
            'image' => 'Image',
            'color_code' => 'Color Code',
            'status' => 'Status',
            'is_default' => 'Default Type',
            'remarks' => 'Remarks',
        ];
    }
}
