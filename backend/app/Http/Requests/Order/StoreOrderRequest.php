<?php

declare(strict_types=1);

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_id' => 'required|exists:customers,id',
            'order_type' => 'required|string|in:single,subscription,guest,corporate',
            'subscription_id' => 'nullable|exists:customer_subscriptions,id',
            'kitchen_id' => 'nullable|exists:kitchens,id',
            'address_id' => 'nullable|exists:customer_addresses,id',
            'delivery_date' => 'required|date',
            'meal_id' => 'nullable|exists:meals,id',
            'quantity' => 'required|integer|min:1',
            'unit_price' => 'nullable|numeric',
            'payment_method' => 'nullable|string',
            'delivery_slot' => 'nullable|string',
            'notes' => 'nullable|string',
            'items' => 'nullable|array',
            'items.*.meal_id' => 'required_with:items|exists:meals,id',
            'items.*.quantity' => 'required_with:items|integer|min:1',
        ];
    }
}
