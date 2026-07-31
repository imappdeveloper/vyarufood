<?php

declare(strict_types=1);

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'delivery_date' => 'sometimes|date',
            'address_id' => 'sometimes|nullable|exists:customer_addresses,id',
            'delivery_slot' => 'sometimes|nullable|string',
            'notes' => 'sometimes|nullable|string',
        ];
    }
}
