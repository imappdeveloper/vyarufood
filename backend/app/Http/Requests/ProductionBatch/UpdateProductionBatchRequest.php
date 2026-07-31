<?php

declare(strict_types=1);

namespace App\Http\Requests\ProductionBatch;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductionBatchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'batch_name' => 'sometimes|string|max:150',
            'production_date' => 'sometimes|date',
            'kitchen_id' => 'sometimes|exists:kitchens,id',
            'batch_type' => 'sometimes|string|in:regular,special,bulk,emergency',
            'planned_start_time' => 'nullable|date_format:H:i',
            'planned_end_time' => 'nullable|date_format:H:i',
            'remarks' => 'nullable|string|max:1000',
        ];
    }
}
