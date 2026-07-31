<?php

declare(strict_types=1);

namespace App\Http\Requests\Expense;

use Illuminate\Foundation\Http\FormRequest;

class UpdateExpenseCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $categoryId = $this->route('uuid');

        return [
            'category_name' => 'sometimes|required|string|max:200',
            'parent_category_id' => 'nullable|integer|exists:expense_categories,id',
            'icon' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:20',
            'is_recurring' => 'boolean',
            'is_taxable' => 'boolean',
            'status' => 'string|in:active,inactive',
            'display_order' => 'integer|min:0',
            'remarks' => 'nullable|string|max:1000',
        ];
    }
}
