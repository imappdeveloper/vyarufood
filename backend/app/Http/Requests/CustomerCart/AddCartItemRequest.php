<?php

declare(strict_types=1);

namespace App\Http\Requests\CustomerCart;

use Illuminate\Foundation\Http\FormRequest;

class AddCartItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'meal_id' => 'required|integer|exists:meals,id',
            'quantity' => 'required|integer|min:1|max:50',
            'special_instructions' => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'meal_id.required' => 'Meal is required.',
            'meal_id.exists' => 'Selected meal does not exist.',
            'quantity.required' => 'Quantity is required.',
            'quantity.min' => 'Quantity must be at least 1.',
            'quantity.max' => 'Maximum 50 items per meal.',
        ];
    }
}
