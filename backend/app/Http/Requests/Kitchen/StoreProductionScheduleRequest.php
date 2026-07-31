<?php

declare(strict_types=1);

namespace App\Http\Requests\Kitchen;

use App\Support\BaseRequest;

class StoreProductionScheduleRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'kitchen_id' => ['required', 'integer', 'exists:kitchens,id'],
            'production_date' => ['required', 'date'],
            'meal_type' => ['required', 'string', 'in:breakfast,lunch,dinner,healthy_meal,snack'],
            'planned_quantity' => ['sometimes', 'integer', 'min:0'],
            'produced_quantity' => ['sometimes', 'integer', 'min:0'],
            'production_start' => ['nullable', 'date'],
            'production_end' => ['nullable', 'date', 'after_or_equal:production_start'],
            'status' => ['sometimes', 'string', 'in:planned,in_progress,completed,cancelled'],
            'remarks' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function attributes(): array
    {
        return [
            'kitchen_id' => 'Kitchen',
            'production_date' => 'Production Date',
            'meal_type' => 'Meal Type',
            'planned_quantity' => 'Planned Quantity',
            'produced_quantity' => 'Produced Quantity',
            'production_start' => 'Production Start',
            'production_end' => 'Production End',
            'status' => 'Status',
            'remarks' => 'Remarks',
        ];
    }
}
