<?php

declare(strict_types=1);

namespace App\Http\Requests\Kitchen;

use App\Support\BaseRequest;

class StoreKitchenCapacityRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'kitchen_id' => ['required', 'integer', 'exists:kitchens,id'],
            'capacity_date' => ['required', 'date'],
            'breakfast_capacity' => ['sometimes', 'integer', 'min:0'],
            'lunch_capacity' => ['sometimes', 'integer', 'min:0'],
            'dinner_capacity' => ['sometimes', 'integer', 'min:0'],
            'healthy_meal_capacity' => ['sometimes', 'integer', 'min:0'],
            'snack_capacity' => ['sometimes', 'integer', 'min:0'],
            'maximum_orders' => ['sometimes', 'integer', 'min:0'],
            'reserved_orders' => ['sometimes', 'integer', 'min:0'],
            'status' => ['sometimes', 'string', 'in:active,inactive'],
        ];
    }

    public function attributes(): array
    {
        return [
            'kitchen_id' => 'Kitchen',
            'capacity_date' => 'Capacity Date',
            'breakfast_capacity' => 'Breakfast Capacity',
            'lunch_capacity' => 'Lunch Capacity',
            'dinner_capacity' => 'Dinner Capacity',
            'healthy_meal_capacity' => 'Healthy Meal Capacity',
            'snack_capacity' => 'Snack Capacity',
            'maximum_orders' => 'Maximum Orders',
            'reserved_orders' => 'Reserved Orders',
            'status' => 'Status',
        ];
    }
}
