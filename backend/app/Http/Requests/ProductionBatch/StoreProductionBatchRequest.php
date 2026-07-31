<?php

declare(strict_types=1);

namespace App\Http\Requests\ProductionBatch;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductionBatchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'production_date' => 'required|date',
            'kitchen_id' => 'required|exists:kitchens,id',
            'batch_name' => 'required|string|max:150',
            'batch_type' => 'nullable|string|in:regular,special,bulk,emergency',
            'planned_start_time' => 'nullable|date_format:H:i',
            'planned_end_time' => 'nullable|date_format:H:i|after:planned_start_time',
            'remarks' => 'nullable|string|max:1000',
        ];
    }
}
