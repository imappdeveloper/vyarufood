<?php

declare(strict_types=1);

namespace App\Http\Requests\Checkout;

use Illuminate\Foundation\Http\FormRequest;

class PlaceOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $today = now()->toDateString();

        return [
            'address_id' => 'required|integer|exists:customer_addresses,id',
            'delivery_date' => 'required|date|after_or_equal:' . $today,
            'delivery_slot' => 'nullable|string|max:50',
            'delivery_instruction' => 'nullable|string|max:500',
            'payment_method' => 'required|string|in:upi,card,net_banking,wallet,cod',
            'notes' => 'nullable|string|max:1000',
            'first_name' => 'nullable|string|max:100',
            'last_name' => 'nullable|string|max:100',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
        ];
    }

    public function messages(): array
    {
        return [
            'address_id.required' => 'Please select a delivery address.',
            'address_id.exists' => 'Selected address is invalid.',
            'delivery_date.required' => 'Please select a delivery date.',
            'delivery_date.after_or_equal' => 'Delivery date must be today or later.',
            'payment_method.required' => 'Please select a payment method.',
            'payment_method.in' => 'Selected payment method is not supported.',
        ];
    }
}
