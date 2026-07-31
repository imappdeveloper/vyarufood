<?php

declare(strict_types=1);

namespace App\Http\Requests\ProductionBatch;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBatchItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:production_batch_items,id',
            'items.*.prepared_quantity' => 'nullable|integer|min:0',
            'items.*.packed_quantity' => 'nullable|integer|min:0',
            'items.*.wastage_quantity' => 'nullable|integer|min:0',
            'items.*.status' => 'nullable|string|in:pending,cooking,prepared,packing,packed,cancelled',
            'items.*.remarks' => 'nullable|string|max:500',
        ];
    }
}
