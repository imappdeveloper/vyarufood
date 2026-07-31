<?php

declare(strict_types=1);

namespace App\Http\Requests\Recipe;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRecipeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $recipeId = $this->route('uuid');

        return [
            'recipe_code' => 'sometimes|string|max:50|unique:recipes,recipe_code,' . $recipeId . ',uuid',
            'meal_id' => 'sometimes|exists:meals,id',
            'recipe_name' => 'sometimes|string|max:200',
            'yield_quantity' => 'sometimes|numeric|min:0.01',
            'yield_unit' => 'sometimes|string|max:50',
            'preparation_time' => 'nullable|integer|min:0',
            'cooking_time' => 'nullable|integer|min:0',
            'serving_size' => 'sometimes|integer|min:1',
            'status' => 'nullable|in:draft,active,inactive,archived',
            'remarks' => 'nullable|string|max:1000',
            'items' => 'sometimes|array|min:1',
            'items.*.inventory_item_id' => 'required|exists:inventory_items,id',
            'items.*.unit_id' => 'required|exists:units,id',
            'items.*.required_quantity' => 'required|numeric|min:0.01',
            'items.*.wastage_percentage' => 'nullable|numeric|between:0,100',
            'items.*.display_order' => 'nullable|integer|min:0',
            'items.*.remarks' => 'nullable|string|max:500',
        ];
    }
}
