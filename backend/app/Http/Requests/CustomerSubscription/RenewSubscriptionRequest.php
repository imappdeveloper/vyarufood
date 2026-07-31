<?php

declare(strict_types=1);

namespace App\Http\Requests\CustomerSubscription;

use Illuminate\Foundation\Http\FormRequest;

class RenewSubscriptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'subscription_id' => 'required|exists:customer_subscriptions,id',
            'plan_id' => 'nullable|exists:subscription_plans,id',
            'reason' => 'nullable|string|max:500',
            'remarks' => 'nullable|string|max:1000',
        ];
    }
}
