<?php

declare(strict_types=1);

namespace App\Http\Requests\CustomerSubscription;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCustomerSubscriptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after:start_date',
            'billing_cycle' => 'sometimes|string|in:one_time,weekly,monthly,quarterly,yearly',
            'auto_renew' => 'sometimes|boolean',
            'payment_status' => 'sometimes|string|in:pending,paid,failed,refunded,partial_refund',
            'remarks' => 'nullable|string|max:1000',
        ];
    }
}
