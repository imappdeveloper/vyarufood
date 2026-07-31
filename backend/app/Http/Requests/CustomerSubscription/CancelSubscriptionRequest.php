<?php

declare(strict_types=1);

namespace App\Http\Requests\CustomerSubscription;

use Illuminate\Foundation\Http\FormRequest;

class CancelSubscriptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'subscription_id' => 'required|exists:customer_subscriptions,id',
            'reason' => 'required|string|max:500',
            'process_refund' => 'nullable|boolean',
            'remarks' => 'nullable|string|max:1000',
        ];
    }
}
