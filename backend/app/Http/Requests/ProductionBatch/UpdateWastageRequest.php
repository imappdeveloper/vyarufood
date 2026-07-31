<?php

declare(strict_types=1);

namespace App\Http\Requests\ProductionBatch;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWastageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'wastage_quantity' => 'required|integer|min:0',
            'reason' => 'nullable|string|max:500',
        ];
    }
}
