<?php

declare(strict_types=1);

namespace App\Http\Requests\Recipe;

use Illuminate\Foundation\Http\FormRequest;

class StoreRecipeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'recipe_code' => 'required|string|max:50|unique:recipes,recipe_code',
            'meal_id' => 'required|exists:meals,id',
            'recipe_name' => 'required|string|max:200',
            'yield_quantity' => 'required|numeric|min:0.01',
            'yield_unit' => 'required|string|max:50',
            'preparation_time' => 'nullable|integer|min:0',
            'cooking_time' => 'nullable|integer|min:0',
            'serving_size' => 'required|integer|min:1',
            'status' => 'nullable|in:draft,active,inactive',
            'remarks' => 'nullable|string|max:1000',
            'items' => 'required|array|min:1',
            'items.*.inventory_item_id' => 'required|exists:inventory_items,id',
            'items.*.unit_id' => 'required|exists:units,id',
            'items.*.required_quantity' => 'required|numeric|min:0.01',
            'items.*.wastage_percentage' => 'nullable|numeric|between:0,100',
            'items.*.display_order' => 'nullable|integer|min:0',
            'items.*.remarks' => 'nullable|string|max:500',
        ];
    }
}
